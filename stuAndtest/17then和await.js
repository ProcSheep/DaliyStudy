// 本次在function内部写，回顾知识，伪代码
// 常写的异步操作，比如网络请求等，用语法糖async/await，这样比较直观
async function test1() {
  const res = await fetch("/");
  return res;
}
const data = test1(); // 可以直接获取到结果

// 2.如果设计不阻塞代码执行,可以用原始方式+then
// promise会等待网络请求结束后改变对应的状态
function test2() {
  return new Promise((resolve, reject) => {
    try {
      const data = fetch("/");
      resolve(data); // 成功
    } catch (error) {
      reject(error); // 失败
    }
  });
}

// 不能直接获取结果了，函数返回了一个Promise对象
test2()
  .then((res) => console.log("结果", res))
  .catch((err) => console.error("错误", err));
