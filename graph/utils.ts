import type {
  GraphDataGenerics,
  GraphLink,
  GraphViewModel,
} from "./client/type"

export function getId(prop: any): string {
  return prop && typeof prop === "object" ? prop.id : prop
}

// 合并外部图数据到内部图数据
export const mergeModelGraphData = <G extends GraphDataGenerics>(
  prevGraphData: GraphViewModel<G> | undefined,
  newGraphData: GraphViewModel<G> | undefined,
) => {
  if (!prevGraphData) {
    return prevGraphData
  }

  // 直接修改原数据，而不是创建新对象
  newGraphData?.graphData.nodes.forEach((node) => {
    const existingNodeIndex = prevGraphData.graphData.nodes.findIndex(
      (n) => n.id === node.id,
    )

    if (existingNodeIndex !== -1) {
      const existingNode = prevGraphData.graphData.nodes[existingNodeIndex]

      if (existingNode.data && node.data) {
        // 新值覆盖旧值，保留原有的 pageIndex 和 pageSize 如果它们存在
        // existingNode.data = {
        //   ...existingNode.data,
        //   ...node.data,
        //   pageIndex:
        //     existingNode.data.pageIndex !== undefined
        //       ? existingNode.data.pageIndex
        //       : node.data.pageIndex,
        //   count:
        //     existingNode.data.count !== undefined
        //       ? existingNode.data.count
        //       : node.data.count,
        //   total:
        //     existingNode.data.total !== undefined
        //       ? existingNode.data.total
        //       : node.data.total,
        // }

        existingNode.data = node.data
      }

      if (existingNode.x === undefined) existingNode.x = node.x
      if (existingNode.y === undefined) existingNode.y = node.y
      if (existingNode.fx === undefined) existingNode.fx = node.fx
      if (existingNode.fy === undefined) existingNode.fy = node.fy
      if (existingNode.vx === undefined) existingNode.vx = node.vx
      if (existingNode.vy === undefined) existingNode.vy = node.vy
    } else {
      prevGraphData.graphData.nodes.push(node)
    }
  })

  newGraphData?.graphData.links.forEach((link) => {
    const existingLinkIndex = prevGraphData.graphData.links.findIndex(
      (l) => l.id === link.id,
    )

    if (existingLinkIndex !== -1) {
      // const existingLink = prevGraphData.graphData.links[existingLinkIndex]
      // if (existingLink.data && link.data)
      //   Object.assign(existingLink.data, link.data)
      // existingLink.source = link.source
      // existingLink.target = link.target
    } else {
      prevGraphData.graphData.links.push(link)
    }
  })

  return prevGraphData
}

export const getPaginator = (count?: number, total?: number) => {
  return `(${count !== undefined ? count : 0}/${total || 0})`
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

export const mergeObjects = <T extends object = object>(
  target: T,
  ...sources: Array<RecursivePartial<T>>
): T => {
  if (!sources.length) {
    return target
  }
  const source = sources.shift()
  if (source === undefined) {
    return target
  }

  if (isMergebleObject(target) && isMergebleObject(source)) {
    Object.keys(source).forEach(function (key: string) {
      const typedKey = key as keyof T
      if (isMergebleObject(source[typedKey])) {
        if (!target[typedKey]) {
          target[typedKey] = {} as T[keyof T]
        }
        mergeObjects(target[typedKey] as object, source[typedKey] as object)
      } else {
        target[typedKey] = source[typedKey] as T[keyof T]
      }
    })
  }

  return mergeObjects(target, ...sources)
}

const isObject = (item: unknown): boolean => {
  return item !== null && typeof item === "object"
}

const isMergebleObject = (item: unknown): item is object => {
  return isObject(item) && !Array.isArray(item)
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    const copy: unknown[] = []
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i])
    }
    return copy as T
  }

  const copy: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone((obj as Record<string, unknown>)[key])
    }
  }
  return copy as T
}

// 以新数据为主合并到原数据：添加新数据、删除原数据中不存在的数据、更新原数据中存在的数据
export const replaceModelGraphData = <G extends GraphDataGenerics>(
  prevGraphData: GraphViewModel<G> | undefined,
  newGraphData: GraphViewModel<G> | undefined,
) => {
  if (!prevGraphData || !newGraphData) {
    return prevGraphData
  }

  // 创建新数据中节点和链接的 ID 集合，用于快速查找
  const newNodeIds = new Set(newGraphData.graphData.nodes.map((n) => n.id))
  const newLinkIds = new Set(newGraphData.graphData.links.map((l) => l.id))

  // 1. 删除原数据中不存在于新数据的节点
  prevGraphData.graphData.nodes = prevGraphData.graphData.nodes.filter((node) =>
    newNodeIds.has(node.id),
  )

  // 2. 删除原数据中不存在于新数据的链接
  prevGraphData.graphData.links = prevGraphData.graphData.links.filter((link) =>
    newLinkIds.has(link.id),
  )

  // 3. 更新或添加节点
  newGraphData.graphData.nodes.forEach((node) => {
    const existingNodeIndex = prevGraphData.graphData.nodes.findIndex(
      (n) => n.id === node.id,
    )

    if (existingNodeIndex !== -1) {
      // 更新现有节点
      const existingNode = prevGraphData.graphData.nodes[existingNodeIndex]

      if (existingNode.data && node.data) {
        // 新值覆盖旧值
        existingNode.data = {
          ...existingNode.data,
          ...node.data,
        }
      }
      if (existingNode.x === undefined) existingNode.x = node.x
      if (existingNode.y === undefined) existingNode.y = node.y
      if (existingNode.fx === undefined) existingNode.fx = node.fx
      if (existingNode.fy === undefined) existingNode.fy = node.fy
      if (existingNode.vx === undefined) existingNode.vx = node.vx
      if (existingNode.vy === undefined) existingNode.vy = node.vy
    } else {
      // 添加新节点
      prevGraphData.graphData.nodes.push(node)
    }
  })

  // 4. 更新或添加链接
  newGraphData.graphData.links.forEach((link) => {
    const existingLinkIndex = prevGraphData.graphData.links.findIndex(
      (l) => l.id === link.id,
    )

    if (existingLinkIndex === -1 && link.source && link.target) {
      prevGraphData.graphData.links.push({
        ...link,
        source:
          typeof link.source === "object" && (link.source as GraphLink) !== null
            ? link.source.id!
            : link.source!,
        target:
          typeof link.target === "object" && (link.target as GraphLink) !== null
            ? link.target.id!
            : link.target!,
      })
    }
  })

  return prevGraphData
}
