// stringfy 和 parse 是最简单的深拷贝功能，Stringify序列化 对象，数组，字符，布尔，数字 ok ，但是对 undefined， null , symbol, func 数据无效
// Date序列 如"createdAt":"2024-01-15T10:30:00.000Z"
const obj2 = JSON.parse(json, (key, value) => {
  // Check if value looks like an ISO date string
  // test检查一个字符串是否匹配该正则表达式的规则，返回一个布尔值（true = 匹配，false = 不匹配）
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value); // 转化为Date Object
  }
  return value;
});
