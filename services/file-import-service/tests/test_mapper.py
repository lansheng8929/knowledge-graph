"""mapper 单元测试：表格 → IR、边 id 哈希、rank、businessKey。"""

from app.ir import ParsedGraph
from app.mapper import map_tables
from app.models import ImportConfig


def _cfg(**over):
    base = {
        "tags": {
            "tenantId": "t1",
            "classification": 1,
            "owner": "dept-a",
            "visibility": "internal",
        },
    }
    base.update(over)
    return ImportConfig.model_validate(base)


def test_entities_reserved_and_props():
    tables = {
        "entities": [
            {"id": "p1", "nodeType": "person", "label": "张三", "gender": "男"}
        ]
    }
    graph: ParsedGraph = map_tables(tables, _cfg())
    assert len(graph.entities) == 1
    e = graph.entities[0]
    assert e.id == "p1"
    assert e.props == {"gender": "男"}


def test_entity_auto_id_when_missing():
    tables = {"entities": [{"nodeType": "person", "label": "张三"}]}
    graph = map_tables(tables, _cfg())
    assert graph.entities[0].id.startswith("e-")


def test_edge_id_deterministic_update_rank_zero():
    tables = {
        "entities": [
            {"id": "a", "nodeType": "person", "label": "A"},
            {"id": "b", "nodeType": "phone", "label": "B"},
        ],
        "edges": [{"source": "a", "target": "b", "linkType": "OWNS"}],
    }
    g1 = map_tables(tables, _cfg())
    g2 = map_tables(tables, _cfg())
    e1, e2 = g1.edges[0], g2.edges[0]
    assert e1.id == e2.id  # 幂等：同一输入 → 同一 id
    assert e1.rank == 0  # 公共属性：update 模式恒 0
    assert e1.time  # 公共属性：更新时间（程序写入，缺省自动填）
    assert e1.props == {}  # 无额外业务列 → props 为空


def test_edge_insert_mode_rank_increments():
    tables = {
        "entities": [
            {"id": "a", "nodeType": "person", "label": "A"},
            {"id": "b", "nodeType": "phone", "label": "B"},
        ],
        "edges": [
            {"source": "a", "target": "b", "linkType": "OWNS"},
            {"source": "a", "target": "b", "linkType": "OWNS"},
        ],
    }
    graph = map_tables(tables, _cfg(**{"edge": {"insertMode": "insert"}}))
    assert graph.edges[0].id != graph.edges[1].id
    assert graph.edges[0].rank == 0
    assert graph.edges[1].rank == 1


def test_business_key_distinguishes_edges():
    tables = {
        "entities": [
            {"id": "a", "nodeType": "account", "label": "A"},
            {"id": "b", "nodeType": "account", "label": "B"},
        ],
        "edges": [
            {"source": "a", "target": "b", "linkType": "TRANSFER", "transNo": "T1"},
            {"source": "a", "target": "b", "linkType": "TRANSFER", "transNo": "T2"},
        ],
    }
    graph = map_tables(
        tables,
        _cfg(**{"edge": {"businessKey": [{"col": "transNo"}]}}),
    )
    ids = {e.id for e in graph.edges}
    assert len(ids) == 2  # 业务键不同 → 两条独立边
    assert {e.props.get("transNo") for e in graph.edges} == {"T1", "T2"}


def test_update_mode_dedup_same_pair_same_bk():
    tables = {
        "entities": [
            {"id": "a", "nodeType": "account", "label": "A"},
            {"id": "b", "nodeType": "account", "label": "B"},
        ],
        "edges": [
            {"source": "a", "target": "b", "linkType": "TRANSFER", "transNo": "T1"},
            {"source": "a", "target": "b", "linkType": "TRANSFER", "transNo": "T1"},
        ],
    }
    graph = map_tables(tables, _cfg(**{"edge": {"businessKey": [{"col": "transNo"}]}}))
    # 业务键相同 → update 模式下同一 id（MERGE 刷新而非新增）
    assert graph.edges[0].id == graph.edges[1].id
