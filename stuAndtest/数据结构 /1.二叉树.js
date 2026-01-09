// 二叉搜索树（BST） 是一种层级结构，每个节点最多有两个子节点。左边的孩子较小，右边的孩子较大。
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        // Go left
        if (!current.left) {
          current.left = node;
          return;
        }
        // 直到找到空的左节点
        current = current.left;
      } else {
        // Go right
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;

    while (current) {
      if (value === current.value) {
        return current;
      }
      current = value < current.value ? current.left : current.right;
    }

    return null;
  }

  // 左中右的深度遍历方式
  // In-order traversal: left, root, right (gives sorted order)
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
}

// Usage
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(20);

bst.search(7); // TreeNode { value: 7, ... }
bst.search(100); // null
bst.inOrder(); // [3, 5, 7, 10, 15, 20] - sorted!
