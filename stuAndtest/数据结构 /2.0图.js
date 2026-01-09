class Graph {
  constructor() {
    // Map 是 JS 中的键值对集合； 键 = 顶点，值 = 该顶点的所有相邻顶点组成的数组
    this.adjacencyList = new Map();
  }

  // 添加顶点
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  // 在两个顶点之间添加一条无向边
  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1); // For undirected graph
  }

  // 广度 Breadth-First Search - uses Queue (FIFO)
  bfs(start) {
    const visited = new Set(); // 记录已访问的顶点，避免重复
    const queue = [start]; // 队列：存储待访问的顶点（FIFO）
    const result = []; // 存储遍历结果

    while (queue.length) {
      // 队列不为空就继续遍历
      const vertex = queue.shift(); // 取出队列第一个元素（队首）
      if (visited.has(vertex)) continue; // 已访问过则跳过

      visited.add(vertex); // 标记为已访问
      result.push(vertex); // 加入结果数组

      // 遍历当前顶点的所有邻居，未访问的加入队列
      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor); // 邻居加入队列
        }
      }
    }

    return result;
  }

  // 深度 Depth-First Search - uses Stack (LIFO) via recursion
  dfs(start, visited = new Set(), result = []) {
    if (visited.has(start)) return result; // 已访问则返回结果

    visited.add(start); // 标记为已访问
    result.push(start); // 加入结果数组

    // 递归遍历每个邻居
    for (const neighbor of this.adjacencyList.get(start)) {
      this.dfs(neighbor, visited, result);
    }

    return result;
  }
}

// Usage
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "C");
graph.bfs("A"); // ['A', 'B', 'C'] - level by level
graph.dfs("A"); // ['A', 'B', 'C'] - goes deep first
