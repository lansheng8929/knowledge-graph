const __kgStyle=document.createElement("style");__kgStyle.textContent=":root,[data-theme=light]{--background: 255 255 255;--surface: 250 251 252;--foreground: 51 51 51;--muted: 136 153 170;--muted-foreground: 102 119 136;--primary: 233 69 96;--primary-foreground: 255 255 255;--border: 224 224 224;--border-strong: 15 52 96;--border-hover: 0 204 255;--shadow-sm: 0 1px 2px rgb(0 0 0 / .05);--shadow: 0 4px 20px rgb(0 0 0 / .12);--shadow-lg: 0 4px 20px rgb(0 0 0 / .4);--success: 16 185 129;--warning: 245 158 11;--danger: 239 68 68;--tooltip-bg: 255 255 255;--hover: 240 244 255;--canvas-bg: 248 249 250;--overlay-bg: 0 102 255}[data-theme=dark]{--background: 30 33 38;--surface: 36 40 46;--foreground: 226 232 240;--muted: 100 116 139;--muted-foreground: 148 163 184;--primary: 244 63 94;--primary-foreground: 255 255 255;--border: 55 60 67;--border-strong: 71 78 88;--border-hover: 34 211 238;--shadow-sm: 0 1px 2px rgb(0 0 0 / .35);--shadow: 0 4px 20px rgb(0 0 0 / .4);--shadow-lg: 0 4px 24px rgb(0 0 0 / .55);--success: 52 211 153;--warning: 251 191 36;--danger: 248 113 113;--tooltip-bg: 42 46 52;--hover: 42 46 52;--canvas-bg: 24 27 31;--overlay-bg: 96 165 250}.bg-background{background-color:rgb(var(--background))}.bg-canvas{background-color:rgb(var(--canvas-bg))}.bg-tooltip{background-color:rgb(var(--tooltip-bg))}.bg-primary{background-color:rgb(var(--primary))}.bg-hover{background-color:rgb(var(--hover))}.text-foreground{color:rgb(var(--foreground))}.text-muted{color:rgb(var(--muted))}.text-muted-foreground{color:rgb(var(--muted-foreground))}.text-primary{color:rgb(var(--primary))}.border-border{border-color:rgb(var(--border))}.border-border-strong{border-color:rgb(var(--border-strong))}.border-primary{border-color:rgb(var(--primary))}.shadow-sm{box-shadow:var(--shadow-sm)}.shadow{box-shadow:var(--shadow)}.shadow-lg{box-shadow:var(--shadow-lg)}\n";document.head.appendChild(__kgStyle);
var yn = Object.defineProperty;
var vn = (i, e, t) => e in i ? yn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var p = (i, e, t) => vn(i, typeof e != "symbol" ? e + "" : e, t);
import xn, { createContext as Ge, useState as U, useCallback as z, useContext as $e, useEffect as te, useRef as K, forwardRef as Gt, createElement as ot, memo as mn, useMemo as Ve } from "react";
import bn from "react-dom";
var Je = { exports: {} }, Me = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bt;
function kn() {
  if (bt) return Me;
  bt = 1;
  var i = xn, e = Symbol.for("react.element"), t = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, s = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, r = { key: !0, ref: !0, __self: !0, __source: !0 };
  function o(l, d, a) {
    var g, y = {}, u = null, f = null;
    a !== void 0 && (u = "" + a), d.key !== void 0 && (u = "" + d.key), d.ref !== void 0 && (f = d.ref);
    for (g in d) n.call(d, g) && !r.hasOwnProperty(g) && (y[g] = d[g]);
    if (l && l.defaultProps) for (g in d = l.defaultProps, d) y[g] === void 0 && (y[g] = d[g]);
    return { $$typeof: e, type: l, key: u, ref: f, props: y, _owner: s.current };
  }
  return Me.Fragment = t, Me.jsx = o, Me.jsxs = o, Me;
}
var kt;
function _n() {
  return kt || (kt = 1, Je.exports = kn()), Je.exports;
}
var c = _n(), Be = {}, _t;
function Sn() {
  if (_t) return Be;
  _t = 1;
  var i = bn;
  return Be.createRoot = i.createRoot, Be.hydrateRoot = i.hydrateRoot, Be;
}
var wn = Sn();
const $t = Ge({
  register: () => {
  },
  unregister: () => {
  },
  focus: () => {
  },
  focusStack: []
});
function Tn({ children: i }) {
  const [e, t] = U([]), n = z((o) => {
    t((l) => l.includes(o) ? l : [...l, o]);
  }, []), s = z((o) => {
    t((l) => l.filter((d) => d !== o));
  }, []), r = z((o) => {
    t((l) => [...l.filter((a) => a !== o), o]);
  }, []);
  return /* @__PURE__ */ c.jsx($t.Provider, { value: { register: n, unregister: s, focus: r, focusStack: e }, children: i });
}
function qt({ id: i, layer: e }) {
  const { register: t, unregister: n, focus: s, focusStack: r } = $e($t);
  te(() => (t(i), () => n(i)), [i, t, n]);
  const o = r.indexOf(i);
  return {
    /** 当前计算出的 zIndex */
    zIndex: o >= 0 ? e + o : e,
    /** 调用此方法将该面板置顶 */
    onFocus: () => s(i)
  };
}
const An = 10;
function St(i, e, t, n) {
  const s = t.getBoundingClientRect(), r = window.innerWidth - s.width - n, o = window.innerHeight - s.height - n;
  return {
    x: Math.max(n, Math.min(i, r)),
    y: Math.max(n, Math.min(e, o))
  };
}
function Pn(i, e, t = An) {
  const n = K({ x: 0, y: 0 }), s = K(t);
  return s.current = t, te(() => {
    if (i.current && e) {
      const o = St(
        e.x,
        e.y,
        i.current,
        s.current
      );
      i.current.style.transform = `translate(${o.x}px, ${o.y}px)`, n.current = o;
    }
  }, [i, e == null ? void 0 : e.x, e == null ? void 0 : e.y]), { onGripMouseDown: z(
    (o) => {
      const l = i.current;
      if (!l) return;
      o.preventDefault();
      const d = o.clientX, a = o.clientY, g = n.current.x, y = n.current.y, u = (m) => {
        const x = m, h = x.clientX - d, v = x.clientY - a, k = St(
          g + h,
          y + v,
          l,
          s.current
        );
        l.style.transform = `translate(${k.x}px, ${k.y}px)`;
      }, f = () => {
        const m = l.style.transform.match(
          /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
        );
        m && (n.current = { x: Number(m[1]), y: Number(m[2]) }), document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", f), document.removeEventListener("touchmove", u), document.removeEventListener("touchend", f);
      };
      document.addEventListener("mousemove", u), document.addEventListener("mouseup", f), document.addEventListener("touchmove", u, { passive: !0 }), document.addEventListener("touchend", f);
    },
    [i]
  ) };
}
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kt = (...i) => i.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cn = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nn = (i) => i.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wt = (i) => {
  const e = Nn(i);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Qe = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mn = (i) => {
  for (const e in i)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, Dn = Ge({}), En = () => $e(Dn), Rn = Gt(
  ({ color: i, size: e, strokeWidth: t, absoluteStrokeWidth: n, className: s = "", children: r, iconNode: o, ...l }, d) => {
    const {
      size: a = 24,
      strokeWidth: g = 2,
      absoluteStrokeWidth: y = !1,
      color: u = "currentColor",
      className: f = ""
    } = En() ?? {}, m = n ?? y ? Number(t ?? g) * 24 / Number(e ?? a) : t ?? g;
    return ot(
      "svg",
      {
        ref: d,
        ...Qe,
        width: e ?? a ?? Qe.width,
        height: e ?? a ?? Qe.height,
        stroke: i ?? u,
        strokeWidth: m,
        className: Kt("lucide", f, s),
        ...!r && !Mn(l) && { "aria-hidden": "true" },
        ...l
      },
      [
        ...o.map(([x, h]) => ot(x, h)),
        ...Array.isArray(r) ? r : [r]
      ]
    );
  }
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Q = (i, e) => {
  const t = Gt(
    ({ className: n, ...s }, r) => ot(Rn, {
      ref: r,
      iconNode: e,
      className: Kt(
        `lucide-${Cn(wt(i))}`,
        `lucide-${i}`,
        n
      ),
      ...s
    })
  );
  return t.displayName = wt(i), t;
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const In = [
  [
    "path",
    {
      d: "M10.793 19.793a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707z",
      key: "qbhtmx"
    }
  ]
], Ln = Q("arrow-big-left", In);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fn = [
  ["path", { d: "M12 5v16", key: "1f6ucr" }],
  [
    "path",
    {
      d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
      key: "1fyvmf"
    }
  ]
], jn = Q("book-open", Fn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zn = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
], Bn = Q("camera", zn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const On = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
], Zt = Q("chart-column", On);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wn = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
], Jt = Q("clock", Wn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hn = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Tt = Q("download", Hn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Un = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
], Vn = Q("funnel", Un);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xn = [
  ["path", { d: "M15 6a9 9 0 0 0-9 9V3", key: "1cii5b" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }]
], Yn = Q("git-branch", Xn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gn = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
], $n = Q("map", Gn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qn = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
], Kn = Q("maximize-2", qn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zn = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], Jn = Q("moon", Zn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qn = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
      key: "edeuup"
    }
  ]
], es = Q("mouse-pointer-2", Qn);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ts = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], ns = Q("pause", ts);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ss = [
  [
    "path",
    {
      d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
      key: "2hea0t"
    }
  ]
], is = Q("pentagon", ss);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rs = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], os = Q("play", rs);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const as = [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
], ls = Q("redo-2", as);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cs = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], Qt = Q("rotate-ccw", cs);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ds = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["path", { d: "m16 16-1.9-1.9", key: "1dq9hf" }]
], hs = Q("scan-search", ds);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const us = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], gs = Q("search", us);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fs = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], ps = Q("sliders-horizontal", fs);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ys = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], vs = Q("square", ys);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xs = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], ms = Q("sun", xs);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bs = [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }]
], en = Q("table", bs);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ks = [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
], _s = Q("undo-2", ks);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ss = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], ws = Q("x", Ss), Ts = {
  cursor: "grab",
  padding: "4px",
  paddingBottom: "0px",
  userSelect: "none",
  touchAction: "none"
}, As = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: 20,
  height: 20,
  cursor: "nwse-resize",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end"
}, At = ({
  onPointerDown: i
}) => /* @__PURE__ */ c.jsx("div", { style: As, onPointerDown: i, children: /* @__PURE__ */ c.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "#bbb", children: [
  /* @__PURE__ */ c.jsx("circle", { cx: "10", cy: "10", r: "1.5" }),
  /* @__PURE__ */ c.jsx("circle", { cx: "10", cy: "6", r: "1.5" }),
  /* @__PURE__ */ c.jsx("circle", { cx: "6", cy: "10", r: "1.5" })
] }) }), fe = mn(function({
  id: e,
  layer: t,
  children: n,
  style: s,
  className: r,
  draggable: o,
  position: l,
  resizable: d,
  defaultSize: a,
  onClick: g,
  onClose: y
}) {
  const { zIndex: u, onFocus: f } = qt({ id: e, layer: t }), m = K(null), { onGripMouseDown: x } = Pn(m, l, 10), [h, v] = U(
    d && a ? a : null
  ), k = 200, C = 150, T = 10, A = z(
    (_) => {
      f(), g == null || g(_);
    },
    [f, g]
  ), N = K(null), b = z(
    (_) => {
      if (!h) return;
      const S = _.currentTarget;
      S.setPointerCapture(_.pointerId), _.preventDefault(), N.current = {
        startX: _.clientX,
        startY: _.clientY,
        startW: h.w,
        startH: h.h
      };
      const P = (H) => {
        const F = N.current;
        if (!F) return;
        const B = H, j = window.innerWidth - T * 2, R = window.innerHeight - T * 2, w = Math.min(j, B.clientX), D = Math.min(R, B.clientY);
        v({
          w: Math.max(k, Math.min(F.startW + w - F.startX, j)),
          h: Math.max(C, Math.min(F.startH + D - F.startY, R))
        });
      }, E = () => {
        N.current = null, S.releasePointerCapture(_.pointerId), S.removeEventListener("pointermove", P), S.removeEventListener("pointerup", E);
      };
      S.addEventListener("pointermove", P), S.addEventListener("pointerup", E);
    },
    [h]
  );
  return o ? /* @__PURE__ */ c.jsxs(
    "div",
    {
      ref: m,
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        willChange: "transform",
        ...s,
        width: h == null ? void 0 : h.w,
        height: h == null ? void 0 : h.h,
        zIndex: u
      },
      className: r,
      onClick: A,
      children: [
        /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              ...Ts
            },
            className: "panel-grip",
            onMouseDown: x,
            children: y && /* @__PURE__ */ c.jsx(
              "button",
              {
                onClick: (_) => {
                  _.stopPropagation(), y();
                },
                style: {
                  cursor: "pointer",
                  width: 12,
                  height: 12,
                  borderRadius: "100%",
                  background: "#EB2463",
                  userSelect: "none",
                  border: "none"
                },
                title: "关闭"
              }
            )
          }
        ),
        n,
        d && /* @__PURE__ */ c.jsx(At, { onPointerDown: b })
      ]
    }
  ) : /* @__PURE__ */ c.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${(l == null ? void 0 : l.x) ?? 100}px, ${(l == null ? void 0 : l.y) ?? 100}px)`,
        ...s,
        width: h == null ? void 0 : h.w,
        height: h == null ? void 0 : h.h,
        zIndex: u
      },
      className: r,
      onClick: A,
      children: [
        n,
        d && /* @__PURE__ */ c.jsx(At, { onPointerDown: b })
      ]
    }
  );
});
var de = /* @__PURE__ */ ((i) => (i[i.Tooltip = 1e3] = "Tooltip", i[i.Panel = 1100] = "Panel", i[i.Toolbar = 800] = "Toolbar", i[i.Overlay = 3e3] = "Overlay", i[i.Notification = 9900] = "Notification", i))(de || {});
const tn = Ge(null), Pt = "kg-theme";
function Ps({ children: i }) {
  const [e, t] = U(() => localStorage.getItem(Pt) === "dark" ? "dark" : "light"), n = z((r) => t(r), []), s = z(
    () => t((r) => r === "light" ? "dark" : "light"),
    []
  );
  return te(() => {
    document.documentElement.dataset.theme = e, localStorage.setItem(Pt, e);
  }, [e]), /* @__PURE__ */ c.jsx(tn.Provider, { value: { theme: e, setTheme: n, toggle: s }, children: i });
}
function qe() {
  const i = $e(tn);
  if (!i) throw new Error("useTheme must be used within ThemeProvider");
  return i;
}
const Cs = {
  canvas: "#f8f9fa",
  node: {
    default: { bg: "#357abd", stroke: "#ccc" },
    person: { bg: "#357abd", stroke: "#2a6090" },
    phone: { bg: "#27ae60", stroke: "#1e8449" },
    address: { bg: "#e67e22", stroke: "#ba5c12" },
    account: { bg: "#8e44ad", stroke: "#6c3483" },
    company: { bg: "#16a085", stroke: "#0e7c63" },
    ip: { bg: "#7f8c8d", stroke: "#596364" },
    device: { bg: "#2c3e50", stroke: "#1a252f" }
  },
  link: {
    default: "#9ca3af",
    hovered: "#00ccff",
    highlighted: "#ffff00",
    selected: "#357abd",
    hidden: "#9ca3af"
  },
  text: "#2c2c2c",
  muted: "#8899aa"
}, Ns = {
  canvas: "#181b1f",
  node: {
    default: { bg: "#4a90d9", stroke: "#2f5a85" },
    person: { bg: "#4a90d9", stroke: "#2f5a85" },
    phone: { bg: "#34d399", stroke: "#157a55" },
    address: { bg: "#fbbf24", stroke: "#9a6a10" },
    account: { bg: "#a78bfa", stroke: "#5b3f9e" },
    company: { bg: "#2dd4bf", stroke: "#0f766e" },
    ip: { bg: "#9ca3af", stroke: "#4b5563" },
    device: { bg: "#64748b", stroke: "#334155" }
  },
  link: {
    default: "#8a94a3",
    hovered: "#22d3ee",
    highlighted: "#fde047",
    selected: "#4a90d9",
    hidden: "#8a94a3"
  },
  text: "#e2e8f0",
  muted: "#94a3b8"
}, Ms = { light: Cs, dark: Ns };
function Pe(i) {
  return Ms[i];
}
function et(i, e = 1) {
  const t = i.replace("#", ""), n = parseInt(t.slice(0, 2), 16), s = parseInt(t.slice(2, 4), 16), r = parseInt(t.slice(4, 6), 16);
  return `rgba(${n}, ${s}, ${r}, ${e})`;
}
const Ds = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认"
};
function Es({ onClose: i }) {
  const { theme: e } = qe(), t = Object.fromEntries(
    Object.entries(Pe(e).node).map(([n, s]) => [n, s.bg])
  );
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "legend-panel",
      layer: de.Panel,
      draggable: !0,
      onClose: i,
      position: { x: 10, y: 50 },
      style: {
        width: 180,
        background: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: 8,
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "rgb(var(--foreground))",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "10px 12px",
              borderBottom: "1px solid rgb(var(--border))"
            },
            children: [
              /* @__PURE__ */ c.jsx(
                "div",
                {
                  style: {
                    fontWeight: "bold",
                    fontSize: "13px",
                    marginBottom: 8,
                    color: "rgb(var(--foreground))"
                  },
                  children: "● 节点类型"
                }
              ),
              Object.entries(t).map(([n, s]) => /* @__PURE__ */ c.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "3px 0"
                  },
                  children: [
                    /* @__PURE__ */ c.jsx(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: s,
                          border: "1px solid rgba(0,0,0,0.15)",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: Ds[n] ?? n })
                  ]
                },
                n
              ))
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { style: { padding: "10px 12px" }, children: [
          /* @__PURE__ */ c.jsx(
            "div",
            {
              style: {
                fontWeight: "bold",
                fontSize: "13px",
                marginBottom: 8,
                color: "rgb(var(--foreground))"
              },
              children: "─ 关系"
            }
          ),
          /* @__PURE__ */ c.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: 20,
                      height: 2,
                      background: "#9ca3af",
                      borderRadius: 1,
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: "默认关系" })
              ]
            }
          ),
          /* @__PURE__ */ c.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: 20,
                      height: 2,
                      background: "#00ccff",
                      borderRadius: 1,
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: "悬停高亮" })
              ]
            }
          ),
          /* @__PURE__ */ c.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: 20,
                      height: 2,
                      background: "#ffff00",
                      borderRadius: 1,
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: "关联高亮" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const Rs = 200, Is = 150, Ls = 800, Fs = 600, js = 60, zs = 0.1, Bs = 2, Os = "rgba(0, 102, 255, 0.25)", Ws = "#0066ff";
function Hs({ viewRef: i }) {
  const e = K(null), t = K(0), n = K(!1), { theme: s } = qe(), r = z(() => {
    const u = i.current;
    return u ? u.model.getGraphModelData().graphData : null;
  }, [i]), o = z(() => {
    const u = r();
    if (!u || u.nodes.length === 0) return null;
    let f = 1 / 0, m = 1 / 0, x = -1 / 0, h = -1 / 0;
    for (const _ of u.nodes) {
      const S = _.x ?? 0, P = _.y ?? 0;
      S < f && (f = S), P < m && (m = P), S > x && (x = S), P > h && (h = P);
    }
    const v = Math.max(x - f, 1), k = Math.max(h - m, 1), C = Math.max(
      js,
      Math.max(v, k) * zs
    ), T = Math.max(Ls, v + C * 2), A = Math.max(Fs, k + C * 2), N = (f + x) / 2, b = (m + h) / 2;
    return { x: N - T / 2, y: b - A / 2, width: T, height: A };
  }, [r]), l = z(() => {
    const u = i.current;
    if (!u) return null;
    const f = u.renderer.interaction.transform, m = u.renderer.canvas, x = m.clientWidth, h = m.clientHeight;
    return !x || !h ? null : {
      left: -f.x,
      top: -f.y,
      right: x / f.k - f.x,
      bottom: h / f.k - f.y
    };
  }, [i]), d = z(
    (u) => {
      const f = i.current;
      if (!f) return;
      const m = o();
      if (!m) return;
      const x = e.current, h = x == null ? void 0 : x.getBoundingClientRect();
      if (!x || !h) return;
      const v = x.clientWidth || 1, k = x.clientHeight || 1, C = u.clientX - h.left, T = u.clientY - h.top, A = m.x + C / v * m.width, N = m.y + T / k * m.height, b = f.renderer.interaction.transform, _ = f.renderer.canvas;
      b.x = _.clientWidth / (2 * b.k) - A, b.y = _.clientHeight / (2 * b.k) - N;
    },
    [i, o]
  ), a = z(
    (u) => {
      var f, m;
      (m = (f = u.currentTarget).setPointerCapture) == null || m.call(f, u.pointerId), n.current = !0, d(u);
    },
    [d]
  ), g = z(
    (u) => {
      n.current && d(u);
    },
    [d]
  ), y = z((u) => {
    var f, m;
    n.current = !1;
    try {
      (m = (f = u.currentTarget).releasePointerCapture) == null || m.call(f, u.pointerId);
    } catch {
    }
  }, []);
  return te(() => {
    const u = e.current;
    if (!u) return;
    const f = u.getContext("2d"), m = () => {
      const x = u.clientWidth, h = u.clientHeight;
      if (x === 0 || h === 0) {
        t.current = requestAnimationFrame(m);
        return;
      }
      const v = window.devicePixelRatio || 1, k = Math.round(x * v), C = Math.round(h * v);
      (u.width !== k || u.height !== C) && (u.width = k, u.height = C), f.setTransform(v, 0, 0, v, 0, 0);
      const T = i.current, A = r(), N = o(), b = l();
      if (!T || !A || !N || !b) {
        t.current = requestAnimationFrame(m);
        return;
      }
      const _ = Pe(s), S = (w, D) => [
        (w - N.x) / N.width * x,
        (D - N.y) / N.height * h
      ];
      f.clearRect(0, 0, x, h), f.fillStyle = _.canvas, f.beginPath(), f.roundRect(0, 0, x, h, 6), f.fill(), f.save(), f.beginPath(), f.roundRect(0, 0, x, h, 6), f.clip();
      const P = /* @__PURE__ */ new Map();
      for (const w of A.nodes)
        P.set(String(w.id), { x: w.x ?? 0, y: w.y ?? 0 });
      f.strokeStyle = et(_.link.default, 0.5), f.lineWidth = 0.5;
      for (const w of A.links) {
        const D = typeof w.source == "object" ? String(w.source.id) : String(w.source), M = typeof w.target == "object" ? String(w.target.id) : String(w.target), X = P.get(D), $ = P.get(M);
        if (!X || !$) continue;
        const [q, ee] = S(X.x, X.y), [G, oe] = S($.x, $.y);
        f.beginPath(), f.moveTo(q, ee), f.lineTo(G, oe), f.stroke();
      }
      f.fillStyle = et(_.text, 0.6);
      for (const w of A.nodes) {
        const [D, M] = S(w.x ?? 0, w.y ?? 0);
        f.beginPath(), f.arc(D, M, Bs, 0, Math.PI * 2), f.fill();
      }
      const E = (b.right - b.left) / N.width, H = (b.bottom - b.top) / N.height, F = x * E, B = h * H, j = (b.left - N.x) / N.width * x, R = (b.top - N.y) / N.height * h;
      f.fillStyle = Os, f.fillRect(j, R, F, B), f.strokeStyle = Ws, f.lineWidth = 1, f.strokeRect(j, R, F, B), f.restore(), f.strokeStyle = et(_.muted, 0.6), f.lineWidth = 1, f.beginPath(), f.roundRect(0, 0, x, h, 6), f.stroke(), t.current = requestAnimationFrame(m);
    };
    return t.current = requestAnimationFrame(m), () => {
      cancelAnimationFrame(t.current);
    };
  }, [i, r, o, l, s]), /* @__PURE__ */ c.jsx(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 12,
        right: 12,
        width: Rs,
        height: Is,
        borderRadius: 6,
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        zIndex: 100
      },
      onPointerDown: a,
      onPointerMove: g,
      onPointerUp: y,
      onPointerLeave: y,
      children: /* @__PURE__ */ c.jsx(
        "canvas",
        {
          ref: e,
          style: { width: "100%", height: "100%", display: "block" }
        }
      )
    }
  );
}
const nn = Ge(null);
function pe() {
  const i = $e(nn);
  if (!i) throw new Error("useAppCtx must be used within AppProvider");
  return i;
}
function Us({
  value: i,
  children: e
}) {
  return /* @__PURE__ */ c.jsx(nn.Provider, { value: i, children: e });
}
const Ct = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function Vs({ loadedNeighbors: i }) {
  var d, a, g, y;
  const { hoveredNode: e, mousePos: t } = pe(), n = e, s = t, r = ((d = n.data) == null ? void 0 : d.neighbors) ?? {}, o = Object.keys(r).length, l = Object.values(r).reduce(
    (u, f) => u + Object.values(f).reduce((m, x) => m + (x.total ?? 0), 0),
    0
  );
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "node-tooltip",
      layer: de.Tooltip,
      position: { x: s.x + 16, y: s.y - 12 },
      style: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.6,
        border: "1px solid rgb(var(--primary))",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "monospace",
        background: "rgb(var(--tooltip-bg))",
        color: "rgb(var(--foreground))"
      },
      children: [
        /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              color: "#e94560",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: ((a = n.data) == null ? void 0 : a.label) ?? n.id
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              color: "rgb(var(--muted))",
              fontSize: "11px",
              marginBottom: 6
            },
            children: [
              Ct[((g = n.data) == null ? void 0 : g.nodeType) ?? ""] ?? ((y = n.data) == null ? void 0 : y.nodeType),
              " · ",
              o,
              " 类关联 · 共 ",
              l,
              " 条"
            ]
          }
        ),
        /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: Object.entries(r).map(([u, f]) => {
              const m = Object.entries(f), x = i[u] ?? { out: 0, in: 0 }, h = x.out + x.in, v = m.reduce((k, [, C]) => k + C.total, 0) - h;
              return /* @__PURE__ */ c.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8 }, children: [
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: { color: "rgb(var(--foreground))", fontWeight: "bold" },
                    children: Ct[u] ?? u
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: {
                      color: "rgb(var(--muted))",
                      marginLeft: 4,
                      fontSize: "11px"
                    },
                    children: v > 0 ? `可拓 ${v}` : "已拓完"
                  }
                )
              ] }, u);
            })
          }
        )
      ]
    }
  );
}
const Xs = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
};
function Ys(i) {
  const { hoveredLink: e, mousePos: t } = pe(), n = e, s = t, r = n.data ?? {}, o = r.linkType ?? "", l = r.label ?? "", d = r.time ?? "", a = typeof n.source == "object" ? n.source.id : n.source, g = typeof n.target == "object" ? n.target.id : n.target;
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "link-tooltip",
      layer: de.Tooltip,
      position: { x: s.x + 16, y: s.y - 12 },
      style: {
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.6,
        border: "1px solid #4fc3f7",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "monospace",
        background: "rgb(var(--tooltip-bg))",
        color: "rgb(var(--foreground))"
      },
      children: [
        /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              color: "#0288d1",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: Xs[o] ?? o
          }
        ),
        /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              color: "rgb(var(--muted))",
              fontSize: "11px",
              marginBottom: 6
            },
            children: n.id
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: [
              l && /* @__PURE__ */ c.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ c.jsx("span", { style: { color: "#8899aa" }, children: "描述: " }),
                /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold" }, children: l })
              ] }),
              d && /* @__PURE__ */ c.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ c.jsx("span", { style: { color: "#8899aa" }, children: "时间: " }),
                /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold" }, children: d })
              ] }),
              /* @__PURE__ */ c.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ c.jsx("span", { style: { color: "#8899aa" }, children: "源节点: " }),
                a
              ] }),
              /* @__PURE__ */ c.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ c.jsx("span", { style: { color: "#8899aa" }, children: "目标节点: " }),
                g
              ] })
            ]
          }
        )
      ]
    }
  );
}
const Gs = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
}, $s = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, qs = {
  label: "名称/标识",
  gender: "性别",
  age: "年龄",
  caseWeight: "案件权重"
}, Nt = {
  person: [
    { name: "label", type: "string" },
    { name: "gender", type: "string" },
    { name: "age", type: "number" },
    { name: "caseWeight", type: "number" }
  ],
  phone: [{ name: "label", type: "string" }],
  address: [{ name: "label", type: "string" }],
  account: [{ name: "label", type: "string" }]
}, Ks = {
  eq: { label: "=", types: ["string", "number"] },
  neq: { label: "≠", types: ["string", "number"] },
  contains: { label: "包含", types: ["string"] },
  starts: { label: "开头是", types: ["string"] },
  gt: { label: ">", types: ["number"] },
  gte: { label: "≥", types: ["number"] },
  lt: { label: "<", types: ["number"] },
  lte: { label: "≤", types: ["number"] },
  between: { label: "介于", types: ["number"] }
};
function Zs({
  node: i,
  loadedNeighbors: e,
  x: t,
  y: n,
  onExpand: s,
  onClose: r
}) {
  var ee, G, oe, J;
  const o = ((ee = i.data) == null ? void 0 : ee.neighbors) ?? {}, l = Object.keys(o), d = Ve(
    () => l.filter((I) => {
      const O = Object.values(o[I] ?? {}).reduce(
        (L, V) => L + (V.total ?? 0),
        0
      ), W = e[I] ?? { out: 0, in: 0 };
      return O - (W.out + W.in) > 0;
    }),
    [l, o, e]
  ), a = (I) => o[I] ? Object.keys(o[I]) : [], g = (I, O) => {
    var L;
    const W = (L = o[I]) == null ? void 0 : L[O];
    return W != null && W.out && W.out > 0 ? "out" : W != null && W.in && W.in > 0 ? "in" : "";
  }, y = (I, O) => {
    var se;
    const W = (se = o[I]) == null ? void 0 : se[O], L = e[I] ?? { out: 0, in: 0 }, V = [];
    return ((W == null ? void 0 : W.out) ?? 0) - L.out > 0 && V.push("out"), ((W == null ? void 0 : W.in) ?? 0) - L.in > 0 && V.push("in"), V;
  }, u = d[0] ?? "", f = u ? a(u)[0] ?? "" : "", [m, x] = U([
    {
      targetType: u,
      relationType: f,
      direction: g(u, f),
      filters: []
    }
  ]), [h, v] = U(/* @__PURE__ */ new Set()), k = (I, O) => `${I}.${O}`, C = () => {
    const I = /* @__PURE__ */ new Set();
    return m.forEach((O, W) => {
      O.targetType || I.add(k(W, "targetType")), O.relationType || I.add(k(W, "relationType")), O.direction || I.add(k(W, "direction"));
    }), v(I), I.size === 0;
  }, T = (I, O) => {
    v((W) => {
      const L = new Set(W);
      return L.delete(k(I, O)), L;
    });
  }, A = (I, O) => {
    x((W) => {
      const L = W.map((V, se) => se === I ? { ...V, ...O } : V);
      if ("targetType" in O || "relationType" in O) {
        const V = L[I], se = a(V.targetType);
        V.relationType && !se.includes(V.relationType) && (L[I] = { ...V, relationType: se[0], filters: [] });
        const ae = y(
          L[I].targetType,
          L[I].relationType
        );
        L[I] = {
          ...L[I],
          direction: ae[0] ?? ""
        };
      }
      return L;
    }), Object.keys(O).forEach((W) => T(I, W));
  }, N = () => {
    const I = d[0] ?? "", O = I ? a(I)[0] ?? "" : "";
    x((W) => [
      ...W,
      {
        targetType: I,
        relationType: O,
        direction: g(I, O),
        filters: []
      }
    ]);
  }, b = (I) => {
    x((O) => O.filter((W, L) => L !== I));
  }, _ = (I) => {
    x(
      (O) => O.map(
        (W, L) => L === I ? {
          ...W,
          filters: [
            ...W.filters,
            { property: "", operator: "eq", value: "" }
          ]
        } : W
      )
    );
  }, S = (I, O, W) => {
    x(
      (L) => L.map(
        (V, se) => se === I ? {
          ...V,
          filters: V.filters.map(
            (ae, Z) => Z === O ? { ...ae, ...W } : ae
          )
        } : V
      )
    );
  }, P = (I, O) => {
    x(
      (W) => W.map(
        (L, V) => V === I ? { ...L, filters: L.filters.filter((se, ae) => ae !== O) } : L
      )
    );
  }, E = (I) => Nt[I] ?? [{ name: "label", type: "string" }], H = (I) => Object.entries(Ks).filter(([, O]) => O.types.includes(I)).map(([O, W]) => ({ key: O, label: W.label })), F = (I, O, W) => h.has(k(I, O)) ? { ...W, borderColor: "#d32f2f", outline: "1px solid #d32f2f" } : W, B = (I, O) => {
    var L;
    const W = Nt[I];
    return ((L = W == null ? void 0 : W.find((V) => V.name === O)) == null ? void 0 : L.type) ?? "string";
  }, j = document.querySelector("canvas"), R = (j == null ? void 0 : j.getBoundingClientRect()) ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }, w = R.top + R.height, D = R.left + R.width, M = 420, X = Math.max(250, Math.round(window.innerHeight * 0.2));
  let $ = t, q = n;
  return $ + M > D - 10 && ($ = D - M - 10), q + X > w - 10 && (q = w - X - 10), q < R.top + 10 && (q = R.top + 10), /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "rule-menu",
      layer: de.Panel,
      draggable: !0,
      onClose: r,
      position: { x: $, y: q },
      style: {
        width: M,
        maxHeight: X,
        background: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        border: "1px solid rgb(var(--border))",
        borderRadius: "8px",
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "13px",
        display: "flex",
        flexDirection: "column"
      },
      onClick: (I) => I.stopPropagation(),
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              borderBottom: "1px solid rgb(var(--border))",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            },
            children: [
              /* @__PURE__ */ c.jsx(
                "span",
                {
                  style: {
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#4a90d9",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                    flexShrink: 0
                  },
                  children: ((oe = (G = i.data) == null ? void 0 : G.label) == null ? void 0 : oe[0]) ?? "?"
                }
              ),
              /* @__PURE__ */ c.jsx(
                "span",
                {
                  style: {
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "rgb(var(--foreground))"
                  },
                  children: ((J = i.data) == null ? void 0 : J.label) ?? i.id
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "6px 0" }, children: [
          m.map((I, O) => {
            const W = E(I.targetType);
            return /* @__PURE__ */ c.jsxs(
              "div",
              {
                style: {
                  margin: "4px 10px",
                  background: "rgb(var(--hover))",
                  borderRadius: 6,
                  border: "1px solid rgb(var(--border))"
                },
                children: [
                  /* @__PURE__ */ c.jsxs(
                    "div",
                    {
                      style: {
                        padding: "8px 10px",
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                        borderBottom: "1px solid rgb(var(--border))",
                        flexWrap: "wrap"
                      },
                      children: [
                        /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            style: {
                              color: "rgb(var(--muted))",
                              fontSize: "11px",
                              whiteSpace: "nowrap"
                            },
                            children: "查找 当前节点"
                          }
                        ),
                        /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            style: {
                              color: I.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: I.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ c.jsxs(
                          "select",
                          {
                            value: I.relationType,
                            onChange: (L) => A(O, { relationType: L.target.value }),
                            style: F(O, "relationType", {
                              ...De,
                              width: 65
                            }),
                            children: [
                              /* @__PURE__ */ c.jsx("option", { value: "", children: "关系" }),
                              a(I.targetType).map((L) => /* @__PURE__ */ c.jsx("option", { value: L, children: $s[L] ?? L }, L))
                            ]
                          }
                        ),
                        /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            style: {
                              color: I.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: I.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ c.jsxs(
                          "select",
                          {
                            value: I.targetType,
                            onChange: (L) => A(O, { targetType: L.target.value }),
                            style: F(O, "targetType", {
                              ...De,
                              width: 85
                            }),
                            children: [
                              /* @__PURE__ */ c.jsx("option", { value: "", children: "类型" }),
                              d.map((L) => {
                                const V = Object.values(o[L] ?? {}).reduce(
                                  (Z, Se) => Z + (Se.total ?? 0),
                                  0
                                ), se = e[L] ?? { out: 0, in: 0 }, ae = V - (se.out + se.in);
                                return /* @__PURE__ */ c.jsxs("option", { value: L, children: [
                                  Gs[L] ?? L,
                                  " (",
                                  ae,
                                  ")"
                                ] }, L);
                              })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c.jsxs(
                          "select",
                          {
                            value: I.direction,
                            onChange: (L) => A(O, { direction: L.target.value }),
                            style: F(O, "direction", {
                              ...De,
                              width: 100
                            }),
                            children: [
                              /* @__PURE__ */ c.jsx("option", { value: "", children: "方向" }),
                              (() => {
                                var Se;
                                const L = (Se = o[I.targetType]) == null ? void 0 : Se[I.relationType], V = e[I.targetType] ?? {
                                  out: 0,
                                  in: 0
                                }, se = ((L == null ? void 0 : L.out) ?? 0) - V.out, ae = ((L == null ? void 0 : L.in) ?? 0) - V.in, Z = [];
                                return se > 0 && Z.push({
                                  value: "out",
                                  label: `从本节点 (${se})`
                                }), ae > 0 && Z.push({
                                  value: "in",
                                  label: `指向本节点 (${ae})`
                                }), Z.length > 0 && Z.map((Ne) => /* @__PURE__ */ c.jsx("option", { value: Ne.value, children: Ne.label }, Ne.value));
                              })()
                            ]
                          }
                        ),
                        m.length > 1 && /* @__PURE__ */ c.jsx(
                          "span",
                          {
                            style: {
                              color: "#d32f2f",
                              cursor: "pointer",
                              fontSize: "14px"
                            },
                            onClick: () => b(O),
                            children: "✕"
                          }
                        )
                      ]
                    }
                  ),
                  I.filters.map((L, V) => {
                    const se = L.property ? B(I.targetType, L.property) : "string", ae = H(se);
                    return /* @__PURE__ */ c.jsxs(
                      "div",
                      {
                        style: {
                          padding: "6px 10px 6px 14px",
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                          borderBottom: "1px solid rgb(var(--border))",
                          flexWrap: "wrap"
                        },
                        children: [
                          /* @__PURE__ */ c.jsxs(
                            "select",
                            {
                              value: L.property,
                              onChange: (Z) => S(O, V, {
                                property: Z.target.value,
                                operator: "eq",
                                value: ""
                              }),
                              style: { ...De, width: 80 },
                              children: [
                                /* @__PURE__ */ c.jsx("option", { value: "", children: "属性" }),
                                W.map((Z) => /* @__PURE__ */ c.jsx("option", { value: Z.name, children: qs[Z.name] ?? Z.name }, Z.name))
                              ]
                            }
                          ),
                          L.property && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                            /* @__PURE__ */ c.jsx(
                              "select",
                              {
                                value: L.operator,
                                onChange: (Z) => S(O, V, { operator: Z.target.value }),
                                style: { ...De, width: 80 },
                                children: ae.map((Z) => /* @__PURE__ */ c.jsx("option", { value: Z.key, children: Z.label }, Z.key))
                              }
                            ),
                            L.operator === "between" ? /* @__PURE__ */ c.jsxs(
                              "span",
                              {
                                style: {
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center"
                                },
                                children: [
                                  /* @__PURE__ */ c.jsx(
                                    "input",
                                    {
                                      placeholder: "min",
                                      value: L.value,
                                      onChange: (Z) => S(O, V, { value: Z.target.value }),
                                      style: { ...at, width: 50 }
                                    }
                                  ),
                                  /* @__PURE__ */ c.jsx("span", { style: { color: "#667" }, children: "~" })
                                ]
                              }
                            ) : /* @__PURE__ */ c.jsx(
                              "input",
                              {
                                placeholder: "值",
                                value: L.value,
                                onChange: (Z) => S(O, V, { value: Z.target.value }),
                                style: { ...at, width: 60 }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ c.jsx(
                            "span",
                            {
                              style: {
                                color: "#d32f2f",
                                cursor: "pointer",
                                fontSize: "12px"
                              },
                              onClick: () => P(O, V),
                              children: "✕"
                            }
                          )
                        ]
                      },
                      V
                    );
                  }),
                  /* @__PURE__ */ c.jsx(
                    "div",
                    {
                      style: {
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: /* @__PURE__ */ c.jsx(
                        "span",
                        {
                          style: {
                            color: "#1976d2",
                            cursor: "pointer",
                            fontSize: "11px"
                          },
                          onClick: () => _(O),
                          children: "+ 添加过滤条件"
                        }
                      )
                    }
                  )
                ]
              },
              O
            );
          }),
          /* @__PURE__ */ c.jsx("div", { style: { textAlign: "center", padding: "6px 0" }, children: /* @__PURE__ */ c.jsx(
            "span",
            {
              style: { color: "#1976d2", cursor: "pointer", fontSize: "12px" },
              onClick: N,
              children: "+ 添加拓出条件"
            }
          ) })
        ] }),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "8px 14px",
              borderTop: "1px solid rgb(var(--border))",
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end"
            },
            children: [
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  style: {
                    ...Mt,
                    border: "1px solid rgb(var(--border-strong))",
                    background: "transparent",
                    color: "rgb(var(--muted))"
                  },
                  onClick: r,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  style: {
                    ...Mt,
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold"
                  },
                  onClick: () => {
                    C() && (s(i.id, ["__custom__"], m), r());
                  },
                  children: "执行"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const at = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  color: "rgb(var(--foreground))",
  padding: "3px 6px",
  fontSize: "11px",
  outline: "none",
  fontFamily: "monospace"
}, De = {
  ...at,
  cursor: "pointer"
}, Mt = {
  padding: "5px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "11px"
};
function Js() {
  return /* @__PURE__ */ c.jsxs(
    "svg",
    {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ c.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
        /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "13", r: "4" })
      ]
    }
  );
}
function Qs() {
  return /* @__PURE__ */ c.jsxs(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ c.jsx("polyline", { points: "3 6 5 6 21 6" }),
        /* @__PURE__ */ c.jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
      ]
    }
  );
}
const ei = {
  width: 260,
  maxHeight: "calc(100% - 60px)",
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  color: "rgb(var(--foreground))",
  fontFamily: "monospace",
  fontSize: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "var(--shadow)"
}, ti = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderBottom: "1px solid rgb(var(--border))",
  fontWeight: 600,
  fontSize: "13px"
}, ni = {
  display: "flex",
  gap: "6px"
}, si = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  background: "transparent",
  color: "rgb(var(--muted))",
  cursor: "pointer"
}, ii = {
  flex: 1,
  overflowY: "auto",
  padding: "4px 0"
}, sn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  borderLeft: "3px solid transparent",
  transition: "background 0.15s"
}, ri = {
  ...sn,
  borderLeft: "3px solid #e94560",
  background: "rgba(233,69,96,0.06)"
}, oi = {
  flex: 1,
  overflow: "hidden"
}, ai = {
  fontSize: "12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}, li = {
  fontSize: "10px",
  color: "rgb(var(--muted))",
  marginTop: 2
}, ci = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  border: "none",
  borderRadius: 3,
  background: "transparent",
  color: "rgb(var(--muted))",
  cursor: "pointer",
  opacity: 0,
  transition: "opacity 0.15s"
}, di = {
  padding: "20px",
  textAlign: "center",
  color: "rgb(var(--muted))",
  fontSize: "11px"
};
function hi(i) {
  const e = new Date(i);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")} ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}:${String(e.getSeconds()).padStart(2, "0")}`;
}
function ui({
  historyManager: i,
  currentIndex: e,
  onTakeSnapshot: t,
  onJumpTo: n,
  onDeleteEntry: s,
  onClose: r
}) {
  const o = K(null), l = i.getHistory();
  return te(() => {
    if (!o.current) return;
    const d = o.current.children[e];
    d && d.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [e]), /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "snapshot-panel",
      layer: de.Panel,
      draggable: !0,
      onClose: r,
      resizable: !0,
      defaultSize: { w: 260, h: 300 },
      position: { x: window.innerWidth - 280, y: 40 },
      style: ei,
      children: [
        /* @__PURE__ */ c.jsxs("div", { style: ti, children: [
          /* @__PURE__ */ c.jsx("span", { children: "📸 快照" }),
          /* @__PURE__ */ c.jsx("div", { style: ni, children: /* @__PURE__ */ c.jsx(
            "button",
            {
              style: si,
              onClick: t,
              title: "拍摄快照",
              onMouseEnter: (d) => {
                d.currentTarget.style.background = "rgba(233,69,96,0.2)";
              },
              onMouseLeave: (d) => {
                d.currentTarget.style.background = "transparent";
              },
              children: /* @__PURE__ */ c.jsx(Js, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ c.jsx("div", { ref: o, style: ii, children: l.length === 0 ? /* @__PURE__ */ c.jsxs("div", { style: di, children: [
          "暂无快照",
          /* @__PURE__ */ c.jsx("br", {}),
          /* @__PURE__ */ c.jsx("span", { style: { fontSize: 10 }, children: "点击 📷 拍摄当前图谱" })
        ] }) : l.map((d, a) => {
          const g = a === e;
          return /* @__PURE__ */ c.jsxs(
            "div",
            {
              style: g ? ri : sn,
              onClick: () => n(a),
              onMouseEnter: (y) => {
                g || (y.currentTarget.style.background = "rgb(var(--hover))");
                const u = y.currentTarget.querySelector(
                  ".del-btn"
                );
                u && (u.style.opacity = "1");
              },
              onMouseLeave: (y) => {
                g || (y.currentTarget.style.background = "transparent");
                const u = y.currentTarget.querySelector(
                  ".del-btn"
                );
                u && (u.style.opacity = "0");
              },
              children: [
                /* @__PURE__ */ c.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 14,
                      opacity: g ? 1 : 0.4,
                      flexShrink: 0
                    },
                    children: g ? "●" : "○"
                  }
                ),
                /* @__PURE__ */ c.jsxs("div", { style: oi, children: [
                  /* @__PURE__ */ c.jsx("div", { style: ai, children: d.description || d.type }),
                  /* @__PURE__ */ c.jsx("div", { style: li, children: hi(d.timestamp) })
                ] }),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    className: "del-btn",
                    style: ci,
                    onClick: (y) => {
                      y.stopPropagation(), s(a);
                    },
                    onMouseEnter: (y) => {
                      y.currentTarget.style.color = "rgb(var(--primary))";
                    },
                    onMouseLeave: (y) => {
                      y.currentTarget.style.color = "rgb(var(--muted))";
                    },
                    children: /* @__PURE__ */ c.jsx(Qs, {})
                  }
                )
              ]
            },
            a
          );
        }) }),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "6px 12px",
              borderTop: "1px solid rgb(var(--border))",
              fontSize: "10px",
              color: "rgb(var(--muted))",
              textAlign: "center"
            },
            children: [
              l.length,
              "/",
              i.maxSize,
              " · 当前 #",
              e + 1
            ]
          }
        )
      ]
    }
  );
}
function rn() {
  const [i, e] = U({
    status: "idle",
    data: null,
    error: null
  }), t = K(0), n = K(null), s = z(async (o) => {
    var a;
    const l = ++t.current;
    (a = n.current) == null || a.abort();
    const d = new AbortController();
    n.current = d, e((g) => ({ ...g, status: "loading", error: null }));
    try {
      const g = await o(d.signal);
      return l !== t.current ? void 0 : (e({ status: "success", data: g, error: null }), g);
    } catch (g) {
      if (l !== t.current || (g == null ? void 0 : g.name) === "AbortError") return;
      e({
        status: "error",
        data: null,
        error: g instanceof Error ? g.message : String(g)
      });
    }
  }, []), r = z(() => {
    var o;
    t.current++, (o = n.current) == null || o.abort(), e({ status: "idle", data: null, error: null });
  }, []);
  return te(() => () => {
    var o;
    t.current++, (o = n.current) == null || o.abort();
  }, []), {
    ...i,
    run: s,
    reset: r,
    isLoading: i.status === "loading",
    isSuccess: i.status === "success",
    isError: i.status === "error"
  };
}
const gi = "/api/v1";
let lt = "";
function fi(i) {
  lt = i;
}
async function Oe(i, e, t) {
  const n = {
    "Content-Type": "application/json"
  };
  lt && (n.Authorization = `Bearer ${lt}`);
  const s = await fetch(`${gi}${i}`, {
    method: "POST",
    headers: n,
    body: JSON.stringify(e),
    signal: t
  });
  if (!s.ok) {
    const o = await s.text();
    throw new Error(`API ${i} failed (${s.status}): ${o}`);
  }
  const r = await s.json();
  if (!r.success) throw new Error(`API ${i} failed`);
  return r.data;
}
const Fe = {
  init(i) {
    return Oe("/graph/init", { ids: i });
  },
  search(i, e = 10, t) {
    return Oe("/graph/search", { query: i, limit: e }, t);
  },
  expand(i) {
    return Oe("/graph/expand", i);
  },
  analyze(i, e) {
    return Oe("/graph/analyze", i, e);
  }
}, pi = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, yi = [
  { value: "1d", label: "1 天" },
  { value: "7d", label: "1 周" },
  { value: "30d", label: "1 个月" },
  { value: "90d", label: "3 个月" },
  { value: "365d", label: "1 年" }
], tt = [
  {
    value: "call_circle",
    label: "通话圈分析",
    params: [
      {
        key: "timeWindow",
        label: "时间范围",
        type: "select",
        options: yi
      }
    ],
    resultLabel: (i) => i.label ?? i.id,
    resultDetail: (i) => `${pi[i.relation] ?? i.relation} · ${i.count ?? 0} 次${i.time ? ` · ${i.time}` : ""}`
  }
], Dt = {
  padding: "3px 6px",
  fontSize: "11px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  outline: "none",
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
  width: 80
};
function vi({
  modelRef: i,
  viewRef: e,
  onClose: t,
  onExpand: n
}) {
  const { analysisTarget: s } = pe(), [r, o] = U(tt[0].value), [l, d] = U([]), [a, g] = U(null), [y, u] = U({
    timeWindow: "1d"
  }), { run: f, isLoading: m } = rn();
  te(() => () => {
    var A, N;
    (A = e.current) == null || A.setHighlightNodes([]), (N = e.current) == null || N.setHoveredNodes([]);
  }, [e]);
  const x = (A) => {
    var N;
    return ((N = i.current) == null ? void 0 : N.getGraphModelData().graphData.nodes.some((b) => b.id === A)) ?? !1;
  };
  if (!s) return null;
  const h = s.ids, v = s.labels, k = tt.find((A) => A.value === r), C = () => {
    var N;
    const A = { nodeIds: h, type: r };
    for (const b of k.params) {
      const _ = (N = y[b.key]) == null ? void 0 : N.trim();
      _ && (A[b.key] = _);
    }
    f(async (b) => await Fe.analyze(A, b)).then((b) => {
      if (!b) return;
      const _ = b.items ?? [];
      d(_), g(b.graphData ?? null);
      const S = i.current, P = e.current;
      if (S && P) {
        const E = new Set(
          S.getGraphModelData().graphData.nodes.map((H) => H.id)
        );
        P.setHighlightNodes(
          _.filter((H) => E.has(H.id)).map((H) => H.id)
        );
      }
    });
  }, T = () => k.params.length === 0 ? null : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    k.params.map(
      (A) => A.type === "select" && A.options ? /* @__PURE__ */ c.jsx(
        "select",
        {
          value: y[A.key] ?? "",
          onChange: (N) => u((b) => ({ ...b, [A.key]: N.target.value })),
          style: {
            ...Dt,
            width: "auto",
            minWidth: 80,
            cursor: "pointer"
          },
          children: A.options.map((N) => /* @__PURE__ */ c.jsx("option", { value: N.value, children: N.label }, N.value))
        },
        A.key
      ) : /* @__PURE__ */ c.jsx(
        "input",
        {
          placeholder: A.placeholder ?? A.label,
          value: y[A.key] ?? "",
          onChange: (N) => u((b) => ({ ...b, [A.key]: N.target.value })),
          style: Dt
        },
        A.key
      )
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: C,
        disabled: m,
        style: {
          padding: "4px 10px",
          fontSize: "12px",
          fontFamily: "monospace",
          border: "none",
          borderRadius: 4,
          background: "#1976d2",
          color: "#fff",
          cursor: "pointer"
        },
        children: m ? "..." : "查询"
      }
    )
  ] });
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "analysis-panel",
      layer: de.Panel,
      draggable: !0,
      onClose: t,
      resizable: !0,
      defaultSize: {
        w: 340,
        h: Math.max(300, Math.round(window.innerHeight * 0.5))
      },
      position: { x: window.innerWidth - 360, y: 50 },
      style: {
        background: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: 8,
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "13px",
        color: "rgb(var(--foreground))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px 10px 4px",
              borderBottom: "1px solid rgb(var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold", fontSize: "13px" }, children: "分析" }),
              /* @__PURE__ */ c.jsx(
                "span",
                {
                  style: {
                    color: "rgb(var(--muted))",
                    fontSize: "11px",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  children: v.join(", ")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "8px 14px",
              display: "flex",
              gap: 6,
              alignItems: "center",
              borderBottom: "1px solid rgb(var(--border))",
              flexWrap: "wrap"
            },
            children: [
              /* @__PURE__ */ c.jsx(
                "select",
                {
                  value: r,
                  onChange: (A) => {
                    o(A.target.value), d([]), g(null), u({});
                  },
                  style: {
                    fontSize: "12px",
                    fontFamily: "monospace",
                    padding: "3px 6px",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: 3,
                    background: "rgb(var(--background))",
                    color: "rgb(var(--foreground))",
                    cursor: "pointer"
                  },
                  children: tt.map((A) => /* @__PURE__ */ c.jsx("option", { value: A.value, children: A.label }, A.value))
                }
              ),
              T()
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
          l.length === 0 && !m && /* @__PURE__ */ c.jsx(
            "div",
            {
              style: {
                color: "rgb(var(--muted))",
                textAlign: "center",
                padding: 20
              },
              children: '设置条件后点击"查询"'
            }
          ),
          l.map((A, N) => /* @__PURE__ */ c.jsxs(
            "div",
            {
              style: {
                padding: "8px 14px",
                borderBottom: "1px solid rgb(var(--border))",
                fontSize: "12px",
                cursor: "pointer"
              },
              onClick: () => {
                if (!a) return;
                const b = A.sourceId, _ = A.id, S = a.links.filter(
                  (F) => F.source === b && F.target === _ || F.source === _ && F.target === b
                ), P = /* @__PURE__ */ new Set();
                S.forEach((F) => {
                  P.add(F.source), P.add(F.target);
                });
                let E = a.nodes.filter(
                  (F) => P.has(F.id)
                );
                const H = new Set(E.map((F) => F.id));
                b && !H.has(b) && (E = [
                  ...E,
                  { id: b, data: { nodeType: "phone", label: b } }
                ]), n({ nodes: E, links: S });
              },
              onMouseEnter: (b) => {
                var _;
                b.currentTarget.style.background = "rgb(var(--hover))", x(A.id) && ((_ = e.current) == null || _.setHoveredNodes([A.id]));
              },
              onMouseLeave: (b) => {
                var _;
                b.currentTarget.style.background = "rgb(var(--background))", (_ = e.current) == null || _.setHoveredNodes([]);
              },
              children: [
                /* @__PURE__ */ c.jsx("div", { style: { fontWeight: "bold", color: "rgb(var(--primary))" }, children: k.resultLabel(A) }),
                /* @__PURE__ */ c.jsx("div", { style: { color: "rgb(var(--muted))", fontSize: "11px" }, children: k.resultDetail(A) })
              ]
            },
            `${A.id}-${N}`
          ))
        ] })
      ]
    }
  );
}
const Et = (i) => i, xi = (i, e) => {
  const t = e ?? "default", n = i.node[t];
  if (n) return Et(n);
  if (t !== "default") {
    const s = i.node.default;
    if (s) return Et(s);
  }
  return {};
}, We = (i, e) => {
  if (!e) return {};
  const t = i[e];
  return t || {};
}, Rt = (i) => i, mi = (i, e) => {
  const t = e ?? "default", n = i.link[t];
  if (n) return Rt(n);
  if (t !== "default") {
    const s = i.link.default;
    if (s) return Rt(s);
  }
  return {};
}, It = (i, e) => {
  if (!e) return {};
  const t = i[e];
  return t || {};
};
class bi {
  constructor() {
    p(this, "subscribers", /* @__PURE__ */ new Map());
  }
  /**
   * 订阅事件
   * @param eventType 事件类型
   * @param subscriber 事件处理函数
   * @returns 取消订阅的函数
   */
  subscribe(e, t) {
    const n = String(e);
    this.subscribers.has(n) || this.subscribers.set(n, /* @__PURE__ */ new Set());
    const s = this.subscribers.get(n);
    return s.add(t), () => {
      s.delete(t), s.size === 0 && this.subscribers.delete(n);
    };
  }
  /**
   * 发布事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  publish(e, t) {
    const n = String(e), s = this.subscribers.get(n);
    s && s.forEach((r) => {
      try {
        r(t);
      } catch (o) {
        console.error(
          `Error in event subscriber for ${String(e)}:`,
          o
        );
      }
    });
  }
  /**
   * 取消订阅指定事件类型的所有订阅者
   * @param eventType 事件类型
   */
  unsubscribeAll(e) {
    const t = String(e);
    this.subscribers.delete(t);
  }
  /**
   * 清除所有事件订阅
   */
  clear() {
    this.subscribers.clear();
  }
  /**
   * 获取指定事件类型的订阅者数量
   * @param eventType 事件类型
   * @returns 订阅者数量
   */
  getSubscriberCount(e) {
    const t = String(e), n = this.subscribers.get(t);
    return n ? n.size : 0;
  }
  /**
   * 获取所有已订阅的事件类型
   * @returns 事件类型数组
   */
  getSubscribedEvents() {
    return Array.from(this.subscribers.keys());
  }
  /**
   * 检查是否有订阅者订阅了指定事件
   * @param eventType 事件类型
   * @returns 是否有订阅者
   */
  hasSubscribers(e) {
    return this.getSubscriberCount(e) > 0;
  }
}
class ki {
  constructor(e) {
    p(this, "tags");
    p(this, "events");
    this.tags = /* @__PURE__ */ new Map(), this.events = e;
  }
  /**
   * 生成存储键
   */
  getKey(e, t) {
    return `${e}:${t}`;
  }
  /**
   * 添加标签（通用方法）
   */
  addTag(e, t, n) {
    const s = {
      targetId: e,
      targetType: t,
      ...n
    }, r = this.getKey(t, e), o = this.tags.get(r) || [];
    return o.some(
      (l) => JSON.stringify(l) === JSON.stringify(s)
    ) || o.push(s), this.tags.set(r, o), this.events.publish("tagChange", {
      action: "add",
      targetId: e,
      targetType: t,
      tag: s
    }), s;
  }
  /**
   * 为节点添加标签（便捷方法，保持向后兼容）
   */
  addNodeTag(e, t) {
    return this.addTag(e, "node", t);
  }
  /**
   * 为边添加标签（便捷方法）
   */
  addLinkTag(e, t) {
    return this.addTag(e, "link", t);
  }
  /**
   * 移除目标的所有标签
   */
  removeAllTags(e, t) {
    const n = this.getKey(t, e), s = this.tags.get(n);
    return !s || s.length === 0 ? !1 : (this.tags.delete(n), this.events.publish("tagChange", {
      action: "remove",
      targetId: e,
      targetType: t,
      tag: void 0
    }), !0);
  }
  /**
   * 移除节点的所有标签（便捷方法，保持向后兼容）
   */
  removeAllNodeTags(e) {
    return this.removeAllTags(e, "node");
  }
  /**
   * 移除边的所有标签（便捷方法）
   */
  removeAllLinkTags(e) {
    return this.removeAllTags(e, "link");
  }
  /**
   * 获取目标的所有标签
   */
  getTags(e, t) {
    const n = this.getKey(t, e);
    return this.tags.get(n) || [];
  }
  /**
   * 获取节点的所有标签（便捷方法，保持向后兼容）
   */
  getNodeTags(e) {
    return this.getTags(e, "node");
  }
  /**
   * 获取边的所有标签（便捷方法）
   */
  getLinkTags(e) {
    return this.getTags(e, "link");
  }
  /**
   * 获取所有标签
   */
  getAllTags() {
    const e = [];
    for (const t of this.tags.values())
      e.push(...t);
    return e;
  }
  /**
   * 获取所有节点标签
   */
  getAllNodeTags() {
    return this.getAllTags().filter(
      (e) => e.targetType === "node"
    );
  }
  /**
   * 获取所有边标签
   */
  getAllLinkTags() {
    return this.getAllTags().filter(
      (e) => e.targetType === "link"
    );
  }
  /**
   * 获取所有有标签的目标ID（按类型）
   */
  getTaggedTargetIds(e) {
    const t = [];
    for (const [n, s] of this.tags.entries())
      s.length > 0 && n.startsWith(`${e}:`) && t.push(n.substring(e.length + 1));
    return t;
  }
  /**
   * 获取所有有标签的节点ID
   */
  getTaggedNodeIds() {
    return this.getTaggedTargetIds("node");
  }
  /**
   * 获取所有有标签的边ID
   */
  getTaggedLinkIds() {
    return this.getTaggedTargetIds("link");
  }
  /**
   * 批量添加标签
   */
  addTags(e) {
    const t = [];
    return e.forEach((n) => {
      const { targetId: s, targetType: r, ...o } = n, l = this.addTag(s, r, o);
      t.push(l);
    }), t;
  }
  /**
   * 批量移除标签
   */
  removeAllTagsForTargets(e) {
    let t = 0;
    return e.forEach(({ targetId: n, targetType: s }) => {
      this.removeAllTags(n, s) && t++;
    }), t;
  }
  /**
   * 批量移除节点标签（便捷方法）
   */
  removeAllTagsForNodes(e) {
    return this.removeAllTagsForTargets(
      e.map((t) => ({
        targetId: t,
        targetType: "node"
      }))
    );
  }
  /**
   * 批量移除边标签（便捷方法）
   */
  removeAllTagsForLinks(e) {
    return this.removeAllTagsForTargets(
      e.map((t) => ({
        targetId: t,
        targetType: "link"
      }))
    );
  }
  /**
   * 清空所有标签
   */
  clearAll() {
    const e = Array.from(this.tags.keys());
    this.tags.clear(), this.events.publish("tagChange", {
      action: "clear",
      targetIds: e
    });
  }
  /**
   * 更新目标指定类型的标签
   */
  updateTagByType(e, t, n, s) {
    const r = this.getTags(e, t);
    if (!r) return;
    const o = r.findIndex((a) => a.targetType === n);
    if (o === -1) return;
    const l = {
      ...r[o],
      ...s,
      metadata: {
        ...r[o].metadata,
        ...s.metadata,
        type: n
        // 保持类型不变
      }
    };
    r[o] = l;
    const d = this.getKey(t, e);
    return this.tags.set(d, r), this.events.publish("tagChange", {
      action: "update",
      targetId: e,
      targetType: t,
      tag: l
    }), l;
  }
  /**
   * 检查目标是否有标签
   */
  hasTag(e, t) {
    return this.getTags(e, t).length > 0;
  }
  /**
   * 检查节点是否有标签（便捷方法，保持向后兼容）
   */
  hasNodeTag(e) {
    return this.hasTag(e, "node");
  }
  /**
   * 检查边是否有标签（便捷方法）
   */
  hasLinkTag(e) {
    return this.hasTag(e, "link");
  }
  /**
   * 获取标签数量
   */
  getTagCount() {
    let e = 0;
    for (const t of this.tags.values())
      e += t.length;
    return e;
  }
  /**
   * 根据标签属性筛选
   */
  filterTags(e) {
    const t = [];
    for (const n of this.tags.values())
      t.push(...n);
    return t.filter(e);
  }
  /**
   * 设置指定类型标签的可见性
   */
  setTagVisibleByType(e, t, n, s) {
    return this.updateTagByType(e, t, n, { visible: s });
  }
  /**
   * 设置目标所有标签的可见性
   */
  setAllTagsVisibleForTarget(e, t, n) {
    const s = this.getTags(e, t), r = [];
    if (s.forEach((o, l) => {
      const d = {
        ...o,
        visible: n
      };
      s[l] = d, r.push(d);
    }), r.length > 0) {
      const o = this.getKey(t, e);
      this.tags.set(o, s), r.forEach((l) => {
        this.events.publish("tagChange", {
          action: "update",
          targetId: e,
          targetType: t,
          tag: l
        });
      });
    }
    return r;
  }
  /**
   * 设置节点所有标签的可见性（便捷方法，保持向后兼容）
   */
  setAllTagsVisibleForNode(e, t) {
    return this.setAllTagsVisibleForTarget(e, "node", t);
  }
  /**
   * 设置边所有标签的可见性（便捷方法）
   */
  setAllTagsVisibleForLink(e, t) {
    return this.setAllTagsVisibleForTarget(e, "link", t);
  }
  /**
   * 批量设置多个目标的所有标签可见性
   */
  setTagsVisible(e, t) {
    const n = [];
    return e.forEach(({ targetId: s, targetType: r }) => {
      const o = this.setAllTagsVisibleForTarget(
        s,
        r,
        t
      );
      n.push(...o);
    }), n;
  }
  /**
   * 批量设置多个节点的所有标签可见性（便捷方法）
   */
  setNodeTagsVisible(e, t) {
    return this.setTagsVisible(
      e.map((n) => ({
        targetId: n,
        targetType: "node"
      })),
      t
    );
  }
  /**
   * 批量设置多个边的所有标签可见性（便捷方法）
   */
  setLinkTagsVisible(e, t) {
    return this.setTagsVisible(
      e.map((n) => ({
        targetId: n,
        targetType: "link"
      })),
      t
    );
  }
  /**
   * 切换指定类型标签的可见性
   */
  toggleTagVisibleByType(e, t, n) {
    const r = this.getTags(e, t).find((l) => l.targetType === n);
    if (!r) return;
    const o = !(r.visible ?? !0);
    return this.setTagVisibleByType(e, t, n, o);
  }
  /**
   * 获取所有可见的标签
   */
  getVisibleTags() {
    return this.filterTags((e) => e.visible !== !1);
  }
  /**
   * 获取所有隐藏的标签
   */
  getHiddenTags() {
    return this.filterTags((e) => e.visible === !1);
  }
  /**
   * 隐藏全部标签
   */
  hideAllTags() {
    const e = Array.from(this.tags.keys()).map((t) => {
      const [n, ...s] = t.split(":");
      return {
        targetId: s.join(":"),
        targetType: n
      };
    });
    return this.setTagsVisible(e, !1);
  }
  /**
   * 显示全部标签
   */
  showAllTags() {
    const e = Array.from(this.tags.keys()).map((t) => {
      const [n, ...s] = t.split(":");
      return {
        targetId: s.join(":"),
        targetType: n
      };
    });
    return this.setTagsVisible(e, !0);
  }
  /**
   * 根据标签文本搜索
   */
  searchTags(e) {
    const t = e.toLowerCase();
    return this.filterTags(
      (n) => {
        var s;
        return ((s = n.label) == null ? void 0 : s.toLowerCase().includes(t)) || !1;
      }
    );
  }
  /**
   * 导出标签数据
   */
  export() {
    return this.getAllTags();
  }
  /**
   * 导入标签数据
   */
  import(e) {
    this.clearAll();
    const t = /* @__PURE__ */ new Map();
    e.forEach((n) => {
      const s = this.getKey(n.targetType, n.targetId), r = t.get(s) || [];
      r.push(n), t.set(s, r);
    });
    for (const [n, s] of t)
      this.tags.set(n, s);
  }
  /**
   * 添加类型标签（通用）
   */
  addTypedTag(e, t, n, s, r) {
    return this.addTag(e, t, {
      label: s,
      metadata: { type: n, ...r == null ? void 0 : r.metadata },
      ...r
    });
  }
  /**
   * 为节点添加类型标签（便捷方法，保持向后兼容）
   */
  addTypedNodeTag(e, t, n, s) {
    return this.addTypedTag(e, "node", t, n, s);
  }
  /**
   * 为边添加类型标签（便捷方法）
   */
  addTypedLinkTag(e, t, n, s) {
    return this.addTypedTag(e, "link", t, n, s);
  }
  /**
   * 获取指定类型的标签
   */
  getTagByType(e, t, n) {
    return this.getTags(e, t).find(
      (s) => s.targetType === n
    );
  }
  /**
   * 获取节点指定类型的标签（便捷方法，保持向后兼容）
   */
  getNodeTagByType(e, t) {
    return this.getTagByType(e, "node", t);
  }
  /**
   * 获取边指定类型的标签（便捷方法）
   */
  getLinkTagByType(e, t) {
    return this.getTagByType(e, "link", t);
  }
  /**
   * 移除指定类型的标签
   */
  removeTagByType(e, t, n) {
    const s = this.getTags(e, t);
    if (!s || s.length === 0) return !1;
    const r = s.findIndex((a) => a.targetType === n);
    if (r === -1) return !1;
    const o = s[r], l = s.filter((a, g) => g !== r), d = this.getKey(t, e);
    return l.length === 0 ? this.tags.delete(d) : this.tags.set(d, l), this.events.publish("tagChange", {
      action: "remove",
      targetId: e,
      targetType: t,
      tag: o
    }), !0;
  }
  /**
   * 移除节点指定类型的标签（便捷方法，保持向后兼容）
   */
  removeNodeTagByType(e, t) {
    return this.removeTagByType(e, "node", t);
  }
  /**
   * 移除边指定类型的标签（便捷方法）
   */
  removeLinkTagByType(e, t) {
    return this.removeTagByType(e, "link", t);
  }
  /**
   * 获取目标标签数量
   */
  getTargetTagCount(e, t) {
    return this.getTags(e, t).length;
  }
  /**
   * 获取节点标签数量（便捷方法，保持向后兼容）
   */
  getNodeTagCount(e) {
    return this.getTargetTagCount(e, "node");
  }
  /**
   * 获取边标签数量（便捷方法）
   */
  getLinkTagCount(e) {
    return this.getTargetTagCount(e, "link");
  }
  /**
   * 获取所有有标签的节点ID（保持向后兼容）
   */
  getNodesWithTags() {
    return this.getTaggedNodeIds();
  }
  /**
   * 获取所有有标签的边ID
   */
  getLinksWithTags() {
    return this.getTaggedLinkIds();
  }
  /**
   * 获取标签Map（原始数据）
   */
  getTagMap() {
    return this.tags;
  }
}
class _i {
  constructor(e) {
    p(this, "model");
    p(this, "globalVisible");
    this.model = new ki(e), this.globalVisible = !0;
  }
  /**
   * 设置全局标签可见性
   */
  setGlobalVisible(e) {
    this.globalVisible = e;
  }
  /**
   * 获取全局标签可见性
   */
  getGlobalVisible() {
    return this.globalVisible;
  }
  /**
   * 切换全局标签可见性
   */
  toggleGlobalVisible() {
    return this.globalVisible = !this.globalVisible, this.globalVisible;
  }
  /**
   * 判断标签是否应该显示（考虑全局和单个标签的可见性）
   */
  isTagVisible(e) {
    return this.globalVisible ? e.visible !== !1 : !1;
  }
  /**
   * 获取目标所有应该显示的标签
   */
  getVisibleTags(e, t) {
    return this.globalVisible ? this.model.getTags(e, t).filter((n) => n.visible !== !1) : [];
  }
  /**
   * 获取节点所有应该显示的标签（便捷方法，保持向后兼容）
   */
  getVisibleNodeTags(e) {
    return this.getVisibleTags(e, "node");
  }
  /**
   * 获取边所有应该显示的标签（便捷方法）
   */
  getVisibleLinkTags(e) {
    return this.getVisibleTags(e, "link");
  }
  /**
   * 获取所有应该显示的标签
   */
  getAllVisibleTags() {
    return this.globalVisible ? this.model.getAllTags().filter((e) => e.visible !== !1) : [];
  }
  /**
   * 获取所有隐藏的标签
   */
  getAllHiddenTags() {
    return this.globalVisible ? this.model.getAllTags().filter((e) => e.visible === !1) : this.model.getAllTags();
  }
}
class Si {
  constructor(e) {
    p(this, "loadingStates");
    p(this, "events");
    this.loadingStates = /* @__PURE__ */ new Map(), this.events = e;
  }
  /**
   * 设置节点加载状态
   */
  setLoading(e, t, n) {
    const s = {
      nodeId: e,
      loading: t,
      progress: n == null ? void 0 : n.progress,
      message: n == null ? void 0 : n.message,
      metadata: n == null ? void 0 : n.metadata
    };
    return this.loadingStates.set(e, s), this.events.publish("loadingChange", {
      nodeId: e,
      loading: t,
      state: s
    }), s;
  }
  /**
   * 开始加载
   */
  startLoading(e, t) {
    return this.setLoading(e, !0, t);
  }
  /**
   * 停止加载
   */
  stopLoading(e) {
    return this.loadingStates.get(e) ? (this.setLoading(e, !1), !0) : !1;
  }
  /**
   * 更新加载进度
   */
  updateProgress(e, t, n) {
    const s = this.loadingStates.get(e);
    if (s)
      return this.setLoading(e, s.loading, {
        progress: t,
        message: n ?? s.message,
        metadata: s.metadata
      });
  }
  /**
   * 获取节点加载状态
   */
  getLoadingState(e) {
    return this.loadingStates.get(e);
  }
  /**
   * 检查节点是否正在加载
   */
  isLoading(e) {
    const t = this.loadingStates.get(e);
    return (t == null ? void 0 : t.loading) ?? !1;
  }
  /**
   * 获取所有加载状态
   */
  getAllLoadingStates() {
    return Array.from(this.loadingStates.values());
  }
  /**
   * 获取所有正在加载的节点ID
   */
  getLoadingNodeIds() {
    const e = [];
    for (const [t, n] of this.loadingStates.entries())
      n.loading && e.push(t);
    return e;
  }
  /**
   * 批量设置加载状态
   */
  setLoadingForNodes(e, t, n) {
    const s = [];
    return e.forEach((r) => {
      const o = this.setLoading(r, t, n);
      s.push(o);
    }), s;
  }
  /**
   * 批量开始加载
   */
  startLoadingForNodes(e, t) {
    return this.setLoadingForNodes(e, !0, t);
  }
  /**
   * 批量停止加载
   */
  stopLoadingForNodes(e) {
    let t = 0;
    return e.forEach((n) => {
      this.stopLoading(n) && t++;
    }), t;
  }
  /**
   * 清除节点加载状态
   */
  clearLoadingState(e) {
    return this.loadingStates.delete(e);
  }
  /**
   * 清除所有加载状态
   */
  clearAll() {
    const e = Array.from(this.loadingStates.keys());
    this.loadingStates.clear(), this.events.publish("loadingChange", {
      action: "clearAll",
      nodeIds: e
    });
  }
  /**
   * 获取正在加载的节点数量
   */
  getLoadingCount() {
    let e = 0;
    for (const t of this.loadingStates.values())
      t.loading && e++;
    return e;
  }
  /**
   * 根据条件筛选加载状态
   */
  filterLoadingStates(e) {
    return Array.from(this.loadingStates.values()).filter(e);
  }
  /**
   * 导出加载状态数据
   */
  export() {
    return this.getAllLoadingStates();
  }
  /**
   * 导入加载状态数据
   */
  import(e) {
    this.clearAll(), e.forEach((t) => {
      this.loadingStates.set(t.nodeId, t);
    });
  }
}
class wi {
  constructor(e) {
    p(this, "model");
    p(this, "globalVisible");
    this.model = new Si(e), this.globalVisible = !0;
  }
  /**
   * 设置全局加载状态可见性
   */
  setGlobalVisible(e) {
    this.globalVisible = e;
  }
  /**
   * 获取全局加载状态可见性
   */
  getGlobalVisible() {
    return this.globalVisible;
  }
  /**
   * 切换全局加载状态可见性
   */
  toggleGlobalVisible() {
    return this.globalVisible = !this.globalVisible, this.globalVisible;
  }
  /**
   * 判断节点加载状态是否应该显示
   */
  isLoadingVisible(e) {
    return this.globalVisible ? this.model.isLoading(e) : !1;
  }
  /**
   * 获取应该显示的加载状态
   */
  getVisibleLoadingStates() {
    return this.globalVisible ? this.model.filterLoadingStates((e) => e.loading) : [];
  }
  /**
   * 获取节点的可见加载状态
   */
  getVisibleLoadingState(e) {
    if (!this.globalVisible) return;
    const t = this.model.getLoadingState(e);
    return t != null && t.loading ? t : void 0;
  }
}
class Ti {
  constructor(e) {
    p(this, "state");
    p(this, "events");
    this.events = e, this.state = {
      highlightNodes: [],
      highlightLinks: [],
      selectedNodes: [],
      selectedLinks: [],
      hiddenNodes: [],
      hiddenLinks: [],
      rootNodes: [],
      hoveredNodes: [],
      hoveredLinks: []
    };
  }
  // ============ 焦点状态管理 ============
  /**
   * 设置高亮节点
   */
  setHighlightNodes(e, t) {
    this.state.highlightNodes = [...new Set(e)], this.state.highlightLinks = t ? [...new Set(t)] : [], this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加高亮节点
   */
  addHighlightNodes(e, t) {
    this.state.highlightNodes = [
      .../* @__PURE__ */ new Set([...this.state.highlightNodes, ...e])
    ], t && (this.state.highlightLinks = [
      .../* @__PURE__ */ new Set([...this.state.highlightLinks, ...t])
    ]), this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除高亮节点
   */
  removeHighlightNodes(e) {
    const t = new Set(e);
    this.state.highlightNodes = this.state.highlightNodes.filter(
      (n) => !t.has(n)
    ), this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 清空高亮
   */
  clearHighlightNodes() {
    this.state.highlightNodes = [], this.state.highlightLinks = [], this.events.publish("highlightChange", {
      nodeIds: [],
      linkIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取高亮节点
   */
  getHighlightNodes() {
    return [...this.state.highlightNodes];
  }
  /**
   * 获取高亮连线
   */
  getHighlightLinks() {
    return [...this.state.highlightLinks];
  }
  /**
   * 判断节点是否在高亮中
   */
  isHighlighted(e) {
    return this.state.highlightNodes.includes(e);
  }
  // ============ 选中状态管理 ============
  /**
   * 设置选中节点
   */
  setSelectedNodes(e, t) {
    this.state.selectedNodes = [...new Set(e)], this.state.selectedLinks = t ? [...new Set(t)] : [], this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加选中节点
   */
  addSelectedNodes(e, t) {
    this.state.selectedNodes = [
      .../* @__PURE__ */ new Set([...this.state.selectedNodes, ...e])
    ], t && (this.state.selectedLinks = [
      .../* @__PURE__ */ new Set([...this.state.selectedLinks, ...t])
    ]), this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除选中节点
   */
  removeSelectedNodes(e) {
    const t = new Set(e);
    this.state.selectedNodes = this.state.selectedNodes.filter(
      (n) => !t.has(n)
    ), this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 清空选中
   */
  clearSelection() {
    this.state.selectedNodes = [], this.state.selectedLinks = [], this.events.publish("selectionChange", {
      nodeIds: [],
      linkIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取选中节点
   */
  getSelectedNodes() {
    return [...this.state.selectedNodes];
  }
  /**
   * 获取选中连线
   */
  getSelectedLinks() {
    return [...this.state.selectedLinks];
  }
  /**
   * 判断节点是否被选中
   */
  isSelected(e) {
    return this.state.selectedNodes.includes(e);
  }
  // ============ 隐藏状态管理 ============
  /**
   * 设置隐藏节点
   */
  setHiddenNodes(e, t) {
    this.state.hiddenNodes = [...new Set(e)], this.state.hiddenLinks = t ? [...new Set(t)] : [], this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加隐藏节点
   */
  addHiddenNodes(e, t) {
    this.state.hiddenNodes = [
      .../* @__PURE__ */ new Set([...this.state.hiddenNodes, ...e])
    ], t && (this.state.hiddenLinks = [
      .../* @__PURE__ */ new Set([...this.state.hiddenLinks, ...t])
    ]), this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除隐藏节点（显示节点）
   */
  removeHiddenNodes(e) {
    const t = new Set(e);
    this.state.hiddenNodes = this.state.hiddenNodes.filter(
      (n) => !t.has(n)
    ), this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 显示所有节点
   */
  showAll() {
    this.state.hiddenNodes = [], this.state.hiddenLinks = [], this.events.publish("hiddenChange", {
      nodeIds: [],
      linkIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取隐藏节点
   */
  getHiddenNodes() {
    return [...this.state.hiddenNodes];
  }
  /**
   * 获取隐藏连线
   */
  getHiddenLinks() {
    return [...this.state.hiddenLinks];
  }
  /**
   * 判断节点是否被隐藏
   */
  isHidden(e) {
    return this.state.hiddenNodes.includes(e);
  }
  // ============ 根节点状态管理 ============
  /**
   * 设置根节点
   */
  setRootNodes(e) {
    this.state.rootNodes = [...new Set(e)], this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 添加根节点
   */
  addRootNodes(e) {
    this.state.rootNodes = [.../* @__PURE__ */ new Set([...this.state.rootNodes, ...e])], this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 移除根节点
   */
  removeRootNodes(e) {
    const t = new Set(e);
    this.state.rootNodes = this.state.rootNodes.filter(
      (n) => !t.has(n)
    ), this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 清空根节点
   */
  clearRootNodes() {
    this.state.rootNodes = [], this.events.publish("rootNodesChange", {
      nodeIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取根节点
   */
  getRootNodes() {
    return [...this.state.rootNodes];
  }
  /**
   * 判断节点是否为根节点
   */
  isRootNode(e) {
    return this.state.rootNodes.includes(e);
  }
  // ============ 悬浮节点状态管理 ============
  /**
   * 设置悬浮节点
   */
  setHoveredNodes(e) {
    this.state.hoveredNodes = [...new Set(e)], this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 添加悬浮节点
   */
  addHoveredNodes(e) {
    this.state.hoveredNodes = [
      .../* @__PURE__ */ new Set([...this.state.rootNodes, ...e])
    ], this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 移除悬浮节点
   */
  removeHoveredNodes(e) {
    const t = new Set(e);
    this.state.hoveredNodes = this.state.hoveredNodes.filter(
      (n) => !t.has(n)
    ), this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 清空悬浮节点
   */
  clearHoveredNodes() {
    this.state.hoveredNodes = [], this.events.publish("nodesHoverChange", {
      nodeIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取悬浮节点
   */
  getHoveredNodes() {
    return [...this.state.hoveredNodes];
  }
  /**
   * 判断节点是否为悬浮节点
   */
  isHoveredNode(e) {
    return this.state.hoveredNodes.includes(e);
  }
  // ============ 悬浮连线状态管理 ============
  /**
   * 设置悬浮连线
   */
  setHoveredLinks(e) {
    this.state.hoveredLinks = [...new Set(e)], this.events.publish("linksHoverChange", {
      linkIds: this.state.hoveredLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 清空悬浮连线
   */
  clearHoveredLinks() {
    this.state.hoveredLinks = [], this.events.publish("linksHoverChange", {
      linkIds: []
    }), this.publishMetaDataChange();
  }
  /**
   * 获取悬浮节点
   */
  getHoveredLinks() {
    return [...this.state.hoveredLinks];
  }
  /**
   * 判断节点是否为悬浮连线
   */
  isHoveredLink(e) {
    return this.state.hoveredLinks.includes(e);
  }
  // ============ 单个节点/边状态查询 ============
  /**
   * 获取节点的所有状态
   */
  getNodeState(e) {
    return {
      highlighted: this.isHighlighted(e),
      selected: this.isSelected(e),
      hidden: this.isHidden(e),
      hovered: this.isHoveredNode(e),
      root: this.isRootNode(e)
    };
  }
  /**
   * 获取边的所有状态
   */
  getLinkState(e) {
    return {
      highlighted: this.state.highlightLinks.includes(e),
      selected: this.state.selectedLinks.includes(e),
      hidden: this.state.hiddenLinks.includes(e),
      hovered: this.isHoveredLink(e)
    };
  }
  // ============ 通用方法 ============
  /**
   * 获取所有状态
   */
  getState() {
    return {
      highlightNodes: [...this.state.highlightNodes],
      highlightLinks: [...this.state.highlightLinks],
      selectedNodes: [...this.state.selectedNodes],
      selectedLinks: [...this.state.selectedLinks],
      hiddenNodes: [...this.state.hiddenNodes],
      hiddenLinks: [...this.state.hiddenLinks],
      rootNodes: [...this.state.rootNodes],
      hoveredNodes: [...this.state.hoveredNodes],
      hoveredLinks: [...this.state.hoveredLinks]
    };
  }
  /**
   * 批量更新状态
   */
  updateState(e) {
    let t = !1;
    e.highlightNodes !== void 0 && (this.state.highlightNodes = [...new Set(e.highlightNodes)], t = !0), e.highlightLinks !== void 0 && (this.state.highlightLinks = [...new Set(e.highlightLinks)], t = !0), e.selectedNodes !== void 0 && (this.state.selectedNodes = [...new Set(e.selectedNodes)], t = !0), e.selectedLinks !== void 0 && (this.state.selectedLinks = [...new Set(e.selectedLinks)], t = !0), e.hiddenNodes !== void 0 && (this.state.hiddenNodes = [...new Set(e.hiddenNodes)], t = !0), e.hiddenLinks !== void 0 && (this.state.hiddenLinks = [...new Set(e.hiddenLinks)], t = !0), e.rootNodes !== void 0 && (this.state.rootNodes = [...new Set(e.rootNodes)], t = !0), t && ((e.highlightNodes !== void 0 || e.highlightLinks !== void 0) && this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), (e.selectedNodes !== void 0 || e.selectedLinks !== void 0) && this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), (e.hiddenNodes !== void 0 || e.hiddenLinks !== void 0) && this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), e.rootNodes !== void 0 && this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange());
  }
  /**
   * 重置所有状态
   */
  reset() {
    this.state = {
      highlightNodes: [],
      highlightLinks: [],
      selectedNodes: [],
      selectedLinks: [],
      hiddenNodes: [],
      hiddenLinks: [],
      rootNodes: [],
      hoveredNodes: [],
      hoveredLinks: []
    }, this.events.publish("highlightChange", { nodeIds: [], linkIds: [] }), this.events.publish("selectionChange", { nodeIds: [], linkIds: [] }), this.events.publish("hiddenChange", { nodeIds: [], linkIds: [] }), this.events.publish("rootNodesChange", { nodeIds: [] }), this.publishMetaDataChange();
  }
  /**
   * 发布元数据变化事件
   */
  publishMetaDataChange() {
    this.events.publish("metaDataChange", {
      metaData: this.getState()
    });
  }
}
function Te(i, e) {
  const t = { ...i };
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      const s = e[n], r = t[n];
      s != null && typeof s == "object" && !Array.isArray(s) && r !== null && r !== void 0 && typeof r == "object" && !Array.isArray(r) ? t[n] = Te(r, s) : s !== void 0 && (t[n] = s);
    }
  return t;
}
class Ai {
  constructor(e) {
    p(this, "graphModelData");
    p(this, "nodeInstanceStyles", /* @__PURE__ */ new Map());
    p(this, "linkInstanceStyles", /* @__PURE__ */ new Map());
    this.graphModelData = e;
  }
  updategGraphModelData(e) {
    this.graphModelData = e;
  }
  init(e) {
    this.style = e;
  }
  update(e) {
    this.style = Te(this.style, e);
  }
  setNodeStyle(e, t) {
    this.nodeInstanceStyles.set(e, t);
  }
  setLinkStyle(e, t) {
    this.linkInstanceStyles.set(e, t);
  }
  hasNodeStyle(e) {
    return this.nodeInstanceStyles.has(e);
  }
  hasLinkStyle(e) {
    return this.linkInstanceStyles.has(e);
  }
  getNodeStyle(e) {
    var o;
    if (!e) return {};
    const t = this.graphModelData.graphData.nodes.find(
      (l) => l.id === e
    );
    if (!t) return {};
    const n = xi(this.style, (o = t.data) == null ? void 0 : o.nodeType);
    if (!this.hasNodeStyle(t.id)) return n;
    const s = this.nodeInstanceStyles.get(t.id);
    if (!s) return n;
    const r = Te({}, n);
    return Te(r, s);
  }
  getLinkStyle(e) {
    var o;
    if (!e) return {};
    const t = this.graphModelData.graphData.links.find(
      (l) => l.id === e
    );
    if (!t) return {};
    const n = mi(this.style, (o = t.data) == null ? void 0 : o.linkType);
    if (!this.hasLinkStyle(t.id)) return n;
    const s = this.linkInstanceStyles.get(t.id);
    if (!s) return n;
    const r = Te({}, n);
    return Te(r, s);
  }
  cleanNodeStyle(e) {
    this.nodeInstanceStyles.delete(e);
  }
  cleanLinkStyle(e) {
    this.linkInstanceStyles.delete(e);
  }
  getStyle() {
    return this.style;
  }
  getInstances() {
    return {
      nodeInstanceStyles: this.nodeInstanceStyles,
      linkInstanceStyles: this.linkInstanceStyles
    };
  }
  clear() {
    this.nodeInstanceStyles.clear(), this.linkInstanceStyles.clear();
  }
}
class Pi {
  constructor({ initData: e }) {
    p(this, "cache", {
      graphData: { nodes: [], links: [] }
    });
    p(this, "events", new bi());
    p(this, "tagManager", new _i(this.events));
    p(this, "loadingManager", new wi(this.events));
    p(this, "stateManager", new Ti(this.events));
    p(this, "styleManager", new Ai(this.cache));
    this.updateGraphData({
      graphData: e.graphData
    });
  }
  updateGraphData({ graphData: e }) {
    this.cache.graphData = e, this.styleManager.updategGraphModelData(this.cache), this.events.publish("dataChange", {
      graphData: this.cache.graphData
    });
  }
  /**
   * 更新元数据（焦点、选中、隐藏状态）
   * @deprecated 请使用 stateManager 代替
   */
  updateMetaData(e) {
    this.stateManager.updateState(e);
  }
  /**
   * 更新高亮节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setHighlightNodes 代替
   */
  updeteFoucsNodes(e) {
    const t = [...e], n = [];
    e.forEach((s) => {
      const r = this.getNodeById(s);
      r && this.cache.graphData.links.forEach((o) => {
        const l = typeof o.source == "object" ? o.source.id : o.source, d = typeof o.target == "object" ? o.target.id : o.target;
        (l === r.id || d === r.id) && n.push(o.id), l === r.id && d && t.push(String(d));
      });
    }), this.stateManager.setHighlightNodes(
      [...new Set(t)],
      [...new Set(n)]
    );
  }
  /**
   * 更新选中节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setSelectedNodes 代替
   */
  updateSelectedNodes(e, t) {
    const n = [...e], s = [];
    t ? s.push(...t) : e.forEach((r) => {
      const o = this.getNodeById(r);
      o && this.cache.graphData.links.forEach((l) => {
        const d = typeof l.source == "object" ? l.source.id : l.source, a = typeof l.target == "object" ? l.target.id : l.target;
        (d === o.id || a === o.id) && s.push(l.id), d === o.id && a && n.push(String(a));
      });
    }), this.stateManager.setSelectedNodes([...new Set(n)], [...new Set(s)]);
  }
  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  updateHiddenNodes(e) {
    this.stateManager.setHiddenNodes(e);
  }
  getGraphModelData() {
    return {
      ...this.cache,
      ...this.stateManager.getState()
    };
  }
  getLinkById(e) {
    return e && this.cache.graphData.links.find((t) => t.id === e) || null;
  }
  getNodeById(e) {
    return e && this.cache.graphData.nodes.find((t) => t.id === e) || null;
  }
}
class Ci {
  constructor() {
    p(this, "store", /* @__PURE__ */ new Map());
  }
  /** 生成唯一键 */
  key(e) {
    return `${e.type}:${e.id}`;
  }
  /** 设置实体元数据（合并模式） */
  setMeta(e, t) {
    const n = this.key(e);
    this.store.set(n, { ...this.store.get(n), ...t });
  }
  /** 获取实体元数据 */
  getMeta(e) {
    return this.store.get(this.key(e));
  }
  /** 更新分页信息 */
  updatePagination(e, t) {
    this.setMeta(e, t);
  }
  /** 获取分页信息 */
  getPagination(e) {
    const t = this.getMeta(e);
    return {
      pageIndex: t == null ? void 0 : t.pageIndex,
      total: t == null ? void 0 : t.total,
      count: t == null ? void 0 : t.count
    };
  }
  /** 设置拓展规则 */
  setRules(e, t) {
    this.setMeta(e, { rules: t });
  }
  /** 获取拓展规则 */
  getRules(e) {
    var t;
    return (t = this.getMeta(e)) == null ? void 0 : t.rules;
  }
  /** 删除实体元数据 */
  deleteMeta(e) {
    this.store.delete(this.key(e));
  }
  /** 清空所有元数据 */
  clear() {
    this.store.clear();
  }
  /** 实体数量 */
  get size() {
    return this.store.size;
  }
}
class Ni {
  constructor(e) {
    p(this, "history", []);
    p(this, "currentIndex", -1);
    p(this, "maxSize");
    this.maxSize = (e == null ? void 0 : e.maxSize) ?? 50, e != null && e.initialHistory && e.initialHistory.length > 0 && (this.history = e.initialHistory.map((t) => ({ ...t })), this.currentIndex = this.history.length - 1);
  }
  /** 添加新的历史记录（截断后续记录） */
  pushState(e) {
    const t = { ...e, timestamp: Date.now() };
    return this.history = this.history.slice(0, this.currentIndex + 1), this.history.push(t), this.history.length > this.maxSize ? this.history.shift() : this.currentIndex++, t;
  }
  /** 是否可以撤销 */
  get canGoBack() {
    return this.currentIndex > 0;
  }
  /** 是否可以重做 */
  get canGoForward() {
    return this.currentIndex < this.history.length - 1;
  }
  /** 获取当前状态 */
  get currentState() {
    if (!(this.currentIndex < 0 || this.currentIndex >= this.history.length))
      return this.history[this.currentIndex].state;
  }
  /** 获取当前索引 */
  get cursor() {
    return this.currentIndex;
  }
  /** 获取历史记录总数 */
  get length() {
    return this.history.length;
  }
  /**
   * 撤销（向后一步），返回新的当前状态
   * @returns 新的 HistoryState，若无历史则返回 undefined
   */
  goBack() {
    if (this.canGoBack)
      return this.currentIndex--, this.currentState;
  }
  /**
   * 重做（向前一步），返回新的当前状态
   * @returns 新的 HistoryState，若已在最新则返回 undefined
   */
  goForward() {
    if (this.canGoForward)
      return this.currentIndex++, this.currentState;
  }
  /**
   * 是否可以撤销并跳过指定 type
   */
  canGoBackSkipType(e) {
    let t = this.currentIndex - 1;
    for (; t >= 0 && this.history[t].type === e; ) t--;
    return t >= 0;
  }
  /**
   * 是否可以重做并跳过指定 type
   */
  canGoForwardSkipType(e) {
    let t = this.currentIndex + 1;
    for (; t < this.history.length && this.history[t].type === e; )
      t++;
    return t < this.history.length;
  }
  /**
   * 撤销时跳过指定 type 的记录（如 "snapshot"）
   * @returns 新的 HistoryState，若无匹配则返回 undefined
   */
  goBackSkipType(e) {
    let t = this.currentIndex - 1;
    for (; t >= 0 && this.history[t].type === e; ) t--;
    if (!(t < 0))
      return this.currentIndex = t, this.currentState;
  }
  /**
   * 重做时跳过指定 type 的记录（如 "snapshot"）
   * @returns 新的 HistoryState，若无匹配则返回 undefined
   */
  goForwardSkipType(e) {
    let t = this.currentIndex + 1;
    for (; t < this.history.length && this.history[t].type === e; )
      t++;
    if (!(t >= this.history.length))
      return this.currentIndex = t, this.currentState;
  }
  /**
   * 跳转到指定索引的历史记录
   * @returns 跳转后的 HistoryState，若索引无效则返回 undefined
   */
  jumpTo(e) {
    if (!(e < 0 || e >= this.history.length))
      return this.currentIndex = e, this.currentState;
  }
  /**
   * 获取完整历史记录列表（用于 UI 展示）
   */
  getHistory() {
    return this.history;
  }
  /**
   * 获取指定索引的历史记录
   */
  getAction(e) {
    return this.history[e];
  }
  /**
   * 删除指定索引的历史记录
   * 若删除的是当前或之前的记录，当前索引会相应前移
   */
  deleteEntry(e) {
    return e < 0 || e >= this.history.length ? !1 : (this.history.splice(e, 1), this.currentIndex >= this.history.length ? this.currentIndex = this.history.length - 1 : this.currentIndex > e && this.currentIndex--, !0);
  }
  /** 跳转到第一条历史记录 */
  goToFirst() {
    return this.jumpTo(0);
  }
  /** 跳转到最后一条历史记录 */
  goToLast() {
    return this.jumpTo(this.history.length - 1);
  }
  /** 清空所有历史 */
  clear() {
    this.history = [], this.currentIndex = -1;
  }
}
class Mi {
  constructor() {
    p(this, "_state", { x: 0, y: 0, k: 1 });
  }
  get x() {
    return this._state.x;
  }
  get y() {
    return this._state.y;
  }
  get k() {
    return this._state.k;
  }
  get state() {
    return this._state;
  }
  /** Reset to identity */
  reset() {
    this._state = { x: 0, y: 0, k: 1 };
  }
  /** Pan by delta in screen pixels */
  pan(e, t) {
    this._state.x += e / this._state.k, this._state.y += t / this._state.k;
  }
  /** Zoom toward a screen point */
  zoomTo(e, t, n) {
    const s = Math.max(0.1, Math.min(10, this._state.k * e)), r = (t - this._state.x * this._state.k) / this._state.k, o = (n - this._state.y * this._state.k) / this._state.k;
    this._state.x = t / s - r, this._state.y = n / s - o, this._state.k = s;
  }
  /** Set absolute zoom */
  setZoom(e, t, n) {
    t !== void 0 && n !== void 0 ? this.zoomTo(e / this._state.k, t, n) : this._state.k = Math.max(0.1, Math.min(10, e));
  }
  /** Screen -> world coordinates */
  screenToWorld(e, t) {
    return [
      (e - this._state.x * this._state.k) / this._state.k,
      (t - this._state.y * this._state.k) / this._state.k
    ];
  }
  /** World -> screen coordinates */
  worldToScreen(e, t) {
    return [
      (e + this._state.x) * this._state.k,
      (t + this._state.y) * this._state.k
    ];
  }
}
class Di {
  constructor(e, t, n = {}) {
    p(this, "canvas");
    p(this, "picker");
    p(this, "callbacks");
    /** 当前相机变换（渲染器需保持同步） */
    p(this, "transform", { x: 0, y: 0, k: 1 });
    // 内部状态
    p(this, "isDragging", !1);
    p(this, "dragNodeId", null);
    p(this, "hoveredId", null);
    p(this, "hoveredType", null);
    p(this, "lastMouseX", 0);
    p(this, "lastMouseY", 0);
    p(this, "lastClientX", 0);
    p(this, "lastClientY", 0);
    p(this, "isPanning", !1);
    /** 垂直缩放容忍度（px），在此范围内不触发平移/缩放手感混淆 */
    p(this, "panDeadZone", 3);
    // 绑定的回调引用（用于 removeEventListener）
    p(this, "boundPointerDown");
    p(this, "boundPointerMove");
    p(this, "boundPointerUp");
    p(this, "boundPointerLeave");
    p(this, "boundWheel");
    p(this, "boundContextMenu");
    this.canvas = e, this.picker = t, this.callbacks = n, this.boundPointerDown = this.onPointerDown.bind(this), this.boundPointerMove = this.onPointerMove.bind(this), this.boundPointerUp = this.onPointerUp.bind(this), this.boundPointerLeave = this.onPointerLeave.bind(this), this.boundWheel = this.onWheel.bind(this), this.boundContextMenu = this.onContextMenu.bind(this), this.attach();
  }
  /** 鼠标在视口中的最后位置（由 pointermove 同步更新） */
  get mousePosition() {
    return { x: this.lastClientX, y: this.lastClientY };
  }
  // ========== 生命周期 ==========
  /** 绑定事件到 canvas */
  attach() {
    this.canvas.addEventListener("pointerdown", this.boundPointerDown), this.canvas.addEventListener("pointermove", this.boundPointerMove), this.canvas.addEventListener("pointerup", this.boundPointerUp), this.canvas.addEventListener("pointerleave", this.boundPointerLeave), this.canvas.addEventListener("wheel", this.boundWheel, { passive: !1 }), this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }
  /** 解绑事件 */
  detach() {
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown), this.canvas.removeEventListener("pointermove", this.boundPointerMove), this.canvas.removeEventListener("pointerup", this.boundPointerUp), this.canvas.removeEventListener("pointerleave", this.boundPointerLeave), this.canvas.removeEventListener("wheel", this.boundWheel), this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
  }
  /** 替换拾取器（运行时切换 CanvasPicker ↔ WebGLPicker） */
  setPicker(e) {
    this.picker = e;
  }
  /** 重置交互状态（销毁时或数据重置时调用） */
  reset() {
    this.isDragging = !1, this.dragNodeId = null, this.isPanning = !1, this.hoveredId = null, this.hoveredType = null, this.canvas.style.cursor = "default";
  }
  // ========== 事件处理 ==========
  getPos(e) {
    const t = this.canvas.getBoundingClientRect();
    return { x: e.clientX - t.left, y: e.clientY - t.top };
  }
  onPointerDown(e) {
    var s, r, o, l, d, a;
    const t = this.getPos(e);
    this.lastMouseX = t.x, this.lastMouseY = t.y;
    const n = this.picker.pick(t.x, t.y);
    n && n.type === "node" ? e.button === 0 && (this.isDragging = !0, this.dragNodeId = n.id, this.canvas.setPointerCapture(e.pointerId), (r = (s = this.callbacks).onNodeClick) == null || r.call(s, n.id, e)) : n && n.type === "link" ? (l = (o = this.callbacks).onLinkClick) == null || l.call(o, n.id, e) : (this.isPanning = !0, this.canvas.setPointerCapture(e.pointerId), (a = (d = this.callbacks).onBackgroundClick) == null || a.call(d, e));
  }
  onPointerMove(e) {
    var r, o, l, d, a, g, y, u, f, m, x, h;
    const t = this.getPos(e), n = t.x - this.lastMouseX, s = t.y - this.lastMouseY;
    if (this.isDragging && this.dragNodeId)
      (o = (r = this.callbacks).onNodeDrag) == null || o.call(r, this.dragNodeId, n, s);
    else if (this.isPanning) {
      const v = this.transform;
      v.x += n / v.k, v.y += s / v.k, (d = (l = this.callbacks).onPan) == null || d.call(l, v);
    } else {
      const v = this.picker.pick(t.x, t.y), k = (v == null ? void 0 : v.id) ?? null, C = (v == null ? void 0 : v.type) ?? null;
      (k !== this.hoveredId || C !== this.hoveredType) && (this.hoveredId = k, this.hoveredType = C, C === "link" ? ((g = (a = this.callbacks).onLinkHover) == null || g.call(a, k), (u = (y = this.callbacks).onNodeHover) == null || u.call(y, null)) : ((m = (f = this.callbacks).onNodeHover) == null || m.call(f, k), (h = (x = this.callbacks).onLinkHover) == null || h.call(x, null)), this.canvas.style.cursor = k ? "pointer" : "default");
    }
    this.lastMouseX = t.x, this.lastMouseY = t.y, this.lastClientX = e.clientX, this.lastClientY = e.clientY;
  }
  onContextMenu(e) {
    var r, o;
    e.preventDefault();
    const t = e, n = this.getPos(t), s = this.picker.pick(n.x, n.y);
    (s == null ? void 0 : s.type) === "node" && ((o = (r = this.callbacks).onNodeContextMenu) == null || o.call(r, s.id, t.clientX, t.clientY));
  }
  onPointerUp(e) {
    var t, n;
    this.isDragging && this.dragNodeId && ((n = (t = this.callbacks).onNodeDragEnd) == null || n.call(t, this.dragNodeId)), this.isDragging = !1, this.dragNodeId = null, this.isPanning = !1, this.canvas.releasePointerCapture(e.pointerId);
  }
  /** 指针离开 canvas → 清除 hover 状态 */
  onPointerLeave(e) {
    var t, n, s, r;
    this.hoveredId !== null && (this.hoveredId = null, this.hoveredType = null, this.canvas.style.cursor = "default", (n = (t = this.callbacks).onNodeHover) == null || n.call(t, null), (r = (s = this.callbacks).onLinkHover) == null || r.call(s, null));
  }
  onWheel(e) {
    var d, a;
    e.preventDefault();
    const t = this.getPos(e), n = e.deltaY > 0 ? 0.9 : 1.1, s = this.transform, r = Math.max(0.1, Math.min(10, s.k * n)), o = (t.x - s.x * s.k) / s.k, l = (t.y - s.y * s.k) / s.k;
    s.x = t.x / r - o, s.y = t.y / r - l, s.k = r, (a = (d = this.callbacks).onZoom) == null || a.call(d, s);
  }
}
const Ei = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: center
layout(location = 2) in float a_radius;        // instance: radius
layout(location = 3) in vec4 a_color;          // instance: fill color
layout(location = 4) in vec4 a_strokeColor;    // instance: stroke color
layout(location = 5) in float a_strokeWidth;   // instance: stroke width
layout(location = 6) in float a_shapeType;     // instance: shape enum
layout(location = 7) in float a_shapeParam;    // instance: shape parameter
layout(location = 8) in float a_showPlus;      // instance: show plus button
layout(location = 9) in float a_plusOffsetX;   // instance: plus offset X
layout(location = 10) in float a_plusOffsetY;  // instance: plus offset Y
layout(location = 11) in float a_plusScale;    // instance: plus size scale
layout(location = 12) in float a_hasIcon;      // instance: has icon (0/1)
layout(location = 13) in vec4 a_iconUv;        // instance: icon UV [u0,v0,u1,v1]
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec4 v_color;
out vec4 v_strokeColor;
out float v_radius;
out float v_strokeWidth;
out vec2 v_localPos;
out float v_shapeType;
out float v_shapeParam;
out float v_showPlus;
out float v_plusOffsetX;
out float v_plusOffsetY;
out float v_plusScale;
out float v_hasIcon;
out vec4 v_iconUv;

void main() {
  float halfSize = a_radius + a_strokeWidth;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_color = a_color;
  v_strokeColor = a_strokeColor;
  v_radius = a_radius;
  v_strokeWidth = a_strokeWidth;
  v_localPos = a_position * halfSize;
  v_shapeType = a_shapeType;
  v_shapeParam = a_shapeParam;
  v_showPlus = a_showPlus;
  v_plusOffsetX = a_plusOffsetX;
  v_plusOffsetY = a_plusOffsetY;
  v_plusScale = a_plusScale;
  v_hasIcon = a_hasIcon;
  v_iconUv = a_iconUv;
}
`, Ri = `#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_strokeColor;
in float v_radius;
in float v_strokeWidth;
in vec2 v_localPos;
in float v_shapeType;
in float v_shapeParam;
in float v_showPlus;
in float v_plusOffsetX;
in float v_plusOffsetY;
in float v_plusScale;
in float v_hasIcon;
in vec4 v_iconUv;

uniform sampler2D u_iconAtlas;

out vec4 fragColor;

// 图标占节点直径的比例（剩余为节点填充色的 padding 环）
#define ICON_INSET 0.82

// ---- SDF primitives ----
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.30f;
  float l = radius * 0.60f;
  float hBar = boxSDF(p, vec2(l, w));
  float vBar = boxSDF(p, vec2(w, l));
  return min(hBar, vBar);
}

float shapeSDF(vec2 p, float radius, float type, float param) {
  return sdCircle(p, radius);
}

// ---- Main ----
void main() {
  // SDF for fill circle (inner edge)
  float fillD = shapeSDF(v_localPos, v_radius, v_shapeType, v_shapeParam);
  // SDF for stroke circle (outer edge)
  float strokeD = shapeSDF(v_localPos, v_radius + v_strokeWidth, v_shapeType, v_shapeParam);

  float aa = fwidth(strokeD) * 0.8f;

  // Alpha for the entire node (fill + stroke)
  float strokeAlpha = 1.0f - smoothstep(-aa, aa, strokeD);
  // Alpha for the fill area (inside stroke ring)
  float fillAlpha = 1.0f - smoothstep(-aa, aa, fillD);

  // Stroke color in the ring, fill color inside
  fragColor = mix(v_strokeColor, v_color, fillAlpha);
  fragColor.a *= strokeAlpha;

  // 图标：仅在节点内缩小的圆形区域内绘制（外部露出填充色，形成 padding 环）
  if(v_hasIcon > 0.5f && fillAlpha > 0.01f) {
    float iconR = v_radius * ICON_INSET;
    float iconD = sdCircle(v_localPos, iconR);
    float iconAA = fwidth(iconD) * 0.8f;
    float iconArea = 1.0f - smoothstep(-iconAA, iconAA, iconD);
    if(iconArea > 0.01f) {
      // 图标区域半径 → [0,1] UV
      vec2 uv = (v_localPos / (2.0f * iconR)) + 0.5f;
      uv = clamp(uv, 0.0f, 1.0f);
      vec2 texUv = mix(v_iconUv.xy, v_iconUv.zw, uv);
      vec4 icon = texture(u_iconAtlas, texUv);
      vec3 mixed = mix(v_color.rgb, icon.rgb, icon.a);
      fragColor.rgb = mix(fragColor.rgb, mixed, fillAlpha * iconArea);
      // 图标区域保持节点整体透明度（hidden 等低透明状态时随 v_color.a 淡出，
      // 不再强制置 1，否则隐藏节点只剩 18% 填充环变淡、视觉几乎无变化）
      fragColor.a = mix(fragColor.a, v_color.a, fillAlpha * iconArea);
    }
  }

  // Draw plus badge at configurable position (inside a white circle)
  if(v_showPlus > 0.5f) {
    vec2 plusOffset = vec2(v_radius * v_plusOffsetX, v_radius * v_plusOffsetY);
    vec2 plusPos = v_localPos - plusOffset;
    float plusRadius = v_radius * v_plusScale;

    // 1. White circle background (使用屏幕空间 aa)
    float badgeD = sdCircle(plusPos, plusRadius);
    float badgeAA = fwidth(badgeD) * 0.8f;
    float badgeAlpha = 1.0f - smoothstep(-badgeAA, badgeAA, badgeD);
    if(badgeAlpha > 0.01f) {
      fragColor.rgb = mix(fragColor.rgb, vec3(1.0f, 1.0f, 1.0f), badgeAlpha);
      fragColor.a = max(fragColor.a, badgeAlpha);
    }

    // 2. Red plus symbol inside the badge
    float plusD = sdPlus(plusPos, plusRadius * 0.85f);
    float plusAA = fwidth(plusD) * 0.8f;
    float plusAlpha = 1.0f - smoothstep(-plusAA, plusAA, plusD);
    if(badgeAlpha > 0.01f && plusAlpha > 0.01f) {
      vec4 plusColor = vec4(0.913f, 0.271f, 0.376f, 1.0f);
      fragColor.rgb = mix(fragColor.rgb, plusColor.rgb, plusAlpha);
      fragColor.a = max(fragColor.a, plusAlpha);
    }
  }

  if(fragColor.a < 0.01f)
    discard;
}
`, Ii = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: center
layout(location = 2) in float a_radius;        // instance: radius
layout(location = 3) in vec4 a_color;          // (unused in pick)
layout(location = 4) in vec4 a_strokeColor;    // (unused in pick)
layout(location = 5) in float a_strokeWidth;   // instance: stroke width
layout(location = 6) in float a_shapeType;     // instance: shape enum
layout(location = 7) in float a_shapeParam;    // instance: shape parameter


uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec2 v_localPos;
out float v_radius;
out float v_strokeWidth;
out float v_shapeType;
out float v_shapeParam;
flat out int v_instanceId;

void main() {
  float halfSize = a_radius + a_strokeWidth;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_localPos = a_position * halfSize;
  v_radius = a_radius;
  v_strokeWidth = a_strokeWidth;
  v_shapeType = a_shapeType;
  v_shapeParam = a_shapeParam;
  v_instanceId = gl_InstanceID;
}
`, Li = `#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
in float v_strokeWidth;
in float v_shapeType;
in float v_shapeParam;
flat in int v_instanceId;

out vec4 fragColor;

float sdCircle(vec2 p, float r) { return length(p) - r; }

float shapeSDF(vec2 p, float radius, float type, float param) {
  return sdCircle(p, radius);
}

void main() {
  float outerRadius = v_radius + v_strokeWidth;
  float d = shapeSDF(v_localPos, outerRadius, v_shapeType, v_shapeParam);
  if (d > 1.5) { discard; return; }

  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
`, Fi = `#version 300 es
precision highp float;

// a_position: (t, side) — t∈[0,1] 沿曲线参数, side=±1 为带的两侧
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_start;       // P0
layout(location = 2) in vec2 a_mid;         // P1 — 二次 Bézier 控制点
layout(location = 3) in vec2 a_end;         // P2
layout(location = 4) in vec4 a_color;
layout(location = 5) in float a_width;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec4 v_color;

void main() {
  vec2 p0 = (a_start + u_translation) * u_scale;
  vec2 p1 = (a_mid   + u_translation) * u_scale;
  vec2 p2 = (a_end   + u_translation) * u_scale;

  float t = a_position.x;
  float side = a_position.y;

  // ── 二次 Bézier: B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 ──
  float mt  = 1.0 - t;
  float mt2 = mt * mt;
  float t2  = t * t;

  vec2 pos = mt2 * p0 + 2.0 * mt * t * p1 + t2 * p2;

  // ── 导数 B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1) ──
  vec2 tangent = 2.0 * mt * (p1 - p0) + 2.0 * t * (p2 - p1);

  float tlen = length(tangent);
  vec2 dir = tlen > 0.001 ? tangent / tlen : normalize(p2 - p0);
  vec2 norm = vec2(-dir.y, dir.x);

  float halfW = a_width * u_scale * 0.5 + 1.0;
  pos += norm * side * halfW;

  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_color = a_color;
}
`, ji = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
  if (fragColor.a < 0.01) discard;
}
`, zi = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;      // (t, side)
layout(location = 1) in vec2 a_start;         // P0
layout(location = 2) in vec2 a_mid;           // P1
layout(location = 3) in vec2 a_end;           // P2
layout(location = 4) in vec4 a_color;         // unused in pick
layout(location = 5) in float a_width;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform uint u_idOffset;

flat out uint v_instanceId;

void main() {
  vec2 p0 = (a_start + u_translation) * u_scale;
  vec2 p1 = (a_mid + u_translation) * u_scale;
  vec2 p2 = (a_end + u_translation) * u_scale;

  float t = a_position.x;
  float side = a_position.y;

  float mt = 1.0f - t;
  float mt2 = mt * mt;
  float t2 = t * t;

  vec2 pos = mt2 * p0 + 2.0f * mt * t * p1 + t2 * p2;

  vec2 tangent = 2.0f * mt * (p1 - p0) + 2.0f * t * (p2 - p1);

  float tlen = length(tangent);
  vec2 dir = tlen > 0.001f ? tangent / tlen : normalize(p2 - p0);
  vec2 norm = vec2(-dir.y, dir.x);

  float halfW = a_width * u_scale * 0.5f + 2.5f;
  pos += norm * side * halfW;

  vec2 clipSpace = (pos / u_resolution) * 2.0f - 1.0f;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0f, 1.0f);
  gl_Position.z += u_zOffset;
  v_instanceId = uint(gl_InstanceID) + u_idOffset;
}
`, Bi = `#version 300 es
precision highp float;

flat in uint v_instanceId;
out vec4 fragColor;

void main() {
  uint idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16u) & 0xFFu) / 255.0,
    float((idx >> 8u) & 0xFFu) / 255.0,
    float(idx & 0xFFu) / 255.0,
    1.0
  );
}
`, Oi = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_tip;
layout(location = 2) in vec2 a_dir;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_size;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec4 v_color;

void main() {
  vec2 tip = (a_tip + u_translation) * u_scale;
  float size = a_size * u_scale;
  vec2 dir = normalize(a_dir);
  vec2 norm = vec2(-dir.y, dir.x);
  vec2 offset = a_position.x * (dir * size) + a_position.y * (norm * size * 0.5);
  vec2 pos = tip + offset;
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  v_color = a_color;
}
`, Wi = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_color.rgb, 1.0);
}
`, Hi = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_tip;
layout(location = 2) in vec2 a_dir;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_size;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

flat out int v_instanceId;

void main() {
  vec2 tip = (a_tip + u_translation) * u_scale;
  float size = a_size * u_scale;
  vec2 dir = normalize(a_dir);
  vec2 norm = vec2(-dir.y, dir.x);
  vec2 offset = a_position.x * (-dir * size) + a_position.y * (norm * size * 0.5);
  vec2 pos = tip + offset;
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  v_instanceId = gl_InstanceID;
}
`, Ui = `#version 300 es
precision highp float;

flat in int v_instanceId;
out vec4 fragColor;

void main() {
  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
`, Vi = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner (0..1)
layout(location = 1) in vec2 a_center;          // instance: world position
layout(location = 2) in vec2 a_size;            // instance: world size
layout(location = 3) in vec4 a_color;           // instance: color
layout(location = 4) in vec2 a_uvOrigin;        // instance: UV origin (u0,v0)
layout(location = 5) in vec2 a_uvSize;          // instance: UV size (du,dv)
layout(location = 6) in float a_angle;          // instance: rotation (radians)

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec2 v_texCoord;
out vec4 v_color;

void main() {
  vec2 offset = (a_position - 0.5) * a_size;
  float cosA = cos(a_angle);
  float sinA = sin(a_angle);
  vec2 rotatedOffset = vec2(
    offset.x * cosA - offset.y * sinA,
    offset.x * sinA + offset.y * cosA
  );
  vec2 screenPos = (a_center + u_translation) * u_scale + rotatedOffset * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_texCoord = a_uvOrigin + a_position * a_uvSize;
  v_color = a_color;
}
`, Xi = `#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;

uniform sampler2D u_texture;

out vec4 fragColor;

void main() {
  // alpha 通道 = 纯灰度抗锯齿，无色边
  float alpha = texture(u_texture, v_texCoord).a;
  fragColor = vec4(v_color.rgb, v_color.a * alpha);
  if (fragColor.a < 0.01) discard;
}
`, Yi = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: center of the badge (world)
layout(location = 2) in float a_radius;        // instance: badge radius (world)
layout(location = 3) in float a_nodeId;        // instance: encoded node id (index)

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform float u_borderWidth;

out vec2 v_localPos;
out float v_radius;
flat out float v_nodeId;

void main() {
  // padding 为抗锯齿过渡留出约 3 像素的余量，防止边框边缘被 quad 裁切
  float padding = 3.0 / max(u_scale, 0.001);
  float halfSize = a_radius + u_borderWidth + padding;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_localPos = a_position * halfSize;
  v_radius = a_radius;
  v_nodeId = a_nodeId;
}
`, Gi = `#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
flat in float v_nodeId;

uniform float u_borderWidth;
uniform vec4 u_borderColor;

out vec4 fragColor;

// SDF primitives
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.20;
  float l = radius * 0.60;
  float hBar = boxSDF(p, vec2(l, w));
  float vBar = boxSDF(p, vec2(w, l));
  return min(hBar, vBar);
}

void main() {
  // Screen-space anti-aliasing
  vec2 deriv = dFdx(v_localPos) + dFdy(v_localPos);
  float aa = length(deriv) * 1.5;

  // Outer circle (includes border)
  float outerD = sdCircle(v_localPos, v_radius + u_borderWidth);
  // Inner circle (white fill area)
  float innerD = sdCircle(v_localPos, v_radius);

  // Border ring: between outer and inner circle
  float outerAlpha = 1.0 - smoothstep(-aa, aa, outerD);
  float fillAlpha = 1.0 - smoothstep(-aa, aa, innerD);
  float borderAlpha = smoothstep(-aa, aa, innerD) * (1.0 - smoothstep(-aa, aa, outerD));

  if (outerAlpha < 0.01) discard;

  // Start with border color ring
  vec3 color = u_borderColor.rgb;
  float alpha = borderAlpha * u_borderColor.a;

  // White fill on top
  color = mix(color, vec3(1.0), fillAlpha);
  alpha = max(alpha, fillAlpha);

  // Red plus symbol inside
  float plusD = sdPlus(v_localPos, v_radius * 0.85);
  float plusAA = length(deriv) * 0.8;
  float plusAlpha = 1.0 - smoothstep(-plusAA, plusAA, plusD);
  color = mix(color, vec3(0.913, 0.271, 0.376), plusAlpha);
  alpha = max(alpha, plusAlpha);

  fragColor = vec4(color, alpha);
}
`, $i = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: badge center (world)
layout(location = 2) in float a_radius;        // instance: badge radius (world)
layout(location = 3) in float a_nodeId;        // instance: node id index

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform float u_borderWidth;

out vec2 v_localPos;
out float v_radius;
flat out int v_instanceId;

void main() {
  // padding 为抗锯齿过渡留出约 3 像素的余量，防止边框边缘被 quad 裁切
  float padding = 3.0 / max(u_scale, 0.001);
  float halfSize = a_radius + u_borderWidth + padding;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_localPos = a_position * halfSize;
  v_radius = a_radius;
  v_instanceId = gl_InstanceID;
}
`, qi = `#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
flat in int v_instanceId;

out vec4 fragColor;

float sdCircle(vec2 p, float r) { return length(p) - r; }

void main() {
  float d = sdCircle(v_localPos, v_radius);
  if (d > 1.5) { discard; return; }

  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
`, Ki = Ei, Zi = Ri, Ji = Ii, Qi = Li, er = Fi, tr = ji, nr = zi, sr = Bi, ir = Oi, rr = Wi, or = Hi, ar = Ui, lr = Vi, cr = Xi, dr = Yi, hr = Gi, ur = $i, gr = qi;
class fr {
  constructor(e) {
    p(this, "name", "plus-badge");
    p(this, "gl");
    p(this, "canvas");
    p(this, "program");
    p(this, "pickProgram");
    p(this, "quadVao", null);
    // Border config
    p(this, "borderWidth");
    p(this, "borderColor");
    // Uniforms (render)
    p(this, "uResolution", null);
    p(this, "uTranslation", null);
    p(this, "uScale", null);
    p(this, "uZOffset", null);
    p(this, "uBorderWidth", null);
    p(this, "uBorderColor", null);
    // Uniforms (pick)
    p(this, "uPickResolution", null);
    p(this, "uPickTranslation", null);
    p(this, "uPickScale", null);
    p(this, "uPickZOffset", null);
    p(this, "uPickBorderWidth", null);
    /** 当前徽标数据 */
    p(this, "badges", []);
    /** 节点 ID → 索引映射（用于拾取） */
    p(this, "nodeIndexMap", /* @__PURE__ */ new Map());
    /** 拾取 FBO */
    p(this, "pickFbo", null);
    p(this, "pickTexture", null);
    p(this, "pickWidth", 0);
    p(this, "pickHeight", 0);
    p(this, "onPlusClick");
    // 已绑定的指针事件处理
    p(this, "boundPointerDown");
    this.gl = e.gl, this.canvas = e.canvas, this.onPlusClick = e.onPlusClick, this.borderWidth = e.borderWidth ?? 0, this.borderColor = e.borderColor ?? [0.913, 0.271, 0.376, 1], this.program = this.compileProgram(dr, hr), this.pickProgram = this.compileProgram(ur, gr), this.initQuadGeometry(), this.cacheUniforms(), this.boundPointerDown = this.onPointerDown.bind(this), this.canvas.addEventListener("pointerdown", this.boundPointerDown, {
      capture: !0
    });
  }
  // ─── 编译工具 ───────────────────────────────────
  compileShader(e, t) {
    const n = this.gl, s = n.createShader(e);
    if (n.shaderSource(s, t), n.compileShader(s), !n.getShaderParameter(s, n.COMPILE_STATUS))
      throw new Error(
        "Plus shader compile failed: " + n.getShaderInfoLog(s)
      );
    return s;
  }
  compileProgram(e, t) {
    const n = this.gl, s = this.compileShader(n.VERTEX_SHADER, e), r = this.compileShader(n.FRAGMENT_SHADER, t), o = n.createProgram();
    if (n.attachShader(o, s), n.attachShader(o, r), n.linkProgram(o), !n.getProgramParameter(o, n.LINK_STATUS))
      throw new Error("Plus shader link failed: " + n.getProgramInfoLog(o));
    return o;
  }
  cacheUniforms() {
    const e = this.gl;
    this.uResolution = e.getUniformLocation(this.program, "u_resolution"), this.uTranslation = e.getUniformLocation(this.program, "u_translation"), this.uScale = e.getUniformLocation(this.program, "u_scale"), this.uZOffset = e.getUniformLocation(this.program, "u_zOffset"), this.uBorderWidth = e.getUniformLocation(this.program, "u_borderWidth"), this.uBorderColor = e.getUniformLocation(this.program, "u_borderColor"), this.uPickResolution = e.getUniformLocation(
      this.pickProgram,
      "u_resolution"
    ), this.uPickTranslation = e.getUniformLocation(
      this.pickProgram,
      "u_translation"
    ), this.uPickScale = e.getUniformLocation(this.pickProgram, "u_scale"), this.uPickZOffset = e.getUniformLocation(this.pickProgram, "u_zOffset"), this.uPickBorderWidth = e.getUniformLocation(
      this.pickProgram,
      "u_borderWidth"
    );
  }
  initQuadGeometry() {
    const e = this.gl, t = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1
    ]), n = e.createVertexArray();
    e.bindVertexArray(n);
    const s = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, s), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.quadVao = n;
  }
  setupInstanceBuffer(e, t, n) {
    const s = this.gl, r = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, t, s.DYNAMIC_DRAW), s.enableVertexAttribArray(e), s.vertexAttribPointer(e, n, s.FLOAT, !1, 0, 0), s.vertexAttribDivisor(e, 1);
  }
  // ─── 更新徽标数据 ──────────────────────────────
  updateBadges(e) {
    this.badges = e, this.nodeIndexMap.clear();
    for (let t = 0; t < e.length; t++)
      this.nodeIndexMap.set(e[t].nodeId, t);
  }
  // ─── 渲染 ───────────────────────────────────────
  render(e, t, n, s, r, o = 0) {
    const l = this.badges.length;
    if (l === 0) return;
    const d = this.gl;
    d.useProgram(this.program), d.uniform2f(this.uResolution, e, t), d.uniform2f(this.uTranslation, n, s), d.uniform1f(this.uScale, r), d.uniform1f(this.uZOffset, o), d.uniform1f(this.uBorderWidth, this.borderWidth), d.uniform4f(
      this.uBorderColor,
      this.borderColor[0],
      this.borderColor[1],
      this.borderColor[2],
      this.borderColor[3]
    ), d.bindVertexArray(this.quadVao);
    const a = new Float32Array(l * 2), g = new Float32Array(l), y = new Float32Array(l);
    for (let u = 0; u < l; u++) {
      const f = this.badges[u];
      a[u * 2] = f.x, a[u * 2 + 1] = f.y, g[u] = f.radius, y[u] = this.nodeIndexMap.get(f.nodeId) ?? u;
    }
    this.setupInstanceBuffer(1, a, 2), this.setupInstanceBuffer(2, g, 1), this.setupInstanceBuffer(3, y, 1), d.drawArraysInstanced(d.TRIANGLES, 0, 6, l);
    for (let u = 1; u <= 3; u++)
      d.vertexAttribDivisor(u, 0);
    d.bindVertexArray(null);
  }
  // ─── 拾取 ───────────────────────────────────────
  /** 初始化/调整拾取 FBO 尺寸 */
  ensurePickFbo(e, t) {
    if (this.pickWidth === e && this.pickHeight === t) return;
    const n = this.gl;
    this.pickFbo && n.deleteFramebuffer(this.pickFbo), this.pickTexture && n.deleteTexture(this.pickTexture), this.pickWidth = e, this.pickHeight = t, this.pickTexture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.pickTexture), n.texImage2D(
      n.TEXTURE_2D,
      0,
      n.RGBA,
      e,
      t,
      0,
      n.RGBA,
      n.UNSIGNED_BYTE,
      null
    ), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST), this.pickFbo = n.createFramebuffer(), n.bindFramebuffer(n.FRAMEBUFFER, this.pickFbo), n.framebufferTexture2D(
      n.FRAMEBUFFER,
      n.COLOR_ATTACHMENT0,
      n.TEXTURE_2D,
      this.pickTexture,
      0
    ), n.bindFramebuffer(n.FRAMEBUFFER, null);
  }
  /** 渲染拾取缓冲（FBO） */
  renderPickBuffer(e, t, n, s, r) {
    const o = this.badges.length;
    if (o === 0) return;
    const l = this.gl;
    this.ensurePickFbo(e, t), l.bindFramebuffer(l.FRAMEBUFFER, this.pickFbo), l.viewport(0, 0, e, t), l.clearColor(0, 0, 0, 0), l.clear(l.COLOR_BUFFER_BIT | l.DEPTH_BUFFER_BIT), l.useProgram(this.pickProgram), l.uniform2f(this.uPickResolution, e, t), l.uniform2f(this.uPickTranslation, n, s), l.uniform1f(this.uPickScale, r), l.uniform1f(this.uPickZOffset, 0), l.uniform1f(this.uPickBorderWidth, this.borderWidth), l.bindVertexArray(this.quadVao);
    const d = new Float32Array(o * 2), a = new Float32Array(o), g = new Float32Array(o);
    for (let y = 0; y < o; y++) {
      const u = this.badges[y];
      d[y * 2] = u.x, d[y * 2 + 1] = u.y, a[y] = u.radius, g[y] = 0;
    }
    this.setupInstanceBuffer(1, d, 2), this.setupInstanceBuffer(2, a, 1), this.setupInstanceBuffer(3, g, 1), l.drawArraysInstanced(l.TRIANGLES, 0, 6, o);
    for (let y = 1; y <= 3; y++)
      l.vertexAttribDivisor(y, 0);
    l.bindVertexArray(null), l.bindFramebuffer(l.FRAMEBUFFER, null);
  }
  /** 在屏幕坐标处拾取徽标，返回 nodeId */
  pick(e, t) {
    var a;
    const n = this.gl;
    if (!this.pickFbo) return null;
    const s = window.devicePixelRatio || 1, r = Math.round(e * s), o = Math.round(t * s);
    n.bindFramebuffer(n.FRAMEBUFFER, this.pickFbo);
    const l = new Uint8Array(4);
    n.readPixels(
      r,
      this.pickHeight - o,
      1,
      1,
      n.RGBA,
      n.UNSIGNED_BYTE,
      l
    ), n.bindFramebuffer(n.FRAMEBUFFER, null);
    const d = l[0] << 16 | l[1] << 8 | l[2];
    return d === 0 || d > this.badges.length ? null : ((a = this.badges[d]) == null ? void 0 : a.nodeId) ?? null;
  }
  // ─── 交互（capture phase 拦截） ────────────────
  onPointerDown(e) {
    var o;
    const t = this.canvas.getBoundingClientRect(), n = e.clientX - t.left, s = e.clientY - t.top, r = this.pick(n, s);
    r && ((o = this.onPlusClick) == null || o.call(this, r), e.stopPropagation(), e.preventDefault());
  }
  // ─── GraphOverlay ───────────────────────────────
  resize(e, t) {
    this.ensurePickFbo(e, t);
  }
  // ─── 销毁 ───────────────────────────────────────
  destroy() {
    const e = this.gl;
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown, {
      capture: !0
    }), e.deleteProgram(this.program), e.deleteProgram(this.pickProgram), this.pickFbo && e.deleteFramebuffer(this.pickFbo), this.pickTexture && e.deleteTexture(this.pickTexture);
  }
}
class pr {
  constructor(e) {
    p(this, "container");
    p(this, "canvas");
    p(this, "plugin");
    p(this, "interaction");
    p(this, "gl");
    p(this, "camera", new Mi());
    p(this, "nodes", []);
    p(this, "links", []);
    p(this, "bgColor");
    p(this, "showArrows", !1);
    p(this, "labelMinScale", 0.5);
    p(this, "width");
    p(this, "height");
    p(this, "_destroyed", !1);
    p(this, "_rafId", 0);
    // 首次尺寸就绪时是否已自动 fitView（修复 macOS 挂载初期 height=0 导致节点小/左上角）
    p(this, "_autoFitDone", !1);
    // 回调
    p(this, "onNodeClick");
    p(this, "onNodeHover");
    p(this, "onLinkHover");
    p(this, "onNodeContextMenu");
    p(this, "onNodeDrag");
    p(this, "onNodeDragEnd");
    p(this, "onLinkClick");
    p(this, "onBackgroundClick");
    p(this, "onZoom");
    p(this, "onPlusClick");
    this.container = e.container, this.canvas = document.createElement("canvas"), this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.display = "block";
    const t = window.devicePixelRatio || 1;
    this.width = e.width || this.container.clientWidth, this.height = e.height || this.container.clientHeight, this.canvas.width = this.width * t, this.canvas.height = this.height * t, this.container.appendChild(this.canvas);
    const n = this.canvas.getContext("webgl2", {
      antialias: !0,
      premultipliedAlpha: !1,
      // 保留绘制缓冲：截图/导出画布时需要，也便于自动化验证渲染结果
      preserveDrawingBuffer: !0
    });
    if (!n) throw new Error("WebGL2 not supported");
    if (this.gl = n, n.enable(n.BLEND), n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), n.enable(n.DEPTH_TEST), n.depthFunc(n.LEQUAL), e.backgroundColor) {
      const r = e.backgroundColor;
      this.bgColor = [
        parseInt(r.slice(1, 3), 16) / 255,
        parseInt(r.slice(3, 5), 16) / 255,
        parseInt(r.slice(5, 7), 16) / 255,
        1
      ];
    } else
      this.bgColor = [1, 1, 1, 1];
    this.showArrows = e.showArrows ?? !1, this.labelMinScale = e.labelMinScale ?? 0.5, this.plugin = e.renderPlugin(n, this.canvas), this.interaction = new Di(
      this.canvas,
      this.plugin,
      this.makeCallbacks()
    ), this.interaction.transform = this.camera.state, new ResizeObserver(() => this.handleResize()).observe(this.container), this.startRenderLoop();
  }
  // ========== Background ==========
  /** 运行时切换画布背景色（主题切换用） */
  setBackgroundColor(e) {
    this.bgColor = [
      parseInt(e.slice(1, 3), 16) / 255,
      parseInt(e.slice(3, 5), 16) / 255,
      parseInt(e.slice(5, 7), 16) / 255,
      1
    ];
  }
  // ========== 回调 ==========
  makeCallbacks() {
    return {
      onNodeClick: (e, t) => {
        var n;
        return (n = this.onNodeClick) == null ? void 0 : n.call(this, e, t);
      },
      onLinkClick: (e, t) => {
        var n;
        return (n = this.onLinkClick) == null ? void 0 : n.call(this, e, t);
      },
      onNodeHover: (e) => {
        var t;
        return (t = this.onNodeHover) == null ? void 0 : t.call(this, e);
      },
      onLinkHover: (e) => {
        var t;
        return (t = this.onLinkHover) == null ? void 0 : t.call(this, e);
      },
      onNodeDrag: (e, t, n) => {
        var o, l, d;
        const s = this.interaction.transform.k, r = this.nodes.find((a) => a.id === e);
        r && (r.x += t / s, r.y += n / s, (o = this.onNodeDrag) == null || o.call(this, e, r.x, r.y), (d = (l = this.plugin).afterPositionUpdate) == null || d.call(l, this.nodes));
      },
      onNodeDragEnd: (e) => {
        var t;
        return (t = this.onNodeDragEnd) == null ? void 0 : t.call(this, e);
      },
      onNodeContextMenu: (e, t, n) => {
        var s;
        return (s = this.onNodeContextMenu) == null ? void 0 : s.call(this, e, t, n);
      },
      onBackgroundClick: (e) => {
        var t;
        return (t = this.onBackgroundClick) == null ? void 0 : t.call(this, e);
      },
      onZoom: (e) => {
        var t;
        return (t = this.onZoom) == null ? void 0 : t.call(this, e);
      },
      onPan: (e) => {
        var t;
        return (t = this.onZoom) == null ? void 0 : t.call(this, e);
      }
    };
  }
  // ========== Data ==========
  updateData(e, t) {
    this.nodes = e, this.links = t, this.plugin.syncData(e, t);
  }
  updateNodePositions(e) {
    var t, n;
    for (const s of this.nodes) {
      const r = e.get(s.id);
      r && (s.x = r.x, s.y = r.y);
    }
    (n = (t = this.plugin).afterPositionUpdate) == null || n.call(t, this.nodes);
  }
  getCamera() {
    return this.camera;
  }
  getCanvas() {
    return this.canvas;
  }
  // ========== Rendering ==========
  render() {
    const e = this.gl, t = window.devicePixelRatio || 1, n = this.width * t, s = this.height * t;
    e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, n, s), e.clearColor(...this.bgColor), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT);
    const r = this.interaction.transform;
    this.plugin.render({
      nodes: this.nodes,
      links: this.links,
      // u_resolution 用 CSS 尺寸（与 fitView/交互的 transform 同一坐标空间）
      width: this.width,
      height: this.height,
      tx: r.x,
      ty: r.y,
      scale: r.k,
      showArrows: this.showArrows,
      labelMinScale: this.labelMinScale
    }), this.plugin.tx = r.x, this.plugin.ty = r.y, this.plugin.k = r.k;
    const o = this.plugin.getOverlays();
    for (let l = 0; l < o.length; l++)
      o[l].renderPickBuffer(this.width, this.height, r.x, r.y, r.k), o[l].render(
        this.width,
        this.height,
        r.x,
        r.y,
        r.k,
        -0.6 - l * 0.01
      );
  }
  startRenderLoop() {
    const e = () => {
      this._destroyed || (this.render(), this._rafId = requestAnimationFrame(e));
    };
    this._rafId = requestAnimationFrame(e);
  }
  // ========== Picking ==========
  pick(e, t) {
    return this.plugin.pick(e, t);
  }
  // ========== Resize ==========
  handleResize() {
    const e = window.devicePixelRatio || 1;
    this.width = this.container.clientWidth, this.height = this.container.clientHeight, this.canvas.width = this.width * e, this.canvas.height = this.height * e, this.gl.viewport(0, 0, this.width * e, this.height * e), this.plugin.resize(this.width, this.height), !this._autoFitDone && this.width > 0 && this.height > 0 && this.nodes.length > 0 && (this._autoFitDone = !0, this.fitView(40));
  }
  // ========== Camera ==========
  fitView(e = 0) {
    var u;
    if (this.nodes.length === 0 || this.width <= 0 || this.height <= 0) return;
    let t = 1 / 0, n = 1 / 0, s = -1 / 0, r = -1 / 0;
    for (const f of this.nodes)
      t = Math.min(t, f.x - f.radius), n = Math.min(n, f.y - f.radius), s = Math.max(s, f.x + f.radius), r = Math.max(r, f.y + f.radius);
    const o = Math.max(1, s - t), l = Math.max(1, r - n), d = Math.max(1, this.width - e * 2), a = Math.max(1, this.height - e * 2), g = Math.min(d / o, a / l, 2), y = this.interaction.transform;
    y.k = g, y.x = this.width / (2 * g) - (t + s) / 2, y.y = this.height / (2 * g) - (n + r) / 2, this.camera.reset(), (u = this.onZoom) == null || u.call(this, y);
  }
  focusNode(e) {
    const t = this.nodes.find((s) => s.id === e);
    if (!t) return;
    const n = this.interaction.transform;
    n.x = this.width / 2 / n.k - t.x, n.y = this.height / 2 / n.k - t.y;
  }
  destroy() {
    this._destroyed = !0, this._rafId && cancelAnimationFrame(this._rafId), this.interaction.detach(), this.interaction.reset(), this.plugin.destroy(), this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
}
class yr {
  constructor(e) {
    /** 实际渲染器 */
    p(this, "backend");
    // ========== 回调桥接 ==========
    p(this, "onNodeClick");
    p(this, "onNodeHover");
    p(this, "onLinkHover");
    p(this, "onNodeDrag");
    p(this, "onNodeDragEnd");
    p(this, "onNodeContextMenu");
    p(this, "onLinkClick");
    p(this, "onBackgroundClick");
    p(this, "onZoom");
    p(this, "onPlusClick");
    this.backend = new pr({
      container: e.container,
      width: e.width,
      height: e.height,
      backgroundColor: e.backgroundColor,
      showArrows: e.showArrows,
      labelMinScale: e.labelMinScale,
      renderPlugin: e.renderPlugin
    }), this.backend.onNodeClick = (...t) => {
      var n;
      return (n = this.onNodeClick) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onNodeHover = (...t) => {
      var n;
      return (n = this.onNodeHover) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onLinkHover = (...t) => {
      var n;
      return (n = this.onLinkHover) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onNodeDrag = (...t) => {
      var n;
      return (n = this.onNodeDrag) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onNodeDragEnd = (...t) => {
      var n;
      return (n = this.onNodeDragEnd) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onNodeContextMenu = (...t) => {
      var n;
      return (n = this.onNodeContextMenu) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onLinkClick = (...t) => {
      var n;
      return (n = this.onLinkClick) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onBackgroundClick = (...t) => {
      var n;
      return (n = this.onBackgroundClick) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onZoom = (...t) => {
      var n;
      return (n = this.onZoom) == null ? void 0 : n.call(this, ...t);
    }, this.backend.onPlusClick = (...t) => {
      var n;
      return (n = this.onPlusClick) == null ? void 0 : n.call(this, ...t);
    };
  }
  /** 画布元素 */
  get canvas() {
    return this.backend.canvas;
  }
  /** 交互管理器 */
  get interaction() {
    return this.backend.interaction;
  }
  /** 当前绑定的拾取器 */
  get picker() {
    return this.backend.plugin;
  }
  /** 渲染器内部节点数据 */
  get nodes() {
    return this.backend.nodes;
  }
  /** 渲染器内部边数据 */
  get links() {
    return this.backend.links;
  }
  /** 获取当前渲染插件 */
  get plugin() {
    return this.backend.plugin;
  }
  /** 运行时切换画布背景色（主题切换用） */
  setBackgroundColor(e) {
    this.backend.setBackgroundColor(e);
  }
  // ========== 统一 API ==========
  /** 更新数据 */
  updateData(e, t) {
    this.backend.updateData(e, t);
  }
  /** 更新节点位置（物理 tick 回调） */
  updateNodePositions(e) {
    this.backend.updateNodePositions(e);
  }
  /** 自适应视图 */
  fitView(e) {
    this.backend.fitView(e);
  }
  /** 聚焦到某节点 */
  focusNode(e) {
    this.backend.focusNode(e);
  }
  /** 销毁释放资源 */
  destroy() {
    this.backend.destroy();
  }
}
function nt(i, e) {
  var t, n = 1;
  i == null && (i = 0), e == null && (e = 0);
  function s() {
    var r, o = t.length, l, d = 0, a = 0;
    for (r = 0; r < o; ++r)
      l = t[r], d += l.x, a += l.y;
    for (d = (d / o - i) * n, a = (a / o - e) * n, r = 0; r < o; ++r)
      l = t[r], l.x -= d, l.y -= a;
  }
  return s.initialize = function(r) {
    t = r;
  }, s.x = function(r) {
    return arguments.length ? (i = +r, s) : i;
  }, s.y = function(r) {
    return arguments.length ? (e = +r, s) : e;
  }, s.strength = function(r) {
    return arguments.length ? (n = +r, s) : n;
  }, s;
}
function vr(i) {
  const e = +this._x.call(null, i), t = +this._y.call(null, i);
  return on(this.cover(e, t), e, t, i);
}
function on(i, e, t, n) {
  if (isNaN(e) || isNaN(t)) return i;
  var s, r = i._root, o = { data: n }, l = i._x0, d = i._y0, a = i._x1, g = i._y1, y, u, f, m, x, h, v, k;
  if (!r) return i._root = o, i;
  for (; r.length; )
    if ((x = e >= (y = (l + a) / 2)) ? l = y : a = y, (h = t >= (u = (d + g) / 2)) ? d = u : g = u, s = r, !(r = r[v = h << 1 | x])) return s[v] = o, i;
  if (f = +i._x.call(null, r.data), m = +i._y.call(null, r.data), e === f && t === m) return o.next = r, s ? s[v] = o : i._root = o, i;
  do
    s = s ? s[v] = new Array(4) : i._root = new Array(4), (x = e >= (y = (l + a) / 2)) ? l = y : a = y, (h = t >= (u = (d + g) / 2)) ? d = u : g = u;
  while ((v = h << 1 | x) === (k = (m >= u) << 1 | f >= y));
  return s[k] = r, s[v] = o, i;
}
function xr(i) {
  var e, t, n = i.length, s, r, o = new Array(n), l = new Array(n), d = 1 / 0, a = 1 / 0, g = -1 / 0, y = -1 / 0;
  for (t = 0; t < n; ++t)
    isNaN(s = +this._x.call(null, e = i[t])) || isNaN(r = +this._y.call(null, e)) || (o[t] = s, l[t] = r, s < d && (d = s), s > g && (g = s), r < a && (a = r), r > y && (y = r));
  if (d > g || a > y) return this;
  for (this.cover(d, a).cover(g, y), t = 0; t < n; ++t)
    on(this, o[t], l[t], i[t]);
  return this;
}
function mr(i, e) {
  if (isNaN(i = +i) || isNaN(e = +e)) return this;
  var t = this._x0, n = this._y0, s = this._x1, r = this._y1;
  if (isNaN(t))
    s = (t = Math.floor(i)) + 1, r = (n = Math.floor(e)) + 1;
  else {
    for (var o = s - t || 1, l = this._root, d, a; t > i || i >= s || n > e || e >= r; )
      switch (a = (e < n) << 1 | i < t, d = new Array(4), d[a] = l, l = d, o *= 2, a) {
        case 0:
          s = t + o, r = n + o;
          break;
        case 1:
          t = s - o, r = n + o;
          break;
        case 2:
          s = t + o, n = r - o;
          break;
        case 3:
          t = s - o, n = r - o;
          break;
      }
    this._root && this._root.length && (this._root = l);
  }
  return this._x0 = t, this._y0 = n, this._x1 = s, this._y1 = r, this;
}
function br() {
  var i = [];
  return this.visit(function(e) {
    if (!e.length) do
      i.push(e.data);
    while (e = e.next);
  }), i;
}
function kr(i) {
  return arguments.length ? this.cover(+i[0][0], +i[0][1]).cover(+i[1][0], +i[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function le(i, e, t, n, s) {
  this.node = i, this.x0 = e, this.y0 = t, this.x1 = n, this.y1 = s;
}
function _r(i, e, t) {
  var n, s = this._x0, r = this._y0, o, l, d, a, g = this._x1, y = this._y1, u = [], f = this._root, m, x;
  for (f && u.push(new le(f, s, r, g, y)), t == null ? t = 1 / 0 : (s = i - t, r = e - t, g = i + t, y = e + t, t *= t); m = u.pop(); )
    if (!(!(f = m.node) || (o = m.x0) > g || (l = m.y0) > y || (d = m.x1) < s || (a = m.y1) < r))
      if (f.length) {
        var h = (o + d) / 2, v = (l + a) / 2;
        u.push(
          new le(f[3], h, v, d, a),
          new le(f[2], o, v, h, a),
          new le(f[1], h, l, d, v),
          new le(f[0], o, l, h, v)
        ), (x = (e >= v) << 1 | i >= h) && (m = u[u.length - 1], u[u.length - 1] = u[u.length - 1 - x], u[u.length - 1 - x] = m);
      } else {
        var k = i - +this._x.call(null, f.data), C = e - +this._y.call(null, f.data), T = k * k + C * C;
        if (T < t) {
          var A = Math.sqrt(t = T);
          s = i - A, r = e - A, g = i + A, y = e + A, n = f.data;
        }
      }
  return n;
}
function Sr(i) {
  if (isNaN(g = +this._x.call(null, i)) || isNaN(y = +this._y.call(null, i))) return this;
  var e, t = this._root, n, s, r, o = this._x0, l = this._y0, d = this._x1, a = this._y1, g, y, u, f, m, x, h, v;
  if (!t) return this;
  if (t.length) for (; ; ) {
    if ((m = g >= (u = (o + d) / 2)) ? o = u : d = u, (x = y >= (f = (l + a) / 2)) ? l = f : a = f, e = t, !(t = t[h = x << 1 | m])) return this;
    if (!t.length) break;
    (e[h + 1 & 3] || e[h + 2 & 3] || e[h + 3 & 3]) && (n = e, v = h);
  }
  for (; t.data !== i; ) if (s = t, !(t = t.next)) return this;
  return (r = t.next) && delete t.next, s ? (r ? s.next = r : delete s.next, this) : e ? (r ? e[h] = r : delete e[h], (t = e[0] || e[1] || e[2] || e[3]) && t === (e[3] || e[2] || e[1] || e[0]) && !t.length && (n ? n[v] = t : this._root = t), this) : (this._root = r, this);
}
function wr(i) {
  for (var e = 0, t = i.length; e < t; ++e) this.remove(i[e]);
  return this;
}
function Tr() {
  return this._root;
}
function Ar() {
  var i = 0;
  return this.visit(function(e) {
    if (!e.length) do
      ++i;
    while (e = e.next);
  }), i;
}
function Pr(i) {
  var e = [], t, n = this._root, s, r, o, l, d;
  for (n && e.push(new le(n, this._x0, this._y0, this._x1, this._y1)); t = e.pop(); )
    if (!i(n = t.node, r = t.x0, o = t.y0, l = t.x1, d = t.y1) && n.length) {
      var a = (r + l) / 2, g = (o + d) / 2;
      (s = n[3]) && e.push(new le(s, a, g, l, d)), (s = n[2]) && e.push(new le(s, r, g, a, d)), (s = n[1]) && e.push(new le(s, a, o, l, g)), (s = n[0]) && e.push(new le(s, r, o, a, g));
    }
  return this;
}
function Cr(i) {
  var e = [], t = [], n;
  for (this._root && e.push(new le(this._root, this._x0, this._y0, this._x1, this._y1)); n = e.pop(); ) {
    var s = n.node;
    if (s.length) {
      var r, o = n.x0, l = n.y0, d = n.x1, a = n.y1, g = (o + d) / 2, y = (l + a) / 2;
      (r = s[0]) && e.push(new le(r, o, l, g, y)), (r = s[1]) && e.push(new le(r, g, l, d, y)), (r = s[2]) && e.push(new le(r, o, y, g, a)), (r = s[3]) && e.push(new le(r, g, y, d, a));
    }
    t.push(n);
  }
  for (; n = t.pop(); )
    i(n.node, n.x0, n.y0, n.x1, n.y1);
  return this;
}
function Nr(i) {
  return i[0];
}
function Mr(i) {
  return arguments.length ? (this._x = i, this) : this._x;
}
function Dr(i) {
  return i[1];
}
function Er(i) {
  return arguments.length ? (this._y = i, this) : this._y;
}
function gt(i, e, t) {
  var n = new ft(e ?? Nr, t ?? Dr, NaN, NaN, NaN, NaN);
  return i == null ? n : n.addAll(i);
}
function ft(i, e, t, n, s, r) {
  this._x = i, this._y = e, this._x0 = t, this._y0 = n, this._x1 = s, this._y1 = r, this._root = void 0;
}
function Lt(i) {
  for (var e = { data: i.data }, t = e; i = i.next; ) t = t.next = { data: i.data };
  return e;
}
var ce = gt.prototype = ft.prototype;
ce.copy = function() {
  var i = new ft(this._x, this._y, this._x0, this._y0, this._x1, this._y1), e = this._root, t, n;
  if (!e) return i;
  if (!e.length) return i._root = Lt(e), i;
  for (t = [{ source: e, target: i._root = new Array(4) }]; e = t.pop(); )
    for (var s = 0; s < 4; ++s)
      (n = e.source[s]) && (n.length ? t.push({ source: n, target: e.target[s] = new Array(4) }) : e.target[s] = Lt(n));
  return i;
};
ce.add = vr;
ce.addAll = xr;
ce.cover = mr;
ce.data = br;
ce.extent = kr;
ce.find = _r;
ce.remove = Sr;
ce.removeAll = wr;
ce.root = Tr;
ce.size = Ar;
ce.visit = Pr;
ce.visitAfter = Cr;
ce.x = Mr;
ce.y = Er;
function ke(i) {
  return function() {
    return i;
  };
}
function xe(i) {
  return (i() - 0.5) * 1e-6;
}
function Rr(i) {
  return i.x + i.vx;
}
function Ir(i) {
  return i.y + i.vy;
}
function Lr(i) {
  var e, t, n, s = 1, r = 1;
  typeof i != "function" && (i = ke(i == null ? 1 : +i));
  function o() {
    for (var a, g = e.length, y, u, f, m, x, h, v = 0; v < r; ++v)
      for (y = gt(e, Rr, Ir).visitAfter(l), a = 0; a < g; ++a)
        u = e[a], x = t[u.index], h = x * x, f = u.x + u.vx, m = u.y + u.vy, y.visit(k);
    function k(C, T, A, N, b) {
      var _ = C.data, S = C.r, P = x + S;
      if (_) {
        if (_.index > u.index) {
          var E = f - _.x - _.vx, H = m - _.y - _.vy, F = E * E + H * H;
          F < P * P && (E === 0 && (E = xe(n), F += E * E), H === 0 && (H = xe(n), F += H * H), F = (P - (F = Math.sqrt(F))) / F * s, u.vx += (E *= F) * (P = (S *= S) / (h + S)), u.vy += (H *= F) * P, _.vx -= E * (P = 1 - P), _.vy -= H * P);
        }
        return;
      }
      return T > f + P || N < f - P || A > m + P || b < m - P;
    }
  }
  function l(a) {
    if (a.data) return a.r = t[a.data.index];
    for (var g = a.r = 0; g < 4; ++g)
      a[g] && a[g].r > a.r && (a.r = a[g].r);
  }
  function d() {
    if (e) {
      var a, g = e.length, y;
      for (t = new Array(g), a = 0; a < g; ++a)
        y = e[a], t[y.index] = +i(y, a, e);
    }
  }
  return o.initialize = function(a, g) {
    e = a, n = g, d();
  }, o.iterations = function(a) {
    return arguments.length ? (r = +a, o) : r;
  }, o.strength = function(a) {
    return arguments.length ? (s = +a, o) : s;
  }, o.radius = function(a) {
    return arguments.length ? (i = typeof a == "function" ? a : ke(+a), d(), o) : i;
  }, o;
}
function Fr(i) {
  return i.index;
}
function Ft(i, e) {
  var t = i.get(e);
  if (!t) throw new Error("node not found: " + e);
  return t;
}
function jr(i) {
  var e = Fr, t = y, n, s = ke(30), r, o, l, d, a, g = 1;
  i == null && (i = []);
  function y(h) {
    return 1 / Math.min(l[h.source.index], l[h.target.index]);
  }
  function u(h) {
    for (var v = 0, k = i.length; v < g; ++v)
      for (var C = 0, T, A, N, b, _, S, P; C < k; ++C)
        T = i[C], A = T.source, N = T.target, b = N.x + N.vx - A.x - A.vx || xe(a), _ = N.y + N.vy - A.y - A.vy || xe(a), S = Math.sqrt(b * b + _ * _), S = (S - r[C]) / S * h * n[C], b *= S, _ *= S, N.vx -= b * (P = d[C]), N.vy -= _ * P, A.vx += b * (P = 1 - P), A.vy += _ * P;
  }
  function f() {
    if (o) {
      var h, v = o.length, k = i.length, C = new Map(o.map((A, N) => [e(A, N, o), A])), T;
      for (h = 0, l = new Array(v); h < k; ++h)
        T = i[h], T.index = h, typeof T.source != "object" && (T.source = Ft(C, T.source)), typeof T.target != "object" && (T.target = Ft(C, T.target)), l[T.source.index] = (l[T.source.index] || 0) + 1, l[T.target.index] = (l[T.target.index] || 0) + 1;
      for (h = 0, d = new Array(k); h < k; ++h)
        T = i[h], d[h] = l[T.source.index] / (l[T.source.index] + l[T.target.index]);
      n = new Array(k), m(), r = new Array(k), x();
    }
  }
  function m() {
    if (o)
      for (var h = 0, v = i.length; h < v; ++h)
        n[h] = +t(i[h], h, i);
  }
  function x() {
    if (o)
      for (var h = 0, v = i.length; h < v; ++h)
        r[h] = +s(i[h], h, i);
  }
  return u.initialize = function(h, v) {
    o = h, a = v, f();
  }, u.links = function(h) {
    return arguments.length ? (i = h, f(), u) : i;
  }, u.id = function(h) {
    return arguments.length ? (e = h, u) : e;
  }, u.iterations = function(h) {
    return arguments.length ? (g = +h, u) : g;
  }, u.strength = function(h) {
    return arguments.length ? (t = typeof h == "function" ? h : ke(+h), m(), u) : t;
  }, u.distance = function(h) {
    return arguments.length ? (s = typeof h == "function" ? h : ke(+h), x(), u) : s;
  }, u;
}
var zr = { value: () => {
} };
function an() {
  for (var i = 0, e = arguments.length, t = {}, n; i < e; ++i) {
    if (!(n = arguments[i] + "") || n in t || /[\s.]/.test(n)) throw new Error("illegal type: " + n);
    t[n] = [];
  }
  return new Ue(t);
}
function Ue(i) {
  this._ = i;
}
function Br(i, e) {
  return i.trim().split(/^|\s+/).map(function(t) {
    var n = "", s = t.indexOf(".");
    if (s >= 0 && (n = t.slice(s + 1), t = t.slice(0, s)), t && !e.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: n };
  });
}
Ue.prototype = an.prototype = {
  constructor: Ue,
  on: function(i, e) {
    var t = this._, n = Br(i + "", t), s, r = -1, o = n.length;
    if (arguments.length < 2) {
      for (; ++r < o; ) if ((s = (i = n[r]).type) && (s = Or(t[s], i.name))) return s;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < o; )
      if (s = (i = n[r]).type) t[s] = jt(t[s], i.name, e);
      else if (e == null) for (s in t) t[s] = jt(t[s], i.name, null);
    return this;
  },
  copy: function() {
    var i = {}, e = this._;
    for (var t in e) i[t] = e[t].slice();
    return new Ue(i);
  },
  call: function(i, e) {
    if ((s = arguments.length - 2) > 0) for (var t = new Array(s), n = 0, s, r; n < s; ++n) t[n] = arguments[n + 2];
    if (!this._.hasOwnProperty(i)) throw new Error("unknown type: " + i);
    for (r = this._[i], n = 0, s = r.length; n < s; ++n) r[n].value.apply(e, t);
  },
  apply: function(i, e, t) {
    if (!this._.hasOwnProperty(i)) throw new Error("unknown type: " + i);
    for (var n = this._[i], s = 0, r = n.length; s < r; ++s) n[s].value.apply(e, t);
  }
};
function Or(i, e) {
  for (var t = 0, n = i.length, s; t < n; ++t)
    if ((s = i[t]).name === e)
      return s.value;
}
function jt(i, e, t) {
  for (var n = 0, s = i.length; n < s; ++n)
    if (i[n].name === e) {
      i[n] = zr, i = i.slice(0, n).concat(i.slice(n + 1));
      break;
    }
  return t != null && i.push({ name: e, value: t }), i;
}
var Ce = 0, Re = 0, Ee = 0, ln = 1e3, Xe, Ie, Ye = 0, _e = 0, Ke = 0, Le = typeof performance == "object" && performance.now ? performance : Date, cn = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(i) {
  setTimeout(i, 17);
};
function dn() {
  return _e || (cn(Wr), _e = Le.now() + Ke);
}
function Wr() {
  _e = 0;
}
function ct() {
  this._call = this._time = this._next = null;
}
ct.prototype = hn.prototype = {
  constructor: ct,
  restart: function(i, e, t) {
    if (typeof i != "function") throw new TypeError("callback is not a function");
    t = (t == null ? dn() : +t) + (e == null ? 0 : +e), !this._next && Ie !== this && (Ie ? Ie._next = this : Xe = this, Ie = this), this._call = i, this._time = t, dt();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, dt());
  }
};
function hn(i, e, t) {
  var n = new ct();
  return n.restart(i, e, t), n;
}
function Hr() {
  dn(), ++Ce;
  for (var i = Xe, e; i; )
    (e = _e - i._time) >= 0 && i._call.call(void 0, e), i = i._next;
  --Ce;
}
function zt() {
  _e = (Ye = Le.now()) + Ke, Ce = Re = 0;
  try {
    Hr();
  } finally {
    Ce = 0, Vr(), _e = 0;
  }
}
function Ur() {
  var i = Le.now(), e = i - Ye;
  e > ln && (Ke -= e, Ye = i);
}
function Vr() {
  for (var i, e = Xe, t, n = 1 / 0; e; )
    e._call ? (n > e._time && (n = e._time), i = e, e = e._next) : (t = e._next, e._next = null, e = i ? i._next = t : Xe = t);
  Ie = i, dt(n);
}
function dt(i) {
  if (!Ce) {
    Re && (Re = clearTimeout(Re));
    var e = i - _e;
    e > 24 ? (i < 1 / 0 && (Re = setTimeout(zt, i - Le.now() - Ke)), Ee && (Ee = clearInterval(Ee))) : (Ee || (Ye = Le.now(), Ee = setInterval(Ur, ln)), Ce = 1, cn(zt));
  }
}
const Xr = 1664525, Yr = 1013904223, Bt = 4294967296;
function Gr() {
  let i = 1;
  return () => (i = (Xr * i + Yr) % Bt) / Bt;
}
function $r(i) {
  return i.x;
}
function qr(i) {
  return i.y;
}
var Kr = 10, Zr = Math.PI * (3 - Math.sqrt(5));
function Jr(i) {
  var e, t = 1, n = 1e-3, s = 1 - Math.pow(n, 1 / 300), r = 0, o = 0.6, l = /* @__PURE__ */ new Map(), d = hn(y), a = an("tick", "end"), g = Gr();
  i == null && (i = []);
  function y() {
    u(), a.call("tick", e), t < n && (d.stop(), a.call("end", e));
  }
  function u(x) {
    var h, v = i.length, k;
    x === void 0 && (x = 1);
    for (var C = 0; C < x; ++C)
      for (t += (r - t) * s, l.forEach(function(T) {
        T(t);
      }), h = 0; h < v; ++h)
        k = i[h], k.fx == null ? k.x += k.vx *= o : (k.x = k.fx, k.vx = 0), k.fy == null ? k.y += k.vy *= o : (k.y = k.fy, k.vy = 0);
    return e;
  }
  function f() {
    for (var x = 0, h = i.length, v; x < h; ++x) {
      if (v = i[x], v.index = x, v.fx != null && (v.x = v.fx), v.fy != null && (v.y = v.fy), isNaN(v.x) || isNaN(v.y)) {
        var k = Kr * Math.sqrt(0.5 + x), C = x * Zr;
        v.x = k * Math.cos(C), v.y = k * Math.sin(C);
      }
      (isNaN(v.vx) || isNaN(v.vy)) && (v.vx = v.vy = 0);
    }
  }
  function m(x) {
    return x.initialize && x.initialize(i, g), x;
  }
  return f(), e = {
    tick: u,
    restart: function() {
      return d.restart(y), e;
    },
    stop: function() {
      return d.stop(), e;
    },
    nodes: function(x) {
      return arguments.length ? (i = x, f(), l.forEach(m), e) : i;
    },
    alpha: function(x) {
      return arguments.length ? (t = +x, e) : t;
    },
    alphaMin: function(x) {
      return arguments.length ? (n = +x, e) : n;
    },
    alphaDecay: function(x) {
      return arguments.length ? (s = +x, e) : +s;
    },
    alphaTarget: function(x) {
      return arguments.length ? (r = +x, e) : r;
    },
    velocityDecay: function(x) {
      return arguments.length ? (o = 1 - x, e) : 1 - o;
    },
    randomSource: function(x) {
      return arguments.length ? (g = x, l.forEach(m), e) : g;
    },
    force: function(x, h) {
      return arguments.length > 1 ? (h == null ? l.delete(x) : l.set(x, m(h)), e) : l.get(x);
    },
    find: function(x, h, v) {
      var k = 0, C = i.length, T, A, N, b, _;
      for (v == null ? v = 1 / 0 : v *= v, k = 0; k < C; ++k)
        b = i[k], T = x - b.x, A = h - b.y, N = T * T + A * A, N < v && (_ = b, v = N);
      return _;
    },
    on: function(x, h) {
      return arguments.length > 1 ? (a.on(x, h), e) : a.on(x);
    }
  };
}
function Ot() {
  var i, e, t, n, s = ke(-30), r, o = 1, l = 1 / 0, d = 0.81;
  function a(f) {
    var m, x = i.length, h = gt(i, $r, qr).visitAfter(y);
    for (n = f, m = 0; m < x; ++m) e = i[m], h.visit(u);
  }
  function g() {
    if (i) {
      var f, m = i.length, x;
      for (r = new Array(m), f = 0; f < m; ++f)
        x = i[f], r[x.index] = +s(x, f, i);
    }
  }
  function y(f) {
    var m = 0, x, h, v = 0, k, C, T;
    if (f.length) {
      for (k = C = T = 0; T < 4; ++T)
        (x = f[T]) && (h = Math.abs(x.value)) && (m += x.value, v += h, k += h * x.x, C += h * x.y);
      f.x = k / v, f.y = C / v;
    } else {
      x = f, x.x = x.data.x, x.y = x.data.y;
      do
        m += r[x.data.index];
      while (x = x.next);
    }
    f.value = m;
  }
  function u(f, m, x, h) {
    if (!f.value) return !0;
    var v = f.x - e.x, k = f.y - e.y, C = h - m, T = v * v + k * k;
    if (C * C / d < T)
      return T < l && (v === 0 && (v = xe(t), T += v * v), k === 0 && (k = xe(t), T += k * k), T < o && (T = Math.sqrt(o * T)), e.vx += v * f.value * n / T, e.vy += k * f.value * n / T), !0;
    if (f.length || T >= l) return;
    (f.data !== e || f.next) && (v === 0 && (v = xe(t), T += v * v), k === 0 && (k = xe(t), T += k * k), T < o && (T = Math.sqrt(o * T)));
    do
      f.data !== e && (C = r[f.data.index] * n / T, e.vx += v * C, e.vy += k * C);
    while (f = f.next);
  }
  return a.initialize = function(f, m) {
    i = f, t = m, g();
  }, a.strength = function(f) {
    return arguments.length ? (s = typeof f == "function" ? f : ke(+f), g(), a) : s;
  }, a.distanceMin = function(f) {
    return arguments.length ? (o = f * f, a) : Math.sqrt(o);
  }, a.distanceMax = function(f) {
    return arguments.length ? (l = f * f, a) : Math.sqrt(l);
  }, a.theta = function(f) {
    return arguments.length ? (d = f * f, a) : Math.sqrt(d);
  }, a;
}
const Qr = {
  repulsion: -300,
  linkDistance: 80,
  linkStrength: 0.3,
  centerStrength: 0.05,
  collisionRadius: 1.2,
  collisionIterations: 1,
  velocityDecay: 0.3,
  alphaMin: 1e-3,
  linkIterations: 1
  // linkDistanceFn / linkStrengthFn 缺省不设置（由调用方外部定义亲密度→拉扯力）
};
class ht {
  constructor(e) {
    p(this, "simulation", null);
    p(this, "nodes", []);
    p(this, "links", []);
    p(this, "config");
    p(this, "centerX", 0);
    p(this, "centerY", 0);
    // Callbacks
    p(this, "onTick");
    p(this, "onEnd");
    this.config = { ...Qr, ...e };
  }
  /** Set nodes and links */
  setData(e, t) {
    this.nodes = e, this.links = t;
  }
  /** 构建力导向边：distance/strength 由外部 linkDistanceFn/linkStrengthFn 定义（未提供则用常量） */
  buildLinkForce() {
    return jr(this.links).id((e) => e.id).distance(
      (e) => {
        var t, n;
        return ((n = (t = this.config).linkDistanceFn) == null ? void 0 : n.call(t, e)) ?? this.config.linkDistance;
      }
    ).strength(
      (e) => {
        var t, n;
        return ((n = (t = this.config).linkStrengthFn) == null ? void 0 : n.call(t, e)) ?? this.config.linkStrength;
      }
    ).iterations(this.config.linkIterations);
  }
  /** Start or restart the simulation */
  start() {
    this.simulation && this.simulation.stop(), this.simulation = Jr(this.nodes).force("link", this.buildLinkForce()).force("charge", Ot().strength(this.config.repulsion)).force(
      "center",
      nt(this.centerX, this.centerY).strength(
        this.config.centerStrength
      )
    ).force(
      "collide",
      Lr(
        (e) => (e.radius || 5) * this.config.collisionRadius
      ).iterations(this.config.collisionIterations)
    ).velocityDecay(this.config.velocityDecay).alphaMin(this.config.alphaMin).on("tick", () => {
      var e;
      (e = this.onTick) == null || e.call(this, this.nodes);
    }).on("end", () => {
      var e;
      (e = this.onEnd) == null || e.call(this);
    });
  }
  /** Stop the simulation */
  stop() {
    var e;
    (e = this.simulation) == null || e.stop();
  }
  /** Reheat the simulation */
  reheat(e = 0.1) {
    var t;
    (t = this.simulation) == null || t.alpha(e).restart();
  }
  /**
   * 一次性同步排布（算法布局）：构建力模型后同步迭代指定次数即停止，
   * 不启动冷却动画——init 后直接按算法铺开节点，无需等待引擎冷却。
   * 注意：d3 的 simulation.tick() 只更新坐标、不派发 tick 事件（tick 事件
   * 由定时器 step() 派发），故手动 tick 后需显式调用 onTick 把最终位置推给
   * 渲染器，再触发 onEnd（fitView 等）。
   */
  settle(e = 300) {
    var n, s;
    this.start();
    const t = this.simulation;
    t && (t.stop(), t.tick(e), (n = this.onTick) == null || n.call(this, this.nodes), (s = this.onEnd) == null || s.call(this));
  }
  /** Update config and restart */
  updateConfig(e) {
    if (Object.assign(this.config, e), this.simulation) {
      const t = this.simulation;
      t.force("charge", Ot().strength(this.config.repulsion)), t.force("link", this.buildLinkForce()), t.force(
        "center",
        nt(this.centerX, this.centerY).strength(
          this.config.centerStrength
        )
      ), t.velocityDecay(this.config.velocityDecay), t.alphaMin(this.config.alphaMin), t.alpha(0.3).restart();
    }
  }
  /** Set center position */
  setCenter(e, t) {
    var n;
    this.centerX = e, this.centerY = t, (n = this.simulation) == null || n.force(
      "center",
      nt(e, t).strength(this.config.centerStrength)
    );
  }
  /** Fix a node in place */
  fixNode(e, t, n) {
    const s = this.nodes.find((r) => r.id === e);
    s && (t !== void 0 && (s.fx = t), n !== void 0 && (s.fy = n));
  }
  /** Release a fixed node */
  releaseNode(e) {
    const t = this.nodes.find((n) => n.id === e);
    t && (t.fx = null, t.fy = null);
  }
  /** Get current alpha */
  get alpha() {
    var e;
    return ((e = this.simulation) == null ? void 0 : e.alpha()) ?? 0;
  }
  /** Get all node positions as a map */
  getNodePositions() {
    const e = /* @__PURE__ */ new Map();
    for (const t of this.nodes)
      e.set(t.id, { x: t.x ?? 0, y: t.y ?? 0, vx: t.vx ?? 0, vy: t.vy ?? 0 });
    return e;
  }
  destroy() {
    var e;
    (e = this.simulation) == null || e.stop(), this.simulation = null;
  }
}
function ye(i) {
  let e = i.replace("#", "");
  e.length === 3 && (e = e.replace(/(.)/g, "$1$1")), e.length === 4 && (e = e.replace(/(.)/g, "$1$1"));
  const t = parseInt(e.slice(0, 2), 16) / 255, n = parseInt(e.slice(2, 4), 16) / 255, s = parseInt(e.slice(4, 6), 16) / 255, r = e.length >= 8 ? parseInt(e.slice(6, 8), 16) / 255 : 1;
  return [t, n, s, r];
}
function eo(i, e) {
  const t = { ...i };
  for (const n of Object.keys(e))
    n === "background" || typeof e[n] != "object" || e[n] === null ? t[n] = e[n] : t[n] = { ...i[n] || {}, ...e[n] };
  return t;
}
class to {
  constructor(e) {
    p(this, "options");
    p(this, "container");
    p(this, "model");
    /** 渲染器代理门面 */
    p(this, "renderer");
    /** 当前布局引擎 */
    p(this, "layout");
    /** 原始 theme 配置（含静态样式和动态回调） */
    p(this, "rawTheme");
    /** 运行时主题值（传给样式回调函数） */
    p(this, "runtimeTheme");
    // Node/link lookup
    p(this, "nodeMap", /* @__PURE__ */ new Map());
    p(this, "linkMap", /* @__PURE__ */ new Map());
    // 首次布局稳定后是否已自动 fitView（避免 init 后布局演化导致节点超出视野）
    p(this, "_autoFitOnEndDone", !1);
    p(this, "events");
    p(this, "styleManager");
    this.options = e, this.container = e.container, this.model = e.graphModel, this.events = this.model.events, this.styleManager = this.model.styleManager, this.runtimeTheme = e.runtimeTheme, this.renderer = new yr({
      container: this.container,
      width: e.width,
      height: e.height,
      backgroundColor: e.backgroundColor,
      showArrows: e.arrowDisplay,
      renderPlugin: e.renderPlugin
    }), this.rawTheme = e.theme;
    const t = this.renderer.plugin.getDefaultStyle();
    let n;
    if (e.theme) {
      n = { background: e.theme.background };
      for (const r of ["node", "link"]) {
        const o = e.theme[r];
        if (o) {
          const l = {};
          for (const d of Object.keys(o))
            typeof o[d] != "function" && (l[d] = o[d]);
          Object.keys(l).length > 0 && (n[r] = l);
        }
      }
    }
    const s = n ? eo(t, n) : t;
    this.styleManager.init(s), this.layout = e.layout ?? new ht(e.forceConfig), this.layout.onTick = (r) => {
      this.onPhysicsTick(r);
    }, this.layout.onEnd = () => {
      this._autoFitOnEndDone || (this._autoFitOnEndDone = !0, this.renderer.fitView(40));
    }, this.setupRendererCallbacks(), this.rebuildFromModel();
  }
  // ========== Renderer callbacks ==========
  setupRendererCallbacks() {
    this.renderer.onNodeContextMenu = (e, t, n) => {
      const s = this.nodeMap.get(e) ?? null;
      s && this.events.publish("nodeRightClick", {
        node: s,
        screenPos: { x: t, y: n },
        event: new MouseEvent("contextmenu")
      });
    }, this.renderer.onNodeClick = (e, t) => {
      const n = e ? this.nodeMap.get(e) ?? null : null;
      this.events.publish("nodeClick", {
        node: n,
        ctrlKey: (t == null ? void 0 : t.ctrlKey) ?? !1
      });
    }, this.renderer.onPlusClick = (e) => {
      const t = this.nodeMap.get(e) ?? null;
      t && this.events.publish("plusToolClick", t);
    }, this.renderer.onNodeHover = (e) => {
      if (e) {
        this.model.stateManager.setHoveredNodes([e]);
        const t = this.nodeMap.get(e) ?? null;
        this.events.publish("nodeHover", t);
      } else
        this.model.stateManager.clearHoveredNodes(), this.events.publish("nodeHover", null);
      this.syncAllNodeStyles();
    }, this.renderer.onLinkHover = (e) => {
      if (e) {
        this.model.stateManager.setHoveredLinks([e]);
        const t = this.linkMap.get(e) ?? null;
        this.events.publish("linkHover", { link: t, previousLink: null });
      } else
        this.model.stateManager.clearHoveredLinks(), this.events.publish("linkHover", { link: null, previousLink: null });
      this.syncAllLinkStyles(), this.syncAllNodeStyles();
    }, this.renderer.onNodeDrag = (e, t, n) => {
      this.layout.fixNode(e, t, n), this.layout.reheat(0.3);
      const r = this.layout.nodes.find((o) => o.id === e);
      r && (r.x = t, r.y = n);
    }, this.renderer.onNodeDragEnd = (e) => {
      this.layout.releaseNode(e);
      const t = this.nodeMap.get(e) ?? null;
      this.events.publish("nodeDragEnd", t);
    }, this.renderer.onLinkClick = (e, t) => {
      const n = e ? this.linkMap.get(e) ?? null : null;
      this.events.publish("linkClick", n);
    }, this.renderer.onBackgroundClick = (e) => {
      this.events.publish("backgroundClick", void 0);
    }, this.renderer.onZoom = (e) => {
      this.events.publish("zoom", e);
    }, this.events.subscribe("dataChange", ({ graphData: e }) => {
      this.rebuildFromModel(!1);
    }), this.events.subscribe("selectionChange", ({ nodeIds: e }) => {
      this.syncAllNodeStyles(), this.syncAllLinkStyles();
    }), this.events.subscribe("hiddenChange", () => {
      this.syncAllNodeStyles(), this.syncAllLinkStyles();
    });
  }
  // ========== 状态驱动的视觉同步 ==========
  /** 遍历所有节点，根据 stateManager 当前状态刷新视觉样式 */
  syncAllNodeStyles() {
    var e, t;
    for (const n of this.renderer.nodes) {
      const s = ((t = (e = this.renderer.plugin).resolveNodeState) == null ? void 0 : t.call(
        e,
        n.id,
        this.model.stateManager
      )) ?? "regular", r = this.styleManager.getNodeStyle(n.id), o = We(r, s), l = o.opacity ?? 1, d = ye(o.bgColor), a = ye(o.strokeColor ?? "#666"), g = ye(o.textColor ?? "#2c2c2c");
      n.color = [d[0], d[1], d[2], l], n.strokeColor = [a[0], a[1], a[2], l], n.textColor = [g[0], g[1], g[2], l], n.strokeWidth = o.strokeWidth;
    }
  }
  /** 遍历所有边，根据 stateManager 当前状态刷新视觉样式 */
  syncAllLinkStyles() {
    var e, t;
    for (const n of this.renderer.links) {
      const s = ((t = (e = this.renderer.plugin).resolveLinkState) == null ? void 0 : t.call(
        e,
        n.id,
        this.model.stateManager
      )) ?? "regular", r = It(
        this.styleManager.getLinkStyle(n.id),
        s
      ), o = ye(r.color ?? "#9ca3af");
      n.color = [o[0], o[1], o[2], r.opacity ?? 0.7], n.width = r.strokeWidth ?? 0.8;
    }
  }
  // ========== Data rebuilding ==========
  rebuildFromModel(e = !0) {
    var l;
    const { graphData: t } = this.model.getGraphModelData();
    this.nodeMap.clear(), this.linkMap.clear();
    const n = [], s = [];
    for (let d = 0; d < t.nodes.length; d++) {
      const a = t.nodes[d];
      this.nodeMap.set(a.id, a);
      const g = this.defaultMapNode(a, d);
      g && (n.push(g), s.push({
        id: a.id,
        x: a.x ?? (Math.random() - 0.5) * 100,
        y: a.y ?? (Math.random() - 0.5) * 100,
        radius: g.radius,
        fx: a.fx ?? null,
        fy: a.fy ?? null,
        vx: a.vx ?? 0,
        vy: a.vy ?? 0
      }));
    }
    const r = [], o = [];
    for (let d = 0; d < t.links.length; d++) {
      const a = t.links[d];
      this.linkMap.set(a.id, a);
      const g = typeof a.source == "object" ? a.source.id : a.source, y = typeof a.target == "object" ? a.target.id : a.target, u = this.defaultMapLink(a, d);
      u && (r.push(u), o.push({
        id: a.id,
        source: g,
        target: y,
        // 亲密度传给物理引擎：影响边拉扯力（关系越强节点越紧）
        intimacy: (l = a.data) == null ? void 0 : l.intimacy
      }));
    }
    this.renderer.updateData(n, r), this.layout.setData(s, o), this.layout.start(), e && requestAnimationFrame(() => {
      this.renderer.fitView();
    });
  }
  defaultMapNode(e, t) {
    var f, m, x, h, v, k, C;
    const n = (f = e.data) == null ? void 0 : f.nodeType, s = n ? (x = (m = this.rawTheme) == null ? void 0 : m.node) == null ? void 0 : x[n] : void 0, r = typeof s == "function" ? s(e, this.runtimeTheme) : s ?? this.styleManager.getNodeStyle(e.id);
    this.styleManager.setNodeStyle(e.id, r);
    const o = ((v = (h = this.renderer.plugin).resolveNodeState) == null ? void 0 : v.call(
      h,
      e.id,
      this.model.stateManager
    )) ?? "regular", l = We(r, o), d = ye(l.bgColor), a = d[0], g = d[1], y = d[2], u = ye(l.textColor);
    return {
      x: e.x ?? 0,
      y: e.y ?? 0,
      radius: l.radius,
      color: [a, g, y, l.opacity],
      strokeColor: ye(l.strokeColor),
      strokeWidth: l.strokeWidth,
      id: e.id,
      label: (k = e.data) == null ? void 0 : k.label,
      textColor: [u[0], u[1], u[2], 1],
      fontSize: l.fontSize,
      // 图标：node.data.icon（URL 或 emoji，见 IconAtlas）
      iconUrl: (C = e.data) == null ? void 0 : C.icon
    };
  }
  defaultMapLink(e, t) {
    var h, v, k, C, T;
    const n = typeof e.source == "object" ? e.source.id : e.source, s = typeof e.target == "object" ? e.target.id : e.target, r = this.nodeMap.get(String(n)), o = this.nodeMap.get(String(s)), l = (h = e.data) == null ? void 0 : h.linkType, d = l ? (k = (v = this.rawTheme) == null ? void 0 : v.link) == null ? void 0 : k[l] : void 0, a = typeof d == "function" ? d(e, this.runtimeTheme) : d ?? this.styleManager.getLinkStyle(e.id);
    this.styleManager.setLinkStyle(e.id, a);
    const g = It(a, "regular"), y = ye(g.color ?? "#9ca3af"), u = this.styleManager.getNodeStyle(n), f = this.styleManager.getNodeStyle(s), m = We(u, "regular"), x = We(f, "regular");
    return {
      sourceX: (r == null ? void 0 : r.x) ?? 0,
      sourceY: (r == null ? void 0 : r.y) ?? 0,
      targetX: (o == null ? void 0 : o.x) ?? 0,
      targetY: (o == null ? void 0 : o.y) ?? 0,
      color: [y[0], y[1], y[2], g.opacity ?? 0.7],
      width: g.strokeWidth ?? 0.8,
      sourceRadius: m.radius ?? 4,
      targetRadius: x.radius ?? 4,
      sourceId: String(n),
      targetId: String(s),
      id: e.id,
      label: ((C = e.data) == null ? void 0 : C.label) ?? ((T = e.data) == null ? void 0 : T.linkType),
      arrowSize: g.arrowSize
    };
  }
  // ========== Physics sync ==========
  onPhysicsTick(e) {
    const t = /* @__PURE__ */ new Map();
    for (const o of e) {
      t.set(o.id, { x: o.x ?? 0, y: o.y ?? 0 });
      const l = this.nodeMap.get(o.id);
      l && (l.x = o.x ?? 0, l.y = o.y ?? 0, l.vx = o.vx ?? 0, l.vy = o.vy ?? 0);
    }
    this.renderer.updateNodePositions(t);
    const n = this.renderer.nodes, s = this.renderer.links;
    for (const o of s)
      n.find((l) => l.id === o.id);
    const { graphData: r } = this.model.getGraphModelData();
    for (const o of s) {
      const l = r.links.find((u) => u.id === o.id);
      if (!l) continue;
      const d = typeof l.source == "object" ? l.source.id : l.source, a = typeof l.target == "object" ? l.target.id : l.target, g = r.nodes.find((u) => u.id === d), y = r.nodes.find((u) => u.id === a);
      g && (o.sourceX = g.x ?? 0, o.sourceY = g.y ?? 0), y && (o.targetX = y.x ?? 0, o.targetY = y.y ?? 0);
    }
  }
  // ========== Public API ==========
  /** Update graph data */
  updateView(e) {
    e.graphData && this.model.updateGraphData({ graphData: e.graphData });
  }
  /** Focus on a node */
  focusNodeById(e) {
    this.renderer.focusNode(e);
  }
  /** Fit all nodes in view */
  /** 切换布局引擎（如 力导向 ⇄ 树形），并用当前画布数据重建排布 */
  setLayout(e) {
    var t, n, s, r;
    this.layout && this.layout !== e && ((n = (t = this.layout).stop) == null || n.call(t), (r = (s = this.layout).destroy) == null || r.call(s)), this.layout = e, this.layout.onTick = (o) => {
      this.onPhysicsTick(o);
    }, this.layout.onEnd = () => {
      this._autoFitOnEndDone || (this._autoFitOnEndDone = !0);
    }, this.rebuildFromModel(!1);
  }
  fitView(e) {
    this.renderer.fitView(e);
  }
  /** Get the renderer proxy */
  getRenderer() {
    return this.renderer;
  }
  /** Get the current layout engine */
  getLayout() {
    return this.layout;
  }
  /** Update force config (only works with ForceSimulation) */
  updatePhysics(e) {
    this.layout instanceof ht && this.layout.updateConfig(e);
  }
  /** Reheat the layout */
  reheat(e) {
    this.layout.reheat(e);
  }
  /**
   * 把物理引擎中心设到指定世界坐标。
   * 搜索新增时传当前视口中心——统一兼容两种情况：
   *  - 空画布（相机从未 fitView，默认态 k=1,x=0,y=0）：视口中心世界坐标=(W/2,H/2)，
   *    物理中心跟随 → 节点聚在屏幕中央，不被中心力拉回世界原点(左上角)；
   *  - 非空画布：视口中心世界坐标≈当前视野中央 → 增量节点出现在视野中央、不跳视角。
   */
  setPhysicsCenter(e, t) {
    var n, s;
    (s = (n = this.layout).setCenter) == null || s.call(n, e, t);
  }
  /**
   * 一次性算法排布并 fitView（不等待物理引擎冷却）。
   * 供 init 使用：数据载入后直接按算法铺开节点并收进视野。
   */
  settleLayout(e) {
    this.layout.settle ? this.layout.settle(e ?? 300) : this.layout.start(), requestAnimationFrame(() => this.renderer.fitView(40));
  }
  /** Get underlying canvas */
  getCanvas() {
    return this.renderer.canvas;
  }
  /** Clear hover state (visual + state) */
  clearHover() {
    this.syncAllNodeStyles(), this.model.stateManager.clearHoveredNodes(), this.events.publish("nodeHover", null), this.syncAllLinkStyles(), this.events.publish("linkHover", { link: null, previousLink: null });
  }
  /**
   * 主题切换后重新解析所有节点/边的视觉样式。
   * 重新运行 defaultMapNode/defaultMapLink（会读取新的主题调色板），
   * 仅更新颜色/粗细等视觉字段，保持节点位置与布局不变。
   */
  refreshTheme() {
    const { graphData: e } = this.model.getGraphModelData(), t = new Map(this.renderer.nodes.map((s) => [s.id, s]));
    for (let s = 0; s < e.nodes.length; s++) {
      const r = e.nodes[s], o = this.defaultMapNode(r, s), l = t.get(r.id);
      o && l && (l.color = o.color, l.strokeColor = o.strokeColor, l.strokeWidth = o.strokeWidth, l.radius = o.radius, l.textColor = o.textColor, l.fontSize = o.fontSize);
    }
    const n = new Map(this.renderer.links.map((s) => [s.id, s]));
    for (let s = 0; s < e.links.length; s++) {
      const r = e.links[s], o = this.defaultMapLink(r, s), l = n.get(r.id);
      o && l && (l.color = o.color, l.width = o.width, l.arrowSize = o.arrowSize);
    }
    this.syncAllNodeStyles(), this.syncAllLinkStyles();
  }
  /**
   * 设置运行时主题值并重新应用节点/边样式（主题切换用）。
   * 样式回调函数会收到该值作为第 2 个参数。
   */
  setRuntimeTheme(e) {
    this.runtimeTheme = e, this.refreshTheme();
  }
  /**
   * 设置高亮节点并刷新视觉。
   * 供分析面板等外部调用，把已在画布上的节点标记为 highlighted。
   */
  setHighlightNodes(e, t = []) {
    e.length > 0 ? this.model.stateManager.setHighlightNodes(e, t) : this.model.stateManager.clearHighlightNodes(), this.syncAllNodeStyles(), this.syncAllLinkStyles();
  }
  /**
   * 设置/清除悬停节点并刷新视觉。
   * 供分析面板悬浮联动：对画布上对应节点实时应用 hover 效果。
   */
  setHoveredNodes(e) {
    e.length > 0 ? this.model.stateManager.setHoveredNodes(e) : this.model.stateManager.clearHoveredNodes(), this.syncAllNodeStyles();
  }
  /** Destroy and clean up */
  destroy() {
    this.layout.destroy(), this.renderer.destroy();
  }
}
function no(i) {
  return !!(/^(https?:|blob:)/i.test(i) || i.startsWith("data:image/") || i.startsWith("/"));
}
class so {
  constructor(e = 1024, t = 64) {
    p(this, "canvas");
    p(this, "ctx");
    p(this, "texture", null);
    p(this, "entries", /* @__PURE__ */ new Map());
    /** 已分配 slot 但尚未加载完成的 url → glyph 占位 */
    p(this, "pending", /* @__PURE__ */ new Map());
    p(this, "cursorX", 2);
    p(this, "cursorY", 2);
    p(this, "rowHeight", 0);
    p(this, "slotSize");
    p(this, "dirty", !1);
    this.canvas = document.createElement("canvas"), this.canvas.width = e, this.canvas.height = e, this.ctx = this.canvas.getContext("2d"), this.slotSize = t;
  }
  /** 获取图标的 UV。首次调用时异步加载，返回 null；加载完成后返回 glyph */
  getOrCreate(e) {
    if (!e || !no(e)) return null;
    const t = this.entries.get(e);
    if (t) return t;
    if (this.pending.has(e)) return null;
    const n = this.slotSize;
    if (this.cursorX + n > this.canvas.width && (this.cursorX = 2, this.cursorY += this.rowHeight + 2, this.rowHeight = 0), this.cursorY + n > this.canvas.height)
      return console.warn("[IconAtlas] overflow:", e), null;
    const s = this.cursorX, r = this.cursorY, o = this.canvas.width, l = this.canvas.height;
    this.cursorX += n + 1, this.rowHeight = Math.max(this.rowHeight, n);
    const d = {
      uv: [s / o, r / l, (s + n) / o, (r + n) / l],
      pw: n,
      ph: n
    };
    return this.loadImage(e, d, s, r, n), null;
  }
  loadImage(e, t, n, s, r) {
    this.pending.set(e, t);
    const o = new Image();
    o.crossOrigin = "anonymous", o.onload = () => {
      const l = Math.min(r / o.width, r / o.height), d = o.width * l, a = o.height * l;
      this.ctx.clearRect(n, s, r, r), this.ctx.drawImage(o, n + (r - d) / 2, s + (r - a) / 2, d, a), this.entries.set(e, t), this.pending.delete(e), this.dirty = !0;
    }, o.onerror = () => {
      this.entries.set(e, t), this.pending.delete(e), this.dirty = !0;
    }, o.src = e;
  }
  getTexture(e) {
    return this.texture || (this.texture = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this.texture), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE)), this.dirty && this.upload(e), this.texture;
  }
  upload(e) {
    e.bindTexture(e.TEXTURE_2D, this.texture), e.texImage2D(
      e.TEXTURE_2D,
      0,
      e.RGBA,
      e.RGBA,
      e.UNSIGNED_BYTE,
      this.canvas
    ), this.dirty = !1;
  }
  clear() {
    this.entries.clear(), this.pending.clear(), this.cursorX = 2, this.cursorY = 2, this.rowHeight = 0, this.dirty = !0;
  }
}
function ut(i) {
  return 0;
}
class io {
  constructor(e) {
    p(this, "gl");
    p(this, "program");
    p(this, "pickProgram");
    // Shared quad geometry (unit square centered at origin)
    p(this, "quadVao", null);
    // Uniform locations (render)
    p(this, "uResolution", null);
    p(this, "uTranslation", null);
    p(this, "uScale", null);
    p(this, "uZOffset", null);
    p(this, "uIconAtlas", null);
    // Uniform locations (pick)
    p(this, "uPickResolution", null);
    p(this, "uPickTranslation", null);
    p(this, "uPickScale", null);
    p(this, "uPickZOffset", null);
    this.gl = e, this.program = this.compileProgram(Ki, Zi), this.pickProgram = this.compileProgram(Ji, Qi), this.initQuadGeometry(), this.cacheUniforms();
  }
  compileProgram(e, t) {
    const n = this.gl, s = this.compileShader(n.VERTEX_SHADER, e), r = this.compileShader(n.FRAGMENT_SHADER, t), o = n.createProgram();
    if (n.attachShader(o, s), n.attachShader(o, r), n.linkProgram(o), !n.getProgramParameter(o, n.LINK_STATUS))
      throw new Error("Shader link failed: " + n.getProgramInfoLog(o));
    return o;
  }
  compileShader(e, t) {
    const n = this.gl, s = n.createShader(e);
    if (n.shaderSource(s, t), n.compileShader(s), !n.getShaderParameter(s, n.COMPILE_STATUS))
      throw new Error("Shader compile failed: " + n.getShaderInfoLog(s));
    return s;
  }
  cacheUniforms() {
    const e = this.gl;
    this.uResolution = e.getUniformLocation(this.program, "u_resolution"), this.uTranslation = e.getUniformLocation(this.program, "u_translation"), this.uScale = e.getUniformLocation(this.program, "u_scale"), this.uZOffset = e.getUniformLocation(this.program, "u_zOffset"), this.uIconAtlas = e.getUniformLocation(this.program, "u_iconAtlas"), this.uPickResolution = e.getUniformLocation(
      this.pickProgram,
      "u_resolution"
    ), this.uPickTranslation = e.getUniformLocation(
      this.pickProgram,
      "u_translation"
    ), this.uPickScale = e.getUniformLocation(this.pickProgram, "u_scale"), this.uPickZOffset = e.getUniformLocation(this.pickProgram, "u_zOffset");
  }
  initQuadGeometry() {
    const e = this.gl, t = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1
    ]), n = e.createVertexArray();
    e.bindVertexArray(n);
    const s = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, s), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.quadVao = n;
  }
  /** Render all nodes in one instanced draw call */
  render(e, t, n, s, r, o, l = 0, d) {
    if (e.length === 0) return;
    const a = this.gl, g = e.length;
    a.useProgram(this.program), a.uniform2f(this.uResolution, t, n), a.uniform2f(this.uTranslation, s, r), a.uniform1f(this.uScale, o), a.uniform1f(this.uZOffset, l), a.bindVertexArray(this.quadVao);
    const y = new Float32Array(g * 2), u = new Float32Array(g), f = new Float32Array(g * 4), m = new Float32Array(g * 4), x = new Float32Array(g), h = new Float32Array(g), v = new Float32Array(g), k = new Float32Array(g), C = new Float32Array(g), T = new Float32Array(g), A = new Float32Array(g), N = new Float32Array(g), b = new Float32Array(g * 4), _ = /* @__PURE__ */ new Map();
    for (let S = 0; S < g; S++) {
      const P = e[S];
      if (y[S * 2] = P.x, y[S * 2 + 1] = P.y, u[S] = P.radius, f[S * 4] = P.color[0], f[S * 4 + 1] = P.color[1], f[S * 4 + 2] = P.color[2], f[S * 4 + 3] = P.color[3], m[S * 4] = P.strokeColor[0], m[S * 4 + 1] = P.strokeColor[1], m[S * 4 + 2] = P.strokeColor[2], m[S * 4 + 3] = P.strokeColor[3], x[S] = P.strokeWidth, h[S] = ut(P.shape), v[S] = P.shapeParam ?? 0.25, k[S] = P.showPlus ?? 0, C[S] = P.plusOffsetX ?? 0.5, T[S] = P.plusOffsetY ?? -0.5, A[S] = P.plusScale ?? 0.35, d && P.iconUrl) {
        let E = _.get(P.iconUrl);
        E === void 0 && (E = d.getOrCreate(P.iconUrl), _.set(P.iconUrl, E)), E && (N[S] = 1, b[S * 4] = E.uv[0], b[S * 4 + 1] = E.uv[1], b[S * 4 + 2] = E.uv[2], b[S * 4 + 3] = E.uv[3]);
      }
    }
    this.setupInstanceBuffer(1, y, 2), this.setupInstanceBuffer(2, u, 1), this.setupInstanceBuffer(3, f, 4), this.setupInstanceBuffer(4, m, 4), this.setupInstanceBuffer(5, x, 1), this.setupInstanceBuffer(6, h, 1), this.setupInstanceBuffer(7, v, 1), this.setupInstanceBuffer(8, k, 1), this.setupInstanceBuffer(9, C, 1), this.setupInstanceBuffer(10, T, 1), this.setupInstanceBuffer(11, A, 1), this.setupInstanceBuffer(12, N, 1), this.setupInstanceBuffer(13, b, 4), d && (a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, d.getTexture(a)), a.uniform1i(this.uIconAtlas, 1)), a.drawArraysInstanced(a.TRIANGLES, 0, 6, g);
    for (let S = 1; S <= 13; S++)
      a.vertexAttribDivisor(S, 0);
    a.bindVertexArray(null);
  }
  /** Batch-render all nodes for FBO picking (single draw call, gl_InstanceID encodes index) */
  renderPicking(e, t, n, s, r, o, l = 0) {
    if (e.length === 0) return;
    const d = this.gl, a = e.length;
    d.useProgram(this.pickProgram), d.uniform2f(this.uPickResolution, t, n), d.uniform2f(this.uPickTranslation, s, r), d.uniform1f(this.uPickScale, o), d.uniform1f(this.uPickZOffset, l), d.bindVertexArray(this.quadVao);
    const g = new Float32Array(a * 2), y = new Float32Array(a), u = new Float32Array(a * 4), f = new Float32Array(a * 4), m = new Float32Array(a), x = new Float32Array(a), h = new Float32Array(a);
    for (let v = 0; v < a; v++) {
      const k = e[v];
      g[v * 2] = k.x, g[v * 2 + 1] = k.y, y[v] = k.radius, m[v] = k.strokeWidth, x[v] = ut(k.shape), h[v] = k.shapeParam ?? 0.25;
    }
    this.setupInstanceBuffer(1, g, 2), this.setupInstanceBuffer(2, y, 1), this.setupInstanceBuffer(3, u, 4), this.setupInstanceBuffer(4, f, 4), this.setupInstanceBuffer(5, m, 1), this.setupInstanceBuffer(6, x, 1), this.setupInstanceBuffer(7, h, 1), d.drawArraysInstanced(d.TRIANGLES, 0, 6, a);
    for (let v = 1; v <= 7; v++)
      d.vertexAttribDivisor(v, 0);
    d.bindVertexArray(null);
  }
  setupInstanceBuffer(e, t, n) {
    const s = this.gl, r = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, t, s.DYNAMIC_DRAW), s.enableVertexAttribArray(e), s.vertexAttribPointer(e, n, s.FLOAT, !1, 0, 0), s.vertexAttribDivisor(e, 1);
  }
  destroy() {
    const e = this.gl;
    e.deleteProgram(this.program), e.deleteProgram(this.pickProgram);
  }
}
class ro {
  constructor(e) {
    p(this, "gl");
    // ── Line program ──
    p(this, "lineProgram");
    p(this, "linePickProgram");
    // ── Arrow program ──
    p(this, "arrowProgram");
    p(this, "arrowPickProgram");
    // ── VAOs ──
    p(this, "lineVao", null);
    p(this, "arrowVao", null);
    p(this, "_lineVerts", 0);
    // triangle strip vertex count
    // Uniforms (line render)
    p(this, "uLineResolution", null);
    p(this, "uLineTranslation", null);
    p(this, "uLineScale", null);
    p(this, "uLineZOffset", null);
    // Uniforms (line pick)
    p(this, "uLinePickResolution", null);
    p(this, "uLinePickTranslation", null);
    p(this, "uLinePickScale", null);
    p(this, "uLinePickZOffset", null);
    p(this, "uLinePickIdOffset", null);
    // Uniforms (arrow render)
    p(this, "uArrowResolution", null);
    p(this, "uArrowTranslation", null);
    p(this, "uArrowScale", null);
    // Uniforms (arrow pick)
    p(this, "uArrowPickResolution", null);
    p(this, "uArrowPickTranslation", null);
    p(this, "uArrowPickScale", null);
    this.gl = e, this.lineProgram = this.compile(er, tr), this.linePickProgram = this.compile(nr, sr), this.arrowProgram = this.compile(ir, rr), this.arrowPickProgram = this.compile(or, ar), this.initLineGeometry(), this.initArrowGeometry(), this.cacheUniforms();
  }
  compile(e, t) {
    const n = this.gl, s = this.makeShader(n.VERTEX_SHADER, e), r = this.makeShader(n.FRAGMENT_SHADER, t), o = n.createProgram();
    return n.attachShader(o, s), n.attachShader(o, r), n.linkProgram(o), o;
  }
  makeShader(e, t) {
    const n = this.gl, s = n.createShader(e);
    return n.shaderSource(s, t), n.compileShader(s), s;
  }
  cacheUniforms() {
    const e = this.gl;
    this.uLineResolution = e.getUniformLocation(
      this.lineProgram,
      "u_resolution"
    ), this.uLineTranslation = e.getUniformLocation(
      this.lineProgram,
      "u_translation"
    ), this.uLineScale = e.getUniformLocation(this.lineProgram, "u_scale"), this.uLineZOffset = e.getUniformLocation(this.lineProgram, "u_zOffset"), this.uLinePickResolution = e.getUniformLocation(
      this.linePickProgram,
      "u_resolution"
    ), this.uLinePickTranslation = e.getUniformLocation(
      this.linePickProgram,
      "u_translation"
    ), this.uLinePickScale = e.getUniformLocation(this.linePickProgram, "u_scale"), this.uLinePickZOffset = e.getUniformLocation(
      this.linePickProgram,
      "u_zOffset"
    ), this.uLinePickIdOffset = e.getUniformLocation(
      this.linePickProgram,
      "u_idOffset"
    ), this.uArrowResolution = e.getUniformLocation(
      this.arrowProgram,
      "u_resolution"
    ), this.uArrowTranslation = e.getUniformLocation(
      this.arrowProgram,
      "u_translation"
    ), this.uArrowScale = e.getUniformLocation(this.arrowProgram, "u_scale"), this.uArrowPickResolution = e.getUniformLocation(
      this.arrowPickProgram,
      "u_resolution"
    ), this.uArrowPickTranslation = e.getUniformLocation(
      this.arrowPickProgram,
      "u_translation"
    ), this.uArrowPickScale = e.getUniformLocation(
      this.arrowPickProgram,
      "u_scale"
    );
  }
  /** 三角带：t∈[0,1] 分割为 SEGMENTS 段, side=±1 交替 */
  initLineGeometry() {
    const e = this.gl, t = 16, n = new Float32Array((t + 1) * 4);
    for (let o = 0; o <= t; o++) {
      const l = o / t, d = o * 4;
      n[d] = l, n[d + 1] = -1, n[d + 2] = l, n[d + 3] = 1;
    }
    const s = e.createVertexArray();
    e.bindVertexArray(s);
    const r = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, r), e.bufferData(e.ARRAY_BUFFER, n, e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.lineVao = s, this._lineVerts = (t + 1) * 2;
  }
  /** 箭头三角形：x∈[-1,0] 沿方向偏移, y=±0.5 垂直宽度 */
  initArrowGeometry() {
    const e = this.gl, t = new Float32Array([-0.6, -0.45, -0.6, 0.45, -0.01, 0]), n = e.createVertexArray();
    e.bindVertexArray(n);
    const s = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, s), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.arrowVao = n;
  }
  /** Render link lines + arrows in two draw calls */
  render(e, t, n, s, r, o, l = !1, d = 0) {
    if (e.length === 0) return;
    const a = this.gl, g = e.length, y = 12, u = new Float32Array(g), f = new Float32Array(g), m = /* @__PURE__ */ new Map();
    for (let b = 0; b < g; b++) {
      const _ = e[b], S = `${_.sourceId ?? ""}|${_.targetId ?? ""}`;
      m.has(S) || m.set(S, []), m.get(S).push({ idx: b, link: _ });
    }
    for (const [, b] of m) {
      const _ = b.length;
      if (!(_ <= 1)) {
        b.sort((S, P) => S.idx - P.idx);
        for (let S = 0; S < _; S++) {
          const { idx: P, link: E } = b[S], H = E.targetX - E.sourceX, F = E.targetY - E.sourceY, B = Math.sqrt(H * H + F * F), j = B > 0.01 ? -F / B : 1, R = B > 0.01 ? H / B : 0;
          if (_ % 2 === 1 && S === Math.floor(_ / 2)) continue;
          let w, D;
          if (_ % 2 === 1) {
            const X = Math.floor(_ / 2);
            S < X ? (w = X - S - 1, D = 1) : (w = S - X - 1, D = -1);
          } else
            w = Math.floor(S / 2), D = S % 2 === 0 ? 1 : -1;
          const M = (w + 1) * y;
          u[P] = (E.sourceX + E.targetX) / 2 + j * D * M, f[P] = (E.sourceY + E.targetY) / 2 + R * D * M;
        }
      }
    }
    const x = new Float32Array(g * 2), h = new Float32Array(g * 2), v = new Float32Array(g * 2), k = new Float32Array(g * 4), C = new Float32Array(g), T = new Float32Array(g * 2), A = new Float32Array(g * 2), N = new Float32Array(g);
    for (let b = 0; b < g; b++) {
      const _ = e[b], S = _.targetRadius ?? 0;
      x[b * 2] = _.sourceX, x[b * 2 + 1] = _.sourceY, v[b * 2] = _.targetX, v[b * 2 + 1] = _.targetY;
      const P = u[b], E = f[b];
      P === 0 && E === 0 ? (h[b * 2] = (_.sourceX + _.targetX) / 2, h[b * 2 + 1] = (_.sourceY + _.targetY) / 2) : (h[b * 2] = P, h[b * 2 + 1] = E);
      const H = _.targetX - h[b * 2], F = _.targetY - h[b * 2 + 1], B = Math.sqrt(H * H + F * F), j = B > 1e-3 ? H / B : 1, R = B > 1e-3 ? F / B : 0;
      T[b * 2] = _.targetX - j * S, T[b * 2 + 1] = _.targetY - R * S, k.set(_.color, b * 4), C[b] = _.width, A[b * 2] = H, A[b * 2 + 1] = F, N[b] = _.arrowSize ?? Math.max(6, _.width * 16 + 4);
    }
    a.useProgram(this.lineProgram), a.uniform2f(this.uLineResolution, t, n), a.uniform2f(this.uLineTranslation, s, r), a.uniform1f(this.uLineScale, o), a.uniform1f(this.uLineZOffset, d), a.bindVertexArray(this.lineVao);
    for (let b = 0; b < g; b++)
      this.instancedSingle(1, x[b * 2], x[b * 2 + 1]), this.instancedSingle(2, h[b * 2], h[b * 2 + 1]), this.instancedSingle(3, v[b * 2], v[b * 2 + 1]), this.instancedSingle4(4, k, b * 4), this.instancedSingle1(5, C[b]), a.drawArraysInstanced(a.TRIANGLE_STRIP, 0, this._lineVerts, 1);
    for (let b = 1; b <= 5; b++) a.vertexAttribDivisor(b, 0);
    if (l) {
      a.useProgram(this.arrowProgram), a.uniform2f(this.uArrowResolution, t, n), a.uniform2f(this.uArrowTranslation, s, r), a.uniform1f(this.uArrowScale, o), a.bindVertexArray(this.arrowVao), a.disable(a.BLEND);
      for (let b = 0; b < g; b++)
        this.instancedSingle(1, T[b * 2], T[b * 2 + 1]), this.instancedSingle(2, A[b * 2], A[b * 2 + 1]), this.instancedSingle4(3, k, b * 4), this.instancedSingle1(4, N[b]), a.drawArraysInstanced(a.TRIANGLES, 0, 3, 1);
      for (let b = 1; b <= 4; b++) a.vertexAttribDivisor(b, 0);
      a.enable(a.BLEND);
    }
    a.bindVertexArray(null);
  }
  /** Batch-render links for FBO picking (lines only, triangle strip) */
  renderPicking(e, t, n, s, r, o, l = 0, d = 0) {
    if (e.length === 0) return;
    const a = this.gl, g = e.length, y = 12, u = new Float32Array(g), f = new Float32Array(g), m = /* @__PURE__ */ new Map();
    for (let T = 0; T < g; T++) {
      const A = e[T], N = `${A.sourceId ?? ""}|${A.targetId ?? ""}`;
      m.has(N) || m.set(N, []), m.get(N).push({ idx: T, link: A });
    }
    for (const [, T] of m) {
      const A = T.length;
      if (!(A <= 1)) {
        T.sort((N, b) => N.idx - b.idx);
        for (let N = 0; N < A; N++) {
          const { idx: b, link: _ } = T[N], S = _.targetX - _.sourceX, P = _.targetY - _.sourceY, E = Math.sqrt(S * S + P * P), H = E > 0.01 ? -P / E : 1, F = E > 0.01 ? S / E : 0;
          if (A % 2 === 1 && N === Math.floor(A / 2)) continue;
          let B, j;
          if (A % 2 === 1) {
            const w = Math.floor(A / 2);
            N < w ? (B = w - N - 1, j = 1) : (B = N - w - 1, j = -1);
          } else
            B = Math.floor(N / 2), j = N % 2 === 0 ? 1 : -1;
          const R = (B + 1) * y;
          u[b] = (_.sourceX + _.targetX) / 2 + H * j * R, f[b] = (_.sourceY + _.targetY) / 2 + F * j * R;
        }
      }
    }
    a.useProgram(this.linePickProgram), a.uniform2f(this.uLinePickResolution, t, n), a.uniform2f(this.uLinePickTranslation, s, r), a.uniform1f(this.uLinePickScale, o), a.uniform1f(this.uLinePickZOffset, d), a.uniform1ui(this.uLinePickIdOffset, l), a.bindVertexArray(this.lineVao);
    const x = new Float32Array(g * 2), h = new Float32Array(g * 2), v = new Float32Array(g * 2), k = new Float32Array(g * 4), C = new Float32Array(g);
    for (let T = 0; T < g; T++) {
      const A = e[T], N = A.sourceX, b = A.sourceY, _ = A.targetX, S = A.targetY;
      x[T * 2] = N, x[T * 2 + 1] = b, v[T * 2] = _, v[T * 2 + 1] = S;
      const P = u[T], E = f[T];
      P === 0 && E === 0 ? (h[T * 2] = (N + _) / 2, h[T * 2 + 1] = (b + S) / 2) : (h[T * 2] = P, h[T * 2 + 1] = E), C[T] = A.width + 8;
    }
    this.instancedAttrib(1, x, 2), this.instancedAttrib(2, h, 2), this.instancedAttrib(3, v, 2), this.instancedAttrib(4, k, 4), this.instancedAttrib(5, C, 1), a.drawArraysInstanced(a.TRIANGLE_STRIP, 0, this._lineVerts, g);
    for (let T = 1; T <= 5; T++) a.vertexAttribDivisor(T, 0);
    a.bindVertexArray(null);
  }
  instancedAttrib(e, t, n) {
    const s = this.gl, r = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, t, s.DYNAMIC_DRAW), s.enableVertexAttribArray(e), s.vertexAttribPointer(e, n, s.FLOAT, !1, 0, 0), s.vertexAttribDivisor(e, 1);
  }
  instancedSingle(e, t, n) {
    this.instancedSingle1Arr(e, new Float32Array([t, n]), 2);
  }
  instancedSingle1(e, t) {
    this.instancedSingle1Arr(e, new Float32Array([t]), 1);
  }
  instancedSingle4(e, t, n) {
    this.instancedSingle1Arr(e, t.slice(n, n + 4), 4);
  }
  instancedSingle1Arr(e, t, n) {
    const s = this.gl, r = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, t, s.DYNAMIC_DRAW), s.enableVertexAttribArray(e), s.vertexAttribPointer(e, n, s.FLOAT, !1, 0, 0), s.vertexAttribDivisor(e, 1);
  }
  destroy() {
    const e = this.gl;
    e.deleteProgram(this.lineProgram), e.deleteProgram(this.linePickProgram), e.deleteProgram(this.arrowProgram), e.deleteProgram(this.arrowPickProgram);
  }
}
class oo {
  constructor(e = 2048, t = 48, n = "sans-serif") {
    p(this, "canvas");
    p(this, "ctx");
    p(this, "texture", null);
    p(this, "entries", /* @__PURE__ */ new Map());
    p(this, "buf");
    p(this, "slotSize");
    p(this, "cursorX", 2);
    p(this, "cursorY", 2);
    p(this, "rowHeight", 0);
    p(this, "fontSize");
    p(this, "fontFamily");
    p(this, "dirty", !0);
    p(this, "charCanvas");
    p(this, "charCtx");
    this.canvas = document.createElement("canvas"), this.canvas.width = e, this.canvas.height = e, this.ctx = this.canvas.getContext("2d"), this.fontSize = t, this.fontFamily = n, this.buf = Math.max(2, Math.ceil(t / 8)), this.slotSize = t + 2 * this.buf, this.charCanvas = document.createElement("canvas"), this.charCanvas.width = this.slotSize, this.charCanvas.height = this.slotSize, this.charCtx = this.charCanvas.getContext("2d"), this.charCtx.textBaseline = "middle", this.charCtx.textAlign = "center", this.charCtx.font = `${t}px ${n}`;
  }
  getTexture(e) {
    return this.texture || (this.texture = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this.texture), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE)), this.dirty && this.upload(e), this.texture;
  }
  getOrCreate(e) {
    if (!e) return null;
    const t = this.entries.get(e);
    if (t) return t;
    const n = this.slotSize;
    if (this.cursorX + n > this.canvas.width && (this.cursorX = 2, this.cursorY += this.rowHeight + 2, this.rowHeight = 0), this.cursorY + n > this.canvas.height)
      return console.warn("[TextureAtlas] overflow:", e), null;
    this.charCtx.clearRect(0, 0, n, n), this.charCtx.fillStyle = "#ffffff", this.charCtx.fillText(e, n / 2, n / 2), this.ctx.drawImage(this.charCanvas, this.cursorX, this.cursorY);
    const s = this.charCtx.measureText(e), r = this.canvas.width, o = this.canvas.height, l = {
      uv: [
        this.cursorX / r,
        this.cursorY / o,
        (this.cursorX + n) / r,
        (this.cursorY + n) / o
      ],
      pw: this.fontSize,
      ph: this.fontSize,
      advance: s.width
    };
    return this.entries.set(e, l), this.cursorX += n + 1, this.rowHeight = Math.max(this.rowHeight, n), this.dirty = !0, l;
  }
  upload(e) {
    e.bindTexture(e.TEXTURE_2D, this.texture), e.texImage2D(
      e.TEXTURE_2D,
      0,
      e.RGBA,
      e.RGBA,
      e.UNSIGNED_BYTE,
      this.canvas
    ), this.dirty = !1;
  }
  clear() {
    this.entries.clear(), this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.cursorX = 2, this.cursorY = 2, this.rowHeight = 0, this.dirty = !0;
  }
  get size() {
    return this.entries.size;
  }
}
class ao {
  constructor(e, t = 2048, n = 48, s = 0) {
    p(this, "gl");
    p(this, "program");
    p(this, "atlas");
    p(this, "quadVao", null);
    p(this, "fontSize");
    /** 字符间距（世界像素），按图集字号计算 */
    p(this, "letterSpacing");
    p(this, "uResolution", null);
    p(this, "uTranslation", null);
    p(this, "uScale", null);
    p(this, "uZOffset", null);
    p(this, "uTexture", null);
    this.gl = e, this.fontSize = n, this.letterSpacing = Math.round(n * s), this.atlas = new oo(t, n), this.program = this.compile(lr, cr), this.initGeometry(), this.cacheUniforms();
  }
  compile(e, t) {
    const n = this.gl, s = this.makeShader(n.VERTEX_SHADER, e), r = this.makeShader(n.FRAGMENT_SHADER, t), o = n.createProgram();
    return n.attachShader(o, s), n.attachShader(o, r), n.linkProgram(o), o;
  }
  makeShader(e, t) {
    const n = this.gl, s = n.createShader(e);
    return n.shaderSource(s, t), n.compileShader(s), s;
  }
  cacheUniforms() {
    const e = this.gl;
    this.uResolution = e.getUniformLocation(this.program, "u_resolution"), this.uTranslation = e.getUniformLocation(this.program, "u_translation"), this.uScale = e.getUniformLocation(this.program, "u_scale"), this.uZOffset = e.getUniformLocation(this.program, "u_zOffset"), this.uTexture = e.getUniformLocation(this.program, "u_texture");
  }
  initGeometry() {
    const e = this.gl, t = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), n = e.createVertexArray();
    e.bindVertexArray(n);
    const s = e.createBuffer();
    e.bindBuffer(e.ARRAY_BUFFER, s), e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW), e.enableVertexAttribArray(0), e.vertexAttribPointer(0, 2, e.FLOAT, !1, 0, 0), e.bindVertexArray(null), this.quadVao = n;
  }
  /** 将节点标签展开为逐字符 quads */
  buildNodeLabels(e, t, n) {
    const s = [];
    if (t < n) return s;
    for (const r of e) {
      if (!r.label) continue;
      const o = r.textColor ?? [1, 1, 1, 1], l = (r.fontSize ?? this.fontSize) / this.fontSize, d = t;
      let a = r.x - this.measureWidth(r.label, l) / (2 * d);
      const g = r.radius * t, y = Math.min(Math.max(g * 0.22, 4), 24) + 8, u = r.y + r.radius + y / t;
      for (const f of r.label) {
        const m = this.atlas.getOrCreate(f);
        m && (s.push({
          x: a + m.advance * l / (2 * d),
          y: u,
          char: f,
          color: o,
          scale: l
        }), a += (m.advance + this.letterSpacing) * l / d);
      }
    }
    return s;
  }
  /** 估算标签世界宽度（乘以 fontSize 缩放 + 间距） */
  measureWidth(e, t) {
    let n = 0;
    for (const s of e) {
      const r = this.atlas.getOrCreate(s);
      r && (n += (r.advance + this.letterSpacing) * t);
    }
    return n;
  }
  buildLinkLabels(e, t, n) {
    const s = [];
    if (t < n) return s;
    for (const r of e) {
      if (!r.label) continue;
      const o = [0.55, 0.55, 0.65, 0.85], l = r.targetX - r.sourceX, d = r.targetY - r.sourceY;
      if (Math.sqrt(l * l + d * d) < 1) continue;
      const g = Math.atan2(d, l), y = 0.375, u = r.label, f = t, m = this.measureWidth(u, y), x = (r.sourceX + r.targetX) / 2, h = (r.sourceY + r.targetY) / 2, v = m / (2 * f);
      let k = x - v * Math.cos(g), C = h - v * Math.sin(g);
      for (const T of u) {
        const A = this.atlas.getOrCreate(T);
        if (!A) continue;
        const N = (A.advance + this.letterSpacing) * y / f;
        s.push({
          x: k + N / 2 * Math.cos(g),
          y: C + N / 2 * Math.sin(g),
          char: T,
          color: o,
          scale: y,
          angle: g
        }), k += N * Math.cos(g), C += N * Math.sin(g);
      }
    }
    return s;
  }
  /** instanced 逐字符渲染 */
  render(e, t, n, s, r, o, l = 0) {
    const d = e.length;
    if (d === 0) return;
    const a = this.gl, g = this.atlas.getTexture(a);
    a.useProgram(this.program), a.uniform2f(this.uResolution, t, n), a.uniform2f(this.uTranslation, s, r), a.uniform1f(this.uScale, o), a.uniform1f(this.uZOffset, l), a.uniform1i(this.uTexture, 0), a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, g), a.bindVertexArray(this.quadVao);
    const y = new Float32Array(d * 2), u = new Float32Array(d * 2), f = new Float32Array(d * 4), m = new Float32Array(d * 2), x = new Float32Array(d * 2), h = new Float32Array(d);
    for (let v = 0; v < d; v++) {
      const k = e[v], C = this.atlas.getOrCreate(k.char);
      C && (y[v * 2] = k.x, y[v * 2 + 1] = k.y, u[v * 2] = C.pw * k.scale / o, u[v * 2 + 1] = C.ph * k.scale / o, f.set(k.color, v * 4), m[v * 2] = C.uv[0], m[v * 2 + 1] = C.uv[1], x[v * 2] = C.uv[2] - C.uv[0], x[v * 2 + 1] = C.uv[3] - C.uv[1], h[v] = k.angle ?? 0);
    }
    this.instancedAttrib(1, y, 2), this.instancedAttrib(2, u, 2), this.instancedAttrib(3, f, 4), this.instancedAttrib(4, m, 2), this.instancedAttrib(5, x, 2), this.instancedAttrib(6, h, 1), a.drawArraysInstanced(a.TRIANGLES, 0, 6, d);
    for (let v = 1; v <= 6; v++) a.vertexAttribDivisor(v, 0);
    a.bindVertexArray(null);
  }
  instancedAttrib(e, t, n) {
    const s = this.gl, r = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, r), s.bufferData(s.ARRAY_BUFFER, t, s.DYNAMIC_DRAW), s.enableVertexAttribArray(e), s.vertexAttribPointer(e, n, s.FLOAT, !1, 0, 0), s.vertexAttribDivisor(e, 1);
  }
  /** 预注册所有字符到图集（逐字符拆分） */
  preRegister(e) {
    const t = /* @__PURE__ */ new Set();
    for (const n of e)
      for (const s of n) t.add(s);
    for (const n of t) this.atlas.getOrCreate(n);
  }
  destroy() {
    this.gl.deleteProgram(this.program);
  }
}
function lo(i, e, t) {
  return Math.round(i * 255) << 16 | Math.round(e * 255) << 8 | Math.round(t * 255);
}
class co {
  constructor(e) {
    p(this, "gl");
    p(this, "nodeRenderer");
    p(this, "linkRenderer");
    p(this, "pickFbo", null);
    p(this, "pickTexture", null);
    p(this, "pickDepth", null);
    p(this, "pickerWidth", 0);
    p(this, "pickerHeight", 0);
    p(this, "nodes", []);
    p(this, "links", []);
    /** 节点索引 → 节点 ID（解码用） */
    p(this, "nodeIds", []);
    /** 边的起始索引（nodeIds.length） */
    p(this, "linkOffset", 0);
    p(this, "linkIds", []);
    // 相机变换（需与主渲染同步）
    p(this, "tx", 0);
    p(this, "ty", 0);
    p(this, "k", 1);
    this.gl = e.gl, this.nodeRenderer = e.nodeRenderer, this.linkRenderer = e.linkRenderer, this.initFBO(e.width, e.height);
  }
  // ========== FBO 管理 ==========
  initFBO(e, t) {
    const n = this.gl, s = window.devicePixelRatio || 1;
    this.pickerWidth = e * s, this.pickerHeight = t * s, this.pickFbo = n.createFramebuffer(), this.pickTexture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.pickTexture), n.texImage2D(
      n.TEXTURE_2D,
      0,
      n.RGBA,
      this.pickerWidth,
      this.pickerHeight,
      0,
      n.RGBA,
      n.UNSIGNED_BYTE,
      null
    ), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST), this.pickDepth = n.createRenderbuffer(), n.bindRenderbuffer(n.RENDERBUFFER, this.pickDepth), n.renderbufferStorage(
      n.RENDERBUFFER,
      n.DEPTH_COMPONENT16,
      this.pickerWidth,
      this.pickerHeight
    );
  }
  resize(e, t) {
    const n = this.gl, s = window.devicePixelRatio || 1, r = e * s, o = t * s;
    r === this.pickerWidth && o === this.pickerHeight || (this.pickerWidth = r, this.pickerHeight = o, this.pickTexture && n.deleteTexture(this.pickTexture), this.pickTexture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.pickTexture), n.texImage2D(
      n.TEXTURE_2D,
      0,
      n.RGBA,
      r,
      o,
      0,
      n.RGBA,
      n.UNSIGNED_BYTE,
      null
    ), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST), this.pickDepth && n.deleteRenderbuffer(this.pickDepth), this.pickDepth = n.createRenderbuffer(), n.bindRenderbuffer(n.RENDERBUFFER, this.pickDepth), n.renderbufferStorage(n.RENDERBUFFER, n.DEPTH_COMPONENT16, r, o));
  }
  // ========== 数据同步 ==========
  syncData(e, t) {
    this.nodes = e, this.links = t, this.nodeIds = e.map((n) => n.id), this.linkIds = t.map((n) => n.id), this.linkOffset = e.length;
  }
  // ========== 拾取 ==========
  pick(e, t) {
    const n = this.gl, s = window.devicePixelRatio || 1, r = this.pickerWidth, o = this.pickerHeight;
    n.bindFramebuffer(n.FRAMEBUFFER, this.pickFbo), n.framebufferTexture2D(
      n.FRAMEBUFFER,
      n.COLOR_ATTACHMENT0,
      n.TEXTURE_2D,
      this.pickTexture,
      0
    ), n.framebufferRenderbuffer(
      n.FRAMEBUFFER,
      n.DEPTH_ATTACHMENT,
      n.RENDERBUFFER,
      this.pickDepth
    ), n.viewport(0, 0, r, o), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT), n.enable(n.DEPTH_TEST), n.depthFunc(n.LEQUAL), this.linkRenderer && this.linkRenderer.renderPicking(
      this.links,
      r / s,
      o / s,
      this.tx,
      this.ty,
      this.k,
      this.linkOffset,
      0
      // zOffset = 0
    ), this.nodeRenderer.renderPicking(
      this.nodes,
      r / s,
      o / s,
      this.tx,
      this.ty,
      this.k,
      -0.5
    );
    const l = Math.round(e * s), d = Math.round(o - t * s), a = new Uint8Array(4);
    if (n.readPixels(l, d, 1, 1, n.RGBA, n.UNSIGNED_BYTE, a), n.bindFramebuffer(n.FRAMEBUFFER, null), a[3] === 0) return null;
    const g = lo(
      a[0] / 255,
      a[1] / 255,
      a[2] / 255
    );
    if (g >= 0 && g < this.linkOffset)
      return { type: "node", id: this.nodeIds[g] };
    const y = g - this.linkOffset;
    return y >= 0 && y < this.linkIds.length ? { type: "link", id: this.linkIds[y] } : null;
  }
  destroy() {
    const e = this.gl;
    e.deleteFramebuffer(this.pickFbo), e.deleteTexture(this.pickTexture), e.deleteRenderbuffer(this.pickDepth);
  }
}
function ho(i, e, t, n, s) {
  return Math.sqrt(i * i + e * e) - t;
}
class uo {
  constructor() {
    /** 相机变换（由 WebGLRenderer 每帧同步） */
    p(this, "tx", 0);
    p(this, "ty", 0);
    p(this, "k", 1);
    p(this, "nodes", []);
    p(this, "links", []);
  }
  /** 数据同步 */
  syncData(e, t) {
    this.nodes = e, this.links = t;
  }
  /** 调整尺寸（CPU 版无需操作，仅为满足接口一致） */
  resize(e, t) {
  }
  /** 销毁（CPU 版无需操作，仅为满足接口一致） */
  destroy() {
    this.nodes = [], this.links = [];
  }
  /** 命中检测 */
  pick(e, t) {
    if (this.nodes.length === 0 && this.links.length === 0) return null;
    const n = e / this.k - this.tx, s = t / this.k - this.ty;
    for (let r = this.nodes.length - 1; r >= 0; r--) {
      const o = this.nodes[r], l = n - o.x, d = s - o.y;
      if (ut(o.shape), o.shapeParam, ho(l, d, o.radius + o.strokeWidth) <= 2)
        return { type: "node", id: o.id };
    }
    for (let r = this.links.length - 1; r >= 0; r--) {
      const o = this.links[r], l = o.sourceX, d = o.sourceY, a = o.targetX, g = o.targetY, y = a - l, u = g - d, f = y * y + u * u;
      if (f < 1e-4) continue;
      let m = ((n - l) * y + (s - d) * u) / f;
      m = Math.max(0, Math.min(1, m));
      const x = l + m * y, h = d + m * u;
      if (Math.sqrt((n - x) ** 2 + (s - h) ** 2) <= (o.width + 4) / this.k)
        return { type: "link", id: o.id };
    }
    return null;
  }
}
class go {
  constructor(e) {
    p(this, "name", "default");
    p(this, "gl");
    p(this, "nodeRenderer");
    p(this, "linkRenderer");
    p(this, "labelRenderer");
    p(this, "iconAtlas", new so());
    p(this, "picker");
    p(this, "plusBadgeLayer");
    // 缓存
    p(this, "nodes", []);
    p(this, "links", []);
    p(this, "labels", []);
    this.gl = e.gl, this.nodeRenderer = new io(e.gl), this.linkRenderer = new ro(e.gl), this.labelRenderer = new ao(
      e.gl,
      2048,
      e.labelFontSize
    ), (e.pickerMode ?? "gpu") === "cpu" ? this.picker = new uo() : this.picker = new co({
      gl: e.gl,
      nodeRenderer: this.nodeRenderer,
      linkRenderer: this.linkRenderer,
      width: e.width,
      height: e.height
    }), this.plusBadgeLayer = new fr({
      canvas: e.canvas,
      gl: e.gl,
      onPlusClick: e.onPlusClick,
      borderWidth: e.plusBadgeBorderWidth,
      borderColor: e.plusBadgeBorderColor
    });
  }
  // ═══════════════════════════════════════════════
  // RenderPlugin
  // ═══════════════════════════════════════════════
  render(e) {
    this.linkRenderer.render(
      e.links,
      e.width,
      e.height,
      e.tx,
      e.ty,
      e.scale,
      e.showArrows,
      0
    ), this.nodeRenderer.render(
      e.nodes,
      e.width,
      e.height,
      e.tx,
      e.ty,
      e.scale,
      -0.5,
      this.iconAtlas
    ), this.labels = this.labelRenderer.buildNodeLabels(
      e.nodes,
      e.scale,
      e.labelMinScale
    ), this.labelRenderer.render(
      this.labels,
      e.width,
      e.height,
      e.tx,
      e.ty,
      e.scale,
      -1
    );
    const t = this.labelRenderer.buildLinkLabels(
      e.links,
      e.scale,
      e.labelMinScale
    );
    this.labelRenderer.render(
      t,
      e.width,
      e.height,
      e.tx,
      e.ty,
      e.scale,
      -0.8
    );
  }
  getOverlays() {
    return [this.plusBadgeLayer];
  }
  afterPositionUpdate(e) {
    this.updateBadges(e);
  }
  resolveNodeState(e, t) {
    return t.getHiddenNodes().includes(e) ? "hidden" : t.isHoveredNode(e) ? "hovered" : t.getSelectedNodes().includes(e) ? "selected" : t.getRootNodes().includes(e) ? "root" : t.getHighlightNodes().includes(e) ? "highlighted" : "regular";
  }
  resolveLinkState(e, t) {
    return t.getHiddenLinks().includes(e) ? "hidden" : t.isHoveredLink(e) ? "hovered" : t.getSelectedLinks().includes(e) ? "selected" : "regular";
  }
  getDefaultStyle() {
    return {
      background: "#f7f7f7",
      node: {},
      link: {}
    };
  }
  // ═══════════════════════════════════════════════
  // Picker
  // ═══════════════════════════════════════════════
  get tx() {
    return this.picker.tx;
  }
  set tx(e) {
    this.picker.tx = e;
  }
  get ty() {
    return this.picker.ty;
  }
  set ty(e) {
    this.picker.ty = e;
  }
  get k() {
    return this.picker.k;
  }
  set k(e) {
    this.picker.k = e;
  }
  syncData(e, t) {
    this.nodes = e, this.links = t, this.picker.syncData(e, t), this.updateBadges(e);
    const n = e.map((s) => s.label).filter(Boolean);
    n.push(...t.map((s) => s.label).filter(Boolean)), this.labelRenderer.preRegister(n);
  }
  pick(e, t) {
    return this.picker.pick(e, t);
  }
  resize(e, t) {
    this.picker.resize(e, t);
  }
  destroy() {
    this.nodeRenderer.destroy(), this.linkRenderer.destroy(), this.labelRenderer.destroy(), this.picker.destroy(), this.plusBadgeLayer.destroy();
  }
  // ═══════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════
  updateBadges(e) {
    const t = [];
    for (const n of e) {
      if (!n.showPlus) continue;
      const s = n.radius * (n.plusOffsetX ?? 0.5), r = n.radius * (n.plusOffsetY ?? -0.5);
      t.push({
        x: n.x + s,
        y: n.y + r,
        radius: n.radius * (n.plusScale ?? 0.35),
        nodeId: n.id
      });
    }
    this.plusBadgeLayer.updateBadges(t);
  }
}
class fo {
  constructor(e) {
    p(this, "nodes", []);
    p(this, "links", []);
    p(this, "rootId");
    p(this, "levelGap");
    p(this, "siblingGap");
    p(this, "maxDepth");
    p(this, "onTick");
    p(this, "onEnd");
    this.rootId = e == null ? void 0 : e.rootId, this.levelGap = (e == null ? void 0 : e.levelGap) ?? 180, this.siblingGap = (e == null ? void 0 : e.siblingGap) ?? 70, this.maxDepth = (e == null ? void 0 : e.maxDepth) ?? 6;
  }
  setData(e, t) {
    this.nodes = e, this.links = t;
  }
  start() {
    this.compute();
  }
  /** 算法布局：同步计算并派发 onTick/onEnd */
  settle() {
    this.compute();
  }
  stop() {
  }
  reheat() {
  }
  fixNode() {
  }
  releaseNode() {
  }
  destroy() {
    this.nodes = [], this.links = [];
  }
  compute() {
    var d, a, g;
    const e = /* @__PURE__ */ new Map();
    for (const y of this.nodes) e.set(y.id, y);
    const t = /* @__PURE__ */ new Map(), n = (y) => {
      let u = t.get(y);
      return u || (u = /* @__PURE__ */ new Set(), t.set(y, u)), u;
    };
    for (const y of this.links) {
      const u = String(typeof y.source == "object" ? y.source.id : y.source), f = String(typeof y.target == "object" ? y.target.id : y.target);
      n(u).add(f), n(f).add(u);
    }
    const s = this.rootId && e.has(this.rootId) ? this.rootId : (d = this.nodes[0]) == null ? void 0 : d.id, r = [], o = /* @__PURE__ */ new Set();
    if (s !== void 0 && e.has(s)) {
      let y = [s], u = 0;
      for (o.add(s), r[0] = [s]; y.length > 0 && u < this.maxDepth; ) {
        const f = [];
        for (const m of y)
          for (const x of t.get(m) ?? [])
            o.has(x) || (o.add(x), r[u + 1] || (r[u + 1] = []), r[u + 1].push(x), f.push(x));
        y = f, u += 1;
      }
    }
    const l = this.nodes.filter((y) => !o.has(y.id)).map((y) => y.id);
    if (l.length > 0) {
      const y = r.length;
      r[y] = l;
      for (const u of l) o.add(u);
    }
    for (let y = 0; y < r.length; y++) {
      const u = r[y], f = u.length;
      for (let m = 0; m < f; m++) {
        const x = e.get(u[m]);
        x && (x.x = (m - (f - 1) / 2) * this.siblingGap, x.y = y * this.levelGap, x.vx = 0, x.vy = 0);
      }
    }
    (a = this.onTick) == null || a.call(this, this.nodes), (g = this.onEnd) == null || g.call(this);
  }
}
function Wt(i, e, t) {
  const n = new Blob([e], { type: t }), s = URL.createObjectURL(n), r = document.createElement("a");
  r.href = s, r.download = i, r.click(), URL.revokeObjectURL(s);
}
function po(i, e, t) {
  const n = i.getGraphModelData().graphData, s = n.nodes.filter((g) => e.has(g.id)), r = new Set(s.map((g) => g.id)), o = n.links.filter((g) => {
    const y = String(typeof g.source == "object" ? g.source.id : g.source), u = String(typeof g.target == "object" ? g.target.id : g.target);
    return r.has(y) && r.has(u);
  });
  if (t === "json") {
    Wt(
      "selection.json",
      JSON.stringify({ nodes: s, links: o }, null, 2),
      "application/json"
    );
    return;
  }
  const l = [
    "id",
    "label",
    "nodeType",
    "clusterId",
    "gender",
    "age",
    "caseWeight"
  ], d = (g) => `"${String(g ?? "").replace(/"/g, '""')}"`, a = s.map((g) => {
    const y = g.data ?? {};
    return [
      g.id,
      y.label,
      y.nodeType,
      y.clusterId,
      y.gender,
      y.age,
      y.caseWeight
    ].map(d).join(",");
  });
  Wt("selection.csv", [l.join(","), ...a].join(`
`), "text/csv");
}
function yo(i, e = 300) {
  const t = K(), n = K(i);
  return n.current = i, te(() => () => {
    t.current && clearTimeout(t.current);
  }, []), z(
    (...s) => {
      t.current && clearTimeout(t.current), t.current = setTimeout(() => n.current(...s), e);
    },
    [e]
  );
}
const vo = {
  padding: "4px 8px",
  fontSize: "13px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  outline: "none",
  width: 180,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, xo = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  boxShadow: "var(--shadow)",
  maxHeight: 240,
  overflowY: "auto",
  zIndex: 100
}, mo = {
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "rgb(var(--foreground))",
  borderBottom: "1px solid rgb(var(--border))"
}, bo = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function ko({ onSelect: i }) {
  const [e, t] = U(""), [n, s] = U(!1), [r, o] = U(-1), l = K(null), d = K(null), { data: a, run: g, reset: y } = rn(), u = yo((h) => {
    const v = h.trim();
    if (!v) {
      y(), s(!1), o(-1);
      return;
    }
    g(async (k) => (await Fe.search(v, 10, k)).nodes ?? []).then((k) => {
      s(!!(k != null && k.length)), o(k != null && k.length ? 0 : -1);
    });
  }, 300), f = (h) => {
    t(h), u(h);
  }, m = (h) => {
    const v = a ?? [];
    h.key === "ArrowDown" ? (h.preventDefault(), n && v.length > 0 && o((k) => (k + 1) % v.length)) : h.key === "ArrowUp" ? (h.preventDefault(), n && v.length > 0 && o((k) => k <= 0 ? v.length - 1 : k - 1)) : h.key === "Enter" ? (h.preventDefault(), n && v.length > 0 && r >= 0 && x(v[r].id)) : h.key === "Escape" && s(!1);
  };
  te(() => {
    const h = (v) => {
      l.current && !l.current.contains(v.target) && s(!1);
    };
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, []), te(() => {
    const h = d.current;
    if (!h || r < 0) return;
    const v = h.children[r];
    v == null || v.scrollIntoView({ block: "nearest" });
  }, [r]);
  const x = (h) => {
    t(""), y(), s(!1), o(-1), i(h);
  };
  return /* @__PURE__ */ c.jsxs("div", { ref: l, style: { position: "relative" }, children: [
    /* @__PURE__ */ c.jsx(
      "input",
      {
        placeholder: "搜索节点...",
        value: e,
        onChange: (h) => f(h.target.value),
        onKeyDown: m,
        onFocus: () => ((a == null ? void 0 : a.length) ?? 0) > 0 && s(!0),
        style: vo
      }
    ),
    n && a && a.length > 0 && /* @__PURE__ */ c.jsx("div", { ref: d, style: xo, children: a.map((h, v) => {
      var k, C, T;
      return /* @__PURE__ */ c.jsxs(
        "div",
        {
          style: {
            ...mo,
            background: v === r ? "rgb(var(--hover))" : "transparent"
          },
          onClick: () => x(h.id),
          onMouseEnter: () => o(v),
          children: [
            /* @__PURE__ */ c.jsx("span", { style: { color: "#1976d2", fontWeight: "bold" }, children: ((k = h.data) == null ? void 0 : k.label) ?? h.id }),
            /* @__PURE__ */ c.jsx("span", { style: { color: "rgb(var(--muted))", marginLeft: 6 }, children: bo[((C = h.data) == null ? void 0 : C.nodeType) ?? ""] ?? ((T = h.data) == null ? void 0 : T.nodeType) })
          ]
        },
        h.id
      );
    }) })
  ] });
}
const _o = {
  position: "absolute",
  top: 8,
  left: 8,
  right: 8,
  padding: "5px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
  background: "linear-gradient(135deg, rgb(var(--background) / 0.55), rgb(var(--background) / 0.3))",
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",
  borderRadius: 12,
  boxShadow: "0 8px 32px rgb(0 0 0 / 0.18)",
  color: "rgb(var(--foreground))"
}, ie = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 4px",
  fontSize: "13px",
  fontFamily: "monospace",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
};
function So({
  historyManagerRef: i,
  onBack: e,
  onFitView: t,
  onToggleSnapshotPanel: n,
  onToggleLegend: s,
  onToggleMiniMap: r,
  onUndo: o,
  onRedo: l,
  onSearchSelect: d,
  onAnalyze: a,
  timePanelOpen: g,
  filterPanelOpen: y,
  tablePanelOpen: u,
  onToggleTimePanel: f,
  onToggleFilterPanel: m,
  onToggleTablePanel: x,
  onExportJSON: h,
  onExportCSV: v,
  treeMode: k,
  onToggleTreeLayout: C
}) {
  var M, X;
  const { zIndex: T } = qt({ id: "toolbar", layer: de.Toolbar }), {
    snapshotPanelOpen: A,
    legendPanelOpen: N,
    miniMapOpen: b,
    analysisPanelOpen: _,
    selectedNodeIds: S,
    selectionMode: P,
    // 当前选取模式
    selectedSelectionMode: E,
    // 当前候选的框选类型
    activateRectMode: H,
    activatePolygonMode: F,
    deactivateSelectionMode: B
  } = pe(), j = ((M = i.current) == null ? void 0 : M.canGoBackSkipType("snapshot")) ?? !1, R = ((X = i.current) == null ? void 0 : X.canGoForwardSkipType("snapshot")) ?? !1, { theme: w, toggle: D } = qe();
  return /* @__PURE__ */ c.jsxs("div", { style: { ..._o, zIndex: T }, children: [
    /* @__PURE__ */ c.jsx("button", { onClick: e, style: ie, title: "返回", children: /* @__PURE__ */ c.jsx(Ln, { size: 14 }) }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: o,
        style: ie,
        title: "回退",
        disabled: !j,
        children: /* @__PURE__ */ c.jsx(_s, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: l,
        style: ie,
        title: "恢复",
        disabled: !R,
        children: /* @__PURE__ */ c.jsx(ls, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx("button", { onClick: t, style: ie, title: "Fit View", children: /* @__PURE__ */ c.jsx(Kn, { size: 14 }) }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: n,
        style: {
          ...ie,
          background: A ? "rgba(233,69,96,0.25)" : "transparent",
          border: A ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "快照管理",
        children: /* @__PURE__ */ c.jsx(Bn, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: s,
        style: {
          ...ie,
          background: N ? "rgba(233,69,96,0.25)" : "transparent",
          border: N ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "图例",
        children: /* @__PURE__ */ c.jsx(jn, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: r,
        style: {
          ...ie,
          background: b ? "rgba(233,69,96,0.25)" : "transparent",
          border: b ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "小地图",
        children: /* @__PURE__ */ c.jsx($n, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx("span", { style: { fontSize: "11px", color: "#999", margin: "0 2px" }, children: "|" }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: f,
        style: {
          ...ie,
          background: g ? "rgba(233,69,96,0.25)" : "transparent",
          border: g ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "时间线回放",
        children: /* @__PURE__ */ c.jsx(Jt, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: m,
        style: {
          ...ie,
          background: y ? "rgba(233,69,96,0.25)" : "transparent",
          border: y ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "属性过滤",
        children: /* @__PURE__ */ c.jsx(Vn, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: x,
        style: {
          ...ie,
          background: u ? "rgba(233,69,96,0.25)" : "transparent",
          border: u ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "表格视图",
        children: /* @__PURE__ */ c.jsx(en, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx("span", { style: { fontSize: "11px", color: "#999", margin: "0 2px" }, children: "|" }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: B,
        style: {
          ...ie,
          background: P ? "transparent" : "#0066ff50",
          border: P ? "1px solid #ccc" : "1px solid #0066ff"
        },
        title: "默认模式",
        children: /* @__PURE__ */ c.jsx(es, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: H,
        style: {
          ...ie,
          background: E === "rect" ? "rgba(230,126,0,0.15)" : "transparent",
          border: E === "rect" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "矩形框选 (默认，按下 Shift 激活)",
        children: /* @__PURE__ */ c.jsx(vs, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: F,
        style: {
          ...ie,
          background: E === "polygon" ? "rgba(230,126,0,0.15)" : "transparent",
          border: E === "polygon" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "多边形框选 (按下 Shift 激活)",
        children: /* @__PURE__ */ c.jsx(is, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: a,
        disabled: S.size === 0,
        style: {
          ...ie,
          background: _ ? "rgba(233,69,96,0.25)" : "transparent",
          border: _ ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "分析",
        children: /* @__PURE__ */ c.jsx(Zt, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "button",
      {
        onClick: h,
        disabled: S.size === 0,
        style: ie,
        title: "导出选中子图 JSON",
        children: [
          /* @__PURE__ */ c.jsx(Tt, { size: 13 }),
          /* @__PURE__ */ c.jsx("span", { style: { fontSize: "10px" }, children: "JSON" })
        ]
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "button",
      {
        onClick: v,
        disabled: S.size === 0,
        style: ie,
        title: "导出选中节点 CSV",
        children: [
          /* @__PURE__ */ c.jsx(Tt, { size: 13 }),
          /* @__PURE__ */ c.jsx("span", { style: { fontSize: "10px" }, children: "CSV" })
        ]
      }
    ),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: C,
        style: {
          ...ie,
          background: k ? "rgba(230,126,0,0.15)" : "transparent",
          border: k ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: k ? "切回力导向布局" : "树形布局（以选中节点为根）",
        children: /* @__PURE__ */ c.jsx(Yn, { size: 14 })
      }
    ),
    /* @__PURE__ */ c.jsx(gs, { size: 14, style: { color: "rgb(var(--muted))" } }),
    /* @__PURE__ */ c.jsx(ko, { onSelect: d }),
    /* @__PURE__ */ c.jsx(
      "button",
      {
        onClick: D,
        style: ie,
        title: w === "dark" ? "切换到亮色主题" : "切换到暗色主题",
        children: w === "dark" ? /* @__PURE__ */ c.jsx(ms, { size: 14 }) : /* @__PURE__ */ c.jsx(Jn, { size: 14 })
      }
    )
  ] });
}
const wo = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 100
};
function To() {
  const {
    selectionMode: i,
    rect: e,
    polygon: t,
    isShiftDown: n,
    isNearFirstVertex: s,
    getCanvasPos: r,
    startRect: o,
    updateRect: l,
    finishRect: d,
    addPolygonVertex: a,
    updatePolygonCursor: g,
    finishPolygon: y
  } = pe(), u = K(null), f = K(!1), m = K(!1), x = n && i !== null, h = z(
    (S) => {
      const { x: P, y: E } = r(S.clientX, S.clientY);
      if (i === "rect") {
        f.current = !0, o(P, E), S.preventDefault(), S.stopPropagation();
        return;
      }
      if (i === "polygon") {
        if (t && t.vertices.length >= 2 && s(P, E)) {
          m.current = !0, y(), S.preventDefault(), S.stopPropagation();
          return;
        }
        a(P, E), S.preventDefault(), S.stopPropagation();
        return;
      }
    },
    [
      r,
      i,
      o,
      t,
      s,
      y,
      a
    ]
  ), v = z(
    (S) => {
      const { x: P, y: E } = r(S.clientX, S.clientY);
      if (i === "rect" && f.current) {
        l(P, E), S.preventDefault(), S.stopPropagation();
        return;
      }
      if (i === "polygon") {
        g(P, E), S.preventDefault(), S.stopPropagation();
        return;
      }
    },
    [r, i, l, g]
  ), k = z(
    (S) => {
      if (m.current) {
        m.current = !1, S.preventDefault(), S.stopPropagation();
        return;
      }
      if (f.current) {
        f.current = !1, d(), S.preventDefault(), S.stopPropagation();
        return;
      }
    },
    [d]
  ), C = z(
    (S) => {
      i === "polygon" && t && t.vertices.length >= 2 && (y(), S.preventDefault(), S.stopPropagation());
    },
    [i, t, y]
  ), T = e ? Math.abs(e.x2 - e.x1) : 0, A = e ? Math.abs(e.y2 - e.y1) : 0, N = e ? Math.min(e.x1, e.x2) : 0, b = e ? Math.min(e.y1, e.y2) : 0, _ = t && t.vertices.length > 0 ? t.vertices.map((S) => `${S.x},${S.y}`).join(" ") : "";
  return /* @__PURE__ */ c.jsx(
    "div",
    {
      ref: u,
      style: {
        ...wo,
        pointerEvents: x ? "auto" : "none"
      },
      onPointerDown: h,
      onPointerMove: v,
      onPointerUp: k,
      onDoubleClick: C,
      children: /* @__PURE__ */ c.jsxs(
        "svg",
        {
          width: "100%",
          height: "100%",
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none"
          },
          children: [
            e && /* @__PURE__ */ c.jsx(c.Fragment, { children: /* @__PURE__ */ c.jsx(
              "rect",
              {
                x: N,
                y: b,
                width: T,
                height: A,
                fill: "rgba(0, 102, 255, 0.08)",
                stroke: "#0066ff",
                strokeWidth: 1.5,
                strokeDasharray: "6 3"
              }
            ) }),
            t && t.vertices.length > 0 && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
              t.vertices.length >= 3 && /* @__PURE__ */ c.jsx(
                "polygon",
                {
                  points: _,
                  fill: "rgba(0, 102, 255, 0.06)",
                  stroke: "none"
                }
              ),
              /* @__PURE__ */ c.jsx(
                "polyline",
                {
                  points: _,
                  fill: "none",
                  stroke: "#0066ff",
                  strokeWidth: 1.5,
                  strokeLinejoin: "round",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ c.jsx(
                "line",
                {
                  x1: t.vertices[t.vertices.length - 1].x,
                  y1: t.vertices[t.vertices.length - 1].y,
                  x2: t.cursorPos.x,
                  y2: t.cursorPos.y,
                  stroke: "#0066ff",
                  strokeWidth: 1,
                  strokeDasharray: "4 3"
                }
              ),
              t.vertices.map((S, P) => /* @__PURE__ */ c.jsx(
                "circle",
                {
                  cx: S.x,
                  cy: S.y,
                  r: 4,
                  fill: P === 0 ? "#0066ff" : "#fff",
                  stroke: "#0066ff",
                  strokeWidth: 1.5
                },
                P
              ))
            ] })
          ]
        }
      )
    }
  );
}
function Ao(i, e, t, n = 350) {
  const s = i.x, r = i.y, o = performance.now(), l = (a) => 1 - Math.pow(1 - a, 3), d = (a) => {
    const g = Math.min(1, (a - o) / n), y = l(g);
    i.x = s + (e - s) * y, i.y = r + (t - r) * y, g < 1 && requestAnimationFrame(d);
  };
  requestAnimationFrame(d);
}
function Po({
  modelRef: i,
  viewRef: e,
  onAnalyze: t
}) {
  const { selectedNodeIds: n } = pe();
  if (n.size === 0) return null;
  const s = () => {
    const o = e.current;
    if (!o) return;
    const l = o.renderer.backend, d = l.nodes.filter((k) => n.has(k.id));
    if (!d.length) return;
    let a = 1 / 0, g = 1 / 0, y = -1 / 0, u = -1 / 0;
    for (const k of d)
      a = Math.min(a, k.x - k.radius), g = Math.min(g, k.y - k.radius), y = Math.max(y, k.x + k.radius), u = Math.max(u, k.y + k.radius);
    const f = l.canvas.clientWidth, m = l.canvas.clientHeight;
    if (f <= 0 || m <= 0) return;
    const x = l.interaction.transform, h = (a + y) / 2, v = (g + u) / 2;
    Ao(x, f / (2 * x.k) - h, m / (2 * x.k) - v, 350);
  }, r = () => {
    const o = i.current;
    o && o.stateManager.setSelectedNodes([]);
  };
  return /* @__PURE__ */ c.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        background: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: 999,
        color: "rgb(var(--foreground))",
        fontFamily: "monospace",
        fontSize: 12,
        boxShadow: "var(--shadow)",
        zIndex: 500
      },
      children: [
        /* @__PURE__ */ c.jsxs("span", { children: [
          "已选 ",
          n.size,
          " 个节点"
        ] }),
        /* @__PURE__ */ c.jsx(
          "span",
          {
            style: { width: 1, height: 16, background: "rgb(var(--background))" }
          }
        ),
        /* @__PURE__ */ c.jsxs("button", { onClick: t, style: st, title: "分析选中（通话圈等）", children: [
          /* @__PURE__ */ c.jsx(Zt, { size: 13 }),
          " 分析"
        ] }),
        /* @__PURE__ */ c.jsxs("button", { onClick: s, style: st, title: "聚焦选中节点", children: [
          /* @__PURE__ */ c.jsx(hs, { size: 13 }),
          " 聚焦"
        ] }),
        /* @__PURE__ */ c.jsx(
          "span",
          {
            style: { width: 1, height: 16, background: "rgb(var(--background))" }
          }
        ),
        /* @__PURE__ */ c.jsx("button", { onClick: r, style: st, title: "关闭（清空选择）", children: /* @__PURE__ */ c.jsx(ws, { size: 13 }) })
      ]
    }
  );
}
const st = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 12,
  fontFamily: "monospace",
  padding: "4px 10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgb(var(--border))",
  borderRadius: 6,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
}, Ht = {
  nodeTypes: /* @__PURE__ */ new Set(),
  gender: null,
  minWeight: null,
  maxWeight: null
};
function Co(i) {
  const [e, t] = U(0), [n, s] = U({
    min: 0,
    max: 0,
    hasTime: !1
  }), [r, o] = U(0), [l, d] = U(!1), [a, g] = U(!1), [y, u] = U(Ht), f = K(0);
  te(() => {
    const b = i.current;
    if (b)
      return b.events.subscribe("dataChange", () => t((_) => _ + 1));
  }, [i]);
  const m = Ve(() => {
    const b = i.current;
    return b ? b.getGraphModelData().graphData : { nodes: [], links: [] };
  }, [i, e]);
  te(() => {
    var S;
    let b = 1 / 0, _ = -1 / 0;
    for (const P of m.links) {
      const E = Date.parse((S = P.data) == null ? void 0 : S.time);
      Number.isNaN(E) || (b = Math.min(b, E), _ = Math.max(_, E));
    }
    Number.isFinite(b) && Number.isFinite(_) && b < _ ? (s({ min: b, max: _, hasTime: !0 }), o(
      (P) => Number.isFinite(P) && P >= b && P <= _ ? P : _
    )) : s((P) => P.hasTime ? { min: 0, max: 0, hasTime: !1 } : P);
  }, [m]);
  const x = Ve(() => {
    var _;
    const b = /* @__PURE__ */ new Map();
    for (const S of m.nodes) {
      const P = ((_ = S.data) == null ? void 0 : _.nodeType) ?? "default";
      b.set(P, (b.get(P) ?? 0) + 1);
    }
    return b;
  }, [m]), h = z(
    (b, _, S) => {
      var R;
      const P = i.current;
      if (!P) return;
      const E = P.getGraphModelData().graphData, H = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new Set();
      if (b !== null && S.hasTime)
        for (const w of E.links) {
          const D = Date.parse((R = w.data) == null ? void 0 : R.time);
          !Number.isNaN(D) && D > b && H.add(w.id);
        }
      if (_.nodeTypes.size > 0 || _.gender !== null || _.minWeight !== null || _.maxWeight !== null) {
        for (const w of E.nodes) {
          const D = w.data ?? {};
          let M = !0;
          _.nodeTypes.size > 0 && !_.nodeTypes.has(D.nodeType ?? "default") && (M = !1), M && _.gender !== null && D.gender !== void 0 && D.gender !== _.gender && (M = !1), M && _.minWeight !== null && D.caseWeight !== void 0 && (D.caseWeight ?? 0) < _.minWeight && (M = !1), M && _.maxWeight !== null && D.caseWeight !== void 0 && (D.caseWeight ?? 0) > _.maxWeight && (M = !1), M || F.add(w.id);
        }
        if (F.size > 0)
          for (const w of E.links) {
            const D = String(
              typeof w.source == "object" ? w.source.id : w.source
            ), M = String(
              typeof w.target == "object" ? w.target.id : w.target
            );
            (F.has(D) || F.has(M)) && H.add(w.id);
          }
      }
      P.stateManager.setHiddenNodes([...F], [...H]);
    },
    [i]
  ), v = z(
    (b) => {
      o(b), l && h(b, y, n);
    },
    [l, y, n, h]
  ), k = z(() => {
    d((b) => {
      const _ = !b;
      return h(_ ? r : null, y, n), _;
    });
  }, [r, y, n, h]);
  te(() => {
    if (!a || !l || !n.hasTime) return;
    const b = (n.max - n.min) / 240;
    let _ = r;
    const S = () => {
      if (_ = Math.min(n.max, _ + b), o(_), h(_, y, n), _ >= n.max) {
        g(!1);
        return;
      }
      f.current = requestAnimationFrame(S);
    };
    return f.current = requestAnimationFrame(S), () => cancelAnimationFrame(f.current);
  }, [a, l, n, y, h, r]);
  const C = z(
    (b, _) => {
      u((S) => {
        const P = new Set(S.nodeTypes);
        _ ? P.add(b) : P.delete(b);
        const E = { ...S, nodeTypes: P };
        return h(l ? r : null, E, n), E;
      });
    },
    [l, r, n, h]
  ), T = z(
    (b) => {
      u((_) => {
        const S = { ..._, ...b };
        return Array.isArray(b.nodeTypes) && (S.nodeTypes = new Set(b.nodeTypes)), h(l ? r : null, S, n), S;
      });
    },
    [l, r, n, h]
  ), A = z(() => {
    g(!1), d(!1), o(n.hasTime ? n.max : 0), u(Ht);
    const b = i.current;
    b && b.stateManager.setHiddenNodes([], []);
  }, [n, i]), N = l || y.nodeTypes.size > 0 || y.gender !== null || y.minWeight !== null || y.maxWeight !== null;
  return {
    timeRange: n,
    timeValue: r,
    timeActive: l,
    playing: a,
    setPlaying: g,
    attrFilter: y,
    typeStats: x,
    onTimeChange: v,
    toggleTime: k,
    toggleNodeType: C,
    updateAttrFilter: T,
    resetFilters: A,
    hasActiveFilter: N
  };
}
function No(i, e = {}) {
  const [t, n] = U(null), [s, r] = U(null), [o, l] = U(/* @__PURE__ */ new Set());
  te(() => {
    const a = i.current;
    if (!a) return;
    const g = a.events.subscribe("nodeHover", (h) => {
      n(h), h && r(null);
    }), y = a.events.subscribe("linkHover", ({ link: h }) => {
      r(h), h && n(null);
    }), u = a.events.subscribe("plusToolClick", (h) => {
      var v;
      h && ((v = e.onPlusToolClick) == null || v.call(e, h));
    }), f = a.events.subscribe("nodeRightClick", (h) => {
      var v;
      h && ((v = e.onNodeContextMenu) == null || v.call(
        e,
        h.node,
        h.screenPos.x,
        h.screenPos.y
      ));
    }), m = a.events.subscribe("nodeClick", ({ node: h, ctrlKey: v }) => {
      h && (console.log("[nodeClick]", h.id), l((k) => {
        const C = new Set(k);
        return v ? C.has(h.id) ? C.delete(h.id) : C.add(h.id) : (C.clear(), C.add(h.id)), C;
      }));
    }), x = a.events.subscribe("selectionChange", ({ nodeIds: h }) => {
      l((v) => {
        const k = new Set(h);
        return v.size === k.size && [...v].every((C) => k.has(C)) ? v : k;
      });
    });
    return () => {
      g(), y(), u(), f(), m(), x();
    };
  }, [i.current]);
  const d = [...o];
  return te(() => {
    const a = i.current;
    a && a.stateManager.setSelectedNodes(d, []);
  }, [i.current, d.join(",")]), {
    ctx: {
      hoveredNode: t,
      setHoveredNode: n,
      hoveredLink: s,
      setHoveredLink: r,
      selectedNodeIds: o,
      setSelectedNodeIds: l
    }
  };
}
function Mo(i, e) {
  const [t, n] = U(null), [s, r] = U(!1), [o, l] = U(null);
  return te(() => {
    const a = (g) => {
      const y = g.target;
      (y === i.current || y.tagName === "CANVAS") && n(null);
    };
    return document.addEventListener("click", a), () => document.removeEventListener("click", a);
  }, []), te(() => {
    const a = (g) => {
      g.key === "Escape" && n(null);
    };
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []), {
    handleRuleExpand: z(
      async (a, g, y) => {
        n(null);
        const u = e.current;
        if (!u) return;
        r(!0);
        const f = (m) => {
          const x = (m == null ? void 0 : m.message) ?? String(m);
          console.error("[ExpandError]", x), l(x), setTimeout(() => l(null), 5e3);
        };
        try {
          y && await u.expand(a, JSON.stringify(y)).catch(f);
        } finally {
          r(!1);
        }
      },
      []
    ),
    ctx: { ruleMenu: t, setRuleMenu: n, expanding: s, runtimeError: o }
  };
}
function Do(i, e, t = "#2c2c2c") {
  return {
    regular: {
      bgColor: i,
      strokeColor: e,
      textColor: t,
      radius: 8,
      strokeWidth: 1,
      opacity: 1,
      fontSize: 16
    },
    hovered: {
      bgColor: i,
      strokeColor: "#00ccff",
      textColor: t,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    highlighted: {
      bgColor: i,
      strokeColor: "#fde047",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    selected: {
      bgColor: i,
      strokeColor: "#0066ff",
      textColor: t,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    hidden: {
      bgColor: i,
      strokeColor: e,
      textColor: t,
      radius: 8,
      strokeWidth: 2,
      opacity: 0.15,
      fontSize: 16
    },
    root: {
      bgColor: "#fff",
      strokeColor: "#e67e00",
      textColor: t,
      radius: 6,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    }
  };
}
function me(i, e, t) {
  var l;
  const n = Pe(t), s = n.node[i] ?? n.node.default, r = Do(s.bg, s.stroke, n.text), o = ((l = e.data) == null ? void 0 : l.weight) ?? 1;
  return {
    ...r,
    regular: { ...r.regular, radius: o * 8 },
    selected: { ...r.selected, radius: o * 8 },
    hovered: { ...r.hovered, radius: o * 8 }
  };
}
function Eo(i, e) {
  return me("default", i, e);
}
function Ro(i, e) {
  return me("person", i, e);
}
function Io(i, e) {
  return me("phone", i, e);
}
function Lo(i, e) {
  return me("address", i, e);
}
function Fo(i, e) {
  return me("account", i, e);
}
function jo(i, e) {
  return me("company", i, e);
}
function zo(i, e) {
  return me("ip", i, e);
}
function Bo(i, e) {
  return me("device", i, e);
}
function Oo(i) {
  const e = Pe(i).link;
  return {
    regular: { color: e.default, strokeWidth: 1.2, opacity: 0.8, arrowSize: 8 },
    hovered: { color: e.hovered, strokeWidth: 2, opacity: 1 },
    highlighted: { color: e.highlighted, strokeWidth: 2, opacity: 1 },
    selected: { color: e.selected, strokeWidth: 2, opacity: 1 },
    hidden: { color: e.hidden, strokeWidth: 0.8, opacity: 0.1 }
  };
}
class Wo {
  constructor(e) {
    p(this, "model");
    p(this, "metadataManager");
    p(this, "loadingManager");
    p(this, "historyManager");
    p(this, "fetcher");
    /** 可选：获取快照额外上下文（相机、状态等） */
    p(this, "getContext");
    this.model = e.model, this.metadataManager = e.metadataManager, this.loadingManager = e.loadingManager, this.historyManager = e.historyManager, this.fetcher = e.fetcher, this.getContext = e.getContext;
  }
  async expand(e, t) {
    var n;
    this.loadingManager.model.startLoading(e, { message: "拓出中..." });
    try {
      const s = this.model.getGraphModelData().graphData, r = await this.fetcher({
        sourceNodeId: e,
        ruleId: "__custom__",
        existingNodeIds: s.nodes.map((d) => d.id),
        existingLinkIds: s.links.map((d) => d.id),
        conditions: t
      });
      this.mergeExpansionData(r);
      const o = this.model.getGraphModelData().graphData, l = ((n = this.getContext) == null ? void 0 : n.call(this)) ?? {};
      this.historyManager.pushState({
        type: "expand",
        description: `拓出节点 ${e}`,
        state: {
          graphData: o,
          customData: {
            camera: l.camera,
            state: l.state
          }
        }
      });
    } catch (s) {
      throw console.error(`[Expand] Failed for node ${e}:`, s), s;
    } finally {
      this.loadingManager.model.stopLoading(e);
    }
  }
  mergeExpansionData(e) {
    const t = this.model.getGraphModelData().graphData, n = new Set(t.nodes.map((l) => l.id)), s = new Set(t.links.map((l) => l.id)), r = [];
    for (const l of e.nodes)
      n.has(l.id) || (r.push({
        id: l.id,
        data: { ...l.data ?? {} }
      }), n.add(l.id));
    const o = [];
    for (const l of e.links)
      s.has(l.id) || (o.push({
        id: l.id,
        source: l.source,
        target: l.target,
        data: { ...l.data ?? {} }
      }), s.add(l.id));
    !r.length && !o.length || this.model.updateGraphData({
      graphData: {
        nodes: [...t.nodes, ...r],
        links: [...t.links, ...o]
      }
    });
  }
}
const Ut = {
  person: "/icons/person.svg",
  phone: "/icons/phone.svg",
  address: "/icons/address.svg",
  account: "/icons/account.svg",
  company: "/icons/company.svg",
  ip: "/icons/ip.svg",
  device: "/icons/device.svg"
};
function pt(i) {
  var n;
  const e = (i == null ? void 0 : i.graphData) ?? i, t = e == null ? void 0 : e.nodes;
  if (!Array.isArray(t)) return i;
  for (const s of t) {
    const r = (n = s == null ? void 0 : s.data) == null ? void 0 : n.icon;
    typeof r == "string" && Ut[r] && (s.data.icon = Ut[r]);
  }
  return i;
}
async function Ho(i) {
  const e = await Fe.init(i);
  return pt(e.graphData), e;
}
const Uo = async (i) => {
  const e = await Fe.expand(i);
  return pt(e);
};
function Vo(i) {
  const { theme: e } = qe(), t = K(null), [n, s] = U({ x: 0, y: 0 }), r = K(
    new Pi({ initData: { graphData: { nodes: [], links: [] } } })
  ), o = K(null), l = K(new Ni()), d = K(null), [a, g] = U(!0), [y, u] = U(null), [f, m] = U(!1), [x, h] = U(!1), [v, k] = U(!1), [C, T] = U(!1), [A, N] = U(null);
  te(() => {
    if (!t.current) return;
    const B = r.current, j = new to({
      container: t.current,
      graphModel: B,
      arrowDisplay: !0,
      // 主题从外部传入（useTheme），注册 view 时手动配置
      runtimeTheme: e,
      backgroundColor: Pe(e).canvas,
      forceConfig: {
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4,
        // 亲密度→物理拉扯力（在调用方外部定义）：亲密越高距离越近、强度越大
        linkDistanceFn: (R) => {
          const w = R.intimacy;
          if (w !== void 0)
            return 100 * (1.5 - w * 0.7);
        },
        linkStrengthFn: (R) => {
          const w = R.intimacy;
          if (w !== void 0)
            return 0.2 * (0.3 + w * 0.9);
        }
      },
      theme: {
        node: {
          default: (R, w) => Eo(R, w),
          person: (R, w) => Ro(R, w),
          phone: (R, w) => Io(R, w),
          address: (R, w) => Lo(R, w),
          account: (R, w) => Fo(R, w),
          company: (R, w) => jo(R, w),
          ip: (R, w) => zo(R, w),
          device: (R, w) => Bo(R, w)
        },
        // 边的关系类型是后端动态值（USE_DEVICE / CALLED 等），无法静态枚举；
        // 用 Proxy 让任意 linkType 都解析到默认边样式（插件的兜底声明），
        // 未来如需按关系类型定制，给具体 key 覆盖即可。
        link: new Proxy(
          {
            default: (R, w) => Oo(w)
          },
          {
            get: (R, w) => R[w] ?? R.default
          }
        )
      },
      renderPlugin: (R, w) => new go({
        gl: R,
        canvas: w,
        width: t.current.clientWidth,
        height: t.current.clientHeight,
        pickerMode: "gpu",
        onPlusClick: (D) => {
          const M = B.getNodeById(D);
          M && B.events.publish("plusToolClick", M);
        }
      })
    });
    return o.current = j, d.current = new Wo({
      model: B,
      metadataManager: new Ci(),
      loadingManager: B.loadingManager,
      historyManager: l.current,
      fetcher: Uo,
      getContext: () => {
        var w, D;
        const R = (D = (w = j.renderer) == null ? void 0 : w.interaction) == null ? void 0 : D.transform;
        return {
          camera: R ? { x: R.x, y: R.y, k: R.k } : void 0,
          state: B.stateManager.getState()
        };
      }
    }), g(!1), () => {
      j.destroy(), o.current = null;
    };
  }, []), te(() => {
    var j, R;
    const B = o.current;
    B && (B.setRuntimeTheme(e), (R = (j = B.renderer).setBackgroundColor) == null || R.call(j, Pe(e).canvas));
  }, [e]), te(() => {
    const B = r.current;
    (async () => {
      var j;
      try {
        const R = await Ho(i ?? []);
        B.updateGraphData({ graphData: R.graphData }), (j = o.current) == null || j.settleLayout(), l.current.pushState({
          type: "init",
          description: "初始图谱",
          state: {
            graphData: structuredClone(R.graphData),
            customData: { state: B.stateManager.getState() }
          }
        });
      } catch (R) {
        u(R instanceof Error ? R.message : String(R));
      }
    })();
  }, [i]);
  const b = z(() => {
    var M, X;
    const B = r.current, j = o.current, R = l.current, w = structuredClone(B.getGraphModelData().graphData);
    let D;
    if (j) {
      const $ = (X = (M = j.renderer) == null ? void 0 : M.interaction) == null ? void 0 : X.transform;
      $ && (D = { x: $.x, y: $.y, k: $.k });
    }
    R.pushState({
      type: "snapshot",
      description: `快照 ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
      state: {
        graphData: w,
        customData: { camera: D, state: B.stateManager.getState() }
      }
    });
  }, []), _ = z((B) => {
    var X, $, q, ee, G, oe;
    const j = r.current, R = o.current, w = l.current, D = w.getAction(B);
    if (!D) return;
    j.updateGraphData({
      graphData: structuredClone(D.state.graphData)
    });
    const M = D.state.customData;
    if (M != null && M.state) {
      const J = M.state;
      (X = J.highlightNodes) != null && X.length ? j.stateManager.setHighlightNodes(J.highlightNodes, J.highlightLinks) : j.stateManager.clearHighlightNodes(), ($ = J.selectedNodes) != null && $.length ? j.stateManager.setSelectedNodes(J.selectedNodes, J.selectedLinks) : j.stateManager.clearSelection(), (q = J.hiddenNodes) != null && q.length ? j.stateManager.setHiddenNodes(J.hiddenNodes, J.hiddenLinks) : j.stateManager.showAll(), (ee = J.rootNodes) != null && ee.length ? j.stateManager.setRootNodes(J.rootNodes) : j.stateManager.clearRootNodes();
    }
    if (M != null && M.camera && R) {
      const J = (oe = (G = R.renderer) == null ? void 0 : G.interaction) == null ? void 0 : oe.transform;
      J && (J.x = M.camera.x, J.y = M.camera.y, J.k = M.camera.k);
    }
    w.jumpTo(B), R == null || R.reheat(0.3);
  }, []), S = z((B) => {
    l.current.deleteEntry(B);
  }, []), P = z(() => {
    m((B) => !B);
  }, []), E = z(
    (B) => {
      var D, M, X, $, q, ee;
      const j = r.current, R = o.current;
      if (!B) return;
      j.updateGraphData({
        graphData: structuredClone(B.graphData)
      });
      const w = B.customData;
      if (w != null && w.state) {
        const G = w.state;
        (D = G.highlightNodes) != null && D.length ? j.stateManager.setHighlightNodes(
          G.highlightNodes,
          G.highlightLinks
        ) : j.stateManager.clearHighlightNodes(), (M = G.selectedNodes) != null && M.length ? j.stateManager.setSelectedNodes(G.selectedNodes, G.selectedLinks) : j.stateManager.clearSelection(), (X = G.hiddenNodes) != null && X.length ? j.stateManager.setHiddenNodes(G.hiddenNodes, G.hiddenLinks) : j.stateManager.showAll(), ($ = G.rootNodes) != null && $.length ? j.stateManager.setRootNodes(G.rootNodes) : j.stateManager.clearRootNodes();
      }
      if (w != null && w.camera && R) {
        const G = (ee = (q = R.renderer) == null ? void 0 : q.interaction) == null ? void 0 : ee.transform;
        G && (G.x = w.camera.x, G.y = w.camera.y, G.k = w.camera.k);
      }
      R == null || R.reheat(0.3);
    },
    []
  ), H = z(() => {
    const j = l.current.goBackSkipType("snapshot");
    E(j);
  }, [E]), F = z(() => {
    const j = l.current.goForwardSkipType("snapshot");
    E(j);
  }, [E]);
  return {
    containerRef: t,
    modelRef: r,
    viewRef: o,
    historyManagerRef: l,
    expansionRef: d,
    ctx: {
      mousePos: n,
      setMousePos: s,
      loading: a,
      initError: y,
      snapshotPanelOpen: f,
      setSnapshotPanelOpen: m,
      legendPanelOpen: x,
      setLegendPanelOpen: h,
      miniMapOpen: v,
      setMiniMapOpen: k,
      analysisPanelOpen: C,
      setAnalysisPanelOpen: T,
      analysisTarget: A,
      setAnalysisTarget: N,
      handleTakeSnapshot: b,
      handleJumpToSnapshot: _,
      handleDeleteSnapshot: S,
      handleToggleSnapshotPanel: P,
      handleUndo: H,
      handleRedo: F
    }
  };
}
function Xo({
  viewRef: i,
  modelRef: e
}) {
  const [t, n] = U("rect"), [s, r] = U(null), [o, l] = U(null), [d, a] = U(null), [g, y] = U(!1), u = K(null), f = z(
    (w, D) => {
      var q;
      const M = i.current;
      if (!M) return { x: w, y: D };
      const X = (q = M.renderer) == null ? void 0 : q.canvas;
      if (!X) return { x: w, y: D };
      const $ = X.getBoundingClientRect();
      return { x: w - $.left, y: D - $.top };
    },
    [i]
  ), m = z(() => {
    var D, M;
    const w = i.current;
    return w ? ((M = (D = w.renderer) == null ? void 0 : D.interaction) == null ? void 0 : M.transform) ?? null : null;
  }, [i]), x = z(
    (w) => {
      const D = e.current, M = m();
      if (!D || !M) return [];
      const { nodes: X } = D.getGraphModelData().graphData, $ = w.x1 / M.k - M.x, q = w.y1 / M.k - M.y, ee = w.x2 / M.k - M.x, G = w.y2 / M.k - M.y, oe = Math.min($, ee), J = Math.max($, ee), I = Math.min(q, G), O = Math.max(q, G);
      return X.filter((W) => {
        const L = W.x ?? 0, V = W.y ?? 0;
        return L >= oe && L <= J && V >= I && V <= O;
      }).map((W) => W.id);
    },
    [e, m]
  ), h = z(
    (w) => {
      if (w.length < 3) return [];
      const D = e.current, M = m();
      if (!D || !M) return [];
      const { nodes: X } = D.getGraphModelData().graphData, $ = w.map(
        (q) => [q.x / M.k - M.x, q.y / M.k - M.y]
      );
      return X.filter((q) => {
        const ee = q.x ?? 0, G = q.y ?? 0;
        return Yo(ee, G, $);
      }).map((q) => q.id);
    },
    [e, m]
  ), v = K(t);
  v.current = t;
  const k = K(o);
  k.current = o;
  const C = K(d);
  C.current = d, te(() => {
    const w = (M) => {
      M.key === "Shift" && (y(!0), r(v.current)), M.key === "Escape" && C.current && a(null);
    }, D = (M) => {
      M.key === "Shift" && (y(!1), !k.current && (!C.current || C.current.vertices.length === 0) && r(null));
    };
    return window.addEventListener("keydown", w), window.addEventListener("keyup", D), () => {
      window.removeEventListener("keydown", w), window.removeEventListener("keyup", D);
    };
  }, []);
  const T = z(
    (w, D) => {
      if (!d || d.vertices.length < 2) return !1;
      const M = d.vertices[0], X = w - M.x, $ = D - M.y;
      return Math.sqrt(X * X + $ * $) < 10;
    },
    [d]
  ), A = z(
    (w) => {
      const D = x(w), M = e.current;
      return M && (D.length > 0 ? M.stateManager.setSelectedNodes(D) : M.stateManager.clearSelection()), D;
    },
    [x, e]
  ), N = z(
    (w) => {
      const D = h(w), M = e.current;
      return M && (D.length > 0 ? M.stateManager.setSelectedNodes(D) : M.stateManager.clearSelection()), D;
    },
    [h, e]
  ), b = z((w, D) => {
    u.current = { x: w, y: D }, l({ x1: w, y1: D, x2: w, y2: D });
  }, []), _ = z((w, D) => {
    u.current && l({
      x1: u.current.x,
      y1: u.current.y,
      x2: w,
      y2: D
    });
  }, []), S = z(() => {
    o && A(o), l(null), u.current = null;
  }, [o, A]), P = z((w, D) => {
    a((M) => ({ vertices: M != null && M.vertices ? [...M.vertices, { x: w, y: D }] : [{ x: w, y: D }], cursorPos: { x: w, y: D } }));
  }, []), E = z((w, D) => {
    a(
      (M) => M ? { ...M, cursorPos: { x: w, y: D } } : null
    );
  }, []), H = z(() => {
    d && d.vertices.length >= 3 && N(d.vertices), a(null);
  }, [d, N]), F = z(() => {
    l(null), a(null), u.current = null;
  }, []), B = z(() => {
    F(), n("rect"), r(null);
  }, [F]), j = z(() => {
    F(), n("polygon"), r(null);
  }, [F]), R = z(() => {
    F(), n(null), r(null);
  }, [F]);
  return {
    /** 工具栏选中的模式（持久） */
    selectedSelectionMode: t,
    /** 当前激活的框选模式（Shift 按下时非 null） */
    selectionMode: s,
    /** 矩形状态（供 overlay 渲染） */
    rect: o,
    /** 多边形状态（供 overlay 渲染） */
    polygon: d,
    /** Shift 是否按下 */
    isShiftDown: g,
    /** 判断是否靠近首顶点 */
    isNearFirstVertex: T,
    /** 坐标工具 */
    getCanvasPos: f,
    getTransform: m,
    /** 矩形操作 */
    startRect: b,
    updateRect: _,
    finishRect: S,
    /** 多边形操作 */
    addPolygonVertex: P,
    updatePolygonCursor: E,
    finishPolygon: H,
    /** 通用 */
    cancelSelection: F,
    /** 工具栏方法 */
    activateRectMode: B,
    activatePolygonMode: j,
    deactivateSelectionMode: R
  };
}
function Yo(i, e, t) {
  let n = !1;
  for (let s = 0, r = t.length - 1; s < t.length; r = s++) {
    const [o, l] = t[s], [d, a] = t[r];
    l > e != a > e && i < (d - o) * (e - l) / (a - l) + o && (n = !n);
  }
  return n;
}
const He = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  fontFamily: "monospace"
}, Go = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: 13,
  color: "rgb(var(--foreground))",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
};
function $o({ onClose: i }) {
  const {
    timeRange: e,
    timeValue: t,
    timeActive: n,
    playing: s,
    setPlaying: r,
    onTimeChange: o,
    toggleTime: l,
    resetFilters: d
  } = pe(), a = (g) => new Date(g).toISOString().slice(0, 10);
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "time-panel",
      layer: de.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 340, h: 170 },
      position: { x: window.innerWidth - 380, y: 300 },
      style: Go,
      onClose: i,
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "8px 10px",
              borderBottom: "1px solid rgb(var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ c.jsx(Jt, { size: 14 }),
              /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold" }, children: "时间线回放" }),
              /* @__PURE__ */ c.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  onClick: l,
                  disabled: !e.hasTime,
                  style: {
                    ...it,
                    background: n ? "#0066ff40" : "transparent",
                    border: n ? "1px solid #0066ff" : "1px solid #555"
                  },
                  title: n ? "关闭时间过滤" : "启用时间过滤",
                  children: n ? "过滤中" : "启用"
                }
              ),
              /* @__PURE__ */ c.jsx("button", { onClick: () => d(), style: it, title: "重置时间线", children: /* @__PURE__ */ c.jsx(Qt, { size: 13 }) })
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flex: 1,
              justifyContent: "center"
            },
            children: [
              !e.hasTime && /* @__PURE__ */ c.jsx("span", { style: He, children: "（当前画布无边的时间信息）" }),
              /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    onClick: () => {
                      n || l(), r((g) => !g);
                    },
                    disabled: !e.hasTime,
                    style: { ...it, padding: "3px 10px" },
                    title: s ? "暂停" : "播放",
                    children: s ? /* @__PURE__ */ c.jsx(ns, { size: 13 }) : /* @__PURE__ */ c.jsx(os, { size: 13 })
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    type: "range",
                    min: e.min,
                    max: e.max,
                    value: t,
                    disabled: !e.hasTime,
                    onChange: (g) => o(Number(g.target.value)),
                    style: { flex: 1, cursor: "pointer" }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { style: He, children: a(t) })
              ] }),
              /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                /* @__PURE__ */ c.jsx("span", { style: He, children: e.hasTime ? a(e.min) : "--" }),
                /* @__PURE__ */ c.jsx("span", { style: He, children: e.hasTime ? a(e.max) : "--" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const it = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 6px",
  background: "transparent",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
}, qo = {
  person: "人员",
  phone: "手机",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP",
  device: "设备"
}, Ko = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: 13,
  color: "rgb(var(--foreground))",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
};
function Zo({ onClose: i }) {
  const {
    typeStats: e,
    attrFilter: t,
    toggleNodeType: n,
    updateAttrFilter: s,
    resetFilters: r
  } = pe(), o = (a) => s({ gender: a === "" ? null : a }), l = (a) => s({ minWeight: a === "" ? null : Number(a) }), d = (a) => s({ maxWeight: a === "" ? null : Number(a) });
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "filter-panel",
      layer: de.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 340, h: 320 },
      position: { x: window.innerWidth - 380, y: 150 },
      style: Ko,
      onClose: i,
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "8px 10px",
              borderBottom: "1px solid rgb(var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ c.jsx(ps, { size: 14 }),
              /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold" }, children: "属性过滤" }),
              /* @__PURE__ */ c.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ c.jsxs("button", { onClick: () => r(), style: Jo, title: "重置全部过滤", children: [
                /* @__PURE__ */ c.jsx(Qt, { size: 13 }),
                " 重置"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 4
            },
            children: [
              /* @__PURE__ */ c.jsx("div", { style: rt, children: "节点类型" }),
              /* @__PURE__ */ c.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: [...e.entries()].map(([a, g]) => {
                const y = t.nodeTypes.has(a);
                return /* @__PURE__ */ c.jsxs(
                  "label",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      padding: "2px 8px",
                      border: `1px solid ${y ? "#0066ff" : "#444"}`,
                      borderRadius: 12,
                      background: y ? "#0066ff25" : "transparent",
                      cursor: "pointer"
                    },
                    children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: y,
                          onChange: (u) => n(a, u.target.checked),
                          style: { margin: 0 }
                        }
                      ),
                      qo[a] ?? a,
                      /* @__PURE__ */ c.jsx("span", { style: { color: "rgb(var(--muted))" }, children: g })
                    ]
                  },
                  a
                );
              }) }),
              /* @__PURE__ */ c.jsx("div", { style: { ...rt, marginTop: 12 }, children: "性别" }),
              /* @__PURE__ */ c.jsxs(
                "select",
                {
                  value: t.gender ?? "",
                  onChange: (a) => o(a.target.value),
                  style: un,
                  children: [
                    /* @__PURE__ */ c.jsx("option", { value: "", children: "全部" }),
                    /* @__PURE__ */ c.jsx("option", { value: "男", children: "男" }),
                    /* @__PURE__ */ c.jsx("option", { value: "女", children: "女" })
                  ]
                }
              ),
              /* @__PURE__ */ c.jsx("div", { style: { ...rt, marginTop: 12 }, children: "案值权重" }),
              /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "min",
                    value: t.minWeight ?? "",
                    onChange: (a) => l(a.target.value),
                    style: Vt
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: "~" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "max",
                    value: t.maxWeight ?? "",
                    onChange: (a) => d(a.target.value),
                    style: Vt
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
const rt = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  marginBottom: 6
}, Jo = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 6px",
  background: "transparent",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
}, un = {
  fontSize: 12,
  fontFamily: "monospace",
  padding: "3px 6px",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, Vt = {
  ...un,
  width: 90
}, Qo = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: 12,
  color: "rgb(var(--foreground))",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column"
};
function ea({
  modelRef: i,
  viewRef: e,
  onClose: t
}) {
  const { hoveredNode: n, selectedNodeIds: s } = pe(), [r, o] = U(0), [l, d] = U("all"), a = K(/* @__PURE__ */ new Map());
  te(() => {
    const u = i.current;
    if (u)
      return u.events.subscribe("dataChange", () => o((f) => f + 1));
  }, [i]);
  const g = Ve(() => {
    const u = i.current;
    if (!u) return [];
    const f = u.getGraphModelData().graphData, m = /* @__PURE__ */ new Map();
    for (const h of f.links) {
      const v = String(typeof h.source == "object" ? h.source.id : h.source), k = String(typeof h.target == "object" ? h.target.id : h.target), C = h.data ?? {}, T = typeof C.intimacy == "number" ? C.intimacy : 0;
      for (const A of [v, k]) {
        const N = m.get(A) ?? { count: 0, intimacy: 0 };
        N.count += 1, N.intimacy += T, m.set(A, N);
      }
    }
    return f.nodes.filter(
      (h) => l === "selected" ? s.has(h.id) : !0
    ).map((h) => {
      const v = h.data ?? {}, k = m.get(h.id) ?? { count: 0, intimacy: 0 };
      return {
        id: h.id,
        label: v.label ?? h.id,
        nodeType: v.nodeType ?? "default",
        clusterId: v.clusterId ?? "",
        gender: v.gender ?? "",
        age: v.age ?? 0,
        caseWeight: v.caseWeight ?? 0,
        edgeCount: k.count,
        intimacy: k.count ? Math.round(k.intimacy / k.count * 100) / 100 : 0
      };
    });
  }, [i, r, l, s]);
  te(() => {
    const u = n == null ? void 0 : n.id;
    if (!u) return;
    const f = a.current.get(u);
    f == null || f.scrollIntoView({ block: "nearest" });
  }, [n]);
  const y = (u) => {
    const f = e.current, m = i.current;
    !f || !m || (f.focusNodeById(u.id), m.stateManager.setSelectedNodes([u.id]));
  };
  return /* @__PURE__ */ c.jsxs(
    fe,
    {
      id: "table-panel",
      layer: de.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 620, h: 400 },
      position: { x: 60, y: 60 },
      style: Qo,
      onClose: t,
      children: [
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            style: {
              padding: "8px 10px",
              borderBottom: "1px solid rgb(var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ c.jsx(en, { size: 14 }),
              /* @__PURE__ */ c.jsx("span", { style: { fontWeight: "bold" }, children: "表格视图" }),
              /* @__PURE__ */ c.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ c.jsxs(
                "button",
                {
                  onClick: () => d("all"),
                  style: {
                    ...Xt,
                    background: l === "all" ? "#0066ff40" : "transparent"
                  },
                  children: [
                    "全部 (",
                    g.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ c.jsxs(
                "button",
                {
                  onClick: () => d("selected"),
                  style: {
                    ...Xt,
                    background: l === "selected" ? "#0066ff40" : "transparent"
                  },
                  children: [
                    "选中 (",
                    s.size,
                    ")"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ c.jsx("div", { style: { flex: 1, overflow: "auto" }, children: /* @__PURE__ */ c.jsxs("table", { style: { borderCollapse: "collapse", width: "100%" }, children: [
          /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsx("tr", { style: { color: "rgb(var(--muted))", textAlign: "left" }, children: [
            "标签",
            "类型",
            "簇",
            "性别",
            "年龄",
            "案值",
            "边数",
            "亲密度"
          ].map((u) => /* @__PURE__ */ c.jsx("th", { style: ta, children: u }, u)) }) }),
          /* @__PURE__ */ c.jsx("tbody", { children: g.map((u) => {
            const f = (n == null ? void 0 : n.id) === u.id, m = s.has(u.id);
            return /* @__PURE__ */ c.jsxs(
              "tr",
              {
                ref: (x) => {
                  x ? a.current.set(u.id, x) : a.current.delete(u.id);
                },
                onClick: () => y(u),
                style: {
                  borderTop: "1px solid rgb(var(--border))",
                  cursor: "pointer",
                  background: m ? "#0066ff30" : f ? "rgba(233,69,96,0.12)" : "transparent"
                },
                children: [
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.label }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.nodeType }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.clusterId }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.gender }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.age || "" }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.caseWeight || "" }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: u.edgeCount }),
                  /* @__PURE__ */ c.jsx("td", { style: ve, children: /* @__PURE__ */ c.jsx(
                    "div",
                    {
                      style: {
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        background: "rgba(128,128,128,0.2)"
                      },
                      children: /* @__PURE__ */ c.jsx(
                        "div",
                        {
                          style: {
                            width: `${Math.round(u.intimacy * 100)}%`,
                            height: 6,
                            borderRadius: 3,
                            background: "#e94560"
                          }
                        }
                      )
                    }
                  ) })
                ]
              },
              u.id
            );
          }) })
        ] }) })
      ]
    }
  );
}
const ta = {
  padding: "6px 10px",
  fontSize: 11,
  fontWeight: "normal",
  position: "sticky",
  top: 0,
  background: "rgb(var(--background))"
}, ve = {
  padding: "5px 10px",
  maxWidth: 140,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
}, Xt = {
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 8px",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
};
function Yt(i, e) {
  var n, s;
  const t = {};
  for (const r of i.links) {
    const o = typeof r.source == "object" ? r.source.id : r.source, l = typeof r.target == "object" ? r.target.id : r.target;
    if (String(o) === e) {
      const d = i.nodes.find((a) => a.id === l);
      if (d) {
        const a = ((n = d.data) == null ? void 0 : n.nodeType) ?? "unknown";
        t[a] || (t[a] = { out: 0, in: 0 }), t[a].out += 1;
      }
    }
    if (String(l) === e) {
      const d = i.nodes.find((a) => a.id === o);
      if (d) {
        const a = ((s = d.data) == null ? void 0 : s.nodeType) ?? "unknown";
        t[a] || (t[a] = { out: 0, in: 0 }), t[a].in += 1;
      }
    }
  }
  return t;
}
function na() {
  const [i] = U(() => {
    const ne = new URLSearchParams(window.location.search).get("ids");
    return ne ? ne.split(",").filter(Boolean) : void 0;
  }), e = Vo(i), {
    containerRef: t,
    modelRef: n,
    viewRef: s,
    historyManagerRef: r,
    expansionRef: o,
    ctx: {
      setMousePos: l,
      loading: d,
      initError: a,
      snapshotPanelOpen: g,
      setSnapshotPanelOpen: y,
      legendPanelOpen: u,
      setLegendPanelOpen: f,
      miniMapOpen: m,
      setMiniMapOpen: x,
      analysisPanelOpen: h,
      setAnalysisPanelOpen: v,
      setAnalysisTarget: k,
      handleTakeSnapshot: C,
      handleJumpToSnapshot: T,
      handleDeleteSnapshot: A,
      handleToggleSnapshotPanel: N,
      handleUndo: b,
      handleRedo: _
    }
  } = e, [S, P] = U(!1), [E, H] = U(!1), [F, B] = U(!1), [j, R] = U(!1), w = Co(n), D = No(n, {
    onPlusToolClick: (Y) => {
      C(), J({
        node: Y,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    },
    onNodeContextMenu: (Y, ne, re) => {
      J({ node: Y, x: ne, y: re });
    }
  }), {
    ctx: {
      hoveredNode: M,
      setHoveredNode: X,
      hoveredLink: $,
      setHoveredLink: q,
      selectedNodeIds: ee
    }
  } = D, G = Mo(t, o), { ruleMenu: oe, setRuleMenu: J, expanding: I, runtimeError: O } = G.ctx, { handleRuleExpand: W } = G, L = Xo({ viewRef: s, modelRef: n }), V = z(async (Y) => {
    const ne = n.current, re = s.current;
    if (!ne || !re) return;
    const we = await Fe.init([Y]), be = pt(we).graphData, ue = ne.getGraphModelData().graphData, je = new Set(ue.nodes.map((he) => he.id)), ge = new Set(ue.links.map((he) => he.id)), Ze = be.nodes.filter((he) => !je.has(he.id));
    if (Ze.length === 0) return;
    const ze = re.renderer.interaction.transform, vt = re.renderer.canvas, xt = vt.clientWidth / 2 / ze.k - ze.x, mt = vt.clientHeight / 2 / ze.k - ze.y;
    re.setPhysicsCenter(xt, mt);
    for (const he of Ze)
      he.x = xt + (Math.random() - 0.5) * 20, he.y = mt + (Math.random() - 0.5) * 20;
    ne.updateGraphData({
      graphData: {
        nodes: [...ue.nodes, ...Ze],
        links: [
          ...ue.links,
          ...be.links.filter((he) => !ge.has(he.id))
        ]
      }
    }), re.reheat(1), r.current.pushState({
      type: "search-add",
      description: `新增节点 ${Y}`,
      state: {
        graphData: structuredClone(ne.getGraphModelData().graphData),
        customData: { state: ne.stateManager.getState() }
      }
    });
  }, []), se = z(() => {
    if (h) return v(!1);
    const Y = [...ee];
    Y.length !== 0 && (k({
      ids: Y,
      labels: Y.map((ne) => {
        var we, be;
        const re = (we = n.current) == null ? void 0 : we.getGraphModelData().graphData.nodes.find((ue) => ue.id === ne);
        return ((be = re == null ? void 0 : re.data) == null ? void 0 : be.label) ?? ne;
      })
    }), v(!0));
  }, [ee, h, v]), ae = z(() => {
    f((Y) => !Y);
  }, []), Z = z(() => {
    x((Y) => !Y);
  }, []), Se = z(() => {
    var Y;
    (Y = s.current) == null || Y.fitView(50);
  }, []), Ne = z(() => {
  }, []), yt = z(
    (Y) => {
      const ne = n.current;
      !ne || ee.size === 0 || po(ne, ee, Y);
    },
    [ee]
  ), gn = {
    repulsion: -200,
    linkDistance: 100,
    linkStrength: 0.2,
    centerStrength: 0.1,
    velocityDecay: 0.4
  }, fn = z(() => {
    const Y = s.current;
    if (Y)
      if (j)
        Y.setLayout(new ht(gn)), R(!1);
      else {
        const ne = ee.size > 0 ? [...ee][0] : void 0;
        Y.setLayout(new fo({ rootId: ne, levelGap: 170, siblingGap: 64 })), R(!0);
      }
  }, [j, ee]), pn = {
    ...e.ctx,
    ...D.ctx,
    ...G.ctx,
    ...L,
    ...w
  };
  return /* @__PURE__ */ c.jsx(Us, { value: pn, children: /* @__PURE__ */ c.jsx(Tn, { children: /* @__PURE__ */ c.jsxs(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgb(var(--background))",
        color: "rgb(var(--foreground))"
      },
      children: [
        /* @__PURE__ */ c.jsx(
          So,
          {
            historyManagerRef: r,
            onBack: Ne,
            onFitView: Se,
            onToggleSnapshotPanel: N,
            onToggleLegend: ae,
            onToggleMiniMap: Z,
            onUndo: b,
            onRedo: _,
            onSearchSelect: V,
            onAnalyze: se,
            timePanelOpen: S,
            filterPanelOpen: E,
            tablePanelOpen: F,
            onToggleTimePanel: () => P((Y) => !Y),
            onToggleFilterPanel: () => H((Y) => !Y),
            onToggleTablePanel: () => B((Y) => !Y),
            onExportJSON: () => yt("json"),
            onExportCSV: () => yt("csv"),
            treeMode: j,
            onToggleTreeLayout: fn
          }
        ),
        d && /* @__PURE__ */ c.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e94560",
              fontFamily: "monospace",
              fontSize: "18px",
              zIndex: 3e3
            },
            children: /* @__PURE__ */ c.jsxs("div", { style: { textAlign: "center" }, children: [
              /* @__PURE__ */ c.jsx("div", { style: { fontSize: "32px", marginBottom: "12px" }, children: "⟳" }),
              /* @__PURE__ */ c.jsx("div", { children: "Loading graph data..." }),
              /* @__PURE__ */ c.jsx(
                "div",
                {
                  style: {
                    fontSize: "12px",
                    color: "rgb(var(--muted))",
                    marginTop: "8px"
                  },
                  children: "Fetching from mock API ..."
                }
              ),
              /* @__PURE__ */ c.jsx(
                "div",
                {
                  id: "runtime-error",
                  style: {
                    display: "none",
                    marginTop: "20px",
                    color: "#ff6b6b",
                    fontSize: "13px",
                    maxWidth: "500px",
                    wordBreak: "break-all"
                  }
                }
              ),
              a && /* @__PURE__ */ c.jsxs(
                "div",
                {
                  style: {
                    marginTop: "20px",
                    color: "#ff6b6b",
                    fontSize: "13px",
                    maxWidth: "500px",
                    wordBreak: "break-all"
                  },
                  children: [
                    "Error: ",
                    a
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ c.jsxs(
          "div",
          {
            ref: t,
            style: {
              flex: 1,
              position: "relative",
              overflow: "hidden"
            },
            onMouseMove: (Y) => {
              l({ x: Y.clientX, y: Y.clientY });
            },
            onMouseLeave: () => {
              X(null), q(null);
            },
            children: [
              M && /* @__PURE__ */ c.jsx(
                Vs,
                {
                  loadedNeighbors: Yt(
                    n.current.getGraphModelData().graphData,
                    M.id
                  )
                }
              ),
              $ && /* @__PURE__ */ c.jsx(Ys, {}),
              g && r.current && /* @__PURE__ */ c.jsx(
                ui,
                {
                  historyManager: r.current,
                  currentIndex: r.current.cursor,
                  onTakeSnapshot: C,
                  onJumpTo: T,
                  onDeleteEntry: A,
                  onClose: () => y(!1)
                }
              ),
              h && /* @__PURE__ */ c.jsx(
                vi,
                {
                  modelRef: n,
                  viewRef: s,
                  onClose: () => {
                    k(null), v(!1);
                  },
                  onExpand: (Y) => {
                    var ue, je;
                    const ne = n.current;
                    if (!ne) return;
                    const re = ne.getGraphModelData().graphData, we = new Set(re.nodes.map((ge) => ge.id)), be = new Set(re.links.map((ge) => ge.id));
                    ne.updateGraphData({
                      graphData: {
                        nodes: [
                          ...re.nodes,
                          ...Y.nodes.filter(
                            (ge) => !we.has(ge.id)
                          )
                        ],
                        links: [
                          ...re.links,
                          ...Y.links.filter(
                            (ge) => !be.has(ge.id)
                          )
                        ]
                      }
                    }), (ue = s.current) == null || ue.reheat(1), (je = s.current) == null || je.fitView(50);
                  }
                }
              ),
              u && !d && /* @__PURE__ */ c.jsx(Es, { onClose: () => f(!1) }),
              m && !d && /* @__PURE__ */ c.jsx(Hs, { viewRef: s }),
              S && /* @__PURE__ */ c.jsx($o, { onClose: () => P(!1) }),
              E && /* @__PURE__ */ c.jsx(Zo, { onClose: () => H(!1) }),
              F && /* @__PURE__ */ c.jsx(
                ea,
                {
                  modelRef: n,
                  viewRef: s,
                  onClose: () => B(!1)
                }
              ),
              /* @__PURE__ */ c.jsx(
                Po,
                {
                  modelRef: n,
                  viewRef: s,
                  onAnalyze: se
                }
              ),
              oe && /* @__PURE__ */ c.jsx(
                Zs,
                {
                  node: oe.node,
                  loadedNeighbors: Yt(
                    n.current.getGraphModelData().graphData,
                    oe.node.id
                  ),
                  x: oe.x,
                  y: oe.y,
                  onExpand: W,
                  onClose: () => J(null)
                }
              ),
              I && /* @__PURE__ */ c.jsxs(
                "div",
                {
                  style: {
                    position: "fixed",
                    bottom: 70,
                    right: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgb(var(--tooltip-bg) / 0.95)",
                    border: "1px solid #1976d2",
                    borderRadius: 8,
                    padding: "8px 14px",
                    boxShadow: "var(--shadow)",
                    zIndex: 9999,
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: "#1976d2"
                  },
                  children: [
                    /* @__PURE__ */ c.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "18px",
                          animation: "spin 1s linear infinite"
                        },
                        children: "⟳"
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: "正在拓出..." }),
                    /* @__PURE__ */ c.jsx("style", { children: "@keyframes spin { to { transform: rotate(360deg); } }" })
                  ]
                }
              ),
              /* @__PURE__ */ c.jsx(To, {}),
              O && /* @__PURE__ */ c.jsxs(
                "div",
                {
                  style: {
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#d32f2f",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    zIndex: 9999,
                    fontSize: "13px",
                    fontFamily: "monospace",
                    maxWidth: "80%",
                    wordBreak: "break-all"
                  },
                  children: [
                    "❌ ",
                    O
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  ) }) });
}
let Ae = null;
const sa = () => {
  let i = document.getElementById("single-spa-application:graph-app");
  return i || (i = document.createElement("div"), i.id = "single-spa-application:graph-app", document.body.appendChild(i)), i;
}, aa = async () => {
}, la = async (i) => {
  var t;
  const e = i.domElement ?? sa();
  e.dataset.buildVersion = "0.3.0", (t = i.auth) != null && t.token && fi(i.auth.token), Ae = wn.createRoot(e), Ae.render(
    /* @__PURE__ */ c.jsx(Ps, { children: /* @__PURE__ */ c.jsx(na, {}) })
  );
}, ca = async () => {
  Ae == null || Ae.unmount(), Ae = null;
};
export {
  aa as bootstrap,
  sa as domElementGetter,
  la as mount,
  ca as unmount
};
