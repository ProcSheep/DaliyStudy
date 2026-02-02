/**
 * 获取当天和次日的日期数组，格式为 ['YYYY-MM-DD', 'YYYY-MM-DD']
 * @returns {string[]} 包含当天和次日的日期数组
 */
function getTodayAndTomorrow() {
  // 1. 获取当前日期（本地时间）
  const today = new Date();

  // 2. 计算次日：基于今天的时间戳 + 24小时的毫秒数
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // 自动处理跨月 / 跨年

  // 3. 日期格式化函数：补零并拼接为 YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    // 月份从0开始，所以要+1；
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // 日期补零: 补零：小于10则前面加0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 4. 返回格式化后的当天和次日数组
  return [formatDate(today), formatDate(tomorrow)];
}

// 测试示例
const result = getTodayAndTomorrow();
console.log(result); // 若今天是2026-1-19，输出 ["2026-01-19", "2026-01-20"]
