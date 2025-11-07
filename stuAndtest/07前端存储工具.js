// 前端存储的数据无论是临时(session)的还是永久的(local)，都是可以设计过期时间的
// 但是前端保存的数据应当是无关紧要的数据，同时随着用随删除，比如 如果前端保存了token，保质期为7天，这是不行的，因为前端（客户端）所有的都是可以改的，应当是后端使用jwt加密和保质期，后端解析才行

/**
 * 设置带过期时间的本地存储
 * @param {*} key 存储键名
 * @param {*} value 存储值（任意类型，支持json序列化）
 * @param {*} expireSeconds 过期时间（秒） 0表示永不过期
 * @param {*} type 存储类型 local / session
 */
export function setExpireStorage(
  key,
  value,
  expireSeconds = 0,
  type = "local"
) {
  const storage = type === "local" ? localStorage : sessionStorage;
  const data = {
    value, // 值
    expireSeconds: expireSeconds > 0 ? new Date() + expireSeconds * 1000 : 0, // 过期时间，单位秒，0即永久
  };
  // 根据键值对在本地进行存储，记得JSON序列化data数据
  storage.setItem(key, JSON.stringify(data));
}

/**
 * 读取带过期时间的本地存储
 * @param {*} key 键
 * @param {*} type 存储类型
 */
export function getExpireStorage(key, type = "local") {
  const storage = type === "local" ? localStorage : sessionStorage;
  const storedStr = storage.getItem(key);

  try {
    // 1.无存储数据
    if (!storedStr) return null;
    // 解析JSON数据
    const storedData = JSON.parse(storedStr);
    const { value, expireTime } = storedData;
    // 校验过期行为
    if (expireTime === 0 || Date.now() < expireTime) {
      return value;
    } else {
      storage.removeItem(key); // 过期即删除
      return null;
    }
  } catch (error) {
    // 数据异常，删除数据
    storage.removeItem(key);
    console.error("读取数据失败", error);
    return null;
  }
}
