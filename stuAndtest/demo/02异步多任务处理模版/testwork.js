// 引入均为举例
import WorkerService from "./workerService.js";
import cron from "node-cron"; // node自带

const config = {
  apiKey: "001", // test
};

let workerInstance = null;
// 执行测试
async function runTest() {
  try {
    if (!workerInstance) {
      workerInstance = new WorkerService(config.apiKey);
    }
    // 执行进程
    await workerInstance.startProcessing();
  } catch (error) {
    console.error("❌ 执行任务失败:", error);
  }
}

// 自动执行
cron.schedule("*/5 * * * * *", () => {
  console.log("Running a task every minute");
  runTest();
});
