// const fs = require("fs");
// const path = require("path");
/** nanoid不支持commonjs引入 */
// const { customAlphabet } = require("nanoid"); // nanoid改名
// const { getJson } = require("./parseTxtToJson.js"); // txt->json
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { customAlphabet } from "nanoid";
import { getJson } from "./parseTxtToJson.js";

// 1. 获取当前文件的完整路径（等价于 CommonJS 的 __filename）
const __filename = fileURLToPath(import.meta.url);
// 2. 获取当前文件的目录路径（等价于 CommonJS 的 __dirname）
const __dirname = path.dirname(__filename);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE_URL_PHOTOS = "http://192.168.0.133:8800/static/character_photos/";
const BASE_URL_AVACOV = "http://192.168.0.133:8800/static/character_avacov/";
const outfile = path.resolve(__dirname, "./character_result.json");
// 服务器测试
const avacovPath = path.resolve(__dirname, "../../public/character_avacov");
const photosPath = path.resolve(__dirname, "../../public/character_photos");
// 本地测试
// const avacovPath = path.resolve(__dirname, "./character_avacov");
// const photosPath = path.resolve(__dirname, "./character_photos");

// 优化03的处理逻辑
const characterResult = [];
const config = {
  rootDir: path.resolve(__dirname), // 处理地址
  targetExts: [".jpg", ".jpeg", ".png", ".txt"], // 目标文件
  ignoreFiles: [".DS_Store", "文件模版.png", "说明.md", ".js"], // 忽略文件
};

/** 处理文件 */
async function processFiles(itemPath, characterItem) {
  const files = fs.readdirSync(itemPath);
  for (const item of files) {
    if (item.includes("avatar")) {
      const newName = customAlphabet(alphabet, 10)();
      const fileExt = item.split(".")[1];
      const originFile = path.join(itemPath, item); // 用 path.join 更安全
      const targetFile = path.join(avacovPath, `${newName}.${fileExt}`);
      fs.copyFileSync(originFile, targetFile); // 建议取消注释实际复制文件
      characterItem.avatar = `${BASE_URL_AVACOV}${newName}.${fileExt}`;
    }

    if (item.includes("cover")) {
      // 同 avatar 逻辑，使用 path.join 和提前导入的 customAlphabet
      const newName = customAlphabet(alphabet, 10)();
      const fileExt = item.split(".")[1];
      const originFile = path.join(itemPath, item);
      const targetFile = path.join(avacovPath, `${newName}.${fileExt}`);
      fs.copyFileSync(originFile, targetFile);
      characterItem.cover = `${BASE_URL_AVACOV}${newName}.${fileExt}`;
    }

    if (item.includes(".txt")) {
      const txtPath = path.join(itemPath, item);
      // 确保 getJson 是同步的（如果是异步需加 await）
      const txtData = getJson(txtPath);
      Object.assign(characterItem, txtData); // 合并属性更安全
    }

    if (item === "photos") {
      const photosDir = path.join(itemPath, item);
      fs.readdirSync(photosDir).forEach((photo) => {
        const newName = customAlphabet(alphabet, 10)();
        const fileExt = photo.split(".")[1];
        const originFile = path.join(photosDir, photo);
        const targetFile = path.join(photosPath, `${newName}.${fileExt}`);
        fs.copyFileSync(originFile, targetFile);
        characterItem.photos.push(`${BASE_URL_PHOTOS}${newName}.${fileExt}`);
      });
    }
  }
}

/**
 * 整理json
 * @param {*} config 设置参数
 */
async function handleJson(config) {
  const folders = fs.readdirSync(config.rootDir);

  for (const item of folders) {
    const itemPath = path.join(config.rootDir, item);
    const itemStat = fs.statSync(itemPath);
    // 删除隐藏文件
    if (config.ignoreFiles.includes(item)) {
      if (item === ".DS_Store") {
        fs.rmSync(itemPath);
        console.log(`已删除文件 ${itemPath}`);
      }
      continue; // 跳过一次循环
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

      // 存放图片的文件可能不存在
      if (!fs.existsSync(avacovPath)) {
        fs.mkdirSync(avacovPath, { recursive: true });
      }
      if (!fs.existsSync(photosPath)) {
        fs.mkdirSync(photosPath, { recursive: true });
      }

      // 等待所有文件处理完成
      await processFiles(itemPath, characterItem);

      characterResult.push(characterItem);
    }
  }
}

await handleJson(config);
// console.log("result", characterResult);
fs.writeFileSync(outfile, JSON.stringify(characterResult), "utf-8");
