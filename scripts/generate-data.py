"""
生成 10,000+ 节点模拟数据，直接写入 Neo4j。

数据规模：
  person   2000
  phone    2000
  address  1000
  account  2000
  company  1000
  ip       1000
  device   1000
  ─────────────────
  总计 ~10,000 节点

关系规模（约 25,000 条）：
  每人 2-3 部手机、1 地址、1 公司、1-2 账户、2-3 IP、1-2 设备
  手机间通话网络、账户间转账网络
"""

import random
import string
from neo4j import GraphDatabase, basic_auth

random.seed(42)

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password123"

# ─── 中文姓名生成 ────────────────────────────────────

SURNAMES = [
    "赵",
    "钱",
    "孙",
    "李",
    "周",
    "吴",
    "郑",
    "王",
    "冯",
    "陈",
    "褚",
    "卫",
    "蒋",
    "沈",
    "韩",
    "杨",
    "朱",
    "秦",
    "尤",
    "许",
    "何",
    "吕",
    "施",
    "张",
    "孔",
    "曹",
    "严",
    "华",
    "金",
    "魏",
    "陶",
    "姜",
    "戚",
    "谢",
    "邹",
    "喻",
    "柏",
    "水",
    "窦",
    "章",
    "云",
    "苏",
    "潘",
    "葛",
    "奚",
    "范",
    "彭",
    "郎",
    "鲁",
    "韦",
    "昌",
    "马",
    "苗",
    "凤",
    "花",
    "方",
    "俞",
    "任",
    "袁",
    "柳",
    "酆",
    "鲍",
    "史",
    "唐",
    "费",
    "廉",
    "岑",
    "薛",
    "雷",
    "贺",
    "倪",
    "汤",
    "滕",
    "殷",
    "罗",
    "毕",
    "郝",
    "邬",
    "安",
    "常",
    "乐",
    "于",
    "时",
    "傅",
    "皮",
    "卞",
    "齐",
    "康",
    "伍",
    "余",
    "元",
    "卜",
    "顾",
    "孟",
    "平",
    "黄",
]

GIVEN_2 = [
    "建国",
    "建军",
    "建华",
    "国强",
    "志强",
    "明",
    "亮",
    "勇",
    "军",
    "伟",
    "磊",
    "洋",
    "超",
    "文",
    "杰",
    "飞",
    "鹏",
    "斌",
    "波",
    "辉",
    "刚",
    "健",
    "峰",
    "浩",
    "涛",
    "鑫",
    "磊",
    "丽",
    "敏",
    "芳",
    "静",
    "娟",
    "秀英",
    "秀兰",
    "桂英",
    "玉兰",
    "淑珍",
    "海燕",
    "红",
    "玲",
    "婷",
    "雪",
    "梅",
    "琳",
    "萍",
    "娜",
    "丹",
    "萌",
    "茜",
    "颖",
    "瑶",
    "琦",
    "悦",
]

GIVEN_1 = "天地人和仁义礼智信德才文武忠孝勇毅廉明清"
GIVEN_1_END = "生云辉杰波涛浩强刚锋斌杰龙飞凤麟"


def random_name():
    surname = random.choice(SURNAMES)
    if random.random() < 0.6:
        return surname + random.choice(GIVEN_2)
    else:
        return surname + random.choice(GIVEN_1) + random.choice(GIVEN_1_END)


def random_phone():
    prefixes = [
        "138",
        "139",
        "150",
        "151",
        "152",
        "186",
        "187",
        "188",
        "130",
        "131",
        "132",
    ]
    return random.choice(prefixes) + "".join(random.choices(string.digits, k=8))


def random_id_card():
    """模拟身份证号"""
    area = "".join(random.choices(string.digits, k=6))
    birth = f"19{random.randint(60, 99):02d}{random.randint(1, 12):02d}{random.randint(1, 28):02d}"
    seq = "".join(random.choices(string.digits, k=3))
    check = random.choice(string.digits + "X")
    return area + birth + seq + check


def random_address():
    cities = [
        "北京市",
        "上海市",
        "广州市",
        "深圳市",
        "杭州市",
        "成都市",
        "武汉市",
        "南京市",
        "西安市",
        "重庆市",
    ]
    districts = [
        "朝阳区",
        "浦东新区",
        "天河区",
        "南山区",
        "西湖区",
        "武侯区",
        "洪山区",
        "鼓楼区",
        "雁塔区",
        "渝北区",
    ]
    streets = [
        "中山路",
        "人民路",
        "解放路",
        "建设路",
        "和平路",
        "长安街",
        "南京路",
        "淮海路",
        "春熙路",
        "王府井",
    ]
    return f"{random.choice(cities)}{random.choice(districts)}{random.choice(streets)}{random.randint(1, 999)}号"


def random_company():
    prefixes = ["深圳", "北京", "上海", "广州", "杭州", "成都", "武汉", "南京"]
    middles = [
        "华",
        "科",
        "创",
        "鑫",
        "鼎",
        "盛",
        "恒",
        "瑞",
        "智",
        "联",
        "通",
        "达",
        "博",
        "雅",
        "锐",
    ]
    suffixes = [
        "科技有限公司",
        "信息技术有限公司",
        "数据服务有限公司",
        "网络科技有限公司",
        "咨询管理有限公司",
    ]
    return f"{random.choice(prefixes)}{''.join(random.choices(middles, k=2))}{random.choice(suffixes)}"


def random_account():
    banks = ["中国银行", "工商银行", "建设银行", "农业银行", "招商银行", "交通银行"]
    return f"{random.choice(banks)}_{''.join(random.choices(string.digits, k=12))}"


def random_ip():
    return f"{random.randint(10, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"


def random_device():
    brands = ["iPhone", "Samsung", "Xiaomi", "Huawei", "OPPO", "Vivo"]
    models = ["14 Pro", "S24", "13", "P60", "Find X7", "X100"]
    return f"{random.choice(brands)}-{random.choice(models)}-{''.join(random.choices(string.hexdigits.upper(), k=8))}"


def random_datetime(start_year=2018, end_year=2026):
    """生成随机的 ISO 8601 时间字符串"""
    year = random.randint(start_year, end_year)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return f"{year:04d}-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}:{second:02d}Z"


# ─── 聚类 / 亲密度 ────────────────────────────────────
CLUSTER_SIZE = 60  # 每簇实体数（统一编号规则：i//CLUSTER_SIZE 相同 → 同簇/团伙）


def cluster_of(i: int) -> str:
    """按统一编号规则分簇：i//CLUSTER_SIZE 相同 → 同簇（团伙）。"""
    return f"c{i // CLUSTER_SIZE + 1}"


def intimacy_between(c1: str, c2: str) -> float:
    """亲密度（边聚类属性）：同簇高（0.70~1.00），跨簇低（0.10~0.45）。"""
    if c1 == c2:
        return round(random.uniform(0.70, 1.00), 2)
    return round(random.uniform(0.10, 0.45), 2)


def pick_entity_indices(
    owner_i: int, total: int, count: int, same_cluster_prob: float = 0.8
):
    """为 owner 选关联实体索引：优先同簇（形成聚类），小概率跨簇（噪声）。"""
    lo = (owner_i // CLUSTER_SIZE) * CLUSTER_SIZE
    hi = min(lo + CLUSTER_SIZE, total)
    same_pool = list(range(lo, hi))
    picked: list[int] = []
    attempts = 0
    while len(picked) < count and attempts < count * 30:
        attempts += 1
        if same_pool and random.random() < same_cluster_prob:
            idx = random.choice(same_pool)
        else:
            idx = random.randint(0, total - 1)
        if idx not in picked:
            picked.append(idx)
    while len(picked) < count:
        idx = random.randint(0, total - 1)
        if idx not in picked:
            picked.append(idx)
    return picked


def pick_pair(total: int, same_cluster_prob: float = 0.75):
    """CALLED/TRANSACTED 配对：优先同簇（形成团伙内网络），小概率跨簇。"""
    if random.random() < same_cluster_prob:
        lo = random.randrange(0, max(1, total), CLUSTER_SIZE)
        hi = min(lo + CLUSTER_SIZE, total)
        if hi - lo >= 2:
            return random.randint(lo, hi - 1), random.randint(lo, hi - 1)
    return random.randint(0, total - 1), random.randint(0, total - 1)


def make_link(
    link_id: int,
    source: str,
    target: str,
    link_type: str,
    label: str,
    time: str,
    src_c: str,
    tgt_c: str,
) -> dict:
    """构造带聚类属性（intimacy/clusterId）的边。"""
    return {
        "id": f"link-{link_id}",
        "source": source,
        "target": target,
        "linkType": link_type,
        "label": label,
        "time": time,
        "intimacy": intimacy_between(src_c, tgt_c),
        "clusterId": src_c if src_c == tgt_c else src_c,
    }


# ─── 数据生成 ────────────────────────────────────────


def generate():
    print("生成模拟数据...")

    N = 2000  # 人数

    persons = []
    for i in range(N):
        persons.append(
            {
                "id": f"person-{i + 1}",
                "nodeType": "person",
                "label": random_name(),
                "icon": "person",
                "caseWeight": random.randint(1, 10),
                "gender": random.choice(["男", "女"]),
                "age": random.randint(18, 80),
                "clusterId": cluster_of(i),
            }
        )

    phones = []
    for i in range(N):
        phones.append(
            {
                "id": f"phone-{i + 1}",
                "nodeType": "phone",
                "label": random_phone(),
                "icon": "phone",
                "clusterId": cluster_of(i),
            }
        )

    addresses = []
    used_addresses = set()
    for i in range(N):
        addr = random_address()
        while addr in used_addresses:
            addr = random_address()
        used_addresses.add(addr)
        addresses.append(
            {
                "id": f"address-{i + 1}",
                "nodeType": "address",
                "label": addr,
                "icon": "address",
                "clusterId": cluster_of(i),
            }
        )

    accounts = []
    for i in range(N):
        accounts.append(
            {
                "id": f"account-{i + 1}",
                "nodeType": "account",
                "label": random_account(),
                "icon": "account",
                "clusterId": cluster_of(i),
            }
        )

    companies = []
    used_companies = set()
    for i in range(N // 2):
        c = random_company()
        while c in used_companies:
            c = random_company()
        used_companies.add(c)
        companies.append(
            {
                "id": f"company-{i + 1}",
                "nodeType": "company",
                "label": c,
                "icon": "company",
                "clusterId": cluster_of(i),
            }
        )

    ips = []
    used_ips = set()
    for i in range(N // 2):
        ip = random_ip()
        while ip in used_ips:
            ip = random_ip()
        used_ips.add(ip)
        ips.append(
            {
                "id": f"ip-{i + 1}",
                "nodeType": "ip",
                "label": ip,
                "icon": "ip",
                "clusterId": cluster_of(i),
            }
        )

    devices = []
    used_devices = set()
    for i in range(N // 2):
        d = random_device()
        while d in used_devices:
            d = random_device()
        used_devices.add(d)
        devices.append(
            {
                "id": f"device-{i + 1}",
                "nodeType": "device",
                "label": d,
                "icon": "device",
                "clusterId": cluster_of(i),
            }
        )

    all_nodes = persons + phones + addresses + accounts + companies + ips + devices

    # ─── 生成关系 ────────────────────────────────────
    links = []
    link_id = 1

    for pi, person in enumerate(persons):
        pid = person["id"]
        pc = person["clusterId"]

        # OWNS → 2-3 部手机（优先同簇）
        phone_count = random.randint(2, 3)
        for idx in pick_entity_indices(pi, N, phone_count):
            links.append(make_link(link_id, pid, phones[idx]["id"], "OWNS",
                                   "名下手机号", random_datetime(2015, 2024), pc, phones[idx]["clusterId"]))
            link_id += 1

        # RESIDES_AT → 1 地址（同簇）
        links.append(make_link(link_id, pid, addresses[pi]["id"], "RESIDES_AT",
                               "居住地址", random_datetime(2015, 2024), pc, addresses[pi]["clusterId"]))
        link_id += 1

        # WORKS_AT → 1 公司（同簇）
        links.append(make_link(link_id, pid, companies[pi % len(companies)]["id"], "WORKS_AT",
                               "工作单位", random_datetime(2015, 2024), pc,
                               companies[pi % len(companies)]["clusterId"]))
        link_id += 1

        # HAS_ACCOUNT → 1-2 账户（优先同簇）
        acc_count = random.randint(1, 2)
        for idx in pick_entity_indices(pi, N, acc_count):
            links.append(make_link(link_id, pid, accounts[idx]["id"], "HAS_ACCOUNT",
                                   "名下账户", random_datetime(2015, 2024), pc, accounts[idx]["clusterId"]))
            link_id += 1

        # LOGIN_IP → 2-3 IP（优先同簇）
        ip_count = random.randint(2, 3)
        for idx in pick_entity_indices(pi, len(ips), ip_count):
            links.append(make_link(link_id, pid, ips[idx]["id"], "LOGIN_IP",
                                   "登录IP", random_datetime(2024, 2026), pc, ips[idx]["clusterId"]))
            link_id += 1

        # USE_DEVICE → 1-2 设备（优先同簇）
        dev_count = random.randint(1, 2)
        for idx in pick_entity_indices(pi, len(devices), dev_count):
            links.append(make_link(link_id, pid, devices[idx]["id"], "USE_DEVICE",
                                   "使用设备", random_datetime(2020, 2025), pc, devices[idx]["clusterId"]))
            link_id += 1

    # 手机间通话网络（CALLED，优先同簇 → 团伙内高频通话）
    call_pairs = set()
    for _ in range(N * 2):
        a, b = pick_pair(N)
        if a == b:
            continue
        pair = (min(a, b), max(a, b))
        if pair in call_pairs:
            continue
        call_pairs.add(pair)
        links.append(make_link(link_id, phones[a]["id"], phones[b]["id"], "CALLED",
                               "通话记录", random_datetime(2025, 2026),
                               phones[a]["clusterId"], phones[b]["clusterId"]))
        link_id += 1

    # 账户间转账网络（TRANSACTED，优先同簇）
    trans_pairs = set()
    for _ in range(N):
        a, b = pick_pair(N)
        if a == b:
            continue
        pair = (min(a, b), max(a, b))
        if pair in trans_pairs:
            continue
        trans_pairs.add(pair)
        links.append(make_link(link_id, accounts[a]["id"], accounts[b]["id"], "TRANSACTED",
                               "转账记录", random_datetime(2025, 2026),
                               accounts[a]["clusterId"], accounts[b]["clusterId"]))
        link_id += 1

    print(f"生成 {len(all_nodes)} 节点, {len(links)} 关系")
    return all_nodes, links


# ─── 写入 Neo4j ──────────────────────────────────────


def seed_to_neo4j(nodes, links):
    driver = GraphDatabase.driver(
        NEO4J_URI, auth=basic_auth(NEO4J_USER, NEO4J_PASSWORD)
    )
    with driver.session() as session:
        batch_size = 200

        # ─── UPSERT 节点 ─────────────────────────────
        for i in range(0, len(nodes), batch_size):
            batch = nodes[i : i + batch_size]
            for node in batch:
                node_type = node.pop("nodeType")
                node_id = node["id"]
                session.run(
                    f"""
                    MERGE (n:{node_type} {{id: $id}})
                    SET n += $props
                    """,
                    id=node_id,
                    props=node,
                )
            print(f"  UPSERT 节点 {min(i + batch_size, len(nodes))}/{len(nodes)}")

        # ─── UPSERT 关系 ─────────────────────────────
        for i in range(0, len(links), batch_size):
            batch = links[i : i + batch_size]
            for link in batch:
                lt = link["linkType"]
                session.run(
                    f"""
                    MATCH (s {{id: $source}})
                    MATCH (t {{id: $target}})
                    MERGE (s)-[r:{lt} {{id: $id}}]->(t)
                    SET r.label = $label, r.time = $time,
                        r.intimacy = $intimacy, r.clusterId = $clusterId
                    """,
                    source=link["source"],
                    target=link["target"],
                    id=link["id"],
                    label=link["label"],
                    time=link["time"],
                    intimacy=link.get("intimacy", 0.5),
                    clusterId=link.get("clusterId", "c-unknown"),
                )
            print(f"  UPSERT 关系 {min(i + batch_size, len(links))}/{len(links)}")

    driver.close()
    print("完成!")


if __name__ == "__main__":
    nodes, links = generate()
    seed_to_neo4j(nodes, links)
