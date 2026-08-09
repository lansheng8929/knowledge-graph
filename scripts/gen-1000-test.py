"""生成 1000 节点 + 2000 边 的导入测试数据（Excel：entities/edges 两个 sheet）。

用法：python gen-1000-test.py <输出路径.xlsx>
依赖：openpyxl
"""

import random
import sys

import openpyxl

N_NODES = 1000
N_EDGES = 2000
NODE_TYPES = ["person", "phone", "company", "account", "device", "ip"]
LINK_TYPES = ["CALL", "TRANSFER", "OWNS"]

# 聚类参数：每簇节点数 + 边同簇连接概率 → 形成明显社区
CLUSTER_SIZE = 100  # 1000 节点 → 10 个簇
SAME_CLUSTER_P = 0.8  # 80% 边在同簇内，20% 跨簇噪声


def _pick_pair():
    """按聚类规则选一对节点：优先同簇（形成社区），小概率跨簇（噪声）。"""
    n_clusters = N_NODES // CLUSTER_SIZE
    while True:
        if random.random() < SAME_CLUSTER_P:
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


def main(out_path: str, id_prefix: str = "c") -> None:
    random.seed(42)

    wb = openpyxl.Workbook()
    ws_e = wb.active
    ws_e.title = "entities"
    ws_e.append(["id", "nodeType", "label", "icon"])
    for i in range(1, N_NODES + 1):
        nt = random.choice(NODE_TYPES)
        ws_e.append([f"{id_prefix}{i}", nt, f"{nt}-{i}", ""])

    ws_l = wb.create_sheet("edges")
    ws_l.append(["id", "source", "target", "linkType", "label", "amount"])
    for i in range(1, N_EDGES + 1):
        s, t = _pick_pair()
        lt = random.choice(LINK_TYPES)
        amt = random.randint(0, 100000)
        ws_l.append([f"{id_prefix}e{i}", f"{id_prefix}{s}", f"{id_prefix}{t}", lt, f"{lt}-{i}", amt])

    wb.save(out_path)
    print(f"generated: {out_path} ({N_NODES} entities, {N_EDGES} edges, "
          f"clusters={N_NODES // CLUSTER_SIZE}, same_cluster_p={SAME_CLUSTER_P})")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "kg-1000.xlsx")
