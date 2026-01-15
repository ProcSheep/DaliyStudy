// get的query传参拼接到url中，但是特殊符号比如空格，/，+等会导致数据错误
// 1.对空格，字符等进行安全编码
const encodeKey = encodeURIComponent(this.key);
console.log("encodeKey", encodeKey);

const response = await axios.get(
  `${baseUrl}/getOrDelKey?key=${encodeKey}&isDel=false`
);

// 2.同时在数据库中查询时,也需要对特殊转义字符处理，使用'\'
async function getkey(key) {
  // 对于特殊正则转义字符处理（包含 +、/、.、*、? 等）
  // 正则特殊字符：^ $ \ . * + ? | ( ) [ ] { } /
  const escapedKey = key.replace(/[\\^$.*+?|()[\]{}//]/g, "\\$&");
  // 模糊匹配 + 忽略大小写
  const regex = new RegExp(`.*${escapedKey}.*`, "i");
  return await Translation.find({ key: regex });
}
