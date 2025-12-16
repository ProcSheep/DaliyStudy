const info = [
  { folder: "Arrogant Girlfriend", file: "SsPczhbUIp.png", gender: 0 },
  { folder: "Arrogant Girlfriend", file: "SsPczh2wdp.png", gender: 0 },
  { folder: "Arrogant Girlfriend", file: "SsPcz2sxfp.png", gender: 0 },
  { folder: "Arrogant", file: "Sfcws2sxfp.png", gender: 0 },
  { folder: "Arrogant", file: "Sfcw2dxafp.png", gender: 0 },
  { folder: "Arrogant", file: "Sfcwswxhfp.png", gender: 0 },
  { folder: "Arrogant App", file: "Sfcw90xjhfp.png", gender: 0 },
  { folder: "Arrogant App", file: "Sfcw90xisfp.png", gender: 0 },
  { folder: "Arrogant App", file: "Scxjxopvhfp.png", gender: 0 },
];

const result = {};

// 按照folder划分
function classfy(info) {
  info.forEach((item) => {
    const { folder, file, gender } = item;
    if (!result[folder]) {
      // 没有这个属性，添加这个属性
      result[folder] = [];
    }

    // 有这个属性后，直接追加
    result[folder].push({ file, gender });
  });
}

classfy(info);
console.log("result", result);
