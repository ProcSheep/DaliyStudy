/**
 * 资源管理工具：控制资源的占用与释放，避免资源耗尽
 */
class ResourceManager {
  constructor() {
    // 模拟可分配的资源（按任务类型分类）
    this.resources = {
      image: { total: 2, used: 0, instances: ["image-res-1", "image-res-2"] }, // 图片处理资源：2个
      text: {
        total: 3,
        used: 0,
        instances: ["text-res-1", "text-res-2", "text-res-3"],
      }, // 文本处理资源：3个
    };
  }

  /**
   * 获取资源（如果资源耗尽，会等待直到有空闲资源）
   * @param {string} resourceType - 资源类型（如：image/text）
   */
  async acquireResource(resourceType) {
    const resourceConfig = this.resources[resourceType];
    if (!resourceConfig) {
      throw new Error(`不支持的资源类型：${resourceType}`);
    }

    // 循环等待，直到有空闲资源
    while (resourceConfig.used >= resourceConfig.total) {
      console.log(
        `[资源${resourceType}] 已耗尽（当前占用${resourceConfig.used}/${resourceConfig.total}），等待释放...`
      );
      await new Promise((resolve) => setTimeout(resolve, 500)); // 每500ms检查一次
    }

    // 分配一个空闲资源（简单取第一个可用的）
    resourceConfig.used += 1;
    const resourceInstance = resourceConfig.instances[resourceConfig.used - 1];
    console.log(
      `[资源${resourceType}] 分配成功：${resourceInstance}（当前占用${resourceConfig.used}/${resourceConfig.total}）`
    );
    return {
      type: resourceType,
      instanceId: resourceInstance,
      // 资源自带的处理方法（实际项目中是资源的核心功能，如调用API、处理数据）
      process: async (params) => {
        // 模拟资源处理耗时（不同类型任务耗时不同）
        const delay = resourceType === "image" ? 2000 : 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        // 模拟处理结果
        return `[${resourceInstance}] 处理完成，参数：${JSON.stringify(
          params
        )}`;
      },
    };
  }

  /**
   * 释放资源
   * @param {string} resourceType - 资源类型
   */
  releaseResource(resourceType) {
    const resourceConfig = this.resources[resourceType];
    if (resourceConfig && resourceConfig.used > 0) {
      resourceConfig.used -= 1;
      console.log(
        `[资源${resourceType}] 释放成功（当前占用${resourceConfig.used}/${resourceConfig.total}）`
      );
    }
  }
}

export { ResourceManager };
