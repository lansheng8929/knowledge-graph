import type { NodeType } from "../type"
import type { GraphDataGenerics } from "../client"
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
export class EntityRegistry<G extends GraphDataGenerics> {
  private registry: NodeRenderProcessorMap<G> = {}
  private createEntity: (entityCreator: EntityCreator<G>) => EntityRenderer<G>

  /**
   * 构造函数
   * @param createEntity 可选的实体创建函数，默认使用 common 的 createEntity
   */
  constructor(
    createEntity?: (entityCreator: EntityCreator<G>) => EntityRenderer<G>
  ) {
    this.createEntity = createEntity || (defaultCreateEntity as any)
  }

  /**
   * 注册单个实体
   * @param nodeType 节点类型
   * @param entityCreator 实体创建器函数
   */
  register(nodeType: G["NT"], entityCreator: EntityCreator<G>): void {
    this.registry[nodeType] = this.createEntity(entityCreator)
  }

  /**
   * 批量注册实体
   * @param entities 实体映射对象
   */
  registerBatch(entities: Record<G["NT"], EntityCreator<G>>): void {
    Object.entries(entities).forEach(([nodeType, entityCreator]) => {
      this.register(nodeType as G["NT"], entityCreator as EntityCreator<G>)
    })
  }

  /**
   * 获取指定类型的实体渲染器
   * @param nodeType 节点类型
   */
  get(nodeType: G["NT"]): EntityRenderer<G> | undefined {
    return this.registry[nodeType]
  }

  /**
   * 获取所有已注册的实体渲染器
   */
  getAll(): NodeRenderProcessorMap<G> {
    return { ...this.registry }
  }

  /**
   * 检查是否已注册指定类型的实体
   * @param nodeType 节点类型
   */
  has(nodeType: G["NT"]): boolean {
    return nodeType in this.registry
  }

  /**
   * 注销指定类型的实体
   * @param nodeType 节点类型
   */
  unregister(nodeType: G["NT"]): void {
    delete this.registry[nodeType]
  }

  /**
   * 清空所有注册的实体
   */
  clear(): void {
    this.registry = {}
  }
}
