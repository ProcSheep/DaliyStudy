const mongoose = require("mongoose");

const establishDbConnection = async () => {
  try {
    // 端口连接打开，是那个数据库就写那个的名字，27018/**
    const connect = await mongoose.connect(`mongodb://127.0.0.1:27018/test`);

    console.log("连接数据库成功");
    console.log(
      `连接信息: ${connect.connection.host}:${connect.connection.port}, 数据库: ${connect.connection.name}`
    );
    return connect;
  } catch (error) {
    console.error("连接数据库失败", error);
    process.exit(1);
  }
};

const closeConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("断开数据库连接成功");
  } catch (error) {
    console.error("断开数据库失败", error);
    process.exit(1);
  }
};

module.exports = {
  establishDbConnection,
  closeConnection,
};
