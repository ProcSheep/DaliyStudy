// 函数式编程（多使用高级函数）在笔记中有，大概是react/vue中分散有一些
/** 
 *  高阶函数是指至少能完成以下两项任务之一的函数：
     1.接受一个或多个函数作为参数
     2.返回一个函数作为结果
 */
// 1,接受函数参数
function callTwice(fn) {
  fn();
  fn();
}

callTwice(function () {
  console.log("This runs twice!");
});
// This runs twice!
// This runs twice!

// 2.函数返回函数
function createMultiplier(multiplier) {
  // This returned function "remembers" the multiplier
  return function (number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
