const { createClient } = require("redis");
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis 连接失败:", err));
// connect
(async () => {
  await redisClient.connect();
  console.log("rs连接成功");
})();

async function checkLimit(userId, apiName, limit, expire) {
  const cacheKey = `${userId}:${apiName}`;
  // 初始为1
  const count = await redisClient.incr(cacheKey);
  // 第一次计数，定义保质期
  if (count === 1) {
    await redisClient.expire(cacheKey, expire);
  }

  if (count > limit) {
    return { success: false, msg: `${expire / 60}分钟内超出最大次数${limit}` };
  }
  return { success: true, msg: `成功，计数${count}` };
}

async function test() {
  // 用户在1分钟内只能调用3次api，防止频繁调用
  console.log(await checkLimit("user02", "getInfo", 3, 60));
  console.log(await checkLimit("user02", "getInfo", 3, 60));
  console.log(await checkLimit("user02", "getInfo", 3, 60));
  console.log(await checkLimit("user02", "getInfo", 3, 60));

  await redisClient.destroy();
}

test();
