// 如果env没有效果，读取不到根目录下的env文件，可以直接显式指定env的路径比如
const Path = require("path");
require("dotenv").config({
  path: Path.resolve(__dirname, "../../.env"), // 脚本在子目录，向上找根目录的.env
});
