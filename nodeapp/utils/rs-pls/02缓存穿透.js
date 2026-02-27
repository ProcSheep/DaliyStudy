/**
 * 用户请求一个根本不存在的数据（比如商品 ID=-1、用户 ID=999999），缓存里没有，每次请求都穿透到数据库，数据库也查不到，最终导致大量无效请求打满数据库
 *
 * 解决：校验不合法的查询请求
 */
const { redisClient, Admin } = require("../rs");

async function iptAge(age) {
  if (!age || isNaN(age) || age < 0) {
    return { code: 400, msg: "参数不合法" };
  }

  const cacheKey = `product:${age}`;
  const cacheData = await redisClient.get(cacheKey);

  if (cacheData) {
    if (cacheData === "null") {
      return { code: 404, msg: "商品不存在" };
    }
    return {
      code: 200,
      msg: "从缓存中获取数据成功",
      data: JSON.parse(cacheData),
    };
  }

  /// 无缓存，查数据库
  console.log("缓存未命中，查询数据库");
  const data = await Admin.find({ age });
  if (!data) {
    // 没有数据缓存一个短期"null"
    await redisClient.setEx(cacheKey, 10, "null");
    return { code: 404, msg: "商品不存在" };
  } else {
    await redisClient.setEx(cacheKey, 600, JSON.stringify(data));
    return { code: 200, msg: "获取数据成，已存入缓存", data };
  }
}

// 重复测试 redis-cli 删除指令 DEL key/[...keys]
async function test() {
  console.log(await iptAge(23));
  console.log(await iptAge(23));
  console.log(await iptAge(23));
  process.exit(0);
}

test();
