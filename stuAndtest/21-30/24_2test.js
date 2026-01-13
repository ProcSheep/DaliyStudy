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

function test(required, data) {
  const requiredMap = new Map();
  // 执行副作用,一个个处理db
  // 收集格式为 key(database数据库名) => value(collection集合名)
  required.forEach((db) => {
    const collectionNames = new Set(db.collections.map((col) => col.name));
    requiredMap.set(db.name, collectionNames);
  });
  console.log("requiredMap", requiredMap);

  // 筛选，全数据data按照标准required进行筛选
  // 先筛选数据库再筛选集合
  const filterCollections = data.databases
    .filter((db) => requiredMap.has(db.name)) // Map类型数据通过has可以更快o(n1)匹配键
    .map((db) => {
      // 对筛选后的所有数据库进行内部collections的集合筛选
      const collectionNames = requiredMap.get(db.name);
      console.log("collNames", collectionNames);
      const filterCollections = db.collections.filter((col) =>
        collectionNames.has(col.name)
      );
      return {
        ...db,
        collections: filterCollections,
      };
    });

  console.log("filterCollections", filterCollections);
  console.log(filterCollections.map((item) => item.collections));
}

test(required, data);
