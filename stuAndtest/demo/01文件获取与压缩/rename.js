const fs = require("fs");
const path = require("path");
const { customAlphabet } = require("nanoid"); // 改名

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // nanoid

const config = {
  rootDir: path.resolve(__dirname, "./pictures"), // 处理地址
  newPicDir: path.resolve(__dirname, "./allPictures"), // 新地址
  targetExts: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"], // 目标文件
  ignoreFiles: [".DS_Store", ".gitignore"], // 忽略文件
};

const result = []; // 收集数据

/**
 * 递归遍历目录的核心函数
 * @param {string} currentDir - 当前遍历的目录路径
 * @param {string} parentFolder - 父文件夹名称（仅用于results结果记录）
 */
function traverseDir(currentDir, parentFolder) {
  try {
    const items = fs.readdirSync(currentDir);

    items.forEach((item) => {
      const itemPath = path.join(currentDir, item);
      const itemStat = fs.statSync(itemPath);

      if (config.ignoreFiles.includes(item)) {
        if (item === "DS_Store") {
          fs.unlinkSync(itemPath);
          console.log(`已删除文件 ${itemPath}`);
          return;
        }
      }

      // 如果是目录，继续递归，直到文件
      if (itemStat.isDirectory()) {
        traverseDir(itemPath, item);
        return; // 不会阻止forEach，仅跳过一次循环
      }

      // 符合条件的文件，改名并提升目录
      // 提升的目录文件夹要存在
      if (!fs.existsSync(config.newPicDir)) {
        fs.mkdirSync(config.newPicDir, { recursive: true });
      }

      const fileExt = path.extname(item).toLowerCase();
      if (config.targetExts.includes(fileExt)) {
        // nanoid修改文件的名字
        const name = customAlphabet(alphabet, 10)();
        const fileName = name + fileExt;
        // 提升目录 旧地址-》新地址（包括文件名）
        const sourcePath = itemPath;
        const targetPath = path.join(config.newPicDir, fileName);
        fs.copyFileSync(sourcePath, targetPath);
        console.log("已复制文件", fileName);

        result.push({
          parentFolder: parentFolder || "根目录", // 父目录名
          originPath: sourcePath, // 初始文件绝对地址
          newPath: targetPath, // 新文件地址 （提升目录的终点)
          originFileName: item, // 文件原名
          finalFileName: fileName, // 文件新名
          fileExt: fileExt, // 后缀
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// 根目录自己获取,暂时由字符串代替
traverseDir(config.rootDir, "根目录");

console.log("result", result);

//  -- 可选，记录数据 --
const saveDir = path.resolve(__dirname, "./results.json");
fs.writeFileSync(saveDir, JSON.stringify(result), "utf-8"); // 记得json化数据
