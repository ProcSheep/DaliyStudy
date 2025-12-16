const required = [
  {
    name: "stuDB",
    collections: [{ name: "conversations" }],
  },
  {
    name: "test",
    collections: [
      { name: "aiimages" },
      { name: "characters" },
      { name: "convers" },
    ],
  },
];

const data = {
  databases: [
    {
      name: "admin",
      sizeOnDisk: 40960,
      empty: false,
      collections: [],
    },
    {
      name: "app",
      sizeOnDisk: 8192,
      empty: false,
      collections: [
        {
          name: "appnames",
        },
      ],
    },
    {
      name: "config",
      sizeOnDisk: 98304,
      empty: false,
      collections: [],
    },
    {
      name: "local",
      sizeOnDisk: 86016,
      empty: false,
      collections: [
        {
          name: "startup_log",
        },
      ],
    },
    {
      name: "stuDB",
      sizeOnDisk: 8192,
      empty: false,
      collections: [
        {
          name: "conversations",
        },
      ],
    },
    {
      name: "test",
      sizeOnDisk: 5152768,
      empty: false,
      collections: [
        {
          name: "admins",
        },
        {
          name: "aiimages",
        },
        {
          name: "aireplaies",
        },
        {
          name: "appcategories",
        },
        {
          name: "appcreators",
        },
        {
          name: "appid",
        },
        {
          name: "appids",
        },
        {
          name: "appmedias",
        },
        {
          name: "automaticorders",
        },
        {
          name: "charactergroups",
        },
        {
          name: "characters",
        },
        {
          name: "convers",
        },
        {
          name: "conversations",
        },
        {
          name: "cronjobs",
        },
        {
          name: "installs",
        },
        {
          name: "mediainfos",
        },
        {
          name: "monitorservices",
        },
        {
          name: "ordercopies",
        },
        {
          name: "orderstatuses",
        },
        {
          name: "photoaliases",
        },
        {
          name: "photos",
        },
        {
          name: "products",
        },
        {
          name: "purchases",
        },
        {
          name: "recommendmedias",
        },
        {
          name: "recordlogins",
        },
        {
          name: "roles",
        },
        {
          name: "serviceorders",
        },
        {
          name: "students",
        },
        {
          name: "testapiparams",
        },
        {
          name: "testapiresponses",
        },
        {
          name: "testdatas",
        },
        {
          name: "tikcaches",
        },
        {
          name: "tikconfigs",
        },
        {
          name: "tikmedias",
        },
        {
          name: "topappdatas",
        },
        {
          name: "users",
        },
      ],
    },
  ],
  totalSize: 5394432,
  totalSizeMb: 5,
  ok: 1,
};

/**
 *
 * @param {*} data 所有的数据（数据库/集合）
 * @param {*} required 允许数据
 * @returns
 */
function filterDatabasesAndCollections(data, required) {
  // 创建required的映射：数据库名 -> 所需集合名的Set
  const requiredMap = new Map();
  required.forEach((db) => {
    const collectionNames = new Set(db.collections.map((col) => col.name));
    requiredMap.set(db.name, collectionNames);
  });

  console.log("requiredMap", requiredMap);

  // 先筛选数据库在筛选集合
  const filteredDatabases = data.databases
    .filter((db) => requiredMap.has(db.name)) // 只保留required中存在的数据库
    .map((db) => {
      const requiredCollections = requiredMap.get(db.name);
      // 筛选集合：只保留required中指定的集合(Set结构)
      const filteredCollections = db.collections.filter((col) =>
        requiredCollections.has(col.name)
      );
      // 返回包含筛选后集合的数据库对象
      return {
        ...db,
        collections: filteredCollections,
      };
    });

  // 返回完整结果
  return {
    ...data,
    databases: filteredDatabases,
  };
}

// 使用示例
const result = filterDatabasesAndCollections(data, required);
console.log(result);
console.log(result.databases.map((item) => item.collections));
