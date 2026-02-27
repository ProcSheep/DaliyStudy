/**
 * 某一时间段内，大量缓存 Key 同时过期（比如所有商品缓存都设置了 30 分钟过期，且都是同一时间启动的），导致大量请求瞬间打到数据库，引发数据库宕机
 *
 * 解决：过期时间加随机值，示例如下
 */

async function setProductCache(productId, productData) {
  const cacheKey = `product:id:${productId}`;
  // 基础过期时间：30分钟（1800秒）
  const baseExpire = 1800;
  // 随机值：-5分钟（-300秒）到 +5分钟（+300秒）
  // Math.random(0~1) * 600 = 0~600 (/s)
  const randomExpire = Math.floor(Math.random() * 600) - 300;
  // 最终过期时间：1800 ± 300 秒（25~35分钟）
  const finalExpire = baseExpire + randomExpire;

  // 存入缓存，过期时间带随机值
  await redisClient.setEx(cacheKey, finalExpire, JSON.stringify(productData));
}
