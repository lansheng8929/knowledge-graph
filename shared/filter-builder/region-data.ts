/**
 * 内置中国省市区数据（演示用，省→市→区 三级）。
 * 值格式：省+市+区 直接拼接（如 "浙江省杭州市西湖区"）。
 */

export interface RegionNode {
  name: string
  children?: RegionNode[]
}

export const REGION_DATA: RegionNode[] = [
  { name: "北京市", children: [{ name: "东城区" }, { name: "西城区" }, { name: "朝阳区" }, { name: "海淀区" }, { name: "丰台区" }, { name: "石景山区" }] },
  { name: "天津市", children: [{ name: "和平区" }, { name: "河东区" }, { name: "河西区" }, { name: "南开区" }] },
  { name: "上海市", children: [{ name: "黄浦区" }, { name: "徐汇区" }, { name: "长宁区" }, { name: "静安区" }, { name: "浦东新区" }, { name: "虹口区" }] },
  { name: "重庆市", children: [{ name: "渝中区" }, { name: "江北区" }, { name: "南岸区" }, { name: "九龙坡区" }, { name: "渝北区" }] },
  { name: "河北省", children: [{ name: "石家庄市" }, { name: "唐山市" }, { name: "保定市" }, { name: "廊坊市" }] },
  { name: "山西省", children: [{ name: "太原市" }, { name: "大同市" }, { name: "运城市" }] },
  { name: "辽宁省", children: [{ name: "沈阳市" }, { name: "大连市" }, { name: "鞍山市" }] },
  { name: "吉林省", children: [{ name: "长春市" }, { name: "吉林市" }] },
  { name: "黑龙江省", children: [{ name: "哈尔滨市" }, { name: "大庆市" }, { name: "齐齐哈尔市" }] },
  { name: "江苏省", children: [{ name: "南京市" }, { name: "苏州市" }, { name: "无锡市" }, { name: "常州市" }, { name: "南通市" }] },
  { name: "浙江省", children: [
    { name: "杭州市", children: [{ name: "西湖区" }, { name: "拱墅区" }, { name: "滨江区" }, { name: "上城区" }, { name: "余杭区" }] },
    { name: "宁波市" }, { name: "温州市" }, { name: "嘉兴市" }, { name: "绍兴市" }, { name: "金华市" },
  ] },
  { name: "安徽省", children: [{ name: "合肥市" }, { name: "芜湖市" }, { name: "蚌埠市" }] },
  { name: "福建省", children: [{ name: "福州市" }, { name: "厦门市" }, { name: "泉州市" }, { name: "漳州市" }] },
  { name: "江西省", children: [{ name: "南昌市" }, { name: "赣州市" }, { name: "九江市" }] },
  { name: "山东省", children: [{ name: "济南市" }, { name: "青岛市" }, { name: "烟台市" }, { name: "潍坊市" }, { name: "临沂市" }] },
  { name: "河南省", children: [{ name: "郑州市" }, { name: "洛阳市" }, { name: "开封市" }, { name: "南阳市" }] },
  { name: "湖北省", children: [{ name: "武汉市" }, { name: "宜昌市" }, { name: "襄阳市" }] },
  { name: "湖南省", children: [{ name: "长沙市" }, { name: "株洲市" }, { name: "岳阳市" }, { name: "常德市" }] },
  { name: "广东省", children: [
    { name: "广州市", children: [{ name: "天河区" }, { name: "越秀区" }, { name: "海珠区" }, { name: "白云区" }] },
    { name: "深圳市" }, { name: "珠海市" }, { name: "佛山市" }, { name: "东莞市" }, { name: "中山市" },
  ] },
  { name: "海南省", children: [{ name: "海口市" }, { name: "三亚市" }] },
  { name: "四川省", children: [
    { name: "成都市", children: [{ name: "锦江区" }, { name: "青羊区" }, { name: "金牛区" }, { name: "武侯区" }, { name: "成华区" }] },
    { name: "绵阳市" }, { name: "宜宾市" }, { name: "泸州市" },
  ] },
  { name: "贵州省", children: [{ name: "贵阳市" }, { name: "遵义市" }] },
  { name: "云南省", children: [{ name: "昆明市" }, { name: "大理白族自治州" }, { name: "丽江市" }, { name: "曲靖市" }] },
  { name: "陕西省", children: [
    { name: "西安市", children: [{ name: "雁塔区" }, { name: "碑林区" }, { name: "莲湖区" }, { name: "新城区" }] },
    { name: "宝鸡市" }, { name: "咸阳市" },
  ] },
  { name: "甘肃省", children: [{ name: "兰州市" }, { name: "天水市" }, { name: "酒泉市" }] },
  { name: "青海省", children: [{ name: "西宁市" }, { name: "海东市" }] },
  { name: "内蒙古自治区", children: [{ name: "呼和浩特市" }, { name: "包头市" }, { name: "鄂尔多斯市" }] },
  { name: "广西壮族自治区", children: [{ name: "南宁市" }, { name: "桂林市" }, { name: "柳州市" }, { name: "北海市" }] },
  { name: "西藏自治区", children: [{ name: "拉萨市" }, { name: "日喀则市" }] },
  { name: "宁夏回族自治区", children: [{ name: "银川市" }, { name: "吴忠市" }, { name: "石嘴山市" }] },
  { name: "新疆维吾尔自治区", children: [{ name: "乌鲁木齐市" }, { name: "喀什地区" }, { name: "伊犁哈萨克自治州" }] },
  { name: "台湾省", children: [{ name: "台北市" }, { name: "高雄市" }, { name: "台中市" }] },
  { name: "香港特别行政区", children: [{ name: "香港岛" }, { name: "九龙" }, { name: "新界" }] },
  { name: "澳门特别行政区", children: [{ name: "澳门半岛" }, { name: "氹仔" }, { name: "路环" }] },
]

/** 去掉行政后缀（省/市/区/自治区/特别行政区），如 "浙江省"→"浙江"、"北京市"→"北京"、"西湖区"→"西湖" */
export function stripSuffix(name: string): string {
  for (const suf of ["特别行政区", "自治区", "自治州", "省", "市", "区", "地区"]) {
    if (name.endsWith(suf)) return name.slice(0, -suf.length)
  }
  return name
}

/** 地区值 → 用于 contains 匹配的最细一级（去后缀）。
 *  如 "浙江省杭州市西湖区" → "西湖"；"北京市" → "北京"；未命中返回原值。 */
export function regionMatchValue(region: string): string {
  if (!region) return region
  const p = REGION_DATA.find((r) => region.startsWith(r.name))
  if (!p) return region
  const c = p.children?.find((x) => region.includes(x.name))
  if (!c) return stripSuffix(p.name)
  const d = c.children?.find((x) => region.includes(x.name))
  if (d) return stripSuffix(d.name)
  return stripSuffix(c.name)
}
