import { SomeTaskService } from "./SomeTaskService.js"; // 任务数据服务
import { ResourceManager } from "./ResourceManager.js"; // 资源管理工具

// 任务进程类
class TaskProcessor {
  constructor(config = {}) {
    // 配置参数
    this.config = {
      maxConcurrency: 100, // 默认最大并发数
      queueCheckInterval: 3000, // 队列检查间隔(ms)
      ...config,
    };

    // 核心状态管理
    this.taskQueue = []; // 待处理任务队列
    this.activeTasks = new Set(); // 正在执行的任务ID集合
    this.isProcessing = false; // 处理器运行状态
    this.lastProcessTime = 0; // 上次处理时间戳
    this.minInterval = 1000; // 最小处理间隔(ms)

    // 依赖服务初始化
    this.taskService = new SomeTaskService();
    this.resourceManager = new ResourceManager();
  }

  /**
   * 从数据源加载待处理任务
   */
  async loadPendingTasks() {
    try {
      const pendingTasks = await this.taskService.getPendingTasks();
      // 新入队的任务 不能是 待处理任务队列/正在执行任务
      const newTasks = pendingTasks.filter(
        (task) =>
          !this.taskQueue.some((t) => t.id === task.id) &&
          !this.activeTasks.has(task.id)
      );

      this.taskQueue.push(...newTasks);
      return newTasks.length;
    } catch (error) {
      console.error("加载任务失败:", error);
      return 0;
    }
  }

  /**
   * 启动任务处理器
   */
  async start() {
    if (this.isProcessing) return; // 处理器在运行中，不要重复启动

    const now = Date.now();
    if (now - this.lastProcessTime < this.minInterval) {
      console.log("处理间隔过短，跳过本次启动");
      return;
    }

    this.isProcessing = true;
    this.lastProcessTime = now;
    console.log("任务处理器已启动");

    // 主处理循环
    while (this.isProcessing) {
      // 填充任务队列
      if (this.taskQueue.length === 0) {
        const addedCount = await this.loadPendingTasks();
        if (addedCount === 0 && this.activeTasks.size === 0) {
          // 无任务可处理时停止
          this.stop();
          break;
        }
        if (addedCount === 0) {
          // 队列空但有活跃任务，等待后重试
          await this.sleep(this.queueCheckInterval);
          continue;
        }
      }

      // 检查并发限制
      if (this.activeTasks.size >= this.config.maxConcurrency) {
        await this.sleep(100);
        continue;
      }

      // 取出任务执行
      const task = this.taskQueue.shift();
      this.processTask(task).catch((error) => {
        console.error(`任务 ${task.id} 处理出错:`, error);
      });
    }

    console.log("任务处理器已停止");
  }

  /**
   * 停止任务处理器
   */
  stop() {
    this.isProcessing = false;
  }

  /**
   * 处理单个任务
   * @param {Object} task - 任务对象
   */
  async processTask(task) {
    const { id } = task;
    let progressInterval = null;

    try {
      // 标记任务为活跃
      this.activeTasks.add(id);

      // 初始化任务状态
      await this.updateTaskStatus(id, {
        status: "processing",
        progress: 0,
        message: "任务开始处理",
      });

      const startTime = Date.now();

      // 启动进度更新定时器
      progressInterval = setInterval(async () => {
        const elapsed = Date.now() - startTime;
        const progress = this.calculateProgress(elapsed, task);
        await this.updateTaskStatus(id, {
          progress,
          message: `处理中 (${progress}%)`,
        });
      }, 1000);

      // 资源检查与获取
      const resource = await this.resourceManager.acquireResource(task.type);
      if (!resource) {
        throw new Error("无法获取处理资源");
      }

      // 执行核心任务逻辑
      const result = await this.executeTaskLogic(task, resource);

      // 任务完成处理
      clearInterval(progressInterval);
      await this.updateTaskStatus(id, {
        status: "completed",
        progress: 100,
        message: "任务处理完成",
        result,
      });
    } catch (error) {
      clearInterval(progressInterval);
      await this.updateTaskStatus(id, {
        status: "failed",
        progress: 100,
        message: error.message || "任务处理失败",
        error: error.message,
      });
    } finally {
      // 清理资源
      this.activeTasks.delete(id);
      this.resourceManager.releaseResource(task.type);
    }
  }

  /**
   * 计算任务进度
   * @param {number} elapsed - 已耗时(ms)
   * @param {Object} task - 任务对象
   */
  calculateProgress(elapsed, task) {
    // 根据实际业务逻辑计算进度
    const baseProgress = Math.min(90, Math.floor(elapsed / 1000));
    return baseProgress;
  }

  /**
   * 执行具体任务逻辑
   * @param {Object} task - 任务对象
   * @param {Object} resource - 资源对象
   */
  async executeTaskLogic(task, resource) {
    // 实际任务处理逻辑
    // 例如：调用外部API、处理数据、生成内容等
    return await resource.process(task.parameters);
  }

  /**
   * 更新任务状态
   * @param {string} taskId - 任务ID
   * @param {Object} status - 状态信息
   */
  async updateTaskStatus(taskId, status) {
    try {
      await this.taskService.updateStatus(taskId, status);
    } catch (error) {
      console.error(`更新任务 ${taskId} 状态失败:`, error);
    }
  }

  /**
   * 休眠工具函数
   * @param {number} ms - 毫秒数
   */
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default TaskProcessor;
