/**
 * 导出 JSON 文件并下载
 * @param {Object|Array} data 要导出的数据（对象/数组）
 * @param {string} filename 下载的文件名（无需 .json 后缀）
 */
export function downloadJson(data, filename = "导出数据") {
  try {
    // 1. 将数据转为 JSON 字符串（ensureAscii: false 支持中文）
    const jsonStr = JSON.stringify(data, null, 2); // 第三个参数 2 是格式化缩进，可读性更好

    // 2. 构造 Blob 对象（文件流），指定 MIME 类型为 application/json
    const blob = new Blob([jsonStr], {
      type: "application/json; charset=utf-8",
    });

    // 3. 创建临时下载链接
    const url = URL.createObjectURL(blob);

    // 4. 创建 <a> 标签触发下载
    const a = document.createElement("a");
    a.href = url;
    // 处理中文文件名（encodeURIComponent 避免乱码）
    a.download = `${encodeURIComponent(filename)}.json`;
    a.style.display = "none"; // 隐藏标签

    // 5. 触发点击下载，然后移除临时链接（避免内存泄漏）
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 释放 Blob URL
  } catch (error) {
    console.error("JSON 导出失败：", error);
    alert("导出失败，请重试！");
  }
}
