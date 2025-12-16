/**
 * 步骤2：将筛选后的路由，添加为 Content 路由的子路由
 * @param {Router} router - Vue Router 实例（如 import router from './router'）
 * @param {Array} filteredRoutes - 筛选后的JS路由数组 (08返回筛选好的，待注册的，路由数组)
 */
export default function addFilteredRoutesToContent(router, filteredRoutes) {
  // 1. 找到已存在的 Content 路由（通过 name 匹配）筛选出的路由都是Content的子路由
  const contentRoute = router
    .getRoutes()
    .find((route) => route.name === "Content");

  if (!contentRoute) {
    console.error("未找到 name 为 Content 的路由，请先确保该路由已添加！");
    return;
  }

  // 2. 循环添加筛选后的路由作为 Content 的子路由
  filteredRoutes.forEach((childRoute) => {
    // 关键：addRoute 的第一个参数传父路由 name，表示添加为子路由
    // addRoute会自动递归添加路由的子路由（如果有）
    router.addRoute("Content", childRoute);

    // 可选：打印添加日志（验证是否成功）
    // console.log(
    //   `已添加子路由：${contentRoute.path}/${childRoute.path}（name: ${childRoute.name}）`
    // )
  });

  // 可选：验证所有子路由是否添加成功（打印 Content 路由的完整结构）
  // const updatedContentRoute = router
  //   .getRoutes()
  //   .find((route) => route.name === 'Content')
  // console.log('Content 路由的所有子路由：', updatedContentRoute.children)
}
