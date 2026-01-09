// 利用图结构实现简单的推荐算法Demo
// 扩展版图类：支持加权边（记录关联度）
class ProductGraph {
  constructor() {
    // 邻接表：key=顶点（用户/商品），value=邻接顶点+权重的数组
    this.adjacencyList = new Map();
  }

  // 添加顶点（用户/商品）
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // 添加加权边（记录用户购买商品的行为，权重=购买次数）
  addEdge(v1, v2, weight = 1) {
    this.addVertex(v1);
    this.addVertex(v2);

    // 检查是否已存在该边，存在则累加权重，不存在则新增
    const v1Neighbors = this.adjacencyList.get(v1);
    const existingEdge = v1Neighbors.find((item) => item.vertex === v2);
    if (existingEdge) {
      existingEdge.weight += weight;
    } else {
      v1Neighbors.push({ vertex: v2, weight });
    }

    // 无向边：商品也关联用户（方便反向查找）
    const v2Neighbors = this.adjacencyList.get(v2);
    const existingEdge2 = v2Neighbors.find((item) => item.vertex === v1);
    if (existingEdge2) {
      existingEdge2.weight += weight;
    } else {
      v2Neighbors.push({ vertex: v1, weight });
    }
  }

  // 核心推荐方法：根据用户购买的商品，推荐相关商品
  getRecommendations(userId, limit = 3) {
    const visited = new Set(); // 记录已访问的顶点
    const recommendations = {}; // 存储推荐商品及总权重

    // 1. 先获取该用户购买过的所有商品
    const userNeighbors = this.adjacencyList.get(userId) || [];
    const userProducts = userNeighbors
      .filter((item) => item.vertex.startsWith("P")) // 筛选出商品（P开头）
      .map((item) => item.vertex);

    if (userProducts.length === 0) {
      return "该用户暂无购买记录，无法推荐";
    }

    // 2. 遍历用户购买的每个商品，找到购买过该商品的其他用户
    for (const product of userProducts) {
      const productNeighbors = this.adjacencyList.get(product) || [];
      const otherUsers = productNeighbors.filter(
        (item) => item.vertex.startsWith("U") && item.vertex !== userId
      ); // 排除当前用户

      // 3. 找到这些用户购买的其他商品，累加权重
      for (const user of otherUsers) {
        if (visited.has(user.vertex)) continue;
        visited.add(user.vertex);

        const otherUserProducts = this.adjacencyList.get(user.vertex) || [];
        for (const p of otherUserProducts) {
          if (p.vertex.startsWith("P") && !userProducts.includes(p.vertex)) {
            // 只推荐用户没买过的商品
            recommendations[p.vertex] =
              (recommendations[p.vertex] || 0) + p.weight;
          }
        }
      }
    }

    // 4. 按权重排序，取前N个推荐
    return Object.entries(recommendations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((item) => ({ productId: item[0], relevance: item[1] }));
  }
}

// ------------------- 测试示例 -------------------
// 1. 创建图实例
const shopGraph = new ProductGraph();

// 2. 模拟用户购买行为（构建数据）
// 用户U1：购买了P1（手机）、P2（手机壳）
shopGraph.addEdge("U1", "P1", 1);
shopGraph.addEdge("U1", "P2", 1);

// 用户U2：购买了P1（手机）、P3（耳机）、P4（充电器）
shopGraph.addEdge("U2", "P1", 1);
shopGraph.addEdge("U2", "P3", 1);
shopGraph.addEdge("U2", "P4", 1);

// 用户U3：购买了P2（手机壳）、P3（耳机）、P5（贴膜）
shopGraph.addEdge("U3", "P2", 1);
shopGraph.addEdge("U3", "P3", 1);
shopGraph.addEdge("U3", "P5", 1);

// 用户U4：购买了P1（手机）、P3（耳机）（重复购买P3，权重=2）
shopGraph.addEdge("U4", "P1", 1);
shopGraph.addEdge("U4", "P3", 2);

// 3. 为用户U1推荐商品（U1买了P1、P2，应该推荐P3、P4、P5）
console.log("为U1推荐的商品：", shopGraph.getRecommendations("U1"));
// 输出结果：
// [
//   { productId: 'P3', relevance: 4 },  // 关联度最高（U2、U3、U4都买了）
//   { productId: 'P4', relevance: 1 },  // U2买了
//   { productId: 'P5', relevance: 1 }   // U3买了
// ]

// 4. 为新用户U5推荐（无购买记录）
console.log("为U5推荐的商品：", shopGraph.getRecommendations("U5"));
// 输出：该用户暂无购买记录，无法推荐

/**
 * 代码核心逻辑讲解
  1. 扩展的图类（ProductGraph）
    加权边设计：邻接表的值不再是单纯的顶点数组，而是 { vertex: 关联顶点, weight: 权重 }，权重代表「关联度」（比如用户购买商品的次数）；
    自动补全顶点：addEdge 方法里先调用 addVertex，避免手动先加顶点的麻烦；
    权重累加：如果用户重复购买同一个商品，权重会累加（比如 U4 买了 2 次 P3，权重 = 2），关联度更高。
  2. 推荐算法核心步骤
    获取用户已购商品：先筛选出用户顶点（U 开头）关联的商品顶点（P 开头）；
    找同类用户：遍历这些商品，找到购买过该商品的其他用户（排除当前用户）；
    收集推荐商品：统计这些同类用户购买的、当前用户未买过的商品，累加权重；
    排序返回：按权重从高到低排序，取前 N 个作为推荐结果。
  3. 测试结果解读
    U1 买了 P1（手机）、P2（手机壳）；
    买 P1 的其他用户（U2、U4）还买了 P3、P4；
    买 P2 的其他用户（U3）还买了 P3、P5；
    P3 被 U2、U3、U4 都买了（权重累加 = 4），所以是最优先推荐的商品。
    四、实际业务扩展建议
    这个示例是简化版，实际电商推荐会补充这些逻辑：
    区分行为类型：把「浏览」「收藏」「购买」设置不同权重（比如购买 = 3，收藏 = 2，浏览 = 1）；
    过滤低权重商品：只推荐权重≥某值的商品，避免无效推荐；
    结合用户画像：比如 U1 是学生，优先推荐性价比高的商品；
    加入时效性：优先推荐近期热门的关联商品。
    总结

    这个示例用「加权无向图」描述「用户 - 商品」的关联关系，核心是通过邻接表遍历找到关联商品；
    推荐逻辑的本质是「基于协同过滤」：找和你有相似购买行为的用户，推荐他们买的商品；
    图的优势是能灵活处理多对多的关联关系（一个用户买多个商品，一个商品被多个用户买），比单纯的数组 / 对象更适合这类场景。
 */
