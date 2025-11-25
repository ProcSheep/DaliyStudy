const fs = require("fs");
const path = require("path");
const { customAlphabet } = require("nanoid"); // nanoid改名

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE_URL_PHOTOS = "http://192.168.0.133:8800/static/character_photos/";
const BASE_URL_AVACOV = "http://192.168.0.133:8800/static/character_avacov/";

const txtPath = path.join(__dirname, "character.txt"); // 你的TXT文件
const jsonPath = path.join(__dirname, "output.json"); // 要生成的JSON文件

// 2. 读取TXT文件内容(异步)
fs.readFile(txtPath, "utf8", (err, data) => {
  if (err) {
    console.error("读TXT文件失败：", err.message);
    return;
  }

  // 解析TXT内容，提取键值对
  const result = parseTxtToJson(data);

  // 把JSON对象写入文件（indent: 2 表示格式化JSON，可读性更强）
  fs.writeFile(jsonPath, JSON.stringify(result, null, 2), (err) => {
    if (err) {
      console.error("写JSON文件失败：", err.message);
      return;
    }
    console.log("转换成功！JSON文件已生成：", jsonPath);
  });
});

// 核心解析函数：把TXT字符串转成JSON对象
function parseTxtToJson(txtContent) {
  // 按行分割TXT内容（\n是换行符，\r是回车符，兼容Windows/Mac）
  const lines = txtContent.split(/\r?\n/).filter((line) => line.trim() !== ""); // 空行会被过滤

  // 定义要返回的JSON结构（和你给的示例JSON对应）
  const json = {
    name: "", // <- title
    personality: [],
    origin_name: "", // <- name
    gender: "male", // 示例TXT是男性，可根据实际修改
    age: "",
    bio: "",
    greeting: "",
    description: "",
  };

  // 步骤1：定义需要合并到description的TXT字段列表（按你需要补充/删减）
  const fieldsForDescription = [
    "Occupation",
    "Sexual Orientation",
    "Race",
    "Facial Features",
    "Eyes",
    "Hair",
    "Body Shape",
    "Clothing",
    "Skin",
    "Personality",
    "Likes",
    "Dislikes",
    "Background Story", // 最后一个字段，用句号结尾
  ];

  // 步骤2：临时数组，存储这些字段的内容（键+值）
  const descriptionParts = [];

  // 遍历每一行，提取键和值
  lines.forEach((line) => {
    // 按第一个冒号分割（比如 "Title: xxx" → ["Title", "xxx"]）
    const [key, value] = line.split(/: /, 2);
    if (!key || !value) return; // 跳过空行或格式不对的行
    const keyTrimmed = key.trim();
    const valueTrimmed = value.trim();

    // 筛选多行数据
    if (fieldsForDescription.includes(keyTrimmed)) {
      descriptionParts.push(keyTrimmed + ": " + valueTrimmed + "\n");
    } else {
      // 把TXT的键映射到JSON的键（根据你的TXT字段对应）
      switch (keyTrimmed) {
        case "Title":
          json.name = valueTrimmed;
          break;
        case "Age":
          json.age = valueTrimmed;
          descriptionParts.unshift(keyTrimmed + ": " + valueTrimmed + "\n");
          break;
        case "Name":
          json.origin_name = valueTrimmed;
          descriptionParts.unshift(keyTrimmed + ": " + valueTrimmed + "\n");
          break;
        case "Gender":
          json.gender = valueTrimmed;
          break;
        case "Introduction":
          json.bio = valueTrimmed;
          break;
        case "Tags":
          // 把Tags的字符串转成数组（比如 "Mysterious, brooding" → ["Mysterious", "brooding"]）
          json.personality = value.split(",").map((item) => item.trim());
          break;
        case "Opening":
          json.greeting = valueTrimmed;
          break;
        default:
          break;
      }
    }
  });

  // 多行数据收录进数组，给decription添加value
  json.description = descriptionParts.join("");

  return json;
}
