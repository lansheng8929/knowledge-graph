const __kgUserStyle=document.createElement("style");__kgUserStyle.textContent=":root,[data-theme=light]{--background: 255 255 255;--surface: 250 251 252;--foreground: 51 51 51;--muted: 136 153 170;--muted-foreground: 102 119 136;--primary: 233 69 96;--primary-foreground: 255 255 255;--border: 224 224 224;--border-strong: 15 52 96;--border-hover: 0 204 255;--shadow-sm: 0 1px 2px rgb(0 0 0 / .05);--shadow: 0 4px 20px rgb(0 0 0 / .12);--shadow-lg: 0 4px 20px rgb(0 0 0 / .4);--success: 16 185 129;--warning: 245 158 11;--danger: 239 68 68;--tooltip-bg: 255 255 255;--hover: 240 244 255;--canvas-bg: 248 249 250;--overlay-bg: 0 102 255}[data-theme=dark]{--background: 30 33 38;--surface: 36 40 46;--foreground: 226 232 240;--muted: 100 116 139;--muted-foreground: 148 163 184;--primary: 244 63 94;--primary-foreground: 255 255 255;--border: 55 60 67;--border-strong: 71 78 88;--border-hover: 34 211 238;--shadow-sm: 0 1px 2px rgb(0 0 0 / .35);--shadow: 0 4px 20px rgb(0 0 0 / .4);--shadow-lg: 0 4px 24px rgb(0 0 0 / .55);--success: 52 211 153;--warning: 251 191 36;--danger: 248 113 113;--tooltip-bg: 42 46 52;--hover: 42 46 52;--canvas-bg: 24 27 31;--overlay-bg: 96 165 250}.kg-user{height:100%;overflow-y:auto;background:rgb(var(--background));color:rgb(var(--foreground));font-family:system-ui,-apple-system,Segoe UI,PingFang SC,Microsoft YaHei,sans-serif}.kg-user *{box-sizing:border-box}.kg-user-head{padding:26px 32px 22px;border-bottom:1px solid rgb(var(--border) / .6);background:linear-gradient(180deg,rgb(var(--canvas-bg)),rgb(var(--background)))}.kg-user-head h1{margin:0;font-size:24px;font-weight:800}.kg-user-head p{margin:6px 0 0;font-size:13px;color:rgb(var(--muted-foreground))}.kg-user-body{max-width:720px;margin:0 auto;padding:24px 24px 56px}.kg-user-error{padding:10px 16px;border-radius:10px;border:1px solid rgb(var(--danger) / .4);background:rgb(var(--danger) / .1);color:rgb(var(--danger));font-size:13px}.kg-user-loading{padding:40px;text-align:center;color:rgb(var(--muted))}.kg-user-card{border-radius:14px;border:1px solid rgb(var(--border) / .7);background:rgb(var(--surface));overflow:hidden}.kg-user-id{display:flex;align-items:center;gap:14px;padding:22px 22px 18px;border-bottom:1px solid rgb(var(--border) / .6)}.kg-user-avatar{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;font-size:20px;font-weight:800;color:rgb(var(--primary-foreground));background:rgb(var(--primary))}.kg-user-name{font-size:18px;font-weight:700}.kg-user-sub{margin-top:2px;font-size:13px;color:rgb(var(--muted));font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.kg-user-grid{padding:6px 22px 22px}.kg-user-row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgb(var(--border) / .4)}.kg-user-row:last-child{border-bottom:none}.kg-user-label{font-size:13px;color:rgb(var(--muted-foreground))}.kg-user-value{font-size:13px;color:rgb(var(--foreground));text-align:right;word-break:break-all}.kg-user::-webkit-scrollbar{width:10px}.kg-user::-webkit-scrollbar-thumb{background:rgb(var(--muted) / .28);border-radius:999px;border:2px solid rgb(var(--background))}\n";document.head.appendChild(__kgUserStyle);
import E, { useState as k, useEffect as N } from "react";
import $ from "react-dom";
var v = { exports: {} }, c = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var R;
function w() {
  if (R) return c;
  R = 1;
  var e = E, t = Symbol.for("react.element"), s = Symbol.for("react.fragment"), u = Object.prototype.hasOwnProperty, o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, y = { key: !0, ref: !0, __self: !0, __source: !0 };
  function p(d, n, j) {
    var a, m = {}, x = null, g = null;
    j !== void 0 && (x = "" + j), n.key !== void 0 && (x = "" + n.key), n.ref !== void 0 && (g = n.ref);
    for (a in n) u.call(n, a) && !y.hasOwnProperty(a) && (m[a] = n[a]);
    if (d && d.defaultProps) for (a in n = d.defaultProps, n) m[a] === void 0 && (m[a] = n[a]);
    return { $$typeof: t, type: d, key: x, ref: g, props: m, _owner: o.current };
  }
  return c.Fragment = s, c.jsx = p, c.jsxs = p, c;
}
var _;
function q() {
  return _ || (_ = 1, v.exports = w()), v.exports;
}
var r = q(), h = {}, b;
function T() {
  if (b) return h;
  b = 1;
  var e = $;
  return h.createRoot = e.createRoot, h.hydrateRoot = e.hydrateRoot, h;
}
var U = T();
let f = "";
function C(e) {
  f = e;
}
async function I() {
  const e = {};
  f && (e.Authorization = `Bearer ${f}`);
  const t = await fetch("/api/v1/auth/userinfo", { headers: e }), s = await t.json().catch(() => null);
  if (!t.ok) {
    const u = s == null ? void 0 : s.detail;
    throw new Error(u || `HTTP ${t.status}`);
  }
  return s.data.user;
}
const O = {
  0: "公开",
  1: "内部",
  2: "秘密",
  3: "机密"
};
function S() {
  const [e, t] = k(null), [s, u] = k(null);
  return N(() => {
    I().then(t).catch((o) => u(o instanceof Error ? o.message : String(o)));
  }, []), /* @__PURE__ */ r.jsxs("div", { className: "kg-user", children: [
    /* @__PURE__ */ r.jsxs("header", { className: "kg-user-head", children: [
      /* @__PURE__ */ r.jsx("h1", { children: "个人中心" }),
      /* @__PURE__ */ r.jsx("p", { children: "当前登录账号信息与权限属性" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { className: "kg-user-body", children: [
      s && /* @__PURE__ */ r.jsx("div", { className: "kg-user-error", role: "alert", children: s }),
      !e && !s && /* @__PURE__ */ r.jsx("div", { className: "kg-user-loading", children: "加载中…" }),
      e && /* @__PURE__ */ r.jsxs("section", { className: "kg-user-card", children: [
        /* @__PURE__ */ r.jsxs("div", { className: "kg-user-id", children: [
          /* @__PURE__ */ r.jsx("div", { className: "kg-user-avatar", children: e.username.slice(0, 1).toUpperCase() }),
          /* @__PURE__ */ r.jsxs("div", { children: [
            /* @__PURE__ */ r.jsx("div", { className: "kg-user-name", children: e.username }),
            /* @__PURE__ */ r.jsxs("div", { className: "kg-user-sub", children: [
              e.uid,
              " · ",
              e.tenantId
            ] })
          ] })
        ] }),
        /* @__PURE__ */ r.jsxs("div", { className: "kg-user-grid", children: [
          /* @__PURE__ */ r.jsx(l, { label: "用户名", value: e.username }),
          /* @__PURE__ */ r.jsx(l, { label: "用户 ID", value: e.uid }),
          /* @__PURE__ */ r.jsx(l, { label: "租户", value: e.tenantId }),
          /* @__PURE__ */ r.jsx(
            l,
            {
              label: "密级",
              value: O[e.clearance] ?? String(e.clearance)
            }
          ),
          /* @__PURE__ */ r.jsx(l, { label: "角色", value: e.roles.join(" / ") || "—" }),
          /* @__PURE__ */ r.jsx(l, { label: "团队", value: e.teams.join(" / ") || "—" }),
          /* @__PURE__ */ r.jsx(l, { label: "组织路径", value: e.orgPath || "—" }),
          /* @__PURE__ */ r.jsx(l, { label: "上级", value: e.managerUid || "—" }),
          /* @__PURE__ */ r.jsx(
            l,
            {
              label: "下级（含间接）",
              value: e.subUids.length ? `${e.subUids.length} 人：${e.subUids.join(", ")}` : "无"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function l(e) {
  return /* @__PURE__ */ r.jsxs("div", { className: "kg-user-row", children: [
    /* @__PURE__ */ r.jsx("span", { className: "kg-user-label", children: e.label }),
    /* @__PURE__ */ r.jsx("span", { className: "kg-user-value", children: e.value })
  ] });
}
let i = null;
const A = () => {
  let e = document.getElementById("single-spa-application:user-app");
  return e || (e = document.createElement("div"), e.id = "single-spa-application:user-app", document.body.appendChild(e)), e;
}, L = async () => {
}, B = async (e) => {
  var s;
  const t = e.domElement ?? A();
  t.dataset.buildVersion = "0.3.0", (s = e.auth) != null && s.token && C(e.auth.token), i = U.createRoot(t), i.render(/* @__PURE__ */ r.jsx(S, {}));
}, D = async () => {
  i == null || i.unmount(), i = null;
};
export {
  L as bootstrap,
  A as domElementGetter,
  B as mount,
  D as unmount
};
