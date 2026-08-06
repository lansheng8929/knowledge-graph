const __kgStyle=document.createElement("style");__kgStyle.textContent=":root,[data-theme=light]{--background: 255 255 255;--surface: 250 251 252;--foreground: 51 51 51;--muted: 136 153 170;--muted-foreground: 102 119 136;--primary: 233 69 96;--primary-foreground: 255 255 255;--border: 224 224 224;--border-strong: 15 52 96;--border-hover: 0 204 255;--shadow-sm: 0 1px 2px rgb(0 0 0 / .05);--shadow: 0 4px 20px rgb(0 0 0 / .12);--shadow-lg: 0 4px 20px rgb(0 0 0 / .4);--success: 16 185 129;--warning: 245 158 11;--danger: 239 68 68;--tooltip-bg: 255 255 255;--hover: 240 244 255;--canvas-bg: 248 249 250;--overlay-bg: 0 102 255}[data-theme=dark]{--background: 30 33 38;--surface: 36 40 46;--foreground: 226 232 240;--muted: 100 116 139;--muted-foreground: 148 163 184;--primary: 244 63 94;--primary-foreground: 255 255 255;--border: 55 60 67;--border-strong: 71 78 88;--border-hover: 34 211 238;--shadow-sm: 0 1px 2px rgb(0 0 0 / .35);--shadow: 0 4px 20px rgb(0 0 0 / .4);--shadow-lg: 0 4px 24px rgb(0 0 0 / .55);--success: 52 211 153;--warning: 251 191 36;--danger: 248 113 113;--tooltip-bg: 42 46 52;--hover: 42 46 52;--canvas-bg: 24 27 31;--overlay-bg: 96 165 250}.bg-background{background-color:rgb(var(--background))}.bg-canvas{background-color:rgb(var(--canvas-bg))}.bg-tooltip{background-color:rgb(var(--tooltip-bg))}.bg-primary{background-color:rgb(var(--primary))}.bg-hover{background-color:rgb(var(--hover))}.text-foreground{color:rgb(var(--foreground))}.text-muted{color:rgb(var(--muted))}.text-muted-foreground{color:rgb(var(--muted-foreground))}.text-primary{color:rgb(var(--primary))}.border-border{border-color:rgb(var(--border))}.border-border-strong{border-color:rgb(var(--border-strong))}.border-primary{border-color:rgb(var(--primary))}.shadow-sm{box-shadow:var(--shadow-sm)}.shadow{box-shadow:var(--shadow)}.shadow-lg{box-shadow:var(--shadow-lg)}\n";document.head.appendChild(__kgStyle);
var hf = Object.defineProperty;
var ff = (c, n, i) => n in c ? hf(c, n, { enumerable: !0, configurable: !0, writable: !0, value: i }) : c[n] = i;
var T = (c, n, i) => ff(c, typeof n != "symbol" ? n + "" : n, i);
var fl = { exports: {} }, Jr = {}, pl = { exports: {} }, _e = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xc;
function pf() {
  if (xc) return _e;
  xc = 1;
  var c = Symbol.for("react.element"), n = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), d = Symbol.for("react.provider"), h = Symbol.for("react.context"), p = Symbol.for("react.forward_ref"), y = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), k = Symbol.for("react.lazy"), _ = Symbol.iterator;
  function x(P) {
    return P === null || typeof P != "object" ? null : (P = _ && P[_] || P["@@iterator"], typeof P == "function" ? P : null);
  }
  var S = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, N = Object.assign, b = {};
  function m(P, V, de) {
    this.props = P, this.context = V, this.refs = b, this.updater = de || S;
  }
  m.prototype.isReactComponent = {}, m.prototype.setState = function(P, V) {
    if (typeof P != "object" && typeof P != "function" && P != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, P, V, "setState");
  }, m.prototype.forceUpdate = function(P) {
    this.updater.enqueueForceUpdate(this, P, "forceUpdate");
  };
  function C() {
  }
  C.prototype = m.prototype;
  function R(P, V, de) {
    this.props = P, this.context = V, this.refs = b, this.updater = de || S;
  }
  var X = R.prototype = new C();
  X.constructor = R, N(X, m.prototype), X.isPureReactComponent = !0;
  var U = Array.isArray, H = Object.prototype.hasOwnProperty, Y = { current: null }, A = { key: !0, ref: !0, __self: !0, __source: !0 };
  function D(P, V, de) {
    var ae, xe = {}, ge = null, Z = null;
    if (V != null) for (ae in V.ref !== void 0 && (Z = V.ref), V.key !== void 0 && (ge = "" + V.key), V) H.call(V, ae) && !A.hasOwnProperty(ae) && (xe[ae] = V[ae]);
    var ne = arguments.length - 2;
    if (ne === 1) xe.children = de;
    else if (1 < ne) {
      for (var ie = Array(ne), re = 0; re < ne; re++) ie[re] = arguments[re + 2];
      xe.children = ie;
    }
    if (P && P.defaultProps) for (ae in ne = P.defaultProps, ne) xe[ae] === void 0 && (xe[ae] = ne[ae]);
    return { $$typeof: c, type: P, key: ge, ref: Z, props: xe, _owner: Y.current };
  }
  function j(P, V) {
    return { $$typeof: c, type: P.type, key: V, ref: P.ref, props: P.props, _owner: P._owner };
  }
  function $(P) {
    return typeof P == "object" && P !== null && P.$$typeof === c;
  }
  function ee(P) {
    var V = { "=": "=0", ":": "=2" };
    return "$" + P.replace(/[=:]/g, function(de) {
      return V[de];
    });
  }
  var ye = /\/+/g;
  function oe(P, V) {
    return typeof P == "object" && P !== null && P.key != null ? ee("" + P.key) : V.toString(36);
  }
  function le(P, V, de, ae, xe) {
    var ge = typeof P;
    (ge === "undefined" || ge === "boolean") && (P = null);
    var Z = !1;
    if (P === null) Z = !0;
    else switch (ge) {
      case "string":
      case "number":
        Z = !0;
        break;
      case "object":
        switch (P.$$typeof) {
          case c:
          case n:
            Z = !0;
        }
    }
    if (Z) return Z = P, xe = xe(Z), P = ae === "" ? "." + oe(Z, 0) : ae, U(xe) ? (de = "", P != null && (de = P.replace(ye, "$&/") + "/"), le(xe, V, de, "", function(re) {
      return re;
    })) : xe != null && ($(xe) && (xe = j(xe, de + (!xe.key || Z && Z.key === xe.key ? "" : ("" + xe.key).replace(ye, "$&/") + "/") + P)), V.push(xe)), 1;
    if (Z = 0, ae = ae === "" ? "." : ae + ":", U(P)) for (var ne = 0; ne < P.length; ne++) {
      ge = P[ne];
      var ie = ae + oe(ge, ne);
      Z += le(ge, V, de, ie, xe);
    }
    else if (ie = x(P), typeof ie == "function") for (P = ie.call(P), ne = 0; !(ge = P.next()).done; ) ge = ge.value, ie = ae + oe(ge, ne++), Z += le(ge, V, de, ie, xe);
    else if (ge === "object") throw V = String(P), Error("Objects are not valid as a React child (found: " + (V === "[object Object]" ? "object with keys {" + Object.keys(P).join(", ") + "}" : V) + "). If you meant to render a collection of children, use an array instead.");
    return Z;
  }
  function se(P, V, de) {
    if (P == null) return P;
    var ae = [], xe = 0;
    return le(P, ae, "", "", function(ge) {
      return V.call(de, ge, xe++);
    }), ae;
  }
  function K(P) {
    if (P._status === -1) {
      var V = P._result;
      V = V(), V.then(function(de) {
        (P._status === 0 || P._status === -1) && (P._status = 1, P._result = de);
      }, function(de) {
        (P._status === 0 || P._status === -1) && (P._status = 2, P._result = de);
      }), P._status === -1 && (P._status = 0, P._result = V);
    }
    if (P._status === 1) return P._result.default;
    throw P._result;
  }
  var O = { current: null }, F = { transition: null }, W = { ReactCurrentDispatcher: O, ReactCurrentBatchConfig: F, ReactCurrentOwner: Y };
  function q() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return _e.Children = { map: se, forEach: function(P, V, de) {
    se(P, function() {
      V.apply(this, arguments);
    }, de);
  }, count: function(P) {
    var V = 0;
    return se(P, function() {
      V++;
    }), V;
  }, toArray: function(P) {
    return se(P, function(V) {
      return V;
    }) || [];
  }, only: function(P) {
    if (!$(P)) throw Error("React.Children.only expected to receive a single React element child.");
    return P;
  } }, _e.Component = m, _e.Fragment = i, _e.Profiler = a, _e.PureComponent = R, _e.StrictMode = s, _e.Suspense = y, _e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W, _e.act = q, _e.cloneElement = function(P, V, de) {
    if (P == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + P + ".");
    var ae = N({}, P.props), xe = P.key, ge = P.ref, Z = P._owner;
    if (V != null) {
      if (V.ref !== void 0 && (ge = V.ref, Z = Y.current), V.key !== void 0 && (xe = "" + V.key), P.type && P.type.defaultProps) var ne = P.type.defaultProps;
      for (ie in V) H.call(V, ie) && !A.hasOwnProperty(ie) && (ae[ie] = V[ie] === void 0 && ne !== void 0 ? ne[ie] : V[ie]);
    }
    var ie = arguments.length - 2;
    if (ie === 1) ae.children = de;
    else if (1 < ie) {
      ne = Array(ie);
      for (var re = 0; re < ie; re++) ne[re] = arguments[re + 2];
      ae.children = ne;
    }
    return { $$typeof: c, type: P.type, key: xe, ref: ge, props: ae, _owner: Z };
  }, _e.createContext = function(P) {
    return P = { $$typeof: h, _currentValue: P, _currentValue2: P, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, P.Provider = { $$typeof: d, _context: P }, P.Consumer = P;
  }, _e.createElement = D, _e.createFactory = function(P) {
    var V = D.bind(null, P);
    return V.type = P, V;
  }, _e.createRef = function() {
    return { current: null };
  }, _e.forwardRef = function(P) {
    return { $$typeof: p, render: P };
  }, _e.isValidElement = $, _e.lazy = function(P) {
    return { $$typeof: k, _payload: { _status: -1, _result: P }, _init: K };
  }, _e.memo = function(P, V) {
    return { $$typeof: f, type: P, compare: V === void 0 ? null : V };
  }, _e.startTransition = function(P) {
    var V = F.transition;
    F.transition = {};
    try {
      P();
    } finally {
      F.transition = V;
    }
  }, _e.unstable_act = q, _e.useCallback = function(P, V) {
    return O.current.useCallback(P, V);
  }, _e.useContext = function(P) {
    return O.current.useContext(P);
  }, _e.useDebugValue = function() {
  }, _e.useDeferredValue = function(P) {
    return O.current.useDeferredValue(P);
  }, _e.useEffect = function(P, V) {
    return O.current.useEffect(P, V);
  }, _e.useId = function() {
    return O.current.useId();
  }, _e.useImperativeHandle = function(P, V, de) {
    return O.current.useImperativeHandle(P, V, de);
  }, _e.useInsertionEffect = function(P, V) {
    return O.current.useInsertionEffect(P, V);
  }, _e.useLayoutEffect = function(P, V) {
    return O.current.useLayoutEffect(P, V);
  }, _e.useMemo = function(P, V) {
    return O.current.useMemo(P, V);
  }, _e.useReducer = function(P, V, de) {
    return O.current.useReducer(P, V, de);
  }, _e.useRef = function(P) {
    return O.current.useRef(P);
  }, _e.useState = function(P) {
    return O.current.useState(P);
  }, _e.useSyncExternalStore = function(P, V, de) {
    return O.current.useSyncExternalStore(P, V, de);
  }, _e.useTransition = function() {
    return O.current.useTransition();
  }, _e.version = "18.3.1", _e;
}
var kc;
function Ml() {
  return kc || (kc = 1, pl.exports = pf()), pl.exports;
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
var Sc;
function gf() {
  if (Sc) return Jr;
  Sc = 1;
  var c = Ml(), n = Symbol.for("react.element"), i = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, a = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
  function h(p, y, f) {
    var k, _ = {}, x = null, S = null;
    f !== void 0 && (x = "" + f), y.key !== void 0 && (x = "" + y.key), y.ref !== void 0 && (S = y.ref);
    for (k in y) s.call(y, k) && !d.hasOwnProperty(k) && (_[k] = y[k]);
    if (p && p.defaultProps) for (k in y = p.defaultProps, y) _[k] === void 0 && (_[k] = y[k]);
    return { $$typeof: n, type: p, key: x, ref: S, props: _, _owner: a.current };
  }
  return Jr.Fragment = i, Jr.jsx = h, Jr.jsxs = h, Jr;
}
var wc;
function yf() {
  return wc || (wc = 1, fl.exports = gf()), fl.exports;
}
var v = yf(), yo = {}, gl = { exports: {} }, ct = {}, yl = { exports: {} }, vl = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _c;
function vf() {
  return _c || (_c = 1, (function(c) {
    function n(F, W) {
      var q = F.length;
      F.push(W);
      e: for (; 0 < q; ) {
        var P = q - 1 >>> 1, V = F[P];
        if (0 < a(V, W)) F[P] = W, F[q] = V, q = P;
        else break e;
      }
    }
    function i(F) {
      return F.length === 0 ? null : F[0];
    }
    function s(F) {
      if (F.length === 0) return null;
      var W = F[0], q = F.pop();
      if (q !== W) {
        F[0] = q;
        e: for (var P = 0, V = F.length, de = V >>> 1; P < de; ) {
          var ae = 2 * (P + 1) - 1, xe = F[ae], ge = ae + 1, Z = F[ge];
          if (0 > a(xe, q)) ge < V && 0 > a(Z, xe) ? (F[P] = Z, F[ge] = q, P = ge) : (F[P] = xe, F[ae] = q, P = ae);
          else if (ge < V && 0 > a(Z, q)) F[P] = Z, F[ge] = q, P = ge;
          else break e;
        }
      }
      return W;
    }
    function a(F, W) {
      var q = F.sortIndex - W.sortIndex;
      return q !== 0 ? q : F.id - W.id;
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
    var y = [], f = [], k = 1, _ = null, x = 3, S = !1, N = !1, b = !1, m = typeof setTimeout == "function" ? setTimeout : null, C = typeof clearTimeout == "function" ? clearTimeout : null, R = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function X(F) {
      for (var W = i(f); W !== null; ) {
        if (W.callback === null) s(f);
        else if (W.startTime <= F) s(f), W.sortIndex = W.expirationTime, n(y, W);
        else break;
        W = i(f);
      }
    }
    function U(F) {
      if (b = !1, X(F), !N) if (i(y) !== null) N = !0, K(H);
      else {
        var W = i(f);
        W !== null && O(U, W.startTime - F);
      }
    }
    function H(F, W) {
      N = !1, b && (b = !1, C(D), D = -1), S = !0;
      var q = x;
      try {
        for (X(W), _ = i(y); _ !== null && (!(_.expirationTime > W) || F && !ee()); ) {
          var P = _.callback;
          if (typeof P == "function") {
            _.callback = null, x = _.priorityLevel;
            var V = P(_.expirationTime <= W);
            W = c.unstable_now(), typeof V == "function" ? _.callback = V : _ === i(y) && s(y), X(W);
          } else s(y);
          _ = i(y);
        }
        if (_ !== null) var de = !0;
        else {
          var ae = i(f);
          ae !== null && O(U, ae.startTime - W), de = !1;
        }
        return de;
      } finally {
        _ = null, x = q, S = !1;
      }
    }
    var Y = !1, A = null, D = -1, j = 5, $ = -1;
    function ee() {
      return !(c.unstable_now() - $ < j);
    }
    function ye() {
      if (A !== null) {
        var F = c.unstable_now();
        $ = F;
        var W = !0;
        try {
          W = A(!0, F);
        } finally {
          W ? oe() : (Y = !1, A = null);
        }
      } else Y = !1;
    }
    var oe;
    if (typeof R == "function") oe = function() {
      R(ye);
    };
    else if (typeof MessageChannel < "u") {
      var le = new MessageChannel(), se = le.port2;
      le.port1.onmessage = ye, oe = function() {
        se.postMessage(null);
      };
    } else oe = function() {
      m(ye, 0);
    };
    function K(F) {
      A = F, Y || (Y = !0, oe());
    }
    function O(F, W) {
      D = m(function() {
        F(c.unstable_now());
      }, W);
    }
    c.unstable_IdlePriority = 5, c.unstable_ImmediatePriority = 1, c.unstable_LowPriority = 4, c.unstable_NormalPriority = 3, c.unstable_Profiling = null, c.unstable_UserBlockingPriority = 2, c.unstable_cancelCallback = function(F) {
      F.callback = null;
    }, c.unstable_continueExecution = function() {
      N || S || (N = !0, K(H));
    }, c.unstable_forceFrameRate = function(F) {
      0 > F || 125 < F ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : j = 0 < F ? Math.floor(1e3 / F) : 5;
    }, c.unstable_getCurrentPriorityLevel = function() {
      return x;
    }, c.unstable_getFirstCallbackNode = function() {
      return i(y);
    }, c.unstable_next = function(F) {
      switch (x) {
        case 1:
        case 2:
        case 3:
          var W = 3;
          break;
        default:
          W = x;
      }
      var q = x;
      x = W;
      try {
        return F();
      } finally {
        x = q;
      }
    }, c.unstable_pauseExecution = function() {
    }, c.unstable_requestPaint = function() {
    }, c.unstable_runWithPriority = function(F, W) {
      switch (F) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          F = 3;
      }
      var q = x;
      x = F;
      try {
        return W();
      } finally {
        x = q;
      }
    }, c.unstable_scheduleCallback = function(F, W, q) {
      var P = c.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? P + q : P) : q = P, F) {
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
      return V = q + V, F = { id: k++, callback: W, priorityLevel: F, startTime: q, expirationTime: V, sortIndex: -1 }, q > P ? (F.sortIndex = q, n(f, F), i(y) === null && F === i(f) && (b ? (C(D), D = -1) : b = !0, O(U, q - P))) : (F.sortIndex = V, n(y, F), N || S || (N = !0, K(H))), F;
    }, c.unstable_shouldYield = ee, c.unstable_wrapCallback = function(F) {
      var W = x;
      return function() {
        var q = x;
        x = W;
        try {
          return F.apply(this, arguments);
        } finally {
          x = q;
        }
      };
    };
  })(vl)), vl;
}
var Tc;
function mf() {
  return Tc || (Tc = 1, yl.exports = vf()), yl.exports;
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
var Cc;
function xf() {
  if (Cc) return ct;
  Cc = 1;
  var c = Ml(), n = mf();
  function i(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var s = /* @__PURE__ */ new Set(), a = {};
  function d(e, t) {
    h(e, t), h(e + "Capture", t);
  }
  function h(e, t) {
    for (a[e] = t, e = 0; e < t.length; e++) s.add(t[e]);
  }
  var p = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), y = Object.prototype.hasOwnProperty, f = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, k = {}, _ = {};
  function x(e) {
    return y.call(_, e) ? !0 : y.call(k, e) ? !1 : f.test(e) ? _[e] = !0 : (k[e] = !0, !1);
  }
  function S(e, t, r, o) {
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
  function N(e, t, r, o) {
    if (t === null || typeof t > "u" || S(e, t, r, o)) return !0;
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
  function b(e, t, r, o, l, u, g) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = o, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = u, this.removeEmptyString = g;
  }
  var m = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    m[e] = new b(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    m[t] = new b(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    m[e] = new b(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    m[e] = new b(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    m[e] = new b(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    m[e] = new b(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    m[e] = new b(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    m[e] = new b(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    m[e] = new b(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var C = /[\-:]([a-z])/g;
  function R(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      C,
      R
    );
    m[t] = new b(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(C, R);
    m[t] = new b(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(C, R);
    m[t] = new b(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    m[e] = new b(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), m.xlinkHref = new b("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    m[e] = new b(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function X(e, t, r, o) {
    var l = m.hasOwnProperty(t) ? m[t] : null;
    (l !== null ? l.type !== 0 : o || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (N(t, r, l, o) && (r = null), o || l === null ? x(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, o = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, o ? e.setAttributeNS(o, t, r) : e.setAttribute(t, r))));
  }
  var U = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, H = Symbol.for("react.element"), Y = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), D = Symbol.for("react.strict_mode"), j = Symbol.for("react.profiler"), $ = Symbol.for("react.provider"), ee = Symbol.for("react.context"), ye = Symbol.for("react.forward_ref"), oe = Symbol.for("react.suspense"), le = Symbol.for("react.suspense_list"), se = Symbol.for("react.memo"), K = Symbol.for("react.lazy"), O = Symbol.for("react.offscreen"), F = Symbol.iterator;
  function W(e) {
    return e === null || typeof e != "object" ? null : (e = F && e[F] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var q = Object.assign, P;
  function V(e) {
    if (P === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      P = t && t[1] || "";
    }
    return `
` + P + e;
  }
  var de = !1;
  function ae(e, t) {
    if (!e || de) return "";
    de = !0;
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
        } catch (B) {
          var o = B;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (B) {
          o = B;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (B) {
          o = B;
        }
        e();
      }
    } catch (B) {
      if (B && o && typeof B.stack == "string") {
        for (var l = B.stack.split(`
`), u = o.stack.split(`
`), g = l.length - 1, w = u.length - 1; 1 <= g && 0 <= w && l[g] !== u[w]; ) w--;
        for (; 1 <= g && 0 <= w; g--, w--) if (l[g] !== u[w]) {
          if (g !== 1 || w !== 1)
            do
              if (g--, w--, 0 > w || l[g] !== u[w]) {
                var E = `
` + l[g].replace(" at new ", " at ");
                return e.displayName && E.includes("<anonymous>") && (E = E.replace("<anonymous>", e.displayName)), E;
              }
            while (1 <= g && 0 <= w);
          break;
        }
      }
    } finally {
      de = !1, Error.prepareStackTrace = r;
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
        return e = ae(e.type, !1), e;
      case 11:
        return e = ae(e.type.render, !1), e;
      case 1:
        return e = ae(e.type, !0), e;
      default:
        return "";
    }
  }
  function ge(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case A:
        return "Fragment";
      case Y:
        return "Portal";
      case j:
        return "Profiler";
      case D:
        return "StrictMode";
      case oe:
        return "Suspense";
      case le:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case ee:
        return (e.displayName || "Context") + ".Consumer";
      case $:
        return (e._context.displayName || "Context") + ".Provider";
      case ye:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case se:
        return t = e.displayName || null, t !== null ? t : ge(e.type) || "Memo";
      case K:
        t = e._payload, e = e._init;
        try {
          return ge(e(t));
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
        return ge(t);
      case 8:
        return t === D ? "StrictMode" : "Mode";
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
  function ne(e) {
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
  function ie(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function re(e) {
    var t = ie(e) ? "checked" : "value", r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), o = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
      var l = r.get, u = r.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(g) {
        o = "" + g, u.call(this, g);
      } }), Object.defineProperty(e, t, { enumerable: r.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(g) {
        o = "" + g;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Se(e) {
    e._valueTracker || (e._valueTracker = re(e));
  }
  function Re(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), o = "";
    return e && (o = ie(e) ? e.checked ? "true" : "false" : e.value), e = o, e !== r ? (t.setValue(e), !0) : !1;
  }
  function Be(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function be(e, t) {
    var r = t.checked;
    return q({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function zt(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, o = t.checked != null ? t.checked : t.defaultChecked;
    r = ne(t.value != null ? t.value : r), e._wrapperState = { initialChecked: o, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ot(e, t) {
    t = t.checked, t != null && X(e, "checked", t, !1);
  }
  function gr(e, t) {
    Ot(e, t);
    var r = ne(t.value), o = t.type;
    if (r != null) o === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (o === "submit" || o === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? yr(e, t.type, r) : t.hasOwnProperty("defaultValue") && yr(e, t.type, ne(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function si(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var o = t.type;
      if (!(o !== "submit" && o !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function yr(e, t, r) {
    (t !== "number" || Be(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var we = Array.isArray;
  function Ee(e, t, r, o) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < r.length; l++) t["$" + r[l]] = !0;
      for (r = 0; r < e.length; r++) l = t.hasOwnProperty("$" + e[r].value), e[r].selected !== l && (e[r].selected = l), l && o && (e[r].defaultSelected = !0);
    } else {
      for (r = "" + ne(r), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === r) {
          e[l].selected = !0, o && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ue(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(i(91));
    return q({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Bt(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(i(92));
        if (we(r)) {
          if (1 < r.length) throw Error(i(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: ne(r) };
  }
  function Rt(e, t) {
    var r = ne(t.value), o = ne(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), o != null && (e.defaultValue = "" + o);
  }
  function vt(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Tn(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function dt(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Tn(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var qt, Cn = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, o, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, o, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (qt = qt || document.createElement("div"), qt.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = qt.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Zt(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Jt = {
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
  }, li = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Jt).forEach(function(e) {
    li.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Jt[t] = Jt[e];
    });
  });
  function ht(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || Jt.hasOwnProperty(e) && Jt[e] ? ("" + t).trim() : t + "px";
  }
  function Il(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var o = r.indexOf("--") === 0, l = ht(r, t[r], o);
      r === "float" && (r = "cssFloat"), o ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var yd = q({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Co(e, t) {
    if (t) {
      if (yd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(i(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(i(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(i(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(i(62));
    }
  }
  function bo(e, t) {
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
  var Eo = null;
  function Po(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var No = null, Un = null, Wn = null;
  function Fl(e) {
    if (e = zr(e)) {
      if (typeof No != "function") throw Error(i(280));
      var t = e.stateNode;
      t && (t = Ai(t), No(e.stateNode, e.type, t));
    }
  }
  function jl(e) {
    Un ? Wn ? Wn.push(e) : Wn = [e] : Un = e;
  }
  function zl() {
    if (Un) {
      var e = Un, t = Wn;
      if (Wn = Un = null, Fl(e), t) for (e = 0; e < t.length; e++) Fl(t[e]);
    }
  }
  function Ol(e, t) {
    return e(t);
  }
  function Bl() {
  }
  var Ao = !1;
  function Ul(e, t, r) {
    if (Ao) return e(t, r);
    Ao = !0;
    try {
      return Ol(e, t, r);
    } finally {
      Ao = !1, (Un !== null || Wn !== null) && (Bl(), zl());
    }
  }
  function vr(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var o = Ai(r);
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
  var Mo = !1;
  if (p) try {
    var mr = {};
    Object.defineProperty(mr, "passive", { get: function() {
      Mo = !0;
    } }), window.addEventListener("test", mr, mr), window.removeEventListener("test", mr, mr);
  } catch {
    Mo = !1;
  }
  function vd(e, t, r, o, l, u, g, w, E) {
    var B = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, B);
    } catch (Q) {
      this.onError(Q);
    }
  }
  var xr = !1, ai = null, ui = !1, Ro = null, md = { onError: function(e) {
    xr = !0, ai = e;
  } };
  function xd(e, t, r, o, l, u, g, w, E) {
    xr = !1, ai = null, vd.apply(md, arguments);
  }
  function kd(e, t, r, o, l, u, g, w, E) {
    if (xd.apply(this, arguments), xr) {
      if (xr) {
        var B = ai;
        xr = !1, ai = null;
      } else throw Error(i(198));
      ui || (ui = !0, Ro = B);
    }
  }
  function bn(e) {
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
  function Wl(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Hl(e) {
    if (bn(e) !== e) throw Error(i(188));
  }
  function Sd(e) {
    var t = e.alternate;
    if (!t) {
      if (t = bn(e), t === null) throw Error(i(188));
      return t !== e ? null : e;
    }
    for (var r = e, o = t; ; ) {
      var l = r.return;
      if (l === null) break;
      var u = l.alternate;
      if (u === null) {
        if (o = l.return, o !== null) {
          r = o;
          continue;
        }
        break;
      }
      if (l.child === u.child) {
        for (u = l.child; u; ) {
          if (u === r) return Hl(l), e;
          if (u === o) return Hl(l), t;
          u = u.sibling;
        }
        throw Error(i(188));
      }
      if (r.return !== o.return) r = l, o = u;
      else {
        for (var g = !1, w = l.child; w; ) {
          if (w === r) {
            g = !0, r = l, o = u;
            break;
          }
          if (w === o) {
            g = !0, o = l, r = u;
            break;
          }
          w = w.sibling;
        }
        if (!g) {
          for (w = u.child; w; ) {
            if (w === r) {
              g = !0, r = u, o = l;
              break;
            }
            if (w === o) {
              g = !0, o = u, r = l;
              break;
            }
            w = w.sibling;
          }
          if (!g) throw Error(i(189));
        }
      }
      if (r.alternate !== o) throw Error(i(190));
    }
    if (r.tag !== 3) throw Error(i(188));
    return r.stateNode.current === r ? e : t;
  }
  function Vl(e) {
    return e = Sd(e), e !== null ? $l(e) : null;
  }
  function $l(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = $l(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Xl = n.unstable_scheduleCallback, Yl = n.unstable_cancelCallback, wd = n.unstable_shouldYield, _d = n.unstable_requestPaint, ze = n.unstable_now, Td = n.unstable_getCurrentPriorityLevel, Lo = n.unstable_ImmediatePriority, Gl = n.unstable_UserBlockingPriority, ci = n.unstable_NormalPriority, Cd = n.unstable_LowPriority, Ql = n.unstable_IdlePriority, di = null, Lt = null;
  function bd(e) {
    if (Lt && typeof Lt.onCommitFiberRoot == "function") try {
      Lt.onCommitFiberRoot(di, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Tt = Math.clz32 ? Math.clz32 : Nd, Ed = Math.log, Pd = Math.LN2;
  function Nd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Ed(e) / Pd | 0) | 0;
  }
  var hi = 64, fi = 4194304;
  function kr(e) {
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
  function pi(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var o = 0, l = e.suspendedLanes, u = e.pingedLanes, g = r & 268435455;
    if (g !== 0) {
      var w = g & ~l;
      w !== 0 ? o = kr(w) : (u &= g, u !== 0 && (o = kr(u)));
    } else g = r & ~l, g !== 0 ? o = kr(g) : u !== 0 && (o = kr(u));
    if (o === 0) return 0;
    if (t !== 0 && t !== o && (t & l) === 0 && (l = o & -o, u = t & -t, l >= u || l === 16 && (u & 4194240) !== 0)) return t;
    if ((o & 4) !== 0 && (o |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= o; 0 < t; ) r = 31 - Tt(t), l = 1 << r, o |= e[r], t &= ~l;
    return o;
  }
  function Ad(e, t) {
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
  function Md(e, t) {
    for (var r = e.suspendedLanes, o = e.pingedLanes, l = e.expirationTimes, u = e.pendingLanes; 0 < u; ) {
      var g = 31 - Tt(u), w = 1 << g, E = l[g];
      E === -1 ? ((w & r) === 0 || (w & o) !== 0) && (l[g] = Ad(w, t)) : E <= t && (e.expiredLanes |= w), u &= ~w;
    }
  }
  function Do(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Kl() {
    var e = hi;
    return hi <<= 1, (hi & 4194240) === 0 && (hi = 64), e;
  }
  function Io(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function Sr(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Tt(t), e[t] = r;
  }
  function Rd(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var o = e.eventTimes;
    for (e = e.expirationTimes; 0 < r; ) {
      var l = 31 - Tt(r), u = 1 << l;
      t[l] = 0, o[l] = -1, e[l] = -1, r &= ~u;
    }
  }
  function Fo(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var o = 31 - Tt(r), l = 1 << o;
      l & t | e[o] & t && (e[o] |= t), r &= ~l;
    }
  }
  var Pe = 0;
  function ql(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Zl, jo, Jl, ea, ta, zo = !1, gi = [], en = null, tn = null, nn = null, wr = /* @__PURE__ */ new Map(), _r = /* @__PURE__ */ new Map(), rn = [], Ld = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function na(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        en = null;
        break;
      case "dragenter":
      case "dragleave":
        tn = null;
        break;
      case "mouseover":
      case "mouseout":
        nn = null;
        break;
      case "pointerover":
      case "pointerout":
        wr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        _r.delete(t.pointerId);
    }
  }
  function Tr(e, t, r, o, l, u) {
    return e === null || e.nativeEvent !== u ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: o, nativeEvent: u, targetContainers: [l] }, t !== null && (t = zr(t), t !== null && jo(t)), e) : (e.eventSystemFlags |= o, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Dd(e, t, r, o, l) {
    switch (t) {
      case "focusin":
        return en = Tr(en, e, t, r, o, l), !0;
      case "dragenter":
        return tn = Tr(tn, e, t, r, o, l), !0;
      case "mouseover":
        return nn = Tr(nn, e, t, r, o, l), !0;
      case "pointerover":
        var u = l.pointerId;
        return wr.set(u, Tr(wr.get(u) || null, e, t, r, o, l)), !0;
      case "gotpointercapture":
        return u = l.pointerId, _r.set(u, Tr(_r.get(u) || null, e, t, r, o, l)), !0;
    }
    return !1;
  }
  function ra(e) {
    var t = En(e.target);
    if (t !== null) {
      var r = bn(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = Wl(r), t !== null) {
            e.blockedOn = t, ta(e.priority, function() {
              Jl(r);
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
  function yi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = Bo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var o = new r.constructor(r.type, r);
        Eo = o, r.target.dispatchEvent(o), Eo = null;
      } else return t = zr(r), t !== null && jo(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function ia(e, t, r) {
    yi(e) && r.delete(t);
  }
  function Id() {
    zo = !1, en !== null && yi(en) && (en = null), tn !== null && yi(tn) && (tn = null), nn !== null && yi(nn) && (nn = null), wr.forEach(ia), _r.forEach(ia);
  }
  function Cr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, zo || (zo = !0, n.unstable_scheduleCallback(n.unstable_NormalPriority, Id)));
  }
  function br(e) {
    function t(l) {
      return Cr(l, e);
    }
    if (0 < gi.length) {
      Cr(gi[0], e);
      for (var r = 1; r < gi.length; r++) {
        var o = gi[r];
        o.blockedOn === e && (o.blockedOn = null);
      }
    }
    for (en !== null && Cr(en, e), tn !== null && Cr(tn, e), nn !== null && Cr(nn, e), wr.forEach(t), _r.forEach(t), r = 0; r < rn.length; r++) o = rn[r], o.blockedOn === e && (o.blockedOn = null);
    for (; 0 < rn.length && (r = rn[0], r.blockedOn === null); ) ra(r), r.blockedOn === null && rn.shift();
  }
  var Hn = U.ReactCurrentBatchConfig, vi = !0;
  function Fd(e, t, r, o) {
    var l = Pe, u = Hn.transition;
    Hn.transition = null;
    try {
      Pe = 1, Oo(e, t, r, o);
    } finally {
      Pe = l, Hn.transition = u;
    }
  }
  function jd(e, t, r, o) {
    var l = Pe, u = Hn.transition;
    Hn.transition = null;
    try {
      Pe = 4, Oo(e, t, r, o);
    } finally {
      Pe = l, Hn.transition = u;
    }
  }
  function Oo(e, t, r, o) {
    if (vi) {
      var l = Bo(e, t, r, o);
      if (l === null) rs(e, t, o, mi, r), na(e, o);
      else if (Dd(l, e, t, r, o)) o.stopPropagation();
      else if (na(e, o), t & 4 && -1 < Ld.indexOf(e)) {
        for (; l !== null; ) {
          var u = zr(l);
          if (u !== null && Zl(u), u = Bo(e, t, r, o), u === null && rs(e, t, o, mi, r), u === l) break;
          l = u;
        }
        l !== null && o.stopPropagation();
      } else rs(e, t, o, null, r);
    }
  }
  var mi = null;
  function Bo(e, t, r, o) {
    if (mi = null, e = Po(o), e = En(e), e !== null) if (t = bn(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = Wl(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return mi = e, null;
  }
  function oa(e) {
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
        switch (Td()) {
          case Lo:
            return 1;
          case Gl:
            return 4;
          case ci:
          case Cd:
            return 16;
          case Ql:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var on = null, Uo = null, xi = null;
  function sa() {
    if (xi) return xi;
    var e, t = Uo, r = t.length, o, l = "value" in on ? on.value : on.textContent, u = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var g = r - e;
    for (o = 1; o <= g && t[r - o] === l[u - o]; o++) ;
    return xi = l.slice(e, 1 < o ? 1 - o : void 0);
  }
  function ki(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Si() {
    return !0;
  }
  function la() {
    return !1;
  }
  function ft(e) {
    function t(r, o, l, u, g) {
      this._reactName = r, this._targetInst = l, this.type = o, this.nativeEvent = u, this.target = g, this.currentTarget = null;
      for (var w in e) e.hasOwnProperty(w) && (r = e[w], this[w] = r ? r(u) : u[w]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Si : la, this.isPropagationStopped = la, this;
    }
    return q(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = Si);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = Si);
    }, persist: function() {
    }, isPersistent: Si }), t;
  }
  var Vn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Wo = ft(Vn), Er = q({}, Vn, { view: 0, detail: 0 }), zd = ft(Er), Ho, Vo, Pr, wi = q({}, Er, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Xo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Pr && (Pr && e.type === "mousemove" ? (Ho = e.screenX - Pr.screenX, Vo = e.screenY - Pr.screenY) : Vo = Ho = 0, Pr = e), Ho);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Vo;
  } }), aa = ft(wi), Od = q({}, wi, { dataTransfer: 0 }), Bd = ft(Od), Ud = q({}, Er, { relatedTarget: 0 }), $o = ft(Ud), Wd = q({}, Vn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = ft(Wd), Vd = q({}, Vn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), $d = ft(Vd), Xd = q({}, Vn, { data: 0 }), ua = ft(Xd), Yd = {
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
  }, Gd = {
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
  }, Qd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Kd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Qd[e]) ? !!t[e] : !1;
  }
  function Xo() {
    return Kd;
  }
  var qd = q({}, Er, { key: function(e) {
    if (e.key) {
      var t = Yd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = ki(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Gd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Xo, charCode: function(e) {
    return e.type === "keypress" ? ki(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ki(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Zd = ft(qd), Jd = q({}, wi, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ca = ft(Jd), eh = q({}, Er, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Xo }), th = ft(eh), nh = q({}, Vn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), rh = ft(nh), ih = q({}, wi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), oh = ft(ih), sh = [9, 13, 27, 32], Yo = p && "CompositionEvent" in window, Nr = null;
  p && "documentMode" in document && (Nr = document.documentMode);
  var lh = p && "TextEvent" in window && !Nr, da = p && (!Yo || Nr && 8 < Nr && 11 >= Nr), ha = " ", fa = !1;
  function pa(e, t) {
    switch (e) {
      case "keyup":
        return sh.indexOf(t.keyCode) !== -1;
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
  function ga(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var $n = !1;
  function ah(e, t) {
    switch (e) {
      case "compositionend":
        return ga(t);
      case "keypress":
        return t.which !== 32 ? null : (fa = !0, ha);
      case "textInput":
        return e = t.data, e === ha && fa ? null : e;
      default:
        return null;
    }
  }
  function uh(e, t) {
    if ($n) return e === "compositionend" || !Yo && pa(e, t) ? (e = sa(), xi = Uo = on = null, $n = !1, e) : null;
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
        return da && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var ch = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ya(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!ch[e.type] : t === "textarea";
  }
  function va(e, t, r, o) {
    jl(o), t = Ei(t, "onChange"), 0 < t.length && (r = new Wo("onChange", "change", null, r, o), e.push({ event: r, listeners: t }));
  }
  var Ar = null, Mr = null;
  function dh(e) {
    Ia(e, 0);
  }
  function _i(e) {
    var t = Kn(e);
    if (Re(t)) return e;
  }
  function hh(e, t) {
    if (e === "change") return t;
  }
  var ma = !1;
  if (p) {
    var Go;
    if (p) {
      var Qo = "oninput" in document;
      if (!Qo) {
        var xa = document.createElement("div");
        xa.setAttribute("oninput", "return;"), Qo = typeof xa.oninput == "function";
      }
      Go = Qo;
    } else Go = !1;
    ma = Go && (!document.documentMode || 9 < document.documentMode);
  }
  function ka() {
    Ar && (Ar.detachEvent("onpropertychange", Sa), Mr = Ar = null);
  }
  function Sa(e) {
    if (e.propertyName === "value" && _i(Mr)) {
      var t = [];
      va(t, Mr, e, Po(e)), Ul(dh, t);
    }
  }
  function fh(e, t, r) {
    e === "focusin" ? (ka(), Ar = t, Mr = r, Ar.attachEvent("onpropertychange", Sa)) : e === "focusout" && ka();
  }
  function ph(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return _i(Mr);
  }
  function gh(e, t) {
    if (e === "click") return _i(t);
  }
  function yh(e, t) {
    if (e === "input" || e === "change") return _i(t);
  }
  function vh(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ct = typeof Object.is == "function" ? Object.is : vh;
  function Rr(e, t) {
    if (Ct(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), o = Object.keys(t);
    if (r.length !== o.length) return !1;
    for (o = 0; o < r.length; o++) {
      var l = r[o];
      if (!y.call(t, l) || !Ct(e[l], t[l])) return !1;
    }
    return !0;
  }
  function wa(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function _a(e, t) {
    var r = wa(e);
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
      r = wa(r);
    }
  }
  function Ta(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ta(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ca() {
    for (var e = window, t = Be(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var r = typeof t.contentWindow.location.href == "string";
      } catch {
        r = !1;
      }
      if (r) e = t.contentWindow;
      else break;
      t = Be(e.document);
    }
    return t;
  }
  function Ko(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function mh(e) {
    var t = Ca(), r = e.focusedElem, o = e.selectionRange;
    if (t !== r && r && r.ownerDocument && Ta(r.ownerDocument.documentElement, r)) {
      if (o !== null && Ko(r)) {
        if (t = o.start, e = o.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, u = Math.min(o.start, l);
          o = o.end === void 0 ? u : Math.min(o.end, l), !e.extend && u > o && (l = o, o = u, u = l), l = _a(r, u);
          var g = _a(
            r,
            o
          );
          l && g && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== g.node || e.focusOffset !== g.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), u > o ? (e.addRange(t), e.extend(g.node, g.offset)) : (t.setEnd(g.node, g.offset), e.addRange(t)));
        }
      }
      for (t = [], e = r; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var xh = p && "documentMode" in document && 11 >= document.documentMode, Xn = null, qo = null, Lr = null, Zo = !1;
  function ba(e, t, r) {
    var o = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    Zo || Xn == null || Xn !== Be(o) || (o = Xn, "selectionStart" in o && Ko(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), Lr && Rr(Lr, o) || (Lr = o, o = Ei(qo, "onSelect"), 0 < o.length && (t = new Wo("onSelect", "select", null, t, r), e.push({ event: t, listeners: o }), t.target = Xn)));
  }
  function Ti(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var Yn = { animationend: Ti("Animation", "AnimationEnd"), animationiteration: Ti("Animation", "AnimationIteration"), animationstart: Ti("Animation", "AnimationStart"), transitionend: Ti("Transition", "TransitionEnd") }, Jo = {}, Ea = {};
  p && (Ea = document.createElement("div").style, "AnimationEvent" in window || (delete Yn.animationend.animation, delete Yn.animationiteration.animation, delete Yn.animationstart.animation), "TransitionEvent" in window || delete Yn.transitionend.transition);
  function Ci(e) {
    if (Jo[e]) return Jo[e];
    if (!Yn[e]) return e;
    var t = Yn[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in Ea) return Jo[e] = t[r];
    return e;
  }
  var Pa = Ci("animationend"), Na = Ci("animationiteration"), Aa = Ci("animationstart"), Ma = Ci("transitionend"), Ra = /* @__PURE__ */ new Map(), La = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function sn(e, t) {
    Ra.set(e, t), d(t, [e]);
  }
  for (var es = 0; es < La.length; es++) {
    var ts = La[es], kh = ts.toLowerCase(), Sh = ts[0].toUpperCase() + ts.slice(1);
    sn(kh, "on" + Sh);
  }
  sn(Pa, "onAnimationEnd"), sn(Na, "onAnimationIteration"), sn(Aa, "onAnimationStart"), sn("dblclick", "onDoubleClick"), sn("focusin", "onFocus"), sn("focusout", "onBlur"), sn(Ma, "onTransitionEnd"), h("onMouseEnter", ["mouseout", "mouseover"]), h("onMouseLeave", ["mouseout", "mouseover"]), h("onPointerEnter", ["pointerout", "pointerover"]), h("onPointerLeave", ["pointerout", "pointerover"]), d("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), d("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), d("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), d("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), d("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), d("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Dr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), wh = new Set("cancel close invalid load scroll toggle".split(" ").concat(Dr));
  function Da(e, t, r) {
    var o = e.type || "unknown-event";
    e.currentTarget = r, kd(o, t, void 0, e), e.currentTarget = null;
  }
  function Ia(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var o = e[r], l = o.event;
      o = o.listeners;
      e: {
        var u = void 0;
        if (t) for (var g = o.length - 1; 0 <= g; g--) {
          var w = o[g], E = w.instance, B = w.currentTarget;
          if (w = w.listener, E !== u && l.isPropagationStopped()) break e;
          Da(l, w, B), u = E;
        }
        else for (g = 0; g < o.length; g++) {
          if (w = o[g], E = w.instance, B = w.currentTarget, w = w.listener, E !== u && l.isPropagationStopped()) break e;
          Da(l, w, B), u = E;
        }
      }
    }
    if (ui) throw e = Ro, ui = !1, Ro = null, e;
  }
  function Ae(e, t) {
    var r = t[us];
    r === void 0 && (r = t[us] = /* @__PURE__ */ new Set());
    var o = e + "__bubble";
    r.has(o) || (Fa(t, e, 2, !1), r.add(o));
  }
  function ns(e, t, r) {
    var o = 0;
    t && (o |= 4), Fa(r, e, o, t);
  }
  var bi = "_reactListening" + Math.random().toString(36).slice(2);
  function Ir(e) {
    if (!e[bi]) {
      e[bi] = !0, s.forEach(function(r) {
        r !== "selectionchange" && (wh.has(r) || ns(r, !1, e), ns(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[bi] || (t[bi] = !0, ns("selectionchange", !1, t));
    }
  }
  function Fa(e, t, r, o) {
    switch (oa(t)) {
      case 1:
        var l = Fd;
        break;
      case 4:
        l = jd;
        break;
      default:
        l = Oo;
    }
    r = l.bind(null, t, r, e), l = void 0, !Mo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), o ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function rs(e, t, r, o, l) {
    var u = o;
    if ((t & 1) === 0 && (t & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var g = o.tag;
      if (g === 3 || g === 4) {
        var w = o.stateNode.containerInfo;
        if (w === l || w.nodeType === 8 && w.parentNode === l) break;
        if (g === 4) for (g = o.return; g !== null; ) {
          var E = g.tag;
          if ((E === 3 || E === 4) && (E = g.stateNode.containerInfo, E === l || E.nodeType === 8 && E.parentNode === l)) return;
          g = g.return;
        }
        for (; w !== null; ) {
          if (g = En(w), g === null) return;
          if (E = g.tag, E === 5 || E === 6) {
            o = u = g;
            continue e;
          }
          w = w.parentNode;
        }
      }
      o = o.return;
    }
    Ul(function() {
      var B = u, Q = Po(r), J = [];
      e: {
        var G = Ra.get(e);
        if (G !== void 0) {
          var ue = Wo, he = e;
          switch (e) {
            case "keypress":
              if (ki(r) === 0) break e;
            case "keydown":
            case "keyup":
              ue = Zd;
              break;
            case "focusin":
              he = "focus", ue = $o;
              break;
            case "focusout":
              he = "blur", ue = $o;
              break;
            case "beforeblur":
            case "afterblur":
              ue = $o;
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
              ue = aa;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ue = Bd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ue = th;
              break;
            case Pa:
            case Na:
            case Aa:
              ue = Hd;
              break;
            case Ma:
              ue = rh;
              break;
            case "scroll":
              ue = zd;
              break;
            case "wheel":
              ue = oh;
              break;
            case "copy":
            case "cut":
            case "paste":
              ue = $d;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ue = ca;
          }
          var fe = (t & 4) !== 0, Oe = !fe && e === "scroll", I = fe ? G !== null ? G + "Capture" : null : G;
          fe = [];
          for (var M = B, z; M !== null; ) {
            z = M;
            var te = z.stateNode;
            if (z.tag === 5 && te !== null && (z = te, I !== null && (te = vr(M, I), te != null && fe.push(Fr(M, te, z)))), Oe) break;
            M = M.return;
          }
          0 < fe.length && (G = new ue(G, he, null, r, Q), J.push({ event: G, listeners: fe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (G = e === "mouseover" || e === "pointerover", ue = e === "mouseout" || e === "pointerout", G && r !== Eo && (he = r.relatedTarget || r.fromElement) && (En(he) || he[Ut])) break e;
          if ((ue || G) && (G = Q.window === Q ? Q : (G = Q.ownerDocument) ? G.defaultView || G.parentWindow : window, ue ? (he = r.relatedTarget || r.toElement, ue = B, he = he ? En(he) : null, he !== null && (Oe = bn(he), he !== Oe || he.tag !== 5 && he.tag !== 6) && (he = null)) : (ue = null, he = B), ue !== he)) {
            if (fe = aa, te = "onMouseLeave", I = "onMouseEnter", M = "mouse", (e === "pointerout" || e === "pointerover") && (fe = ca, te = "onPointerLeave", I = "onPointerEnter", M = "pointer"), Oe = ue == null ? G : Kn(ue), z = he == null ? G : Kn(he), G = new fe(te, M + "leave", ue, r, Q), G.target = Oe, G.relatedTarget = z, te = null, En(Q) === B && (fe = new fe(I, M + "enter", he, r, Q), fe.target = z, fe.relatedTarget = Oe, te = fe), Oe = te, ue && he) t: {
              for (fe = ue, I = he, M = 0, z = fe; z; z = Gn(z)) M++;
              for (z = 0, te = I; te; te = Gn(te)) z++;
              for (; 0 < M - z; ) fe = Gn(fe), M--;
              for (; 0 < z - M; ) I = Gn(I), z--;
              for (; M--; ) {
                if (fe === I || I !== null && fe === I.alternate) break t;
                fe = Gn(fe), I = Gn(I);
              }
              fe = null;
            }
            else fe = null;
            ue !== null && ja(J, G, ue, fe, !1), he !== null && Oe !== null && ja(J, Oe, he, fe, !0);
          }
        }
        e: {
          if (G = B ? Kn(B) : window, ue = G.nodeName && G.nodeName.toLowerCase(), ue === "select" || ue === "input" && G.type === "file") var pe = hh;
          else if (ya(G)) if (ma) pe = yh;
          else {
            pe = ph;
            var ve = fh;
          }
          else (ue = G.nodeName) && ue.toLowerCase() === "input" && (G.type === "checkbox" || G.type === "radio") && (pe = gh);
          if (pe && (pe = pe(e, B))) {
            va(J, pe, r, Q);
            break e;
          }
          ve && ve(e, G, B), e === "focusout" && (ve = G._wrapperState) && ve.controlled && G.type === "number" && yr(G, "number", G.value);
        }
        switch (ve = B ? Kn(B) : window, e) {
          case "focusin":
            (ya(ve) || ve.contentEditable === "true") && (Xn = ve, qo = B, Lr = null);
            break;
          case "focusout":
            Lr = qo = Xn = null;
            break;
          case "mousedown":
            Zo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Zo = !1, ba(J, r, Q);
            break;
          case "selectionchange":
            if (xh) break;
          case "keydown":
          case "keyup":
            ba(J, r, Q);
        }
        var me;
        if (Yo) e: {
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
        else $n ? pa(e, r) && (ke = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (ke = "onCompositionStart");
        ke && (da && r.locale !== "ko" && ($n || ke !== "onCompositionStart" ? ke === "onCompositionEnd" && $n && (me = sa()) : (on = Q, Uo = "value" in on ? on.value : on.textContent, $n = !0)), ve = Ei(B, ke), 0 < ve.length && (ke = new ua(ke, e, null, r, Q), J.push({ event: ke, listeners: ve }), me ? ke.data = me : (me = ga(r), me !== null && (ke.data = me)))), (me = lh ? ah(e, r) : uh(e, r)) && (B = Ei(B, "onBeforeInput"), 0 < B.length && (Q = new ua("onBeforeInput", "beforeinput", null, r, Q), J.push({ event: Q, listeners: B }), Q.data = me));
      }
      Ia(J, t);
    });
  }
  function Fr(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function Ei(e, t) {
    for (var r = t + "Capture", o = []; e !== null; ) {
      var l = e, u = l.stateNode;
      l.tag === 5 && u !== null && (l = u, u = vr(e, r), u != null && o.unshift(Fr(e, u, l)), u = vr(e, t), u != null && o.push(Fr(e, u, l))), e = e.return;
    }
    return o;
  }
  function Gn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ja(e, t, r, o, l) {
    for (var u = t._reactName, g = []; r !== null && r !== o; ) {
      var w = r, E = w.alternate, B = w.stateNode;
      if (E !== null && E === o) break;
      w.tag === 5 && B !== null && (w = B, l ? (E = vr(r, u), E != null && g.unshift(Fr(r, E, w))) : l || (E = vr(r, u), E != null && g.push(Fr(r, E, w)))), r = r.return;
    }
    g.length !== 0 && e.push({ event: t, listeners: g });
  }
  var _h = /\r\n?/g, Th = /\u0000|\uFFFD/g;
  function za(e) {
    return (typeof e == "string" ? e : "" + e).replace(_h, `
`).replace(Th, "");
  }
  function Pi(e, t, r) {
    if (t = za(t), za(e) !== t && r) throw Error(i(425));
  }
  function Ni() {
  }
  var is = null, os = null;
  function ss(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ls = typeof setTimeout == "function" ? setTimeout : void 0, Ch = typeof clearTimeout == "function" ? clearTimeout : void 0, Oa = typeof Promise == "function" ? Promise : void 0, bh = typeof queueMicrotask == "function" ? queueMicrotask : typeof Oa < "u" ? function(e) {
    return Oa.resolve(null).then(e).catch(Eh);
  } : ls;
  function Eh(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function as(e, t) {
    var r = t, o = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (o === 0) {
          e.removeChild(l), br(t);
          return;
        }
        o--;
      } else r !== "$" && r !== "$?" && r !== "$!" || o++;
      r = l;
    } while (r);
    br(t);
  }
  function ln(e) {
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
  function Ba(e) {
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
  var Qn = Math.random().toString(36).slice(2), Dt = "__reactFiber$" + Qn, jr = "__reactProps$" + Qn, Ut = "__reactContainer$" + Qn, us = "__reactEvents$" + Qn, Ph = "__reactListeners$" + Qn, Nh = "__reactHandles$" + Qn;
  function En(e) {
    var t = e[Dt];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[Ut] || r[Dt]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Ba(e); e !== null; ) {
          if (r = e[Dt]) return r;
          e = Ba(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function zr(e) {
    return e = e[Dt] || e[Ut], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Kn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(i(33));
  }
  function Ai(e) {
    return e[jr] || null;
  }
  var cs = [], qn = -1;
  function an(e) {
    return { current: e };
  }
  function Me(e) {
    0 > qn || (e.current = cs[qn], cs[qn] = null, qn--);
  }
  function Ne(e, t) {
    qn++, cs[qn] = e.current, e.current = t;
  }
  var un = {}, qe = an(un), ot = an(!1), Pn = un;
  function Zn(e, t) {
    var r = e.type.contextTypes;
    if (!r) return un;
    var o = e.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === t) return o.__reactInternalMemoizedMaskedChildContext;
    var l = {}, u;
    for (u in r) l[u] = t[u];
    return o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function st(e) {
    return e = e.childContextTypes, e != null;
  }
  function Mi() {
    Me(ot), Me(qe);
  }
  function Ua(e, t, r) {
    if (qe.current !== un) throw Error(i(168));
    Ne(qe, t), Ne(ot, r);
  }
  function Wa(e, t, r) {
    var o = e.stateNode;
    if (t = t.childContextTypes, typeof o.getChildContext != "function") return r;
    o = o.getChildContext();
    for (var l in o) if (!(l in t)) throw Error(i(108, Z(e) || "Unknown", l));
    return q({}, r, o);
  }
  function Ri(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || un, Pn = qe.current, Ne(qe, e), Ne(ot, ot.current), !0;
  }
  function Ha(e, t, r) {
    var o = e.stateNode;
    if (!o) throw Error(i(169));
    r ? (e = Wa(e, t, Pn), o.__reactInternalMemoizedMergedChildContext = e, Me(ot), Me(qe), Ne(qe, e)) : Me(ot), Ne(ot, r);
  }
  var Wt = null, Li = !1, ds = !1;
  function Va(e) {
    Wt === null ? Wt = [e] : Wt.push(e);
  }
  function Ah(e) {
    Li = !0, Va(e);
  }
  function cn() {
    if (!ds && Wt !== null) {
      ds = !0;
      var e = 0, t = Pe;
      try {
        var r = Wt;
        for (Pe = 1; e < r.length; e++) {
          var o = r[e];
          do
            o = o(!0);
          while (o !== null);
        }
        Wt = null, Li = !1;
      } catch (l) {
        throw Wt !== null && (Wt = Wt.slice(e + 1)), Xl(Lo, cn), l;
      } finally {
        Pe = t, ds = !1;
      }
    }
    return null;
  }
  var Jn = [], er = 0, Di = null, Ii = 0, mt = [], xt = 0, Nn = null, Ht = 1, Vt = "";
  function An(e, t) {
    Jn[er++] = Ii, Jn[er++] = Di, Di = e, Ii = t;
  }
  function $a(e, t, r) {
    mt[xt++] = Ht, mt[xt++] = Vt, mt[xt++] = Nn, Nn = e;
    var o = Ht;
    e = Vt;
    var l = 32 - Tt(o) - 1;
    o &= ~(1 << l), r += 1;
    var u = 32 - Tt(t) + l;
    if (30 < u) {
      var g = l - l % 5;
      u = (o & (1 << g) - 1).toString(32), o >>= g, l -= g, Ht = 1 << 32 - Tt(t) + l | r << l | o, Vt = u + e;
    } else Ht = 1 << u | r << l | o, Vt = e;
  }
  function hs(e) {
    e.return !== null && (An(e, 1), $a(e, 1, 0));
  }
  function fs(e) {
    for (; e === Di; ) Di = Jn[--er], Jn[er] = null, Ii = Jn[--er], Jn[er] = null;
    for (; e === Nn; ) Nn = mt[--xt], mt[xt] = null, Vt = mt[--xt], mt[xt] = null, Ht = mt[--xt], mt[xt] = null;
  }
  var pt = null, gt = null, Le = !1, bt = null;
  function Xa(e, t) {
    var r = _t(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Ya(e, t) {
    switch (e.tag) {
      case 5:
        var r = e.type;
        return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, pt = e, gt = ln(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, pt = e, gt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (r = Nn !== null ? { id: Ht, overflow: Vt } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = _t(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, pt = e, gt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function ps(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function gs(e) {
    if (Le) {
      var t = gt;
      if (t) {
        var r = t;
        if (!Ya(e, t)) {
          if (ps(e)) throw Error(i(418));
          t = ln(r.nextSibling);
          var o = pt;
          t && Ya(e, t) ? Xa(o, r) : (e.flags = e.flags & -4097 | 2, Le = !1, pt = e);
        }
      } else {
        if (ps(e)) throw Error(i(418));
        e.flags = e.flags & -4097 | 2, Le = !1, pt = e;
      }
    }
  }
  function Ga(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    pt = e;
  }
  function Fi(e) {
    if (e !== pt) return !1;
    if (!Le) return Ga(e), Le = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ss(e.type, e.memoizedProps)), t && (t = gt)) {
      if (ps(e)) throw Qa(), Error(i(418));
      for (; t; ) Xa(e, t), t = ln(t.nextSibling);
    }
    if (Ga(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var r = e.data;
            if (r === "/$") {
              if (t === 0) {
                gt = ln(e.nextSibling);
                break e;
              }
              t--;
            } else r !== "$" && r !== "$!" && r !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        gt = null;
      }
    } else gt = pt ? ln(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Qa() {
    for (var e = gt; e; ) e = ln(e.nextSibling);
  }
  function tr() {
    gt = pt = null, Le = !1;
  }
  function ys(e) {
    bt === null ? bt = [e] : bt.push(e);
  }
  var Mh = U.ReactCurrentBatchConfig;
  function Or(e, t, r) {
    if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (r._owner) {
        if (r = r._owner, r) {
          if (r.tag !== 1) throw Error(i(309));
          var o = r.stateNode;
        }
        if (!o) throw Error(i(147, e));
        var l = o, u = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === u ? t.ref : (t = function(g) {
          var w = l.refs;
          g === null ? delete w[u] : w[u] = g;
        }, t._stringRef = u, t);
      }
      if (typeof e != "string") throw Error(i(284));
      if (!r._owner) throw Error(i(290, e));
    }
    return e;
  }
  function ji(e, t) {
    throw e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Ka(e) {
    var t = e._init;
    return t(e._payload);
  }
  function qa(e) {
    function t(I, M) {
      if (e) {
        var z = I.deletions;
        z === null ? (I.deletions = [M], I.flags |= 16) : z.push(M);
      }
    }
    function r(I, M) {
      if (!e) return null;
      for (; M !== null; ) t(I, M), M = M.sibling;
      return null;
    }
    function o(I, M) {
      for (I = /* @__PURE__ */ new Map(); M !== null; ) M.key !== null ? I.set(M.key, M) : I.set(M.index, M), M = M.sibling;
      return I;
    }
    function l(I, M) {
      return I = mn(I, M), I.index = 0, I.sibling = null, I;
    }
    function u(I, M, z) {
      return I.index = z, e ? (z = I.alternate, z !== null ? (z = z.index, z < M ? (I.flags |= 2, M) : z) : (I.flags |= 2, M)) : (I.flags |= 1048576, M);
    }
    function g(I) {
      return e && I.alternate === null && (I.flags |= 2), I;
    }
    function w(I, M, z, te) {
      return M === null || M.tag !== 6 ? (M = ll(z, I.mode, te), M.return = I, M) : (M = l(M, z), M.return = I, M);
    }
    function E(I, M, z, te) {
      var pe = z.type;
      return pe === A ? Q(I, M, z.props.children, te, z.key) : M !== null && (M.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === K && Ka(pe) === M.type) ? (te = l(M, z.props), te.ref = Or(I, M, z), te.return = I, te) : (te = lo(z.type, z.key, z.props, null, I.mode, te), te.ref = Or(I, M, z), te.return = I, te);
    }
    function B(I, M, z, te) {
      return M === null || M.tag !== 4 || M.stateNode.containerInfo !== z.containerInfo || M.stateNode.implementation !== z.implementation ? (M = al(z, I.mode, te), M.return = I, M) : (M = l(M, z.children || []), M.return = I, M);
    }
    function Q(I, M, z, te, pe) {
      return M === null || M.tag !== 7 ? (M = zn(z, I.mode, te, pe), M.return = I, M) : (M = l(M, z), M.return = I, M);
    }
    function J(I, M, z) {
      if (typeof M == "string" && M !== "" || typeof M == "number") return M = ll("" + M, I.mode, z), M.return = I, M;
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case H:
            return z = lo(M.type, M.key, M.props, null, I.mode, z), z.ref = Or(I, null, M), z.return = I, z;
          case Y:
            return M = al(M, I.mode, z), M.return = I, M;
          case K:
            var te = M._init;
            return J(I, te(M._payload), z);
        }
        if (we(M) || W(M)) return M = zn(M, I.mode, z, null), M.return = I, M;
        ji(I, M);
      }
      return null;
    }
    function G(I, M, z, te) {
      var pe = M !== null ? M.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return pe !== null ? null : w(I, M, "" + z, te);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case H:
            return z.key === pe ? E(I, M, z, te) : null;
          case Y:
            return z.key === pe ? B(I, M, z, te) : null;
          case K:
            return pe = z._init, G(
              I,
              M,
              pe(z._payload),
              te
            );
        }
        if (we(z) || W(z)) return pe !== null ? null : Q(I, M, z, te, null);
        ji(I, z);
      }
      return null;
    }
    function ue(I, M, z, te, pe) {
      if (typeof te == "string" && te !== "" || typeof te == "number") return I = I.get(z) || null, w(M, I, "" + te, pe);
      if (typeof te == "object" && te !== null) {
        switch (te.$$typeof) {
          case H:
            return I = I.get(te.key === null ? z : te.key) || null, E(M, I, te, pe);
          case Y:
            return I = I.get(te.key === null ? z : te.key) || null, B(M, I, te, pe);
          case K:
            var ve = te._init;
            return ue(I, M, z, ve(te._payload), pe);
        }
        if (we(te) || W(te)) return I = I.get(z) || null, Q(M, I, te, pe, null);
        ji(M, te);
      }
      return null;
    }
    function he(I, M, z, te) {
      for (var pe = null, ve = null, me = M, ke = M = 0, Ye = null; me !== null && ke < z.length; ke++) {
        me.index > ke ? (Ye = me, me = null) : Ye = me.sibling;
        var Ce = G(I, me, z[ke], te);
        if (Ce === null) {
          me === null && (me = Ye);
          break;
        }
        e && me && Ce.alternate === null && t(I, me), M = u(Ce, M, ke), ve === null ? pe = Ce : ve.sibling = Ce, ve = Ce, me = Ye;
      }
      if (ke === z.length) return r(I, me), Le && An(I, ke), pe;
      if (me === null) {
        for (; ke < z.length; ke++) me = J(I, z[ke], te), me !== null && (M = u(me, M, ke), ve === null ? pe = me : ve.sibling = me, ve = me);
        return Le && An(I, ke), pe;
      }
      for (me = o(I, me); ke < z.length; ke++) Ye = ue(me, I, ke, z[ke], te), Ye !== null && (e && Ye.alternate !== null && me.delete(Ye.key === null ? ke : Ye.key), M = u(Ye, M, ke), ve === null ? pe = Ye : ve.sibling = Ye, ve = Ye);
      return e && me.forEach(function(xn) {
        return t(I, xn);
      }), Le && An(I, ke), pe;
    }
    function fe(I, M, z, te) {
      var pe = W(z);
      if (typeof pe != "function") throw Error(i(150));
      if (z = pe.call(z), z == null) throw Error(i(151));
      for (var ve = pe = null, me = M, ke = M = 0, Ye = null, Ce = z.next(); me !== null && !Ce.done; ke++, Ce = z.next()) {
        me.index > ke ? (Ye = me, me = null) : Ye = me.sibling;
        var xn = G(I, me, Ce.value, te);
        if (xn === null) {
          me === null && (me = Ye);
          break;
        }
        e && me && xn.alternate === null && t(I, me), M = u(xn, M, ke), ve === null ? pe = xn : ve.sibling = xn, ve = xn, me = Ye;
      }
      if (Ce.done) return r(
        I,
        me
      ), Le && An(I, ke), pe;
      if (me === null) {
        for (; !Ce.done; ke++, Ce = z.next()) Ce = J(I, Ce.value, te), Ce !== null && (M = u(Ce, M, ke), ve === null ? pe = Ce : ve.sibling = Ce, ve = Ce);
        return Le && An(I, ke), pe;
      }
      for (me = o(I, me); !Ce.done; ke++, Ce = z.next()) Ce = ue(me, I, ke, Ce.value, te), Ce !== null && (e && Ce.alternate !== null && me.delete(Ce.key === null ? ke : Ce.key), M = u(Ce, M, ke), ve === null ? pe = Ce : ve.sibling = Ce, ve = Ce);
      return e && me.forEach(function(df) {
        return t(I, df);
      }), Le && An(I, ke), pe;
    }
    function Oe(I, M, z, te) {
      if (typeof z == "object" && z !== null && z.type === A && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case H:
            e: {
              for (var pe = z.key, ve = M; ve !== null; ) {
                if (ve.key === pe) {
                  if (pe = z.type, pe === A) {
                    if (ve.tag === 7) {
                      r(I, ve.sibling), M = l(ve, z.props.children), M.return = I, I = M;
                      break e;
                    }
                  } else if (ve.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === K && Ka(pe) === ve.type) {
                    r(I, ve.sibling), M = l(ve, z.props), M.ref = Or(I, ve, z), M.return = I, I = M;
                    break e;
                  }
                  r(I, ve);
                  break;
                } else t(I, ve);
                ve = ve.sibling;
              }
              z.type === A ? (M = zn(z.props.children, I.mode, te, z.key), M.return = I, I = M) : (te = lo(z.type, z.key, z.props, null, I.mode, te), te.ref = Or(I, M, z), te.return = I, I = te);
            }
            return g(I);
          case Y:
            e: {
              for (ve = z.key; M !== null; ) {
                if (M.key === ve) if (M.tag === 4 && M.stateNode.containerInfo === z.containerInfo && M.stateNode.implementation === z.implementation) {
                  r(I, M.sibling), M = l(M, z.children || []), M.return = I, I = M;
                  break e;
                } else {
                  r(I, M);
                  break;
                }
                else t(I, M);
                M = M.sibling;
              }
              M = al(z, I.mode, te), M.return = I, I = M;
            }
            return g(I);
          case K:
            return ve = z._init, Oe(I, M, ve(z._payload), te);
        }
        if (we(z)) return he(I, M, z, te);
        if (W(z)) return fe(I, M, z, te);
        ji(I, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, M !== null && M.tag === 6 ? (r(I, M.sibling), M = l(M, z), M.return = I, I = M) : (r(I, M), M = ll(z, I.mode, te), M.return = I, I = M), g(I)) : r(I, M);
    }
    return Oe;
  }
  var nr = qa(!0), Za = qa(!1), zi = an(null), Oi = null, rr = null, vs = null;
  function ms() {
    vs = rr = Oi = null;
  }
  function xs(e) {
    var t = zi.current;
    Me(zi), e._currentValue = t;
  }
  function ks(e, t, r) {
    for (; e !== null; ) {
      var o = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, o !== null && (o.childLanes |= t)) : o !== null && (o.childLanes & t) !== t && (o.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function ir(e, t) {
    Oi = e, vs = rr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (lt = !0), e.firstContext = null);
  }
  function kt(e) {
    var t = e._currentValue;
    if (vs !== e) if (e = { context: e, memoizedValue: t, next: null }, rr === null) {
      if (Oi === null) throw Error(i(308));
      rr = e, Oi.dependencies = { lanes: 0, firstContext: e };
    } else rr = rr.next = e;
    return t;
  }
  var Mn = null;
  function Ss(e) {
    Mn === null ? Mn = [e] : Mn.push(e);
  }
  function Ja(e, t, r, o) {
    var l = t.interleaved;
    return l === null ? (r.next = r, Ss(t)) : (r.next = l.next, l.next = r), t.interleaved = r, $t(e, o);
  }
  function $t(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var dn = !1;
  function ws(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function eu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Xt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function hn(e, t, r) {
    var o = e.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (Te & 2) !== 0) {
      var l = o.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), o.pending = t, $t(e, r);
    }
    return l = o.interleaved, l === null ? (t.next = t, Ss(o)) : (t.next = l.next, l.next = t), o.interleaved = t, $t(e, r);
  }
  function Bi(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var o = t.lanes;
      o &= e.pendingLanes, r |= o, t.lanes = r, Fo(e, r);
    }
  }
  function tu(e, t) {
    var r = e.updateQueue, o = e.alternate;
    if (o !== null && (o = o.updateQueue, r === o)) {
      var l = null, u = null;
      if (r = r.firstBaseUpdate, r !== null) {
        do {
          var g = { eventTime: r.eventTime, lane: r.lane, tag: r.tag, payload: r.payload, callback: r.callback, next: null };
          u === null ? l = u = g : u = u.next = g, r = r.next;
        } while (r !== null);
        u === null ? l = u = t : u = u.next = t;
      } else l = u = t;
      r = { baseState: o.baseState, firstBaseUpdate: l, lastBaseUpdate: u, shared: o.shared, effects: o.effects }, e.updateQueue = r;
      return;
    }
    e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
  }
  function Ui(e, t, r, o) {
    var l = e.updateQueue;
    dn = !1;
    var u = l.firstBaseUpdate, g = l.lastBaseUpdate, w = l.shared.pending;
    if (w !== null) {
      l.shared.pending = null;
      var E = w, B = E.next;
      E.next = null, g === null ? u = B : g.next = B, g = E;
      var Q = e.alternate;
      Q !== null && (Q = Q.updateQueue, w = Q.lastBaseUpdate, w !== g && (w === null ? Q.firstBaseUpdate = B : w.next = B, Q.lastBaseUpdate = E));
    }
    if (u !== null) {
      var J = l.baseState;
      g = 0, Q = B = E = null, w = u;
      do {
        var G = w.lane, ue = w.eventTime;
        if ((o & G) === G) {
          Q !== null && (Q = Q.next = {
            eventTime: ue,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var he = e, fe = w;
            switch (G = t, ue = r, fe.tag) {
              case 1:
                if (he = fe.payload, typeof he == "function") {
                  J = he.call(ue, J, G);
                  break e;
                }
                J = he;
                break e;
              case 3:
                he.flags = he.flags & -65537 | 128;
              case 0:
                if (he = fe.payload, G = typeof he == "function" ? he.call(ue, J, G) : he, G == null) break e;
                J = q({}, J, G);
                break e;
              case 2:
                dn = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (e.flags |= 64, G = l.effects, G === null ? l.effects = [w] : G.push(w));
        } else ue = { eventTime: ue, lane: G, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, Q === null ? (B = Q = ue, E = J) : Q = Q.next = ue, g |= G;
        if (w = w.next, w === null) {
          if (w = l.shared.pending, w === null) break;
          G = w, w = G.next, G.next = null, l.lastBaseUpdate = G, l.shared.pending = null;
        }
      } while (!0);
      if (Q === null && (E = J), l.baseState = E, l.firstBaseUpdate = B, l.lastBaseUpdate = Q, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          g |= l.lane, l = l.next;
        while (l !== t);
      } else u === null && (l.shared.lanes = 0);
      Dn |= g, e.lanes = g, e.memoizedState = J;
    }
  }
  function nu(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var o = e[t], l = o.callback;
      if (l !== null) {
        if (o.callback = null, o = r, typeof l != "function") throw Error(i(191, l));
        l.call(o);
      }
    }
  }
  var Br = {}, It = an(Br), Ur = an(Br), Wr = an(Br);
  function Rn(e) {
    if (e === Br) throw Error(i(174));
    return e;
  }
  function _s(e, t) {
    switch (Ne(Wr, t), Ne(Ur, e), Ne(It, Br), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : dt(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = dt(t, e);
    }
    Me(It), Ne(It, t);
  }
  function or() {
    Me(It), Me(Ur), Me(Wr);
  }
  function ru(e) {
    Rn(Wr.current);
    var t = Rn(It.current), r = dt(t, e.type);
    t !== r && (Ne(Ur, e), Ne(It, r));
  }
  function Ts(e) {
    Ur.current === e && (Me(It), Me(Ur));
  }
  var Ie = an(0);
  function Wi(e) {
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
  var Cs = [];
  function bs() {
    for (var e = 0; e < Cs.length; e++) Cs[e]._workInProgressVersionPrimary = null;
    Cs.length = 0;
  }
  var Hi = U.ReactCurrentDispatcher, Es = U.ReactCurrentBatchConfig, Ln = 0, Fe = null, He = null, $e = null, Vi = !1, Hr = !1, Vr = 0, Rh = 0;
  function Ze() {
    throw Error(i(321));
  }
  function Ps(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!Ct(e[r], t[r])) return !1;
    return !0;
  }
  function Ns(e, t, r, o, l, u) {
    if (Ln = u, Fe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Hi.current = e === null || e.memoizedState === null ? Fh : jh, e = r(o, l), Hr) {
      u = 0;
      do {
        if (Hr = !1, Vr = 0, 25 <= u) throw Error(i(301));
        u += 1, $e = He = null, t.updateQueue = null, Hi.current = zh, e = r(o, l);
      } while (Hr);
    }
    if (Hi.current = Yi, t = He !== null && He.next !== null, Ln = 0, $e = He = Fe = null, Vi = !1, t) throw Error(i(300));
    return e;
  }
  function As() {
    var e = Vr !== 0;
    return Vr = 0, e;
  }
  function Ft() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return $e === null ? Fe.memoizedState = $e = e : $e = $e.next = e, $e;
  }
  function St() {
    if (He === null) {
      var e = Fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = He.next;
    var t = $e === null ? Fe.memoizedState : $e.next;
    if (t !== null) $e = t, He = e;
    else {
      if (e === null) throw Error(i(310));
      He = e, e = { memoizedState: He.memoizedState, baseState: He.baseState, baseQueue: He.baseQueue, queue: He.queue, next: null }, $e === null ? Fe.memoizedState = $e = e : $e = $e.next = e;
    }
    return $e;
  }
  function $r(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ms(e) {
    var t = St(), r = t.queue;
    if (r === null) throw Error(i(311));
    r.lastRenderedReducer = e;
    var o = He, l = o.baseQueue, u = r.pending;
    if (u !== null) {
      if (l !== null) {
        var g = l.next;
        l.next = u.next, u.next = g;
      }
      o.baseQueue = l = u, r.pending = null;
    }
    if (l !== null) {
      u = l.next, o = o.baseState;
      var w = g = null, E = null, B = u;
      do {
        var Q = B.lane;
        if ((Ln & Q) === Q) E !== null && (E = E.next = { lane: 0, action: B.action, hasEagerState: B.hasEagerState, eagerState: B.eagerState, next: null }), o = B.hasEagerState ? B.eagerState : e(o, B.action);
        else {
          var J = {
            lane: Q,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          };
          E === null ? (w = E = J, g = o) : E = E.next = J, Fe.lanes |= Q, Dn |= Q;
        }
        B = B.next;
      } while (B !== null && B !== u);
      E === null ? g = o : E.next = w, Ct(o, t.memoizedState) || (lt = !0), t.memoizedState = o, t.baseState = g, t.baseQueue = E, r.lastRenderedState = o;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        u = l.lane, Fe.lanes |= u, Dn |= u, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function Rs(e) {
    var t = St(), r = t.queue;
    if (r === null) throw Error(i(311));
    r.lastRenderedReducer = e;
    var o = r.dispatch, l = r.pending, u = t.memoizedState;
    if (l !== null) {
      r.pending = null;
      var g = l = l.next;
      do
        u = e(u, g.action), g = g.next;
      while (g !== l);
      Ct(u, t.memoizedState) || (lt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), r.lastRenderedState = u;
    }
    return [u, o];
  }
  function iu() {
  }
  function ou(e, t) {
    var r = Fe, o = St(), l = t(), u = !Ct(o.memoizedState, l);
    if (u && (o.memoizedState = l, lt = !0), o = o.queue, Ls(au.bind(null, r, o, e), [e]), o.getSnapshot !== t || u || $e !== null && $e.memoizedState.tag & 1) {
      if (r.flags |= 2048, Xr(9, lu.bind(null, r, o, l, t), void 0, null), Xe === null) throw Error(i(349));
      (Ln & 30) !== 0 || su(r, t, l);
    }
    return l;
  }
  function su(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = Fe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Fe.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function lu(e, t, r, o) {
    t.value = r, t.getSnapshot = o, uu(t) && cu(e);
  }
  function au(e, t, r) {
    return r(function() {
      uu(t) && cu(e);
    });
  }
  function uu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !Ct(e, r);
    } catch {
      return !0;
    }
  }
  function cu(e) {
    var t = $t(e, 1);
    t !== null && At(t, e, 1, -1);
  }
  function du(e) {
    var t = Ft();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: $r, lastRenderedState: e }, t.queue = e, e = e.dispatch = Ih.bind(null, Fe, e), [t.memoizedState, e];
  }
  function Xr(e, t, r, o) {
    return e = { tag: e, create: t, destroy: r, deps: o, next: null }, t = Fe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Fe.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (o = r.next, r.next = e, e.next = o, t.lastEffect = e)), e;
  }
  function hu() {
    return St().memoizedState;
  }
  function $i(e, t, r, o) {
    var l = Ft();
    Fe.flags |= e, l.memoizedState = Xr(1 | t, r, void 0, o === void 0 ? null : o);
  }
  function Xi(e, t, r, o) {
    var l = St();
    o = o === void 0 ? null : o;
    var u = void 0;
    if (He !== null) {
      var g = He.memoizedState;
      if (u = g.destroy, o !== null && Ps(o, g.deps)) {
        l.memoizedState = Xr(t, r, u, o);
        return;
      }
    }
    Fe.flags |= e, l.memoizedState = Xr(1 | t, r, u, o);
  }
  function fu(e, t) {
    return $i(8390656, 8, e, t);
  }
  function Ls(e, t) {
    return Xi(2048, 8, e, t);
  }
  function pu(e, t) {
    return Xi(4, 2, e, t);
  }
  function gu(e, t) {
    return Xi(4, 4, e, t);
  }
  function yu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function vu(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Xi(4, 4, yu.bind(null, t, e), r);
  }
  function Ds() {
  }
  function mu(e, t) {
    var r = St();
    t = t === void 0 ? null : t;
    var o = r.memoizedState;
    return o !== null && t !== null && Ps(t, o[1]) ? o[0] : (r.memoizedState = [e, t], e);
  }
  function xu(e, t) {
    var r = St();
    t = t === void 0 ? null : t;
    var o = r.memoizedState;
    return o !== null && t !== null && Ps(t, o[1]) ? o[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function ku(e, t, r) {
    return (Ln & 21) === 0 ? (e.baseState && (e.baseState = !1, lt = !0), e.memoizedState = r) : (Ct(r, t) || (r = Kl(), Fe.lanes |= r, Dn |= r, e.baseState = !0), t);
  }
  function Lh(e, t) {
    var r = Pe;
    Pe = r !== 0 && 4 > r ? r : 4, e(!0);
    var o = Es.transition;
    Es.transition = {};
    try {
      e(!1), t();
    } finally {
      Pe = r, Es.transition = o;
    }
  }
  function Su() {
    return St().memoizedState;
  }
  function Dh(e, t, r) {
    var o = yn(e);
    if (r = { lane: o, action: r, hasEagerState: !1, eagerState: null, next: null }, wu(e)) _u(t, r);
    else if (r = Ja(e, t, r, o), r !== null) {
      var l = nt();
      At(r, e, o, l), Tu(r, t, o);
    }
  }
  function Ih(e, t, r) {
    var o = yn(e), l = { lane: o, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (wu(e)) _u(t, l);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null)) try {
        var g = t.lastRenderedState, w = u(g, r);
        if (l.hasEagerState = !0, l.eagerState = w, Ct(w, g)) {
          var E = t.interleaved;
          E === null ? (l.next = l, Ss(t)) : (l.next = E.next, E.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = Ja(e, t, l, o), r !== null && (l = nt(), At(r, e, o, l), Tu(r, t, o));
    }
  }
  function wu(e) {
    var t = e.alternate;
    return e === Fe || t !== null && t === Fe;
  }
  function _u(e, t) {
    Hr = Vi = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function Tu(e, t, r) {
    if ((r & 4194240) !== 0) {
      var o = t.lanes;
      o &= e.pendingLanes, r |= o, t.lanes = r, Fo(e, r);
    }
  }
  var Yi = { readContext: kt, useCallback: Ze, useContext: Ze, useEffect: Ze, useImperativeHandle: Ze, useInsertionEffect: Ze, useLayoutEffect: Ze, useMemo: Ze, useReducer: Ze, useRef: Ze, useState: Ze, useDebugValue: Ze, useDeferredValue: Ze, useTransition: Ze, useMutableSource: Ze, useSyncExternalStore: Ze, useId: Ze, unstable_isNewReconciler: !1 }, Fh = { readContext: kt, useCallback: function(e, t) {
    return Ft().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: kt, useEffect: fu, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, $i(
      4194308,
      4,
      yu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return $i(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return $i(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = Ft();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var o = Ft();
    return t = r !== void 0 ? r(t) : t, o.memoizedState = o.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, o.queue = e, e = e.dispatch = Dh.bind(null, Fe, e), [o.memoizedState, e];
  }, useRef: function(e) {
    var t = Ft();
    return e = { current: e }, t.memoizedState = e;
  }, useState: du, useDebugValue: Ds, useDeferredValue: function(e) {
    return Ft().memoizedState = e;
  }, useTransition: function() {
    var e = du(!1), t = e[0];
    return e = Lh.bind(null, e[1]), Ft().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var o = Fe, l = Ft();
    if (Le) {
      if (r === void 0) throw Error(i(407));
      r = r();
    } else {
      if (r = t(), Xe === null) throw Error(i(349));
      (Ln & 30) !== 0 || su(o, t, r);
    }
    l.memoizedState = r;
    var u = { value: r, getSnapshot: t };
    return l.queue = u, fu(au.bind(
      null,
      o,
      u,
      e
    ), [e]), o.flags |= 2048, Xr(9, lu.bind(null, o, u, r, t), void 0, null), r;
  }, useId: function() {
    var e = Ft(), t = Xe.identifierPrefix;
    if (Le) {
      var r = Vt, o = Ht;
      r = (o & ~(1 << 32 - Tt(o) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Vr++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = Rh++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, jh = {
    readContext: kt,
    useCallback: mu,
    useContext: kt,
    useEffect: Ls,
    useImperativeHandle: vu,
    useInsertionEffect: pu,
    useLayoutEffect: gu,
    useMemo: xu,
    useReducer: Ms,
    useRef: hu,
    useState: function() {
      return Ms($r);
    },
    useDebugValue: Ds,
    useDeferredValue: function(e) {
      var t = St();
      return ku(t, He.memoizedState, e);
    },
    useTransition: function() {
      var e = Ms($r)[0], t = St().memoizedState;
      return [e, t];
    },
    useMutableSource: iu,
    useSyncExternalStore: ou,
    useId: Su,
    unstable_isNewReconciler: !1
  }, zh = { readContext: kt, useCallback: mu, useContext: kt, useEffect: Ls, useImperativeHandle: vu, useInsertionEffect: pu, useLayoutEffect: gu, useMemo: xu, useReducer: Rs, useRef: hu, useState: function() {
    return Rs($r);
  }, useDebugValue: Ds, useDeferredValue: function(e) {
    var t = St();
    return He === null ? t.memoizedState = e : ku(t, He.memoizedState, e);
  }, useTransition: function() {
    var e = Rs($r)[0], t = St().memoizedState;
    return [e, t];
  }, useMutableSource: iu, useSyncExternalStore: ou, useId: Su, unstable_isNewReconciler: !1 };
  function Et(e, t) {
    if (e && e.defaultProps) {
      t = q({}, t), e = e.defaultProps;
      for (var r in e) t[r] === void 0 && (t[r] = e[r]);
      return t;
    }
    return t;
  }
  function Is(e, t, r, o) {
    t = e.memoizedState, r = r(o, t), r = r == null ? t : q({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
  }
  var Gi = { isMounted: function(e) {
    return (e = e._reactInternals) ? bn(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var o = nt(), l = yn(e), u = Xt(o, l);
    u.payload = t, r != null && (u.callback = r), t = hn(e, u, l), t !== null && (At(t, e, l, o), Bi(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var o = nt(), l = yn(e), u = Xt(o, l);
    u.tag = 1, u.payload = t, r != null && (u.callback = r), t = hn(e, u, l), t !== null && (At(t, e, l, o), Bi(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = nt(), o = yn(e), l = Xt(r, o);
    l.tag = 2, t != null && (l.callback = t), t = hn(e, l, o), t !== null && (At(t, e, o, r), Bi(t, e, o));
  } };
  function Cu(e, t, r, o, l, u, g) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(o, u, g) : t.prototype && t.prototype.isPureReactComponent ? !Rr(r, o) || !Rr(l, u) : !0;
  }
  function bu(e, t, r) {
    var o = !1, l = un, u = t.contextType;
    return typeof u == "object" && u !== null ? u = kt(u) : (l = st(t) ? Pn : qe.current, o = t.contextTypes, u = (o = o != null) ? Zn(e, l) : un), t = new t(r, u), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Gi, e.stateNode = t, t._reactInternals = e, o && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = u), t;
  }
  function Eu(e, t, r, o) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, o), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, o), t.state !== e && Gi.enqueueReplaceState(t, t.state, null);
  }
  function Fs(e, t, r, o) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, ws(e);
    var u = t.contextType;
    typeof u == "object" && u !== null ? l.context = kt(u) : (u = st(t) ? Pn : qe.current, l.context = Zn(e, u)), l.state = e.memoizedState, u = t.getDerivedStateFromProps, typeof u == "function" && (Is(e, t, u, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Gi.enqueueReplaceState(l, l.state, null), Ui(e, r, l, o), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function sr(e, t) {
    try {
      var r = "", o = t;
      do
        r += xe(o), o = o.return;
      while (o);
      var l = r;
    } catch (u) {
      l = `
Error generating stack: ` + u.message + `
` + u.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function js(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function zs(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Oh = typeof WeakMap == "function" ? WeakMap : Map;
  function Pu(e, t, r) {
    r = Xt(-1, r), r.tag = 3, r.payload = { element: null };
    var o = t.value;
    return r.callback = function() {
      to || (to = !0, Js = o), zs(e, t);
    }, r;
  }
  function Nu(e, t, r) {
    r = Xt(-1, r), r.tag = 3;
    var o = e.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var l = t.value;
      r.payload = function() {
        return o(l);
      }, r.callback = function() {
        zs(e, t);
      };
    }
    var u = e.stateNode;
    return u !== null && typeof u.componentDidCatch == "function" && (r.callback = function() {
      zs(e, t), typeof o != "function" && (pn === null ? pn = /* @__PURE__ */ new Set([this]) : pn.add(this));
      var g = t.stack;
      this.componentDidCatch(t.value, { componentStack: g !== null ? g : "" });
    }), r;
  }
  function Au(e, t, r) {
    var o = e.pingCache;
    if (o === null) {
      o = e.pingCache = new Oh();
      var l = /* @__PURE__ */ new Set();
      o.set(t, l);
    } else l = o.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), o.set(t, l));
    l.has(r) || (l.add(r), e = Jh.bind(null, e, t, r), t.then(e, e));
  }
  function Mu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Ru(e, t, r, o, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = Xt(-1, 1), t.tag = 2, hn(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Bh = U.ReactCurrentOwner, lt = !1;
  function tt(e, t, r, o) {
    t.child = e === null ? Za(t, null, r, o) : nr(t, e.child, r, o);
  }
  function Lu(e, t, r, o, l) {
    r = r.render;
    var u = t.ref;
    return ir(t, l), o = Ns(e, t, r, o, u, l), r = As(), e !== null && !lt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Yt(e, t, l)) : (Le && r && hs(t), t.flags |= 1, tt(e, t, o, l), t.child);
  }
  function Du(e, t, r, o, l) {
    if (e === null) {
      var u = r.type;
      return typeof u == "function" && !sl(u) && u.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = u, Iu(e, t, u, o, l)) : (e = lo(r.type, null, o, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, (e.lanes & l) === 0) {
      var g = u.memoizedProps;
      if (r = r.compare, r = r !== null ? r : Rr, r(g, o) && e.ref === t.ref) return Yt(e, t, l);
    }
    return t.flags |= 1, e = mn(u, o), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Iu(e, t, r, o, l) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Rr(u, o) && e.ref === t.ref) if (lt = !1, t.pendingProps = o = u, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (lt = !0);
      else return t.lanes = e.lanes, Yt(e, t, l);
    }
    return Os(e, t, r, o, l);
  }
  function Fu(e, t, r) {
    var o = t.pendingProps, l = o.children, u = e !== null ? e.memoizedState : null;
    if (o.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ne(ar, yt), yt |= r;
    else {
      if ((r & 1073741824) === 0) return e = u !== null ? u.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ne(ar, yt), yt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = u !== null ? u.baseLanes : r, Ne(ar, yt), yt |= o;
    }
    else u !== null ? (o = u.baseLanes | r, t.memoizedState = null) : o = r, Ne(ar, yt), yt |= o;
    return tt(e, t, l, r), t.child;
  }
  function ju(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Os(e, t, r, o, l) {
    var u = st(r) ? Pn : qe.current;
    return u = Zn(t, u), ir(t, l), r = Ns(e, t, r, o, u, l), o = As(), e !== null && !lt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Yt(e, t, l)) : (Le && o && hs(t), t.flags |= 1, tt(e, t, r, l), t.child);
  }
  function zu(e, t, r, o, l) {
    if (st(r)) {
      var u = !0;
      Ri(t);
    } else u = !1;
    if (ir(t, l), t.stateNode === null) Ki(e, t), bu(t, r, o), Fs(t, r, o, l), o = !0;
    else if (e === null) {
      var g = t.stateNode, w = t.memoizedProps;
      g.props = w;
      var E = g.context, B = r.contextType;
      typeof B == "object" && B !== null ? B = kt(B) : (B = st(r) ? Pn : qe.current, B = Zn(t, B));
      var Q = r.getDerivedStateFromProps, J = typeof Q == "function" || typeof g.getSnapshotBeforeUpdate == "function";
      J || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (w !== o || E !== B) && Eu(t, g, o, B), dn = !1;
      var G = t.memoizedState;
      g.state = G, Ui(t, o, g, l), E = t.memoizedState, w !== o || G !== E || ot.current || dn ? (typeof Q == "function" && (Is(t, r, Q, o), E = t.memoizedState), (w = dn || Cu(t, r, w, o, G, E, B)) ? (J || typeof g.UNSAFE_componentWillMount != "function" && typeof g.componentWillMount != "function" || (typeof g.componentWillMount == "function" && g.componentWillMount(), typeof g.UNSAFE_componentWillMount == "function" && g.UNSAFE_componentWillMount()), typeof g.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof g.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = o, t.memoizedState = E), g.props = o, g.state = E, g.context = B, o = w) : (typeof g.componentDidMount == "function" && (t.flags |= 4194308), o = !1);
    } else {
      g = t.stateNode, eu(e, t), w = t.memoizedProps, B = t.type === t.elementType ? w : Et(t.type, w), g.props = B, J = t.pendingProps, G = g.context, E = r.contextType, typeof E == "object" && E !== null ? E = kt(E) : (E = st(r) ? Pn : qe.current, E = Zn(t, E));
      var ue = r.getDerivedStateFromProps;
      (Q = typeof ue == "function" || typeof g.getSnapshotBeforeUpdate == "function") || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (w !== J || G !== E) && Eu(t, g, o, E), dn = !1, G = t.memoizedState, g.state = G, Ui(t, o, g, l);
      var he = t.memoizedState;
      w !== J || G !== he || ot.current || dn ? (typeof ue == "function" && (Is(t, r, ue, o), he = t.memoizedState), (B = dn || Cu(t, r, B, o, G, he, E) || !1) ? (Q || typeof g.UNSAFE_componentWillUpdate != "function" && typeof g.componentWillUpdate != "function" || (typeof g.componentWillUpdate == "function" && g.componentWillUpdate(o, he, E), typeof g.UNSAFE_componentWillUpdate == "function" && g.UNSAFE_componentWillUpdate(o, he, E)), typeof g.componentDidUpdate == "function" && (t.flags |= 4), typeof g.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof g.componentDidUpdate != "function" || w === e.memoizedProps && G === e.memoizedState || (t.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && G === e.memoizedState || (t.flags |= 1024), t.memoizedProps = o, t.memoizedState = he), g.props = o, g.state = he, g.context = E, o = B) : (typeof g.componentDidUpdate != "function" || w === e.memoizedProps && G === e.memoizedState || (t.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || w === e.memoizedProps && G === e.memoizedState || (t.flags |= 1024), o = !1);
    }
    return Bs(e, t, r, o, u, l);
  }
  function Bs(e, t, r, o, l, u) {
    ju(e, t);
    var g = (t.flags & 128) !== 0;
    if (!o && !g) return l && Ha(t, r, !1), Yt(e, t, u);
    o = t.stateNode, Bh.current = t;
    var w = g && typeof r.getDerivedStateFromError != "function" ? null : o.render();
    return t.flags |= 1, e !== null && g ? (t.child = nr(t, e.child, null, u), t.child = nr(t, null, w, u)) : tt(e, t, w, u), t.memoizedState = o.state, l && Ha(t, r, !0), t.child;
  }
  function Ou(e) {
    var t = e.stateNode;
    t.pendingContext ? Ua(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ua(e, t.context, !1), _s(e, t.containerInfo);
  }
  function Bu(e, t, r, o, l) {
    return tr(), ys(l), t.flags |= 256, tt(e, t, r, o), t.child;
  }
  var Us = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ws(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Uu(e, t, r) {
    var o = t.pendingProps, l = Ie.current, u = !1, g = (t.flags & 128) !== 0, w;
    if ((w = g) || (w = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), w ? (u = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), Ne(Ie, l & 1), e === null)
      return gs(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (g = o.children, e = o.fallback, u ? (o = t.mode, u = t.child, g = { mode: "hidden", children: g }, (o & 1) === 0 && u !== null ? (u.childLanes = 0, u.pendingProps = g) : u = ao(g, o, 0, null), e = zn(e, o, r, null), u.return = t, e.return = t, u.sibling = e, t.child = u, t.child.memoizedState = Ws(r), t.memoizedState = Us, e) : Hs(t, g));
    if (l = e.memoizedState, l !== null && (w = l.dehydrated, w !== null)) return Uh(e, t, g, o, w, l, r);
    if (u) {
      u = o.fallback, g = t.mode, l = e.child, w = l.sibling;
      var E = { mode: "hidden", children: o.children };
      return (g & 1) === 0 && t.child !== l ? (o = t.child, o.childLanes = 0, o.pendingProps = E, t.deletions = null) : (o = mn(l, E), o.subtreeFlags = l.subtreeFlags & 14680064), w !== null ? u = mn(w, u) : (u = zn(u, g, r, null), u.flags |= 2), u.return = t, o.return = t, o.sibling = u, t.child = o, o = u, u = t.child, g = e.child.memoizedState, g = g === null ? Ws(r) : { baseLanes: g.baseLanes | r, cachePool: null, transitions: g.transitions }, u.memoizedState = g, u.childLanes = e.childLanes & ~r, t.memoizedState = Us, o;
    }
    return u = e.child, e = u.sibling, o = mn(u, { mode: "visible", children: o.children }), (t.mode & 1) === 0 && (o.lanes = r), o.return = t, o.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = o, t.memoizedState = null, o;
  }
  function Hs(e, t) {
    return t = ao({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Qi(e, t, r, o) {
    return o !== null && ys(o), nr(t, e.child, null, r), e = Hs(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Uh(e, t, r, o, l, u, g) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, o = js(Error(i(422))), Qi(e, t, g, o)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (u = o.fallback, l = t.mode, o = ao({ mode: "visible", children: o.children }, l, 0, null), u = zn(u, l, g, null), u.flags |= 2, o.return = t, u.return = t, o.sibling = u, t.child = o, (t.mode & 1) !== 0 && nr(t, e.child, null, g), t.child.memoizedState = Ws(g), t.memoizedState = Us, u);
    if ((t.mode & 1) === 0) return Qi(e, t, g, null);
    if (l.data === "$!") {
      if (o = l.nextSibling && l.nextSibling.dataset, o) var w = o.dgst;
      return o = w, u = Error(i(419)), o = js(u, o, void 0), Qi(e, t, g, o);
    }
    if (w = (g & e.childLanes) !== 0, lt || w) {
      if (o = Xe, o !== null) {
        switch (g & -g) {
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
        l = (l & (o.suspendedLanes | g)) !== 0 ? 0 : l, l !== 0 && l !== u.retryLane && (u.retryLane = l, $t(e, l), At(o, e, l, -1));
      }
      return ol(), o = js(Error(i(421))), Qi(e, t, g, o);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ef.bind(null, e), l._reactRetry = t, null) : (e = u.treeContext, gt = ln(l.nextSibling), pt = t, Le = !0, bt = null, e !== null && (mt[xt++] = Ht, mt[xt++] = Vt, mt[xt++] = Nn, Ht = e.id, Vt = e.overflow, Nn = t), t = Hs(t, o.children), t.flags |= 4096, t);
  }
  function Wu(e, t, r) {
    e.lanes |= t;
    var o = e.alternate;
    o !== null && (o.lanes |= t), ks(e.return, t, r);
  }
  function Vs(e, t, r, o, l) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: o, tail: r, tailMode: l } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = o, u.tail = r, u.tailMode = l);
  }
  function Hu(e, t, r) {
    var o = t.pendingProps, l = o.revealOrder, u = o.tail;
    if (tt(e, t, o.children, r), o = Ie.current, (o & 2) !== 0) o = o & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Wu(e, r, t);
        else if (e.tag === 19) Wu(e, r, t);
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
    if (Ne(Ie, o), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Wi(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), Vs(t, !1, l, r, u);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Wi(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        Vs(t, !0, r, null, u);
        break;
      case "together":
        Vs(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Ki(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Yt(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), Dn |= t.lanes, (r & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(i(153));
    if (t.child !== null) {
      for (e = t.child, r = mn(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = mn(e, e.pendingProps), r.return = t;
      r.sibling = null;
    }
    return t.child;
  }
  function Wh(e, t, r) {
    switch (t.tag) {
      case 3:
        Ou(t), tr();
        break;
      case 5:
        ru(t);
        break;
      case 1:
        st(t.type) && Ri(t);
        break;
      case 4:
        _s(t, t.stateNode.containerInfo);
        break;
      case 10:
        var o = t.type._context, l = t.memoizedProps.value;
        Ne(zi, o._currentValue), o._currentValue = l;
        break;
      case 13:
        if (o = t.memoizedState, o !== null)
          return o.dehydrated !== null ? (Ne(Ie, Ie.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Uu(e, t, r) : (Ne(Ie, Ie.current & 1), e = Yt(e, t, r), e !== null ? e.sibling : null);
        Ne(Ie, Ie.current & 1);
        break;
      case 19:
        if (o = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (o) return Hu(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), Ne(Ie, Ie.current), o) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Fu(e, t, r);
    }
    return Yt(e, t, r);
  }
  var Vu, $s, $u, Xu;
  Vu = function(e, t) {
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
  }, $s = function() {
  }, $u = function(e, t, r, o) {
    var l = e.memoizedProps;
    if (l !== o) {
      e = t.stateNode, Rn(It.current);
      var u = null;
      switch (r) {
        case "input":
          l = be(e, l), o = be(e, o), u = [];
          break;
        case "select":
          l = q({}, l, { value: void 0 }), o = q({}, o, { value: void 0 }), u = [];
          break;
        case "textarea":
          l = Ue(e, l), o = Ue(e, o), u = [];
          break;
        default:
          typeof l.onClick != "function" && typeof o.onClick == "function" && (e.onclick = Ni);
      }
      Co(r, o);
      var g;
      r = null;
      for (B in l) if (!o.hasOwnProperty(B) && l.hasOwnProperty(B) && l[B] != null) if (B === "style") {
        var w = l[B];
        for (g in w) w.hasOwnProperty(g) && (r || (r = {}), r[g] = "");
      } else B !== "dangerouslySetInnerHTML" && B !== "children" && B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && B !== "autoFocus" && (a.hasOwnProperty(B) ? u || (u = []) : (u = u || []).push(B, null));
      for (B in o) {
        var E = o[B];
        if (w = l != null ? l[B] : void 0, o.hasOwnProperty(B) && E !== w && (E != null || w != null)) if (B === "style") if (w) {
          for (g in w) !w.hasOwnProperty(g) || E && E.hasOwnProperty(g) || (r || (r = {}), r[g] = "");
          for (g in E) E.hasOwnProperty(g) && w[g] !== E[g] && (r || (r = {}), r[g] = E[g]);
        } else r || (u || (u = []), u.push(
          B,
          r
        )), r = E;
        else B === "dangerouslySetInnerHTML" ? (E = E ? E.__html : void 0, w = w ? w.__html : void 0, E != null && w !== E && (u = u || []).push(B, E)) : B === "children" ? typeof E != "string" && typeof E != "number" || (u = u || []).push(B, "" + E) : B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && (a.hasOwnProperty(B) ? (E != null && B === "onScroll" && Ae("scroll", e), u || w === E || (u = [])) : (u = u || []).push(B, E));
      }
      r && (u = u || []).push("style", r);
      var B = u;
      (t.updateQueue = B) && (t.flags |= 4);
    }
  }, Xu = function(e, t, r, o) {
    r !== o && (t.flags |= 4);
  };
  function Yr(e, t) {
    if (!Le) switch (e.tailMode) {
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
  function Je(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, r = 0, o = 0;
    if (t) for (var l = e.child; l !== null; ) r |= l.lanes | l.childLanes, o |= l.subtreeFlags & 14680064, o |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) r |= l.lanes | l.childLanes, o |= l.subtreeFlags, o |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= o, e.childLanes = r, t;
  }
  function Hh(e, t, r) {
    var o = t.pendingProps;
    switch (fs(t), t.tag) {
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
        return Je(t), null;
      case 1:
        return st(t.type) && Mi(), Je(t), null;
      case 3:
        return o = t.stateNode, or(), Me(ot), Me(qe), bs(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (e === null || e.child === null) && (Fi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, bt !== null && (nl(bt), bt = null))), $s(e, t), Je(t), null;
      case 5:
        Ts(t);
        var l = Rn(Wr.current);
        if (r = t.type, e !== null && t.stateNode != null) $u(e, t, r, o, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!o) {
            if (t.stateNode === null) throw Error(i(166));
            return Je(t), null;
          }
          if (e = Rn(It.current), Fi(t)) {
            o = t.stateNode, r = t.type;
            var u = t.memoizedProps;
            switch (o[Dt] = t, o[jr] = u, e = (t.mode & 1) !== 0, r) {
              case "dialog":
                Ae("cancel", o), Ae("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ae("load", o);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Dr.length; l++) Ae(Dr[l], o);
                break;
              case "source":
                Ae("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Ae(
                  "error",
                  o
                ), Ae("load", o);
                break;
              case "details":
                Ae("toggle", o);
                break;
              case "input":
                zt(o, u), Ae("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!u.multiple }, Ae("invalid", o);
                break;
              case "textarea":
                Bt(o, u), Ae("invalid", o);
            }
            Co(r, u), l = null;
            for (var g in u) if (u.hasOwnProperty(g)) {
              var w = u[g];
              g === "children" ? typeof w == "string" ? o.textContent !== w && (u.suppressHydrationWarning !== !0 && Pi(o.textContent, w, e), l = ["children", w]) : typeof w == "number" && o.textContent !== "" + w && (u.suppressHydrationWarning !== !0 && Pi(
                o.textContent,
                w,
                e
              ), l = ["children", "" + w]) : a.hasOwnProperty(g) && w != null && g === "onScroll" && Ae("scroll", o);
            }
            switch (r) {
              case "input":
                Se(o), si(o, u, !0);
                break;
              case "textarea":
                Se(o), vt(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof u.onClick == "function" && (o.onclick = Ni);
            }
            o = l, t.updateQueue = o, o !== null && (t.flags |= 4);
          } else {
            g = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Tn(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = g.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof o.is == "string" ? e = g.createElement(r, { is: o.is }) : (e = g.createElement(r), r === "select" && (g = e, o.multiple ? g.multiple = !0 : o.size && (g.size = o.size))) : e = g.createElementNS(e, r), e[Dt] = t, e[jr] = o, Vu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (g = bo(r, o), r) {
                case "dialog":
                  Ae("cancel", e), Ae("close", e), l = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ae("load", e), l = o;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < Dr.length; l++) Ae(Dr[l], e);
                  l = o;
                  break;
                case "source":
                  Ae("error", e), l = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Ae(
                    "error",
                    e
                  ), Ae("load", e), l = o;
                  break;
                case "details":
                  Ae("toggle", e), l = o;
                  break;
                case "input":
                  zt(e, o), l = be(e, o), Ae("invalid", e);
                  break;
                case "option":
                  l = o;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!o.multiple }, l = q({}, o, { value: void 0 }), Ae("invalid", e);
                  break;
                case "textarea":
                  Bt(e, o), l = Ue(e, o), Ae("invalid", e);
                  break;
                default:
                  l = o;
              }
              Co(r, l), w = l;
              for (u in w) if (w.hasOwnProperty(u)) {
                var E = w[u];
                u === "style" ? Il(e, E) : u === "dangerouslySetInnerHTML" ? (E = E ? E.__html : void 0, E != null && Cn(e, E)) : u === "children" ? typeof E == "string" ? (r !== "textarea" || E !== "") && Zt(e, E) : typeof E == "number" && Zt(e, "" + E) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (a.hasOwnProperty(u) ? E != null && u === "onScroll" && Ae("scroll", e) : E != null && X(e, u, E, g));
              }
              switch (r) {
                case "input":
                  Se(e), si(e, o, !1);
                  break;
                case "textarea":
                  Se(e), vt(e);
                  break;
                case "option":
                  o.value != null && e.setAttribute("value", "" + ne(o.value));
                  break;
                case "select":
                  e.multiple = !!o.multiple, u = o.value, u != null ? Ee(e, !!o.multiple, u, !1) : o.defaultValue != null && Ee(
                    e,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Ni);
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
        return Je(t), null;
      case 6:
        if (e && t.stateNode != null) Xu(e, t, e.memoizedProps, o);
        else {
          if (typeof o != "string" && t.stateNode === null) throw Error(i(166));
          if (r = Rn(Wr.current), Rn(It.current), Fi(t)) {
            if (o = t.stateNode, r = t.memoizedProps, o[Dt] = t, (u = o.nodeValue !== r) && (e = pt, e !== null)) switch (e.tag) {
              case 3:
                Pi(o.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Pi(o.nodeValue, r, (e.mode & 1) !== 0);
            }
            u && (t.flags |= 4);
          } else o = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(o), o[Dt] = t, t.stateNode = o;
        }
        return Je(t), null;
      case 13:
        if (Me(Ie), o = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Le && gt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Qa(), tr(), t.flags |= 98560, u = !1;
          else if (u = Fi(t), o !== null && o.dehydrated !== null) {
            if (e === null) {
              if (!u) throw Error(i(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(317));
              u[Dt] = t;
            } else tr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Je(t), u = !1;
          } else bt !== null && (nl(bt), bt = null), u = !0;
          if (!u) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (o = o !== null, o !== (e !== null && e.memoizedState !== null) && o && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Ie.current & 1) !== 0 ? Ve === 0 && (Ve = 3) : ol())), t.updateQueue !== null && (t.flags |= 4), Je(t), null);
      case 4:
        return or(), $s(e, t), e === null && Ir(t.stateNode.containerInfo), Je(t), null;
      case 10:
        return xs(t.type._context), Je(t), null;
      case 17:
        return st(t.type) && Mi(), Je(t), null;
      case 19:
        if (Me(Ie), u = t.memoizedState, u === null) return Je(t), null;
        if (o = (t.flags & 128) !== 0, g = u.rendering, g === null) if (o) Yr(u, !1);
        else {
          if (Ve !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (g = Wi(e), g !== null) {
              for (t.flags |= 128, Yr(u, !1), o = g.updateQueue, o !== null && (t.updateQueue = o, t.flags |= 4), t.subtreeFlags = 0, o = r, r = t.child; r !== null; ) u = r, e = o, u.flags &= 14680066, g = u.alternate, g === null ? (u.childLanes = 0, u.lanes = e, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = g.childLanes, u.lanes = g.lanes, u.child = g.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = g.memoizedProps, u.memoizedState = g.memoizedState, u.updateQueue = g.updateQueue, u.type = g.type, e = g.dependencies, u.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return Ne(Ie, Ie.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          u.tail !== null && ze() > ur && (t.flags |= 128, o = !0, Yr(u, !1), t.lanes = 4194304);
        }
        else {
          if (!o) if (e = Wi(g), e !== null) {
            if (t.flags |= 128, o = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Yr(u, !0), u.tail === null && u.tailMode === "hidden" && !g.alternate && !Le) return Je(t), null;
          } else 2 * ze() - u.renderingStartTime > ur && r !== 1073741824 && (t.flags |= 128, o = !0, Yr(u, !1), t.lanes = 4194304);
          u.isBackwards ? (g.sibling = t.child, t.child = g) : (r = u.last, r !== null ? r.sibling = g : t.child = g, u.last = g);
        }
        return u.tail !== null ? (t = u.tail, u.rendering = t, u.tail = t.sibling, u.renderingStartTime = ze(), t.sibling = null, r = Ie.current, Ne(Ie, o ? r & 1 | 2 : r & 1), t) : (Je(t), null);
      case 22:
      case 23:
        return il(), o = t.memoizedState !== null, e !== null && e.memoizedState !== null !== o && (t.flags |= 8192), o && (t.mode & 1) !== 0 ? (yt & 1073741824) !== 0 && (Je(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Je(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(i(156, t.tag));
  }
  function Vh(e, t) {
    switch (fs(t), t.tag) {
      case 1:
        return st(t.type) && Mi(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return or(), Me(ot), Me(qe), bs(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ts(t), null;
      case 13:
        if (Me(Ie), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(i(340));
          tr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Me(Ie), null;
      case 4:
        return or(), null;
      case 10:
        return xs(t.type._context), null;
      case 22:
      case 23:
        return il(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var qi = !1, et = !1, $h = typeof WeakSet == "function" ? WeakSet : Set, ce = null;
  function lr(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (o) {
      je(e, t, o);
    }
    else r.current = null;
  }
  function Xs(e, t, r) {
    try {
      r();
    } catch (o) {
      je(e, t, o);
    }
  }
  var Yu = !1;
  function Xh(e, t) {
    if (is = vi, e = Ca(), Ko(e)) {
      if ("selectionStart" in e) var r = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        r = (r = e.ownerDocument) && r.defaultView || window;
        var o = r.getSelection && r.getSelection();
        if (o && o.rangeCount !== 0) {
          r = o.anchorNode;
          var l = o.anchorOffset, u = o.focusNode;
          o = o.focusOffset;
          try {
            r.nodeType, u.nodeType;
          } catch {
            r = null;
            break e;
          }
          var g = 0, w = -1, E = -1, B = 0, Q = 0, J = e, G = null;
          t: for (; ; ) {
            for (var ue; J !== r || l !== 0 && J.nodeType !== 3 || (w = g + l), J !== u || o !== 0 && J.nodeType !== 3 || (E = g + o), J.nodeType === 3 && (g += J.nodeValue.length), (ue = J.firstChild) !== null; )
              G = J, J = ue;
            for (; ; ) {
              if (J === e) break t;
              if (G === r && ++B === l && (w = g), G === u && ++Q === o && (E = g), (ue = J.nextSibling) !== null) break;
              J = G, G = J.parentNode;
            }
            J = ue;
          }
          r = w === -1 || E === -1 ? null : { start: w, end: E };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (os = { focusedElem: e, selectionRange: r }, vi = !1, ce = t; ce !== null; ) if (t = ce, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, ce = e;
    else for (; ce !== null; ) {
      t = ce;
      try {
        var he = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (he !== null) {
              var fe = he.memoizedProps, Oe = he.memoizedState, I = t.stateNode, M = I.getSnapshotBeforeUpdate(t.elementType === t.type ? fe : Et(t.type, fe), Oe);
              I.__reactInternalSnapshotBeforeUpdate = M;
            }
            break;
          case 3:
            var z = t.stateNode.containerInfo;
            z.nodeType === 1 ? z.textContent = "" : z.nodeType === 9 && z.documentElement && z.removeChild(z.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(i(163));
        }
      } catch (te) {
        je(t, t.return, te);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, ce = e;
        break;
      }
      ce = t.return;
    }
    return he = Yu, Yu = !1, he;
  }
  function Gr(e, t, r) {
    var o = t.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var l = o = o.next;
      do {
        if ((l.tag & e) === e) {
          var u = l.destroy;
          l.destroy = void 0, u !== void 0 && Xs(t, r, u);
        }
        l = l.next;
      } while (l !== o);
    }
  }
  function Zi(e, t) {
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
  function Ys(e) {
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
  function Gu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Gu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Dt], delete t[jr], delete t[us], delete t[Ph], delete t[Nh])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Qu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Ku(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Qu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Gs(e, t, r) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = Ni));
    else if (o !== 4 && (e = e.child, e !== null)) for (Gs(e, t, r), e = e.sibling; e !== null; ) Gs(e, t, r), e = e.sibling;
  }
  function Qs(e, t, r) {
    var o = e.tag;
    if (o === 5 || o === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (o !== 4 && (e = e.child, e !== null)) for (Qs(e, t, r), e = e.sibling; e !== null; ) Qs(e, t, r), e = e.sibling;
  }
  var Ge = null, Pt = !1;
  function fn(e, t, r) {
    for (r = r.child; r !== null; ) qu(e, t, r), r = r.sibling;
  }
  function qu(e, t, r) {
    if (Lt && typeof Lt.onCommitFiberUnmount == "function") try {
      Lt.onCommitFiberUnmount(di, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        et || lr(r, t);
      case 6:
        var o = Ge, l = Pt;
        Ge = null, fn(e, t, r), Ge = o, Pt = l, Ge !== null && (Pt ? (e = Ge, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : Ge.removeChild(r.stateNode));
        break;
      case 18:
        Ge !== null && (Pt ? (e = Ge, r = r.stateNode, e.nodeType === 8 ? as(e.parentNode, r) : e.nodeType === 1 && as(e, r), br(e)) : as(Ge, r.stateNode));
        break;
      case 4:
        o = Ge, l = Pt, Ge = r.stateNode.containerInfo, Pt = !0, fn(e, t, r), Ge = o, Pt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!et && (o = r.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          l = o = o.next;
          do {
            var u = l, g = u.destroy;
            u = u.tag, g !== void 0 && ((u & 2) !== 0 || (u & 4) !== 0) && Xs(r, t, g), l = l.next;
          } while (l !== o);
        }
        fn(e, t, r);
        break;
      case 1:
        if (!et && (lr(r, t), o = r.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = r.memoizedProps, o.state = r.memoizedState, o.componentWillUnmount();
        } catch (w) {
          je(r, t, w);
        }
        fn(e, t, r);
        break;
      case 21:
        fn(e, t, r);
        break;
      case 22:
        r.mode & 1 ? (et = (o = et) || r.memoizedState !== null, fn(e, t, r), et = o) : fn(e, t, r);
        break;
      default:
        fn(e, t, r);
    }
  }
  function Zu(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var r = e.stateNode;
      r === null && (r = e.stateNode = new $h()), t.forEach(function(o) {
        var l = tf.bind(null, e, o);
        r.has(o) || (r.add(o), o.then(l, l));
      });
    }
  }
  function Nt(e, t) {
    var r = t.deletions;
    if (r !== null) for (var o = 0; o < r.length; o++) {
      var l = r[o];
      try {
        var u = e, g = t, w = g;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              Ge = w.stateNode, Pt = !1;
              break e;
            case 3:
              Ge = w.stateNode.containerInfo, Pt = !0;
              break e;
            case 4:
              Ge = w.stateNode.containerInfo, Pt = !0;
              break e;
          }
          w = w.return;
        }
        if (Ge === null) throw Error(i(160));
        qu(u, g, l), Ge = null, Pt = !1;
        var E = l.alternate;
        E !== null && (E.return = null), l.return = null;
      } catch (B) {
        je(l, t, B);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ju(t, e), t = t.sibling;
  }
  function Ju(e, t) {
    var r = e.alternate, o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Nt(t, e), jt(e), o & 4) {
          try {
            Gr(3, e, e.return), Zi(3, e);
          } catch (fe) {
            je(e, e.return, fe);
          }
          try {
            Gr(5, e, e.return);
          } catch (fe) {
            je(e, e.return, fe);
          }
        }
        break;
      case 1:
        Nt(t, e), jt(e), o & 512 && r !== null && lr(r, r.return);
        break;
      case 5:
        if (Nt(t, e), jt(e), o & 512 && r !== null && lr(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Zt(l, "");
          } catch (fe) {
            je(e, e.return, fe);
          }
        }
        if (o & 4 && (l = e.stateNode, l != null)) {
          var u = e.memoizedProps, g = r !== null ? r.memoizedProps : u, w = e.type, E = e.updateQueue;
          if (e.updateQueue = null, E !== null) try {
            w === "input" && u.type === "radio" && u.name != null && Ot(l, u), bo(w, g);
            var B = bo(w, u);
            for (g = 0; g < E.length; g += 2) {
              var Q = E[g], J = E[g + 1];
              Q === "style" ? Il(l, J) : Q === "dangerouslySetInnerHTML" ? Cn(l, J) : Q === "children" ? Zt(l, J) : X(l, Q, J, B);
            }
            switch (w) {
              case "input":
                gr(l, u);
                break;
              case "textarea":
                Rt(l, u);
                break;
              case "select":
                var G = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!u.multiple;
                var ue = u.value;
                ue != null ? Ee(l, !!u.multiple, ue, !1) : G !== !!u.multiple && (u.defaultValue != null ? Ee(
                  l,
                  !!u.multiple,
                  u.defaultValue,
                  !0
                ) : Ee(l, !!u.multiple, u.multiple ? [] : "", !1));
            }
            l[jr] = u;
          } catch (fe) {
            je(e, e.return, fe);
          }
        }
        break;
      case 6:
        if (Nt(t, e), jt(e), o & 4) {
          if (e.stateNode === null) throw Error(i(162));
          l = e.stateNode, u = e.memoizedProps;
          try {
            l.nodeValue = u;
          } catch (fe) {
            je(e, e.return, fe);
          }
        }
        break;
      case 3:
        if (Nt(t, e), jt(e), o & 4 && r !== null && r.memoizedState.isDehydrated) try {
          br(t.containerInfo);
        } catch (fe) {
          je(e, e.return, fe);
        }
        break;
      case 4:
        Nt(t, e), jt(e);
        break;
      case 13:
        Nt(t, e), jt(e), l = e.child, l.flags & 8192 && (u = l.memoizedState !== null, l.stateNode.isHidden = u, !u || l.alternate !== null && l.alternate.memoizedState !== null || (Zs = ze())), o & 4 && Zu(e);
        break;
      case 22:
        if (Q = r !== null && r.memoizedState !== null, e.mode & 1 ? (et = (B = et) || Q, Nt(t, e), et = B) : Nt(t, e), jt(e), o & 8192) {
          if (B = e.memoizedState !== null, (e.stateNode.isHidden = B) && !Q && (e.mode & 1) !== 0) for (ce = e, Q = e.child; Q !== null; ) {
            for (J = ce = Q; ce !== null; ) {
              switch (G = ce, ue = G.child, G.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Gr(4, G, G.return);
                  break;
                case 1:
                  lr(G, G.return);
                  var he = G.stateNode;
                  if (typeof he.componentWillUnmount == "function") {
                    o = G, r = G.return;
                    try {
                      t = o, he.props = t.memoizedProps, he.state = t.memoizedState, he.componentWillUnmount();
                    } catch (fe) {
                      je(o, r, fe);
                    }
                  }
                  break;
                case 5:
                  lr(G, G.return);
                  break;
                case 22:
                  if (G.memoizedState !== null) {
                    nc(J);
                    continue;
                  }
              }
              ue !== null ? (ue.return = G, ce = ue) : nc(J);
            }
            Q = Q.sibling;
          }
          e: for (Q = null, J = e; ; ) {
            if (J.tag === 5) {
              if (Q === null) {
                Q = J;
                try {
                  l = J.stateNode, B ? (u = l.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none") : (w = J.stateNode, E = J.memoizedProps.style, g = E != null && E.hasOwnProperty("display") ? E.display : null, w.style.display = ht("display", g));
                } catch (fe) {
                  je(e, e.return, fe);
                }
              }
            } else if (J.tag === 6) {
              if (Q === null) try {
                J.stateNode.nodeValue = B ? "" : J.memoizedProps;
              } catch (fe) {
                je(e, e.return, fe);
              }
            } else if ((J.tag !== 22 && J.tag !== 23 || J.memoizedState === null || J === e) && J.child !== null) {
              J.child.return = J, J = J.child;
              continue;
            }
            if (J === e) break e;
            for (; J.sibling === null; ) {
              if (J.return === null || J.return === e) break e;
              Q === J && (Q = null), J = J.return;
            }
            Q === J && (Q = null), J.sibling.return = J.return, J = J.sibling;
          }
        }
        break;
      case 19:
        Nt(t, e), jt(e), o & 4 && Zu(e);
        break;
      case 21:
        break;
      default:
        Nt(
          t,
          e
        ), jt(e);
    }
  }
  function jt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var r = e.return; r !== null; ) {
            if (Qu(r)) {
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
            o.flags & 32 && (Zt(l, ""), o.flags &= -33);
            var u = Ku(e);
            Qs(e, u, l);
            break;
          case 3:
          case 4:
            var g = o.stateNode.containerInfo, w = Ku(e);
            Gs(e, w, g);
            break;
          default:
            throw Error(i(161));
        }
      } catch (E) {
        je(e, e.return, E);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Yh(e, t, r) {
    ce = e, ec(e);
  }
  function ec(e, t, r) {
    for (var o = (e.mode & 1) !== 0; ce !== null; ) {
      var l = ce, u = l.child;
      if (l.tag === 22 && o) {
        var g = l.memoizedState !== null || qi;
        if (!g) {
          var w = l.alternate, E = w !== null && w.memoizedState !== null || et;
          w = qi;
          var B = et;
          if (qi = g, (et = E) && !B) for (ce = l; ce !== null; ) g = ce, E = g.child, g.tag === 22 && g.memoizedState !== null ? rc(l) : E !== null ? (E.return = g, ce = E) : rc(l);
          for (; u !== null; ) ce = u, ec(u), u = u.sibling;
          ce = l, qi = w, et = B;
        }
        tc(e);
      } else (l.subtreeFlags & 8772) !== 0 && u !== null ? (u.return = l, ce = u) : tc(e);
    }
  }
  function tc(e) {
    for (; ce !== null; ) {
      var t = ce;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              et || Zi(5, t);
              break;
            case 1:
              var o = t.stateNode;
              if (t.flags & 4 && !et) if (r === null) o.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : Et(t.type, r.memoizedProps);
                o.componentDidUpdate(l, r.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var u = t.updateQueue;
              u !== null && nu(t, u, o);
              break;
            case 3:
              var g = t.updateQueue;
              if (g !== null) {
                if (r = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    r = t.child.stateNode;
                    break;
                  case 1:
                    r = t.child.stateNode;
                }
                nu(t, g, r);
              }
              break;
            case 5:
              var w = t.stateNode;
              if (r === null && t.flags & 4) {
                r = w;
                var E = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    E.autoFocus && r.focus();
                    break;
                  case "img":
                    E.src && (r.src = E.src);
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
                var B = t.alternate;
                if (B !== null) {
                  var Q = B.memoizedState;
                  if (Q !== null) {
                    var J = Q.dehydrated;
                    J !== null && br(J);
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
          et || t.flags & 512 && Ys(t);
        } catch (G) {
          je(t, t.return, G);
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
  function nc(e) {
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
  function rc(e) {
    for (; ce !== null; ) {
      var t = ce;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              Zi(4, t);
            } catch (E) {
              je(t, r, E);
            }
            break;
          case 1:
            var o = t.stateNode;
            if (typeof o.componentDidMount == "function") {
              var l = t.return;
              try {
                o.componentDidMount();
              } catch (E) {
                je(t, l, E);
              }
            }
            var u = t.return;
            try {
              Ys(t);
            } catch (E) {
              je(t, u, E);
            }
            break;
          case 5:
            var g = t.return;
            try {
              Ys(t);
            } catch (E) {
              je(t, g, E);
            }
        }
      } catch (E) {
        je(t, t.return, E);
      }
      if (t === e) {
        ce = null;
        break;
      }
      var w = t.sibling;
      if (w !== null) {
        w.return = t.return, ce = w;
        break;
      }
      ce = t.return;
    }
  }
  var Gh = Math.ceil, Ji = U.ReactCurrentDispatcher, Ks = U.ReactCurrentOwner, wt = U.ReactCurrentBatchConfig, Te = 0, Xe = null, We = null, Qe = 0, yt = 0, ar = an(0), Ve = 0, Qr = null, Dn = 0, eo = 0, qs = 0, Kr = null, at = null, Zs = 0, ur = 1 / 0, Gt = null, to = !1, Js = null, pn = null, no = !1, gn = null, ro = 0, qr = 0, el = null, io = -1, oo = 0;
  function nt() {
    return (Te & 6) !== 0 ? ze() : io !== -1 ? io : io = ze();
  }
  function yn(e) {
    return (e.mode & 1) === 0 ? 1 : (Te & 2) !== 0 && Qe !== 0 ? Qe & -Qe : Mh.transition !== null ? (oo === 0 && (oo = Kl()), oo) : (e = Pe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : oa(e.type)), e);
  }
  function At(e, t, r, o) {
    if (50 < qr) throw qr = 0, el = null, Error(i(185));
    Sr(e, r, o), ((Te & 2) === 0 || e !== Xe) && (e === Xe && ((Te & 2) === 0 && (eo |= r), Ve === 4 && vn(e, Qe)), ut(e, o), r === 1 && Te === 0 && (t.mode & 1) === 0 && (ur = ze() + 500, Li && cn()));
  }
  function ut(e, t) {
    var r = e.callbackNode;
    Md(e, t);
    var o = pi(e, e === Xe ? Qe : 0);
    if (o === 0) r !== null && Yl(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = o & -o, e.callbackPriority !== t) {
      if (r != null && Yl(r), t === 1) e.tag === 0 ? Ah(oc.bind(null, e)) : Va(oc.bind(null, e)), bh(function() {
        (Te & 6) === 0 && cn();
      }), r = null;
      else {
        switch (ql(o)) {
          case 1:
            r = Lo;
            break;
          case 4:
            r = Gl;
            break;
          case 16:
            r = ci;
            break;
          case 536870912:
            r = Ql;
            break;
          default:
            r = ci;
        }
        r = fc(r, ic.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function ic(e, t) {
    if (io = -1, oo = 0, (Te & 6) !== 0) throw Error(i(327));
    var r = e.callbackNode;
    if (cr() && e.callbackNode !== r) return null;
    var o = pi(e, e === Xe ? Qe : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & e.expiredLanes) !== 0 || t) t = so(e, o);
    else {
      t = o;
      var l = Te;
      Te |= 2;
      var u = lc();
      (Xe !== e || Qe !== t) && (Gt = null, ur = ze() + 500, Fn(e, t));
      do
        try {
          qh();
          break;
        } catch (w) {
          sc(e, w);
        }
      while (!0);
      ms(), Ji.current = u, Te = l, We !== null ? t = 0 : (Xe = null, Qe = 0, t = Ve);
    }
    if (t !== 0) {
      if (t === 2 && (l = Do(e), l !== 0 && (o = l, t = tl(e, l))), t === 1) throw r = Qr, Fn(e, 0), vn(e, o), ut(e, ze()), r;
      if (t === 6) vn(e, o);
      else {
        if (l = e.current.alternate, (o & 30) === 0 && !Qh(l) && (t = so(e, o), t === 2 && (u = Do(e), u !== 0 && (o = u, t = tl(e, u))), t === 1)) throw r = Qr, Fn(e, 0), vn(e, o), ut(e, ze()), r;
        switch (e.finishedWork = l, e.finishedLanes = o, t) {
          case 0:
          case 1:
            throw Error(i(345));
          case 2:
            jn(e, at, Gt);
            break;
          case 3:
            if (vn(e, o), (o & 130023424) === o && (t = Zs + 500 - ze(), 10 < t)) {
              if (pi(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & o) !== o) {
                nt(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = ls(jn.bind(null, e, at, Gt), t);
              break;
            }
            jn(e, at, Gt);
            break;
          case 4:
            if (vn(e, o), (o & 4194240) === o) break;
            for (t = e.eventTimes, l = -1; 0 < o; ) {
              var g = 31 - Tt(o);
              u = 1 << g, g = t[g], g > l && (l = g), o &= ~u;
            }
            if (o = l, o = ze() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * Gh(o / 1960)) - o, 10 < o) {
              e.timeoutHandle = ls(jn.bind(null, e, at, Gt), o);
              break;
            }
            jn(e, at, Gt);
            break;
          case 5:
            jn(e, at, Gt);
            break;
          default:
            throw Error(i(329));
        }
      }
    }
    return ut(e, ze()), e.callbackNode === r ? ic.bind(null, e) : null;
  }
  function tl(e, t) {
    var r = Kr;
    return e.current.memoizedState.isDehydrated && (Fn(e, t).flags |= 256), e = so(e, t), e !== 2 && (t = at, at = r, t !== null && nl(t)), e;
  }
  function nl(e) {
    at === null ? at = e : at.push.apply(at, e);
  }
  function Qh(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var r = t.updateQueue;
        if (r !== null && (r = r.stores, r !== null)) for (var o = 0; o < r.length; o++) {
          var l = r[o], u = l.getSnapshot;
          l = l.value;
          try {
            if (!Ct(u(), l)) return !1;
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
  function vn(e, t) {
    for (t &= ~qs, t &= ~eo, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - Tt(t), o = 1 << r;
      e[r] = -1, t &= ~o;
    }
  }
  function oc(e) {
    if ((Te & 6) !== 0) throw Error(i(327));
    cr();
    var t = pi(e, 0);
    if ((t & 1) === 0) return ut(e, ze()), null;
    var r = so(e, t);
    if (e.tag !== 0 && r === 2) {
      var o = Do(e);
      o !== 0 && (t = o, r = tl(e, o));
    }
    if (r === 1) throw r = Qr, Fn(e, 0), vn(e, t), ut(e, ze()), r;
    if (r === 6) throw Error(i(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, jn(e, at, Gt), ut(e, ze()), null;
  }
  function rl(e, t) {
    var r = Te;
    Te |= 1;
    try {
      return e(t);
    } finally {
      Te = r, Te === 0 && (ur = ze() + 500, Li && cn());
    }
  }
  function In(e) {
    gn !== null && gn.tag === 0 && (Te & 6) === 0 && cr();
    var t = Te;
    Te |= 1;
    var r = wt.transition, o = Pe;
    try {
      if (wt.transition = null, Pe = 1, e) return e();
    } finally {
      Pe = o, wt.transition = r, Te = t, (Te & 6) === 0 && cn();
    }
  }
  function il() {
    yt = ar.current, Me(ar);
  }
  function Fn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, Ch(r)), We !== null) for (r = We.return; r !== null; ) {
      var o = r;
      switch (fs(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && Mi();
          break;
        case 3:
          or(), Me(ot), Me(qe), bs();
          break;
        case 5:
          Ts(o);
          break;
        case 4:
          or();
          break;
        case 13:
          Me(Ie);
          break;
        case 19:
          Me(Ie);
          break;
        case 10:
          xs(o.type._context);
          break;
        case 22:
        case 23:
          il();
      }
      r = r.return;
    }
    if (Xe = e, We = e = mn(e.current, null), Qe = yt = t, Ve = 0, Qr = null, qs = eo = Dn = 0, at = Kr = null, Mn !== null) {
      for (t = 0; t < Mn.length; t++) if (r = Mn[t], o = r.interleaved, o !== null) {
        r.interleaved = null;
        var l = o.next, u = r.pending;
        if (u !== null) {
          var g = u.next;
          u.next = l, o.next = g;
        }
        r.pending = o;
      }
      Mn = null;
    }
    return e;
  }
  function sc(e, t) {
    do {
      var r = We;
      try {
        if (ms(), Hi.current = Yi, Vi) {
          for (var o = Fe.memoizedState; o !== null; ) {
            var l = o.queue;
            l !== null && (l.pending = null), o = o.next;
          }
          Vi = !1;
        }
        if (Ln = 0, $e = He = Fe = null, Hr = !1, Vr = 0, Ks.current = null, r === null || r.return === null) {
          Ve = 1, Qr = t, We = null;
          break;
        }
        e: {
          var u = e, g = r.return, w = r, E = t;
          if (t = Qe, w.flags |= 32768, E !== null && typeof E == "object" && typeof E.then == "function") {
            var B = E, Q = w, J = Q.tag;
            if ((Q.mode & 1) === 0 && (J === 0 || J === 11 || J === 15)) {
              var G = Q.alternate;
              G ? (Q.updateQueue = G.updateQueue, Q.memoizedState = G.memoizedState, Q.lanes = G.lanes) : (Q.updateQueue = null, Q.memoizedState = null);
            }
            var ue = Mu(g);
            if (ue !== null) {
              ue.flags &= -257, Ru(ue, g, w, u, t), ue.mode & 1 && Au(u, B, t), t = ue, E = B;
              var he = t.updateQueue;
              if (he === null) {
                var fe = /* @__PURE__ */ new Set();
                fe.add(E), t.updateQueue = fe;
              } else he.add(E);
              break e;
            } else {
              if ((t & 1) === 0) {
                Au(u, B, t), ol();
                break e;
              }
              E = Error(i(426));
            }
          } else if (Le && w.mode & 1) {
            var Oe = Mu(g);
            if (Oe !== null) {
              (Oe.flags & 65536) === 0 && (Oe.flags |= 256), Ru(Oe, g, w, u, t), ys(sr(E, w));
              break e;
            }
          }
          u = E = sr(E, w), Ve !== 4 && (Ve = 2), Kr === null ? Kr = [u] : Kr.push(u), u = g;
          do {
            switch (u.tag) {
              case 3:
                u.flags |= 65536, t &= -t, u.lanes |= t;
                var I = Pu(u, E, t);
                tu(u, I);
                break e;
              case 1:
                w = E;
                var M = u.type, z = u.stateNode;
                if ((u.flags & 128) === 0 && (typeof M.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (pn === null || !pn.has(z)))) {
                  u.flags |= 65536, t &= -t, u.lanes |= t;
                  var te = Nu(u, w, t);
                  tu(u, te);
                  break e;
                }
            }
            u = u.return;
          } while (u !== null);
        }
        uc(r);
      } catch (pe) {
        t = pe, We === r && r !== null && (We = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function lc() {
    var e = Ji.current;
    return Ji.current = Yi, e === null ? Yi : e;
  }
  function ol() {
    (Ve === 0 || Ve === 3 || Ve === 2) && (Ve = 4), Xe === null || (Dn & 268435455) === 0 && (eo & 268435455) === 0 || vn(Xe, Qe);
  }
  function so(e, t) {
    var r = Te;
    Te |= 2;
    var o = lc();
    (Xe !== e || Qe !== t) && (Gt = null, Fn(e, t));
    do
      try {
        Kh();
        break;
      } catch (l) {
        sc(e, l);
      }
    while (!0);
    if (ms(), Te = r, Ji.current = o, We !== null) throw Error(i(261));
    return Xe = null, Qe = 0, Ve;
  }
  function Kh() {
    for (; We !== null; ) ac(We);
  }
  function qh() {
    for (; We !== null && !wd(); ) ac(We);
  }
  function ac(e) {
    var t = hc(e.alternate, e, yt);
    e.memoizedProps = e.pendingProps, t === null ? uc(e) : We = t, Ks.current = null;
  }
  function uc(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Hh(r, t, yt), r !== null) {
          We = r;
          return;
        }
      } else {
        if (r = Vh(r, t), r !== null) {
          r.flags &= 32767, We = r;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Ve = 6, We = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        We = t;
        return;
      }
      We = t = e;
    } while (t !== null);
    Ve === 0 && (Ve = 5);
  }
  function jn(e, t, r) {
    var o = Pe, l = wt.transition;
    try {
      wt.transition = null, Pe = 1, Zh(e, t, r, o);
    } finally {
      wt.transition = l, Pe = o;
    }
    return null;
  }
  function Zh(e, t, r, o) {
    do
      cr();
    while (gn !== null);
    if ((Te & 6) !== 0) throw Error(i(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(i(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var u = r.lanes | r.childLanes;
    if (Rd(e, u), e === Xe && (We = Xe = null, Qe = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || no || (no = !0, fc(ci, function() {
      return cr(), null;
    })), u = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || u) {
      u = wt.transition, wt.transition = null;
      var g = Pe;
      Pe = 1;
      var w = Te;
      Te |= 4, Ks.current = null, Xh(e, r), Ju(r, e), mh(os), vi = !!is, os = is = null, e.current = r, Yh(r), _d(), Te = w, Pe = g, wt.transition = u;
    } else e.current = r;
    if (no && (no = !1, gn = e, ro = l), u = e.pendingLanes, u === 0 && (pn = null), bd(r.stateNode), ut(e, ze()), t !== null) for (o = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], o(l.value, { componentStack: l.stack, digest: l.digest });
    if (to) throw to = !1, e = Js, Js = null, e;
    return (ro & 1) !== 0 && e.tag !== 0 && cr(), u = e.pendingLanes, (u & 1) !== 0 ? e === el ? qr++ : (qr = 0, el = e) : qr = 0, cn(), null;
  }
  function cr() {
    if (gn !== null) {
      var e = ql(ro), t = wt.transition, r = Pe;
      try {
        if (wt.transition = null, Pe = 16 > e ? 16 : e, gn === null) var o = !1;
        else {
          if (e = gn, gn = null, ro = 0, (Te & 6) !== 0) throw Error(i(331));
          var l = Te;
          for (Te |= 4, ce = e.current; ce !== null; ) {
            var u = ce, g = u.child;
            if ((ce.flags & 16) !== 0) {
              var w = u.deletions;
              if (w !== null) {
                for (var E = 0; E < w.length; E++) {
                  var B = w[E];
                  for (ce = B; ce !== null; ) {
                    var Q = ce;
                    switch (Q.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Gr(8, Q, u);
                    }
                    var J = Q.child;
                    if (J !== null) J.return = Q, ce = J;
                    else for (; ce !== null; ) {
                      Q = ce;
                      var G = Q.sibling, ue = Q.return;
                      if (Gu(Q), Q === B) {
                        ce = null;
                        break;
                      }
                      if (G !== null) {
                        G.return = ue, ce = G;
                        break;
                      }
                      ce = ue;
                    }
                  }
                }
                var he = u.alternate;
                if (he !== null) {
                  var fe = he.child;
                  if (fe !== null) {
                    he.child = null;
                    do {
                      var Oe = fe.sibling;
                      fe.sibling = null, fe = Oe;
                    } while (fe !== null);
                  }
                }
                ce = u;
              }
            }
            if ((u.subtreeFlags & 2064) !== 0 && g !== null) g.return = u, ce = g;
            else e: for (; ce !== null; ) {
              if (u = ce, (u.flags & 2048) !== 0) switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  Gr(9, u, u.return);
              }
              var I = u.sibling;
              if (I !== null) {
                I.return = u.return, ce = I;
                break e;
              }
              ce = u.return;
            }
          }
          var M = e.current;
          for (ce = M; ce !== null; ) {
            g = ce;
            var z = g.child;
            if ((g.subtreeFlags & 2064) !== 0 && z !== null) z.return = g, ce = z;
            else e: for (g = M; ce !== null; ) {
              if (w = ce, (w.flags & 2048) !== 0) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Zi(9, w);
                }
              } catch (pe) {
                je(w, w.return, pe);
              }
              if (w === g) {
                ce = null;
                break e;
              }
              var te = w.sibling;
              if (te !== null) {
                te.return = w.return, ce = te;
                break e;
              }
              ce = w.return;
            }
          }
          if (Te = l, cn(), Lt && typeof Lt.onPostCommitFiberRoot == "function") try {
            Lt.onPostCommitFiberRoot(di, e);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Pe = r, wt.transition = t;
      }
    }
    return !1;
  }
  function cc(e, t, r) {
    t = sr(r, t), t = Pu(e, t, 1), e = hn(e, t, 1), t = nt(), e !== null && (Sr(e, 1, t), ut(e, t));
  }
  function je(e, t, r) {
    if (e.tag === 3) cc(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        cc(t, e, r);
        break;
      } else if (t.tag === 1) {
        var o = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (pn === null || !pn.has(o))) {
          e = sr(r, e), e = Nu(t, e, 1), t = hn(t, e, 1), e = nt(), t !== null && (Sr(t, 1, e), ut(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Jh(e, t, r) {
    var o = e.pingCache;
    o !== null && o.delete(t), t = nt(), e.pingedLanes |= e.suspendedLanes & r, Xe === e && (Qe & r) === r && (Ve === 4 || Ve === 3 && (Qe & 130023424) === Qe && 500 > ze() - Zs ? Fn(e, 0) : qs |= r), ut(e, t);
  }
  function dc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = fi, fi <<= 1, (fi & 130023424) === 0 && (fi = 4194304)));
    var r = nt();
    e = $t(e, t), e !== null && (Sr(e, t, r), ut(e, r));
  }
  function ef(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), dc(e, r);
  }
  function tf(e, t) {
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
    o !== null && o.delete(t), dc(e, r);
  }
  var hc;
  hc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || ot.current) lt = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return lt = !1, Wh(e, t, r);
      lt = (e.flags & 131072) !== 0;
    }
    else lt = !1, Le && (t.flags & 1048576) !== 0 && $a(t, Ii, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var o = t.type;
        Ki(e, t), e = t.pendingProps;
        var l = Zn(t, qe.current);
        ir(t, r), l = Ns(null, t, o, e, l, r);
        var u = As();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, st(o) ? (u = !0, Ri(t)) : u = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, ws(t), l.updater = Gi, t.stateNode = l, l._reactInternals = t, Fs(t, o, e, r), t = Bs(null, t, o, !0, u, r)) : (t.tag = 0, Le && u && hs(t), tt(null, t, l, r), t = t.child), t;
      case 16:
        o = t.elementType;
        e: {
          switch (Ki(e, t), e = t.pendingProps, l = o._init, o = l(o._payload), t.type = o, l = t.tag = rf(o), e = Et(o, e), l) {
            case 0:
              t = Os(null, t, o, e, r);
              break e;
            case 1:
              t = zu(null, t, o, e, r);
              break e;
            case 11:
              t = Lu(null, t, o, e, r);
              break e;
            case 14:
              t = Du(null, t, o, Et(o.type, e), r);
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
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : Et(o, l), Os(e, t, o, l, r);
      case 1:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : Et(o, l), zu(e, t, o, l, r);
      case 3:
        e: {
          if (Ou(t), e === null) throw Error(i(387));
          o = t.pendingProps, u = t.memoizedState, l = u.element, eu(e, t), Ui(t, o, null, r);
          var g = t.memoizedState;
          if (o = g.element, u.isDehydrated) if (u = { element: o, isDehydrated: !1, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
            l = sr(Error(i(423)), t), t = Bu(e, t, o, r, l);
            break e;
          } else if (o !== l) {
            l = sr(Error(i(424)), t), t = Bu(e, t, o, r, l);
            break e;
          } else for (gt = ln(t.stateNode.containerInfo.firstChild), pt = t, Le = !0, bt = null, r = Za(t, null, o, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if (tr(), o === l) {
              t = Yt(e, t, r);
              break e;
            }
            tt(e, t, o, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ru(t), e === null && gs(t), o = t.type, l = t.pendingProps, u = e !== null ? e.memoizedProps : null, g = l.children, ss(o, l) ? g = null : u !== null && ss(o, u) && (t.flags |= 32), ju(e, t), tt(e, t, g, r), t.child;
      case 6:
        return e === null && gs(t), null;
      case 13:
        return Uu(e, t, r);
      case 4:
        return _s(t, t.stateNode.containerInfo), o = t.pendingProps, e === null ? t.child = nr(t, null, o, r) : tt(e, t, o, r), t.child;
      case 11:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : Et(o, l), Lu(e, t, o, l, r);
      case 7:
        return tt(e, t, t.pendingProps, r), t.child;
      case 8:
        return tt(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return tt(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (o = t.type._context, l = t.pendingProps, u = t.memoizedProps, g = l.value, Ne(zi, o._currentValue), o._currentValue = g, u !== null) if (Ct(u.value, g)) {
            if (u.children === l.children && !ot.current) {
              t = Yt(e, t, r);
              break e;
            }
          } else for (u = t.child, u !== null && (u.return = t); u !== null; ) {
            var w = u.dependencies;
            if (w !== null) {
              g = u.child;
              for (var E = w.firstContext; E !== null; ) {
                if (E.context === o) {
                  if (u.tag === 1) {
                    E = Xt(-1, r & -r), E.tag = 2;
                    var B = u.updateQueue;
                    if (B !== null) {
                      B = B.shared;
                      var Q = B.pending;
                      Q === null ? E.next = E : (E.next = Q.next, Q.next = E), B.pending = E;
                    }
                  }
                  u.lanes |= r, E = u.alternate, E !== null && (E.lanes |= r), ks(
                    u.return,
                    r,
                    t
                  ), w.lanes |= r;
                  break;
                }
                E = E.next;
              }
            } else if (u.tag === 10) g = u.type === t.type ? null : u.child;
            else if (u.tag === 18) {
              if (g = u.return, g === null) throw Error(i(341));
              g.lanes |= r, w = g.alternate, w !== null && (w.lanes |= r), ks(g, r, t), g = u.sibling;
            } else g = u.child;
            if (g !== null) g.return = u;
            else for (g = u; g !== null; ) {
              if (g === t) {
                g = null;
                break;
              }
              if (u = g.sibling, u !== null) {
                u.return = g.return, g = u;
                break;
              }
              g = g.return;
            }
            u = g;
          }
          tt(e, t, l.children, r), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, o = t.pendingProps.children, ir(t, r), l = kt(l), o = o(l), t.flags |= 1, tt(e, t, o, r), t.child;
      case 14:
        return o = t.type, l = Et(o, t.pendingProps), l = Et(o.type, l), Du(e, t, o, l, r);
      case 15:
        return Iu(e, t, t.type, t.pendingProps, r);
      case 17:
        return o = t.type, l = t.pendingProps, l = t.elementType === o ? l : Et(o, l), Ki(e, t), t.tag = 1, st(o) ? (e = !0, Ri(t)) : e = !1, ir(t, r), bu(t, o, l), Fs(t, o, l, r), Bs(null, t, o, !0, e, r);
      case 19:
        return Hu(e, t, r);
      case 22:
        return Fu(e, t, r);
    }
    throw Error(i(156, t.tag));
  };
  function fc(e, t) {
    return Xl(e, t);
  }
  function nf(e, t, r, o) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function _t(e, t, r, o) {
    return new nf(e, t, r, o);
  }
  function sl(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function rf(e) {
    if (typeof e == "function") return sl(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ye) return 11;
      if (e === se) return 14;
    }
    return 2;
  }
  function mn(e, t) {
    var r = e.alternate;
    return r === null ? (r = _t(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function lo(e, t, r, o, l, u) {
    var g = 2;
    if (o = e, typeof e == "function") sl(e) && (g = 1);
    else if (typeof e == "string") g = 5;
    else e: switch (e) {
      case A:
        return zn(r.children, l, u, t);
      case D:
        g = 8, l |= 8;
        break;
      case j:
        return e = _t(12, r, t, l | 2), e.elementType = j, e.lanes = u, e;
      case oe:
        return e = _t(13, r, t, l), e.elementType = oe, e.lanes = u, e;
      case le:
        return e = _t(19, r, t, l), e.elementType = le, e.lanes = u, e;
      case O:
        return ao(r, l, u, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case $:
            g = 10;
            break e;
          case ee:
            g = 9;
            break e;
          case ye:
            g = 11;
            break e;
          case se:
            g = 14;
            break e;
          case K:
            g = 16, o = null;
            break e;
        }
        throw Error(i(130, e == null ? e : typeof e, ""));
    }
    return t = _t(g, r, t, l), t.elementType = e, t.type = o, t.lanes = u, t;
  }
  function zn(e, t, r, o) {
    return e = _t(7, e, o, t), e.lanes = r, e;
  }
  function ao(e, t, r, o) {
    return e = _t(22, e, o, t), e.elementType = O, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function ll(e, t, r) {
    return e = _t(6, e, null, t), e.lanes = r, e;
  }
  function al(e, t, r) {
    return t = _t(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function of(e, t, r, o, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Io(0), this.expirationTimes = Io(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Io(0), this.identifierPrefix = o, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function ul(e, t, r, o, l, u, g, w, E) {
    return e = new of(e, t, r, w, E), t === 1 ? (t = 1, u === !0 && (t |= 8)) : t = 0, u = _t(3, null, null, t), e.current = u, u.stateNode = e, u.memoizedState = { element: o, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, ws(u), e;
  }
  function sf(e, t, r) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Y, key: o == null ? null : "" + o, children: e, containerInfo: t, implementation: r };
  }
  function pc(e) {
    if (!e) return un;
    e = e._reactInternals;
    e: {
      if (bn(e) !== e || e.tag !== 1) throw Error(i(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (st(t.type)) {
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
      if (st(r)) return Wa(e, r, t);
    }
    return t;
  }
  function gc(e, t, r, o, l, u, g, w, E) {
    return e = ul(r, o, !0, e, l, u, g, w, E), e.context = pc(null), r = e.current, o = nt(), l = yn(r), u = Xt(o, l), u.callback = t ?? null, hn(r, u, l), e.current.lanes = l, Sr(e, l, o), ut(e, o), e;
  }
  function uo(e, t, r, o) {
    var l = t.current, u = nt(), g = yn(l);
    return r = pc(r), t.context === null ? t.context = r : t.pendingContext = r, t = Xt(u, g), t.payload = { element: e }, o = o === void 0 ? null : o, o !== null && (t.callback = o), e = hn(l, t, g), e !== null && (At(e, l, g, u), Bi(e, l, g)), g;
  }
  function co(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function yc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function cl(e, t) {
    yc(e, t), (e = e.alternate) && yc(e, t);
  }
  function lf() {
    return null;
  }
  var vc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function dl(e) {
    this._internalRoot = e;
  }
  ho.prototype.render = dl.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(i(409));
    uo(e, t, null, null);
  }, ho.prototype.unmount = dl.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      In(function() {
        uo(null, e, null, null);
      }), t[Ut] = null;
    }
  };
  function ho(e) {
    this._internalRoot = e;
  }
  ho.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ea();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < rn.length && t !== 0 && t < rn[r].priority; r++) ;
      rn.splice(r, 0, e), r === 0 && ra(e);
    }
  };
  function hl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function fo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function mc() {
  }
  function af(e, t, r, o, l) {
    if (l) {
      if (typeof o == "function") {
        var u = o;
        o = function() {
          var B = co(g);
          u.call(B);
        };
      }
      var g = gc(t, o, e, 0, null, !1, !1, "", mc);
      return e._reactRootContainer = g, e[Ut] = g.current, Ir(e.nodeType === 8 ? e.parentNode : e), In(), g;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof o == "function") {
      var w = o;
      o = function() {
        var B = co(E);
        w.call(B);
      };
    }
    var E = ul(e, 0, !1, null, null, !1, !1, "", mc);
    return e._reactRootContainer = E, e[Ut] = E.current, Ir(e.nodeType === 8 ? e.parentNode : e), In(function() {
      uo(t, E, r, o);
    }), E;
  }
  function po(e, t, r, o, l) {
    var u = r._reactRootContainer;
    if (u) {
      var g = u;
      if (typeof l == "function") {
        var w = l;
        l = function() {
          var E = co(g);
          w.call(E);
        };
      }
      uo(t, g, e, l);
    } else g = af(r, t, e, l, o);
    return co(g);
  }
  Zl = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = kr(t.pendingLanes);
          r !== 0 && (Fo(t, r | 1), ut(t, ze()), (Te & 6) === 0 && (ur = ze() + 500, cn()));
        }
        break;
      case 13:
        In(function() {
          var o = $t(e, 1);
          if (o !== null) {
            var l = nt();
            At(o, e, 1, l);
          }
        }), cl(e, 1);
    }
  }, jo = function(e) {
    if (e.tag === 13) {
      var t = $t(e, 134217728);
      if (t !== null) {
        var r = nt();
        At(t, e, 134217728, r);
      }
      cl(e, 134217728);
    }
  }, Jl = function(e) {
    if (e.tag === 13) {
      var t = yn(e), r = $t(e, t);
      if (r !== null) {
        var o = nt();
        At(r, e, t, o);
      }
      cl(e, t);
    }
  }, ea = function() {
    return Pe;
  }, ta = function(e, t) {
    var r = Pe;
    try {
      return Pe = e, t();
    } finally {
      Pe = r;
    }
  }, No = function(e, t, r) {
    switch (t) {
      case "input":
        if (gr(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var o = r[t];
            if (o !== e && o.form === e.form) {
              var l = Ai(o);
              if (!l) throw Error(i(90));
              Re(o), gr(o, l);
            }
          }
        }
        break;
      case "textarea":
        Rt(e, r);
        break;
      case "select":
        t = r.value, t != null && Ee(e, !!r.multiple, t, !1);
    }
  }, Ol = rl, Bl = In;
  var uf = { usingClientEntryPoint: !1, Events: [zr, Kn, Ai, jl, zl, rl] }, Zr = { findFiberByHostInstance: En, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, cf = { bundleType: Zr.bundleType, version: Zr.version, rendererPackageName: Zr.rendererPackageName, rendererConfig: Zr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: U.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Vl(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Zr.findFiberByHostInstance || lf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var go = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!go.isDisabled && go.supportsFiber) try {
      di = go.inject(cf), Lt = go;
    } catch {
    }
  }
  return ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = uf, ct.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!hl(t)) throw Error(i(200));
    return sf(e, t, null, r);
  }, ct.createRoot = function(e, t) {
    if (!hl(e)) throw Error(i(299));
    var r = !1, o = "", l = vc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = ul(e, 1, !1, null, null, r, !1, o, l), e[Ut] = t.current, Ir(e.nodeType === 8 ? e.parentNode : e), new dl(t);
  }, ct.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
    return e = Vl(t), e = e === null ? null : e.stateNode, e;
  }, ct.flushSync = function(e) {
    return In(e);
  }, ct.hydrate = function(e, t, r) {
    if (!fo(t)) throw Error(i(200));
    return po(null, e, t, !0, r);
  }, ct.hydrateRoot = function(e, t, r) {
    if (!hl(e)) throw Error(i(405));
    var o = r != null && r.hydratedSources || null, l = !1, u = "", g = vc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (g = r.onRecoverableError)), t = gc(t, null, e, 1, r ?? null, l, !1, u, g), e[Ut] = t.current, Ir(e), o) for (e = 0; e < o.length; e++) r = o[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new ho(t);
  }, ct.render = function(e, t, r) {
    if (!fo(t)) throw Error(i(200));
    return po(null, e, t, !1, r);
  }, ct.unmountComponentAtNode = function(e) {
    if (!fo(e)) throw Error(i(40));
    return e._reactRootContainer ? (In(function() {
      po(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Ut] = null;
      });
    }), !0) : !1;
  }, ct.unstable_batchedUpdates = rl, ct.unstable_renderSubtreeIntoContainer = function(e, t, r, o) {
    if (!fo(r)) throw Error(i(200));
    if (e == null || e._reactInternals === void 0) throw Error(i(38));
    return po(e, t, r, !1, o);
  }, ct.version = "18.3.1-next-f1338f8080-20240426", ct;
}
var bc;
function kf() {
  if (bc) return gl.exports;
  bc = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (n) {
        console.error(n);
      }
  }
  return c(), gl.exports = xf(), gl.exports;
}
var Ec;
function Sf() {
  if (Ec) return yo;
  Ec = 1;
  var c = kf();
  return yo.createRoot = c.createRoot, yo.hydrateRoot = c.hydrateRoot, yo;
}
var wf = Sf(), L = Ml();
const Zc = L.createContext({
  register: () => {
  },
  unregister: () => {
  },
  focus: () => {
  },
  focusStack: []
});
function _f({ children: c }) {
  const [n, i] = L.useState([]), s = L.useCallback((h) => {
    i((p) => p.includes(h) ? p : [...p, h]);
  }, []), a = L.useCallback((h) => {
    i((p) => p.filter((y) => y !== h));
  }, []), d = L.useCallback((h) => {
    i((p) => [...p.filter((f) => f !== h), h]);
  }, []);
  return /* @__PURE__ */ v.jsx(Zc.Provider, { value: { register: s, unregister: a, focus: d, focusStack: n }, children: c });
}
function Jc({ id: c, layer: n }) {
  const { register: i, unregister: s, focus: a, focusStack: d } = L.useContext(Zc);
  L.useEffect(() => (i(c), () => s(c)), [c, i, s]);
  const h = d.indexOf(c);
  return {
    /** 当前计算出的 zIndex */
    zIndex: h >= 0 ? n + h : n,
    /** 调用此方法将该面板置顶 */
    onFocus: () => a(c)
  };
}
const Tf = 10;
function Pc(c, n, i, s) {
  const a = i.getBoundingClientRect(), d = window.innerWidth - a.width - s, h = window.innerHeight - a.height - s;
  return {
    x: Math.max(s, Math.min(c, d)),
    y: Math.max(s, Math.min(n, h))
  };
}
function Cf(c, n, i = Tf) {
  const s = L.useRef({ x: 0, y: 0 }), a = L.useRef(i);
  return a.current = i, L.useEffect(() => {
    if (c.current && n) {
      const h = Pc(
        n.x,
        n.y,
        c.current,
        a.current
      );
      c.current.style.transform = `translate(${h.x}px, ${h.y}px)`, s.current = h;
    }
  }, [c, n == null ? void 0 : n.x, n == null ? void 0 : n.y]), { onGripMouseDown: L.useCallback(
    (h) => {
      const p = c.current;
      if (!p) return;
      h.preventDefault();
      const y = h.clientX, f = h.clientY, k = s.current.x, _ = s.current.y, x = (N) => {
        const b = N, m = b.clientX - y, C = b.clientY - f, R = Pc(
          k + m,
          _ + C,
          p,
          a.current
        );
        p.style.transform = `translate(${R.x}px, ${R.y}px)`;
      }, S = () => {
        const N = p.style.transform.match(
          /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/
        );
        N && (s.current = { x: Number(N[1]), y: Number(N[2]) }), document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", S), document.removeEventListener("touchmove", x), document.removeEventListener("touchend", S);
      };
      document.addEventListener("mousemove", x), document.addEventListener("mouseup", S), document.addEventListener("touchmove", x, { passive: !0 }), document.addEventListener("touchend", S);
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
const ed = (...c) => c.filter((n, i, s) => !!n && n.trim() !== "" && s.indexOf(n) === i).join(" ").trim();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bf = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ef = (c) => c.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (n, i, s) => s ? s.toUpperCase() : i.toLowerCase()
);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nc = (c) => {
  const n = Ef(c);
  return n.charAt(0).toUpperCase() + n.slice(1);
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ml = {
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
const Pf = (c) => {
  for (const n in c)
    if (n.startsWith("aria-") || n === "role" || n === "title")
      return !0;
  return !1;
}, Nf = L.createContext({}), Af = () => L.useContext(Nf), Mf = L.forwardRef(
  ({ color: c, size: n, strokeWidth: i, absoluteStrokeWidth: s, className: a = "", children: d, iconNode: h, ...p }, y) => {
    const {
      size: f = 24,
      strokeWidth: k = 2,
      absoluteStrokeWidth: _ = !1,
      color: x = "currentColor",
      className: S = ""
    } = Af() ?? {}, N = s ?? _ ? Number(i ?? k) * 24 / Number(n ?? f) : i ?? k;
    return L.createElement(
      "svg",
      {
        ref: y,
        ...ml,
        width: n ?? f ?? ml.width,
        height: n ?? f ?? ml.height,
        stroke: c ?? x,
        strokeWidth: N,
        className: ed("lucide", S, a),
        ...!d && !Pf(p) && { "aria-hidden": "true" },
        ...p
      },
      [
        ...h.map(([b, m]) => L.createElement(b, m)),
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
const De = (c, n) => {
  const i = L.forwardRef(
    ({ className: s, ...a }, d) => L.createElement(Mf, {
      ref: d,
      iconNode: n,
      className: ed(
        `lucide-${bf(Nc(c))}`,
        `lucide-${c}`,
        s
      ),
      ...a
    })
  );
  return i.displayName = Nc(c), i;
};
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rf = [
  ["path", { d: "M12 5v16", key: "1f6ucr" }],
  [
    "path",
    {
      d: "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
      key: "1fyvmf"
    }
  ]
], Lf = De("book-open", Rf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Df = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
], If = De("camera", Df);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ff = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
], td = De("chart-column", Ff);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jf = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
], nd = De("clock", jf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zf = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], Ac = De("download", zf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Of = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
], Bf = De("funnel", Of);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uf = [
  ["path", { d: "M15 6a9 9 0 0 0-9 9V3", key: "1cii5b" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }]
], Wf = De("git-branch", Uf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hf = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
], Vf = De("map", Hf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $f = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
], Xf = De("maximize-2", $f);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yf = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], Gf = De("moon", Yf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qf = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
      key: "edeuup"
    }
  ]
], Kf = De("mouse-pointer-2", Qf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qf = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
], Zf = De("pause", qf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jf = [
  [
    "path",
    {
      d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
      key: "2hea0t"
    }
  ]
], ep = De("pentagon", Jf);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tp = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
], np = De("play", tp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rp = [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
], ip = De("redo-2", rp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const op = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], rd = De("rotate-ccw", op);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sp = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["path", { d: "m16 16-1.9-1.9", key: "1dq9hf" }]
], lp = De("scan-search", sp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ap = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], up = De("search", ap);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cp = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], dp = De("sliders-horizontal", cp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hp = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], fp = De("square", hp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pp = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], gp = De("sun", pp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yp = [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }]
], id = De("table", yp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vp = [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
], mp = De("undo-2", vp);
/**
 * @license lucide-react v1.28.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xp = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], kp = De("x", xp), Sp = {
  cursor: "grab",
  padding: "4px",
  paddingBottom: "0px",
  userSelect: "none",
  touchAction: "none"
}, wp = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: 20,
  height: 20,
  cursor: "nwse-resize",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end"
}, Mc = ({
  onPointerDown: c
}) => /* @__PURE__ */ v.jsx("div", { style: wp, onPointerDown: c, children: /* @__PURE__ */ v.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "#bbb", children: [
  /* @__PURE__ */ v.jsx("circle", { cx: "10", cy: "10", r: "1.5" }),
  /* @__PURE__ */ v.jsx("circle", { cx: "10", cy: "6", r: "1.5" }),
  /* @__PURE__ */ v.jsx("circle", { cx: "6", cy: "10", r: "1.5" })
] }) }), Qt = L.memo(function({
  id: n,
  layer: i,
  children: s,
  style: a,
  className: d,
  draggable: h,
  position: p,
  resizable: y,
  defaultSize: f,
  onClick: k,
  onClose: _
}) {
  const { zIndex: x, onFocus: S } = Jc({ id: n, layer: i }), N = L.useRef(null), { onGripMouseDown: b } = Cf(N, p, 10), [m, C] = L.useState(
    y && f ? f : null
  ), R = 200, X = 150, U = 10, H = L.useCallback(
    (D) => {
      S(), k == null || k(D);
    },
    [S, k]
  ), Y = L.useRef(null), A = L.useCallback(
    (D) => {
      if (!m) return;
      const j = D.currentTarget;
      j.setPointerCapture(D.pointerId), D.preventDefault(), Y.current = {
        startX: D.clientX,
        startY: D.clientY,
        startW: m.w,
        startH: m.h
      };
      const $ = (ye) => {
        const oe = Y.current;
        if (!oe) return;
        const le = ye, se = window.innerWidth - U * 2, K = window.innerHeight - U * 2, O = Math.min(se, le.clientX), F = Math.min(K, le.clientY);
        C({
          w: Math.max(R, Math.min(oe.startW + O - oe.startX, se)),
          h: Math.max(X, Math.min(oe.startH + F - oe.startY, K))
        });
      }, ee = () => {
        Y.current = null, j.releasePointerCapture(D.pointerId), j.removeEventListener("pointermove", $), j.removeEventListener("pointerup", ee);
      };
      j.addEventListener("pointermove", $), j.addEventListener("pointerup", ee);
    },
    [m]
  );
  return h ? /* @__PURE__ */ v.jsxs(
    "div",
    {
      ref: N,
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        willChange: "transform",
        ...a,
        width: m == null ? void 0 : m.w,
        height: m == null ? void 0 : m.h,
        zIndex: x
      },
      className: d,
      onClick: H,
      children: [
        /* @__PURE__ */ v.jsx(
          "div",
          {
            style: {
              ...Sp
            },
            className: "panel-grip",
            onMouseDown: b,
            children: _ && /* @__PURE__ */ v.jsx(
              "button",
              {
                onClick: (D) => {
                  D.stopPropagation(), _();
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
        y && /* @__PURE__ */ v.jsx(Mc, { onPointerDown: A })
      ]
    }
  ) : /* @__PURE__ */ v.jsxs(
    "div",
    {
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${(p == null ? void 0 : p.x) ?? 100}px, ${(p == null ? void 0 : p.y) ?? 100}px)`,
        ...a,
        width: m == null ? void 0 : m.w,
        height: m == null ? void 0 : m.h,
        zIndex: x
      },
      className: d,
      onClick: H,
      children: [
        s,
        y && /* @__PURE__ */ v.jsx(Mc, { onPointerDown: A })
      ]
    }
  );
});
var Mt = /* @__PURE__ */ ((c) => (c[c.Tooltip = 1e3] = "Tooltip", c[c.Panel = 1100] = "Panel", c[c.Toolbar = 800] = "Toolbar", c[c.Overlay = 3e3] = "Overlay", c[c.Notification = 9900] = "Notification", c))(Mt || {});
const od = L.createContext(null), Rc = "kg-theme";
function _p({ children: c }) {
  const [n, i] = L.useState(() => localStorage.getItem(Rc) === "dark" ? "dark" : "light"), s = L.useCallback((d) => i(d), []), a = L.useCallback(
    () => i((d) => d === "light" ? "dark" : "light"),
    []
  );
  return L.useEffect(() => {
    document.documentElement.dataset.theme = n, localStorage.setItem(Rc, n);
  }, [n]), /* @__PURE__ */ v.jsx(od.Provider, { value: { theme: n, setTheme: s, toggle: a }, children: c });
}
function _o() {
  const c = L.useContext(od);
  if (!c) throw new Error("useTheme must be used within ThemeProvider");
  return c;
}
const Tp = {
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
}, Cp = {
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
}, bp = { light: Tp, dark: Cp };
function fr(c) {
  return bp[c];
}
function xl(c, n = 1) {
  const i = c.replace("#", ""), s = parseInt(i.slice(0, 2), 16), a = parseInt(i.slice(2, 4), 16), d = parseInt(i.slice(4, 6), 16);
  return `rgba(${s}, ${a}, ${d}, ${n})`;
}
const Ep = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认"
};
function Pp({ onClose: c }) {
  const { theme: n } = _o(), i = Object.fromEntries(
    Object.entries(fr(n).node).map(([s, a]) => [s, a.bg])
  );
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "legend-panel",
      layer: Mt.Panel,
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
        /* @__PURE__ */ v.jsxs(
          "div",
          {
            style: {
              padding: "10px 12px",
              borderBottom: "1px solid rgb(var(--border))"
            },
            children: [
              /* @__PURE__ */ v.jsx(
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
              Object.entries(i).map(([s, a]) => /* @__PURE__ */ v.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "3px 0"
                  },
                  children: [
                    /* @__PURE__ */ v.jsx(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: a,
                          border: "1px solid rgba(0,0,0,0.15)",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ v.jsx("span", { children: Ep[s] ?? s })
                  ]
                },
                s
              ))
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs("div", { style: { padding: "10px 12px" }, children: [
          /* @__PURE__ */ v.jsx(
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
          /* @__PURE__ */ v.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ v.jsx(
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
                /* @__PURE__ */ v.jsx("span", { children: "默认关系" })
              ]
            }
          ),
          /* @__PURE__ */ v.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ v.jsx(
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
                /* @__PURE__ */ v.jsx("span", { children: "悬停高亮" })
              ]
            }
          ),
          /* @__PURE__ */ v.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0"
              },
              children: [
                /* @__PURE__ */ v.jsx(
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
                /* @__PURE__ */ v.jsx("span", { children: "关联高亮" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const Np = 200, Ap = 150, Mp = 800, Rp = 600, Lp = 60, Dp = 0.1, Ip = 2, Fp = "rgba(0, 102, 255, 0.25)", jp = "#0066ff";
function zp({ viewRef: c }) {
  const n = L.useRef(null), i = L.useRef(0), s = L.useRef(!1), { theme: a } = _o(), d = L.useCallback(() => {
    const x = c.current;
    return x ? x.model.getGraphModelData().graphData : null;
  }, [c]), h = L.useCallback(() => {
    const x = d();
    if (!x || x.nodes.length === 0) return null;
    let S = 1 / 0, N = 1 / 0, b = -1 / 0, m = -1 / 0;
    for (const D of x.nodes) {
      const j = D.x ?? 0, $ = D.y ?? 0;
      j < S && (S = j), $ < N && (N = $), j > b && (b = j), $ > m && (m = $);
    }
    const C = Math.max(b - S, 1), R = Math.max(m - N, 1), X = Math.max(
      Lp,
      Math.max(C, R) * Dp
    ), U = Math.max(Mp, C + X * 2), H = Math.max(Rp, R + X * 2), Y = (S + b) / 2, A = (N + m) / 2;
    return { x: Y - U / 2, y: A - H / 2, width: U, height: H };
  }, [d]), p = L.useCallback(() => {
    const x = c.current;
    if (!x) return null;
    const S = x.renderer.interaction.transform, N = x.renderer.canvas, b = N.clientWidth, m = N.clientHeight;
    return !b || !m ? null : {
      left: -S.x,
      top: -S.y,
      right: b / S.k - S.x,
      bottom: m / S.k - S.y
    };
  }, [c]), y = L.useCallback(
    (x) => {
      const S = c.current;
      if (!S) return;
      const N = h();
      if (!N) return;
      const b = n.current, m = b == null ? void 0 : b.getBoundingClientRect();
      if (!b || !m) return;
      const C = b.clientWidth || 1, R = b.clientHeight || 1, X = x.clientX - m.left, U = x.clientY - m.top, H = N.x + X / C * N.width, Y = N.y + U / R * N.height, A = S.renderer.interaction.transform, D = S.renderer.canvas;
      A.x = D.clientWidth / (2 * A.k) - H, A.y = D.clientHeight / (2 * A.k) - Y;
    },
    [c, h]
  ), f = L.useCallback(
    (x) => {
      var S, N;
      (N = (S = x.currentTarget).setPointerCapture) == null || N.call(S, x.pointerId), s.current = !0, y(x);
    },
    [y]
  ), k = L.useCallback(
    (x) => {
      s.current && y(x);
    },
    [y]
  ), _ = L.useCallback((x) => {
    var S, N;
    s.current = !1;
    try {
      (N = (S = x.currentTarget).releasePointerCapture) == null || N.call(S, x.pointerId);
    } catch {
    }
  }, []);
  return L.useEffect(() => {
    const x = n.current;
    if (!x) return;
    const S = x.getContext("2d"), N = () => {
      const b = x.clientWidth, m = x.clientHeight;
      if (b === 0 || m === 0) {
        i.current = requestAnimationFrame(N);
        return;
      }
      const C = window.devicePixelRatio || 1, R = Math.round(b * C), X = Math.round(m * C);
      (x.width !== R || x.height !== X) && (x.width = R, x.height = X), S.setTransform(C, 0, 0, C, 0, 0);
      const U = c.current, H = d(), Y = h(), A = p();
      if (!U || !H || !Y || !A) {
        i.current = requestAnimationFrame(N);
        return;
      }
      const D = fr(a), j = (O, F) => [
        (O - Y.x) / Y.width * b,
        (F - Y.y) / Y.height * m
      ];
      S.clearRect(0, 0, b, m), S.fillStyle = D.canvas, S.beginPath(), S.roundRect(0, 0, b, m, 6), S.fill(), S.save(), S.beginPath(), S.roundRect(0, 0, b, m, 6), S.clip();
      const $ = /* @__PURE__ */ new Map();
      for (const O of H.nodes)
        $.set(String(O.id), { x: O.x ?? 0, y: O.y ?? 0 });
      S.strokeStyle = xl(D.link.default, 0.5), S.lineWidth = 0.5;
      for (const O of H.links) {
        const F = typeof O.source == "object" ? String(O.source.id) : String(O.source), W = typeof O.target == "object" ? String(O.target.id) : String(O.target), q = $.get(F), P = $.get(W);
        if (!q || !P) continue;
        const [V, de] = j(q.x, q.y), [ae, xe] = j(P.x, P.y);
        S.beginPath(), S.moveTo(V, de), S.lineTo(ae, xe), S.stroke();
      }
      S.fillStyle = xl(D.text, 0.6);
      for (const O of H.nodes) {
        const [F, W] = j(O.x ?? 0, O.y ?? 0);
        S.beginPath(), S.arc(F, W, Ip, 0, Math.PI * 2), S.fill();
      }
      const ee = (A.right - A.left) / Y.width, ye = (A.bottom - A.top) / Y.height, oe = b * ee, le = m * ye, se = (A.left - Y.x) / Y.width * b, K = (A.top - Y.y) / Y.height * m;
      S.fillStyle = Fp, S.fillRect(se, K, oe, le), S.strokeStyle = jp, S.lineWidth = 1, S.strokeRect(se, K, oe, le), S.restore(), S.strokeStyle = xl(D.muted, 0.6), S.lineWidth = 1, S.beginPath(), S.roundRect(0, 0, b, m, 6), S.stroke(), i.current = requestAnimationFrame(N);
    };
    return i.current = requestAnimationFrame(N), () => {
      cancelAnimationFrame(i.current);
    };
  }, [c, d, h, p, a]), /* @__PURE__ */ v.jsx(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 12,
        right: 12,
        width: Np,
        height: Ap,
        borderRadius: 6,
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        zIndex: 100
      },
      onPointerDown: f,
      onPointerMove: k,
      onPointerUp: _,
      onPointerLeave: _,
      children: /* @__PURE__ */ v.jsx(
        "canvas",
        {
          ref: n,
          style: { width: "100%", height: "100%", display: "block" }
        }
      )
    }
  );
}
const sd = L.createContext(null);
function Kt() {
  const c = L.useContext(sd);
  if (!c) throw new Error("useAppCtx must be used within AppProvider");
  return c;
}
function Op({
  value: c,
  children: n
}) {
  return /* @__PURE__ */ v.jsx(sd.Provider, { value: c, children: n });
}
const Lc = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function Bp({ loadedNeighbors: c }) {
  var y, f, k, _;
  const { hoveredNode: n, mousePos: i } = Kt(), s = n, a = i, d = ((y = s.data) == null ? void 0 : y.neighbors) ?? {}, h = Object.keys(d).length, p = Object.values(d).reduce(
    (x, S) => x + Object.values(S).reduce((N, b) => N + (b.total ?? 0), 0),
    0
  );
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "node-tooltip",
      layer: Mt.Tooltip,
      position: { x: a.x + 16, y: a.y - 12 },
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
        /* @__PURE__ */ v.jsx(
          "div",
          {
            style: {
              color: "#e94560",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: ((f = s.data) == null ? void 0 : f.label) ?? s.id
          }
        ),
        /* @__PURE__ */ v.jsxs(
          "div",
          {
            style: {
              color: "rgb(var(--muted))",
              fontSize: "11px",
              marginBottom: 6
            },
            children: [
              Lc[((k = s.data) == null ? void 0 : k.nodeType) ?? ""] ?? ((_ = s.data) == null ? void 0 : _.nodeType),
              " · ",
              h,
              " 类关联 · 共 ",
              p,
              " 条"
            ]
          }
        ),
        /* @__PURE__ */ v.jsx(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: Object.entries(d).map(([x, S]) => {
              const N = Object.entries(S), b = c[x] ?? { out: 0, in: 0 }, m = b.out + b.in, C = N.reduce((R, [, X]) => R + X.total, 0) - m;
              return /* @__PURE__ */ v.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8 }, children: [
                /* @__PURE__ */ v.jsx(
                  "span",
                  {
                    style: { color: "rgb(var(--foreground))", fontWeight: "bold" },
                    children: Lc[x] ?? x
                  }
                ),
                /* @__PURE__ */ v.jsx(
                  "span",
                  {
                    style: {
                      color: "rgb(var(--muted))",
                      marginLeft: 4,
                      fontSize: "11px"
                    },
                    children: C > 0 ? `可拓 ${C}` : "已拓完"
                  }
                )
              ] }, x);
            })
          }
        )
      ]
    }
  );
}
const Up = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
};
function Wp(c) {
  const { hoveredLink: n, mousePos: i } = Kt(), s = n, a = i, d = s.data ?? {}, h = d.linkType ?? "", p = d.label ?? "", y = d.time ?? "", f = typeof s.source == "object" ? s.source.id : s.source, k = typeof s.target == "object" ? s.target.id : s.target;
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "link-tooltip",
      layer: Mt.Tooltip,
      position: { x: a.x + 16, y: a.y - 12 },
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
        /* @__PURE__ */ v.jsx(
          "div",
          {
            style: {
              color: "#0288d1",
              fontWeight: "bold",
              marginBottom: 4,
              fontSize: "14px"
            },
            children: Up[h] ?? h
          }
        ),
        /* @__PURE__ */ v.jsx(
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
        /* @__PURE__ */ v.jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid rgb(var(--border))",
              margin: "4px 0",
              paddingTop: 4
            },
            children: [
              p && /* @__PURE__ */ v.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ v.jsx("span", { style: { color: "#8899aa" }, children: "描述: " }),
                /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold" }, children: p })
              ] }),
              y && /* @__PURE__ */ v.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ v.jsx("span", { style: { color: "#8899aa" }, children: "时间: " }),
                /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold" }, children: y })
              ] }),
              /* @__PURE__ */ v.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ v.jsx("span", { style: { color: "#8899aa" }, children: "源节点: " }),
                f
              ] }),
              /* @__PURE__ */ v.jsxs("div", { style: { fontSize: "12px", lineHeight: 1.8, color: "#333" }, children: [
                /* @__PURE__ */ v.jsx("span", { style: { color: "#8899aa" }, children: "目标节点: " }),
                k
              ] })
            ]
          }
        )
      ]
    }
  );
}
const Hp = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
}, Vp = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, $p = {
  label: "名称/标识",
  gender: "性别",
  age: "年龄",
  caseWeight: "案件权重"
}, Dc = {
  person: [
    { name: "label", type: "string" },
    { name: "gender", type: "string" },
    { name: "age", type: "number" },
    { name: "caseWeight", type: "number" }
  ],
  phone: [{ name: "label", type: "string" }],
  address: [{ name: "label", type: "string" }],
  account: [{ name: "label", type: "string" }]
}, Xp = {
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
function Yp({
  node: c,
  loadedNeighbors: n,
  x: i,
  y: s,
  onExpand: a,
  onClose: d
}) {
  var de, ae, xe, ge;
  const h = ((de = c.data) == null ? void 0 : de.neighbors) ?? {}, p = Object.keys(h), y = L.useMemo(
    () => p.filter((Z) => {
      const ne = Object.values(h[Z] ?? {}).reduce(
        (re, Se) => re + (Se.total ?? 0),
        0
      ), ie = n[Z] ?? { out: 0, in: 0 };
      return ne - (ie.out + ie.in) > 0;
    }),
    [p, h, n]
  ), f = (Z) => h[Z] ? Object.keys(h[Z]) : [], k = (Z, ne) => {
    var re;
    const ie = (re = h[Z]) == null ? void 0 : re[ne];
    return ie != null && ie.out && ie.out > 0 ? "out" : ie != null && ie.in && ie.in > 0 ? "in" : "";
  }, _ = (Z, ne) => {
    var Re;
    const ie = (Re = h[Z]) == null ? void 0 : Re[ne], re = n[Z] ?? { out: 0, in: 0 }, Se = [];
    return ((ie == null ? void 0 : ie.out) ?? 0) - re.out > 0 && Se.push("out"), ((ie == null ? void 0 : ie.in) ?? 0) - re.in > 0 && Se.push("in"), Se;
  }, x = y[0] ?? "", S = x ? f(x)[0] ?? "" : "", [N, b] = L.useState([
    {
      targetType: x,
      relationType: S,
      direction: k(x, S),
      filters: []
    }
  ]), [m, C] = L.useState(/* @__PURE__ */ new Set()), R = (Z, ne) => `${Z}.${ne}`, X = () => {
    const Z = /* @__PURE__ */ new Set();
    return N.forEach((ne, ie) => {
      ne.targetType || Z.add(R(ie, "targetType")), ne.relationType || Z.add(R(ie, "relationType")), ne.direction || Z.add(R(ie, "direction"));
    }), C(Z), Z.size === 0;
  }, U = (Z, ne) => {
    C((ie) => {
      const re = new Set(ie);
      return re.delete(R(Z, ne)), re;
    });
  }, H = (Z, ne) => {
    b((ie) => {
      const re = ie.map((Se, Re) => Re === Z ? { ...Se, ...ne } : Se);
      if ("targetType" in ne || "relationType" in ne) {
        const Se = re[Z], Re = f(Se.targetType);
        Se.relationType && !Re.includes(Se.relationType) && (re[Z] = { ...Se, relationType: Re[0], filters: [] });
        const Be = _(
          re[Z].targetType,
          re[Z].relationType
        );
        re[Z] = {
          ...re[Z],
          direction: Be[0] ?? ""
        };
      }
      return re;
    }), Object.keys(ne).forEach((ie) => U(Z, ie));
  }, Y = () => {
    const Z = y[0] ?? "", ne = Z ? f(Z)[0] ?? "" : "";
    b((ie) => [
      ...ie,
      {
        targetType: Z,
        relationType: ne,
        direction: k(Z, ne),
        filters: []
      }
    ]);
  }, A = (Z) => {
    b((ne) => ne.filter((ie, re) => re !== Z));
  }, D = (Z) => {
    b(
      (ne) => ne.map(
        (ie, re) => re === Z ? {
          ...ie,
          filters: [
            ...ie.filters,
            { property: "", operator: "eq", value: "" }
          ]
        } : ie
      )
    );
  }, j = (Z, ne, ie) => {
    b(
      (re) => re.map(
        (Se, Re) => Re === Z ? {
          ...Se,
          filters: Se.filters.map(
            (Be, be) => be === ne ? { ...Be, ...ie } : Be
          )
        } : Se
      )
    );
  }, $ = (Z, ne) => {
    b(
      (ie) => ie.map(
        (re, Se) => Se === Z ? { ...re, filters: re.filters.filter((Re, Be) => Be !== ne) } : re
      )
    );
  }, ee = (Z) => Dc[Z] ?? [{ name: "label", type: "string" }], ye = (Z) => Object.entries(Xp).filter(([, ne]) => ne.types.includes(Z)).map(([ne, ie]) => ({ key: ne, label: ie.label })), oe = (Z, ne, ie) => m.has(R(Z, ne)) ? { ...ie, borderColor: "#d32f2f", outline: "1px solid #d32f2f" } : ie, le = (Z, ne) => {
    var re;
    const ie = Dc[Z];
    return ((re = ie == null ? void 0 : ie.find((Se) => Se.name === ne)) == null ? void 0 : re.type) ?? "string";
  }, se = document.querySelector("canvas"), K = (se == null ? void 0 : se.getBoundingClientRect()) ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }, O = K.top + K.height, F = K.left + K.width, W = 420, q = Math.max(250, Math.round(window.innerHeight * 0.2));
  let P = i, V = s;
  return P + W > F - 10 && (P = F - W - 10), V + q > O - 10 && (V = O - q - 10), V < K.top + 10 && (V = K.top + 10), /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "rule-menu",
      layer: Mt.Panel,
      draggable: !0,
      onClose: d,
      position: { x: P, y: V },
      style: {
        width: W,
        maxHeight: q,
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
      onClick: (Z) => Z.stopPropagation(),
      children: [
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(
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
                  children: ((xe = (ae = c.data) == null ? void 0 : ae.label) == null ? void 0 : xe[0]) ?? "?"
                }
              ),
              /* @__PURE__ */ v.jsx(
                "span",
                {
                  style: {
                    fontWeight: "bold",
                    fontSize: "13px",
                    color: "rgb(var(--foreground))"
                  },
                  children: ((ge = c.data) == null ? void 0 : ge.label) ?? c.id
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "6px 0" }, children: [
          N.map((Z, ne) => {
            const ie = ee(Z.targetType);
            return /* @__PURE__ */ v.jsxs(
              "div",
              {
                style: {
                  margin: "4px 10px",
                  background: "rgb(var(--hover))",
                  borderRadius: 6,
                  border: "1px solid rgb(var(--border))"
                },
                children: [
                  /* @__PURE__ */ v.jsxs(
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
                        /* @__PURE__ */ v.jsx(
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
                        /* @__PURE__ */ v.jsx(
                          "span",
                          {
                            style: {
                              color: Z.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: Z.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ v.jsxs(
                          "select",
                          {
                            value: Z.relationType,
                            onChange: (re) => H(ne, { relationType: re.target.value }),
                            style: oe(ne, "relationType", {
                              ...ei,
                              width: 65
                            }),
                            children: [
                              /* @__PURE__ */ v.jsx("option", { value: "", children: "关系" }),
                              f(Z.targetType).map((re) => /* @__PURE__ */ v.jsx("option", { value: re, children: Vp[re] ?? re }, re))
                            ]
                          }
                        ),
                        /* @__PURE__ */ v.jsx(
                          "span",
                          {
                            style: {
                              color: Z.direction === "out" ? "#1976d2" : "#e67e22",
                              fontSize: "13px"
                            },
                            children: Z.direction === "out" ? "→" : "←"
                          }
                        ),
                        /* @__PURE__ */ v.jsxs(
                          "select",
                          {
                            value: Z.targetType,
                            onChange: (re) => H(ne, { targetType: re.target.value }),
                            style: oe(ne, "targetType", {
                              ...ei,
                              width: 85
                            }),
                            children: [
                              /* @__PURE__ */ v.jsx("option", { value: "", children: "类型" }),
                              y.map((re) => {
                                const Se = Object.values(h[re] ?? {}).reduce(
                                  (be, zt) => be + (zt.total ?? 0),
                                  0
                                ), Re = n[re] ?? { out: 0, in: 0 }, Be = Se - (Re.out + Re.in);
                                return /* @__PURE__ */ v.jsxs("option", { value: re, children: [
                                  Hp[re] ?? re,
                                  " (",
                                  Be,
                                  ")"
                                ] }, re);
                              })
                            ]
                          }
                        ),
                        /* @__PURE__ */ v.jsxs(
                          "select",
                          {
                            value: Z.direction,
                            onChange: (re) => H(ne, { direction: re.target.value }),
                            style: oe(ne, "direction", {
                              ...ei,
                              width: 100
                            }),
                            children: [
                              /* @__PURE__ */ v.jsx("option", { value: "", children: "方向" }),
                              (() => {
                                var zt;
                                const re = (zt = h[Z.targetType]) == null ? void 0 : zt[Z.relationType], Se = n[Z.targetType] ?? {
                                  out: 0,
                                  in: 0
                                }, Re = ((re == null ? void 0 : re.out) ?? 0) - Se.out, Be = ((re == null ? void 0 : re.in) ?? 0) - Se.in, be = [];
                                return Re > 0 && be.push({
                                  value: "out",
                                  label: `从本节点 (${Re})`
                                }), Be > 0 && be.push({
                                  value: "in",
                                  label: `指向本节点 (${Be})`
                                }), be.length > 0 && be.map((Ot) => /* @__PURE__ */ v.jsx("option", { value: Ot.value, children: Ot.label }, Ot.value));
                              })()
                            ]
                          }
                        ),
                        N.length > 1 && /* @__PURE__ */ v.jsx(
                          "span",
                          {
                            style: {
                              color: "#d32f2f",
                              cursor: "pointer",
                              fontSize: "14px"
                            },
                            onClick: () => A(ne),
                            children: "✕"
                          }
                        )
                      ]
                    }
                  ),
                  Z.filters.map((re, Se) => {
                    const Re = re.property ? le(Z.targetType, re.property) : "string", Be = ye(Re);
                    return /* @__PURE__ */ v.jsxs(
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
                          /* @__PURE__ */ v.jsxs(
                            "select",
                            {
                              value: re.property,
                              onChange: (be) => j(ne, Se, {
                                property: be.target.value,
                                operator: "eq",
                                value: ""
                              }),
                              style: { ...ei, width: 80 },
                              children: [
                                /* @__PURE__ */ v.jsx("option", { value: "", children: "属性" }),
                                ie.map((be) => /* @__PURE__ */ v.jsx("option", { value: be.name, children: $p[be.name] ?? be.name }, be.name))
                              ]
                            }
                          ),
                          re.property && /* @__PURE__ */ v.jsxs(v.Fragment, { children: [
                            /* @__PURE__ */ v.jsx(
                              "select",
                              {
                                value: re.operator,
                                onChange: (be) => j(ne, Se, { operator: be.target.value }),
                                style: { ...ei, width: 80 },
                                children: Be.map((be) => /* @__PURE__ */ v.jsx("option", { value: be.key, children: be.label }, be.key))
                              }
                            ),
                            re.operator === "between" ? /* @__PURE__ */ v.jsxs(
                              "span",
                              {
                                style: {
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center"
                                },
                                children: [
                                  /* @__PURE__ */ v.jsx(
                                    "input",
                                    {
                                      placeholder: "min",
                                      value: re.value,
                                      onChange: (be) => j(ne, Se, { value: be.target.value }),
                                      style: { ...Cl, width: 50 }
                                    }
                                  ),
                                  /* @__PURE__ */ v.jsx("span", { style: { color: "#667" }, children: "~" })
                                ]
                              }
                            ) : /* @__PURE__ */ v.jsx(
                              "input",
                              {
                                placeholder: "值",
                                value: re.value,
                                onChange: (be) => j(ne, Se, { value: be.target.value }),
                                style: { ...Cl, width: 60 }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ v.jsx(
                            "span",
                            {
                              style: {
                                color: "#d32f2f",
                                cursor: "pointer",
                                fontSize: "12px"
                              },
                              onClick: () => $(ne, Se),
                              children: "✕"
                            }
                          )
                        ]
                      },
                      Se
                    );
                  }),
                  /* @__PURE__ */ v.jsx(
                    "div",
                    {
                      style: {
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: /* @__PURE__ */ v.jsx(
                        "span",
                        {
                          style: {
                            color: "#1976d2",
                            cursor: "pointer",
                            fontSize: "11px"
                          },
                          onClick: () => D(ne),
                          children: "+ 添加过滤条件"
                        }
                      )
                    }
                  )
                ]
              },
              ne
            );
          }),
          /* @__PURE__ */ v.jsx("div", { style: { textAlign: "center", padding: "6px 0" }, children: /* @__PURE__ */ v.jsx(
            "span",
            {
              style: { color: "#1976d2", cursor: "pointer", fontSize: "12px" },
              onClick: Y,
              children: "+ 添加拓出条件"
            }
          ) })
        ] }),
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(
                "button",
                {
                  style: {
                    ...Ic,
                    border: "1px solid rgb(var(--border-strong))",
                    background: "transparent",
                    color: "rgb(var(--muted))"
                  },
                  onClick: d,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ v.jsx(
                "button",
                {
                  style: {
                    ...Ic,
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold"
                  },
                  onClick: () => {
                    X() && (a(c.id, ["__custom__"], N), d());
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
const Cl = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  color: "rgb(var(--foreground))",
  padding: "3px 6px",
  fontSize: "11px",
  outline: "none",
  fontFamily: "monospace"
}, ei = {
  ...Cl,
  cursor: "pointer"
}, Ic = {
  padding: "5px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "11px"
};
function Gp() {
  return /* @__PURE__ */ v.jsxs(
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
        /* @__PURE__ */ v.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
        /* @__PURE__ */ v.jsx("circle", { cx: "12", cy: "13", r: "4" })
      ]
    }
  );
}
function Qp() {
  return /* @__PURE__ */ v.jsxs(
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
        /* @__PURE__ */ v.jsx("polyline", { points: "3 6 5 6 21 6" }),
        /* @__PURE__ */ v.jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
      ]
    }
  );
}
const Kp = {
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
}, qp = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderBottom: "1px solid rgb(var(--border))",
  fontWeight: 600,
  fontSize: "13px"
}, Zp = {
  display: "flex",
  gap: "6px"
}, Jp = {
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
}, eg = {
  flex: 1,
  overflowY: "auto",
  padding: "4px 0"
}, ld = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  borderLeft: "3px solid transparent",
  transition: "background 0.15s"
}, tg = {
  ...ld,
  borderLeft: "3px solid #e94560",
  background: "rgba(233,69,96,0.06)"
}, ng = {
  flex: 1,
  overflow: "hidden"
}, rg = {
  fontSize: "12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}, ig = {
  fontSize: "10px",
  color: "rgb(var(--muted))",
  marginTop: 2
}, og = {
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
}, sg = {
  padding: "20px",
  textAlign: "center",
  color: "rgb(var(--muted))",
  fontSize: "11px"
};
function lg(c) {
  const n = new Date(c);
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")} ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`;
}
function ag({
  historyManager: c,
  currentIndex: n,
  onTakeSnapshot: i,
  onJumpTo: s,
  onDeleteEntry: a,
  onClose: d
}) {
  const h = L.useRef(null), p = c.getHistory();
  return L.useEffect(() => {
    if (!h.current) return;
    const y = h.current.children[n];
    y && y.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [n]), /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "snapshot-panel",
      layer: Mt.Panel,
      draggable: !0,
      onClose: d,
      resizable: !0,
      defaultSize: { w: 260, h: 300 },
      position: { x: window.innerWidth - 280, y: 40 },
      style: Kp,
      children: [
        /* @__PURE__ */ v.jsxs("div", { style: qp, children: [
          /* @__PURE__ */ v.jsx("span", { children: "📸 快照" }),
          /* @__PURE__ */ v.jsx("div", { style: Zp, children: /* @__PURE__ */ v.jsx(
            "button",
            {
              style: Jp,
              onClick: i,
              title: "拍摄快照",
              onMouseEnter: (y) => {
                y.currentTarget.style.background = "rgba(233,69,96,0.2)";
              },
              onMouseLeave: (y) => {
                y.currentTarget.style.background = "transparent";
              },
              children: /* @__PURE__ */ v.jsx(Gp, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ v.jsx("div", { ref: h, style: eg, children: p.length === 0 ? /* @__PURE__ */ v.jsxs("div", { style: sg, children: [
          "暂无快照",
          /* @__PURE__ */ v.jsx("br", {}),
          /* @__PURE__ */ v.jsx("span", { style: { fontSize: 10 }, children: "点击 📷 拍摄当前图谱" })
        ] }) : p.map((y, f) => {
          const k = f === n;
          return /* @__PURE__ */ v.jsxs(
            "div",
            {
              style: k ? tg : ld,
              onClick: () => s(f),
              onMouseEnter: (_) => {
                k || (_.currentTarget.style.background = "rgb(var(--hover))");
                const x = _.currentTarget.querySelector(
                  ".del-btn"
                );
                x && (x.style.opacity = "1");
              },
              onMouseLeave: (_) => {
                k || (_.currentTarget.style.background = "transparent");
                const x = _.currentTarget.querySelector(
                  ".del-btn"
                );
                x && (x.style.opacity = "0");
              },
              children: [
                /* @__PURE__ */ v.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 14,
                      opacity: k ? 1 : 0.4,
                      flexShrink: 0
                    },
                    children: k ? "●" : "○"
                  }
                ),
                /* @__PURE__ */ v.jsxs("div", { style: ng, children: [
                  /* @__PURE__ */ v.jsx("div", { style: rg, children: y.description || y.type }),
                  /* @__PURE__ */ v.jsx("div", { style: ig, children: lg(y.timestamp) })
                ] }),
                /* @__PURE__ */ v.jsx(
                  "button",
                  {
                    className: "del-btn",
                    style: og,
                    onClick: (_) => {
                      _.stopPropagation(), a(f);
                    },
                    onMouseEnter: (_) => {
                      _.currentTarget.style.color = "rgb(var(--primary))";
                    },
                    onMouseLeave: (_) => {
                      _.currentTarget.style.color = "rgb(var(--muted))";
                    },
                    children: /* @__PURE__ */ v.jsx(Qp, {})
                  }
                )
              ]
            },
            f
          );
        }) }),
        /* @__PURE__ */ v.jsxs(
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
function ad() {
  const [c, n] = L.useState({
    status: "idle",
    data: null,
    error: null
  }), i = L.useRef(0), s = L.useRef(null), a = L.useCallback(async (h) => {
    var f;
    const p = ++i.current;
    (f = s.current) == null || f.abort();
    const y = new AbortController();
    s.current = y, n((k) => ({ ...k, status: "loading", error: null }));
    try {
      const k = await h(y.signal);
      return p !== i.current ? void 0 : (n({ status: "success", data: k, error: null }), k);
    } catch (k) {
      if (p !== i.current || (k == null ? void 0 : k.name) === "AbortError") return;
      n({
        status: "error",
        data: null,
        error: k instanceof Error ? k.message : String(k)
      });
    }
  }, []), d = L.useCallback(() => {
    var h;
    i.current++, (h = s.current) == null || h.abort(), n({ status: "idle", data: null, error: null });
  }, []);
  return L.useEffect(() => () => {
    var h;
    i.current++, (h = s.current) == null || h.abort();
  }, []), {
    ...c,
    run: a,
    reset: d,
    isLoading: c.status === "loading",
    isSuccess: c.status === "success",
    isError: c.status === "error"
  };
}
const ug = "/api/v1";
let bl = "";
function cg(c) {
  bl = c;
}
async function vo(c, n, i) {
  const s = {
    "Content-Type": "application/json"
  };
  bl && (s.Authorization = `Bearer ${bl}`);
  const a = await fetch(`${ug}${c}`, {
    method: "POST",
    headers: s,
    body: JSON.stringify(n),
    signal: i
  });
  if (!a.ok) {
    const h = await a.text();
    throw new Error(`API ${c} failed (${a.status}): ${h}`);
  }
  const d = await a.json();
  if (!d.success) throw new Error(`API ${c} failed`);
  return d.data;
}
const oi = {
  init(c) {
    return vo("/graph/init", { ids: c });
  },
  search(c, n = 10, i) {
    return vo("/graph/search", { query: c, limit: n }, i);
  },
  expand(c) {
    return vo("/graph/expand", c);
  },
  analyze(c, n) {
    return vo("/graph/analyze", c, n);
  }
}, dg = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账"
}, hg = [
  { value: "1d", label: "1 天" },
  { value: "7d", label: "1 周" },
  { value: "30d", label: "1 个月" },
  { value: "90d", label: "3 个月" },
  { value: "365d", label: "1 年" }
], kl = [
  {
    value: "call_circle",
    label: "通话圈分析",
    params: [
      {
        key: "timeWindow",
        label: "时间范围",
        type: "select",
        options: hg
      }
    ],
    resultLabel: (c) => c.label ?? c.id,
    resultDetail: (c) => `${dg[c.relation] ?? c.relation} · ${c.count ?? 0} 次${c.time ? ` · ${c.time}` : ""}`
  }
], Fc = {
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
function fg({
  modelRef: c,
  viewRef: n,
  onClose: i,
  onExpand: s
}) {
  const { analysisTarget: a } = Kt(), [d, h] = L.useState(kl[0].value), [p, y] = L.useState([]), [f, k] = L.useState(null), [_, x] = L.useState({
    timeWindow: "1d"
  }), { run: S, isLoading: N } = ad();
  L.useEffect(() => () => {
    var H, Y;
    (H = n.current) == null || H.setHighlightNodes([]), (Y = n.current) == null || Y.setHoveredNodes([]);
  }, [n]);
  const b = (H) => {
    var Y;
    return ((Y = c.current) == null ? void 0 : Y.getGraphModelData().graphData.nodes.some((A) => A.id === H)) ?? !1;
  };
  if (!a) return null;
  const m = a.ids, C = a.labels, R = kl.find((H) => H.value === d), X = () => {
    var Y;
    const H = { nodeIds: m, type: d };
    for (const A of R.params) {
      const D = (Y = _[A.key]) == null ? void 0 : Y.trim();
      D && (H[A.key] = D);
    }
    S(async (A) => await oi.analyze(H, A)).then((A) => {
      if (!A) return;
      const D = A.items ?? [];
      y(D), k(A.graphData ?? null);
      const j = c.current, $ = n.current;
      if (j && $) {
        const ee = new Set(
          j.getGraphModelData().graphData.nodes.map((ye) => ye.id)
        );
        $.setHighlightNodes(
          D.filter((ye) => ee.has(ye.id)).map((ye) => ye.id)
        );
      }
    });
  }, U = () => R.params.length === 0 ? null : /* @__PURE__ */ v.jsxs(v.Fragment, { children: [
    R.params.map(
      (H) => H.type === "select" && H.options ? /* @__PURE__ */ v.jsx(
        "select",
        {
          value: _[H.key] ?? "",
          onChange: (Y) => x((A) => ({ ...A, [H.key]: Y.target.value })),
          style: {
            ...Fc,
            width: "auto",
            minWidth: 80,
            cursor: "pointer"
          },
          children: H.options.map((Y) => /* @__PURE__ */ v.jsx("option", { value: Y.value, children: Y.label }, Y.value))
        },
        H.key
      ) : /* @__PURE__ */ v.jsx(
        "input",
        {
          placeholder: H.placeholder ?? H.label,
          value: _[H.key] ?? "",
          onChange: (Y) => x((A) => ({ ...A, [H.key]: Y.target.value })),
          style: Fc
        },
        H.key
      )
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: X,
        disabled: N,
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
        children: N ? "..." : "查询"
      }
    )
  ] });
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "analysis-panel",
      layer: Mt.Panel,
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
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold", fontSize: "13px" }, children: "分析" }),
              /* @__PURE__ */ v.jsx(
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
                  children: C.join(", ")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(
                "select",
                {
                  value: d,
                  onChange: (H) => {
                    h(H.target.value), y([]), k(null), x({});
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
                  children: kl.map((H) => /* @__PURE__ */ v.jsx("option", { value: H.value, children: H.label }, H.value))
                }
              ),
              U()
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs("div", { style: { flex: 1, overflowY: "auto" }, children: [
          p.length === 0 && !N && /* @__PURE__ */ v.jsx(
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
          p.map((H, Y) => /* @__PURE__ */ v.jsxs(
            "div",
            {
              style: {
                padding: "8px 14px",
                borderBottom: "1px solid rgb(var(--border))",
                fontSize: "12px",
                cursor: "pointer"
              },
              onClick: () => {
                if (!f) return;
                const A = H.sourceId, D = H.id, j = f.links.filter(
                  (oe) => oe.source === A && oe.target === D || oe.source === D && oe.target === A
                ), $ = /* @__PURE__ */ new Set();
                j.forEach((oe) => {
                  $.add(oe.source), $.add(oe.target);
                });
                let ee = f.nodes.filter(
                  (oe) => $.has(oe.id)
                );
                const ye = new Set(ee.map((oe) => oe.id));
                A && !ye.has(A) && (ee = [
                  ...ee,
                  { id: A, data: { nodeType: "phone", label: A } }
                ]), s({ nodes: ee, links: j });
              },
              onMouseEnter: (A) => {
                var D;
                A.currentTarget.style.background = "rgb(var(--hover))", b(H.id) && ((D = n.current) == null || D.setHoveredNodes([H.id]));
              },
              onMouseLeave: (A) => {
                var D;
                A.currentTarget.style.background = "rgb(var(--background))", (D = n.current) == null || D.setHoveredNodes([]);
              },
              children: [
                /* @__PURE__ */ v.jsx("div", { style: { fontWeight: "bold", color: "rgb(var(--primary))" }, children: R.resultLabel(H) }),
                /* @__PURE__ */ v.jsx("div", { style: { color: "rgb(var(--muted))", fontSize: "11px" }, children: R.resultDetail(H) })
              ]
            },
            `${H.id}-${Y}`
          ))
        ] })
      ]
    }
  );
}
const jc = (c) => c, pg = (c, n) => {
  const i = n ?? "default", s = c.node[i];
  if (s) return jc(s);
  if (i !== "default") {
    const a = c.node.default;
    if (a) return jc(a);
  }
  return {};
}, mo = (c, n) => {
  if (!n) return {};
  const i = c[n];
  return i || {};
}, zc = (c) => c, gg = (c, n) => {
  const i = n ?? "default", s = c.link[i];
  if (s) return zc(s);
  if (i !== "default") {
    const a = c.link.default;
    if (a) return zc(a);
  }
  return {};
}, Oc = (c, n) => {
  if (!n) return {};
  const i = c[n];
  return i || {};
};
class yg {
  constructor() {
    T(this, "subscribers", /* @__PURE__ */ new Map());
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
    const a = this.subscribers.get(s);
    return a.add(i), () => {
      a.delete(i), a.size === 0 && this.subscribers.delete(s);
    };
  }
  /**
   * 发布事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  publish(n, i) {
    const s = String(n), a = this.subscribers.get(s);
    a && a.forEach((d) => {
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
class vg {
  constructor(n) {
    T(this, "tags");
    T(this, "events");
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
    const a = {
      targetId: n,
      targetType: i,
      ...s
    }, d = this.getKey(i, n), h = this.tags.get(d) || [];
    return h.some(
      (p) => JSON.stringify(p) === JSON.stringify(a)
    ) || h.push(a), this.tags.set(d, h), this.events.publish("tagChange", {
      action: "add",
      targetId: n,
      targetType: i,
      tag: a
    }), a;
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
    const s = this.getKey(i, n), a = this.tags.get(s);
    return !a || a.length === 0 ? !1 : (this.tags.delete(s), this.events.publish("tagChange", {
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
    for (const [s, a] of this.tags.entries())
      a.length > 0 && s.startsWith(`${n}:`) && i.push(s.substring(n.length + 1));
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
      const { targetId: a, targetType: d, ...h } = s, p = this.addTag(a, d, h);
      i.push(p);
    }), i;
  }
  /**
   * 批量移除标签
   */
  removeAllTagsForTargets(n) {
    let i = 0;
    return n.forEach(({ targetId: s, targetType: a }) => {
      this.removeAllTags(s, a) && i++;
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
  updateTagByType(n, i, s, a) {
    const d = this.getTags(n, i);
    if (!d) return;
    const h = d.findIndex((f) => f.targetType === s);
    if (h === -1) return;
    const p = {
      ...d[h],
      ...a,
      metadata: {
        ...d[h].metadata,
        ...a.metadata,
        type: s
        // 保持类型不变
      }
    };
    d[h] = p;
    const y = this.getKey(i, n);
    return this.tags.set(y, d), this.events.publish("tagChange", {
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
  setTagVisibleByType(n, i, s, a) {
    return this.updateTagByType(n, i, s, { visible: a });
  }
  /**
   * 设置目标所有标签的可见性
   */
  setAllTagsVisibleForTarget(n, i, s) {
    const a = this.getTags(n, i), d = [];
    if (a.forEach((h, p) => {
      const y = {
        ...h,
        visible: s
      };
      a[p] = y, d.push(y);
    }), d.length > 0) {
      const h = this.getKey(i, n);
      this.tags.set(h, a), d.forEach((p) => {
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
    return n.forEach(({ targetId: a, targetType: d }) => {
      const h = this.setAllTagsVisibleForTarget(
        a,
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
      const [s, ...a] = i.split(":");
      return {
        targetId: a.join(":"),
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
      const [s, ...a] = i.split(":");
      return {
        targetId: a.join(":"),
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
        var a;
        return ((a = s.label) == null ? void 0 : a.toLowerCase().includes(i)) || !1;
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
      const a = this.getKey(s.targetType, s.targetId), d = i.get(a) || [];
      d.push(s), i.set(a, d);
    });
    for (const [s, a] of i)
      this.tags.set(s, a);
  }
  /**
   * 添加类型标签（通用）
   */
  addTypedTag(n, i, s, a, d) {
    return this.addTag(n, i, {
      label: a,
      metadata: { type: s, ...d == null ? void 0 : d.metadata },
      ...d
    });
  }
  /**
   * 为节点添加类型标签（便捷方法，保持向后兼容）
   */
  addTypedNodeTag(n, i, s, a) {
    return this.addTypedTag(n, "node", i, s, a);
  }
  /**
   * 为边添加类型标签（便捷方法）
   */
  addTypedLinkTag(n, i, s, a) {
    return this.addTypedTag(n, "link", i, s, a);
  }
  /**
   * 获取指定类型的标签
   */
  getTagByType(n, i, s) {
    return this.getTags(n, i).find(
      (a) => a.targetType === s
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
    const a = this.getTags(n, i);
    if (!a || a.length === 0) return !1;
    const d = a.findIndex((f) => f.targetType === s);
    if (d === -1) return !1;
    const h = a[d], p = a.filter((f, k) => k !== d), y = this.getKey(i, n);
    return p.length === 0 ? this.tags.delete(y) : this.tags.set(y, p), this.events.publish("tagChange", {
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
class mg {
  constructor(n) {
    T(this, "model");
    T(this, "globalVisible");
    this.model = new vg(n), this.globalVisible = !0;
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
class xg {
  constructor(n) {
    T(this, "loadingStates");
    T(this, "events");
    this.loadingStates = /* @__PURE__ */ new Map(), this.events = n;
  }
  /**
   * 设置节点加载状态
   */
  setLoading(n, i, s) {
    const a = {
      nodeId: n,
      loading: i,
      progress: s == null ? void 0 : s.progress,
      message: s == null ? void 0 : s.message,
      metadata: s == null ? void 0 : s.metadata
    };
    return this.loadingStates.set(n, a), this.events.publish("loadingChange", {
      nodeId: n,
      loading: i,
      state: a
    }), a;
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
    const a = this.loadingStates.get(n);
    if (a)
      return this.setLoading(n, a.loading, {
        progress: i,
        message: s ?? a.message,
        metadata: a.metadata
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
    const a = [];
    return n.forEach((d) => {
      const h = this.setLoading(d, i, s);
      a.push(h);
    }), a;
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
class kg {
  constructor(n) {
    T(this, "model");
    T(this, "globalVisible");
    this.model = new xg(n), this.globalVisible = !0;
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
class Sg {
  constructor(n) {
    T(this, "state");
    T(this, "events");
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
function dr(c, n) {
  const i = { ...c };
  for (const s in n)
    if (Object.prototype.hasOwnProperty.call(n, s)) {
      const a = n[s], d = i[s];
      a != null && typeof a == "object" && !Array.isArray(a) && d !== null && d !== void 0 && typeof d == "object" && !Array.isArray(d) ? i[s] = dr(d, a) : a !== void 0 && (i[s] = a);
    }
  return i;
}
class wg {
  constructor(n) {
    T(this, "graphModelData");
    T(this, "nodeInstanceStyles", /* @__PURE__ */ new Map());
    T(this, "linkInstanceStyles", /* @__PURE__ */ new Map());
    this.graphModelData = n;
  }
  updategGraphModelData(n) {
    this.graphModelData = n;
  }
  init(n) {
    this.style = n;
  }
  update(n) {
    this.style = dr(this.style, n);
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
    const s = pg(this.style, (h = i.data) == null ? void 0 : h.nodeType);
    if (!this.hasNodeStyle(i.id)) return s;
    const a = this.nodeInstanceStyles.get(i.id);
    if (!a) return s;
    const d = dr({}, s);
    return dr(d, a);
  }
  getLinkStyle(n) {
    var h;
    if (!n) return {};
    const i = this.graphModelData.graphData.links.find(
      (p) => p.id === n
    );
    if (!i) return {};
    const s = gg(this.style, (h = i.data) == null ? void 0 : h.linkType);
    if (!this.hasLinkStyle(i.id)) return s;
    const a = this.linkInstanceStyles.get(i.id);
    if (!a) return s;
    const d = dr({}, s);
    return dr(d, a);
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
class _g {
  constructor({ initData: n }) {
    T(this, "cache", {
      graphData: { nodes: [], links: [] }
    });
    T(this, "events", new yg());
    T(this, "tagManager", new mg(this.events));
    T(this, "loadingManager", new kg(this.events));
    T(this, "stateManager", new Sg(this.events));
    T(this, "styleManager", new wg(this.cache));
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
    n.forEach((a) => {
      const d = this.getNodeById(a);
      d && this.cache.graphData.links.forEach((h) => {
        const p = typeof h.source == "object" ? h.source.id : h.source, y = typeof h.target == "object" ? h.target.id : h.target;
        (p === d.id || y === d.id) && s.push(h.id), p === d.id && y && i.push(String(y));
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
    const s = [...n], a = [];
    i ? a.push(...i) : n.forEach((d) => {
      const h = this.getNodeById(d);
      h && this.cache.graphData.links.forEach((p) => {
        const y = typeof p.source == "object" ? p.source.id : p.source, f = typeof p.target == "object" ? p.target.id : p.target;
        (y === h.id || f === h.id) && a.push(p.id), y === h.id && f && s.push(String(f));
      });
    }), this.stateManager.setSelectedNodes([...new Set(s)], [...new Set(a)]);
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
class Tg {
  constructor() {
    T(this, "store", /* @__PURE__ */ new Map());
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
class Cg {
  constructor(n) {
    T(this, "history", []);
    T(this, "currentIndex", -1);
    T(this, "maxSize");
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
class bg {
  constructor() {
    T(this, "_state", { x: 0, y: 0, k: 1 });
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
    const a = Math.max(0.1, Math.min(10, this._state.k * n)), d = (i - this._state.x * this._state.k) / this._state.k, h = (s - this._state.y * this._state.k) / this._state.k;
    this._state.x = i / a - d, this._state.y = s / a - h, this._state.k = a;
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
class Eg {
  constructor(n, i, s = {}) {
    T(this, "canvas");
    T(this, "picker");
    T(this, "callbacks");
    /** 当前相机变换（渲染器需保持同步） */
    T(this, "transform", { x: 0, y: 0, k: 1 });
    // 内部状态
    T(this, "isDragging", !1);
    T(this, "dragNodeId", null);
    T(this, "hoveredId", null);
    T(this, "hoveredType", null);
    T(this, "lastMouseX", 0);
    T(this, "lastMouseY", 0);
    T(this, "lastClientX", 0);
    T(this, "lastClientY", 0);
    T(this, "isPanning", !1);
    /** 垂直缩放容忍度（px），在此范围内不触发平移/缩放手感混淆 */
    T(this, "panDeadZone", 3);
    // 绑定的回调引用（用于 removeEventListener）
    T(this, "boundPointerDown");
    T(this, "boundPointerMove");
    T(this, "boundPointerUp");
    T(this, "boundPointerLeave");
    T(this, "boundWheel");
    T(this, "boundContextMenu");
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
    var a, d, h, p, y, f;
    const i = this.getPos(n);
    this.lastMouseX = i.x, this.lastMouseY = i.y;
    const s = this.picker.pick(i.x, i.y);
    s && s.type === "node" ? n.button === 0 && (this.isDragging = !0, this.dragNodeId = s.id, this.canvas.setPointerCapture(n.pointerId), (d = (a = this.callbacks).onNodeClick) == null || d.call(a, s.id, n)) : s && s.type === "link" ? (p = (h = this.callbacks).onLinkClick) == null || p.call(h, s.id, n) : (this.isPanning = !0, this.canvas.setPointerCapture(n.pointerId), (f = (y = this.callbacks).onBackgroundClick) == null || f.call(y, n));
  }
  onPointerMove(n) {
    var d, h, p, y, f, k, _, x, S, N, b, m;
    const i = this.getPos(n), s = i.x - this.lastMouseX, a = i.y - this.lastMouseY;
    if (this.isDragging && this.dragNodeId)
      (h = (d = this.callbacks).onNodeDrag) == null || h.call(d, this.dragNodeId, s, a);
    else if (this.isPanning) {
      const C = this.transform;
      C.x += s / C.k, C.y += a / C.k, (y = (p = this.callbacks).onPan) == null || y.call(p, C);
    } else {
      const C = this.picker.pick(i.x, i.y), R = (C == null ? void 0 : C.id) ?? null, X = (C == null ? void 0 : C.type) ?? null;
      (R !== this.hoveredId || X !== this.hoveredType) && (this.hoveredId = R, this.hoveredType = X, X === "link" ? ((k = (f = this.callbacks).onLinkHover) == null || k.call(f, R), (x = (_ = this.callbacks).onNodeHover) == null || x.call(_, null)) : ((N = (S = this.callbacks).onNodeHover) == null || N.call(S, R), (m = (b = this.callbacks).onLinkHover) == null || m.call(b, null)), this.canvas.style.cursor = R ? "pointer" : "default");
    }
    this.lastMouseX = i.x, this.lastMouseY = i.y, this.lastClientX = n.clientX, this.lastClientY = n.clientY;
  }
  onContextMenu(n) {
    var d, h;
    n.preventDefault();
    const i = n, s = this.getPos(i), a = this.picker.pick(s.x, s.y);
    (a == null ? void 0 : a.type) === "node" && ((h = (d = this.callbacks).onNodeContextMenu) == null || h.call(d, a.id, i.clientX, i.clientY));
  }
  onPointerUp(n) {
    var i, s;
    this.isDragging && this.dragNodeId && ((s = (i = this.callbacks).onNodeDragEnd) == null || s.call(i, this.dragNodeId)), this.isDragging = !1, this.dragNodeId = null, this.isPanning = !1, this.canvas.releasePointerCapture(n.pointerId);
  }
  /** 指针离开 canvas → 清除 hover 状态 */
  onPointerLeave(n) {
    var i, s, a, d;
    this.hoveredId !== null && (this.hoveredId = null, this.hoveredType = null, this.canvas.style.cursor = "default", (s = (i = this.callbacks).onNodeHover) == null || s.call(i, null), (d = (a = this.callbacks).onLinkHover) == null || d.call(a, null));
  }
  onWheel(n) {
    var y, f;
    n.preventDefault();
    const i = this.getPos(n), s = n.deltaY > 0 ? 0.9 : 1.1, a = this.transform, d = Math.max(0.1, Math.min(10, a.k * s)), h = (i.x - a.x * a.k) / a.k, p = (i.y - a.y * a.k) / a.k;
    a.x = i.x / d - h, a.y = i.y / d - p, a.k = d, (f = (y = this.callbacks).onZoom) == null || f.call(y, a);
  }
}
const Pg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;       // quad corner [-1,1]\r
layout(location = 1) in vec2 a_center;         // instance: center\r
layout(location = 2) in float a_radius;        // instance: radius\r
layout(location = 3) in vec4 a_color;          // instance: fill color\r
layout(location = 4) in vec4 a_strokeColor;    // instance: stroke color\r
layout(location = 5) in float a_strokeWidth;   // instance: stroke width\r
layout(location = 6) in float a_shapeType;     // instance: shape enum\r
layout(location = 7) in float a_shapeParam;    // instance: shape parameter\r
layout(location = 8) in float a_showPlus;      // instance: show plus button\r
layout(location = 9) in float a_plusOffsetX;   // instance: plus offset X\r
layout(location = 10) in float a_plusOffsetY;  // instance: plus offset Y\r
layout(location = 11) in float a_plusScale;    // instance: plus size scale\r
layout(location = 12) in float a_hasIcon;      // instance: has icon (0/1)\r
layout(location = 13) in vec4 a_iconUv;        // instance: icon UV [u0,v0,u1,v1]\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
\r
out vec4 v_color;\r
out vec4 v_strokeColor;\r
out float v_radius;\r
out float v_strokeWidth;\r
out vec2 v_localPos;\r
out float v_shapeType;\r
out float v_shapeParam;\r
out float v_showPlus;\r
out float v_plusOffsetX;\r
out float v_plusOffsetY;\r
out float v_plusScale;\r
out float v_hasIcon;\r
out vec4 v_iconUv;\r
\r
void main() {\r
  float halfSize = a_radius + a_strokeWidth;\r
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;\r
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
\r
  v_color = a_color;\r
  v_strokeColor = a_strokeColor;\r
  v_radius = a_radius;\r
  v_strokeWidth = a_strokeWidth;\r
  v_localPos = a_position * halfSize;\r
  v_shapeType = a_shapeType;\r
  v_shapeParam = a_shapeParam;\r
  v_showPlus = a_showPlus;\r
  v_plusOffsetX = a_plusOffsetX;\r
  v_plusOffsetY = a_plusOffsetY;\r
  v_plusScale = a_plusScale;\r
  v_hasIcon = a_hasIcon;\r
  v_iconUv = a_iconUv;\r
}\r
`, Ng = `#version 300 es\r
precision highp float;\r
\r
in vec4 v_color;\r
in vec4 v_strokeColor;\r
in float v_radius;\r
in float v_strokeWidth;\r
in vec2 v_localPos;\r
in float v_shapeType;\r
in float v_shapeParam;\r
in float v_showPlus;\r
in float v_plusOffsetX;\r
in float v_plusOffsetY;\r
in float v_plusScale;\r
in float v_hasIcon;\r
in vec4 v_iconUv;\r
\r
uniform sampler2D u_iconAtlas;\r
\r
out vec4 fragColor;\r
\r
// 图标占节点直径的比例（剩余为节点填充色的 padding 环）\r
#define ICON_INSET 0.82\r
\r
// ---- SDF primitives ----\r
float sdCircle(vec2 p, float r) {\r
  return length(p) - r;\r
}\r
\r
float boxSDF(vec2 p, vec2 halfSize) {\r
  vec2 d = abs(p) - halfSize;\r
  return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f);\r
}\r
\r
float sdPlus(vec2 p, float radius) {\r
  float w = radius * 0.30f;\r
  float l = radius * 0.60f;\r
  float hBar = boxSDF(p, vec2(l, w));\r
  float vBar = boxSDF(p, vec2(w, l));\r
  return min(hBar, vBar);\r
}\r
\r
float shapeSDF(vec2 p, float radius, float type, float param) {\r
  return sdCircle(p, radius);\r
}\r
\r
// ---- Main ----\r
void main() {\r
  // SDF for fill circle (inner edge)\r
  float fillD = shapeSDF(v_localPos, v_radius, v_shapeType, v_shapeParam);\r
  // SDF for stroke circle (outer edge)\r
  float strokeD = shapeSDF(v_localPos, v_radius + v_strokeWidth, v_shapeType, v_shapeParam);\r
\r
  float aa = fwidth(strokeD) * 0.8f;\r
\r
  // Alpha for the entire node (fill + stroke)\r
  float strokeAlpha = 1.0f - smoothstep(-aa, aa, strokeD);\r
  // Alpha for the fill area (inside stroke ring)\r
  float fillAlpha = 1.0f - smoothstep(-aa, aa, fillD);\r
\r
  // Stroke color in the ring, fill color inside\r
  fragColor = mix(v_strokeColor, v_color, fillAlpha);\r
  fragColor.a *= strokeAlpha;\r
\r
  // 图标：仅在节点内缩小的圆形区域内绘制（外部露出填充色，形成 padding 环）\r
  if(v_hasIcon > 0.5f && fillAlpha > 0.01f) {\r
    float iconR = v_radius * ICON_INSET;\r
    float iconD = sdCircle(v_localPos, iconR);\r
    float iconAA = fwidth(iconD) * 0.8f;\r
    float iconArea = 1.0f - smoothstep(-iconAA, iconAA, iconD);\r
    if(iconArea > 0.01f) {\r
      // 图标区域半径 → [0,1] UV\r
      vec2 uv = (v_localPos / (2.0f * iconR)) + 0.5f;\r
      uv = clamp(uv, 0.0f, 1.0f);\r
      vec2 texUv = mix(v_iconUv.xy, v_iconUv.zw, uv);\r
      vec4 icon = texture(u_iconAtlas, texUv);\r
      vec3 mixed = mix(v_color.rgb, icon.rgb, icon.a);\r
      fragColor.rgb = mix(fragColor.rgb, mixed, fillAlpha * iconArea);\r
      // 图标区域保持节点整体透明度（hidden 等低透明状态时随 v_color.a 淡出，\r
      // 不再强制置 1，否则隐藏节点只剩 18% 填充环变淡、视觉几乎无变化）\r
      fragColor.a = mix(fragColor.a, v_color.a, fillAlpha * iconArea);\r
    }\r
  }\r
\r
  // Draw plus badge at configurable position (inside a white circle)\r
  if(v_showPlus > 0.5f) {\r
    vec2 plusOffset = vec2(v_radius * v_plusOffsetX, v_radius * v_plusOffsetY);\r
    vec2 plusPos = v_localPos - plusOffset;\r
    float plusRadius = v_radius * v_plusScale;\r
\r
    // 1. White circle background (使用屏幕空间 aa)\r
    float badgeD = sdCircle(plusPos, plusRadius);\r
    float badgeAA = fwidth(badgeD) * 0.8f;\r
    float badgeAlpha = 1.0f - smoothstep(-badgeAA, badgeAA, badgeD);\r
    if(badgeAlpha > 0.01f) {\r
      fragColor.rgb = mix(fragColor.rgb, vec3(1.0f, 1.0f, 1.0f), badgeAlpha);\r
      fragColor.a = max(fragColor.a, badgeAlpha);\r
    }\r
\r
    // 2. Red plus symbol inside the badge\r
    float plusD = sdPlus(plusPos, plusRadius * 0.85f);\r
    float plusAA = fwidth(plusD) * 0.8f;\r
    float plusAlpha = 1.0f - smoothstep(-plusAA, plusAA, plusD);\r
    if(badgeAlpha > 0.01f && plusAlpha > 0.01f) {\r
      vec4 plusColor = vec4(0.913f, 0.271f, 0.376f, 1.0f);\r
      fragColor.rgb = mix(fragColor.rgb, plusColor.rgb, plusAlpha);\r
      fragColor.a = max(fragColor.a, plusAlpha);\r
    }\r
  }\r
\r
  if(fragColor.a < 0.01f)\r
    discard;\r
}\r
`, Ag = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;       // quad corner [-1,1]\r
layout(location = 1) in vec2 a_center;         // instance: center\r
layout(location = 2) in float a_radius;        // instance: radius\r
layout(location = 3) in vec4 a_color;          // (unused in pick)\r
layout(location = 4) in vec4 a_strokeColor;    // (unused in pick)\r
layout(location = 5) in float a_strokeWidth;   // instance: stroke width\r
layout(location = 6) in float a_shapeType;     // instance: shape enum\r
layout(location = 7) in float a_shapeParam;    // instance: shape parameter\r
\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
\r
out vec2 v_localPos;\r
out float v_radius;\r
out float v_strokeWidth;\r
out float v_shapeType;\r
out float v_shapeParam;\r
flat out int v_instanceId;\r
\r
void main() {\r
  float halfSize = a_radius + a_strokeWidth;\r
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;\r
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
\r
  v_localPos = a_position * halfSize;\r
  v_radius = a_radius;\r
  v_strokeWidth = a_strokeWidth;\r
  v_shapeType = a_shapeType;\r
  v_shapeParam = a_shapeParam;\r
  v_instanceId = gl_InstanceID;\r
}\r
`, Mg = `#version 300 es\r
precision highp float;\r
\r
in vec2 v_localPos;\r
in float v_radius;\r
in float v_strokeWidth;\r
in float v_shapeType;\r
in float v_shapeParam;\r
flat in int v_instanceId;\r
\r
out vec4 fragColor;\r
\r
float sdCircle(vec2 p, float r) { return length(p) - r; }\r
\r
float shapeSDF(vec2 p, float radius, float type, float param) {\r
  return sdCircle(p, radius);\r
}\r
\r
void main() {\r
  float outerRadius = v_radius + v_strokeWidth;\r
  float d = shapeSDF(v_localPos, outerRadius, v_shapeType, v_shapeParam);\r
  if (d > 1.5) { discard; return; }\r
\r
  int idx = v_instanceId;\r
  fragColor = vec4(\r
    float((idx >> 16) & 0xFF) / 255.0,\r
    float((idx >> 8) & 0xFF) / 255.0,\r
    float(idx & 0xFF) / 255.0,\r
    1.0\r
  );\r
}\r
`, Rg = `#version 300 es\r
precision highp float;\r
\r
// a_position: (t, side) — t∈[0,1] 沿曲线参数, side=±1 为带的两侧\r
layout(location = 0) in vec2 a_position;\r
layout(location = 1) in vec2 a_start;       // P0\r
layout(location = 2) in vec2 a_mid;         // P1 — 二次 Bézier 控制点\r
layout(location = 3) in vec2 a_end;         // P2\r
layout(location = 4) in vec4 a_color;\r
layout(location = 5) in float a_width;\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
\r
out vec4 v_color;\r
\r
void main() {\r
  vec2 p0 = (a_start + u_translation) * u_scale;\r
  vec2 p1 = (a_mid   + u_translation) * u_scale;\r
  vec2 p2 = (a_end   + u_translation) * u_scale;\r
\r
  float t = a_position.x;\r
  float side = a_position.y;\r
\r
  // ── 二次 Bézier: B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 ──\r
  float mt  = 1.0 - t;\r
  float mt2 = mt * mt;\r
  float t2  = t * t;\r
\r
  vec2 pos = mt2 * p0 + 2.0 * mt * t * p1 + t2 * p2;\r
\r
  // ── 导数 B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1) ──\r
  vec2 tangent = 2.0 * mt * (p1 - p0) + 2.0 * t * (p2 - p1);\r
\r
  float tlen = length(tangent);\r
  vec2 dir = tlen > 0.001 ? tangent / tlen : normalize(p2 - p0);\r
  vec2 norm = vec2(-dir.y, dir.x);\r
\r
  float halfW = a_width * u_scale * 0.5 + 1.0;\r
  pos += norm * side * halfW;\r
\r
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
  v_color = a_color;\r
}\r
`, Lg = `#version 300 es\r
precision highp float;\r
\r
in vec4 v_color;\r
out vec4 fragColor;\r
\r
void main() {\r
  fragColor = v_color;\r
  if (fragColor.a < 0.01) discard;\r
}\r
`, Dg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;      // (t, side)\r
layout(location = 1) in vec2 a_start;         // P0\r
layout(location = 2) in vec2 a_mid;           // P1\r
layout(location = 3) in vec2 a_end;           // P2\r
layout(location = 4) in vec4 a_color;         // unused in pick\r
layout(location = 5) in float a_width;\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
uniform uint u_idOffset;\r
\r
flat out uint v_instanceId;\r
\r
void main() {\r
  vec2 p0 = (a_start + u_translation) * u_scale;\r
  vec2 p1 = (a_mid + u_translation) * u_scale;\r
  vec2 p2 = (a_end + u_translation) * u_scale;\r
\r
  float t = a_position.x;\r
  float side = a_position.y;\r
\r
  float mt = 1.0f - t;\r
  float mt2 = mt * mt;\r
  float t2 = t * t;\r
\r
  vec2 pos = mt2 * p0 + 2.0f * mt * t * p1 + t2 * p2;\r
\r
  vec2 tangent = 2.0f * mt * (p1 - p0) + 2.0f * t * (p2 - p1);\r
\r
  float tlen = length(tangent);\r
  vec2 dir = tlen > 0.001f ? tangent / tlen : normalize(p2 - p0);\r
  vec2 norm = vec2(-dir.y, dir.x);\r
\r
  float halfW = a_width * u_scale * 0.5f + 2.5f;\r
  pos += norm * side * halfW;\r
\r
  vec2 clipSpace = (pos / u_resolution) * 2.0f - 1.0f;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0f, 1.0f);\r
  gl_Position.z += u_zOffset;\r
  v_instanceId = uint(gl_InstanceID) + u_idOffset;\r
}\r
`, Ig = `#version 300 es\r
precision highp float;\r
\r
flat in uint v_instanceId;\r
out vec4 fragColor;\r
\r
void main() {\r
  uint idx = v_instanceId;\r
  fragColor = vec4(\r
    float((idx >> 16u) & 0xFFu) / 255.0,\r
    float((idx >> 8u) & 0xFFu) / 255.0,\r
    float(idx & 0xFFu) / 255.0,\r
    1.0\r
  );\r
}\r
`, Fg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;\r
layout(location = 1) in vec2 a_tip;\r
layout(location = 2) in vec2 a_dir;\r
layout(location = 3) in vec4 a_color;\r
layout(location = 4) in float a_size;\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
\r
out vec4 v_color;\r
\r
void main() {\r
  vec2 tip = (a_tip + u_translation) * u_scale;\r
  float size = a_size * u_scale;\r
  vec2 dir = normalize(a_dir);\r
  vec2 norm = vec2(-dir.y, dir.x);\r
  vec2 offset = a_position.x * (dir * size) + a_position.y * (norm * size * 0.5);\r
  vec2 pos = tip + offset;\r
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  v_color = a_color;\r
}\r
`, jg = `#version 300 es\r
precision highp float;\r
\r
in vec4 v_color;\r
out vec4 fragColor;\r
\r
void main() {\r
  fragColor = vec4(v_color.rgb, 1.0);\r
}\r
`, zg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;\r
layout(location = 1) in vec2 a_tip;\r
layout(location = 2) in vec2 a_dir;\r
layout(location = 3) in vec4 a_color;\r
layout(location = 4) in float a_size;\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
\r
flat out int v_instanceId;\r
\r
void main() {\r
  vec2 tip = (a_tip + u_translation) * u_scale;\r
  float size = a_size * u_scale;\r
  vec2 dir = normalize(a_dir);\r
  vec2 norm = vec2(-dir.y, dir.x);\r
  vec2 offset = a_position.x * (-dir * size) + a_position.y * (norm * size * 0.5);\r
  vec2 pos = tip + offset;\r
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  v_instanceId = gl_InstanceID;\r
}\r
`, Og = `#version 300 es\r
precision highp float;\r
\r
flat in int v_instanceId;\r
out vec4 fragColor;\r
\r
void main() {\r
  int idx = v_instanceId;\r
  fragColor = vec4(\r
    float((idx >> 16) & 0xFF) / 255.0,\r
    float((idx >> 8) & 0xFF) / 255.0,\r
    float(idx & 0xFF) / 255.0,\r
    1.0\r
  );\r
}\r
`, Bg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;       // quad corner (0..1)\r
layout(location = 1) in vec2 a_center;          // instance: world position\r
layout(location = 2) in vec2 a_size;            // instance: world size\r
layout(location = 3) in vec4 a_color;           // instance: color\r
layout(location = 4) in vec2 a_uvOrigin;        // instance: UV origin (u0,v0)\r
layout(location = 5) in vec2 a_uvSize;          // instance: UV size (du,dv)\r
layout(location = 6) in float a_angle;          // instance: rotation (radians)\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
\r
out vec2 v_texCoord;\r
out vec4 v_color;\r
\r
void main() {\r
  vec2 offset = (a_position - 0.5) * a_size;\r
  float cosA = cos(a_angle);\r
  float sinA = sin(a_angle);\r
  vec2 rotatedOffset = vec2(\r
    offset.x * cosA - offset.y * sinA,\r
    offset.x * sinA + offset.y * cosA\r
  );\r
  vec2 screenPos = (a_center + u_translation) * u_scale + rotatedOffset * u_scale;\r
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
  v_texCoord = a_uvOrigin + a_position * a_uvSize;\r
  v_color = a_color;\r
}\r
`, Ug = `#version 300 es\r
precision highp float;\r
\r
in vec2 v_texCoord;\r
in vec4 v_color;\r
\r
uniform sampler2D u_texture;\r
\r
out vec4 fragColor;\r
\r
void main() {\r
  // alpha 通道 = 纯灰度抗锯齿，无色边\r
  float alpha = texture(u_texture, v_texCoord).a;\r
  fragColor = vec4(v_color.rgb, v_color.a * alpha);\r
  if (fragColor.a < 0.01) discard;\r
}\r
`, Wg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;       // quad corner [-1,1]\r
layout(location = 1) in vec2 a_center;         // instance: center of the badge (world)\r
layout(location = 2) in float a_radius;        // instance: badge radius (world)\r
layout(location = 3) in float a_nodeId;        // instance: encoded node id (index)\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
uniform float u_borderWidth;\r
\r
out vec2 v_localPos;\r
out float v_radius;\r
flat out float v_nodeId;\r
\r
void main() {\r
  // padding 为抗锯齿过渡留出约 3 像素的余量，防止边框边缘被 quad 裁切\r
  float padding = 3.0 / max(u_scale, 0.001);\r
  float halfSize = a_radius + u_borderWidth + padding;\r
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;\r
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
\r
  v_localPos = a_position * halfSize;\r
  v_radius = a_radius;\r
  v_nodeId = a_nodeId;\r
}\r
`, Hg = `#version 300 es\r
precision highp float;\r
\r
in vec2 v_localPos;\r
in float v_radius;\r
flat in float v_nodeId;\r
\r
uniform float u_borderWidth;\r
uniform vec4 u_borderColor;\r
\r
out vec4 fragColor;\r
\r
// SDF primitives\r
float sdCircle(vec2 p, float r) {\r
  return length(p) - r;\r
}\r
\r
float boxSDF(vec2 p, vec2 halfSize) {\r
  vec2 d = abs(p) - halfSize;\r
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);\r
}\r
\r
float sdPlus(vec2 p, float radius) {\r
  float w = radius * 0.20;\r
  float l = radius * 0.60;\r
  float hBar = boxSDF(p, vec2(l, w));\r
  float vBar = boxSDF(p, vec2(w, l));\r
  return min(hBar, vBar);\r
}\r
\r
void main() {\r
  // Screen-space anti-aliasing\r
  vec2 deriv = dFdx(v_localPos) + dFdy(v_localPos);\r
  float aa = length(deriv) * 1.5;\r
\r
  // Outer circle (includes border)\r
  float outerD = sdCircle(v_localPos, v_radius + u_borderWidth);\r
  // Inner circle (white fill area)\r
  float innerD = sdCircle(v_localPos, v_radius);\r
\r
  // Border ring: between outer and inner circle\r
  float outerAlpha = 1.0 - smoothstep(-aa, aa, outerD);\r
  float fillAlpha = 1.0 - smoothstep(-aa, aa, innerD);\r
  float borderAlpha = smoothstep(-aa, aa, innerD) * (1.0 - smoothstep(-aa, aa, outerD));\r
\r
  if (outerAlpha < 0.01) discard;\r
\r
  // Start with border color ring\r
  vec3 color = u_borderColor.rgb;\r
  float alpha = borderAlpha * u_borderColor.a;\r
\r
  // White fill on top\r
  color = mix(color, vec3(1.0), fillAlpha);\r
  alpha = max(alpha, fillAlpha);\r
\r
  // Red plus symbol inside\r
  float plusD = sdPlus(v_localPos, v_radius * 0.85);\r
  float plusAA = length(deriv) * 0.8;\r
  float plusAlpha = 1.0 - smoothstep(-plusAA, plusAA, plusD);\r
  color = mix(color, vec3(0.913, 0.271, 0.376), plusAlpha);\r
  alpha = max(alpha, plusAlpha);\r
\r
  fragColor = vec4(color, alpha);\r
}\r
`, Vg = `#version 300 es\r
precision highp float;\r
\r
layout(location = 0) in vec2 a_position;       // quad corner [-1,1]\r
layout(location = 1) in vec2 a_center;         // instance: badge center (world)\r
layout(location = 2) in float a_radius;        // instance: badge radius (world)\r
layout(location = 3) in float a_nodeId;        // instance: node id index\r
\r
uniform vec2 u_resolution;\r
uniform vec2 u_translation;\r
uniform float u_scale;\r
uniform float u_zOffset;\r
uniform float u_borderWidth;\r
\r
out vec2 v_localPos;\r
out float v_radius;\r
flat out int v_instanceId;\r
\r
void main() {\r
  // padding 为抗锯齿过渡留出约 3 像素的余量，防止边框边缘被 quad 裁切\r
  float padding = 3.0 / max(u_scale, 0.001);\r
  float halfSize = a_radius + u_borderWidth + padding;\r
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;\r
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;\r
  clipSpace.y = -clipSpace.y;\r
  gl_Position = vec4(clipSpace, 0.0, 1.0);\r
  gl_Position.z += u_zOffset;\r
\r
  v_localPos = a_position * halfSize;\r
  v_radius = a_radius;\r
  v_instanceId = gl_InstanceID;\r
}\r
`, $g = `#version 300 es\r
precision highp float;\r
\r
in vec2 v_localPos;\r
in float v_radius;\r
flat in int v_instanceId;\r
\r
out vec4 fragColor;\r
\r
float sdCircle(vec2 p, float r) { return length(p) - r; }\r
\r
void main() {\r
  float d = sdCircle(v_localPos, v_radius);\r
  if (d > 1.5) { discard; return; }\r
\r
  int idx = v_instanceId;\r
  fragColor = vec4(\r
    float((idx >> 16) & 0xFF) / 255.0,\r
    float((idx >> 8) & 0xFF) / 255.0,\r
    float(idx & 0xFF) / 255.0,\r
    1.0\r
  );\r
}\r
`, Xg = Pg, Yg = Ng, Gg = Ag, Qg = Mg, Kg = Rg, qg = Lg, Zg = Dg, Jg = Ig, ey = Fg, ty = jg, ny = zg, ry = Og, iy = Bg, oy = Ug, sy = Wg, ly = Hg, ay = Vg, uy = $g;
class cy {
  constructor(n) {
    T(this, "name", "plus-badge");
    T(this, "gl");
    T(this, "canvas");
    T(this, "program");
    T(this, "pickProgram");
    T(this, "quadVao", null);
    // Border config
    T(this, "borderWidth");
    T(this, "borderColor");
    // Uniforms (render)
    T(this, "uResolution", null);
    T(this, "uTranslation", null);
    T(this, "uScale", null);
    T(this, "uZOffset", null);
    T(this, "uBorderWidth", null);
    T(this, "uBorderColor", null);
    // Uniforms (pick)
    T(this, "uPickResolution", null);
    T(this, "uPickTranslation", null);
    T(this, "uPickScale", null);
    T(this, "uPickZOffset", null);
    T(this, "uPickBorderWidth", null);
    /** 当前徽标数据 */
    T(this, "badges", []);
    /** 节点 ID → 索引映射（用于拾取） */
    T(this, "nodeIndexMap", /* @__PURE__ */ new Map());
    /** 拾取 FBO */
    T(this, "pickFbo", null);
    T(this, "pickTexture", null);
    T(this, "pickWidth", 0);
    T(this, "pickHeight", 0);
    T(this, "onPlusClick");
    // 已绑定的指针事件处理
    T(this, "boundPointerDown");
    this.gl = n.gl, this.canvas = n.canvas, this.onPlusClick = n.onPlusClick, this.borderWidth = n.borderWidth ?? 0, this.borderColor = n.borderColor ?? [0.913, 0.271, 0.376, 1], this.program = this.compileProgram(sy, ly), this.pickProgram = this.compileProgram(ay, uy), this.initQuadGeometry(), this.cacheUniforms(), this.boundPointerDown = this.onPointerDown.bind(this), this.canvas.addEventListener("pointerdown", this.boundPointerDown, {
      capture: !0
    });
  }
  // ─── 编译工具 ───────────────────────────────────
  compileShader(n, i) {
    const s = this.gl, a = s.createShader(n);
    if (s.shaderSource(a, i), s.compileShader(a), !s.getShaderParameter(a, s.COMPILE_STATUS))
      throw new Error(
        "Plus shader compile failed: " + s.getShaderInfoLog(a)
      );
    return a;
  }
  compileProgram(n, i) {
    const s = this.gl, a = this.compileShader(s.VERTEX_SHADER, n), d = this.compileShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    if (s.attachShader(h, a), s.attachShader(h, d), s.linkProgram(h), !s.getProgramParameter(h, s.LINK_STATUS))
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
    const a = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, a), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  setupInstanceBuffer(n, i, s) {
    const a = this.gl, d = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, d), a.bufferData(a.ARRAY_BUFFER, i, a.DYNAMIC_DRAW), a.enableVertexAttribArray(n), a.vertexAttribPointer(n, s, a.FLOAT, !1, 0, 0), a.vertexAttribDivisor(n, 1);
  }
  // ─── 更新徽标数据 ──────────────────────────────
  updateBadges(n) {
    this.badges = n, this.nodeIndexMap.clear();
    for (let i = 0; i < n.length; i++)
      this.nodeIndexMap.set(n[i].nodeId, i);
  }
  // ─── 渲染 ───────────────────────────────────────
  render(n, i, s, a, d, h = 0) {
    const p = this.badges.length;
    if (p === 0) return;
    const y = this.gl;
    y.useProgram(this.program), y.uniform2f(this.uResolution, n, i), y.uniform2f(this.uTranslation, s, a), y.uniform1f(this.uScale, d), y.uniform1f(this.uZOffset, h), y.uniform1f(this.uBorderWidth, this.borderWidth), y.uniform4f(
      this.uBorderColor,
      this.borderColor[0],
      this.borderColor[1],
      this.borderColor[2],
      this.borderColor[3]
    ), y.bindVertexArray(this.quadVao);
    const f = new Float32Array(p * 2), k = new Float32Array(p), _ = new Float32Array(p);
    for (let x = 0; x < p; x++) {
      const S = this.badges[x];
      f[x * 2] = S.x, f[x * 2 + 1] = S.y, k[x] = S.radius, _[x] = this.nodeIndexMap.get(S.nodeId) ?? x;
    }
    this.setupInstanceBuffer(1, f, 2), this.setupInstanceBuffer(2, k, 1), this.setupInstanceBuffer(3, _, 1), y.drawArraysInstanced(y.TRIANGLES, 0, 6, p);
    for (let x = 1; x <= 3; x++)
      y.vertexAttribDivisor(x, 0);
    y.bindVertexArray(null);
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
  renderPickBuffer(n, i, s, a, d) {
    const h = this.badges.length;
    if (h === 0) return;
    const p = this.gl;
    this.ensurePickFbo(n, i), p.bindFramebuffer(p.FRAMEBUFFER, this.pickFbo), p.viewport(0, 0, n, i), p.clearColor(0, 0, 0, 0), p.clear(p.COLOR_BUFFER_BIT | p.DEPTH_BUFFER_BIT), p.useProgram(this.pickProgram), p.uniform2f(this.uPickResolution, n, i), p.uniform2f(this.uPickTranslation, s, a), p.uniform1f(this.uPickScale, d), p.uniform1f(this.uPickZOffset, 0), p.uniform1f(this.uPickBorderWidth, this.borderWidth), p.bindVertexArray(this.quadVao);
    const y = new Float32Array(h * 2), f = new Float32Array(h), k = new Float32Array(h);
    for (let _ = 0; _ < h; _++) {
      const x = this.badges[_];
      y[_ * 2] = x.x, y[_ * 2 + 1] = x.y, f[_] = x.radius, k[_] = 0;
    }
    this.setupInstanceBuffer(1, y, 2), this.setupInstanceBuffer(2, f, 1), this.setupInstanceBuffer(3, k, 1), p.drawArraysInstanced(p.TRIANGLES, 0, 6, h);
    for (let _ = 1; _ <= 3; _++)
      p.vertexAttribDivisor(_, 0);
    p.bindVertexArray(null), p.bindFramebuffer(p.FRAMEBUFFER, null);
  }
  /** 在屏幕坐标处拾取徽标，返回 nodeId */
  pick(n, i) {
    var f;
    const s = this.gl;
    if (!this.pickFbo) return null;
    const a = window.devicePixelRatio || 1, d = Math.round(n * a), h = Math.round(i * a);
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
    const y = p[0] << 16 | p[1] << 8 | p[2];
    return y === 0 || y > this.badges.length ? null : ((f = this.badges[y]) == null ? void 0 : f.nodeId) ?? null;
  }
  // ─── 交互（capture phase 拦截） ────────────────
  onPointerDown(n) {
    var h;
    const i = this.canvas.getBoundingClientRect(), s = n.clientX - i.left, a = n.clientY - i.top, d = this.pick(s, a);
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
class dy {
  constructor(n) {
    T(this, "container");
    T(this, "canvas");
    T(this, "plugin");
    T(this, "interaction");
    T(this, "gl");
    T(this, "camera", new bg());
    T(this, "nodes", []);
    T(this, "links", []);
    T(this, "bgColor");
    T(this, "showArrows", !1);
    T(this, "labelMinScale", 0.5);
    T(this, "width");
    T(this, "height");
    T(this, "_destroyed", !1);
    T(this, "_rafId", 0);
    // 首次尺寸就绪时是否已自动 fitView（修复 macOS 挂载初期 height=0 导致节点小/左上角）
    T(this, "_autoFitDone", !1);
    // 回调
    T(this, "onNodeClick");
    T(this, "onNodeHover");
    T(this, "onLinkHover");
    T(this, "onNodeContextMenu");
    T(this, "onNodeDrag");
    T(this, "onNodeDragEnd");
    T(this, "onLinkClick");
    T(this, "onBackgroundClick");
    T(this, "onZoom");
    T(this, "onPlusClick");
    this.container = n.container, this.canvas = document.createElement("canvas"), this.canvas.style.width = "100%", this.canvas.style.height = "100%", this.canvas.style.display = "block";
    const i = window.devicePixelRatio || 1;
    this.width = n.width || this.container.clientWidth, this.height = n.height || this.container.clientHeight, this.canvas.width = this.width * i, this.canvas.height = this.height * i, this.container.appendChild(this.canvas);
    const s = this.canvas.getContext("webgl2", {
      antialias: !0,
      premultipliedAlpha: !1,
      // 保留绘制缓冲：截图/导出画布时需要，也便于自动化验证渲染结果
      preserveDrawingBuffer: !0
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
    this.showArrows = n.showArrows ?? !1, this.labelMinScale = n.labelMinScale ?? 0.5, this.plugin = n.renderPlugin(s, this.canvas), this.interaction = new Eg(
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
        var h, p, y;
        const a = this.interaction.transform.k, d = this.nodes.find((f) => f.id === n);
        d && (d.x += i / a, d.y += s / a, (h = this.onNodeDrag) == null || h.call(this, n, d.x, d.y), (y = (p = this.plugin).afterPositionUpdate) == null || y.call(p, this.nodes));
      },
      onNodeDragEnd: (n) => {
        var i;
        return (i = this.onNodeDragEnd) == null ? void 0 : i.call(this, n);
      },
      onNodeContextMenu: (n, i, s) => {
        var a;
        return (a = this.onNodeContextMenu) == null ? void 0 : a.call(this, n, i, s);
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
    for (const a of this.nodes) {
      const d = n.get(a.id);
      d && (a.x = d.x, a.y = d.y);
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
    const n = this.gl, i = window.devicePixelRatio || 1, s = this.width * i, a = this.height * i;
    n.bindFramebuffer(n.FRAMEBUFFER, null), n.viewport(0, 0, s, a), n.clearColor(...this.bgColor), n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT);
    const d = this.interaction.transform;
    this.plugin.render({
      nodes: this.nodes,
      links: this.links,
      // u_resolution 用 CSS 尺寸（与 fitView/交互的 transform 同一坐标空间）
      width: this.width,
      height: this.height,
      tx: d.x,
      ty: d.y,
      scale: d.k,
      showArrows: this.showArrows,
      labelMinScale: this.labelMinScale
    }), this.plugin.tx = d.x, this.plugin.ty = d.y, this.plugin.k = d.k;
    const h = this.plugin.getOverlays();
    for (let p = 0; p < h.length; p++)
      h[p].renderPickBuffer(this.width, this.height, d.x, d.y, d.k), h[p].render(
        this.width,
        this.height,
        d.x,
        d.y,
        d.k,
        -0.6 - p * 0.01
      );
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
    this.width = this.container.clientWidth, this.height = this.container.clientHeight, this.canvas.width = this.width * n, this.canvas.height = this.height * n, this.gl.viewport(0, 0, this.width * n, this.height * n), this.plugin.resize(this.width, this.height), !this._autoFitDone && this.width > 0 && this.height > 0 && this.nodes.length > 0 && (this._autoFitDone = !0, this.fitView(40));
  }
  // ========== Camera ==========
  fitView(n = 0) {
    var x;
    if (this.nodes.length === 0 || this.width <= 0 || this.height <= 0) return;
    let i = 1 / 0, s = 1 / 0, a = -1 / 0, d = -1 / 0;
    for (const S of this.nodes)
      i = Math.min(i, S.x - S.radius), s = Math.min(s, S.y - S.radius), a = Math.max(a, S.x + S.radius), d = Math.max(d, S.y + S.radius);
    const h = Math.max(1, a - i), p = Math.max(1, d - s), y = Math.max(1, this.width - n * 2), f = Math.max(1, this.height - n * 2), k = Math.min(y / h, f / p, 2), _ = this.interaction.transform;
    _.k = k, _.x = this.width / (2 * k) - (i + a) / 2, _.y = this.height / (2 * k) - (s + d) / 2, this.camera.reset(), (x = this.onZoom) == null || x.call(this, _);
  }
  focusNode(n) {
    const i = this.nodes.find((a) => a.id === n);
    if (!i) return;
    const s = this.interaction.transform;
    s.x = this.width / 2 / s.k - i.x, s.y = this.height / 2 / s.k - i.y;
  }
  destroy() {
    this._destroyed = !0, this._rafId && cancelAnimationFrame(this._rafId), this.interaction.detach(), this.interaction.reset(), this.plugin.destroy(), this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
}
class hy {
  constructor(n) {
    /** 实际渲染器 */
    T(this, "backend");
    // ========== 回调桥接 ==========
    T(this, "onNodeClick");
    T(this, "onNodeHover");
    T(this, "onLinkHover");
    T(this, "onNodeDrag");
    T(this, "onNodeDragEnd");
    T(this, "onNodeContextMenu");
    T(this, "onLinkClick");
    T(this, "onBackgroundClick");
    T(this, "onZoom");
    T(this, "onPlusClick");
    this.backend = new dy({
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
function Sl(c, n) {
  var i, s = 1;
  c == null && (c = 0), n == null && (n = 0);
  function a() {
    var d, h = i.length, p, y = 0, f = 0;
    for (d = 0; d < h; ++d)
      p = i[d], y += p.x, f += p.y;
    for (y = (y / h - c) * s, f = (f / h - n) * s, d = 0; d < h; ++d)
      p = i[d], p.x -= y, p.y -= f;
  }
  return a.initialize = function(d) {
    i = d;
  }, a.x = function(d) {
    return arguments.length ? (c = +d, a) : c;
  }, a.y = function(d) {
    return arguments.length ? (n = +d, a) : n;
  }, a.strength = function(d) {
    return arguments.length ? (s = +d, a) : s;
  }, a;
}
function fy(c) {
  const n = +this._x.call(null, c), i = +this._y.call(null, c);
  return ud(this.cover(n, i), n, i, c);
}
function ud(c, n, i, s) {
  if (isNaN(n) || isNaN(i)) return c;
  var a, d = c._root, h = { data: s }, p = c._x0, y = c._y0, f = c._x1, k = c._y1, _, x, S, N, b, m, C, R;
  if (!d) return c._root = h, c;
  for (; d.length; )
    if ((b = n >= (_ = (p + f) / 2)) ? p = _ : f = _, (m = i >= (x = (y + k) / 2)) ? y = x : k = x, a = d, !(d = d[C = m << 1 | b])) return a[C] = h, c;
  if (S = +c._x.call(null, d.data), N = +c._y.call(null, d.data), n === S && i === N) return h.next = d, a ? a[C] = h : c._root = h, c;
  do
    a = a ? a[C] = new Array(4) : c._root = new Array(4), (b = n >= (_ = (p + f) / 2)) ? p = _ : f = _, (m = i >= (x = (y + k) / 2)) ? y = x : k = x;
  while ((C = m << 1 | b) === (R = (N >= x) << 1 | S >= _));
  return a[R] = d, a[C] = h, c;
}
function py(c) {
  var n, i, s = c.length, a, d, h = new Array(s), p = new Array(s), y = 1 / 0, f = 1 / 0, k = -1 / 0, _ = -1 / 0;
  for (i = 0; i < s; ++i)
    isNaN(a = +this._x.call(null, n = c[i])) || isNaN(d = +this._y.call(null, n)) || (h[i] = a, p[i] = d, a < y && (y = a), a > k && (k = a), d < f && (f = d), d > _ && (_ = d));
  if (y > k || f > _) return this;
  for (this.cover(y, f).cover(k, _), i = 0; i < s; ++i)
    ud(this, h[i], p[i], c[i]);
  return this;
}
function gy(c, n) {
  if (isNaN(c = +c) || isNaN(n = +n)) return this;
  var i = this._x0, s = this._y0, a = this._x1, d = this._y1;
  if (isNaN(i))
    a = (i = Math.floor(c)) + 1, d = (s = Math.floor(n)) + 1;
  else {
    for (var h = a - i || 1, p = this._root, y, f; i > c || c >= a || s > n || n >= d; )
      switch (f = (n < s) << 1 | c < i, y = new Array(4), y[f] = p, p = y, h *= 2, f) {
        case 0:
          a = i + h, d = s + h;
          break;
        case 1:
          i = a - h, d = s + h;
          break;
        case 2:
          a = i + h, s = d - h;
          break;
        case 3:
          i = a - h, s = d - h;
          break;
      }
    this._root && this._root.length && (this._root = p);
  }
  return this._x0 = i, this._y0 = s, this._x1 = a, this._y1 = d, this;
}
function yy() {
  var c = [];
  return this.visit(function(n) {
    if (!n.length) do
      c.push(n.data);
    while (n = n.next);
  }), c;
}
function vy(c) {
  return arguments.length ? this.cover(+c[0][0], +c[0][1]).cover(+c[1][0], +c[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function rt(c, n, i, s, a) {
  this.node = c, this.x0 = n, this.y0 = i, this.x1 = s, this.y1 = a;
}
function my(c, n, i) {
  var s, a = this._x0, d = this._y0, h, p, y, f, k = this._x1, _ = this._y1, x = [], S = this._root, N, b;
  for (S && x.push(new rt(S, a, d, k, _)), i == null ? i = 1 / 0 : (a = c - i, d = n - i, k = c + i, _ = n + i, i *= i); N = x.pop(); )
    if (!(!(S = N.node) || (h = N.x0) > k || (p = N.y0) > _ || (y = N.x1) < a || (f = N.y1) < d))
      if (S.length) {
        var m = (h + y) / 2, C = (p + f) / 2;
        x.push(
          new rt(S[3], m, C, y, f),
          new rt(S[2], h, C, m, f),
          new rt(S[1], m, p, y, C),
          new rt(S[0], h, p, m, C)
        ), (b = (n >= C) << 1 | c >= m) && (N = x[x.length - 1], x[x.length - 1] = x[x.length - 1 - b], x[x.length - 1 - b] = N);
      } else {
        var R = c - +this._x.call(null, S.data), X = n - +this._y.call(null, S.data), U = R * R + X * X;
        if (U < i) {
          var H = Math.sqrt(i = U);
          a = c - H, d = n - H, k = c + H, _ = n + H, s = S.data;
        }
      }
  return s;
}
function xy(c) {
  if (isNaN(k = +this._x.call(null, c)) || isNaN(_ = +this._y.call(null, c))) return this;
  var n, i = this._root, s, a, d, h = this._x0, p = this._y0, y = this._x1, f = this._y1, k, _, x, S, N, b, m, C;
  if (!i) return this;
  if (i.length) for (; ; ) {
    if ((N = k >= (x = (h + y) / 2)) ? h = x : y = x, (b = _ >= (S = (p + f) / 2)) ? p = S : f = S, n = i, !(i = i[m = b << 1 | N])) return this;
    if (!i.length) break;
    (n[m + 1 & 3] || n[m + 2 & 3] || n[m + 3 & 3]) && (s = n, C = m);
  }
  for (; i.data !== c; ) if (a = i, !(i = i.next)) return this;
  return (d = i.next) && delete i.next, a ? (d ? a.next = d : delete a.next, this) : n ? (d ? n[m] = d : delete n[m], (i = n[0] || n[1] || n[2] || n[3]) && i === (n[3] || n[2] || n[1] || n[0]) && !i.length && (s ? s[C] = i : this._root = i), this) : (this._root = d, this);
}
function ky(c) {
  for (var n = 0, i = c.length; n < i; ++n) this.remove(c[n]);
  return this;
}
function Sy() {
  return this._root;
}
function wy() {
  var c = 0;
  return this.visit(function(n) {
    if (!n.length) do
      ++c;
    while (n = n.next);
  }), c;
}
function _y(c) {
  var n = [], i, s = this._root, a, d, h, p, y;
  for (s && n.push(new rt(s, this._x0, this._y0, this._x1, this._y1)); i = n.pop(); )
    if (!c(s = i.node, d = i.x0, h = i.y0, p = i.x1, y = i.y1) && s.length) {
      var f = (d + p) / 2, k = (h + y) / 2;
      (a = s[3]) && n.push(new rt(a, f, k, p, y)), (a = s[2]) && n.push(new rt(a, d, k, f, y)), (a = s[1]) && n.push(new rt(a, f, h, p, k)), (a = s[0]) && n.push(new rt(a, d, h, f, k));
    }
  return this;
}
function Ty(c) {
  var n = [], i = [], s;
  for (this._root && n.push(new rt(this._root, this._x0, this._y0, this._x1, this._y1)); s = n.pop(); ) {
    var a = s.node;
    if (a.length) {
      var d, h = s.x0, p = s.y0, y = s.x1, f = s.y1, k = (h + y) / 2, _ = (p + f) / 2;
      (d = a[0]) && n.push(new rt(d, h, p, k, _)), (d = a[1]) && n.push(new rt(d, k, p, y, _)), (d = a[2]) && n.push(new rt(d, h, _, k, f)), (d = a[3]) && n.push(new rt(d, k, _, y, f));
    }
    i.push(s);
  }
  for (; s = i.pop(); )
    c(s.node, s.x0, s.y0, s.x1, s.y1);
  return this;
}
function Cy(c) {
  return c[0];
}
function by(c) {
  return arguments.length ? (this._x = c, this) : this._x;
}
function Ey(c) {
  return c[1];
}
function Py(c) {
  return arguments.length ? (this._y = c, this) : this._y;
}
function Rl(c, n, i) {
  var s = new Ll(n ?? Cy, i ?? Ey, NaN, NaN, NaN, NaN);
  return c == null ? s : s.addAll(c);
}
function Ll(c, n, i, s, a, d) {
  this._x = c, this._y = n, this._x0 = i, this._y0 = s, this._x1 = a, this._y1 = d, this._root = void 0;
}
function Bc(c) {
  for (var n = { data: c.data }, i = n; c = c.next; ) i = i.next = { data: c.data };
  return n;
}
var it = Rl.prototype = Ll.prototype;
it.copy = function() {
  var c = new Ll(this._x, this._y, this._x0, this._y0, this._x1, this._y1), n = this._root, i, s;
  if (!n) return c;
  if (!n.length) return c._root = Bc(n), c;
  for (i = [{ source: n, target: c._root = new Array(4) }]; n = i.pop(); )
    for (var a = 0; a < 4; ++a)
      (s = n.source[a]) && (s.length ? i.push({ source: s, target: n.target[a] = new Array(4) }) : n.target[a] = Bc(s));
  return c;
};
it.add = fy;
it.addAll = py;
it.cover = gy;
it.data = yy;
it.extent = vy;
it.find = my;
it.remove = xy;
it.removeAll = ky;
it.root = Sy;
it.size = wy;
it.visit = _y;
it.visitAfter = Ty;
it.x = by;
it.y = Py;
function On(c) {
  return function() {
    return c;
  };
}
function wn(c) {
  return (c() - 0.5) * 1e-6;
}
function Ny(c) {
  return c.x + c.vx;
}
function Ay(c) {
  return c.y + c.vy;
}
function My(c) {
  var n, i, s, a = 1, d = 1;
  typeof c != "function" && (c = On(c == null ? 1 : +c));
  function h() {
    for (var f, k = n.length, _, x, S, N, b, m, C = 0; C < d; ++C)
      for (_ = Rl(n, Ny, Ay).visitAfter(p), f = 0; f < k; ++f)
        x = n[f], b = i[x.index], m = b * b, S = x.x + x.vx, N = x.y + x.vy, _.visit(R);
    function R(X, U, H, Y, A) {
      var D = X.data, j = X.r, $ = b + j;
      if (D) {
        if (D.index > x.index) {
          var ee = S - D.x - D.vx, ye = N - D.y - D.vy, oe = ee * ee + ye * ye;
          oe < $ * $ && (ee === 0 && (ee = wn(s), oe += ee * ee), ye === 0 && (ye = wn(s), oe += ye * ye), oe = ($ - (oe = Math.sqrt(oe))) / oe * a, x.vx += (ee *= oe) * ($ = (j *= j) / (m + j)), x.vy += (ye *= oe) * $, D.vx -= ee * ($ = 1 - $), D.vy -= ye * $);
        }
        return;
      }
      return U > S + $ || Y < S - $ || H > N + $ || A < N - $;
    }
  }
  function p(f) {
    if (f.data) return f.r = i[f.data.index];
    for (var k = f.r = 0; k < 4; ++k)
      f[k] && f[k].r > f.r && (f.r = f[k].r);
  }
  function y() {
    if (n) {
      var f, k = n.length, _;
      for (i = new Array(k), f = 0; f < k; ++f)
        _ = n[f], i[_.index] = +c(_, f, n);
    }
  }
  return h.initialize = function(f, k) {
    n = f, s = k, y();
  }, h.iterations = function(f) {
    return arguments.length ? (d = +f, h) : d;
  }, h.strength = function(f) {
    return arguments.length ? (a = +f, h) : a;
  }, h.radius = function(f) {
    return arguments.length ? (c = typeof f == "function" ? f : On(+f), y(), h) : c;
  }, h;
}
function Ry(c) {
  return c.index;
}
function Uc(c, n) {
  var i = c.get(n);
  if (!i) throw new Error("node not found: " + n);
  return i;
}
function Ly(c) {
  var n = Ry, i = _, s, a = On(30), d, h, p, y, f, k = 1;
  c == null && (c = []);
  function _(m) {
    return 1 / Math.min(p[m.source.index], p[m.target.index]);
  }
  function x(m) {
    for (var C = 0, R = c.length; C < k; ++C)
      for (var X = 0, U, H, Y, A, D, j, $; X < R; ++X)
        U = c[X], H = U.source, Y = U.target, A = Y.x + Y.vx - H.x - H.vx || wn(f), D = Y.y + Y.vy - H.y - H.vy || wn(f), j = Math.sqrt(A * A + D * D), j = (j - d[X]) / j * m * s[X], A *= j, D *= j, Y.vx -= A * ($ = y[X]), Y.vy -= D * $, H.vx += A * ($ = 1 - $), H.vy += D * $;
  }
  function S() {
    if (h) {
      var m, C = h.length, R = c.length, X = new Map(h.map((H, Y) => [n(H, Y, h), H])), U;
      for (m = 0, p = new Array(C); m < R; ++m)
        U = c[m], U.index = m, typeof U.source != "object" && (U.source = Uc(X, U.source)), typeof U.target != "object" && (U.target = Uc(X, U.target)), p[U.source.index] = (p[U.source.index] || 0) + 1, p[U.target.index] = (p[U.target.index] || 0) + 1;
      for (m = 0, y = new Array(R); m < R; ++m)
        U = c[m], y[m] = p[U.source.index] / (p[U.source.index] + p[U.target.index]);
      s = new Array(R), N(), d = new Array(R), b();
    }
  }
  function N() {
    if (h)
      for (var m = 0, C = c.length; m < C; ++m)
        s[m] = +i(c[m], m, c);
  }
  function b() {
    if (h)
      for (var m = 0, C = c.length; m < C; ++m)
        d[m] = +a(c[m], m, c);
  }
  return x.initialize = function(m, C) {
    h = m, f = C, S();
  }, x.links = function(m) {
    return arguments.length ? (c = m, S(), x) : c;
  }, x.id = function(m) {
    return arguments.length ? (n = m, x) : n;
  }, x.iterations = function(m) {
    return arguments.length ? (k = +m, x) : k;
  }, x.strength = function(m) {
    return arguments.length ? (i = typeof m == "function" ? m : On(+m), N(), x) : i;
  }, x.distance = function(m) {
    return arguments.length ? (a = typeof m == "function" ? m : On(+m), b(), x) : a;
  }, x;
}
var Dy = { value: () => {
} };
function cd() {
  for (var c = 0, n = arguments.length, i = {}, s; c < n; ++c) {
    if (!(s = arguments[c] + "") || s in i || /[\s.]/.test(s)) throw new Error("illegal type: " + s);
    i[s] = [];
  }
  return new ko(i);
}
function ko(c) {
  this._ = c;
}
function Iy(c, n) {
  return c.trim().split(/^|\s+/).map(function(i) {
    var s = "", a = i.indexOf(".");
    if (a >= 0 && (s = i.slice(a + 1), i = i.slice(0, a)), i && !n.hasOwnProperty(i)) throw new Error("unknown type: " + i);
    return { type: i, name: s };
  });
}
ko.prototype = cd.prototype = {
  constructor: ko,
  on: function(c, n) {
    var i = this._, s = Iy(c + "", i), a, d = -1, h = s.length;
    if (arguments.length < 2) {
      for (; ++d < h; ) if ((a = (c = s[d]).type) && (a = Fy(i[a], c.name))) return a;
      return;
    }
    if (n != null && typeof n != "function") throw new Error("invalid callback: " + n);
    for (; ++d < h; )
      if (a = (c = s[d]).type) i[a] = Wc(i[a], c.name, n);
      else if (n == null) for (a in i) i[a] = Wc(i[a], c.name, null);
    return this;
  },
  copy: function() {
    var c = {}, n = this._;
    for (var i in n) c[i] = n[i].slice();
    return new ko(c);
  },
  call: function(c, n) {
    if ((a = arguments.length - 2) > 0) for (var i = new Array(a), s = 0, a, d; s < a; ++s) i[s] = arguments[s + 2];
    if (!this._.hasOwnProperty(c)) throw new Error("unknown type: " + c);
    for (d = this._[c], s = 0, a = d.length; s < a; ++s) d[s].value.apply(n, i);
  },
  apply: function(c, n, i) {
    if (!this._.hasOwnProperty(c)) throw new Error("unknown type: " + c);
    for (var s = this._[c], a = 0, d = s.length; a < d; ++a) s[a].value.apply(n, i);
  }
};
function Fy(c, n) {
  for (var i = 0, s = c.length, a; i < s; ++i)
    if ((a = c[i]).name === n)
      return a.value;
}
function Wc(c, n, i) {
  for (var s = 0, a = c.length; s < a; ++s)
    if (c[s].name === n) {
      c[s] = Dy, c = c.slice(0, s).concat(c.slice(s + 1));
      break;
    }
  return i != null && c.push({ name: n, value: i }), c;
}
var pr = 0, ni = 0, ti = 0, dd = 1e3, So, ri, wo = 0, Bn = 0, To = 0, ii = typeof performance == "object" && performance.now ? performance : Date, hd = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(c) {
  setTimeout(c, 17);
};
function fd() {
  return Bn || (hd(jy), Bn = ii.now() + To);
}
function jy() {
  Bn = 0;
}
function El() {
  this._call = this._time = this._next = null;
}
El.prototype = pd.prototype = {
  constructor: El,
  restart: function(c, n, i) {
    if (typeof c != "function") throw new TypeError("callback is not a function");
    i = (i == null ? fd() : +i) + (n == null ? 0 : +n), !this._next && ri !== this && (ri ? ri._next = this : So = this, ri = this), this._call = c, this._time = i, Pl();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Pl());
  }
};
function pd(c, n, i) {
  var s = new El();
  return s.restart(c, n, i), s;
}
function zy() {
  fd(), ++pr;
  for (var c = So, n; c; )
    (n = Bn - c._time) >= 0 && c._call.call(void 0, n), c = c._next;
  --pr;
}
function Hc() {
  Bn = (wo = ii.now()) + To, pr = ni = 0;
  try {
    zy();
  } finally {
    pr = 0, By(), Bn = 0;
  }
}
function Oy() {
  var c = ii.now(), n = c - wo;
  n > dd && (To -= n, wo = c);
}
function By() {
  for (var c, n = So, i, s = 1 / 0; n; )
    n._call ? (s > n._time && (s = n._time), c = n, n = n._next) : (i = n._next, n._next = null, n = c ? c._next = i : So = i);
  ri = c, Pl(s);
}
function Pl(c) {
  if (!pr) {
    ni && (ni = clearTimeout(ni));
    var n = c - Bn;
    n > 24 ? (c < 1 / 0 && (ni = setTimeout(Hc, c - ii.now() - To)), ti && (ti = clearInterval(ti))) : (ti || (wo = ii.now(), ti = setInterval(Oy, dd)), pr = 1, hd(Hc));
  }
}
const Uy = 1664525, Wy = 1013904223, Vc = 4294967296;
function Hy() {
  let c = 1;
  return () => (c = (Uy * c + Wy) % Vc) / Vc;
}
function Vy(c) {
  return c.x;
}
function $y(c) {
  return c.y;
}
var Xy = 10, Yy = Math.PI * (3 - Math.sqrt(5));
function Gy(c) {
  var n, i = 1, s = 1e-3, a = 1 - Math.pow(s, 1 / 300), d = 0, h = 0.6, p = /* @__PURE__ */ new Map(), y = pd(_), f = cd("tick", "end"), k = Hy();
  c == null && (c = []);
  function _() {
    x(), f.call("tick", n), i < s && (y.stop(), f.call("end", n));
  }
  function x(b) {
    var m, C = c.length, R;
    b === void 0 && (b = 1);
    for (var X = 0; X < b; ++X)
      for (i += (d - i) * a, p.forEach(function(U) {
        U(i);
      }), m = 0; m < C; ++m)
        R = c[m], R.fx == null ? R.x += R.vx *= h : (R.x = R.fx, R.vx = 0), R.fy == null ? R.y += R.vy *= h : (R.y = R.fy, R.vy = 0);
    return n;
  }
  function S() {
    for (var b = 0, m = c.length, C; b < m; ++b) {
      if (C = c[b], C.index = b, C.fx != null && (C.x = C.fx), C.fy != null && (C.y = C.fy), isNaN(C.x) || isNaN(C.y)) {
        var R = Xy * Math.sqrt(0.5 + b), X = b * Yy;
        C.x = R * Math.cos(X), C.y = R * Math.sin(X);
      }
      (isNaN(C.vx) || isNaN(C.vy)) && (C.vx = C.vy = 0);
    }
  }
  function N(b) {
    return b.initialize && b.initialize(c, k), b;
  }
  return S(), n = {
    tick: x,
    restart: function() {
      return y.restart(_), n;
    },
    stop: function() {
      return y.stop(), n;
    },
    nodes: function(b) {
      return arguments.length ? (c = b, S(), p.forEach(N), n) : c;
    },
    alpha: function(b) {
      return arguments.length ? (i = +b, n) : i;
    },
    alphaMin: function(b) {
      return arguments.length ? (s = +b, n) : s;
    },
    alphaDecay: function(b) {
      return arguments.length ? (a = +b, n) : +a;
    },
    alphaTarget: function(b) {
      return arguments.length ? (d = +b, n) : d;
    },
    velocityDecay: function(b) {
      return arguments.length ? (h = 1 - b, n) : 1 - h;
    },
    randomSource: function(b) {
      return arguments.length ? (k = b, p.forEach(N), n) : k;
    },
    force: function(b, m) {
      return arguments.length > 1 ? (m == null ? p.delete(b) : p.set(b, N(m)), n) : p.get(b);
    },
    find: function(b, m, C) {
      var R = 0, X = c.length, U, H, Y, A, D;
      for (C == null ? C = 1 / 0 : C *= C, R = 0; R < X; ++R)
        A = c[R], U = b - A.x, H = m - A.y, Y = U * U + H * H, Y < C && (D = A, C = Y);
      return D;
    },
    on: function(b, m) {
      return arguments.length > 1 ? (f.on(b, m), n) : f.on(b);
    }
  };
}
function $c() {
  var c, n, i, s, a = On(-30), d, h = 1, p = 1 / 0, y = 0.81;
  function f(S) {
    var N, b = c.length, m = Rl(c, Vy, $y).visitAfter(_);
    for (s = S, N = 0; N < b; ++N) n = c[N], m.visit(x);
  }
  function k() {
    if (c) {
      var S, N = c.length, b;
      for (d = new Array(N), S = 0; S < N; ++S)
        b = c[S], d[b.index] = +a(b, S, c);
    }
  }
  function _(S) {
    var N = 0, b, m, C = 0, R, X, U;
    if (S.length) {
      for (R = X = U = 0; U < 4; ++U)
        (b = S[U]) && (m = Math.abs(b.value)) && (N += b.value, C += m, R += m * b.x, X += m * b.y);
      S.x = R / C, S.y = X / C;
    } else {
      b = S, b.x = b.data.x, b.y = b.data.y;
      do
        N += d[b.data.index];
      while (b = b.next);
    }
    S.value = N;
  }
  function x(S, N, b, m) {
    if (!S.value) return !0;
    var C = S.x - n.x, R = S.y - n.y, X = m - N, U = C * C + R * R;
    if (X * X / y < U)
      return U < p && (C === 0 && (C = wn(i), U += C * C), R === 0 && (R = wn(i), U += R * R), U < h && (U = Math.sqrt(h * U)), n.vx += C * S.value * s / U, n.vy += R * S.value * s / U), !0;
    if (S.length || U >= p) return;
    (S.data !== n || S.next) && (C === 0 && (C = wn(i), U += C * C), R === 0 && (R = wn(i), U += R * R), U < h && (U = Math.sqrt(h * U)));
    do
      S.data !== n && (X = d[S.data.index] * s / U, n.vx += C * X, n.vy += R * X);
    while (S = S.next);
  }
  return f.initialize = function(S, N) {
    c = S, i = N, k();
  }, f.strength = function(S) {
    return arguments.length ? (a = typeof S == "function" ? S : On(+S), k(), f) : a;
  }, f.distanceMin = function(S) {
    return arguments.length ? (h = S * S, f) : Math.sqrt(h);
  }, f.distanceMax = function(S) {
    return arguments.length ? (p = S * S, f) : Math.sqrt(p);
  }, f.theta = function(S) {
    return arguments.length ? (y = S * S, f) : Math.sqrt(y);
  }, f;
}
const Qy = {
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
class Nl {
  constructor(n) {
    T(this, "simulation", null);
    T(this, "nodes", []);
    T(this, "links", []);
    T(this, "config");
    T(this, "centerX", 0);
    T(this, "centerY", 0);
    // Callbacks
    T(this, "onTick");
    T(this, "onEnd");
    this.config = { ...Qy, ...n };
  }
  /** Set nodes and links */
  setData(n, i) {
    this.nodes = n, this.links = i;
  }
  /** 构建力导向边：distance/strength 由外部 linkDistanceFn/linkStrengthFn 定义（未提供则用常量） */
  buildLinkForce() {
    return Ly(this.links).id((n) => n.id).distance(
      (n) => {
        var i, s;
        return ((s = (i = this.config).linkDistanceFn) == null ? void 0 : s.call(i, n)) ?? this.config.linkDistance;
      }
    ).strength(
      (n) => {
        var i, s;
        return ((s = (i = this.config).linkStrengthFn) == null ? void 0 : s.call(i, n)) ?? this.config.linkStrength;
      }
    ).iterations(this.config.linkIterations);
  }
  /** Start or restart the simulation */
  start() {
    this.simulation && this.simulation.stop(), this.simulation = Gy(this.nodes).force("link", this.buildLinkForce()).force("charge", $c().strength(this.config.repulsion)).force(
      "center",
      Sl(this.centerX, this.centerY).strength(
        this.config.centerStrength
      )
    ).force(
      "collide",
      My(
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
  /**
   * 一次性同步排布（算法布局）：构建力模型后同步迭代指定次数即停止，
   * 不启动冷却动画——init 后直接按算法铺开节点，无需等待引擎冷却。
   * 注意：d3 的 simulation.tick() 只更新坐标、不派发 tick 事件（tick 事件
   * 由定时器 step() 派发），故手动 tick 后需显式调用 onTick 把最终位置推给
   * 渲染器，再触发 onEnd（fitView 等）。
   */
  settle(n = 300) {
    var s, a;
    this.start();
    const i = this.simulation;
    i && (i.stop(), i.tick(n), (s = this.onTick) == null || s.call(this, this.nodes), (a = this.onEnd) == null || a.call(this));
  }
  /** Update config and restart */
  updateConfig(n) {
    if (Object.assign(this.config, n), this.simulation) {
      const i = this.simulation;
      i.force("charge", $c().strength(this.config.repulsion)), i.force("link", this.buildLinkForce()), i.force(
        "center",
        Sl(this.centerX, this.centerY).strength(
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
      Sl(n, i).strength(this.config.centerStrength)
    );
  }
  /** Fix a node in place */
  fixNode(n, i, s) {
    const a = this.nodes.find((d) => d.id === n);
    a && (i !== void 0 && (a.fx = i), s !== void 0 && (a.fy = s));
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
function kn(c) {
  let n = c.replace("#", "");
  n.length === 3 && (n = n.replace(/(.)/g, "$1$1")), n.length === 4 && (n = n.replace(/(.)/g, "$1$1"));
  const i = parseInt(n.slice(0, 2), 16) / 255, s = parseInt(n.slice(2, 4), 16) / 255, a = parseInt(n.slice(4, 6), 16) / 255, d = n.length >= 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1;
  return [i, s, a, d];
}
function Ky(c, n) {
  const i = { ...c };
  for (const s of Object.keys(n))
    s === "background" || typeof n[s] != "object" || n[s] === null ? i[s] = n[s] : i[s] = { ...c[s] || {}, ...n[s] };
  return i;
}
class qy {
  constructor(n) {
    T(this, "options");
    T(this, "container");
    T(this, "model");
    /** 渲染器代理门面 */
    T(this, "renderer");
    /** 当前布局引擎 */
    T(this, "layout");
    /** 原始 theme 配置（含静态样式和动态回调） */
    T(this, "rawTheme");
    /** 运行时主题值（传给样式回调函数） */
    T(this, "runtimeTheme");
    // Node/link lookup
    T(this, "nodeMap", /* @__PURE__ */ new Map());
    T(this, "linkMap", /* @__PURE__ */ new Map());
    // 首次布局稳定后是否已自动 fitView（避免 init 后布局演化导致节点超出视野）
    T(this, "_autoFitOnEndDone", !1);
    T(this, "events");
    T(this, "styleManager");
    this.options = n, this.container = n.container, this.model = n.graphModel, this.events = this.model.events, this.styleManager = this.model.styleManager, this.runtimeTheme = n.runtimeTheme, this.renderer = new hy({
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
          for (const y of Object.keys(h))
            typeof h[y] != "function" && (p[y] = h[y]);
          Object.keys(p).length > 0 && (s[d] = p);
        }
      }
    }
    const a = s ? Ky(i, s) : i;
    this.styleManager.init(a), this.layout = n.layout ?? new Nl(n.forceConfig), this.layout.onTick = (d) => {
      this.onPhysicsTick(d);
    }, this.layout.onEnd = () => {
      this._autoFitOnEndDone || (this._autoFitOnEndDone = !0, this.renderer.fitView(40));
    }, this.setupRendererCallbacks(), this.rebuildFromModel();
  }
  // ========== Renderer callbacks ==========
  setupRendererCallbacks() {
    this.renderer.onNodeContextMenu = (n, i, s) => {
      const a = this.nodeMap.get(n) ?? null;
      a && this.events.publish("nodeRightClick", {
        node: a,
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
    }), this.events.subscribe("hiddenChange", () => {
      this.syncAllNodeStyles(), this.syncAllLinkStyles();
    });
  }
  // ========== 状态驱动的视觉同步 ==========
  /** 遍历所有节点，根据 stateManager 当前状态刷新视觉样式 */
  syncAllNodeStyles() {
    var n, i;
    for (const s of this.renderer.nodes) {
      const a = ((i = (n = this.renderer.plugin).resolveNodeState) == null ? void 0 : i.call(
        n,
        s.id,
        this.model.stateManager
      )) ?? "regular", d = this.styleManager.getNodeStyle(s.id), h = mo(d, a), p = h.opacity ?? 1, y = kn(h.bgColor), f = kn(h.strokeColor ?? "#666"), k = kn(h.textColor ?? "#2c2c2c");
      s.color = [y[0], y[1], y[2], p], s.strokeColor = [f[0], f[1], f[2], p], s.textColor = [k[0], k[1], k[2], p], s.strokeWidth = h.strokeWidth;
    }
  }
  /** 遍历所有边，根据 stateManager 当前状态刷新视觉样式 */
  syncAllLinkStyles() {
    var n, i;
    for (const s of this.renderer.links) {
      const a = ((i = (n = this.renderer.plugin).resolveLinkState) == null ? void 0 : i.call(
        n,
        s.id,
        this.model.stateManager
      )) ?? "regular", d = Oc(
        this.styleManager.getLinkStyle(s.id),
        a
      ), h = kn(d.color ?? "#9ca3af");
      s.color = [h[0], h[1], h[2], d.opacity ?? 0.7], s.width = d.strokeWidth ?? 0.8;
    }
  }
  // ========== Data rebuilding ==========
  rebuildFromModel(n = !0) {
    var p;
    const { graphData: i } = this.model.getGraphModelData();
    this.nodeMap.clear(), this.linkMap.clear();
    const s = [], a = [];
    for (let y = 0; y < i.nodes.length; y++) {
      const f = i.nodes[y];
      this.nodeMap.set(f.id, f);
      const k = this.defaultMapNode(f, y);
      k && (s.push(k), a.push({
        id: f.id,
        x: f.x ?? (Math.random() - 0.5) * 100,
        y: f.y ?? (Math.random() - 0.5) * 100,
        radius: k.radius,
        fx: f.fx ?? null,
        fy: f.fy ?? null,
        vx: f.vx ?? 0,
        vy: f.vy ?? 0
      }));
    }
    const d = [], h = [];
    for (let y = 0; y < i.links.length; y++) {
      const f = i.links[y];
      this.linkMap.set(f.id, f);
      const k = typeof f.source == "object" ? f.source.id : f.source, _ = typeof f.target == "object" ? f.target.id : f.target, x = this.defaultMapLink(f, y);
      x && (d.push(x), h.push({
        id: f.id,
        source: k,
        target: _,
        // 亲密度传给物理引擎：影响边拉扯力（关系越强节点越紧）
        intimacy: (p = f.data) == null ? void 0 : p.intimacy
      }));
    }
    this.renderer.updateData(s, d), this.layout.setData(a, h), this.layout.start(), n && requestAnimationFrame(() => {
      this.renderer.fitView();
    });
  }
  defaultMapNode(n, i) {
    var S, N, b, m, C, R, X;
    const s = (S = n.data) == null ? void 0 : S.nodeType, a = s ? (b = (N = this.rawTheme) == null ? void 0 : N.node) == null ? void 0 : b[s] : void 0, d = typeof a == "function" ? a(n, this.runtimeTheme) : a ?? this.styleManager.getNodeStyle(n.id);
    this.styleManager.setNodeStyle(n.id, d);
    const h = ((C = (m = this.renderer.plugin).resolveNodeState) == null ? void 0 : C.call(
      m,
      n.id,
      this.model.stateManager
    )) ?? "regular", p = mo(d, h), y = kn(p.bgColor), f = y[0], k = y[1], _ = y[2], x = kn(p.textColor);
    return {
      x: n.x ?? 0,
      y: n.y ?? 0,
      radius: p.radius,
      color: [f, k, _, p.opacity],
      strokeColor: kn(p.strokeColor),
      strokeWidth: p.strokeWidth,
      id: n.id,
      label: (R = n.data) == null ? void 0 : R.label,
      textColor: [x[0], x[1], x[2], 1],
      fontSize: p.fontSize,
      // 图标：node.data.icon（URL 或 emoji，见 IconAtlas）
      iconUrl: (X = n.data) == null ? void 0 : X.icon
    };
  }
  defaultMapLink(n, i) {
    var m, C, R, X, U;
    const s = typeof n.source == "object" ? n.source.id : n.source, a = typeof n.target == "object" ? n.target.id : n.target, d = this.nodeMap.get(String(s)), h = this.nodeMap.get(String(a)), p = (m = n.data) == null ? void 0 : m.linkType, y = p ? (R = (C = this.rawTheme) == null ? void 0 : C.link) == null ? void 0 : R[p] : void 0, f = typeof y == "function" ? y(n, this.runtimeTheme) : y ?? this.styleManager.getLinkStyle(n.id);
    this.styleManager.setLinkStyle(n.id, f);
    const k = Oc(f, "regular"), _ = kn(k.color ?? "#9ca3af"), x = this.styleManager.getNodeStyle(s), S = this.styleManager.getNodeStyle(a), N = mo(x, "regular"), b = mo(S, "regular");
    return {
      sourceX: (d == null ? void 0 : d.x) ?? 0,
      sourceY: (d == null ? void 0 : d.y) ?? 0,
      targetX: (h == null ? void 0 : h.x) ?? 0,
      targetY: (h == null ? void 0 : h.y) ?? 0,
      color: [_[0], _[1], _[2], k.opacity ?? 0.7],
      width: k.strokeWidth ?? 0.8,
      sourceRadius: N.radius ?? 4,
      targetRadius: b.radius ?? 4,
      sourceId: String(s),
      targetId: String(a),
      id: n.id,
      label: ((X = n.data) == null ? void 0 : X.label) ?? ((U = n.data) == null ? void 0 : U.linkType),
      arrowSize: k.arrowSize
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
    const s = this.renderer.nodes, a = this.renderer.links;
    for (const h of a)
      s.find((p) => p.id === h.id);
    const { graphData: d } = this.model.getGraphModelData();
    for (const h of a) {
      const p = d.links.find((x) => x.id === h.id);
      if (!p) continue;
      const y = typeof p.source == "object" ? p.source.id : p.source, f = typeof p.target == "object" ? p.target.id : p.target, k = d.nodes.find((x) => x.id === y), _ = d.nodes.find((x) => x.id === f);
      k && (h.sourceX = k.x ?? 0, h.sourceY = k.y ?? 0), _ && (h.targetX = _.x ?? 0, h.targetY = _.y ?? 0);
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
  /** 切换布局引擎（如 力导向 ⇄ 树形），并用当前画布数据重建排布 */
  setLayout(n) {
    var i, s, a, d;
    this.layout && this.layout !== n && ((s = (i = this.layout).stop) == null || s.call(i), (d = (a = this.layout).destroy) == null || d.call(a)), this.layout = n, this.layout.onTick = (h) => {
      this.onPhysicsTick(h);
    }, this.layout.onEnd = () => {
      this._autoFitOnEndDone || (this._autoFitOnEndDone = !0);
    }, this.rebuildFromModel(!1);
  }
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
    this.layout instanceof Nl && this.layout.updateConfig(n);
  }
  /** Reheat the layout */
  reheat(n) {
    this.layout.reheat(n);
  }
  /**
   * 把物理引擎中心设到指定世界坐标。
   * 搜索新增时传当前视口中心——统一兼容两种情况：
   *  - 空画布（相机从未 fitView，默认态 k=1,x=0,y=0）：视口中心世界坐标=(W/2,H/2)，
   *    物理中心跟随 → 节点聚在屏幕中央，不被中心力拉回世界原点(左上角)；
   *  - 非空画布：视口中心世界坐标≈当前视野中央 → 增量节点出现在视野中央、不跳视角。
   */
  setPhysicsCenter(n, i) {
    var s, a;
    (a = (s = this.layout).setCenter) == null || a.call(s, n, i);
  }
  /**
   * 一次性算法排布并 fitView（不等待物理引擎冷却）。
   * 供 init 使用：数据载入后直接按算法铺开节点并收进视野。
   */
  settleLayout(n) {
    this.layout.settle ? this.layout.settle(n ?? 300) : this.layout.start(), requestAnimationFrame(() => this.renderer.fitView(40));
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
    const { graphData: n } = this.model.getGraphModelData(), i = new Map(this.renderer.nodes.map((a) => [a.id, a]));
    for (let a = 0; a < n.nodes.length; a++) {
      const d = n.nodes[a], h = this.defaultMapNode(d, a), p = i.get(d.id);
      h && p && (p.color = h.color, p.strokeColor = h.strokeColor, p.strokeWidth = h.strokeWidth, p.radius = h.radius, p.textColor = h.textColor, p.fontSize = h.fontSize);
    }
    const s = new Map(this.renderer.links.map((a) => [a.id, a]));
    for (let a = 0; a < n.links.length; a++) {
      const d = n.links[a], h = this.defaultMapLink(d, a), p = s.get(d.id);
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
function Zy(c) {
  return !!(/^(https?:|blob:)/i.test(c) || c.startsWith("data:image/") || c.startsWith("/"));
}
class Jy {
  constructor(n = 1024, i = 64) {
    T(this, "canvas");
    T(this, "ctx");
    T(this, "texture", null);
    T(this, "entries", /* @__PURE__ */ new Map());
    /** 已分配 slot 但尚未加载完成的 url → glyph 占位 */
    T(this, "pending", /* @__PURE__ */ new Map());
    T(this, "cursorX", 2);
    T(this, "cursorY", 2);
    T(this, "rowHeight", 0);
    T(this, "slotSize");
    T(this, "dirty", !1);
    this.canvas = document.createElement("canvas"), this.canvas.width = n, this.canvas.height = n, this.ctx = this.canvas.getContext("2d"), this.slotSize = i;
  }
  /** 获取图标的 UV。首次调用时异步加载，返回 null；加载完成后返回 glyph */
  getOrCreate(n) {
    if (!n || !Zy(n)) return null;
    const i = this.entries.get(n);
    if (i) return i;
    if (this.pending.has(n)) return null;
    const s = this.slotSize;
    if (this.cursorX + s > this.canvas.width && (this.cursorX = 2, this.cursorY += this.rowHeight + 2, this.rowHeight = 0), this.cursorY + s > this.canvas.height)
      return console.warn("[IconAtlas] overflow:", n), null;
    const a = this.cursorX, d = this.cursorY, h = this.canvas.width, p = this.canvas.height;
    this.cursorX += s + 1, this.rowHeight = Math.max(this.rowHeight, s);
    const y = {
      uv: [a / h, d / p, (a + s) / h, (d + s) / p],
      pw: s,
      ph: s
    };
    return this.loadImage(n, y, a, d, s), null;
  }
  loadImage(n, i, s, a, d) {
    this.pending.set(n, i);
    const h = new Image();
    h.crossOrigin = "anonymous", h.onload = () => {
      const p = Math.min(d / h.width, d / h.height), y = h.width * p, f = h.height * p;
      this.ctx.clearRect(s, a, d, d), this.ctx.drawImage(h, s + (d - y) / 2, a + (d - f) / 2, y, f), this.entries.set(n, i), this.pending.delete(n), this.dirty = !0;
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
function Al(c) {
  return 0;
}
class ev {
  constructor(n) {
    T(this, "gl");
    T(this, "program");
    T(this, "pickProgram");
    // Shared quad geometry (unit square centered at origin)
    T(this, "quadVao", null);
    // Uniform locations (render)
    T(this, "uResolution", null);
    T(this, "uTranslation", null);
    T(this, "uScale", null);
    T(this, "uZOffset", null);
    T(this, "uIconAtlas", null);
    // Uniform locations (pick)
    T(this, "uPickResolution", null);
    T(this, "uPickTranslation", null);
    T(this, "uPickScale", null);
    T(this, "uPickZOffset", null);
    this.gl = n, this.program = this.compileProgram(Xg, Yg), this.pickProgram = this.compileProgram(Gg, Qg), this.initQuadGeometry(), this.cacheUniforms();
  }
  compileProgram(n, i) {
    const s = this.gl, a = this.compileShader(s.VERTEX_SHADER, n), d = this.compileShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    if (s.attachShader(h, a), s.attachShader(h, d), s.linkProgram(h), !s.getProgramParameter(h, s.LINK_STATUS))
      throw new Error("Shader link failed: " + s.getProgramInfoLog(h));
    return h;
  }
  compileShader(n, i) {
    const s = this.gl, a = s.createShader(n);
    if (s.shaderSource(a, i), s.compileShader(a), !s.getShaderParameter(a, s.COMPILE_STATUS))
      throw new Error("Shader compile failed: " + s.getShaderInfoLog(a));
    return a;
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
    const a = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, a), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  /** Render all nodes in one instanced draw call */
  render(n, i, s, a, d, h, p = 0, y) {
    if (n.length === 0) return;
    const f = this.gl, k = n.length;
    f.useProgram(this.program), f.uniform2f(this.uResolution, i, s), f.uniform2f(this.uTranslation, a, d), f.uniform1f(this.uScale, h), f.uniform1f(this.uZOffset, p), f.bindVertexArray(this.quadVao);
    const _ = new Float32Array(k * 2), x = new Float32Array(k), S = new Float32Array(k * 4), N = new Float32Array(k * 4), b = new Float32Array(k), m = new Float32Array(k), C = new Float32Array(k), R = new Float32Array(k), X = new Float32Array(k), U = new Float32Array(k), H = new Float32Array(k), Y = new Float32Array(k), A = new Float32Array(k * 4), D = /* @__PURE__ */ new Map();
    for (let j = 0; j < k; j++) {
      const $ = n[j];
      if (_[j * 2] = $.x, _[j * 2 + 1] = $.y, x[j] = $.radius, S[j * 4] = $.color[0], S[j * 4 + 1] = $.color[1], S[j * 4 + 2] = $.color[2], S[j * 4 + 3] = $.color[3], N[j * 4] = $.strokeColor[0], N[j * 4 + 1] = $.strokeColor[1], N[j * 4 + 2] = $.strokeColor[2], N[j * 4 + 3] = $.strokeColor[3], b[j] = $.strokeWidth, m[j] = Al($.shape), C[j] = $.shapeParam ?? 0.25, R[j] = $.showPlus ?? 0, X[j] = $.plusOffsetX ?? 0.5, U[j] = $.plusOffsetY ?? -0.5, H[j] = $.plusScale ?? 0.35, y && $.iconUrl) {
        let ee = D.get($.iconUrl);
        ee === void 0 && (ee = y.getOrCreate($.iconUrl), D.set($.iconUrl, ee)), ee && (Y[j] = 1, A[j * 4] = ee.uv[0], A[j * 4 + 1] = ee.uv[1], A[j * 4 + 2] = ee.uv[2], A[j * 4 + 3] = ee.uv[3]);
      }
    }
    this.setupInstanceBuffer(1, _, 2), this.setupInstanceBuffer(2, x, 1), this.setupInstanceBuffer(3, S, 4), this.setupInstanceBuffer(4, N, 4), this.setupInstanceBuffer(5, b, 1), this.setupInstanceBuffer(6, m, 1), this.setupInstanceBuffer(7, C, 1), this.setupInstanceBuffer(8, R, 1), this.setupInstanceBuffer(9, X, 1), this.setupInstanceBuffer(10, U, 1), this.setupInstanceBuffer(11, H, 1), this.setupInstanceBuffer(12, Y, 1), this.setupInstanceBuffer(13, A, 4), y && (f.activeTexture(f.TEXTURE1), f.bindTexture(f.TEXTURE_2D, y.getTexture(f)), f.uniform1i(this.uIconAtlas, 1)), f.drawArraysInstanced(f.TRIANGLES, 0, 6, k);
    for (let j = 1; j <= 13; j++)
      f.vertexAttribDivisor(j, 0);
    f.bindVertexArray(null);
  }
  /** Batch-render all nodes for FBO picking (single draw call, gl_InstanceID encodes index) */
  renderPicking(n, i, s, a, d, h, p = 0) {
    if (n.length === 0) return;
    const y = this.gl, f = n.length;
    y.useProgram(this.pickProgram), y.uniform2f(this.uPickResolution, i, s), y.uniform2f(this.uPickTranslation, a, d), y.uniform1f(this.uPickScale, h), y.uniform1f(this.uPickZOffset, p), y.bindVertexArray(this.quadVao);
    const k = new Float32Array(f * 2), _ = new Float32Array(f), x = new Float32Array(f * 4), S = new Float32Array(f * 4), N = new Float32Array(f), b = new Float32Array(f), m = new Float32Array(f);
    for (let C = 0; C < f; C++) {
      const R = n[C];
      k[C * 2] = R.x, k[C * 2 + 1] = R.y, _[C] = R.radius, N[C] = R.strokeWidth, b[C] = Al(R.shape), m[C] = R.shapeParam ?? 0.25;
    }
    this.setupInstanceBuffer(1, k, 2), this.setupInstanceBuffer(2, _, 1), this.setupInstanceBuffer(3, x, 4), this.setupInstanceBuffer(4, S, 4), this.setupInstanceBuffer(5, N, 1), this.setupInstanceBuffer(6, b, 1), this.setupInstanceBuffer(7, m, 1), y.drawArraysInstanced(y.TRIANGLES, 0, 6, f);
    for (let C = 1; C <= 7; C++)
      y.vertexAttribDivisor(C, 0);
    y.bindVertexArray(null);
  }
  setupInstanceBuffer(n, i, s) {
    const a = this.gl, d = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, d), a.bufferData(a.ARRAY_BUFFER, i, a.DYNAMIC_DRAW), a.enableVertexAttribArray(n), a.vertexAttribPointer(n, s, a.FLOAT, !1, 0, 0), a.vertexAttribDivisor(n, 1);
  }
  destroy() {
    const n = this.gl;
    n.deleteProgram(this.program), n.deleteProgram(this.pickProgram);
  }
}
class tv {
  constructor(n) {
    T(this, "gl");
    // ── Line program ──
    T(this, "lineProgram");
    T(this, "linePickProgram");
    // ── Arrow program ──
    T(this, "arrowProgram");
    T(this, "arrowPickProgram");
    // ── VAOs ──
    T(this, "lineVao", null);
    T(this, "arrowVao", null);
    T(this, "_lineVerts", 0);
    // triangle strip vertex count
    // Uniforms (line render)
    T(this, "uLineResolution", null);
    T(this, "uLineTranslation", null);
    T(this, "uLineScale", null);
    T(this, "uLineZOffset", null);
    // Uniforms (line pick)
    T(this, "uLinePickResolution", null);
    T(this, "uLinePickTranslation", null);
    T(this, "uLinePickScale", null);
    T(this, "uLinePickZOffset", null);
    T(this, "uLinePickIdOffset", null);
    // Uniforms (arrow render)
    T(this, "uArrowResolution", null);
    T(this, "uArrowTranslation", null);
    T(this, "uArrowScale", null);
    // Uniforms (arrow pick)
    T(this, "uArrowPickResolution", null);
    T(this, "uArrowPickTranslation", null);
    T(this, "uArrowPickScale", null);
    this.gl = n, this.lineProgram = this.compile(Kg, qg), this.linePickProgram = this.compile(Zg, Jg), this.arrowProgram = this.compile(ey, ty), this.arrowPickProgram = this.compile(ny, ry), this.initLineGeometry(), this.initArrowGeometry(), this.cacheUniforms();
  }
  compile(n, i) {
    const s = this.gl, a = this.makeShader(s.VERTEX_SHADER, n), d = this.makeShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    return s.attachShader(h, a), s.attachShader(h, d), s.linkProgram(h), h;
  }
  makeShader(n, i) {
    const s = this.gl, a = s.createShader(n);
    return s.shaderSource(a, i), s.compileShader(a), a;
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
      const p = h / i, y = h * 4;
      s[y] = p, s[y + 1] = -1, s[y + 2] = p, s[y + 3] = 1;
    }
    const a = n.createVertexArray();
    n.bindVertexArray(a);
    const d = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, d), n.bufferData(n.ARRAY_BUFFER, s, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.lineVao = a, this._lineVerts = (i + 1) * 2;
  }
  /** 箭头三角形：x∈[-1,0] 沿方向偏移, y=±0.5 垂直宽度 */
  initArrowGeometry() {
    const n = this.gl, i = new Float32Array([-0.6, -0.45, -0.6, 0.45, -0.01, 0]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const a = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, a), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.arrowVao = s;
  }
  /** Render link lines + arrows in two draw calls */
  render(n, i, s, a, d, h, p = !1, y = 0) {
    if (n.length === 0) return;
    const f = this.gl, k = n.length, _ = 12, x = new Float32Array(k), S = new Float32Array(k), N = /* @__PURE__ */ new Map();
    for (let A = 0; A < k; A++) {
      const D = n[A], j = `${D.sourceId ?? ""}|${D.targetId ?? ""}`;
      N.has(j) || N.set(j, []), N.get(j).push({ idx: A, link: D });
    }
    for (const [, A] of N) {
      const D = A.length;
      if (!(D <= 1)) {
        A.sort((j, $) => j.idx - $.idx);
        for (let j = 0; j < D; j++) {
          const { idx: $, link: ee } = A[j], ye = ee.targetX - ee.sourceX, oe = ee.targetY - ee.sourceY, le = Math.sqrt(ye * ye + oe * oe), se = le > 0.01 ? -oe / le : 1, K = le > 0.01 ? ye / le : 0;
          if (D % 2 === 1 && j === Math.floor(D / 2)) continue;
          let O, F;
          if (D % 2 === 1) {
            const q = Math.floor(D / 2);
            j < q ? (O = q - j - 1, F = 1) : (O = j - q - 1, F = -1);
          } else
            O = Math.floor(j / 2), F = j % 2 === 0 ? 1 : -1;
          const W = (O + 1) * _;
          x[$] = (ee.sourceX + ee.targetX) / 2 + se * F * W, S[$] = (ee.sourceY + ee.targetY) / 2 + K * F * W;
        }
      }
    }
    const b = new Float32Array(k * 2), m = new Float32Array(k * 2), C = new Float32Array(k * 2), R = new Float32Array(k * 4), X = new Float32Array(k), U = new Float32Array(k * 2), H = new Float32Array(k * 2), Y = new Float32Array(k);
    for (let A = 0; A < k; A++) {
      const D = n[A], j = D.targetRadius ?? 0;
      b[A * 2] = D.sourceX, b[A * 2 + 1] = D.sourceY, C[A * 2] = D.targetX, C[A * 2 + 1] = D.targetY;
      const $ = x[A], ee = S[A];
      $ === 0 && ee === 0 ? (m[A * 2] = (D.sourceX + D.targetX) / 2, m[A * 2 + 1] = (D.sourceY + D.targetY) / 2) : (m[A * 2] = $, m[A * 2 + 1] = ee);
      const ye = D.targetX - m[A * 2], oe = D.targetY - m[A * 2 + 1], le = Math.sqrt(ye * ye + oe * oe), se = le > 1e-3 ? ye / le : 1, K = le > 1e-3 ? oe / le : 0;
      U[A * 2] = D.targetX - se * j, U[A * 2 + 1] = D.targetY - K * j, R.set(D.color, A * 4), X[A] = D.width, H[A * 2] = ye, H[A * 2 + 1] = oe, Y[A] = D.arrowSize ?? Math.max(6, D.width * 16 + 4);
    }
    f.useProgram(this.lineProgram), f.uniform2f(this.uLineResolution, i, s), f.uniform2f(this.uLineTranslation, a, d), f.uniform1f(this.uLineScale, h), f.uniform1f(this.uLineZOffset, y), f.bindVertexArray(this.lineVao);
    for (let A = 0; A < k; A++)
      this.instancedSingle(1, b[A * 2], b[A * 2 + 1]), this.instancedSingle(2, m[A * 2], m[A * 2 + 1]), this.instancedSingle(3, C[A * 2], C[A * 2 + 1]), this.instancedSingle4(4, R, A * 4), this.instancedSingle1(5, X[A]), f.drawArraysInstanced(f.TRIANGLE_STRIP, 0, this._lineVerts, 1);
    for (let A = 1; A <= 5; A++) f.vertexAttribDivisor(A, 0);
    if (p) {
      f.useProgram(this.arrowProgram), f.uniform2f(this.uArrowResolution, i, s), f.uniform2f(this.uArrowTranslation, a, d), f.uniform1f(this.uArrowScale, h), f.bindVertexArray(this.arrowVao), f.disable(f.BLEND);
      for (let A = 0; A < k; A++)
        this.instancedSingle(1, U[A * 2], U[A * 2 + 1]), this.instancedSingle(2, H[A * 2], H[A * 2 + 1]), this.instancedSingle4(3, R, A * 4), this.instancedSingle1(4, Y[A]), f.drawArraysInstanced(f.TRIANGLES, 0, 3, 1);
      for (let A = 1; A <= 4; A++) f.vertexAttribDivisor(A, 0);
      f.enable(f.BLEND);
    }
    f.bindVertexArray(null);
  }
  /** Batch-render links for FBO picking (lines only, triangle strip) */
  renderPicking(n, i, s, a, d, h, p = 0, y = 0) {
    if (n.length === 0) return;
    const f = this.gl, k = n.length, _ = 12, x = new Float32Array(k), S = new Float32Array(k), N = /* @__PURE__ */ new Map();
    for (let U = 0; U < k; U++) {
      const H = n[U], Y = `${H.sourceId ?? ""}|${H.targetId ?? ""}`;
      N.has(Y) || N.set(Y, []), N.get(Y).push({ idx: U, link: H });
    }
    for (const [, U] of N) {
      const H = U.length;
      if (!(H <= 1)) {
        U.sort((Y, A) => Y.idx - A.idx);
        for (let Y = 0; Y < H; Y++) {
          const { idx: A, link: D } = U[Y], j = D.targetX - D.sourceX, $ = D.targetY - D.sourceY, ee = Math.sqrt(j * j + $ * $), ye = ee > 0.01 ? -$ / ee : 1, oe = ee > 0.01 ? j / ee : 0;
          if (H % 2 === 1 && Y === Math.floor(H / 2)) continue;
          let le, se;
          if (H % 2 === 1) {
            const O = Math.floor(H / 2);
            Y < O ? (le = O - Y - 1, se = 1) : (le = Y - O - 1, se = -1);
          } else
            le = Math.floor(Y / 2), se = Y % 2 === 0 ? 1 : -1;
          const K = (le + 1) * _;
          x[A] = (D.sourceX + D.targetX) / 2 + ye * se * K, S[A] = (D.sourceY + D.targetY) / 2 + oe * se * K;
        }
      }
    }
    f.useProgram(this.linePickProgram), f.uniform2f(this.uLinePickResolution, i, s), f.uniform2f(this.uLinePickTranslation, a, d), f.uniform1f(this.uLinePickScale, h), f.uniform1f(this.uLinePickZOffset, y), f.uniform1ui(this.uLinePickIdOffset, p), f.bindVertexArray(this.lineVao);
    const b = new Float32Array(k * 2), m = new Float32Array(k * 2), C = new Float32Array(k * 2), R = new Float32Array(k * 4), X = new Float32Array(k);
    for (let U = 0; U < k; U++) {
      const H = n[U], Y = H.sourceX, A = H.sourceY, D = H.targetX, j = H.targetY;
      b[U * 2] = Y, b[U * 2 + 1] = A, C[U * 2] = D, C[U * 2 + 1] = j;
      const $ = x[U], ee = S[U];
      $ === 0 && ee === 0 ? (m[U * 2] = (Y + D) / 2, m[U * 2 + 1] = (A + j) / 2) : (m[U * 2] = $, m[U * 2 + 1] = ee), X[U] = H.width + 8;
    }
    this.instancedAttrib(1, b, 2), this.instancedAttrib(2, m, 2), this.instancedAttrib(3, C, 2), this.instancedAttrib(4, R, 4), this.instancedAttrib(5, X, 1), f.drawArraysInstanced(f.TRIANGLE_STRIP, 0, this._lineVerts, k);
    for (let U = 1; U <= 5; U++) f.vertexAttribDivisor(U, 0);
    f.bindVertexArray(null);
  }
  instancedAttrib(n, i, s) {
    const a = this.gl, d = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, d), a.bufferData(a.ARRAY_BUFFER, i, a.DYNAMIC_DRAW), a.enableVertexAttribArray(n), a.vertexAttribPointer(n, s, a.FLOAT, !1, 0, 0), a.vertexAttribDivisor(n, 1);
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
    const a = this.gl, d = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, d), a.bufferData(a.ARRAY_BUFFER, i, a.DYNAMIC_DRAW), a.enableVertexAttribArray(n), a.vertexAttribPointer(n, s, a.FLOAT, !1, 0, 0), a.vertexAttribDivisor(n, 1);
  }
  destroy() {
    const n = this.gl;
    n.deleteProgram(this.lineProgram), n.deleteProgram(this.linePickProgram), n.deleteProgram(this.arrowProgram), n.deleteProgram(this.arrowPickProgram);
  }
}
class nv {
  constructor(n = 2048, i = 48, s = "sans-serif") {
    T(this, "canvas");
    T(this, "ctx");
    T(this, "texture", null);
    T(this, "entries", /* @__PURE__ */ new Map());
    T(this, "buf");
    T(this, "slotSize");
    T(this, "cursorX", 2);
    T(this, "cursorY", 2);
    T(this, "rowHeight", 0);
    T(this, "fontSize");
    T(this, "fontFamily");
    T(this, "dirty", !0);
    T(this, "charCanvas");
    T(this, "charCtx");
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
    const a = this.charCtx.measureText(n), d = this.canvas.width, h = this.canvas.height, p = {
      uv: [
        this.cursorX / d,
        this.cursorY / h,
        (this.cursorX + s) / d,
        (this.cursorY + s) / h
      ],
      pw: this.fontSize,
      ph: this.fontSize,
      advance: a.width
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
class rv {
  constructor(n, i = 2048, s = 48, a = 0) {
    T(this, "gl");
    T(this, "program");
    T(this, "atlas");
    T(this, "quadVao", null);
    T(this, "fontSize");
    /** 字符间距（世界像素），按图集字号计算 */
    T(this, "letterSpacing");
    T(this, "uResolution", null);
    T(this, "uTranslation", null);
    T(this, "uScale", null);
    T(this, "uZOffset", null);
    T(this, "uTexture", null);
    this.gl = n, this.fontSize = s, this.letterSpacing = Math.round(s * a), this.atlas = new nv(i, s), this.program = this.compile(iy, oy), this.initGeometry(), this.cacheUniforms();
  }
  compile(n, i) {
    const s = this.gl, a = this.makeShader(s.VERTEX_SHADER, n), d = this.makeShader(s.FRAGMENT_SHADER, i), h = s.createProgram();
    return s.attachShader(h, a), s.attachShader(h, d), s.linkProgram(h), h;
  }
  makeShader(n, i) {
    const s = this.gl, a = s.createShader(n);
    return s.shaderSource(a, i), s.compileShader(a), a;
  }
  cacheUniforms() {
    const n = this.gl;
    this.uResolution = n.getUniformLocation(this.program, "u_resolution"), this.uTranslation = n.getUniformLocation(this.program, "u_translation"), this.uScale = n.getUniformLocation(this.program, "u_scale"), this.uZOffset = n.getUniformLocation(this.program, "u_zOffset"), this.uTexture = n.getUniformLocation(this.program, "u_texture");
  }
  initGeometry() {
    const n = this.gl, i = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), s = n.createVertexArray();
    n.bindVertexArray(s);
    const a = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, a), n.bufferData(n.ARRAY_BUFFER, i, n.STATIC_DRAW), n.enableVertexAttribArray(0), n.vertexAttribPointer(0, 2, n.FLOAT, !1, 0, 0), n.bindVertexArray(null), this.quadVao = s;
  }
  /** 将节点标签展开为逐字符 quads */
  buildNodeLabels(n, i, s) {
    const a = [];
    if (i < s) return a;
    for (const d of n) {
      if (!d.label) continue;
      const h = d.textColor ?? [1, 1, 1, 1], p = (d.fontSize ?? this.fontSize) / this.fontSize, y = i;
      let f = d.x - this.measureWidth(d.label, p) / (2 * y);
      const k = d.radius * i, _ = Math.min(Math.max(k * 0.22, 4), 24) + 8, x = d.y + d.radius + _ / i;
      for (const S of d.label) {
        const N = this.atlas.getOrCreate(S);
        N && (a.push({
          x: f + N.advance * p / (2 * y),
          y: x,
          char: S,
          color: h,
          scale: p
        }), f += (N.advance + this.letterSpacing) * p / y);
      }
    }
    return a;
  }
  /** 估算标签世界宽度（乘以 fontSize 缩放 + 间距） */
  measureWidth(n, i) {
    let s = 0;
    for (const a of n) {
      const d = this.atlas.getOrCreate(a);
      d && (s += (d.advance + this.letterSpacing) * i);
    }
    return s;
  }
  buildLinkLabels(n, i, s) {
    const a = [];
    if (i < s) return a;
    for (const d of n) {
      if (!d.label) continue;
      const h = [0.55, 0.55, 0.65, 0.85], p = d.targetX - d.sourceX, y = d.targetY - d.sourceY;
      if (Math.sqrt(p * p + y * y) < 1) continue;
      const k = Math.atan2(y, p), _ = 0.375, x = d.label, S = i, N = this.measureWidth(x, _), b = (d.sourceX + d.targetX) / 2, m = (d.sourceY + d.targetY) / 2, C = N / (2 * S);
      let R = b - C * Math.cos(k), X = m - C * Math.sin(k);
      for (const U of x) {
        const H = this.atlas.getOrCreate(U);
        if (!H) continue;
        const Y = (H.advance + this.letterSpacing) * _ / S;
        a.push({
          x: R + Y / 2 * Math.cos(k),
          y: X + Y / 2 * Math.sin(k),
          char: U,
          color: h,
          scale: _,
          angle: k
        }), R += Y * Math.cos(k), X += Y * Math.sin(k);
      }
    }
    return a;
  }
  /** instanced 逐字符渲染 */
  render(n, i, s, a, d, h, p = 0) {
    const y = n.length;
    if (y === 0) return;
    const f = this.gl, k = this.atlas.getTexture(f);
    f.useProgram(this.program), f.uniform2f(this.uResolution, i, s), f.uniform2f(this.uTranslation, a, d), f.uniform1f(this.uScale, h), f.uniform1f(this.uZOffset, p), f.uniform1i(this.uTexture, 0), f.activeTexture(f.TEXTURE0), f.bindTexture(f.TEXTURE_2D, k), f.bindVertexArray(this.quadVao);
    const _ = new Float32Array(y * 2), x = new Float32Array(y * 2), S = new Float32Array(y * 4), N = new Float32Array(y * 2), b = new Float32Array(y * 2), m = new Float32Array(y);
    for (let C = 0; C < y; C++) {
      const R = n[C], X = this.atlas.getOrCreate(R.char);
      X && (_[C * 2] = R.x, _[C * 2 + 1] = R.y, x[C * 2] = X.pw * R.scale / h, x[C * 2 + 1] = X.ph * R.scale / h, S.set(R.color, C * 4), N[C * 2] = X.uv[0], N[C * 2 + 1] = X.uv[1], b[C * 2] = X.uv[2] - X.uv[0], b[C * 2 + 1] = X.uv[3] - X.uv[1], m[C] = R.angle ?? 0);
    }
    this.instancedAttrib(1, _, 2), this.instancedAttrib(2, x, 2), this.instancedAttrib(3, S, 4), this.instancedAttrib(4, N, 2), this.instancedAttrib(5, b, 2), this.instancedAttrib(6, m, 1), f.drawArraysInstanced(f.TRIANGLES, 0, 6, y);
    for (let C = 1; C <= 6; C++) f.vertexAttribDivisor(C, 0);
    f.bindVertexArray(null);
  }
  instancedAttrib(n, i, s) {
    const a = this.gl, d = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, d), a.bufferData(a.ARRAY_BUFFER, i, a.DYNAMIC_DRAW), a.enableVertexAttribArray(n), a.vertexAttribPointer(n, s, a.FLOAT, !1, 0, 0), a.vertexAttribDivisor(n, 1);
  }
  /** 预注册所有字符到图集（逐字符拆分） */
  preRegister(n) {
    const i = /* @__PURE__ */ new Set();
    for (const s of n)
      for (const a of s) i.add(a);
    for (const s of i) this.atlas.getOrCreate(s);
  }
  destroy() {
    this.gl.deleteProgram(this.program);
  }
}
function iv(c, n, i) {
  return Math.round(c * 255) << 16 | Math.round(n * 255) << 8 | Math.round(i * 255);
}
class ov {
  constructor(n) {
    T(this, "gl");
    T(this, "nodeRenderer");
    T(this, "linkRenderer");
    T(this, "pickFbo", null);
    T(this, "pickTexture", null);
    T(this, "pickDepth", null);
    T(this, "pickerWidth", 0);
    T(this, "pickerHeight", 0);
    T(this, "nodes", []);
    T(this, "links", []);
    /** 节点索引 → 节点 ID（解码用） */
    T(this, "nodeIds", []);
    /** 边的起始索引（nodeIds.length） */
    T(this, "linkOffset", 0);
    T(this, "linkIds", []);
    // 相机变换（需与主渲染同步）
    T(this, "tx", 0);
    T(this, "ty", 0);
    T(this, "k", 1);
    this.gl = n.gl, this.nodeRenderer = n.nodeRenderer, this.linkRenderer = n.linkRenderer, this.initFBO(n.width, n.height);
  }
  // ========== FBO 管理 ==========
  initFBO(n, i) {
    const s = this.gl, a = window.devicePixelRatio || 1;
    this.pickerWidth = n * a, this.pickerHeight = i * a, this.pickFbo = s.createFramebuffer(), this.pickTexture = s.createTexture(), s.bindTexture(s.TEXTURE_2D, this.pickTexture), s.texImage2D(
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
    const s = this.gl, a = window.devicePixelRatio || 1, d = n * a, h = i * a;
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
    const s = this.gl, a = window.devicePixelRatio || 1, d = this.pickerWidth, h = this.pickerHeight;
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
      d / a,
      h / a,
      this.tx,
      this.ty,
      this.k,
      this.linkOffset,
      0
      // zOffset = 0
    ), this.nodeRenderer.renderPicking(
      this.nodes,
      d / a,
      h / a,
      this.tx,
      this.ty,
      this.k,
      -0.5
    );
    const p = Math.round(n * a), y = Math.round(h - i * a), f = new Uint8Array(4);
    if (s.readPixels(p, y, 1, 1, s.RGBA, s.UNSIGNED_BYTE, f), s.bindFramebuffer(s.FRAMEBUFFER, null), f[3] === 0) return null;
    const k = iv(
      f[0] / 255,
      f[1] / 255,
      f[2] / 255
    );
    if (k >= 0 && k < this.linkOffset)
      return { type: "node", id: this.nodeIds[k] };
    const _ = k - this.linkOffset;
    return _ >= 0 && _ < this.linkIds.length ? { type: "link", id: this.linkIds[_] } : null;
  }
  destroy() {
    const n = this.gl;
    n.deleteFramebuffer(this.pickFbo), n.deleteTexture(this.pickTexture), n.deleteRenderbuffer(this.pickDepth);
  }
}
function sv(c, n, i, s, a) {
  return Math.sqrt(c * c + n * n) - i;
}
class lv {
  constructor() {
    /** 相机变换（由 WebGLRenderer 每帧同步） */
    T(this, "tx", 0);
    T(this, "ty", 0);
    T(this, "k", 1);
    T(this, "nodes", []);
    T(this, "links", []);
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
    const s = n / this.k - this.tx, a = i / this.k - this.ty;
    for (let d = this.nodes.length - 1; d >= 0; d--) {
      const h = this.nodes[d], p = s - h.x, y = a - h.y;
      if (Al(h.shape), h.shapeParam, sv(p, y, h.radius + h.strokeWidth) <= 2)
        return { type: "node", id: h.id };
    }
    for (let d = this.links.length - 1; d >= 0; d--) {
      const h = this.links[d], p = h.sourceX, y = h.sourceY, f = h.targetX, k = h.targetY, _ = f - p, x = k - y, S = _ * _ + x * x;
      if (S < 1e-4) continue;
      let N = ((s - p) * _ + (a - y) * x) / S;
      N = Math.max(0, Math.min(1, N));
      const b = p + N * _, m = y + N * x;
      if (Math.sqrt((s - b) ** 2 + (a - m) ** 2) <= (h.width + 4) / this.k)
        return { type: "link", id: h.id };
    }
    return null;
  }
}
class av {
  constructor(n) {
    T(this, "name", "default");
    T(this, "gl");
    T(this, "nodeRenderer");
    T(this, "linkRenderer");
    T(this, "labelRenderer");
    T(this, "iconAtlas", new Jy());
    T(this, "picker");
    T(this, "plusBadgeLayer");
    // 缓存
    T(this, "nodes", []);
    T(this, "links", []);
    T(this, "labels", []);
    this.gl = n.gl, this.nodeRenderer = new ev(n.gl), this.linkRenderer = new tv(n.gl), this.labelRenderer = new rv(
      n.gl,
      2048,
      n.labelFontSize
    ), (n.pickerMode ?? "gpu") === "cpu" ? this.picker = new lv() : this.picker = new ov({
      gl: n.gl,
      nodeRenderer: this.nodeRenderer,
      linkRenderer: this.linkRenderer,
      width: n.width,
      height: n.height
    }), this.plusBadgeLayer = new cy({
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
    const s = n.map((a) => a.label).filter(Boolean);
    s.push(...i.map((a) => a.label).filter(Boolean)), this.labelRenderer.preRegister(s);
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
      const a = s.radius * (s.plusOffsetX ?? 0.5), d = s.radius * (s.plusOffsetY ?? -0.5);
      i.push({
        x: s.x + a,
        y: s.y + d,
        radius: s.radius * (s.plusScale ?? 0.35),
        nodeId: s.id
      });
    }
    this.plusBadgeLayer.updateBadges(i);
  }
}
class uv {
  constructor(n) {
    T(this, "nodes", []);
    T(this, "links", []);
    T(this, "rootId");
    T(this, "levelGap");
    T(this, "siblingGap");
    T(this, "maxDepth");
    T(this, "onTick");
    T(this, "onEnd");
    this.rootId = n == null ? void 0 : n.rootId, this.levelGap = (n == null ? void 0 : n.levelGap) ?? 180, this.siblingGap = (n == null ? void 0 : n.siblingGap) ?? 70, this.maxDepth = (n == null ? void 0 : n.maxDepth) ?? 6;
  }
  setData(n, i) {
    this.nodes = n, this.links = i;
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
    var y, f, k;
    const n = /* @__PURE__ */ new Map();
    for (const _ of this.nodes) n.set(_.id, _);
    const i = /* @__PURE__ */ new Map(), s = (_) => {
      let x = i.get(_);
      return x || (x = /* @__PURE__ */ new Set(), i.set(_, x)), x;
    };
    for (const _ of this.links) {
      const x = String(typeof _.source == "object" ? _.source.id : _.source), S = String(typeof _.target == "object" ? _.target.id : _.target);
      s(x).add(S), s(S).add(x);
    }
    const a = this.rootId && n.has(this.rootId) ? this.rootId : (y = this.nodes[0]) == null ? void 0 : y.id, d = [], h = /* @__PURE__ */ new Set();
    if (a !== void 0 && n.has(a)) {
      let _ = [a], x = 0;
      for (h.add(a), d[0] = [a]; _.length > 0 && x < this.maxDepth; ) {
        const S = [];
        for (const N of _)
          for (const b of i.get(N) ?? [])
            h.has(b) || (h.add(b), d[x + 1] || (d[x + 1] = []), d[x + 1].push(b), S.push(b));
        _ = S, x += 1;
      }
    }
    const p = this.nodes.filter((_) => !h.has(_.id)).map((_) => _.id);
    if (p.length > 0) {
      const _ = d.length;
      d[_] = p;
      for (const x of p) h.add(x);
    }
    for (let _ = 0; _ < d.length; _++) {
      const x = d[_], S = x.length;
      for (let N = 0; N < S; N++) {
        const b = n.get(x[N]);
        b && (b.x = (N - (S - 1) / 2) * this.siblingGap, b.y = _ * this.levelGap, b.vx = 0, b.vy = 0);
      }
    }
    (f = this.onTick) == null || f.call(this, this.nodes), (k = this.onEnd) == null || k.call(this);
  }
}
function Xc(c, n, i) {
  const s = new Blob([n], { type: i }), a = URL.createObjectURL(s), d = document.createElement("a");
  d.href = a, d.download = c, d.click(), URL.revokeObjectURL(a);
}
function cv(c, n, i) {
  const s = c.getGraphModelData().graphData, a = s.nodes.filter((k) => n.has(k.id)), d = new Set(a.map((k) => k.id)), h = s.links.filter((k) => {
    const _ = String(typeof k.source == "object" ? k.source.id : k.source), x = String(typeof k.target == "object" ? k.target.id : k.target);
    return d.has(_) && d.has(x);
  });
  if (i === "json") {
    Xc(
      "selection.json",
      JSON.stringify({ nodes: a, links: h }, null, 2),
      "application/json"
    );
    return;
  }
  const p = [
    "id",
    "label",
    "nodeType",
    "clusterId",
    "gender",
    "age",
    "caseWeight"
  ], y = (k) => `"${String(k ?? "").replace(/"/g, '""')}"`, f = a.map((k) => {
    const _ = k.data ?? {};
    return [
      k.id,
      _.label,
      _.nodeType,
      _.clusterId,
      _.gender,
      _.age,
      _.caseWeight
    ].map(y).join(",");
  });
  Xc("selection.csv", [p.join(","), ...f].join(`
`), "text/csv");
}
function dv(c, n = 300) {
  const i = L.useRef(), s = L.useRef(c);
  return s.current = c, L.useEffect(() => () => {
    i.current && clearTimeout(i.current);
  }, []), L.useCallback(
    (...a) => {
      i.current && clearTimeout(i.current), i.current = setTimeout(() => s.current(...a), n);
    },
    [n]
  );
}
const hv = {
  padding: "4px 8px",
  fontSize: "13px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  outline: "none",
  width: 180,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, fv = {
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
}, pv = {
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "monospace",
  color: "rgb(var(--foreground))",
  borderBottom: "1px solid rgb(var(--border))"
}, gv = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备"
};
function yv({ onSelect: c }) {
  const [n, i] = L.useState(""), [s, a] = L.useState(!1), [d, h] = L.useState(-1), p = L.useRef(null), y = L.useRef(null), { data: f, run: k, reset: _ } = ad(), x = dv((m) => {
    const C = m.trim();
    if (!C) {
      _(), a(!1), h(-1);
      return;
    }
    k(async (R) => (await oi.search(C, 10, R)).nodes ?? []).then((R) => {
      a(!!(R != null && R.length)), h(R != null && R.length ? 0 : -1);
    });
  }, 300), S = (m) => {
    i(m), x(m);
  }, N = (m) => {
    const C = f ?? [];
    m.key === "ArrowDown" ? (m.preventDefault(), s && C.length > 0 && h((R) => (R + 1) % C.length)) : m.key === "ArrowUp" ? (m.preventDefault(), s && C.length > 0 && h((R) => R <= 0 ? C.length - 1 : R - 1)) : m.key === "Enter" ? (m.preventDefault(), s && C.length > 0 && d >= 0 && b(C[d].id)) : m.key === "Escape" && a(!1);
  };
  L.useEffect(() => {
    const m = (C) => {
      p.current && !p.current.contains(C.target) && a(!1);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, []), L.useEffect(() => {
    const m = y.current;
    if (!m || d < 0) return;
    const C = m.children[d];
    C == null || C.scrollIntoView({ block: "nearest" });
  }, [d]);
  const b = (m) => {
    i(""), _(), a(!1), h(-1), c(m);
  };
  return /* @__PURE__ */ v.jsxs("div", { ref: p, style: { position: "relative" }, children: [
    /* @__PURE__ */ v.jsx(
      "input",
      {
        placeholder: "搜索节点...",
        value: n,
        onChange: (m) => S(m.target.value),
        onKeyDown: N,
        onFocus: () => ((f == null ? void 0 : f.length) ?? 0) > 0 && a(!0),
        style: hv
      }
    ),
    s && f && f.length > 0 && /* @__PURE__ */ v.jsx("div", { ref: y, style: fv, children: f.map((m, C) => {
      var R, X, U;
      return /* @__PURE__ */ v.jsxs(
        "div",
        {
          style: {
            ...pv,
            background: C === d ? "rgb(var(--hover))" : "transparent"
          },
          onClick: () => b(m.id),
          onMouseEnter: () => h(C),
          children: [
            /* @__PURE__ */ v.jsx("span", { style: { color: "#1976d2", fontWeight: "bold" }, children: ((R = m.data) == null ? void 0 : R.label) ?? m.id }),
            /* @__PURE__ */ v.jsx("span", { style: { color: "rgb(var(--muted))", marginLeft: 6 }, children: gv[((X = m.data) == null ? void 0 : X.nodeType) ?? ""] ?? ((U = m.data) == null ? void 0 : U.nodeType) })
          ]
        },
        m.id
      );
    }) })
  ] });
}
const vv = {
  position: "absolute",
  top: 8,
  left: 8,
  right: 8,
  padding: "5px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
  background: "rgb(var(--background) / 0.72)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgb(var(--border-strong) / 0.5)",
  borderRadius: 10,
  boxShadow: "0 6px 24px rgb(0 0 0 / 0.18)",
  color: "rgb(var(--foreground))"
}, Ke = {
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
function mv({
  historyManagerRef: c,
  onFitView: n,
  onToggleSnapshotPanel: i,
  onToggleLegend: s,
  onToggleMiniMap: a,
  onUndo: d,
  onRedo: h,
  onSearchSelect: p,
  onAnalyze: y,
  timePanelOpen: f,
  filterPanelOpen: k,
  tablePanelOpen: _,
  onToggleTimePanel: x,
  onToggleFilterPanel: S,
  onToggleTablePanel: N,
  onExportJSON: b,
  onExportCSV: m,
  treeMode: C,
  onToggleTreeLayout: R
}) {
  var F, W;
  const { zIndex: X } = Jc({ id: "toolbar", layer: Mt.Toolbar }), {
    snapshotPanelOpen: U,
    legendPanelOpen: H,
    miniMapOpen: Y,
    analysisPanelOpen: A,
    selectedNodeIds: D,
    selectionMode: j,
    // 当前选取模式
    selectedSelectionMode: $,
    // 当前候选的框选类型
    activateRectMode: ee,
    activatePolygonMode: ye,
    deactivateSelectionMode: oe
  } = Kt(), le = ((F = c.current) == null ? void 0 : F.canGoBackSkipType("snapshot")) ?? !1, se = ((W = c.current) == null ? void 0 : W.canGoForwardSkipType("snapshot")) ?? !1, { theme: K, toggle: O } = _o();
  return /* @__PURE__ */ v.jsxs("div", { style: { ...vv, zIndex: X }, children: [
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: d,
        style: Ke,
        title: "回退",
        disabled: !le,
        children: /* @__PURE__ */ v.jsx(mp, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: h,
        style: Ke,
        title: "恢复",
        disabled: !se,
        children: /* @__PURE__ */ v.jsx(ip, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx("button", { onClick: n, style: Ke, title: "Fit View", children: /* @__PURE__ */ v.jsx(Xf, { size: 14 }) }),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: i,
        style: {
          ...Ke,
          background: U ? "rgba(233,69,96,0.25)" : "transparent",
          border: U ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "快照管理",
        children: /* @__PURE__ */ v.jsx(If, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: s,
        style: {
          ...Ke,
          background: H ? "rgba(233,69,96,0.25)" : "transparent",
          border: H ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "图例",
        children: /* @__PURE__ */ v.jsx(Lf, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: a,
        style: {
          ...Ke,
          background: Y ? "rgba(233,69,96,0.25)" : "transparent",
          border: Y ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "小地图",
        children: /* @__PURE__ */ v.jsx(Vf, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx("span", { style: { fontSize: "11px", color: "#999", margin: "0 2px" }, children: "|" }),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: x,
        style: {
          ...Ke,
          background: f ? "rgba(233,69,96,0.25)" : "transparent",
          border: f ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "时间线回放",
        children: /* @__PURE__ */ v.jsx(nd, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: S,
        style: {
          ...Ke,
          background: k ? "rgba(233,69,96,0.25)" : "transparent",
          border: k ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "属性过滤",
        children: /* @__PURE__ */ v.jsx(Bf, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: N,
        style: {
          ...Ke,
          background: _ ? "rgba(233,69,96,0.25)" : "transparent",
          border: _ ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "表格视图",
        children: /* @__PURE__ */ v.jsx(id, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx("span", { style: { fontSize: "11px", color: "#999", margin: "0 2px" }, children: "|" }),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: oe,
        style: {
          ...Ke,
          background: j ? "transparent" : "#0066ff50",
          border: j ? "1px solid #ccc" : "1px solid #0066ff"
        },
        title: "默认模式",
        children: /* @__PURE__ */ v.jsx(Kf, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: ee,
        style: {
          ...Ke,
          background: $ === "rect" ? "rgba(230,126,0,0.15)" : "transparent",
          border: $ === "rect" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "矩形框选 (默认，按下 Shift 激活)",
        children: /* @__PURE__ */ v.jsx(fp, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: ye,
        style: {
          ...Ke,
          background: $ === "polygon" ? "rgba(230,126,0,0.15)" : "transparent",
          border: $ === "polygon" ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: "多边形框选 (按下 Shift 激活)",
        children: /* @__PURE__ */ v.jsx(ep, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx("div", { style: { flex: 1 } }),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: y,
        disabled: D.size === 0,
        style: {
          ...Ke,
          background: A ? "rgba(233,69,96,0.25)" : "transparent",
          border: A ? "1px solid #e94560" : "1px solid #0f3460"
        },
        title: "分析",
        children: /* @__PURE__ */ v.jsx(td, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsxs(
      "button",
      {
        onClick: b,
        disabled: D.size === 0,
        style: Ke,
        title: "导出选中子图 JSON",
        children: [
          /* @__PURE__ */ v.jsx(Ac, { size: 13 }),
          /* @__PURE__ */ v.jsx("span", { style: { fontSize: "10px" }, children: "JSON" })
        ]
      }
    ),
    /* @__PURE__ */ v.jsxs(
      "button",
      {
        onClick: m,
        disabled: D.size === 0,
        style: Ke,
        title: "导出选中节点 CSV",
        children: [
          /* @__PURE__ */ v.jsx(Ac, { size: 13 }),
          /* @__PURE__ */ v.jsx("span", { style: { fontSize: "10px" }, children: "CSV" })
        ]
      }
    ),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: R,
        style: {
          ...Ke,
          background: C ? "rgba(230,126,0,0.15)" : "transparent",
          border: C ? "1px solid #e67e00" : "1px solid #ccc"
        },
        title: C ? "切回力导向布局" : "树形布局（以选中节点为根）",
        children: /* @__PURE__ */ v.jsx(Wf, { size: 14 })
      }
    ),
    /* @__PURE__ */ v.jsx(up, { size: 14, style: { color: "rgb(var(--muted))" } }),
    /* @__PURE__ */ v.jsx(yv, { onSelect: p }),
    /* @__PURE__ */ v.jsx(
      "button",
      {
        onClick: O,
        style: Ke,
        title: K === "dark" ? "切换到亮色主题" : "切换到暗色主题",
        children: K === "dark" ? /* @__PURE__ */ v.jsx(gp, { size: 14 }) : /* @__PURE__ */ v.jsx(Gf, { size: 14 })
      }
    )
  ] });
}
const xv = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 100
};
function kv() {
  const {
    selectionMode: c,
    rect: n,
    polygon: i,
    isShiftDown: s,
    isNearFirstVertex: a,
    getCanvasPos: d,
    startRect: h,
    updateRect: p,
    finishRect: y,
    addPolygonVertex: f,
    updatePolygonCursor: k,
    finishPolygon: _
  } = Kt(), x = L.useRef(null), S = L.useRef(!1), N = L.useRef(!1), b = s && c !== null, m = L.useCallback(
    (j) => {
      const { x: $, y: ee } = d(j.clientX, j.clientY);
      if (c === "rect") {
        S.current = !0, h($, ee), j.preventDefault(), j.stopPropagation();
        return;
      }
      if (c === "polygon") {
        if (i && i.vertices.length >= 2 && a($, ee)) {
          N.current = !0, _(), j.preventDefault(), j.stopPropagation();
          return;
        }
        f($, ee), j.preventDefault(), j.stopPropagation();
        return;
      }
    },
    [
      d,
      c,
      h,
      i,
      a,
      _,
      f
    ]
  ), C = L.useCallback(
    (j) => {
      const { x: $, y: ee } = d(j.clientX, j.clientY);
      if (c === "rect" && S.current) {
        p($, ee), j.preventDefault(), j.stopPropagation();
        return;
      }
      if (c === "polygon") {
        k($, ee), j.preventDefault(), j.stopPropagation();
        return;
      }
    },
    [d, c, p, k]
  ), R = L.useCallback(
    (j) => {
      if (N.current) {
        N.current = !1, j.preventDefault(), j.stopPropagation();
        return;
      }
      if (S.current) {
        S.current = !1, y(), j.preventDefault(), j.stopPropagation();
        return;
      }
    },
    [y]
  ), X = L.useCallback(
    (j) => {
      c === "polygon" && i && i.vertices.length >= 2 && (_(), j.preventDefault(), j.stopPropagation());
    },
    [c, i, _]
  ), U = n ? Math.abs(n.x2 - n.x1) : 0, H = n ? Math.abs(n.y2 - n.y1) : 0, Y = n ? Math.min(n.x1, n.x2) : 0, A = n ? Math.min(n.y1, n.y2) : 0, D = i && i.vertices.length > 0 ? i.vertices.map((j) => `${j.x},${j.y}`).join(" ") : "";
  return /* @__PURE__ */ v.jsx(
    "div",
    {
      ref: x,
      style: {
        ...xv,
        pointerEvents: b ? "auto" : "none"
      },
      onPointerDown: m,
      onPointerMove: C,
      onPointerUp: R,
      onDoubleClick: X,
      children: /* @__PURE__ */ v.jsxs(
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
            n && /* @__PURE__ */ v.jsx(v.Fragment, { children: /* @__PURE__ */ v.jsx(
              "rect",
              {
                x: Y,
                y: A,
                width: U,
                height: H,
                fill: "rgba(0, 102, 255, 0.08)",
                stroke: "#0066ff",
                strokeWidth: 1.5,
                strokeDasharray: "6 3"
              }
            ) }),
            i && i.vertices.length > 0 && /* @__PURE__ */ v.jsxs(v.Fragment, { children: [
              i.vertices.length >= 3 && /* @__PURE__ */ v.jsx(
                "polygon",
                {
                  points: D,
                  fill: "rgba(0, 102, 255, 0.06)",
                  stroke: "none"
                }
              ),
              /* @__PURE__ */ v.jsx(
                "polyline",
                {
                  points: D,
                  fill: "none",
                  stroke: "#0066ff",
                  strokeWidth: 1.5,
                  strokeLinejoin: "round",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ v.jsx(
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
              i.vertices.map((j, $) => /* @__PURE__ */ v.jsx(
                "circle",
                {
                  cx: j.x,
                  cy: j.y,
                  r: 4,
                  fill: $ === 0 ? "#0066ff" : "#fff",
                  stroke: "#0066ff",
                  strokeWidth: 1.5
                },
                $
              ))
            ] })
          ]
        }
      )
    }
  );
}
function Sv(c, n, i, s = 350) {
  const a = c.x, d = c.y, h = performance.now(), p = (f) => 1 - Math.pow(1 - f, 3), y = (f) => {
    const k = Math.min(1, (f - h) / s), _ = p(k);
    c.x = a + (n - a) * _, c.y = d + (i - d) * _, k < 1 && requestAnimationFrame(y);
  };
  requestAnimationFrame(y);
}
function wv({
  modelRef: c,
  viewRef: n,
  onAnalyze: i
}) {
  const { selectedNodeIds: s } = Kt();
  if (s.size === 0) return null;
  const a = () => {
    const h = n.current;
    if (!h) return;
    const p = h.renderer.backend, y = p.nodes.filter((R) => s.has(R.id));
    if (!y.length) return;
    let f = 1 / 0, k = 1 / 0, _ = -1 / 0, x = -1 / 0;
    for (const R of y)
      f = Math.min(f, R.x - R.radius), k = Math.min(k, R.y - R.radius), _ = Math.max(_, R.x + R.radius), x = Math.max(x, R.y + R.radius);
    const S = p.canvas.clientWidth, N = p.canvas.clientHeight;
    if (S <= 0 || N <= 0) return;
    const b = p.interaction.transform, m = (f + _) / 2, C = (k + x) / 2;
    Sv(b, S / (2 * b.k) - m, N / (2 * b.k) - C, 350);
  }, d = () => {
    const h = c.current;
    h && h.stateManager.setSelectedNodes([]);
  };
  return /* @__PURE__ */ v.jsxs(
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
        /* @__PURE__ */ v.jsxs("span", { children: [
          "已选 ",
          s.size,
          " 个节点"
        ] }),
        /* @__PURE__ */ v.jsx(
          "span",
          {
            style: { width: 1, height: 16, background: "rgb(var(--background))" }
          }
        ),
        /* @__PURE__ */ v.jsxs("button", { onClick: i, style: wl, title: "分析选中（通话圈等）", children: [
          /* @__PURE__ */ v.jsx(td, { size: 13 }),
          " 分析"
        ] }),
        /* @__PURE__ */ v.jsxs("button", { onClick: a, style: wl, title: "聚焦选中节点", children: [
          /* @__PURE__ */ v.jsx(lp, { size: 13 }),
          " 聚焦"
        ] }),
        /* @__PURE__ */ v.jsx(
          "span",
          {
            style: { width: 1, height: 16, background: "rgb(var(--background))" }
          }
        ),
        /* @__PURE__ */ v.jsx("button", { onClick: d, style: wl, title: "关闭（清空选择）", children: /* @__PURE__ */ v.jsx(kp, { size: 13 }) })
      ]
    }
  );
}
const wl = {
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
}, Yc = {
  nodeTypes: /* @__PURE__ */ new Set(),
  gender: null,
  minWeight: null,
  maxWeight: null
};
function _v(c) {
  const [n, i] = L.useState(0), [s, a] = L.useState({
    min: 0,
    max: 0,
    hasTime: !1
  }), [d, h] = L.useState(0), [p, y] = L.useState(!1), [f, k] = L.useState(!1), [_, x] = L.useState(Yc), S = L.useRef(0);
  L.useEffect(() => {
    const A = c.current;
    if (A)
      return A.events.subscribe("dataChange", () => i((D) => D + 1));
  }, [c]);
  const N = L.useMemo(() => {
    const A = c.current;
    return A ? A.getGraphModelData().graphData : { nodes: [], links: [] };
  }, [c, n]);
  L.useEffect(() => {
    var j;
    let A = 1 / 0, D = -1 / 0;
    for (const $ of N.links) {
      const ee = Date.parse((j = $.data) == null ? void 0 : j.time);
      Number.isNaN(ee) || (A = Math.min(A, ee), D = Math.max(D, ee));
    }
    Number.isFinite(A) && Number.isFinite(D) && A < D ? (a({ min: A, max: D, hasTime: !0 }), h(
      ($) => Number.isFinite($) && $ >= A && $ <= D ? $ : D
    )) : a(($) => $.hasTime ? { min: 0, max: 0, hasTime: !1 } : $);
  }, [N]);
  const b = L.useMemo(() => {
    var D;
    const A = /* @__PURE__ */ new Map();
    for (const j of N.nodes) {
      const $ = ((D = j.data) == null ? void 0 : D.nodeType) ?? "default";
      A.set($, (A.get($) ?? 0) + 1);
    }
    return A;
  }, [N]), m = L.useCallback(
    (A, D, j) => {
      var K;
      const $ = c.current;
      if (!$) return;
      const ee = $.getGraphModelData().graphData, ye = /* @__PURE__ */ new Set(), oe = /* @__PURE__ */ new Set();
      if (A !== null && j.hasTime)
        for (const O of ee.links) {
          const F = Date.parse((K = O.data) == null ? void 0 : K.time);
          !Number.isNaN(F) && F > A && ye.add(O.id);
        }
      if (D.nodeTypes.size > 0 || D.gender !== null || D.minWeight !== null || D.maxWeight !== null) {
        for (const O of ee.nodes) {
          const F = O.data ?? {};
          let W = !0;
          D.nodeTypes.size > 0 && !D.nodeTypes.has(F.nodeType ?? "default") && (W = !1), W && D.gender !== null && F.gender !== void 0 && F.gender !== D.gender && (W = !1), W && D.minWeight !== null && F.caseWeight !== void 0 && (F.caseWeight ?? 0) < D.minWeight && (W = !1), W && D.maxWeight !== null && F.caseWeight !== void 0 && (F.caseWeight ?? 0) > D.maxWeight && (W = !1), W || oe.add(O.id);
        }
        if (oe.size > 0)
          for (const O of ee.links) {
            const F = String(
              typeof O.source == "object" ? O.source.id : O.source
            ), W = String(
              typeof O.target == "object" ? O.target.id : O.target
            );
            (oe.has(F) || oe.has(W)) && ye.add(O.id);
          }
      }
      $.stateManager.setHiddenNodes([...oe], [...ye]);
    },
    [c]
  ), C = L.useCallback(
    (A) => {
      h(A), p && m(A, _, s);
    },
    [p, _, s, m]
  ), R = L.useCallback(() => {
    y((A) => {
      const D = !A;
      return m(D ? d : null, _, s), D;
    });
  }, [d, _, s, m]);
  L.useEffect(() => {
    if (!f || !p || !s.hasTime) return;
    const A = (s.max - s.min) / 240;
    let D = d;
    const j = () => {
      if (D = Math.min(s.max, D + A), h(D), m(D, _, s), D >= s.max) {
        k(!1);
        return;
      }
      S.current = requestAnimationFrame(j);
    };
    return S.current = requestAnimationFrame(j), () => cancelAnimationFrame(S.current);
  }, [f, p, s, _, m, d]);
  const X = L.useCallback(
    (A, D) => {
      x((j) => {
        const $ = new Set(j.nodeTypes);
        D ? $.add(A) : $.delete(A);
        const ee = { ...j, nodeTypes: $ };
        return m(p ? d : null, ee, s), ee;
      });
    },
    [p, d, s, m]
  ), U = L.useCallback(
    (A) => {
      x((D) => {
        const j = { ...D, ...A };
        return Array.isArray(A.nodeTypes) && (j.nodeTypes = new Set(A.nodeTypes)), m(p ? d : null, j, s), j;
      });
    },
    [p, d, s, m]
  ), H = L.useCallback(() => {
    k(!1), y(!1), h(s.hasTime ? s.max : 0), x(Yc);
    const A = c.current;
    A && A.stateManager.setHiddenNodes([], []);
  }, [s, c]), Y = p || _.nodeTypes.size > 0 || _.gender !== null || _.minWeight !== null || _.maxWeight !== null;
  return {
    timeRange: s,
    timeValue: d,
    timeActive: p,
    playing: f,
    setPlaying: k,
    attrFilter: _,
    typeStats: b,
    onTimeChange: C,
    toggleTime: R,
    toggleNodeType: X,
    updateAttrFilter: U,
    resetFilters: H,
    hasActiveFilter: Y
  };
}
function Tv(c, n = {}) {
  const [i, s] = L.useState(null), [a, d] = L.useState(null), [h, p] = L.useState(/* @__PURE__ */ new Set());
  L.useEffect(() => {
    const f = c.current;
    if (!f) return;
    const k = f.events.subscribe("nodeHover", (m) => {
      s(m), m && d(null);
    }), _ = f.events.subscribe("linkHover", ({ link: m }) => {
      d(m), m && s(null);
    }), x = f.events.subscribe("plusToolClick", (m) => {
      var C;
      m && ((C = n.onPlusToolClick) == null || C.call(n, m));
    }), S = f.events.subscribe("nodeRightClick", (m) => {
      var C;
      m && ((C = n.onNodeContextMenu) == null || C.call(
        n,
        m.node,
        m.screenPos.x,
        m.screenPos.y
      ));
    }), N = f.events.subscribe("nodeClick", ({ node: m, ctrlKey: C }) => {
      m && (console.log("[nodeClick]", m.id), p((R) => {
        const X = new Set(R);
        return C ? X.has(m.id) ? X.delete(m.id) : X.add(m.id) : (X.clear(), X.add(m.id)), X;
      }));
    }), b = f.events.subscribe("selectionChange", ({ nodeIds: m }) => {
      p((C) => {
        const R = new Set(m);
        return C.size === R.size && [...C].every((X) => R.has(X)) ? C : R;
      });
    });
    return () => {
      k(), _(), x(), S(), N(), b();
    };
  }, [c.current]);
  const y = [...h];
  return L.useEffect(() => {
    const f = c.current;
    f && f.stateManager.setSelectedNodes(y, []);
  }, [c.current, y.join(",")]), {
    ctx: {
      hoveredNode: i,
      setHoveredNode: s,
      hoveredLink: a,
      setHoveredLink: d,
      selectedNodeIds: h,
      setSelectedNodeIds: p
    }
  };
}
function Cv(c, n) {
  const [i, s] = L.useState(null), [a, d] = L.useState(!1), [h, p] = L.useState(null);
  return L.useEffect(() => {
    const f = (k) => {
      const _ = k.target;
      (_ === c.current || _.tagName === "CANVAS") && s(null);
    };
    return document.addEventListener("click", f), () => document.removeEventListener("click", f);
  }, []), L.useEffect(() => {
    const f = (k) => {
      k.key === "Escape" && s(null);
    };
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []), {
    handleRuleExpand: L.useCallback(
      async (f, k, _) => {
        s(null);
        const x = n.current;
        if (!x) return;
        d(!0);
        const S = (N) => {
          const b = (N == null ? void 0 : N.message) ?? String(N);
          console.error("[ExpandError]", b), p(b), setTimeout(() => p(null), 5e3);
        };
        try {
          _ && await x.expand(f, JSON.stringify(_)).catch(S);
        } finally {
          d(!1);
        }
      },
      []
    ),
    ctx: { ruleMenu: i, setRuleMenu: s, expanding: a, runtimeError: h }
  };
}
function bv(c, n, i = "#2c2c2c") {
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
      bgColor: c,
      strokeColor: n,
      textColor: i,
      radius: 8,
      strokeWidth: 2,
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
function _n(c, n, i) {
  var p;
  const s = fr(i), a = s.node[c] ?? s.node.default, d = bv(a.bg, a.stroke, s.text), h = ((p = n.data) == null ? void 0 : p.weight) ?? 1;
  return {
    ...d,
    regular: { ...d.regular, radius: h * 8 },
    selected: { ...d.selected, radius: h * 8 },
    hovered: { ...d.hovered, radius: h * 8 }
  };
}
function Ev(c, n) {
  return _n("default", c, n);
}
function Pv(c, n) {
  return _n("person", c, n);
}
function Nv(c, n) {
  return _n("phone", c, n);
}
function Av(c, n) {
  return _n("address", c, n);
}
function Mv(c, n) {
  return _n("account", c, n);
}
function Rv(c, n) {
  return _n("company", c, n);
}
function Lv(c, n) {
  return _n("ip", c, n);
}
function Dv(c, n) {
  return _n("device", c, n);
}
function Iv(c) {
  const n = fr(c).link;
  return {
    regular: { color: n.default, strokeWidth: 1.2, opacity: 0.8, arrowSize: 8 },
    hovered: { color: n.hovered, strokeWidth: 2, opacity: 1 },
    highlighted: { color: n.highlighted, strokeWidth: 2, opacity: 1 },
    selected: { color: n.selected, strokeWidth: 2, opacity: 1 },
    hidden: { color: n.hidden, strokeWidth: 0.8, opacity: 0.1 }
  };
}
class Fv {
  constructor(n) {
    T(this, "model");
    T(this, "metadataManager");
    T(this, "loadingManager");
    T(this, "historyManager");
    T(this, "fetcher");
    /** 可选：获取快照额外上下文（相机、状态等） */
    T(this, "getContext");
    this.model = n.model, this.metadataManager = n.metadataManager, this.loadingManager = n.loadingManager, this.historyManager = n.historyManager, this.fetcher = n.fetcher, this.getContext = n.getContext;
  }
  async expand(n, i) {
    var s;
    this.loadingManager.model.startLoading(n, { message: "拓出中..." });
    try {
      const a = this.model.getGraphModelData().graphData, d = await this.fetcher({
        sourceNodeId: n,
        ruleId: "__custom__",
        existingNodeIds: a.nodes.map((y) => y.id),
        existingLinkIds: a.links.map((y) => y.id),
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
    } catch (a) {
      throw console.error(`[Expand] Failed for node ${n}:`, a), a;
    } finally {
      this.loadingManager.model.stopLoading(n);
    }
  }
  mergeExpansionData(n) {
    const i = this.model.getGraphModelData().graphData, s = new Set(i.nodes.map((p) => p.id)), a = new Set(i.links.map((p) => p.id)), d = [];
    for (const p of n.nodes)
      s.has(p.id) || (d.push({
        id: p.id,
        data: { ...p.data ?? {} }
      }), s.add(p.id));
    const h = [];
    for (const p of n.links)
      a.has(p.id) || (h.push({
        id: p.id,
        source: p.source,
        target: p.target,
        data: { ...p.data ?? {} }
      }), a.add(p.id));
    !d.length && !h.length || this.model.updateGraphData({
      graphData: {
        nodes: [...i.nodes, ...d],
        links: [...i.links, ...h]
      }
    });
  }
}
const Gc = {
  person: "/icons/person.svg",
  phone: "/icons/phone.svg",
  address: "/icons/address.svg",
  account: "/icons/account.svg",
  company: "/icons/company.svg",
  ip: "/icons/ip.svg",
  device: "/icons/device.svg"
};
function Dl(c) {
  var s;
  const n = (c == null ? void 0 : c.graphData) ?? c, i = n == null ? void 0 : n.nodes;
  if (!Array.isArray(i)) return c;
  for (const a of i) {
    const d = (s = a == null ? void 0 : a.data) == null ? void 0 : s.icon;
    typeof d == "string" && Gc[d] && (a.data.icon = Gc[d]);
  }
  return c;
}
async function jv(c) {
  const n = await oi.init(c);
  return Dl(n.graphData), n;
}
const zv = async (c) => {
  const n = await oi.expand(c);
  return Dl(n);
};
function Ov(c) {
  const { theme: n } = _o(), i = L.useRef(null), [s, a] = L.useState({ x: 0, y: 0 }), d = L.useRef(
    new _g({ initData: { graphData: { nodes: [], links: [] } } })
  ), h = L.useRef(null), p = L.useRef(new Cg()), y = L.useRef(null), [f, k] = L.useState(!0), [_, x] = L.useState(null), [S, N] = L.useState(!1), [b, m] = L.useState(!1), [C, R] = L.useState(!1), [X, U] = L.useState(!1), [H, Y] = L.useState(null);
  L.useEffect(() => {
    if (!i.current) return;
    const le = d.current, se = new qy({
      container: i.current,
      graphModel: le,
      arrowDisplay: !0,
      // 主题从外部传入（useTheme），注册 view 时手动配置
      runtimeTheme: n,
      backgroundColor: fr(n).canvas,
      forceConfig: {
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4,
        // 亲密度→物理拉扯力（在调用方外部定义）：亲密越高距离越近、强度越大
        linkDistanceFn: (K) => {
          const O = K.intimacy;
          if (O !== void 0)
            return 100 * (1.5 - O * 0.7);
        },
        linkStrengthFn: (K) => {
          const O = K.intimacy;
          if (O !== void 0)
            return 0.2 * (0.3 + O * 0.9);
        }
      },
      theme: {
        node: {
          default: (K, O) => Ev(K, O),
          person: (K, O) => Pv(K, O),
          phone: (K, O) => Nv(K, O),
          address: (K, O) => Av(K, O),
          account: (K, O) => Mv(K, O),
          company: (K, O) => Rv(K, O),
          ip: (K, O) => Lv(K, O),
          device: (K, O) => Dv(K, O)
        },
        // 边的关系类型是后端动态值（USE_DEVICE / CALLED 等），无法静态枚举；
        // 用 Proxy 让任意 linkType 都解析到默认边样式（插件的兜底声明），
        // 未来如需按关系类型定制，给具体 key 覆盖即可。
        link: new Proxy(
          {
            default: (K, O) => Iv(O)
          },
          {
            get: (K, O) => K[O] ?? K.default
          }
        )
      },
      renderPlugin: (K, O) => new av({
        gl: K,
        canvas: O,
        width: i.current.clientWidth,
        height: i.current.clientHeight,
        pickerMode: "gpu",
        onPlusClick: (F) => {
          const W = le.getNodeById(F);
          W && le.events.publish("plusToolClick", W);
        }
      })
    });
    return h.current = se, y.current = new Fv({
      model: le,
      metadataManager: new Tg(),
      loadingManager: le.loadingManager,
      historyManager: p.current,
      fetcher: zv,
      getContext: () => {
        var O, F;
        const K = (F = (O = se.renderer) == null ? void 0 : O.interaction) == null ? void 0 : F.transform;
        return {
          camera: K ? { x: K.x, y: K.y, k: K.k } : void 0,
          state: le.stateManager.getState()
        };
      }
    }), k(!1), () => {
      se.destroy(), h.current = null;
    };
  }, []), L.useEffect(() => {
    var se, K;
    const le = h.current;
    le && (le.setRuntimeTheme(n), (K = (se = le.renderer).setBackgroundColor) == null || K.call(se, fr(n).canvas));
  }, [n]), L.useEffect(() => {
    const le = d.current;
    (async () => {
      var se;
      try {
        const K = await jv(c ?? []);
        le.updateGraphData({ graphData: K.graphData }), (se = h.current) == null || se.settleLayout(), p.current.pushState({
          type: "init",
          description: "初始图谱",
          state: {
            graphData: structuredClone(K.graphData),
            customData: { state: le.stateManager.getState() }
          }
        });
      } catch (K) {
        x(K instanceof Error ? K.message : String(K));
      }
    })();
  }, [c]);
  const A = L.useCallback(() => {
    var W, q;
    const le = d.current, se = h.current, K = p.current, O = structuredClone(le.getGraphModelData().graphData);
    let F;
    if (se) {
      const P = (q = (W = se.renderer) == null ? void 0 : W.interaction) == null ? void 0 : q.transform;
      P && (F = { x: P.x, y: P.y, k: P.k });
    }
    K.pushState({
      type: "snapshot",
      description: `快照 ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
      state: {
        graphData: O,
        customData: { camera: F, state: le.stateManager.getState() }
      }
    });
  }, []), D = L.useCallback((le) => {
    var q, P, V, de, ae, xe;
    const se = d.current, K = h.current, O = p.current, F = O.getAction(le);
    if (!F) return;
    se.updateGraphData({
      graphData: structuredClone(F.state.graphData)
    });
    const W = F.state.customData;
    if (W != null && W.state) {
      const ge = W.state;
      (q = ge.highlightNodes) != null && q.length ? se.stateManager.setHighlightNodes(ge.highlightNodes, ge.highlightLinks) : se.stateManager.clearHighlightNodes(), (P = ge.selectedNodes) != null && P.length ? se.stateManager.setSelectedNodes(ge.selectedNodes, ge.selectedLinks) : se.stateManager.clearSelection(), (V = ge.hiddenNodes) != null && V.length ? se.stateManager.setHiddenNodes(ge.hiddenNodes, ge.hiddenLinks) : se.stateManager.showAll(), (de = ge.rootNodes) != null && de.length ? se.stateManager.setRootNodes(ge.rootNodes) : se.stateManager.clearRootNodes();
    }
    if (W != null && W.camera && K) {
      const ge = (xe = (ae = K.renderer) == null ? void 0 : ae.interaction) == null ? void 0 : xe.transform;
      ge && (ge.x = W.camera.x, ge.y = W.camera.y, ge.k = W.camera.k);
    }
    O.jumpTo(le), K == null || K.reheat(0.3);
  }, []), j = L.useCallback((le) => {
    p.current.deleteEntry(le);
  }, []), $ = L.useCallback(() => {
    N((le) => !le);
  }, []), ee = L.useCallback(
    (le) => {
      var F, W, q, P, V, de;
      const se = d.current, K = h.current;
      if (!le) return;
      se.updateGraphData({
        graphData: structuredClone(le.graphData)
      });
      const O = le.customData;
      if (O != null && O.state) {
        const ae = O.state;
        (F = ae.highlightNodes) != null && F.length ? se.stateManager.setHighlightNodes(
          ae.highlightNodes,
          ae.highlightLinks
        ) : se.stateManager.clearHighlightNodes(), (W = ae.selectedNodes) != null && W.length ? se.stateManager.setSelectedNodes(ae.selectedNodes, ae.selectedLinks) : se.stateManager.clearSelection(), (q = ae.hiddenNodes) != null && q.length ? se.stateManager.setHiddenNodes(ae.hiddenNodes, ae.hiddenLinks) : se.stateManager.showAll(), (P = ae.rootNodes) != null && P.length ? se.stateManager.setRootNodes(ae.rootNodes) : se.stateManager.clearRootNodes();
      }
      if (O != null && O.camera && K) {
        const ae = (de = (V = K.renderer) == null ? void 0 : V.interaction) == null ? void 0 : de.transform;
        ae && (ae.x = O.camera.x, ae.y = O.camera.y, ae.k = O.camera.k);
      }
      K == null || K.reheat(0.3);
    },
    []
  ), ye = L.useCallback(() => {
    const se = p.current.goBackSkipType("snapshot");
    ee(se);
  }, [ee]), oe = L.useCallback(() => {
    const se = p.current.goForwardSkipType("snapshot");
    ee(se);
  }, [ee]);
  return {
    containerRef: i,
    modelRef: d,
    viewRef: h,
    historyManagerRef: p,
    expansionRef: y,
    ctx: {
      mousePos: s,
      setMousePos: a,
      loading: f,
      initError: _,
      snapshotPanelOpen: S,
      setSnapshotPanelOpen: N,
      legendPanelOpen: b,
      setLegendPanelOpen: m,
      miniMapOpen: C,
      setMiniMapOpen: R,
      analysisPanelOpen: X,
      setAnalysisPanelOpen: U,
      analysisTarget: H,
      setAnalysisTarget: Y,
      handleTakeSnapshot: A,
      handleJumpToSnapshot: D,
      handleDeleteSnapshot: j,
      handleToggleSnapshotPanel: $,
      handleUndo: ye,
      handleRedo: oe
    }
  };
}
function Bv({
  viewRef: c,
  modelRef: n
}) {
  const [i, s] = L.useState("rect"), [a, d] = L.useState(null), [h, p] = L.useState(null), [y, f] = L.useState(null), [k, _] = L.useState(!1), x = L.useRef(null), S = L.useCallback(
    (O, F) => {
      var V;
      const W = c.current;
      if (!W) return { x: O, y: F };
      const q = (V = W.renderer) == null ? void 0 : V.canvas;
      if (!q) return { x: O, y: F };
      const P = q.getBoundingClientRect();
      return { x: O - P.left, y: F - P.top };
    },
    [c]
  ), N = L.useCallback(() => {
    var F, W;
    const O = c.current;
    return O ? ((W = (F = O.renderer) == null ? void 0 : F.interaction) == null ? void 0 : W.transform) ?? null : null;
  }, [c]), b = L.useCallback(
    (O) => {
      const F = n.current, W = N();
      if (!F || !W) return [];
      const { nodes: q } = F.getGraphModelData().graphData, P = O.x1 / W.k - W.x, V = O.y1 / W.k - W.y, de = O.x2 / W.k - W.x, ae = O.y2 / W.k - W.y, xe = Math.min(P, de), ge = Math.max(P, de), Z = Math.min(V, ae), ne = Math.max(V, ae);
      return q.filter((ie) => {
        const re = ie.x ?? 0, Se = ie.y ?? 0;
        return re >= xe && re <= ge && Se >= Z && Se <= ne;
      }).map((ie) => ie.id);
    },
    [n, N]
  ), m = L.useCallback(
    (O) => {
      if (O.length < 3) return [];
      const F = n.current, W = N();
      if (!F || !W) return [];
      const { nodes: q } = F.getGraphModelData().graphData, P = O.map(
        (V) => [V.x / W.k - W.x, V.y / W.k - W.y]
      );
      return q.filter((V) => {
        const de = V.x ?? 0, ae = V.y ?? 0;
        return Uv(de, ae, P);
      }).map((V) => V.id);
    },
    [n, N]
  ), C = L.useRef(i);
  C.current = i;
  const R = L.useRef(h);
  R.current = h;
  const X = L.useRef(y);
  X.current = y, L.useEffect(() => {
    const O = (W) => {
      W.key === "Shift" && (_(!0), d(C.current)), W.key === "Escape" && X.current && f(null);
    }, F = (W) => {
      W.key === "Shift" && (_(!1), !R.current && (!X.current || X.current.vertices.length === 0) && d(null));
    };
    return window.addEventListener("keydown", O), window.addEventListener("keyup", F), () => {
      window.removeEventListener("keydown", O), window.removeEventListener("keyup", F);
    };
  }, []);
  const U = L.useCallback(
    (O, F) => {
      if (!y || y.vertices.length < 2) return !1;
      const W = y.vertices[0], q = O - W.x, P = F - W.y;
      return Math.sqrt(q * q + P * P) < 10;
    },
    [y]
  ), H = L.useCallback(
    (O) => {
      const F = b(O), W = n.current;
      return W && (F.length > 0 ? W.stateManager.setSelectedNodes(F) : W.stateManager.clearSelection()), F;
    },
    [b, n]
  ), Y = L.useCallback(
    (O) => {
      const F = m(O), W = n.current;
      return W && (F.length > 0 ? W.stateManager.setSelectedNodes(F) : W.stateManager.clearSelection()), F;
    },
    [m, n]
  ), A = L.useCallback((O, F) => {
    x.current = { x: O, y: F }, p({ x1: O, y1: F, x2: O, y2: F });
  }, []), D = L.useCallback((O, F) => {
    x.current && p({
      x1: x.current.x,
      y1: x.current.y,
      x2: O,
      y2: F
    });
  }, []), j = L.useCallback(() => {
    h && H(h), p(null), x.current = null;
  }, [h, H]), $ = L.useCallback((O, F) => {
    f((W) => ({ vertices: W != null && W.vertices ? [...W.vertices, { x: O, y: F }] : [{ x: O, y: F }], cursorPos: { x: O, y: F } }));
  }, []), ee = L.useCallback((O, F) => {
    f(
      (W) => W ? { ...W, cursorPos: { x: O, y: F } } : null
    );
  }, []), ye = L.useCallback(() => {
    y && y.vertices.length >= 3 && Y(y.vertices), f(null);
  }, [y, Y]), oe = L.useCallback(() => {
    p(null), f(null), x.current = null;
  }, []), le = L.useCallback(() => {
    oe(), s("rect"), d(null);
  }, [oe]), se = L.useCallback(() => {
    oe(), s("polygon"), d(null);
  }, [oe]), K = L.useCallback(() => {
    oe(), s(null), d(null);
  }, [oe]);
  return {
    /** 工具栏选中的模式（持久） */
    selectedSelectionMode: i,
    /** 当前激活的框选模式（Shift 按下时非 null） */
    selectionMode: a,
    /** 矩形状态（供 overlay 渲染） */
    rect: h,
    /** 多边形状态（供 overlay 渲染） */
    polygon: y,
    /** Shift 是否按下 */
    isShiftDown: k,
    /** 判断是否靠近首顶点 */
    isNearFirstVertex: U,
    /** 坐标工具 */
    getCanvasPos: S,
    getTransform: N,
    /** 矩形操作 */
    startRect: A,
    updateRect: D,
    finishRect: j,
    /** 多边形操作 */
    addPolygonVertex: $,
    updatePolygonCursor: ee,
    finishPolygon: ye,
    /** 通用 */
    cancelSelection: oe,
    /** 工具栏方法 */
    activateRectMode: le,
    activatePolygonMode: se,
    deactivateSelectionMode: K
  };
}
function Uv(c, n, i) {
  let s = !1;
  for (let a = 0, d = i.length - 1; a < i.length; d = a++) {
    const [h, p] = i[a], [y, f] = i[d];
    p > n != f > n && c < (y - h) * (n - p) / (f - p) + h && (s = !s);
  }
  return s;
}
const xo = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  fontFamily: "monospace"
}, Wv = {
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
function Hv({ onClose: c }) {
  const {
    timeRange: n,
    timeValue: i,
    timeActive: s,
    playing: a,
    setPlaying: d,
    onTimeChange: h,
    toggleTime: p,
    resetFilters: y
  } = Kt(), f = (k) => new Date(k).toISOString().slice(0, 10);
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "time-panel",
      layer: Mt.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 340, h: 170 },
      position: { x: window.innerWidth - 380, y: 300 },
      style: Wv,
      onClose: c,
      children: [
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(nd, { size: 14 }),
              /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold" }, children: "时间线回放" }),
              /* @__PURE__ */ v.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ v.jsx(
                "button",
                {
                  onClick: p,
                  disabled: !n.hasTime,
                  style: {
                    ..._l,
                    background: s ? "#0066ff40" : "transparent",
                    border: s ? "1px solid #0066ff" : "1px solid #555"
                  },
                  title: s ? "关闭时间过滤" : "启用时间过滤",
                  children: s ? "过滤中" : "启用"
                }
              ),
              /* @__PURE__ */ v.jsx("button", { onClick: () => y(), style: _l, title: "重置时间线", children: /* @__PURE__ */ v.jsx(rd, { size: 13 }) })
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs(
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
              !n.hasTime && /* @__PURE__ */ v.jsx("span", { style: xo, children: "（当前画布无边的时间信息）" }),
              /* @__PURE__ */ v.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ v.jsx(
                  "button",
                  {
                    onClick: () => {
                      s || p(), d((k) => !k);
                    },
                    disabled: !n.hasTime,
                    style: { ..._l, padding: "3px 10px" },
                    title: a ? "暂停" : "播放",
                    children: a ? /* @__PURE__ */ v.jsx(Zf, { size: 13 }) : /* @__PURE__ */ v.jsx(np, { size: 13 })
                  }
                ),
                /* @__PURE__ */ v.jsx(
                  "input",
                  {
                    type: "range",
                    min: n.min,
                    max: n.max,
                    value: i,
                    disabled: !n.hasTime,
                    onChange: (k) => h(Number(k.target.value)),
                    style: { flex: 1, cursor: "pointer" }
                  }
                ),
                /* @__PURE__ */ v.jsx("span", { style: xo, children: f(i) })
              ] }),
              /* @__PURE__ */ v.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                /* @__PURE__ */ v.jsx("span", { style: xo, children: n.hasTime ? f(n.min) : "--" }),
                /* @__PURE__ */ v.jsx("span", { style: xo, children: n.hasTime ? f(n.max) : "--" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const _l = {
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
}, Vv = {
  person: "人员",
  phone: "手机",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP",
  device: "设备"
}, $v = {
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
function Xv({ onClose: c }) {
  const {
    typeStats: n,
    attrFilter: i,
    toggleNodeType: s,
    updateAttrFilter: a,
    resetFilters: d
  } = Kt(), h = (f) => a({ gender: f === "" ? null : f }), p = (f) => a({ minWeight: f === "" ? null : Number(f) }), y = (f) => a({ maxWeight: f === "" ? null : Number(f) });
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "filter-panel",
      layer: Mt.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 340, h: 320 },
      position: { x: window.innerWidth - 380, y: 150 },
      style: $v,
      onClose: c,
      children: [
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(dp, { size: 14 }),
              /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold" }, children: "属性过滤" }),
              /* @__PURE__ */ v.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ v.jsxs("button", { onClick: () => d(), style: Yv, title: "重置全部过滤", children: [
                /* @__PURE__ */ v.jsx(rd, { size: 13 }),
                " 重置"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ v.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 4
            },
            children: [
              /* @__PURE__ */ v.jsx("div", { style: Tl, children: "节点类型" }),
              /* @__PURE__ */ v.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: [...n.entries()].map(([f, k]) => {
                const _ = i.nodeTypes.has(f);
                return /* @__PURE__ */ v.jsxs(
                  "label",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      padding: "2px 8px",
                      border: `1px solid ${_ ? "#0066ff" : "#444"}`,
                      borderRadius: 12,
                      background: _ ? "#0066ff25" : "transparent",
                      cursor: "pointer"
                    },
                    children: [
                      /* @__PURE__ */ v.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: _,
                          onChange: (x) => s(f, x.target.checked),
                          style: { margin: 0 }
                        }
                      ),
                      Vv[f] ?? f,
                      /* @__PURE__ */ v.jsx("span", { style: { color: "rgb(var(--muted))" }, children: k })
                    ]
                  },
                  f
                );
              }) }),
              /* @__PURE__ */ v.jsx("div", { style: { ...Tl, marginTop: 12 }, children: "性别" }),
              /* @__PURE__ */ v.jsxs(
                "select",
                {
                  value: i.gender ?? "",
                  onChange: (f) => h(f.target.value),
                  style: gd,
                  children: [
                    /* @__PURE__ */ v.jsx("option", { value: "", children: "全部" }),
                    /* @__PURE__ */ v.jsx("option", { value: "男", children: "男" }),
                    /* @__PURE__ */ v.jsx("option", { value: "女", children: "女" })
                  ]
                }
              ),
              /* @__PURE__ */ v.jsx("div", { style: { ...Tl, marginTop: 12 }, children: "案值权重" }),
              /* @__PURE__ */ v.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
                /* @__PURE__ */ v.jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "min",
                    value: i.minWeight ?? "",
                    onChange: (f) => p(f.target.value),
                    style: Qc
                  }
                ),
                /* @__PURE__ */ v.jsx("span", { children: "~" }),
                /* @__PURE__ */ v.jsx(
                  "input",
                  {
                    type: "number",
                    placeholder: "max",
                    value: i.maxWeight ?? "",
                    onChange: (f) => y(f.target.value),
                    style: Qc
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
const Tl = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  marginBottom: 6
}, Yv = {
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
}, gd = {
  fontSize: 12,
  fontFamily: "monospace",
  padding: "3px 6px",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))"
}, Qc = {
  ...gd,
  width: 90
}, Gv = {
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
function Qv({
  modelRef: c,
  viewRef: n,
  onClose: i
}) {
  const { hoveredNode: s, selectedNodeIds: a } = Kt(), [d, h] = L.useState(0), [p, y] = L.useState("all"), f = L.useRef(/* @__PURE__ */ new Map());
  L.useEffect(() => {
    const x = c.current;
    if (x)
      return x.events.subscribe("dataChange", () => h((S) => S + 1));
  }, [c]);
  const k = L.useMemo(() => {
    const x = c.current;
    if (!x) return [];
    const S = x.getGraphModelData().graphData, N = /* @__PURE__ */ new Map();
    for (const m of S.links) {
      const C = String(typeof m.source == "object" ? m.source.id : m.source), R = String(typeof m.target == "object" ? m.target.id : m.target), X = m.data ?? {}, U = typeof X.intimacy == "number" ? X.intimacy : 0;
      for (const H of [C, R]) {
        const Y = N.get(H) ?? { count: 0, intimacy: 0 };
        Y.count += 1, Y.intimacy += U, N.set(H, Y);
      }
    }
    return S.nodes.filter(
      (m) => p === "selected" ? a.has(m.id) : !0
    ).map((m) => {
      const C = m.data ?? {}, R = N.get(m.id) ?? { count: 0, intimacy: 0 };
      return {
        id: m.id,
        label: C.label ?? m.id,
        nodeType: C.nodeType ?? "default",
        clusterId: C.clusterId ?? "",
        gender: C.gender ?? "",
        age: C.age ?? 0,
        caseWeight: C.caseWeight ?? 0,
        edgeCount: R.count,
        intimacy: R.count ? Math.round(R.intimacy / R.count * 100) / 100 : 0
      };
    });
  }, [c, d, p, a]);
  L.useEffect(() => {
    const x = s == null ? void 0 : s.id;
    if (!x) return;
    const S = f.current.get(x);
    S == null || S.scrollIntoView({ block: "nearest" });
  }, [s]);
  const _ = (x) => {
    const S = n.current, N = c.current;
    !S || !N || (S.focusNodeById(x.id), N.stateManager.setSelectedNodes([x.id]));
  };
  return /* @__PURE__ */ v.jsxs(
    Qt,
    {
      id: "table-panel",
      layer: Mt.Panel,
      draggable: !0,
      resizable: !0,
      defaultSize: { w: 620, h: 400 },
      position: { x: 60, y: 60 },
      style: Gv,
      onClose: i,
      children: [
        /* @__PURE__ */ v.jsxs(
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
              /* @__PURE__ */ v.jsx(id, { size: 14 }),
              /* @__PURE__ */ v.jsx("span", { style: { fontWeight: "bold" }, children: "表格视图" }),
              /* @__PURE__ */ v.jsx("span", { style: { flex: 1 } }),
              /* @__PURE__ */ v.jsxs(
                "button",
                {
                  onClick: () => y("all"),
                  style: {
                    ...Kc,
                    background: p === "all" ? "#0066ff40" : "transparent"
                  },
                  children: [
                    "全部 (",
                    k.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ v.jsxs(
                "button",
                {
                  onClick: () => y("selected"),
                  style: {
                    ...Kc,
                    background: p === "selected" ? "#0066ff40" : "transparent"
                  },
                  children: [
                    "选中 (",
                    a.size,
                    ")"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ v.jsx("div", { style: { flex: 1, overflow: "auto" }, children: /* @__PURE__ */ v.jsxs("table", { style: { borderCollapse: "collapse", width: "100%" }, children: [
          /* @__PURE__ */ v.jsx("thead", { children: /* @__PURE__ */ v.jsx("tr", { style: { color: "rgb(var(--muted))", textAlign: "left" }, children: [
            "标签",
            "类型",
            "簇",
            "性别",
            "年龄",
            "案值",
            "边数",
            "亲密度"
          ].map((x) => /* @__PURE__ */ v.jsx("th", { style: Kv, children: x }, x)) }) }),
          /* @__PURE__ */ v.jsx("tbody", { children: k.map((x) => {
            const S = (s == null ? void 0 : s.id) === x.id, N = a.has(x.id);
            return /* @__PURE__ */ v.jsxs(
              "tr",
              {
                ref: (b) => {
                  b ? f.current.set(x.id, b) : f.current.delete(x.id);
                },
                onClick: () => _(x),
                style: {
                  borderTop: "1px solid rgb(var(--border))",
                  cursor: "pointer",
                  background: N ? "#0066ff30" : S ? "rgba(233,69,96,0.12)" : "transparent"
                },
                children: [
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.label }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.nodeType }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.clusterId }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.gender }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.age || "" }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.caseWeight || "" }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: x.edgeCount }),
                  /* @__PURE__ */ v.jsx("td", { style: Sn, children: /* @__PURE__ */ v.jsx(
                    "div",
                    {
                      style: {
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        background: "rgba(128,128,128,0.2)"
                      },
                      children: /* @__PURE__ */ v.jsx(
                        "div",
                        {
                          style: {
                            width: `${Math.round(x.intimacy * 100)}%`,
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
              x.id
            );
          }) })
        ] }) })
      ]
    }
  );
}
const Kv = {
  padding: "6px 10px",
  fontSize: 11,
  fontWeight: "normal",
  position: "sticky",
  top: 0,
  background: "rgb(var(--background))"
}, Sn = {
  padding: "5px 10px",
  maxWidth: 140,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
}, Kc = {
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 8px",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))"
};
function qc(c, n) {
  var s, a;
  const i = {};
  for (const d of c.links) {
    const h = typeof d.source == "object" ? d.source.id : d.source, p = typeof d.target == "object" ? d.target.id : d.target;
    if (String(h) === n) {
      const y = c.nodes.find((f) => f.id === p);
      if (y) {
        const f = ((s = y.data) == null ? void 0 : s.nodeType) ?? "unknown";
        i[f] || (i[f] = { out: 0, in: 0 }), i[f].out += 1;
      }
    }
    if (String(p) === n) {
      const y = c.nodes.find((f) => f.id === h);
      if (y) {
        const f = ((a = y.data) == null ? void 0 : a.nodeType) ?? "unknown";
        i[f] || (i[f] = { out: 0, in: 0 }), i[f].in += 1;
      }
    }
  }
  return i;
}
function qv() {
  const [c] = L.useState(() => {
    const Ee = new URLSearchParams(window.location.search).get("ids");
    return Ee ? Ee.split(",").filter(Boolean) : void 0;
  }), n = Ov(c), {
    containerRef: i,
    modelRef: s,
    viewRef: a,
    historyManagerRef: d,
    expansionRef: h,
    ctx: {
      setMousePos: p,
      loading: y,
      initError: f,
      snapshotPanelOpen: k,
      setSnapshotPanelOpen: _,
      legendPanelOpen: x,
      setLegendPanelOpen: S,
      miniMapOpen: N,
      setMiniMapOpen: b,
      analysisPanelOpen: m,
      setAnalysisPanelOpen: C,
      setAnalysisTarget: R,
      handleTakeSnapshot: X,
      handleJumpToSnapshot: U,
      handleDeleteSnapshot: H,
      handleToggleSnapshotPanel: Y,
      handleUndo: A,
      handleRedo: D
    }
  } = n, [j, $] = L.useState(!1), [ee, ye] = L.useState(!1), [oe, le] = L.useState(!1), [se, K] = L.useState(!1), O = _v(s), F = Tv(s, {
    onPlusToolClick: (we) => {
      X(), ge({
        node: we,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    },
    onNodeContextMenu: (we, Ee, Ue) => {
      ge({ node: we, x: Ee, y: Ue });
    }
  }), {
    ctx: {
      hoveredNode: W,
      setHoveredNode: q,
      hoveredLink: P,
      setHoveredLink: V,
      selectedNodeIds: de
    }
  } = F, ae = Cv(i, h), { ruleMenu: xe, setRuleMenu: ge, expanding: Z, runtimeError: ne } = ae.ctx, { handleRuleExpand: ie } = ae, re = Bv({ viewRef: a, modelRef: s }), Se = L.useCallback(async (we) => {
    const Ee = s.current, Ue = a.current;
    if (!Ee || !Ue) return;
    const Bt = await oi.init([we]), Rt = Dl(Bt).graphData, vt = Ee.getGraphModelData().graphData, Tn = new Set(vt.nodes.map((ht) => ht.id)), dt = new Set(vt.links.map((ht) => ht.id)), qt = Rt.nodes.filter((ht) => !Tn.has(ht.id));
    if (qt.length === 0) return;
    const Cn = Ue.renderer.interaction.transform, Zt = Ue.renderer.canvas, Jt = Zt.clientWidth / 2 / Cn.k - Cn.x, li = Zt.clientHeight / 2 / Cn.k - Cn.y;
    Ue.setPhysicsCenter(Jt, li);
    for (const ht of qt)
      ht.x = Jt + (Math.random() - 0.5) * 20, ht.y = li + (Math.random() - 0.5) * 20;
    Ee.updateGraphData({
      graphData: {
        nodes: [...vt.nodes, ...qt],
        links: [
          ...vt.links,
          ...Rt.links.filter((ht) => !dt.has(ht.id))
        ]
      }
    }), Ue.reheat(1), d.current.pushState({
      type: "search-add",
      description: `新增节点 ${we}`,
      state: {
        graphData: structuredClone(Ee.getGraphModelData().graphData),
        customData: { state: Ee.stateManager.getState() }
      }
    });
  }, []), Re = L.useCallback(() => {
    if (m) return C(!1);
    const we = [...de];
    we.length !== 0 && (R({
      ids: we,
      labels: we.map((Ee) => {
        var Bt, Rt;
        const Ue = (Bt = s.current) == null ? void 0 : Bt.getGraphModelData().graphData.nodes.find((vt) => vt.id === Ee);
        return ((Rt = Ue == null ? void 0 : Ue.data) == null ? void 0 : Rt.label) ?? Ee;
      })
    }), C(!0));
  }, [de, m, C]), Be = L.useCallback(() => {
    S((we) => !we);
  }, []), be = L.useCallback(() => {
    b((we) => !we);
  }, []), zt = L.useCallback(() => {
    var we;
    (we = a.current) == null || we.fitView(50);
  }, []), Ot = L.useCallback(
    (we) => {
      const Ee = s.current;
      !Ee || de.size === 0 || cv(Ee, de, we);
    },
    [de]
  ), gr = {
    repulsion: -200,
    linkDistance: 100,
    linkStrength: 0.2,
    centerStrength: 0.1,
    velocityDecay: 0.4
  }, si = L.useCallback(() => {
    const we = a.current;
    if (we)
      if (se)
        we.setLayout(new Nl(gr)), K(!1);
      else {
        const Ee = de.size > 0 ? [...de][0] : void 0;
        we.setLayout(new uv({ rootId: Ee, levelGap: 170, siblingGap: 64 })), K(!0);
      }
  }, [se, de]), yr = {
    ...n.ctx,
    ...F.ctx,
    ...ae.ctx,
    ...re,
    ...O
  };
  return /* @__PURE__ */ v.jsx(Op, { value: yr, children: /* @__PURE__ */ v.jsx(_f, { children: /* @__PURE__ */ v.jsxs(
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
        /* @__PURE__ */ v.jsx(
          mv,
          {
            historyManagerRef: d,
            onFitView: zt,
            onToggleSnapshotPanel: Y,
            onToggleLegend: Be,
            onToggleMiniMap: be,
            onUndo: A,
            onRedo: D,
            onSearchSelect: Se,
            onAnalyze: Re,
            timePanelOpen: j,
            filterPanelOpen: ee,
            tablePanelOpen: oe,
            onToggleTimePanel: () => $((we) => !we),
            onToggleFilterPanel: () => ye((we) => !we),
            onToggleTablePanel: () => le((we) => !we),
            onExportJSON: () => Ot("json"),
            onExportCSV: () => Ot("csv"),
            treeMode: se,
            onToggleTreeLayout: si
          }
        ),
        y && /* @__PURE__ */ v.jsx(
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
            children: /* @__PURE__ */ v.jsxs("div", { style: { textAlign: "center" }, children: [
              /* @__PURE__ */ v.jsx("div", { style: { fontSize: "32px", marginBottom: "12px" }, children: "⟳" }),
              /* @__PURE__ */ v.jsx("div", { children: "Loading graph data..." }),
              /* @__PURE__ */ v.jsx(
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
              /* @__PURE__ */ v.jsx(
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
              f && /* @__PURE__ */ v.jsxs(
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
                    f
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ v.jsxs(
          "div",
          {
            ref: i,
            style: {
              flex: 1,
              position: "relative",
              overflow: "hidden"
            },
            onMouseMove: (we) => {
              p({ x: we.clientX, y: we.clientY });
            },
            onMouseLeave: () => {
              q(null), V(null);
            },
            children: [
              W && /* @__PURE__ */ v.jsx(
                Bp,
                {
                  loadedNeighbors: qc(
                    s.current.getGraphModelData().graphData,
                    W.id
                  )
                }
              ),
              P && /* @__PURE__ */ v.jsx(Wp, {}),
              k && d.current && /* @__PURE__ */ v.jsx(
                ag,
                {
                  historyManager: d.current,
                  currentIndex: d.current.cursor,
                  onTakeSnapshot: X,
                  onJumpTo: U,
                  onDeleteEntry: H,
                  onClose: () => _(!1)
                }
              ),
              m && /* @__PURE__ */ v.jsx(
                fg,
                {
                  modelRef: s,
                  viewRef: a,
                  onClose: () => {
                    R(null), C(!1);
                  },
                  onExpand: (we) => {
                    var vt, Tn;
                    const Ee = s.current;
                    if (!Ee) return;
                    const Ue = Ee.getGraphModelData().graphData, Bt = new Set(Ue.nodes.map((dt) => dt.id)), Rt = new Set(Ue.links.map((dt) => dt.id));
                    Ee.updateGraphData({
                      graphData: {
                        nodes: [
                          ...Ue.nodes,
                          ...we.nodes.filter(
                            (dt) => !Bt.has(dt.id)
                          )
                        ],
                        links: [
                          ...Ue.links,
                          ...we.links.filter(
                            (dt) => !Rt.has(dt.id)
                          )
                        ]
                      }
                    }), (vt = a.current) == null || vt.reheat(1), (Tn = a.current) == null || Tn.fitView(50);
                  }
                }
              ),
              x && !y && /* @__PURE__ */ v.jsx(Pp, { onClose: () => S(!1) }),
              N && !y && /* @__PURE__ */ v.jsx(zp, { viewRef: a }),
              j && /* @__PURE__ */ v.jsx(Hv, { onClose: () => $(!1) }),
              ee && /* @__PURE__ */ v.jsx(Xv, { onClose: () => ye(!1) }),
              oe && /* @__PURE__ */ v.jsx(
                Qv,
                {
                  modelRef: s,
                  viewRef: a,
                  onClose: () => le(!1)
                }
              ),
              /* @__PURE__ */ v.jsx(
                wv,
                {
                  modelRef: s,
                  viewRef: a,
                  onAnalyze: Re
                }
              ),
              xe && /* @__PURE__ */ v.jsx(
                Yp,
                {
                  node: xe.node,
                  loadedNeighbors: qc(
                    s.current.getGraphModelData().graphData,
                    xe.node.id
                  ),
                  x: xe.x,
                  y: xe.y,
                  onExpand: ie,
                  onClose: () => ge(null)
                }
              ),
              Z && /* @__PURE__ */ v.jsxs(
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
                    /* @__PURE__ */ v.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "18px",
                          animation: "spin 1s linear infinite"
                        },
                        children: "⟳"
                      }
                    ),
                    /* @__PURE__ */ v.jsx("span", { children: "正在拓出..." }),
                    /* @__PURE__ */ v.jsx("style", { children: "@keyframes spin { to { transform: rotate(360deg); } }" })
                  ]
                }
              ),
              /* @__PURE__ */ v.jsx(kv, {}),
              ne && /* @__PURE__ */ v.jsxs(
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
                    ne
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
let hr = null;
const Zv = () => {
  let c = document.getElementById("single-spa-application:graph-app");
  return c || (c = document.createElement("div"), c.id = "single-spa-application:graph-app", document.body.appendChild(c)), c;
}, em = async () => {
}, tm = async (c) => {
  var i;
  const n = c.domElement ?? Zv();
  n.dataset.buildVersion = "0.2.0", (i = c.auth) != null && i.token && cg(c.auth.token), hr = wf.createRoot(n), hr.render(
    /* @__PURE__ */ v.jsx(_p, { children: /* @__PURE__ */ v.jsx(qv, {}) })
  );
}, nm = async () => {
  hr == null || hr.unmount(), hr = null;
};
export {
  em as bootstrap,
  Zv as domElementGetter,
  tm as mount,
  nm as unmount
};
