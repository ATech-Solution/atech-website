import type { LayoutBlock, LayoutTree } from '../types'
import { generateId } from './uuid'

// ── Read helpers ─────────────────────────────────────────────────────────────

/** Find a node anywhere in the tree by ID. Returns [node, parent[], index]. */
export function findNode(
  tree: LayoutTree,
  id: string,
  parents: LayoutBlock[] = [],
): [LayoutBlock, LayoutBlock[], number] | null {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.id === id) return [node, parents, i]
    if (node.children.length > 0) {
      const found = findNode(node.children, id, [...parents, node])
      if (found) return found
    }
  }
  return null
}

/** Get a flat ordered list of all node IDs (depth-first). */
export function flattenIds(tree: LayoutTree): string[] {
  const ids: string[] = []
  const walk = (nodes: LayoutBlock[]) => {
    for (const node of nodes) {
      ids.push(node.id)
      walk(node.children)
    }
  }
  walk(tree)
  return ids
}

// ── Mutating helpers (all return a new tree — never mutate in place) ──────────

function cloneTree(tree: LayoutTree): LayoutTree {
  return JSON.parse(JSON.stringify(tree))
}

function getChildren(tree: LayoutTree, parentId: string | null): LayoutBlock[] {
  if (!parentId) return tree
  const found = findNode(tree, parentId)
  return found ? found[0].children : tree
}

function setChildrenAt(
  tree: LayoutTree,
  parentId: string | null,
  children: LayoutBlock[],
): LayoutTree {
  if (!parentId) return children
  const clone = cloneTree(tree)
  const walk = (nodes: LayoutBlock[]) => {
    for (const node of nodes) {
      if (node.id === parentId) {
        node.children = children
        return
      }
      walk(node.children)
    }
  }
  walk(clone)
  return clone
}

/** Reindex `order` field after mutations. */
function reindex(nodes: LayoutBlock[]): LayoutBlock[] {
  return nodes.map((n, i) => ({ ...n, order: i }))
}

// ── Public operations ─────────────────────────────────────────────────────────

/**
 * Add a new block after `afterId` inside `parentId`.
 * If `afterId` is null, appends to the end of `parentId`'s children.
 * If `parentId` is null, operates on root level.
 */
export function addNode(
  tree: LayoutTree,
  node: Omit<LayoutBlock, 'id' | 'order'>,
  parentId: string | null,
  afterId: string | null,
): LayoutTree {
  const clone = cloneTree(tree)
  const siblings = getChildren(clone, parentId)
  const newNode: LayoutBlock = { ...node, id: generateId(), order: 0, children: node.children ?? [] }

  if (!afterId) {
    siblings.push(newNode)
  } else {
    const idx = siblings.findIndex((n) => n.id === afterId)
    siblings.splice(idx + 1, 0, newNode)
  }

  return setChildrenAt(clone, parentId, reindex(siblings))
}

/** Remove a node by ID from anywhere in the tree. */
export function removeNode(tree: LayoutTree, id: string): LayoutTree {
  const clone = cloneTree(tree)
  const result = findNode(clone, id)
  if (!result) return clone

  const [, parents, index] = result
  const parent = parents[parents.length - 1]
  const siblings = parent ? parent.children : clone

  siblings.splice(index, 1)
  reindex(siblings)

  return clone
}

/** Rename a node by ID. */
export function renameNode(tree: LayoutTree, id: string, name: string): LayoutTree {
  const clone = cloneTree(tree)
  const result = findNode(clone, id)
  if (!result) return clone
  result[0].name = name
  return clone
}

/** Update overrides for a node by ID. */
export function updateNodeOverrides(
  tree: LayoutTree,
  id: string,
  overrides: LayoutBlock['overrides'],
): LayoutTree {
  const clone = cloneTree(tree)
  const result = findNode(clone, id)
  if (!result) return clone
  result[0].overrides = overrides
  return clone
}

/**
 * Move a node to a new position.
 * Removes from current location, inserts after `afterId` inside `newParentId`.
 */
export function moveNode(
  tree: LayoutTree,
  id: string,
  newParentId: string | null,
  afterId: string | null,
): LayoutTree {
  const result = findNode(tree, id)
  if (!result) return tree

  const [node] = result
  const { children, overrides, blockType, blockId, name, detached, templateSnapshot } = node

  // Remove from old position
  let next = removeNode(tree, id)

  // Re-insert at new position
  next = addNode(
    next,
    { blockType, blockId, name, children, overrides, detached, templateSnapshot } as any,
    newParentId,
    afterId,
  )

  // Restore original ID (addNode generates a new one — swap it back)
  const clone = cloneTree(next)
  const inserted = findNode(clone, clone.find ? '' : '')

  // Find the newly inserted node (it has a fresh ID) and restore the original
  // We do this by replacing the last-added node at the target position
  const siblings = getChildren(clone, newParentId)
  const insertedIdx = afterId
    ? siblings.findIndex((n) => n.id === afterId) + 1
    : siblings.length - 1

  if (siblings[insertedIdx]) {
    siblings[insertedIdx].id = id
  }

  return clone
}

/**
 * Nest a node inside a container by making it the last child of `containerId`.
 */
export function nestNode(
  tree: LayoutTree,
  id: string,
  containerId: string,
): LayoutTree {
  const containerResult = findNode(tree, containerId)
  if (!containerResult) return tree
  const [container] = containerResult
  const lastChild = container.children[container.children.length - 1]
  return moveNode(tree, id, containerId, lastChild?.id ?? null)
}

/**
 * Un-nest a node — move it to the root level (or parent's parent),
 * placed immediately after its current parent container.
 */
export function unnestNode(tree: LayoutTree, id: string): LayoutTree {
  const result = findNode(tree, id)
  if (!result) return tree
  const [, parents] = result

  if (parents.length === 0) return tree // already at root

  const directParent = parents[parents.length - 1]
  const grandParentId = parents.length >= 2 ? parents[parents.length - 2].id : null

  return moveNode(tree, id, grandParentId, directParent.id)
}

/** Toggle expanded state for a container node. */
export function toggleExpanded(expandedIds: Set<string>, id: string): Set<string> {
  const next = new Set(expandedIds)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  return next
}
