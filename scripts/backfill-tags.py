#!/usr/bin/env python3
"""存量数据补标（T3.1.3）：为缺失标签的节点/边填充默认值。

默认标签见 services/graph-ingestion/app/tags.py：tenantId=default, classification=0,
owner=system, visibility=internal。幂等（只处理标签缺失的）。
"""

import os

from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password123")

DEFAULTS = {
    "tenantId": "default",
    "classification": 0,
    "owner": "system",
    "visibility": "internal",
}


def main() -> None:
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            # 统计缺失
            node_missing = session.run(
                "MATCH (n) WHERE n.tenantId IS NULL RETURN count(n) AS c"
            ).single()["c"]
            link_missing = session.run(
                "MATCH ()-[r]->() WHERE r.tenantId IS NULL RETURN count(r) AS c"
            ).single()["c"]
            print(f"待补标节点: {node_missing}, 关系: {link_missing}")

            # 补标（幂等）
            session.run(
                """MATCH (n) WHERE n.tenantId IS NULL
                   SET n.tenantId = $tenantId, n.classification = $classification,
                       n.owner = $owner, n.visibility = $visibility""",
                **DEFAULTS,
            )
            session.run(
                """MATCH ()-[r]->() WHERE r.tenantId IS NULL
                   SET r.tenantId = $tenantId, r.classification = $classification,
                       r.owner = $owner, r.visibility = $visibility""",
                **DEFAULTS,
            )
            print("补标完成")
    finally:
        driver.close()


if __name__ == "__main__":
    main()
