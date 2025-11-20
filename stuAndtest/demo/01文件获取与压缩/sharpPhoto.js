const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // 需要先安装：npm install sharp

const photosPath = path.resolve(__dirname, "./allPictures"); // 要压缩的图片文件
const outputPath = path.resolve(__dirname, "./compressed-photos"); // 压缩文件存储位置

// 确保输出目录存在
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// 支持的图片格式
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff"];

// 压缩图片函数
async function compressImage(inputPath, outputPath, quality = 80) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const sharpInstance = sharp(inputPath);

    // 根据不同格式设置压缩参数
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        await sharpInstance.jpeg({ quality }).toFile(outputPath);
        break;
      case ".png":
        await sharpInstance.png({ quality }).toFile(outputPath);
        break;
      case ".webp":
        await sharpInstance.webp({ quality }).toFile(outputPath);
        break;
      case ".gif":
        await sharpInstance.gif().toFile(outputPath); // gif格式不支持quality参数
        break;
      case ".tiff":
        await sharpInstance.tiff({ quality }).toFile(outputPath);
        break;
      default:
        throw new Error(`不支持的图片格式: ${ext}`);
    }

    console.log(`压缩成功: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`压缩失败 ${path.basename(inputPath)}:`, error.message);
  }
}

// 处理目录下所有图片
async function processPhotos() {
  try {
    const files = fs.readdirSync(photosPath);

    for (const file of files) {
      const filePath = path.join(photosPath, file);
      const fileStat = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();

      // 只处理文件且是支持的图片格式
      if (fileStat.isFile() && SUPPORTED_FORMATS.includes(ext)) {
        const outputFilePath = path.join(outputPath, file);
        await compressImage(filePath, outputFilePath);
      }
    }

    console.log("所有图片处理完成");
  } catch (error) {
    console.error("处理图片时出错:", error.message);
  }
}

// 执行处理
processPhotos();
