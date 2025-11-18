// const allFruits = ["苹果", "香蕉", "橙子", "葡萄", "芒果", "榴莲"];
// const targetFruits = ["苹果", "香蕉", "橙子"]; // 目标值集合

// const result = allFruits.filter((fruit) => targetFruits.includes(fruit));
// console.log(result);

// const targetSet = new Set(targetFruits);
// const filtered2 = allFruits.filter((fruit) => targetSet.has(fruit));
// console.log(filtered2); // ['苹果', '香蕉', '橙子']（结果一致，效率更高）

// 如若选择排除某些元素加！ 取反即可

const products = [
  { name: "苹果", tags: ["红色", "圆形", "水果"] },
  { name: "香蕉", tags: ["黄色", "长形", "水果"] },
  { name: "红球", tags: ["红色", "圆形", "玩具"] },
];
const requiredTags = ["红色", "圆形"]; // 必须同时包含这两个标签
const requiredSet = new Set(requiredTags);

// every 全量遍历方法，条件false停止遍历并返回， 只返回布尔值
const filtered = products.filter((product) =>
  requiredTags.every(
    (tag) => requiredSet.has(tag) && product.tags.includes(tag)
  )
);
console.log(filtered); // [{ name: '苹果', ... }, { name: '红球', ... }]
