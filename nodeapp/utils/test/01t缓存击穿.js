const { redisClient, Admin } = require("../rs");

async function getUserInfo(username) {
  const cacheKey = `info:${username}`;
  const lockKey = `lock:${username}`;

  // 查看缓存中有没有
  const cacheData = await redisClient.get(cacheKey);

  // 缓存中有
  if (cacheData) {
    if (cacheData === "null") {
      return { success: false, msg: "数据库没有这个数据" };
    }

    return {
      success: true,
      msg: "缓存中有数据",
      cacheData: JSON.parse(cacheData),
    };
  }

  // 抢到锁 'OK' / 抢不到 null
  const result = await redisClient.set(lockKey, "001", {
    condition: "NX", // Not Exist，互斥，只能存在一个
    expiration: { type: "EX", value: 5 },
  });

  // 没抢到 = 等待200ms继续
  if (!result) {
    console.log("此请求未抢到锁，等待200ms");
    await new Promise((r) => setTimeout(r, 200));
    return getUserInfo(username);
  }

  // 抢到 = 数据库查询 + 缓存 + 释放
  if (result) {
    try {
      const data = await Admin.find({ username });
      console.log("data", data);
      if (data.length > 0) {
        // setEx在最新版本中不推荐，可用set代替
        await redisClient.setEx(cacheKey, 300, JSON.stringify(data));
        return { success: true, msg: "缓存成功", cacheData: data };
      } else {
        // 查不到也缓存一个短期的null数据，防止后面的请求重复请求数据库，造成缓存击穿
        await redisClient.set(cacheKey, "null", {
          expiration: { type: "EX", value: 10 }, // 10
        });
        return { success: false, msg: "数据库没有这个数据，已缓存为null" };
      }
    } catch (error) {
      return { success: false, msg: "出现错误", error };
    } finally {
      if (result) {
        await redisClient
          .del(lockKey)
          .catch((e) => console.error("释放锁失败：", e));
      }
    }
  }
}

async function test(username) {
  const promises = Array.from({ length: 5 }, () => getUserInfo(username));
  const results = await Promise.all(promises);
  console.log("并发结果", results);
}

// test("liuhanjie");
test("tet");

/**
 * 
 * 
 * doubao
const { redisClient, Admin } = require("../rs");
async function getUserInfo(username) {
  const cacheKey = `info:${username}`;
  const lockKey = `lock:${username}`;

  // 第一步：优先查缓存（核心：无论有没有数据，都先查这个缓存key）
  const cacheData = await redisClient.get(cacheKey);
  if (cacheData) {
    if (cacheData === "null") {
      return { success: false, msg: "数据库没有这个数据" };
    }
    return {
      success: true,
      msg: "缓存中有数据",
      cacheData: JSON.parse(cacheData),
    };
  }

  // 第二步：抢锁（NX = 不存在则创建，EX = 过期时间秒）
  const result = await redisClient.set(lockKey, "001", {
    condition: "NX",
    expiration: { type: "EX", value: 5 }, // 锁5秒过期，防止死锁
  });

  // 第三步：没抢到锁，等待后递归重试（重试时会重新走第一步查缓存）
  if (!result) {
    console.log(`[${username}] 未抢到锁，等待200ms重试`);
    await new Promise((r) => setTimeout(r, 200));
    return getUserInfo(username); // 递归后会重新查缓存，此时如果缓存了null就会命中
  }

  // 第四步：抢到锁，查数据库 + 缓存结果（核心修复：缓存到cacheKey）
  let releaseLockSuccess = false;
  try {
    const data = await Admin.find({ username });
    console.log(`[${username}] 数据库查询结果：`, data);
    
    if (data.length > 0) {
      // 有数据：缓存有效数据，过期时间300秒
      await redisClient.set(cacheKey, JSON.stringify(data), {
        expiration: { type: "EX", value: 300 },
      });
      return { success: true, msg: "缓存成功", cacheData: data };
    } else {
      // 无数据：缓存null值到cacheKey，短期过期（10秒），防止缓存击穿
      await redisClient.set(cacheKey, "null", { // 修复：缓存到cacheKey而非lockKey
        expiration: { type: "EX", value: 10 },
      });
      return { success: false, msg: "数据库没有这个数据，已缓存为null" };
    }
  } catch (error) {
    console.error(`[${username}] 查询/缓存失败：`, error);
    return { success: false, msg: "出现错误", error };
  } finally {
    // 确保锁一定会释放（即使报错），但要判断是否真的抢到了锁
    if (result && !releaseLockSuccess) {
      await redisClient.del(lockKey).catch((e) => {
        console.error(`[${username}] 释放锁失败：`, e);
      });
    }
  }
}

async function test(username) {
  const promises = Array.from({ length: 5 }, () => getUserInfo(username));
  const results = await Promise.all(promises);
  console.log("并发结果", results);
}

// test("liuhanjie");
test("tet");
 */
