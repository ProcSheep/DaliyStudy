const { redisClient, Admin, RedisDistributedLock } = require("../rs");

// 模拟秒杀请求，并发对统一商品
async function seckill(productId, retryCount = 0) {
  // 限制递归次数，避免栈溢出（可根据业务调整）
  const MAX_RETRY = 10;
  if (retryCount >= MAX_RETRY) {
    return { code: 404, msg: "商品火爆，稍后尝试" };
  }

  const lockKey = `seckill:lock:${productId}`; // 保存商品信息的key
  const stockKey = `seckill:stock:${productId}`; // 缓存库存数量的key

  let uniqueVal = null;
  try {
    uniqueVal = await RedisDistributedLock.getLocked(lockKey, 5);

    // 此请求没抢到锁，延迟后重试
    if (!uniqueVal) {
      await new Promise((r) => setTimeout(r, 200));
      // 递归重试，累加重试次数
      return seckill(productId, retryCount + 1);
    }

    // 抢到了锁 购买减库存
    const currentStock = await redisClient.get(stockKey);
    if (currentStock <= 0) {
      return { code: 400, msg: "商品售罄" };
    }
    const newStock = await redisClient.DECR(stockKey);
    // ... 数据库同步减少（建议加try/catch，避免数据库报错导致锁无法释放）
    const data = await Admin.findOneAndUpdate(
      { productId },
      { $set: { stock: newStock } },
      { new: true },
    );

    const result = {
      code: 200,
      msg: "秒杀成功",
      data: { productId, remainingStock: newStock },
    };
    console.log("秒杀成功返回：", result); // 成功时打印返回对象
    return result;
  } catch (error) {
    console.error("秒杀失败：", error);
    return { code: 500, msg: "服务器异常，请稍后再试" };
  } finally {
    // 确保锁最终释放
    if (uniqueVal) {
      try {
        await RedisDistributedLock.releaseLock(lockKey, uniqueVal);
      } catch (releaseErr) {
        console.error("释放锁失败：", releaseErr);
      }
    }
  }
}

// 初始化库存（测试用，秒杀前执行一次）
async function initStock(productId, stock) {
  await redisClient.set(`seckill:stock:${productId}`, stock);
}

// 测试：模拟100个并发请求秒杀（多服务器部署时效果一致）
async function testSeckill() {
  // 初始化库存：商品10086库存5
  await initStock(10086, 5);

  // 模拟8个并发请求（修复：正确收集Promise，而非直接打印）
  const promises = Array.from({ length: 8 }, async () => {
    const res = await seckill(10086); // 等待Promise执行完成，获取实际返回对象
    console.log("单个请求返回：", res); // 打印实际返回的对象
    return res; // 将实际结果存入promises数组
  });

  // 等待所有请求完成
  const results = await Promise.all(promises);

  // 统计结果（此时results里是实际返回对象，可安全访问code）
  const successCount = results.filter((res) => res?.code === 200).length;
  const finalStock = await redisClient.get(`seckill:stock:10086`);
  console.log(`秒杀成功数：${successCount}，最终库存：${finalStock}`);
  // 预期输出：秒杀成功数：10，最终库存：0（无超卖）
}

// 执行测试（捕获全局错误）
testSeckill().catch((err) => {
  console.error("测试秒杀异常：", err);
});
