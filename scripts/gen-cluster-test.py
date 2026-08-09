"""生成强聚类效果的导入测试数据（Excel：entities/edges 两个 sheet）。

相比旧版 gen-1000-test.py（1000 节点 + 2000 边、同簇 80%）：
  - 边更少：默认 1400 条（减少 30%）；
  - 聚类更强：
      ① 每簇做「环形保底」连接（i→i+1，末→首），保证每簇强连通成一团；
      ② 其余边 95% 落在同簇（SAME_CLUSTER_P=0.95），仅 5% 跨簇噪声。
    同簇边占比 ≈ (1000 保底 + 400×0.95) / 1400 ≈ 98.6%。

用法：
  python gen-cluster-test.py [out.xlsx]
  python gen-cluster-test.py kg-1000-cluster2.xlsx --edges 1400 --same-cluster-p 0.95 --prefix c
依赖：openpyxl
"""

import argparse
import random
import sys

import openpyxl

N_NODES = 1000
NODE_TYPES = ["person", "phone", "company", "account", "device", "ip"]
LINK_TYPES = ["CALL", "TRANSFER", "OWNS"]

# 聚类参数
CLUSTER_SIZE = 100  # 1000 节点 → 10 个簇
SAME_CLUSTER_P = 0.95  # 随机边同簇概率（跨簇=噪声）
N_EDGES = 1400  # 总边数（旧版 2000 → 减少 30%）


def _pick_pair(same_cluster_p: float):
    """按聚类规则选一对节点：优先同簇（形成社区），小概率跨簇（噪声）。"""
    n_clusters = N_NODES // CLUSTER_SIZE
    while True:
        if random.random() < same_cluster_p:
            c = random.randrange(0, n_clusters)
            lo = c * CLUSTER_SIZE + 1
            hi = min(lo + CLUSTER_SIZE - 1, N_NODES)
            s = random.randint(lo, hi)
            t = random.randint(lo, hi)
        else:
            s = random.randint(1, N_NODES)
            t = random.randint(1, N_NODES)
        if s != t:
            return s, t


def main(
    out_path: str,
    id_prefix: str = "c",
    n_edges: int = N_EDGES,
    same_cluster_p: float = SAME_CLUSTER_P,
) -> None:
    random.seed(42)

    n_clusters = N_NODES // CLUSTER_SIZE

    # ── 边集合：环形保底 + 随机补充 ────────────────
    edges: list[tuple[int, int]] = []
    seen: set[tuple[int, int]] = set()

    def add(s: int, t: int) -> None:
        key = (min(s, t), max(s, t))
        if key in seen:
            return
        seen.add(key)
        edges.append((s, t))

    # ① 每簇环形保底：i→i+1，末→首 → 每簇必然连通成团
    for c in range(n_clusters):
        lo = c * CLUSTER_SIZE + 1
        hi = lo + CLUSTER_SIZE - 1
        for i in range(lo, hi):
            add(i, i + 1)
        add(hi, lo)

    # ② 随机补充到目标边数（高同簇概率 + 少量跨簇噪声）
    while len(edges) < n_edges:
        add(*_pick_pair(same_cluster_p))

    # ── 写 Excel ──────────────────────────────────
    wb = openpyxl.Workbook()
    ws_e = wb.active
    ws_e.title = "entities"
    ws_e.append(["id", "nodeType", "label", "icon"])
    for i in range(1, N_NODES + 1):
        nt = random.choice(NODE_TYPES)
        ws_e.append([f"{id_prefix}{i}", nt, f"{nt}-{i}", ""])

    ws_l = wb.create_sheet("edges")
    ws_l.append(["id", "source", "target", "linkType", "label", "amount"])
    for i, (s, t) in enumerate(edges, 1):
        lt = random.choice(LINK_TYPES)
        amt = random.randint(0, 100000)
        ws_l.append(
            [f"{id_prefix}e{i}", f"{id_prefix}{s}", f"{id_prefix}{t}", lt, f"{lt}-{i}", amt]
        )

    wb.save(out_path)

    # ── 统计聚类效果 ──────────────────────────────
    same = sum(
        1
        for s, t in edges
        if (s - 1) // CLUSTER_SIZE == (t - 1) // CLUSTER_SIZE
    )
    cross = len(edges) - same
    print(
        f"generated: {out_path} "
        f"({N_NODES} entities, {len(edges)} edges, "
        f"clusters={n_clusters}, same_cluster_p={same_cluster_p})\n"
        f"  同簇 {same} ({same / len(edges):.1%}) / 跨簇 {cross} ({cross / len(edges):.1%})"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="生成强聚类导入测试数据")
    parser.add_argument("out", nargs="?", default="kg-1000-cluster2.xlsx")
    parser.add_argument("--prefix", default="c")
    parser.add_argument("--edges", type=int, default=N_EDGES)
    parser.add_argument("--same-cluster-p", type=float, default=SAME_CLUSTER_P)
    args = parser.parse_args()
    main(args.out, id_prefix=args.prefix, n_edges=args.edges, same_cluster_p=args.same_cluster_p)
