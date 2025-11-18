// uuid
const uuidObj = {
  $binary: {
    base64: "pdUCZcZJTdev7UYf2ug9mA==",
    subType: "04",
  },
};

console.log(Buffer.from(uuidObj.$binary.base64, "base64").toString("hex"));

let a = [{ a: 1 }, { b: 2 }];
let a1 = [{ a1: 1 }, { b1: 2 }];
let b = [];
b.push(...a);
b.push(...a1);
console.log(b);
