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
            }
        )

    all_nodes = persons + phones + addresses + accounts + companies + ips + devices

    # ─── 生成关系 ────────────────────────────────────
    links = []
    link_id = 1

    for pi, person in enumerate(persons):
        pid = person["id"]

        # OWNS → 2-3 部手机
        phone_count = random.randint(2, 3)
        phone_indices = random.sample(range(N), phone_count)
        for idx in phone_indices:
            links.append(
                {
                    "id": f"link-{link_id}",
                    "source": pid,
                    "target": phones[idx]["id"],
                    "linkType": "OWNS",
                    "label": "名下手机号",
                    "time": random_datetime(2015, 2024),
                }
            )
            link_id += 1

        # RESIDES_AT → 1 地址
        links.append(
            {
                "id": f"link-{link_id}",
                "source": pid,
                "target": addresses[pi]["id"],
                "linkType": "RESIDES_AT",
                "label": "居住地址",
                "time": random_datetime(2015, 2024),
            }
        )
        link_id += 1

        # WORKS_AT → 1 公司
        links.append(
            {
                "id": f"link-{link_id}",
                "source": pid,
                "target": companies[pi % len(companies)]["id"],
                "linkType": "WORKS_AT",
                "label": "工作单位",
                "time": random_datetime(2015, 2024),
            }
        )
        link_id += 1

        # HAS_ACCOUNT → 1-2 账户
        acc_count = random.randint(1, 2)
        acc_indices = random.sample(range(N), acc_count)
        for idx in acc_indices:
            links.append(
                {
                    "id": f"link-{link_id}",
                    "source": pid,
                    "target": accounts[idx]["id"],
                    "linkType": "HAS_ACCOUNT",
                    "label": "名下账户",
                    "time": random_datetime(2015, 2024),
                }
            )
            link_id += 1

        # LOGIN_IP → 2-3 IP
        ip_count = random.randint(2, 3)
        ip_indices = random.sample(range(len(ips)), min(ip_count, len(ips)))
        for idx in ip_indices:
            links.append(
                {
                    "id": f"link-{link_id}",
                    "source": pid,
                    "target": ips[idx]["id"],
                    "linkType": "LOGIN_IP",
                    "label": "登录IP",
                    "time": random_datetime(2024, 2026),
                }
            )
            link_id += 1

        # USE_DEVICE → 1-2 设备
        dev_count = random.randint(1, 2)
        dev_indices = random.sample(range(len(devices)), min(dev_count, len(devices)))
        for idx in dev_indices:
            links.append(
                {
                    "id": f"link-{link_id}",
                    "source": pid,
                    "target": devices[idx]["id"],
                    "linkType": "USE_DEVICE",
                    "label": "使用设备",
                    "time": random_datetime(2020, 2025),
                }
            )
            link_id += 1

    # 手机间通话网络（CALLED）
    call_pairs = set()
    for _ in range(N * 2):
        a = random.randint(0, N - 1)
        b = random.randint(0, N - 1)
        if a == b:
            continue
        pair = (min(a, b), max(a, b))
        if pair in call_pairs:
            continue
        call_pairs.add(pair)
        links.append(
            {
                "id": f"link-{link_id}",
                "source": phones[a]["id"],
                "target": phones[b]["id"],
                "linkType": "CALLED",
                "label": "通话记录",
                "time": random_datetime(2025, 2026),
            }
        )
        link_id += 1

    # 账户间转账网络（TRANSACTED）
    trans_pairs = set()
    for _ in range(N):
        a = random.randint(0, N - 1)
        b = random.randint(0, N - 1)
        if a == b:
            continue
        pair = (min(a, b), max(a, b))
        if pair in trans_pairs:
            continue
        trans_pairs.add(pair)
        links.append(
            {
                "id": f"link-{link_id}",
                "source": accounts[a]["id"],
                "target": accounts[b]["id"],
                "linkType": "TRANSACTED",
                "label": "转账记录",
                "time": random_datetime(2025, 2026),
            }
        )
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
                    SET r.label = $label, r.time = $time
                    """,
                    source=link["source"],
                    target=link["target"],
                    id=link["id"],
                    label=link["label"],
                    time=link["time"],
                )
            print(f"  UPSERT 关系 {min(i + batch_size, len(links))}/{len(links)}")

    driver.close()
    print("完成!")


if __name__ == "__main__":
    nodes, links = generate()
    seed_to_neo4j(nodes, links)
