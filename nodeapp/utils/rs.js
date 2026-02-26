/** 连接数据库和redis */
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

module.exports = {
  redisClient,
  Admin,
};
