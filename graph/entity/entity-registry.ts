import type { NodeType } from "../type"
import type {
  EntityCreator,
  EntityRenderer,
  NodeRenderProcessorMap,
} from "./entity-types"
import { createEntity as defaultCreateEntity } from "./common"

/**
 * 实体注册表
 * 用于管理和注册所有节点类型的渲染器
 */
export class EntityRegistry<N extends string = NodeType> {
  private registry: NodeRenderProcessorMap<N> = {}
  private createEntity: (entityCreator: EntityCreator) => EntityRenderer

  /**
   * 构造函数
   * @param createEntity 可选的实体创建函数，默认使用 common 的 createEntity
   */
  constructor(createEntity?: (entityCreator: EntityCreator) => EntityRenderer) {
    this.createEntity = createEntity || defaultCreateEntity
  }

  /**
   * 注册单个实体
   * @param nodeType 节点类型
   * @param entityCreator 实体创建器函数
   */
  register(nodeType: N, entityCreator: EntityCreator): void {
    this.registry[nodeType] = this.createEntity(entityCreator)
  }

  /**
   * 批量注册实体
   * @param entities 实体映射对象
   */
  registerBatch(entities: Record<N, EntityCreator>): void {
    Object.entries(entities).forEach(([nodeType, entityCreator]) => {
      this.register(nodeType as N, entityCreator as EntityCreator)
    })
  }

  /**
   * 获取指定类型的实体渲染器
   * @param nodeType 节点类型
   */
  get(nodeType: N): EntityRenderer | undefined {
    return this.registry[nodeType]
  }

  /**
   * 获取所有已注册的实体渲染器
   */
  getAll(): NodeRenderProcessorMap<N> {
    return { ...this.registry }
  }

  /**
   * 检查是否已注册指定类型的实体
   * @param nodeType 节点类型
   */
  has(nodeType: N): boolean {
    return nodeType in this.registry
  }

  /**
   * 注销指定类型的实体
   * @param nodeType 节点类型
   */
  unregister(nodeType: N): void {
    delete this.registry[nodeType]
  }

  /**
   * 清空所有注册的实体
   */
  clear(): void {
    this.registry = {}
  }
}
