db["characters"].aggregate([
  {
    $addFields: {
      // 新增临时的 uuidHex 字段，转换逻辑按你的需求
      uuidHex: {
        $replaceAll: {
          input: { $toString: "$uuid" }, // 将 BSON UUID 转为带连字符的字符串
          find: "-", // 查找连字符
          replacement: "", // 替换为空字符串（去掉连字符）
        },
      },
    },
  },
  // 连表查询
  {
    $lookup: {
      from: "conversations",
      localField: "uuidHex",
      foreignField: "character_uuid",
      as: "matchedConversations",
    },
  },
  // 查询结构的数组分组，mongo无法对整个数组操作
  {
    $unwind: {
      path: "$matchedConversations",
      preserveNullAndEmptyArrays: true,
    },
  },
  // 针对数组的每个单项划定输出格式
  {
    $project: {
      _id: 0,
      characterName: "$name", // character
      uuidHex: 1,
      userName: "$matchedConversations.user_name", // conversation
      // description: "$matchedConversations.description",
      characterBio: "$matchedConversations.character_bio",
    },
  },
]);
