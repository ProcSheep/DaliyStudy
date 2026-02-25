const { createClient } = require("redis");

async function redisDemo() {
  // 1. 连接 Redis
  const client = createClient({
    url: "redis://127.0.0.1:6379",
  });
  await client.connect();

  // 2. 执行命令
  await client.set("fruit", "apple");
  const fruit = await client.get("fruit");
  console.log(fruit); // 输出：apple

  // 3. 关闭连接
  client.destroy();
}
redisDemo();
