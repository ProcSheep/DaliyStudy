// 二叉搜索树核心规则：左子树的所有节点值 < 根节点值 < 右子树的所有节点值（这是 BST 的灵魂）
// BST 是「有序数据高效检索」的基础
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  // 插入节点
  insert(value) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    while (true) {
      const current = this.root;
      // 不能重复插入
      if (value === current.value) return this;

      // 遍历左子树，找到空缺插入
      if (value < current.value) {
        if (!current.left) {
          current.left = value;
          return this;
        }
        // 没有遍历到底部
        current = current.left;
      } else {
        // 遍历右子树 value > current.value
        if (!current.right) {
          current.right = value;
          return this;
        }
        current = current.right;
      }
    }
  }

  // 查找节点 O(log(n))
  find(value) {
    // 树是空的
    // if(this.root)
  }
}
