const fs = require("fs");
const path = require("path");
const { customAlphabet } = require("nanoid"); // nanoid改名
const { getJson } = require("./parseTxtToJson.js"); // txt->json

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE_URL_PHOTOS = "http://192.168.0.133:8800/static/character_photos/";
const BASE_URL_AVACOV = "http://192.168.0.133:8800/static/character_avacov/";
const outfile = path.resolve(__dirname, "./character_result.json");
// const avacovPath = path.resolve(__dirname, "../public/character_avacov");
// const photosPath = path.resolve(__dirname, "../public/character_photos");
const avacovPath = path.resolve(__dirname, "./character_avacov");
const photosPath = path.resolve(__dirname, "./character_photos");

// 优化03的处理逻辑
const characterResult = [];
const config = {
  rootDir: path.resolve(__dirname), // 处理地址
  targetExts: [".jpg", ".jpeg", ".png", ".txt"], // 目标文件
  ignoreFiles: [".DS_Store", "文件模版.png", "说明.md", ".js"], // 忽略文件
};

/**
 * 整理json
 * @param {*} config 设置参数
 */
function handleJson(config) {
  const folders = fs.readdirSync(config.rootDir);

  folders.forEach((item) => {
    const itemPath = path.join(config.rootDir, item);
    const itemStat = fs.statSync(itemPath);

    // 删除隐藏文件
    if (config.ignoreFiles.includes(item)) {
      if (item === ".DS_Store") {
        fs.rmSync(itemPath);
        console.log(`已删除文件 ${itemPath}`);
      }
      return; // 跳过一次循环
    }

    // 进入character_1/_2 ... 名字无所谓
    // 如果是目录继续遍历，直至文件
    if (itemStat.isDirectory()) {
      let characterItem = {
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

      // 存放文件夹不存在就创建
      if (!fs.existsSync(avacovPath)) {
        fs.mkdirSync(avacovPath, { recursive: true });
      }

      if (!fs.existsSync(photosPath)) {
        fs.mkdirSync(photosPath, { recursive: true });
      }

      fs.readdirSync(itemPath).forEach((item) => {
        // 处理avatar/cover/txt
        if (item.includes("avatar")) {
          const newName = customAlphabet(alphabet, 10)();
          const fileExt = item.split(".")[1];
          const originFile = itemPath + "/" + item;
          const targetFile = avacovPath + "/" + newName + "." + fileExt;
          fs.copyFileSync(originFile, targetFile);
          characterItem.avatar = BASE_URL_AVACOV + newName + "." + fileExt;
        }

        if (item.includes("cover")) {
          const newName = customAlphabet(alphabet, 10)();
          const fileExt = item.split(".")[1];
          const originFile = itemPath + "/" + item;
          const targetFile = avacovPath + "/" + newName + "." + fileExt;
          fs.copyFileSync(originFile, targetFile);
          characterItem.cover = BASE_URL_AVACOV + newName + "." + fileExt;
        }

        if (item.includes(".txt")) {
          // 处理txt文件 -> 合适的json文件
          const txtPath = itemPath + "/" + item;
          characterItem = { ...characterItem, ...getJson(txtPath) };
        }

        // photos
        if (item === "photos") {
          fs.readdirSync(itemPath + "/" + item).forEach((photo) => {
            const newName = customAlphabet(alphabet, 10)();
            const fileExt = photo.split(".")[1];
            const originFile = itemPath + "/" + item + "/" + photo;
            const targetFile = photosPath + "/" + newName + "." + fileExt;
            fs.copyFileSync(originFile, targetFile);
            characterItem.photos.push(
              BASE_URL_PHOTOS + newName + "." + fileExt
            );
          });
        }
      });

      characterResult.push(characterItem);
    }
  });
}

handleJson(config);
fs.writeFileSync(outfile, JSON.stringify(characterResult), "utf-8");
