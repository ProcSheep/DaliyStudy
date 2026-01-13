// mongo数据库的数据直接导出，某一些属性会序列化，比如ObjectId,uuid,date(createdAt,updatedAt)
// 通过网络请求返给前端后，这些属性会变化

// 更加全面的json数据导出，转换了mongodb的$date和$binary + ObjectId
export function exportMongoDBJson(data, filename) {
  try {
    // 自定义 replacer 函数，适配字符串类型的时间字段和 UUID
    const mongoReplacer = (key, value) => {
      // 1. 处理时间字段（createdAt/updatedAt）：识别字符串格式的ISO时间并还原为$date格式
      // 匹配 createdAt/updatedAt 字段名 + 符合ISO时间格式的字符串
      const isTimeField = /^(createdAt|updatedAt)$/.test(key);
      const isIsoDateString =
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);
      if (isTimeField && isIsoDateString) {
        return {
          $date: value,
        };
      }

      // 2. 处理UUID字段：还原为$binary格式
      if (
        key.toLowerCase() === "uuid" &&
        typeof value === "string" &&
        value.length > 0
      ) {
        return {
          $binary: {
            base64: value,
            subType: "04",
          },
        };
      }

      // 3. 兼容原始Date对象的情况（防止后续数据格式变化）
      if (value instanceof Date && !isNaN(value.getTime())) {
        return {
          $date: value.toISOString(),
        };
      }

      // 4. 处理 ObjectId 类型（_id字段）
      if (
        key === "_id" &&
        typeof value === "string" &&
        /^[0-9a-fA-F]{24}$/.test(value)
      ) {
        return {
          $oid: value,
        };
      }

      // 其他字段保持原样
      return value;
    };

    // 使用自定义replacer序列化
    const jsonStr = JSON.stringify(data, mongoReplacer, 2);
    const blob = new Blob([jsonStr], {
      type: "application/json; charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${encodeURIComponent(filename)}.json`;
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("JSON 导出失败：", error);
    alert("导出失败，请重试！");
  }
}
