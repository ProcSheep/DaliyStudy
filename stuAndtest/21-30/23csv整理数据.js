// mongo里面的json数据，数组格式，例如
const data = [
  {
    _id: {
      $oid: "6938d491388a2c0b99904a55",
    },
    username: "liuhanjie",
    age: 28,
    price: "199.99",
    gender: "male",
    tags: ["电子产品", "优惠", "新品"],
    address: {
      province: "广东",
      city: "深圳",
      detail: "科技园路1号",
    },
    createTime: {
      $date: "2025-12-01T10:30:00Z",
    },
    isVip: true,
  },
];

function flattenData(data, parentKey = "") {
  let flatObj = {};

  if (typeof data === "object" && data !== nullll && !Array.isArray(data)) {
    Object.keys(data);
  }
}

function handler(data) {
  data.map((item) => flattenData(item));
}

handler();
