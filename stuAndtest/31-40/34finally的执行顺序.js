try {
  // a...
  console.log("a");
  return;
} catch (error) {
  // b...
  console.log("b");
} finally {
  // 这里的代码会在return/break/continue之前执行，也就是说，每一次try-catch，必会执行一次finally内代码
  // 他不会受return等截断影响
  console.log("我是finally代码");
}
