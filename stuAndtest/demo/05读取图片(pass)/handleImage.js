const fs = require("fs");
const path = require("path");
const { customAlphabet } = require("nanoid"); // nanoid改名

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const config = {
  rootDir: path.resolve(__dirname, "./config"), // 处理地址
  targetExts: [".jpg", ".jpeg", ".png", ".txt"], // 目标文件
  ignoreFiles: [".DS_Store"], // 忽略文件
};
const output = path.resolve(__dirname, "./aiImage.json");

const result = [];

/**
 * 整理json
 * @param {*} config 设置参数
 */
function handleJson(config) {
  const folders = fs.readdirSync(config.rootDir);

  for (const item of folders) {
    const itemPath = path.join(config.rootDir, item);
    // 删除隐藏文件
    if (config.ignoreFiles.includes(item)) {
      if (item === ".DS_Store") {
        fs.rmSync(itemPath);
        console.log(`已删除文件 ${itemPath}`);
      }
      continue;
    }
    let data = {
      uuid: item,
      photos: [],
    };
    fs.readdirSync(itemPath).forEach((image) => {
      // 删除隐藏文件
      if (config.ignoreFiles.includes(image)) {
        if (image === ".DS_Store") {
          fs.rmSync(itemPath + image);
          console.log(`已删除文件 ${itemPath + image}`);
        }
        return;
      }
      const name = customAlphabet(alphabet, 10)();
      const fileExt = image.split(".")[1];
      const newFileName = name + "." + fileExt;
      console.log(
        "old new",
        itemPath + "/" + image,
        itemPath + "/" + newFileName
      );
      data.photos.push(newFileName);
      fs.renameSync(itemPath + "/" + image, itemPath + "/" + newFileName);
    });
    console.log("data", data);
    result.push(data);
  }
}

handleJson(config);
console.log("result", result);
fs.writeFileSync(output, JSON.stringify(result), "utf-8");
