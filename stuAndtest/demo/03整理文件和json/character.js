const fs = require("fs");
const path = require("path");
const { customAlphabet } = require("nanoid"); // nanoid改名

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE_URL_PHOTOS = "http://192.168.0.133:8800/static/character_photos/";
const BASE_URL_AVACOV = "http://192.168.0.133:8800/static/character_avacov/";
// 完整config
let character = {};
const characterJsonData = [];
const characterJsonPath = path.resolve(__dirname, "./character_result.json");

/** ============== 工具函数 =================
 * 一层遍历图片
 * @param {string} config - 当前遍历的目录路径
 * @param {string} baseUrl - 图片地址前缀
 */
function handleImg(config, baseUrl) {
  try {
    const items = fs.readdirSync(config.rootDir);

    items.forEach((item) => {
      const itemPath = path.join(config.rootDir, item);
      const itemStat = fs.statSync(itemPath);

      if (config.ignoreFiles.includes(item)) {
        if (item === ".DS_Store") {
          fs.unlinkSync(itemPath);
          console.log(`已删除文件 ${itemPath}`);
          return;
        }
      }

      // 如果是目录则跳过
      if (itemStat.isDirectory()) {
        return; // 不会阻止forEach，仅跳过一次循环
      }

      // 符合条件的文件，改名并提升目录
      // 提升的目录文件夹要存在
      if (!fs.existsSync(config.newPicDir)) {
        fs.mkdirSync(config.newPicDir, { recursive: true });
      }

      // nanoid修改文件的名字 或者 不改名字
      // const name = customAlphabet(alphabet, 10)();
      const name = item.split(".")[0];
      const fileExt = path.extname(item).toLowerCase();
      let fileName = null;
      if (config.targetExts.includes(fileExt)) {
        fileName = name + fileExt;
        // 提升目录 旧地址-》新地址（包括文件名）
        const sourcePath = itemPath;
        const targetPath = path.join(config.newPicDir, fileName);
        fs.copyFileSync(sourcePath, targetPath);
        console.log("已复制文件", fileName);

        if (baseUrl.endsWith("character_photos/")) {
          const photoUrl = baseUrl + fileName;
          character.photos.push(photoUrl);
        } else {
          // avatar/cover
          if (item.includes("avatar")) {
            character.avatar = baseUrl + fileName;
          } else {
            character.cover = baseUrl + fileName;
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 *  ============= 执行脚本 =============
 */
// 遍历多个角色（文件夹）
const rootDir = path.resolve(__dirname);
fs.readdirSync(rootDir).forEach((folder) => {
  // 进入每个角色的单独的文件夹 character_1/_2/_3 ...
  const folderPath = path.resolve(__dirname, folder);

  // 新增：判断路径是否存在，避免访问不存在的文件/目录
  if (!fs.existsSync(folderPath)) {
    console.log(`跳过不存在的路径: ${folderPath}`);
    return;
  }

  const folderStat = fs.statSync(folderPath);

  if (folderStat.isDirectory()) {
    // 初始json数据
    const jsonPath = path.join(folderPath, "./character.json");
    const jsonDatastr = fs.readFileSync(jsonPath, "utf-8");
    const jsonData = JSON.parse(jsonDatastr);

    // 每次都要初始化除photos,avatar,cover之外的所有数据
    character = {
      name: "",
      original_name: "",
      gender: "",
      age: "",
      bio: "",
      greeting: "",
      description: "",
      personality: [],
      avatar: "",
      cover: "",
      photos: [],
    };
    const {
      name,
      title,
      gender,
      age,
      bio,
      greeting,
      description,
      personality,
    } = jsonData;
    character = {
      ...character,
      name: title,
      original_name: name,
      age,
      gender,
      bio,
      greeting,
      description,
      personality,
    };
    // console.log("character", character);

    // 应用01变式
    const photosConfig = {
      rootDir: path.join(folderPath, "./photos"), // 处理地址
      newPicDir: path.resolve(__dirname, "./allPhotos"), // 新地址
      targetExts: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"], // 目标文件
      ignoreFiles: [".DS_Store", ".gitignore"], // 忽略文件
    };

    const avacovConfig = {
      rootDir: path.join(folderPath), // 处理地址
      newPicDir: path.resolve(__dirname, "./allAvaCov"), // 新地址
      targetExts: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"], // 目标文件
      ignoreFiles: [".DS_Store", ".gitignore"], // 忽略文件
    };

    // console.log(photosConfig, avacovConfig);

    // 整理json和图片分类
    handleImg(photosConfig, BASE_URL_PHOTOS); // 处理photos
    handleImg(avacovConfig, BASE_URL_AVACOV); // 处理avatar和cover
    characterJsonData.push(character);
  }
});

console.log(characterJsonData);
// 书写最后的json数据结果
fs.writeFileSync(characterJsonPath, JSON.stringify(characterJsonData), "utf-8");
