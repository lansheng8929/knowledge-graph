"""validator 单元测试。"""

from app.ir import ParsedEdge, ParsedEntity, ParsedGraph
from app.models import ImportConfig
from app.validator import validate


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


def _graph(entities=None, edges=None):
    return ParsedGraph(
        entities=entities or [ParsedEntity(id="a", nodeType="person", label="A")],
        edges=edges or [],
    )


def test_duplicate_entity_id():
    g = _graph(
        entities=[
            ParsedEntity(id="a", nodeType="person", label="A"),
            ParsedEntity(id="a", nodeType="person", label="B"),
        ]
    )
    res = validate(g, _cfg())
    assert any("duplicate entity id: a" in e for e in res.errors)
    assert len(res.entities) == 1
    assert res.skipped == 1


def test_invalid_node_type_identifier():
    g = _graph(entities=[ParsedEntity(id="a", nodeType="person; DROP", label="A")])
    res = validate(g, _cfg())
    assert any("invalid nodeType" in e for e in res.errors)
    assert res.entities == []


def test_dangling_edge_skipped_by_default():
    g = _graph(
        entities=[ParsedEntity(id="a", nodeType="person", label="A")],
        edges=[ParsedEdge(id="e1", source="a", target="ghost", linkType="OWNS")],
    )
    res = validate(g, _cfg())
    assert res.edges == []
    assert res.skipped == 1
    assert any("dangling" in w for w in res.warnings)


def test_dangling_edge_auto_create():
    g = _graph(
        entities=[ParsedEntity(id="a", nodeType="person", label="A")],
        edges=[ParsedEdge(id="e1", source="a", target="ghost", linkType="OWNS")],
    )
    res = validate(g, _cfg(**{"dangling": "auto-create"}))
    assert len(res.edges) == 1
    created = {e.id for e in res.entities}
    assert "ghost" in created


def test_invalid_tag_config_fails_early():
    g = _graph(
        entities=[ParsedEntity(id="a", nodeType="person", label="A")],
        edges=[ParsedEdge(id="e1", source="a", target="a", linkType="OWNS")],
    )
    res = validate(
        g,
        _cfg(
            **{
                "tags": {
                    "tenantId": "t1",
                    "classification": 9,
                    "owner": "x",
                    "visibility": "internal",
                }
            }
        ),
    )
    assert res.errors  # classification 越界
    assert res.entities == []  # 配置非法 → 直接失败，不产出有效数据
