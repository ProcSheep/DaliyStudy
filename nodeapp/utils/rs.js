/** 连接数据库和redis */
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // 生成唯一值（需安装：npm i uuid）
const { createClient } = require("redis");
const { Schema } = mongoose;

const adminSchema = new Schema({}, { strict: false });
const Admin = mongoose.model("admin", adminSchema);

// 创建redis并连接connect
const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
  socket: { timeout: 5000 },
});
// Redis 连接错误处理
redisClient.on("error", (err) => console.log("Redis 连接失败:", err));
// 连接 Redis
(async () => {
  await redisClient.connect();
  console.log("Redis 连接成功");
})();
// 数据库连接
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.log("MongoDB 连接失败:", err));

// 锁工具类(获取和释放)
class RedisDistributedLock {
  // 获取分布式锁
  async getLocked(lockKey, expire = 5) {
    const uniqueVal = uuidv4();
    try {
      const lockSuccess = await redisClient.set(lockKey, uniqueVal, {
        condition: "NX",
        expiration: {
          type: "EX",
          value: expire,
        },
      });

      return lockSuccess === "OK" ? uniqueVal : null;
    } catch (error) {
      console.log("获取锁失败", error);
      return null;
    }
  }

  // 释放分布式锁 (一一对应才可以删除，防止误删；另外Lua是原子化操作，防止竞态)
  async releaseLock(lockKey, uniqueVal) {
    // 在 Redis 中执行 Lua 脚本时，KEYS 和 ARGV 是两个入参数组，用来传递外部值
    // redis.call()：Lua 脚本中调用 Redis 命令的方式（等价于在 redis-cli 中执行命令）；
    const luaScript = `
    if redis.call('get',KEYS[1]) == ARGV[1] then
      return redis.call('del',KEYS[1]) 
    else
      return 0
    end 
    `;

    try {
      const result = await redisClient.eval(luaScript, {
        keys: [lockKey], // KEYS[1] = lockKey
        arguments: [uniqueVal], // ARGV[1] = uniqueVal
      });
      // result === 1 表示释放成功 （删除）
      return result === 1;
    } catch (error) {
      console.error("释放锁失败：", err);
      return false;
    }
  }
}

module.exports = {
  redisClient,
  Admin,
  RedisDistributedLock: new RedisDistributedLock(),
};
