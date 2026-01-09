/**
 *  普通二叉树：分层存储，适合按层级遍历（如 BFS）；
    二叉搜索树（BST）：左子树 < 根 < 右子树，查找 / 插入 / 删除的平均时间复杂度 O (logn)；
    平衡二叉树（如 AVL、红黑树）：解决 BST 退化成链表的问题，保证最坏情况也是 O (logn)；
    堆（完全二叉树）：顶节点是极值（大顶堆 / 小顶堆），适合找 TopN、优先级排序；
    哈夫曼树：带权路径最短，适合压缩、编码；
    二叉线索树：优化遍历效率，减少栈 / 队列开销

    普通二叉树有 3 种深度优先遍历（DFS）和 1 种广度优先遍历（BFS）
    DFS: 前序遍历（根 → 左 → 右）
 */
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

//        1（根节点）
//       / \
//      2   3
//     / \
//    4   5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

// preOrderTraversal(根左右) / inOrderTraversal（左根右） / postOrderTraversal（左右根）
let result = [];
function preOrderTraversal(root) {
  if (root == null) return result;

  result.push(root.value);
  if (root.left) preOrderTraversal(root.left);
  if (root.right) preOrderTraversal(root.right);
}

function inOrderTraversal(root) {
  if (root == null) return result;

  if (root.left) inOrderTraversal(root.left);
  result.push(root.value);
  if (root.right) inOrderTraversal(root.right);
}

function postOrderTraversal(root) {
  if (root == null) return result;

  if (root.left) postOrderTraversal(root.left);
  if (root.right) postOrderTraversal(root.right);
  result.push(root.value);
}

// 广度 BFS 按层级，从上到下，从左到右
function levelOrderTraversal(root) {
  if (root === null) return [];

  const res = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift(); // 前面拿
    res.push(node.value);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return res;
}

// preOrderTraversal(root); // result [ 1, 2, 4, 5, 3 ]
// inOrderTraversal(root); // result [ 4, 2, 5, 1, 3 ]
// postOrderTraversal(root); // result [ 4, 5, 2, 3, 1 ]

result = levelOrderTraversal(root); // result [ 1, 2, 3, 4, 5 ]
console.log("result", result);
