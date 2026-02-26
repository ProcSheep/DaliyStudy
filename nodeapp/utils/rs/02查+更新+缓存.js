const mongoose = require("mongoose");
const { createClient } = require("redis");
const { Schema } = mongoose;

const adminSchema = new Schema({}, { strict: false });
const Admin = mongoose.model("admin", adminSchema);

// 创建后连接
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

async function getData(page = 1, limit = 1) {
  const cacheKey = `admin:page:${page}:limit:${limit}`;
  try {
    const cacheData = await redisClient.get(cacheKey);

    console.log("cacheData", cacheData);
    if (cacheData) {
      console.log("rs has data");
      return JSON.parse(cacheData);
    }

    console.log("rs no data, mongo find");

    const skip = (page - 1) * limit;
    const data = await Admin.find().skip(skip).limit(limit).lean();

    // 缓存rs 保质期300s
    if (data) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(data));
      console.log("缓存完成");
    }
    return data;
  } catch (error) {
    console.error("查询失败:", error);
  }
}

async function update() {
  // 模拟第一条数据缓存的清理,可以写多个
  const cacheKeys = ["admin:page:1:limit:1"];

  const data = await Admin.findOneAndUpdate(
    { username: "liuhanjie" },
    { $set: { age: 23 } },
    { new: true },
  );
  console.log("update-data", data);

  await redisClient.del(cacheKeys);
  console.log("缓存已清理");
}

async function test() {
  /** 1.查+存储缓存 */
  // // 第一次查询 + 缓存
  // await getData();
  // // 重复
  // await getData();

  /** 2.更新缓存 */
  await getData(); // 查询并记录第一条数据的缓存
  await update(); // 更新第一条数据，同时删除旧的缓存
  await getData(); // 更新新缓存,可去server-cli查（get key）

  // ---
  await redisClient.destroy();
  await mongoose.disconnect();
}

test();
