// 睡眠函数，暂停x ms后继续执行
// Promise 构造函数需要传入一个执行函数，这个函数默认有两个参数：resolve（成功回调）和 reject（失败回调）。这里只写了 r，是 resolve 的简写（程序员常用的缩写方式）。
// 简单说：r 就是一个 “开关”，调用 r() 就表示这个 Promise 从 “等待” 状态变成 “成功完成” 状态。
// setTimeout 是 JS 原生的定时器，作用是 “延迟指定毫秒后执行第一个参数的函数”。
// 这里的逻辑是：等待 ms 毫秒后，自动调用 r()（也就是触发 Promise 的成功状态）。
const sleep = (ms) => new Promise((r) => setTimeout(r, 2000));

(async () => {
  console.log("1");
  await sleep();
  console.log("2");
})();
