// some
/// array.some(callback(element, index, array), thisArg);
// 回调函数：遍历数组的元素（仅可选），索引和整体的原数组 ｜ this指向

// 特点： 回调函数返回布尔值，一旦返回true，立即停止遍历，整体返回true， 只有所有结果都为false，才返回false
// 一定要显式返回正确的布尔值，如果返回了对象，数组，字符串一律判定为false
const numbers = [2, 5, 8, 12, 15];
// 检测是否有元素 > 10
const hasBigNumber = numbers.some((num) => num > 10);
console.log(hasBigNumber); // true（12 满足条件，遍历到 12 后停止）

// 而every则是全部都正确，才返回true，一旦有错误false，整体返回false，其余一样

// some适合做存在性测试，every则是全部测试
