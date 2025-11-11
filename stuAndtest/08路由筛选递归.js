// 遍历处理content路由，选择合适的路由注册
const contentChildren = [
  {
    path: "aichat",
    name: "AIChat",
    component: () => import("../views/Tsmm.vue"),
    children: [
      {
        path: "conversation",
        name: "conversation",
        component: () => import("../views/Conversations.vue"),
      },
      {
        path: "character",
        name: "character",
        component: () => import("../views/Characters.vue"),
      },
      {
        path: "groups",
        name: "groups",
        component: () => import("../views/Groups.vue"),
      },
      {
        path: "prompt",
        name: "prompt",
        component: () => import("../components/AIChat/Prompt.vue"),
      },
      {
        path: "explore",
        name: "explore",
        component: () => import("../views/Explore.vue"),
      },
      {
        path: "push",
        name: "push",
        component: () => import("../components/AIChat/Push.vue"),
      },
      {
        path: "pushJson",
        name: "worldInfo",
        component: () => import("../components/AIChat/PushJson.vue"),
      },
      {
        path: "pushInfo",
        name: "pushInfo",
        component: () => import("../components/AIChat/PushInfo.vue"),
      },
      {
        path: "config",
        name: "config",
        component: () => import("../views/Config.vue"),
      },
    ],
  },
  {
    path: "paramsdata",
    name: "API Test Cases",
    component: () => import("../views/ParamsData.vue"),
  },
  {
    path: "test",
    name: "API Test Results",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "tsmm",
    name: "API Tsmm",
    component: () => import("../views/Tsmm.vue"),
    children: [
      {
        path: "service",
        name: "Using Service",
        component: () => import("../components/Tsmm/UsingService.vue"),
      },
      {
        path: "tools",
        name: "Test Service",
        component: () => import("../components/Tsmm/ExecutionTool.vue"),
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("../components/Tsmm/OrderData.vue"),
      },
      {
        path: "link",
        name: "Using Link",
        component: () => import("../components/Tsmm/TestLink.vue"),
      },
      {
        path: "AvailableServices",
        name: "AvailableServices",
        component: () => import("../components/Tsmm/AvailableServices.vue"),
      },
    ],
  },
  {
    path: "repost",
    name: "Modify Repost Data",
    component: () => import("../views/RepostData.vue"),
    children: [
      {
        path: "creator",
        name: "Creator Data",
        component: () => import("../components/Repost/Creator.vue"),
      },
      {
        path: "media",
        name: "Media Data",
        component: () => import("../components/Repost/Media.vue"),
      },
    ],
  },
  {
    path: "smmevent",
    name: "Smm Events Data",
    component: () => import("../views/SmmEvents.vue"),
  },
  {
    path: "mongoservice",
    name: "Mongo Service Data",
    component: () => import("../views/MongoService.vue"),
  },
  {
    path: "service",
    name: "API Test Service",
    component: () => import("../views/TestService.vue"),
    children: [
      {
        path: "alldata",
        name: "All Service",
        component: () => import("../components/Test/ServiceData.vue"),
      },
      {
        path: "refresh",
        name: "Reresh Order",
        component: () => import("../components/Test/RefreshId.vue"),
      },
    ],
  },
  {
    path: "orders",
    name: "API Test Orders",
    component: () => import("../views/SelectOrders.vue"),
    children: [
      {
        path: "monitor",
        name: "Monitor Orders",
        component: () => import("../components/Test/MonitorOrders.vue"),
      },
      {
        path: "follow",
        name: "Orders Followers",
        component: () => import("../components/Test/UserFollow.vue"),
      },
      {
        path: "select",
        name: "Select Orders",
        component: () => import("../components/Test/SelectOrders.vue"),
      },
      {
        path: "check",
        name: "Check Orders",
        component: () => import("../components/Test/CheckOrder.vue"),
      },
    ],
  },
  {
    path: "getappdata",
    name: "App Data",
    component: () => import("../views/AppData.vue"),
  },
  {
    path: "users",
    name: "User Management",
    component: () => import("../views/Users.vue"),
    // meta: {
    //   requiresAdmin: true,
    //   permission: [],
    // },
  },
];
// 数据库的路由信息（用于el-menu）同时用于路由筛选
const jsonRoutesData = [
  {
    name: "AIChat",
    path: "/content/aichat",
    icon: "el-icon-s-order",
    children: [
      {
        path: "/content/aichat/conversation",
        name: "conversation",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/character",
        name: "character",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/groups",
        name: "groups",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/prompt",
        name: "prompt",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/explore",
        name: "explore",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/push",
        name: "push",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/pushJson",
        name: "worldInfo",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/pushInfo",
        name: "pushInfo",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/aichat/config",
        name: "config",
        icon: "el-icon-tickets",
      },
    ],
  },
  {
    name: "API Test Cases",
    path: "/content/paramsdata",
    icon: "el-icon-menu",
  },
  {
    name: "API Test Results",
    path: "/content/test",
    icon: "el-icon-s-comment",
  },
  {
    name: "API Tsmm",
    path: "/content/tsmm",
    icon: "el-icon-s-order",
    children: [
      {
        path: "/content/tsmm/orders",
        name: "Orders",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/tsmm/AvailableServices",
        name: "AvailableServices",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/tsmm/service",
        name: "Using Service",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/tsmm/tools",
        name: "Test Service",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/tsmm/link",
        name: "Using Link",
        icon: "el-icon-tickets",
      },
    ],
  },
  {
    name: "Modify Repost Data",
    icon: "el-icon-s-claim",
    children: [
      {
        path: "/content/repost/creator",
        name: "Creator Data",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/repost/media",
        name: "Media Data",
        icon: "el-icon-edit-outline",
      },
    ],
  },
  {
    name: "Smm Events Data",
    path: "/content/smmevent",
    icon: "el-icon-s-order",
  },
  {
    name: "Mongo Service Data",
    path: "/content/mongoservice",
    icon: "el-icon-s-order",
  },
  {
    name: "API Test Service",
    icon: "el-icon-s-tools",
    children: [
      {
        path: "/content/service/alldata",
        name: "All Service",
        icon: "el-icon-tickets",
      },
      {
        path: "/content/service/refresh",
        name: "Reresh Order",
        icon: "el-icon-edit-outline",
      },
    ],
  },
  {
    name: "API Test Orders",
    icon: "el-icon-s-order",
    children: [
      {
        path: "/content/orders/monitor",
        name: "Monitor Orders",
        icon: "el-icon-timer",
      },
      {
        path: "/content/orders/follow",
        name: "Orders Followers",
        icon: "el-icon-user",
      },
      {
        path: "/content/orders/select",
        name: "Select Orders",
        icon: "el-icon-search",
      },
      {
        path: "/content/orders/check",
        name: "Check Orders",
        icon: "el-icon-document-checked",
      },
    ],
  },
  {
    name: "App Data",
    path: "/content/getappdata",
    icon: "el-icon-s-grid",
  },
  {
    name: "User Management",
    path: "/content/users",
    icon: "el-icon-user-solid",
  },
];

/**
 * 筛选函数 (**本次两个数组之间链接的关系变量是name字段（contentChildren / jsonRoutesData）**)
 *  + contentChildren： Content的所有子路由
 * @param {*} dynamicMenu // =jsonRoutesData
 * @returns
 */
export default function (dynamicMenu) {
  // 1.2 递归收集JSON中所有路由的name（包括所有层级子路由）
  const collectJsonNames = (routes) => {
    const nameSet = new Set(); // 不重复收集路由name
    const traverse = (routeList) => {
      routeList.forEach((route) => {
        // 确保JSON路由有name字段才收集（容错处理）
        if (route.name) {
          nameSet.add(route.name);
        }
        // 递归处理子路由
        if (route.children && route.children.length) {
          traverse(route.children);
        }
      });
    };
    traverse(routes);
    return nameSet;
  };

  // 1.1 获取JSON中所有有效name的集合（查询高效）
  const jsonValidNames = collectJsonNames(dynamicMenu);

  // 2.2 递归筛选JS路由：保留name在JSON中存在的路由，且保留所有原始字段
  const filterValidRoutes = (routes) => {
    return (
      routes
        // filter方法执行完毕后，返回一个只包含满足条件元素的新数组，然后对这个过滤后的新数组执行map方法，遍历数组中的每一个元素
        .filter((route) => {
          // 只保留：JS路由有name，且该name在JSON中存在
          return route.name && jsonValidNames.has(route.name);
        })
        .map((route) => {
          // 深拷贝路由对象（避免修改原数组），递归处理子路由
          const newRoute = { ...route }; // 保留所有原始字段（component、meta， children等）
          // 如果当前路由有子路由，递归筛选子路由， 如果没有，直接返回当前路由
          if (newRoute.children && newRoute.children.length) {
            // 子路由同样需要筛选（可能有三级路由等情况），且保留所有字段 (递归调用)
            newRoute.children = filterValidRoutes(newRoute.children);
          }
          return newRoute;
        })
    );
  };

  // 2.1 执行筛选并返回新数组（原数组完全不变）
  return filterValidRoutes(contentChildren);
}
