// 错误的收集网络请求promise数组
// promises.all(): 内部处理promise数组，当所有的promise都正确的返回对应结果后，按顺序把返回的结果组合成数组返回，而每次网络请求都会返回promise对象，我们需要把这些promise对象放入数组中，统一由promise.all处理它们
for (let i = 0; i < data.pairList.length; i++) {
  const payloadFinal = {
    ...data,
    prompt: data.pairList[i].normal, // 新增
    negativePrompt: data.pairList[i].negative,
    imageBase64: data.imageBase64Arr[i],
  };

  /**
   * 错误点： 执行return后，for循环停止，后面的循环没有意义，仅返回一个网络请求
   */

  return fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "1121231d2-30d2-4bd6-a7d9-1a84df4ae2ds1b6",
    },
    body: JSON.stringify(payloadFinal),
  });
}

/**
 * 正确的方式：创建新的空数组，把对应的网络请求promise对象放入数组，然后把数组返回出去即可
 */

const requestPromises = [];

for (let i = 0; i < data.pairList.length; i++) {
  const payloadFinal = {
    ...data,
    prompt: data.pairList[i].normal,
    negativePrompt: data.pairList[i].negative,
    imageBase64: data.imageBase64Arr[i],
  };
  console.log("i + payloadFinal", i, payloadFinal);

  // 2. 不直接 return，而是把 Promise 推入数组
  const requestPromise = fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "1121231d2-30d2-4bd6-a7d9-1a84df4ae2ds1b6",
    },
    body: JSON.stringify(payloadFinal),
  });

  requestPromises.push(requestPromise);
}

// 3. 循环结束后，返回所有 Promise 组成的数组（供外部 Promise.all 使用）
return requestPromises;

// 解析： 首先在for循环中，每次调用fetch都是一次网络请求（异步），for循环速度很快，所以一瞬间会并发多个fetch网络请求，这些网络请求会返回promise对象（此时状态可能还在pending）， 这些对象存入数组返回出去
// promise.all会监听数组中promise对象的状态变化（fulfilled/rejected)，all方法的特性是当所有的promise都成功才会按顺序返回正确的结果，一旦一个失败，整体失败
