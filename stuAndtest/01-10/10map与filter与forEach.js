/**
 * 高阶函数，都是返回新的数组
 * map： 修改数据，根据返回的数值修改
 *
 * filter： 筛选数据，根据返回的布尔决定是否保留
 */

const a = [1, 2, 3, 4, 5];

// map,对每一项数据的修改
const mapA = a.map((item) => {
  const num = item;
  return num + 10;
});
console.log("mapA", mapA); // [11,12,13,14,15]

const filterA = a.filter((item) => {
  return item > 2; // 大于2返回true，数组保留
});
console.log("filterA", filterA); // [3,4,5]

// forEach执行副作用。即对数组每个元素执行特定的操作
// 原数组b不会自动修改，也不会返回新数组，这就是利用数组内的元素进行操作而已
const b = [1, 2, 3];
b.forEach((item, index) => {
  if (a.includes(item)) console.log("b拥有", index + 1);
});

// 打印日志(信息)
const fruits = ["苹果", "香蕉", "橙子"];
fruits.forEach((fruit) => console.log(`水果：${fruit}`));

// 执行副作用，比如更新数据，操作dom
const users = [
  { name: "Alice", age: 20 },
  { name: "Bob", age: 25 },
];
users.forEach((item) => {
  item.age = item.age + 1;
});
console.log(users);

// 示例2：批量操作DOM（创建列表项）
const colors = ["红", "绿", "蓝"];
const ul = document.createElement("ul");
colors.forEach((color) => {
  const li = document.createElement("li");
  li.textContent = color;
  ul.appendChild(li);
});
document.body.appendChild(ul);

/* return 可以跳过forEach的一次循环，不可中断 */

// 要「做事不产出新数组」→ forEach；
// 要「改元素形式，产出新数组」→ map；
// 要「留符合条件的，产出新数组」→ filter。
