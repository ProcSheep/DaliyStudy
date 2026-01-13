// 应用： 比如ai生图，ai生图的任务下达后，并不会立即生成，需要通过轮询反复查看任务执行情况（成功/等待/失败），然后返回对应结果

// 注意fetch和axios对请求的结果处理是不同的，axios经过封装后仅需.data即可获取，2而fetch需要先转化下格式.json 异步）
// 最大尝试30次，每次间隔3000秒
const sleep = (ms) => new Promise((r) => setTimeout(r, 2000));
async function pollTask(opts, maxAttemps = 30, interval = 3000) {
  for (let attmps = 0; attmps < maxAttemps; attmps++) {
    const response = await fetch("/", opts);
    const result = await response.json(); // 与axios有所不同

    // state是返回的参数，用来鉴别是否有结果了
    if (result.state === "success") {
      const results = JSON.parse(result); // 需要解析json字符串为js对象
      console.log("success任务完成");
      return results;
    }

    if (result.state === "fail") {
      console.log("任务失败", result.failMsg);
      throw new Error(failMsg);
    }

    await sleep(interval);
  }

  throw new Error("pollTask任务在最大尝试次数(30)后超时");
}
