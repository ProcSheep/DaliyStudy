// 常用的sort排序问题
// 只能对数组进行排序，如下
// 1. 数字数组按大小排序
const nums = [10, 2, 5];
nums.sort((a, b) => a - b); // 升序：[2, 5, 10]
nums.sort((a, b) => b - a); // 降序：[10, 5, 2]

// 2. 对象数组按属性排序（常用场景）
const users = [
  { name: "张三", age: 25 },
  { name: "李四", age: 20 },
  { name: "王五", age: 30 },
];
// 按 age 升序排序
users.sort((a, b) => a.age - b.age);
console.log(users);
// 结果：[{name: '李四', age:20}, {name: '张三', age:25}, {name: '王五', age:30}]

/**
 * 针对2，有的时候可以对象转化成符合要求的数组格式
 */

const data = {
  Karina: [1763799551640],
  "Renee Miller": [1763826770126, 1763869100958, 1764256528002],
  "Red Rex": [1763851722957],
  Elizabeth: [1763855662650],
  Hana: [1763878207592],
  Gen2: [1764104808656],
  Haley: [1764317594871],
};

const dataArr = Object.entries(data)
  .map(([name, tsArr]) => ({ name, tsArr }))
  .sort((a, b) => {
    if (a.tsArr.length !== b.tsArr.length) {
      return b.tsArr.length - a.tsArr.length; // 数量不一致根据根据ts排
    } else {
      return a.name - b.name; // 数量一致，按照名字排（字符串编码）
    }
  });
/** 经过map操作后，sort根据数组长度进行排序了
 * [
  { name: 'Karina', tsArr: [ 1763799551640 ] },
  {
    name: 'Renee Miller',
    tsArr: [ 1763826770126, 1763869100958, 1764256528002 ]
  },
  { name: 'Red Rex', tsArr: [ 1763851722957 ] },
  { name: 'Elizabeth', tsArr: [ 1763855662650 ] },
  { name: 'Hana', tsArr: [ 1763878207592 ] },
  { name: 'Gen2', tsArr: [ 1764104808656 ] },
  { name: 'Haley', tsArr: [ 1764317594871 ] }
]
 */
console.log(dataArr);
