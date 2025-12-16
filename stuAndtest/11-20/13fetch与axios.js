// 基础的网络请求相关
// 原生fetch请求
const response = await fetch(`BASE_URL`, query);
// 网络请求发起后，都会返回一个promise，异步
if (response.ok) {
  /** 异步后成功获取的response是可独流数据，真正的数据需要json转化数据为js格式才能使用
   * 除此之外 还有
   * .text() 纯文本/HTML
   * .blob() 文件 图片等
   * .formData() 表单
   */
  const result = await response.json();
  console.log("result", result);
}

// 注意：而常用的网络请求包axios，把对应的数据结果封装进入 response.data里面，所以不需要再次解析
