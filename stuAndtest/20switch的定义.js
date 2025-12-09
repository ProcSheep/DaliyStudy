// switch的定义与作用域问题
switch (chartType) {
  case "Line":
    let xAxisData = this.lineData.map((item) => String(item.day));
    let lineOps = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
    };

    lineOps && this.lineEchart.setOption(lineOps, true); // 增加true参数，强制更新
    break;
  case "multiLine":
    // ❌：switch的{}中，公用一个作用域，所以这里xAxisData是不能与case Line（1）重名的
    // ❌：误区：case multiLine中不能直接使用xAx，因为虽然解决了作用域矛盾，但是代码在switch中是依照case分支执行的，如果进入case 2分支，就会出现xAx未定义的问题，因为它只在case 1中定义，case 2中未定义
    // 所以遇到这种case 1和2都需要同一个变量，但是作用域和定义问题出现矛盾的问题，解决是统一在switch外部定义xAx,内部直接使用即可
    // let xAxisData = this.lineData.map((item) => String(item.day));
    let multiLinesOps = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
    };
    multiLinesOps && this.multiLinesEchart.setOption(multiLinesOps, true); // 增加true参数，强制更新
    break;
  default:
    new Error("未知的Echart类型");
}

// 解决: ✅ 统一在switch外部定义xAx,内部直接使用
let xAxisData = 11111;
switch (a) {
  case 1:
    let lineOps = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
    };
    break;
  case 2:
    let multiLinesOps = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
    };
    break;
}
