// // 普通for循环 --- 略

// // 1.for .. in
// // 遍历对象数组的属性值，推荐遍历对象，遍历数组只能得到序列字符串
// const obj = { a: 1, b: 2 };
// for (const key in obj) {
//   // 过滤原型链属性（关键！）
//   if (obj.hasOwnProperty(key)) {
//     console.log(key, obj[key]); // 输出：a 1, b 2
//   }
// }

// // 遍历数组（不推荐）
// const arr1 = [1, 2];
// for (const key in arr) {
//   console.log(key, typeof key); // 输出：0 string, 1 string（索引是字符串）
// }

// // 2.for .. of
// // 遍历数值,不支持对象遍历,推荐数组数值的遍历

// // 遍历数组（推荐）
// const arr2 = [1, 2, 3];
// for (const val of arr) {
//   if (val === 2) break; // 可中断
//   console.log(val); // 输出：1
// }

// // 遍历字符串
// const str = "abc";
// for (const char of str) {
//   console.log(char); // 输出：a, b, c
// }

// // 遍历 Map（天然遍历 [key, value]）
// const map = new Map([
//   ["a", 1],
//   ["b", 2],
// ]);
// for (const [key, val] of map) {
//   console.log(key, val); // 输出：a 1, b 2
// }

// 3.entries
// entries() 是可迭代对象的方法, 每次迭代输出 [键名, 键值] 数组
// 特殊地，对象Object '{}' 没有entries方法，需要通过Object.entries()把对象先转化为可迭代对象
const obj2 = { a: 1, b: 2 };
console.log(Object.entries(obj2)); // -> [ [ 'a', 1 ], [ 'b', 2 ] ]
for (const [key, value] of Object.entries(obj2)) {
  console.log("key", key, "value", value);
}

// 数组 entries()：键是索引（数字），值是元素
const arr3 = [1, 2];
for (const [index, val] of arr3.entries()) {
  console.log(index, val); // 输出：0 1, 1 2
}
// Map entries()：原生返回 [key, value]（与 for of 天然契合）
const map = new Map([["a", 1]]);
for (const [key, val] of map.entries()) {
  // 可简写为 for (const [key, val] of map)
  console.log(key, val); // 输出：a 1
}

// 4.forEach
// 不支持中断，不支持异步
// 值，索引（从1开始），原数组（即arr，可以用来修改原数组的值）
const arr4 = [1, 2, 3];
arr4.forEach((val, index, originalArr) => {
  console.log(val, index); // 输出：1 0, 2 1, 3 2
  // return 仅跳过当前项，无法终止遍历
  if (val === 2) return;
});

// 遍历普通对象（要属性名 + 属性值）→ Object.entries(obj) + for of
// 遍历数组（要值，可能中断 /await）→ for of
// 遍历数组（要索引 + 元素，可能中断）→ arr.entries() + for of
// 遍历数组（全量遍历，无中断需求）→ forEach()
// 遍历 Map/Set → for of（Map 直接得到键值对，Set 得到值）
// 绝对避免：用 for in 遍历数组（索引是字符串，遍历原型链）
