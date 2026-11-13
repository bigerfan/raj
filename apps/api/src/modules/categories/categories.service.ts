import { prisma } from "../../lib/db.js";
import { AppError } from "../../common/errors.js";

interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  children: CategoryNode[];
}

async function loadTree(): Promise<CategoryNode[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, parentId: true, slug: true, name: true },
  });

  const nodes = new Map<string, CategoryNode>(
    rows.map((r) => [
      r.id,
      { id: r.id, slug: r.slug, name: r.name, children: [] },
    ]),
  );

  const roots: CategoryNode[] = [];
  for (const r of rows) {
    const node = nodes.get(r.id)!;
    if (r.parentId === null) roots.push(node);
    else nodes.get(r.parentId)?.children.push(node); // inactive parent => whole subtree is dropped
  }
  return roots;
}

function find(
  nodes: CategoryNode[],
  slug: string,
  path: CategoryNode[] = [],
): { node: CategoryNode; path: CategoryNode[] } | null {
  for (const n of nodes) {
    if (n.slug === slug) return { node: n, path };
    const hit = find(n.children, slug, [...path, n]);
    if (hit) return hit;
  }
  return null;
}

const collectIds = (node: CategoryNode): string[] => [
  node.id,
  ...node.children.flatMap(collectIds),
];

export const getCategoryTree = () => loadTree();

export async function getCategoryBySlug(slug: string) {
  const hit = find(await loadTree(), slug);
  if (!hit) throw new AppError(404, "Category not found", "CATEGORY_NOT_FOUND");
  const { node, path } = hit;
  return {
    id: node.id,
    slug: node.slug,
    name: node.name,
    breadcrumb: path.map((p) => ({ slug: p.slug, name: p.name })),
    children: node.children.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
    })),
  };
}

/** Used by the products module so that "birthday" also lists products of its sub-categories. */
export async function getCategoryIdsWithDescendants(
  slug: string,
): Promise<string[] | null> {
  const hit = find(await loadTree(), slug);
  return hit ? collectIds(hit.node) : null;
}
