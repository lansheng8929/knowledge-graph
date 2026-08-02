const __kgStyle=document.createElement("style");__kgStyle.textContent=":root,[data-theme=light]{--background: 255 255 255;--foreground: 51 51 51;--muted: 136 153 170;--muted-foreground: 102 119 136;--primary: 233 69 96;--primary-foreground: 255 255 255;--border: 224 224 224;--border-strong: 15 52 96;--border-hover: 0 204 255;--shadow-sm: 0 1px 2px rgb(0 0 0 / .05);--shadow: 0 4px 20px rgb(0 0 0 / .12);--shadow-lg: 0 4px 20px rgb(0 0 0 / .4);--tooltip-bg: 255 255 255;--hover: 240 244 255;--canvas-bg: 248 249 250;--overlay-bg: 0 102 255}[data-theme=dark]{--background: 30 33 38;--foreground: 226 232 240;--muted: 100 116 139;--muted-foreground: 148 163 184;--primary: 244 63 94;--primary-foreground: 255 255 255;--border: 55 60 67;--border-strong: 71 78 88;--border-hover: 34 211 238;--shadow-sm: 0 1px 2px rgb(0 0 0 / .35);--shadow: 0 4px 20px rgb(0 0 0 / .4);--shadow-lg: 0 4px 24px rgb(0 0 0 / .55);--tooltip-bg: 42 46 52;--hover: 42 46 52;--canvas-bg: 24 27 31;--overlay-bg: 96 165 250}.bg-background{background-color:rgb(var(--background))}.bg-canvas{background-color:rgb(var(--canvas-bg))}.bg-tooltip{background-color:rgb(var(--tooltip-bg))}.bg-primary{background-color:rgb(var(--primary))}.bg-hover{background-color:rgb(var(--hover))}.text-foreground{color:rgb(var(--foreground))}.text-muted{color:rgb(var(--muted))}.text-muted-foreground{color:rgb(var(--muted-foreground))}.text-primary{color:rgb(var(--primary))}.border-border{border-color:rgb(var(--border))}.border-border-strong{border-color:rgb(var(--border-strong))}.border-primary{border-color:rgb(var(--primary))}.shadow-sm{box-shadow:var(--shadow-sm)}.shadow{box-shadow:var(--shadow)}.shadow-lg{box-shadow:var(--shadow-lg)}\n";document.head.appendChild(__kgStyle);
var Zh = Object.defineProperty;
var qh = (c, n, i) => n in c ? Zh(c, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : c[n] = i;
var k = (c, n, i) => qh(c, typeof n != "symbol" ? n + "" : n, i);
var il = { exports: {} }, Hr = {}, ol = { exports: {} }, we = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hc;
function Jh() {
  if (hc) return we;
  hc = 1;
  var c = Symbol.for("react.element"), n = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), d = Symbol.for("react.provider"), h = Symbol.for("react.context"), p = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), N = Symbol.iterator;
  function S(E) {
    return E === null || typeof E != "object" ? null : (E = N && E[N] || E["@@iterator"], typeof E == "function" ? E : null);
  }
  var w = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, R = Object.assign, P = {};
  function y(E, V, pe) {
    this.props = E, this.context = V, this.refs = P, this.updater = pe || w;
  }
  y.prototype.isReactComponent = {}, y.prototype.setState = function(E, V) {
    if (typeof E != "object" && typeof E != "function" && E != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, E, V, "setState");
  }, y.prototype.forceUpdate = function(E) {
    this.updater.enqueueForceUpdate(this, E, "forceUpdate");
  };
  function _() {
  }
  _.prototype = y.prototype;
  function L(E, V, pe) {
    this.props = E, this.context = V, this.refs = P, this.updater = pe || w;
  }
  var X = L.prototype = new _();
  X.constructor = L, R(X, y.prototype), X.isPureReactComponent = !0;
  var j = Array.isArray, W = Object.prototype.hasOwnProperty, Y = { current: null }, M = { key: !0, ref: !0, __self: !0, __source: !0 };
  function U(E, V, pe) {
    var ue, xe = {}, $ = null, Z = null;
    if (V != null) for (ue in V.ref !== void 0 && (Z = V.ref), V.key !== void 0 && ($ = "" + V.key), V) W.call(V, ue) && !M.hasOwnProperty(ue) && (xe[ue] = V[ue]);
    var te = arguments.length - 2;
    if (te === 1) xe.children = pe;
    else if (1 < te) {
      for (var G = Array(te), ge = 0; ge < te; ge++) G[ge] = arguments[ge + 2];
      xe.children = G;
    }
    if (E && E.defaultProps) for (ue in te = E.defaultProps, te) xe[ue] === void 0 && (xe[ue] = te[ue]);
    return { $$typeof: c, type: E, key: $, ref: Z, props: xe, _owner: Y.current };
  }
  function O(E, V) {
    return { $$typeof: c, type: E.type, key: V, ref: E.ref, props: E.props, _owner: E._owner };
  }
  function Q(E) {
    return typeof E == "object" && E !== null && E.$$typeof === c;
  }
  function oe(E) {
    var V = { "=": "=0", ":": "=2" };
    return "$" + E.replace(/[=:]/g, function(pe) {
      return V[pe];
    });
  }
  var ve = /\/+/g;
  function le(E, V) {
    return typeof E == "object" && E !== null && E.key != null ? oe("" + E.key) : V.toString(36);
  }
  function se(E, V, pe, ue, xe) {
    var $ = typeof E;
    ($ === "undefined" || $ === "boolean") && (E = null);
    var Z = !1;
    if (E === null) Z = !0;
    else switch ($) {
      case "string":
      case "number":
        Z = !0;
        break;
      case "object":
        switch (E.$$typeof) {
          case c:
          case n:
            Z = !0;
        }
    }
    if (Z) return Z = E, xe = xe(Z), E = ue === "" ? "." + le(Z, 0) : ue, j(xe) ? (pe = "", E != null && (pe = E.replace(ve, "$&/") + "/"), se(xe, V, pe, "", function(ge) {
      return ge;
    })) : xe != null && (Q(xe) && (xe = O(xe, pe + (!xe.key || Z && Z.key === xe.key ? "" : ("" + xe.key).replace(ve, "$&/") + "/") + E)), V.push(xe)), 1;
    if (Z = 0, ue = ue === "" ? "." : ue + ":", j(E)) for (var te = 0; te < E.length; te++) {
      $ = E[te];
      var G = ue + le($, te);
      Z += se($, V, pe, G, xe);
    }
    else if (G = S(E), typeof G == "function") for (E = G.call(E), te = 0; !($ = E.next()).done; ) $ = $.value, G = ue + le($, te++), Z += se($, V, pe, G, xe);
    else if ($ === "object") throw V = String(E), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(E).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
    return Z;
  }
  function ie(E, V, pe) {
    if (E == null) return E;
    var ue = [], xe = 0;
    return se(E, ue, "", "", function($) {
      return V.call(pe, $, xe++);
    }), ue;
  }
  function re(E) {
    if (E._status === -1) {
      var V = E._result;
      V = V(), V.then(function(pe) {
        (E._status === 0 || E._status === -1) && (E._status = 1, E._result = pe);
      }, function(pe) {
        (E._status === 0 || E._status === -1) && (E._status = 2, E._result = pe);
      }), E._status === -1 && (E._status = 0, E._result = V);
    }
    if (E._status === 1) return E._result.default;
    throw E._result;
  }
  var B = { current: null }, I = { transition: null }, H = { ReactCurrentDispatcher: B, ReactCurrentBatchConfig: I, ReactCurrentOwner: Y };
  function J() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return we.Children = { map: ie, forEach: function(E, V, pe) {
    ie(E, function() {
      V.apply(this, arguments);
    }, pe);
  }, count: function(E) {
    var V = 0;
    return ie(E, function() {
      V++;
    }), V;
  }, toArray: function(E) {
    return ie(E, function(V) {
      return V;
    }) || [];
  }, only: function(E) {
    if (!Q(E)) throw Error("React.Children.only expected to receive a single React element child.");
    return E;
  } }, we.Component = y, we.Fragment = i, we.Profiler = u, we.PureComponent = L, we.StrictMode = s, we.Suspense = v, we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = H, we.act = J, we.cloneElement = function(E, V, pe) {
    if (E == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + E + ".");
    var ue = R({}, E.props), xe = E.key, $ = E.ref, Z = E._owner;
    if (V != null) {
      if (V.ref !== void 0 && ($ = V.ref, Z = Y.current), V.key !== void 0 && (xe = "" + V.key), E.type && E.type.defaultProps) var te = E.type.defaultProps;
      for (G in V) W.call(V, G) && !M.hasOwnProperty(G) && (ue[G] = V[G] === void 0 && te !== void 0 ? te[G] : V[G]);
    }
    var G = arguments.length - 2;
    if (G === 1) ue.children = pe;
    else if (1 < G) {
      te = Array(G);
      for (var ge = 0; ge < G; ge++) te[ge] = arguments[ge + 2];
      ue.children = te;
    }
    return { $$typeof: c, type: E.type, key: xe, ref: $, props: ue, _owner: Z };
  }, we.createContext = function(E) {
    return E = { $$typeof: h, _currentValue: E, _currentValue2: E, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, E.Provider = { $$typeof: d, _context: E }, E.Consumer = E;
  }, we.createElement = U, we.createFactory = function(E) {
    var V = U.bind(null, E);
    return V.type = E, V;
  }, we.createRef = function() {
    return { current: null };
  }, we.forwardRef = function(E) {
    return { $$typeof: p, render: E };
  }, we.isValidElement = Q, we.lazy = function(E) {
    return { $$typeof: x, _payload: { _status: -1, _result: E }, _init: re };
  }, we.memo = function(E, V) {
    return { $$typeof: g, type: E, compare: V === void 0 ? null : V };
  }, we.startTransition = function(E) {
    var V = I.transition;
    I.transition = {};
    try {
      E();
    } finally {
      I.transition = V;
    }
  }, we.unstable_act = J, we.useCallback = function(E, V) {
    return B.current.useCallback(E, V);
  }, we.useContext = function(E) {
    return B.current.useContext(E);
  }, we.useDebugValue = function() {
  }, we.useDeferredValue = function(E) {
    return B.current.useDeferredValue(E);
  }, we.useEffect = function(E, V) {
    return B.current.useEffect(E, V);
  }, we.useId = function() {
    return B.current.useId();
  }, we.useImperativeHandle = function(E, V, pe) {
    return B.current.useImperativeHandle(E, V, pe);
  }, we.useInsertionEffect = function(E, V) {
    return B.current.useInsertionEffect(E, V);
  }, we.useLayoutEffect = function(E, V) {
    return B.current.useLayoutEffect(E, V);
  }, we.useMemo = function(E, V) {
    return B.current.useMemo(E, V);
  }, we.useReducer = function(E, V, pe) {
    return B.current.useReducer(E, V, pe);
  }, we.useRef = function(E) {
    return B.current.useRef(E);
  }, we.useState = function(E) {
    return B.current.useState(E);
  }, we.useSyncExternalStore = function(E, V, pe) {
    return B.current.useSyncExternalStore(E, V, pe);
  }, we.useTransition = function() {
    return B.current.useTransition();
  }, we.version = "18.3.1", we;
}
var fc;
function ml() {
  return fc || (fc = 1, ol.exports = Jh()), ol.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pc;
function ef() {
  if (pc) return Hr;
  pc = 1;
  var c = ml(), n = Symbol.for("react.element"), i = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, u = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(p, v, g) {
    var x, N = {}, S = null, w = null;
    g !== void 0 && (S = "" + g), v.key !== void 0 && (S = "" + v.key), v.ref !== void 0 && (w = v.ref);
    for (x in v) s.call(v, x) && !d.hasOwnProperty(x) && (N[x] = v[x]);
    if (p && p.defaultProps) for (x in v = p.defaultProps, v) N[x] === void 0 && (N[x] = v[x]);
    return { $$typeof: n, type: p, key: S, ref: w, props: N, _owner: u.current };
  }
  return Hr.Fragment = i, Hr.jsx = h, Hr.jsxs = h, Hr;
}
var gc;
function tf() {
  return gc || (gc = 1, il.exports = ef()), il.exports;
}
var C = tf(), oo = {}, sl = { exports: {} }, st = {}, ll = { exports: {} }, al = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vc;
function nf() {
  return vc || (vc = 1, (function(c) {
    function n(I, H) {
      var J = I.length;
      I.push(H);
      e: for (; 0 < J; ) {
        var E = J - 1 >>> 1, V = I[E];
        if (0 < u(V, H)) I[E] = H, I[J] = V, J = E;
        else break e;
      }
    }
    function i(I) {
      return I.length === 0 ? null : I[0];
    }
    function s(I) {
      if (I.length === 0) return null;
      var H = I[0], J = I.pop();
      if (J !== H) {
        I[0] = J;
        e: for (var E = 0, V = I.length, pe = V >>> 1; E < pe; ) {
          var ue = 2 * (E + 1) - 1, xe = I[ue], $ = ue + 1, Z = I[$];
          if (0 > u(xe, J)) $ < V && 0 > u(Z, xe) ? (I[E] = Z, I[$] = J, E = $) : (I[E] = xe, I[ue] = J, E = ue);
          else if ($ < V && 0 > u(Z, J)) I[E] = Z, I[$] = J, E = $;
          else break e;
        }
      }
      return H;
    }
    function u(I, H) {
      var J = I.sortIndex - H.sortIndex;
      return J !== 0 ? J : I.id - H.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      c.unstable_now = function() {
        return d.now();
      };
    } else {
      var h = Date, p = h.now();
      c.unstable_now = function() {
        return h.now() - p;
      };
    }
    var v = [], g = [], x = 1, N = null, S = 3, w = !1, R = !1, P = !1, y = typeof setTimeout == "function" ? setTimeout : null, _ = typeof clearTimeout == "function" ? clearTimeout : null, L = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function X(I) {
      for (var H = i(g); H !== null; ) {
        if (H.callback === null) s(g);
        else if (H.startTime <= I) s(g), H.sortIndex = H.expirationTime, n(v, H);
        else break;
        H = i(g);
      }
    }
    function j(I) {
      if (P = !1, X(I), !R) if (i(v) !== null) R = !0, re(W);
      else {
        var H = i(g);
        H !== null && B(j, H.startTime - I);
      }
    }
    function W(I, H) {
      R = !1, P && (P = !1, _(U), U = -1), w = !0;
      var J = S;
      try {
        for (X(H), N = i(v); N !== null && (!(N.expirationTime > H) || I && !oe()); ) {
          var E = N.callback;
          if (typeof E == "function") {
            N.callback = null, S = N.priorityLevel;
            var V = E(N.expirationTime <= H);
            H = c.unstable_now(), typeof V == "function" ? N.callback = V : N === i(v) && s(v), X(H);
          } else s(v);
          N = i(v);
        }
        if (N !== null) var pe = !0;
        else {
          var ue = i(g);
          ue !== null && B(j, ue.startTime - H), pe = !1;
        }
        return pe;
      } finally {
        N = null, S = J, w = !1;
      }
    }
    var Y = !1, M = null, U = -1, O = 5, Q = -1;
    function oe() {
      return !(c.unstable_now() - Q < O);
    }
    function ve() {
      if (M !== null) {
        var I = c.unstable_now();
        Q = I;
        var H = !0;
        try {
          H = M(!0, I);
        } finally {
          H ? le() : (Y = !1, M = null);
        }
      } else Y = !1;
    }
    var le;
    if (typeof L == "function") le = function() {
      L(ve);
    };
    else if (typeof MessageChannel < "u") {
      var se = new MessageChannel(), ie = se.port2;
      se.port1.onmessage = ve, le = function() {
        ie.postMessage(null);
      };
    } else le = function() {
      y(ve, 0);
    };
    function re(I) {
      M = I, Y || (Y = !0, le());
    }
    function B(I, H) {
      U = y(function() {
        I(c.unstable_now());
      }, H);
    }
    c.unstable_IdlePriority = 5, c.unstable_ImmediatePriority = 1, c.unstable_LowPriority = 4, c.unstable_NormalPriority = 3, c.unstable_Profiling = null, c.unstable_UserBlockingPriority = 2, c.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, c.unstable_continueExecution = function() {
      R || w || (R = !0, re(W));
    }, c.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : O = 0 < I ? Math.floor(1e3 / I) : 5;
    }, c.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, c.unstable_getFirstCallbackNode = function() {
      return i(v);
    }, c.unstable_next = function(I) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = S;
      }
      var J = S;
      S = H;
      try {
        return I();
      } finally {
        S = J;
      }
    }, c.unstable_pauseExecution = function() {
    }, c.unstable_requestPaint = function() {
    }, c.unstable_runWithPriority = function(I, H) {
      switch (I) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          I = 3;
      }
      var J = S;
      S = I;
      try {
        return H();
      } finally {
        S = J;
      }
    }, c.unstable_scheduleCallback = function(I, H, J) {
      var E = c.unstable_now();
      switch (typeof J == "object" && J !== null ? (J = J.delay, J = typeof J == "number" && 0 < J ? E + J : E) : J = E, I) {
        case 1:
          var V = -1;
          break;
        case 2:
          V = 250;
          break;
        case 5:
          V = 1073741823;
          break;
        case 4:
          V = 1e4;
          break;
        default:
          V = 5e3;
      }
      return V = J + V, I = { id: x++, callback: H, priorityLevel: I, startTime: J, expirationTime: V, sortIndex: -1 }, J > E ? (I.sortIndex = J, n(g, I), i(v) === null && I === i(g) && (P ? (_(U), U = -1) : P = !0, B(j, J - E))) : (I.sortIndex = V, n(v, I), R || w || (R = !0, re(W))), I;
    }, c.unstable_shouldYield = oe, c.unstable_wrapCallback = function(I) {
      var H = S;
      return function() {
        var J = S;
        S = H;
        try {
          return I.apply(this, arguments);
        } finally {
          S = J;
        }
      };
    };
  })(al)), al;
}
var yc;
function rf() {
  return yc || (yc = 1, ll.exports = nf()), ll.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mc;
function of() {
  if (mc) return st;
  mc = 1;
  var c = ml(), n = rf();
  function i(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var s = /* @__PURE__ */ new Set(), u = {};
  function d(e, t) {
    h(e, t), h(e + "Capture", t);
  }
  function h(e, t) {
    for (u[e] = t, e = 0; e < t.length; e++) s.add(t[e]);
  }
  var p = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), v = Object.prototype.hasOwnProperty, g = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, x = {}, N = {};
  function S(e) {
    return v.call(N, e) ? !0 : v.call(x, e) ? !1 : g.test(e) ? N[e] = !0 : (x[e] = !0, !1);
  }
  function w(e, t, r, o) {
    if (r !== null && r.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : r !== null ? !r.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function R(e, t, r, o) {
    if (t === null || typeof t > "u" || w(e, t, r, o)) return !0;
    if (o) return !1;
    if (r !== null) switch (r.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function P(e, t, r, o, l, a, f) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = o, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = a, this.removeEmptyString = f;
  }
  var y = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    y[e] = new P(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    y[t] = new P(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    y[e] = new P(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    y[e] = new P(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    y[e] = new P(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    y[e] = new P(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    y[e] = new P(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    y[e] = new P(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    y[e] = new P(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var _ = /[\-:]([a-z])/g;
  function L(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      _,
      L
    );
    y[t] = new P(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(_, L);
    y[t] = new P(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(_, L);
    y[t] = new P(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    y[e] = new P(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), y.xlinkHref = new P("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    y[e] = new P(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function X(e, t, r, o) {
    var l = y.hasOwnProperty(t) ? y[t] : null;
    (l !== null ? l.type !== 0 : o || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (R(t, r, l, o) && (r = null), o || l === null ? S(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, o = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, o ? e.setAttributeNS(o, t, r) : e.setAttribute(t, r))));
  }
  var j = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, W = Symbol.for("react.element"), Y = Symbol.for("react.portal"), M = Symbol.for("react.fragment"), U = Symbol.for("react.strict_mode"), O = Symbol.for("react.profiler"), Q = Symbol.for("react.provider"), oe = Symbol.for("react.context"), ve = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), se = Symbol.for("react.suspense_list"), ie = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), B = Symbol.for("react.offscreen"), I = Symbol.iterator;
  function H(e) {
    return e === null || typeof e != "object" ? null : (e = I && e[I] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var J = Object.assign, E;
  function V(e) {
    if (E === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      E = t && t[1] || "";
    }
    return `
` + E + e;
  }
  var pe = !1;
  function ue(e, t) {
    if (!e || pe) return "";
    pe = !0;
    var r = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (F) {
          var o = F;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (F) {
          o = F;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (F) {
          o = F;
        }
        e();
      }
    } catch (F) {
      if (F && o && typeof F.stack == "string") {
        for (var l = F.stack.split(`
`), a = o.stack.split(`
`), f = l.length - 1, m = a.length - 1; 1 <= f && 0 <= m && l[f] !== a[m]; ) m--;
        for (; 1 <= f && 0 <= m; f--, m--) if (l[f] !== a[m]) {
          if (f !== 1 || m !== 1)
            do
              if (f--, m--, 0 > m || l[f] !== a[m]) {
                var T = `
` + l[f].replace(" at new ", " at ");
                return e.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", e.displayName)), T;
              }
            while (1 <= f && 0 <= m);
          break;
        }
      }
    } finally {
      pe = !1, Error.prepareStackTrace = r;
    }
    return (e = e ? e.displayName || e.name : "") ? V(e) : "";
  }
  function xe(e) {
    switch (e.tag) {
      case 5:
        return V(e.type);
      case 16:
        return V("Lazy");
      case 13:
        return V("Suspense");
      case 19:
        return V("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ue(e.type, !1), e;
      case 11:
        return e = ue(e.type.render, !1), e;
      case 1:
        return e = ue(e.type, !0), e;
      default:
        return "";
    }
  }
  function $(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case M:
        return "Fragment";
      case Y:
        return "Portal";
      case O:
        return "Profiler";
      case U:
        return "StrictMode";
      case le:
        return "Suspense";
      case se:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case oe:
        return (e.displayName || "Context") + ".Consumer";
      case Q:
        return (e._context.displayName || "Context") + ".Provider";
      case ve:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case ie:
        return t = e.displayName || null, t !== null ? t : $(e.type) || "Memo";
      case re:
        t = e._payload, e = e._init;
        try {
          return $(e(t));
        } catch {
        }
    }
    return null;
  }
  function Z(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return $(t);
      case 8:
        return t === U ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function te(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function G(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function ge(e) {
    var t = G(e) ? "checked" : "value", r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), o = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
      var l = r.get, a = r.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(f) {
        o = "" + f, a.call(this, f);
      } }), Object.defineProperty(e, t, { enumerable: r.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(f) {
        o = "" + f;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Ce(e) {
    e._valueTracker || (e._valueTracker = ge(e));
  }
  function Re(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), o = "";
    return e && (o = G(e) ? e.checked ? "true" : "false" : e.value), e = o, e !== r ? (t.setValue(e), !0) : !1;
  }
  function Se(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Be(e, t) {
    var r = t.checked;
    return J({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function Et(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, o = t.checked != null ? t.checked : t.defaultChecked;
    r = te(t.value != null ? t.value : r), e._wrapperState = { initialChecked: o, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function un(e, t) {
    t = t.checked, t != null && X(e, "checked", t, !1);
  }
  function En(e, t) {
    un(e, t);
    var r = te(t.value), o = t.type;
    if (r != null) o === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (o === "submit" || o === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? rr(e, t.type, r) : t.hasOwnProperty("defaultValue") && rr(e, t.type, te(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Kr(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var o = t.type;
      if (!(o !== "submit" && o !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function rr(e, t, r) {
    (t !== "number" || Se(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var Ye = Array.isArray;
  function Pn(e, t, r, o) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < r.length; l++) t["$" + r[l]] = !0;
      for (r = 0; r < e.length; r++) l = t.hasOwnProperty("$" + e[r].value), e[r].selected !== l && (e[r].selected = l), l && o && (e[r].defaultSelected = !0);
    } else {
      for (r = "" + te(r), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === r) {
          e[l].selected = !0, o && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function po(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(i(91));
    return J({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Sl(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(i(92));
        if (Ye(r)) {
          if (1 < r.length) throw Error(i(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: te(r) };
  }
  function _l(e, t) {
    var r = te(t.value), o = te(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), o != null && (e.defaultValue = "" + o);
  }
  function Tl(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Cl(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function go(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Cl(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Zr, El = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, o, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, o, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Zr = Zr || document.createElement("div"), Zr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Zr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function ir(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var or = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, td = ["Webkit", "ms", "Moz", "O"];
  Object.keys(or).forEach(function(e) {
    td.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), or[t] = or[e];
    });
  });
  function Pl(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || or.hasOwnProperty(e) && or[e] ? ("" + t).trim() : t + "px";
  }
  function Nl(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var o = r.indexOf("--") === 0, l = Pl(r, t[r], o);
      r === "float" && (r = "cssFloat"), o ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var nd = J({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function vo(e, t) {
    if (t) {
      if (nd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(i(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(i(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(i(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(i(62));
    }
  }
  function yo(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var mo = null;
  function ko(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var xo = null, Nn = null, An = null;
  function Al(e) {
    if (e = Pr(e)) {
      if (typeof xo != "function") throw Error(i(280));
      var t = e.stateNode;
      t && (t = xi(t), xo(e.stateNode, e.type, t));
    }
  }
  function Rl(e) {
    Nn ? An ? An.push(e) : An = [e] : Nn = e;
  }
  function bl() {
    if (Nn) {
      var e = Nn, t = An;
      if (An = Nn = null, Al(e), t) for (e = 0; e < t.length; e++) Al(t[e]);
    }
  }
  function Ll(e, t) {
    return e(t);
  }
  function Ml() {
  }
  var wo = !1;
  function Dl(e, t, r) {
    if (wo) return e(t, r);
    wo = !0;
    try {
      return Ll(e, t, r);
    } finally {
      wo = !1, (Nn !== null || An !== null) && (Ml(), bl());
    }
  }
  function sr(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var o = xi(r);
    if (o === null) return null;
    r = o[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (e = e.type, o = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !o;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (r && typeof r != "function") throw Error(i(231, t, typeof r));
    return r;
  }
  var So = !1;
  if (p) try {
    var lr = {};
    Object.defineProperty(lr, "passive", { get: function() {
      So = !0;
    } }), window.addEventListener("test", lr, lr), window.removeEventListener("test", lr, lr);
  } catch {
    So = !1;
  }
  function rd(e, t, r, o, l, a, f, m, T) {
    var F = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, F);
    } catch (q) {
      this.onError(q);
    }
  }
  var ar = !1, qr = null, Jr = !1, _o = null, id = { onError: function(e) {
    ar = !0, qr = e;
  } };
  function od(e, t, r, o, l, a, f, m, T) {
    ar = !1, qr = null, rd.apply(id, arguments);
  }
  function sd(e, t, r, o, l, a, f, m, T) {
    if (od.apply(this, arguments), ar) {
      if (ar) {
        var F = qr;
        ar = !1, qr = null;
      } else throw Error(i(198));
      Jr || (Jr = !0, _o = F);
    }
  }
  function cn(e) {
    var t = e, r = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (r = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? r : null;
  }
  function Il(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Fl(e) {
    if (cn(e) !== e) throw Error(i(188));
  }
  function ld(e) {
    var t = e.alternate;
    if (!t) {
      if (t = cn(e), t === null) throw Error(i(188));
      return t !== e ? null : e;
    }
    for (var r = e, o = t; ; ) {
      var l = r.return;
      if (l === null) break;
      var a = l.alternate;
      if (a === null) {
        if (o = l.return, o !== null) {
          r = o;
          continue;
        }
        break;
      }
      if (l.child === a.child) {
        for (a = l.child; a; ) {
          if (a === r) return Fl(l), e;
          if (a === o) return Fl(l), t;
          a = a.sibling;
        }
        throw Error(i(188));
      }
      if (r.return !== o.return) r = l, o = a;
      else {
        for (var f = !1, m = l.child; m; ) {
          if (m === r) {
            f = !0, r = l, o = a;
            break;
          }
          if (m === o) {
            f = !0, o = l, r = a;
            break;
          }
          m = m.sibling;
        }
        if (!f) {
          for (m = a.child; m; ) {
            if (m === r) {
              f = !0, r = a, o = l;
              break;
            }
            if (m === o) {
              f = !0, o = a, r = l;
              break;
            }
            m = m.sibling;
          }
          if (!f) throw Error(i(189));
        }
      }
      if (r.alternate !== o) throw Error(i(190));
    }
    if (r.tag !== 3) throw Error(i(188));
    return r.stateNode.current === r ? e : t;
  }
  function zl(e) {
    return e = ld(e), e !== null ? jl(e) : null;
  }
  function jl(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = jl(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ol = n.unstable_scheduleCallback, Bl = n.unstable_cancelCallback, ad = n.unstable_shouldYield, ud = n.unstable_requestPaint, Ie = n.unstable_now, cd = n.unstable_getCurrentPriorityLevel, To = n.unstable_ImmediatePriority, Ul = n.unstable_UserBlockingPriority, ei = n.unstable_NormalPriority, dd = n.unstable_LowPriority, Hl = n.unstable_IdlePriority, ti = null, Pt = null;
  function hd(e) {
    if (Pt && typeof Pt.onCommitFiberRoot == "function") try {
      Pt.onCommitFiberRoot(ti, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var mt = Math.clz32 ? Math.clz32 : gd, fd = Math.log, pd = Math.LN2;
  function gd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (fd(e) / pd | 0) | 0;
  }
  var ni = 64, ri = 4194304;
  function ur(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function ii(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var o = 0, l = e.suspendedLanes, a = e.pingedLanes, f = r & 268435455;
    if (f !== 0) {
      var m = f & ~l;
      m !== 0 ? o = ur(m) : (a &= f, a !== 0 && (o = ur(a)));
    } else f = r & ~l, f !== 0 ? o = ur(f) : a !== 0 && (o = ur(a));
    if (o === 0) return 0;
    if (t !== 0 && t !== o && (t & l) === 0 && (l = o & -o, a = t & -t, l >= a || l === 16 && (a & 4194240) !== 0)) return t;
    if ((o & 4) !== 0 && (o |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= o; 0 < t; ) r = 31 - mt(t), l = 1 << r, o |= e[r], t &= ~l;
    return o;
  }
  function vd(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function yd(e, t) {
    for (var r = e.suspendedLanes, o = e.pingedLanes, l = e.expirationTimes, a = e.pendingLanes; 0 < a; ) {
      var f = 31 - mt(a), m = 1 << f, T = l[f];
      T === -1 ? ((m & r) === 0 || (m & o) !== 0) && (l[f] = vd(m, t)) : T <= t && (e.expiredLanes |= m), a &= ~m;
    }
  }
  function Co(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Vl() {
    var e = ni;
    return ni <<= 1, (ni & 4194240) === 0 && (ni = 64), e;
  }
  function Eo(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function cr(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - mt(t), e[t] = r;
  }
  function md(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var o = e.eventTimes;
    for (e = e.expirationTimes; 0 < r; ) {
      var l = 31 - mt(r), a = 1 << l;
      t[l] = 0, o[l] = -1, e[l] = -1, r &= ~a;
    }
  }
  function Po(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var o = 31 - mt(r), l = 1 << o;
      l & t | e[o] & t && (e[o] |= t), r &= ~l;
    }
  }
  var Ee = 0;
  function Wl(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Xl, No, Yl, $l, Gl, Ao = !1, oi = [], Bt = null, Ut = null, Ht = null, dr = /* @__PURE__ */ new Map(), hr = /* @__PURE__ */ new Map(), Vt = [], kd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ql(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Bt = null;
        break;
      case "dragenter":
      case "dragleave":
        Ut = null;
        break;
      case "mouseover":
      case "mouseout":
        Ht = null;
        break;
      case "pointerover":
      case "pointerout":
        dr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        hr.delete(t.pointerId);
    }
  }
  function fr(e, t, r, o, l, a) {
    return e === null || e.nativeEvent !== a ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: o, nativeEvent: a, targetContainers: [l] }, t !== null && (t = Pr(t), t !== null && No(t)), e) : (e.eventSystemFlags |= o, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function xd(e, t, r, o, l) {
    switch (t) {
      case "focusin":
        return Bt = fr(Bt, e, t, r, o, l), !0;
      case "dragenter":
        return Ut = fr(Ut, e, t, r, o, l), !0;
      case "mouseover":
        return Ht = fr(Ht, e, t, r, o, l), !0;
      case "pointerover":
        var a = l.pointerId;
        return dr.set(a, fr(dr.get(a) || null, e, t, r, o, l)), !0;
      case "gotpointercapture":
        return a = l.pointerId, hr.set(a, fr(hr.get(a) || null, e, t, r, o, l)), !0;
    }
    return !1;
  }
  function Kl(e) {
    var t = dn(e.target);
    if (t !== null) {
      var r = cn(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = Il(r), t !== null) {
            e.blockedOn = t, Gl(e.priority, function() {
              Yl(r);
            });
            return;
          }
        } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function si(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = bo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var o = new r.constructor(r.type, r);
        mo = o, r.target.dispatchEvent(o), mo = null;
      } else return t = Pr(r), t !== null && No(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function Zl(e, t, r) {
    si(e) && r.delete(t);
  }
  function wd() {
    Ao = !1, Bt !== null && si(Bt) && (Bt = null), Ut !== null && si(Ut) && (Ut = null), Ht !== null && si(Ht) && (Ht = null), dr.forEach(Zl), hr.forEach(Zl);
  }
  function pr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ao || (Ao = !0, n.unstable_scheduleCallback(n.unstable_NormalPriority, wd)));
  }
  function gr(e) {
    function t(l) {
      return pr(l, e);
    }
    if (0 < oi.length) {
      pr(oi[0], e);
      for (var r = 1; r < oi.length; r++) {
        var o = oi[r];
        o.blockedOn === e && (o.blockedOn = null);
      }
    }
    for (Bt !== null && pr(Bt, e), Ut !== null && pr(Ut, e), Ht !== null && pr(Ht, e), dr.forEach(t), hr.forEach(t), r = 0; r < Vt.length; r++) o = Vt[r], o.blockedOn === e && (o.blockedOn = null);
    for (; 0 < Vt.length && (r = Vt[0], r.blockedOn === null); ) Kl(r), r.blockedOn === null && Vt.shift();
  }
  var Rn = j.ReactCurrentBatchConfig, li = !0;
  function Sd(e, t, r, o) {
    var l = Ee, a = Rn.transition;
    Rn.transition = null;
    try {
      Ee = 1, Ro(e, t, r, o);
    } finally {
      Ee = l, Rn.transition = a;
    }
  }
  function _d(e, t, r, o) {
    var l = Ee, a = Rn.transition;
    Rn.transition = null;
    try {
      Ee = 4, Ro(e, t, r, o);
    } finally {
      Ee = l, Rn.transition = a;
    }
  }
  function Ro(e, t, r, o) {
    if (li) {
      var l = bo(e, t, r, o);
      if (l === null) Go(e, t, o, ai, r), Ql(e, o);
      else if (xd(l, e, t, r, o)) o.stopPropagation();
      else if (Ql(e, o), t & 4 && -1 < kd.indexOf(e)) {
        for (; l !== null; ) {
          var a = Pr(l);
          if (a !== null && Xl(a), a = bo(e, t, r, o), a === null && Go(e, t, o, ai, r), a === l) break;
          l = a;
        }
        l !== null && o.stopPropagation();
      } else Go(e, t, o, null, r);
    }
  }
  var ai = null;
  function bo(e, t, r, o) {
    if (ai = null, e = ko(o), e = dn(e), e !== null) if (t = cn(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = Il(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return ai = e, null;
  }
  function ql(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (cd()) {
          case To:
            return 1;
          case Ul:
            return 4;
          case ei:
          case dd:
            return 16;
          case Hl:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Wt = null, Lo = null, ui = null;
  function Jl() {
    if (ui) return ui;
    var e, t = Lo, r = t.length, o, l = "value" in Wt ? Wt.value : Wt.textContent, a = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var f = r - e;
    for (o = 1; o <= f && t[r - o] === l[a - o]; o++) ;
    return ui = l.slice(e, 1 < o ? 1 - o : void 0);
  }
  function ci(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function di() {
    return !0;
  }
  function ea() {
    return !1;
  }
  function lt(e) {
    function t(r, o, l, a, f) {
      this._reactName = r, this._targetInst = l, this.type = o, this.nativeEvent = a, this.target = f, this.currentTarget = null;
      for (var m in e) e.hasOwnProperty(m) && (r = e[m], this[m] = r ? r(a) : a[m]);
      return this.isDefaultPrevented = (a.defaultPrevented != null ? a.defaultPrevented : a.returnValue === !1) ? di : ea, this.isPropagationStopped = ea, this;
    }
    return J(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = di);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = di);
    }, persist: function() {
    }, isPersistent: di }), t;
  }
  var bn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Mo = lt(bn), vr = J({}, bn, { view: 0, detail: 0 }), Td = lt(vr), Do, Io, yr, hi = J({}, vr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== yr && (yr && e.type === "mousemove" ? (Do = e.screenX - yr.screenX, Io = e.screenY - yr.screenY) : Io = Do = 0, yr = e), Do);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Io;
  } }), ta = lt(hi), Cd = J({}, hi, { dataTransfer: 0 }), Ed = lt(Cd), Pd = J({}, vr, { relatedTarget: 0 }), Fo = lt(Pd), Nd = J({}, bn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Ad = lt(Nd), Rd = J({}, bn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), bd = lt(Rd), Ld = J({}, bn, { data: 0 }), na = lt(Ld), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Dd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Id = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Fd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Id[e]) ? !!t[e] : !1;
  }
  function zo() {
    return Fd;
  }
  var zd = J({}, vr, { key: function(e) {
    if (e.key) {
      var t = Md[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = ci(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Dd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zo, charCode: function(e) {
    return e.type === "keypress" ? ci(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ci(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), jd = lt(zd), Od = J({}, hi, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ra = lt(Od), Bd = J({}, vr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zo }), Ud = lt(Bd), Hd = J({}, bn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Vd = lt(Hd), Wd = J({}, hi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Xd = lt(Wd), Yd = [9, 13, 27, 32], jo = p && "CompositionEvent" in window, mr = null;
  p && "documentMode" in document && (mr = document.documentMode);
  var $d = p && "TextEvent" in window && !mr, ia = p && (!jo || mr && 8 < mr && 11 >= mr), oa = " ", sa = !1;
  function la(e, t) {
    switch (e) {
      case "keyup":
        return Yd.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function aa(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ln = !1;
  function Gd(e, t) {
    switch (e) {
      case "compositionend":
        return aa(t);
      case "keypress":
        return t.which !== 32 ? null : (sa = !0, oa);
      case "textInput":
        return e = t.data, e === oa && sa ? null : e;
      default:
        return null;
    }
  }
  function Qd(e, t) {
    if (Ln) return e === "compositionend" || !jo && la(e, t) ? (e = Jl(), ui = Lo = Wt = null, Ln = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return ia && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Kd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ua(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Kd[e.type] : t === "textarea";
  }
  function ca(e, t, r, o) {
    Rl(o), t = yi(t, "onChange"), 0 < t.length && (r = new Mo("onChange", "change", null, r, o), e.push({ event: r, listeners: t }));
  }
  var kr = null, xr = null;
  function Zd(e) {
    Na(e, 0);
  }
  function fi(e) {
    var t = zn(e);
    if (Re(t)) return e;
  }
  function qd(e, t) {
    if (e === "change") return t;
  }
  var da = !1;
  if (p) {
    var Oo;
    if (p) {
      var Bo = "oninput" in document;
      if (!Bo) {
        var ha = document.createElement("div");
        ha.setAttribute("oninput", "return;"), Bo = typeof ha.oninput == "function";
      }
      Oo = Bo;
    } else Oo = !1;
    da = Oo && (!document.documentMode || 9 < document.documentMode);
  }
  function fa() {
    kr && (kr.detachEvent("onpropertychange", pa), xr = kr = null);
  }
  function pa(e) {
    if (e.propertyName === "value" && fi(xr)) {
      var t = [];
      ca(t, xr, e, ko(e)), Dl(Zd, t);
    }
  }
  function Jd(e, t, r) {
    e === "focusin" ? (fa(), kr = t, xr = r, kr.attachEvent("onpropertychange", pa)) : e === "focusout" && fa();
  }
  function eh(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return fi(xr);
  }
  function th(e, t) {
    if (e === "click") return fi(t);
  }
  function nh(e, t) {
    if (e === "input" || e === "change") return fi(t);
  }
  function rh(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var kt = typeof Object.is == "function" ? Object.is : rh;
  function wr(e, t) {
    if (kt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), o = Object.keys(t);
    if (r.length !== o.length) return !1;
    for (o = 0; o < r.length; o++) {
      var l = r[o];
      if (!v.call(t, l) || !kt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ga(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function va(e, t) {
    var r = ga(e);
    e = 0;
    for (var o; r; ) {
      if (r.nodeType === 3) {
        if (o = e + r.textContent.length, e <= t && o >= t) return { node: r, offset: t - e };
        e = o;
      }
      e: {
        for (; r; ) {
          if (r.nextSibling) {
            r = r.nextSibling;
            break e;
          }
          r = r.parentNode;
        }
        r = void 0;
      }
      r = ga(r);
    }
  }
  function ya(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ya(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ma() {
    for (var e = window, t = Se(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var r = typeof t.contentWindow.location.href == "string";
      } catch {
        r = !1;
      }
      if (r) e = t.contentWindow;
      else break;
      t = Se(e.document);
    }
    return t;
  }
  function Uo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function ih(e) {
    var t = ma(), r = e.focusedElem, o = e.selectionRange;
    if (t !== r && r && r.ownerDocument && ya(r.ownerDocument.documentElement, r)) {
      if (o !== null && Uo(r)) {
        if (t = o.start, e = o.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, a = Math.min(o.start, l);
          o = o.end === void 0 ? a : Math.min(o.end, l), !e.extend && a > o && (l = o, o = a, a = l), l = va(r, a);
          var f = va(
            r,
            o
          );
          l && f && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== f.node || e.focusOffset !== f.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), a > o ? (e.addRange(t), e.extend(f.node, f.offset)) : (t.setEnd(f.node, f.offset), e.addRange(t)));
        }
      }
      for (t = [], e = r; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var oh = p && "documentMode" in document && 11 >= document.documentMode, Mn = null, Ho = null, Sr = null, Vo = !1;
  function ka(e, t, r) {
    var o = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    Vo || Mn == null || Mn !== Se(o) || (o = Mn, "selectionStart" in o && Uo(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), Sr && wr(Sr, o) || (Sr = o, o = yi(Ho, "onSelect"), 0 < o.length && (t = new Mo("onSelect", "select", null, t, r), e.push({ event: t, listeners: o }), t.target = Mn)));
  }
  function pi(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var Dn = { animationend: pi("Animation", "AnimationEnd"), animationiteration: pi("Animation", "AnimationIteration"), animationstart: pi("Animation", "AnimationStart"), transitionend: pi("Transition", "TransitionEnd") }, Wo = {}, xa = {};
  p && (xa = document.createElement("div").style, "AnimationEvent" in window || (delete Dn.animationend.animation, delete Dn.animationiteration.animation, delete Dn.animationstart.animation), "TransitionEvent" in window || delete Dn.transitionend.transition);
  function gi(e) {
    if (Wo[e]) return Wo[e];
    if (!Dn[e]) return e;
    var t = Dn[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in xa) return Wo[e] = t[r];
    return e;
  }
  var wa = gi("animationend"), Sa = gi("animationiteration"), _a = gi("animationstart"), Ta = gi("transitionend"), Ca = /* @__PURE__ */ new Map(), Ea = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Xt(e, t) {
    Ca.set(e, t), d(t, [e]);
  }
  for (var Xo = 0; Xo < Ea.length; Xo++) {
    var Yo = Ea[Xo], sh = Yo.toLowerCase(), lh = Yo[0].toUpperCase() + Yo.slice(1);
    Xt(sh, "on" + lh);
  }
  Xt(wa, "onAnimationEnd"), Xt(Sa, "onAnimationIteration"), Xt(_a, "onAnimationStart"), Xt("dblclick", "onDoubleClick"), Xt("focusin", "onFocus"), Xt("focusout", "onBlur"), Xt(Ta, "onTransitionEnd"), h("onMouseEnter", ["mouseout", "mouseover"]), h("onMouseLeave", ["mouseout", "mouseover"]), h("onPointerEnter", ["pointerout", "pointerover"]), h("onPointerLeave", ["pointerout", "pointerover"]), d("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), d("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), d("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), d("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), d("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), d("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var _r = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ah = new Set("cancel close invalid load scroll toggle".split(" ").concat(_r));
  function Pa(e, t, r) {
    var o = e.type || "unknown-event";
    e.currentTarget = r, sd(o, t, void 0, e), e.currentTarget = null;
  }
  function Na(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var o = e[r], l = o.event;
      o = o.listeners;
      e: {
        var a = void 0;
        if (t) for (var f = o.length - 1; 0 <= f; f--) {
          var m = o[f], T = m.instance, F = m.currentTarget;
          if (m = m.listener, T !== a && l.isPropagationStopped()) break e;
          Pa(l, m, F), a = T;
        }
        else for (f = 0; f < o.length; f++) {
          if (m = o[f], T = m.instance, F = m.currentTarget, m = m.listener, T !== a && l.isPropagationStopped()) break e;
          Pa(l, m, F), a = T;
        }
      }
    }
    if (Jr) throw e = _o, Jr = !1, _o = null, e;
  }
  function Ne(e, t) {
    var r = t[es];
    r === void 0 && (r = t[es] = /* @__PURE__ */ new Set());
    var o = e + "__bubble";
    r.has(o) || (Aa(t, e, 2, !1), r.add(o));
  }
  function $o(e, t, r) {
    var o = 0;
    t && (o |= 4), Aa(r, e, o, t);
  }
  var vi = "_reactListening" + Math.random().toString(36).slice(2);
  function Tr(e) {
    if (!e[vi]) {
      e[vi] = !0, s.forEach(function(r) {
        r !== "selectionchange" && (ah.has(r) || $o(r, !1, e), $o(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[vi] || (t[vi] = !0, $o("selectionchange", !1, t));
    }
  }
  function Aa(e, t, r, o) {
    switch (ql(t)) {
      case 1:
        var l = Sd;
        break;
      case 4:
        l = _d;
        break;
      default:
        l = Ro;
    }
    r = l.bind(null, t, r, e), l = void 0, !So || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), o ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function Go(e, t, r, o, l) {
    var a = o;
    if ((t & 1) === 0 && (t & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var f = o.tag;
      if (f === 3 || f === 4) {
        var m = o.stateNode.containerInfo;
        if (m === l || m.nodeType === 8 && m.parentNode === l) break;
        if (f === 4) for (f = o.return; f !== null; ) {
          var T = f.tag;
          if ((T === 3 || T === 4) && (T = f.stateNode.containerInfo, T === l || T.nodeType === 8 && T.parentNode === l)) return;
          f = f.return;
        }
        for (; m !== null; ) {
          if (f = dn(m), f === null) return;
          if (T = f.tag, T === 5 || T === 6) {
            o = a = f;
            continue e;
          }
          m = m.parentNode;
        }
      }
      o = o.return;
    }
    Dl(function() {
      var F = a, q = ko(r), ee = [];
      e: {
        var K = Ca.get(e);
        if (K !== void 0) {
          var ae = Mo, de = e;
          switch (e) {
            case "keypress":
              if (ci(r) === 0) break e;
            case "keydown":
            case "keyup":
              ae = jd;
              break;
            case "focusin":
              de = "focus", ae = Fo;
              break;
            case "focusout":
              de = "blur", ae = Fo;
              break;
            case "beforeblur":
            case "afterblur":
              ae = Fo;
              break;
            case "click":
              if (r.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ae = ta;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ae = Ed;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ae = Ud;
              break;
            case wa:
            case Sa:
            case _a:
              ae = Ad;
              break;
            case Ta:
              ae = Vd;
              break;
            case "scroll":
              ae = Td;
              break;
            case "wheel":
              ae = Xd;
              break;
            case "copy":
            case "cut":
            case "paste":
              ae = bd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ae = ra;
          }
          var he = (t & 4) !== 0, Fe = !he && e === "scroll", b = he ? K !== null ? K + "Capture" : null : K;
          he = [];
          for (var A = F, D; A !== null; ) {
            D = A;
            var ne = D.stateNode;
            if (D.tag === 5 && ne !== null && (D = ne, b !== null && (ne = sr(A, b), ne != null && he.push(Cr(A, ne, D)))), Fe) break;
            A = A.return;
          }
          0 < he.length && (K = new ae(K, de, null, r, q), ee.push({ event: K, listeners: he }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (K = e === "mouseover" || e === "pointerover", ae = e === "mouseout" || e === "pointerout", K && r !== mo && (de = r.relatedTarget || r.fromElement) && (dn(de) || de[Lt])) break e;
          if ((ae || K) && (K = q.window === q ? q : (K = q.ownerDocument) ? K.defaultView || K.parentWindow : window, ae ? (de = r.relatedTarget || r.toElement, ae = F, de = de ? dn(de) : null, de !== null && (Fe = cn(de), de !== Fe || de.tag !== 5 && de.tag !== 6) && (de = null)) : (ae = null, de = F), ae !== de)) {
            if (he = ta, ne = "onMouseLeave", b = "onMouseEnter", A = "mouse", (e === "pointerout" || e === "pointerover") && (he = ra, ne = "onPointerLeave", b = "onPointerEnter", A = "pointer"), Fe = ae == null ? K : zn(ae), D = de == null ? K : zn(de), K = new he(ne, A + "leave", ae, r, q), K.target = Fe, K.relatedTarget = D, ne = null, dn(q) === F && (he = new he(b, A + "enter", de, r, q), he.target = D, he.relatedTarget = Fe, ne = he), Fe = ne, ae && de) t: {
              for (he = ae, b = de, A = 0, D = he; D; D = In(D)) A++;
              for (D = 0, ne = b; ne; ne = In(ne)) D++;
              for (; 0 < A - D; ) he = In(he), A--;
              for (; 0 < D - A; ) b = In(b), D--;
              for (; A--; ) {
                if (he === b || b !== null && he === b.alternate) break t;
                he = In(he), b = In(b);
              }
              he = null;
            }
            else he = null;
            ae !== null && Ra(ee, K, ae, he, !1), de !== null && Fe !== null && Ra(ee, Fe, de, he, !0);
          }
        }
        e: {
          if (K = F ? zn(F) : window, ae = K.nodeName && K.nodeName.toLowerCase(), ae === "select" || ae === "input" && K.type === "file") var fe = qd;
          else if (ua(K)) if (da) fe = nh;
          else {
            fe = eh;
            var ye = Jd;
          }
          else (ae = K.nodeName) && ae.toLowerCase() === "input" && (K.type === "checkbox" || K.type === "radio") && (fe = th);
          if (fe && (fe = fe(e, F))) {
            ca(ee, fe, r, q);
            break e;
          }
          ye && ye(e, K, F), e === "focusout" && (ye = K._wrapperState) && ye.controlled && K.type === "number" && rr(K, "number", K.value);
        }
        switch (ye = F ? zn(F) : window, e) {
          case "focusin":
            (ua(ye) || ye.contentEditable === "true") && (Mn = ye, Ho = F, Sr = null);
            break;
          case "focusout":
            Sr = Ho = Mn = null;
            break;
          case "mousedown":
            Vo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Vo = !1, ka(ee, r, q);
            break;
          case "selectionchange":
            if (oh) break;
          case "keydown":
          case "keyup":
            ka(ee, r, q);
        }
        var me;
        if (jo) e: {
          switch (e) {
            case "compositionstart":
              var ke = "onCompositionStart";
              break e;
            case "compositionend":
              ke = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ke = "onCompositionUpdate";
              break e;
          }
          ke = void 0;
        }
        else Ln ? la(e, r) && (ke = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (ke = "onCompositionStart");
        ke && (ia && r.locale !== "ko" && (Ln || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && Ln && (me = Jl()) : (Wt = q, Lo = "value" in Wt ? Wt.value : Wt.textContent, Ln = !0)), ye = yi(F, ke), 0 < ye.length && (ke = new na(ke, e, null, r, q), ee.push({ event: ke, listeners: ye }), me ? ke.data = me : (me = aa(r), me !== null && (ke.data = me)))), (me = $d ? Gd(e, r) : Qd(e, r)) && (F = yi(F, "onBeforeInput"), 0 < F.length && (q = new na("onBeforeInput", "beforeinput", null, r, q), ee.push({ event: q, listeners: F }), q.data = me));
      }
      Na(ee, t);
    });
  }
  function Cr(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function yi(e, t) {
    for (var r = t + "Capture", o = []; e !== null; ) {
      var l = e, a = l.stateNode;
      l.tag === 5 && a !== null && (l = a, a = sr(e, r), a != null && o.unshift(Cr(e, a, l)), a = sr(e, t), a != null && o.push(Cr(e, a, l))), e = e.return;
    }
    return o;
  }
  function In(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ra(e, t, r, o, l) {
    for (var a = t._reactName, f = []; r !== null && r !== o; ) {
      var m = r, T = m.alternate, F = m.stateNode;
      if (T !== null && T === o) break;
      m.tag === 5 && F !== null && (m = F, l ? (T = sr(r, a), T != null && f.unshift(Cr(r, T, m))) : l || (T = sr(r, a), T != null && f.push(Cr(r, T, m)))), r = r.return;
    }
    f.length !== 0 && e.push({ event: t, listeners: f });
  }
  var uh = /\r\n?/g, ch = /\u0000|\uFFFD/g;
  function ba(e) {
    return (typeof e == "string" ? e : "" + e).replace(uh, `
`).replace(ch, "");
  }
  function mi(e, t, r) {
    if (t = ba(t), ba(e) !== t && r) throw Error(i(425));
  }
  function ki() {
  }
  var Qo = null, Ko = null;
  function Zo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var qo = typeof setTimeout == "function" ? setTimeout : void 0, dh = typeof clearTimeout == "function" ? clearTimeout : void 0, La = typeof Promise == "function" ? Promise : void 0, hh = typeof queueMicrotask == "function" ? queueMicrotask : typeof La < "u" ? function(e) {
    return La.resolve(null).then(e).catch(fh);
  } : qo;
  function fh(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Jo(e, t) {
    var r = t, o = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (o === 0) {
          e.removeChild(l), gr(t);
          return;
        }
        o--;
      } else r !== "$" && r !== "$?" && r !== "$!" || o++;
      r = l;
    } while (r);
    gr(t);
  }
  function Yt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function Ma(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var r = e.data;
        if (r === "$" || r === "$!" || r === "$?") {
          if (t === 0) return e;
          t--;
        } else r === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Fn = Math.random().toString(36).slice(2), Nt = "__reactFiber$" + Fn, Er = "__reactProps$" + Fn, Lt = "__reactContainer$" + Fn, es = "__reactEvents$" + Fn, ph = "__reactListeners$" + Fn, gh = "__reactHandles$" + Fn;
  function dn(e) {
    var t = e[Nt];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[Lt] || r[Nt]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Ma(e); e !== null; ) {
          if (r = e[Nt]) return r;
          e = Ma(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function Pr(e) {
    return e = e[Nt] || e[Lt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function zn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(i(33));
  }
  function xi(e) {
    return e[Er] || null;
  }
  var ts = [], jn = -1;
  function $t(e) {
    return { current: e };
  }
  function Ae(e) {
    0 > jn || (e.current = ts[jn], ts[jn] = null, jn--);
  }
  function Pe(e, t) {
    jn++, ts[jn] = e.current, e.current = t;
  }
  var Gt = {}, $e = $t(Gt), tt = $t(!1), hn = Gt;
  function On(e, t) {
    var r = e.type.contextTypes;
    if (!r) return Gt;
    var o = e.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === t) return o.__reactInternalMemoizedMaskedChildContext;
    var l = {}, a;
    for (a in r) l[a] = t[a];
    return o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function nt(e) {
    return e = e.childContextTypes, e != null;
  }
  function wi() {
    Ae(tt), Ae($e);
  }
  function Da(e, t, r) {
    if ($e.current !== Gt) throw Error(i(168));
    Pe($e, t), Pe(tt, r);
  }
  function Ia(e, t, r) {
    var o = e.stateNode;
    if (t = t.childContextTypes, typeof o.getChildContext != "function") return r;
    o = o.getChildContext();
    for (var l in o) if (!(l in t)) throw Error(i(108, Z(e) || "Unknown", l));
    return J({}, r, o);
  }
  function Si(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Gt, hn = $e.current, Pe($e, e), Pe(tt, tt.current), !0;
  }
  function Fa(e, t, r) {
    var o = e.stateNode;
    if (!o) throw Error(i(169));
    r ? (e = Ia(e, t, hn), o.__reactInternalMemoizedMergedChildContext = e, Ae(tt), Ae($e), Pe($e, e)) : Ae(tt), Pe(tt, r);
  }
  var Mt = null, _i = !1, ns = !1;
  function za(e) {
    Mt === null ? Mt = [e] : Mt.push(e);
  }
  function vh(e) {
    _i = !0, za(e);
  }
  function Qt() {
    if (!ns && Mt !== null) {
      ns = !0;
      var e = 0, t = Ee;
      try {
        var r = Mt;
        for (Ee = 1; e < r.length; e++) {
          var o = r[e];
          do
            o = o(!0);
          while (o !== null);
        }
        Mt = null, _i = !1;
      } catch (l) {
        throw Mt !== null && (Mt = Mt.slice(e + 1)), Ol(To, Qt), l;
      } finally {
        Ee = t, ns = !1;
      }
    }
    return null;
  }
  var Bn = [], Un = 0, Ti = null, Ci = 0, ht = [], ft = 0, fn = null, Dt = 1, It = "";
  function pn(e, t) {
    Bn[Un++] = Ci, Bn[Un++] = Ti, Ti = e, Ci = t;
  }
  function ja(e, t, r) {
    ht[ft++] = Dt, ht[ft++] = It, ht[ft++] = fn, fn = e;
    var o = Dt;
    e = It;
    var l = 32 - mt(o) - 1;
    o &= ~(1 << l), r += 1;
    var a = 32 - mt(t) + l;
    if (30 < a) {
      var f = l - l % 5;
      a = (o & (1 << f) - 1).toString(32), o >>= f, l -= f, Dt = 1 << 32 - mt(t) + l | r << l | o, It = a + e;
    } else Dt = 1 << a | r << l | o, It = e;
  }
  function rs(e) {
    e.return !== null && (pn(e, 1), ja(e, 1, 0));
  }
  function is(e) {
    for (; e === Ti; ) Ti = Bn[--Un], Bn[Un] = null, Ci = Bn[--Un], Bn[Un] = null;
    for (; e === fn; ) fn = ht[--ft], ht[ft] = null, It = ht[--ft], ht[ft] = null, Dt = ht[--ft], ht[ft] = null;
  }
  var at = null, ut = null, be = !1, xt = null;
  function Oa(e, t) {
    var r = yt(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Ba(e, t) {
    switch (e.tag) {
      case 5:
        var r = e.type;
        return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, at = e, ut = Yt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, at = e, ut = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (r = fn !== null ? { id: Dt, overflow: It } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = yt(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, at = e, ut = null, !0) : !1;
      default:
        return !1;
    }
  }
  function os(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function ss(e) {
    if (be) {
      var t = ut;
      if (t) {
        var r = t;
        if (!Ba(e, t)) {
          if (os(e)) throw Error(i(418));
          t = Yt(r.nextSibling);
          var o = at;
          t && Ba(e, t) ? Oa(o, r) : (e.flags = e.flags & -4097 | 2, be = !1, at = e);
        }
      } else {
        if (os(e)) throw Error(i(418));
        e.flags = e.flags & -4097 | 2, be = !1, at = e;
      }
    }
  }
  function Ua(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    at = e;
  }
  function Ei(e) {
    if (e !== at) return !1;
    if (!be) return Ua(e), be = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Zo(e.type, e.memoizedProps)), t && (t = ut)) {
      if (os(e)) throw Ha(), Error(i(418));
      for (; t; ) Oa(e, t), t = Yt(t.nextSibling);
    }
    if (Ua(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var r = e.data;
            if (r === "/$") {
              if (t === 0) {
                ut = Yt(e.nextSibling);
                break e;
              }
              t--;
            } else r !== "$" && r !== "$!" && r !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        ut = null;
      }
    } else ut = at ? Yt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ha() {
    for (var e = ut; e; ) e = Yt(e.nextSibling);
  }
  function Hn() {
    ut = at = null, be = !1;
  }
  function ls(e) {
    xt === null ? xt = [e] : xt.push(e);
  }
  var yh = j.ReactCurrentBatchConfig;
  function Nr(e, t, r) {
    if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (r._owner) {
        if (r = r._owner, r) {
          if (r.tag !== 1) throw Error(i(309));
          var o = r.stateNode;
        }
        if (!o) throw Error(i(147, e));
        var l = o, a = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === a ? t.ref : (t = function(f) {
          var m = l.refs;
          f === null ? delete m[a] : m[a] = f;
        }, t._stringRef = a, t);
      }
      if (typeof e != "string") throw Error(i(284));
      if (!r._owner) throw Error(i(290, e));
    }
    return e;
  }
  function Pi(e, t) {
    throw e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Va(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Wa(e) {
    function t(b, A) {
      if (e) {
        var D = b.deletions;
        D === null ? (b.deletions = [A], b.flags |= 16) : D.push(A);
      }
    }
    function r(b, A) {
      if (!e) return null;
      for (; A !== null; ) t(b, A), A = A.sibling;
      return null;
    }
    function o(b, A) {
      for (b = /* @__PURE__ */ new Map(); A !== null; ) A.key !== null ? b.set(A.key, A) : b.set(A.index, A), A = A.sibling;
      return b;
    }
    function l(b, A) {
      return b = rn(b, A), b.index = 0, b.sibling = null, b;
    }
    function a(b, A, D) {
      return b.index = D, e ? (D = b.alternate, D !== null ? (D = D.index, D < A ? (b.flags |= 2, A) : D) : (b.flags |= 2, A)) : (b.flags |= 1048576, A);
    }
    function f(b) {
      return e && b.alternate === null && (b.flags |= 2), b;
    }
    function m(b, A, D, ne) {
      return A === null || A.tag !== 6 ? (A = qs(D, b.mode, ne), A.return = b, A) : (A = l(A, D), A.return = b, A);
    }
    function T(b, A, D, ne) {
      var fe = D.type;
      return fe === M ? q(b, A, D.props.children, ne, D.key) : A !== null && (A.elementType === fe || typeof fe == "object" && fe !== null && fe.$$typeof === re && Va(fe) === A.type) ? (ne = l(A, D.props), ne.ref = Nr(b, A, D), ne.return = b, ne) : (ne = Zi(D.type, D.key, D.props, null, b.mode, ne), ne.ref = Nr(b, A, D), ne.return = b, ne);
    }
    function F(b, A, D, ne) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== D.containerInfo || A.stateNode.implementation !== D.implementation ? (A = Js(D, b.mode, ne), A.return = b, A) : (A = l(A, D.children || []), A.return = b, A);
    }
    function q(b, A, D, ne, fe) {
      return A === null || A.tag !== 7 ? (A = Sn(D, b.mode, ne, fe), A.return = b, A) : (A = l(A, D), A.return = b, A);
    }
    function ee(b, A, D) {
      if (typeof A == "string" && A !== "" || typeof A == "number") return A = qs("" + A, b.mode, D), A.return = b, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case W:
            return D = Zi(A.type, A.key, A.props, null, b.mode, D), D.ref = Nr(b, null, A), D.return = b, D;
          case Y:
            return A = Js(A, b.mode, D), A.return = b, A;
          case re:
            var ne = A._init;
            return ee(b, ne(A._payload), D);
        }
        if (Ye(A) || H(A)) return A = Sn(A, b.mode, D, null), A.return = b, A;
        Pi(b, A);
      }
      return null;
    }
    function K(b, A, D, ne) {
      var fe = A !== null ? A.key : null;
      if (typeof D == "string" && D !== "" || typeof D == "number") return fe !== null ? null : m(b, A, "" + D, ne);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case W:
            return D.key === fe ? T(b, A, D, ne) : null;
          case Y:
            return D.key === fe ? F(b, A, D, ne) : null;
          case re:
            return fe = D._init, K(
              b,
              A,
              fe(D._payload),
              ne
            );
        }
        if (Ye(D) || H(D)) return fe !== null ? null : q(b, A, D, ne, null);
        Pi(b, D);
      }
      return null;
    }
    function ae(b, A, D, ne, fe) {
      if (typeof ne == "string" && ne !== "" || typeof ne == "number") return b = b.get(D) || null, m(A, b, "" + ne, fe);
      if (typeof ne == "object" && ne !== null) {
        switch (ne.$$typeof) {
          case W:
            return b = b.get(ne.key === null ? D : ne.key) || null, T(A, b, ne, fe);
          case Y:
            return b = b.get(ne.key === null ? D : ne.key) || null, F(A, b, ne, fe);
          case re:
            var ye = ne._init;
            return ae(b, A, D, ye(ne._payload), fe);
        }
        if (Ye(ne) || H(ne)) return b = b.get(D) || null, q(A, b, ne, fe, null);
        Pi(A, ne);
      }
      return null;
    }
    function de(b, A, D, ne) {
      for (var fe = null, ye = null, me = A, ke = A = 0, Ve = null; me !== null && ke < D.length; ke++) {
        me.index > ke ? (Ve = me, me = null) : Ve = me.sibling;
        var Te = K(b, me, D[ke], ne);
        if (Te === null) {
          me === null && (me = Ve);
          break;
        }
        e && me && Te.alternate === null && t(b, me), A = a(Te, A, ke), ye === null ? fe = Te : ye.sibling = Te, ye = Te, me = Ve;
      }
      if (ke === D.length) return r(b, me), be && pn(b, ke), fe;
      if (me === null) {
        for (; ke < D.length; ke++) me = ee(b, D[ke], ne), me !== null && (A = a(me, A, ke), ye === null ? fe = me : ye.sibling = me, ye = me);
        return be && pn(b, ke), fe;
      }
      for (me = o(b, me); ke < D.length; ke++) Ve = ae(me, b, ke, D[ke], ne), Ve !== null && (e && Ve.alternate !== null && me.delete(Ve.key === null ? ke : Ve.key), A = a(Ve, A, ke), ye === null ? fe = Ve : ye.sibling = Ve, ye = Ve);
      return e && me.forEach(function(on) {
        return t(b, on);
      }), be && pn(b, ke), fe;
    }
    function he(b, A, D, ne) {
      var fe = H(D);
      if (typeof fe != "function") throw Error(i(150));
      if (D = fe.call(D), D == null) throw Error(i(151));
      for (var ye = fe = null, me = A, ke = A = 0, Ve = null, Te = D.next(); me !== null && !Te.done; ke++, Te = D.next()) {
        me.index > ke ? (Ve = me, me = null) : Ve = me.sibling;
        var on = K(b, me, Te.value, ne);
        if (on === null) {
          me === null && (me = Ve);
          break;
        }
        e && me && on.alternate === null && t(b, me), A = a(on, A, ke), ye === null ? fe = on : ye.sibling = on, ye = on, me = Ve;
      }
      if (Te.done) return r(
        b,
        me
      ), be && pn(b, ke), fe;
      if (me === null) {
        for (; !Te.done; ke++, Te = D.next()) Te = ee(b, Te.value, ne), Te !== null && (A = a(Te, A, ke), ye === null ? fe = Te : ye.sibling = Te, ye = Te);
        return be && pn(b, ke), fe;
      }
      for (me = o(b, me); !Te.done; ke++, Te = D.next()) Te = ae(me, b, ke, Te.value, ne), Te !== null && (e && Te.alternate !== null && me.delete(Te.key === null ? ke : Te.key), A = a(Te, A, ke), ye === null ? fe = Te : ye.sibling = Te, ye = Te);
      return e && me.forEach(function(Kh) {
        return t(b, Kh);
      }), be && pn(b, ke), fe;
    }
    function Fe(b, A, D, ne) {
      if (typeof D == "object" && D !== null && D.type === M && D.key === null && (D = D.props.children), typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case W:
            e: {
              for (var fe = D.key, ye = A; ye !== null; ) {
                if (ye.key === fe) {
                  if (fe = D.type, fe === M) {
                    if (ye.tag === 7) {
                      r(b, ye.sibling), A = l(ye, D.props.children), A.return = b, b = A;
                      break e;
                    }
                  } else if (ye.elementType === fe || typeof fe == "object" && fe !== null && fe.$$typeof === re && Va(fe) === ye.type) {
                    r(b, ye.sibling), A = l(ye, D.props), A.ref = Nr(b, ye, D), A.return = b, b = A;
                    break e;
                  }
                  r(b, ye);
                  break;
                } else t(b, ye);
                ye = ye.sibling;
              }
              D.type === M ? (A = Sn(D.props.children, b.mode, ne, D.key), A.return = b, b = A) : (ne = Zi(D.type, D.key, D.props, null, b.mode, ne), ne.ref = Nr(b, A, D), ne.return = b, b = ne);
            }
            return f(b);
          case Y:
            e: {
              for (ye = D.key; A !== null; ) {
                if (A.key === ye) if (A.tag === 4 && A.stateNode.containerInfo === D.containerInfo && A.stateNode.implementation === D.implementation) {
                  r(b, A.sibling), A = l(A, D.children || []), A.return = b, b = A;
                  break e;
                } else {
                  r(b, A);
                  break;
                }
                else t(b, A);
                A = A.sibling;
              }
              A = Js(D, b.mode, ne), A.return = b, b = A;
            }
            return f(b);
          case re:
            return ye = D._init, Fe(b, A, ye(D._payload), ne);
        }
        if (Ye(D)) return de(b, A, D, ne);
        if (H(D)) return he(b, A, D, ne);
        Pi(b, D);
      }
      return typeof D == "string" && D !== "" || typeof D == "number" ? (D = "" + D, A !== null && A.tag === 6 ? (r(b, A.sibling), A = l(A, D), A.return = b, b = A) : (r(b, A), A = qs(D, b.mode, ne), A.return = b, b = A), f(b)) : r(b, A);
    }
    return Fe;
  }
  var Vn = Wa(!0), Xa = Wa(!1), Ni = $t(null), Ai = null, Wn = null, as = null;
  function us() {
    as = Wn = Ai = null;
  }
  function cs(e) {
    var t = Ni.current;
    Ae(Ni), e._currentValue = t;
  }
  function ds(e, t, r) {
    for (; e !== null; ) {
      var o = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, o !== null && (o.childLanes |= t)) : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function Xn(e, t) {
    Ai = e, as = Wn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (rt = !0), e.firstContext = null);
  }
  function pt(e) {
    var t = e._currentValue;
    if (as !== e) if (e = { context: e, memoizedValue: t, next: null }, Wn === null) {
      if (Ai === null) throw Error(i(308));
      Wn = e, Ai.dependencies = { lanes: 0, firstContext: e };
    } else Wn = Wn.next = e;
    return t;
  }
  var gn = null;
  function hs(e) {
    gn === null ? gn = [e] : gn.push(e);
  }
  function Ya(e, t, r, o) {
    var l = t.interleaved;
    return l === null ? (r.next = r, hs(t)) : (r.next = l.next, l.next = r), t.interleaved = r, Ft(e, o);
  }
  function Ft(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var Kt = !1;
  function fs(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function $a(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function zt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Zt(e, t, r) {
    var o = e.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (_e & 2) !== 0) {
      var l = o.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), o.pending = t, Ft(e, r);
    }
    return l = o.interleaved, l === null ? (t.next = t, hs(o)) : (t.next = l.next, l.next = t), o.interleaved = t, Ft(e, r);
  }
  function Ri(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var o = t.lanes;
      o &= e.pendingLanes, r |= o, t.lanes = r, Po(e, r);
    }
  }
  function Ga(e, t) {
    var r = e.updateQueue, o = e.alternate;
    if (o !== null && (o = o.updateQueue, r === o)) {
      var l = null, a = null;
      if (r = r.firstBaseUpdate, r !== null) {
        do {
          var f = { eventTime: r.eventTime, lane: r.lane, tag: r.tag, payload: r.payload, callback: r.callback, next: null };
          a === null ? l = a = f : a = a.next = f, r = r.next;
        } while (r !== null);
        a === null ? l = a = t : a = a.next = t;
      } else l = a = t;
      r = { baseState: o.baseState, firstBaseUpdate: l, lastBaseUpdate: a, shared: o.shared, effects: o.effects }, e.updateQueue = r;
      return;
    }
    e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
  }
  function bi(e, t, r, o) {
    var l = e.updateQueue;
    Kt = !1;
    var a = l.firstBaseUpdate, f = l.lastBaseUpdate, m = l.shared.pending;
    if (m !== null) {
      l.shared.pending = null;
      var T = m, F = T.next;
      T.next = null, f === null ? a = F : f.next = F, f = T;
      var q = e.alternate;
      q !== null && (q = q.updateQueue, m = q.lastBaseUpdate, m !== f && (m === null ? q.firstBaseUpdate = F : m.next = F, q.lastBaseUpdate = T));
    }
    if (a !== null) {
      var ee = l.baseState;
      f = 0, q = F = T = null, m = a;
      do {
        var K = m.lane, ae = m.eventTime;
        if ((o & K) === K) {
          q !== null && (q = q.next = {
            eventTime: ae,
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          });
          e: {
            var de = e, he = m;
            switch (K = t, ae = r, he.tag) {
              case 1:
                if (de = he.payload, typeof de == "function") {
                  ee = de.call(ae, ee, K);
                  break e;
                }
                ee = de;
                break e;
              case 3:
                de.flags = de.flags & -65537 | 128;
              case 0:
                if (de = he.payload, K = typeof de == "function" ? de.call(ae, ee, K) : de, K == null) break e;
                ee = J({}, ee, K);
                break e;
              case 2:
                Kt = !0;
            }
          }
          m.callback !== null && m.lane !== 0 && (e.flags |= 64, K = l.effects, K === null ? l.effects = [m] : K.push(m));
        } else ae = { eventTime: ae, lane: K, tag: m.tag, payload: m.payload, callback: m.callback, next: null }, q === null ? (F = q = ae, T = ee) : q = q.next = ae, f |= K;
        if (m = m.next, m === null) {
          if (m = l.shared.pending, m === null) break;
          K = m, m = K.next, K.next = null, l.lastBaseUpdate = K, l.shared.pending = null;
        }
      } while (!0);
      if (q === null && (T = ee), l.baseState = T, l.firstBaseUpdate = F, l.lastBaseUpdate = q, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          f |= l.lane, l = l.next;
        while (l !== t);
      } else a === null && (l.shared.lanes = 0);
      mn |= f, e.lanes = f, e.memoizedState = ee;
    }
  }
  function Qa(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var o = e[t], l = o.callback;
      if (l !== null) {
        if (o.callback = null, o = r, typeof l != "function") throw Error(i(191, l));
        l.call(o);
      }
    }
  }
  var Ar = {}, At = $t(Ar), Rr = $t(Ar), br = $t(Ar);
  function vn(e) {
    if (e === Ar) throw Error(i(174));
    return e;
  }
  function ps(e, t) {
    switch (Pe(br, t), Pe(Rr, e), Pe(At, Ar), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : go(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = go(t, e);
    }
    Ae(At), Pe(At, t);
  }
  function Yn() {
    Ae(At), Ae(Rr), Ae(br);
  }
  function Ka(e) {
    vn(br.current);
    var t = vn(At.current), r = go(t, e.type);
    t !== r && (Pe(Rr, e), Pe(At, r));
  }
  function gs(e) {
    Rr.current === e && (Ae(At), Ae(Rr));
  }
  var Le = $t(0);
  function Li(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var r = t.memoizedState;
        if (r !== null && (r = r.dehydrated, r === null || r.data === "$?" || r.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var vs = [];
  function ys() {
    for (var e = 0; e < vs.length; e++) vs[e]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var Mi = j.ReactCurrentDispatcher, ms = j.ReactCurrentBatchConfig, yn = 0, Me = null, je = null, Ue = null, Di = !1, Lr = !1, Mr = 0, mh = 0;
  function Ge() {
    throw Error(i(321));
  }
  function ks(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!kt(e[r], t[r])) return !1;
    return !0;
  }
  function xs(e, t, r, o, l, a) {
    if (yn = a, Me = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Mi.current = e === null || e.memoizedState === null ? Sh : _h, e = r(o, l), Lr) {
      a = 0;
      do {
        if (Lr = !1, Mr = 0, 25 <= a) throw Error(i(301));
        a += 1, Ue = je = null, t.updateQueue = null, Mi.current = Th, e = r(o, l);
      } while (Lr);
    }
    if (Mi.current = zi, t = je !== null && je.next !== null, yn = 0, Ue = je = Me = null, Di = !1, t) throw Error(i(300));
    return e;
  }
  function ws() {
    var e = Mr !== 0;
    return Mr = 0, e;
  }
  function Rt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Ue === null ? Me.memoizedState = Ue = e : Ue = Ue.next = e, Ue;
  }
  function gt() {
    if (je === null) {
      var e = Me.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = je.next;
    var t = Ue === null ? Me.memoizedState : Ue.next;
    if (t !== null) Ue = t, je = e;
    else {
      if (e === null) throw Error(i(310));
      je = e, e = { memoizedState: je.memoizedState, baseState: je.baseState, baseQueue: je.baseQueue, queue: je.queue, next: null }, Ue === null ? Me.memoizedState = Ue = e : Ue = Ue.next = e;
    }
    return Ue;
  }
  function Dr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ss(e) {
    var t = gt(), r = t.queue;
    if (r === null) throw Error(i(311));
    r.lastRenderedReducer = e;
    var o = je, l = o.baseQueue, a = r.pending;
    if (a !== null) {
      if (l !== null) {
        var f = l.next;
        l.next = a.next, a.next = f;
      }
      o.baseQueue = l = a, r.pending = null;
    }
    if (l !== null) {
      a = l.next, o = o.baseState;
      var m = f = null, T = null, F = a;
      do {
        var q = F.lane;
        if ((yn & q) === q) T !== null && (T = T.next = { lane: 0, action: F.action, hasEagerState: F.hasEagerState, eagerState: F.eagerState, next: null }), o = F.hasEagerState ? F.eagerState : e(o, F.action);
        else {
          var ee = {
            lane: q,
            action: F.action,
            hasEagerState: F.hasEagerState,
            eagerState: F.eagerState,
            next: null
          };
          T === null ? (m = T = ee, f = o) : T = T.next = ee, Me.lanes |= q, mn |= q;
        }
        F = F.next;
      } while (F !== null && F !== a);
      T === null ? f = o : T.next = m, kt(o, t.memoizedState) || (rt = !0), t.memoizedState = o, t.baseState = f, t.baseQueue = T, r.lastRenderedState = o;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        a = l.lane, Me.lanes |= a, mn |= a, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function _s(e) {
    var t = gt(), r = t.queue;
    if (r === null) throw Error(i(311));
    r.lastRenderedReducer = e;
    var o = r.dispatch, l = r.pending, a = t.memoizedState;
    if (l !== null) {
      r.pending = null;
      var f = l = l.next;
      do
        a = e(a, f.action), f = f.next;
      while (f !== l);
      kt(a, t.memoizedState) || (rt = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), r.lastRenderedState = a;
    }
    return [a, o];
  }
  function Za() {
  }
  function qa(e, t) {
    var r = Me, o = gt(), l = t(), a = !kt(o.memoizedState, l);
    if (a && (o.memoizedState = l, rt = !0), o = o.queue, Ts(tu.bind(null, r, o, e), [e]), o.getSnapshot !== t || a || Ue !== null && Ue.memoizedState.tag & 1) {
      if (r.flags |= 2048, Ir(9, eu.bind(null, r, o, l, t), void 0, null), He === null) throw Error(i(349));
      (yn & 30) !== 0 || Ja(r, t, l);
    }
    return l;
  }
  function Ja(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = Me.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Me.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function eu(e, t, r, o) {
    t.value = r, t.getSnapshot = o, nu(t) && ru(e);
  }
  function tu(e, t, r) {
    return r(function() {
      nu(t) && ru(e);
    });
  }
  function nu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !kt(e, r);
    } catch {
      return !0;
    }
  }
  function ru(e) {
    var t = Ft(e, 1);
    t !== null && Tt(t, e, 1, -1);
  }
  function iu(e) {
    var t = Rt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Dr, lastRenderedState: e }, t.queue = e, e = e.dispatch = wh.bind(null, Me, e), [t.memoizedState, e];
  }
  function Ir(e, t, r, o) {
    return e = { tag: e, create: t, destroy: r, deps: o, next: null }, t = Me.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Me.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (o = r.next, r.next = e, e.next = o, t.lastEffect = e)), e;
  }
  function ou() {
    return gt().memoizedState;
  }
  function Ii(e, t, r, o) {
    var l = Rt();
    Me.flags |= e, l.memoizedState = Ir(1 | t, r, void 0, o === void 0 ? null : o);
  }
  function Fi(e, t, r, o) {
    var l = gt();
    o = o === void 0 ? null : o;
    var a = void 0;
    if (je !== null) {
      var f = je.memoizedState;
      if (a = f.destroy, o !== null && ks(o, f.deps)) {
        l.memoizedState = Ir(t, r, a, o);
        return;
      }
    }
    Me.flags |= e, l.memoizedState = Ir(1 | t, r, a, o);
  }
  function su(e, t) {
    return Ii(8390656, 8, e, t);
  }
  function Ts(e, t) {
    return Fi(2048, 8, e, t);
  }
  function lu(e, t) {
    return Fi(4, 2, e, t);
  }
  function au(e, t) {
    return Fi(4, 4, e, t);
  }
  function uu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function cu(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Fi(4, 4, uu.bind(null, t, e), r);
  }
  function Cs() {
  }
  function du(e, t) {
    var r = gt();
    t = t === void 0 ? null : t;
    var o = r.memoizedState;
    return o !== null && t !== null && ks(t, o[1]) ? o[0] : (r.memoizedState = [e, t], e);
  }
  function hu(e, t) {
    var r = gt();
    t = t === void 0 ? null : t;
    var o = r.memoizedState;
    return o !== null && t !== null && ks(t, o[1]) ? o[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function fu(e, t, r) {
    return (yn & 21) === 0 ? (e.baseState && (e.baseState = !1, rt = !0), e.memoizedState = r) : (kt(r, t) || (r = Vl(), Me.lanes |= r, mn |= r, e.baseState = !0), t);
  }
  function kh(e, t) {
    var r = Ee;
    Ee = r !== 0 && 4 > r ? r : 4, e(!0);
    var o = ms.transition;
    ms.transition = {};
    try {
      e(!1), t();
    } finally {
      Ee = r, ms.transition = o;
    }
  }
  function pu() {
    return gt().memoizedState;
  }
  function xh(e, t, r) {
    var o = tn(e);
    if (r = { lane: o, action: r, hasEagerState: !1, eagerState: null, next: null }, gu(e)) vu(t, r);
    else if (r = Ya(e, t, r, o), r !== null) {
      var l = qe();
      Tt(r, e, o, l), yu(r, t, o);
    }
  }
  function wh(e, t, r) {
    var o = tn(e), l = { lane: o, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (gu(e)) vu(t, l);
    else {
      var a = e.alternate;
      if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
        var f = t.lastRenderedState, m = a(f, r);
        if (l.hasEagerState = !0, l.eagerState = m, kt(m, f)) {
          var T = t.interleaved;
          T === null ? (l.next = l, hs(t)) : (l.next = T.next, T.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = Ya(e, t, l, o), r !== null && (l = qe(), Tt(r, e, o, l), yu(r, t, o));
    }
  }
  function gu(e) {
    var t = e.alternate;
    return e === Me || t !== null && t === Me;
  }
  function vu(e, t) {
    Lr = Di = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function yu(e, t, r) {
    if ((r & 4194240) !== 0) {
      var o = t.lanes;
      o &= e.pendingLanes, r |= o, t.lanes = r, Po(e, r);
    }
  }
  var zi = { readContext: pt, useCallback: Ge, useContext: Ge, useEffect: Ge, useImperativeHandle: Ge, useInsertionEffect: Ge, useLayoutEffect: Ge, useMemo: Ge, useReducer: Ge, useRef: Ge, useState: Ge, useDebugValue: Ge, useDeferredValue: Ge, useTransition: Ge, useMutableSource: Ge, useSyncExternalStore: Ge, useId: Ge, unstable_isNewReconciler: !1 }, Sh = { readContext: pt, useCallback: function(e, t) {
    return Rt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: pt, useEffect: su, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Ii(
      4194308,
      4,
      uu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return Ii(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Ii(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = Rt();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var o = Rt();
    return t = r !== void 0 ? r(t) : t, o.memoizedState = o.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, o.queue = e, e = e.dispatch = xh.bind(null, Me, e), [o.memoizedState, e];
  }, useRef: function(e) {
    var t = Rt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: iu, useDebugValue: Cs, useDeferredValue: function(e) {
    return Rt().memoizedState = e;
  }, useTransition: function() {
    var e = iu(!1), t = e[0];
    return e = kh.bind(null, e[1]), Rt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var o = Me, l = Rt();
    if (be) {
      if (r === void 0) throw Error(i(407));
      r = r();
    } else {
      if (r = t(), He === null) throw Error(i(349));
      (yn & 30) !== 0 || Ja(o, t, r);
    }
    l.memoizedState = r;
    var a = { value: r, getSnapshot: t };
    return l.queue = a, su(tu.bind(
      null,
      o,
      a,
      e
    ), [e]), o.flags |= 2048, Ir(9, eu.bind(null, o, a, r, t), void 0, null), r;
  }, useId: function() {
    var e = Rt(), t = He.identifierPrefix;
    if (be) {
      var r = It, o = Dt;
      r = (o & ~(1 << 32 - mt(o) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Mr++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = mh++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, _h = {
    readContext: pt,
    useCallback: du,
    useContext: pt,
    useEffect: Ts,
    useImperativeHandle: cu,
    useInsertionEffect: lu,
    useLayoutEffect: au,
    useMemo: hu,
    useReducer: Ss,
    useRef: ou,
    useState: function() {
      return Ss(Dr);
    },
    useDebugValue: Cs,
    useDeferredValue: function(e) {
      var t = gt();
      return fu(t, je.memoizedState, e);
    },
    useTransition: function() {
      var e = Ss(Dr)[0], t = gt().memoizedState;
      return [e, t];
    },
    useMutableSource: Za,
    useSyncExternalStore: qa,
    useId: pu,
    unstable_isNewReconciler: !1
  }, Th = { readContext: pt, useCallback: du, useContext: pt, useEffect: Ts, useImperativeHandle: cu, useInsertionEffect: lu, useLayoutEffect: au, useMemo: hu, useReducer: _s, useRef: ou, useState: function() {
    return _s(Dr);
  }, useDebugValue: Cs, useDeferredValue: function(e) {
    var t = gt();
    return je === null ? t.memoizedState = e : fu(t, je.memoizedState, e);
  }, useTransition: function() {
    var e = _s(Dr)[0], t = gt().memoizedState;
    return [e, t];
  }, useMutableSource: Za, useSyncExternalStore: qa, useId: pu, unstable_isNewReconciler: !1 };
  function wt(e, t) {
    if (e && e.defaultProps) {
      t = J({}, t), e = e.defaultProps;
      for (var r in e) t[r] === void 0 && (t[r] = e[r]);
      return t;
    }
    return t;
  }
  function Es(e, t, r, o) {
    t = e.memoizedState, r = r(o, t), r = r == null ? t : J({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
  }
  var ji = { isMounted: function(e) {
    return (e = e._reactInternals) ? cn(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var o = qe(), l = tn(e), a = zt(o, l);
    a.payload = t, r != null && (a.callback = r), t = Zt(e, a, l), t !== null && (Tt(t, e, l, o), Ri(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var o = qe(), l = tn(e), a = zt(o, l);
    a.tag = 1, a.payload = t, r != null && (a.callback = r), t = Zt(e, a, l), t !== null && (Tt(t, e, l, o), Ri(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = qe(), o = tn(e), l = zt(r, o);
    l.tag = 2, t != null && (l.callback = t), t = Zt(e, l, o), t !== null && (Tt(t, e, o, r), Ri(t, e, o));
  } };
  function mu(e, t, r, o, l, a, f) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(o, a, f) : t.prototype && t.prototype.isPureReactComponent ? !wr(r, o) || !wr(l, a) : !0;
  }
  function ku(e, t, r) {
    var o = !1, l = Gt, a = t.contextType;
    return typeof a == "object" && a !== null ? a = pt(a) : (l = nt(t) ? hn : $e.current, o = t.contextTypes, a = (o = o != null) ? On(e, l) : Gt), t = new t(r, a), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = ji, e.stateNode = t, t._reactInternals = e, o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = a), t;
  }
  function xu(e, t, r, o) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, o), t.state !== e && ji.enqueueReplaceState(t, t.state, null);
  }
  function Ps(e, t, r, o) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, fs(e);
    var a = t.contextType;
    typeof a == "object" && a !== null ? l.context = pt(a) : (a = nt(t) ? hn : $e.current, l.context = On(e, a)), l.state = e.memoizedState, a = t.getDerivedStateFromProps, typeof a == "function" && (Es(e, t, a, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && ji.enqueueReplaceState(l, l.state, null), bi(e, r, l, o), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function $n(e, t) {
    try {
      var r = "", o = t;
      do
        r += xe(o), o = o.return;
      while (o);
      var l = r;
    } catch (a) {
      l = `
Error generating stack: ` + a.message + `
` + a.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ns(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function As(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Ch = typeof WeakMap == "function" ? WeakMap : Map;
  function wu(e, t, r) {
    r = zt(-1, r), r.tag = 3, r.payload = { element: null };
    var o = t.value;
    return r.callback = function() {
      Xi || (Xi = !0, Ws = o), As(e, t);
    }, r;
  }
  function Su(e, t, r) {
    r = zt(-1, r), r.tag = 3;
    var o = e.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var l = t.value;
      r.payload = function() {
        return o(l);
      }, r.callback = function() {
        As(e, t);
      };
    }
    var a = e.stateNode;
    return a !== null && typeof a.componentDidCatch == "function" && (r.callback = function() {
      As(e, t), typeof o != "function" && (Jt === null ? Jt = /* @__PURE__ */ new Set([this]) : Jt.add(this));
      var f = t.stack;
      this.componentDidCatch(t.value, { componentStack: f !== null ? f : "" });
    }), r;
  }
  function _u(e, t, r) {
    var o = e.pingCache;
    if (o === null) {
      o = e.pingCache = new Ch();
      var l = /* @__PURE__ */ new Set();
      o.set(t, l);
    } else l = o.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), o.set(t, l));
    l.has(r) || (l.add(r), e = Oh.bind(null, e, t, r), t.then(e, e));
  }
  function Tu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Cu(e, t, r, o, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = zt(-1, 1), t.tag = 2, Zt(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Eh = j.ReactCurrentOwner, rt = !1;
  function Ze(e, t, r, o) {
    t.child = e === null ? Xa(t, null, r, o) : Vn(t, e.child, r, o);
  }
  function Eu(e, t, r, o, l) {
    r = r.render;
    var a = t.ref;
    return Xn(t, l), o = xs(e, t, r, o, a, l), r = ws(), e !== null && !rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, jt(e, t, l)) : (be && r && rs(t), t.flags |= 1, Ze(e, t, o, l), t.child);
  }
  function Pu(e, t, r, o, l) {
    if (e === null) {
      var a = r.type;
      return typeof a == "function" && !Zs(a) && a.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = a, Nu(e, t, a, o, l)) : (e = Zi(r.type, null, o, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (a = e.child, (e.lanes & l) === 0) {
      var f = a.memoizedProps;
      if (r = r.compare, r = r !== null ? r : wr, r(f, o) && e.ref === t.ref) return jt(e, t, l);
    }
    return t.flags |= 1, e = rn(a, o), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Nu(e, t, r, o, l) {
    if (e !== null) {
      var a = e.memoizedProps;
      if (wr(a, o) && e.ref === t.ref) if (rt = !1, t.pendingProps = o = a, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (rt = !0);
      else return t.lanes = e.lanes, jt(e, t, l);
    }
    return Rs(e, t, r, o, l);
  }
  function Au(e, t, r) {
    var o = t.pendingProps, l = o.children, a = e !== null ? e.memoizedState : null;
    if (o.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Pe(Qn, ct), ct |= r;
    else {
      if ((r & 1073741824) === 0) return e = a !== null ? a.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Pe(Qn, ct), ct |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = a !== null ? a.baseLanes : r, Pe(Qn, ct), ct |= o;
    }
    else a !== null ? (o = a.baseLanes | r, t.memoizedState = null) : o = r, Pe(Qn, ct), ct |= o;
    return Ze(e, t, l, r), t.child;
  }
  function Ru(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Rs(e, t, r, o, l) {
    var a = nt(r) ? hn : $e.current;
    return a = On(t, a), Xn(t, l), r = xs(e, t, r, o, a, l), o = ws(), e !== null && !rt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, jt(e, t, l)) : (be && o && rs(t), t.flags |= 1, Ze(e, t, r, l), t.child);
  }
  function bu(e, t, r, o, l) {
    if (nt(r)) {
      var a = !0;
      Si(t);
    } else a = !1;
    if (Xn(t, l), t.stateNode === null) Bi(e, t), ku(t, r, o), Ps(t, r, o, l), o = !0;
    else if (e === null) {
      var f = t.stateNode, m = t.memoizedProps;
      f.props = m;
      var T = f.context, F = r.contextType;
      typeof F == "object" && F !== null ? F = pt(F) : (F = nt(r) ? hn : $e.current, F = On(t, F));
      var q = r.getDerivedStateFromProps, ee = typeof q == "function" || typeof f.getSnapshotBeforeUpdate == "function";
      ee || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (m !== o || T !== F) && xu(t, f, o, F), Kt = !1;
      var K = t.memoizedState;
      f.state = K, bi(t, o, f, l), T = t.memoizedState, m !== o || K !== T || tt.current || Kt ? (typeof q == "function" && (Es(t, r, q, o), T = t.memoizedState), (m = Kt || mu(t, r, m, o, K, T, F)) ? (ee || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount()), typeof f.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof f.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = o, t.memoizedState = T), f.props = o, f.state = T, f.context = F, o = m) : (typeof f.componentDidMount == "function" && (t.flags |= 4194308), o = !1);
    } else {
      f = t.stateNode, $a(e, t), m = t.memoizedProps, F = t.type === t.elementType ? m : wt(t.type, m), f.props = F, ee = t.pendingProps, K = f.context, T = r.contextType, typeof T == "object" && T !== null ? T = pt(T) : (T = nt(r) ? hn : $e.current, T = On(t, T));
      var ae = r.getDerivedStateFromProps;
      (q = typeof ae == "function" || typeof f.getSnapshotBeforeUpdate == "function") || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (m !== ee || K !== T) && xu(t, f, o, T), Kt = !1, K = t.memoizedState, f.state = K, bi(t, o, f, l);
      var de = t.memoizedState;
      m !== ee || K !== de || tt.current || Kt ? (typeof ae == "function" && (Es(t, r, ae, o), de = t.memoizedState), (F = Kt || mu(t, r, F, o, K, de, T) || !1) ? (q || typeof f.UNSAFE_componentWillUpdate != "function" && typeof f.componentWillUpdate != "function" || (typeof f.componentWillUpdate == "function" && f.componentWillUpdate(o, de, T), typeof f.UNSAFE_componentWillUpdate == "function" && f.UNSAFE_componentWillUpdate(o, de, T)), typeof f.componentDidUpdate == "function" && (t.flags |= 4), typeof f.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof f.componentDidUpdate != "function" || m === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), t.memoizedProps = o, t.memoizedState = de), f.props = o, f.state = de, f.context = T, o = F) : (typeof f.componentDidUpdate != "function" || m === e.memoizedProps && K === e.memoizedState || (t.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && K === e.memoizedState || (t.flags |= 1024), o = !1);
    }
    return bs(e, t, r, o, a, l);
  }
  function bs(e, t, r, o, l, a) {
    Ru(e, t);
    var f = (t.flags & 128) !== 0;
    if (!o && !f) return l && Fa(t, r, !1), jt(e, t, a);
    o = t.stateNode, Eh.current = t;
    var m = f && typeof r.getDerivedStateFromError != "function" ? null : o.render();
    return t.flags |= 1, e !== null && f ? (t.child = Vn(t, e.child, null, a), t.child = Vn(t, null, m, a)) : Ze(e, t, m, a), t.memoizedState = o.state, l && Fa(t, r, !0), t.child;
  }
  function Lu(e) {
    var t = e.stateNode;
    t.pendingContext ? Da(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Da(e, t.context, !1), ps(e, t.containerInfo);
  }
  function Mu(e, t, r, o, l) {
    return Hn(), ls(l), t.flags |= 256, Ze(e, t, r, o), t.child;
  }
  var Ls = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ms(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Du(e, t, r) {
    var o = t.pendingProps, l = Le.current, a = !1, f = (t.flags & 128) !== 0, m;
    if ((m = f) || (m = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), m ? (a = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), Pe(Le, l & 1), e === null)
      return ss(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (f = o.children, e = o.fallback, a ? (o = t.mode, a = t.child, f = { mode: "hidden", children: f }, (o & 1) === 0 && a !== null ? (a.childLanes = 0, a.pendingProps = f) : a = qi(f, o, 0, null), e = Sn(e, o, r, null), a.return = t, e.return = t, a.sibling = e, t.child = a, t.child.memoizedState = Ms(r), t.memoizedState = Ls, e) : Ds(t, f));
    if (l = e.memoizedState, l !== null && (m = l.dehydrated, m !== null)) return Ph(e, t, f, o, m, l, r);
    if (a) {
      a = o.fallback, f = t.mode, l = e.child, m = l.sibling;
      var T = { mode: "hidden", children: o.children };
      return (f & 1) === 0 && t.child !== l ? (o = t.child, o.childLanes = 0, o.pendingProps = T, t.deletions = null) : (o = rn(l, T), o.subtreeFlags = l.subtreeFlags & 14680064), m !== null ? a = rn(m, a) : (a = Sn(a, f, r, null), a.flags |= 2), a.return = t, o.return = t, o.sibling = a, t.child = o, o = a, a = t.child, f = e.child.memoizedState, f = f === null ? Ms(r) : { baseLanes: f.baseLanes | r, cachePool: null, transitions: f.transitions }, a.memoizedState = f, a.childLanes = e.childLanes & ~r, t.memoizedState = Ls, o;
    }
    return a = e.child, e = a.sibling, o = rn(a, { mode: "visible", children: o.children }), (t.mode & 1) === 0 && (o.lanes = r), o.return = t, o.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = o, t.memoizedState = null, o;
  }
  function Ds(e, t) {
    return t = qi({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Oi(e, t, r, o) {
    return o !== null && ls(o), Vn(t, e.child, null, r), e = Ds(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Ph(e, t, r, o, l, a, f) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, o = Ns(Error(i(422))), Oi(e, t, f, o)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (a = o.fallback, l = t.mode, o = qi({ mode: "visible", children: o.children }, l, 0, null), a = Sn(a, l, f, null), a.flags |= 2, o.return = t, a.return = t, o.sibling = a, t.child = o, (t.mode & 1) !== 0 && Vn(t, e.child, null, f), t.child.memoizedState = Ms(f), t.memoizedState = Ls, a);
    if ((t.mode & 1) === 0) return Oi(e, t, f, null);
    if (l.data === "$!") {
      if (o = l.nextSibling && l.nextSibling.dataset, o) var m = o.dgst;
      return o = m, a = Error(i(419)), o = Ns(a, o, void 0), Oi(e, t, f, o);
    }
    if (m = (f & e.childLanes) !== 0, rt || m) {
      if (o = He, o !== null) {
        switch (f & -f) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (o.suspendedLanes | f)) !== 0 ? 0 : l, l !== 0 && l !== a.retryLane && (a.retryLane = l, Ft(e, l), Tt(o, e, l, -1));
      }
      return Ks(), o = Ns(Error(i(421))), Oi(e, t, f, o);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Bh.bind(null, e), l._reactRetry = t, null) : (e = a.treeContext, ut = Yt(l.nextSibling), at = t, be = !0, xt = null, e !== null && (ht[ft++] = Dt, ht[ft++] = It, ht[ft++] = fn, Dt = e.id, It = e.overflow, fn = t), t = Ds(t, o.children), t.flags |= 4096, t);
  }
  function Iu(e, t, r) {
    e.lanes |= t;
    var o = e.alternate;
    o !== null && (o.lanes |= t), ds(e.return, t, r);
  }
  function Is(e, t, r, o, l) {
    var a = e.memoizedState;
    a === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: o, tail: r, tailMode: l } : (a.isBackwards = t, a.rendering = null, a.renderingStartTime = 0, a.last = o, a.tail = r, a.tailMode = l);
  }
  function Fu(e, t, r) {
    var o = t.pendingProps, l = o.revealOrder, a = o.tail;
    if (Ze(e, t, o.children, r), o = Le.current, (o & 2) !== 0) o = o & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Iu(e, r, t);
        else if (e.tag === 19) Iu(e, r, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      o &= 1;
    }
    if (Pe(Le, o), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Li(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), Is(t, !1, l, r, a);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Li(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        Is(t, !0, r, null, a);
        break;
      case "together":
        Is(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Bi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function jt(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), mn |= t.lanes, (r & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(i(153));
    if (t.child !== null) {
      for (e = t.child, r = rn(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = rn(e, e.pendingProps), r.return = t;
      r.sibling = null;
    }
    return t.child;
  }
  function Nh(e, t, r) {
    switch (t.tag) {
      case 3:
        Lu(t), Hn();
        break;
      case 5:
        Ka(t);
        break;
      case 1:
        nt(t.type) && Si(t);
        break;
      case 4:
        ps(t, t.stateNode.containerInfo);
        break;
      case 10:
        var o = t.type._context, l = t.memoizedProps.value;
        Pe(Ni, o._currentValue), o._currentValue = l;
        break;
      case 13:
        if (o = t.memoizedState, o !== null)
          return o.dehydrated !== null ? (Pe(Le, Le.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Du(e, t, r) : (Pe(Le, Le.current & 1), e = jt(e, t, r), e !== null ? e.sibling : null);
        Pe(Le, Le.current & 1);
        break;
      case 19:
        if (o = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (o) return Fu(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), Pe(Le, Le.current), o) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Au(e, t, r);
    }
    return jt(e, t, r);
  }
  var zu, Fs, ju, Ou;
  zu = function(e, t) {
    for (var r = t.child; r !== null; ) {
      if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode);
      else if (r.tag !== 4 && r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === t) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === t) return;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
  }, Fs = function() {
  }, ju = function(e, t, r, o) {
    var l = e.memoizedProps;
    if (l !== o) {
      e = t.stateNode, vn(At.current);
      var a = null;
      switch (r) {
        case "input":
          l = Be(e, l), o = Be(e, o), a = [];
          break;
        case "select":
          l = J({}, l, { value: void 0 }), o = J({}, o, { value: void 0 }), a = [];
          break;
        case "textarea":
          l = po(e, l), o = po(e, o), a = [];
          break;
        default:
          typeof l.onClick != "function" && typeof o.onClick == "function" && (e.onclick = ki);
      }
      vo(r, o);
      var f;
      r = null;
      for (F in l) if (!o.hasOwnProperty(F) && l.hasOwnProperty(F) && l[F] != null) if (F === "style") {
        var m = l[F];
        for (f in m) m.hasOwnProperty(f) && (r || (r = {}), r[f] = "");
      } else F !== "dangerouslySetInnerHTML" && F !== "children" && F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && F !== "autoFocus" && (u.hasOwnProperty(F) ? a || (a = []) : (a = a || []).push(F, null));
      for (F in o) {
        var T = o[F];
        if (m = l != null ? l[F] : void 0, o.hasOwnProperty(F) && T !== m && (T != null || m != null)) if (F === "style") if (m) {
          for (f in m) !m.hasOwnProperty(f) || T && T.hasOwnProperty(f) || (r || (r = {}), r[f] = "");
          for (f in T) T.hasOwnProperty(f) && m[f] !== T[f] && (r || (r = {}), r[f] = T[f]);
        } else r || (a || (a = []), a.push(
          F,
          r
        )), r = T;
        else F === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, m = m ? m.__html : void 0, T != null && m !== T && (a = a || []).push(F, T)) : F === "children" ? typeof T != "string" && typeof T != "number" || (a = a || []).push(F, "" + T) : F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && (u.hasOwnProperty(F) ? (T != null && F === "onScroll" && Ne("scroll", e), a || m === T || (a = [])) : (a = a || []).push(F, T));
      }
      r && (a = a || []).push("style", r);
      var F = a;
      (t.updateQueue = F) && (t.flags |= 4);
    }
  }, Ou = function(e, t, r, o) {
    r !== o && (t.flags |= 4);
  };
  function Fr(e, t) {
    if (!be) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var r = null; t !== null; ) t.alternate !== null && (r = t), t = t.sibling;
        r === null ? e.tail = null : r.sibling = null;
        break;
      case "collapsed":
        r = e.tail;
        for (var o = null; r !== null; ) r.alternate !== null && (o = r), r = r.sibling;
        o === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : o.sibling = null;
    }
  }
  function Qe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, r = 0, o = 0;
    if (t) for (var l = e.child; l !== null; ) r |= l.lanes | l.childLanes, o |= l.subtreeFlags & 14680064, o |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) r |= l.lanes | l.childLanes, o |= l.subtreeFlags, o |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= o, e.childLanes = r, t;
  }
  function Ah(e, t, r) {
    var o = t.pendingProps;
    switch (is(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Qe(t), null;
      case 1:
        return nt(t.type) && wi(), Qe(t), null;
      case 3:
        return o = t.stateNode, Yn(), Ae(tt), Ae($e), ys(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (e === null || e.child === null) && (Ei(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, xt !== null && ($s(xt), xt = null))), Fs(e, t), Qe(t), null;
      case 5:
        gs(t);
        var l = vn(br.current);
        if (r = t.type, e !== null && t.stateNode != null) ju(e, t, r, o, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!o) {
            if (t.stateNode === null) throw Error(i(166));
            return Qe(t), null;
          }
          if (e = vn(At.current), Ei(t)) {
            o = t.stateNode, r = t.type;
            var a = t.memoizedProps;
            switch (o[Nt] = t, o[Er] = a, e = (t.mode & 1) !== 0, r) {
              case "dialog":
                Ne("cancel", o), Ne("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ne("load", o);
                break;
              case "video":
              case "audio":
                for (l = 0; l < _r.length; l++) Ne(_r[l], o);
                break;
              case "source":
                Ne("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Ne(
                  "error",
                  o
                ), Ne("load", o);
                break;
              case "details":
                Ne("toggle", o);
                break;
              case "input":
                Et(o, a), Ne("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!a.multiple }, Ne("invalid", o);
                break;
              case "textarea":
                Sl(o, a), Ne("invalid", o);
            }
            vo(r, a), l = null;
            for (var f in a) if (a.hasOwnProperty(f)) {
              var m = a[f];
              f === "children" ? typeof m == "string" ? o.textContent !== m && (a.suppressHydrationWarning !== !0 && mi(o.textContent, m, e), l = ["children", m]) : typeof m == "number" && o.textContent !== "" + m && (a.suppressHydrationWarning !== !0 && mi(
                o.textContent,
                m,
                e
              ), l = ["children", "" + m]) : u.hasOwnProperty(f) && m != null && f === "onScroll" && Ne("scroll", o);
            }
            switch (r) {
              case "input":
                Ce(o), Kr(o, a, !0);
                break;
              case "textarea":
                Ce(o), Tl(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof a.onClick == "function" && (o.onclick = ki);
            }
            o = l, t.updateQueue = o, o !== null && (t.flags |= 4);
          } else {
            f = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Cl(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = f.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof o.is == "string" ? e = f.createElement(r, { is: o.is }) : (e = f.createElement(r), r === "select" && (f = e, o.multiple ? f.multiple = !0 : o.size && (f.size = o.size))) : e = f.createElementNS(e, r), e[Nt] = t, e[Er] = o, zu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (f = yo(r, o), r) {
                case "dialog":
                  Ne("cancel", e), Ne("close", e), l = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ne("load", e), l = o;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < _r.length; l++) Ne(_r[l], e);
                  l = o;
                  break;
                case "source":
                  Ne("error", e), l = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Ne(
                    "error",
                    e
                  ), Ne("load", e), l = o;
                  break;
                case "details":
                  Ne("toggle", e), l = o;
                  break;
                case "input":
                  Et(e, o), l = Be(e, o), Ne("invalid", e);
                  break;
                case "option":
                  l = o;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!o.multiple }, l = J({}, o, { value: void 0 }), Ne("invalid", e);
                  break;
                case "textarea":
                  Sl(e, o), l = po(e, o), Ne("invalid", e);
                  break;
                default:
                  l = o;
              }
              vo(r, l), m = l;
              for (a in m) if (m.hasOwnProperty(a)) {
                var T = m[a];
                a === "style" ? Nl(e, T) : a === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && El(e, T)) : a === "children" ? typeof T == "string" ? (r !== "textarea" || T !== "") && ir(e, T) : typeof T == "number" && ir(e, "" + T) : a !== "suppressContentEditableWarning" && a !== "suppressHydrationWarning" && a !== "autoFocus" && (u.hasOwnProperty(a) ? T != null && a === "onScroll" && Ne("scroll", e) : T != null && X(e, a, T, f));
              }
              switch (r) {
                case "input":
                  Ce(e), Kr(e, o, !1);
                  break;
                case "textarea":
                  Ce(e), Tl(e);
                  break;
                case "option":
                  o.value != null && e.setAttribute("value", "" + te(o.value));
                  break;
                case "select":
                  e.multiple = !!o.multiple, a = o.value, a != null ? Pn(e, !!o.multiple, a, !1) : o.defaultValue != null && Pn(
                    e,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = ki);
              }
              switch (r) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Qe(t), null;
      case 6:
        if (e && t.stateNode != null) Ou(e, t, e.memoizedProps, o);
        else {
          if (typeof o != "string" && t.stateNode === null) throw Error(i(166));
          if (r = vn(br.current), vn(At.current), Ei(t)) {
            if (o = t.stateNode, r = t.memoizedProps, o[Nt] = t, (a = o.nodeValue !== r) && (e = at, e !== null)) switch (e.tag) {
              case 3:
                mi(o.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && mi(o.nodeValue, r, (e.mode & 1) !== 0);
            }
            a && (t.flags |= 4);
          } else o = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(o), o[Nt] = t, t.stateNode = o;
        }
        return Qe(t), null;
      case 13:
        if (Ae(Le), o = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (be && ut !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Ha(), Hn(), t.flags |= 98560, a = !1;
          else if (a = Ei(t), o !== null && o.dehydrated !== null) {
            if (e === null) {
              if (!a) throw Error(i(318));
              if (a = t.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(i(317));
              a[Nt] = t;
            } else Hn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Qe(t), a = !1;
          } else xt !== null && ($s(xt), xt = null), a = !0;
          if (!a) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (o = o !== null, o !== (e !== null && e.memoizedState !== null) && o && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Le.current & 1) !== 0 ? Oe === 0 && (Oe = 3) : Ks())), t.updateQueue !== null && (t.flags |= 4), Qe(t), null);
      case 4:
        return Yn(), Fs(e, t), e === null && Tr(t.stateNode.containerInfo), Qe(t), null;
      case 10:
        return cs(t.type._context), Qe(t), null;
      case 17:
        return nt(t.type) && wi(), Qe(t), null;
      case 19:
        if (Ae(Le), a = t.memoizedState, a === null) return Qe(t), null;
        if (o = (t.flags & 128) !== 0, f = a.rendering, f === null) if (o) Fr(a, !1);
        else {
          if (Oe !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (f = Li(e), f !== null) {
              for (t.flags |= 128, Fr(a, !1), o = f.updateQueue, o !== null && (t.updateQueue = o, t.flags |= 4), t.subtreeFlags = 0, o = r, r = t.child; r !== null; ) a = r, e = o, a.flags &= 14680066, f = a.alternate, f === null ? (a.childLanes = 0, a.lanes = e, a.child = null, a.subtreeFlags = 0, a.memoizedProps = null, a.memoizedState = null, a.updateQueue = null, a.dependencies = null, a.stateNode = null) : (a.childLanes = f.childLanes, a.lanes = f.lanes, a.child = f.child, a.subtreeFlags = 0, a.deletions = null, a.memoizedProps = f.memoizedProps, a.memoizedState = f.memoizedState, a.updateQueue = f.updateQueue, a.type = f.type, e = f.dependencies, a.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return Pe(Le, Le.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          a.tail !== null && Ie() > Kn && (t.flags |= 128, o = !0, Fr(a, !1), t.lanes = 4194304);
        }
        else {
          if (!o) if (e = Li(f), e !== null) {
            if (t.flags |= 128, o = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Fr(a, !0), a.tail === null && a.tailMode === "hidden" && !f.alternate && !be) return Qe(t), null;
          } else 2 * Ie() - a.renderingStartTime > Kn && r !== 1073741824 && (t.flags |= 128, o = !0, Fr(a, !1), t.lanes = 4194304);
          a.isBackwards ? (f.sibling = t.child, t.child = f) : (r = a.last, r !== null ? r.sibling = f : t.child = f, a.last = f);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Ie(), t.sibling = null, r = Le.current, Pe(Le, o ? r & 1 | 2 : r & 1), t) : (Qe(t), null);
      case 22:
      case 23:
        return Qs(), o = t.memoizedState !== null, e !== null && e.memoizedState !== null !== o && (t.flags |= 8192), o && (t.mode & 1) !== 0 ? (ct & 1073741824) !== 0 && (Qe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Qe(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(i(156, t.tag));
  }
  function Rh(e, t) {
    switch (is(t), t.tag) {
      case 1:
        return nt(t.type) && wi(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Yn(), Ae(tt), Ae($e), ys(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return gs(t), null;
      case 13:
        if (Ae(Le), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(i(340));
          Hn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Ae(Le), null;
      case 4:
        return Yn(), null;
      case 10:
        return cs(t.type._context), null;
      case 22:
      case 23:
        return Qs(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ui = !1, Ke = !1, bh = typeof WeakSet == "function" ? WeakSet : Set, ce = null;
  function Gn(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (o) {
      De(e, t, o);
    }
    else r.current = null;
  }
  function zs(e, t, r) {
    try {
      r();
    } catch (o) {
      De(e, t, o);
    }
  }
  var Bu = !1;
  function Lh(e, t) {
    if (Qo = li, e = ma(), Uo(e)) {
      if ("selectionStart" in e) var r = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        r = (r = e.ownerDocument) && r.defaultView || window;
        var o = r.getSelection && r.getSelection();
        if (o && o.rangeCount !== 0) {
          r = o.anchorNode;
          var l = o.anchorOffset, a = o.focusNode;
          o = o.focusOffset;
          try {
            r.nodeType, a.nodeType;
          } catch {
            r = null;
            break e;
          }
          var f = 0, m = -1, T = -1, F = 0, q = 0, ee = e, K = null;
          t: for (; ; ) {
            for (var ae; ee !== r || l !== 0 && ee.nodeType !== 3 || (m = f + l), ee !== a || o !== 0 && ee.nodeType !== 3 || (T = f + o), ee.nodeType === 3 && (f += ee.nodeValue.length), (ae = ee.firstChild) !== null; )
              K = ee, ee = ae;
            for (; ; ) {
              if (ee === e) break t;
              if (K === r && ++F === l && (m = f), K === a && ++q === o && (T = f), (ae = ee.nextSibling) !== null) break;
              ee = K, K = ee.parentNode;
            }
            ee = ae;
          }
          r = m === -1 || T === -1 ? null : { start: m, end: T };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (Ko = { focusedElem: e, selectionRange: r }, li = !1, ce = t; ce !== null; ) if (t = ce, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, ce = e;
    else for (; ce !== null; ) {
      t = ce;
      try {
        var de = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (de !== null) {
              var he = de.memoizedProps, Fe = de.memoizedState, b = t.stateNode, A = b.getSnapshotBeforeUpdate(t.elementType === t.type ? he : wt(t.type, he), Fe);
              b.__reactInternalSnapshotBeforeUpdate = A;
            }
            break;
          case 3:
            var D = t.stateNode.containerInfo;
            D.nodeType === 1 ? D.textContent = "" : D.nodeType === 9 && D.documentElement && D.removeChild(D.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(i(163));
        }
      } catch (ne) {
        De(t, t.return, ne);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, ce = e;
        break;
      }
      ce = t.return;
    }
    return de = Bu, Bu = !1, de;
  }
  function zr(e, t, r) {
    var o = t.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var l = o = o.next;
      do {
        if ((l.tag & e) === e) {
          var a = l.destroy;
          l.destroy = void 0, a !== void 0 && zs(t, r, a);
        }
        l = l.next;
      } while (l !== o);
    }
  }
  function Hi(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var r = t = t.next;
      do {
        if ((r.tag & e) === e) {
          var o = r.create;
          r.destroy = o();
        }
        r = r.next;
      } while (r !== t);
    }
  }
  function js(e) {
    var t = e.ref;
    if (t !== null) {
      var r = e.stateNode;
      switch (e.tag) {
        case 5:
          e = r;
          break;
        default:
          e = r;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function Uu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Uu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Nt], delete t[Er], delete t[es], delete t[ph], delete t[gh])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Hu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Vu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Hu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Os(e, t, r) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = ki));
    else if (o !== 4 && (e = e.child, e !== null)) for (Os(e, t, r), e = e.sibling; e !== null; ) Os(e, t, r), e = e.sibling;
  }
  function Bs(e, t, r) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (o !== 4 && (e = e.child, e !== null)) for (Bs(e, t, r), e = e.sibling; e !== null; ) Bs(e, t, r), e = e.sibling;
  }
  var We = null, St = !1;
  function qt(e, t, r) {
    for (r = r.child; r !== null; ) Wu(e, t, r), r = r.sibling;
  }
  function Wu(e, t, r) {
    if (Pt && typeof Pt.onCommitFiberUnmount == "function") try {
      Pt.onCommitFiberUnmount(ti, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        Ke || Gn(r, t);
      case 6:
        var o = We, l = St;
        We = null, qt(e, t, r), We = o, St = l, We !== null && (St ? (e = We, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : We.removeChild(r.stateNode));
        break;
      case 18:
        We !== null && (St ? (e = We, r = r.stateNode, e.nodeType === 8 ? Jo(e.parentNode, r) : e.nodeType === 1 && Jo(e, r), gr(e)) : Jo(We, r.stateNode));
        break;
      case 4:
        o = We, l = St, We = r.stateNode.containerInfo, St = !0, qt(e, t, r), We = o, St = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Ke && (o = r.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          l = o = o.next;
          do {
            var a = l, f = a.destroy;
            a = a.tag, f !== void 0 && ((a & 2) !== 0 || (a & 4) !== 0) && zs(r, t, f), l = l.next;
          } while (l !== o);
        }
        qt(e, t, r);
        break;
      case 1:
        if (!Ke && (Gn(r, t), o = r.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = r.memoizedProps, o.state = r.memoizedState, o.componentWillUnmount();
        } catch (m) {
          De(r, t, m);
        }
        qt(e, t, r);
        break;
      case 21:
        qt(e, t, r);
        break;
      case 22:
        r.mode & 1 ? (Ke = (o = Ke) || r.memoizedState !== null, qt(e, t, r), Ke = o) : qt(e, t, r);
        break;
      default:
        qt(e, t, r);
    }
  }
  function Xu(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var r = e.stateNode;
      r === null && (r = e.stateNode = new bh()), t.forEach(function(o) {
        var l = Uh.bind(null, e, o);
        r.has(o) || (r.add(o), o.then(l, l));
      });
    }
  }
  function _t(e, t) {
    var r = t.deletions;
    if (r !== null) for (var o = 0; o < r.length; o++) {
      var l = r[o];
      try {
        var a = e, f = t, m = f;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 5:
              We = m.stateNode, St = !1;
              break e;
            case 3:
              We = m.stateNode.containerInfo, St = !0;
              break e;
            case 4:
              We = m.stateNode.containerInfo, St = !0;
              break e;
          }
          m = m.return;
        }
        if (We === null) throw Error(i(160));
        Wu(a, f, l), We = null, St = !1;
        var T = l.alternate;
        T !== null && (T.return = null), l.return = null;
      } catch (F) {
        De(l, t, F);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Yu(t, e), t = t.sibling;
  }
  function Yu(e, t) {
    var r = e.alternate, o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (_t(t, e), bt(e), o & 4) {
          try {
            zr(3, e, e.return), Hi(3, e);
          } catch (he) {
            De(e, e.return, he);
          }
          try {
            zr(5, e, e.return);
          } catch (he) {
            De(e, e.return, he);
          }
        }
        break;
      case 1:
        _t(t, e), bt(e), o & 512 && r !== null && Gn(r, r.return);
        break;
      case 5:
        if (_t(t, e), bt(e), o & 512 && r !== null && Gn(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            ir(l, "");
          } catch (he) {
            De(e, e.return, he);
          }
        }
        if (o & 4 && (l = e.stateNode, l != null)) {
          var a = e.memoizedProps, f = r !== null ? r.memoizedProps : a, m = e.type, T = e.updateQueue;
          if (e.updateQueue = null, T !== null) try {
            m === "input" && a.type === "radio" && a.name != null && un(l, a), yo(m, f);
            var F = yo(m, a);
            for (f = 0; f < T.length; f += 2) {
              var q = T[f], ee = T[f + 1];
              q === "style" ? Nl(l, ee) : q === "dangerouslySetInnerHTML" ? El(l, ee) : q === "children" ? ir(l, ee) : X(l, q, ee, F);
            }
            switch (m) {
              case "input":
                En(l, a);
                break;
              case "textarea":
                _l(l, a);
                break;
              case "select":
                var K = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!a.multiple;
                var ae = a.value;
                ae != null ? Pn(l, !!a.multiple, ae, !1) : K !== !!a.multiple && (a.defaultValue != null ? Pn(
                  l,
                  !!a.multiple,
                  a.defaultValue,
                  !0
                ) : Pn(l, !!a.multiple, a.multiple ? [] : "", !1));
            }
            l[Er] = a;
          } catch (he) {
            De(e, e.return, he);
          }
        }
        break;
      case 6:
        if (_t(t, e), bt(e), o & 4) {
          if (e.stateNode === null) throw Error(i(162));
          l = e.stateNode, a = e.memoizedProps;
          try {
            l.nodeValue = a;
          } catch (he) {
            De(e, e.return, he);
          }
        }
        break;
      case 3:
        if (_t(t, e), bt(e), o & 4 && r !== null && r.memoizedState.isDehydrated) try {
          gr(t.containerInfo);
        } catch (he) {
          De(e, e.return, he);
        }
        break;
      case 4:
        _t(t, e), bt(e);
        break;
      case 13:
        _t(t, e), bt(e), l = e.child, l.flags & 8192 && (a = l.memoizedState !== null, l.stateNode.isHidden = a, !a || l.alternate !== null && l.alternate.memoizedState !== null || (Vs = Ie())), o & 4 && Xu(e);
        break;
      case 22:
        if (q = r !== null && r.memoizedState !== null, e.mode & 1 ? (Ke = (F = Ke) || q, _t(t, e), Ke = F) : _t(t, e), bt(e), o & 8192) {
          if (F = e.memoizedState !== null, (e.stateNode.isHidden = F) && !q && (e.mode & 1) !== 0) for (ce = e, q = e.child; q !== null; ) {
            for (ee = ce = q; ce !== null; ) {
              switch (K = ce, ae = K.child, K.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  zr(4, K, K.return);
                  break;
                case 1:
                  Gn(K, K.return);
                  var de = K.stateNode;
                  if (typeof de.componentWillUnmount == "function") {
                    o = K, r = K.return;
                    try {
                      t = o, de.props = t.memoizedProps, de.state = t.memoizedState, de.componentWillUnmount();
                    } catch (he) {
                      De(o, r, he);
                    }
                  }
                  break;
                case 5:
                  Gn(K, K.return);
                  break;
                case 22:
                  if (K.memoizedState !== null) {
                    Qu(ee);
                    continue;
                  }
              }
              ae !== null ? (ae.return = K, ce = ae) : Qu(ee);
            }
            q = q.sibling;
          }
          e: for (q = null, ee = e; ; ) {
            if (ee.tag === 5) {
              if (q === null) {
                q = ee;
                try {
                  l = ee.stateNode, F ? (a = l.style, typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none") : (m = ee.stateNode, T = ee.memoizedProps.style, f = T != null && T.hasOwnProperty("display") ? T.display : null, m.style.display = Pl("display", f));
                } catch (he) {
                  De(e, e.return, he);
                }
              }
            } else if (ee.tag === 6) {
              if (q === null) try {
                ee.stateNode.nodeValue = F ? "" : ee.memoizedProps;
              } catch (he) {
                De(e, e.return, he);
              }
            } else if ((ee.tag !== 22 && ee.tag !== 23 || ee.memoizedState === null || ee === e) && ee.child !== null) {
              ee.child.return = ee, ee = ee.child;
              continue;
            }
            if (ee === e) break e;
            for (; ee.sibling === null; ) {
              if (ee.return === null || ee.return === e) break e;
              q === ee && (q = null), ee = ee.return;
            }
            q === ee && (q = null), ee.sibling.return = ee.return, ee = ee.sibling;
          }
        }
        break;
      case 19:
        _t(t, e), bt(e), o & 4 && Xu(e);
        break;
      case 21:
        break;
      default:
        _t(
          t,
          e
        ), bt(e);
    }
  }
  function bt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var r = e.return; r !== null; ) {
            if (Hu(r)) {
              var o = r;
              break e;
            }
            r = r.return;
          }
          throw Error(i(160));
        }
        switch (o.tag) {
          case 5:
            var l = o.stateNode;
            o.flags & 32 && (ir(l, ""), o.flags &= -33);
            var a = Vu(e);
            Bs(e, a, l);
            break;
          case 3:
          case 4:
            var f = o.stateNode.containerInfo, m = Vu(e);
            Os(e, m, f);
            break;
          default:
            throw Error(i(161));
        }
      } catch (T) {
        De(e, e.return, T);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Mh(e, t, r) {
    ce = e, $u(e);
  }
  function $u(e, t, r) {
    for (var o = (e.mode & 1) !== 0; ce !== null; ) {
      var l = ce, a = l.child;
      if (l.tag === 22 && o) {
        var f = l.memoizedState !== null || Ui;
        if (!f) {
          var m = l.alternate, T = m !== null && m.memoizedState !== null || Ke;
          m = Ui;
          var F = Ke;
          if (Ui = f, (Ke = T) && !F) for (ce = l; ce !== null; ) f = ce, T = f.child, f.tag === 22 && f.memoizedState !== null ? Ku(l) : T !== null ? (T.return = f, ce = T) : Ku(l);
          for (; a !== null; ) ce = a, $u(a), a = a.sibling;
          ce = l, Ui = m, Ke = F;
        }
        Gu(e);
      } else (l.subtreeFlags & 8772) !== 0 && a !== null ? (a.return = l, ce = a) : Gu(e);
    }
  }
  function Gu(e) {
    for (; ce !== null; ) {
      var t = ce;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ke || Hi(5, t);
              break;
            case 1:
              var o = t.stateNode;
              if (t.flags & 4 && !Ke) if (r === null) o.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : wt(t.type, r.memoizedProps);
                o.componentDidUpdate(l, r.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var a = t.updateQueue;
              a !== null && Qa(t, a, o);
              break;
            case 3:
              var f = t.updateQueue;
              if (f !== null) {
                if (r = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    r = t.child.stateNode;
                    break;
                  case 1:
                    r = t.child.stateNode;
                }
                Qa(t, f, r);
              }
              break;
            case 5:
              var m = t.stateNode;
              if (r === null && t.flags & 4) {
                r = m;
                var T = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && r.focus();
                    break;
                  case "img":
                    T.src && (r.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var F = t.alternate;
                if (F !== null) {
                  var q = F.memoizedState;
                  if (q !== null) {
                    var ee = q.dehydrated;
                    ee !== null && gr(ee);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(i(163));
          }
          Ke || t.flags & 512 && js(t);
        } catch (K) {
          De(t, t.return, K);
        }
      }
      if (t === e) {
        ce = null;
        break;
      }
      if (r = t.sibling, r !== null) {
        r.return = t.return, ce = r;
        break;
      }
      ce = t.return;
    }
  }
  function Qu(e) {
    for (; ce !== null; ) {
      var t = ce;
      if (t === e) {
        ce = null;
        break;
      }
      var r = t.sibling;
      if (r !== null) {
        r.return = t.return, ce = r;
        break;
      }
      ce = t.return;
    }
  }
  function Ku(e) {
    for (; ce !== null; ) {
      var t = ce;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              Hi(4, t);
            } catch (T) {
              De(t, r, T);
            }
            break;
          case 1:
            var o = t.stateNode;
            if (typeof o.componentDidMount == "function") {
              var l = t.return;
              try {
                o.componentDidMount();
              } catch (T) {
                De(t, l, T);
              }
            }
            var a = t.return;
            try {
              js(t);
            } catch (T) {
              De(t, a, T);
            }
            break;
          case 5:
            var f = t.return;
            try {
              js(t);
            } catch (T) {
              De(t, f, T);
            }
        }
      } catch (T) {
        De(t, t.return, T);
      }
      if (t === e) {
        ce = null;
        break;
      }
      var m = t.sibling;
      if (m !== null) {
        m.return = t.return, ce = m;
        break;
      }
      ce = t.return;
    }
  }
  var Dh = Math.ceil, Vi = j.ReactCurrentDispatcher, Us = j.ReactCurrentOwner, vt = j.ReactCurrentBatchConfig, _e = 0, He = null, ze = null, Xe = 0, ct = 0, Qn = $t(0), Oe = 0, jr = null, mn = 0, Wi = 0, Hs = 0, Or = null, it = null, Vs = 0, Kn = 1 / 0, Ot = null, Xi = !1, Ws = null, Jt = null, Yi = !1, en = null, $i = 0, Br = 0, Xs = null, Gi = -1, Qi = 0;
  function qe() {
    return (_e & 6) !== 0 ? Ie() : Gi !== -1 ? Gi : Gi = Ie();
  }
  function tn(e) {
    return (e.mode & 1) === 0 ? 1 : (_e & 2) !== 0 && Xe !== 0 ? Xe & -Xe : yh.transition !== null ? (Qi === 0 && (Qi = Vl()), Qi) : (e = Ee, e !== 0 || (e = window.event, e = e === void 0 ? 16 : ql(e.type)), e);
  }
  function Tt(e, t, r, o) {
    if (50 < Br) throw Br = 0, Xs = null, Error(i(185));
    cr(e, r, o), ((_e & 2) === 0 || e !== He) && (e === He && ((_e & 2) === 0 && (Wi |= r), Oe === 4 && nn(e, Xe)), ot(e, o), r === 1 && _e === 0 && (t.mode & 1) === 0 && (Kn = Ie() + 500, _i && Qt()));
  }
  function ot(e, t) {
    var r = e.callbackNode;
    yd(e, t);
    var o = ii(e, e === He ? Xe : 0);
    if (o === 0) r !== null && Bl(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = o & -o, e.callbackPriority !== t) {
      if (r != null && Bl(r), t === 1) e.tag === 0 ? vh(qu.bind(null, e)) : za(qu.bind(null, e)), hh(function() {
        (_e & 6) === 0 && Qt();
      }), r = null;
      else {
        switch (Wl(o)) {
          case 1:
            r = To;
            break;
          case 4:
            r = Ul;
            break;
          case 16:
            r = ei;
            break;
          case 536870912:
            r = Hl;
            break;
          default:
            r = ei;
        }
        r = sc(r, Zu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function Zu(e, t) {
    if (Gi = -1, Qi = 0, (_e & 6) !== 0) throw Error(i(327));
    var r = e.callbackNode;
    if (Zn() && e.callbackNode !== r) return null;
    var o = ii(e, e === He ? Xe : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & e.expiredLanes) !== 0 || t) t = Ki(e, o);
    else {
      t = o;
      var l = _e;
      _e |= 2;
      var a = ec();
      (He !== e || Xe !== t) && (Ot = null, Kn = Ie() + 500, xn(e, t));
      do
        try {
          zh();
          break;
        } catch (m) {
          Ju(e, m);
        }
      while (!0);
      us(), Vi.current = a, _e = l, ze !== null ? t = 0 : (He = null, Xe = 0, t = Oe);
    }
    if (t !== 0) {
      if (t === 2 && (l = Co(e), l !== 0 && (o = l, t = Ys(e, l))), t === 1) throw r = jr, xn(e, 0), nn(e, o), ot(e, Ie()), r;
      if (t === 6) nn(e, o);
      else {
        if (l = e.current.alternate, (o & 30) === 0 && !Ih(l) && (t = Ki(e, o), t === 2 && (a = Co(e), a !== 0 && (o = a, t = Ys(e, a))), t === 1)) throw r = jr, xn(e, 0), nn(e, o), ot(e, Ie()), r;
        switch (e.finishedWork = l, e.finishedLanes = o, t) {
          case 0:
          case 1:
            throw Error(i(345));
          case 2:
            wn(e, it, Ot);
            break;
          case 3:
            if (nn(e, o), (o & 130023424) === o && (t = Vs + 500 - Ie(), 10 < t)) {
              if (ii(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & o) !== o) {
                qe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = qo(wn.bind(null, e, it, Ot), t);
              break;
            }
            wn(e, it, Ot);
            break;
          case 4:
            if (nn(e, o), (o & 4194240) === o) break;
            for (t = e.eventTimes, l = -1; 0 < o; ) {
              var f = 31 - mt(o);
              a = 1 << f, f = t[f], f > l && (l = f), o &= ~a;
            }
            if (o = l, o = Ie() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * Dh(o / 1960)) - o, 10 < o) {
              e.timeoutHandle = qo(wn.bind(null, e, it, Ot), o);
              break;
            }
            wn(e, it, Ot);
            break;
          case 5:
            wn(e, it, Ot);
            break;
          default:
            throw Error(i(329));
        }
      }
    }
    return ot(e, Ie()), e.callbackNode === r ? Zu.bind(null, e) : null;
  }
  function Ys(e, t) {
    var r = Or;
    return e.current.memoizedState.isDehydrated && (xn(e, t).flags |= 256), e = Ki(e, t), e !== 2 && (t = it, it = r, t !== null && $s(t)), e;
  }
  function $s(e) {
    it === null ? it = e : it.push.apply(it, e);
  }
  function Ih(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var r = t.updateQueue;
        if (r !== null && (r = r.stores, r !== null)) for (var o = 0; o < r.length; o++) {
          var l = r[o], a = l.getSnapshot;
          l = l.value;
          try {
            if (!kt(a(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (r = t.child, t.subtreeFlags & 16384 && r !== null) r.return = t, t = r;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function nn(e, t) {
    for (t &= ~Hs, t &= ~Wi, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - mt(t), o = 1 << r;
      e[r] = -1, t &= ~o;
    }
  }
  function qu(e) {
    if ((_e & 6) !== 0) throw Error(i(327));
    Zn();
    var t = ii(e, 0);
    if ((t & 1) === 0) return ot(e, Ie()), null;
    var r = Ki(e, t);
    if (e.tag !== 0 && r === 2) {
      var o = Co(e);
      o !== 0 && (t = o, r = Ys(e, o));
    }
    if (r === 1) throw r = jr, xn(e, 0), nn(e, t), ot(e, Ie()), r;
    if (r === 6) throw Error(i(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, wn(e, it, Ot), ot(e, Ie()), null;
  }
  function Gs(e, t) {
    var r = _e;
    _e |= 1;
    try {
      return e(t);
    } finally {
      _e = r, _e === 0 && (Kn = Ie() + 500, _i && Qt());
    }
  }
  function kn(e) {
    en !== null && en.tag === 0 && (_e & 6) === 0 && Zn();
    var t = _e;
    _e |= 1;
    var r = vt.transition, o = Ee;
    try {
      if (vt.transition = null, Ee = 1, e) return e();
    } finally {
      Ee = o, vt.transition = r, _e = t, (_e & 6) === 0 && Qt();
    }
  }
  function Qs() {
    ct = Qn.current, Ae(Qn);
  }
  function xn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, dh(r)), ze !== null) for (r = ze.return; r !== null; ) {
      var o = r;
      switch (is(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && wi();
          break;
        case 3:
          Yn(), Ae(tt), Ae($e), ys();
          break;
        case 5:
          gs(o);
          break;
        case 4:
          Yn();
          break;
        case 13:
          Ae(Le);
          break;
        case 19:
          Ae(Le);
          break;
        case 10:
          cs(o.type._context);
          break;
        case 22:
        case 23:
          Qs();
      }
      r = r.return;
    }
    if (He = e, ze = e = rn(e.current, null), Xe = ct = t, Oe = 0, jr = null, Hs = Wi = mn = 0, it = Or = null, gn !== null) {
      for (t = 0; t < gn.length; t++) if (r = gn[t], o = r.interleaved, o !== null) {
        r.interleaved = null;
        var l = o.next, a = r.pending;
        if (a !== null) {
          var f = a.next;
          a.next = l, o.next = f;
        }
        r.pending = o;
      }
      gn = null;
    }
    return e;
  }
  function Ju(e, t) {
    do {
      var r = ze;
      try {
        if (us(), Mi.current = zi, Di) {
          for (var o = Me.memoizedState; o !== null; ) {
            var l = o.queue;
            l !== null && (l.pending = null), o = o.next;
          }
          Di = !1;
        }
        if (yn = 0, Ue = je = Me = null, Lr = !1, Mr = 0, Us.current = null, r === null || r.return === null) {
          Oe = 1, jr = t, ze = null;
          break;
        }
        e: {
          var a = e, f = r.return, m = r, T = t;
          if (t = Xe, m.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var F = T, q = m, ee = q.tag;
            if ((q.mode & 1) === 0 && (ee === 0 || ee === 11 || ee === 15)) {
              var K = q.alternate;
              K ? (q.updateQueue = K.updateQueue, q.memoizedState = K.memoizedState, q.lanes = K.lanes) : (q.updateQueue = null, q.memoizedState = null);
            }
            var ae = Tu(f);
            if (ae !== null) {
              ae.flags &= -257, Cu(ae, f, m, a, t), ae.mode & 1 && _u(a, F, t), t = ae, T = F;
              var de = t.updateQueue;
              if (de === null) {
                var he = /* @__PURE__ */ new Set();
                he.add(T), t.updateQueue = he;
              } else de.add(T);
              break e;
            } else {
              if ((t & 1) === 0) {
                _u(a, F, t), Ks();
                break e;
              }
              T = Error(i(426));
            }
          } else if (be && m.mode & 1) {
            var Fe = Tu(f);
            if (Fe !== null) {
              (Fe.flags & 65536) === 0 && (Fe.flags |= 256), Cu(Fe, f, m, a, t), ls($n(T, m));
              break e;
            }
          }
          a = T = $n(T, m), Oe !== 4 && (Oe = 2), Or === null ? Or = [a] : Or.push(a), a = f;
          do {
            switch (a.tag) {
              case 3:
                a.flags |= 65536, t &= -t, a.lanes |= t;
                var b = wu(a, T, t);
                Ga(a, b);
                break e;
              case 1:
                m = T;
                var A = a.type, D = a.stateNode;
                if ((a.flags & 128) === 0 && (typeof A.getDerivedStateFromError == "function" || D !== null && typeof D.componentDidCatch == "function" && (Jt === null || !Jt.has(D)))) {
                  a.flags |= 65536, t &= -t, a.lanes |= t;
                  var ne = Su(a, m, t);
                  Ga(a, ne);
                  break e;
                }
            }
            a = a.return;
          } while (a !== null);
        }
        nc(r);
      } catch (fe) {
        t = fe, ze === r && r !== null && (ze = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ec() {
    var e = Vi.current;
    return Vi.current = zi, e === null ? zi : e;
  }
  function Ks() {
    (Oe === 0 || Oe === 3 || Oe === 2) && (Oe = 4), He === null || (mn & 268435455) === 0 && (Wi & 268435455) === 0 || nn(He, Xe);
  }
  function Ki(e, t) {
    var r = _e;
    _e |= 2;
    var o = ec();
    (He !== e || Xe !== t) && (Ot = null, xn(e, t));
    do
      try {
        Fh();
        break;
      } catch (l) {
        Ju(e, l);
      }
    while (!0);
    if (us(), _e = r, Vi.current = o, ze !== null) throw Error(i(261));
    return He = null, Xe = 0, Oe;
  }
  function Fh() {
    for (; ze !== null; ) tc(ze);
  }
  function zh() {
    for (; ze !== null && !ad(); ) tc(ze);
  }
  function tc(e) {
    var t = oc(e.alternate, e, ct);
    e.memoizedProps = e.pendingProps, t === null ? nc(e) : ze = t, Us.current = null;
  }
  function nc(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Ah(r, t, ct), r !== null) {
          ze = r;
          return;
        }
      } else {
        if (r = Rh(r, t), r !== null) {
          r.flags &= 32767, ze = r;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Oe = 6, ze = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ze = t;
        return;
      }
      ze = t = e;
    } while (t !== null);
    Oe === 0 && (Oe = 5);
  }
  function wn(e, t, r) {
    var o = Ee, l = vt.transition;
    try {
      vt.transition = null, Ee = 1, jh(e, t, r, o);
    } finally {
      vt.transition = l, Ee = o;
    }
    return null;
  }
  function jh(e, t, r, o) {
    do
      Zn();
    while (en !== null);
    if ((_e & 6) !== 0) throw Error(i(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(i(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var a = r.lanes | r.childLanes;
    if (md(e, a), e === He && (ze = He = null, Xe = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || Yi || (Yi = !0, sc(ei, function() {
      return Zn(), null;
    })), a = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || a) {
      a = vt.transition, vt.transition = null;
      var f = Ee;
      Ee = 1;
      var m = _e;
      _e |= 4, Us.current = null, Lh(e, r), Yu(r, e), ih(Ko), li = !!Qo, Ko = Qo = null, e.current = r, Mh(r), ud(), _e = m, Ee = f, vt.transition = a;
    } else e.current = r;
    if (Yi && (Yi = !1, en = e, $i = l), a = e.pendingLanes, a === 0 && (Jt = null), hd(r.stateNode), ot(e, Ie()), t !== null) for (o = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], o(l.value, { componentStack: l.stack, digest: l.digest });
    if (Xi) throw Xi = !1, e = Ws, Ws = null, e;
    return ($i & 1) !== 0 && e.tag !== 0 && Zn(), a = e.pendingLanes, (a & 1) !== 0 ? e === Xs ? Br++ : (Br = 0, Xs = e) : Br = 0, Qt(), null;
  }
  function Zn() {
    if (en !== null) {
      var e = Wl($i), t = vt.transition, r = Ee;
      try {
        if (vt.transition = null, Ee = 16 > e ? 16 : e, en === null) var o = !1;
        else {
          if (e = en, en = null, $i = 0, (_e & 6) !== 0) throw Error(i(331));
          var l = _e;
          for (_e |= 4, ce = e.current; ce !== null; ) {
            var a = ce, f = a.child;
            if ((ce.flags & 16) !== 0) {
              var m = a.deletions;
              if (m !== null) {
                for (var T = 0; T < m.length; T++) {
                  var F = m[T];
                  for (ce = F; ce !== null; ) {
                    var q = ce;
                    switch (q.tag) {
                      case 0:
                      case 11:
                      case 15:
                        zr(8, q, a);
                    }
                    var ee = q.child;
                    if (ee !== null) ee.return = q, ce = ee;
                    else for (; ce !== null; ) {
                      q = ce;
                      var K = q.sibling, ae = q.return;
                      if (Uu(q), q === F) {
                        ce = null;
                        break;
                      }
                      if (K !== null) {
                        K.return = ae, ce = K;
                        break;
                      }
                      ce = ae;
                    }
                  }
                }
                var de = a.alternate;
                if (de !== null) {
                  var he = de.child;
                  if (he !== null) {
                    de.child = null;
                    do {
                      var Fe = he.sibling;
                      he.sibling = null, he = Fe;
                    } while (he !== null);
                  }
                }
                ce = a;
              }
            }
            if ((a.subtreeFlags & 2064) !== 0 && f !== null) f.return = a, ce = f;
            else e: for (; ce !== null; ) {
              if (a = ce, (a.flags & 2048) !== 0) switch (a.tag) {
                case 0:
                case 11:
                case 15:
                  zr(9, a, a.return);
              }
              var b = a.sibling;
              if (b !== null) {
                b.return = a.return, ce = b;
                break e;
              }
              ce = a.return;
            }
          }
          var A = e.current;
          for (ce = A; ce !== null; ) {
            f = ce;
            var D = f.child;
            if ((f.subtreeFlags & 2064) !== 0 && D !== null) D.return = f, ce = D;
            else e: for (f = A; ce !== null; ) {
              if (m = ce, (m.flags & 2048) !== 0) try {
                switch (m.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Hi(9, m);
                }
              } catch (fe) {
                De(m, m.return, fe);
              }
              if (m === f) {
                ce = null;
                break e;
              }
              var ne = m.sibling;
              if (ne !== null) {
                ne.return = m.return, ce = ne;
                break e;
              }
              ce = m.return;
            }
          }
          if (_e = l, Qt(), Pt && typeof Pt.onPostCommitFiberRoot == "function") try {
            Pt.onPostCommitFiberRoot(ti, e);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ee = r, vt.transition = t;
      }
    }
    return !1;
  }
  function rc(e, t, r) {
    t = $n(r, t), t = wu(e, t, 1), e = Zt(e, t, 1), t = qe(), e !== null && (cr(e, 1, t), ot(e, t));
  }
  function De(e, t, r) {
    if (e.tag === 3) rc(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        rc(t, e, r);
        break;
      } else if (t.tag === 1) {
        var o = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Jt === null || !Jt.has(o))) {
          e = $n(r, e), e = Su(t, e, 1), t = Zt(t, e, 1), e = qe(), t !== null && (cr(t, 1, e), ot(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Oh(e, t, r) {
    var o = e.pingCache;
    o !== null && o.delete(t), t = qe(), e.pingedLanes |= e.suspendedLanes & r, He === e && (Xe & r) === r && (Oe === 4 || Oe === 3 && (Xe & 130023424) === Xe && 500 > Ie() - Vs ? xn(e, 0) : Hs |= r), ot(e, t);
  }
  function ic(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = ri, ri <<= 1, (ri & 130023424) === 0 && (ri = 4194304)));
    var r = qe();
    e = Ft(e, t), e !== null && (cr(e, t, r), ot(e, r));
  }
  function Bh(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), ic(e, r);
  }
  function Uh(e, t) {
    var r = 0;
    switch (e.tag) {
      case 13:
        var o = e.stateNode, l = e.memoizedState;
        l !== null && (r = l.retryLane);
        break;
      case 19:
        o = e.stateNode;
        break;
      default:
        throw Error(i(314));
    }
    o !== null && o.delete(t), ic(e, r);
  }
  var oc;
  oc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || tt.current) rt = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return rt = !1, Nh(e, t, r);
      rt = (e.flags & 131072) !== 0;
    }
    else rt = !1, be && (t.flags & 1048576) !== 0 && ja(t, Ci, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var o = t.type;
        Bi(e, t), e = t.pendingProps;
        var l = On(t, $e.current);
        Xn(t, r), l = xs(null, t, o, e, l, r);
        var a = ws();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, nt(o) ? (a = !0, Si(t)) : a = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, fs(t), l.updater = ji, t.stateNode = l, l._reactInternals = t, Ps(t, o, e, r), t = bs(null, t, o, !0, a, r)) : (t.tag = 0, be && a && rs(t), Ze(null, t, l, r), t = t.child), t;
      case 16:
        o = t.elementType;
        e: {
          switch (Bi(e, t), e = t.pendingProps, l = o._init, o = l(o._payload), t.type = o, l = t.tag = Vh(o), e = wt(o, e), l) {
            case 0:
              t = Rs(null, t, o, e, r);
              break e;
            case 1:
              t = bu(null, t, o, e, r);
              break e;
            case 11:
              t = Eu(null, t, o, e, r);
              break e;
            case 14:
              t = Pu(null, t, o, wt(o.type, e), r);
              break e;
          }
          throw Error(i(
            306,
            o,
            ""
          ));
        }
        return t;
      case 0:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : wt(o, l), Rs(e, t, o, l, r);
      case 1:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : wt(o, l), bu(e, t, o, l, r);
      case 3:
        e: {
          if (Lu(t), e === null) throw Error(i(387));
          o = t.pendingProps, a = t.memoizedState, l = a.element, $a(e, t), bi(t, o, null, r);
          var f = t.memoizedState;
          if (o = f.element, a.isDehydrated) if (a = { element: o, isDehydrated: !1, cache: f.cache, pendingSuspenseBoundaries: f.pendingSuspenseBoundaries, transitions: f.transitions }, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
            l = $n(Error(i(423)), t), t = Mu(e, t, o, r, l);
            break e;
          } else if (o !== l) {
            l = $n(Error(i(424)), t), t = Mu(e, t, o, r, l);
            break e;
          } else for (ut = Yt(t.stateNode.containerInfo.firstChild), at = t, be = !0, xt = null, r = Xa(t, null, o, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if (Hn(), o === l) {
              t = jt(e, t, r);
              break e;
            }
            Ze(e, t, o, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Ka(t), e === null && ss(t), o = t.type, l = t.pendingProps, a = e !== null ? e.memoizedProps : null, f = l.children, Zo(o, l) ? f = null : a !== null && Zo(o, a) && (t.flags |= 32), Ru(e, t), Ze(e, t, f, r), t.child;
      case 6:
        return e === null && ss(t), null;
      case 13:
        return Du(e, t, r);
      case 4:
        return ps(t, t.stateNode.containerInfo), o = t.pendingProps, e === null ? t.child = Vn(t, null, o, r) : Ze(e, t, o, r), t.child;
      case 11:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : wt(o, l), Eu(e, t, o, l, r);
      case 7:
        return Ze(e, t, t.pendingProps, r), t.child;
      case 8:
        return Ze(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return Ze(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (o = t.type._context, l = t.pendingProps, a = t.memoizedProps, f = l.value, Pe(Ni, o._currentValue), o._currentValue = f, a !== null) if (kt(a.value, f)) {
            if (a.children === l.children && !tt.current) {
              t = jt(e, t, r);
              break e;
            }
          } else for (a = t.child, a !== null && (a.return = t); a !== null; ) {
            var m = a.dependencies;
            if (m !== null) {
              f = a.child;
              for (var T = m.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (a.tag === 1) {
                    T = zt(-1, r & -r), T.tag = 2;
                    var F = a.updateQueue;
                    if (F !== null) {
                      F = F.shared;
                      var q = F.pending;
                      q === null ? T.next = T : (T.next = q.next, q.next = T), F.pending = T;
                    }
                  }
                  a.lanes |= r, T = a.alternate, T !== null && (T.lanes |= r), ds(
                    a.return,
                    r,
                    t
                  ), m.lanes |= r;
                  break;
                }
                T = T.next;
              }
            } else if (a.tag === 10) f = a.type === t.type ? null : a.child;
            else if (a.tag === 18) {
              if (f = a.return, f === null) throw Error(i(341));
              f.lanes |= r, m = f.alternate, m !== null && (m.lanes |= r), ds(f, r, t), f = a.sibling;
            } else f = a.child;
            if (f !== null) f.return = a;
            else for (f = a; f !== null; ) {
              if (f === t) {
                f = null;
                break;
              }
              if (a = f.sibling, a !== null) {
                a.return = f.return, f = a;
                break;
              }
              f = f.return;
            }
            a = f;
          }
          Ze(e, t, l.children, r), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, o = t.pendingProps.children, Xn(t, r), l = pt(l), o = o(l), t.flags |= 1, Ze(e, t, o, r), t.child;
      case 14:
        return o = t.type, l = wt(o, t.pendingProps), l = wt(o.type, l), Pu(e, t, o, l, r);
      case 15:
        return Nu(e, t, t.type, t.pendingProps, r);
      case 17:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : wt(o, l), Bi(e, t), t.tag = 1, nt(o) ? (e = !0, Si(t)) : e = !1, Xn(t, r), ku(t, o, l), Ps(t, o, l, r), bs(null, t, o, !0, e, r);
      case 19:
        return Fu(e, t, r);
      case 22:
        return Au(e, t, r);
    }
    throw Error(i(156, t.tag));
  };
  function sc(e, t) {
    return Ol(e, t);
  }
  function Hh(e, t, r, o) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function yt(e, t, r, o) {
    return new Hh(e, t, r, o);
  }
  function Zs(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Vh(e) {
    if (typeof e == "function") return Zs(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ve) return 11;
      if (e === ie) return 14;
    }
    return 2;
  }
  function rn(e, t) {
    var r = e.alternate;
    return r === null ? (r = yt(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function Zi(e, t, r, o, l, a) {
    var f = 2;
    if (o = e, typeof e == "function") Zs(e) && (f = 1);
    else if (typeof e == "string") f = 5;
    else e: switch (e) {
      case M:
        return Sn(r.children, l, a, t);
      case U:
        f = 8, l |= 8;
        break;
      case O:
        return e = yt(12, r, t, l | 2), e.elementType = O, e.lanes = a, e;
      case le:
        return e = yt(13, r, t, l), e.elementType = le, e.lanes = a, e;
      case se:
        return e = yt(19, r, t, l), e.elementType = se, e.lanes = a, e;
      case B:
        return qi(r, l, a, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Q:
            f = 10;
            break e;
          case oe:
            f = 9;
            break e;
          case ve:
            f = 11;
            break e;
          case ie:
            f = 14;
            break e;
          case re:
            f = 16, o = null;
            break e;
        }
        throw Error(i(130, e == null ? e : typeof e, ""));
    }
    return t = yt(f, r, t, l), t.elementType = e, t.type = o, t.lanes = a, t;
  }
  function Sn(e, t, r, o) {
    return e = yt(7, e, o, t), e.lanes = r, e;
  }
  function qi(e, t, r, o) {
    return e = yt(22, e, o, t), e.elementType = B, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function qs(e, t, r) {
    return e = yt(6, e, null, t), e.lanes = r, e;
  }
  function Js(e, t, r) {
    return t = yt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Wh(e, t, r, o, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Eo(0), this.expirationTimes = Eo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Eo(0), this.identifierPrefix = o, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function el(e, t, r, o, l, a, f, m, T) {
    return e = new Wh(e, t, r, m, T), t === 1 ? (t = 1, a === !0 && (t |= 8)) : t = 0, a = yt(3, null, null, t), e.current = a, a.stateNode = e, a.memoizedState = { element: o, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, fs(a), e;
  }
  function Xh(e, t, r) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Y, key: o == null ? null : "" + o, children: e, containerInfo: t, implementation: r };
  }
  function lc(e) {
    if (!e) return Gt;
    e = e._reactInternals;
    e: {
      if (cn(e) !== e || e.tag !== 1) throw Error(i(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (nt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(i(171));
    }
    if (e.tag === 1) {
      var r = e.type;
      if (nt(r)) return Ia(e, r, t);
    }
    return t;
  }
  function ac(e, t, r, o, l, a, f, m, T) {
    return e = el(r, o, !0, e, l, a, f, m, T), e.context = lc(null), r = e.current, o = qe(), l = tn(r), a = zt(o, l), a.callback = t ?? null, Zt(r, a, l), e.current.lanes = l, cr(e, l, o), ot(e, o), e;
  }
  function Ji(e, t, r, o) {
    var l = t.current, a = qe(), f = tn(l);
    return r = lc(r), t.context === null ? t.context = r : t.pendingContext = r, t = zt(a, f), t.payload = { element: e }, o = o === void 0 ? null : o, o !== null && (t.callback = o), e = Zt(l, t, f), e !== null && (Tt(e, l, f, a), Ri(e, l, f)), f;
  }
  function eo(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function uc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function tl(e, t) {
    uc(e, t), (e = e.alternate) && uc(e, t);
  }
  function Yh() {
    return null;
  }
  var cc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function nl(e) {
    this._internalRoot = e;
  }
  to.prototype.render = nl.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(i(409));
    Ji(e, t, null, null);
  }, to.prototype.unmount = nl.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      kn(function() {
        Ji(null, e, null, null);
      }), t[Lt] = null;
    }
  };
  function to(e) {
    this._internalRoot = e;
  }
  to.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = $l();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < Vt.length && t !== 0 && t < Vt[r].priority; r++) ;
      Vt.splice(r, 0, e), r === 0 && Kl(e);
    }
  };
  function rl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function no(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function dc() {
  }
  function $h(e, t, r, o, l) {
    if (l) {
      if (typeof o == "function") {
        var a = o;
        o = function() {
          var F = eo(f);
          a.call(F);
        };
      }
      var f = ac(t, o, e, 0, null, !1, !1, "", dc);
      return e._reactRootContainer = f, e[Lt] = f.current, Tr(e.nodeType === 8 ? e.parentNode : e), kn(), f;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof o == "function") {
      var m = o;
      o = function() {
        var F = eo(T);
        m.call(F);
      };
    }
    var T = el(e, 0, !1, null, null, !1, !1, "", dc);
    return e._reactRootContainer = T, e[Lt] = T.current, Tr(e.nodeType === 8 ? e.parentNode : e), kn(function() {
      Ji(t, T, r, o);
    }), T;
  }
  function ro(e, t, r, o, l) {
    var a = r._reactRootContainer;
    if (a) {
      var f = a;
      if (typeof l == "function") {
        var m = l;
        l = function() {
          var T = eo(f);
          m.call(T);
        };
      }
      Ji(t, f, e, l);
    } else f = $h(r, t, e, l, o);
    return eo(f);
  }
  Xl = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = ur(t.pendingLanes);
          r !== 0 && (Po(t, r | 1), ot(t, Ie()), (_e & 6) === 0 && (Kn = Ie() + 500, Qt()));
        }
        break;
      case 13:
        kn(function() {
          var o = Ft(e, 1);
          if (o !== null) {
            var l = qe();
            Tt(o, e, 1, l);
          }
        }), tl(e, 1);
    }
  }, No = function(e) {
    if (e.tag === 13) {
      var t = Ft(e, 134217728);
      if (t !== null) {
        var r = qe();
        Tt(t, e, 134217728, r);
      }
      tl(e, 134217728);
    }
  }, Yl = function(e) {
    if (e.tag === 13) {
      var t = tn(e), r = Ft(e, t);
      if (r !== null) {
        var o = qe();
        Tt(r, e, t, o);
      }
      tl(e, t);
    }
  }, $l = function() {
    return Ee;
  }, Gl = function(e, t) {
    var r = Ee;
    try {
      return Ee = e, t();
    } finally {
      Ee = r;
    }
  }, xo = function(e, t, r) {
    switch (t) {
      case "input":
        if (En(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var o = r[t];
            if (o !== e && o.form === e.form) {
              var l = xi(o);
              if (!l) throw Error(i(90));
              Re(o), En(o, l);
            }
          }
        }
        break;
      case "textarea":
        _l(e, r);
        break;
      case "select":
        t = r.value, t != null && Pn(e, !!r.multiple, t, !1);
    }
  }, Ll = Gs, Ml = kn;
  var Gh = { usingClientEntryPoint: !1, Events: [Pr, zn, xi, Rl, bl, Gs] }, Ur = { findFiberByHostInstance: dn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Qh = { bundleType: Ur.bundleType, version: Ur.version, rendererPackageName: Ur.rendererPackageName, rendererConfig: Ur.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: j.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = zl(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Ur.findFiberByHostInstance || Yh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var io = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!io.isDisabled && io.supportsFiber) try {
      ti = io.inject(Qh), Pt = io;
    } catch {
    }
  }
  return st.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Gh, st.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!rl(t)) throw Error(i(200));
    return Xh(e, t, null, r);
  }, st.createRoot = function(e, t) {
    if (!rl(e)) throw Error(i(299));
    var r = !1, o = "", l = cc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = el(e, 1, !1, null, null, r, !1, o, l), e[Lt] = t.current, Tr(e.nodeType === 8 ? e.parentNode : e), new nl(t);
  }, st.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
    return e = zl(t), e = e === null ? null : e.stateNode, e;
  }, st.flushSync = function(e) {
    return kn(e);
  }, st.hydrate = function(e, t, r) {
    if (!no(t)) throw Error(i(200));
    return ro(null, e, t, !0, r);
  }, st.hydrateRoot = function(e, t, r) {
    if (!rl(e)) throw Error(i(405));
    var o = r != null && r.hydratedSources || null, l = !1, a = "", f = cc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (a = r.identifierPrefix), r.onRecoverableError !== void 0 && (f = r.onRecoverableError)), t = ac(t, null, e, 1, r ?? null, l, !1, a, f), e[Lt] = t.current, Tr(e), o) for (e = 0; e < o.length; e++) r = o[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new to(t);
  }, st.render = function(e, t, r) {
    if (!no(t)) throw Error(i(200));
    return ro(null, e, t, !1, r);
  }, st.unmountComponentAtNode = function(e) {
    if (!no(e)) throw Error(i(40));
    return e._reactRootContainer ? (kn(function() {
      ro(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Lt] = null;
      });
    }), !0) : !1;
  }, st.unstable_batchedUpdates = Gs, st.unstable_renderSubtreeIntoContainer = function(e, t, r, o) {
    if (!no(r)) throw Error(i(200));
    if (e == null || e._reactInternals === void 0) throw Error(i(38));
    return ro(e, t, r, !1, o);
  }, st.version = "18.3.1-next-f1338f8080-20240426", st;
}
var kc;
function sf() {
  if (kc) return sl.exports;
  kc = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (n) {
        console.error(n);
      }
  }
  return c(), sl.exports = of(), sl.exports;
}
var xc;
function lf() {
  if (xc) return oo;
  xc = 1;
  var c = sf();
  return oo.createRoot = c.createRoot, oo.hydrateRoot = c.hydrateRoot, oo;
}
var af = lf(), z = ml();
const Hc = z.createContext({
  register: () => {
  },
  unregister: () => {
  },
  focus: () => {
  },
  focusStack: []
});
function uf({ children: c }) {
  const [n, i] = z.useState([]), s = z.useCallback((h) => {
    i((p) => p.includes(h) ? p : [...p, h]);
  }, []), u = z.useCallback((h) => {
    i((p) => p.filter((v) => v !== h));
  }, []), d = z.useCallback((h) => {
    i((p) => [...p.filter((g) => g !== h), h]);
  }, []);
  return /* @__PURE__ */ C.jsx(Hc.Provider, { value: { register: s, unregister: u, focus: d, focusStack: n }, children: c });
}
function Vc({ id: c, layer: n }) {
  const { register: i, unregister: s, focus: u, focusStack: d } = z.useContext(Hc);
  z.useEffect(() => (i(c), () => s(c)), [c, i, s]);
  const h = d.indexOf(c);
  return {
    /** 当前计算出的 zIndex */
    zIndex: h >= 0 ? n + h : n,
    /** 调用此方法将该面板置顶 */
    onFocus: () => u(c)
  };
}
const cf = 10;
function wc(c, n, i, s) {
  const u = i.getBoundingClientRect(), d = window.innerWidth - u.width - s, h = window.innerHeight - u.height - s;
  return {
    x: Math.max(s, Math.min(c, d)),
    y: Math.max(s, Math.min(n, h))
  };
}
function df(c, n, i = cf) {
  const s = z.useRef({ x: 0, y: 0 }), u = z.useRef(i);
  return u.current = i, z.useEffect(() => {
    if (c.current && n) {
      const h = wc(
        n.x,
        n.y,
        c.current,
        u.current
      );
      c.current.style.transform = `translate(${h.x}px, ${h.y}px)`, s.current = h;
    }
  }, [c, n == null ? void 0 : n.x, n == null ? void 0 : n.y]), { onGripMouseDown: z.useCallback(
    (h) => {
      const p = c.current;
      if (!p) return;
      h.preventDefault();
      const v = h.clientX, g = h.clientY, x = s.current.x, N = s.current.y, S = (R) => {
        const P = R, y = P.clientX - v, _ = P.clientY - g, L = wc(
          x + y,
          N + _,
          p,
          u.current
        );
        p.style.transform = `translate(${L.x}px, ${L.y}px)`;
      }, w = () => {
        const R = p.style.transform.match(
          /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
        );
        R && (s.current = { x: Number(R[1]), y: Number(R[2]) }), document.removeEventListener("mousemove", S), document.removeEventListener("mouseup", w), document.removeEventListener("touchmove", S), document.removeEventListener("touchend", w);
      };
      document.addEventListener("mousemove", S), document.addEventListener("mouseup", w), document.addEventListener("touchmove", S, { passive: !0 }), document.addEventListener("touchend", w);
    },
    [c]
  ) };
}
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wc = (...c) => c.filter((n, i, s) => !!n && n.trim() !== "" && s.indexOf(n) === i).join(" ").trim();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hf = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ff = (c) => c.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (n, i, s) => s ? s.toUpperCase() : i.toLowerCase()
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sc = (c) => {
  const n = ff(c);
  return n.charAt(0).toUpperCase() + n.slice(1);
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ul = {
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
const pf = (c) => {
  for (const n in c)
    if (n.startsWith("aria-") || n === "role" || n === "title")
      return !0;
  return !1;
}, gf = z.createContext({}), vf = () => z.useContext(gf), yf = z.forwardRef(
  ({ color: c, size: n, strokeWidth: i, absoluteStrokeWidth: s, className: u = "", children: d, iconNode: h, ...p }, v) => {
    const {
      size: g = 24,
      strokeWidth: x = 2,
      absoluteStrokeWidth: N = !1,
      color: S = "currentColor",
      className: w = ""
    } = vf() ?? {}, R = s ?? N ? Number(i ?? x) * 24 / Number(n ?? g) : i ?? x;
    return z.createElement(
      "svg",
      {
        ref: v,
        ...ul,
        width: n ?? g ?? ul.width,
        height: n ?? g ?? ul.height,
        stroke: c ?? S,
        strokeWidth: R,
        className: Wc("lucide", w, u),
        ...!d && !pf(p) && { "aria-hidden": "true" },
        ...p
      },
      [
        ...h.map(([P, y]) => z.createElement(P, y)),
        ...Array.isArray(d) ? d : [d]
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
const dt = (c, n) => {
  const i = z.forwardRef(
    ({ className: s, ...u }, d) => z.createElement(yf, {
      ref: d,
      iconNode: n,
      className: Wc(
        `lucide-${hf(Sc(c))}`,
        `lucide-${c}`,
        s
      ),
      ...u
    })
  );
  return i.displayName = Sc(c), i;
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mf = [
  ["path", { d: "M12 5v16", key: "1f6ucr" }],
  [
    "path",
    {
      d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
      key: "1fyvmf"
    }
  ]
], kf = dt("book-open", mf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xf = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
], wf = dt("camera", xf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sf = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
], _f = dt("chart-column", Sf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tf = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
], Cf = dt("map", Tf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ef = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
], Pf = dt("maximize-2", Ef);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nf = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], Af = dt("moon", Nf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rf = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
      key: "edeuup"
    }
  ]
], bf = dt("mouse-pointer-2", Rf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lf = [
  [
    "path",
    {
      d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
      key: "2hea0t"
    }
  ]
], Mf = dt("pentagon", Lf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Df = [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
], If = dt("redo-2", Df);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ff = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], zf = dt("search", Ff);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jf = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], Of = dt("square", jf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bf = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], Uf = dt("sun", Bf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hf = [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
], Vf = dt("undo-2", Hf), Wf = {
  cursor: "grab",
  padding: "4px",
  paddingBottom: "0px",
  userSelect: "none",
  touchAction: "none"
}, Xf = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: 20,
  height: 20,
  cursor: "nwse-resize",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end"
}, _c = ({
  onPointerDown: c
}) => /* @__PURE__ */ C.jsx("div", { style: Xf, onPointerDown: c, children: /* @__PURE__ */ C.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "#bbb", children: [
  /* @__PURE__ */ C.jsx("circle", { cx: "10", cy: "10", r: "1.5" }),
  /* @__PURE__ */ C.jsx("circle", { cx: "10", cy: "6", r: "1.5" }),
  /* @__PURE__ */ C.jsx("circle", { cx: "6", cy: "10", r: "1.5" })
] }) }), nr = z.memo(function({
  id: n,
  layer: i,
  children: s,
  style: u,
  className: d,
  draggable: h,
  position: p,
  resizable: v,
  defaultSize: g,
  onClick: x,
  onClose: N
}) {
  const { zIndex: S, onFocus: w } = Vc({ id: n, layer: i }), R = z.useRef(null), { onGripMouseDown: P } = df(R, p, 10), [y, _] = z.useState(
    v && g ? g : null
  ), L = 200, X = 150, j = 10, W = z.useCallback(
    (U) => {
      w(), x == null || x(U);
    },
    [w, x]
  ), Y = z.useRef(null), M = z.useCallback(
    (U) => {
      if (!y) return;
      const O = U.currentTarget;
      O.setPointerCapture(U.pointerId), U.preventDefault(), Y.current = {
        startX: U.clientX,
        startY: U.clientY,
        startW: y.w,
        startH: y.h
      };
      const Q = (ve) => {
        const le = Y.current;
        if (!le) return;
        const se = ve, ie = window.innerWidth - j * 2, re = window.innerHeight - j * 2, B = Math.min(ie, se.clientX), I = Math.min(re, se.clientY);
        _({
          w: Math.max(L, Math.min(le.startW + B - le.startX, ie)),
          h: Math.max(X, Math.min(le.startH + I - le.startY, re))
        });
      }, oe = () => {
        Y.current = null, O.releasePointerCapture(U.pointerId), O.removeEventListener("pointermove", Q), O.removeEventListener("pointerup", oe);
      };
      O.addEventListener("pointermove", Q), O.addEventListener("pointerup", oe);
    },
    [y]
  );
  return h ? /* @__PURE__ */ C.jsxs(
    "div",
    {
      ref: R,
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        willChange: "transform",
        ...u,
        width: y == null ? void 0 : y.w,
        height: y == null ? void 0 : y.h,
        zIndex: S
      },
      className: d,
      onClick: W,
      children: [
        /* @__PURE__ */ C.jsx(
          "div",
          {
            style: {
              ...Wf
            },
            className: "panel-grip",
            onMouseDown: P,
            children: N && /* @__PURE__ */ C.jsx(
              "button",
              {
                onClick: (U) => {
                  U.stopPropagation(), N();
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
        s,
        v && /* @__PURE__ */ C.jsx(_c, { onPointerDown: M })
      ]
    }
  ) : /* @__PURE__ */ C.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${(p == null ? void 0 : p.x) ?? 100}px, ${(p == null ? void 0 : p.y) ?? 100}px)`,
        ...u,
        width: y == null ? void 0 : y.w,
        height: y == null ? void 0 : y.h,
        zIndex: S
      },
      className: d,
      onClick: W,
      children: [
        s,
        v && /* @__PURE__ */ C.jsx(_c, { onPointerDown: M })
      ]
    }
  );
});
var ln = /* @__PURE__ */ ((c) => (c[c.Tooltip = 1e3] = "Tooltip", c[c.Panel = 1100] = "Panel", c[c.Toolbar = 800] = "Toolbar", c[c.Overlay = 3e3] = "Overlay", c[c.Notification = 9900] = "Notification", c))(ln || {});
const Xc = z.createContext(null), Tc = "kg-theme";
function Yf({ children: c }) {
  const [n, i] = z.useState(() => localStorage.getItem(Tc) === "dark" ? "dark" : "light"), s = z.useCallback((d) => i(d), []), u = z.useCallback(
    () => i((d) => d === "light" ? "dark" : "light"),
    []
  );
  return z.useEffect(() => {
    document.documentElement.dataset.theme = n, localStorage.setItem(Tc, n);
  }, [n]), /* @__PURE__ */ C.jsx(Xc.Provider, { value: { theme: n, setTheme: s, toggle: u }, children: c });
}
function ho() {
  const c = z.useContext(Xc);
  if (!c) throw new Error("useTheme must be used within ThemeProvider");
  return c;
}
const $f = {
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
}, Gf = {
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
}, Qf = { light: $f, dark: Gf };
function er(c) {
  return Qf[c];
}
function cl(c, n = 1) {
  const i = c.replace("#", ""), s = parseInt(i.slice(0, 2), 16), u = parseInt(i.slice(2, 4), 16), d = parseInt(i.slice(4, 6), 16);
  return `rgba(${s}, ${u}, ${d}, ${n})`;
}
const Kf = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认"
};
function Zf({ onClose: c }) {
  const { theme: n } = ho(), i = Object.fromEntries(
    Object.entries(er(n).node).map(([s, u]) => [s, u.bg])
  );
  return /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "legend-panel",
      layer: ln.Panel,
      draggable: !0,
      onClose: c,
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
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            style: {
              padding: "10px 12px",
              borderBottom: "1px solid rgb(var(--border))"
            },
            children: [
              /* @__PURE__ */ C.jsx(
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
              Object.entries(i).map(([s, u]) => /* @__PURE__ */ C.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "3px 0"
                  },
                  children: [
                    /* @__PURE__ */ C.jsx(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: u,
                          border: "1px solid rgba(0,0,0,0.15)",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ C.jsx("span", { children: Kf[s] ?? s })
                  ]
                },
                s
              ))
            ]
          }
        ),
        /* @__PURE__ */ C.jsxs("div", { style: { padding: "10px 12px" }, children: [
          /* @__PURE__ */ C.jsx(
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
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ C.jsx(
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
                /* @__PURE__ */ C.jsx("span", { children: "默认关系" })
              ]
            }
          ),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ C.jsx(
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
                /* @__PURE__ */ C.jsx("span", { children: "悬停高亮" })
              ]
            }
          ),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ C.jsx(
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
                /* @__PURE__ */ C.jsx("span", { children: "关联高亮" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const qf = 200, Jf = 150, ep = 800, tp = 600, np = 60, rp = 0.1, ip = 2, op = "rgba(0, 102, 255, 0.25)", sp = "#0066ff";
function lp({ viewRef: c }) {
  const n = z.useRef(null), i = z.useRef(0), s = z.useRef(!1), { theme: u } = ho(), d = z.useCallback(() => {
    const S = c.current;
    return S ? S.model.getGraphModelData().graphData : null;
  }, [c]), h = z.useCallback(() => {
    const S = d();
    if (!S || S.nodes.length === 0) return null;
    let w = 1 / 0, R = 1 / 0, P = -1 / 0, y = -1 / 0;
    for (const U of S.nodes) {
      const O = U.x ?? 0, Q = U.y ?? 0;
      O < w && (w = O), Q < R && (R = Q), O > P && (P = O), Q > y && (y = Q);
    }
    const _ = Math.max(P - w, 1), L = Math.max(y - R, 1), X = Math.max(
      np,
      Math.max(_, L) * rp
    ), j = Math.max(ep, _ + X * 2), W = Math.max(tp, L + X * 2), Y = (w + P) / 2, M = (R + y) / 2;
    return { x: Y - j / 2, y: M - W / 2, width: j, height: W };
  }, [d]), p = z.useCallback(() => {
    const S = c.current;
    if (!S) return null;
    const w = S.renderer.interaction.transform, R = S.renderer.canvas, P = R.clientWidth, y = R.clientHeight;
    return !P || !y ? null : {
      left: -w.x,
      top: -w.y,
      right: P / w.k - w.x,
      bottom: y / w.k - w.y
    };
  }, [c]), v = z.useCallback(
    (S) => {
      const w = c.current;
      if (!w) return;
      const R = h();
      if (!R) return;
      const P = n.current, y = P == null ? void 0 : P.getBoundingClientRect();
      if (!P || !y) return;
      const _ = P.clientWidth || 1, L = P.clientHeight || 1, X = S.clientX - y.left, j = S.clientY - y.top, W = R.x + X / _ * R.width, Y = R.y + j / L * R.height, M = w.renderer.interaction.transform, U = w.renderer.canvas;
      M.x = U.clientWidth / (2 * M.k) - W, M.y = U.clientHeight / (2 * M.k) - Y;
    },
    [c, h]
  ), g = z.useCallback(
    (S) => {
      var w, R;
      (R = (w = S.currentTarget).setPointerCapture) == null || R.call(w, S.pointerId), s.current = !0, v(S);
    },
    [v]
  ), x = z.useCallback(
    (S) => {
      s.current && v(S);
    },
    [v]
  ), N = z.useCallback((S) => {
    var w, R;
    s.current = !1;
    try {
      (R = (w = S.currentTarget).releasePointerCapture) == null || R.call(w, S.pointerId);
    } catch {
    }
  }, []);
  return z.useEffect(() => {
    const S = n.current;
    if (!S) return;
    const w = S.getContext("2d"), R = () => {
      const P = S.clientWidth, y = S.clientHeight;
      if (P === 0 || y === 0) {
        i.current = requestAnimationFrame(R);
        return;
      }
      const _ = window.devicePixelRatio || 1, L = Math.round(P * _), X = Math.round(y * _);
      (S.width !== L || S.height !== X) && (S.width = L, S.height = X), w.setTransform(_, 0, 0, _, 0, 0);
      const j = c.current, W = d(), Y = h(), M = p();
      if (!j || !W || !Y || !M) {
        i.current = requestAnimationFrame(R);
        return;
      }
      const U = er(u), O = (B, I) => [
        (B - Y.x) / Y.width * P,
        (I - Y.y) / Y.height * y
      ];
      w.clearRect(0, 0, P, y), w.fillStyle = U.canvas, w.beginPath(), w.roundRect(0, 0, P, y, 6), w.fill(), w.save(), w.beginPath(), w.roundRect(0, 0, P, y, 6), w.clip();
      const Q = /* @__PURE__ */ new Map();
      for (const B of W.nodes)
        Q.set(String(B.id), { x: B.x ?? 0, y: B.y ?? 0 });
      w.strokeStyle = cl(U.link.default, 0.5), w.lineWidth = 0.5;
      for (const B of W.links) {
        const I = typeof B.source == "object" ? String(B.source.id) : String(B.source), H = typeof B.target == "object" ? String(B.target.id) : String(B.target), J = Q.get(I), E = Q.get(H);
        if (!J || !E) continue;
        const [V, pe] = O(J.x, J.y), [ue, xe] = O(E.x, E.y);
        w.beginPath(), w.moveTo(V, pe), w.lineTo(ue, xe), w.stroke();
      }
      w.fillStyle = cl(U.text, 0.6);
      for (const B of W.nodes) {
        const [I, H] = O(B.x ?? 0, B.y ?? 0);
        w.beginPath(), w.arc(I, H, ip, 0, Math.PI * 2), w.fill();
      }
      const oe = (M.right - M.left) / Y.width, ve = (M.bottom - M.top) / Y.height, le = P * oe, se = y * ve, ie = (M.left - Y.x) / Y.width * P, re = (M.top - Y.y) / Y.height * y;
      w.fillStyle = op, w.fillRect(ie, re, le, se), w.strokeStyle = sp, w.lineWidth = 1, w.strokeRect(ie, re, le, se), w.restore(), w.strokeStyle = cl(U.muted, 0.6), w.lineWidth = 1, w.beginPath(), w.roundRect(0, 0, P, y, 6), w.stroke(), i.current = requestAnimationFrame(R);
    };
    return i.current = requestAnimationFrame(R), () => {
      cancelAnimationFrame(i.current);
    };
  }, [c, d, h, p, u]), /* @__PURE__ */ C.jsx(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 12,
        right: 12,
        width: qf,
        height: Jf,
        borderRadius: 6,
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        zIndex: 100
      },
      onPointerDown: g,
      onPointerMove: x,
      onPointerUp: N,
      onPointerLeave: N,
      children: /* @__PURE__ */ C.jsx(
        "canvas",
        {
          ref: n,
          style: { width: "100%", height: "100%", display: "block" }
        }
      )
    }
  );
}
const Yc = z.createContext(null);
function Gr() {
  const c = z.useContext(Yc);
  if (!c) throw new Error("useAppCtx must be used within AppProvider");
  return c;
}
function ap({
  value: c,
  children: n
}) {
  return /* @__PURE__ */ C.jsx(Yc.Provider, { value: c, children: n });
}
const Cc = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function up({ loadedNeighbors: c }) {
  var v, g, x, N;
  const { hoveredNode: n, mousePos: i } = Gr(), s = n, u = i, d = ((v = s.data) == null ? void 0 : v.neighbors) ?? {}, h = Object.keys(d).length, p = Object.values(d).reduce(
    (S, w) => S + Object.values(w).reduce((R, P) => R + (P.total ?? 0), 0),
    0
  );
  return /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "node-tooltip",
      layer: ln.Tooltip,
      position: { x: u.x + 16, y: u.y - 12 },
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
        /* @__PURE__ */ C.jsx(
          "div",
          {
            style: {
              color: "#e94560",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: ((g = s.data) == null ? void 0 : g.label) ?? s.id
          }
        ),
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            style: {
              color: "rgb(var(--muted))",
              fontSize: "11px",
              marginBottom: 6
            },
            children: [
              Cc[((x = s.data) == null ? void 0 : x.nodeType) ?? ""] ?? ((N = s.data) == null ? void 0 : N.nodeType),
              " · ",
              h,
              " 类关联 · 共 ",
              p,
              " 条"
            ]
          }
        ),
        /* @__PURE__ */ C.jsx(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: Object.entries(d).map(([S, w]) => {
              const R = Object.entries(w), P = c[S] ?? { out: 0, in: 0 }, y = P.out + P.in, _ = R.reduce((L, [, X]) => L + X.total, 0) - y;
              return /* @__PURE__ */ C.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8 }, children: [
                /* @__PURE__ */ C.jsx(
                  "span",
                  {
                    style: { color: "rgb(var(--foreground))", fontWeight: "bold" },
                    children: Cc[S] ?? S
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "span",
                  {
                    style: {
                      color: "rgb(var(--muted))",
                      marginLeft: 4,
                      fontSize: "11px"
                    },
                    children: _ > 0 ? `可拓 ${_}` : "已拓完"
                  }
                )
              ] }, S);
            })
          }
        )
      ]
    }
  );
}
const cp = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
};
function dp(c) {
  const { hoveredLink: n, mousePos: i } = Gr(), s = n, u = i, d = s.data ?? {}, h = d.linkType ?? "", p = d.label ?? "", v = d.time ?? "", g = typeof s.source == "object" ? s.source.id : s.source, x = typeof s.target == "object" ? s.target.id : s.target;
  return /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "link-tooltip",
      layer: ln.Tooltip,
      position: { x: u.x + 16, y: u.y - 12 },
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
        /* @__PURE__ */ C.jsx(
          "div",
          {
            style: {
              color: "#0288d1",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: cp[h] ?? h
          }
        ),
        /* @__PURE__ */ C.jsx(
          "div",
          {
            style: {
              color: "rgb(var(--muted))",
              fontSize: "11px",
              marginBottom: 6
            },
            children: s.id
          }
        ),
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: [
              p && /* @__PURE__ */ C.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ C.jsx("span", { style: { color: "#8899aa" }, children: "描述: " }),
                /* @__PURE__ */ C.jsx("span", { style: { fontWeight: "bold" }, children: p })
              ] }),
              v && /* @__PURE__ */ C.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ C.jsx("span", { style: { color: "#8899aa" }, children: "时间: " }),
                /* @__PURE__ */ C.jsx("span", { style: { fontWeight: "bold" }, children: v })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ C.jsx("span", { style: { color: "#8899aa" }, children: "源节点: " }),
                g
              ] }),
              /* @__PURE__ */ C.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ C.jsx("span", { style: { color: "#8899aa" }, children: "目标节点: " }),
                x
              ] })
            ]
          }
        )
      ]
    }
  );
}
const hp = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
}, fp = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, pp = {
  label: "名称/标识",
  gender: "性别",
  age: "年龄",
  caseWeight: "案件权重"
}, Ec = {
  person: [
    { name: "label", type: "string" },
    { name: "gender", type: "string" },
    { name: "age", type: "number" },
    { name: "caseWeight", type: "number" }
  ],
  phone: [{ name: "label", type: "string" }],
  address: [{ name: "label", type: "string" }],
  account: [{ name: "label", type: "string" }]
}, gp = {
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
function vp({
  node: c,
  loadedNeighbors: n,
  x: i,
  y: s,
  onExpand: u,
  onClose: d
}) {
  var V, pe, ue, xe;
  const h = ((V = c.data) == null ? void 0 : V.neighbors) ?? {}, p = Object.keys(h), v = z.useMemo(
    () => p.filter(($) => {
      const Z = Object.values(h[$] ?? {}).reduce(
        (G, ge) => G + (ge.total ?? 0),
        0
      ), te = n[$] ?? { out: 0, in: 0 };
      return Z - (te.out + te.in) > 0;
    }),
    [p, h, n]
  ), g = ($) => h[$] ? Object.keys(h[$]) : [], x = ($, Z) => {
    var G;
    const te = (G = h[$]) == null ? void 0 : G[Z];
    return te != null && te.out && te.out > 0 ? "out" : te != null && te.in && te.in > 0 ? "in" : "";
  }, N = v[0] ?? "", S = N ? g(N)[0] ?? "" : "", [w, R] = z.useState([
    {
      targetType: N,
      relationType: S,
      direction: x(N, S),
      filters: []
    }
  ]), [P, y] = z.useState(/* @__PURE__ */ new Set()), _ = ($, Z) => `${$}.${Z}`, L = () => {
    const $ = /* @__PURE__ */ new Set();
    return w.forEach((Z, te) => {
      Z.targetType || $.add(_(te, "targetType")), Z.relationType || $.add(_(te, "relationType")), Z.direction || $.add(_(te, "direction"));
    }), y($), $.size === 0;
  }, X = ($, Z) => {
    y((te) => {
      const G = new Set(te);
      return G.delete(_($, Z)), G;
    });
  }, j = ($, Z) => {
    R((te) => {
      const G = te.map((ge, Ce) => Ce === $ ? { ...ge, ...Z } : ge);
      if ("targetType" in Z) {
        const ge = G[$], Ce = g(ge.targetType);
        ge.relationType && !Ce.includes(ge.relationType) && (G[$] = { ...ge, relationType: Ce[0], filters: [] });
      }
      return G;
    }), Object.keys(Z).forEach((te) => X($, te));
  }, W = () => {
    const $ = v[0] ?? "", Z = $ ? g($)[0] ?? "" : "";
    R((te) => [
      ...te,
      {
        targetType: $,
        relationType: Z,
        direction: x($, Z),
        filters: []
      }
    ]);
  }, Y = ($) => {
    R((Z) => Z.filter((te, G) => G !== $));
  }, M = ($) => {
    R(
      (Z) => Z.map(
        (te, G) => G === $ ? {
          ...te,
          filters: [
            ...te.filters,
            { property: "", operator: "eq", value: "" }
          ]
        } : te
      )
    );
  }, U = ($, Z, te) => {
    R(
      (G) => G.map(
        (ge, Ce) => Ce === $ ? {
          ...ge,
          filters: ge.filters.map(
            (Re, Se) => Se === Z ? { ...Re, ...te } : Re
          )
        } : ge
      )
    );
  }, O = ($, Z) => {
    R(
      (te) => te.map(
        (G, ge) => ge === $ ? { ...G, filters: G.filters.filter((Ce, Re) => Re !== Z) } : G
      )
    );
  }, Q = ($) => Ec[$] ?? [{ name: "label", type: "string" }], oe = ($) => Object.entries(gp).filter(([, Z]) => Z.types.includes($)).map(([Z, te]) => ({ key: Z, label: te.label })), ve = ($, Z, te) => P.has(_($, Z)) ? { ...te, borderColor: "#d32f2f", outline: "1px solid #d32f2f" } : te, le = ($, Z) => {
    var G;
    const te = Ec[$];
    return ((G = te == null ? void 0 : te.find((ge) => ge.name === Z)) == null ? void 0 : G.type) ?? "string";
  }, se = document.querySelector("canvas"), ie = (se == null ? void 0 : se.getBoundingClientRect()) ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }, re = ie.top + ie.height, B = ie.left + ie.width, I = 420, H = Math.max(250, Math.round(window.innerHeight * 0.2));
  let J = i, E = s;
  return J + I > B - 10 && (J = B - I - 10), E + H > re - 10 && (E = re - H - 10), E < ie.top + 10 && (E = ie.top + 10), /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "rule-menu",
      layer: ln.Panel,
      draggable: !0,
      onClose: d,
      position: { x: J, y: E },
      style: {
        width: I,
        maxHeight: H,
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
      onClick: ($) => $.stopPropagation(),
      children: [
        /* @__PURE__ */ C.jsxs(
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
              /* @__PURE__ */ C.jsx(
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
                  children: ((ue = (pe = c.data) == null ? void 0 : pe.label) == null ? void 0 : ue[0]) ?? "?"
                }
              ),
              /* @__PURE__ */ C.jsx(
                "span",
                {
                  style: {
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "rgb(var(--foreground))"
                  },
                  children: ((xe = c.data) == null ? void 0 : xe.label) ?? c.id
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ C.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "6px 0" }, children: [
          w.map(($, Z) => {
            const te = Q($.targetType);
            return /* @__PURE__ */ C.jsxs(
              "div",
              {
                style: {
                  margin: "4px 10px",
                  background: "rgb(var(--hover))",
                  borderRadius: 6,
                  border: "1px solid rgb(var(--border))"
                },
                children: [
                  /* @__PURE__ */ C.jsxs(
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
                        /* @__PURE__ */ C.jsx(
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
                        /* @__PURE__ */ C.jsx(
                          "span",
                          {
                            style: {
                              color: $.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: $.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: $.relationType,
                            onChange: (G) => j(Z, { relationType: G.target.value }),
                            style: ve(Z, "relationType", {
                              ...Vr,
                              width: 65
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: "关系" }),
                              g($.targetType).map((G) => /* @__PURE__ */ C.jsx("option", { value: G, children: fp[G] ?? G }, G))
                            ]
                          }
                        ),
                        /* @__PURE__ */ C.jsx(
                          "span",
                          {
                            style: {
                              color: $.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: $.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: $.targetType,
                            onChange: (G) => j(Z, { targetType: G.target.value }),
                            style: ve(Z, "targetType", {
                              ...Vr,
                              width: 85
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: "类型" }),
                              v.map((G) => {
                                const ge = Object.values(h[G] ?? {}).reduce(
                                  (Se, Be) => Se + (Be.total ?? 0),
                                  0
                                ), Ce = n[G] ?? { out: 0, in: 0 }, Re = ge - (Ce.out + Ce.in);
                                return /* @__PURE__ */ C.jsxs("option", { value: G, children: [
                                  hp[G] ?? G,
                                  " (",
                                  Re,
                                  ")"
                                ] }, G);
                              })
                            ]
                          }
                        ),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: $.direction,
                            onChange: (G) => j(Z, { direction: G.target.value }),
                            style: ve(Z, "direction", {
                              ...Vr,
                              width: 100
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: "方向" }),
                              (() => {
                                var Be;
                                const G = (Be = h[$.targetType]) == null ? void 0 : Be[$.relationType], ge = n[$.targetType] ?? {
                                  out: 0,
                                  in: 0
                                }, Ce = ((G == null ? void 0 : G.out) ?? 0) - ge.out, Re = ((G == null ? void 0 : G.in) ?? 0) - ge.in, Se = [];
                                return Ce > 0 && Se.push({
                                  value: "out",
                                  label: `从本节点 (${Ce})`
                                }), Re > 0 && Se.push({
                                  value: "in",
                                  label: `指向本节点 (${Re})`
                                }), Se.length > 0 && Se.map((Et) => /* @__PURE__ */ C.jsx("option", { value: Et.value, children: Et.label }, Et.value));
                              })()
                            ]
                          }
                        ),
                        w.length > 1 && /* @__PURE__ */ C.jsx(
                          "span",
                          {
                            style: {
                              color: "#d32f2f",
                              cursor: "pointer",
                              fontSize: "14px"
                            },
                            onClick: () => Y(Z),
                            children: "✕"
                          }
                        )
                      ]
                    }
                  ),
                  $.filters.map((G, ge) => {
                    const Ce = G.property ? le($.targetType, G.property) : "string", Re = oe(Ce);
                    return /* @__PURE__ */ C.jsxs(
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
                          /* @__PURE__ */ C.jsxs(
                            "select",
                            {
                              value: G.property,
                              onChange: (Se) => U(Z, ge, {
                                property: Se.target.value,
                                operator: "eq",
                                value: ""
                              }),
                              style: { ...Vr, width: 80 },
                              children: [
                                /* @__PURE__ */ C.jsx("option", { value: "", children: "属性" }),
                                te.map((Se) => /* @__PURE__ */ C.jsx("option", { value: Se.name, children: pp[Se.name] ?? Se.name }, Se.name))
                              ]
                            }
                          ),
                          G.property && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                            /* @__PURE__ */ C.jsx(
                              "select",
                              {
                                value: G.operator,
                                onChange: (Se) => U(Z, ge, { operator: Se.target.value }),
                                style: { ...Vr, width: 80 },
                                children: Re.map((Se) => /* @__PURE__ */ C.jsx("option", { value: Se.key, children: Se.label }, Se.key))
                              }
                            ),
                            G.operator === "between" ? /* @__PURE__ */ C.jsxs(
                              "span",
                              {
                                style: {
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center"
                                },
                                children: [
                                  /* @__PURE__ */ C.jsx(
                                    "input",
                                    {
                                      placeholder: "min",
                                      value: G.value,
                                      onChange: (Se) => U(Z, ge, { value: Se.target.value }),
                                      style: { ...fl, width: 50 }
                                    }
                                  ),
                                  /* @__PURE__ */ C.jsx("span", { style: { color: "#667" }, children: "~" })
                                ]
                              }
                            ) : /* @__PURE__ */ C.jsx(
                              "input",
                              {
                                placeholder: "值",
                                value: G.value,
                                onChange: (Se) => U(Z, ge, { value: Se.target.value }),
                                style: { ...fl, width: 60 }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ C.jsx(
                            "span",
                            {
                              style: {
                                color: "#d32f2f",
                                cursor: "pointer",
                                fontSize: "12px"
                              },
                              onClick: () => O(Z, ge),
                              children: "✕"
                            }
                          )
                        ]
                      },
                      ge
                    );
                  }),
                  /* @__PURE__ */ C.jsx(
                    "div",
                    {
                      style: {
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: /* @__PURE__ */ C.jsx(
                        "span",
                        {
                          style: {
                            color: "#1976d2",
                            cursor: "pointer",
                            fontSize: "11px"
                          },
                          onClick: () => M(Z),
                          children: "+ 添加过滤条件"
                        }
                      )
                    }
                  )
                ]
              },
              Z
            );
          }),
          /* @__PURE__ */ C.jsx("div", { style: { textAlign: "center", padding: "6px 0" }, children: /* @__PURE__ */ C.jsx(
            "span",
            {
              style: { color: "#1976d2", cursor: "pointer", fontSize: "12px" },
              onClick: W,
              children: "+ 添加拓出条件"
            }
          ) })
        ] }),
        /* @__PURE__ */ C.jsxs(
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
              /* @__PURE__ */ C.jsx(
                "button",
                {
                  style: {
                    ...Pc,
                    border: "1px solid rgb(var(--border-strong))",
                    background: "transparent",
                    color: "rgb(var(--muted))"
                  },
                  onClick: d,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ C.jsx(
                "button",
                {
                  style: {
                    ...Pc,
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold"
                  },
                  onClick: () => {
                    L() && (u(c.id, ["__custom__"], w), d());
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
const fl = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  color: "rgb(var(--foreground))",
  padding: "3px 6px",
  fontSize: "11px",
  outline: "none",
  fontFamily: "monospace"
}, Vr = {
  ...fl,
  cursor: "pointer"
}, Pc = {
  padding: "5px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "11px"
};
function yp() {
  return /* @__PURE__ */ C.jsxs(
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
        /* @__PURE__ */ C.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
        /* @__PURE__ */ C.jsx("circle", { cx: "12", cy: "13", r: "4" })
      ]
    }
  );
}
function mp() {
  return /* @__PURE__ */ C.jsxs(
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
        /* @__PURE__ */ C.jsx("polyline", { points: "3 6 5 6 21 6" }),
        /* @__PURE__ */ C.jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
      ]
    }
  );
}
const kp = {
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
}, xp = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderBottom: "1px solid rgb(var(--border))",
  fontWeight: 600,
  fontSize: "13px"
}, wp = {
  display: "flex",
  gap: "6px"
}, Sp = {
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
}, _p = {
  flex: 1,
  overflowY: "auto",
  padding: "4px 0"
}, $c = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  borderLeft: "3px solid transparent",
  transition: "background 0.15s"
}, Tp = {
  ...$c,
  borderLeft: "3px solid #e94560",
  background: "rgba(233,69,96,0.06)"
}, Cp = {
  flex: 1,
  overflow: "hidden"
}, Ep = {
  fontSize: "12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}, Pp = {
  fontSize: "10px",
  color: "rgb(var(--muted))",
  marginTop: 2
}, Np = {
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
}, Ap = {
  padding: "20px",
  textAlign: "center",
  color: "rgb(var(--muted))",
  fontSize: "11px"
};
function Rp(c) {
  const n = new Date(c);
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")} ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`;
}
function bp({
  historyManager: c,
  currentIndex: n,
  onTakeSnapshot: i,
  onJumpTo: s,
  onDeleteEntry: u,
  onClose: d
}) {
  const h = z.useRef(null), p = c.getHistory();
  return z.useEffect(() => {
    if (!h.current) return;
    const v = h.current.children[n];
    v && v.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [n]), /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "snapshot-panel",
      layer: ln.Panel,
      draggable: !0,
      onClose: d,
      resizable: !0,
      defaultSize: { w: 260, h: 300 },
      position: { x: window.innerWidth - 280, y: 40 },
      style: kp,
      children: [
        /* @__PURE__ */ C.jsxs("div", { style: xp, children: [
          /* @__PURE__ */ C.jsx("span", { children: "📸 快照" }),
          /* @__PURE__ */ C.jsx("div", { style: wp, children: /* @__PURE__ */ C.jsx(
            "button",
            {
              style: Sp,
              onClick: i,
              title: "拍摄快照",
              onMouseEnter: (v) => {
                v.currentTarget.style.background = "rgba(233,69,96,0.2)";
              },
              onMouseLeave: (v) => {
                v.currentTarget.style.background = "transparent";
              },
              children: /* @__PURE__ */ C.jsx(yp, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ C.jsx("div", { ref: h, style: _p, children: p.length === 0 ? /* @__PURE__ */ C.jsxs("div", { style: Ap, children: [
          "暂无快照",
          /* @__PURE__ */ C.jsx("br", {}),
          /* @__PURE__ */ C.jsx("span", { style: { fontSize: 10 }, children: "点击 📷 拍摄当前图谱" })
        ] }) : p.map((v, g) => {
          const x = g === n;
          return /* @__PURE__ */ C.jsxs(
            "div",
            {
              style: x ? Tp : $c,
              onClick: () => s(g),
              onMouseEnter: (N) => {
                x || (N.currentTarget.style.background = "rgb(var(--hover))");
                const S = N.currentTarget.querySelector(
                  ".del-btn"
                );
                S && (S.style.opacity = "1");
              },
              onMouseLeave: (N) => {
                x || (N.currentTarget.style.background = "transparent");
                const S = N.currentTarget.querySelector(
                  ".del-btn"
                );
                S && (S.style.opacity = "0");
              },
              children: [
                /* @__PURE__ */ C.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 14,
                      opacity: x ? 1 : 0.4,
                      flexShrink: 0
                    },
                    children: x ? "●" : "○"
                  }
                ),
                /* @__PURE__ */ C.jsxs("div", { style: Cp, children: [
                  /* @__PURE__ */ C.jsx("div", { style: Ep, children: v.description || v.type }),
                  /* @__PURE__ */ C.jsx("div", { style: Pp, children: Rp(v.timestamp) })
                ] }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "del-btn",
                    style: Np,
                    onClick: (N) => {
                      N.stopPropagation(), u(g);
                    },
                    onMouseEnter: (N) => {
                      N.currentTarget.style.color = "rgb(var(--primary))";
                    },
                    onMouseLeave: (N) => {
                      N.currentTarget.style.color = "rgb(var(--muted))";
                    },
                    children: /* @__PURE__ */ C.jsx(mp, {})
                  }
                )
              ]
            },
            g
          );
        }) }),
        /* @__PURE__ */ C.jsxs(
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
              p.length,
              "/",
              c.maxSize,
              " · 当前 #",
              n + 1
            ]
          }
        )
      ]
    }
  );
}
function Gc() {
  const [c, n] = z.useState({
    status: "idle",
    data: null,
    error: null
  }), i = z.useRef(0), s = z.useRef(null), u = z.useCallback(async (h) => {
    var g;
    const p = ++i.current;
    (g = s.current) == null || g.abort();
    const v = new AbortController();
    s.current = v, n((x) => ({ ...x, status: "loading", error: null }));
    try {
      const x = await h(v.signal);
      return p !== i.current ? void 0 : (n({ status: "success", data: x, error: null }), x);
    } catch (x) {
      if (p !== i.current || (x == null ? void 0 : x.name) === "AbortError") return;
      n({
        status: "error",
        data: null,
        error: x instanceof Error ? x.message : String(x)
      });
    }
  }, []), d = z.useCallback(() => {
    var h;
    i.current++, (h = s.current) == null || h.abort(), n({ status: "idle", data: null, error: null });
  }, []);
  return z.useEffect(() => () => {
    var h;
    i.current++, (h = s.current) == null || h.abort();
  }, []), {
    ...c,
    run: u,
    reset: d,
    isLoading: c.status === "loading",
    isSuccess: c.status === "success",
    isError: c.status === "error"
  };
}
const Lp = "/api/v1";
let pl = "";
function Mp(c) {
  pl = c;
}
async function so(c, n, i) {
  const s = {
    "Content-Type": "application/json"
  };
  pl && (s.Authorization = `Bearer ${pl}`);
  const u = await fetch(`${Lp}${c}`, {
    method: "POST",
    headers: s,
    body: JSON.stringify(n),
    signal: i
  });
  if (!u.ok) {
    const h = await u.text();
    throw new Error(`API ${c} failed (${u.status}): ${h}`);
  }
  const d = await u.json();
  if (!d.success) throw new Error(`API ${c} failed`);
  return d.data;
}
const Qr = {
  init(c) {
    return so("/graph/init", { ids: c });
  },
  search(c, n = 10, i) {
    return so("/graph/search", { query: c, limit: n }, i);
  },
  expand(c) {
    return so("/graph/expand", c);
  },
  analyze(c, n) {
    return so("/graph/analyze", c, n);
  }
}, Dp = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, Ip = [
  { value: "1d", label: "1 天" },
  { value: "7d", label: "1 周" },
  { value: "30d", label: "1 个月" },
  { value: "90d", label: "3 个月" },
  { value: "365d", label: "1 年" }
], dl = [
  {
    value: "call_circle",
    label: "通话圈分析",
    params: [
      {
        key: "timeWindow",
        label: "时间范围",
        type: "select",
        options: Ip
      }
    ],
    resultLabel: (c) => c.label ?? c.id,
    resultDetail: (c) => `${Dp[c.relation] ?? c.relation} · ${c.count ?? 0} 次${c.time ? ` · ${c.time}` : ""}`
  }
], Nc = {
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
function Fp({
  modelRef: c,
  viewRef: n,
  onClose: i,
  onExpand: s
}) {
  const { analysisTarget: u } = Gr(), [d, h] = z.useState(dl[0].value), [p, v] = z.useState([]), [g, x] = z.useState(null), [N, S] = z.useState({
    timeWindow: "1d"
  }), { run: w, isLoading: R } = Gc();
  z.useEffect(() => () => {
    var W, Y;
    (W = n.current) == null || W.setHighlightNodes([]), (Y = n.current) == null || Y.setHoveredNodes([]);
  }, [n]);
  const P = (W) => {
    var Y;
    return ((Y = c.current) == null ? void 0 : Y.getGraphModelData().graphData.nodes.some((M) => M.id === W)) ?? !1;
  };
  if (!u) return null;
  const y = u.ids, _ = u.labels, L = dl.find((W) => W.value === d), X = () => {
    var Y;
    const W = { nodeIds: y, type: d };
    for (const M of L.params) {
      const U = (Y = N[M.key]) == null ? void 0 : Y.trim();
      U && (W[M.key] = U);
    }
    w(async (M) => await Qr.analyze(W, M)).then((M) => {
      if (!M) return;
      const U = M.items ?? [];
      v(U), x(M.graphData ?? null);
      const O = c.current, Q = n.current;
      if (O && Q) {
        const oe = new Set(
          O.getGraphModelData().graphData.nodes.map((ve) => ve.id)
        );
        Q.setHighlightNodes(
          U.filter((ve) => oe.has(ve.id)).map((ve) => ve.id)
        );
      }
    });
  }, j = () => L.params.length === 0 ? null : /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
    L.params.map(
      (W) => W.type === "select" && W.options ? /* @__PURE__ */ C.jsx(
        "select",
        {
          value: N[W.key] ?? "",
          onChange: (Y) => S((M) => ({ ...M, [W.key]: Y.target.value })),
          style: {
            ...Nc,
            width: "auto",
            minWidth: 80,
            cursor: "pointer"
          },
          children: W.options.map((Y) => /* @__PURE__ */ C.jsx("option", { value: Y.value, children: Y.label }, Y.value))
        },
        W.key
      ) : /* @__PURE__ */ C.jsx(
        "input",
        {
          placeholder: W.placeholder ?? W.label,
          value: N[W.key] ?? "",
          onChange: (Y) => S((M) => ({ ...M, [W.key]: Y.target.value })),
          style: Nc
        },
        W.key
      )
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: X,
        disabled: R,
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
        children: R ? "..." : "查询"
      }
    )
  ] });
  return /* @__PURE__ */ C.jsxs(
    nr,
    {
      id: "analysis-panel",
      layer: ln.Panel,
      draggable: !0,
      onClose: i,
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
        /* @__PURE__ */ C.jsxs(
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
              /* @__PURE__ */ C.jsx("span", { style: { fontWeight: "bold", fontSize: "13px" }, children: "分析" }),
              /* @__PURE__ */ C.jsx(
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
                  children: _.join(", ")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ C.jsxs(
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
              /* @__PURE__ */ C.jsx(
                "select",
                {
                  value: d,
                  onChange: (W) => {
                    h(W.target.value), v([]), x(null), S({});
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
                  children: dl.map((W) => /* @__PURE__ */ C.jsx("option", { value: W.value, children: W.label }, W.value))
                }
              ),
              j()
            ]
          }
        ),
        /* @__PURE__ */ C.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
          p.length === 0 && !R && /* @__PURE__ */ C.jsx(
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
          p.map((W, Y) => /* @__PURE__ */ C.jsxs(
            "div",
            {
              style: {
                padding: "8px 14px",
                borderBottom: "1px solid rgb(var(--border))",
                fontSize: "12px",
                cursor: "pointer"
              },
              onClick: () => {
                if (!g) return;
                const M = W.sourceId, U = W.id, O = g.links.filter(
                  (le) => le.source === M && le.target === U || le.source === U && le.target === M
                ), Q = /* @__PURE__ */ new Set();
                O.forEach((le) => {
                  Q.add(le.source), Q.add(le.target);
                });
                let oe = g.nodes.filter(
                  (le) => Q.has(le.id)
                );
                const ve = new Set(oe.map((le) => le.id));
                M && !ve.has(M) && (oe = [
                  ...oe,
                  { id: M, data: { nodeType: "phone", label: M } }
                ]), s({ nodes: oe, links: O });
              },
              onMouseEnter: (M) => {
                var U;
                M.currentTarget.style.background = "rgb(var(--hover))", P(W.id) && ((U = n.current) == null || U.setHoveredNodes([W.id]));
              },
              onMouseLeave: (M) => {
                var U;
                M.currentTarget.style.background = "rgb(var(--background))", (U = n.current) == null || U.setHoveredNodes([]);
              },
              children: [
                /* @__PURE__ */ C.jsx("div", { style: { fontWeight: "bold", color: "rgb(var(--primary))" }, children: L.resultLabel(W) }),
                /* @__PURE__ */ C.jsx("div", { style: { color: "rgb(var(--muted))", fontSize: "11px" }, children: L.resultDetail(W) })
              ]
            },
            `${W.id}-${Y}`
          ))
        ] })
      ]
    }
  );
}
function zp(c, n = 300) {
  const i = z.useRef(), s = z.useRef(c);
  return s.current = c, z.useEffect(() => () => {
    i.current && clearTimeout(i.current);
  }, []), z.useCallback(
    (...u) => {
      i.current && clearTimeout(i.current), i.current = setTimeout(() => s.current(...u), n);
    },
    [n]
  );
}
const jp = {
  padding: "4px 8px",
  fontSize: "13px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  outline: "none",
  width: 180,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, Op = {
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
}, Bp = {
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "rgb(var(--foreground))",
  borderBottom: "1px solid rgb(var(--border))"
}, Up = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function Hp({ onSelect: c }) {
  const [n, i] = z.useState(""), [s, u] = z.useState(!1), [d, h] = z.useState(-1), p = z.useRef(null), v = z.useRef(null), { data: g, run: x, reset: N } = Gc(), S = zp((y) => {
    const _ = y.trim();
    if (!_) {
      N(), u(!1), h(-1);
      return;
    }
    x(async (L) => (await Qr.search(_, 10, L)).nodes ?? []).then((L) => {
      u(!!(L != null && L.length)), h(L != null && L.length ? 0 : -1);
    });
  }, 300), w = (y) => {
    i(y), S(y);
  }, R = (y) => {
    const _ = g ?? [];
    y.key === "ArrowDown" ? (y.preventDefault(), s && _.length > 0 && h((L) => (L + 1) % _.length)) : y.key === "ArrowUp" ? (y.preventDefault(), s && _.length > 0 && h((L) => L <= 0 ? _.length - 1 : L - 1)) : y.key === "Enter" ? (y.preventDefault(), s && _.length > 0 && d >= 0 && P(_[d].id)) : y.key === "Escape" && u(!1);
  };
  z.useEffect(() => {
    const y = (_) => {
      p.current && !p.current.contains(_.target) && u(!1);
    };
    return document.addEventListener("mousedown", y), () => document.removeEventListener("mousedown", y);
  }, []), z.useEffect(() => {
    const y = v.current;
    if (!y || d < 0) return;
    const _ = y.children[d];
    _ == null || _.scrollIntoView({ block: "nearest" });
  }, [d]);
  const P = (y) => {
    i(""), N(), u(!1), h(-1), c(y);
  };
  return /* @__PURE__ */ C.jsxs("div", { ref: p, style: { position: "relative" }, children: [
    /* @__PURE__ */ C.jsx(
      "input",
      {
        placeholder: "搜索节点...",
        value: n,
        onChange: (y) => w(y.target.value),
        onKeyDown: R,
        onFocus: () => ((g == null ? void 0 : g.length) ?? 0) > 0 && u(!0),
        style: jp
      }
    ),
    s && g && g.length > 0 && /* @__PURE__ */ C.jsx("div", { ref: v, style: Op, children: g.map((y, _) => {
      var L, X, j;
      return /* @__PURE__ */ C.jsxs(
        "div",
        {
          style: {
            ...Bp,
            background: _ === d ? "rgb(var(--hover))" : "transparent"
          },
          onClick: () => P(y.id),
          onMouseEnter: () => h(_),
          children: [
            /* @__PURE__ */ C.jsx("span", { style: { color: "#1976d2", fontWeight: "bold" }, children: ((L = y.data) == null ? void 0 : L.label) ?? y.id }),
            /* @__PURE__ */ C.jsx("span", { style: { color: "rgb(var(--muted))", marginLeft: 6 }, children: Up[((X = y.data) == null ? void 0 : X.nodeType) ?? ""] ?? ((j = y.data) == null ? void 0 : j.nodeType) })
          ]
        },
        y.id
      );
    }) })
  ] });
}
const Vp = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: "5px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  borderBottom: "1px solid rgb(var(--border-strong))",
  flexWrap: "wrap",
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, Ct = {
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
function Wp({
  historyManagerRef: c,
  onFitView: n,
  onToggleSnapshotPanel: i,
  onToggleLegend: s,
  onToggleMiniMap: u,
  onUndo: d,
  onRedo: h,
  onSearchSelect: p,
  onAnalyze: v
}) {
  var U, O;
  const { zIndex: g } = Vc({ id: "toolbar", layer: ln.Toolbar }), {
    snapshotPanelOpen: x,
    legendPanelOpen: N,
    miniMapOpen: S,
    analysisPanelOpen: w,
    selectedNodeIds: R,
    selectionMode: P,
    // 当前选取模式
    selectedSelectionMode: y,
    // 当前候选的框选类型
    activateRectMode: _,
    activatePolygonMode: L,
    deactivateSelectionMode: X
  } = Gr(), j = ((U = c.current) == null ? void 0 : U.canGoBackSkipType("snapshot")) ?? !1, W = ((O = c.current) == null ? void 0 : O.canGoForwardSkipType("snapshot")) ?? !1, { theme: Y, toggle: M } = ho();
  return /* @__PURE__ */ C.jsxs("div", { style: { ...Vp, zIndex: g }, children: [
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: d,
        style: Ct,
        title: "回退",
        disabled: !j,
        children: /* @__PURE__ */ C.jsx(Vf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: h,
        style: Ct,
        title: "恢复",
        disabled: !W,
        children: /* @__PURE__ */ C.jsx(If, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx("button", { onClick: n, style: Ct, title: "Fit View", children: /* @__PURE__ */ C.jsx(Pf, { size: 14 }) }),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: i,
        style: {
          ...Ct,
          background: x ? "rgba(233,69,96,0.25)" : "transparent",
          border: x ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "快照管理",
        children: /* @__PURE__ */ C.jsx(wf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: s,
        style: {
          ...Ct,
          background: N ? "rgba(233,69,96,0.25)" : "transparent",
          border: N ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "图例",
        children: /* @__PURE__ */ C.jsx(kf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: u,
        style: {
          ...Ct,
          background: S ? "rgba(233,69,96,0.25)" : "transparent",
          border: S ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "小地图",
        children: /* @__PURE__ */ C.jsx(Cf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx("span", { style: { fontSize: "11px", color: "#999", margin: "0 2px" }, children: "|" }),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: X,
        style: {
          ...Ct,
          background: P ? "transparent" : "#0066ff50",
          border: P ? "1px solid #ccc" : "1px solid #0066ff"
        },
        title: "默认模式",
        children: /* @__PURE__ */ C.jsx(bf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: _,
        style: {
          ...Ct,
          background: y === "rect" ? "rgba(230,126,0,0.15)" : "transparent",
          border: y === "rect" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "矩形框选 (默认，按下 Shift 激活)",
        children: /* @__PURE__ */ C.jsx(Of, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: L,
        style: {
          ...Ct,
          background: y === "polygon" ? "rgba(230,126,0,0.15)" : "transparent",
          border: y === "polygon" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "多边形框选 (按下 Shift 激活)",
        children: /* @__PURE__ */ C.jsx(Mf, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: v,
        disabled: R.size === 0,
        style: {
          ...Ct,
          background: w ? "rgba(233,69,96,0.25)" : "transparent",
          border: w ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "分析",
        children: /* @__PURE__ */ C.jsx(_f, { size: 14 })
      }
    ),
    /* @__PURE__ */ C.jsx(zf, { size: 14, style: { color: "rgb(var(--muted))" } }),
    /* @__PURE__ */ C.jsx(Hp, { onSelect: p }),
    /* @__PURE__ */ C.jsx(
      "button",
      {
        onClick: M,
        style: Ct,
        title: Y === "dark" ? "切换到亮色主题" : "切换到暗色主题",
        children: Y === "dark" ? /* @__PURE__ */ C.jsx(Uf, { size: 14 }) : /* @__PURE__ */ C.jsx(Af, { size: 14 })
      }
    )
  ] });
}
const Xp = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 100
};
function Yp() {
  const {
    selectionMode: c,
    rect: n,
    polygon: i,
    isShiftDown: s,
    isNearFirstVertex: u,
    getCanvasPos: d,
    startRect: h,
    updateRect: p,
    finishRect: v,
    addPolygonVertex: g,
    updatePolygonCursor: x,
    finishPolygon: N
  } = Gr(), S = z.useRef(null), w = z.useRef(!1), R = z.useRef(!1), P = s && c !== null, y = z.useCallback(
    (O) => {
      const { x: Q, y: oe } = d(O.clientX, O.clientY);
      if (c === "rect") {
        w.current = !0, h(Q, oe), O.preventDefault(), O.stopPropagation();
        return;
      }
      if (c === "polygon") {
        if (i && i.vertices.length >= 2 && u(Q, oe)) {
          R.current = !0, N(), O.preventDefault(), O.stopPropagation();
          return;
        }
        g(Q, oe), O.preventDefault(), O.stopPropagation();
        return;
      }
    },
    [
      d,
      c,
      h,
      i,
      u,
      N,
      g
    ]
  ), _ = z.useCallback(
    (O) => {
      const { x: Q, y: oe } = d(O.clientX, O.clientY);
      if (c === "rect" && w.current) {
        p(Q, oe), O.preventDefault(), O.stopPropagation();
        return;
      }
      if (c === "polygon") {
        x(Q, oe), O.preventDefault(), O.stopPropagation();
        return;
      }
    },
    [d, c, p, x]
  ), L = z.useCallback(
    (O) => {
      if (R.current) {
        R.current = !1, O.preventDefault(), O.stopPropagation();
        return;
      }
      if (w.current) {
        w.current = !1, v(), O.preventDefault(), O.stopPropagation();
        return;
      }
    },
    [v]
  ), X = z.useCallback(
    (O) => {
      c === "polygon" && i && i.vertices.length >= 2 && (N(), O.preventDefault(), O.stopPropagation());
    },
    [c, i, N]
  ), j = n ? Math.abs(n.x2 - n.x1) : 0, W = n ? Math.abs(n.y2 - n.y1) : 0, Y = n ? Math.min(n.x1, n.x2) : 0, M = n ? Math.min(n.y1, n.y2) : 0, U = i && i.vertices.length > 0 ? i.vertices.map((O) => `${O.x},${O.y}`).join(" ") : "";
  return /* @__PURE__ */ C.jsx(
    "div",
    {
      ref: S,
      style: {
        ...Xp,
        pointerEvents: P ? "auto" : "none"
      },
      onPointerDown: y,
      onPointerMove: _,
      onPointerUp: L,
      onDoubleClick: X,
      children: /* @__PURE__ */ C.jsxs(
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
            n && /* @__PURE__ */ C.jsx(C.Fragment, { children: /* @__PURE__ */ C.jsx(
              "rect",
              {
                x: Y,
                y: M,
                width: j,
                height: W,
                fill: "rgba(0, 102, 255, 0.08)",
                stroke: "#0066ff",
                strokeWidth: 1.5,
                strokeDasharray: "6 3"
              }
            ) }),
            i && i.vertices.length > 0 && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              i.vertices.length >= 3 && /* @__PURE__ */ C.jsx(
                "polygon",
                {
                  points: U,
                  fill: "rgba(0, 102, 255, 0.06)",
                  stroke: "none"
                }
              ),
              /* @__PURE__ */ C.jsx(
                "polyline",
                {
                  points: U,
                  fill: "none",
                  stroke: "#0066ff",
                  strokeWidth: 1.5,
                  strokeLinejoin: "round",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ C.jsx(
                "line",
                {
                  x1: i.vertices[i.vertices.length - 1].x,
                  y1: i.vertices[i.vertices.length - 1].y,
                  x2: i.cursorPos.x,
                  y2: i.cursorPos.y,
                  stroke: "#0066ff",
                  strokeWidth: 1,
                  strokeDasharray: "4 3"
                }
              ),
              i.vertices.map((O, Q) => /* @__PURE__ */ C.jsx(
                "circle",
                {
                  cx: O.x,
                  cy: O.y,
                  r: 4,
                  fill: Q === 0 ? "#0066ff" : "#fff",
                  stroke: "#0066ff",
                  strokeWidth: 1.5
                },
                Q
              ))
            ] })
          ]
        }
      )
    }
  );
}
function $p(c, n = {}) {
  const [i, s] = z.useState(null), [u, d] = z.useState(null), [h, p] = z.useState(/* @__PURE__ */ new Set());
  z.useEffect(() => {
    const g = c.current;
    if (!g) return;
    const x = g.events.subscribe("nodeHover", (y) => {
      s(y), y && d(null);
    }), N = g.events.subscribe("linkHover", ({ link: y }) => {
      d(y), y && s(null);
    }), S = g.events.subscribe("plusToolClick", (y) => {
      var _;
      y && ((_ = n.onPlusToolClick) == null || _.call(n, y));
    }), w = g.events.subscribe("nodeRightClick", (y) => {
      var _;
      y && ((_ = n.onNodeContextMenu) == null || _.call(
        n,
        y.node,
        y.screenPos.x,
        y.screenPos.y
      ));
    }), R = g.events.subscribe("nodeClick", ({ node: y, ctrlKey: _ }) => {
      y && p((L) => {
        const X = new Set(L);
        return _ ? X.has(y.id) ? X.delete(y.id) : X.add(y.id) : (X.clear(), X.add(y.id)), X;
      });
    }), P = g.events.subscribe("selectionChange", ({ nodeIds: y }) => {
      p((_) => {
        const L = new Set(y);
        return _.size === L.size && [..._].every((X) => L.has(X)) ? _ : L;
      });
    });
    return () => {
      x(), N(), S(), w(), R(), P();
    };
  }, [c.current]);
  const v = [...h];
  return z.useEffect(() => {
    const g = c.current;
    g && g.stateManager.setSelectedNodes(v, []);
  }, [c.current, v.join(",")]), {
    ctx: {
      hoveredNode: i,
      setHoveredNode: s,
      hoveredLink: u,
      setHoveredLink: d,
      selectedNodeIds: h,
      setSelectedNodeIds: p
    }
  };
}
function Gp(c, n) {
  const [i, s] = z.useState(null), [u, d] = z.useState(!1), [h, p] = z.useState(null);
  return z.useEffect(() => {
    const g = (x) => {
      const N = x.target;
      (N === c.current || N.tagName === "CANVAS") && s(null);
    };
    return document.addEventListener("click", g), () => document.removeEventListener("click", g);
  }, []), z.useEffect(() => {
    const g = (x) => {
      x.key === "Escape" && s(null);
    };
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, []), {
    handleRuleExpand: z.useCallback(
      async (g, x, N) => {
        s(null);
        const S = n.current;
        if (!S) return;
        d(!0);
        const w = (R) => {
          const P = (R == null ? void 0 : R.message) ?? String(R);
          console.error("[ExpandError]", P), p(P), setTimeout(() => p(null), 5e3);
        };
        try {
          N && await S.expand(g, JSON.stringify(N)).catch(w);
        } finally {
          d(!1);
        }
      },
      []
    ),
    ctx: { ruleMenu: i, setRuleMenu: s, expanding: u, runtimeError: h }
  };
}
const Ac = (c) => c, Qp = (c, n) => {
  const i = n ?? "default", s = c.node[i];
  if (s) return Ac(s);
  if (i !== "default") {
    const u = c.node.default;
    if (u) return Ac(u);
  }
  return {};
}, lo = (c, n) => {
  if (!n) return {};
  const i = c[n];
  return i || {};
}, Rc = (c) => c, Kp = (c, n) => {
  const i = n ?? "default", s = c.link[i];
  if (s) return Rc(s);
  if (i !== "default") {
    const u = c.link.default;
    if (u) return Rc(u);
  }
  return {};
}, bc = (c, n) => {
  if (!n) return {};
  const i = c[n];
  return i || {};
};
class Zp {
  constructor() {
    k(this, "subscribers", /* @__PURE__ */ new Map());
  }
  /**
   * 订阅事件
   * @param eventType 事件类型
   * @param subscriber 事件处理函数
   * @returns 取消订阅的函数
   */
  subscribe(n, i) {
    const s = String(n);
    this.subscribers.has(s) || this.subscribers.set(s, /* @__PURE__ */ new Set());
    const u = this.subscribers.get(s);
    return u.add(i), () => {
      u.delete(i), u.size === 0 && this.subscribers.delete(s);
    };
  }
  /**
   * 发布事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  publish(n, i) {
    const s = String(n), u = this.subscribers.get(s);
    u && u.forEach((d) => {
      try {
        d(i);
      } catch (h) {
        console.error(
          `Error in event subscriber for ${String(n)}:`,
          h
        );
      }
    });
  }
  /**
   * 取消订阅指定事件类型的所有订阅者
   * @param eventType 事件类型
   */
  unsubscribeAll(n) {
    const i = String(n);
    this.subscribers.delete(i);
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
  getSubscriberCount(n) {
    const i = String(n), s = this.subscribers.get(i);
    return s ? s.size : 0;
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
  hasSubscribers(n) {
    return this.getSubscriberCount(n) > 0;
  }
}
class qp {
  constructor(n) {
    k(this, "tags");
    k(this, "events");
    this.tags = /* @__PURE__ */ new Map(), this.events = n;
  }
  /**
   * 生成存储键
   */
  getKey(n, i) {
    return `${n}:${i}`;
  }
  /**
   * 添加标签（通用方法）
   */
  addTag(n, i, s) {
    const u = {
      targetId: n,
      targetType: i,
      ...s
    }, d = this.getKey(i, n), h = this.tags.get(d) || [];
    return h.some(
      (p) => JSON.stringify(p) === JSON.stringify(u)
    ) || h.push(u), this.tags.set(d, h), this.events.publish("tagChange", {
      action: "add",
      targetId: n,
      targetType: i,
      tag: u
    }), u;
  }
  /**
   * 为节点添加标签（便捷方法，保持向后兼容）
   */
  addNodeTag(n, i) {
    return this.addTag(n, "node", i);
  }
  /**
   * 为边添加标签（便捷方法）
   */
  addLinkTag(n, i) {
    return this.addTag(n, "link", i);
  }
  /**
   * 移除目标的所有标签
   */
  removeAllTags(n, i) {
    const s = this.getKey(i, n), u = this.tags.get(s);
    return !u || u.length === 0 ? !1 : (this.tags.delete(s), this.events.publish("tagChange", {
      action: "remove",
      targetId: n,
      targetType: i,
      tag: void 0
    }), !0);
  }
  /**
   * 移除节点的所有标签（便捷方法，保持向后兼容）
   */
  removeAllNodeTags(n) {
    return this.removeAllTags(n, "node");
  }
  /**
   * 移除边的所有标签（便捷方法）
   */
  removeAllLinkTags(n) {
    return this.removeAllTags(n, "link");
  }
  /**
   * 获取目标的所有标签
   */
  getTags(n, i) {
    const s = this.getKey(i, n);
    return this.tags.get(s) || [];
  }
  /**
   * 获取节点的所有标签（便捷方法，保持向后兼容）
   */
  getNodeTags(n) {
    return this.getTags(n, "node");
  }
  /**
   * 获取边的所有标签（便捷方法）
   */
  getLinkTags(n) {
    return this.getTags(n, "link");
  }
  /**
   * 获取所有标签
   */
  getAllTags() {
    const n = [];
    for (const i of this.tags.values())
      n.push(...i);
    return n;
  }
  /**
   * 获取所有节点标签
   */
  getAllNodeTags() {
    return this.getAllTags().filter(
      (n) => n.targetType === "node"
    );
  }
  /**
   * 获取所有边标签
   */
  getAllLinkTags() {
    return this.getAllTags().filter(
      (n) => n.targetType === "link"
    );
  }
  /**
   * 获取所有有标签的目标ID（按类型）
   */
  getTaggedTargetIds(n) {
    const i = [];
    for (const [s, u] of this.tags.entries())
      u.length > 0 && s.startsWith(`${n}:`) && i.push(s.substring(n.length + 1));
    return i;
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
  addTags(n) {
    const i = [];
    return n.forEach((s) => {
      const { targetId: u, targetType: d, ...h } = s, p = this.addTag(u, d, h);
      i.push(p);
    }), i;
  }
  /**
   * 批量移除标签
   */
  removeAllTagsForTargets(n) {
    let i = 0;
    return n.forEach(({ targetId: s, targetType: u }) => {
      this.removeAllTags(s, u) && i++;
    }), i;
  }
  /**
   * 批量移除节点标签（便捷方法）
   */
  removeAllTagsForNodes(n) {
    return this.removeAllTagsForTargets(
      n.map((i) => ({
        targetId: i,
        targetType: "node"
      }))
    );
  }
  /**
   * 批量移除边标签（便捷方法）
   */
  removeAllTagsForLinks(n) {
    return this.removeAllTagsForTargets(
      n.map((i) => ({
        targetId: i,
        targetType: "link"
      }))
    );
  }
  /**
   * 清空所有标签
   */
  clearAll() {
    const n = Array.from(this.tags.keys());
    this.tags.clear(), this.events.publish("tagChange", {
      action: "clear",
      targetIds: n
    });
  }
  /**
   * 更新目标指定类型的标签
   */
  updateTagByType(n, i, s, u) {
    const d = this.getTags(n, i);
    if (!d) return;
    const h = d.findIndex((g) => g.targetType === s);
    if (h === -1) return;
    const p = {
      ...d[h],
      ...u,
      metadata: {
        ...d[h].metadata,
        ...u.metadata,
        type: s
        // 保持类型不变
      }
    };
    d[h] = p;
    const v = this.getKey(i, n);
    return this.tags.set(v, d), this.events.publish("tagChange", {
      action: "update",
      targetId: n,
      targetType: i,
      tag: p
    }), p;
  }
  /**
   * 检查目标是否有标签
   */
  hasTag(n, i) {
    return this.getTags(n, i).length > 0;
  }
  /**
   * 检查节点是否有标签（便捷方法，保持向后兼容）
   */
  hasNodeTag(n) {
    return this.hasTag(n, "node");
  }
  /**
   * 检查边是否有标签（便捷方法）
   */
  hasLinkTag(n) {
    return this.hasTag(n, "link");
  }
  /**
   * 获取标签数量
   */
  getTagCount() {
    let n = 0;
    for (const i of this.tags.values())
      n += i.length;
    return n;
  }
  /**
   * 根据标签属性筛选
   */
  filterTags(n) {
    const i = [];
    for (const s of this.tags.values())
      i.push(...s);
    return i.filter(n);
  }
  /**
   * 设置指定类型标签的可见性
   */
  setTagVisibleByType(n, i, s, u) {
    return this.updateTagByType(n, i, s, { visible: u });
  }
  /**
   * 设置目标所有标签的可见性
   */
  setAllTagsVisibleForTarget(n, i, s) {
    const u = this.getTags(n, i), d = [];
    if (u.forEach((h, p) => {
      const v = {
        ...h,
        visible: s
      };
      u[p] = v, d.push(v);
    }), d.length > 0) {
      const h = this.getKey(i, n);
      this.tags.set(h, u), d.forEach((p) => {
        this.events.publish("tagChange", {
          action: "update",
          targetId: n,
          targetType: i,
          tag: p
        });
      });
    }
    return d;
  }
  /**
   * 设置节点所有标签的可见性（便捷方法，保持向后兼容）
   */
  setAllTagsVisibleForNode(n, i) {
    return this.setAllTagsVisibleForTarget(n, "node", i);
  }
  /**
   * 设置边所有标签的可见性（便捷方法）
   */
  setAllTagsVisibleForLink(n, i) {
    return this.setAllTagsVisibleForTarget(n, "link", i);
  }
  /**
   * 批量设置多个目标的所有标签可见性
   */
  setTagsVisible(n, i) {
    const s = [];
    return n.forEach(({ targetId: u, targetType: d }) => {
      const h = this.setAllTagsVisibleForTarget(
        u,
        d,
        i
      );
      s.push(...h);
    }), s;
  }
  /**
   * 批量设置多个节点的所有标签可见性（便捷方法）
   */
  setNodeTagsVisible(n, i) {
    return this.setTagsVisible(
      n.map((s) => ({
        targetId: s,
        targetType: "node"
      })),
      i
    );
  }
  /**
   * 批量设置多个边的所有标签可见性（便捷方法）
   */
  setLinkTagsVisible(n, i) {
    return this.setTagsVisible(
      n.map((s) => ({
        targetId: s,
        targetType: "link"
      })),
      i
    );
  }
  /**
   * 切换指定类型标签的可见性
   */
  toggleTagVisibleByType(n, i, s) {
    const d = this.getTags(n, i).find((p) => p.targetType === s);
    if (!d) return;
    const h = !(d.visible ?? !0);
    return this.setTagVisibleByType(n, i, s, h);
  }
  /**
   * 获取所有可见的标签
   */
  getVisibleTags() {
    return this.filterTags((n) => n.visible !== !1);
  }
  /**
   * 获取所有隐藏的标签
   */
  getHiddenTags() {
    return this.filterTags((n) => n.visible === !1);
  }
  /**
   * 隐藏全部标签
   */
  hideAllTags() {
    const n = Array.from(this.tags.keys()).map((i) => {
      const [s, ...u] = i.split(":");
      return {
        targetId: u.join(":"),
        targetType: s
      };
    });
    return this.setTagsVisible(n, !1);
  }
  /**
   * 显示全部标签
   */
  showAllTags() {
    const n = Array.from(this.tags.keys()).map((i) => {
      const [s, ...u] = i.split(":");
      return {
        targetId: u.join(":"),
        targetType: s
      };
    });
    return this.setTagsVisible(n, !0);
  }
  /**
   * 根据标签文本搜索
   */
  searchTags(n) {
    const i = n.toLowerCase();
    return this.filterTags(
      (s) => {
        var u;
        return ((u = s.label) == null ? void 0 : u.toLowerCase().includes(i)) || !1;
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
  import(n) {
    this.clearAll();
    const i = /* @__PURE__ */ new Map();
    n.forEach((s) => {
      const u = this.getKey(s.targetType, s.targetId), d = i.get(u) || [];
      d.push(s), i.set(u, d);
    });
    for (const [s, u] of i)
      this.tags.set(s, u);
  }
  /**
   * 添加类型标签（通用）
   */
  addTypedTag(n, i, s, u, d) {
    return this.addTag(n, i, {
      label: u,
      metadata: { type: s, ...d == null ? void 0 : d.metadata },
      ...d
    });
  }
  /**
   * 为节点添加类型标签（便捷方法，保持向后兼容）
   */
  addTypedNodeTag(n, i, s, u) {
    return this.addTypedTag(n, "node", i, s, u);
  }
  /**
   * 为边添加类型标签（便捷方法）
   */
  addTypedLinkTag(n, i, s, u) {
    return this.addTypedTag(n, "link", i, s, u);
  }
  /**
   * 获取指定类型的标签
   */
  getTagByType(n, i, s) {
    return this.getTags(n, i).find(
      (u) => u.targetType === s
    );
  }
  /**
   * 获取节点指定类型的标签（便捷方法，保持向后兼容）
   */
  getNodeTagByType(n, i) {
    return this.getTagByType(n, "node", i);
  }
  /**
   * 获取边指定类型的标签（便捷方法）
   */
  getLinkTagByType(n, i) {
    return this.getTagByType(n, "link", i);
  }
  /**
   * 移除指定类型的标签
   */
  removeTagByType(n, i, s) {
    const u = this.getTags(n, i);
    if (!u || u.length === 0) return !1;
    const d = u.findIndex((g) => g.targetType === s);
    if (d === -1) return !1;
    const h = u[d], p = u.filter((g, x) => x !== d), v = this.getKey(i, n);
    return p.length === 0 ? this.tags.delete(v) : this.tags.set(v, p), this.events.publish("tagChange", {
      action: "remove",
      targetId: n,
      targetType: i,
      tag: h
    }), !0;
  }
  /**
   * 移除节点指定类型的标签（便捷方法，保持向后兼容）
   */
  removeNodeTagByType(n, i) {
    return this.removeTagByType(n, "node", i);
  }
  /**
   * 移除边指定类型的标签（便捷方法）
   */
  removeLinkTagByType(n, i) {
    return this.removeTagByType(n, "link", i);
  }
  /**
   * 获取目标标签数量
   */
  getTargetTagCount(n, i) {
    return this.getTags(n, i).length;
  }
  /**
   * 获取节点标签数量（便捷方法，保持向后兼容）
   */
  getNodeTagCount(n) {
    return this.getTargetTagCount(n, "node");
  }
  /**
   * 获取边标签数量（便捷方法）
   */
  getLinkTagCount(n) {
    return this.getTargetTagCount(n, "link");
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
class Jp {
  constructor(n) {
    k(this, "model");
    k(this, "globalVisible");
    this.model = new qp(n), this.globalVisible = !0;
  }
  /**
   * 设置全局标签可见性
   */
  setGlobalVisible(n) {
    this.globalVisible = n;
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
  isTagVisible(n) {
    return this.globalVisible ? n.visible !== !1 : !1;
  }
  /**
   * 获取目标所有应该显示的标签
   */
  getVisibleTags(n, i) {
    return this.globalVisible ? this.model.getTags(n, i).filter((s) => s.visible !== !1) : [];
  }
  /**
   * 获取节点所有应该显示的标签（便捷方法，保持向后兼容）
   */
  getVisibleNodeTags(n) {
    return this.getVisibleTags(n, "node");
  }
  /**
   * 获取边所有应该显示的标签（便捷方法）
   */
  getVisibleLinkTags(n) {
    return this.getVisibleTags(n, "link");
  }
  /**
   * 获取所有应该显示的标签
   */
  getAllVisibleTags() {
    return this.globalVisible ? this.model.getAllTags().filter((n) => n.visible !== !1) : [];
  }
  /**
   * 获取所有隐藏的标签
   */
  getAllHiddenTags() {
    return this.globalVisible ? this.model.getAllTags().filter((n) => n.visible === !1) : this.model.getAllTags();
  }
}
class eg {
  constructor(n) {
    k(this, "loadingStates");
    k(this, "events");
    this.loadingStates = /* @__PURE__ */ new Map(), this.events = n;
  }
  /**
   * 设置节点加载状态
   */
  setLoading(n, i, s) {
    const u = {
      nodeId: n,
      loading: i,
      progress: s == null ? void 0 : s.progress,
      message: s == null ? void 0 : s.message,
      metadata: s == null ? void 0 : s.metadata
    };
    return this.loadingStates.set(n, u), this.events.publish("loadingChange", {
      nodeId: n,
      loading: i,
      state: u
    }), u;
  }
  /**
   * 开始加载
   */
  startLoading(n, i) {
    return this.setLoading(n, !0, i);
  }
  /**
   * 停止加载
   */
  stopLoading(n) {
    return this.loadingStates.get(n) ? (this.setLoading(n, !1), !0) : !1;
  }
  /**
   * 更新加载进度
   */
  updateProgress(n, i, s) {
    const u = this.loadingStates.get(n);
    if (u)
      return this.setLoading(n, u.loading, {
        progress: i,
        message: s ?? u.message,
        metadata: u.metadata
      });
  }
  /**
   * 获取节点加载状态
   */
  getLoadingState(n) {
    return this.loadingStates.get(n);
  }
  /**
   * 检查节点是否正在加载
   */
  isLoading(n) {
    const i = this.loadingStates.get(n);
    return (i == null ? void 0 : i.loading) ?? !1;
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
    const n = [];
    for (const [i, s] of this.loadingStates.entries())
      s.loading && n.push(i);
    return n;
  }
  /**
   * 批量设置加载状态
   */
  setLoadingForNodes(n, i, s) {
    const u = [];
    return n.forEach((d) => {
      const h = this.setLoading(d, i, s);
      u.push(h);
    }), u;
  }
  /**
   * 批量开始加载
   */
  startLoadingForNodes(n, i) {
    return this.setLoadingForNodes(n, !0, i);
  }
  /**
   * 批量停止加载
   */
  stopLoadingForNodes(n) {
    let i = 0;
    return n.forEach((s) => {
      this.stopLoading(s) && i++;
    }), i;
  }
  /**
   * 清除节点加载状态
   */
  clearLoadingState(n) {
    return this.loadingStates.delete(n);
  }
  /**
   * 清除所有加载状态
   */
  clearAll() {
    const n = Array.from(this.loadingStates.keys());
    this.loadingStates.clear(), this.events.publish("loadingChange", {
      action: "clearAll",
      nodeIds: n
    });
  }
  /**
   * 获取正在加载的节点数量
   */
  getLoadingCount() {
    let n = 0;
    for (const i of this.loadingStates.values())
      i.loading && n++;
    return n;
  }
  /**
   * 根据条件筛选加载状态
   */
  filterLoadingStates(n) {
    return Array.from(this.loadingStates.values()).filter(n);
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
  import(n) {
    this.clearAll(), n.forEach((i) => {
      this.loadingStates.set(i.nodeId, i);
    });
  }
}
class tg {
  constructor(n) {
    k(this, "model");
    k(this, "globalVisible");
    this.model = new eg(n), this.globalVisible = !0;
  }
  /**
   * 设置全局加载状态可见性
   */
  setGlobalVisible(n) {
    this.globalVisible = n;
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
  isLoadingVisible(n) {
    return this.globalVisible ? this.model.isLoading(n) : !1;
  }
  /**
   * 获取应该显示的加载状态
   */
  getVisibleLoadingStates() {
    return this.globalVisible ? this.model.filterLoadingStates((n) => n.loading) : [];
  }
  /**
   * 获取节点的可见加载状态
   */
  getVisibleLoadingState(n) {
    if (!this.globalVisible) return;
    const i = this.model.getLoadingState(n);
    return i != null && i.loading ? i : void 0;
  }
}
class ng {
  constructor(n) {
    k(this, "state");
    k(this, "events");
    this.events = n, this.state = {
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
  setHighlightNodes(n, i) {
    this.state.highlightNodes = [...new Set(n)], this.state.highlightLinks = i ? [...new Set(i)] : [], this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加高亮节点
   */
  addHighlightNodes(n, i) {
    this.state.highlightNodes = [
      .../* @__PURE__ */ new Set([...this.state.highlightNodes, ...n])
    ], i && (this.state.highlightLinks = [
      .../* @__PURE__ */ new Set([...this.state.highlightLinks, ...i])
    ]), this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除高亮节点
   */
  removeHighlightNodes(n) {
    const i = new Set(n);
    this.state.highlightNodes = this.state.highlightNodes.filter(
      (s) => !i.has(s)
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
  isHighlighted(n) {
    return this.state.highlightNodes.includes(n);
  }
  // ============ 选中状态管理 ============
  /**
   * 设置选中节点
   */
  setSelectedNodes(n, i) {
    this.state.selectedNodes = [...new Set(n)], this.state.selectedLinks = i ? [...new Set(i)] : [], this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加选中节点
   */
  addSelectedNodes(n, i) {
    this.state.selectedNodes = [
      .../* @__PURE__ */ new Set([...this.state.selectedNodes, ...n])
    ], i && (this.state.selectedLinks = [
      .../* @__PURE__ */ new Set([...this.state.selectedLinks, ...i])
    ]), this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除选中节点
   */
  removeSelectedNodes(n) {
    const i = new Set(n);
    this.state.selectedNodes = this.state.selectedNodes.filter(
      (s) => !i.has(s)
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
  isSelected(n) {
    return this.state.selectedNodes.includes(n);
  }
  // ============ 隐藏状态管理 ============
  /**
   * 设置隐藏节点
   */
  setHiddenNodes(n, i) {
    this.state.hiddenNodes = [...new Set(n)], this.state.hiddenLinks = i ? [...new Set(i)] : [], this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 添加隐藏节点
   */
  addHiddenNodes(n, i) {
    this.state.hiddenNodes = [
      .../* @__PURE__ */ new Set([...this.state.hiddenNodes, ...n])
    ], i && (this.state.hiddenLinks = [
      .../* @__PURE__ */ new Set([...this.state.hiddenLinks, ...i])
    ]), this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), this.publishMetaDataChange();
  }
  /**
   * 移除隐藏节点（显示节点）
   */
  removeHiddenNodes(n) {
    const i = new Set(n);
    this.state.hiddenNodes = this.state.hiddenNodes.filter(
      (s) => !i.has(s)
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
  isHidden(n) {
    return this.state.hiddenNodes.includes(n);
  }
  // ============ 根节点状态管理 ============
  /**
   * 设置根节点
   */
  setRootNodes(n) {
    this.state.rootNodes = [...new Set(n)], this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 添加根节点
   */
  addRootNodes(n) {
    this.state.rootNodes = [.../* @__PURE__ */ new Set([...this.state.rootNodes, ...n])], this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 移除根节点
   */
  removeRootNodes(n) {
    const i = new Set(n);
    this.state.rootNodes = this.state.rootNodes.filter(
      (s) => !i.has(s)
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
  isRootNode(n) {
    return this.state.rootNodes.includes(n);
  }
  // ============ 悬浮节点状态管理 ============
  /**
   * 设置悬浮节点
   */
  setHoveredNodes(n) {
    this.state.hoveredNodes = [...new Set(n)], this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 添加悬浮节点
   */
  addHoveredNodes(n) {
    this.state.hoveredNodes = [
      .../* @__PURE__ */ new Set([...this.state.rootNodes, ...n])
    ], this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes
    }), this.publishMetaDataChange();
  }
  /**
   * 移除悬浮节点
   */
  removeHoveredNodes(n) {
    const i = new Set(n);
    this.state.hoveredNodes = this.state.hoveredNodes.filter(
      (s) => !i.has(s)
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
  isHoveredNode(n) {
    return this.state.hoveredNodes.includes(n);
  }
  // ============ 悬浮连线状态管理 ============
  /**
   * 设置悬浮连线
   */
  setHoveredLinks(n) {
    this.state.hoveredLinks = [...new Set(n)], this.events.publish("linksHoverChange", {
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
  isHoveredLink(n) {
    return this.state.hoveredLinks.includes(n);
  }
  // ============ 单个节点/边状态查询 ============
  /**
   * 获取节点的所有状态
   */
  getNodeState(n) {
    return {
      highlighted: this.isHighlighted(n),
      selected: this.isSelected(n),
      hidden: this.isHidden(n),
      hovered: this.isHoveredNode(n),
      root: this.isRootNode(n)
    };
  }
  /**
   * 获取边的所有状态
   */
  getLinkState(n) {
    return {
      highlighted: this.state.highlightLinks.includes(n),
      selected: this.state.selectedLinks.includes(n),
      hidden: this.state.hiddenLinks.includes(n),
      hovered: this.isHoveredLink(n)
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
  updateState(n) {
    let i = !1;
    n.highlightNodes !== void 0 && (this.state.highlightNodes = [...new Set(n.highlightNodes)], i = !0), n.highlightLinks !== void 0 && (this.state.highlightLinks = [...new Set(n.highlightLinks)], i = !0), n.selectedNodes !== void 0 && (this.state.selectedNodes = [...new Set(n.selectedNodes)], i = !0), n.selectedLinks !== void 0 && (this.state.selectedLinks = [...new Set(n.selectedLinks)], i = !0), n.hiddenNodes !== void 0 && (this.state.hiddenNodes = [...new Set(n.hiddenNodes)], i = !0), n.hiddenLinks !== void 0 && (this.state.hiddenLinks = [...new Set(n.hiddenLinks)], i = !0), n.rootNodes !== void 0 && (this.state.rootNodes = [...new Set(n.rootNodes)], i = !0), i && ((n.highlightNodes !== void 0 || n.highlightLinks !== void 0) && this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks
    }), (n.selectedNodes !== void 0 || n.selectedLinks !== void 0) && this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks
    }), (n.hiddenNodes !== void 0 || n.hiddenLinks !== void 0) && this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks
    }), n.rootNodes !== void 0 && this.events.publish("rootNodesChange", {
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
function qn(c, n) {
  const i = { ...c };
  for (const s in n)
    if (Object.prototype.hasOwnProperty.call(n, s)) {
      const u = n[s], d = i[s];
      u != null && typeof u == "object" && !Array.isArray(u) && d !== null && d !== void 0 && typeof d == "object" && !Array.isArray(d) ? i[s] = qn(d, u) : u !== void 0 && (i[s] = u);
    }
  return i;
}
class rg {
  constructor(n) {
    k(this, "graphModelData");
    k(this, "nodeInstanceStyles", /* @__PURE__ */ new Map());
    k(this, "linkInstanceStyles", /* @__PURE__ */ new Map());
    this.graphModelData = n;
  }
  updategGraphModelData(n) {
    this.graphModelData = n;
  }
  init(n) {
    this.style = n;
  }
  update(n) {
    this.style = qn(this.style, n);
  }
  setNodeStyle(n, i) {
    this.nodeInstanceStyles.set(n, i);
  }
  setLinkStyle(n, i) {
    this.linkInstanceStyles.set(n, i);
  }
  hasNodeStyle(n) {
    return this.nodeInstanceStyles.has(n);
  }
  hasLinkStyle(n) {
    return this.linkInstanceStyles.has(n);
  }
  getNodeStyle(n) {
    var h;
    if (!n) return {};
    const i = this.graphModelData.graphData.nodes.find(
      (p) => p.id === n
    );
    if (!i) return {};
    const s = Qp(this.style, (h = i.data) == null ? void 0 : h.nodeType);
    if (!this.hasNodeStyle(i.id)) return s;
    const u = this.nodeInstanceStyles.get(i.id);
    if (!u) return s;
    const d = qn({}, s);
    return qn(d, u);
  }
  getLinkStyle(n) {
    var h;
    if (!n) return {};
    const i = this.graphModelData.graphData.links.find(
      (p) => p.id === n
    );
    if (!i) return {};
    const s = Kp(this.style, (h = i.data) == null ? void 0 : h.linkType);
    if (!this.hasLinkStyle(i.id)) return s;
    const u = this.linkInstanceStyles.get(i.id);
    if (!u) return s;
    const d = qn({}, s);
    return qn(d, u);
  }
  cleanNodeStyle(n) {
    this.nodeInstanceStyles.delete(n);
  }
  cleanLinkStyle(n) {
    this.linkInstanceStyles.delete(n);
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
class ig {
  constructor({ initData: n }) {
    k(this, "cache", {
      graphData: { nodes: [], links: [] }
    });
    k(this, "events", new Zp());
    k(this, "tagManager", new Jp(this.events));
    k(this, "loadingManager", new tg(this.events));
    k(this, "stateManager", new ng(this.events));
    k(this, "styleManager", new rg(this.cache));
    this.updateGraphData({
      graphData: n.graphData
    });
  }
  updateGraphData({ graphData: n }) {
    this.cache.graphData = n, this.styleManager.updategGraphModelData(this.cache), this.events.publish("dataChange", {
      graphData: this.cache.graphData
    });
  }
  /**
   * 更新元数据（焦点、选中、隐藏状态）
   * @deprecated 请使用 stateManager 代替
   */
  updateMetaData(n) {
    this.stateManager.updateState(n);
  }
  /**
   * 更新高亮节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setHighlightNodes 代替
   */
  updeteFoucsNodes(n) {
    const i = [...n], s = [];
    n.forEach((u) => {
      const d = this.getNodeById(u);
      d && this.cache.graphData.links.forEach((h) => {
        const p = typeof h.source == "object" ? h.source.id : h.source, v = typeof h.target == "object" ? h.target.id : h.target;
        (p === d.id || v === d.id) && s.push(h.id), p === d.id && v && i.push(String(v));
      });
    }), this.stateManager.setHighlightNodes(
      [...new Set(i)],
      [...new Set(s)]
    );
  }
  /**
   * 更新选中节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setSelectedNodes 代替
   */
  updateSelectedNodes(n, i) {
    const s = [...n], u = [];
    i ? u.push(...i) : n.forEach((d) => {
      const h = this.getNodeById(d);
      h && this.cache.graphData.links.forEach((p) => {
        const v = typeof p.source == "object" ? p.source.id : p.source, g = typeof p.target == "object" ? p.target.id : p.target;
        (v === h.id || g === h.id) && u.push(p.id), v === h.id && g && s.push(String(g));
      });
    }), this.stateManager.setSelectedNodes([...new Set(s)], [...new Set(u)]);
  }
  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  updateHiddenNodes(n) {
    this.stateManager.setHiddenNodes(n);
  }
  getGraphModelData() {
    return {
      ...this.cache,
      ...this.stateManager.getState()
    };
  }
  getLinkById(n) {
    return n && this.cache.graphData.links.find((i) => i.id === n) || null;
  }
  getNodeById(n) {
    return n && this.cache.graphData.nodes.find((i) => i.id === n) || null;
  }
}
class og {
  constructor() {
    k(this, "store", /* @__PURE__ */ new Map());
  }
  /** 生成唯一键 */
  key(n) {
    return `${n.type}:${n.id}`;
  }
  /** 设置实体元数据（合并模式） */
  setMeta(n, i) {
    const s = this.key(n);
    this.store.set(s, { ...this.store.get(s), ...i });
  }
  /** 获取实体元数据 */
  getMeta(n) {
    return this.store.get(this.key(n));
  }
  /** 更新分页信息 */
  updatePagination(n, i) {
    this.setMeta(n, i);
  }
  /** 获取分页信息 */
  getPagination(n) {
    const i = this.getMeta(n);
    return {
      pageIndex: i == null ? void 0 : i.pageIndex,
      total: i == null ? void 0 : i.total,
      count: i == null ? void 0 : i.count
    };
  }
  /** 设置拓展规则 */
  setRules(n, i) {
    this.setMeta(n, { rules: i });
  }
  /** 获取拓展规则 */
  getRules(n) {
    var i;
    return (i = this.getMeta(n)) == null ? void 0 : i.rules;
  }
  /** 删除实体元数据 */
  deleteMeta(n) {
    this.store.delete(this.key(n));
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
class sg {
  constructor(n) {
    k(this, "history", []);
    k(this, "currentIndex", -1);
    k(this, "maxSize");
    this.maxSize = (n == null ? void 0 : n.maxSize) ?? 50, n != null && n.initialHistory && n.initialHistory.length > 0 && (this.history = n.initialHistory.map((i) => ({ ...i })), this.currentIndex = this.history.length - 1);
  }
  /** 添加新的历史记录（截断后续记录） */
  pushState(n) {
    const i = { ...n, timestamp: Date.now() };
    return this.history = this.history.slice(0, this.currentIndex + 1), this.history.push(i), this.history.length > this.maxSize ? this.history.shift() : this.currentIndex++, i;
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
  canGoBackSkipType(n) {
    let i = this.currentIndex - 1;
    for (; i >= 0 && this.history[i].type === n; ) i--;
    return i >= 0;
  }
  /**
   * 是否可以重做并跳过指定 type
   */
  canGoForwardSkipType(n) {
    let i = this.currentIndex + 1;
    for (; i < this.history.length && this.history[i].type === n; )
      i++;
    return i < this.history.length;
  }
  /**
   * 撤销时跳过指定 type 的记录（如 "snapshot"）
   * @returns 新的 HistoryState，若无匹配则返回 undefined
   */
  goBackSkipType(n) {
    let i = this.currentIndex - 1;
    for (; i >= 0 && this.history[i].type === n; ) i--;
    if (!(i < 0))
      return this.currentIndex = i, this.currentState;
  }
  /**
   * 重做时跳过指定 type 的记录（如 "snapshot"）
   * @returns 新的 HistoryState，若无匹配则返回 undefined
   */
  goForwardSkipType(n) {
    let i = this.currentIndex + 1;
    for (; i < this.history.length && this.history[i].type === n; )
      i++;
    if (!(i >= this.history.length))
      return this.currentIndex = i, this.currentState;
  }
  /**
   * 跳转到指定索引的历史记录
   * @returns 跳转后的 HistoryState，若索引无效则返回 undefined
   */
  jumpTo(n) {
    if (!(n < 0 || n >= this.history.length))
      return this.currentIndex = n, this.currentState;
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
  getAction(n) {
    return this.history[n];
  }
  /**
   * 删除指定索引的历史记录
   * 若删除的是当前或之前的记录，当前索引会相应前移
   */
  deleteEntry(n) {
    return n < 0 || n >= this.history.length ? !1 : (this.history.splice(n, 1), this.currentIndex >= this.history.length ? this.currentIndex = this.history.length - 1 : this.currentIndex > n && this.currentIndex--, !0);
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
class lg {
  constructor() {
    k(this, "_state", { x: 0, y: 0, k: 1 });
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
  pan(n, i) {
    this._state.x += n / this._state.k, this._state.y += i / this._state.k;
  }
  /** Zoom toward a screen point */
  zoomTo(n, i, s) {
    const u = Math.max(0.1, Math.min(10, this._state.k * n)), d = (i - this._state.x * this._state.k) / this._state.k, h = (s - this._state.y * this._state.k) / this._state.k;
    this._state.x = i / u - d, this._state.y = s / u - h, this._state.k = u;
  }
  /** Set absolute zoom */
  setZoom(n, i, s) {
    i !== void 0 && s !== void 0 ? this.zoomTo(n / this._state.k, i, s) : this._state.k = Math.max(0.1, Math.min(10, n));
  }
  /** Screen -> world coordinates */
  screenToWorld(n, i) {
    return [
      (n - this._state.x * this._state.k) / this._state.k,
      (i - this._state.y * this._state.k) / this._state.k
    ];
  }
  /** World -> screen coordinates */
  worldToScreen(n, i) {
    return [
      (n + this._state.x) * this._state.k,
      (i + this._state.y) * this._state.k
    ];
  }
}
class ag {
  constructor(n, i, s = {}) {
    k(this, "canvas");
    k(this, "picker");
    k(this, "callbacks");
    /** 当前相机变换（渲染器需保持同步） */
    k(this, "transform", { x: 0, y: 0, k: 1 });
    // 内部状态
    k(this, "isDragging", !1);
    k(this, "dragNodeId", null);
    k(this, "hoveredId", null);
    k(this, "hoveredType", null);
    k(this, "lastMouseX", 0);
    k(this, "lastMouseY", 0);
    k(this, "lastClientX", 0);
    k(this, "lastClientY", 0);
    k(this, "isPanning", !1);
    /** 垂直缩放容忍度（px），在此范围内不触发平移/缩放手感混淆 */
    k(this, "panDeadZone", 3);
    // 绑定的回调引用（用于 removeEventListener）
    k(this, "boundPointerDown");
    k(this, "boundPointerMove");
    k(this, "boundPointerUp");
    k(this, "boundPointerLeave");
    k(this, "boundWheel");
    k(this, "boundContextMenu");
    this.canvas = n, this.picker = i, this.callbacks = s, this.boundPointerDown = this.onPointerDown.bind(this), this.boundPointerMove = this.onPointerMove.bind(this), this.boundPointerUp = this.onPointerUp.bind(this), this.boundPointerLeave = this.onPointerLeave.bind(this), this.boundWheel = this.onWheel.bind(this), this.boundContextMenu = this.onContextMenu.bind(this), this.attach();
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
  setPicker(n) {
    this.picker = n;
  }
  /** 重置交互状态（销毁时或数据重置时调用） */
  reset() {
    this.isDragging = !1, this.dragNodeId = null, this.isPanning = !1, this.hoveredId = null, this.hoveredType = null, this.canvas.style.cursor = "default";
  }
  // ========== 事件处理 ==========
  getPos(n) {
    const i = this.canvas.getBoundingClientRect();
    return { x: n.clientX - i.left, y: n.clientY - i.top };
  }
  onPointerDown(n) {
    var u, d, h, p, v, g;
    const i = this.getPos(n);
    this.lastMouseX = i.x, this.lastMouseY = i.y;
    const s = this.picker.pick(i.x, i.y);
    s && s.type === "node" ? n.button === 0 && (this.isDragging = !0, this.dragNodeId = s.id, this.canvas.setPointerCapture(n.pointerId), (d = (u = this.callbacks).onNodeClick) == null || d.call(u, s.id, n)) : s && s.type === "link" ? (p = (h = this.callbacks).onLinkClick) == null || p.call(h, s.id, n) : (this.isPanning = !0, this.canvas.setPointerCapture(n.pointerId), (g = (v = this.callbacks).onBackgroundClick) == null || g.call(v, n));
  }
  onPointerMove(n) {
    var d, h, p, v, g, x, N, S, w, R, P, y;
    const i = this.getPos(n), s = i.x - this.lastMouseX, u = i.y - this.lastMouseY;
    if (this.isDragging && this.dragNodeId)
      (h = (d = this.callbacks).onNodeDrag) == null || h.call(d, this.dragNodeId, s, u);
    else if (this.isPanning) {
      const _ = this.transform;
      _.x += s / _.k, _.y += u / _.k, (v = (p = this.callbacks).onPan) == null || v.call(p, _);
    } else {
      const _ = this.picker.pick(i.x, i.y), L = (_ == null ? void 0 : _.id) ?? null, X = (_ == null ? void 0 : _.type) ?? null;
      (L !== this.hoveredId || X !== this.hoveredType) && (this.hoveredId = L, this.hoveredType = X, X === "link" ? ((x = (g = this.callbacks).onLinkHover) == null || x.call(g, L), (S = (N = this.callbacks).onNodeHover) == null || S.call(N, null)) : ((R = (w = this.callbacks).onNodeHover) == null || R.call(w, L), (y = (P = this.callbacks).onLinkHover) == null || y.call(P, null)), this.canvas.style.cursor = L ? "pointer" : "default");
    }
    this.lastMouseX = i.x, this.lastMouseY = i.y, this.lastClientX = n.clientX, this.lastClientY = n.clientY;
  }
  onContextMenu(n) {
    var d, h;
    n.preventDefault();
    const i = n, s = this.getPos(i), u = this.picker.pick(s.x, s.y);
    (u == null ? void 0 : u.type) === "node" && ((h = (d = this.callbacks).onNodeContextMenu) == null || h.call(d, u.id, i.clientX, i.clientY));
  }
  onPointerUp(n) {
    var i, s;
    this.isDragging && this.dragNodeId && ((s = (i = this.callbacks).onNodeDragEnd) == null || s.call(i, this.dragNodeId)), this.isDragging = !1, this.dragNodeId = null, this.isPanning = !1, this.canvas.releasePointerCapture(n.pointerId);
  }
  /** 指针离开 canvas → 清除 hover 状态 */
  onPointerLeave(n) {
    var i, s, u, d;
    this.hoveredId !== null && (this.hoveredId = null, this.hoveredType = null, this.canvas.style.cursor = "default", (s = (i = this.callbacks).onNodeHover) == null || s.call(i, null), (d = (u = this.callbacks).onLinkHover) == null || d.call(u, null));
  }
  onWheel(n) {
    var v, g;
    n.preventDefault();
    const i = this.getPos(n), s = n.deltaY > 0 ? 0.9 : 1.1, u = this.transform, d = Math.max(0.1, Math.min(10, u.k * s)), h = (i.x - u.x * u.k) / u.k, p = (i.y - u.y * u.k) / u.k;
    u.x = i.x / d - h, u.y = i.y / d - p, u.k = d, (g = (v = this.callbacks).onZoom) == null || g.call(v, u);
  }
}
const ug = `#version 300 es
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
`, cg = `#version 300 es
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
float sdCircle(vec2 p, float r) { return length(p) - r; }

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.30;
  float l = radius * 0.60;
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

  float aa = fwidth(strokeD) * 0.8;

  // Alpha for the entire node (fill + stroke)
  float strokeAlpha = 1.0 - smoothstep(-aa, aa, strokeD);
  // Alpha for the fill area (inside stroke ring)
  float fillAlpha = 1.0 - smoothstep(-aa, aa, fillD);

  // Stroke color in the ring, fill color inside
  fragColor = mix(v_strokeColor, v_color, fillAlpha);
  fragColor.a *= strokeAlpha;

  // 图标：仅在节点内缩小的圆形区域内绘制（外部露出填充色，形成 padding 环）
  if (v_hasIcon > 0.5 && fillAlpha > 0.01) {
    float iconR = v_radius * ICON_INSET;
    float iconD = sdCircle(v_localPos, iconR);
    float iconAA = fwidth(iconD) * 0.8;
    float iconArea = 1.0 - smoothstep(-iconAA, iconAA, iconD);
    if (iconArea > 0.01) {
      // 图标区域半径 → [0,1] UV
      vec2 uv = (v_localPos / (2.0 * iconR)) + 0.5;
      uv = clamp(uv, 0.0, 1.0);
      vec2 texUv = mix(v_iconUv.xy, v_iconUv.zw, uv);
      vec4 icon = texture(u_iconAtlas, texUv);
      vec3 mixed = mix(v_color.rgb, icon.rgb, icon.a);
      fragColor.rgb = mix(fragColor.rgb, mixed, fillAlpha * iconArea);
      fragColor.a = mix(fragColor.a, 1.0, fillAlpha * iconArea);
    }
  }

  // Draw plus badge at configurable position (inside a white circle)
  if (v_showPlus > 0.5) {
    vec2 plusOffset = vec2(v_radius * v_plusOffsetX, v_radius * v_plusOffsetY);
    vec2 plusPos = v_localPos - plusOffset;
    float plusRadius = v_radius * v_plusScale;

    // 1. White circle background (使用屏幕空间 aa)
    float badgeD = sdCircle(plusPos, plusRadius);
    float badgeAA = fwidth(badgeD) * 0.8;
    float badgeAlpha = 1.0 - smoothstep(-badgeAA, badgeAA, badgeD);
    if (badgeAlpha > 0.01) {
      fragColor.rgb = mix(fragColor.rgb, vec3(1.0, 1.0, 1.0), badgeAlpha);
      fragColor.a = max(fragColor.a, badgeAlpha);
    }

    // 2. Red plus symbol inside the badge
    float plusD = sdPlus(plusPos, plusRadius * 0.85);
    float plusAA = fwidth(plusD) * 0.8;
    float plusAlpha = 1.0 - smoothstep(-plusAA, plusAA, plusD);
    if (badgeAlpha > 0.01 && plusAlpha > 0.01) {
      vec4 plusColor = vec4(0.913, 0.271, 0.376, 1.0);
      fragColor.rgb = mix(fragColor.rgb, plusColor.rgb, plusAlpha);
      fragColor.a = max(fragColor.a, plusAlpha);
    }
  }

  if (fragColor.a < 0.01) discard;
}
`, dg = `#version 300 es
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
`, hg = `#version 300 es
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
`, fg = `#version 300 es
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
`, pg = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
  if (fragColor.a < 0.01) discard;
}
`, gg = `#version 300 es
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
  vec2 p1 = (a_mid   + u_translation) * u_scale;
  vec2 p2 = (a_end   + u_translation) * u_scale;

  float t = a_position.x;
  float side = a_position.y;

  float mt  = 1.0 - t;
  float mt2 = mt * mt;
  float t2  = t * t;

  vec2 pos = mt2 * p0 + 2.0 * mt * t * p1 + t2 * p2;

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
  v_instanceId = uint(gl_InstanceID) + u_idOffset;
}
`, vg = `#version 300 es
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
`, yg = `#version 300 es
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
`, mg = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_color.rgb, 1.0);
}
`, kg = `#version 300 es
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
`, xg = `#version 300 es
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
`, wg = `#version 300 es
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
`, Sg = `#version 300 es
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
`, _g = `#version 300 es
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
`, Tg = `#version 300 es
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
`, Cg = `#version 300 es
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
`, Eg = `#version 300 es
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
`, Pg = ug, Ng = cg, Ag = dg, Rg = hg, bg = fg, Lg = pg, Mg = gg, Dg = vg, Ig = yg, Fg = mg, zg = kg, jg = xg, Og = wg, Bg = Sg, Ug = _g, Hg = Tg, Vg = Cg, Wg = Eg;
class Xg {
  constructor(n) {
    k(this, "name", "plus-badge");
    k(this, "gl");
    k(this, "canvas");
    k(this, "program");
    k(this, "pickProgram");
    k(this, "quadVao", null);
    // Border config
    k(this, "borderWidth");
    k(this, "borderColor");
    // Uniforms (render)
    k(this, "uResolution", null);
    k(this, "uTranslation", null);
    k(this, "uScale", null);
    k(this, "uZOffset", null);
    k(this, "uBorderWidth", null);
    k(this, "uBorderColor", null);
    // Uniforms (pick)
    k(this, "uPickResolution", null);
    k(this, "uPickTranslation", null);
    k(this, "uPickScale", null);
    k(this, "uPickZOffset", null);
    k(this, "uPickBorderWidth", null);
    /** 当前徽标数据 */
    k(this, "badges", []);
    /** 节点 ID → 索引映射（用于拾取） */
    k(this, "nodeIndexMap", /* @__PURE__ */ new Map());
    /** 拾取 FBO */
    k(this, "pickFbo", null);
    k(this, "pickTexture", null);
    k(this, "pickWidth", 0);
    k(this, "pickHeight", 0);
    k(this, "onPlusClick");
    // 已绑定的指针事件处理
    k(this, "boundPointerDown");
    this.gl = n.gl, this.canvas = n.canvas, this.onPlusClick = n.onPlusClick, this.borderWidth = n.borderWidth ?? 0, this.borderColor = n.borderColor ?? [0.913, 0.271, 0.376, 1], this.program = this.compileProgram(Ug, Hg), this.pickProgram = this.compileProgram(Vg, Wg), this.initQuadGeometry(), this.cacheUniforms(), this.boundPointerDown = this.onPointerDown.bind(this), this.canvas.addEventListener("pointerdown", this.boundPointerDown, {
      capture: !0
    });
  }
  // ─── 编译工具 ───────────────────────────────────
  compileShader(n, i) {
    const s = this.gl, u = s.createShader(n);
    if (s.shaderSource(u, i), s.compileShader(u), !s.getShaderParameter(u, s.COMPILE_STATUS))
      throw new Error(
        "Plus shader compile failed: " + s.getShaderInfoLog(u)
      );
    return u;
  }
  compileProgram(n, i) {
    const s = this.gl, u = this.compileShader(s.VERTEX_SHADER, n), d = this.compileShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    if (s.attachShader(h, u), s.attachShader(h, d), s.linkProgram(h), !s.getProgramParameter(h, s.LINK_STATUS))
      throw new Error("Plus shader link failed: " + s.getProgramInfoLog(h));
    return h;
  }
  cacheUniforms() {
    const n = this.gl;
    this.uResolution = n.getUniformLocation(this.program, "u_resolution"), this.uTranslation = n.getUniformLocation(this.program, "u_translation"), this.uScale = n.getUniformLocation(this.program, "u_scale"), this.uZOffset = n.getUniformLocation(this.program, "u_zOffset"), this.uBorderWidth = n.getUniformLocation(this.program, "u_borderWidth"), this.uBorderColor = n.getUniformLocation(this.program, "u_borderColor"), this.uPickResolution = n.getUniformLocation(
      this.pickProgram,
      "u_resolution"
    ), this.uPickTranslation = n.getUniformLocation(
      this.pickProgram,
      "u_translation"
    ), this.uPickScale = n.getUniformLocation(this.pickProgram, "u_scale"), this.uPickZOffset = n.getUniformLocation(this.pickProgram, "u_zOffset"), this.uPickBorderWidth = n.getUniformLocation(
      this.pickProgram,
      "u_borderWidth"
    );
  }
  initQuadGeometry() {
    const n = this.gl, i = new Float32Array([
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
    ]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const u = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, u), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  setupInstanceBuffer(n, i, s) {
    const u = this.gl, d = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, d), u.bufferData(u.ARRAY_BUFFER, i, u.DYNAMIC_DRAW), u.enableVertexAttribArray(n), u.vertexAttribPointer(n, s, u.FLOAT, !1, 0, 0), u.vertexAttribDivisor(n, 1);
  }
  // ─── 更新徽标数据 ──────────────────────────────
  updateBadges(n) {
    this.badges = n, this.nodeIndexMap.clear();
    for (let i = 0; i < n.length; i++)
      this.nodeIndexMap.set(n[i].nodeId, i);
  }
  // ─── 渲染 ───────────────────────────────────────
  render(n, i, s, u, d, h = 0) {
    const p = this.badges.length;
    if (p === 0) return;
    const v = this.gl;
    v.useProgram(this.program), v.uniform2f(this.uResolution, n, i), v.uniform2f(this.uTranslation, s, u), v.uniform1f(this.uScale, d), v.uniform1f(this.uZOffset, h), v.uniform1f(this.uBorderWidth, this.borderWidth), v.uniform4f(
      this.uBorderColor,
      this.borderColor[0],
      this.borderColor[1],
      this.borderColor[2],
      this.borderColor[3]
    ), v.bindVertexArray(this.quadVao);
    const g = new Float32Array(p * 2), x = new Float32Array(p), N = new Float32Array(p);
    for (let S = 0; S < p; S++) {
      const w = this.badges[S];
      g[S * 2] = w.x, g[S * 2 + 1] = w.y, x[S] = w.radius, N[S] = this.nodeIndexMap.get(w.nodeId) ?? S;
    }
    this.setupInstanceBuffer(1, g, 2), this.setupInstanceBuffer(2, x, 1), this.setupInstanceBuffer(3, N, 1), v.drawArraysInstanced(v.TRIANGLES, 0, 6, p);
    for (let S = 1; S <= 3; S++)
      v.vertexAttribDivisor(S, 0);
    v.bindVertexArray(null);
  }
  // ─── 拾取 ───────────────────────────────────────
  /** 初始化/调整拾取 FBO 尺寸 */
  ensurePickFbo(n, i) {
    if (this.pickWidth === n && this.pickHeight === i) return;
    const s = this.gl;
    this.pickFbo && s.deleteFramebuffer(this.pickFbo), this.pickTexture && s.deleteTexture(this.pickTexture), this.pickWidth = n, this.pickHeight = i, this.pickTexture = s.createTexture(), s.bindTexture(s.TEXTURE_2D, this.pickTexture), s.texImage2D(
      s.TEXTURE_2D,
      0,
      s.RGBA,
      n,
      i,
      0,
      s.RGBA,
      s.UNSIGNED_BYTE,
      null
    ), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.NEAREST), this.pickFbo = s.createFramebuffer(), s.bindFramebuffer(s.FRAMEBUFFER, this.pickFbo), s.framebufferTexture2D(
      s.FRAMEBUFFER,
      s.COLOR_ATTACHMENT0,
      s.TEXTURE_2D,
      this.pickTexture,
      0
    ), s.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  /** 渲染拾取缓冲（FBO） */
  renderPickBuffer(n, i, s, u, d) {
    const h = this.badges.length;
    if (h === 0) return;
    const p = this.gl;
    this.ensurePickFbo(n, i), p.bindFramebuffer(p.FRAMEBUFFER, this.pickFbo), p.viewport(0, 0, n, i), p.clearColor(0, 0, 0, 0), p.clear(p.COLOR_BUFFER_BIT | p.DEPTH_BUFFER_BIT), p.useProgram(this.pickProgram), p.uniform2f(this.uPickResolution, n, i), p.uniform2f(this.uPickTranslation, s, u), p.uniform1f(this.uPickScale, d), p.uniform1f(this.uPickZOffset, 0), p.uniform1f(this.uPickBorderWidth, this.borderWidth), p.bindVertexArray(this.quadVao);
    const v = new Float32Array(h * 2), g = new Float32Array(h), x = new Float32Array(h);
    for (let N = 0; N < h; N++) {
      const S = this.badges[N];
      v[N * 2] = S.x, v[N * 2 + 1] = S.y, g[N] = S.radius, x[N] = 0;
    }
    this.setupInstanceBuffer(1, v, 2), this.setupInstanceBuffer(2, g, 1), this.setupInstanceBuffer(3, x, 1), p.drawArraysInstanced(p.TRIANGLES, 0, 6, h);
    for (let N = 1; N <= 3; N++)
      p.vertexAttribDivisor(N, 0);
    p.bindVertexArray(null), p.bindFramebuffer(p.FRAMEBUFFER, null);
  }
  /** 在屏幕坐标处拾取徽标，返回 nodeId */
  pick(n, i) {
    var g;
    const s = this.gl;
    if (!this.pickFbo) return null;
    const u = window.devicePixelRatio || 1, d = Math.round(n * u), h = Math.round(i * u);
    s.bindFramebuffer(s.FRAMEBUFFER, this.pickFbo);
    const p = new Uint8Array(4);
    s.readPixels(
      d,
      this.pickHeight - h,
      1,
      1,
      s.RGBA,
      s.UNSIGNED_BYTE,
      p
    ), s.bindFramebuffer(s.FRAMEBUFFER, null);
    const v = p[0] << 16 | p[1] << 8 | p[2];
    return v === 0 || v > this.badges.length ? null : ((g = this.badges[v]) == null ? void 0 : g.nodeId) ?? null;
  }
  // ─── 交互（capture phase 拦截） ────────────────
  onPointerDown(n) {
    var h;
    const i = this.canvas.getBoundingClientRect(), s = n.clientX - i.left, u = n.clientY - i.top, d = this.pick(s, u);
    d && ((h = this.onPlusClick) == null || h.call(this, d), n.stopPropagation(), n.preventDefault());
  }
  // ─── GraphOverlay ───────────────────────────────
  resize(n, i) {
    this.ensurePickFbo(n, i);
  }
  // ─── 销毁 ───────────────────────────────────────
  destroy() {
    const n = this.gl;
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown, {
      capture: !0
    }), n.deleteProgram(this.program), n.deleteProgram(this.pickProgram), this.pickFbo && n.deleteFramebuffer(this.pickFbo), this.pickTexture && n.deleteTexture(this.pickTexture);
  }
}
class Yg {
  constructor(n) {
    k(this, "container");
    k(this, "canvas");
    k(this, "plugin");
    k(this, "interaction");
    k(this, "gl");
    k(this, "camera", new lg());
    k(this, "nodes", []);
    k(this, "links", []);
    k(this, "bgColor");
    k(this, "showArrows", !1);
    k(this, "labelMinScale", 0.5);
    k(this, "width");
    k(this, "height");
    k(this, "_destroyed", !1);
    k(this, "_rafId", 0);
    // 回调
    k(this, "onNodeClick");
    k(this, "onNodeHover");
    k(this, "onLinkHover");
    k(this, "onNodeContextMenu");
    k(this, "onNodeDrag");
    k(this, "onNodeDragEnd");
    k(this, "onLinkClick");
    k(this, "onBackgroundClick");
    k(this, "onZoom");
    k(this, "onPlusClick");
    this.container = n.container, this.canvas = document.createElement("canvas"), this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.display = "block";
    const i = window.devicePixelRatio || 1;
    this.width = n.width || this.container.clientWidth, this.height = n.height || this.container.clientHeight, this.canvas.width = this.width * i, this.canvas.height = this.height * i, this.container.appendChild(this.canvas);
    const s = this.canvas.getContext("webgl2", {
      antialias: !0,
      premultipliedAlpha: !1
    });
    if (!s) throw new Error("WebGL2 not supported");
    if (this.gl = s, s.enable(s.BLEND), s.blendFunc(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA), s.enable(s.DEPTH_TEST), s.depthFunc(s.LEQUAL), n.backgroundColor) {
      const d = n.backgroundColor;
      this.bgColor = [
        parseInt(d.slice(1, 3), 16) / 255,
        parseInt(d.slice(3, 5), 16) / 255,
        parseInt(d.slice(5, 7), 16) / 255,
        1
      ];
    } else
      this.bgColor = [1, 1, 1, 1];
    this.showArrows = n.showArrows ?? !1, this.labelMinScale = n.labelMinScale ?? 0.5, this.plugin = n.renderPlugin(s, this.canvas), this.interaction = new ag(
      this.canvas,
      this.plugin,
      this.makeCallbacks()
    ), this.interaction.transform = this.camera.state, new ResizeObserver(() => this.handleResize()).observe(this.container), this.startRenderLoop();
  }
  // ========== Background ==========
  /** 运行时切换画布背景色（主题切换用） */
  setBackgroundColor(n) {
    this.bgColor = [
      parseInt(n.slice(1, 3), 16) / 255,
      parseInt(n.slice(3, 5), 16) / 255,
      parseInt(n.slice(5, 7), 16) / 255,
      1
    ];
  }
  // ========== 回调 ==========
  makeCallbacks() {
    return {
      onNodeClick: (n, i) => {
        var s;
        return (s = this.onNodeClick) == null ? void 0 : s.call(this, n, i);
      },
      onLinkClick: (n, i) => {
        var s;
        return (s = this.onLinkClick) == null ? void 0 : s.call(this, n, i);
      },
      onNodeHover: (n) => {
        var i;
        return (i = this.onNodeHover) == null ? void 0 : i.call(this, n);
      },
      onLinkHover: (n) => {
        var i;
        return (i = this.onLinkHover) == null ? void 0 : i.call(this, n);
      },
      onNodeDrag: (n, i, s) => {
        var h, p, v;
        const u = this.interaction.transform.k, d = this.nodes.find((g) => g.id === n);
        d && (d.x += i / u, d.y += s / u, (h = this.onNodeDrag) == null || h.call(this, n, d.x, d.y), (v = (p = this.plugin).afterPositionUpdate) == null || v.call(p, this.nodes));
      },
      onNodeDragEnd: (n) => {
        var i;
        return (i = this.onNodeDragEnd) == null ? void 0 : i.call(this, n);
      },
      onNodeContextMenu: (n, i, s) => {
        var u;
        return (u = this.onNodeContextMenu) == null ? void 0 : u.call(this, n, i, s);
      },
      onBackgroundClick: (n) => {
        var i;
        return (i = this.onBackgroundClick) == null ? void 0 : i.call(this, n);
      },
      onZoom: (n) => {
        var i;
        return (i = this.onZoom) == null ? void 0 : i.call(this, n);
      },
      onPan: (n) => {
        var i;
        return (i = this.onZoom) == null ? void 0 : i.call(this, n);
      }
    };
  }
  // ========== Data ==========
  updateData(n, i) {
    this.nodes = n, this.links = i, this.plugin.syncData(n, i);
  }
  updateNodePositions(n) {
    var i, s;
    for (const u of this.nodes) {
      const d = n.get(u.id);
      d && (u.x = d.x, u.y = d.y);
    }
    (s = (i = this.plugin).afterPositionUpdate) == null || s.call(i, this.nodes);
  }
  getCamera() {
    return this.camera;
  }
  getCanvas() {
    return this.canvas;
  }
  // ========== Rendering ==========
  render() {
    const n = this.gl, i = window.devicePixelRatio || 1, s = this.width * i, u = this.height * i;
    n.bindFramebuffer(n.FRAMEBUFFER, null), n.viewport(0, 0, s, u), n.clearColor(...this.bgColor), n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT);
    const d = this.interaction.transform;
    this.plugin.render({
      nodes: this.nodes,
      links: this.links,
      width: s,
      height: u,
      tx: d.x,
      ty: d.y,
      scale: d.k,
      showArrows: this.showArrows,
      labelMinScale: this.labelMinScale
    }), this.plugin.tx = d.x, this.plugin.ty = d.y, this.plugin.k = d.k;
    const h = this.plugin.getOverlays();
    for (let p = 0; p < h.length; p++)
      h[p].renderPickBuffer(s, u, d.x, d.y, d.k), h[p].render(s, u, d.x, d.y, d.k, -0.6 - p * 0.01);
  }
  startRenderLoop() {
    const n = () => {
      this._destroyed || (this.render(), this._rafId = requestAnimationFrame(n));
    };
    this._rafId = requestAnimationFrame(n);
  }
  // ========== Picking ==========
  pick(n, i) {
    return this.plugin.pick(n, i);
  }
  // ========== Resize ==========
  handleResize() {
    const n = window.devicePixelRatio || 1;
    this.width = this.container.clientWidth, this.height = this.container.clientHeight, this.canvas.width = this.width * n, this.canvas.height = this.height * n, this.gl.viewport(0, 0, this.width * n, this.height * n), this.plugin.resize(this.width, this.height);
  }
  // ========== Camera ==========
  fitView(n = 40) {
    var x;
    if (this.nodes.length === 0 || this.width <= 0 || this.height <= 0) return;
    let i = 1 / 0, s = 1 / 0, u = -1 / 0, d = -1 / 0;
    for (const N of this.nodes)
      i = Math.min(i, N.x - N.radius), s = Math.min(s, N.y - N.radius), u = Math.max(u, N.x + N.radius), d = Math.max(d, N.y + N.radius);
    const h = u - i + n * 2, p = d - s + n * 2, v = Math.min(this.width / h, this.height / p, 2), g = this.interaction.transform;
    g.k = v, g.x = this.width / (2 * v) - (i + u) / 2, g.y = this.height / (2 * v) - (s + d) / 2, this.camera.reset(), (x = this.onZoom) == null || x.call(this, g);
  }
  focusNode(n) {
    const i = this.nodes.find((u) => u.id === n);
    if (!i) return;
    const s = this.interaction.transform;
    s.x = this.width / 2 / s.k - i.x, s.y = this.height / 2 / s.k - i.y;
  }
  destroy() {
    this._destroyed = !0, this._rafId && cancelAnimationFrame(this._rafId), this.interaction.detach(), this.interaction.reset(), this.plugin.destroy(), this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
}
class $g {
  constructor(n) {
    /** 实际渲染器 */
    k(this, "backend");
    // ========== 回调桥接 ==========
    k(this, "onNodeClick");
    k(this, "onNodeHover");
    k(this, "onLinkHover");
    k(this, "onNodeDrag");
    k(this, "onNodeDragEnd");
    k(this, "onNodeContextMenu");
    k(this, "onLinkClick");
    k(this, "onBackgroundClick");
    k(this, "onZoom");
    k(this, "onPlusClick");
    this.backend = new Yg({
      container: n.container,
      width: n.width,
      height: n.height,
      backgroundColor: n.backgroundColor,
      showArrows: n.showArrows,
      labelMinScale: n.labelMinScale,
      renderPlugin: n.renderPlugin
    }), this.backend.onNodeClick = (...i) => {
      var s;
      return (s = this.onNodeClick) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onNodeHover = (...i) => {
      var s;
      return (s = this.onNodeHover) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onLinkHover = (...i) => {
      var s;
      return (s = this.onLinkHover) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onNodeDrag = (...i) => {
      var s;
      return (s = this.onNodeDrag) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onNodeDragEnd = (...i) => {
      var s;
      return (s = this.onNodeDragEnd) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onNodeContextMenu = (...i) => {
      var s;
      return (s = this.onNodeContextMenu) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onLinkClick = (...i) => {
      var s;
      return (s = this.onLinkClick) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onBackgroundClick = (...i) => {
      var s;
      return (s = this.onBackgroundClick) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onZoom = (...i) => {
      var s;
      return (s = this.onZoom) == null ? void 0 : s.call(this, ...i);
    }, this.backend.onPlusClick = (...i) => {
      var s;
      return (s = this.onPlusClick) == null ? void 0 : s.call(this, ...i);
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
  setBackgroundColor(n) {
    this.backend.setBackgroundColor(n);
  }
  // ========== 统一 API ==========
  /** 更新数据 */
  updateData(n, i) {
    this.backend.updateData(n, i);
  }
  /** 更新节点位置（物理 tick 回调） */
  updateNodePositions(n) {
    this.backend.updateNodePositions(n);
  }
  /** 自适应视图 */
  fitView(n) {
    this.backend.fitView(n);
  }
  /** 聚焦到某节点 */
  focusNode(n) {
    this.backend.focusNode(n);
  }
  /** 销毁释放资源 */
  destroy() {
    this.backend.destroy();
  }
}
function hl(c, n) {
  var i, s = 1;
  c == null && (c = 0), n == null && (n = 0);
  function u() {
    var d, h = i.length, p, v = 0, g = 0;
    for (d = 0; d < h; ++d)
      p = i[d], v += p.x, g += p.y;
    for (v = (v / h - c) * s, g = (g / h - n) * s, d = 0; d < h; ++d)
      p = i[d], p.x -= v, p.y -= g;
  }
  return u.initialize = function(d) {
    i = d;
  }, u.x = function(d) {
    return arguments.length ? (c = +d, u) : c;
  }, u.y = function(d) {
    return arguments.length ? (n = +d, u) : n;
  }, u.strength = function(d) {
    return arguments.length ? (s = +d, u) : s;
  }, u;
}
function Gg(c) {
  const n = +this._x.call(null, c), i = +this._y.call(null, c);
  return Qc(this.cover(n, i), n, i, c);
}
function Qc(c, n, i, s) {
  if (isNaN(n) || isNaN(i)) return c;
  var u, d = c._root, h = { data: s }, p = c._x0, v = c._y0, g = c._x1, x = c._y1, N, S, w, R, P, y, _, L;
  if (!d) return c._root = h, c;
  for (; d.length; )
    if ((P = n >= (N = (p + g) / 2)) ? p = N : g = N, (y = i >= (S = (v + x) / 2)) ? v = S : x = S, u = d, !(d = d[_ = y << 1 | P])) return u[_] = h, c;
  if (w = +c._x.call(null, d.data), R = +c._y.call(null, d.data), n === w && i === R) return h.next = d, u ? u[_] = h : c._root = h, c;
  do
    u = u ? u[_] = new Array(4) : c._root = new Array(4), (P = n >= (N = (p + g) / 2)) ? p = N : g = N, (y = i >= (S = (v + x) / 2)) ? v = S : x = S;
  while ((_ = y << 1 | P) === (L = (R >= S) << 1 | w >= N));
  return u[L] = d, u[_] = h, c;
}
function Qg(c) {
  var n, i, s = c.length, u, d, h = new Array(s), p = new Array(s), v = 1 / 0, g = 1 / 0, x = -1 / 0, N = -1 / 0;
  for (i = 0; i < s; ++i)
    isNaN(u = +this._x.call(null, n = c[i])) || isNaN(d = +this._y.call(null, n)) || (h[i] = u, p[i] = d, u < v && (v = u), u > x && (x = u), d < g && (g = d), d > N && (N = d));
  if (v > x || g > N) return this;
  for (this.cover(v, g).cover(x, N), i = 0; i < s; ++i)
    Qc(this, h[i], p[i], c[i]);
  return this;
}
function Kg(c, n) {
  if (isNaN(c = +c) || isNaN(n = +n)) return this;
  var i = this._x0, s = this._y0, u = this._x1, d = this._y1;
  if (isNaN(i))
    u = (i = Math.floor(c)) + 1, d = (s = Math.floor(n)) + 1;
  else {
    for (var h = u - i || 1, p = this._root, v, g; i > c || c >= u || s > n || n >= d; )
      switch (g = (n < s) << 1 | c < i, v = new Array(4), v[g] = p, p = v, h *= 2, g) {
        case 0:
          u = i + h, d = s + h;
          break;
        case 1:
          i = u - h, d = s + h;
          break;
        case 2:
          u = i + h, s = d - h;
          break;
        case 3:
          i = u - h, s = d - h;
          break;
      }
    this._root && this._root.length && (this._root = p);
  }
  return this._x0 = i, this._y0 = s, this._x1 = u, this._y1 = d, this;
}
function Zg() {
  var c = [];
  return this.visit(function(n) {
    if (!n.length) do
      c.push(n.data);
    while (n = n.next);
  }), c;
}
function qg(c) {
  return arguments.length ? this.cover(+c[0][0], +c[0][1]).cover(+c[1][0], +c[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function Je(c, n, i, s, u) {
  this.node = c, this.x0 = n, this.y0 = i, this.x1 = s, this.y1 = u;
}
function Jg(c, n, i) {
  var s, u = this._x0, d = this._y0, h, p, v, g, x = this._x1, N = this._y1, S = [], w = this._root, R, P;
  for (w && S.push(new Je(w, u, d, x, N)), i == null ? i = 1 / 0 : (u = c - i, d = n - i, x = c + i, N = n + i, i *= i); R = S.pop(); )
    if (!(!(w = R.node) || (h = R.x0) > x || (p = R.y0) > N || (v = R.x1) < u || (g = R.y1) < d))
      if (w.length) {
        var y = (h + v) / 2, _ = (p + g) / 2;
        S.push(
          new Je(w[3], y, _, v, g),
          new Je(w[2], h, _, y, g),
          new Je(w[1], y, p, v, _),
          new Je(w[0], h, p, y, _)
        ), (P = (n >= _) << 1 | c >= y) && (R = S[S.length - 1], S[S.length - 1] = S[S.length - 1 - P], S[S.length - 1 - P] = R);
      } else {
        var L = c - +this._x.call(null, w.data), X = n - +this._y.call(null, w.data), j = L * L + X * X;
        if (j < i) {
          var W = Math.sqrt(i = j);
          u = c - W, d = n - W, x = c + W, N = n + W, s = w.data;
        }
      }
  return s;
}
function ev(c) {
  if (isNaN(x = +this._x.call(null, c)) || isNaN(N = +this._y.call(null, c))) return this;
  var n, i = this._root, s, u, d, h = this._x0, p = this._y0, v = this._x1, g = this._y1, x, N, S, w, R, P, y, _;
  if (!i) return this;
  if (i.length) for (; ; ) {
    if ((R = x >= (S = (h + v) / 2)) ? h = S : v = S, (P = N >= (w = (p + g) / 2)) ? p = w : g = w, n = i, !(i = i[y = P << 1 | R])) return this;
    if (!i.length) break;
    (n[y + 1 & 3] || n[y + 2 & 3] || n[y + 3 & 3]) && (s = n, _ = y);
  }
  for (; i.data !== c; ) if (u = i, !(i = i.next)) return this;
  return (d = i.next) && delete i.next, u ? (d ? u.next = d : delete u.next, this) : n ? (d ? n[y] = d : delete n[y], (i = n[0] || n[1] || n[2] || n[3]) && i === (n[3] || n[2] || n[1] || n[0]) && !i.length && (s ? s[_] = i : this._root = i), this) : (this._root = d, this);
}
function tv(c) {
  for (var n = 0, i = c.length; n < i; ++n) this.remove(c[n]);
  return this;
}
function nv() {
  return this._root;
}
function rv() {
  var c = 0;
  return this.visit(function(n) {
    if (!n.length) do
      ++c;
    while (n = n.next);
  }), c;
}
function iv(c) {
  var n = [], i, s = this._root, u, d, h, p, v;
  for (s && n.push(new Je(s, this._x0, this._y0, this._x1, this._y1)); i = n.pop(); )
    if (!c(s = i.node, d = i.x0, h = i.y0, p = i.x1, v = i.y1) && s.length) {
      var g = (d + p) / 2, x = (h + v) / 2;
      (u = s[3]) && n.push(new Je(u, g, x, p, v)), (u = s[2]) && n.push(new Je(u, d, x, g, v)), (u = s[1]) && n.push(new Je(u, g, h, p, x)), (u = s[0]) && n.push(new Je(u, d, h, g, x));
    }
  return this;
}
function ov(c) {
  var n = [], i = [], s;
  for (this._root && n.push(new Je(this._root, this._x0, this._y0, this._x1, this._y1)); s = n.pop(); ) {
    var u = s.node;
    if (u.length) {
      var d, h = s.x0, p = s.y0, v = s.x1, g = s.y1, x = (h + v) / 2, N = (p + g) / 2;
      (d = u[0]) && n.push(new Je(d, h, p, x, N)), (d = u[1]) && n.push(new Je(d, x, p, v, N)), (d = u[2]) && n.push(new Je(d, h, N, x, g)), (d = u[3]) && n.push(new Je(d, x, N, v, g));
    }
    i.push(s);
  }
  for (; s = i.pop(); )
    c(s.node, s.x0, s.y0, s.x1, s.y1);
  return this;
}
function sv(c) {
  return c[0];
}
function lv(c) {
  return arguments.length ? (this._x = c, this) : this._x;
}
function av(c) {
  return c[1];
}
function uv(c) {
  return arguments.length ? (this._y = c, this) : this._y;
}
function kl(c, n, i) {
  var s = new xl(n ?? sv, i ?? av, NaN, NaN, NaN, NaN);
  return c == null ? s : s.addAll(c);
}
function xl(c, n, i, s, u, d) {
  this._x = c, this._y = n, this._x0 = i, this._y0 = s, this._x1 = u, this._y1 = d, this._root = void 0;
}
function Lc(c) {
  for (var n = { data: c.data }, i = n; c = c.next; ) i = i.next = { data: c.data };
  return n;
}
var et = kl.prototype = xl.prototype;
et.copy = function() {
  var c = new xl(this._x, this._y, this._x0, this._y0, this._x1, this._y1), n = this._root, i, s;
  if (!n) return c;
  if (!n.length) return c._root = Lc(n), c;
  for (i = [{ source: n, target: c._root = new Array(4) }]; n = i.pop(); )
    for (var u = 0; u < 4; ++u)
      (s = n.source[u]) && (s.length ? i.push({ source: s, target: n.target[u] = new Array(4) }) : n.target[u] = Lc(s));
  return c;
};
et.add = Gg;
et.addAll = Qg;
et.cover = Kg;
et.data = Zg;
et.extent = qg;
et.find = Jg;
et.remove = ev;
et.removeAll = tv;
et.root = nv;
et.size = rv;
et.visit = iv;
et.visitAfter = ov;
et.x = lv;
et.y = uv;
function Tn(c) {
  return function() {
    return c;
  };
}
function sn(c) {
  return (c() - 0.5) * 1e-6;
}
function cv(c) {
  return c.x + c.vx;
}
function dv(c) {
  return c.y + c.vy;
}
function hv(c) {
  var n, i, s, u = 1, d = 1;
  typeof c != "function" && (c = Tn(c == null ? 1 : +c));
  function h() {
    for (var g, x = n.length, N, S, w, R, P, y, _ = 0; _ < d; ++_)
      for (N = kl(n, cv, dv).visitAfter(p), g = 0; g < x; ++g)
        S = n[g], P = i[S.index], y = P * P, w = S.x + S.vx, R = S.y + S.vy, N.visit(L);
    function L(X, j, W, Y, M) {
      var U = X.data, O = X.r, Q = P + O;
      if (U) {
        if (U.index > S.index) {
          var oe = w - U.x - U.vx, ve = R - U.y - U.vy, le = oe * oe + ve * ve;
          le < Q * Q && (oe === 0 && (oe = sn(s), le += oe * oe), ve === 0 && (ve = sn(s), le += ve * ve), le = (Q - (le = Math.sqrt(le))) / le * u, S.vx += (oe *= le) * (Q = (O *= O) / (y + O)), S.vy += (ve *= le) * Q, U.vx -= oe * (Q = 1 - Q), U.vy -= ve * Q);
        }
        return;
      }
      return j > w + Q || Y < w - Q || W > R + Q || M < R - Q;
    }
  }
  function p(g) {
    if (g.data) return g.r = i[g.data.index];
    for (var x = g.r = 0; x < 4; ++x)
      g[x] && g[x].r > g.r && (g.r = g[x].r);
  }
  function v() {
    if (n) {
      var g, x = n.length, N;
      for (i = new Array(x), g = 0; g < x; ++g)
        N = n[g], i[N.index] = +c(N, g, n);
    }
  }
  return h.initialize = function(g, x) {
    n = g, s = x, v();
  }, h.iterations = function(g) {
    return arguments.length ? (d = +g, h) : d;
  }, h.strength = function(g) {
    return arguments.length ? (u = +g, h) : u;
  }, h.radius = function(g) {
    return arguments.length ? (c = typeof g == "function" ? g : Tn(+g), v(), h) : c;
  }, h;
}
function fv(c) {
  return c.index;
}
function Mc(c, n) {
  var i = c.get(n);
  if (!i) throw new Error("node not found: " + n);
  return i;
}
function Dc(c) {
  var n = fv, i = N, s, u = Tn(30), d, h, p, v, g, x = 1;
  c == null && (c = []);
  function N(y) {
    return 1 / Math.min(p[y.source.index], p[y.target.index]);
  }
  function S(y) {
    for (var _ = 0, L = c.length; _ < x; ++_)
      for (var X = 0, j, W, Y, M, U, O, Q; X < L; ++X)
        j = c[X], W = j.source, Y = j.target, M = Y.x + Y.vx - W.x - W.vx || sn(g), U = Y.y + Y.vy - W.y - W.vy || sn(g), O = Math.sqrt(M * M + U * U), O = (O - d[X]) / O * y * s[X], M *= O, U *= O, Y.vx -= M * (Q = v[X]), Y.vy -= U * Q, W.vx += M * (Q = 1 - Q), W.vy += U * Q;
  }
  function w() {
    if (h) {
      var y, _ = h.length, L = c.length, X = new Map(h.map((W, Y) => [n(W, Y, h), W])), j;
      for (y = 0, p = new Array(_); y < L; ++y)
        j = c[y], j.index = y, typeof j.source != "object" && (j.source = Mc(X, j.source)), typeof j.target != "object" && (j.target = Mc(X, j.target)), p[j.source.index] = (p[j.source.index] || 0) + 1, p[j.target.index] = (p[j.target.index] || 0) + 1;
      for (y = 0, v = new Array(L); y < L; ++y)
        j = c[y], v[y] = p[j.source.index] / (p[j.source.index] + p[j.target.index]);
      s = new Array(L), R(), d = new Array(L), P();
    }
  }
  function R() {
    if (h)
      for (var y = 0, _ = c.length; y < _; ++y)
        s[y] = +i(c[y], y, c);
  }
  function P() {
    if (h)
      for (var y = 0, _ = c.length; y < _; ++y)
        d[y] = +u(c[y], y, c);
  }
  return S.initialize = function(y, _) {
    h = y, g = _, w();
  }, S.links = function(y) {
    return arguments.length ? (c = y, w(), S) : c;
  }, S.id = function(y) {
    return arguments.length ? (n = y, S) : n;
  }, S.iterations = function(y) {
    return arguments.length ? (x = +y, S) : x;
  }, S.strength = function(y) {
    return arguments.length ? (i = typeof y == "function" ? y : Tn(+y), R(), S) : i;
  }, S.distance = function(y) {
    return arguments.length ? (u = typeof y == "function" ? y : Tn(+y), P(), S) : u;
  }, S;
}
var pv = { value: () => {
} };
function Kc() {
  for (var c = 0, n = arguments.length, i = {}, s; c < n; ++c) {
    if (!(s = arguments[c] + "") || s in i || /[\s.]/.test(s)) throw new Error("illegal type: " + s);
    i[s] = [];
  }
  return new ao(i);
}
function ao(c) {
  this._ = c;
}
function gv(c, n) {
  return c.trim().split(/^|\s+/).map(function(i) {
    var s = "", u = i.indexOf(".");
    if (u >= 0 && (s = i.slice(u + 1), i = i.slice(0, u)), i && !n.hasOwnProperty(i)) throw new Error("unknown type: " + i);
    return { type: i, name: s };
  });
}
ao.prototype = Kc.prototype = {
  constructor: ao,
  on: function(c, n) {
    var i = this._, s = gv(c + "", i), u, d = -1, h = s.length;
    if (arguments.length < 2) {
      for (; ++d < h; ) if ((u = (c = s[d]).type) && (u = vv(i[u], c.name))) return u;
      return;
    }
    if (n != null && typeof n != "function") throw new Error("invalid callback: " + n);
    for (; ++d < h; )
      if (u = (c = s[d]).type) i[u] = Ic(i[u], c.name, n);
      else if (n == null) for (u in i) i[u] = Ic(i[u], c.name, null);
    return this;
  },
  copy: function() {
    var c = {}, n = this._;
    for (var i in n) c[i] = n[i].slice();
    return new ao(c);
  },
  call: function(c, n) {
    if ((u = arguments.length - 2) > 0) for (var i = new Array(u), s = 0, u, d; s < u; ++s) i[s] = arguments[s + 2];
    if (!this._.hasOwnProperty(c)) throw new Error("unknown type: " + c);
    for (d = this._[c], s = 0, u = d.length; s < u; ++s) d[s].value.apply(n, i);
  },
  apply: function(c, n, i) {
    if (!this._.hasOwnProperty(c)) throw new Error("unknown type: " + c);
    for (var s = this._[c], u = 0, d = s.length; u < d; ++u) s[u].value.apply(n, i);
  }
};
function vv(c, n) {
  for (var i = 0, s = c.length, u; i < s; ++i)
    if ((u = c[i]).name === n)
      return u.value;
}
function Ic(c, n, i) {
  for (var s = 0, u = c.length; s < u; ++s)
    if (c[s].name === n) {
      c[s] = pv, c = c.slice(0, s).concat(c.slice(s + 1));
      break;
    }
  return i != null && c.push({ name: n, value: i }), c;
}
var tr = 0, Xr = 0, Wr = 0, Zc = 1e3, uo, Yr, co = 0, Cn = 0, fo = 0, $r = typeof performance == "object" && performance.now ? performance : Date, qc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(c) {
  setTimeout(c, 17);
};
function Jc() {
  return Cn || (qc(yv), Cn = $r.now() + fo);
}
function yv() {
  Cn = 0;
}
function gl() {
  this._call = this._time = this._next = null;
}
gl.prototype = ed.prototype = {
  constructor: gl,
  restart: function(c, n, i) {
    if (typeof c != "function") throw new TypeError("callback is not a function");
    i = (i == null ? Jc() : +i) + (n == null ? 0 : +n), !this._next && Yr !== this && (Yr ? Yr._next = this : uo = this, Yr = this), this._call = c, this._time = i, vl();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, vl());
  }
};
function ed(c, n, i) {
  var s = new gl();
  return s.restart(c, n, i), s;
}
function mv() {
  Jc(), ++tr;
  for (var c = uo, n; c; )
    (n = Cn - c._time) >= 0 && c._call.call(void 0, n), c = c._next;
  --tr;
}
function Fc() {
  Cn = (co = $r.now()) + fo, tr = Xr = 0;
  try {
    mv();
  } finally {
    tr = 0, xv(), Cn = 0;
  }
}
function kv() {
  var c = $r.now(), n = c - co;
  n > Zc && (fo -= n, co = c);
}
function xv() {
  for (var c, n = uo, i, s = 1 / 0; n; )
    n._call ? (s > n._time && (s = n._time), c = n, n = n._next) : (i = n._next, n._next = null, n = c ? c._next = i : uo = i);
  Yr = c, vl(s);
}
function vl(c) {
  if (!tr) {
    Xr && (Xr = clearTimeout(Xr));
    var n = c - Cn;
    n > 24 ? (c < 1 / 0 && (Xr = setTimeout(Fc, c - $r.now() - fo)), Wr && (Wr = clearInterval(Wr))) : (Wr || (co = $r.now(), Wr = setInterval(kv, Zc)), tr = 1, qc(Fc));
  }
}
const wv = 1664525, Sv = 1013904223, zc = 4294967296;
function _v() {
  let c = 1;
  return () => (c = (wv * c + Sv) % zc) / zc;
}
function Tv(c) {
  return c.x;
}
function Cv(c) {
  return c.y;
}
var Ev = 10, Pv = Math.PI * (3 - Math.sqrt(5));
function Nv(c) {
  var n, i = 1, s = 1e-3, u = 1 - Math.pow(s, 1 / 300), d = 0, h = 0.6, p = /* @__PURE__ */ new Map(), v = ed(N), g = Kc("tick", "end"), x = _v();
  c == null && (c = []);
  function N() {
    S(), g.call("tick", n), i < s && (v.stop(), g.call("end", n));
  }
  function S(P) {
    var y, _ = c.length, L;
    P === void 0 && (P = 1);
    for (var X = 0; X < P; ++X)
      for (i += (d - i) * u, p.forEach(function(j) {
        j(i);
      }), y = 0; y < _; ++y)
        L = c[y], L.fx == null ? L.x += L.vx *= h : (L.x = L.fx, L.vx = 0), L.fy == null ? L.y += L.vy *= h : (L.y = L.fy, L.vy = 0);
    return n;
  }
  function w() {
    for (var P = 0, y = c.length, _; P < y; ++P) {
      if (_ = c[P], _.index = P, _.fx != null && (_.x = _.fx), _.fy != null && (_.y = _.fy), isNaN(_.x) || isNaN(_.y)) {
        var L = Ev * Math.sqrt(0.5 + P), X = P * Pv;
        _.x = L * Math.cos(X), _.y = L * Math.sin(X);
      }
      (isNaN(_.vx) || isNaN(_.vy)) && (_.vx = _.vy = 0);
    }
  }
  function R(P) {
    return P.initialize && P.initialize(c, x), P;
  }
  return w(), n = {
    tick: S,
    restart: function() {
      return v.restart(N), n;
    },
    stop: function() {
      return v.stop(), n;
    },
    nodes: function(P) {
      return arguments.length ? (c = P, w(), p.forEach(R), n) : c;
    },
    alpha: function(P) {
      return arguments.length ? (i = +P, n) : i;
    },
    alphaMin: function(P) {
      return arguments.length ? (s = +P, n) : s;
    },
    alphaDecay: function(P) {
      return arguments.length ? (u = +P, n) : +u;
    },
    alphaTarget: function(P) {
      return arguments.length ? (d = +P, n) : d;
    },
    velocityDecay: function(P) {
      return arguments.length ? (h = 1 - P, n) : 1 - h;
    },
    randomSource: function(P) {
      return arguments.length ? (x = P, p.forEach(R), n) : x;
    },
    force: function(P, y) {
      return arguments.length > 1 ? (y == null ? p.delete(P) : p.set(P, R(y)), n) : p.get(P);
    },
    find: function(P, y, _) {
      var L = 0, X = c.length, j, W, Y, M, U;
      for (_ == null ? _ = 1 / 0 : _ *= _, L = 0; L < X; ++L)
        M = c[L], j = P - M.x, W = y - M.y, Y = j * j + W * W, Y < _ && (U = M, _ = Y);
      return U;
    },
    on: function(P, y) {
      return arguments.length > 1 ? (g.on(P, y), n) : g.on(P);
    }
  };
}
function jc() {
  var c, n, i, s, u = Tn(-30), d, h = 1, p = 1 / 0, v = 0.81;
  function g(w) {
    var R, P = c.length, y = kl(c, Tv, Cv).visitAfter(N);
    for (s = w, R = 0; R < P; ++R) n = c[R], y.visit(S);
  }
  function x() {
    if (c) {
      var w, R = c.length, P;
      for (d = new Array(R), w = 0; w < R; ++w)
        P = c[w], d[P.index] = +u(P, w, c);
    }
  }
  function N(w) {
    var R = 0, P, y, _ = 0, L, X, j;
    if (w.length) {
      for (L = X = j = 0; j < 4; ++j)
        (P = w[j]) && (y = Math.abs(P.value)) && (R += P.value, _ += y, L += y * P.x, X += y * P.y);
      w.x = L / _, w.y = X / _;
    } else {
      P = w, P.x = P.data.x, P.y = P.data.y;
      do
        R += d[P.data.index];
      while (P = P.next);
    }
    w.value = R;
  }
  function S(w, R, P, y) {
    if (!w.value) return !0;
    var _ = w.x - n.x, L = w.y - n.y, X = y - R, j = _ * _ + L * L;
    if (X * X / v < j)
      return j < p && (_ === 0 && (_ = sn(i), j += _ * _), L === 0 && (L = sn(i), j += L * L), j < h && (j = Math.sqrt(h * j)), n.vx += _ * w.value * s / j, n.vy += L * w.value * s / j), !0;
    if (w.length || j >= p) return;
    (w.data !== n || w.next) && (_ === 0 && (_ = sn(i), j += _ * _), L === 0 && (L = sn(i), j += L * L), j < h && (j = Math.sqrt(h * j)));
    do
      w.data !== n && (X = d[w.data.index] * s / j, n.vx += _ * X, n.vy += L * X);
    while (w = w.next);
  }
  return g.initialize = function(w, R) {
    c = w, i = R, x();
  }, g.strength = function(w) {
    return arguments.length ? (u = typeof w == "function" ? w : Tn(+w), x(), g) : u;
  }, g.distanceMin = function(w) {
    return arguments.length ? (h = w * w, g) : Math.sqrt(h);
  }, g.distanceMax = function(w) {
    return arguments.length ? (p = w * w, g) : Math.sqrt(p);
  }, g.theta = function(w) {
    return arguments.length ? (v = w * w, g) : Math.sqrt(v);
  }, g;
}
const Av = {
  repulsion: -300,
  linkDistance: 80,
  linkStrength: 0.3,
  centerStrength: 0.05,
  collisionRadius: 1.2,
  collisionIterations: 1,
  velocityDecay: 0.3,
  alphaMin: 1e-3,
  linkIterations: 1
};
class Oc {
  constructor(n) {
    k(this, "simulation", null);
    k(this, "nodes", []);
    k(this, "links", []);
    k(this, "config");
    k(this, "centerX", 0);
    k(this, "centerY", 0);
    // Callbacks
    k(this, "onTick");
    k(this, "onEnd");
    this.config = { ...Av, ...n };
  }
  /** Set nodes and links */
  setData(n, i) {
    this.nodes = n, this.links = i;
  }
  /** Start or restart the simulation */
  start() {
    this.simulation && this.simulation.stop(), this.simulation = Nv(this.nodes).force(
      "link",
      Dc(this.links).id((n) => n.id).distance(this.config.linkDistance).strength(this.config.linkStrength).iterations(this.config.linkIterations)
    ).force("charge", jc().strength(this.config.repulsion)).force(
      "center",
      hl(this.centerX, this.centerY).strength(
        this.config.centerStrength
      )
    ).force(
      "collide",
      hv(
        (n) => (n.radius || 5) * this.config.collisionRadius
      ).iterations(this.config.collisionIterations)
    ).velocityDecay(this.config.velocityDecay).alphaMin(this.config.alphaMin).on("tick", () => {
      var n;
      (n = this.onTick) == null || n.call(this, this.nodes);
    }).on("end", () => {
      var n;
      (n = this.onEnd) == null || n.call(this);
    });
  }
  /** Stop the simulation */
  stop() {
    var n;
    (n = this.simulation) == null || n.stop();
  }
  /** Reheat the simulation */
  reheat(n = 0.1) {
    var i;
    (i = this.simulation) == null || i.alpha(n).restart();
  }
  /** Update config and restart */
  updateConfig(n) {
    if (Object.assign(this.config, n), this.simulation) {
      const i = this.simulation;
      i.force("charge", jc().strength(this.config.repulsion)), i.force(
        "link",
        Dc(this.links).id((s) => s.id).distance(this.config.linkDistance).strength(this.config.linkStrength)
      ), i.force(
        "center",
        hl(this.centerX, this.centerY).strength(
          this.config.centerStrength
        )
      ), i.velocityDecay(this.config.velocityDecay), i.alphaMin(this.config.alphaMin), i.alpha(0.3).restart();
    }
  }
  /** Set center position */
  setCenter(n, i) {
    var s;
    this.centerX = n, this.centerY = i, (s = this.simulation) == null || s.force(
      "center",
      hl(n, i).strength(this.config.centerStrength)
    );
  }
  /** Fix a node in place */
  fixNode(n, i, s) {
    const u = this.nodes.find((d) => d.id === n);
    u && (i !== void 0 && (u.fx = i), s !== void 0 && (u.fy = s));
  }
  /** Release a fixed node */
  releaseNode(n) {
    const i = this.nodes.find((s) => s.id === n);
    i && (i.fx = null, i.fy = null);
  }
  /** Get current alpha */
  get alpha() {
    var n;
    return ((n = this.simulation) == null ? void 0 : n.alpha()) ?? 0;
  }
  /** Get all node positions as a map */
  getNodePositions() {
    const n = /* @__PURE__ */ new Map();
    for (const i of this.nodes)
      n.set(i.id, { x: i.x ?? 0, y: i.y ?? 0, vx: i.vx ?? 0, vy: i.vy ?? 0 });
    return n;
  }
  destroy() {
    var n;
    (n = this.simulation) == null || n.stop(), this.simulation = null;
  }
}
function _n(c) {
  let n = c.replace("#", "");
  n.length === 3 && (n = n.replace(/(.)/g, "$1$1")), n.length === 4 && (n = n.replace(/(.)/g, "$1$1"));
  const i = parseInt(n.slice(0, 2), 16) / 255, s = parseInt(n.slice(2, 4), 16) / 255, u = parseInt(n.slice(4, 6), 16) / 255, d = n.length >= 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return [i, s, u, d];
}
function Rv(c, n) {
  const i = { ...c };
  for (const s of Object.keys(n))
    s === "background" || typeof n[s] != "object" || n[s] === null ? i[s] = n[s] : i[s] = { ...c[s] || {}, ...n[s] };
  return i;
}
class bv {
  constructor(n) {
    k(this, "options");
    k(this, "container");
    k(this, "model");
    /** 渲染器代理门面 */
    k(this, "renderer");
    /** 当前布局引擎 */
    k(this, "layout");
    /** 原始 theme 配置（含静态样式和动态回调） */
    k(this, "rawTheme");
    /** 运行时主题值（传给样式回调函数） */
    k(this, "runtimeTheme");
    // Node/link lookup
    k(this, "nodeMap", /* @__PURE__ */ new Map());
    k(this, "linkMap", /* @__PURE__ */ new Map());
    k(this, "events");
    k(this, "styleManager");
    this.options = n, this.container = n.container, this.model = n.graphModel, this.events = this.model.events, this.styleManager = this.model.styleManager, this.runtimeTheme = n.runtimeTheme, this.renderer = new $g({
      container: this.container,
      width: n.width,
      height: n.height,
      backgroundColor: n.backgroundColor,
      showArrows: n.arrowDisplay,
      renderPlugin: n.renderPlugin
    }), this.rawTheme = n.theme;
    const i = this.renderer.plugin.getDefaultStyle();
    let s;
    if (n.theme) {
      s = { background: n.theme.background };
      for (const d of ["node", "link"]) {
        const h = n.theme[d];
        if (h) {
          const p = {};
          for (const v of Object.keys(h))
            typeof h[v] != "function" && (p[v] = h[v]);
          Object.keys(p).length > 0 && (s[d] = p);
        }
      }
    }
    const u = s ? Rv(i, s) : i;
    this.styleManager.init(u), this.layout = n.layout ?? new Oc(n.forceConfig), this.layout.onTick = (d) => {
      this.onPhysicsTick(d);
    }, this.setupRendererCallbacks(), this.rebuildFromModel();
  }
  // ========== Renderer callbacks ==========
  setupRendererCallbacks() {
    this.renderer.onNodeContextMenu = (n, i, s) => {
      const u = this.nodeMap.get(n) ?? null;
      u && this.events.publish("nodeRightClick", {
        node: u,
        screenPos: { x: i, y: s },
        event: new MouseEvent("contextmenu")
      });
    }, this.renderer.onNodeClick = (n, i) => {
      const s = n ? this.nodeMap.get(n) ?? null : null;
      this.events.publish("nodeClick", {
        node: s,
        ctrlKey: (i == null ? void 0 : i.ctrlKey) ?? !1
      });
    }, this.renderer.onPlusClick = (n) => {
      const i = this.nodeMap.get(n) ?? null;
      i && this.events.publish("plusToolClick", i);
    }, this.renderer.onNodeHover = (n) => {
      if (n) {
        this.model.stateManager.setHoveredNodes([n]);
        const i = this.nodeMap.get(n) ?? null;
        this.events.publish("nodeHover", i);
      } else
        this.model.stateManager.clearHoveredNodes(), this.events.publish("nodeHover", null);
      this.syncAllNodeStyles();
    }, this.renderer.onLinkHover = (n) => {
      if (n) {
        this.model.stateManager.setHoveredLinks([n]);
        const i = this.linkMap.get(n) ?? null;
        this.events.publish("linkHover", { link: i, previousLink: null });
      } else
        this.model.stateManager.clearHoveredLinks(), this.events.publish("linkHover", { link: null, previousLink: null });
      this.syncAllLinkStyles(), this.syncAllNodeStyles();
    }, this.renderer.onNodeDrag = (n, i, s) => {
      this.layout.fixNode(n, i, s), this.layout.reheat(0.3);
      const d = this.layout.nodes.find((h) => h.id === n);
      d && (d.x = i, d.y = s);
    }, this.renderer.onNodeDragEnd = (n) => {
      this.layout.releaseNode(n);
      const i = this.nodeMap.get(n) ?? null;
      this.events.publish("nodeDragEnd", i);
    }, this.renderer.onLinkClick = (n, i) => {
      const s = n ? this.linkMap.get(n) ?? null : null;
      this.events.publish("linkClick", s);
    }, this.renderer.onBackgroundClick = (n) => {
      this.events.publish("backgroundClick", void 0);
    }, this.renderer.onZoom = (n) => {
      this.events.publish("zoom", n);
    }, this.events.subscribe("dataChange", ({ graphData: n }) => {
      this.rebuildFromModel(!1);
    }), this.events.subscribe("selectionChange", ({ nodeIds: n }) => {
      this.syncAllNodeStyles(), this.syncAllLinkStyles();
    });
  }
  // ========== 状态驱动的视觉同步 ==========
  /** 遍历所有节点，根据 stateManager 当前状态刷新视觉样式 */
  syncAllNodeStyles() {
    var n, i;
    for (const s of this.renderer.nodes) {
      const u = ((i = (n = this.renderer.plugin).resolveNodeState) == null ? void 0 : i.call(
        n,
        s.id,
        this.model.stateManager
      )) ?? "regular", d = this.styleManager.getNodeStyle(s.id), h = lo(d, u), p = _n(h.bgColor);
      s.color = [p[0], p[1], p[2], h.opacity], s.strokeColor = _n(h.strokeColor), s.strokeWidth = h.strokeWidth;
    }
  }
  /** 遍历所有边，根据 stateManager 当前状态刷新视觉样式 */
  syncAllLinkStyles() {
    var n, i;
    for (const s of this.renderer.links) {
      const u = ((i = (n = this.renderer.plugin).resolveLinkState) == null ? void 0 : i.call(
        n,
        s.id,
        this.model.stateManager
      )) ?? "regular", d = bc(
        this.styleManager.getLinkStyle(s.id),
        u
      ), h = _n(d.color ?? "#9ca3af");
      s.color = [h[0], h[1], h[2], d.opacity ?? 0.7], s.width = d.strokeWidth ?? 0.8;
    }
  }
  // ========== Data rebuilding ==========
  rebuildFromModel(n = !0) {
    const { graphData: i } = this.model.getGraphModelData();
    this.nodeMap.clear(), this.linkMap.clear();
    const s = [], u = [];
    for (let p = 0; p < i.nodes.length; p++) {
      const v = i.nodes[p];
      this.nodeMap.set(v.id, v);
      const g = this.defaultMapNode(v, p);
      g && (s.push(g), u.push({
        id: v.id,
        x: v.x ?? (Math.random() - 0.5) * 100,
        y: v.y ?? (Math.random() - 0.5) * 100,
        radius: g.radius,
        fx: v.fx ?? null,
        fy: v.fy ?? null,
        vx: v.vx ?? 0,
        vy: v.vy ?? 0
      }));
    }
    const d = [], h = [];
    for (let p = 0; p < i.links.length; p++) {
      const v = i.links[p];
      this.linkMap.set(v.id, v);
      const g = typeof v.source == "object" ? v.source.id : v.source, x = typeof v.target == "object" ? v.target.id : v.target, N = this.defaultMapLink(v, p);
      N && (d.push(N), h.push({
        id: v.id,
        source: g,
        target: x
      }));
    }
    this.renderer.updateData(s, d), this.layout.setData(u, h), this.layout.start(), n && requestAnimationFrame(() => {
      this.renderer.fitView();
    });
  }
  defaultMapNode(n, i) {
    var w, R, P, y, _, L, X;
    const s = (w = n.data) == null ? void 0 : w.nodeType, u = s ? (P = (R = this.rawTheme) == null ? void 0 : R.node) == null ? void 0 : P[s] : void 0, d = typeof u == "function" ? u(n, this.runtimeTheme) : u ?? this.styleManager.getNodeStyle(n.id);
    this.styleManager.setNodeStyle(n.id, d);
    const h = ((_ = (y = this.renderer.plugin).resolveNodeState) == null ? void 0 : _.call(
      y,
      n.id,
      this.model.stateManager
    )) ?? "regular", p = lo(d, h), v = _n(p.bgColor), g = v[0], x = v[1], N = v[2], S = _n(p.textColor);
    return {
      x: n.x ?? 0,
      y: n.y ?? 0,
      radius: p.radius,
      color: [g, x, N, p.opacity],
      strokeColor: _n(p.strokeColor),
      strokeWidth: p.strokeWidth,
      id: n.id,
      label: (L = n.data) == null ? void 0 : L.label,
      textColor: [S[0], S[1], S[2], 1],
      fontSize: p.fontSize,
      // 图标：node.data.icon（URL 或 emoji，见 IconAtlas）
      iconUrl: (X = n.data) == null ? void 0 : X.icon
    };
  }
  defaultMapLink(n, i) {
    var y, _, L, X, j;
    const s = typeof n.source == "object" ? n.source.id : n.source, u = typeof n.target == "object" ? n.target.id : n.target, d = this.nodeMap.get(String(s)), h = this.nodeMap.get(String(u)), p = (y = n.data) == null ? void 0 : y.linkType, v = p ? (L = (_ = this.rawTheme) == null ? void 0 : _.link) == null ? void 0 : L[p] : void 0, g = typeof v == "function" ? v(n, this.runtimeTheme) : v ?? this.styleManager.getLinkStyle(n.id);
    this.styleManager.setLinkStyle(n.id, g);
    const x = bc(g, "regular"), N = _n(x.color ?? "#9ca3af"), S = this.styleManager.getNodeStyle(s), w = this.styleManager.getNodeStyle(u), R = lo(S, "regular"), P = lo(w, "regular");
    return {
      sourceX: (d == null ? void 0 : d.x) ?? 0,
      sourceY: (d == null ? void 0 : d.y) ?? 0,
      targetX: (h == null ? void 0 : h.x) ?? 0,
      targetY: (h == null ? void 0 : h.y) ?? 0,
      color: [N[0], N[1], N[2], x.opacity ?? 0.7],
      width: x.strokeWidth ?? 0.8,
      sourceRadius: R.radius ?? 4,
      targetRadius: P.radius ?? 4,
      sourceId: String(s),
      targetId: String(u),
      id: n.id,
      label: ((X = n.data) == null ? void 0 : X.label) ?? ((j = n.data) == null ? void 0 : j.linkType),
      arrowSize: x.arrowSize
    };
  }
  // ========== Physics sync ==========
  onPhysicsTick(n) {
    const i = /* @__PURE__ */ new Map();
    for (const h of n) {
      i.set(h.id, { x: h.x ?? 0, y: h.y ?? 0 });
      const p = this.nodeMap.get(h.id);
      p && (p.x = h.x ?? 0, p.y = h.y ?? 0, p.vx = h.vx ?? 0, p.vy = h.vy ?? 0);
    }
    this.renderer.updateNodePositions(i);
    const s = this.renderer.nodes, u = this.renderer.links;
    for (const h of u)
      s.find((p) => p.id === h.id);
    const { graphData: d } = this.model.getGraphModelData();
    for (const h of u) {
      const p = d.links.find((S) => S.id === h.id);
      if (!p) continue;
      const v = typeof p.source == "object" ? p.source.id : p.source, g = typeof p.target == "object" ? p.target.id : p.target, x = d.nodes.find((S) => S.id === v), N = d.nodes.find((S) => S.id === g);
      x && (h.sourceX = x.x ?? 0, h.sourceY = x.y ?? 0), N && (h.targetX = N.x ?? 0, h.targetY = N.y ?? 0);
    }
  }
  // ========== Public API ==========
  /** Update graph data */
  updateView(n) {
    n.graphData && this.model.updateGraphData({ graphData: n.graphData });
  }
  /** Focus on a node */
  focusNodeById(n) {
    this.renderer.focusNode(n);
  }
  /** Fit all nodes in view */
  fitView(n) {
    this.renderer.fitView(n);
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
  updatePhysics(n) {
    this.layout instanceof Oc && this.layout.updateConfig(n);
  }
  /** Reheat the layout */
  reheat(n) {
    this.layout.reheat(n);
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
    const { graphData: n } = this.model.getGraphModelData(), i = new Map(this.renderer.nodes.map((u) => [u.id, u]));
    for (let u = 0; u < n.nodes.length; u++) {
      const d = n.nodes[u], h = this.defaultMapNode(d, u), p = i.get(d.id);
      h && p && (p.color = h.color, p.strokeColor = h.strokeColor, p.strokeWidth = h.strokeWidth, p.radius = h.radius, p.textColor = h.textColor, p.fontSize = h.fontSize);
    }
    const s = new Map(this.renderer.links.map((u) => [u.id, u]));
    for (let u = 0; u < n.links.length; u++) {
      const d = n.links[u], h = this.defaultMapLink(d, u), p = s.get(d.id);
      h && p && (p.color = h.color, p.width = h.width, p.arrowSize = h.arrowSize);
    }
    this.syncAllNodeStyles(), this.syncAllLinkStyles();
  }
  /**
   * 设置运行时主题值并重新应用节点/边样式（主题切换用）。
   * 样式回调函数会收到该值作为第 2 个参数。
   */
  setRuntimeTheme(n) {
    this.runtimeTheme = n, this.refreshTheme();
  }
  /**
   * 设置高亮节点并刷新视觉。
   * 供分析面板等外部调用，把已在画布上的节点标记为 highlighted。
   */
  setHighlightNodes(n, i = []) {
    n.length > 0 ? this.model.stateManager.setHighlightNodes(n, i) : this.model.stateManager.clearHighlightNodes(), this.syncAllNodeStyles(), this.syncAllLinkStyles();
  }
  /**
   * 设置/清除悬停节点并刷新视觉。
   * 供分析面板悬浮联动：对画布上对应节点实时应用 hover 效果。
   */
  setHoveredNodes(n) {
    n.length > 0 ? this.model.stateManager.setHoveredNodes(n) : this.model.stateManager.clearHoveredNodes(), this.syncAllNodeStyles();
  }
  /** Destroy and clean up */
  destroy() {
    this.layout.destroy(), this.renderer.destroy();
  }
}
function Lv(c) {
  return !!(/^(https?:|blob:)/i.test(c) || c.startsWith("data:image/") || c.startsWith("/"));
}
class Mv {
  constructor(n = 1024, i = 64) {
    k(this, "canvas");
    k(this, "ctx");
    k(this, "texture", null);
    k(this, "entries", /* @__PURE__ */ new Map());
    /** 已分配 slot 但尚未加载完成的 url → glyph 占位 */
    k(this, "pending", /* @__PURE__ */ new Map());
    k(this, "cursorX", 2);
    k(this, "cursorY", 2);
    k(this, "rowHeight", 0);
    k(this, "slotSize");
    k(this, "dirty", !1);
    this.canvas = document.createElement("canvas"), this.canvas.width = n, this.canvas.height = n, this.ctx = this.canvas.getContext("2d"), this.slotSize = i;
  }
  /** 获取图标的 UV。首次调用时异步加载，返回 null；加载完成后返回 glyph */
  getOrCreate(n) {
    if (!n || !Lv(n)) return null;
    const i = this.entries.get(n);
    if (i) return i;
    if (this.pending.has(n)) return null;
    const s = this.slotSize;
    if (this.cursorX + s > this.canvas.width && (this.cursorX = 2, this.cursorY += this.rowHeight + 2, this.rowHeight = 0), this.cursorY + s > this.canvas.height)
      return console.warn("[IconAtlas] overflow:", n), null;
    const u = this.cursorX, d = this.cursorY, h = this.canvas.width, p = this.canvas.height;
    this.cursorX += s + 1, this.rowHeight = Math.max(this.rowHeight, s);
    const v = {
      uv: [u / h, d / p, (u + s) / h, (d + s) / p],
      pw: s,
      ph: s
    };
    return this.loadImage(n, v, u, d, s), null;
  }
  loadImage(n, i, s, u, d) {
    this.pending.set(n, i);
    const h = new Image();
    h.crossOrigin = "anonymous", h.onload = () => {
      const p = Math.min(d / h.width, d / h.height), v = h.width * p, g = h.height * p;
      this.ctx.clearRect(s, u, d, d), this.ctx.drawImage(h, s + (d - v) / 2, u + (d - g) / 2, v, g), this.entries.set(n, i), this.pending.delete(n), this.dirty = !0;
    }, h.onerror = () => {
      this.entries.set(n, i), this.pending.delete(n), this.dirty = !0;
    }, h.src = n;
  }
  getTexture(n) {
    return this.texture || (this.texture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.texture), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE)), this.dirty && this.upload(n), this.texture;
  }
  upload(n) {
    n.bindTexture(n.TEXTURE_2D, this.texture), n.texImage2D(
      n.TEXTURE_2D,
      0,
      n.RGBA,
      n.RGBA,
      n.UNSIGNED_BYTE,
      this.canvas
    ), this.dirty = !1;
  }
  clear() {
    this.entries.clear(), this.pending.clear(), this.cursorX = 2, this.cursorY = 2, this.rowHeight = 0, this.dirty = !0;
  }
}
function yl(c) {
  return 0;
}
class Dv {
  constructor(n) {
    k(this, "gl");
    k(this, "program");
    k(this, "pickProgram");
    // Shared quad geometry (unit square centered at origin)
    k(this, "quadVao", null);
    // Uniform locations (render)
    k(this, "uResolution", null);
    k(this, "uTranslation", null);
    k(this, "uScale", null);
    k(this, "uZOffset", null);
    k(this, "uIconAtlas", null);
    // Uniform locations (pick)
    k(this, "uPickResolution", null);
    k(this, "uPickTranslation", null);
    k(this, "uPickScale", null);
    k(this, "uPickZOffset", null);
    this.gl = n, this.program = this.compileProgram(Pg, Ng), this.pickProgram = this.compileProgram(Ag, Rg), this.initQuadGeometry(), this.cacheUniforms();
  }
  compileProgram(n, i) {
    const s = this.gl, u = this.compileShader(s.VERTEX_SHADER, n), d = this.compileShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    if (s.attachShader(h, u), s.attachShader(h, d), s.linkProgram(h), !s.getProgramParameter(h, s.LINK_STATUS))
      throw new Error("Shader link failed: " + s.getProgramInfoLog(h));
    return h;
  }
  compileShader(n, i) {
    const s = this.gl, u = s.createShader(n);
    if (s.shaderSource(u, i), s.compileShader(u), !s.getShaderParameter(u, s.COMPILE_STATUS))
      throw new Error("Shader compile failed: " + s.getShaderInfoLog(u));
    return u;
  }
  cacheUniforms() {
    const n = this.gl;
    this.uResolution = n.getUniformLocation(this.program, "u_resolution"), this.uTranslation = n.getUniformLocation(this.program, "u_translation"), this.uScale = n.getUniformLocation(this.program, "u_scale"), this.uZOffset = n.getUniformLocation(this.program, "u_zOffset"), this.uIconAtlas = n.getUniformLocation(this.program, "u_iconAtlas"), this.uPickResolution = n.getUniformLocation(
      this.pickProgram,
      "u_resolution"
    ), this.uPickTranslation = n.getUniformLocation(
      this.pickProgram,
      "u_translation"
    ), this.uPickScale = n.getUniformLocation(this.pickProgram, "u_scale"), this.uPickZOffset = n.getUniformLocation(this.pickProgram, "u_zOffset");
  }
  initQuadGeometry() {
    const n = this.gl, i = new Float32Array([
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
    ]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const u = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, u), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  /** Render all nodes in one instanced draw call */
  render(n, i, s, u, d, h, p = 0, v) {
    if (n.length === 0) return;
    const g = this.gl, x = n.length;
    g.useProgram(this.program), g.uniform2f(this.uResolution, i, s), g.uniform2f(this.uTranslation, u, d), g.uniform1f(this.uScale, h), g.uniform1f(this.uZOffset, p), g.bindVertexArray(this.quadVao);
    const N = new Float32Array(x * 2), S = new Float32Array(x), w = new Float32Array(x * 4), R = new Float32Array(x * 4), P = new Float32Array(x), y = new Float32Array(x), _ = new Float32Array(x), L = new Float32Array(x), X = new Float32Array(x), j = new Float32Array(x), W = new Float32Array(x), Y = new Float32Array(x), M = new Float32Array(x * 4), U = /* @__PURE__ */ new Map();
    for (let O = 0; O < x; O++) {
      const Q = n[O];
      if (N[O * 2] = Q.x, N[O * 2 + 1] = Q.y, S[O] = Q.radius, w[O * 4] = Q.color[0], w[O * 4 + 1] = Q.color[1], w[O * 4 + 2] = Q.color[2], w[O * 4 + 3] = Q.color[3], R[O * 4] = Q.strokeColor[0], R[O * 4 + 1] = Q.strokeColor[1], R[O * 4 + 2] = Q.strokeColor[2], R[O * 4 + 3] = Q.strokeColor[3], P[O] = Q.strokeWidth, y[O] = yl(Q.shape), _[O] = Q.shapeParam ?? 0.25, L[O] = Q.showPlus ?? 0, X[O] = Q.plusOffsetX ?? 0.5, j[O] = Q.plusOffsetY ?? -0.5, W[O] = Q.plusScale ?? 0.35, v && Q.iconUrl) {
        let oe = U.get(Q.iconUrl);
        oe === void 0 && (oe = v.getOrCreate(Q.iconUrl), U.set(Q.iconUrl, oe)), oe && (Y[O] = 1, M[O * 4] = oe.uv[0], M[O * 4 + 1] = oe.uv[1], M[O * 4 + 2] = oe.uv[2], M[O * 4 + 3] = oe.uv[3]);
      }
    }
    this.setupInstanceBuffer(1, N, 2), this.setupInstanceBuffer(2, S, 1), this.setupInstanceBuffer(3, w, 4), this.setupInstanceBuffer(4, R, 4), this.setupInstanceBuffer(5, P, 1), this.setupInstanceBuffer(6, y, 1), this.setupInstanceBuffer(7, _, 1), this.setupInstanceBuffer(8, L, 1), this.setupInstanceBuffer(9, X, 1), this.setupInstanceBuffer(10, j, 1), this.setupInstanceBuffer(11, W, 1), this.setupInstanceBuffer(12, Y, 1), this.setupInstanceBuffer(13, M, 4), v && (g.activeTexture(g.TEXTURE1), g.bindTexture(g.TEXTURE_2D, v.getTexture(g)), g.uniform1i(this.uIconAtlas, 1)), g.drawArraysInstanced(g.TRIANGLES, 0, 6, x);
    for (let O = 1; O <= 13; O++)
      g.vertexAttribDivisor(O, 0);
    g.bindVertexArray(null);
  }
  /** Batch-render all nodes for FBO picking (single draw call, gl_InstanceID encodes index) */
  renderPicking(n, i, s, u, d, h, p = 0) {
    if (n.length === 0) return;
    const v = this.gl, g = n.length;
    v.useProgram(this.pickProgram), v.uniform2f(this.uPickResolution, i, s), v.uniform2f(this.uPickTranslation, u, d), v.uniform1f(this.uPickScale, h), v.uniform1f(this.uPickZOffset, p), v.bindVertexArray(this.quadVao);
    const x = new Float32Array(g * 2), N = new Float32Array(g), S = new Float32Array(g * 4), w = new Float32Array(g * 4), R = new Float32Array(g), P = new Float32Array(g), y = new Float32Array(g);
    for (let _ = 0; _ < g; _++) {
      const L = n[_];
      x[_ * 2] = L.x, x[_ * 2 + 1] = L.y, N[_] = L.radius, R[_] = L.strokeWidth, P[_] = yl(L.shape), y[_] = L.shapeParam ?? 0.25;
    }
    this.setupInstanceBuffer(1, x, 2), this.setupInstanceBuffer(2, N, 1), this.setupInstanceBuffer(3, S, 4), this.setupInstanceBuffer(4, w, 4), this.setupInstanceBuffer(5, R, 1), this.setupInstanceBuffer(6, P, 1), this.setupInstanceBuffer(7, y, 1), v.drawArraysInstanced(v.TRIANGLES, 0, 6, g);
    for (let _ = 1; _ <= 7; _++)
      v.vertexAttribDivisor(_, 0);
    v.bindVertexArray(null);
  }
  setupInstanceBuffer(n, i, s) {
    const u = this.gl, d = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, d), u.bufferData(u.ARRAY_BUFFER, i, u.DYNAMIC_DRAW), u.enableVertexAttribArray(n), u.vertexAttribPointer(n, s, u.FLOAT, !1, 0, 0), u.vertexAttribDivisor(n, 1);
  }
  destroy() {
    const n = this.gl;
    n.deleteProgram(this.program), n.deleteProgram(this.pickProgram);
  }
}
class Iv {
  constructor(n) {
    k(this, "gl");
    // ── Line program ──
    k(this, "lineProgram");
    k(this, "linePickProgram");
    // ── Arrow program ──
    k(this, "arrowProgram");
    k(this, "arrowPickProgram");
    // ── VAOs ──
    k(this, "lineVao", null);
    k(this, "arrowVao", null);
    k(this, "_lineVerts", 0);
    // triangle strip vertex count
    // Uniforms (line render)
    k(this, "uLineResolution", null);
    k(this, "uLineTranslation", null);
    k(this, "uLineScale", null);
    k(this, "uLineZOffset", null);
    // Uniforms (line pick)
    k(this, "uLinePickResolution", null);
    k(this, "uLinePickTranslation", null);
    k(this, "uLinePickScale", null);
    k(this, "uLinePickZOffset", null);
    k(this, "uLinePickIdOffset", null);
    // Uniforms (arrow render)
    k(this, "uArrowResolution", null);
    k(this, "uArrowTranslation", null);
    k(this, "uArrowScale", null);
    // Uniforms (arrow pick)
    k(this, "uArrowPickResolution", null);
    k(this, "uArrowPickTranslation", null);
    k(this, "uArrowPickScale", null);
    this.gl = n, this.lineProgram = this.compile(bg, Lg), this.linePickProgram = this.compile(Mg, Dg), this.arrowProgram = this.compile(Ig, Fg), this.arrowPickProgram = this.compile(zg, jg), this.initLineGeometry(), this.initArrowGeometry(), this.cacheUniforms();
  }
  compile(n, i) {
    const s = this.gl, u = this.makeShader(s.VERTEX_SHADER, n), d = this.makeShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    return s.attachShader(h, u), s.attachShader(h, d), s.linkProgram(h), h;
  }
  makeShader(n, i) {
    const s = this.gl, u = s.createShader(n);
    return s.shaderSource(u, i), s.compileShader(u), u;
  }
  cacheUniforms() {
    const n = this.gl;
    this.uLineResolution = n.getUniformLocation(
      this.lineProgram,
      "u_resolution"
    ), this.uLineTranslation = n.getUniformLocation(
      this.lineProgram,
      "u_translation"
    ), this.uLineScale = n.getUniformLocation(this.lineProgram, "u_scale"), this.uLineZOffset = n.getUniformLocation(this.lineProgram, "u_zOffset"), this.uLinePickResolution = n.getUniformLocation(
      this.linePickProgram,
      "u_resolution"
    ), this.uLinePickTranslation = n.getUniformLocation(
      this.linePickProgram,
      "u_translation"
    ), this.uLinePickScale = n.getUniformLocation(this.linePickProgram, "u_scale"), this.uLinePickZOffset = n.getUniformLocation(
      this.linePickProgram,
      "u_zOffset"
    ), this.uLinePickIdOffset = n.getUniformLocation(
      this.linePickProgram,
      "u_idOffset"
    ), this.uArrowResolution = n.getUniformLocation(
      this.arrowProgram,
      "u_resolution"
    ), this.uArrowTranslation = n.getUniformLocation(
      this.arrowProgram,
      "u_translation"
    ), this.uArrowScale = n.getUniformLocation(this.arrowProgram, "u_scale"), this.uArrowPickResolution = n.getUniformLocation(
      this.arrowPickProgram,
      "u_resolution"
    ), this.uArrowPickTranslation = n.getUniformLocation(
      this.arrowPickProgram,
      "u_translation"
    ), this.uArrowPickScale = n.getUniformLocation(
      this.arrowPickProgram,
      "u_scale"
    );
  }
  /** 三角带：t∈[0,1] 分割为 SEGMENTS 段, side=±1 交替 */
  initLineGeometry() {
    const n = this.gl, i = 16, s = new Float32Array((i + 1) * 4);
    for (let h = 0; h <= i; h++) {
      const p = h / i, v = h * 4;
      s[v] = p, s[v + 1] = -1, s[v + 2] = p, s[v + 3] = 1;
    }
    const u = n.createVertexArray();
    n.bindVertexArray(u);
    const d = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, d), n.bufferData(n.ARRAY_BUFFER, s, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.lineVao = u, this._lineVerts = (i + 1) * 2;
  }
  /** 箭头三角形：x∈[-1,0] 沿方向偏移, y=±0.5 垂直宽度 */
  initArrowGeometry() {
    const n = this.gl, i = new Float32Array([-0.6, -0.45, -0.6, 0.45, -0.01, 0]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const u = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, u), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.arrowVao = s;
  }
  /** Render link lines + arrows in two draw calls */
  render(n, i, s, u, d, h, p = !1, v = 0) {
    if (n.length === 0) return;
    const g = this.gl, x = n.length, N = 12, S = new Float32Array(x), w = new Float32Array(x), R = /* @__PURE__ */ new Map();
    for (let M = 0; M < x; M++) {
      const U = n[M], O = `${U.sourceId ?? ""}|${U.targetId ?? ""}`;
      R.has(O) || R.set(O, []), R.get(O).push({ idx: M, link: U });
    }
    for (const [, M] of R) {
      const U = M.length;
      if (!(U <= 1)) {
        M.sort((O, Q) => O.idx - Q.idx);
        for (let O = 0; O < U; O++) {
          const { idx: Q, link: oe } = M[O], ve = oe.targetX - oe.sourceX, le = oe.targetY - oe.sourceY, se = Math.sqrt(ve * ve + le * le), ie = se > 0.01 ? -le / se : 1, re = se > 0.01 ? ve / se : 0;
          if (U % 2 === 1 && O === Math.floor(U / 2)) continue;
          let B, I;
          if (U % 2 === 1) {
            const J = Math.floor(U / 2);
            O < J ? (B = J - O - 1, I = 1) : (B = O - J - 1, I = -1);
          } else
            B = Math.floor(O / 2), I = O % 2 === 0 ? 1 : -1;
          const H = (B + 1) * N;
          S[Q] = (oe.sourceX + oe.targetX) / 2 + ie * I * H, w[Q] = (oe.sourceY + oe.targetY) / 2 + re * I * H;
        }
      }
    }
    const P = new Float32Array(x * 2), y = new Float32Array(x * 2), _ = new Float32Array(x * 2), L = new Float32Array(x * 4), X = new Float32Array(x), j = new Float32Array(x * 2), W = new Float32Array(x * 2), Y = new Float32Array(x);
    for (let M = 0; M < x; M++) {
      const U = n[M], O = U.targetRadius ?? 0;
      P[M * 2] = U.sourceX, P[M * 2 + 1] = U.sourceY, _[M * 2] = U.targetX, _[M * 2 + 1] = U.targetY;
      const Q = S[M], oe = w[M];
      Q === 0 && oe === 0 ? (y[M * 2] = (U.sourceX + U.targetX) / 2, y[M * 2 + 1] = (U.sourceY + U.targetY) / 2) : (y[M * 2] = Q, y[M * 2 + 1] = oe);
      const ve = U.targetX - y[M * 2], le = U.targetY - y[M * 2 + 1], se = Math.sqrt(ve * ve + le * le), ie = se > 1e-3 ? ve / se : 1, re = se > 1e-3 ? le / se : 0;
      j[M * 2] = U.targetX - ie * O, j[M * 2 + 1] = U.targetY - re * O, L.set(U.color, M * 4), X[M] = U.width, W[M * 2] = ve, W[M * 2 + 1] = le, Y[M] = U.arrowSize ?? Math.max(6, U.width * 16 + 4);
    }
    g.useProgram(this.lineProgram), g.uniform2f(this.uLineResolution, i, s), g.uniform2f(this.uLineTranslation, u, d), g.uniform1f(this.uLineScale, h), g.uniform1f(this.uLineZOffset, v), g.bindVertexArray(this.lineVao);
    for (let M = 0; M < x; M++)
      this.instancedSingle(1, P[M * 2], P[M * 2 + 1]), this.instancedSingle(2, y[M * 2], y[M * 2 + 1]), this.instancedSingle(3, _[M * 2], _[M * 2 + 1]), this.instancedSingle4(4, L, M * 4), this.instancedSingle1(5, X[M]), g.drawArraysInstanced(g.TRIANGLE_STRIP, 0, this._lineVerts, 1);
    for (let M = 1; M <= 5; M++) g.vertexAttribDivisor(M, 0);
    if (p) {
      g.useProgram(this.arrowProgram), g.uniform2f(this.uArrowResolution, i, s), g.uniform2f(this.uArrowTranslation, u, d), g.uniform1f(this.uArrowScale, h), g.bindVertexArray(this.arrowVao), g.disable(g.BLEND);
      for (let M = 0; M < x; M++)
        this.instancedSingle(1, j[M * 2], j[M * 2 + 1]), this.instancedSingle(2, W[M * 2], W[M * 2 + 1]), this.instancedSingle4(3, L, M * 4), this.instancedSingle1(4, Y[M]), g.drawArraysInstanced(g.TRIANGLES, 0, 3, 1);
      for (let M = 1; M <= 4; M++) g.vertexAttribDivisor(M, 0);
      g.enable(g.BLEND);
    }
    g.bindVertexArray(null);
  }
  /** Batch-render links for FBO picking (lines only, triangle strip) */
  renderPicking(n, i, s, u, d, h, p = 0, v = 0) {
    if (n.length === 0) return;
    const g = this.gl, x = n.length, N = 12, S = new Float32Array(x), w = new Float32Array(x), R = /* @__PURE__ */ new Map();
    for (let j = 0; j < x; j++) {
      const W = n[j], Y = `${W.sourceId ?? ""}|${W.targetId ?? ""}`;
      R.has(Y) || R.set(Y, []), R.get(Y).push({ idx: j, link: W });
    }
    for (const [, j] of R) {
      const W = j.length;
      if (!(W <= 1)) {
        j.sort((Y, M) => Y.idx - M.idx);
        for (let Y = 0; Y < W; Y++) {
          const { idx: M, link: U } = j[Y], O = U.targetX - U.sourceX, Q = U.targetY - U.sourceY, oe = Math.sqrt(O * O + Q * Q), ve = oe > 0.01 ? -Q / oe : 1, le = oe > 0.01 ? O / oe : 0;
          if (W % 2 === 1 && Y === Math.floor(W / 2)) continue;
          let se, ie;
          if (W % 2 === 1) {
            const B = Math.floor(W / 2);
            Y < B ? (se = B - Y - 1, ie = 1) : (se = Y - B - 1, ie = -1);
          } else
            se = Math.floor(Y / 2), ie = Y % 2 === 0 ? 1 : -1;
          const re = (se + 1) * N;
          S[M] = (U.sourceX + U.targetX) / 2 + ve * ie * re, w[M] = (U.sourceY + U.targetY) / 2 + le * ie * re;
        }
      }
    }
    g.useProgram(this.linePickProgram), g.uniform2f(this.uLinePickResolution, i, s), g.uniform2f(this.uLinePickTranslation, u, d), g.uniform1f(this.uLinePickScale, h), g.uniform1f(this.uLinePickZOffset, v), g.uniform1ui(this.uLinePickIdOffset, p), g.bindVertexArray(this.lineVao);
    const P = new Float32Array(x * 2), y = new Float32Array(x * 2), _ = new Float32Array(x * 2), L = new Float32Array(x * 4), X = new Float32Array(x);
    for (let j = 0; j < x; j++) {
      const W = n[j], Y = W.sourceX, M = W.sourceY, U = W.targetX, O = W.targetY;
      P[j * 2] = Y, P[j * 2 + 1] = M, _[j * 2] = U, _[j * 2 + 1] = O;
      const Q = S[j], oe = w[j];
      Q === 0 && oe === 0 ? (y[j * 2] = (Y + U) / 2, y[j * 2 + 1] = (M + O) / 2) : (y[j * 2] = Q, y[j * 2 + 1] = oe), X[j] = W.width + 4;
    }
    this.instancedAttrib(1, P, 2), this.instancedAttrib(2, y, 2), this.instancedAttrib(3, _, 2), this.instancedAttrib(4, L, 4), this.instancedAttrib(5, X, 1), g.drawArraysInstanced(g.TRIANGLE_STRIP, 0, this._lineVerts, x);
    for (let j = 1; j <= 5; j++) g.vertexAttribDivisor(j, 0);
    g.bindVertexArray(null);
  }
  instancedAttrib(n, i, s) {
    const u = this.gl, d = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, d), u.bufferData(u.ARRAY_BUFFER, i, u.DYNAMIC_DRAW), u.enableVertexAttribArray(n), u.vertexAttribPointer(n, s, u.FLOAT, !1, 0, 0), u.vertexAttribDivisor(n, 1);
  }
  instancedSingle(n, i, s) {
    this.instancedSingle1Arr(n, new Float32Array([i, s]), 2);
  }
  instancedSingle1(n, i) {
    this.instancedSingle1Arr(n, new Float32Array([i]), 1);
  }
  instancedSingle4(n, i, s) {
    this.instancedSingle1Arr(n, i.slice(s, s + 4), 4);
  }
  instancedSingle1Arr(n, i, s) {
    const u = this.gl, d = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, d), u.bufferData(u.ARRAY_BUFFER, i, u.DYNAMIC_DRAW), u.enableVertexAttribArray(n), u.vertexAttribPointer(n, s, u.FLOAT, !1, 0, 0), u.vertexAttribDivisor(n, 1);
  }
  destroy() {
    const n = this.gl;
    n.deleteProgram(this.lineProgram), n.deleteProgram(this.linePickProgram), n.deleteProgram(this.arrowProgram), n.deleteProgram(this.arrowPickProgram);
  }
}
class Fv {
  constructor(n = 2048, i = 48, s = "sans-serif") {
    k(this, "canvas");
    k(this, "ctx");
    k(this, "texture", null);
    k(this, "entries", /* @__PURE__ */ new Map());
    k(this, "buf");
    k(this, "slotSize");
    k(this, "cursorX", 2);
    k(this, "cursorY", 2);
    k(this, "rowHeight", 0);
    k(this, "fontSize");
    k(this, "fontFamily");
    k(this, "dirty", !0);
    k(this, "charCanvas");
    k(this, "charCtx");
    this.canvas = document.createElement("canvas"), this.canvas.width = n, this.canvas.height = n, this.ctx = this.canvas.getContext("2d"), this.fontSize = i, this.fontFamily = s, this.buf = Math.max(2, Math.ceil(i / 8)), this.slotSize = i + 2 * this.buf, this.charCanvas = document.createElement("canvas"), this.charCanvas.width = this.slotSize, this.charCanvas.height = this.slotSize, this.charCtx = this.charCanvas.getContext("2d"), this.charCtx.textBaseline = "middle", this.charCtx.textAlign = "center", this.charCtx.font = `${i}px ${s}`;
  }
  getTexture(n) {
    return this.texture || (this.texture = n.createTexture(), n.bindTexture(n.TEXTURE_2D, this.texture), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE)), this.dirty && this.upload(n), this.texture;
  }
  getOrCreate(n) {
    if (!n) return null;
    const i = this.entries.get(n);
    if (i) return i;
    const s = this.slotSize;
    if (this.cursorX + s > this.canvas.width && (this.cursorX = 2, this.cursorY += this.rowHeight + 2, this.rowHeight = 0), this.cursorY + s > this.canvas.height)
      return console.warn("[TextureAtlas] overflow:", n), null;
    this.charCtx.clearRect(0, 0, s, s), this.charCtx.fillStyle = "#ffffff", this.charCtx.fillText(n, s / 2, s / 2), this.ctx.drawImage(this.charCanvas, this.cursorX, this.cursorY);
    const u = this.charCtx.measureText(n), d = this.canvas.width, h = this.canvas.height, p = {
      uv: [
        this.cursorX / d,
        this.cursorY / h,
        (this.cursorX + s) / d,
        (this.cursorY + s) / h
      ],
      pw: this.fontSize,
      ph: this.fontSize,
      advance: u.width
    };
    return this.entries.set(n, p), this.cursorX += s + 1, this.rowHeight = Math.max(this.rowHeight, s), this.dirty = !0, p;
  }
  upload(n) {
    n.bindTexture(n.TEXTURE_2D, this.texture), n.texImage2D(
      n.TEXTURE_2D,
      0,
      n.RGBA,
      n.RGBA,
      n.UNSIGNED_BYTE,
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
class zv {
  constructor(n, i = 2048, s = 48, u = 0) {
    k(this, "gl");
    k(this, "program");
    k(this, "atlas");
    k(this, "quadVao", null);
    k(this, "fontSize");
    /** 字符间距（世界像素），按图集字号计算 */
    k(this, "letterSpacing");
    k(this, "uResolution", null);
    k(this, "uTranslation", null);
    k(this, "uScale", null);
    k(this, "uZOffset", null);
    k(this, "uTexture", null);
    this.gl = n, this.fontSize = s, this.letterSpacing = Math.round(s * u), this.atlas = new Fv(i, s), this.program = this.compile(Og, Bg), this.initGeometry(), this.cacheUniforms();
  }
  compile(n, i) {
    const s = this.gl, u = this.makeShader(s.VERTEX_SHADER, n), d = this.makeShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    return s.attachShader(h, u), s.attachShader(h, d), s.linkProgram(h), h;
  }
  makeShader(n, i) {
    const s = this.gl, u = s.createShader(n);
    return s.shaderSource(u, i), s.compileShader(u), u;
  }
  cacheUniforms() {
    const n = this.gl;
    this.uResolution = n.getUniformLocation(this.program, "u_resolution"), this.uTranslation = n.getUniformLocation(this.program, "u_translation"), this.uScale = n.getUniformLocation(this.program, "u_scale"), this.uZOffset = n.getUniformLocation(this.program, "u_zOffset"), this.uTexture = n.getUniformLocation(this.program, "u_texture");
  }
  initGeometry() {
    const n = this.gl, i = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const u = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, u), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  /** 将节点标签展开为逐字符 quads */
  buildNodeLabels(n, i, s) {
    const u = [];
    if (i < s) return u;
    for (const d of n) {
      if (!d.label) continue;
      const h = d.textColor ?? [1, 1, 1, 1], p = (d.fontSize ?? this.fontSize) / this.fontSize, v = i;
      let g = d.x - this.measureWidth(d.label, p) / (2 * v);
      const x = d.radius * i, N = Math.min(Math.max(x * 0.22, 4), 24) + 8, S = d.y + d.radius + N / i;
      for (const w of d.label) {
        const R = this.atlas.getOrCreate(w);
        R && (u.push({
          x: g + R.advance * p / (2 * v),
          y: S,
          char: w,
          color: h,
          scale: p
        }), g += (R.advance + this.letterSpacing) * p / v);
      }
    }
    return u;
  }
  /** 估算标签世界宽度（乘以 fontSize 缩放 + 间距） */
  measureWidth(n, i) {
    let s = 0;
    for (const u of n) {
      const d = this.atlas.getOrCreate(u);
      d && (s += (d.advance + this.letterSpacing) * i);
    }
    return s;
  }
  buildLinkLabels(n, i, s) {
    const u = [];
    if (i < s) return u;
    for (const d of n) {
      if (!d.label) continue;
      const h = [0.55, 0.55, 0.65, 0.85], p = d.targetX - d.sourceX, v = d.targetY - d.sourceY;
      if (Math.sqrt(p * p + v * v) < 1) continue;
      const x = Math.atan2(v, p), N = 0.375, S = d.label, w = i, R = this.measureWidth(S, N), P = (d.sourceX + d.targetX) / 2, y = (d.sourceY + d.targetY) / 2, _ = R / (2 * w);
      let L = P - _ * Math.cos(x), X = y - _ * Math.sin(x);
      for (const j of S) {
        const W = this.atlas.getOrCreate(j);
        if (!W) continue;
        const Y = (W.advance + this.letterSpacing) * N / w;
        u.push({
          x: L + Y / 2 * Math.cos(x),
          y: X + Y / 2 * Math.sin(x),
          char: j,
          color: h,
          scale: N,
          angle: x
        }), L += Y * Math.cos(x), X += Y * Math.sin(x);
      }
    }
    return u;
  }
  /** instanced 逐字符渲染 */
  render(n, i, s, u, d, h, p = 0) {
    const v = n.length;
    if (v === 0) return;
    const g = this.gl, x = this.atlas.getTexture(g);
    g.useProgram(this.program), g.uniform2f(this.uResolution, i, s), g.uniform2f(this.uTranslation, u, d), g.uniform1f(this.uScale, h), g.uniform1f(this.uZOffset, p), g.uniform1i(this.uTexture, 0), g.activeTexture(g.TEXTURE0), g.bindTexture(g.TEXTURE_2D, x), g.bindVertexArray(this.quadVao);
    const N = new Float32Array(v * 2), S = new Float32Array(v * 2), w = new Float32Array(v * 4), R = new Float32Array(v * 2), P = new Float32Array(v * 2), y = new Float32Array(v);
    for (let _ = 0; _ < v; _++) {
      const L = n[_], X = this.atlas.getOrCreate(L.char);
      X && (N[_ * 2] = L.x, N[_ * 2 + 1] = L.y, S[_ * 2] = X.pw * L.scale / h, S[_ * 2 + 1] = X.ph * L.scale / h, w.set(L.color, _ * 4), R[_ * 2] = X.uv[0], R[_ * 2 + 1] = X.uv[1], P[_ * 2] = X.uv[2] - X.uv[0], P[_ * 2 + 1] = X.uv[3] - X.uv[1], y[_] = L.angle ?? 0);
    }
    this.instancedAttrib(1, N, 2), this.instancedAttrib(2, S, 2), this.instancedAttrib(3, w, 4), this.instancedAttrib(4, R, 2), this.instancedAttrib(5, P, 2), this.instancedAttrib(6, y, 1), g.drawArraysInstanced(g.TRIANGLES, 0, 6, v);
    for (let _ = 1; _ <= 6; _++) g.vertexAttribDivisor(_, 0);
    g.bindVertexArray(null);
  }
  instancedAttrib(n, i, s) {
    const u = this.gl, d = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, d), u.bufferData(u.ARRAY_BUFFER, i, u.DYNAMIC_DRAW), u.enableVertexAttribArray(n), u.vertexAttribPointer(n, s, u.FLOAT, !1, 0, 0), u.vertexAttribDivisor(n, 1);
  }
  /** 预注册所有字符到图集（逐字符拆分） */
  preRegister(n) {
    const i = /* @__PURE__ */ new Set();
    for (const s of n)
      for (const u of s) i.add(u);
    for (const s of i) this.atlas.getOrCreate(s);
  }
  destroy() {
    this.gl.deleteProgram(this.program);
  }
}
function jv(c, n, i) {
  return Math.round(c * 255) << 16 | Math.round(n * 255) << 8 | Math.round(i * 255);
}
class Ov {
  constructor(n) {
    k(this, "gl");
    k(this, "nodeRenderer");
    k(this, "linkRenderer");
    k(this, "pickFbo", null);
    k(this, "pickTexture", null);
    k(this, "pickDepth", null);
    k(this, "pickerWidth", 0);
    k(this, "pickerHeight", 0);
    k(this, "nodes", []);
    k(this, "links", []);
    /** 节点索引 → 节点 ID（解码用） */
    k(this, "nodeIds", []);
    /** 边的起始索引（nodeIds.length） */
    k(this, "linkOffset", 0);
    k(this, "linkIds", []);
    // 相机变换（需与主渲染同步）
    k(this, "tx", 0);
    k(this, "ty", 0);
    k(this, "k", 1);
    this.gl = n.gl, this.nodeRenderer = n.nodeRenderer, this.linkRenderer = n.linkRenderer, this.initFBO(n.width, n.height);
  }
  // ========== FBO 管理 ==========
  initFBO(n, i) {
    const s = this.gl, u = window.devicePixelRatio || 1;
    this.pickerWidth = n * u, this.pickerHeight = i * u, this.pickFbo = s.createFramebuffer(), this.pickTexture = s.createTexture(), s.bindTexture(s.TEXTURE_2D, this.pickTexture), s.texImage2D(
      s.TEXTURE_2D,
      0,
      s.RGBA,
      this.pickerWidth,
      this.pickerHeight,
      0,
      s.RGBA,
      s.UNSIGNED_BYTE,
      null
    ), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.NEAREST), this.pickDepth = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, this.pickDepth), s.renderbufferStorage(
      s.RENDERBUFFER,
      s.DEPTH_COMPONENT16,
      this.pickerWidth,
      this.pickerHeight
    );
  }
  resize(n, i) {
    const s = this.gl, u = window.devicePixelRatio || 1, d = n * u, h = i * u;
    d === this.pickerWidth && h === this.pickerHeight || (this.pickerWidth = d, this.pickerHeight = h, this.pickTexture && s.deleteTexture(this.pickTexture), this.pickTexture = s.createTexture(), s.bindTexture(s.TEXTURE_2D, this.pickTexture), s.texImage2D(
      s.TEXTURE_2D,
      0,
      s.RGBA,
      d,
      h,
      0,
      s.RGBA,
      s.UNSIGNED_BYTE,
      null
    ), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.NEAREST), this.pickDepth && s.deleteRenderbuffer(this.pickDepth), this.pickDepth = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, this.pickDepth), s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_COMPONENT16, d, h));
  }
  // ========== 数据同步 ==========
  syncData(n, i) {
    this.nodes = n, this.links = i, this.nodeIds = n.map((s) => s.id), this.linkIds = i.map((s) => s.id), this.linkOffset = n.length;
  }
  // ========== 拾取 ==========
  pick(n, i) {
    const s = this.gl, u = window.devicePixelRatio || 1, d = this.pickerWidth, h = this.pickerHeight;
    s.bindFramebuffer(s.FRAMEBUFFER, this.pickFbo), s.framebufferTexture2D(
      s.FRAMEBUFFER,
      s.COLOR_ATTACHMENT0,
      s.TEXTURE_2D,
      this.pickTexture,
      0
    ), s.framebufferRenderbuffer(
      s.FRAMEBUFFER,
      s.DEPTH_ATTACHMENT,
      s.RENDERBUFFER,
      this.pickDepth
    ), s.viewport(0, 0, d, h), s.clearColor(0, 0, 0, 0), s.clear(s.COLOR_BUFFER_BIT | s.DEPTH_BUFFER_BIT), s.enable(s.DEPTH_TEST), s.depthFunc(s.LEQUAL), this.linkRenderer && this.linkRenderer.renderPicking(
      this.links,
      d,
      h,
      this.tx,
      this.ty,
      this.k,
      this.linkOffset,
      0
      // zOffset = 0
    ), this.nodeRenderer.renderPicking(
      this.nodes,
      d,
      h,
      this.tx,
      this.ty,
      this.k,
      -0.5
    );
    const p = Math.round(n * u), v = Math.round(h - i * u), g = new Uint8Array(4);
    if (s.readPixels(p, v, 1, 1, s.RGBA, s.UNSIGNED_BYTE, g), s.bindFramebuffer(s.FRAMEBUFFER, null), g[3] === 0) return null;
    const x = jv(
      g[0] / 255,
      g[1] / 255,
      g[2] / 255
    );
    if (x >= 0 && x < this.linkOffset)
      return { type: "node", id: this.nodeIds[x] };
    const N = x - this.linkOffset;
    return N >= 0 && N < this.linkIds.length ? { type: "link", id: this.linkIds[N] } : null;
  }
  destroy() {
    const n = this.gl;
    n.deleteFramebuffer(this.pickFbo), n.deleteTexture(this.pickTexture), n.deleteRenderbuffer(this.pickDepth);
  }
}
function Bv(c, n, i, s, u) {
  return Math.sqrt(c * c + n * n) - i;
}
class Uv {
  constructor() {
    /** 相机变换（由 WebGLRenderer 每帧同步） */
    k(this, "tx", 0);
    k(this, "ty", 0);
    k(this, "k", 1);
    k(this, "nodes", []);
    k(this, "links", []);
  }
  /** 数据同步 */
  syncData(n, i) {
    this.nodes = n, this.links = i;
  }
  /** 调整尺寸（CPU 版无需操作，仅为满足接口一致） */
  resize(n, i) {
  }
  /** 销毁（CPU 版无需操作，仅为满足接口一致） */
  destroy() {
    this.nodes = [], this.links = [];
  }
  /** 命中检测 */
  pick(n, i) {
    if (this.nodes.length === 0 && this.links.length === 0) return null;
    const s = n / this.k - this.tx, u = i / this.k - this.ty;
    for (let d = this.nodes.length - 1; d >= 0; d--) {
      const h = this.nodes[d], p = s - h.x, v = u - h.y;
      if (yl(h.shape), h.shapeParam, Bv(p, v, h.radius + h.strokeWidth) <= 2)
        return { type: "node", id: h.id };
    }
    for (let d = this.links.length - 1; d >= 0; d--) {
      const h = this.links[d], p = h.sourceX, v = h.sourceY, g = h.targetX, x = h.targetY, N = g - p, S = x - v, w = N * N + S * S;
      if (w < 1e-4) continue;
      let R = ((s - p) * N + (u - v) * S) / w;
      R = Math.max(0, Math.min(1, R));
      const P = p + R * N, y = v + R * S;
      if (Math.sqrt((s - P) ** 2 + (u - y) ** 2) <= (h.width + 4) / this.k)
        return { type: "link", id: h.id };
    }
    return null;
  }
}
class Hv {
  constructor(n) {
    k(this, "name", "default");
    k(this, "gl");
    k(this, "nodeRenderer");
    k(this, "linkRenderer");
    k(this, "labelRenderer");
    k(this, "iconAtlas", new Mv());
    k(this, "picker");
    k(this, "plusBadgeLayer");
    // 缓存
    k(this, "nodes", []);
    k(this, "links", []);
    k(this, "labels", []);
    this.gl = n.gl, this.nodeRenderer = new Dv(n.gl), this.linkRenderer = new Iv(n.gl), this.labelRenderer = new zv(
      n.gl,
      2048,
      n.labelFontSize
    ), (n.pickerMode ?? "gpu") === "cpu" ? this.picker = new Uv() : this.picker = new Ov({
      gl: n.gl,
      nodeRenderer: this.nodeRenderer,
      linkRenderer: this.linkRenderer,
      width: n.width,
      height: n.height
    }), this.plusBadgeLayer = new Xg({
      canvas: n.canvas,
      gl: n.gl,
      onPlusClick: n.onPlusClick,
      borderWidth: n.plusBadgeBorderWidth,
      borderColor: n.plusBadgeBorderColor
    });
  }
  // ═══════════════════════════════════════════════
  // RenderPlugin
  // ═══════════════════════════════════════════════
  render(n) {
    this.linkRenderer.render(
      n.links,
      n.width,
      n.height,
      n.tx,
      n.ty,
      n.scale,
      n.showArrows,
      0
    ), this.nodeRenderer.render(
      n.nodes,
      n.width,
      n.height,
      n.tx,
      n.ty,
      n.scale,
      -0.5,
      this.iconAtlas
    ), this.labels = this.labelRenderer.buildNodeLabels(
      n.nodes,
      n.scale,
      n.labelMinScale
    ), this.labelRenderer.render(
      this.labels,
      n.width,
      n.height,
      n.tx,
      n.ty,
      n.scale,
      -1
    );
    const i = this.labelRenderer.buildLinkLabels(
      n.links,
      n.scale,
      n.labelMinScale
    );
    this.labelRenderer.render(
      i,
      n.width,
      n.height,
      n.tx,
      n.ty,
      n.scale,
      -0.8
    );
  }
  getOverlays() {
    return [this.plusBadgeLayer];
  }
  afterPositionUpdate(n) {
    this.updateBadges(n);
  }
  resolveNodeState(n, i) {
    return i.getHiddenNodes().includes(n) ? "hidden" : i.isHoveredNode(n) ? "hovered" : i.getSelectedNodes().includes(n) ? "selected" : i.getRootNodes().includes(n) ? "root" : i.getHighlightNodes().includes(n) ? "highlighted" : "regular";
  }
  resolveLinkState(n, i) {
    return i.getHiddenLinks().includes(n) ? "hidden" : i.isHoveredLink(n) ? "hovered" : i.getSelectedLinks().includes(n) ? "selected" : "regular";
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
  set tx(n) {
    this.picker.tx = n;
  }
  get ty() {
    return this.picker.ty;
  }
  set ty(n) {
    this.picker.ty = n;
  }
  get k() {
    return this.picker.k;
  }
  set k(n) {
    this.picker.k = n;
  }
  syncData(n, i) {
    this.nodes = n, this.links = i, this.picker.syncData(n, i), this.updateBadges(n);
    const s = n.map((u) => u.label).filter(Boolean);
    s.push(...i.map((u) => u.label).filter(Boolean)), this.labelRenderer.preRegister(s);
  }
  pick(n, i) {
    return this.picker.pick(n, i);
  }
  resize(n, i) {
    this.picker.resize(n, i);
  }
  destroy() {
    this.nodeRenderer.destroy(), this.linkRenderer.destroy(), this.labelRenderer.destroy(), this.picker.destroy(), this.plusBadgeLayer.destroy();
  }
  // ═══════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════
  updateBadges(n) {
    const i = [];
    for (const s of n) {
      if (!s.showPlus) continue;
      const u = s.radius * (s.plusOffsetX ?? 0.5), d = s.radius * (s.plusOffsetY ?? -0.5);
      i.push({
        x: s.x + u,
        y: s.y + d,
        radius: s.radius * (s.plusScale ?? 0.35),
        nodeId: s.id
      });
    }
    this.plusBadgeLayer.updateBadges(i);
  }
}
function Vv(c, n, i = "#2c2c2c") {
  return {
    regular: {
      bgColor: c,
      strokeColor: n,
      textColor: i,
      radius: 8,
      strokeWidth: 1,
      opacity: 1,
      fontSize: 16
    },
    hovered: {
      bgColor: c,
      strokeColor: "#00ccff",
      textColor: i,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    highlighted: {
      bgColor: c,
      strokeColor: "#fde047",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    selected: {
      bgColor: c,
      strokeColor: "#0066ff",
      textColor: i,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    },
    hidden: {
      bgColor: "#fff",
      strokeColor: n,
      textColor: i,
      radius: 8,
      strokeWidth: 1.5,
      opacity: 0.15,
      fontSize: 16
    },
    root: {
      bgColor: "#fff",
      strokeColor: "#e67e00",
      textColor: i,
      radius: 6,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16
    }
  };
}
function an(c, n, i) {
  var p;
  const s = er(i), u = s.node[c] ?? s.node.default, d = Vv(u.bg, u.stroke, s.text), h = ((p = n.data) == null ? void 0 : p.weight) ?? 1;
  return {
    ...d,
    regular: { ...d.regular, radius: h * 8 },
    selected: { ...d.selected, radius: h * 8 },
    hovered: { ...d.hovered, radius: h * 8 }
  };
}
function Wv(c, n) {
  return an("default", c, n);
}
function Xv(c, n) {
  return an("person", c, n);
}
function Yv(c, n) {
  return an("phone", c, n);
}
function $v(c, n) {
  return an("address", c, n);
}
function Gv(c, n) {
  return an("account", c, n);
}
function Qv(c, n) {
  return an("company", c, n);
}
function Kv(c, n) {
  return an("ip", c, n);
}
function Zv(c, n) {
  return an("device", c, n);
}
function qv(c) {
  const n = er(c).link;
  return {
    regular: { color: n.default, strokeWidth: 0.1, opacity: 0.8, arrowSize: 8 },
    hovered: { color: n.hovered, strokeWidth: 1.5, opacity: 1 },
    highlighted: { color: n.highlighted, strokeWidth: 1.5, opacity: 1 },
    selected: { color: n.selected, strokeWidth: 1.5, opacity: 1 },
    hidden: { color: n.hidden, strokeWidth: 0.8, opacity: 0.1 }
  };
}
class Jv {
  constructor(n) {
    k(this, "model");
    k(this, "metadataManager");
    k(this, "loadingManager");
    k(this, "historyManager");
    k(this, "fetcher");
    /** 可选：获取快照额外上下文（相机、状态等） */
    k(this, "getContext");
    this.model = n.model, this.metadataManager = n.metadataManager, this.loadingManager = n.loadingManager, this.historyManager = n.historyManager, this.fetcher = n.fetcher, this.getContext = n.getContext;
  }
  async expand(n, i) {
    var s;
    this.loadingManager.model.startLoading(n, { message: "拓出中..." });
    try {
      const u = this.model.getGraphModelData().graphData, d = await this.fetcher({
        sourceNodeId: n,
        ruleId: "__custom__",
        existingNodeIds: u.nodes.map((v) => v.id),
        existingLinkIds: u.links.map((v) => v.id),
        conditions: i
      });
      this.mergeExpansionData(d);
      const h = this.model.getGraphModelData().graphData, p = ((s = this.getContext) == null ? void 0 : s.call(this)) ?? {};
      this.historyManager.pushState({
        type: "expand",
        description: `拓出节点 ${n}`,
        state: {
          graphData: h,
          customData: {
            camera: p.camera,
            state: p.state
          }
        }
      });
    } catch (u) {
      throw console.error(`[Expand] Failed for node ${n}:`, u), u;
    } finally {
      this.loadingManager.model.stopLoading(n);
    }
  }
  mergeExpansionData(n) {
    const i = this.model.getGraphModelData().graphData, s = new Set(i.nodes.map((p) => p.id)), u = new Set(i.links.map((p) => p.id)), d = [];
    for (const p of n.nodes)
      s.has(p.id) || (d.push({
        id: p.id,
        data: { ...p.data ?? {} }
      }), s.add(p.id));
    const h = [];
    for (const p of n.links)
      u.has(p.id) || (h.push({
        id: p.id,
        source: p.source,
        target: p.target,
        data: { ...p.data ?? {} }
      }), u.add(p.id));
    !d.length && !h.length || this.model.updateGraphData({
      graphData: {
        nodes: [...i.nodes, ...d],
        links: [...i.links, ...h]
      }
    });
  }
}
const Bc = {
  person: "/icons/person.svg",
  phone: "/icons/phone.svg",
  address: "/icons/address.svg",
  account: "/icons/account.svg",
  company: "/icons/company.svg",
  ip: "/icons/ip.svg",
  device: "/icons/device.svg"
};
function wl(c) {
  var s;
  const n = (c == null ? void 0 : c.graphData) ?? c, i = n == null ? void 0 : n.nodes;
  if (!Array.isArray(i)) return c;
  for (const u of i) {
    const d = (s = u == null ? void 0 : u.data) == null ? void 0 : s.icon;
    typeof d == "string" && Bc[d] && (u.data.icon = Bc[d]);
  }
  return c;
}
async function ey(c) {
  const n = await Qr.init(c);
  return wl(n.graphData), n;
}
const ty = async (c) => {
  const n = await Qr.expand(c);
  return wl(n);
};
function ny(c) {
  const { theme: n } = ho(), i = z.useRef(null), [s, u] = z.useState({ x: 0, y: 0 }), d = z.useRef(
    new ig({ initData: { graphData: { nodes: [], links: [] } } })
  ), h = z.useRef(null), p = z.useRef(new sg()), v = z.useRef(null), [g, x] = z.useState(!0), [N, S] = z.useState(null), [w, R] = z.useState(!1), [P, y] = z.useState(!1), [_, L] = z.useState(!1), [X, j] = z.useState(!1), [W, Y] = z.useState(null);
  z.useEffect(() => {
    if (!i.current) return;
    const se = d.current, ie = new bv({
      container: i.current,
      graphModel: se,
      arrowDisplay: !0,
      // 主题从外部传入（useTheme），注册 view 时手动配置
      runtimeTheme: n,
      backgroundColor: er(n).canvas,
      forceConfig: {
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4
      },
      theme: {
        node: {
          default: (re, B) => Wv(re, B),
          person: (re, B) => Xv(re, B),
          phone: (re, B) => Yv(re, B),
          address: (re, B) => $v(re, B),
          account: (re, B) => Gv(re, B),
          company: (re, B) => Qv(re, B),
          ip: (re, B) => Kv(re, B),
          device: (re, B) => Zv(re, B)
        },
        link: { default: (re, B) => qv(B) }
      },
      renderPlugin: (re, B) => new Hv({
        gl: re,
        canvas: B,
        width: i.current.clientWidth,
        height: i.current.clientHeight,
        pickerMode: "gpu",
        onPlusClick: (I) => {
          const H = se.getNodeById(I);
          H && se.events.publish("plusToolClick", H);
        }
      })
    });
    return h.current = ie, v.current = new Jv({
      model: se,
      metadataManager: new og(),
      loadingManager: se.loadingManager,
      historyManager: p.current,
      fetcher: ty,
      getContext: () => {
        var B, I;
        const re = (I = (B = ie.renderer) == null ? void 0 : B.interaction) == null ? void 0 : I.transform;
        return {
          camera: re ? { x: re.x, y: re.y, k: re.k } : void 0,
          state: se.stateManager.getState()
        };
      }
    }), x(!1), () => {
      ie.destroy(), h.current = null;
    };
  }, []), z.useEffect(() => {
    var ie, re;
    const se = h.current;
    se && (se.setRuntimeTheme(n), (re = (ie = se.renderer).setBackgroundColor) == null || re.call(ie, er(n).canvas));
  }, [n]), z.useEffect(() => {
    const se = d.current;
    (async () => {
      var ie;
      try {
        const re = await ey(c ?? []);
        se.updateGraphData({ graphData: re.graphData }), (ie = h.current) == null || ie.reheat(1), requestAnimationFrame(() => {
          var B;
          return (B = h.current) == null ? void 0 : B.fitView(50);
        }), p.current.pushState({
          type: "init",
          description: "初始图谱",
          state: {
            graphData: structuredClone(re.graphData),
            customData: { state: se.stateManager.getState() }
          }
        });
      } catch (re) {
        S(re instanceof Error ? re.message : String(re));
      }
    })();
  }, [c]);
  const M = z.useCallback(() => {
    var H, J;
    const se = d.current, ie = h.current, re = p.current, B = structuredClone(se.getGraphModelData().graphData);
    let I;
    if (ie) {
      const E = (J = (H = ie.renderer) == null ? void 0 : H.interaction) == null ? void 0 : J.transform;
      E && (I = { x: E.x, y: E.y, k: E.k });
    }
    re.pushState({
      type: "snapshot",
      description: `快照 ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
      state: {
        graphData: B,
        customData: { camera: I, state: se.stateManager.getState() }
      }
    });
  }, []), U = z.useCallback((se) => {
    var J, E, V, pe, ue, xe;
    const ie = d.current, re = h.current, B = p.current, I = B.getAction(se);
    if (!I) return;
    ie.updateGraphData({
      graphData: structuredClone(I.state.graphData)
    });
    const H = I.state.customData;
    if (H != null && H.state) {
      const $ = H.state;
      (J = $.highlightNodes) != null && J.length ? ie.stateManager.setHighlightNodes($.highlightNodes, $.highlightLinks) : ie.stateManager.clearHighlightNodes(), (E = $.selectedNodes) != null && E.length ? ie.stateManager.setSelectedNodes($.selectedNodes, $.selectedLinks) : ie.stateManager.clearSelection(), (V = $.hiddenNodes) != null && V.length ? ie.stateManager.setHiddenNodes($.hiddenNodes, $.hiddenLinks) : ie.stateManager.showAll(), (pe = $.rootNodes) != null && pe.length ? ie.stateManager.setRootNodes($.rootNodes) : ie.stateManager.clearRootNodes();
    }
    if (H != null && H.camera && re) {
      const $ = (xe = (ue = re.renderer) == null ? void 0 : ue.interaction) == null ? void 0 : xe.transform;
      $ && ($.x = H.camera.x, $.y = H.camera.y, $.k = H.camera.k);
    }
    B.jumpTo(se), re == null || re.reheat(0.3);
  }, []), O = z.useCallback((se) => {
    p.current.deleteEntry(se);
  }, []), Q = z.useCallback(() => {
    R((se) => !se);
  }, []), oe = z.useCallback(
    (se) => {
      var I, H, J, E, V, pe;
      const ie = d.current, re = h.current;
      if (!se) return;
      ie.updateGraphData({
        graphData: structuredClone(se.graphData)
      });
      const B = se.customData;
      if (B != null && B.state) {
        const ue = B.state;
        (I = ue.highlightNodes) != null && I.length ? ie.stateManager.setHighlightNodes(
          ue.highlightNodes,
          ue.highlightLinks
        ) : ie.stateManager.clearHighlightNodes(), (H = ue.selectedNodes) != null && H.length ? ie.stateManager.setSelectedNodes(ue.selectedNodes, ue.selectedLinks) : ie.stateManager.clearSelection(), (J = ue.hiddenNodes) != null && J.length ? ie.stateManager.setHiddenNodes(ue.hiddenNodes, ue.hiddenLinks) : ie.stateManager.showAll(), (E = ue.rootNodes) != null && E.length ? ie.stateManager.setRootNodes(ue.rootNodes) : ie.stateManager.clearRootNodes();
      }
      if (B != null && B.camera && re) {
        const ue = (pe = (V = re.renderer) == null ? void 0 : V.interaction) == null ? void 0 : pe.transform;
        ue && (ue.x = B.camera.x, ue.y = B.camera.y, ue.k = B.camera.k);
      }
      re == null || re.reheat(0.3);
    },
    []
  ), ve = z.useCallback(() => {
    const ie = p.current.goBackSkipType("snapshot");
    oe(ie);
  }, [oe]), le = z.useCallback(() => {
    const ie = p.current.goForwardSkipType("snapshot");
    oe(ie);
  }, [oe]);
  return {
    containerRef: i,
    modelRef: d,
    viewRef: h,
    historyManagerRef: p,
    expansionRef: v,
    ctx: {
      mousePos: s,
      setMousePos: u,
      loading: g,
      initError: N,
      snapshotPanelOpen: w,
      setSnapshotPanelOpen: R,
      legendPanelOpen: P,
      setLegendPanelOpen: y,
      miniMapOpen: _,
      setMiniMapOpen: L,
      analysisPanelOpen: X,
      setAnalysisPanelOpen: j,
      analysisTarget: W,
      setAnalysisTarget: Y,
      handleTakeSnapshot: M,
      handleJumpToSnapshot: U,
      handleDeleteSnapshot: O,
      handleToggleSnapshotPanel: Q,
      handleUndo: ve,
      handleRedo: le
    }
  };
}
function ry({
  viewRef: c,
  modelRef: n
}) {
  const [i, s] = z.useState("rect"), [u, d] = z.useState(null), [h, p] = z.useState(null), [v, g] = z.useState(null), [x, N] = z.useState(!1), S = z.useRef(null), w = z.useCallback(
    (B, I) => {
      var V;
      const H = c.current;
      if (!H) return { x: B, y: I };
      const J = (V = H.renderer) == null ? void 0 : V.canvas;
      if (!J) return { x: B, y: I };
      const E = J.getBoundingClientRect();
      return { x: B - E.left, y: I - E.top };
    },
    [c]
  ), R = z.useCallback(() => {
    var I, H;
    const B = c.current;
    return B ? ((H = (I = B.renderer) == null ? void 0 : I.interaction) == null ? void 0 : H.transform) ?? null : null;
  }, [c]), P = z.useCallback(
    (B) => {
      const I = n.current, H = R();
      if (!I || !H) return [];
      const { nodes: J } = I.getGraphModelData().graphData, E = B.x1 / H.k - H.x, V = B.y1 / H.k - H.y, pe = B.x2 / H.k - H.x, ue = B.y2 / H.k - H.y, xe = Math.min(E, pe), $ = Math.max(E, pe), Z = Math.min(V, ue), te = Math.max(V, ue);
      return J.filter((G) => {
        const ge = G.x ?? 0, Ce = G.y ?? 0;
        return ge >= xe && ge <= $ && Ce >= Z && Ce <= te;
      }).map((G) => G.id);
    },
    [n, R]
  ), y = z.useCallback(
    (B) => {
      if (B.length < 3) return [];
      const I = n.current, H = R();
      if (!I || !H) return [];
      const { nodes: J } = I.getGraphModelData().graphData, E = B.map(
        (V) => [V.x / H.k - H.x, V.y / H.k - H.y]
      );
      return J.filter((V) => {
        const pe = V.x ?? 0, ue = V.y ?? 0;
        return iy(pe, ue, E);
      }).map((V) => V.id);
    },
    [n, R]
  ), _ = z.useRef(i);
  _.current = i;
  const L = z.useRef(h);
  L.current = h;
  const X = z.useRef(v);
  X.current = v, z.useEffect(() => {
    const B = (H) => {
      H.key === "Shift" && (N(!0), d(_.current)), H.key === "Escape" && X.current && g(null);
    }, I = (H) => {
      H.key === "Shift" && (N(!1), !L.current && (!X.current || X.current.vertices.length === 0) && d(null));
    };
    return window.addEventListener("keydown", B), window.addEventListener("keyup", I), () => {
      window.removeEventListener("keydown", B), window.removeEventListener("keyup", I);
    };
  }, []);
  const j = z.useCallback(
    (B, I) => {
      if (!v || v.vertices.length < 2) return !1;
      const H = v.vertices[0], J = B - H.x, E = I - H.y;
      return Math.sqrt(J * J + E * E) < 10;
    },
    [v]
  ), W = z.useCallback(
    (B) => {
      const I = P(B), H = n.current;
      return H && (I.length > 0 ? H.stateManager.setSelectedNodes(I) : H.stateManager.clearSelection()), I;
    },
    [P, n]
  ), Y = z.useCallback(
    (B) => {
      const I = y(B), H = n.current;
      return H && (I.length > 0 ? H.stateManager.setSelectedNodes(I) : H.stateManager.clearSelection()), I;
    },
    [y, n]
  ), M = z.useCallback((B, I) => {
    S.current = { x: B, y: I }, p({ x1: B, y1: I, x2: B, y2: I });
  }, []), U = z.useCallback((B, I) => {
    S.current && p({
      x1: S.current.x,
      y1: S.current.y,
      x2: B,
      y2: I
    });
  }, []), O = z.useCallback(() => {
    h && W(h), p(null), S.current = null;
  }, [h, W]), Q = z.useCallback((B, I) => {
    g((H) => ({ vertices: H != null && H.vertices ? [...H.vertices, { x: B, y: I }] : [{ x: B, y: I }], cursorPos: { x: B, y: I } }));
  }, []), oe = z.useCallback((B, I) => {
    g(
      (H) => H ? { ...H, cursorPos: { x: B, y: I } } : null
    );
  }, []), ve = z.useCallback(() => {
    v && v.vertices.length >= 3 && Y(v.vertices), g(null);
  }, [v, Y]), le = z.useCallback(() => {
    p(null), g(null), S.current = null;
  }, []), se = z.useCallback(() => {
    le(), s("rect"), d(null);
  }, [le]), ie = z.useCallback(() => {
    le(), s("polygon"), d(null);
  }, [le]), re = z.useCallback(() => {
    le(), s(null), d(null);
  }, [le]);
  return {
    /** 工具栏选中的模式（持久） */
    selectedSelectionMode: i,
    /** 当前激活的框选模式（Shift 按下时非 null） */
    selectionMode: u,
    /** 矩形状态（供 overlay 渲染） */
    rect: h,
    /** 多边形状态（供 overlay 渲染） */
    polygon: v,
    /** Shift 是否按下 */
    isShiftDown: x,
    /** 判断是否靠近首顶点 */
    isNearFirstVertex: j,
    /** 坐标工具 */
    getCanvasPos: w,
    getTransform: R,
    /** 矩形操作 */
    startRect: M,
    updateRect: U,
    finishRect: O,
    /** 多边形操作 */
    addPolygonVertex: Q,
    updatePolygonCursor: oe,
    finishPolygon: ve,
    /** 通用 */
    cancelSelection: le,
    /** 工具栏方法 */
    activateRectMode: se,
    activatePolygonMode: ie,
    deactivateSelectionMode: re
  };
}
function iy(c, n, i) {
  let s = !1;
  for (let u = 0, d = i.length - 1; u < i.length; d = u++) {
    const [h, p] = i[u], [v, g] = i[d];
    p > n != g > n && c < (v - h) * (n - p) / (g - p) + h && (s = !s);
  }
  return s;
}
function Uc(c, n) {
  var s, u;
  const i = {};
  for (const d of c.links) {
    const h = typeof d.source == "object" ? d.source.id : d.source, p = typeof d.target == "object" ? d.target.id : d.target;
    if (String(h) === n) {
      const v = c.nodes.find((g) => g.id === p);
      if (v) {
        const g = ((s = v.data) == null ? void 0 : s.nodeType) ?? "unknown";
        i[g] || (i[g] = { out: 0, in: 0 }), i[g].out += 1;
      }
    }
    if (String(p) === n) {
      const v = c.nodes.find((g) => g.id === h);
      if (v) {
        const g = ((u = v.data) == null ? void 0 : u.nodeType) ?? "unknown";
        i[g] || (i[g] = { out: 0, in: 0 }), i[g].in += 1;
      }
    }
  }
  return i;
}
const oy = (() => {
  const n = new URLSearchParams(window.location.search).get("ids");
  return n ? n.split(",").filter(Boolean) : void 0;
})();
function sy() {
  const c = ny(oy), {
    containerRef: n,
    modelRef: i,
    viewRef: s,
    historyManagerRef: u,
    expansionRef: d,
    ctx: {
      setMousePos: h,
      loading: p,
      initError: v,
      snapshotPanelOpen: g,
      setSnapshotPanelOpen: x,
      legendPanelOpen: N,
      setLegendPanelOpen: S,
      miniMapOpen: w,
      setMiniMapOpen: R,
      analysisPanelOpen: P,
      setAnalysisPanelOpen: y,
      setAnalysisTarget: _,
      handleTakeSnapshot: L,
      handleJumpToSnapshot: X,
      handleDeleteSnapshot: j,
      handleToggleSnapshotPanel: W,
      handleUndo: Y,
      handleRedo: M
    }
  } = c, U = $p(i, {
    onPlusToolClick: (Z) => {
      L(), re({
        node: Z,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    },
    onNodeContextMenu: (Z, te, G) => {
      re({ node: Z, x: te, y: G });
    }
  }), {
    ctx: {
      hoveredNode: O,
      setHoveredNode: Q,
      hoveredLink: oe,
      setHoveredLink: ve,
      selectedNodeIds: le
    }
  } = U, se = Gp(n, d), { ruleMenu: ie, setRuleMenu: re, expanding: B, runtimeError: I } = se.ctx, { handleRuleExpand: H } = se, J = ry({ viewRef: s, modelRef: i }), E = z.useCallback(async (Z) => {
    const te = i.current, G = s.current;
    if (!te || !G) return;
    const ge = await Qr.init([Z]), Ce = wl(ge).graphData, Re = te.getGraphModelData().graphData, Se = new Set(Re.nodes.map((Ye) => Ye.id)), Be = new Set(Re.links.map((Ye) => Ye.id)), Et = Ce.nodes.filter((Ye) => !Se.has(Ye.id));
    if (Et.length === 0) return;
    const un = G.renderer.interaction.transform, En = G.renderer.canvas, Kr = En.clientWidth / 2 / un.k - un.x, rr = En.clientHeight / 2 / un.k - un.y;
    for (const Ye of Et)
      Ye.x = Kr + (Math.random() - 0.5) * 20, Ye.y = rr + (Math.random() - 0.5) * 20;
    te.updateGraphData({
      graphData: {
        nodes: [...Re.nodes, ...Et],
        links: [
          ...Re.links,
          ...Ce.links.filter((Ye) => !Be.has(Ye.id))
        ]
      }
    }), G.reheat(1), u.current.pushState({
      type: "search-add",
      description: `新增节点 ${Z}`,
      state: {
        graphData: structuredClone(te.getGraphModelData().graphData),
        customData: { state: te.stateManager.getState() }
      }
    });
  }, []), V = z.useCallback(() => {
    if (P) return y(!1);
    const Z = [...le];
    Z.length !== 0 && (_({
      ids: Z,
      labels: Z.map((te) => {
        var ge, Ce;
        const G = (ge = i.current) == null ? void 0 : ge.getGraphModelData().graphData.nodes.find((Re) => Re.id === te);
        return ((Ce = G == null ? void 0 : G.data) == null ? void 0 : Ce.label) ?? te;
      })
    }), y(!0));
  }, [le, P, y]), pe = z.useCallback(() => {
    S((Z) => !Z);
  }, []), ue = z.useCallback(() => {
    R((Z) => !Z);
  }, []), xe = z.useCallback(() => {
    var Z;
    (Z = s.current) == null || Z.fitView(50);
  }, []), $ = {
    ...c.ctx,
    ...U.ctx,
    ...se.ctx,
    ...J
  };
  return /* @__PURE__ */ C.jsx(ap, { value: $, children: /* @__PURE__ */ C.jsx(uf, { children: /* @__PURE__ */ C.jsxs(
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
        /* @__PURE__ */ C.jsx(
          Wp,
          {
            historyManagerRef: u,
            onFitView: xe,
            onToggleSnapshotPanel: W,
            onToggleLegend: pe,
            onToggleMiniMap: ue,
            onUndo: Y,
            onRedo: M,
            onSearchSelect: E,
            onAnalyze: V
          }
        ),
        p && /* @__PURE__ */ C.jsx(
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
            children: /* @__PURE__ */ C.jsxs("div", { style: { textAlign: "center" }, children: [
              /* @__PURE__ */ C.jsx("div", { style: { fontSize: "32px", marginBottom: "12px" }, children: "⟳" }),
              /* @__PURE__ */ C.jsx("div", { children: "Loading graph data..." }),
              /* @__PURE__ */ C.jsx(
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
              /* @__PURE__ */ C.jsx(
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
              v && /* @__PURE__ */ C.jsxs(
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
                    v
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            ref: n,
            style: {
              flex: 1,
              position: "relative",
              overflow: "hidden"
            },
            onMouseMove: (Z) => {
              h({ x: Z.clientX, y: Z.clientY });
            },
            onMouseLeave: () => {
              Q(null), ve(null);
            },
            children: [
              O && /* @__PURE__ */ C.jsx(
                up,
                {
                  loadedNeighbors: Uc(
                    i.current.getGraphModelData().graphData,
                    O.id
                  )
                }
              ),
              oe && /* @__PURE__ */ C.jsx(dp, {}),
              g && u.current && /* @__PURE__ */ C.jsx(
                bp,
                {
                  historyManager: u.current,
                  currentIndex: u.current.cursor,
                  onTakeSnapshot: L,
                  onJumpTo: X,
                  onDeleteEntry: j,
                  onClose: () => x(!1)
                }
              ),
              P && /* @__PURE__ */ C.jsx(
                Fp,
                {
                  modelRef: i,
                  viewRef: s,
                  onClose: () => {
                    _(null), y(!1);
                  },
                  onExpand: (Z) => {
                    var Re, Se;
                    const te = i.current;
                    if (!te) return;
                    const G = te.getGraphModelData().graphData, ge = new Set(G.nodes.map((Be) => Be.id)), Ce = new Set(G.links.map((Be) => Be.id));
                    te.updateGraphData({
                      graphData: {
                        nodes: [
                          ...G.nodes,
                          ...Z.nodes.filter(
                            (Be) => !ge.has(Be.id)
                          )
                        ],
                        links: [
                          ...G.links,
                          ...Z.links.filter(
                            (Be) => !Ce.has(Be.id)
                          )
                        ]
                      }
                    }), (Re = s.current) == null || Re.reheat(1), (Se = s.current) == null || Se.fitView(50);
                  }
                }
              ),
              N && !p && /* @__PURE__ */ C.jsx(Zf, { onClose: () => S(!1) }),
              w && !p && /* @__PURE__ */ C.jsx(lp, { viewRef: s }),
              ie && /* @__PURE__ */ C.jsx(
                vp,
                {
                  node: ie.node,
                  loadedNeighbors: Uc(
                    i.current.getGraphModelData().graphData,
                    ie.node.id
                  ),
                  x: ie.x,
                  y: ie.y,
                  onExpand: H,
                  onClose: () => re(null)
                }
              ),
              B && /* @__PURE__ */ C.jsxs(
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
                    /* @__PURE__ */ C.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "18px",
                          animation: "spin 1s linear infinite"
                        },
                        children: "⟳"
                      }
                    ),
                    /* @__PURE__ */ C.jsx("span", { children: "正在拓出..." }),
                    /* @__PURE__ */ C.jsx("style", { children: "@keyframes spin { to { transform: rotate(360deg); } }" })
                  ]
                }
              ),
              /* @__PURE__ */ C.jsx(Yp, {}),
              I && /* @__PURE__ */ C.jsxs(
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
                    I
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
let Jn = null;
const ly = () => {
  let c = document.getElementById("single-spa-application:graph-app");
  return c || (c = document.createElement("div"), c.id = "single-spa-application:graph-app", document.body.appendChild(c)), c;
}, uy = async () => {
}, cy = async (c) => {
  var i;
  const n = c.domElement ?? ly();
  (i = c.auth) != null && i.token && Mp(c.auth.token), Jn = af.createRoot(n), Jn.render(
    /* @__PURE__ */ C.jsx(Yf, { children: /* @__PURE__ */ C.jsx(sy, {}) })
  );
}, dy = async () => {
  Jn == null || Jn.unmount(), Jn = null;
};
export {
  uy as bootstrap,
  ly as domElementGetter,
  cy as mount,
  dy as unmount
};
