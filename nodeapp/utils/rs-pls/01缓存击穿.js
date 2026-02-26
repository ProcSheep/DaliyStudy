/**
 * 某个高频访问的热点 Key（比如秒杀商品 ID=10086），在缓存过期的瞬间，大量请求同时涌入，直接击穿缓存打到数据库，导致数据库瞬间压力飙升,例如秒杀活动：某款秒杀商品的缓存过期，恰好此时上万用户同时抢购；热门资讯：一篇爆文的缓存过期，大量用户同时访问。
 * 
 * 方案 1：热点 Key 永不过期（简单粗暴）
    核心思路：对秒杀商品、爆文等热点 Key，不设置过期时间，由后台手动更新 / 删除缓存（比如秒杀结束后手动删除）。
   方案 2：互斥锁（分布式锁，更通用）
    核心思路：当缓存失效时，只允许一个请求去数据库查数据并重建缓存，其他请求等待锁释放后直接查缓存，避免大量请求打数据库。
 */
const { redisClient, Admin } = require("../rs");

async function getInfo(username) {
  const cacheKey = `getInfo:${username}`;
  const lockKey = `getInfo:lock:${username}`; // 分布式锁

  // 优先查询缓存
  const cacheData = await redisClient.get(cacheKey);
  if (cacheData)
    return { code: 200, data: JSON.parse(cacheData), msg: "缓存已有数据" };

  // 返回值：'OK' / null
  // 参数： 唯一标识lockKey，自定义标识1（不重要），配置参数（互斥/过期）
  const lockSuccess = await redisClient.set(lockKey, "1", {
    condition: "NX", // 当lockKey
    expiration: { type: "EX", value: 5 }, // s
  });

  // 没抢到锁，200ms递归等待
  if (!lockSuccess) {
    console.log("此请求未抢到锁，等待200ms");
    await new Promise((r) => setTimeout(r, 200));
    return getInfo(username);
  }

  // 第一个抢到锁: 数据库存储+缓存+释放锁
  try {
    const info = await Admin.find({ username });
    if (info) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(info));
    } else {
      await redisClient.setEx(cacheKey, 10, "null"); // 没有查到也缓存10s的"null"（一定要是字符串），释放后续请求查询内存，防止击穿再次查数据库
    }
    return { code: 200, data: info || null, msg: "分布式锁已存储缓存数据" };
  } catch (error) {
    await redisClient.setEx(cacheKey, 10, "null");
    return { code: 404, msg: "数据库查询错误，稍后尝试", error };
  } finally {
    // 只有抢到锁的情况下，才释放锁（避免误删其他请求的锁）
    if (lockSuccess) {
      await redisClient
        .del(lockKey)
        .catch((e) => console.error("释放锁失败：", e));
    }
  }
}

async function test() {
  // 模拟5个并发请求
  const promises = Array.from({ length: 5 }, () => getInfo("liuhanjie"));
  const results = await Promise.all(promises);
  console.log("并发请求结果：", results);
}

test();
