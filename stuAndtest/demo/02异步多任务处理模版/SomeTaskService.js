/**
 * 任务数据服务：模拟任务的查询、状态更新
 */
class SomeTaskService {
  constructor() {
    // 模拟数据库存储任务（实际用数据库/缓存替代）
    // 从数据中查询出来
    this.tasksDB = [
      // 初始化几个测试任务
      {
        id: "task_1",
        type: "image",
        parameters: { url: "test1.jpg" },
        status: "pending",
      },
      {
        id: "task_2",
        type: "text",
        parameters: { content: "test2" },
        status: "pending",
      },
      {
        id: "task_3",
        type: "image",
        parameters: { url: "test3.jpg" },
        status: "pending",
      },
    ];
  }

  /**
   * 获取所有待处理任务（pending状态）
   */
  async getPendingTasks() {
    // 模拟数据库查询延迟,实际上是数据库查询语句，查出信息后返回
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.tasksDB.filter((task) => task.status === "pending");
  }

  /**
   * 更新任务状态
   * @param {string} taskId - 任务ID
   * @param {Object} statusInfo - 状态信息（status/progress/message/result/error）
   */
  async updateStatus(taskId, statusInfo) {
    // 模拟数据库更新延迟
    await new Promise((resolve) => setTimeout(resolve, 200));

    const task = this.tasksDB.find((t) => t.id === taskId);
    if (task) {
      // 合并状态信息（覆盖原有字段）
      Object.assign(task, statusInfo);
      console.log(
        `[任务${taskId}] 状态更新：`,
        task.status,
        `进度：${task.progress}%`
      );
    } else {
      console.warn(`[任务${taskId}] 不存在，更新失败`);
    }
  }

  /**
   * （可选）查询单个任务详情（供外部查询）
   */
  async getTaskById(taskId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.tasksDB.find((t) => t.id === taskId) || null;
  }
}

export { SomeTaskService };
