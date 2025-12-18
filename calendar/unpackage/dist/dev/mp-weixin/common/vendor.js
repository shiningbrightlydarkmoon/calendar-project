"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$1 = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale$1(locale2, messages) {
  if (!locale2) {
    return;
  }
  locale2 = locale2.trim().replace(/_/g, "-");
  if (messages && messages[locale2]) {
    return locale2;
  }
  locale2 = locale2.toLowerCase();
  if (locale2 === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale2.indexOf("zh") === 0) {
    if (locale2.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale2.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale2, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales2 = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales2 = Object.keys(messages);
  }
  const lang2 = startsWith(locale2, locales2);
  if (lang2) {
    return lang2;
  }
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString$1(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject$1(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject$1(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2,
    onShareChat: 1 << 3
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction$1(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else {
    warn$2(
      `onScopeDispose() is called when there is no active effect scope to be associated with.`
    );
  }
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend$1({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend$1({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$3(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add$2(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto2 = getProto(target);
  const hadKey = proto2.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$3(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: add$2,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$3(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: add$2,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$3(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$3(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  if (!isProxy(object)) {
    warn$2(`toRefs() expects a reactive object but received a plain one.`);
  }
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction$1(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$1(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys2 = Object.keys(props);
  keys2.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys2.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString$1(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue$1.length; i++) {
    const cb = queue$1[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction$1(validator)) {
          const isValid2 = validator(...rawArgs);
          if (!isValid2) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$1(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend$1(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction$1(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction$1(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend$1({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction$1(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction$1(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction$1(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend$1({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks2 = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks2.unshift(wrappedHook);
    } else {
      hooks2.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
function getComponentInternalInstance(i) {
  return i;
}
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
    // fixed by xxxxxx
    $: getComponentInternalInstance,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString$1(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction$1(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$1(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to2, from2, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from2;
  if (extendsOptions) {
    mergeOptions(to2, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to2, m2, strats, true)
    );
  }
  for (const key in from2) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to2[key] = strat ? strat(to2[key], from2[key]) : from2[key];
    }
  }
  return to2;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to2, from2) {
  if (!from2) {
    return to2;
  }
  if (!to2) {
    return from2;
  }
  return function mergedDataFn() {
    return extend$1(
      isFunction$1(to2) ? to2.call(this, this) : to2,
      isFunction$1(from2) ? from2.call(this, this) : from2
    );
  };
}
function mergeInject(to2, from2) {
  return mergeObjectOptions(normalizeInject(to2), normalizeInject(from2));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to2, from2) {
  return to2 ? [...new Set([].concat(to2, from2))] : from2;
}
function mergeObjectOptions(to2, from2) {
  return to2 ? extend$1(/* @__PURE__ */ Object.create(null), to2, from2) : from2;
}
function mergeEmitsOrPropsOptions(to2, from2) {
  if (to2) {
    if (isArray$1(to2) && isArray$1(from2)) {
      return [.../* @__PURE__ */ new Set([...to2, ...from2])];
    }
    return extend$1(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to2),
      normalizePropsOrEmits(from2 != null ? from2 : {})
    );
  } else {
    return from2;
  }
}
function mergeWatchOptions(to2, from2) {
  if (!to2)
    return from2;
  if (!from2)
    return to2;
  const merged = extend$1(/* @__PURE__ */ Object.create(null), to2);
  for (const key in from2) {
    merged[key] = mergeAsArray$1(to2[key], from2[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys2] = normalizePropsOptions(raw2, appContext, true);
      extend$1(normalized, props);
      if (keys2)
        needCastKeys.push(...keys2);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString$1(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$1(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend$1({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType$1(a) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid2 = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid2; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid2 = valid;
    }
    if (!isValid2) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray$1(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction$1(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn$3 = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff$1(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone$2(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray$1(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone$2(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone$2(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone$2(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys2) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys2.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys2 = Object.keys(data);
    const diffData = diff$1(data, oldData || getMPInstanceData(mpInstance, keys2));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys2 = Object.keys(computedOptions);
    if (keys2.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys2);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray$1(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value) {
  if (isObject$1(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction$1(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString$1(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray$1(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn$3("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  instance.renderer = options.mpType ? options.mpType : "component";
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys2 = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys2.length) {
      return;
    }
    if (propsOptions && keys2.some(isModelListener)) {
      keys2.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys2.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString$1(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff$1(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn$3(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction$1(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component" || // instance.renderer 标识页面是否作为组件渲染
  mpType === "page" && instance.renderer === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks2 = options[name];
      if (isArray$1(hooks2)) {
        hooks2.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks2, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set$3(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to2, from2) {
  return to2 ? [...new Set([].concat(to2, from2))] : from2;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token2 = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token2.split(".");
  if (!token2 || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set$3;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString$1(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray$1(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject$1(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject$1(event.detail)) {
      event.target = extend$1({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray$1(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn$3(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys2 = Object.keys(source);
      ret = new Array(keys2.length);
      for (let i = 0, l = keys2.length; i < l; i++) {
        const key = keys2[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const o = (value, key) => vOn(value, key);
const f = (source, renderItem) => vFor(source, renderItem);
const e = (target, ...sources) => extend$1(target, ...sources);
const t = (val) => toDisplayString(val);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
function getLocaleLanguage$1() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale$1(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString$1(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray$1(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject$1(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid2 = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid2; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid2 = valid;
    }
    if (!isValid2) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction$1(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject$1(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction$1(success);
  const hasFail = isFunction$1(fail);
  const hasComplete = isFunction$1(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction$1(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction$1(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue(hooks2, data, params) {
  let promise = false;
  for (let i = 0; i < hooks2.length; i++) {
    const hook = hooks2[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks2 = interceptors2[name];
    if (!isArray$1(hooks2)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks2, res, options).then((res2) => {
        return isFunction$1(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray$1(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray$1(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray$1(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject$1(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction$1(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, extend$1({}, args), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject) => {
      invokeApi(name, fn, extend$1({}, args, { success: resolve, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend$1(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend$1({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString$1(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a, _b;
  let windowWidth, pixelRatio, platform;
  {
    const windowInfo = ((_a = wx.getWindowInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction$1(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks2 = interceptors2[name];
    const hook = interceptor[name];
    if (isArray$1(hooks2) && isFunction$1(hook)) {
      remove(hooks2, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray$1(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks2) {
  const res = [];
  for (let i = 0; i < hooks2.length; i++) {
    if (res.indexOf(hooks2[i]) === -1) {
      res.push(hooks2[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method) && isPlainObject$1(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject$1(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method)) {
    if (isPlainObject$1(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject$1(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray$1(name))
    name = name ? [name] : [];
  name.forEach((n) => {
    eventBus.off(n, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction$1(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction$1(options.success) || isFunction$1(options.fail) || isFunction$1(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, extend$1({}, options), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject) => {
      invokeApi(name, api, extend$1({}, options, {
        success: resolve,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject$1(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction$1(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction$1(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString$1(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject$1(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction$1(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction$1(fromArgs)) {
      if (isFunction$1(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction$1(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction$1(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction$1(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction$1(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale$1 = () => {
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale2) => {
  const app = isFunction$1(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale2) {
    app.$vm.$locale = locale2;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale: locale2 }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale$1;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || platform;
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__19D68C4",
    appName: "calendar",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.87",
    uniCompilerVersion: "4.87",
    uniRuntimeVersion: "4.87",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend$1(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray$1(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = sortObject(extend$1(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "__UNI__19D68C4",
      appName: "calendar",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.87",
      uniCompilerVersion: "4.87",
      uniRuntimeVersion: "4.87"
    };
    extend$1(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend$1(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale: getLocale$1,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction$1(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction$1(fail) && fail(res);
    }
    isFunction$1(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.canIUse("getAppBaseInfo")) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getWindowInfo")) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.canIUse("getDeviceInfo")) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
function initRuntimeSocket(hosts, port, id) {
  if (hosts == "" || port == "" || id == "")
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket != null)
        return Promise.resolve(socket);
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      multiple: true,
      // 支付宝小程序 是否开启多实例
      fail() {
        resolve(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
const errorExtra = {};
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  const data = errors.map((err) => {
    if (typeof err === "string") {
      return err;
    }
    const isPromiseRejection = err && "promise" in err && "reason" in err;
    const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
    if (isPromiseRejection) {
      err = err.reason;
    }
    if (err instanceof Error && err.stack) {
      if (err.message && !err.stack.includes(err.message)) {
        return `${prefix}${err.message}
${err.stack}`;
      }
      return `${prefix}${err.stack}`;
    }
    if (typeof err === "object" && err !== null) {
      try {
        return prefix + JSON.stringify(err);
      } catch (err2) {
        return prefix + String(err2);
      }
    }
    return prefix + String(err);
  }).filter(Boolean);
  if (data.length > 0) {
    sendError(JSON.stringify(Object.assign({
      type: "error",
      data
    }, errorExtra)));
  }
}
function setSendError(value, extra = {}) {
  sendError = value;
  Object.assign(errorExtra, extra);
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index !== "undefined") {
    if (typeof index.onError === "function") {
      index.onError(onError2);
    }
    if (typeof index.onUnhandledRejection === "function") {
      index.onUnhandledRejection(onError2);
    }
  }
  return function offError2() {
    if (typeof index !== "undefined") {
      if (typeof index.offError === "function") {
        index.offError(onError2);
      }
      if (typeof index.offUnhandledRejection === "function") {
        index.offUnhandledRejection(onError2);
      }
    }
  };
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  const type = typeof arg;
  switch (type) {
    case "string":
      return formatString(arg);
    case "number":
      return formatNumber(arg);
    case "boolean":
      return formatBoolean(arg);
    case "object":
      try {
        return formatObject(arg, depth);
      } catch (e2) {
        return {
          type: "object",
          value: {
            properties: []
          }
        };
      }
    case "undefined":
      return formatUndefined();
    case "function":
      return formatFunction(arg);
    case "symbol": {
      return formatSymbol(arg);
    }
    case "bigint":
      return formatBigInt(arg);
  }
}
function formatFunction(value) {
  return {
    type: "function",
    value: `function ${value.name}() {}`
  };
}
function formatUndefined() {
  return {
    type: "undefined"
  };
}
function formatBoolean(value) {
  return {
    type: "boolean",
    value: String(value)
  };
}
function formatNumber(value) {
  return {
    type: "number",
    value: String(value)
  };
}
function formatBigInt(value) {
  return {
    type: "bigint",
    value: String(value)
  };
}
function formatString(value) {
  return {
    type: "string",
    value
  };
}
function formatSymbol(value) {
  return {
    type: "symbol",
    value: value.description
  };
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  {
    if (isComponentPublicInstance(value)) {
      return formatComponentPublicInstance(value, depth);
    }
    if (isComponentInternalInstance(value)) {
      return formatComponentInternalInstance(value, depth);
    }
    if (isUniElement(value)) {
      return formatUniElement(value, depth);
    }
    if (isCSSStyleDeclaration(value)) {
      return formatCSSStyleDeclaration(value, depth);
    }
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v, i) => formatArrayElement(v, i, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v) => formatSetEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v) => formatMapEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  let className = void 0;
  {
    const constructor = value.constructor;
    if (constructor) {
      if (constructor.get$UTSMetadata$) {
        className = constructor.get$UTSMetadata$().name;
      }
    }
  }
  let entries = Object.entries(value);
  if (isHarmonyBuilderParams(value)) {
    entries = entries.filter(([key]) => key !== "modifier" && key !== "nodeContent");
  }
  return {
    type: "object",
    className,
    value: {
      properties: entries.map((entry) => formatObjectProperty(entry[0], entry[1], depth + 1))
    }
  };
}
function isHarmonyBuilderParams(value) {
  return value.modifier && value.modifier._attribute && value.nodeContent;
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  const result = formatArg(value, depth);
  result.name = name;
  return result;
}
function formatArrayElement(value, index2, depth) {
  const result = formatArg(value, depth);
  result.name = `${index2}`;
  return result;
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
let sendConsole = null;
const messageQueue = [];
const messageExtra = {};
const EXCEPTION_BEGIN_MARK = "---BEGIN:EXCEPTION---";
const EXCEPTION_END_MARK = "---END:EXCEPTION---";
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify(Object.assign({
    type: "console",
    data: messages
  }, messageExtra)));
}
function setSendConsole(value, extra = {}) {
  sendConsole = value;
  Object.assign(messageExtra, extra);
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const atFileRegex = /^\s*at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      {
        const originalArgs = [...args];
        if (originalArgs.length) {
          const maybeAtFile = originalArgs[originalArgs.length - 1];
          if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
            originalArgs.pop();
          }
        }
        originalConsole[type](...originalArgs);
      }
      if (type === "error" && args.length === 1) {
        const arg = args[0];
        if (typeof arg === "string" && arg.startsWith(EXCEPTION_BEGIN_MARK)) {
          const startIndex = EXCEPTION_BEGIN_MARK.length;
          const endIndex = arg.length - EXCEPTION_END_MARK.length;
          sendErrorMessages([arg.slice(startIndex, endIndex)]);
          return;
        } else if (arg instanceof Error) {
          sendErrorMessages([arg]);
          return;
        }
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    {
      if (typeof index !== "undefined" && index.__f__) {
        const oldLog = index.__f__;
        if (oldLog) {
          index.__f__ = function(...args) {
            const [type, filename, ...rest] = args;
            oldLog(type, "", ...rest);
            sendConsoleMessages([formatMessage(type, [...rest, filename])]);
          };
          return function restoreConsole() {
            index.__f__ = oldLog;
          };
        }
      }
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function initRuntimeSocketService() {
  const hosts = "10.39.26.211,127.0.0.1";
  const port = "8090";
  const id = "mp-weixin_wcc95p";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        {
          originalConsole.error(wrapError("小程序平台，请勾选不校验合法域名配置。"));
        }
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      {
        initMiniProgramGlobalFlag();
      }
      socket.onClose(() => {
        {
          originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        }
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray$1(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale$1(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray$1(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks2 = this.$[name];
  if (hooks2 && hooks2.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks2 = this.$[name];
  return hooks2 && invokeArrayFns(hooks2, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks2 = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks2.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks2));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks2);
      }
    }
  }
  return hooks2;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks2, excludes = EXCLUDE_HOOKS) {
  hooks2.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks2 = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks2.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray$1(mixins)) {
      const hooks2 = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks2.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend$1(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction$1(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction$1(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction$1(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction$1(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale2 = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale2.value;
    },
    set(v) {
      locale2.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend$1(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray$1(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray$1(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject$1(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject$1(opts)) {
        let value = opts.default;
        if (isFunction$1(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject$1(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray$1(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray$1(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray$1(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray$1(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$1(item.options)) {
        extend$1(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend$1(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
var isVue2 = false;
function set$2(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = Symbol("pinia");
function isPlainObject(o2) {
  return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = typeof window !== "undefined";
const USE_DEVTOOLS = IS_CLIENT;
const componentStateTypes = [];
const getStoreType = (id) => "🍍 " + id;
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
}
function patchActionForGrouping(store, actionNames, wrapWithProxy) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const trackedStore = wrapWithProxy ? new Proxy(store, {
        get(...args) {
          return Reflect.get(...args);
        },
        set(...args) {
          return Reflect.set(...args);
        }
      }) : store;
      const retValue = actions[actionName].apply(trackedStore, arguments);
      return retValue;
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  store._isOptionsAPI = !!options.state;
  patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
  const originalHotUpdate = store._hotUpdate;
  toRaw(store)._hotUpdate = function(newStore) {
    originalHotUpdate.apply(this, arguments);
    patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
  };
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function patchObject(newState, oldState) {
  for (const key in oldState) {
    const subPatch = oldState[key];
    if (!(key in newState)) {
      continue;
    }
    const targetValue = newState[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && !isRef(subPatch) && !isReactive(subPatch)) {
      newState[key] = patchObject(targetValue, subPatch);
    } else {
      {
        newState[key] = subPatch;
      }
    }
  }
  return newState;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = Symbol("pinia:skipHydration");
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o2) {
  return !!(isRef(o2) && o2.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && !hot) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = hot ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      toRefs(ref(state ? state() : {}).value)
    ) : toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (name in localState) {
        console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
      }
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  if (!pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
        }
      }
    };
  }
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && !hot) {
    {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick$1().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    () => {
      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    }
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError2(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError: onError2
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const _hmrPayload = /* @__PURE__ */ markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(assign(
    {
      _hmrPayload,
      _customProperties: markRaw(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    partialStore
    // must be added later
    // setupStore
  ));
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(setup)));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (hot) {
        set$2(hotState.value, key, toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
      {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = hot ? prop : wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore ? (
          // @ts-expect-error
          options.getters[key]
        ) : prop;
        if (IS_CLIENT) {
          const getters = setupStore._getters || // @ts-expect-error: same
          (setupStore._getters = markRaw([]));
          getters.push(key);
        }
      }
    }
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => hot ? hotState.value : pinia.state.value[$id],
    set: (state) => {
      if (hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        set$2(store, stateKey, toRef(newStore.$state, stateKey));
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = toRef(newStore._hmrPayload, "hotState");
      isSyncListening = true;
      nextTick$1().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const action = newStore[actionName];
        set$2(store, actionName, wrapAction(actionName, action));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore ? (
          // special handling of options api
          computed(() => {
            setActivePinia(pinia);
            return getter.call(store, store);
          })
        ) : getter;
        set$2(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if (USE_DEVTOOLS) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
    });
  }
  pinia._p.forEach((extender) => {
    if (USE_DEVTOOLS) {
      const extensions = scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      }));
      Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
      assign(store, extensions);
    } else {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
    console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
    if (typeof id !== "string") {
      throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
    }
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    if (!activePinia) {
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (IS_CLIENT) {
      const currentInstance2 = getCurrentInstance();
      if (currentInstance2 && currentInstance2.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance2.proxy;
        const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache[id] = store;
      }
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
//! moment.js
//! version : 2.30.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
var hookCallback;
function hooks() {
  return hookCallback.apply(null, arguments);
}
function setHookCallback(callback) {
  hookCallback = callback;
}
function isArray(input) {
  return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
}
function isObject(input) {
  return input != null && Object.prototype.toString.call(input) === "[object Object]";
}
function hasOwnProp(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
function isObjectEmpty(obj) {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  } else {
    var k;
    for (k in obj) {
      if (hasOwnProp(obj, k)) {
        return false;
      }
    }
    return true;
  }
}
function isUndefined(input) {
  return input === void 0;
}
function isNumber(input) {
  return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
}
function isDate(input) {
  return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
}
function map(arr, fn) {
  var res = [], i, arrLen = arr.length;
  for (i = 0; i < arrLen; ++i) {
    res.push(fn(arr[i], i));
  }
  return res;
}
function extend(a, b) {
  for (var i in b) {
    if (hasOwnProp(b, i)) {
      a[i] = b[i];
    }
  }
  if (hasOwnProp(b, "toString")) {
    a.toString = b.toString;
  }
  if (hasOwnProp(b, "valueOf")) {
    a.valueOf = b.valueOf;
  }
  return a;
}
function createUTC(input, format2, locale2, strict) {
  return createLocalOrUTC(input, format2, locale2, strict, true).utc();
}
function defaultParsingFlags() {
  return {
    empty: false,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: false,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: false,
    userInvalidated: false,
    iso: false,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: false,
    weekdayMismatch: false
  };
}
function getParsingFlags(m) {
  if (m._pf == null) {
    m._pf = defaultParsingFlags();
  }
  return m._pf;
}
var some;
if (Array.prototype.some) {
  some = Array.prototype.some;
} else {
  some = function(fun) {
    var t2 = Object(this), len = t2.length >>> 0, i;
    for (i = 0; i < len; i++) {
      if (i in t2 && fun.call(this, t2[i], i, t2)) {
        return true;
      }
    }
    return false;
  };
}
function isValid(m) {
  var flags = null, parsedParts = false, isNowValid = m._d && !isNaN(m._d.getTime());
  if (isNowValid) {
    flags = getParsingFlags(m);
    parsedParts = some.call(flags.parsedDateParts, function(i) {
      return i != null;
    });
    isNowValid = flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
    if (m._strict) {
      isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
    }
  }
  if (Object.isFrozen == null || !Object.isFrozen(m)) {
    m._isValid = isNowValid;
  } else {
    return isNowValid;
  }
  return m._isValid;
}
function createInvalid(flags) {
  var m = createUTC(NaN);
  if (flags != null) {
    extend(getParsingFlags(m), flags);
  } else {
    getParsingFlags(m).userInvalidated = true;
  }
  return m;
}
var momentProperties = hooks.momentProperties = [], updateInProgress = false;
function copyConfig(to2, from2) {
  var i, prop, val, momentPropertiesLen = momentProperties.length;
  if (!isUndefined(from2._isAMomentObject)) {
    to2._isAMomentObject = from2._isAMomentObject;
  }
  if (!isUndefined(from2._i)) {
    to2._i = from2._i;
  }
  if (!isUndefined(from2._f)) {
    to2._f = from2._f;
  }
  if (!isUndefined(from2._l)) {
    to2._l = from2._l;
  }
  if (!isUndefined(from2._strict)) {
    to2._strict = from2._strict;
  }
  if (!isUndefined(from2._tzm)) {
    to2._tzm = from2._tzm;
  }
  if (!isUndefined(from2._isUTC)) {
    to2._isUTC = from2._isUTC;
  }
  if (!isUndefined(from2._offset)) {
    to2._offset = from2._offset;
  }
  if (!isUndefined(from2._pf)) {
    to2._pf = getParsingFlags(from2);
  }
  if (!isUndefined(from2._locale)) {
    to2._locale = from2._locale;
  }
  if (momentPropertiesLen > 0) {
    for (i = 0; i < momentPropertiesLen; i++) {
      prop = momentProperties[i];
      val = from2[prop];
      if (!isUndefined(val)) {
        to2[prop] = val;
      }
    }
  }
  return to2;
}
function Moment(config) {
  copyConfig(this, config);
  this._d = new Date(config._d != null ? config._d.getTime() : NaN);
  if (!this.isValid()) {
    this._d = /* @__PURE__ */ new Date(NaN);
  }
  if (updateInProgress === false) {
    updateInProgress = true;
    hooks.updateOffset(this);
    updateInProgress = false;
  }
}
function isMoment(obj) {
  return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
}
function warn(msg) {
  if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
    index.__f__("warn", "at node_modules/moment/dist/moment.js:281", "Deprecation warning: " + msg);
  }
}
function deprecate(msg, fn) {
  var firstTime = true;
  return extend(function() {
    if (hooks.deprecationHandler != null) {
      hooks.deprecationHandler(null, msg);
    }
    if (firstTime) {
      var args = [], arg, i, key, argLen = arguments.length;
      for (i = 0; i < argLen; i++) {
        arg = "";
        if (typeof arguments[i] === "object") {
          arg += "\n[" + i + "] ";
          for (key in arguments[0]) {
            if (hasOwnProp(arguments[0], key)) {
              arg += key + ": " + arguments[0][key] + ", ";
            }
          }
          arg = arg.slice(0, -2);
        } else {
          arg = arguments[i];
        }
        args.push(arg);
      }
      warn(
        msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
      );
      firstTime = false;
    }
    return fn.apply(this, arguments);
  }, fn);
}
var deprecations = {};
function deprecateSimple(name, msg) {
  if (hooks.deprecationHandler != null) {
    hooks.deprecationHandler(name, msg);
  }
  if (!deprecations[name]) {
    warn(msg);
    deprecations[name] = true;
  }
}
hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;
function isFunction(input) {
  return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
}
function set(config) {
  var prop, i;
  for (i in config) {
    if (hasOwnProp(config, i)) {
      prop = config[i];
      if (isFunction(prop)) {
        this[i] = prop;
      } else {
        this["_" + i] = prop;
      }
    }
  }
  this._config = config;
  this._dayOfMonthOrdinalParseLenient = new RegExp(
    (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
  );
}
function mergeConfigs(parentConfig, childConfig) {
  var res = extend({}, parentConfig), prop;
  for (prop in childConfig) {
    if (hasOwnProp(childConfig, prop)) {
      if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
        res[prop] = {};
        extend(res[prop], parentConfig[prop]);
        extend(res[prop], childConfig[prop]);
      } else if (childConfig[prop] != null) {
        res[prop] = childConfig[prop];
      } else {
        delete res[prop];
      }
    }
  }
  for (prop in parentConfig) {
    if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
      res[prop] = extend({}, res[prop]);
    }
  }
  return res;
}
function Locale(config) {
  if (config != null) {
    this.set(config);
  }
}
var keys;
if (Object.keys) {
  keys = Object.keys;
} else {
  keys = function(obj) {
    var i, res = [];
    for (i in obj) {
      if (hasOwnProp(obj, i)) {
        res.push(i);
      }
    }
    return res;
  };
}
var defaultCalendar = {
  sameDay: "[Today at] LT",
  nextDay: "[Tomorrow at] LT",
  nextWeek: "dddd [at] LT",
  lastDay: "[Yesterday at] LT",
  lastWeek: "[Last] dddd [at] LT",
  sameElse: "L"
};
function calendar(key, mom, now2) {
  var output = this._calendar[key] || this._calendar["sameElse"];
  return isFunction(output) ? output.call(mom, now2) : output;
}
function zeroFill(number, targetLength, forceSign) {
  var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
  return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}
var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
function addFormatToken(token2, padded, ordinal2, callback) {
  var func = callback;
  if (typeof callback === "string") {
    func = function() {
      return this[callback]();
    };
  }
  if (token2) {
    formatTokenFunctions[token2] = func;
  }
  if (padded) {
    formatTokenFunctions[padded[0]] = function() {
      return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
    };
  }
  if (ordinal2) {
    formatTokenFunctions[ordinal2] = function() {
      return this.localeData().ordinal(
        func.apply(this, arguments),
        token2
      );
    };
  }
}
function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, "");
  }
  return input.replace(/\\/g, "");
}
function makeFormatFunction(format2) {
  var array = format2.match(formattingTokens), i, length;
  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }
  return function(mom) {
    var output = "", i2;
    for (i2 = 0; i2 < length; i2++) {
      output += isFunction(array[i2]) ? array[i2].call(mom, format2) : array[i2];
    }
    return output;
  };
}
function formatMoment(m, format2) {
  if (!m.isValid()) {
    return m.localeData().invalidDate();
  }
  format2 = expandFormat(format2, m.localeData());
  formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
  return formatFunctions[format2](m);
}
function expandFormat(format2, locale2) {
  var i = 5;
  function replaceLongDateFormatTokens(input) {
    return locale2.longDateFormat(input) || input;
  }
  localFormattingTokens.lastIndex = 0;
  while (i >= 0 && localFormattingTokens.test(format2)) {
    format2 = format2.replace(
      localFormattingTokens,
      replaceLongDateFormatTokens
    );
    localFormattingTokens.lastIndex = 0;
    i -= 1;
  }
  return format2;
}
var defaultLongDateFormat = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
function longDateFormat(key) {
  var format2 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
  if (format2 || !formatUpper) {
    return format2;
  }
  this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
    if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
      return tok.slice(1);
    }
    return tok;
  }).join("");
  return this._longDateFormat[key];
}
var defaultInvalidDate = "Invalid date";
function invalidDate() {
  return this._invalidDate;
}
var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
function ordinal(number) {
  return this._ordinal.replace("%d", number);
}
var defaultRelativeTime = {
  future: "in %s",
  past: "%s ago",
  s: "a few seconds",
  ss: "%d seconds",
  m: "a minute",
  mm: "%d minutes",
  h: "an hour",
  hh: "%d hours",
  d: "a day",
  dd: "%d days",
  w: "a week",
  ww: "%d weeks",
  M: "a month",
  MM: "%d months",
  y: "a year",
  yy: "%d years"
};
function relativeTime(number, withoutSuffix, string, isFuture) {
  var output = this._relativeTime[string];
  return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
}
function pastFuture(diff2, output) {
  var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
  return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
}
var aliases = {
  D: "date",
  dates: "date",
  date: "date",
  d: "day",
  days: "day",
  day: "day",
  e: "weekday",
  weekdays: "weekday",
  weekday: "weekday",
  E: "isoWeekday",
  isoweekdays: "isoWeekday",
  isoweekday: "isoWeekday",
  DDD: "dayOfYear",
  dayofyears: "dayOfYear",
  dayofyear: "dayOfYear",
  h: "hour",
  hours: "hour",
  hour: "hour",
  ms: "millisecond",
  milliseconds: "millisecond",
  millisecond: "millisecond",
  m: "minute",
  minutes: "minute",
  minute: "minute",
  M: "month",
  months: "month",
  month: "month",
  Q: "quarter",
  quarters: "quarter",
  quarter: "quarter",
  s: "second",
  seconds: "second",
  second: "second",
  gg: "weekYear",
  weekyears: "weekYear",
  weekyear: "weekYear",
  GG: "isoWeekYear",
  isoweekyears: "isoWeekYear",
  isoweekyear: "isoWeekYear",
  w: "week",
  weeks: "week",
  week: "week",
  W: "isoWeek",
  isoweeks: "isoWeek",
  isoweek: "isoWeek",
  y: "year",
  years: "year",
  year: "year"
};
function normalizeUnits(units) {
  return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
}
function normalizeObjectUnits(inputObject) {
  var normalizedInput = {}, normalizedProp, prop;
  for (prop in inputObject) {
    if (hasOwnProp(inputObject, prop)) {
      normalizedProp = normalizeUnits(prop);
      if (normalizedProp) {
        normalizedInput[normalizedProp] = inputObject[prop];
      }
    }
  }
  return normalizedInput;
}
var priorities = {
  date: 9,
  day: 11,
  weekday: 11,
  isoWeekday: 11,
  dayOfYear: 4,
  hour: 13,
  millisecond: 16,
  minute: 14,
  month: 8,
  quarter: 7,
  second: 15,
  weekYear: 1,
  isoWeekYear: 1,
  week: 5,
  isoWeek: 5,
  year: 1
};
function getPrioritizedUnits(unitsObj) {
  var units = [], u;
  for (u in unitsObj) {
    if (hasOwnProp(unitsObj, u)) {
      units.push({ unit: u, priority: priorities[u] });
    }
  }
  units.sort(function(a, b) {
    return a.priority - b.priority;
  });
  return units;
}
var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, match1to2NoLeadingZero = /^[1-9]\d?/, match1to2HasZero = /^([1-9]\d|\d)/, regexes;
regexes = {};
function addRegexToken(token2, regex, strictRegex) {
  regexes[token2] = isFunction(regex) ? regex : function(isStrict, localeData2) {
    return isStrict && strictRegex ? strictRegex : regex;
  };
}
function getParseRegexForToken(token2, config) {
  if (!hasOwnProp(regexes, token2)) {
    return new RegExp(unescapeFormat(token2));
  }
  return regexes[token2](config._strict, config._locale);
}
function unescapeFormat(s) {
  return regexEscape(
    s.replace("\\", "").replace(
      /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
      function(matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
      }
    )
  );
}
function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function absFloor(number) {
  if (number < 0) {
    return Math.ceil(number) || 0;
  } else {
    return Math.floor(number);
  }
}
function toInt(argumentForCoercion) {
  var coercedNumber = +argumentForCoercion, value = 0;
  if (coercedNumber !== 0 && isFinite(coercedNumber)) {
    value = absFloor(coercedNumber);
  }
  return value;
}
var tokens = {};
function addParseToken(token2, callback) {
  var i, func = callback, tokenLen;
  if (typeof token2 === "string") {
    token2 = [token2];
  }
  if (isNumber(callback)) {
    func = function(input, array) {
      array[callback] = toInt(input);
    };
  }
  tokenLen = token2.length;
  for (i = 0; i < tokenLen; i++) {
    tokens[token2[i]] = func;
  }
}
function addWeekParseToken(token2, callback) {
  addParseToken(token2, function(input, array, config, token3) {
    config._w = config._w || {};
    callback(input, config._w, config, token3);
  });
}
function addTimeToArrayFromToken(token2, input, config) {
  if (input != null && hasOwnProp(tokens, token2)) {
    tokens[token2](input, config._a, config, token2);
  }
}
function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
addFormatToken("Y", 0, 0, function() {
  var y = this.year();
  return y <= 9999 ? zeroFill(y, 4) : "+" + y;
});
addFormatToken(0, ["YY", 2], 0, function() {
  return this.year() % 100;
});
addFormatToken(0, ["YYYY", 4], 0, "year");
addFormatToken(0, ["YYYYY", 5], 0, "year");
addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
addRegexToken("Y", matchSigned);
addRegexToken("YY", match1to2, match2);
addRegexToken("YYYY", match1to4, match4);
addRegexToken("YYYYY", match1to6, match6);
addRegexToken("YYYYYY", match1to6, match6);
addParseToken(["YYYYY", "YYYYYY"], YEAR);
addParseToken("YYYY", function(input, array) {
  array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken("YY", function(input, array) {
  array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken("Y", function(input, array) {
  array[YEAR] = parseInt(input, 10);
});
function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}
hooks.parseTwoDigitYear = function(input) {
  return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
};
var getSetYear = makeGetSet("FullYear", true);
function getIsLeapYear() {
  return isLeapYear(this.year());
}
function makeGetSet(unit, keepTime) {
  return function(value) {
    if (value != null) {
      set$1(this, unit, value);
      hooks.updateOffset(this, keepTime);
      return this;
    } else {
      return get(this, unit);
    }
  };
}
function get(mom, unit) {
  if (!mom.isValid()) {
    return NaN;
  }
  var d = mom._d, isUTC = mom._isUTC;
  switch (unit) {
    case "Milliseconds":
      return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
    case "Seconds":
      return isUTC ? d.getUTCSeconds() : d.getSeconds();
    case "Minutes":
      return isUTC ? d.getUTCMinutes() : d.getMinutes();
    case "Hours":
      return isUTC ? d.getUTCHours() : d.getHours();
    case "Date":
      return isUTC ? d.getUTCDate() : d.getDate();
    case "Day":
      return isUTC ? d.getUTCDay() : d.getDay();
    case "Month":
      return isUTC ? d.getUTCMonth() : d.getMonth();
    case "FullYear":
      return isUTC ? d.getUTCFullYear() : d.getFullYear();
    default:
      return NaN;
  }
}
function set$1(mom, unit, value) {
  var d, isUTC, year, month, date;
  if (!mom.isValid() || isNaN(value)) {
    return;
  }
  d = mom._d;
  isUTC = mom._isUTC;
  switch (unit) {
    case "Milliseconds":
      return void (isUTC ? d.setUTCMilliseconds(value) : d.setMilliseconds(value));
    case "Seconds":
      return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
    case "Minutes":
      return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
    case "Hours":
      return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
    case "Date":
      return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
    case "FullYear":
      break;
    default:
      return;
  }
  year = value;
  month = mom.month();
  date = mom.date();
  date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;
  void (isUTC ? d.setUTCFullYear(year, month, date) : d.setFullYear(year, month, date));
}
function stringGet(units) {
  units = normalizeUnits(units);
  if (isFunction(this[units])) {
    return this[units]();
  }
  return this;
}
function stringSet(units, value) {
  if (typeof units === "object") {
    units = normalizeObjectUnits(units);
    var prioritized = getPrioritizedUnits(units), i, prioritizedLen = prioritized.length;
    for (i = 0; i < prioritizedLen; i++) {
      this[prioritized[i].unit](units[prioritized[i].unit]);
    }
  } else {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
      return this[units](value);
    }
  }
  return this;
}
function mod(n, x) {
  return (n % x + x) % x;
}
var indexOf;
if (Array.prototype.indexOf) {
  indexOf = Array.prototype.indexOf;
} else {
  indexOf = function(o2) {
    var i;
    for (i = 0; i < this.length; ++i) {
      if (this[i] === o2) {
        return i;
      }
    }
    return -1;
  };
}
function daysInMonth(year, month) {
  if (isNaN(year) || isNaN(month)) {
    return NaN;
  }
  var modMonth = mod(month, 12);
  year += (month - modMonth) / 12;
  return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
}
addFormatToken("M", ["MM", 2], "Mo", function() {
  return this.month() + 1;
});
addFormatToken("MMM", 0, 0, function(format2) {
  return this.localeData().monthsShort(this, format2);
});
addFormatToken("MMMM", 0, 0, function(format2) {
  return this.localeData().months(this, format2);
});
addRegexToken("M", match1to2, match1to2NoLeadingZero);
addRegexToken("MM", match1to2, match2);
addRegexToken("MMM", function(isStrict, locale2) {
  return locale2.monthsShortRegex(isStrict);
});
addRegexToken("MMMM", function(isStrict, locale2) {
  return locale2.monthsRegex(isStrict);
});
addParseToken(["M", "MM"], function(input, array) {
  array[MONTH] = toInt(input) - 1;
});
addParseToken(["MMM", "MMMM"], function(input, array, config, token2) {
  var month = config._locale.monthsParse(input, token2, config._strict);
  if (month != null) {
    array[MONTH] = month;
  } else {
    getParsingFlags(config).invalidMonth = input;
  }
});
var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
  "_"
), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
function localeMonths(m, format2) {
  if (!m) {
    return isArray(this._months) ? this._months : this._months["standalone"];
  }
  return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m.month()];
}
function localeMonthsShort(m, format2) {
  if (!m) {
    return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
  }
  return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m.month()];
}
function handleStrictParse(monthName, format2, strict) {
  var i, ii, mom, llc = monthName.toLocaleLowerCase();
  if (!this._monthsParse) {
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
    for (i = 0; i < 12; ++i) {
      mom = createUTC([2e3, i]);
      this._shortMonthsParse[i] = this.monthsShort(
        mom,
        ""
      ).toLocaleLowerCase();
      this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
    }
  }
  if (strict) {
    if (format2 === "MMM") {
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format2 === "MMM") {
      ii = indexOf.call(this._shortMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._longMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}
function localeMonthsParse(monthName, format2, strict) {
  var i, mom, regex;
  if (this._monthsParseExact) {
    return handleStrictParse.call(this, monthName, format2, strict);
  }
  if (!this._monthsParse) {
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
  }
  for (i = 0; i < 12; i++) {
    mom = createUTC([2e3, i]);
    if (strict && !this._longMonthsParse[i]) {
      this._longMonthsParse[i] = new RegExp(
        "^" + this.months(mom, "").replace(".", "") + "$",
        "i"
      );
      this._shortMonthsParse[i] = new RegExp(
        "^" + this.monthsShort(mom, "").replace(".", "") + "$",
        "i"
      );
    }
    if (!strict && !this._monthsParse[i]) {
      regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
      this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
    }
    if (strict && format2 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
      return i;
    } else if (strict && format2 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
      return i;
    } else if (!strict && this._monthsParse[i].test(monthName)) {
      return i;
    }
  }
}
function setMonth(mom, value) {
  if (!mom.isValid()) {
    return mom;
  }
  if (typeof value === "string") {
    if (/^\d+$/.test(value)) {
      value = toInt(value);
    } else {
      value = mom.localeData().monthsParse(value);
      if (!isNumber(value)) {
        return mom;
      }
    }
  }
  var month = value, date = mom.date();
  date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
  void (mom._isUTC ? mom._d.setUTCMonth(month, date) : mom._d.setMonth(month, date));
  return mom;
}
function getSetMonth(value) {
  if (value != null) {
    setMonth(this, value);
    hooks.updateOffset(this, true);
    return this;
  } else {
    return get(this, "Month");
  }
}
function getDaysInMonth() {
  return daysInMonth(this.year(), this.month());
}
function monthsShortRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!hasOwnProp(this, "_monthsRegex")) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsShortStrictRegex;
    } else {
      return this._monthsShortRegex;
    }
  } else {
    if (!hasOwnProp(this, "_monthsShortRegex")) {
      this._monthsShortRegex = defaultMonthsShortRegex;
    }
    return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
  }
}
function monthsRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!hasOwnProp(this, "_monthsRegex")) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsStrictRegex;
    } else {
      return this._monthsRegex;
    }
  } else {
    if (!hasOwnProp(this, "_monthsRegex")) {
      this._monthsRegex = defaultMonthsRegex;
    }
    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
  }
}
function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }
  var shortPieces = [], longPieces = [], mixedPieces = [], i, mom, shortP, longP;
  for (i = 0; i < 12; i++) {
    mom = createUTC([2e3, i]);
    shortP = regexEscape(this.monthsShort(mom, ""));
    longP = regexEscape(this.months(mom, ""));
    shortPieces.push(shortP);
    longPieces.push(longP);
    mixedPieces.push(longP);
    mixedPieces.push(shortP);
  }
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
  this._monthsShortRegex = this._monthsRegex;
  this._monthsStrictRegex = new RegExp(
    "^(" + longPieces.join("|") + ")",
    "i"
  );
  this._monthsShortStrictRegex = new RegExp(
    "^(" + shortPieces.join("|") + ")",
    "i"
  );
}
function createDate(y, m, d, h, M, s, ms) {
  var date;
  if (y < 100 && y >= 0) {
    date = new Date(y + 400, m, d, h, M, s, ms);
    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }
  return date;
}
function createUTCDate(y) {
  var date, args;
  if (y < 100 && y >= 0) {
    args = Array.prototype.slice.call(arguments);
    args[0] = y + 400;
    date = new Date(Date.UTC.apply(null, args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(null, arguments));
  }
  return date;
}
function firstWeekOffset(year, dow, doy) {
  var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
  return -fwdlw + fwd - 1;
}
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
  var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
  if (dayOfYear <= 0) {
    resYear = year - 1;
    resDayOfYear = daysInYear(resYear) + dayOfYear;
  } else if (dayOfYear > daysInYear(year)) {
    resYear = year + 1;
    resDayOfYear = dayOfYear - daysInYear(year);
  } else {
    resYear = year;
    resDayOfYear = dayOfYear;
  }
  return {
    year: resYear,
    dayOfYear: resDayOfYear
  };
}
function weekOfYear(mom, dow, doy) {
  var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
  if (week < 1) {
    resYear = mom.year() - 1;
    resWeek = week + weeksInYear(resYear, dow, doy);
  } else if (week > weeksInYear(mom.year(), dow, doy)) {
    resWeek = week - weeksInYear(mom.year(), dow, doy);
    resYear = mom.year() + 1;
  } else {
    resYear = mom.year();
    resWeek = week;
  }
  return {
    week: resWeek,
    year: resYear
  };
}
function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}
addFormatToken("w", ["ww", 2], "wo", "week");
addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
addRegexToken("w", match1to2, match1to2NoLeadingZero);
addRegexToken("ww", match1to2, match2);
addRegexToken("W", match1to2, match1to2NoLeadingZero);
addRegexToken("WW", match1to2, match2);
addWeekParseToken(
  ["w", "ww", "W", "WW"],
  function(input, week, config, token2) {
    week[token2.substr(0, 1)] = toInt(input);
  }
);
function localeWeek(mom) {
  return weekOfYear(mom, this._week.dow, this._week.doy).week;
}
var defaultLocaleWeek = {
  dow: 0,
  // Sunday is the first day of the week.
  doy: 6
  // The week that contains Jan 6th is the first week of the year.
};
function localeFirstDayOfWeek() {
  return this._week.dow;
}
function localeFirstDayOfYear() {
  return this._week.doy;
}
function getSetWeek(input) {
  var week = this.localeData().week(this);
  return input == null ? week : this.add((input - week) * 7, "d");
}
function getSetISOWeek(input) {
  var week = weekOfYear(this, 1, 4).week;
  return input == null ? week : this.add((input - week) * 7, "d");
}
addFormatToken("d", 0, "do", "day");
addFormatToken("dd", 0, 0, function(format2) {
  return this.localeData().weekdaysMin(this, format2);
});
addFormatToken("ddd", 0, 0, function(format2) {
  return this.localeData().weekdaysShort(this, format2);
});
addFormatToken("dddd", 0, 0, function(format2) {
  return this.localeData().weekdays(this, format2);
});
addFormatToken("e", 0, 0, "weekday");
addFormatToken("E", 0, 0, "isoWeekday");
addRegexToken("d", match1to2);
addRegexToken("e", match1to2);
addRegexToken("E", match1to2);
addRegexToken("dd", function(isStrict, locale2) {
  return locale2.weekdaysMinRegex(isStrict);
});
addRegexToken("ddd", function(isStrict, locale2) {
  return locale2.weekdaysShortRegex(isStrict);
});
addRegexToken("dddd", function(isStrict, locale2) {
  return locale2.weekdaysRegex(isStrict);
});
addWeekParseToken(["dd", "ddd", "dddd"], function(input, week, config, token2) {
  var weekday = config._locale.weekdaysParse(input, token2, config._strict);
  if (weekday != null) {
    week.d = weekday;
  } else {
    getParsingFlags(config).invalidWeekday = input;
  }
});
addWeekParseToken(["d", "e", "E"], function(input, week, config, token2) {
  week[token2] = toInt(input);
});
function parseWeekday(input, locale2) {
  if (typeof input !== "string") {
    return input;
  }
  if (!isNaN(input)) {
    return parseInt(input, 10);
  }
  input = locale2.weekdaysParse(input);
  if (typeof input === "number") {
    return input;
  }
  return null;
}
function parseIsoWeekday(input, locale2) {
  if (typeof input === "string") {
    return locale2.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
}
function shiftWeekdays(ws, n) {
  return ws.slice(n, 7).concat(ws.slice(0, n));
}
var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
function localeWeekdays(m, format2) {
  var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
  return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
}
function localeWeekdaysShort(m) {
  return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}
function localeWeekdaysMin(m) {
  return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}
function handleStrictParse$1(weekdayName, format2, strict) {
  var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._minWeekdaysParse = [];
    for (i = 0; i < 7; ++i) {
      mom = createUTC([2e3, 1]).day(i);
      this._minWeekdaysParse[i] = this.weekdaysMin(
        mom,
        ""
      ).toLocaleLowerCase();
      this._shortWeekdaysParse[i] = this.weekdaysShort(
        mom,
        ""
      ).toLocaleLowerCase();
      this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
    }
  }
  if (strict) {
    if (format2 === "dddd") {
      ii = indexOf.call(this._weekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format2 === "ddd") {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format2 === "dddd") {
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format2 === "ddd") {
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = indexOf.call(this._minWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = indexOf.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}
function localeWeekdaysParse(weekdayName, format2, strict) {
  var i, mom, regex;
  if (this._weekdaysParseExact) {
    return handleStrictParse$1.call(this, weekdayName, format2, strict);
  }
  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._minWeekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._fullWeekdaysParse = [];
  }
  for (i = 0; i < 7; i++) {
    mom = createUTC([2e3, 1]).day(i);
    if (strict && !this._fullWeekdaysParse[i]) {
      this._fullWeekdaysParse[i] = new RegExp(
        "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
        "i"
      );
      this._shortWeekdaysParse[i] = new RegExp(
        "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
        "i"
      );
      this._minWeekdaysParse[i] = new RegExp(
        "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
        "i"
      );
    }
    if (!this._weekdaysParse[i]) {
      regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
      this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
    }
    if (strict && format2 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format2 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
      return i;
    }
  }
}
function getSetDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var day = get(this, "Day");
  if (input != null) {
    input = parseWeekday(input, this.localeData());
    return this.add(input - day, "d");
  } else {
    return day;
  }
}
function getSetLocaleDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return input == null ? weekday : this.add(input - weekday, "d");
}
function getSetISODayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  if (input != null) {
    var weekday = parseIsoWeekday(input, this.localeData());
    return this.day(this.day() % 7 ? weekday : weekday - 7);
  } else {
    return this.day() || 7;
  }
}
function weekdaysRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, "_weekdaysRegex")) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysStrictRegex;
    } else {
      return this._weekdaysRegex;
    }
  } else {
    if (!hasOwnProp(this, "_weekdaysRegex")) {
      this._weekdaysRegex = defaultWeekdaysRegex;
    }
    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
  }
}
function weekdaysShortRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, "_weekdaysRegex")) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysShortStrictRegex;
    } else {
      return this._weekdaysShortRegex;
    }
  } else {
    if (!hasOwnProp(this, "_weekdaysShortRegex")) {
      this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    }
    return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
  }
}
function weekdaysMinRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!hasOwnProp(this, "_weekdaysRegex")) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysMinStrictRegex;
    } else {
      return this._weekdaysMinRegex;
    }
  } else {
    if (!hasOwnProp(this, "_weekdaysMinRegex")) {
      this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    }
    return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
  }
}
function computeWeekdaysParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }
  var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
  for (i = 0; i < 7; i++) {
    mom = createUTC([2e3, 1]).day(i);
    minp = regexEscape(this.weekdaysMin(mom, ""));
    shortp = regexEscape(this.weekdaysShort(mom, ""));
    longp = regexEscape(this.weekdays(mom, ""));
    minPieces.push(minp);
    shortPieces.push(shortp);
    longPieces.push(longp);
    mixedPieces.push(minp);
    mixedPieces.push(shortp);
    mixedPieces.push(longp);
  }
  minPieces.sort(cmpLenRev);
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
  this._weekdaysShortRegex = this._weekdaysRegex;
  this._weekdaysMinRegex = this._weekdaysRegex;
  this._weekdaysStrictRegex = new RegExp(
    "^(" + longPieces.join("|") + ")",
    "i"
  );
  this._weekdaysShortStrictRegex = new RegExp(
    "^(" + shortPieces.join("|") + ")",
    "i"
  );
  this._weekdaysMinStrictRegex = new RegExp(
    "^(" + minPieces.join("|") + ")",
    "i"
  );
}
function hFormat() {
  return this.hours() % 12 || 12;
}
function kFormat() {
  return this.hours() || 24;
}
addFormatToken("H", ["HH", 2], 0, "hour");
addFormatToken("h", ["hh", 2], 0, hFormat);
addFormatToken("k", ["kk", 2], 0, kFormat);
addFormatToken("hmm", 0, 0, function() {
  return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});
addFormatToken("hmmss", 0, 0, function() {
  return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});
addFormatToken("Hmm", 0, 0, function() {
  return "" + this.hours() + zeroFill(this.minutes(), 2);
});
addFormatToken("Hmmss", 0, 0, function() {
  return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
});
function meridiem(token2, lowercase) {
  addFormatToken(token2, 0, 0, function() {
    return this.localeData().meridiem(
      this.hours(),
      this.minutes(),
      lowercase
    );
  });
}
meridiem("a", true);
meridiem("A", false);
function matchMeridiem(isStrict, locale2) {
  return locale2._meridiemParse;
}
addRegexToken("a", matchMeridiem);
addRegexToken("A", matchMeridiem);
addRegexToken("H", match1to2, match1to2HasZero);
addRegexToken("h", match1to2, match1to2NoLeadingZero);
addRegexToken("k", match1to2, match1to2NoLeadingZero);
addRegexToken("HH", match1to2, match2);
addRegexToken("hh", match1to2, match2);
addRegexToken("kk", match1to2, match2);
addRegexToken("hmm", match3to4);
addRegexToken("hmmss", match5to6);
addRegexToken("Hmm", match3to4);
addRegexToken("Hmmss", match5to6);
addParseToken(["H", "HH"], HOUR);
addParseToken(["k", "kk"], function(input, array, config) {
  var kInput = toInt(input);
  array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(["a", "A"], function(input, array, config) {
  config._isPm = config._locale.isPM(input);
  config._meridiem = input;
});
addParseToken(["h", "hh"], function(input, array, config) {
  array[HOUR] = toInt(input);
  getParsingFlags(config).bigHour = true;
});
addParseToken("hmm", function(input, array, config) {
  var pos = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos));
  array[MINUTE] = toInt(input.substr(pos));
  getParsingFlags(config).bigHour = true;
});
addParseToken("hmmss", function(input, array, config) {
  var pos1 = input.length - 4, pos2 = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos1));
  array[MINUTE] = toInt(input.substr(pos1, 2));
  array[SECOND] = toInt(input.substr(pos2));
  getParsingFlags(config).bigHour = true;
});
addParseToken("Hmm", function(input, array, config) {
  var pos = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos));
  array[MINUTE] = toInt(input.substr(pos));
});
addParseToken("Hmmss", function(input, array, config) {
  var pos1 = input.length - 4, pos2 = input.length - 2;
  array[HOUR] = toInt(input.substr(0, pos1));
  array[MINUTE] = toInt(input.substr(pos1, 2));
  array[SECOND] = toInt(input.substr(pos2));
});
function localeIsPM(input) {
  return (input + "").toLowerCase().charAt(0) === "p";
}
var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
function localeMeridiem(hours2, minutes2, isLower) {
  if (hours2 > 11) {
    return isLower ? "pm" : "PM";
  } else {
    return isLower ? "am" : "AM";
  }
}
var baseConfig = {
  calendar: defaultCalendar,
  longDateFormat: defaultLongDateFormat,
  invalidDate: defaultInvalidDate,
  ordinal: defaultOrdinal,
  dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
  relativeTime: defaultRelativeTime,
  months: defaultLocaleMonths,
  monthsShort: defaultLocaleMonthsShort,
  week: defaultLocaleWeek,
  weekdays: defaultLocaleWeekdays,
  weekdaysMin: defaultLocaleWeekdaysMin,
  weekdaysShort: defaultLocaleWeekdaysShort,
  meridiemParse: defaultLocaleMeridiemParse
};
var locales = {}, localeFamilies = {}, globalLocale;
function commonPrefix(arr1, arr2) {
  var i, minl = Math.min(arr1.length, arr2.length);
  for (i = 0; i < minl; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return minl;
}
function normalizeLocale(key) {
  return key ? key.toLowerCase().replace("_", "-") : key;
}
function chooseLocale(names) {
  var i = 0, j, next, locale2, split;
  while (i < names.length) {
    split = normalizeLocale(names[i]).split("-");
    j = split.length;
    next = normalizeLocale(names[i + 1]);
    next = next ? next.split("-") : null;
    while (j > 0) {
      locale2 = loadLocale(split.slice(0, j).join("-"));
      if (locale2) {
        return locale2;
      }
      if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
        break;
      }
      j--;
    }
    i++;
  }
  return globalLocale;
}
function isLocaleNameSane(name) {
  return !!(name && name.match("^[^/\\\\]*$"));
}
function loadLocale(name) {
  var oldLocale = null, aliasedRequire;
  if (locales[name] === void 0 && typeof module !== "undefined" && module && module.exports && isLocaleNameSane(name)) {
    try {
      oldLocale = globalLocale._abbr;
      aliasedRequire = require;
      aliasedRequire("./locale/" + name);
      getSetGlobalLocale(oldLocale);
    } catch (e2) {
      locales[name] = null;
    }
  }
  return locales[name];
}
function getSetGlobalLocale(key, values) {
  var data;
  if (key) {
    if (isUndefined(values)) {
      data = getLocale(key);
    } else {
      data = defineLocale(key, values);
    }
    if (data) {
      globalLocale = data;
    } else {
      if (typeof console !== "undefined" && console.warn) {
        index.__f__(
          "warn",
          "at node_modules/moment/dist/moment.js:2188",
          "Locale " + key + " not found. Did you forget to load it?"
        );
      }
    }
  }
  return globalLocale._abbr;
}
function defineLocale(name, config) {
  if (config !== null) {
    var locale2, parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
      deprecateSimple(
        "defineLocaleOverride",
        "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
      );
      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
      if (locales[config.parentLocale] != null) {
        parentConfig = locales[config.parentLocale]._config;
      } else {
        locale2 = loadLocale(config.parentLocale);
        if (locale2 != null) {
          parentConfig = locale2._config;
        } else {
          if (!localeFamilies[config.parentLocale]) {
            localeFamilies[config.parentLocale] = [];
          }
          localeFamilies[config.parentLocale].push({
            name,
            config
          });
          return null;
        }
      }
    }
    locales[name] = new Locale(mergeConfigs(parentConfig, config));
    if (localeFamilies[name]) {
      localeFamilies[name].forEach(function(x) {
        defineLocale(x.name, x.config);
      });
    }
    getSetGlobalLocale(name);
    return locales[name];
  } else {
    delete locales[name];
    return null;
  }
}
function updateLocale(name, config) {
  if (config != null) {
    var locale2, tmpLocale, parentConfig = baseConfig;
    if (locales[name] != null && locales[name].parentLocale != null) {
      locales[name].set(mergeConfigs(locales[name]._config, config));
    } else {
      tmpLocale = loadLocale(name);
      if (tmpLocale != null) {
        parentConfig = tmpLocale._config;
      }
      config = mergeConfigs(parentConfig, config);
      if (tmpLocale == null) {
        config.abbr = name;
      }
      locale2 = new Locale(config);
      locale2.parentLocale = locales[name];
      locales[name] = locale2;
    }
    getSetGlobalLocale(name);
  } else {
    if (locales[name] != null) {
      if (locales[name].parentLocale != null) {
        locales[name] = locales[name].parentLocale;
        if (name === getSetGlobalLocale()) {
          getSetGlobalLocale(name);
        }
      } else if (locales[name] != null) {
        delete locales[name];
      }
    }
  }
  return locales[name];
}
function getLocale(key) {
  var locale2;
  if (key && key._locale && key._locale._abbr) {
    key = key._locale._abbr;
  }
  if (!key) {
    return globalLocale;
  }
  if (!isArray(key)) {
    locale2 = loadLocale(key);
    if (locale2) {
      return locale2;
    }
    key = [key];
  }
  return chooseLocale(key);
}
function listLocales() {
  return keys(locales);
}
function checkOverflow(m) {
  var overflow, a = m._a;
  if (a && getParsingFlags(m).overflow === -2) {
    overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
    if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
      overflow = DATE;
    }
    if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
      overflow = WEEK;
    }
    if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
      overflow = WEEKDAY;
    }
    getParsingFlags(m).overflow = overflow;
  }
  return m;
}
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
  ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
  ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
  ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
  ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
  ["YYYY-DDD", /\d{4}-\d{3}/],
  ["YYYY-MM", /\d{4}-\d\d/, false],
  ["YYYYYYMMDD", /[+-]\d{10}/],
  ["YYYYMMDD", /\d{8}/],
  ["GGGG[W]WWE", /\d{4}W\d{3}/],
  ["GGGG[W]WW", /\d{4}W\d{2}/, false],
  ["YYYYDDD", /\d{7}/],
  ["YYYYMM", /\d{6}/, false],
  ["YYYY", /\d{4}/, false]
], isoTimes = [
  ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
  ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
  ["HH:mm:ss", /\d\d:\d\d:\d\d/],
  ["HH:mm", /\d\d:\d\d/],
  ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
  ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
  ["HHmmss", /\d\d\d\d\d\d/],
  ["HHmm", /\d\d\d\d/],
  ["HH", /\d\d/]
], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
  UT: 0,
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function configFromISO(config) {
  var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
  if (match) {
    getParsingFlags(config).iso = true;
    for (i = 0, l = isoDatesLen; i < l; i++) {
      if (isoDates[i][1].exec(match[1])) {
        dateFormat = isoDates[i][0];
        allowTime = isoDates[i][2] !== false;
        break;
      }
    }
    if (dateFormat == null) {
      config._isValid = false;
      return;
    }
    if (match[3]) {
      for (i = 0, l = isoTimesLen; i < l; i++) {
        if (isoTimes[i][1].exec(match[3])) {
          timeFormat = (match[2] || " ") + isoTimes[i][0];
          break;
        }
      }
      if (timeFormat == null) {
        config._isValid = false;
        return;
      }
    }
    if (!allowTime && timeFormat != null) {
      config._isValid = false;
      return;
    }
    if (match[4]) {
      if (tzRegex.exec(match[4])) {
        tzFormat = "Z";
      } else {
        config._isValid = false;
        return;
      }
    }
    config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
    configFromStringAndFormat(config);
  } else {
    config._isValid = false;
  }
}
function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = [
    untruncateYear(yearStr),
    defaultLocaleMonthsShort.indexOf(monthStr),
    parseInt(dayStr, 10),
    parseInt(hourStr, 10),
    parseInt(minuteStr, 10)
  ];
  if (secondStr) {
    result.push(parseInt(secondStr, 10));
  }
  return result;
}
function untruncateYear(yearStr) {
  var year = parseInt(yearStr, 10);
  if (year <= 49) {
    return 2e3 + year;
  } else if (year <= 999) {
    return 1900 + year;
  }
  return year;
}
function preprocessRFC2822(s) {
  return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}
function checkWeekday(weekdayStr, parsedInput, config) {
  if (weekdayStr) {
    var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
      parsedInput[0],
      parsedInput[1],
      parsedInput[2]
    ).getDay();
    if (weekdayProvided !== weekdayActual) {
      getParsingFlags(config).weekdayMismatch = true;
      config._isValid = false;
      return false;
    }
  }
  return true;
}
function calculateOffset(obsOffset, militaryOffset, numOffset) {
  if (obsOffset) {
    return obsOffsets[obsOffset];
  } else if (militaryOffset) {
    return 0;
  } else {
    var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
    return h * 60 + m;
  }
}
function configFromRFC2822(config) {
  var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
  if (match) {
    parsedArray = extractFromRFC2822Strings(
      match[4],
      match[3],
      match[2],
      match[5],
      match[6],
      match[7]
    );
    if (!checkWeekday(match[1], parsedArray, config)) {
      return;
    }
    config._a = parsedArray;
    config._tzm = calculateOffset(match[8], match[9], match[10]);
    config._d = createUTCDate.apply(null, config._a);
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    getParsingFlags(config).rfc2822 = true;
  } else {
    config._isValid = false;
  }
}
function configFromString(config) {
  var matched = aspNetJsonRegex.exec(config._i);
  if (matched !== null) {
    config._d = /* @__PURE__ */ new Date(+matched[1]);
    return;
  }
  configFromISO(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }
  configFromRFC2822(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }
  if (config._strict) {
    config._isValid = false;
  } else {
    hooks.createFromInputFallback(config);
  }
}
hooks.createFromInputFallback = deprecate(
  "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
  function(config) {
    config._d = /* @__PURE__ */ new Date(config._i + (config._useUTC ? " UTC" : ""));
  }
);
function defaults(a, b, c) {
  if (a != null) {
    return a;
  }
  if (b != null) {
    return b;
  }
  return c;
}
function currentDateArray(config) {
  var nowValue = new Date(hooks.now());
  if (config._useUTC) {
    return [
      nowValue.getUTCFullYear(),
      nowValue.getUTCMonth(),
      nowValue.getUTCDate()
    ];
  }
  return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}
function configFromArray(config) {
  var i, date, input = [], currentDate, expectedWeekday, yearToUse;
  if (config._d) {
    return;
  }
  currentDate = currentDateArray(config);
  if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
    dayOfYearFromWeekInfo(config);
  }
  if (config._dayOfYear != null) {
    yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
    if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
      getParsingFlags(config)._overflowDayOfYear = true;
    }
    date = createUTCDate(yearToUse, 0, config._dayOfYear);
    config._a[MONTH] = date.getUTCMonth();
    config._a[DATE] = date.getUTCDate();
  }
  for (i = 0; i < 3 && config._a[i] == null; ++i) {
    config._a[i] = input[i] = currentDate[i];
  }
  for (; i < 7; i++) {
    config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
  }
  if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
    config._nextDay = true;
    config._a[HOUR] = 0;
  }
  config._d = (config._useUTC ? createUTCDate : createDate).apply(
    null,
    input
  );
  expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
  if (config._tzm != null) {
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
  }
  if (config._nextDay) {
    config._a[HOUR] = 24;
  }
  if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
    getParsingFlags(config).weekdayMismatch = true;
  }
}
function dayOfYearFromWeekInfo(config) {
  var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
  w = config._w;
  if (w.GG != null || w.W != null || w.E != null) {
    dow = 1;
    doy = 4;
    weekYear = defaults(
      w.GG,
      config._a[YEAR],
      weekOfYear(createLocal(), 1, 4).year
    );
    week = defaults(w.W, 1);
    weekday = defaults(w.E, 1);
    if (weekday < 1 || weekday > 7) {
      weekdayOverflow = true;
    }
  } else {
    dow = config._locale._week.dow;
    doy = config._locale._week.doy;
    curWeek = weekOfYear(createLocal(), dow, doy);
    weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
    week = defaults(w.w, curWeek.week);
    if (w.d != null) {
      weekday = w.d;
      if (weekday < 0 || weekday > 6) {
        weekdayOverflow = true;
      }
    } else if (w.e != null) {
      weekday = w.e + dow;
      if (w.e < 0 || w.e > 6) {
        weekdayOverflow = true;
      }
    } else {
      weekday = dow;
    }
  }
  if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
    getParsingFlags(config)._overflowWeeks = true;
  } else if (weekdayOverflow != null) {
    getParsingFlags(config)._overflowWeekday = true;
  } else {
    temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
    config._a[YEAR] = temp.year;
    config._dayOfYear = temp.dayOfYear;
  }
}
hooks.ISO_8601 = function() {
};
hooks.RFC_2822 = function() {
};
function configFromStringAndFormat(config) {
  if (config._f === hooks.ISO_8601) {
    configFromISO(config);
    return;
  }
  if (config._f === hooks.RFC_2822) {
    configFromRFC2822(config);
    return;
  }
  config._a = [];
  getParsingFlags(config).empty = true;
  var string = "" + config._i, i, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
  tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
  tokenLen = tokens2.length;
  for (i = 0; i < tokenLen; i++) {
    token2 = tokens2[i];
    parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
    if (parsedInput) {
      skipped = string.substr(0, string.indexOf(parsedInput));
      if (skipped.length > 0) {
        getParsingFlags(config).unusedInput.push(skipped);
      }
      string = string.slice(
        string.indexOf(parsedInput) + parsedInput.length
      );
      totalParsedInputLength += parsedInput.length;
    }
    if (formatTokenFunctions[token2]) {
      if (parsedInput) {
        getParsingFlags(config).empty = false;
      } else {
        getParsingFlags(config).unusedTokens.push(token2);
      }
      addTimeToArrayFromToken(token2, parsedInput, config);
    } else if (config._strict && !parsedInput) {
      getParsingFlags(config).unusedTokens.push(token2);
    }
  }
  getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
  if (string.length > 0) {
    getParsingFlags(config).unusedInput.push(string);
  }
  if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
    getParsingFlags(config).bigHour = void 0;
  }
  getParsingFlags(config).parsedDateParts = config._a.slice(0);
  getParsingFlags(config).meridiem = config._meridiem;
  config._a[HOUR] = meridiemFixWrap(
    config._locale,
    config._a[HOUR],
    config._meridiem
  );
  era = getParsingFlags(config).era;
  if (era !== null) {
    config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
  }
  configFromArray(config);
  checkOverflow(config);
}
function meridiemFixWrap(locale2, hour, meridiem2) {
  var isPm;
  if (meridiem2 == null) {
    return hour;
  }
  if (locale2.meridiemHour != null) {
    return locale2.meridiemHour(hour, meridiem2);
  } else if (locale2.isPM != null) {
    isPm = locale2.isPM(meridiem2);
    if (isPm && hour < 12) {
      hour += 12;
    }
    if (!isPm && hour === 12) {
      hour = 0;
    }
    return hour;
  } else {
    return hour;
  }
}
function configFromStringAndArray(config) {
  var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
  if (configfLen === 0) {
    getParsingFlags(config).invalidFormat = true;
    config._d = /* @__PURE__ */ new Date(NaN);
    return;
  }
  for (i = 0; i < configfLen; i++) {
    currentScore = 0;
    validFormatFound = false;
    tempConfig = copyConfig({}, config);
    if (config._useUTC != null) {
      tempConfig._useUTC = config._useUTC;
    }
    tempConfig._f = config._f[i];
    configFromStringAndFormat(tempConfig);
    if (isValid(tempConfig)) {
      validFormatFound = true;
    }
    currentScore += getParsingFlags(tempConfig).charsLeftOver;
    currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
    getParsingFlags(tempConfig).score = currentScore;
    if (!bestFormatIsValid) {
      if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
        if (validFormatFound) {
          bestFormatIsValid = true;
        }
      }
    } else {
      if (currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
  }
  extend(config, bestMoment || tempConfig);
}
function configFromObject(config) {
  if (config._d) {
    return;
  }
  var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
  config._a = map(
    [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
    function(obj) {
      return obj && parseInt(obj, 10);
    }
  );
  configFromArray(config);
}
function createFromConfig(config) {
  var res = new Moment(checkOverflow(prepareConfig(config)));
  if (res._nextDay) {
    res.add(1, "d");
    res._nextDay = void 0;
  }
  return res;
}
function prepareConfig(config) {
  var input = config._i, format2 = config._f;
  config._locale = config._locale || getLocale(config._l);
  if (input === null || format2 === void 0 && input === "") {
    return createInvalid({ nullInput: true });
  }
  if (typeof input === "string") {
    config._i = input = config._locale.preparse(input);
  }
  if (isMoment(input)) {
    return new Moment(checkOverflow(input));
  } else if (isDate(input)) {
    config._d = input;
  } else if (isArray(format2)) {
    configFromStringAndArray(config);
  } else if (format2) {
    configFromStringAndFormat(config);
  } else {
    configFromInput(config);
  }
  if (!isValid(config)) {
    config._d = null;
  }
  return config;
}
function configFromInput(config) {
  var input = config._i;
  if (isUndefined(input)) {
    config._d = new Date(hooks.now());
  } else if (isDate(input)) {
    config._d = new Date(input.valueOf());
  } else if (typeof input === "string") {
    configFromString(config);
  } else if (isArray(input)) {
    config._a = map(input.slice(0), function(obj) {
      return parseInt(obj, 10);
    });
    configFromArray(config);
  } else if (isObject(input)) {
    configFromObject(config);
  } else if (isNumber(input)) {
    config._d = new Date(input);
  } else {
    hooks.createFromInputFallback(config);
  }
}
function createLocalOrUTC(input, format2, locale2, strict, isUTC) {
  var c = {};
  if (format2 === true || format2 === false) {
    strict = format2;
    format2 = void 0;
  }
  if (locale2 === true || locale2 === false) {
    strict = locale2;
    locale2 = void 0;
  }
  if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
    input = void 0;
  }
  c._isAMomentObject = true;
  c._useUTC = c._isUTC = isUTC;
  c._l = locale2;
  c._i = input;
  c._f = format2;
  c._strict = strict;
  return createFromConfig(c);
}
function createLocal(input, format2, locale2, strict) {
  return createLocalOrUTC(input, format2, locale2, strict, false);
}
var prototypeMin = deprecate(
  "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var other = createLocal.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other < this ? this : other;
    } else {
      return createInvalid();
    }
  }
), prototypeMax = deprecate(
  "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var other = createLocal.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other > this ? this : other;
    } else {
      return createInvalid();
    }
  }
);
function pickBy(fn, moments) {
  var res, i;
  if (moments.length === 1 && isArray(moments[0])) {
    moments = moments[0];
  }
  if (!moments.length) {
    return createLocal();
  }
  res = moments[0];
  for (i = 1; i < moments.length; ++i) {
    if (!moments[i].isValid() || moments[i][fn](res)) {
      res = moments[i];
    }
  }
  return res;
}
function min() {
  var args = [].slice.call(arguments, 0);
  return pickBy("isBefore", args);
}
function max() {
  var args = [].slice.call(arguments, 0);
  return pickBy("isAfter", args);
}
var now = function() {
  return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
};
var ordering = [
  "year",
  "quarter",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond"
];
function isDurationValid(m) {
  var key, unitHasDecimal = false, i, orderLen = ordering.length;
  for (key in m) {
    if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
      return false;
    }
  }
  for (i = 0; i < orderLen; ++i) {
    if (m[ordering[i]]) {
      if (unitHasDecimal) {
        return false;
      }
      if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
        unitHasDecimal = true;
      }
    }
  }
  return true;
}
function isValid$1() {
  return this._isValid;
}
function createInvalid$1() {
  return createDuration(NaN);
}
function Duration(duration) {
  var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
  this._isValid = isDurationValid(normalizedInput);
  this._milliseconds = +milliseconds2 + seconds2 * 1e3 + // 1000
  minutes2 * 6e4 + // 1000 * 60
  hours2 * 1e3 * 60 * 60;
  this._days = +days2 + weeks2 * 7;
  this._months = +months2 + quarters * 3 + years2 * 12;
  this._data = {};
  this._locale = getLocale();
  this._bubble();
}
function isDuration(obj) {
  return obj instanceof Duration;
}
function absRound(number) {
  if (number < 0) {
    return Math.round(-1 * number) * -1;
  } else {
    return Math.round(number);
  }
}
function compareArrays(array1, array2, dontConvert) {
  var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
  for (i = 0; i < len; i++) {
    if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
      diffs++;
    }
  }
  return diffs + lengthDiff;
}
function offset(token2, separator) {
  addFormatToken(token2, 0, 0, function() {
    var offset2 = this.utcOffset(), sign2 = "+";
    if (offset2 < 0) {
      offset2 = -offset2;
      sign2 = "-";
    }
    return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
  });
}
offset("Z", ":");
offset("ZZ", "");
addRegexToken("Z", matchShortOffset);
addRegexToken("ZZ", matchShortOffset);
addParseToken(["Z", "ZZ"], function(input, array, config) {
  config._useUTC = true;
  config._tzm = offsetFromString(matchShortOffset, input);
});
var chunkOffset = /([\+\-]|\d\d)/gi;
function offsetFromString(matcher, string) {
  var matches = (string || "").match(matcher), chunk, parts, minutes2;
  if (matches === null) {
    return null;
  }
  chunk = matches[matches.length - 1] || [];
  parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
  minutes2 = +(parts[1] * 60) + toInt(parts[2]);
  return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
}
function cloneWithOffset(input, model) {
  var res, diff2;
  if (model._isUTC) {
    res = model.clone();
    diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
    res._d.setTime(res._d.valueOf() + diff2);
    hooks.updateOffset(res, false);
    return res;
  } else {
    return createLocal(input).local();
  }
}
function getDateOffset(m) {
  return -Math.round(m._d.getTimezoneOffset());
}
hooks.updateOffset = function() {
};
function getSetOffset(input, keepLocalTime, keepMinutes) {
  var offset2 = this._offset || 0, localAdjust;
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  if (input != null) {
    if (typeof input === "string") {
      input = offsetFromString(matchShortOffset, input);
      if (input === null) {
        return this;
      }
    } else if (Math.abs(input) < 16 && !keepMinutes) {
      input = input * 60;
    }
    if (!this._isUTC && keepLocalTime) {
      localAdjust = getDateOffset(this);
    }
    this._offset = input;
    this._isUTC = true;
    if (localAdjust != null) {
      this.add(localAdjust, "m");
    }
    if (offset2 !== input) {
      if (!keepLocalTime || this._changeInProgress) {
        addSubtract(
          this,
          createDuration(input - offset2, "m"),
          1,
          false
        );
      } else if (!this._changeInProgress) {
        this._changeInProgress = true;
        hooks.updateOffset(this, true);
        this._changeInProgress = null;
      }
    }
    return this;
  } else {
    return this._isUTC ? offset2 : getDateOffset(this);
  }
}
function getSetZone(input, keepLocalTime) {
  if (input != null) {
    if (typeof input !== "string") {
      input = -input;
    }
    this.utcOffset(input, keepLocalTime);
    return this;
  } else {
    return -this.utcOffset();
  }
}
function setOffsetToUTC(keepLocalTime) {
  return this.utcOffset(0, keepLocalTime);
}
function setOffsetToLocal(keepLocalTime) {
  if (this._isUTC) {
    this.utcOffset(0, keepLocalTime);
    this._isUTC = false;
    if (keepLocalTime) {
      this.subtract(getDateOffset(this), "m");
    }
  }
  return this;
}
function setOffsetToParsedOffset() {
  if (this._tzm != null) {
    this.utcOffset(this._tzm, false, true);
  } else if (typeof this._i === "string") {
    var tZone = offsetFromString(matchOffset, this._i);
    if (tZone != null) {
      this.utcOffset(tZone);
    } else {
      this.utcOffset(0, true);
    }
  }
  return this;
}
function hasAlignedHourOffset(input) {
  if (!this.isValid()) {
    return false;
  }
  input = input ? createLocal(input).utcOffset() : 0;
  return (this.utcOffset() - input) % 60 === 0;
}
function isDaylightSavingTime() {
  return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
}
function isDaylightSavingTimeShifted() {
  if (!isUndefined(this._isDSTShifted)) {
    return this._isDSTShifted;
  }
  var c = {}, other;
  copyConfig(c, this);
  c = prepareConfig(c);
  if (c._a) {
    other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
    this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
  } else {
    this._isDSTShifted = false;
  }
  return this._isDSTShifted;
}
function isLocal() {
  return this.isValid() ? !this._isUTC : false;
}
function isUtcOffset() {
  return this.isValid() ? this._isUTC : false;
}
function isUtc() {
  return this.isValid() ? this._isUTC && this._offset === 0 : false;
}
var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
function createDuration(input, key) {
  var duration = input, match = null, sign2, ret, diffRes;
  if (isDuration(input)) {
    duration = {
      ms: input._milliseconds,
      d: input._days,
      M: input._months
    };
  } else if (isNumber(input) || !isNaN(+input)) {
    duration = {};
    if (key) {
      duration[key] = +input;
    } else {
      duration.milliseconds = +input;
    }
  } else if (match = aspNetRegex.exec(input)) {
    sign2 = match[1] === "-" ? -1 : 1;
    duration = {
      y: 0,
      d: toInt(match[DATE]) * sign2,
      h: toInt(match[HOUR]) * sign2,
      m: toInt(match[MINUTE]) * sign2,
      s: toInt(match[SECOND]) * sign2,
      ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
      // the millisecond decimal point is included in the match
    };
  } else if (match = isoRegex.exec(input)) {
    sign2 = match[1] === "-" ? -1 : 1;
    duration = {
      y: parseIso(match[2], sign2),
      M: parseIso(match[3], sign2),
      w: parseIso(match[4], sign2),
      d: parseIso(match[5], sign2),
      h: parseIso(match[6], sign2),
      m: parseIso(match[7], sign2),
      s: parseIso(match[8], sign2)
    };
  } else if (duration == null) {
    duration = {};
  } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
    diffRes = momentsDifference(
      createLocal(duration.from),
      createLocal(duration.to)
    );
    duration = {};
    duration.ms = diffRes.milliseconds;
    duration.M = diffRes.months;
  }
  ret = new Duration(duration);
  if (isDuration(input) && hasOwnProp(input, "_locale")) {
    ret._locale = input._locale;
  }
  if (isDuration(input) && hasOwnProp(input, "_isValid")) {
    ret._isValid = input._isValid;
  }
  return ret;
}
createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;
function parseIso(inp, sign2) {
  var res = inp && parseFloat(inp.replace(",", "."));
  return (isNaN(res) ? 0 : res) * sign2;
}
function positiveMomentsDifference(base, other) {
  var res = {};
  res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
  if (base.clone().add(res.months, "M").isAfter(other)) {
    --res.months;
  }
  res.milliseconds = +other - +base.clone().add(res.months, "M");
  return res;
}
function momentsDifference(base, other) {
  var res;
  if (!(base.isValid() && other.isValid())) {
    return { milliseconds: 0, months: 0 };
  }
  other = cloneWithOffset(other, base);
  if (base.isBefore(other)) {
    res = positiveMomentsDifference(base, other);
  } else {
    res = positiveMomentsDifference(other, base);
    res.milliseconds = -res.milliseconds;
    res.months = -res.months;
  }
  return res;
}
function createAdder(direction, name) {
  return function(val, period) {
    var dur, tmp;
    if (period !== null && !isNaN(+period)) {
      deprecateSimple(
        name,
        "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
      );
      tmp = val;
      val = period;
      period = tmp;
    }
    dur = createDuration(val, period);
    addSubtract(this, dur, direction);
    return this;
  };
}
function addSubtract(mom, duration, isAdding, updateOffset) {
  var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
  if (!mom.isValid()) {
    return;
  }
  updateOffset = updateOffset == null ? true : updateOffset;
  if (months2) {
    setMonth(mom, get(mom, "Month") + months2 * isAdding);
  }
  if (days2) {
    set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
  }
  if (milliseconds2) {
    mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
  }
  if (updateOffset) {
    hooks.updateOffset(mom, days2 || months2);
  }
}
var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
function isString(input) {
  return typeof input === "string" || input instanceof String;
}
function isMomentInput(input) {
  return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
}
function isMomentInputObject(input) {
  var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
    "years",
    "year",
    "y",
    "months",
    "month",
    "M",
    "days",
    "day",
    "d",
    "dates",
    "date",
    "D",
    "hours",
    "hour",
    "h",
    "minutes",
    "minute",
    "m",
    "seconds",
    "second",
    "s",
    "milliseconds",
    "millisecond",
    "ms"
  ], i, property, propertyLen = properties.length;
  for (i = 0; i < propertyLen; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || hasOwnProp(input, property);
  }
  return objectTest && propertyTest;
}
function isNumberOrStringArray(input) {
  var arrayTest = isArray(input), dataTypeTest = false;
  if (arrayTest) {
    dataTypeTest = input.filter(function(item) {
      return !isNumber(item) && isString(input);
    }).length === 0;
  }
  return arrayTest && dataTypeTest;
}
function isCalendarSpec(input) {
  var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
    "sameDay",
    "nextDay",
    "lastDay",
    "nextWeek",
    "lastWeek",
    "sameElse"
  ], i, property;
  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || hasOwnProp(input, property);
  }
  return objectTest && propertyTest;
}
function getCalendarFormat(myMoment, now2) {
  var diff2 = myMoment.diff(now2, "days", true);
  return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
}
function calendar$1(time, formats) {
  if (arguments.length === 1) {
    if (!arguments[0]) {
      time = void 0;
      formats = void 0;
    } else if (isMomentInput(arguments[0])) {
      time = arguments[0];
      formats = void 0;
    } else if (isCalendarSpec(arguments[0])) {
      formats = arguments[0];
      time = void 0;
    }
  }
  var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
  return this.format(
    output || this.localeData().calendar(format2, this, createLocal(now2))
  );
}
function clone() {
  return new Moment(this);
}
function isAfter(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || "millisecond";
  if (units === "millisecond") {
    return this.valueOf() > localInput.valueOf();
  } else {
    return localInput.valueOf() < this.clone().startOf(units).valueOf();
  }
}
function isBefore(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || "millisecond";
  if (units === "millisecond") {
    return this.valueOf() < localInput.valueOf();
  } else {
    return this.clone().endOf(units).valueOf() < localInput.valueOf();
  }
}
function isBetween(from2, to2, units, inclusivity) {
  var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
  if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
    return false;
  }
  inclusivity = inclusivity || "()";
  return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
}
function isSame(input, units) {
  var localInput = isMoment(input) ? input : createLocal(input), inputMs;
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = normalizeUnits(units) || "millisecond";
  if (units === "millisecond") {
    return this.valueOf() === localInput.valueOf();
  } else {
    inputMs = localInput.valueOf();
    return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
  }
}
function isSameOrAfter(input, units) {
  return this.isSame(input, units) || this.isAfter(input, units);
}
function isSameOrBefore(input, units) {
  return this.isSame(input, units) || this.isBefore(input, units);
}
function diff(input, units, asFloat) {
  var that, zoneDelta, output;
  if (!this.isValid()) {
    return NaN;
  }
  that = cloneWithOffset(input, this);
  if (!that.isValid()) {
    return NaN;
  }
  zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
  units = normalizeUnits(units);
  switch (units) {
    case "year":
      output = monthDiff(this, that) / 12;
      break;
    case "month":
      output = monthDiff(this, that);
      break;
    case "quarter":
      output = monthDiff(this, that) / 3;
      break;
    case "second":
      output = (this - that) / 1e3;
      break;
    case "minute":
      output = (this - that) / 6e4;
      break;
    case "hour":
      output = (this - that) / 36e5;
      break;
    case "day":
      output = (this - that - zoneDelta) / 864e5;
      break;
    case "week":
      output = (this - that - zoneDelta) / 6048e5;
      break;
    default:
      output = this - that;
  }
  return asFloat ? output : absFloor(output);
}
function monthDiff(a, b) {
  if (a.date() < b.date()) {
    return -monthDiff(b, a);
  }
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
  if (b - anchor < 0) {
    anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
    adjust = (b - anchor) / (anchor - anchor2);
  } else {
    anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
    adjust = (b - anchor) / (anchor2 - anchor);
  }
  return -(wholeMonthDiff + adjust) || 0;
}
hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
function toString() {
  return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
}
function toISOString(keepOffset) {
  if (!this.isValid()) {
    return null;
  }
  var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
  if (m.year() < 0 || m.year() > 9999) {
    return formatMoment(
      m,
      utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
    );
  }
  if (isFunction(Date.prototype.toISOString)) {
    if (utc) {
      return this.toDate().toISOString();
    } else {
      return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
    }
  }
  return formatMoment(
    m,
    utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
  );
}
function inspect() {
  if (!this.isValid()) {
    return "moment.invalid(/* " + this._i + " */)";
  }
  var func = "moment", zone = "", prefix, year, datetime, suffix;
  if (!this.isLocal()) {
    func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
    zone = "Z";
  }
  prefix = "[" + func + '("]';
  year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
  datetime = "-MM-DD[T]HH:mm:ss.SSS";
  suffix = zone + '[")]';
  return this.format(prefix + year + datetime + suffix);
}
function format(inputString) {
  if (!inputString) {
    inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
  }
  var output = formatMoment(this, inputString);
  return this.localeData().postformat(output);
}
function from(time, withoutSuffix) {
  if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
    return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}
function fromNow(withoutSuffix) {
  return this.from(createLocal(), withoutSuffix);
}
function to(time, withoutSuffix) {
  if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
    return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}
function toNow(withoutSuffix) {
  return this.to(createLocal(), withoutSuffix);
}
function locale(key) {
  var newLocaleData;
  if (key === void 0) {
    return this._locale._abbr;
  } else {
    newLocaleData = getLocale(key);
    if (newLocaleData != null) {
      this._locale = newLocaleData;
    }
    return this;
  }
}
var lang = deprecate(
  "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
  function(key) {
    if (key === void 0) {
      return this.localeData();
    } else {
      return this.locale(key);
    }
  }
);
function localeData() {
  return this._locale;
}
var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
function mod$1(dividend, divisor) {
  return (dividend % divisor + divisor) % divisor;
}
function localStartOfDate(y, m, d) {
  if (y < 100 && y >= 0) {
    return new Date(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return new Date(y, m, d).valueOf();
  }
}
function utcStartOfDate(y, m, d) {
  if (y < 100 && y >= 0) {
    return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return Date.UTC(y, m, d);
  }
}
function startOf(units) {
  var time, startOfDate;
  units = normalizeUnits(units);
  if (units === void 0 || units === "millisecond" || !this.isValid()) {
    return this;
  }
  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
  switch (units) {
    case "year":
      time = startOfDate(this.year(), 0, 1);
      break;
    case "quarter":
      time = startOfDate(
        this.year(),
        this.month() - this.month() % 3,
        1
      );
      break;
    case "month":
      time = startOfDate(this.year(), this.month(), 1);
      break;
    case "week":
      time = startOfDate(
        this.year(),
        this.month(),
        this.date() - this.weekday()
      );
      break;
    case "isoWeek":
      time = startOfDate(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1)
      );
      break;
    case "day":
    case "date":
      time = startOfDate(this.year(), this.month(), this.date());
      break;
    case "hour":
      time = this._d.valueOf();
      time -= mod$1(
        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
        MS_PER_HOUR
      );
      break;
    case "minute":
      time = this._d.valueOf();
      time -= mod$1(time, MS_PER_MINUTE);
      break;
    case "second":
      time = this._d.valueOf();
      time -= mod$1(time, MS_PER_SECOND);
      break;
  }
  this._d.setTime(time);
  hooks.updateOffset(this, true);
  return this;
}
function endOf(units) {
  var time, startOfDate;
  units = normalizeUnits(units);
  if (units === void 0 || units === "millisecond" || !this.isValid()) {
    return this;
  }
  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
  switch (units) {
    case "year":
      time = startOfDate(this.year() + 1, 0, 1) - 1;
      break;
    case "quarter":
      time = startOfDate(
        this.year(),
        this.month() - this.month() % 3 + 3,
        1
      ) - 1;
      break;
    case "month":
      time = startOfDate(this.year(), this.month() + 1, 1) - 1;
      break;
    case "week":
      time = startOfDate(
        this.year(),
        this.month(),
        this.date() - this.weekday() + 7
      ) - 1;
      break;
    case "isoWeek":
      time = startOfDate(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1) + 7
      ) - 1;
      break;
    case "day":
    case "date":
      time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
      break;
    case "hour":
      time = this._d.valueOf();
      time += MS_PER_HOUR - mod$1(
        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
        MS_PER_HOUR
      ) - 1;
      break;
    case "minute":
      time = this._d.valueOf();
      time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
      break;
    case "second":
      time = this._d.valueOf();
      time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
      break;
  }
  this._d.setTime(time);
  hooks.updateOffset(this, true);
  return this;
}
function valueOf() {
  return this._d.valueOf() - (this._offset || 0) * 6e4;
}
function unix() {
  return Math.floor(this.valueOf() / 1e3);
}
function toDate() {
  return new Date(this.valueOf());
}
function toArray() {
  var m = this;
  return [
    m.year(),
    m.month(),
    m.date(),
    m.hour(),
    m.minute(),
    m.second(),
    m.millisecond()
  ];
}
function toObject() {
  var m = this;
  return {
    years: m.year(),
    months: m.month(),
    date: m.date(),
    hours: m.hours(),
    minutes: m.minutes(),
    seconds: m.seconds(),
    milliseconds: m.milliseconds()
  };
}
function toJSON() {
  return this.isValid() ? this.toISOString() : null;
}
function isValid$2() {
  return isValid(this);
}
function parsingFlags() {
  return extend({}, getParsingFlags(this));
}
function invalidAt() {
  return getParsingFlags(this).overflow;
}
function creationData() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict
  };
}
addFormatToken("N", 0, 0, "eraAbbr");
addFormatToken("NN", 0, 0, "eraAbbr");
addFormatToken("NNN", 0, 0, "eraAbbr");
addFormatToken("NNNN", 0, 0, "eraName");
addFormatToken("NNNNN", 0, 0, "eraNarrow");
addFormatToken("y", ["y", 1], "yo", "eraYear");
addFormatToken("y", ["yy", 2], 0, "eraYear");
addFormatToken("y", ["yyy", 3], 0, "eraYear");
addFormatToken("y", ["yyyy", 4], 0, "eraYear");
addRegexToken("N", matchEraAbbr);
addRegexToken("NN", matchEraAbbr);
addRegexToken("NNN", matchEraAbbr);
addRegexToken("NNNN", matchEraName);
addRegexToken("NNNNN", matchEraNarrow);
addParseToken(
  ["N", "NN", "NNN", "NNNN", "NNNNN"],
  function(input, array, config, token2) {
    var era = config._locale.erasParse(input, token2, config._strict);
    if (era) {
      getParsingFlags(config).era = era;
    } else {
      getParsingFlags(config).invalidEra = input;
    }
  }
);
addRegexToken("y", matchUnsigned);
addRegexToken("yy", matchUnsigned);
addRegexToken("yyy", matchUnsigned);
addRegexToken("yyyy", matchUnsigned);
addRegexToken("yo", matchEraYearOrdinal);
addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
addParseToken(["yo"], function(input, array, config, token2) {
  var match;
  if (config._locale._eraYearOrdinalRegex) {
    match = input.match(config._locale._eraYearOrdinalRegex);
  }
  if (config._locale.eraYearOrdinalParse) {
    array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
  } else {
    array[YEAR] = parseInt(input, 10);
  }
});
function localeEras(m, format2) {
  var i, l, date, eras = this._eras || getLocale("en")._eras;
  for (i = 0, l = eras.length; i < l; ++i) {
    switch (typeof eras[i].since) {
      case "string":
        date = hooks(eras[i].since).startOf("day");
        eras[i].since = date.valueOf();
        break;
    }
    switch (typeof eras[i].until) {
      case "undefined":
        eras[i].until = Infinity;
        break;
      case "string":
        date = hooks(eras[i].until).startOf("day").valueOf();
        eras[i].until = date.valueOf();
        break;
    }
  }
  return eras;
}
function localeErasParse(eraName, format2, strict) {
  var i, l, eras = this.eras(), name, abbr, narrow;
  eraName = eraName.toUpperCase();
  for (i = 0, l = eras.length; i < l; ++i) {
    name = eras[i].name.toUpperCase();
    abbr = eras[i].abbr.toUpperCase();
    narrow = eras[i].narrow.toUpperCase();
    if (strict) {
      switch (format2) {
        case "N":
        case "NN":
        case "NNN":
          if (abbr === eraName) {
            return eras[i];
          }
          break;
        case "NNNN":
          if (name === eraName) {
            return eras[i];
          }
          break;
        case "NNNNN":
          if (narrow === eraName) {
            return eras[i];
          }
          break;
      }
    } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
      return eras[i];
    }
  }
}
function localeErasConvertYear(era, year) {
  var dir = era.since <= era.until ? 1 : -1;
  if (year === void 0) {
    return hooks(era.since).year();
  } else {
    return hooks(era.since).year() + (year - era.offset) * dir;
  }
}
function getEraName() {
  var i, l, val, eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    val = this.clone().startOf("day").valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].name;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].name;
    }
  }
  return "";
}
function getEraNarrow() {
  var i, l, val, eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    val = this.clone().startOf("day").valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].narrow;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].narrow;
    }
  }
  return "";
}
function getEraAbbr() {
  var i, l, val, eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    val = this.clone().startOf("day").valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].abbr;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].abbr;
    }
  }
  return "";
}
function getEraYear() {
  var i, l, dir, val, eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    dir = eras[i].since <= eras[i].until ? 1 : -1;
    val = this.clone().startOf("day").valueOf();
    if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
      return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
    }
  }
  return this.year();
}
function erasNameRegex(isStrict) {
  if (!hasOwnProp(this, "_erasNameRegex")) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNameRegex : this._erasRegex;
}
function erasAbbrRegex(isStrict) {
  if (!hasOwnProp(this, "_erasAbbrRegex")) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasAbbrRegex : this._erasRegex;
}
function erasNarrowRegex(isStrict) {
  if (!hasOwnProp(this, "_erasNarrowRegex")) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNarrowRegex : this._erasRegex;
}
function matchEraAbbr(isStrict, locale2) {
  return locale2.erasAbbrRegex(isStrict);
}
function matchEraName(isStrict, locale2) {
  return locale2.erasNameRegex(isStrict);
}
function matchEraNarrow(isStrict, locale2) {
  return locale2.erasNarrowRegex(isStrict);
}
function matchEraYearOrdinal(isStrict, locale2) {
  return locale2._eraYearOrdinalRegex || matchUnsigned;
}
function computeErasParse() {
  var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, erasName, erasAbbr, erasNarrow, eras = this.eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    erasName = regexEscape(eras[i].name);
    erasAbbr = regexEscape(eras[i].abbr);
    erasNarrow = regexEscape(eras[i].narrow);
    namePieces.push(erasName);
    abbrPieces.push(erasAbbr);
    narrowPieces.push(erasNarrow);
    mixedPieces.push(erasName);
    mixedPieces.push(erasAbbr);
    mixedPieces.push(erasNarrow);
  }
  this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
  this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
  this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
  this._erasNarrowRegex = new RegExp(
    "^(" + narrowPieces.join("|") + ")",
    "i"
  );
}
addFormatToken(0, ["gg", 2], 0, function() {
  return this.weekYear() % 100;
});
addFormatToken(0, ["GG", 2], 0, function() {
  return this.isoWeekYear() % 100;
});
function addWeekYearFormatToken(token2, getter) {
  addFormatToken(0, [token2, token2.length], 0, getter);
}
addWeekYearFormatToken("gggg", "weekYear");
addWeekYearFormatToken("ggggg", "weekYear");
addWeekYearFormatToken("GGGG", "isoWeekYear");
addWeekYearFormatToken("GGGGG", "isoWeekYear");
addRegexToken("G", matchSigned);
addRegexToken("g", matchSigned);
addRegexToken("GG", match1to2, match2);
addRegexToken("gg", match1to2, match2);
addRegexToken("GGGG", match1to4, match4);
addRegexToken("gggg", match1to4, match4);
addRegexToken("GGGGG", match1to6, match6);
addRegexToken("ggggg", match1to6, match6);
addWeekParseToken(
  ["gggg", "ggggg", "GGGG", "GGGGG"],
  function(input, week, config, token2) {
    week[token2.substr(0, 2)] = toInt(input);
  }
);
addWeekParseToken(["gg", "GG"], function(input, week, config, token2) {
  week[token2] = hooks.parseTwoDigitYear(input);
});
function getSetWeekYear(input) {
  return getSetWeekYearHelper.call(
    this,
    input,
    this.week(),
    this.weekday() + this.localeData()._week.dow,
    this.localeData()._week.dow,
    this.localeData()._week.doy
  );
}
function getSetISOWeekYear(input) {
  return getSetWeekYearHelper.call(
    this,
    input,
    this.isoWeek(),
    this.isoWeekday(),
    1,
    4
  );
}
function getISOWeeksInYear() {
  return weeksInYear(this.year(), 1, 4);
}
function getISOWeeksInISOWeekYear() {
  return weeksInYear(this.isoWeekYear(), 1, 4);
}
function getWeeksInYear() {
  var weekInfo = this.localeData()._week;
  return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}
function getWeeksInWeekYear() {
  var weekInfo = this.localeData()._week;
  return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
}
function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weeksTarget;
  if (input == null) {
    return weekOfYear(this, dow, doy).year;
  } else {
    weeksTarget = weeksInYear(input, dow, doy);
    if (week > weeksTarget) {
      week = weeksTarget;
    }
    return setWeekAll.call(this, input, week, weekday, dow, doy);
  }
}
function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.date(date.getUTCDate());
  return this;
}
addFormatToken("Q", 0, "Qo", "quarter");
addRegexToken("Q", match1);
addParseToken("Q", function(input, array) {
  array[MONTH] = (toInt(input) - 1) * 3;
});
function getSetQuarter(input) {
  return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}
addFormatToken("D", ["DD", 2], "Do", "date");
addRegexToken("D", match1to2, match1to2NoLeadingZero);
addRegexToken("DD", match1to2, match2);
addRegexToken("Do", function(isStrict, locale2) {
  return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
});
addParseToken(["D", "DD"], DATE);
addParseToken("Do", function(input, array) {
  array[DATE] = toInt(input.match(match1to2)[0]);
});
var getSetDayOfMonth = makeGetSet("Date", true);
addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
addRegexToken("DDD", match1to3);
addRegexToken("DDDD", match3);
addParseToken(["DDD", "DDDD"], function(input, array, config) {
  config._dayOfYear = toInt(input);
});
function getSetDayOfYear(input) {
  var dayOfYear = Math.round(
    (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
  ) + 1;
  return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
}
addFormatToken("m", ["mm", 2], 0, "minute");
addRegexToken("m", match1to2, match1to2HasZero);
addRegexToken("mm", match1to2, match2);
addParseToken(["m", "mm"], MINUTE);
var getSetMinute = makeGetSet("Minutes", false);
addFormatToken("s", ["ss", 2], 0, "second");
addRegexToken("s", match1to2, match1to2HasZero);
addRegexToken("ss", match1to2, match2);
addParseToken(["s", "ss"], SECOND);
var getSetSecond = makeGetSet("Seconds", false);
addFormatToken("S", 0, 0, function() {
  return ~~(this.millisecond() / 100);
});
addFormatToken(0, ["SS", 2], 0, function() {
  return ~~(this.millisecond() / 10);
});
addFormatToken(0, ["SSS", 3], 0, "millisecond");
addFormatToken(0, ["SSSS", 4], 0, function() {
  return this.millisecond() * 10;
});
addFormatToken(0, ["SSSSS", 5], 0, function() {
  return this.millisecond() * 100;
});
addFormatToken(0, ["SSSSSS", 6], 0, function() {
  return this.millisecond() * 1e3;
});
addFormatToken(0, ["SSSSSSS", 7], 0, function() {
  return this.millisecond() * 1e4;
});
addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
  return this.millisecond() * 1e5;
});
addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
  return this.millisecond() * 1e6;
});
addRegexToken("S", match1to3, match1);
addRegexToken("SS", match1to3, match2);
addRegexToken("SSS", match1to3, match3);
var token, getSetMillisecond;
for (token = "SSSS"; token.length <= 9; token += "S") {
  addRegexToken(token, matchUnsigned);
}
function parseMs(input, array) {
  array[MILLISECOND] = toInt(("0." + input) * 1e3);
}
for (token = "S"; token.length <= 9; token += "S") {
  addParseToken(token, parseMs);
}
getSetMillisecond = makeGetSet("Milliseconds", false);
addFormatToken("z", 0, 0, "zoneAbbr");
addFormatToken("zz", 0, 0, "zoneName");
function getZoneAbbr() {
  return this._isUTC ? "UTC" : "";
}
function getZoneName() {
  return this._isUTC ? "Coordinated Universal Time" : "";
}
var proto = Moment.prototype;
proto.add = add;
proto.calendar = calendar$1;
proto.clone = clone;
proto.diff = diff;
proto.endOf = endOf;
proto.format = format;
proto.from = from;
proto.fromNow = fromNow;
proto.to = to;
proto.toNow = toNow;
proto.get = stringGet;
proto.invalidAt = invalidAt;
proto.isAfter = isAfter;
proto.isBefore = isBefore;
proto.isBetween = isBetween;
proto.isSame = isSame;
proto.isSameOrAfter = isSameOrAfter;
proto.isSameOrBefore = isSameOrBefore;
proto.isValid = isValid$2;
proto.lang = lang;
proto.locale = locale;
proto.localeData = localeData;
proto.max = prototypeMax;
proto.min = prototypeMin;
proto.parsingFlags = parsingFlags;
proto.set = stringSet;
proto.startOf = startOf;
proto.subtract = subtract;
proto.toArray = toArray;
proto.toObject = toObject;
proto.toDate = toDate;
proto.toISOString = toISOString;
proto.inspect = inspect;
if (typeof Symbol !== "undefined" && Symbol.for != null) {
  proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
    return "Moment<" + this.format() + ">";
  };
}
proto.toJSON = toJSON;
proto.toString = toString;
proto.unix = unix;
proto.valueOf = valueOf;
proto.creationData = creationData;
proto.eraName = getEraName;
proto.eraNarrow = getEraNarrow;
proto.eraAbbr = getEraAbbr;
proto.eraYear = getEraYear;
proto.year = getSetYear;
proto.isLeapYear = getIsLeapYear;
proto.weekYear = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;
proto.quarter = proto.quarters = getSetQuarter;
proto.month = getSetMonth;
proto.daysInMonth = getDaysInMonth;
proto.week = proto.weeks = getSetWeek;
proto.isoWeek = proto.isoWeeks = getSetISOWeek;
proto.weeksInYear = getWeeksInYear;
proto.weeksInWeekYear = getWeeksInWeekYear;
proto.isoWeeksInYear = getISOWeeksInYear;
proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
proto.date = getSetDayOfMonth;
proto.day = proto.days = getSetDayOfWeek;
proto.weekday = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear = getSetDayOfYear;
proto.hour = proto.hours = getSetHour;
proto.minute = proto.minutes = getSetMinute;
proto.second = proto.seconds = getSetSecond;
proto.millisecond = proto.milliseconds = getSetMillisecond;
proto.utcOffset = getSetOffset;
proto.utc = setOffsetToUTC;
proto.local = setOffsetToLocal;
proto.parseZone = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST = isDaylightSavingTime;
proto.isLocal = isLocal;
proto.isUtcOffset = isUtcOffset;
proto.isUtc = isUtc;
proto.isUTC = isUtc;
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;
proto.dates = deprecate(
  "dates accessor is deprecated. Use date instead.",
  getSetDayOfMonth
);
proto.months = deprecate(
  "months accessor is deprecated. Use month instead",
  getSetMonth
);
proto.years = deprecate(
  "years accessor is deprecated. Use year instead",
  getSetYear
);
proto.zone = deprecate(
  "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
  getSetZone
);
proto.isDSTShifted = deprecate(
  "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
  isDaylightSavingTimeShifted
);
function createUnix(input) {
  return createLocal(input * 1e3);
}
function createInZone() {
  return createLocal.apply(null, arguments).parseZone();
}
function preParsePostFormat(string) {
  return string;
}
var proto$1 = Locale.prototype;
proto$1.calendar = calendar;
proto$1.longDateFormat = longDateFormat;
proto$1.invalidDate = invalidDate;
proto$1.ordinal = ordinal;
proto$1.preparse = preParsePostFormat;
proto$1.postformat = preParsePostFormat;
proto$1.relativeTime = relativeTime;
proto$1.pastFuture = pastFuture;
proto$1.set = set;
proto$1.eras = localeEras;
proto$1.erasParse = localeErasParse;
proto$1.erasConvertYear = localeErasConvertYear;
proto$1.erasAbbrRegex = erasAbbrRegex;
proto$1.erasNameRegex = erasNameRegex;
proto$1.erasNarrowRegex = erasNarrowRegex;
proto$1.months = localeMonths;
proto$1.monthsShort = localeMonthsShort;
proto$1.monthsParse = localeMonthsParse;
proto$1.monthsRegex = monthsRegex;
proto$1.monthsShortRegex = monthsShortRegex;
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;
proto$1.weekdays = localeWeekdays;
proto$1.weekdaysMin = localeWeekdaysMin;
proto$1.weekdaysShort = localeWeekdaysShort;
proto$1.weekdaysParse = localeWeekdaysParse;
proto$1.weekdaysRegex = weekdaysRegex;
proto$1.weekdaysShortRegex = weekdaysShortRegex;
proto$1.weekdaysMinRegex = weekdaysMinRegex;
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;
function get$1(format2, index2, field, setter) {
  var locale2 = getLocale(), utc = createUTC().set(setter, index2);
  return locale2[field](utc, format2);
}
function listMonthsImpl(format2, index2, field) {
  if (isNumber(format2)) {
    index2 = format2;
    format2 = void 0;
  }
  format2 = format2 || "";
  if (index2 != null) {
    return get$1(format2, index2, field, "month");
  }
  var i, out = [];
  for (i = 0; i < 12; i++) {
    out[i] = get$1(format2, i, field, "month");
  }
  return out;
}
function listWeekdaysImpl(localeSorted, format2, index2, field) {
  if (typeof localeSorted === "boolean") {
    if (isNumber(format2)) {
      index2 = format2;
      format2 = void 0;
    }
    format2 = format2 || "";
  } else {
    format2 = localeSorted;
    index2 = format2;
    localeSorted = false;
    if (isNumber(format2)) {
      index2 = format2;
      format2 = void 0;
    }
    format2 = format2 || "";
  }
  var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i, out = [];
  if (index2 != null) {
    return get$1(format2, (index2 + shift) % 7, field, "day");
  }
  for (i = 0; i < 7; i++) {
    out[i] = get$1(format2, (i + shift) % 7, field, "day");
  }
  return out;
}
function listMonths(format2, index2) {
  return listMonthsImpl(format2, index2, "months");
}
function listMonthsShort(format2, index2) {
  return listMonthsImpl(format2, index2, "monthsShort");
}
function listWeekdays(localeSorted, format2, index2) {
  return listWeekdaysImpl(localeSorted, format2, index2, "weekdays");
}
function listWeekdaysShort(localeSorted, format2, index2) {
  return listWeekdaysImpl(localeSorted, format2, index2, "weekdaysShort");
}
function listWeekdaysMin(localeSorted, format2, index2) {
  return listWeekdaysImpl(localeSorted, format2, index2, "weekdaysMin");
}
getSetGlobalLocale("en", {
  eras: [
    {
      since: "0001-01-01",
      until: Infinity,
      offset: 1,
      name: "Anno Domini",
      narrow: "AD",
      abbr: "AD"
    },
    {
      since: "0000-12-31",
      until: -Infinity,
      offset: 1,
      name: "Before Christ",
      narrow: "BC",
      abbr: "BC"
    }
  ],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function(number) {
    var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
    return number + output;
  }
});
hooks.lang = deprecate(
  "moment.lang is deprecated. Use moment.locale instead.",
  getSetGlobalLocale
);
hooks.langData = deprecate(
  "moment.langData is deprecated. Use moment.localeData instead.",
  getLocale
);
var mathAbs = Math.abs;
function abs() {
  var data = this._data;
  this._milliseconds = mathAbs(this._milliseconds);
  this._days = mathAbs(this._days);
  this._months = mathAbs(this._months);
  data.milliseconds = mathAbs(data.milliseconds);
  data.seconds = mathAbs(data.seconds);
  data.minutes = mathAbs(data.minutes);
  data.hours = mathAbs(data.hours);
  data.months = mathAbs(data.months);
  data.years = mathAbs(data.years);
  return this;
}
function addSubtract$1(duration, input, value, direction) {
  var other = createDuration(input, value);
  duration._milliseconds += direction * other._milliseconds;
  duration._days += direction * other._days;
  duration._months += direction * other._months;
  return duration._bubble();
}
function add$1(input, value) {
  return addSubtract$1(this, input, value, 1);
}
function subtract$1(input, value) {
  return addSubtract$1(this, input, value, -1);
}
function absCeil(number) {
  if (number < 0) {
    return Math.floor(number);
  } else {
    return Math.ceil(number);
  }
}
function bubble() {
  var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
  if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
    milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
    days2 = 0;
    months2 = 0;
  }
  data.milliseconds = milliseconds2 % 1e3;
  seconds2 = absFloor(milliseconds2 / 1e3);
  data.seconds = seconds2 % 60;
  minutes2 = absFloor(seconds2 / 60);
  data.minutes = minutes2 % 60;
  hours2 = absFloor(minutes2 / 60);
  data.hours = hours2 % 24;
  days2 += absFloor(hours2 / 24);
  monthsFromDays = absFloor(daysToMonths(days2));
  months2 += monthsFromDays;
  days2 -= absCeil(monthsToDays(monthsFromDays));
  years2 = absFloor(months2 / 12);
  months2 %= 12;
  data.days = days2;
  data.months = months2;
  data.years = years2;
  return this;
}
function daysToMonths(days2) {
  return days2 * 4800 / 146097;
}
function monthsToDays(months2) {
  return months2 * 146097 / 4800;
}
function as(units) {
  if (!this.isValid()) {
    return NaN;
  }
  var days2, months2, milliseconds2 = this._milliseconds;
  units = normalizeUnits(units);
  if (units === "month" || units === "quarter" || units === "year") {
    days2 = this._days + milliseconds2 / 864e5;
    months2 = this._months + daysToMonths(days2);
    switch (units) {
      case "month":
        return months2;
      case "quarter":
        return months2 / 3;
      case "year":
        return months2 / 12;
    }
  } else {
    days2 = this._days + Math.round(monthsToDays(this._months));
    switch (units) {
      case "week":
        return days2 / 7 + milliseconds2 / 6048e5;
      case "day":
        return days2 + milliseconds2 / 864e5;
      case "hour":
        return days2 * 24 + milliseconds2 / 36e5;
      case "minute":
        return days2 * 1440 + milliseconds2 / 6e4;
      case "second":
        return days2 * 86400 + milliseconds2 / 1e3;
      case "millisecond":
        return Math.floor(days2 * 864e5) + milliseconds2;
      default:
        throw new Error("Unknown unit " + units);
    }
  }
}
function makeAs(alias) {
  return function() {
    return this.as(alias);
  };
}
var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y"), valueOf$1 = asMilliseconds;
function clone$1() {
  return createDuration(this);
}
function get$2(units) {
  units = normalizeUnits(units);
  return this.isValid() ? this[units + "s"]() : NaN;
}
function makeGetter(name) {
  return function() {
    return this.isValid() ? this._data[name] : NaN;
  };
}
var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
function weeks() {
  return absFloor(this.days() / 7);
}
var round = Math.round, thresholds = {
  ss: 44,
  // a few seconds to seconds
  s: 45,
  // seconds to minute
  m: 45,
  // minutes to hour
  h: 22,
  // hours to day
  d: 26,
  // days to month/week
  w: null,
  // weeks to month
  M: 11
  // months to year
};
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
  return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}
function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
  var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
  if (thresholds2.w != null) {
    a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
  }
  a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
  a[2] = withoutSuffix;
  a[3] = +posNegDuration > 0;
  a[4] = locale2;
  return substituteTimeAgo.apply(null, a);
}
function getSetRelativeTimeRounding(roundingFunction) {
  if (roundingFunction === void 0) {
    return round;
  }
  if (typeof roundingFunction === "function") {
    round = roundingFunction;
    return true;
  }
  return false;
}
function getSetRelativeTimeThreshold(threshold, limit) {
  if (thresholds[threshold] === void 0) {
    return false;
  }
  if (limit === void 0) {
    return thresholds[threshold];
  }
  thresholds[threshold] = limit;
  if (threshold === "s") {
    thresholds.ss = limit - 1;
  }
  return true;
}
function humanize(argWithSuffix, argThresholds) {
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }
  var withSuffix = false, th = thresholds, locale2, output;
  if (typeof argWithSuffix === "object") {
    argThresholds = argWithSuffix;
    argWithSuffix = false;
  }
  if (typeof argWithSuffix === "boolean") {
    withSuffix = argWithSuffix;
  }
  if (typeof argThresholds === "object") {
    th = Object.assign({}, thresholds, argThresholds);
    if (argThresholds.s != null && argThresholds.ss == null) {
      th.ss = argThresholds.s - 1;
    }
  }
  locale2 = this.localeData();
  output = relativeTime$1(this, !withSuffix, th, locale2);
  if (withSuffix) {
    output = locale2.pastFuture(+this, output);
  }
  return locale2.postformat(output);
}
var abs$1 = Math.abs;
function sign(x) {
  return (x > 0) - (x < 0) || +x;
}
function toISOString$1() {
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }
  var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
  if (!total) {
    return "P0D";
  }
  minutes2 = absFloor(seconds2 / 60);
  hours2 = absFloor(minutes2 / 60);
  seconds2 %= 60;
  minutes2 %= 60;
  years2 = absFloor(months2 / 12);
  months2 %= 12;
  s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
  totalSign = total < 0 ? "-" : "";
  ymSign = sign(this._months) !== sign(total) ? "-" : "";
  daysSign = sign(this._days) !== sign(total) ? "-" : "";
  hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
  return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
}
var proto$2 = Duration.prototype;
proto$2.isValid = isValid$1;
proto$2.abs = abs;
proto$2.add = add$1;
proto$2.subtract = subtract$1;
proto$2.as = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds = asSeconds;
proto$2.asMinutes = asMinutes;
proto$2.asHours = asHours;
proto$2.asDays = asDays;
proto$2.asWeeks = asWeeks;
proto$2.asMonths = asMonths;
proto$2.asQuarters = asQuarters;
proto$2.asYears = asYears;
proto$2.valueOf = valueOf$1;
proto$2._bubble = bubble;
proto$2.clone = clone$1;
proto$2.get = get$2;
proto$2.milliseconds = milliseconds;
proto$2.seconds = seconds;
proto$2.minutes = minutes;
proto$2.hours = hours;
proto$2.days = days;
proto$2.weeks = weeks;
proto$2.months = months;
proto$2.years = years;
proto$2.humanize = humanize;
proto$2.toISOString = toISOString$1;
proto$2.toString = toISOString$1;
proto$2.toJSON = toISOString$1;
proto$2.locale = locale;
proto$2.localeData = localeData;
proto$2.toIsoString = deprecate(
  "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
  toISOString$1
);
proto$2.lang = lang;
addFormatToken("X", 0, 0, "unix");
addFormatToken("x", 0, 0, "valueOf");
addRegexToken("x", matchSigned);
addRegexToken("X", matchTimestamp);
addParseToken("X", function(input, array, config) {
  config._d = new Date(parseFloat(input) * 1e3);
});
addParseToken("x", function(input, array, config) {
  config._d = new Date(toInt(input));
});
//! moment.js
hooks.version = "2.30.1";
setHookCallback(createLocal);
hooks.fn = proto;
hooks.min = min;
hooks.max = max;
hooks.now = now;
hooks.utc = createUTC;
hooks.unix = createUnix;
hooks.months = listMonths;
hooks.isDate = isDate;
hooks.locale = getSetGlobalLocale;
hooks.invalid = createInvalid;
hooks.duration = createDuration;
hooks.isMoment = isMoment;
hooks.weekdays = listWeekdays;
hooks.parseZone = createInZone;
hooks.localeData = getLocale;
hooks.isDuration = isDuration;
hooks.monthsShort = listMonthsShort;
hooks.weekdaysMin = listWeekdaysMin;
hooks.defineLocale = defineLocale;
hooks.updateLocale = updateLocale;
hooks.locales = listLocales;
hooks.weekdaysShort = listWeekdaysShort;
hooks.normalizeUnits = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat = getCalendarFormat;
hooks.prototype = proto;
hooks.HTML5_FMT = {
  DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
  // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
  // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
  // <input type="datetime-local" step="0.001" />
  DATE: "YYYY-MM-DD",
  // <input type="date" />
  TIME: "HH:mm",
  // <input type="time" />
  TIME_SECONDS: "HH:mm:ss",
  // <input type="time" step="1" />
  TIME_MS: "HH:mm:ss.SSS",
  // <input type="time" step="0.001" />
  WEEK: "GGGG-[W]WW",
  // <input type="week" />
  MONTH: "YYYY-MM"
  // <input type="month" />
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var lunar = { exports: {} };
(function(module2) {
  (function(root, factory) {
    if (module2.exports) {
      module2.exports = factory();
    } else {
      var o2 = factory();
      for (var i in o2) {
        root[i] = o2[i];
      }
    }
  })(commonjsGlobal, function() {
    var Solar2 = /* @__PURE__ */ function() {
      var _fromDate = function(date) {
        return _fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
      };
      var _fromJulianDay = function(julianDay) {
        var d = Math.floor(julianDay + 0.5);
        var f2 = julianDay + 0.5 - d;
        var c;
        if (d >= 2299161) {
          c = Math.floor((d - 186721625e-2) / 36524.25);
          d += 1 + c - Math.floor(c / 4);
        }
        d += 1524;
        var year = Math.floor((d - 122.1) / 365.25);
        d -= Math.floor(365.25 * year);
        var month = Math.floor(d / 30.601);
        d -= Math.floor(30.601 * month);
        var day = d;
        if (month > 13) {
          month -= 13;
          year -= 4715;
        } else {
          month -= 1;
          year -= 4716;
        }
        f2 *= 24;
        var hour = Math.floor(f2);
        f2 -= hour;
        f2 *= 60;
        var minute = Math.floor(f2);
        f2 -= minute;
        f2 *= 60;
        var second = Math.round(f2);
        if (second > 59) {
          second -= 60;
          minute++;
        }
        if (minute > 59) {
          minute -= 60;
          hour++;
        }
        if (hour > 23) {
          hour -= 24;
          day += 1;
        }
        return _fromYmdHms(year, month, day, hour, minute, second);
      };
      var _fromYmdHms = function(y, m, d, hour, minute, second) {
        var oy = y;
        var om = m;
        var od = d;
        var oh = hour;
        var oi = minute;
        var os = second;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        m *= 1;
        if (isNaN(m)) {
          throw new Error("wrong solar month " + om);
        }
        d *= 1;
        if (isNaN(d)) {
          throw new Error("wrong solar day " + od);
        }
        hour *= 1;
        if (isNaN(hour)) {
          throw new Error("wrong hour " + oh);
        }
        minute *= 1;
        if (isNaN(minute)) {
          throw new Error("wrong minute " + oi);
        }
        second *= 1;
        if (isNaN(second)) {
          throw new Error("wrong second " + os);
        }
        if (1582 === y && 10 === m) {
          if (d > 4 && d < 15) {
            throw new Error("wrong solar year " + y + " month " + m + " day " + d);
          }
        }
        if (m < 1 || m > 12) {
          throw new Error("wrong month " + m);
        }
        if (d < 1 || d > 31) {
          throw new Error("wrong day " + d);
        }
        if (hour < 0 || hour > 23) {
          throw new Error("wrong hour " + hour);
        }
        if (minute < 0 || minute > 59) {
          throw new Error("wrong minute " + minute);
        }
        if (second < 0 || second > 59) {
          throw new Error("wrong second " + second);
        }
        return {
          _p: {
            year: y,
            month: m,
            day: d,
            hour,
            minute,
            second
          },
          subtract: function(solar) {
            return SolarUtil2.getDaysBetween(solar.getYear(), solar.getMonth(), solar.getDay(), this._p.year, this._p.month, this._p.day);
          },
          subtractMinute: function(solar) {
            var days2 = this.subtract(solar);
            var cm = this._p.hour * 60 + this._p.minute;
            var sm = solar.getHour() * 60 + solar.getMinute();
            var m2 = cm - sm;
            if (m2 < 0) {
              m2 += 1440;
              days2--;
            }
            m2 += days2 * 1440;
            return m2;
          },
          isAfter: function(solar) {
            if (this._p.year > solar.getYear()) {
              return true;
            }
            if (this._p.year < solar.getYear()) {
              return false;
            }
            if (this._p.month > solar.getMonth()) {
              return true;
            }
            if (this._p.month < solar.getMonth()) {
              return false;
            }
            if (this._p.day > solar.getDay()) {
              return true;
            }
            if (this._p.day < solar.getDay()) {
              return false;
            }
            if (this._p.hour > solar.getHour()) {
              return true;
            }
            if (this._p.hour < solar.getHour()) {
              return false;
            }
            if (this._p.minute > solar.getMinute()) {
              return true;
            }
            if (this._p.minute < solar.getMinute()) {
              return false;
            }
            return this._p.second > solar.getSecond();
          },
          isBefore: function(solar) {
            if (this._p.year > solar.getYear()) {
              return false;
            }
            if (this._p.year < solar.getYear()) {
              return true;
            }
            if (this._p.month > solar.getMonth()) {
              return false;
            }
            if (this._p.month < solar.getMonth()) {
              return true;
            }
            if (this._p.day > solar.getDay()) {
              return false;
            }
            if (this._p.day < solar.getDay()) {
              return true;
            }
            if (this._p.hour > solar.getHour()) {
              return false;
            }
            if (this._p.hour < solar.getHour()) {
              return true;
            }
            if (this._p.minute > solar.getMinute()) {
              return false;
            }
            if (this._p.minute < solar.getMinute()) {
              return true;
            }
            return this._p.second < solar.getSecond();
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          getDay: function() {
            return this._p.day;
          },
          getHour: function() {
            return this._p.hour;
          },
          getMinute: function() {
            return this._p.minute;
          },
          getSecond: function() {
            return this._p.second;
          },
          getWeek: function() {
            return (Math.floor(this.getJulianDay() + 0.5) + 7000001) % 7;
          },
          getWeekInChinese: function() {
            return SolarUtil2.WEEK[this.getWeek()];
          },
          /**
           * 获取当天的阳历周
           * @param start 星期几作为一周的开始，1234560分别代表星期一至星期天
           */
          getSolarWeek: function(start) {
            return SolarWeek2.fromYmd(this._p.year, this._p.month, this._p.day, start);
          },
          isLeapYear: function() {
            return SolarUtil2.isLeapYear(this._p.year);
          },
          getFestivals: function() {
            var l = [];
            var f2 = SolarUtil2.FESTIVAL[this._p.month + "-" + this._p.day];
            if (f2) {
              l.push(f2);
            }
            var weeks2 = Math.ceil(this._p.day / 7);
            var week = this.getWeek();
            f2 = SolarUtil2.WEEK_FESTIVAL[this._p.month + "-" + weeks2 + "-" + week];
            if (f2) {
              l.push(f2);
            }
            if (this._p.day + 7 > SolarUtil2.getDaysOfMonth(this._p.year, this._p.month)) {
              f2 = SolarUtil2.WEEK_FESTIVAL[this._p.month + "-0-" + week];
              if (f2) {
                l.push(f2);
              }
            }
            return l;
          },
          getOtherFestivals: function() {
            var l = [];
            var fs = SolarUtil2.OTHER_FESTIVAL[this._p.month + "-" + this._p.day];
            if (fs) {
              l = l.concat(fs);
            }
            return l;
          },
          getXingzuo: function() {
            return this.getXingZuo();
          },
          getXingZuo: function() {
            var index2 = 11;
            var y2 = this._p.month * 100 + this._p.day;
            if (y2 >= 321 && y2 <= 419) {
              index2 = 0;
            } else if (y2 >= 420 && y2 <= 520) {
              index2 = 1;
            } else if (y2 >= 521 && y2 <= 621) {
              index2 = 2;
            } else if (y2 >= 622 && y2 <= 722) {
              index2 = 3;
            } else if (y2 >= 723 && y2 <= 822) {
              index2 = 4;
            } else if (y2 >= 823 && y2 <= 922) {
              index2 = 5;
            } else if (y2 >= 923 && y2 <= 1023) {
              index2 = 6;
            } else if (y2 >= 1024 && y2 <= 1122) {
              index2 = 7;
            } else if (y2 >= 1123 && y2 <= 1221) {
              index2 = 8;
            } else if (y2 >= 1222 || y2 <= 119) {
              index2 = 9;
            } else if (y2 <= 218) {
              index2 = 10;
            }
            return SolarUtil2.XINGZUO[index2];
          },
          toYmd: function() {
            var m2 = this._p.month;
            var d2 = this._p.day;
            var y2 = this._p.year + "";
            while (y2.length < 4) {
              y2 = "0" + y2;
            }
            return [y2, (m2 < 10 ? "0" : "") + m2, (d2 < 10 ? "0" : "") + d2].join("-");
          },
          toYmdHms: function() {
            return this.toYmd() + " " + [(this._p.hour < 10 ? "0" : "") + this._p.hour, (this._p.minute < 10 ? "0" : "") + this._p.minute, (this._p.second < 10 ? "0" : "") + this._p.second].join(":");
          },
          toString: function() {
            return this.toYmd();
          },
          toFullString: function() {
            var s = this.toYmdHms();
            if (this.isLeapYear()) {
              s += " 闰年";
            }
            s += " 星期" + this.getWeekInChinese();
            var festivals = this.getFestivals();
            for (var i = 0, j = festivals.length; i < j; i++) {
              s += " (" + festivals[i] + ")";
            }
            s += " " + this.getXingZuo() + "座";
            return s;
          },
          nextYear: function(years2) {
            var oy2 = years2;
            years2 *= 1;
            if (isNaN(years2)) {
              throw new Error("wrong years " + oy2);
            }
            var y2 = this._p.year + years2;
            var m2 = this._p.month;
            var d2 = this._p.day;
            if (1582 === y2 && 10 === m2) {
              if (d2 > 4 && d2 < 15) {
                d2 += 10;
              }
            } else if (2 === m2) {
              if (d2 > 28) {
                if (!SolarUtil2.isLeapYear(y2)) {
                  d2 = 28;
                }
              }
            }
            return _fromYmdHms(y2, m2, d2, this._p.hour, this._p.minute, this._p.second);
          },
          nextMonth: function(months2) {
            var om2 = months2;
            months2 *= 1;
            if (isNaN(months2)) {
              throw new Error("wrong months " + om2);
            }
            var month = SolarMonth2.fromYm(this._p.year, this._p.month).next(months2);
            var y2 = month.getYear();
            var m2 = month.getMonth();
            var d2 = this._p.day;
            if (1582 === y2 && 10 === m2) {
              if (d2 > 4 && d2 < 15) {
                d2 += 10;
              }
            } else {
              var maxDay = SolarUtil2.getDaysOfMonth(y2, m2);
              if (d2 > maxDay) {
                d2 = maxDay;
              }
            }
            return _fromYmdHms(y2, m2, d2, this._p.hour, this._p.minute, this._p.second);
          },
          nextDay: function(days2) {
            var od2 = days2;
            days2 *= 1;
            if (isNaN(days2)) {
              throw new Error("wrong days " + od2);
            }
            var y2 = this._p.year;
            var m2 = this._p.month;
            var d2 = this._p.day;
            if (1582 === y2 && 10 === m2) {
              if (d2 > 4) {
                d2 -= 10;
              }
            }
            if (days2 > 0) {
              d2 += days2;
              var daysInMonth2 = SolarUtil2.getDaysOfMonth(y2, m2);
              while (d2 > daysInMonth2) {
                d2 -= daysInMonth2;
                m2++;
                if (m2 > 12) {
                  m2 = 1;
                  y2++;
                }
                daysInMonth2 = SolarUtil2.getDaysOfMonth(y2, m2);
              }
            } else if (days2 < 0) {
              while (d2 + days2 <= 0) {
                m2--;
                if (m2 < 1) {
                  m2 = 12;
                  y2--;
                }
                d2 += SolarUtil2.getDaysOfMonth(y2, m2);
              }
              d2 += days2;
            }
            if (1582 === y2 && 10 === m2) {
              if (d2 > 4) {
                d2 += 10;
              }
            }
            return _fromYmdHms(y2, m2, d2, this._p.hour, this._p.minute, this._p.second);
          },
          nextWorkday: function(days2) {
            var od2 = days2;
            days2 *= 1;
            if (isNaN(days2)) {
              throw new Error("wrong days " + od2);
            }
            var solar = _fromYmdHms(this._p.year, this._p.month, this._p.day, this._p.hour, this._p.minute, this._p.second);
            if (days2 !== 0) {
              var rest = Math.abs(days2);
              var add2 = days2 < 1 ? -1 : 1;
              while (rest > 0) {
                solar = solar.next(add2);
                var work = true;
                var holiday = HolidayUtil2.getHoliday(solar.getYear(), solar.getMonth(), solar.getDay());
                if (!holiday) {
                  var week = solar.getWeek();
                  if (0 === week || 6 === week) {
                    work = false;
                  }
                } else {
                  work = holiday.isWork();
                }
                if (work) {
                  rest -= 1;
                }
              }
            }
            return solar;
          },
          next: function(days2, onlyWorkday) {
            if (onlyWorkday) {
              return this.nextWorkday(days2);
            }
            return this.nextDay(days2);
          },
          nextHour: function(hours2) {
            var oh2 = hours2;
            hours2 *= 1;
            if (isNaN(hours2)) {
              throw new Error("wrong hours " + oh2);
            }
            var h = this._p.hour + hours2;
            var n = h < 0 ? -1 : 1;
            var hour2 = Math.abs(h);
            var days2 = Math.floor(hour2 / 24) * n;
            hour2 = hour2 % 24 * n;
            if (hour2 < 0) {
              hour2 += 24;
              days2--;
            }
            var solar = this.next(days2);
            return _fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), hour2, solar.getMinute(), solar.getSecond());
          },
          getLunar: function() {
            return Lunar2.fromSolar(this);
          },
          getJulianDay: function() {
            var y2 = this._p.year;
            var m2 = this._p.month;
            var d2 = this._p.day + ((this._p.second / 60 + this._p.minute) / 60 + this._p.hour) / 24;
            var n = 0;
            var g = false;
            if (y2 * 372 + m2 * 31 + Math.floor(d2) >= 588829) {
              g = true;
            }
            if (m2 <= 2) {
              m2 += 12;
              y2--;
            }
            if (g) {
              n = Math.floor(y2 / 100);
              n = 2 - n + Math.floor(n / 4);
            }
            return Math.floor(365.25 * (y2 + 4716)) + Math.floor(30.6001 * (m2 + 1)) + d2 + n - 1524.5;
          },
          getSalaryRate: function() {
            if (this._p.month === 1 && this._p.day === 1) {
              return 3;
            }
            if (this._p.month === 5 && this._p.day === 1) {
              return 3;
            }
            if (this._p.month === 10 && this._p.day >= 1 && this._p.day <= 3) {
              return 3;
            }
            var lunar2 = this.getLunar();
            if (lunar2.getMonth() === 1 && lunar2.getDay() >= 1 && lunar2.getDay() <= 3) {
              return 3;
            }
            if (lunar2.getMonth() === 5 && lunar2.getDay() === 5) {
              return 3;
            }
            if (lunar2.getMonth() === 8 && lunar2.getDay() === 15) {
              return 3;
            }
            if ("清明" === lunar2.getJieQi()) {
              return 3;
            }
            var holiday = HolidayUtil2.getHoliday(this._p.year, this._p.month, this._p.day);
            if (holiday) {
              if (!holiday.isWork()) {
                return 2;
              }
            } else {
              var week = this.getWeek();
              if (week === 6 || week === 0) {
                return 2;
              }
            }
            return 1;
          }
        };
      };
      var _fromBaZi = function(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect, baseYear) {
        sect *= 1;
        if (isNaN(sect)) {
          sect = 2;
        }
        if (1 !== sect) {
          sect = 2;
        }
        baseYear *= 1;
        if (isNaN(baseYear)) {
          baseYear = 1900;
        }
        var l = [];
        var m = LunarUtil2.index(monthGanZhi.substring(1), LunarUtil2.ZHI, -1) - 2;
        if (m < 0) {
          m += 12;
        }
        if (((LunarUtil2.index(yearGanZhi.substring(0, 1), LunarUtil2.GAN, -1) + 1) * 2 + m) % 10 !== LunarUtil2.index(monthGanZhi.substring(0, 1), LunarUtil2.GAN, -1)) {
          return l;
        }
        var y = LunarUtil2.getJiaZiIndex(yearGanZhi) - 57;
        if (y < 0) {
          y += 60;
        }
        y++;
        m *= 2;
        var h = LunarUtil2.index(timeGanZhi.substring(1), LunarUtil2.ZHI, -1) * 2;
        var hours2 = [h];
        if (0 === h && 2 === sect) {
          hours2 = [0, 23];
        }
        var startYear = baseYear - 1;
        var endYear = (/* @__PURE__ */ new Date()).getFullYear();
        while (y <= endYear) {
          if (y >= startYear) {
            var jieQiLunar = Lunar2.fromYmd(y, 1, 1);
            var jieQiList = jieQiLunar.getJieQiList();
            var jieQiTable = jieQiLunar.getJieQiTable();
            var solarTime = jieQiTable[jieQiList[4 + m]];
            if (solarTime.getYear() >= baseYear) {
              var d = LunarUtil2.getJiaZiIndex(dayGanZhi) - LunarUtil2.getJiaZiIndex(solarTime.getLunar().getDayInGanZhiExact2());
              if (d < 0) {
                d += 60;
              }
              if (d > 0) {
                solarTime = solarTime.next(d);
              }
              for (var i = 0, j = hours2.length; i < j; i++) {
                var hour = hours2[i];
                var mi = 0;
                var s = 0;
                if (d === 0 && hour === solarTime.getHour()) {
                  mi = solarTime.getMinute();
                  s = solarTime.getSecond();
                }
                var solar = Solar2.fromYmdHms(solarTime.getYear(), solarTime.getMonth(), solarTime.getDay(), hour, mi, s);
                if (d === 30) {
                  solar = solar.nextHour(-1);
                }
                var lunar2 = solar.getLunar();
                var dgz = 2 === sect ? lunar2.getDayInGanZhiExact2() : lunar2.getDayInGanZhiExact();
                if (lunar2.getYearInGanZhiExact() === yearGanZhi && lunar2.getMonthInGanZhiExact() === monthGanZhi && dgz === dayGanZhi && lunar2.getTimeInGanZhi() === timeGanZhi) {
                  l.push(solar);
                }
              }
            }
          }
          y += 60;
        }
        return l;
      };
      return {
        J2000: 2451545,
        fromYmd: function(y, m, d) {
          return _fromYmdHms(y, m, d, 0, 0, 0);
        },
        fromYmdHms: function(y, m, d, hour, minute, second) {
          return _fromYmdHms(y, m, d, hour, minute, second);
        },
        fromDate: function(date) {
          return _fromDate(date);
        },
        fromJulianDay: function(julianDay) {
          return _fromJulianDay(julianDay);
        },
        fromBaZi: function(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect, baseYear) {
          return _fromBaZi(yearGanZhi, monthGanZhi, dayGanZhi, timeGanZhi, sect, baseYear);
        }
      };
    }();
    var Lunar2 = /* @__PURE__ */ function() {
      var _computeJieQi = function(o2, ly) {
        o2["jieQiList"] = [];
        o2["jieQi"] = {};
        var julianDays = ly.getJieQiJulianDays();
        for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i++) {
          var key = LunarUtil2.JIE_QI_IN_USE[i];
          o2["jieQiList"].push(key);
          o2["jieQi"][key] = Solar2.fromJulianDay(julianDays[i]);
        }
      };
      var _computeYear = function(o2, solar, year) {
        var offset2 = year - 4;
        var yearGanIndex = offset2 % 10;
        var yearZhiIndex = offset2 % 12;
        if (yearGanIndex < 0) {
          yearGanIndex += 10;
        }
        if (yearZhiIndex < 0) {
          yearZhiIndex += 12;
        }
        var g = yearGanIndex;
        var z = yearZhiIndex;
        var gExact = yearGanIndex;
        var zExact = yearZhiIndex;
        var solarYear = solar.getYear();
        var solarYmd = solar.toYmd();
        var solarYmdHms = solar.toYmdHms();
        var liChun = o2["jieQi"][I18n2.getMessage("jq.liChun")];
        if (liChun.getYear() !== solarYear) {
          liChun = o2["jieQi"]["LI_CHUN"];
        }
        var liChunYmd = liChun.toYmd();
        var liChunYmdHms = liChun.toYmdHms();
        if (year === solarYear) {
          if (solarYmd < liChunYmd) {
            g--;
            z--;
          }
          if (solarYmdHms < liChunYmdHms) {
            gExact--;
            zExact--;
          }
        } else if (year < solarYear) {
          if (solarYmd >= liChunYmd) {
            g++;
            z++;
          }
          if (solarYmdHms >= liChunYmdHms) {
            gExact++;
            zExact++;
          }
        }
        o2["yearGanIndex"] = yearGanIndex;
        o2["yearZhiIndex"] = yearZhiIndex;
        o2["yearGanIndexByLiChun"] = (g < 0 ? g + 10 : g) % 10;
        o2["yearZhiIndexByLiChun"] = (z < 0 ? z + 12 : z) % 12;
        o2["yearGanIndexExact"] = (gExact < 0 ? gExact + 10 : gExact) % 10;
        o2["yearZhiIndexExact"] = (zExact < 0 ? zExact + 12 : zExact) % 12;
      };
      var _computeMonth = function(o2, solar) {
        var start = null;
        var i;
        var end;
        var size2 = LunarUtil2.JIE_QI_IN_USE.length;
        var index2 = -3;
        for (i = 0; i < size2; i += 2) {
          end = o2.jieQi[LunarUtil2.JIE_QI_IN_USE[i]];
          var ymd = solar.toYmd();
          var symd = null == start ? ymd : start.toYmd();
          if (ymd >= symd && ymd < end.toYmd()) {
            break;
          }
          start = end;
          index2++;
        }
        var offset2 = ((o2.yearGanIndexByLiChun + (index2 < 0 ? 1 : 0)) % 5 + 1) * 2 % 10;
        o2["monthGanIndex"] = ((index2 < 0 ? index2 + 10 : index2) + offset2) % 10;
        o2["monthZhiIndex"] = ((index2 < 0 ? index2 + 12 : index2) + LunarUtil2.BASE_MONTH_ZHI_INDEX) % 12;
        start = null;
        index2 = -3;
        for (i = 0; i < size2; i += 2) {
          end = o2.jieQi[LunarUtil2.JIE_QI_IN_USE[i]];
          var time = solar.toYmdHms();
          var stime = null == start ? time : start.toYmdHms();
          if (time >= stime && time < end.toYmdHms()) {
            break;
          }
          start = end;
          index2++;
        }
        offset2 = ((o2.yearGanIndexExact + (index2 < 0 ? 1 : 0)) % 5 + 1) * 2 % 10;
        o2["monthGanIndexExact"] = ((index2 < 0 ? index2 + 10 : index2) + offset2) % 10;
        o2["monthZhiIndexExact"] = ((index2 < 0 ? index2 + 12 : index2) + LunarUtil2.BASE_MONTH_ZHI_INDEX) % 12;
      };
      var _computeDay = function(o2, solar, hour, minute) {
        var noon = Solar2.fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), 12, 0, 0);
        var offset2 = Math.floor(noon.getJulianDay()) - 11;
        var dayGanIndex = offset2 % 10;
        var dayZhiIndex = offset2 % 12;
        o2["dayGanIndex"] = dayGanIndex;
        o2["dayZhiIndex"] = dayZhiIndex;
        var dayGanExact = dayGanIndex;
        var dayZhiExact = dayZhiIndex;
        o2["dayGanIndexExact2"] = dayGanExact;
        o2["dayZhiIndexExact2"] = dayZhiExact;
        var hm = (hour < 10 ? "0" : "") + hour + ":" + (minute < 10 ? "0" : "") + minute;
        if (hm >= "23:00" && hm <= "23:59") {
          dayGanExact++;
          if (dayGanExact >= 10) {
            dayGanExact -= 10;
          }
          dayZhiExact++;
          if (dayZhiExact >= 12) {
            dayZhiExact -= 12;
          }
        }
        o2["dayGanIndexExact"] = dayGanExact;
        o2["dayZhiIndexExact"] = dayZhiExact;
      };
      var _computeTime = function(o2, hour, minute) {
        var timeZhiIndex = LunarUtil2.getTimeZhiIndex((hour < 10 ? "0" : "") + hour + ":" + (minute < 10 ? "0" : "") + minute);
        o2["timeZhiIndex"] = timeZhiIndex;
        o2["timeGanIndex"] = (o2["dayGanIndexExact"] % 5 * 2 + timeZhiIndex) % 10;
      };
      var _computeWeek = function(o2, solar) {
        o2["weekIndex"] = solar.getWeek();
      };
      var _compute = function(year, hour, minute, second, solar, ly) {
        var o2 = {};
        _computeJieQi(o2, ly);
        _computeYear(o2, solar, year);
        _computeMonth(o2, solar);
        _computeDay(o2, solar, hour, minute);
        _computeTime(o2, hour, minute);
        _computeWeek(o2, solar);
        return o2;
      };
      var _fromSolar = function(solar) {
        var lunarYear = 0;
        var lunarMonth = 0;
        var lunarDay = 0;
        var ly = LunarYear2.fromYear(solar.getYear());
        var lms = ly.getMonths();
        for (var i = 0, j = lms.length; i < j; i++) {
          var m = lms[i];
          var days2 = solar.subtract(Solar2.fromJulianDay(m.getFirstJulianDay()));
          if (days2 < m.getDayCount()) {
            lunarYear = m.getYear();
            lunarMonth = m.getMonth();
            lunarDay = days2 + 1;
            break;
          }
        }
        return _new(lunarYear, lunarMonth, lunarDay, solar.getHour(), solar.getMinute(), solar.getSecond(), solar, ly);
      };
      var _fromDate = function(date) {
        return _fromSolar(Solar2.fromDate(date));
      };
      var _fromYmdHms = function(lunarYear, lunarMonth, lunarDay, hour, minute, second) {
        var oy = lunarYear;
        var om = lunarMonth;
        var od = lunarDay;
        var oh = hour;
        var oi = minute;
        var os = second;
        lunarYear *= 1;
        if (isNaN(lunarYear)) {
          throw new Error("wrong lunar year " + oy);
        }
        lunarMonth *= 1;
        if (isNaN(lunarMonth)) {
          throw new Error("wrong lunar month " + om);
        }
        lunarDay *= 1;
        if (isNaN(lunarDay)) {
          throw new Error("wrong lunar day " + od);
        }
        hour *= 1;
        if (isNaN(hour)) {
          throw new Error("wrong hour " + oh);
        }
        minute *= 1;
        if (isNaN(minute)) {
          throw new Error("wrong minute " + oi);
        }
        second *= 1;
        if (isNaN(second)) {
          throw new Error("wrong second " + os);
        }
        if (hour < 0 || hour > 23) {
          throw new Error("wrong hour " + hour);
        }
        if (minute < 0 || minute > 59) {
          throw new Error("wrong minute " + minute);
        }
        if (second < 0 || second > 59) {
          throw new Error("wrong second " + second);
        }
        var y = LunarYear2.fromYear(lunarYear);
        var m = y.getMonth(lunarMonth);
        if (null == m) {
          throw new Error("wrong lunar year " + lunarYear + " month " + lunarMonth);
        }
        if (lunarDay < 1) {
          throw new Error("lunar day must bigger than 0");
        }
        var days2 = m.getDayCount();
        if (lunarDay > days2) {
          throw new Error("only " + days2 + " days in lunar year " + lunarYear + " month " + lunarMonth);
        }
        var noon = Solar2.fromJulianDay(m.getFirstJulianDay() + lunarDay - 1);
        var solar = Solar2.fromYmdHms(noon.getYear(), noon.getMonth(), noon.getDay(), hour, minute, second);
        if (noon.getYear() !== lunarYear) {
          y = LunarYear2.fromYear(noon.getYear());
        }
        return _new(lunarYear, lunarMonth, lunarDay, hour, minute, second, solar, y);
      };
      var _new = function(year, month, day, hour, minute, second, solar, ly) {
        var gz = _compute(year, hour, minute, second, solar, ly);
        return {
          _p: {
            lang: I18n2.getLanguage(),
            year,
            month,
            day,
            hour,
            minute,
            second,
            timeGanIndex: gz.timeGanIndex,
            timeZhiIndex: gz.timeZhiIndex,
            dayGanIndex: gz.dayGanIndex,
            dayZhiIndex: gz.dayZhiIndex,
            dayGanIndexExact: gz.dayGanIndexExact,
            dayZhiIndexExact: gz.dayZhiIndexExact,
            dayGanIndexExact2: gz.dayGanIndexExact2,
            dayZhiIndexExact2: gz.dayZhiIndexExact2,
            monthGanIndex: gz.monthGanIndex,
            monthZhiIndex: gz.monthZhiIndex,
            monthGanIndexExact: gz.monthGanIndexExact,
            monthZhiIndexExact: gz.monthZhiIndexExact,
            yearGanIndex: gz.yearGanIndex,
            yearZhiIndex: gz.yearZhiIndex,
            yearGanIndexByLiChun: gz.yearGanIndexByLiChun,
            yearZhiIndexByLiChun: gz.yearZhiIndexByLiChun,
            yearGanIndexExact: gz.yearGanIndexExact,
            yearZhiIndexExact: gz.yearZhiIndexExact,
            weekIndex: gz.weekIndex,
            jieQi: gz.jieQi,
            jieQiList: gz.jieQiList,
            solar,
            eightChar: null
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          getDay: function() {
            return this._p.day;
          },
          getHour: function() {
            return this._p.hour;
          },
          getMinute: function() {
            return this._p.minute;
          },
          getSecond: function() {
            return this._p.second;
          },
          getTimeGanIndex: function() {
            return this._p.timeGanIndex;
          },
          getTimeZhiIndex: function() {
            return this._p.timeZhiIndex;
          },
          getDayGanIndex: function() {
            return this._p.dayGanIndex;
          },
          getDayGanIndexExact: function() {
            return this._p.dayGanIndexExact;
          },
          getDayGanIndexExact2: function() {
            return this._p.dayGanIndexExact2;
          },
          getDayZhiIndex: function() {
            return this._p.dayZhiIndex;
          },
          getDayZhiIndexExact: function() {
            return this._p.dayZhiIndexExact;
          },
          getDayZhiIndexExact2: function() {
            return this._p.dayZhiIndexExact2;
          },
          getMonthGanIndex: function() {
            return this._p.monthGanIndex;
          },
          getMonthGanIndexExact: function() {
            return this._p.monthGanIndexExact;
          },
          getMonthZhiIndex: function() {
            return this._p.monthZhiIndex;
          },
          getMonthZhiIndexExact: function() {
            return this._p.monthZhiIndexExact;
          },
          getYearGanIndex: function() {
            return this._p.yearGanIndex;
          },
          getYearGanIndexByLiChun: function() {
            return this._p.yearGanIndexByLiChun;
          },
          getYearGanIndexExact: function() {
            return this._p.yearGanIndexExact;
          },
          getYearZhiIndex: function() {
            return this._p.yearZhiIndex;
          },
          getYearZhiIndexByLiChun: function() {
            return this._p.yearZhiIndexByLiChun;
          },
          getYearZhiIndexExact: function() {
            return this._p.yearZhiIndexExact;
          },
          getGan: function() {
            return this.getYearGan();
          },
          getZhi: function() {
            return this.getYearZhi();
          },
          getYearGan: function() {
            return LunarUtil2.GAN[this._p.yearGanIndex + 1];
          },
          getYearGanByLiChun: function() {
            return LunarUtil2.GAN[this._p.yearGanIndexByLiChun + 1];
          },
          getYearGanExact: function() {
            return LunarUtil2.GAN[this._p.yearGanIndexExact + 1];
          },
          getYearZhi: function() {
            return LunarUtil2.ZHI[this._p.yearZhiIndex + 1];
          },
          getYearZhiByLiChun: function() {
            return LunarUtil2.ZHI[this._p.yearZhiIndexByLiChun + 1];
          },
          getYearZhiExact: function() {
            return LunarUtil2.ZHI[this._p.yearZhiIndexExact + 1];
          },
          getYearInGanZhi: function() {
            return this.getYearGan() + this.getYearZhi();
          },
          getYearInGanZhiByLiChun: function() {
            return this.getYearGanByLiChun() + this.getYearZhiByLiChun();
          },
          getYearInGanZhiExact: function() {
            return this.getYearGanExact() + this.getYearZhiExact();
          },
          getMonthGan: function() {
            return LunarUtil2.GAN[this._p.monthGanIndex + 1];
          },
          getMonthGanExact: function() {
            return LunarUtil2.GAN[this._p.monthGanIndexExact + 1];
          },
          getMonthZhi: function() {
            return LunarUtil2.ZHI[this._p.monthZhiIndex + 1];
          },
          getMonthZhiExact: function() {
            return LunarUtil2.ZHI[this._p.monthZhiIndexExact + 1];
          },
          getMonthInGanZhi: function() {
            return this.getMonthGan() + this.getMonthZhi();
          },
          getMonthInGanZhiExact: function() {
            return this.getMonthGanExact() + this.getMonthZhiExact();
          },
          getDayGan: function() {
            return LunarUtil2.GAN[this._p.dayGanIndex + 1];
          },
          getDayGanExact: function() {
            return LunarUtil2.GAN[this._p.dayGanIndexExact + 1];
          },
          getDayGanExact2: function() {
            return LunarUtil2.GAN[this._p.dayGanIndexExact2 + 1];
          },
          getDayZhi: function() {
            return LunarUtil2.ZHI[this._p.dayZhiIndex + 1];
          },
          getDayZhiExact: function() {
            return LunarUtil2.ZHI[this._p.dayZhiIndexExact + 1];
          },
          getDayZhiExact2: function() {
            return LunarUtil2.ZHI[this._p.dayZhiIndexExact2 + 1];
          },
          getDayInGanZhi: function() {
            return this.getDayGan() + this.getDayZhi();
          },
          getDayInGanZhiExact: function() {
            return this.getDayGanExact() + this.getDayZhiExact();
          },
          getDayInGanZhiExact2: function() {
            return this.getDayGanExact2() + this.getDayZhiExact2();
          },
          getTimeGan: function() {
            return LunarUtil2.GAN[this._p.timeGanIndex + 1];
          },
          getTimeZhi: function() {
            return LunarUtil2.ZHI[this._p.timeZhiIndex + 1];
          },
          getTimeInGanZhi: function() {
            return this.getTimeGan() + this.getTimeZhi();
          },
          getShengxiao: function() {
            return this.getYearShengXiao();
          },
          getYearShengXiao: function() {
            return LunarUtil2.SHENGXIAO[this._p.yearZhiIndex + 1];
          },
          getYearShengXiaoByLiChun: function() {
            return LunarUtil2.SHENGXIAO[this._p.yearZhiIndexByLiChun + 1];
          },
          getYearShengXiaoExact: function() {
            return LunarUtil2.SHENGXIAO[this._p.yearZhiIndexExact + 1];
          },
          getMonthShengXiao: function() {
            return LunarUtil2.SHENGXIAO[this._p.monthZhiIndex + 1];
          },
          getMonthShengXiaoExact: function() {
            return LunarUtil2.SHENGXIAO[this._p.monthZhiIndexExact + 1];
          },
          getDayShengXiao: function() {
            return LunarUtil2.SHENGXIAO[this._p.dayZhiIndex + 1];
          },
          getTimeShengXiao: function() {
            return LunarUtil2.SHENGXIAO[this._p.timeZhiIndex + 1];
          },
          getYearInChinese: function() {
            var y = this._p.year + "";
            var s = "";
            var zero = "0".charCodeAt(0);
            for (var i = 0, j = y.length; i < j; i++) {
              s += LunarUtil2.NUMBER[y.charCodeAt(i) - zero];
            }
            return s;
          },
          getMonthInChinese: function() {
            var month2 = this._p.month;
            return (month2 < 0 ? "闰" : "") + LunarUtil2.MONTH[Math.abs(month2)];
          },
          getDayInChinese: function() {
            return LunarUtil2.DAY[this._p.day];
          },
          getPengZuGan: function() {
            return LunarUtil2.PENGZU_GAN[this._p.dayGanIndex + 1];
          },
          getPengZuZhi: function() {
            return LunarUtil2.PENGZU_ZHI[this._p.dayZhiIndex + 1];
          },
          getPositionXi: function() {
            return this.getDayPositionXi();
          },
          getPositionXiDesc: function() {
            return this.getDayPositionXiDesc();
          },
          getPositionYangGui: function() {
            return this.getDayPositionYangGui();
          },
          getPositionYangGuiDesc: function() {
            return this.getDayPositionYangGuiDesc();
          },
          getPositionYinGui: function() {
            return this.getDayPositionYinGui();
          },
          getPositionYinGuiDesc: function() {
            return this.getDayPositionYinGuiDesc();
          },
          getPositionFu: function() {
            return this.getDayPositionFu();
          },
          getPositionFuDesc: function() {
            return this.getDayPositionFuDesc();
          },
          getPositionCai: function() {
            return this.getDayPositionCai();
          },
          getPositionCaiDesc: function() {
            return this.getDayPositionCaiDesc();
          },
          getDayPositionXi: function() {
            return LunarUtil2.POSITION_XI[this._p.dayGanIndex + 1];
          },
          getDayPositionXiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getDayPositionXi()];
          },
          getDayPositionYangGui: function() {
            return LunarUtil2.POSITION_YANG_GUI[this._p.dayGanIndex + 1];
          },
          getDayPositionYangGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getDayPositionYangGui()];
          },
          getDayPositionYinGui: function() {
            return LunarUtil2.POSITION_YIN_GUI[this._p.dayGanIndex + 1];
          },
          getDayPositionYinGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getDayPositionYinGui()];
          },
          getDayPositionFu: function(sect) {
            return (1 === sect ? LunarUtil2.POSITION_FU : LunarUtil2.POSITION_FU_2)[this._p.dayGanIndex + 1];
          },
          getDayPositionFuDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getDayPositionFu(sect)];
          },
          getDayPositionCai: function() {
            return LunarUtil2.POSITION_CAI[this._p.dayGanIndex + 1];
          },
          getDayPositionCaiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getDayPositionCai()];
          },
          getTimePositionXi: function() {
            return LunarUtil2.POSITION_XI[this._p.timeGanIndex + 1];
          },
          getTimePositionXiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getTimePositionXi()];
          },
          getTimePositionYangGui: function() {
            return LunarUtil2.POSITION_YANG_GUI[this._p.timeGanIndex + 1];
          },
          getTimePositionYangGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getTimePositionYangGui()];
          },
          getTimePositionYinGui: function() {
            return LunarUtil2.POSITION_YIN_GUI[this._p.timeGanIndex + 1];
          },
          getTimePositionYinGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getTimePositionYinGui()];
          },
          getTimePositionFu: function(sect) {
            return (1 === sect ? LunarUtil2.POSITION_FU : LunarUtil2.POSITION_FU_2)[this._p.timeGanIndex + 1];
          },
          getTimePositionFuDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getTimePositionFu(sect)];
          },
          getTimePositionCai: function() {
            return LunarUtil2.POSITION_CAI[this._p.timeGanIndex + 1];
          },
          getTimePositionCaiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getTimePositionCai()];
          },
          getDayPositionTaiSui: function(sect) {
            var dayInGanZhi;
            var yearZhiIndex;
            switch (sect) {
              case 1:
                dayInGanZhi = this.getDayInGanZhi();
                yearZhiIndex = this._p.yearZhiIndex;
                break;
              case 3:
                dayInGanZhi = this.getDayInGanZhi();
                yearZhiIndex = this._p.yearZhiIndexExact;
                break;
              default:
                dayInGanZhi = this.getDayInGanZhiExact2();
                yearZhiIndex = this._p.yearZhiIndexByLiChun;
            }
            var p;
            if ([I18n2.getMessage("jz.jiaZi"), I18n2.getMessage("jz.yiChou"), I18n2.getMessage("jz.bingYin"), I18n2.getMessage("jz.dingMao"), I18n2.getMessage("jz.wuChen"), I18n2.getMessage("jz.jiSi")].join(",").indexOf(dayInGanZhi) > -1) {
              p = I18n2.getMessage("bg.zhen");
            } else if ([I18n2.getMessage("jz.bingZi"), I18n2.getMessage("jz.dingChou"), I18n2.getMessage("jz.wuYin"), I18n2.getMessage("jz.jiMao"), I18n2.getMessage("jz.gengChen"), I18n2.getMessage("jz.xinSi")].join(",").indexOf(dayInGanZhi) > -1) {
              p = I18n2.getMessage("bg.li");
            } else if ([I18n2.getMessage("jz.wuZi"), I18n2.getMessage("jz.jiChou"), I18n2.getMessage("jz.gengYin"), I18n2.getMessage("jz.xinMao"), I18n2.getMessage("jz.renChen"), I18n2.getMessage("jz.guiSi")].join(",").indexOf(dayInGanZhi) > -1) {
              p = I18n2.getMessage("ps.center");
            } else if ([I18n2.getMessage("jz.gengZi"), I18n2.getMessage("jz.xinChou"), I18n2.getMessage("jz.renYin"), I18n2.getMessage("jz.guiMao"), I18n2.getMessage("jz.jiaChen"), I18n2.getMessage("jz.yiSi")].join(",").indexOf(dayInGanZhi) > -1) {
              p = I18n2.getMessage("bg.dui");
            } else if ([I18n2.getMessage("jz.renZi"), I18n2.getMessage("jz.guiChou"), I18n2.getMessage("jz.jiaYin"), I18n2.getMessage("jz.yiMao"), I18n2.getMessage("jz.bingChen"), I18n2.getMessage("jz.dingSi")].join(",").indexOf(dayInGanZhi) > -1) {
              p = I18n2.getMessage("bg.kan");
            } else {
              p = LunarUtil2.POSITION_TAI_SUI_YEAR[yearZhiIndex];
            }
            return p;
          },
          getDayPositionTaiSuiDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getDayPositionTaiSui(sect)];
          },
          getMonthPositionTaiSui: function(sect) {
            var monthZhiIndex;
            var monthGanIndex;
            switch (sect) {
              case 3:
                monthZhiIndex = this._p.monthZhiIndexExact;
                monthGanIndex = this._p.monthGanIndexExact;
                break;
              default:
                monthZhiIndex = this._p.monthZhiIndex;
                monthGanIndex = this._p.monthGanIndex;
            }
            var m = monthZhiIndex - LunarUtil2.BASE_MONTH_ZHI_INDEX;
            if (m < 0) {
              m += 12;
            }
            return [I18n2.getMessage("bg.gen"), LunarUtil2.POSITION_GAN[monthGanIndex], I18n2.getMessage("bg.kun"), I18n2.getMessage("bg.xun")][m % 4];
          },
          getMonthPositionTaiSuiDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getMonthPositionTaiSui(sect)];
          },
          getYearPositionTaiSui: function(sect) {
            var yearZhiIndex;
            switch (sect) {
              case 1:
                yearZhiIndex = this._p.yearZhiIndex;
                break;
              case 3:
                yearZhiIndex = this._p.yearZhiIndexExact;
                break;
              default:
                yearZhiIndex = this._p.yearZhiIndexByLiChun;
            }
            return LunarUtil2.POSITION_TAI_SUI_YEAR[yearZhiIndex];
          },
          getYearPositionTaiSuiDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getYearPositionTaiSui(sect)];
          },
          _checkLang: function() {
            var lang2 = I18n2.getLanguage();
            if (this._p.lang !== lang2) {
              for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i++) {
                var newKey = LunarUtil2.JIE_QI_IN_USE[i];
                var oldKey = this._p.jieQiList[i];
                var value = this._p.jieQi[oldKey];
                this._p.jieQiList[i] = newKey;
                this._p.jieQi[newKey] = value;
              }
              this._p.lang = lang2;
            }
          },
          _getJieQiSolar: function(name) {
            this._checkLang();
            return this._p.jieQi[name];
          },
          getChong: function() {
            return this.getDayChong();
          },
          getChongGan: function() {
            return this.getDayChongGan();
          },
          getChongGanTie: function() {
            return this.getDayChongGanTie();
          },
          getChongShengXiao: function() {
            return this.getDayChongShengXiao();
          },
          getChongDesc: function() {
            return this.getDayChongDesc();
          },
          getSha: function() {
            return this.getDaySha();
          },
          getDayChong: function() {
            return LunarUtil2.CHONG[this._p.dayZhiIndex];
          },
          getDayChongGan: function() {
            return LunarUtil2.CHONG_GAN[this._p.dayGanIndex];
          },
          getDayChongGanTie: function() {
            return LunarUtil2.CHONG_GAN_TIE[this._p.dayGanIndex];
          },
          getDayChongShengXiao: function() {
            var chong = this.getChong();
            for (var i = 0, j = LunarUtil2.ZHI.length; i < j; i++) {
              if (LunarUtil2.ZHI[i] === chong) {
                return LunarUtil2.SHENGXIAO[i];
              }
            }
            return "";
          },
          getDayChongDesc: function() {
            return "(" + this.getDayChongGan() + this.getDayChong() + ")" + this.getDayChongShengXiao();
          },
          getDaySha: function() {
            return LunarUtil2.SHA[this.getDayZhi()];
          },
          getTimeChong: function() {
            return LunarUtil2.CHONG[this._p.timeZhiIndex];
          },
          getTimeChongGan: function() {
            return LunarUtil2.CHONG_GAN[this._p.timeGanIndex];
          },
          getTimeChongGanTie: function() {
            return LunarUtil2.CHONG_GAN_TIE[this._p.timeGanIndex];
          },
          getTimeChongShengXiao: function() {
            var chong = this.getTimeChong();
            for (var i = 0, j = LunarUtil2.ZHI.length; i < j; i++) {
              if (LunarUtil2.ZHI[i] === chong) {
                return LunarUtil2.SHENGXIAO[i];
              }
            }
            return "";
          },
          getTimeChongDesc: function() {
            return "(" + this.getTimeChongGan() + this.getTimeChong() + ")" + this.getTimeChongShengXiao();
          },
          getTimeSha: function() {
            return LunarUtil2.SHA[this.getTimeZhi()];
          },
          getYearNaYin: function() {
            return LunarUtil2.NAYIN[this.getYearInGanZhi()];
          },
          getMonthNaYin: function() {
            return LunarUtil2.NAYIN[this.getMonthInGanZhi()];
          },
          getDayNaYin: function() {
            return LunarUtil2.NAYIN[this.getDayInGanZhi()];
          },
          getTimeNaYin: function() {
            return LunarUtil2.NAYIN[this.getTimeInGanZhi()];
          },
          getSeason: function() {
            return LunarUtil2.SEASON[Math.abs(this._p.month)];
          },
          _convertJieQi: function(name) {
            var jq = name;
            if ("DONG_ZHI" === jq) {
              jq = I18n2.getMessage("jq.dongZhi");
            } else if ("DA_HAN" === jq) {
              jq = I18n2.getMessage("jq.daHan");
            } else if ("XIAO_HAN" === jq) {
              jq = I18n2.getMessage("jq.xiaoHan");
            } else if ("LI_CHUN" === jq) {
              jq = I18n2.getMessage("jq.liChun");
            } else if ("DA_XUE" === jq) {
              jq = I18n2.getMessage("jq.daXue");
            } else if ("YU_SHUI" === jq) {
              jq = I18n2.getMessage("jq.yuShui");
            } else if ("JING_ZHE" === jq) {
              jq = I18n2.getMessage("jq.jingZhe");
            }
            return jq;
          },
          getJie: function() {
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i += 2) {
              var key = LunarUtil2.JIE_QI_IN_USE[i];
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._convertJieQi(key);
              }
            }
            return "";
          },
          getQi: function() {
            for (var i = 1, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i += 2) {
              var key = LunarUtil2.JIE_QI_IN_USE[i];
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._convertJieQi(key);
              }
            }
            return "";
          },
          getJieQi: function() {
            for (var key in this._p.jieQi) {
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._convertJieQi(key);
              }
            }
            return "";
          },
          getWeek: function() {
            return this._p.weekIndex;
          },
          getWeekInChinese: function() {
            return SolarUtil2.WEEK[this.getWeek()];
          },
          getXiu: function() {
            return LunarUtil2.XIU[this.getDayZhi() + this.getWeek()];
          },
          getXiuLuck: function() {
            return LunarUtil2.XIU_LUCK[this.getXiu()];
          },
          getXiuSong: function() {
            return LunarUtil2.XIU_SONG[this.getXiu()];
          },
          getZheng: function() {
            return LunarUtil2.ZHENG[this.getXiu()];
          },
          getAnimal: function() {
            return LunarUtil2.ANIMAL[this.getXiu()];
          },
          getGong: function() {
            return LunarUtil2.GONG[this.getXiu()];
          },
          getShou: function() {
            return LunarUtil2.SHOU[this.getGong()];
          },
          getFestivals: function() {
            var l = [];
            var f2 = LunarUtil2.FESTIVAL[this._p.month + "-" + this._p.day];
            if (f2) {
              l.push(f2);
            }
            if (Math.abs(this._p.month) === 12 && this._p.day >= 29 && this._p.year !== this.next(1).getYear()) {
              l.push(I18n2.getMessage("jr.chuXi"));
            }
            return l;
          },
          getOtherFestivals: function() {
            var l = [];
            var fs = LunarUtil2.OTHER_FESTIVAL[this._p.month + "-" + this._p.day];
            if (fs) {
              l = l.concat(fs);
            }
            var solarYmd = this._p.solar.toYmd();
            if (this._p.solar.toYmd() === this._getJieQiSolar(I18n2.getMessage("jq.qingMing")).next(-1).toYmd()) {
              l.push("寒食节");
            }
            var jq = this._getJieQiSolar(I18n2.getMessage("jq.liChun"));
            var offset2 = 4 - jq.getLunar().getDayGanIndex();
            if (offset2 < 0) {
              offset2 += 10;
            }
            if (solarYmd === jq.next(offset2 + 40).toYmd()) {
              l.push("春社");
            }
            jq = this._getJieQiSolar(I18n2.getMessage("jq.liQiu"));
            offset2 = 4 - jq.getLunar().getDayGanIndex();
            if (offset2 < 0) {
              offset2 += 10;
            }
            if (solarYmd === jq.next(offset2 + 40).toYmd()) {
              l.push("秋社");
            }
            return l;
          },
          getBaZi: function() {
            var bz = this.getEightChar();
            var l = [];
            l.push(bz.getYear());
            l.push(bz.getMonth());
            l.push(bz.getDay());
            l.push(bz.getTime());
            return l;
          },
          getBaZiWuXing: function() {
            var bz = this.getEightChar();
            var l = [];
            l.push(bz.getYearWuXing());
            l.push(bz.getMonthWuXing());
            l.push(bz.getDayWuXing());
            l.push(bz.getTimeWuXing());
            return l;
          },
          getBaZiNaYin: function() {
            var bz = this.getEightChar();
            var l = [];
            l.push(bz.getYearNaYin());
            l.push(bz.getMonthNaYin());
            l.push(bz.getDayNaYin());
            l.push(bz.getTimeNaYin());
            return l;
          },
          getBaZiShiShenGan: function() {
            var bz = this.getEightChar();
            var l = [];
            l.push(bz.getYearShiShenGan());
            l.push(bz.getMonthShiShenGan());
            l.push(bz.getDayShiShenGan());
            l.push(bz.getTimeShiShenGan());
            return l;
          },
          getBaZiShiShenZhi: function() {
            var bz = this.getEightChar();
            var l = [];
            l.push(bz.getYearShiShenZhi()[0]);
            l.push(bz.getMonthShiShenZhi()[0]);
            l.push(bz.getDayShiShenZhi()[0]);
            l.push(bz.getTimeShiShenZhi()[0]);
            return l;
          },
          getBaZiShiShenYearZhi: function() {
            return this.getEightChar().getYearShiShenZhi();
          },
          getBaZiShiShenMonthZhi: function() {
            return this.getEightChar().getMonthShiShenZhi();
          },
          getBaZiShiShenDayZhi: function() {
            return this.getEightChar().getDayShiShenZhi();
          },
          getBaZiShiShenTimeZhi: function() {
            return this.getEightChar().getTimeShiShenZhi();
          },
          getZhiXing: function() {
            var offset2 = this._p.dayZhiIndex - this._p.monthZhiIndex;
            if (offset2 < 0) {
              offset2 += 12;
            }
            return LunarUtil2.ZHI_XING[offset2 + 1];
          },
          getDayTianShen: function() {
            var monthZhi = this.getMonthZhi();
            var offset2 = LunarUtil2.ZHI_TIAN_SHEN_OFFSET[monthZhi];
            return LunarUtil2.TIAN_SHEN[(this._p.dayZhiIndex + offset2) % 12 + 1];
          },
          getTimeTianShen: function() {
            var dayZhi = this.getDayZhiExact();
            var offset2 = LunarUtil2.ZHI_TIAN_SHEN_OFFSET[dayZhi];
            return LunarUtil2.TIAN_SHEN[(this._p.timeZhiIndex + offset2) % 12 + 1];
          },
          getDayTianShenType: function() {
            return LunarUtil2.TIAN_SHEN_TYPE[this.getDayTianShen()];
          },
          getTimeTianShenType: function() {
            return LunarUtil2.TIAN_SHEN_TYPE[this.getTimeTianShen()];
          },
          getDayTianShenLuck: function() {
            return LunarUtil2.TIAN_SHEN_TYPE_LUCK[this.getDayTianShenType()];
          },
          getTimeTianShenLuck: function() {
            return LunarUtil2.TIAN_SHEN_TYPE_LUCK[this.getTimeTianShenType()];
          },
          getDayPositionTai: function() {
            return LunarUtil2.POSITION_TAI_DAY[LunarUtil2.getJiaZiIndex(this.getDayInGanZhi())];
          },
          getMonthPositionTai: function() {
            var m = this._p.month;
            if (m < 0) {
              return "";
            }
            return LunarUtil2.POSITION_TAI_MONTH[m - 1];
          },
          getDayYi: function(sect) {
            sect *= 1;
            if (isNaN(sect)) {
              sect = 1;
            }
            return LunarUtil2.getDayYi(2 === sect ? this.getMonthInGanZhiExact() : this.getMonthInGanZhi(), this.getDayInGanZhi());
          },
          getDayJi: function(sect) {
            sect *= 1;
            if (isNaN(sect)) {
              sect = 1;
            }
            return LunarUtil2.getDayJi(2 === sect ? this.getMonthInGanZhiExact() : this.getMonthInGanZhi(), this.getDayInGanZhi());
          },
          getDayJiShen: function() {
            return LunarUtil2.getDayJiShen(this.getMonthZhiIndex(), this.getDayInGanZhi());
          },
          getDayXiongSha: function() {
            return LunarUtil2.getDayXiongSha(this.getMonthZhiIndex(), this.getDayInGanZhi());
          },
          getTimeYi: function() {
            return LunarUtil2.getTimeYi(this.getDayInGanZhiExact(), this.getTimeInGanZhi());
          },
          getTimeJi: function() {
            return LunarUtil2.getTimeJi(this.getDayInGanZhiExact(), this.getTimeInGanZhi());
          },
          getYueXiang: function() {
            return LunarUtil2.YUE_XIANG[this._p.day];
          },
          _getYearNineStar: function(yearInGanZhi) {
            var indexExact = LunarUtil2.getJiaZiIndex(yearInGanZhi) + 1;
            var index2 = LunarUtil2.getJiaZiIndex(this.getYearInGanZhi()) + 1;
            var yearOffset = indexExact - index2;
            if (yearOffset > 1) {
              yearOffset -= 60;
            } else if (yearOffset < -1) {
              yearOffset += 60;
            }
            var yuan = Math.floor((this._p.year + yearOffset + 2696) / 60) % 3;
            var offset2 = (62 + yuan * 3 - indexExact) % 9;
            if (0 === offset2) {
              offset2 = 9;
            }
            return NineStar2.fromIndex(offset2 - 1);
          },
          getYearNineStar: function(sect) {
            var yearInGanZhi;
            switch (sect) {
              case 1:
                yearInGanZhi = this.getYearInGanZhi();
                break;
              case 3:
                yearInGanZhi = this.getYearInGanZhiExact();
                break;
              default:
                yearInGanZhi = this.getYearInGanZhiByLiChun();
            }
            return this._getYearNineStar(yearInGanZhi);
          },
          getMonthNineStar: function(sect) {
            var yearZhiIndex;
            var monthZhiIndex;
            switch (sect) {
              case 1:
                yearZhiIndex = this._p.yearZhiIndex;
                monthZhiIndex = this._p.monthZhiIndex;
                break;
              case 3:
                yearZhiIndex = this._p.yearZhiIndexExact;
                monthZhiIndex = this._p.monthZhiIndexExact;
                break;
              default:
                yearZhiIndex = this._p.yearZhiIndexByLiChun;
                monthZhiIndex = this._p.monthZhiIndex;
            }
            var n = 27 - yearZhiIndex % 3 * 3;
            if (monthZhiIndex < LunarUtil2.BASE_MONTH_ZHI_INDEX) {
              n -= 3;
            }
            return NineStar2.fromIndex((n - monthZhiIndex) % 9);
          },
          getDayNineStar: function() {
            var solarYmd = this._p.solar.toYmd();
            var dongZhi = this._getJieQiSolar(I18n2.getMessage("jq.dongZhi"));
            var dongZhi2 = this._getJieQiSolar("DONG_ZHI");
            var xiaZhi = this._getJieQiSolar(I18n2.getMessage("jq.xiaZhi"));
            var dongZhiIndex = LunarUtil2.getJiaZiIndex(dongZhi.getLunar().getDayInGanZhi());
            var dongZhiIndex2 = LunarUtil2.getJiaZiIndex(dongZhi2.getLunar().getDayInGanZhi());
            var xiaZhiIndex = LunarUtil2.getJiaZiIndex(xiaZhi.getLunar().getDayInGanZhi());
            var solarShunBai;
            var solarShunBai2;
            var solarNiZi;
            if (dongZhiIndex > 29) {
              solarShunBai = dongZhi.next(60 - dongZhiIndex);
            } else {
              solarShunBai = dongZhi.next(-dongZhiIndex);
            }
            var solarShunBaiYmd = solarShunBai.toYmd();
            if (dongZhiIndex2 > 29) {
              solarShunBai2 = dongZhi2.next(60 - dongZhiIndex2);
            } else {
              solarShunBai2 = dongZhi2.next(-dongZhiIndex2);
            }
            var solarShunBaiYmd2 = solarShunBai2.toYmd();
            if (xiaZhiIndex > 29) {
              solarNiZi = xiaZhi.next(60 - xiaZhiIndex);
            } else {
              solarNiZi = xiaZhi.next(-xiaZhiIndex);
            }
            var solarNiZiYmd = solarNiZi.toYmd();
            var offset2 = 0;
            if (solarYmd >= solarShunBaiYmd && solarYmd < solarNiZiYmd) {
              offset2 = this._p.solar.subtract(solarShunBai) % 9;
            } else if (solarYmd >= solarNiZiYmd && solarYmd < solarShunBaiYmd2) {
              offset2 = 8 - this._p.solar.subtract(solarNiZi) % 9;
            } else if (solarYmd >= solarShunBaiYmd2) {
              offset2 = this._p.solar.subtract(solarShunBai2) % 9;
            } else if (solarYmd < solarShunBaiYmd) {
              offset2 = (8 + solarShunBai.subtract(this._p.solar)) % 9;
            }
            return NineStar2.fromIndex(offset2);
          },
          getTimeNineStar: function() {
            var solarYmd = this._p.solar.toYmd();
            var asc = false;
            if (solarYmd >= this._getJieQiSolar(I18n2.getMessage("jq.dongZhi")).toYmd() && solarYmd < this._getJieQiSolar(I18n2.getMessage("jq.xiaZhi")).toYmd() || solarYmd >= this._getJieQiSolar("DONG_ZHI").toYmd()) {
              asc = true;
            }
            var offset2 = asc ? [0, 3, 6] : [8, 5, 2];
            var start = offset2[this.getDayZhiIndex() % 3];
            var timeZhiIndex = this.getTimeZhiIndex();
            var index2 = asc ? start + timeZhiIndex : start + 9 - timeZhiIndex;
            return NineStar2.fromIndex(index2 % 9);
          },
          getSolar: function() {
            return this._p.solar;
          },
          getJieQiTable: function() {
            this._checkLang();
            return this._p.jieQi;
          },
          getJieQiList: function() {
            return this._p.jieQiList;
          },
          getNextJie: function(wholeDay) {
            var conditions = [];
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length / 2; i < j; i++) {
              conditions.push(LunarUtil2.JIE_QI_IN_USE[i * 2]);
            }
            return this._getNearJieQi(true, conditions, wholeDay);
          },
          getPrevJie: function(wholeDay) {
            var conditions = [];
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length / 2; i < j; i++) {
              conditions.push(LunarUtil2.JIE_QI_IN_USE[i * 2]);
            }
            return this._getNearJieQi(false, conditions, wholeDay);
          },
          getNextQi: function(wholeDay) {
            var conditions = [];
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length / 2; i < j; i++) {
              conditions.push(LunarUtil2.JIE_QI_IN_USE[i * 2 + 1]);
            }
            return this._getNearJieQi(true, conditions, wholeDay);
          },
          getPrevQi: function(wholeDay) {
            var conditions = [];
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length / 2; i < j; i++) {
              conditions.push(LunarUtil2.JIE_QI_IN_USE[i * 2 + 1]);
            }
            return this._getNearJieQi(false, conditions, wholeDay);
          },
          getNextJieQi: function(wholeDay) {
            return this._getNearJieQi(true, null, wholeDay);
          },
          getPrevJieQi: function(wholeDay) {
            return this._getNearJieQi(false, null, wholeDay);
          },
          _buildJieQi: function(name, solar2) {
            var jie = false;
            var qi = false;
            for (var i = 0, j = LunarUtil2.JIE_QI.length; i < j; i++) {
              if (LunarUtil2.JIE_QI[i] === name) {
                if (i % 2 === 0) {
                  qi = true;
                } else {
                  jie = true;
                }
                break;
              }
            }
            return {
              _p: {
                name,
                solar: solar2,
                jie,
                qi
              },
              getName: function() {
                return this._p.name;
              },
              getSolar: function() {
                return this._p.solar;
              },
              setName: function(name2) {
                this._p.name = name2;
              },
              setSolar: function(solar3) {
                this._p.solar = solar3;
              },
              isJie: function() {
                return this._p.jie;
              },
              isQi: function() {
                return this._p.qi;
              },
              toString: function() {
                return this.getName();
              }
            };
          },
          _getNearJieQi: function(forward, conditions, wholeDay) {
            var name = null;
            var near = null;
            var filters = {};
            var filter = false;
            if (null != conditions) {
              for (var i = 0, j = conditions.length; i < j; i++) {
                filters[conditions[i]] = true;
                filter = true;
              }
            }
            var today = this._p.solar[wholeDay ? "toYmd" : "toYmdHms"]();
            for (var key in this._p.jieQi) {
              var jq = this._convertJieQi(key);
              if (filter) {
                if (!filters[jq]) {
                  continue;
                }
              }
              var solar2 = this._getJieQiSolar(key);
              var day2 = solar2[wholeDay ? "toYmd" : "toYmdHms"]();
              if (forward) {
                if (day2 <= today) {
                  continue;
                }
                if (null == near || day2 < near[wholeDay ? "toYmd" : "toYmdHms"]()) {
                  name = jq;
                  near = solar2;
                }
              } else {
                if (day2 > today) {
                  continue;
                }
                if (null == near || day2 > near[wholeDay ? "toYmd" : "toYmdHms"]()) {
                  name = jq;
                  near = solar2;
                }
              }
            }
            if (null == near) {
              return null;
            }
            return this._buildJieQi(name, near);
          },
          getCurrentJieQi: function() {
            for (var key in this._p.jieQi) {
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._buildJieQi(this._convertJieQi(key), d);
              }
            }
            return null;
          },
          getCurrentJie: function() {
            for (var i = 0, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i += 2) {
              var key = LunarUtil2.JIE_QI_IN_USE[i];
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._buildJieQi(this._convertJieQi(key), d);
              }
            }
            return null;
          },
          getCurrentQi: function() {
            for (var i = 1, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i += 2) {
              var key = LunarUtil2.JIE_QI_IN_USE[i];
              var d = this._getJieQiSolar(key);
              if (d.getYear() === this._p.solar.getYear() && d.getMonth() === this._p.solar.getMonth() && d.getDay() === this._p.solar.getDay()) {
                return this._buildJieQi(this._convertJieQi(key), d);
              }
            }
            return null;
          },
          getEightChar: function() {
            if (!this._p.eightChar) {
              this._p.eightChar = EightChar2.fromLunar(this);
            }
            return this._p.eightChar;
          },
          next: function(days2) {
            return this._p.solar.next(days2).getLunar();
          },
          getYearXun: function() {
            return LunarUtil2.getXun(this.getYearInGanZhi());
          },
          getMonthXun: function() {
            return LunarUtil2.getXun(this.getMonthInGanZhi());
          },
          getDayXun: function() {
            return LunarUtil2.getXun(this.getDayInGanZhi());
          },
          getTimeXun: function() {
            return LunarUtil2.getXun(this.getTimeInGanZhi());
          },
          getYearXunByLiChun: function() {
            return LunarUtil2.getXun(this.getYearInGanZhiByLiChun());
          },
          getYearXunExact: function() {
            return LunarUtil2.getXun(this.getYearInGanZhiExact());
          },
          getMonthXunExact: function() {
            return LunarUtil2.getXun(this.getMonthInGanZhiExact());
          },
          getDayXunExact: function() {
            return LunarUtil2.getXun(this.getDayInGanZhiExact());
          },
          getDayXunExact2: function() {
            return LunarUtil2.getXun(this.getDayInGanZhiExact2());
          },
          getYearXunKong: function() {
            return LunarUtil2.getXunKong(this.getYearInGanZhi());
          },
          getMonthXunKong: function() {
            return LunarUtil2.getXunKong(this.getMonthInGanZhi());
          },
          getDayXunKong: function() {
            return LunarUtil2.getXunKong(this.getDayInGanZhi());
          },
          getTimeXunKong: function() {
            return LunarUtil2.getXunKong(this.getTimeInGanZhi());
          },
          getYearXunKongByLiChun: function() {
            return LunarUtil2.getXunKong(this.getYearInGanZhiByLiChun());
          },
          getYearXunKongExact: function() {
            return LunarUtil2.getXunKong(this.getYearInGanZhiExact());
          },
          getMonthXunKongExact: function() {
            return LunarUtil2.getXunKong(this.getMonthInGanZhiExact());
          },
          getDayXunKongExact: function() {
            return LunarUtil2.getXunKong(this.getDayInGanZhiExact());
          },
          getDayXunKongExact2: function() {
            return LunarUtil2.getXunKong(this.getDayInGanZhiExact2());
          },
          toString: function() {
            return this.getYearInChinese() + "年" + this.getMonthInChinese() + "月" + this.getDayInChinese();
          },
          toFullString: function() {
            var s = this.toString();
            s += " " + this.getYearInGanZhi() + "(" + this.getYearShengXiao() + ")年";
            s += " " + this.getMonthInGanZhi() + "(" + this.getMonthShengXiao() + ")月";
            s += " " + this.getDayInGanZhi() + "(" + this.getDayShengXiao() + ")日";
            s += " " + this.getTimeZhi() + "(" + this.getTimeShengXiao() + ")时";
            s += " 纳音[" + this.getYearNaYin() + " " + this.getMonthNaYin() + " " + this.getDayNaYin() + " " + this.getTimeNaYin() + "]";
            s += " 星期" + this.getWeekInChinese();
            var festivals = this.getFestivals();
            var i;
            var j;
            for (i = 0, j = festivals.length; i < j; i++) {
              s += " (" + festivals[i] + ")";
            }
            festivals = this.getOtherFestivals();
            for (i = 0, j = festivals.length; i < j; i++) {
              s += " (" + festivals[i] + ")";
            }
            var jq = this.getJieQi();
            if (jq.length > 0) {
              s += " [" + jq + "]";
            }
            s += " " + this.getGong() + "方" + this.getShou();
            s += " 星宿[" + this.getXiu() + this.getZheng() + this.getAnimal() + "](" + this.getXiuLuck() + ")";
            s += " 彭祖百忌[" + this.getPengZuGan() + " " + this.getPengZuZhi() + "]";
            s += " 喜神方位[" + this.getDayPositionXi() + "](" + this.getDayPositionXiDesc() + ")";
            s += " 阳贵神方位[" + this.getDayPositionYangGui() + "](" + this.getDayPositionYangGuiDesc() + ")";
            s += " 阴贵神方位[" + this.getDayPositionYinGui() + "](" + this.getDayPositionYinGuiDesc() + ")";
            s += " 福神方位[" + this.getDayPositionFu() + "](" + this.getDayPositionFuDesc() + ")";
            s += " 财神方位[" + this.getDayPositionCai() + "](" + this.getDayPositionCaiDesc() + ")";
            s += " 冲[" + this.getDayChongDesc() + "]";
            s += " 煞[" + this.getDaySha() + "]";
            return s;
          },
          _buildNameAndIndex: function(name, index2) {
            return {
              _p: {
                name,
                index: index2
              },
              getName: function() {
                return this._p.name;
              },
              setName: function(name2) {
                this._p.name = name2;
              },
              getIndex: function() {
                return this._p.index;
              },
              setIndex: function(index3) {
                this._p.index = index3;
              },
              toString: function() {
                return this.getName();
              },
              toFullString: function() {
                return this.getName() + "第" + this.getIndex() + "天";
              }
            };
          },
          getShuJiu: function() {
            var currentDay = Solar2.fromYmd(this._p.solar.getYear(), this._p.solar.getMonth(), this._p.solar.getDay());
            var start = this._getJieQiSolar("DONG_ZHI");
            var startDay = Solar2.fromYmd(start.getYear(), start.getMonth(), start.getDay());
            if (currentDay.isBefore(startDay)) {
              start = this._getJieQiSolar(I18n2.getMessage("jq.dongZhi"));
              startDay = Solar2.fromYmd(start.getYear(), start.getMonth(), start.getDay());
            }
            var endDay = Solar2.fromYmd(start.getYear(), start.getMonth(), start.getDay()).next(81);
            if (currentDay.isBefore(startDay) || !currentDay.isBefore(endDay)) {
              return null;
            }
            var days2 = currentDay.subtract(startDay);
            return this._buildNameAndIndex(LunarUtil2.NUMBER[Math.floor(days2 / 9) + 1] + "九", days2 % 9 + 1);
          },
          getFu: function() {
            var currentDay = Solar2.fromYmd(this._p.solar.getYear(), this._p.solar.getMonth(), this._p.solar.getDay());
            var xiaZhi = this._getJieQiSolar(I18n2.getMessage("jq.xiaZhi"));
            var liQiu = this._getJieQiSolar(I18n2.getMessage("jq.liQiu"));
            var startDay = Solar2.fromYmd(xiaZhi.getYear(), xiaZhi.getMonth(), xiaZhi.getDay());
            var add2 = 6 - xiaZhi.getLunar().getDayGanIndex();
            if (add2 < 0) {
              add2 += 10;
            }
            add2 += 20;
            startDay = startDay.next(add2);
            if (currentDay.isBefore(startDay)) {
              return null;
            }
            var days2 = currentDay.subtract(startDay);
            if (days2 < 10) {
              return this._buildNameAndIndex("初伏", days2 + 1);
            }
            startDay = startDay.next(10);
            days2 = currentDay.subtract(startDay);
            if (days2 < 10) {
              return this._buildNameAndIndex("中伏", days2 + 1);
            }
            startDay = startDay.next(10);
            var liQiuDay = Solar2.fromYmd(liQiu.getYear(), liQiu.getMonth(), liQiu.getDay());
            days2 = currentDay.subtract(startDay);
            if (liQiuDay.isAfter(startDay)) {
              if (days2 < 10) {
                return this._buildNameAndIndex("中伏", days2 + 11);
              }
              startDay = startDay.next(10);
              days2 = currentDay.subtract(startDay);
            }
            if (days2 < 10) {
              return this._buildNameAndIndex("末伏", days2 + 1);
            }
            return null;
          },
          getLiuYao: function() {
            return LunarUtil2.LIU_YAO[(Math.abs(this._p.month) + this._p.day - 2) % 6];
          },
          getWuHou: function() {
            var jieQi = this.getPrevJieQi(true);
            var jq = LunarUtil2.find(jieQi.getName(), LunarUtil2.JIE_QI);
            var current = Solar2.fromYmd(this._p.solar.getYear(), this._p.solar.getMonth(), this._p.solar.getDay());
            var startSolar = jieQi.getSolar();
            var start = Solar2.fromYmd(startSolar.getYear(), startSolar.getMonth(), startSolar.getDay());
            var index2 = Math.floor(current.subtract(start) / 5);
            if (index2 > 2) {
              index2 = 2;
            }
            return LunarUtil2.WU_HOU[(jq.index * 3 + index2) % LunarUtil2.WU_HOU.length];
          },
          getHou: function() {
            var jieQi = this.getPrevJieQi(true);
            var days2 = this._p.solar.subtract(jieQi.getSolar());
            var max2 = LunarUtil2.HOU.length - 1;
            var offset2 = Math.floor(days2 / 5);
            if (offset2 > max2) {
              offset2 = max2;
            }
            return jieQi.getName() + " " + LunarUtil2.HOU[offset2];
          },
          getDayLu: function() {
            var gan = LunarUtil2.LU[this.getDayGan()];
            var zhi = LunarUtil2.LU[this.getDayZhi()];
            var lu = gan + "命互禄";
            if (zhi) {
              lu += " " + zhi + "命进禄";
            }
            return lu;
          },
          getTime: function() {
            return LunarTime2.fromYmdHms(this._p.year, this._p.month, this._p.day, this._p.hour, this._p.minute, this._p.second);
          },
          getTimes: function() {
            var l = [];
            l.push(LunarTime2.fromYmdHms(this._p.year, this._p.month, this._p.day, 0, 0, 0));
            for (var i = 0; i < 12; i++) {
              l.push(LunarTime2.fromYmdHms(this._p.year, this._p.month, this._p.day, (i + 1) * 2 - 1, 0, 0));
            }
            return l;
          },
          getFoto: function() {
            return Foto2.fromLunar(this);
          },
          getTao: function() {
            return Tao2.fromLunar(this);
          }
        };
      };
      return {
        fromYmdHms: function(y, m, d, hour, minute, second) {
          return _fromYmdHms(y, m, d, hour, minute, second);
        },
        fromYmd: function(y, m, d) {
          return _fromYmdHms(y, m, d, 0, 0, 0);
        },
        fromSolar: function(solar) {
          return _fromSolar(solar);
        },
        fromDate: function(date) {
          return _fromDate(date);
        }
      };
    }();
    var SolarWeek2 = /* @__PURE__ */ function() {
      var _fromDate = function(date, start) {
        var solar = Solar2.fromDate(date);
        return _fromYmd(solar.getYear(), solar.getMonth(), solar.getDay(), start);
      };
      var _fromYmd = function(y, m, d, start) {
        var oy = y;
        var om = m;
        var od = d;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        m *= 1;
        if (isNaN(m)) {
          throw new Error("wrong solar month " + om);
        }
        d *= 1;
        if (isNaN(d)) {
          throw new Error("wrong solar day " + od);
        }
        start *= 1;
        if (isNaN(start)) {
          start = 0;
        }
        return {
          _p: {
            year: y,
            month: m,
            day: d,
            start
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          getDay: function() {
            return this._p.day;
          },
          getStart: function() {
            return this._p.start;
          },
          /**
           * 获取当前日期是在当月第几周
           * @return number 周序号，从1开始
           */
          getIndex: function() {
            var offset2 = Solar2.fromYmd(this._p.year, this._p.month, 1).getWeek() - this._p.start;
            if (offset2 < 0) {
              offset2 += 7;
            }
            return Math.ceil((this._p.day + offset2) / 7);
          },
          /**
           * 获取当前日期是在当年第几周
           * @return number 周序号，从1开始
           */
          getIndexInYear: function() {
            var offset2 = Solar2.fromYmd(this._p.year, 1, 1).getWeek() - this._p.start;
            if (offset2 < 0) {
              offset2 += 7;
            }
            return Math.ceil((SolarUtil2.getDaysInYear(this._p.year, this._p.month, this._p.day) + offset2) / 7);
          },
          /**
           * 周推移
           * @param weeks 推移的周数，负数为倒推
           * @param separateMonth 是否按月单独计算
           * @return object 推移后的阳历周
           */
          next: function(weeks2, separateMonth) {
            var ow = weeks2;
            weeks2 *= 1;
            if (isNaN(weeks2)) {
              throw new Error("wrong weeks " + ow);
            }
            var start2 = this._p.start;
            if (0 === weeks2) {
              return _fromYmd(this._p.year, this._p.month, this._p.day, start2);
            }
            var solar = Solar2.fromYmd(this._p.year, this._p.month, this._p.day);
            if (separateMonth) {
              var n = weeks2;
              var week = _fromYmd(this._p.year, this._p.month, this._p.day, start2);
              var month = this._p.month;
              var plus = n > 0;
              while (0 !== n) {
                solar = solar.next(plus ? 7 : -7);
                week = _fromYmd(solar.getYear(), solar.getMonth(), solar.getDay(), start2);
                var weekMonth = week.getMonth();
                if (month !== weekMonth) {
                  var index2 = week.getIndex();
                  if (plus) {
                    if (1 === index2) {
                      var firstDay = week.getFirstDay();
                      week = _fromYmd(firstDay.getYear(), firstDay.getMonth(), firstDay.getDay(), start2);
                      weekMonth = week.getMonth();
                    } else {
                      solar = Solar2.fromYmd(week.getYear(), week.getMonth(), 1);
                      week = _fromYmd(solar.getYear(), solar.getMonth(), solar.getDay(), start2);
                    }
                  } else {
                    var size2 = SolarUtil2.getWeeksOfMonth(week.getYear(), week.getMonth(), start2);
                    if (size2 === index2) {
                      var lastDay = week.getFirstDay().next(6);
                      week = _fromYmd(lastDay.getYear(), lastDay.getMonth(), lastDay.getDay(), start2);
                      weekMonth = week.getMonth();
                    } else {
                      solar = Solar2.fromYmd(week.getYear(), week.getMonth(), SolarUtil2.getDaysOfMonth(week.getYear(), week.getMonth()));
                      week = _fromYmd(solar.getYear(), solar.getMonth(), solar.getDay(), start2);
                    }
                  }
                  month = weekMonth;
                }
                n -= plus ? 1 : -1;
              }
              return week;
            } else {
              solar = solar.next(weeks2 * 7);
              return _fromYmd(solar.getYear(), solar.getMonth(), solar.getDay(), start2);
            }
          },
          /**
           * 获取本周第一天的阳历日期（可能跨月）
           * @return object 本周第一天的阳历日期
           */
          getFirstDay: function() {
            var solar = Solar2.fromYmd(this._p.year, this._p.month, this._p.day);
            var prev = solar.getWeek() - this._p.start;
            if (prev < 0) {
              prev += 7;
            }
            return solar.next(-prev);
          },
          /**
           * 获取本周第一天的阳历日期（仅限当月）
           * @return object 本周第一天的阳历日期
           */
          getFirstDayInMonth: function() {
            var index2 = 0;
            var days2 = this.getDays();
            for (var i = 0; i < days2.length; i++) {
              if (this._p.month === days2[i].getMonth()) {
                index2 = i;
                break;
              }
            }
            return days2[index2];
          },
          /**
           * 获取本周的阳历日期列表（可能跨月）
           * @return Array 本周的阳历日期列表
           */
          getDays: function() {
            var firstDay = this.getFirstDay();
            var l = [];
            l.push(firstDay);
            for (var i = 1; i < 7; i++) {
              l.push(firstDay.next(i));
            }
            return l;
          },
          /**
           * 获取本周的阳历日期列表（仅限当月）
           * @return Array 本周的阳历日期列表（仅限当月）
           */
          getDaysInMonth: function() {
            var days2 = this.getDays();
            var l = [];
            for (var i = 0; i < days2.length; i++) {
              var day = days2[i];
              if (this._p.month !== day.getMonth()) {
                continue;
              }
              l.push(day);
            }
            return l;
          },
          toString: function() {
            return this.getYear() + "." + this.getMonth() + "." + this.getIndex();
          },
          toFullString: function() {
            return this.getYear() + "年" + this.getMonth() + "月第" + this.getIndex() + "周";
          }
        };
      };
      return {
        /**
         * 指定年月日生成当天所在的阳历周
         * @param y 年份
         * @param m 月份
         * @param d 日期
         * @param start 星期几作为一周的开始，1234560分别代表星期一至星期天
         * @return object 阳历周
         */
        fromYmd: function(y, m, d, start) {
          return _fromYmd(y, m, d, start);
        },
        /**
         * 指定日期生成当天所在的阳历周
         * @param date 日期
         * @param start 星期几作为一周的开始，1234560分别代表星期一至星期天
         * @return object 阳历周
         */
        fromDate: function(date, start) {
          return _fromDate(date, start);
        }
      };
    }();
    var SolarMonth2 = /* @__PURE__ */ function() {
      var _fromDate = function(date) {
        var solar = Solar2.fromDate(date);
        return _fromYm(solar.getYear(), solar.getMonth());
      };
      var _fromYm = function(y, m) {
        var oy = y;
        var om = m;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        m *= 1;
        if (isNaN(m)) {
          throw new Error("wrong solar month " + om);
        }
        return {
          _p: {
            year: y,
            month: m
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          next: function(months2) {
            var om2 = months2;
            months2 *= 1;
            if (isNaN(months2)) {
              throw new Error("wrong months " + om2);
            }
            var n = months2 < 0 ? -1 : 1;
            var m2 = Math.abs(months2);
            var y2 = this._p.year + Math.floor(m2 / 12) * n;
            m2 = this._p.month + m2 % 12 * n;
            if (m2 > 12) {
              m2 -= 12;
              y2++;
            } else if (m2 < 1) {
              m2 += 12;
              y2--;
            }
            return _fromYm(y2, m2);
          },
          getDays: function() {
            var l = [];
            var d = Solar2.fromYmd(this._p.year, this._p.month, 1);
            l.push(d);
            var days2 = SolarUtil2.getDaysOfMonth(this._p.year, this._p.month);
            for (var i = 1; i < days2; i++) {
              l.push(d.next(i));
            }
            return l;
          },
          getWeeks: function(start) {
            start *= 1;
            if (isNaN(start)) {
              start = 0;
            }
            var l = [];
            var week = SolarWeek2.fromYmd(this._p.year, this._p.month, 1, start);
            while (true) {
              l.push(week);
              week = week.next(1, false);
              var firstDay = week.getFirstDay();
              if (firstDay.getYear() > this._p.year || firstDay.getMonth() > this._p.month) {
                break;
              }
            }
            return l;
          },
          toString: function() {
            return this.getYear() + "-" + this.getMonth();
          },
          toFullString: function() {
            return this.getYear() + "年" + this.getMonth() + "月";
          }
        };
      };
      return {
        fromYm: function(y, m) {
          return _fromYm(y, m);
        },
        fromDate: function(date) {
          return _fromDate(date);
        }
      };
    }();
    var SolarSeason2 = /* @__PURE__ */ function() {
      var _fromDate = function(date) {
        var solar = Solar2.fromDate(date);
        return _fromYm(solar.getYear(), solar.getMonth());
      };
      var _fromYm = function(y, m) {
        var oy = y;
        var om = m;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        m *= 1;
        if (isNaN(m)) {
          throw new Error("wrong solar month " + om);
        }
        return {
          _p: {
            year: y,
            month: m
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          /**
           * 获取当月是第几季度
           * @return number 季度序号，从1开始
           */
          getIndex: function() {
            return Math.ceil(this._p.month / 3);
          },
          /**
           * 季度推移
           * @param seasons 推移的季度数，负数为倒推
           * @return object 推移后的季度
           */
          next: function(seasons) {
            var os = seasons;
            seasons *= 1;
            if (isNaN(seasons)) {
              throw new Error("wrong seasons " + os);
            }
            var month = SolarMonth2.fromYm(this._p.year, this._p.month).next(3 * seasons);
            return _fromYm(month.getYear(), month.getMonth());
          },
          /**
           * 获取本季度的月份
           * @return Array 本季度的月份列表
           */
          getMonths: function() {
            var l = [];
            var index2 = this.getIndex() - 1;
            for (var i = 0; i < 3; i++) {
              l.push(SolarMonth2.fromYm(this._p.year, 3 * index2 + i + 1));
            }
            return l;
          },
          toString: function() {
            return this.getYear() + "." + this.getIndex();
          },
          toFullString: function() {
            return this.getYear() + "年" + this.getIndex() + "季度";
          }
        };
      };
      return {
        fromYm: function(y, m) {
          return _fromYm(y, m);
        },
        fromDate: function(date) {
          return _fromDate(date);
        }
      };
    }();
    var SolarHalfYear2 = /* @__PURE__ */ function() {
      var _fromDate = function(date) {
        var solar = Solar2.fromDate(date);
        return _fromYm(solar.getYear(), solar.getMonth());
      };
      var _fromYm = function(y, m) {
        var oy = y;
        var om = m;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        m *= 1;
        if (isNaN(m)) {
          throw new Error("wrong solar month " + om);
        }
        return {
          _p: {
            year: y,
            month: m
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          /**
           * 获取当月是第几半年
           * @return number 半年序号，从1开始
           */
          getIndex: function() {
            return Math.ceil(this._p.month / 6);
          },
          /**
           * 半年推移
           * @param halfYears 推移的半年数，负数为倒推
           * @return object 推移后的半年
           */
          next: function(halfYears) {
            var oh = halfYears;
            halfYears *= 1;
            if (isNaN(halfYears)) {
              throw new Error("wong halfYears " + oh);
            }
            var month = SolarMonth2.fromYm(this._p.year, this._p.month).next(6 * halfYears);
            return _fromYm(month.getYear(), month.getMonth());
          },
          /**
           * 获取本半年的月份
           * @return Array 本半年的月份列表
           */
          getMonths: function() {
            var l = [];
            var index2 = this.getIndex() - 1;
            for (var i = 0; i < 6; i++) {
              l.push(SolarMonth2.fromYm(this._p.year, 6 * index2 + i + 1));
            }
            return l;
          },
          toString: function() {
            return this.getYear() + "." + this.getIndex();
          },
          toFullString: function() {
            return this.getYear() + "年" + ["上", "下"][this.getIndex() - 1] + "半年";
          }
        };
      };
      return {
        fromYm: function(y, m) {
          return _fromYm(y, m);
        },
        fromDate: function(date) {
          return _fromDate(date);
        }
      };
    }();
    var SolarYear2 = /* @__PURE__ */ function() {
      var _fromDate = function(date) {
        return _fromYear(Solar2.fromDate(date).getYear());
      };
      var _fromYear = function(y) {
        var oy = y;
        y *= 1;
        if (isNaN(y)) {
          throw new Error("wrong solar year " + oy);
        }
        return {
          _p: {
            year: y
          },
          getYear: function() {
            return this._p.year;
          },
          next: function(years2) {
            var oy2 = years2;
            years2 *= 1;
            if (isNaN(years2)) {
              throw new Error("wrong years " + oy2);
            }
            return _fromYear(this._p.year + years2);
          },
          getMonths: function() {
            var l = [];
            var m = SolarMonth2.fromYm(this._p.year, 1);
            l.push(m);
            for (var i = 1; i < 12; i++) {
              l.push(m.next(i));
            }
            return l;
          },
          toString: function() {
            return this.getYear() + "";
          },
          toFullString: function() {
            return this.getYear() + "年";
          }
        };
      };
      return {
        fromYear: function(y) {
          return _fromYear(y);
        },
        fromDate: function(date) {
          return _fromDate(date);
        }
      };
    }();
    var LunarYear2 = /* @__PURE__ */ function() {
      var _YUAN = ["下", "上", "中"];
      var _YUN = ["七", "八", "九", "一", "二", "三", "四", "五", "六"];
      var _LEAP_11 = [75, 94, 170, 265, 322, 398, 469, 553, 583, 610, 678, 735, 754, 773, 849, 887, 936, 1050, 1069, 1126, 1145, 1164, 1183, 1259, 1278, 1308, 1373, 1403, 1441, 1460, 1498, 1555, 1593, 1612, 1631, 1642, 2033, 2128, 2147, 2242, 2614, 2728, 2910, 3062, 3244, 3339, 3616, 3711, 3730, 3825, 4007, 4159, 4197, 4322, 4341, 4379, 4417, 4531, 4599, 4694, 4713, 4789, 4808, 4971, 5085, 5104, 5161, 5180, 5199, 5294, 5305, 5476, 5677, 5696, 5772, 5791, 5848, 5886, 6049, 6068, 6144, 6163, 6258, 6402, 6440, 6497, 6516, 6630, 6641, 6660, 6679, 6736, 6774, 6850, 6869, 6899, 6918, 6994, 7013, 7032, 7051, 7070, 7089, 7108, 7127, 7146, 7222, 7271, 7290, 7309, 7366, 7385, 7404, 7442, 7461, 7480, 7491, 7499, 7594, 7624, 7643, 7662, 7681, 7719, 7738, 7814, 7863, 7882, 7901, 7939, 7958, 7977, 7996, 8034, 8053, 8072, 8091, 8121, 8159, 8186, 8216, 8235, 8254, 8273, 8311, 8330, 8341, 8349, 8368, 8444, 8463, 8474, 8493, 8531, 8569, 8588, 8626, 8664, 8683, 8694, 8702, 8713, 8721, 8751, 8789, 8808, 8816, 8827, 8846, 8884, 8903, 8922, 8941, 8971, 9036, 9066, 9085, 9104, 9123, 9142, 9161, 9180, 9199, 9218, 9256, 9294, 9313, 9324, 9343, 9362, 9381, 9419, 9438, 9476, 9514, 9533, 9544, 9552, 9563, 9571, 9582, 9601, 9639, 9658, 9666, 9677, 9696, 9734, 9753, 9772, 9791, 9802, 9821, 9886, 9897, 9916, 9935, 9954, 9973, 9992];
      var _LEAP_12 = [37, 56, 113, 132, 151, 189, 208, 227, 246, 284, 303, 341, 360, 379, 417, 436, 458, 477, 496, 515, 534, 572, 591, 629, 648, 667, 697, 716, 792, 811, 830, 868, 906, 925, 944, 963, 982, 1001, 1020, 1039, 1058, 1088, 1153, 1202, 1221, 1240, 1297, 1335, 1392, 1411, 1422, 1430, 1517, 1525, 1536, 1574, 3358, 3472, 3806, 3988, 4751, 4941, 5066, 5123, 5275, 5343, 5438, 5457, 5495, 5533, 5552, 5715, 5810, 5829, 5905, 5924, 6421, 6535, 6793, 6812, 6888, 6907, 7002, 7184, 7260, 7279, 7374, 7556, 7746, 7757, 7776, 7833, 7852, 7871, 7966, 8015, 8110, 8129, 8148, 8224, 8243, 8338, 8406, 8425, 8482, 8501, 8520, 8558, 8596, 8607, 8615, 8645, 8740, 8778, 8835, 8865, 8930, 8960, 8979, 8998, 9017, 9055, 9074, 9093, 9112, 9150, 9188, 9237, 9275, 9332, 9351, 9370, 9408, 9427, 9446, 9457, 9465, 9495, 9560, 9590, 9628, 9647, 9685, 9715, 9742, 9780, 9810, 9818, 9829, 9848, 9867, 9905, 9924, 9943, 9962, 1e4];
      var _CACHE_YEAR = null;
      var _YMC = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var _inLeap = function(arr, n) {
        for (var i = 0, j = arr.length; i < j; i++) {
          if (arr[i] === n) {
            return true;
          }
        }
        return false;
      };
      var _fromYear = function(lunarYear) {
        var oy = lunarYear;
        lunarYear *= 1;
        if (isNaN(lunarYear)) {
          throw new Error("wrong lunar year " + oy);
        }
        var _y = function() {
          var offset2 = lunarYear - 4;
          var yearGanIndex = offset2 % 10;
          var yearZhiIndex = offset2 % 12;
          if (yearGanIndex < 0) {
            yearGanIndex += 10;
          }
          if (yearZhiIndex < 0) {
            yearZhiIndex += 12;
          }
          return {
            ganIndex: yearGanIndex,
            zhiIndex: yearZhiIndex
          };
        }();
        return {
          _p: {
            year: lunarYear,
            ganIndex: _y.ganIndex,
            zhiIndex: _y.zhiIndex,
            months: [],
            jieQiJulianDays: []
          },
          getYear: function() {
            return this._p.year;
          },
          getGanIndex: function() {
            return this._p.ganIndex;
          },
          getZhiIndex: function() {
            return this._p.zhiIndex;
          },
          getGan: function() {
            return LunarUtil2.GAN[this._p.ganIndex + 1];
          },
          getZhi: function() {
            return LunarUtil2.ZHI[this._p.zhiIndex + 1];
          },
          getGanZhi: function() {
            return this.getGan() + this.getZhi();
          },
          getJieQiJulianDays: function() {
            return this._p.jieQiJulianDays;
          },
          getDayCount: function() {
            var n = 0;
            for (var i = 0, j = this._p.months.length; i < j; i++) {
              var m = this._p.months[i];
              if (m.getYear() === this._p.year) {
                n += m.getDayCount();
              }
            }
            return n;
          },
          getMonthsInYear: function() {
            var l = [];
            for (var i = 0, j = this._p.months.length; i < j; i++) {
              var m = this._p.months[i];
              if (m.getYear() === this._p.year) {
                l.push(m);
              }
            }
            return l;
          },
          getMonths: function() {
            return this._p.months;
          },
          getMonth: function(lunarMonth) {
            var om = lunarMonth;
            lunarMonth *= 1;
            if (isNaN(lunarMonth)) {
              throw new Error("wrong lunarMonth " + om);
            }
            for (var i = 0, j = this._p.months.length; i < j; i++) {
              var m = this._p.months[i];
              if (m.getYear() === this._p.year && m.getMonth() === lunarMonth) {
                return m;
              }
            }
            return null;
          },
          getLeapMonth: function() {
            for (var i = 0, j = this._p.months.length; i < j; i++) {
              var m = this._p.months[i];
              if (m.getYear() === this._p.year && m.isLeap()) {
                return Math.abs(m.getMonth());
              }
            }
            return 0;
          },
          _getZaoByGan: function(index2, name) {
            var offset2 = index2 - Solar2.fromJulianDay(this.getMonth(1).getFirstJulianDay()).getLunar().getDayGanIndex();
            if (offset2 < 0) {
              offset2 += 10;
            }
            return name.replace("几", LunarUtil2.NUMBER[offset2 + 1]);
          },
          _getZaoByZhi: function(index2, name) {
            var offset2 = index2 - Solar2.fromJulianDay(this.getMonth(1).getFirstJulianDay()).getLunar().getDayZhiIndex();
            if (offset2 < 0) {
              offset2 += 12;
            }
            return name.replace("几", LunarUtil2.NUMBER[offset2 + 1]);
          },
          getTouLiang: function() {
            return this._getZaoByZhi(0, "几鼠偷粮");
          },
          getCaoZi: function() {
            return this._getZaoByZhi(0, "草子几分");
          },
          getGengTian: function() {
            return this._getZaoByZhi(1, "几牛耕田");
          },
          getHuaShou: function() {
            return this._getZaoByZhi(3, "花收几分");
          },
          getZhiShui: function() {
            return this._getZaoByZhi(4, "几龙治水");
          },
          getTuoGu: function() {
            return this._getZaoByZhi(6, "几马驮谷");
          },
          getQiangMi: function() {
            return this._getZaoByZhi(9, "几鸡抢米");
          },
          getKanCan: function() {
            return this._getZaoByZhi(9, "几姑看蚕");
          },
          getGongZhu: function() {
            return this._getZaoByZhi(11, "几屠共猪");
          },
          getJiaTian: function() {
            return this._getZaoByGan(0, "甲田几分");
          },
          getFenBing: function() {
            return this._getZaoByGan(2, "几人分饼");
          },
          getDeJin: function() {
            return this._getZaoByGan(7, "几日得金");
          },
          getRenBing: function() {
            return this._getZaoByGan(2, this._getZaoByZhi(2, "几人几丙"));
          },
          getRenChu: function() {
            return this._getZaoByGan(3, this._getZaoByZhi(2, "几人几锄"));
          },
          getYuan: function() {
            return _YUAN[Math.floor((this._p.year + 2696) / 60) % 3] + "元";
          },
          getYun: function() {
            return _YUN[Math.floor((this._p.year + 2696) / 20) % 9] + "运";
          },
          getNineStar: function() {
            var index2 = LunarUtil2.getJiaZiIndex(this.getGanZhi()) + 1;
            var yuan = Math.floor((this._p.year + 2696) / 60) % 3;
            var offset2 = (62 + yuan * 3 - index2) % 9;
            if (0 === offset2) {
              offset2 = 9;
            }
            return NineStar2.fromIndex(offset2 - 1);
          },
          getPositionXi: function() {
            return LunarUtil2.POSITION_XI[this._p.ganIndex + 1];
          },
          getPositionXiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionXi()];
          },
          getPositionYangGui: function() {
            return LunarUtil2.POSITION_YANG_GUI[this._p.ganIndex + 1];
          },
          getPositionYangGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionYangGui()];
          },
          getPositionYinGui: function() {
            return LunarUtil2.POSITION_YIN_GUI[this._p.ganIndex + 1];
          },
          getPositionYinGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionYinGui()];
          },
          getPositionFu: function(sect) {
            return (1 === sect ? LunarUtil2.POSITION_FU : LunarUtil2.POSITION_FU_2)[this._p.ganIndex + 1];
          },
          getPositionFuDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getPositionFu(sect)];
          },
          getPositionCai: function() {
            return LunarUtil2.POSITION_CAI[this._p.ganIndex + 1];
          },
          getPositionCaiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionCai()];
          },
          getPositionTaiSui: function() {
            return LunarUtil2.POSITION_TAI_SUI_YEAR[this._p.zhiIndex];
          },
          getPositionTaiSuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionTaiSui()];
          },
          toString: function() {
            return this.getYear() + "";
          },
          toFullString: function() {
            return this.getYear() + "年";
          },
          next: function(years2) {
            var oy2 = years2;
            years2 *= 1;
            if (isNaN(years2)) {
              throw new Error("wrong years " + oy2);
            }
            return LunarYear2.fromYear(this._p.year + years2);
          },
          _compute: function() {
            this._p.months = [];
            this._p.jieQiJulianDays = [];
            var jq = [];
            var hs = [];
            var dayCounts = [];
            var months2 = [];
            var i;
            var j;
            var currentYear = this._p.year;
            var jd2 = Math.floor((currentYear - 2e3) * 365.2422 + 180);
            var w = Math.floor((jd2 - 355 + 183) / 365.2422) * 365.2422 + 355;
            if (ShouXingUtil2.calcQi(w) > jd2) {
              w -= 365.2422;
            }
            for (i = 0; i < 26; i++) {
              jq.push(ShouXingUtil2.calcQi(w + 15.2184 * i));
            }
            for (i = 0, j = LunarUtil2.JIE_QI_IN_USE.length; i < j; i++) {
              if (i === 0) {
                jd2 = ShouXingUtil2.qiAccurate2(jq[0] - 15.2184);
              } else if (i <= 26) {
                jd2 = ShouXingUtil2.qiAccurate2(jq[i - 1]);
              } else {
                jd2 = ShouXingUtil2.qiAccurate2(jq[25] + 15.2184 * (i - 26));
              }
              this._p.jieQiJulianDays.push(jd2 + Solar2.J2000);
            }
            w = ShouXingUtil2.calcShuo(jq[0]);
            if (w > jq[0]) {
              w -= 29.53;
            }
            for (i = 0; i < 16; i++) {
              hs.push(ShouXingUtil2.calcShuo(w + 29.5306 * i));
            }
            for (i = 0; i < 15; i++) {
              dayCounts.push(Math.floor(hs[i + 1] - hs[i]));
              months2.push(i);
            }
            var prevYear = currentYear - 1;
            var leapIndex = 16;
            if (_inLeap(_LEAP_11, currentYear)) {
              leapIndex = 13;
            } else if (_inLeap(_LEAP_12, currentYear)) {
              leapIndex = 14;
            } else if (hs[13] <= jq[24]) {
              i = 1;
              while (hs[i + 1] > jq[2 * i] && i < 13) {
                i++;
              }
              leapIndex = i;
            }
            for (j = leapIndex; j < 15; j++) {
              months2[j] -= 1;
            }
            var fm = -1;
            var index2 = -1;
            var y = prevYear;
            for (i = 0; i < 15; i++) {
              var dm = hs[i] + Solar2.J2000;
              var v2 = months2[i];
              var mc = _YMC[v2 % 12];
              if (1724360 <= dm && dm < 1729794) {
                mc = _YMC[(v2 + 1) % 12];
              } else if (1807724 <= dm && dm < 1808699) {
                mc = _YMC[(v2 + 1) % 12];
              } else if (dm === 1729794 || dm === 1808699) {
                mc = 12;
              }
              if (fm === -1) {
                fm = mc;
                index2 = mc;
              }
              if (mc < fm) {
                y += 1;
                index2 = 1;
              }
              fm = mc;
              if (i === leapIndex) {
                mc = -mc;
              } else if (dm === 1729794 || dm === 1808699) {
                mc = -11;
              }
              this._p.months.push(LunarMonth2._(y, mc, dayCounts[i], hs[i] + Solar2.J2000, index2));
              index2++;
            }
            return this;
          }
        }._compute();
      };
      var _fromCachedYear = function(lunarYear) {
        var y;
        if (!_CACHE_YEAR || _CACHE_YEAR.getYear() !== lunarYear) {
          y = _fromYear(lunarYear);
          _CACHE_YEAR = y;
        } else {
          y = _CACHE_YEAR;
        }
        return y;
      };
      return {
        fromYear: function(lunarYear) {
          return _fromCachedYear(lunarYear);
        }
      };
    }();
    var LunarMonth2 = /* @__PURE__ */ function() {
      var _fromYm = function(lunarYear, lunarMonth) {
        var oy = lunarYear;
        var om = lunarMonth;
        lunarYear *= 1;
        if (isNaN(lunarYear)) {
          throw new Error("wrong lunar year " + oy);
        }
        lunarMonth *= 1;
        if (isNaN(lunarMonth)) {
          throw new Error("wrong lunar month " + om);
        }
        return LunarYear2.fromYear(lunarYear).getMonth(lunarMonth);
      };
      var _new = function(lunarYear, lunarMonth, dayCount, firstJulianDay, index2) {
        return {
          _p: {
            year: lunarYear,
            month: lunarMonth,
            dayCount,
            firstJulianDay,
            index: index2,
            zhiIndex: (Math.abs(lunarMonth) - 1 + LunarUtil2.BASE_MONTH_ZHI_INDEX) % 12
          },
          getIndex: function() {
            return this._p.index;
          },
          getGanIndex: function() {
            var offset2 = (LunarYear2.fromYear(this._p.year).getGanIndex() + 1) % 5 * 2;
            return (Math.abs(this._p.month) - 1 + offset2) % 10;
          },
          getZhiIndex: function() {
            return this._p.zhiIndex;
          },
          getGan: function() {
            return LunarUtil2.GAN[this.getGanIndex() + 1];
          },
          getZhi: function() {
            return LunarUtil2.ZHI[this._p.zhiIndex + 1];
          },
          getGanZhi: function() {
            return this.getGan() + this.getZhi();
          },
          getYear: function() {
            return this._p.year;
          },
          getMonth: function() {
            return this._p.month;
          },
          getDayCount: function() {
            return this._p.dayCount;
          },
          getFirstJulianDay: function() {
            return this._p.firstJulianDay;
          },
          isLeap: function() {
            return this._p.month < 0;
          },
          getPositionXi: function() {
            return LunarUtil2.POSITION_XI[this.getGanIndex() + 1];
          },
          getPositionXiDesc: function() {
            return LunarUtil2.POSITION_DESC.get(this.getPositionXi());
          },
          getPositionYangGui: function() {
            return LunarUtil2.POSITION_YANG_GUI[this.getGanIndex() + 1];
          },
          getPositionYangGuiDesc: function() {
            return LunarUtil2.POSITION_DESC.get(this.getPositionYangGui());
          },
          getPositionYinGui: function() {
            return LunarUtil2.POSITION_YIN_GUI[this.getGanIndex() + 1];
          },
          getPositionYinGuiDesc: function() {
            return LunarUtil2.POSITION_DESC.get(this.getPositionYinGui());
          },
          getPositionFu: function(sect) {
            return (1 === sect ? LunarUtil2.POSITION_FU : LunarUtil2.POSITION_FU_2)[this.getGanIndex() + 1];
          },
          getPositionFuDesc: function(sect) {
            return LunarUtil2.POSITION_DESC.get(this.getPositionFu(sect));
          },
          getPositionCai: function() {
            return LunarUtil2.POSITION_CAI[this.getGanIndex() + 1];
          },
          getPositionCaiDesc: function() {
            return LunarUtil2.POSITION_DESC.get(this.getPositionCai());
          },
          getPositionTaiSui: function() {
            var p;
            var m = Math.abs(this._p.month);
            switch (m) {
              case 1:
              case 5:
              case 9:
                p = "艮";
                break;
              case 3:
              case 7:
              case 11:
                p = "坤";
                break;
              case 4:
              case 8:
              case 12:
                p = "巽";
                break;
              default:
                p = LunarUtil2.POSITION_GAN[Solar2.fromJulianDay(this.getFirstJulianDay()).getLunar().getMonthGanIndex()];
            }
            return p;
          },
          getPositionTaiSuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionTaiSui()];
          },
          getNineStar: function() {
            var index3 = LunarYear2.fromYear(this._p.year).getZhiIndex() % 3;
            var m = this._p.month;
            if (m < 0) {
              m = -m;
            }
            var monthZhiIndex = (13 + m) % 12;
            var n = 27 - index3 * 3;
            if (monthZhiIndex < LunarUtil2.BASE_MONTH_ZHI_INDEX) {
              n -= 3;
            }
            var offset2 = (n - monthZhiIndex) % 9;
            return NineStar2.fromIndex(offset2);
          },
          next: function(n) {
            var on = n;
            n *= 1;
            if (isNaN(n)) {
              throw new Error("wrong days " + on);
            }
            if (0 === n) {
              return LunarMonth2.fromYm(this._p.year, this._p.month);
            } else {
              var rest = Math.abs(n);
              var ny = this._p.year;
              var iy = ny;
              var im = this._p.month;
              var index3 = 0;
              var months2 = LunarYear2.fromYear(ny).getMonths();
              var i;
              var m;
              var size2;
              if (n > 0) {
                while (true) {
                  size2 = months2.length;
                  for (i = 0; i < size2; i++) {
                    m = months2[i];
                    if (m.getYear() === iy && m.getMonth() === im) {
                      index3 = i;
                      break;
                    }
                  }
                  var more = size2 - index3 - 1;
                  if (rest < more) {
                    break;
                  }
                  rest -= more;
                  var lastMonth = months2[size2 - 1];
                  iy = lastMonth.getYear();
                  im = lastMonth.getMonth();
                  ny++;
                  months2 = LunarYear2.fromYear(ny).getMonths();
                }
                return months2[index3 + rest];
              } else {
                while (true) {
                  size2 = months2.length;
                  for (i = 0; i < size2; i++) {
                    m = months2[i];
                    if (m.getYear() === iy && m.getMonth() === im) {
                      index3 = i;
                      break;
                    }
                  }
                  if (rest <= index3) {
                    break;
                  }
                  rest -= index3;
                  var firstMonth = months2[0];
                  iy = firstMonth.getYear();
                  im = firstMonth.getMonth();
                  ny--;
                  months2 = LunarYear2.fromYear(ny).getMonths();
                }
                return months2[index3 - rest];
              }
            }
          },
          toString: function() {
            return this.getYear() + "年" + (this.isLeap() ? "闰" : "") + LunarUtil2.MONTH[Math.abs(this.getMonth())] + "月(" + this.getDayCount() + ")天";
          }
        };
      };
      return {
        fromYm: function(lunarYear, lunarMonth) {
          return _fromYm(lunarYear, lunarMonth);
        },
        _: function(lunarYear, lunarMonth, dayCount, firstJulianDay, index2) {
          return _new(lunarYear, lunarMonth, dayCount, firstJulianDay, index2);
        }
      };
    }();
    var ShouXingUtil2 = function() {
      var _decode = function(s) {
        var o2 = "0000000000";
        var o22 = o2 + o2;
        s = s.replace(/J/g, "00");
        s = s.replace(/I/g, "000");
        s = s.replace(/H/g, "0000");
        s = s.replace(/G/g, "00000");
        s = s.replace(/t/g, "02");
        s = s.replace(/s/g, "002");
        s = s.replace(/r/g, "0002");
        s = s.replace(/q/g, "00002");
        s = s.replace(/p/g, "000002");
        s = s.replace(/o/g, "0000002");
        s = s.replace(/n/g, "00000002");
        s = s.replace(/m/g, "000000002");
        s = s.replace(/l/g, "0000000002");
        s = s.replace(/k/g, "01");
        s = s.replace(/j/g, "0101");
        s = s.replace(/i/g, "001");
        s = s.replace(/h/g, "001001");
        s = s.replace(/g/g, "0001");
        s = s.replace(/f/g, "00001");
        s = s.replace(/e/g, "000001");
        s = s.replace(/d/g, "0000001");
        s = s.replace(/c/g, "00000001");
        s = s.replace(/b/g, "000000001");
        s = s.replace(/a/g, "0000000001");
        s = s.replace(/A/g, o22 + o22 + o22);
        s = s.replace(/B/g, o22 + o22 + o2);
        s = s.replace(/C/g, o22 + o22);
        s = s.replace(/D/g, o22 + o2);
        s = s.replace(/E/g, o22);
        s = s.replace(/F/g, o2);
        return s;
      };
      return {
        PI_2: 2 * Math.PI,
        ONE_THIRD: 1 / 3,
        SECOND_PER_DAY: 86400,
        SECOND_PER_RAD: 648e3 / Math.PI,
        NUT_B: [
          2.1824,
          -33.75705,
          36e-6,
          -1720,
          920,
          3.5069,
          1256.66393,
          11e-6,
          -132,
          57,
          1.3375,
          16799.4182,
          -51e-6,
          -23,
          10,
          4.3649,
          -67.5141,
          72e-6,
          21,
          -9,
          0.04,
          -628.302,
          0,
          -14,
          0,
          2.36,
          8328.691,
          0,
          7,
          0,
          3.46,
          1884.966,
          0,
          -5,
          2,
          5.44,
          16833.175,
          0,
          -4,
          2,
          3.69,
          25128.11,
          0,
          -3,
          0,
          3.55,
          628.362,
          0,
          2,
          0
        ],
        DT_AT: [
          -4e3,
          108371.7,
          -13036.8,
          392,
          0,
          -500,
          17201,
          -627.82,
          16.17,
          -0.3413,
          -150,
          12200.6,
          -346.41,
          5.403,
          -0.1593,
          150,
          9113.8,
          -328.13,
          -1.647,
          0.0377,
          500,
          5707.5,
          -391.41,
          0.915,
          0.3145,
          900,
          2203.4,
          -283.45,
          13.034,
          -0.1778,
          1300,
          490.1,
          -57.35,
          2.085,
          -72e-4,
          1600,
          120,
          -9.81,
          -1.532,
          0.1403,
          1700,
          10.2,
          -0.91,
          0.51,
          -0.037,
          1800,
          13.4,
          -0.72,
          0.202,
          -0.0193,
          1830,
          7.8,
          -1.81,
          0.416,
          -0.0247,
          1860,
          8.3,
          -0.13,
          -0.406,
          0.0292,
          1880,
          -5.4,
          0.32,
          -0.183,
          0.0173,
          1900,
          -2.3,
          2.06,
          0.169,
          -0.0135,
          1920,
          21.2,
          1.69,
          -0.304,
          0.0167,
          1940,
          24.2,
          1.22,
          -0.064,
          31e-4,
          1960,
          33.2,
          0.51,
          0.231,
          -0.0109,
          1980,
          51,
          1.29,
          -0.026,
          32e-4,
          2e3,
          63.87,
          0.1,
          0,
          0,
          2005,
          64.7,
          0.21,
          0,
          0,
          2012,
          66.8,
          0.22,
          0,
          0,
          // 2018, 69.0, 0.36, 0, 0,
          // 使用skyfeild的DE440s△T预测数据拟合
          2016,
          68.1024,
          0.5456,
          -0.0542,
          -1172e-6,
          2020,
          69.3612,
          0.0422,
          -0.0502,
          6216e-6,
          2024,
          69.1752,
          -0.0335,
          -48e-4,
          811e-6,
          2028,
          69.0206,
          -0.0275,
          55e-4,
          -14e-6,
          2032,
          68.9981,
          0.0163,
          54e-4,
          6e-6,
          2036,
          69.1498,
          0.0599,
          53e-4,
          26e-6,
          2040,
          69.4751,
          0.1035,
          51e-4,
          46e-6,
          2044,
          69.9737,
          0.1469,
          5e-3,
          66e-6,
          2048,
          70.6451,
          0.1903,
          49e-4,
          85e-6,
          2050,
          71.0457
        ],
        XL0: [
          1e10,
          20,
          578,
          920,
          1100,
          1124,
          1136,
          1148,
          1217,
          1226,
          1229,
          1229,
          1229,
          1229,
          1937,
          2363,
          2618,
          2633,
          2660,
          2666,
          17534704567,
          0,
          0,
          334165646,
          4.669256804,
          6283.075849991,
          3489428,
          4.6261024,
          12566.1517,
          349706,
          2.744118,
          5753.384885,
          341757,
          2.828866,
          3.523118,
          313590,
          3.62767,
          77713.771468,
          267622,
          4.418084,
          7860.419392,
          234269,
          6.135162,
          3930.209696,
          132429,
          0.742464,
          11506.76977,
          127317,
          2.037097,
          529.690965,
          119917,
          1.109629,
          1577.343542,
          99025,
          5.23268,
          5884.92685,
          90186,
          2.04505,
          26.29832,
          85722,
          3.50849,
          398.149,
          77979,
          1.17883,
          5223.69392,
          75314,
          2.53339,
          5507.55324,
          50526,
          4.58293,
          18849.22755,
          49238,
          4.20507,
          775.52261,
          35666,
          2.91954,
          0.06731,
          31709,
          5.84902,
          11790.62909,
          28413,
          1.89869,
          796.29801,
          27104,
          0.31489,
          10977.0788,
          24281,
          0.34481,
          5486.77784,
          20616,
          4.80647,
          2544.31442,
          20539,
          1.86948,
          5573.1428,
          20226,
          2.45768,
          6069.77675,
          15552,
          0.83306,
          213.2991,
          13221,
          3.41118,
          2942.46342,
          12618,
          1.08303,
          20.7754,
          11513,
          0.64545,
          0.98032,
          10285,
          0.636,
          4694.00295,
          10190,
          0.97569,
          15720.83878,
          10172,
          4.2668,
          7.11355,
          9921,
          6.2099,
          2146.1654,
          9761,
          0.681,
          155.4204,
          8580,
          5.9832,
          161000.6857,
          8513,
          1.2987,
          6275.9623,
          8471,
          3.6708,
          71430.6956,
          7964,
          1.8079,
          17260.1547,
          7876,
          3.037,
          12036.4607,
          7465,
          1.7551,
          5088.6288,
          7387,
          3.5032,
          3154.6871,
          7355,
          4.6793,
          801.8209,
          6963,
          0.833,
          9437.7629,
          6245,
          3.9776,
          8827.3903,
          6115,
          1.8184,
          7084.8968,
          5696,
          2.7843,
          6286.599,
          5612,
          4.3869,
          14143.4952,
          5558,
          3.4701,
          6279.5527,
          5199,
          0.1891,
          12139.5535,
          5161,
          1.3328,
          1748.0164,
          5115,
          0.2831,
          5856.4777,
          4900,
          0.4874,
          1194.447,
          4104,
          5.3682,
          8429.2413,
          4094,
          2.3985,
          19651.0485,
          3920,
          6.1683,
          10447.3878,
          3677,
          6.0413,
          10213.2855,
          3660,
          2.5696,
          1059.3819,
          3595,
          1.7088,
          2352.8662,
          3557,
          1.776,
          6812.7668,
          3329,
          0.5931,
          17789.8456,
          3041,
          0.4429,
          83996.8473,
          3005,
          2.7398,
          1349.8674,
          2535,
          3.1647,
          4690.4798,
          2474,
          0.2148,
          3.5904,
          2366,
          0.4847,
          8031.0923,
          2357,
          2.0653,
          3340.6124,
          2282,
          5.222,
          4705.7323,
          2189,
          5.5559,
          553.5694,
          2142,
          1.4256,
          16730.4637,
          2109,
          4.1483,
          951.7184,
          2030,
          0.3713,
          283.8593,
          1992,
          5.2221,
          12168.0027,
          1986,
          5.7747,
          6309.3742,
          1912,
          3.8222,
          23581.2582,
          1889,
          5.3863,
          149854.4001,
          1790,
          2.2149,
          13367.9726,
          1748,
          4.5605,
          135.0651,
          1622,
          5.9884,
          11769.8537,
          1508,
          4.1957,
          6256.7775,
          1442,
          4.1932,
          242.7286,
          1435,
          3.7236,
          38.0277,
          1397,
          4.4014,
          6681.2249,
          1362,
          1.8893,
          7632.9433,
          1250,
          1.1305,
          5.5229,
          1205,
          2.6223,
          955.5997,
          1200,
          1.0035,
          632.7837,
          1129,
          0.1774,
          4164.312,
          1083,
          0.3273,
          103.0928,
          1052,
          0.9387,
          11926.2544,
          1050,
          5.3591,
          1592.596,
          1033,
          6.1998,
          6438.4962,
          1001,
          6.0291,
          5746.2713,
          980,
          0.999,
          11371.705,
          980,
          5.244,
          27511.468,
          938,
          2.624,
          5760.498,
          923,
          0.483,
          522.577,
          922,
          4.571,
          4292.331,
          905,
          5.337,
          6386.169,
          862,
          4.165,
          7058.598,
          841,
          3.299,
          7234.794,
          836,
          4.539,
          25132.303,
          813,
          6.112,
          4732.031,
          812,
          6.271,
          426.598,
          801,
          5.821,
          28.449,
          787,
          0.996,
          5643.179,
          776,
          2.957,
          23013.54,
          769,
          3.121,
          7238.676,
          758,
          3.974,
          11499.656,
          735,
          4.386,
          316.392,
          731,
          0.607,
          11513.883,
          719,
          3.998,
          74.782,
          706,
          0.323,
          263.084,
          676,
          5.911,
          90955.552,
          663,
          3.665,
          17298.182,
          653,
          5.791,
          18073.705,
          630,
          4.717,
          6836.645,
          615,
          1.458,
          233141.314,
          612,
          1.075,
          19804.827,
          596,
          3.321,
          6283.009,
          596,
          2.876,
          6283.143,
          555,
          2.452,
          12352.853,
          541,
          5.392,
          419.485,
          531,
          0.382,
          31441.678,
          519,
          4.065,
          6208.294,
          513,
          2.361,
          10973.556,
          494,
          5.737,
          9917.697,
          450,
          3.272,
          11015.106,
          449,
          3.653,
          206.186,
          447,
          2.064,
          7079.374,
          435,
          4.423,
          5216.58,
          421,
          1.906,
          245.832,
          413,
          0.921,
          3738.761,
          402,
          0.84,
          20.355,
          387,
          1.826,
          11856.219,
          379,
          2.344,
          3.881,
          374,
          2.954,
          3128.389,
          370,
          5.031,
          536.805,
          365,
          1.018,
          16200.773,
          365,
          1.083,
          88860.057,
          352,
          5.978,
          3894.182,
          352,
          2.056,
          244287.6,
          351,
          3.713,
          6290.189,
          340,
          1.106,
          14712.317,
          339,
          0.978,
          8635.942,
          339,
          3.202,
          5120.601,
          333,
          0.837,
          6496.375,
          325,
          3.479,
          6133.513,
          316,
          5.089,
          21228.392,
          316,
          1.328,
          10873.986,
          309,
          3.646,
          10.637,
          303,
          1.802,
          35371.887,
          296,
          3.397,
          9225.539,
          288,
          6.026,
          154717.61,
          281,
          2.585,
          14314.168,
          262,
          3.856,
          266.607,
          262,
          2.579,
          22483.849,
          257,
          1.561,
          23543.231,
          255,
          3.949,
          1990.745,
          251,
          3.744,
          10575.407,
          240,
          1.161,
          10984.192,
          238,
          0.106,
          7.046,
          236,
          4.272,
          6040.347,
          234,
          3.577,
          10969.965,
          211,
          3.714,
          65147.62,
          210,
          0.754,
          13521.751,
          207,
          4.228,
          5650.292,
          202,
          0.814,
          170.673,
          201,
          4.629,
          6037.244,
          200,
          0.381,
          6172.87,
          199,
          3.933,
          6206.81,
          199,
          5.197,
          6262.3,
          197,
          1.046,
          18209.33,
          195,
          1.07,
          5230.807,
          195,
          4.869,
          36.028,
          194,
          4.313,
          6244.943,
          192,
          1.229,
          709.933,
          192,
          5.595,
          6282.096,
          192,
          0.602,
          6284.056,
          189,
          3.744,
          23.878,
          188,
          1.904,
          15.252,
          188,
          0.867,
          22003.915,
          182,
          3.681,
          15110.466,
          181,
          0.491,
          1.484,
          179,
          3.222,
          39302.097,
          179,
          1.259,
          12559.038,
          62833196674749,
          0,
          0,
          20605886,
          2.67823456,
          6283.07584999,
          430343,
          2.635127,
          12566.1517,
          42526,
          1.59047,
          3.52312,
          11926,
          5.79557,
          26.29832,
          10898,
          2.96618,
          1577.34354,
          9348,
          2.5921,
          18849.2275,
          7212,
          1.1385,
          529.691,
          6777,
          1.8747,
          398.149,
          6733,
          4.4092,
          5507.5532,
          5903,
          2.888,
          5223.6939,
          5598,
          2.1747,
          155.4204,
          4541,
          0.398,
          796.298,
          3637,
          0.4662,
          775.5226,
          2896,
          2.6471,
          7.1135,
          2084,
          5.3414,
          0.9803,
          1910,
          1.8463,
          5486.7778,
          1851,
          4.9686,
          213.2991,
          1729,
          2.9912,
          6275.9623,
          1623,
          0.0322,
          2544.3144,
          1583,
          1.4305,
          2146.1654,
          1462,
          1.2053,
          10977.0788,
          1246,
          2.8343,
          1748.0164,
          1188,
          3.258,
          5088.6288,
          1181,
          5.2738,
          1194.447,
          1151,
          2.075,
          4694.003,
          1064,
          0.7661,
          553.5694,
          997,
          1.303,
          6286.599,
          972,
          4.239,
          1349.867,
          945,
          2.7,
          242.729,
          858,
          5.645,
          951.718,
          758,
          5.301,
          2352.866,
          639,
          2.65,
          9437.763,
          610,
          4.666,
          4690.48,
          583,
          1.766,
          1059.382,
          531,
          0.909,
          3154.687,
          522,
          5.661,
          71430.696,
          520,
          1.854,
          801.821,
          504,
          1.425,
          6438.496,
          433,
          0.241,
          6812.767,
          426,
          0.774,
          10447.388,
          413,
          5.24,
          7084.897,
          374,
          2.001,
          8031.092,
          356,
          2.429,
          14143.495,
          350,
          4.8,
          6279.553,
          337,
          0.888,
          12036.461,
          337,
          3.862,
          1592.596,
          325,
          3.4,
          7632.943,
          322,
          0.616,
          8429.241,
          318,
          3.188,
          4705.732,
          297,
          6.07,
          4292.331,
          295,
          1.431,
          5746.271,
          290,
          2.325,
          20.355,
          275,
          0.935,
          5760.498,
          270,
          4.804,
          7234.794,
          253,
          6.223,
          6836.645,
          228,
          5.003,
          17789.846,
          225,
          5.672,
          11499.656,
          215,
          5.202,
          11513.883,
          208,
          3.955,
          10213.286,
          208,
          2.268,
          522.577,
          206,
          2.224,
          5856.478,
          206,
          2.55,
          25132.303,
          203,
          0.91,
          6256.778,
          189,
          0.532,
          3340.612,
          188,
          4.735,
          83996.847,
          179,
          1.474,
          4164.312,
          178,
          3.025,
          5.523,
          177,
          3.026,
          5753.385,
          159,
          4.637,
          3.286,
          157,
          6.124,
          5216.58,
          155,
          3.077,
          6681.225,
          154,
          4.2,
          13367.973,
          143,
          1.191,
          3894.182,
          138,
          3.093,
          135.065,
          136,
          4.245,
          426.598,
          134,
          5.765,
          6040.347,
          128,
          3.085,
          5643.179,
          127,
          2.092,
          6290.189,
          125,
          3.077,
          11926.254,
          125,
          3.445,
          536.805,
          114,
          3.244,
          12168.003,
          112,
          2.318,
          16730.464,
          111,
          3.901,
          11506.77,
          111,
          5.32,
          23.878,
          105,
          3.75,
          7860.419,
          103,
          2.447,
          1990.745,
          96,
          0.82,
          3.88,
          96,
          4.08,
          6127.66,
          91,
          5.42,
          206.19,
          91,
          0.42,
          7079.37,
          88,
          5.17,
          11790.63,
          81,
          0.34,
          9917.7,
          80,
          3.89,
          10973.56,
          78,
          2.4,
          1589.07,
          78,
          2.58,
          11371.7,
          77,
          3.98,
          955.6,
          77,
          3.36,
          36.03,
          76,
          1.3,
          103.09,
          75,
          5.18,
          10969.97,
          75,
          4.96,
          6496.37,
          73,
          5.21,
          38.03,
          72,
          2.65,
          6309.37,
          70,
          5.61,
          3738.76,
          69,
          2.6,
          3496.03,
          69,
          0.39,
          15.25,
          69,
          2.78,
          20.78,
          65,
          1.13,
          7058.6,
          64,
          4.28,
          28.45,
          61,
          5.63,
          10984.19,
          60,
          0.73,
          419.48,
          60,
          5.28,
          10575.41,
          58,
          5.55,
          17298.18,
          58,
          3.19,
          4732.03,
          5291887,
          0,
          0,
          871984,
          1.072097,
          6283.07585,
          30913,
          0.86729,
          12566.1517,
          2734,
          0.053,
          3.5231,
          1633,
          5.1883,
          26.2983,
          1575,
          3.6846,
          155.4204,
          954,
          0.757,
          18849.228,
          894,
          2.057,
          77713.771,
          695,
          0.827,
          775.523,
          506,
          4.663,
          1577.344,
          406,
          1.031,
          7.114,
          381,
          3.441,
          5573.143,
          346,
          5.141,
          796.298,
          317,
          6.053,
          5507.553,
          302,
          1.192,
          242.729,
          289,
          6.117,
          529.691,
          271,
          0.306,
          398.149,
          254,
          2.28,
          553.569,
          237,
          4.381,
          5223.694,
          208,
          3.754,
          0.98,
          168,
          0.902,
          951.718,
          153,
          5.759,
          1349.867,
          145,
          4.364,
          1748.016,
          134,
          3.721,
          1194.447,
          125,
          2.948,
          6438.496,
          122,
          2.973,
          2146.165,
          110,
          1.271,
          161000.686,
          104,
          0.604,
          3154.687,
          100,
          5.986,
          6286.599,
          92,
          4.8,
          5088.63,
          89,
          5.23,
          7084.9,
          83,
          3.31,
          213.3,
          76,
          3.42,
          5486.78,
          71,
          6.19,
          4690.48,
          68,
          3.43,
          4694,
          65,
          1.6,
          2544.31,
          64,
          1.98,
          801.82,
          61,
          2.48,
          10977.08,
          50,
          1.44,
          6836.65,
          49,
          2.34,
          1592.6,
          46,
          1.31,
          4292.33,
          46,
          3.81,
          149854.4,
          43,
          0.04,
          7234.79,
          40,
          4.94,
          7632.94,
          39,
          1.57,
          71430.7,
          38,
          3.17,
          6309.37,
          35,
          0.99,
          6040.35,
          35,
          0.67,
          1059.38,
          31,
          3.18,
          2352.87,
          31,
          3.55,
          8031.09,
          30,
          1.92,
          10447.39,
          30,
          2.52,
          6127.66,
          28,
          4.42,
          9437.76,
          28,
          2.71,
          3894.18,
          27,
          0.67,
          25132.3,
          26,
          5.27,
          6812.77,
          25,
          0.55,
          6279.55,
          23,
          1.38,
          4705.73,
          22,
          0.64,
          6256.78,
          20,
          6.07,
          640.88,
          28923,
          5.84384,
          6283.07585,
          3496,
          0,
          0,
          1682,
          5.4877,
          12566.1517,
          296,
          5.196,
          155.42,
          129,
          4.722,
          3.523,
          71,
          5.3,
          18849.23,
          64,
          5.97,
          242.73,
          40,
          3.79,
          553.57,
          11408,
          3.14159,
          0,
          772,
          4.134,
          6283.076,
          77,
          3.84,
          12566.15,
          42,
          0.42,
          155.42,
          88,
          3.14,
          0,
          17,
          2.77,
          6283.08,
          5,
          2.01,
          155.42,
          3,
          2.21,
          12566.15,
          27962,
          3.1987,
          84334.66158,
          10164,
          5.42249,
          5507.55324,
          8045,
          3.8801,
          5223.6939,
          4381,
          3.7044,
          2352.8662,
          3193,
          4.0003,
          1577.3435,
          2272,
          3.9847,
          1047.7473,
          1814,
          4.9837,
          6283.0758,
          1639,
          3.5646,
          5856.4777,
          1444,
          3.7028,
          9437.7629,
          1430,
          3.4112,
          10213.2855,
          1125,
          4.8282,
          14143.4952,
          1090,
          2.0857,
          6812.7668,
          1037,
          4.0566,
          71092.8814,
          971,
          3.473,
          4694.003,
          915,
          1.142,
          6620.89,
          878,
          4.44,
          5753.385,
          837,
          4.993,
          7084.897,
          770,
          5.554,
          167621.576,
          719,
          3.602,
          529.691,
          692,
          4.326,
          6275.962,
          558,
          4.41,
          7860.419,
          529,
          2.484,
          4705.732,
          521,
          6.25,
          18073.705,
          903,
          3.897,
          5507.553,
          618,
          1.73,
          5223.694,
          380,
          5.244,
          2352.866,
          166,
          1.627,
          84334.662,
          10001398880,
          0,
          0,
          167069963,
          3.098463508,
          6283.075849991,
          1395602,
          3.0552461,
          12566.1517,
          308372,
          5.198467,
          77713.771468,
          162846,
          1.173877,
          5753.384885,
          157557,
          2.846852,
          7860.419392,
          92480,
          5.45292,
          11506.76977,
          54244,
          4.56409,
          3930.2097,
          47211,
          3.661,
          5884.92685,
          34598,
          0.96369,
          5507.55324,
          32878,
          5.89984,
          5223.69392,
          30678,
          0.29867,
          5573.1428,
          24319,
          4.2735,
          11790.62909,
          21183,
          5.84715,
          1577.34354,
          18575,
          5.02194,
          10977.0788,
          17484,
          3.01194,
          18849.22755,
          10984,
          5.05511,
          5486.77784,
          9832,
          0.8868,
          6069.7768,
          8650,
          5.6896,
          15720.8388,
          8583,
          1.2708,
          161000.6857,
          6490,
          0.2725,
          17260.1547,
          6292,
          0.9218,
          529.691,
          5706,
          2.0137,
          83996.8473,
          5574,
          5.2416,
          71430.6956,
          4938,
          3.245,
          2544.3144,
          4696,
          2.5781,
          775.5226,
          4466,
          5.5372,
          9437.7629,
          4252,
          6.0111,
          6275.9623,
          3897,
          5.3607,
          4694.003,
          3825,
          2.3926,
          8827.3903,
          3749,
          0.8295,
          19651.0485,
          3696,
          4.9011,
          12139.5535,
          3566,
          1.6747,
          12036.4607,
          3454,
          1.8427,
          2942.4634,
          3319,
          0.2437,
          7084.8968,
          3192,
          0.1837,
          5088.6288,
          3185,
          1.7778,
          398.149,
          2846,
          1.2134,
          6286.599,
          2779,
          1.8993,
          6279.5527,
          2628,
          4.589,
          10447.3878,
          2460,
          3.7866,
          8429.2413,
          2393,
          4.996,
          5856.4777,
          2359,
          0.2687,
          796.298,
          2329,
          2.8078,
          14143.4952,
          2210,
          1.95,
          3154.6871,
          2035,
          4.6527,
          2146.1654,
          1951,
          5.3823,
          2352.8662,
          1883,
          0.6731,
          149854.4001,
          1833,
          2.2535,
          23581.2582,
          1796,
          0.1987,
          6812.7668,
          1731,
          6.152,
          16730.4637,
          1717,
          4.4332,
          10213.2855,
          1619,
          5.2316,
          17789.8456,
          1381,
          5.1896,
          8031.0923,
          1364,
          3.6852,
          4705.7323,
          1314,
          0.6529,
          13367.9726,
          1041,
          4.3329,
          11769.8537,
          1017,
          1.5939,
          4690.4798,
          998,
          4.201,
          6309.374,
          966,
          3.676,
          27511.468,
          874,
          6.064,
          1748.016,
          779,
          3.674,
          12168.003,
          771,
          0.312,
          7632.943,
          756,
          2.626,
          6256.778,
          746,
          5.648,
          11926.254,
          693,
          2.924,
          6681.225,
          680,
          1.423,
          23013.54,
          674,
          0.563,
          3340.612,
          663,
          5.661,
          11371.705,
          659,
          3.136,
          801.821,
          648,
          2.65,
          19804.827,
          615,
          3.029,
          233141.314,
          612,
          5.134,
          1194.447,
          563,
          4.341,
          90955.552,
          552,
          2.091,
          17298.182,
          534,
          5.1,
          31441.678,
          531,
          2.407,
          11499.656,
          523,
          4.624,
          6438.496,
          513,
          5.324,
          11513.883,
          477,
          0.256,
          11856.219,
          461,
          1.722,
          7234.794,
          458,
          3.766,
          6386.169,
          458,
          4.466,
          5746.271,
          423,
          1.055,
          5760.498,
          422,
          1.557,
          7238.676,
          415,
          2.599,
          7058.598,
          401,
          3.03,
          1059.382,
          397,
          1.201,
          1349.867,
          379,
          4.907,
          4164.312,
          360,
          5.707,
          5643.179,
          352,
          3.626,
          244287.6,
          348,
          0.761,
          10973.556,
          342,
          3.001,
          4292.331,
          336,
          4.546,
          4732.031,
          334,
          3.138,
          6836.645,
          324,
          4.164,
          9917.697,
          316,
          1.691,
          11015.106,
          307,
          0.238,
          35371.887,
          298,
          1.306,
          6283.143,
          298,
          1.75,
          6283.009,
          293,
          5.738,
          16200.773,
          286,
          5.928,
          14712.317,
          281,
          3.515,
          21228.392,
          280,
          5.663,
          8635.942,
          277,
          0.513,
          26.298,
          268,
          4.207,
          18073.705,
          266,
          0.9,
          12352.853,
          260,
          2.962,
          25132.303,
          255,
          2.477,
          6208.294,
          242,
          2.8,
          709.933,
          231,
          1.054,
          22483.849,
          229,
          1.07,
          14314.168,
          216,
          1.314,
          154717.61,
          215,
          6.038,
          10873.986,
          200,
          0.561,
          7079.374,
          198,
          2.614,
          951.718,
          197,
          4.369,
          167283.762,
          186,
          2.861,
          5216.58,
          183,
          1.66,
          39302.097,
          183,
          5.912,
          3738.761,
          175,
          2.145,
          6290.189,
          173,
          2.168,
          10575.407,
          171,
          3.702,
          1592.596,
          171,
          1.343,
          3128.389,
          164,
          5.55,
          6496.375,
          164,
          5.856,
          10984.192,
          161,
          1.998,
          10969.965,
          161,
          1.909,
          6133.513,
          157,
          4.955,
          25158.602,
          154,
          6.216,
          23543.231,
          153,
          5.357,
          13521.751,
          150,
          5.77,
          18209.33,
          150,
          5.439,
          155.42,
          139,
          1.778,
          9225.539,
          139,
          1.626,
          5120.601,
          128,
          2.46,
          13916.019,
          123,
          0.717,
          143571.324,
          122,
          2.654,
          88860.057,
          121,
          4.414,
          3894.182,
          121,
          1.192,
          3.523,
          120,
          4.03,
          553.569,
          119,
          1.513,
          17654.781,
          117,
          3.117,
          14945.316,
          113,
          2.698,
          6040.347,
          110,
          3.085,
          43232.307,
          109,
          0.998,
          955.6,
          108,
          2.939,
          17256.632,
          107,
          5.285,
          65147.62,
          103,
          0.139,
          11712.955,
          103,
          5.85,
          213.299,
          102,
          3.046,
          6037.244,
          101,
          2.842,
          8662.24,
          100,
          3.626,
          6262.3,
          98,
          2.36,
          6206.81,
          98,
          5.11,
          6172.87,
          98,
          2,
          15110.47,
          97,
          2.67,
          5650.29,
          97,
          2.75,
          6244.94,
          96,
          4.02,
          6282.1,
          96,
          5.31,
          6284.06,
          92,
          0.1,
          29088.81,
          85,
          3.26,
          20426.57,
          84,
          2.6,
          28766.92,
          81,
          3.58,
          10177.26,
          80,
          5.81,
          5230.81,
          78,
          2.53,
          16496.36,
          77,
          4.06,
          6127.66,
          73,
          0.04,
          5481.25,
          72,
          5.96,
          12559.04,
          72,
          5.92,
          4136.91,
          71,
          5.49,
          22003.91,
          70,
          3.41,
          7.11,
          69,
          0.62,
          11403.68,
          69,
          3.9,
          1589.07,
          69,
          1.96,
          12416.59,
          69,
          4.51,
          426.6,
          67,
          1.61,
          11087.29,
          66,
          4.5,
          47162.52,
          66,
          5.08,
          283.86,
          66,
          4.32,
          16858.48,
          65,
          1.04,
          6062.66,
          64,
          1.59,
          18319.54,
          63,
          5.7,
          45892.73,
          63,
          4.6,
          66567.49,
          63,
          3.82,
          13517.87,
          62,
          2.62,
          11190.38,
          61,
          1.54,
          33019.02,
          60,
          5.58,
          10344.3,
          60,
          5.38,
          316428.23,
          60,
          5.78,
          632.78,
          59,
          6.12,
          9623.69,
          57,
          0.16,
          17267.27,
          57,
          3.86,
          6076.89,
          57,
          1.98,
          7668.64,
          56,
          4.78,
          20199.09,
          55,
          4.56,
          18875.53,
          55,
          3.51,
          17253.04,
          54,
          3.07,
          226858.24,
          54,
          4.83,
          18422.63,
          53,
          5.02,
          12132.44,
          52,
          3.63,
          5333.9,
          52,
          0.97,
          155427.54,
          51,
          3.36,
          20597.24,
          50,
          0.99,
          11609.86,
          50,
          2.21,
          1990.75,
          48,
          1.62,
          12146.67,
          48,
          1.17,
          12569.67,
          47,
          4.62,
          5436.99,
          47,
          1.81,
          12562.63,
          47,
          0.59,
          21954.16,
          47,
          0.76,
          7342.46,
          46,
          0.27,
          4590.91,
          46,
          3.77,
          156137.48,
          45,
          5.66,
          10454.5,
          44,
          5.84,
          3496.03,
          43,
          0.24,
          17996.03,
          41,
          5.93,
          51092.73,
          41,
          4.21,
          12592.45,
          40,
          5.14,
          1551.05,
          40,
          5.28,
          15671.08,
          39,
          3.69,
          18052.93,
          39,
          4.94,
          24356.78,
          38,
          2.72,
          11933.37,
          38,
          5.23,
          7477.52,
          38,
          4.99,
          9779.11,
          37,
          3.7,
          9388.01,
          37,
          4.44,
          4535.06,
          36,
          2.16,
          28237.23,
          36,
          2.54,
          242.73,
          36,
          0.22,
          5429.88,
          35,
          6.15,
          19800.95,
          35,
          2.92,
          36949.23,
          34,
          5.63,
          2379.16,
          34,
          5.73,
          16460.33,
          34,
          5.11,
          5849.36,
          33,
          6.19,
          6268.85,
          10301861,
          1.1074897,
          6283.07584999,
          172124,
          1.064423,
          12566.1517,
          70222,
          3.14159,
          0,
          3235,
          1.0217,
          18849.2275,
          3080,
          2.8435,
          5507.5532,
          2497,
          1.3191,
          5223.6939,
          1849,
          1.4243,
          1577.3435,
          1008,
          5.9138,
          10977.0788,
          865,
          1.42,
          6275.962,
          863,
          0.271,
          5486.778,
          507,
          1.686,
          5088.629,
          499,
          6.014,
          6286.599,
          467,
          5.987,
          529.691,
          440,
          0.518,
          4694.003,
          410,
          1.084,
          9437.763,
          387,
          4.75,
          2544.314,
          375,
          5.071,
          796.298,
          352,
          0.023,
          83996.847,
          344,
          0.949,
          71430.696,
          341,
          5.412,
          775.523,
          322,
          6.156,
          2146.165,
          286,
          5.484,
          10447.388,
          284,
          3.42,
          2352.866,
          255,
          6.132,
          6438.496,
          252,
          0.243,
          398.149,
          243,
          3.092,
          4690.48,
          225,
          3.689,
          7084.897,
          220,
          4.952,
          6812.767,
          219,
          0.42,
          8031.092,
          209,
          1.282,
          1748.016,
          193,
          5.314,
          8429.241,
          185,
          1.82,
          7632.943,
          175,
          3.229,
          6279.553,
          173,
          1.537,
          4705.732,
          158,
          4.097,
          11499.656,
          158,
          5.539,
          3154.687,
          150,
          3.633,
          11513.883,
          148,
          3.222,
          7234.794,
          147,
          3.653,
          1194.447,
          144,
          0.817,
          14143.495,
          135,
          6.151,
          5746.271,
          134,
          4.644,
          6836.645,
          128,
          2.693,
          1349.867,
          123,
          5.65,
          5760.498,
          118,
          2.577,
          13367.973,
          113,
          3.357,
          17789.846,
          110,
          4.497,
          4292.331,
          108,
          5.828,
          12036.461,
          102,
          5.621,
          6256.778,
          99,
          1.14,
          1059.38,
          98,
          0.66,
          5856.48,
          93,
          2.32,
          10213.29,
          92,
          0.77,
          16730.46,
          88,
          1.5,
          11926.25,
          86,
          1.42,
          5753.38,
          85,
          0.66,
          155.42,
          81,
          1.64,
          6681.22,
          80,
          4.11,
          951.72,
          66,
          4.55,
          5216.58,
          65,
          0.98,
          25132.3,
          64,
          4.19,
          6040.35,
          64,
          0.52,
          6290.19,
          63,
          1.51,
          5643.18,
          59,
          6.18,
          4164.31,
          57,
          2.3,
          10973.56,
          55,
          2.32,
          11506.77,
          55,
          2.2,
          1592.6,
          55,
          5.27,
          3340.61,
          54,
          5.54,
          553.57,
          53,
          5.04,
          9917.7,
          53,
          0.92,
          11371.7,
          52,
          3.98,
          17298.18,
          52,
          3.6,
          10969.97,
          49,
          5.91,
          3894.18,
          49,
          2.51,
          6127.66,
          48,
          1.67,
          12168,
          46,
          0.31,
          801.82,
          42,
          3.7,
          10575.41,
          42,
          4.05,
          10984.19,
          40,
          2.17,
          7860.42,
          40,
          4.17,
          26.3,
          38,
          5.82,
          7058.6,
          37,
          3.39,
          6496.37,
          36,
          1.08,
          6309.37,
          36,
          5.34,
          7079.37,
          34,
          3.62,
          11790.63,
          32,
          0.32,
          16200.77,
          31,
          4.24,
          3738.76,
          29,
          4.55,
          11856.22,
          29,
          1.26,
          8635.94,
          27,
          3.45,
          5884.93,
          26,
          5.08,
          10177.26,
          26,
          5.38,
          21228.39,
          24,
          2.26,
          11712.96,
          24,
          1.05,
          242.73,
          24,
          5.59,
          6069.78,
          23,
          3.63,
          6284.06,
          23,
          1.64,
          4732.03,
          22,
          3.46,
          213.3,
          21,
          1.05,
          3496.03,
          21,
          3.92,
          13916.02,
          21,
          4.01,
          5230.81,
          20,
          5.16,
          12352.85,
          20,
          0.69,
          1990.75,
          19,
          2.73,
          6062.66,
          19,
          5.01,
          11015.11,
          18,
          6.04,
          6283.01,
          18,
          2.85,
          7238.68,
          18,
          5.6,
          6283.14,
          18,
          5.16,
          17253.04,
          18,
          2.54,
          14314.17,
          17,
          1.58,
          7.11,
          17,
          0.98,
          3930.21,
          17,
          4.75,
          17267.27,
          16,
          2.19,
          6076.89,
          16,
          2.19,
          18073.7,
          16,
          6.12,
          3.52,
          16,
          4.61,
          9623.69,
          16,
          3.4,
          16496.36,
          15,
          0.19,
          9779.11,
          15,
          5.3,
          13517.87,
          15,
          4.26,
          3128.39,
          15,
          0.81,
          709.93,
          14,
          0.5,
          25158.6,
          14,
          4.38,
          4136.91,
          13,
          0.98,
          65147.62,
          13,
          3.31,
          154717.61,
          13,
          2.11,
          1589.07,
          13,
          1.92,
          22483.85,
          12,
          6.03,
          9225.54,
          12,
          1.53,
          12559.04,
          12,
          5.82,
          6282.1,
          12,
          5.61,
          5642.2,
          12,
          2.38,
          167283.76,
          12,
          0.39,
          12132.44,
          12,
          3.98,
          4686.89,
          12,
          5.81,
          12569.67,
          12,
          0.56,
          5849.36,
          11,
          0.45,
          6172.87,
          11,
          5.8,
          16858.48,
          11,
          6.22,
          12146.67,
          11,
          2.27,
          5429.88,
          435939,
          5.784551,
          6283.07585,
          12363,
          5.57935,
          12566.1517,
          1234,
          3.1416,
          0,
          879,
          3.628,
          77713.771,
          569,
          1.87,
          5573.143,
          330,
          5.47,
          18849.228,
          147,
          4.48,
          5507.553,
          110,
          2.842,
          161000.686,
          101,
          2.815,
          5223.694,
          85,
          3.11,
          1577.34,
          65,
          5.47,
          775.52,
          61,
          1.38,
          6438.5,
          50,
          4.42,
          6286.6,
          47,
          3.66,
          7084.9,
          46,
          5.39,
          149854.4,
          42,
          0.9,
          10977.08,
          40,
          3.2,
          5088.63,
          35,
          1.81,
          5486.78,
          32,
          5.35,
          3154.69,
          30,
          3.52,
          796.3,
          29,
          4.62,
          4690.48,
          28,
          1.84,
          4694,
          27,
          3.14,
          71430.7,
          27,
          6.17,
          6836.65,
          26,
          1.42,
          2146.17,
          25,
          2.81,
          1748.02,
          24,
          2.18,
          155.42,
          23,
          4.76,
          7234.79,
          21,
          3.38,
          7632.94,
          21,
          0.22,
          4705.73,
          20,
          4.22,
          1349.87,
          20,
          2.01,
          1194.45,
          20,
          4.58,
          529.69,
          19,
          1.59,
          6309.37,
          18,
          5.7,
          6040.35,
          18,
          6.03,
          4292.33,
          17,
          2.9,
          9437.76,
          17,
          2,
          8031.09,
          17,
          5.78,
          83996.85,
          16,
          0.05,
          2544.31,
          15,
          0.95,
          6127.66,
          14,
          0.36,
          10447.39,
          14,
          1.48,
          2352.87,
          13,
          0.77,
          553.57,
          13,
          5.48,
          951.72,
          13,
          5.27,
          6279.55,
          13,
          3.76,
          6812.77,
          11,
          5.41,
          6256.78,
          10,
          0.68,
          1592.6,
          10,
          4.95,
          398.15,
          10,
          1.15,
          3894.18,
          10,
          5.2,
          244287.6,
          10,
          1.94,
          11856.22,
          9,
          5.39,
          25132.3,
          8,
          6.18,
          1059.38,
          8,
          0.69,
          8429.24,
          8,
          5.85,
          242.73,
          7,
          5.26,
          14143.5,
          7,
          0.52,
          801.82,
          6,
          2.24,
          8635.94,
          6,
          4,
          13367.97,
          6,
          2.77,
          90955.55,
          6,
          5.17,
          7058.6,
          5,
          1.46,
          233141.31,
          5,
          4.13,
          7860.42,
          5,
          3.91,
          26.3,
          5,
          3.89,
          12036.46,
          5,
          5.58,
          6290.19,
          5,
          5.54,
          1990.75,
          5,
          0.83,
          11506.77,
          5,
          6.22,
          6681.22,
          4,
          5.26,
          10575.41,
          4,
          1.91,
          7477.52,
          4,
          0.43,
          10213.29,
          4,
          1.09,
          709.93,
          4,
          5.09,
          11015.11,
          4,
          4.22,
          88860.06,
          4,
          3.57,
          7079.37,
          4,
          1.98,
          6284.06,
          4,
          3.93,
          10973.56,
          4,
          6.18,
          9917.7,
          4,
          0.36,
          10177.26,
          4,
          2.75,
          3738.76,
          4,
          3.33,
          5643.18,
          4,
          5.36,
          25158.6,
          14459,
          4.27319,
          6283.07585,
          673,
          3.917,
          12566.152,
          77,
          0,
          0,
          25,
          3.73,
          18849.23,
          4,
          2.8,
          6286.6,
          386,
          2.564,
          6283.076,
          31,
          2.27,
          12566.15,
          5,
          3.44,
          5573.14,
          2,
          2.05,
          18849.23,
          1,
          2.06,
          77713.77,
          1,
          4.41,
          161000.69,
          1,
          3.82,
          149854.4,
          1,
          4.08,
          6127.66,
          1,
          5.26,
          6438.5,
          9,
          1.22,
          6283.08,
          1,
          0.66,
          12566.15
        ],
        XL1: [
          [22639.586, 0.78475822, 8328.691424623, 1.5229241, 25.0719, -0.123598, 4586.438, 0.1873974, 7214.06286536, -2.184756, -18.86, 0.0828, 2369.914, 2.542952, 15542.75428998, -0.661832, 6.212, -0.0408, 769.026, 3.140313, 16657.38284925, 3.04585, 50.144, -0.2472, 666.418, 1.527671, 628.30195521, -0.02664, 0.062, -54e-4, 411.596, 4.826607, 16866.932315, -1.28012, -1.07, -59e-4, 211.656, 4.115028, -1114.6285593, -3.70768, -43.93, 0.2064, 205.436, 0.230523, 6585.7609101, -2.15812, -18.92, 0.0882, 191.956, 4.898507, 23871.4457146, 0.86109, 31.28, -0.164, 164.729, 2.586078, 14914.4523348, -0.6352, 6.15, -0.035, 147.321, 5.4553, -7700.3894694, -1.5496, -25.01, 0.118, 124.988, 0.48608, 7771.377145, -0.3309, 3.11, -0.02, 109.38, 3.88323, 8956.9933798, 1.4963, 25.13, -0.129, 55.177, 5.57033, -1324.178025, 0.6183, 7.3, -0.035, 45.1, 0.89898, 25195.62374, 0.2428, 24, -0.129, 39.533, 3.81213, -8538.24089, 2.803, 26.1, -0.118, 38.43, 4.30115, 22756.817155, -2.8466, -12.6, 0.042, 36.124, 5.49587, 24986.074274, 4.5688, 75.2, -0.371, 30.773, 1.94559, 14428.125731, -4.3695, -37.7, 0.166, 28.397, 3.28586, 7842.364821, -2.2114, -18.8, 0.077, 24.358, 5.64142, 16171.056245, -0.6885, 6.3, -0.046, 18.585, 4.41371, -557.31428, -1.8538, -22, 0.1, 17.954, 3.58454, 8399.6791, -0.3576, 3.2, -0.03, 14.53, 4.9416, 23243.143759, 0.888, 31.2, -0.16, 14.38, 0.9709, 32200.137139, 2.384, 56.4, -0.29, 14.251, 5.7641, -2.3012, 1.523, 25.1, -0.12, 13.899, 0.3735, 31085.50858, -1.324, 12.4, -0.08, 13.194, 1.7595, -9443.319984, -5.231, -69, 0.33, 9.679, 3.0997, -16029.080894, -3.072, -50.1, 0.24, 9.366, 0.3016, 24080.99518, -3.465, -19.9, 0.08, 8.606, 4.1582, -1742.930514, -3.681, -44, 0.21, 8.453, 2.8416, 16100.06857, 1.192, 28.2, -0.14, 8.05, 2.6292, 14286.15038, -0.609, 6.1, -0.03, 7.63, 6.2388, 17285.684804, 3.019, 50.2, -0.25, 7.447, 1.4845, 1256.60391, -0.053, 0.1, -0.01, 7.371, 0.2736, 5957.458955, -2.131, -19, 0.09, 7.063, 5.6715, 33.757047, -0.308, -3.6, 0.02, 6.383, 4.7843, 7004.5134, 2.141, 32.4, -0.16, 5.742, 2.6572, 32409.686605, -1.942, 5, -0.05, 4.374, 4.3443, 22128.5152, -2.82, -13, 0.05, 3.998, 3.2545, 33524.31516, 1.766, 49, -0.25, 3.21, 2.2443, 14985.44001, -2.516, -16, 0.06, 2.915, 1.7138, 24499.74767, 0.834, 31, -0.17, 2.732, 1.9887, 13799.82378, -4.343, -38, 0.17, 2.568, 5.4122, -7072.08751, -1.576, -25, 0.11, 2.521, 3.2427, 8470.66678, -2.238, -19, 0.07, 2.489, 4.0719, -486.3266, -3.734, -44, 0.2, 2.146, 5.6135, -1952.47998, 0.645, 7, -0.03, 1.978, 2.7291, 39414.2, 0.199, 37, -0.21, 1.934, 1.5682, 33314.7657, 6.092, 100, -0.5, 1.871, 0.4166, 30457.20662, -1.297, 12, -0.1, 1.753, 2.0582, -8886.0057, -3.38, -47, 0.2, 1.437, 2.386, -695.87607, 0.59, 7, 0, 1.373, 3.026, -209.54947, 4.33, 51, -0.2, 1.262, 5.94, 16728.37052, 1.17, 28, -0.1, 1.224, 6.172, 6656.74859, -4.04, -41, 0.2, 1.187, 5.873, 6099.43431, -5.89, -63, 0.3, 1.177, 1.014, 31571.83518, 2.41, 56, -0.3, 1.162, 3.84, 9585.29534, 1.47, 25, -0.1, 1.143, 5.639, 8364.73984, -2.18, -19, 0.1, 1.078, 1.229, 70.98768, -1.88, -22, 0.1, 1.059, 3.326, 40528.82856, 3.91, 81, -0.4, 0.99, 5.013, 40738.37803, -0.42, 30, -0.2, 0.948, 5.687, -17772.01141, -6.75, -94, 0.5, 0.876, 0.298, -0.35232, 0, 0, 0, 0.822, 2.994, 393.02097, 0, 0, 0, 0.788, 1.836, 8326.39022, 3.05, 50, -0.2, 0.752, 4.985, 22614.8418, 0.91, 31, -0.2, 0.74, 2.875, 8330.99262, 0, 0, 0, 0.669, 0.744, -24357.77232, -4.6, -75, 0.4, 0.644, 1.314, 8393.12577, -2.18, -19, 0.1, 0.639, 5.888, 575.33849, 0, 0, 0, 0.635, 1.116, 23385.11911, -2.87, -13, 0, 0.584, 5.197, 24428.75999, 2.71, 53, -0.3, 0.583, 3.513, -9095.55517, 0.95, 4, 0, 0.572, 6.059, 29970.88002, -5.03, -32, 0.1, 0.565, 2.96, 0.32863, 1.52, 25, -0.1, 0.561, 4.001, -17981.56087, -2.43, -43, 0.2, 0.557, 0.529, 7143.07519, -0.3, 3, 0, 0.546, 2.311, 25614.37623, 4.54, 75, -0.4, 0.536, 4.229, 15752.30376, -4.99, -45, 0.2, 0.493, 3.316, -8294.9344, -1.83, -29, 0.1, 0.491, 1.744, 8362.4485, 1.21, 21, -0.1, 0.478, 1.803, -10071.6219, -5.2, -69, 0.3, 0.454, 0.857, 15333.2048, 3.66, 57, -0.3, 0.445, 2.071, 8311.7707, -2.18, -19, 0.1, 0.426, 0.345, 23452.6932, -3.44, -20, 0.1, 0.42, 4.941, 33733.8646, -2.56, -2, 0, 0.413, 1.642, 17495.2343, -1.31, -1, 0, 0.404, 1.458, 23314.1314, -0.99, 9, -0.1, 0.395, 2.132, 38299.5714, -3.51, -6, 0, 0.382, 2.7, 31781.3846, -1.92, 5, 0, 0.375, 4.827, 6376.2114, 2.17, 32, -0.2, 0.361, 3.867, 16833.1753, -0.97, 3, 0, 0.358, 5.044, 15056.4277, -4.4, -38, 0.2, 0.35, 5.157, -8257.7037, -3.4, -47, 0.2, 0.344, 4.233, 157.7344, 0, 0, 0, 0.34, 2.672, 13657.8484, -0.58, 6, 0, 0.329, 5.61, 41853.0066, 3.29, 74, -0.4, 0.325, 5.895, -39.8149, 0, 0, 0, 0.309, 4.387, 21500.2132, -2.79, -13, 0.1, 0.302, 1.278, 786.0419, 0, 0, 0, 0.302, 5.341, -24567.3218, -0.27, -24, 0.1, 0.301, 1.045, 5889.8848, -1.57, -12, 0, 0.294, 4.201, -2371.2325, -3.65, -44, 0.2, 0.293, 3.704, 21642.1886, -6.55, -57, 0.2, 0.29, 4.069, 32828.4391, 2.36, 56, -0.3, 0.289, 3.472, 31713.8105, -1.35, 12, -0.1, 0.285, 5.407, -33.7814, 0.31, 4, 0, 0.283, 5.998, -16.9207, -3.71, -44, 0.2, 0.283, 2.772, 38785.898, 0.23, 37, -0.2, 0.274, 5.343, 15613.742, -2.54, -16, 0.1, 0.263, 3.997, 25823.9257, 0.22, 24, -0.1, 0.254, 0.6, 24638.3095, -1.61, 2, 0, 0.253, 1.344, 6447.1991, 0.29, 10, -0.1, 0.25, 0.887, 141.9754, -3.76, -44, 0.2, 0.247, 0.317, 5329.157, -2.1, -19, 0.1, 0.245, 0.141, 36.0484, -3.71, -44, 0.2, 0.231, 2.287, 14357.1381, -2.49, -16, 0.1, 0.227, 5.158, 2.6298, 0, 0, 0, 0.219, 5.085, 47742.8914, 1.72, 63, -0.3, 0.211, 2.145, 6638.7244, -2.18, -19, 0.1, 0.201, 4.415, 39623.7495, -4.13, -14, 0, 0.194, 2.091, 588.4927, 0, 0, 0, 0.193, 3.057, -15400.7789, -3.1, -50, 0, 0.186, 5.598, 16799.3582, -0.72, 6, 0, 0.185, 3.886, 1150.677, 0, 0, 0, 0.183, 1.619, 7178.0144, 1.52, 25, 0, 0.181, 2.635, 8328.3391, 1.52, 25, 0, 0.181, 2.077, 8329.0437, 1.52, 25, 0, 0.179, 3.215, -9652.8694, -0.9, -18, 0, 0.176, 1.716, -8815.018, -5.26, -69, 0, 0.175, 5.673, 550.7553, 0, 0, 0, 0.17, 2.06, 31295.058, -5.6, -39, 0, 0.167, 1.239, 7211.7617, -0.7, 6, 0, 0.165, 4.499, 14967.4158, -0.7, 6, 0, 0.164, 3.595, 15540.4531, 0.9, 31, 0, 0.164, 4.237, 522.3694, 0, 0, 0, 0.163, 4.633, 15545.0555, -2.2, -19, 0, 0.161, 0.478, 6428.0209, -2.2, -19, 0, 0.158, 2.03, 13171.5218, -4.3, -38, 0, 0.157, 2.28, 7216.3641, -3.7, -44, 0, 0.154, 5.65, 7935.6705, 1.5, 25, 0, 0.152, 0.46, 29828.9047, -1.3, 12, 0, 0.151, 1.19, -0.7113, 0, 0, 0, 0.15, 1.42, 23942.4334, -1, 9, 0, 0.144, 2.75, 7753.3529, 1.5, 25, 0, 0.137, 2.08, 7213.7105, -2.2, -19, 0, 0.137, 1.44, 7214.4152, -2.2, -19, 0, 0.136, 4.46, -1185.6162, -1.8, -22, 0, 0.136, 3.03, 8000.1048, -2.2, -19, 0, 0.134, 2.83, 14756.7124, -0.7, 6, 0, 0.131, 5.05, 6821.0419, -2.2, -19, 0, 0.128, 5.99, -17214.6971, -4.9, -72, 0, 0.127, 5.35, 8721.7124, 1.5, 25, 0, 0.126, 4.49, 46628.2629, -2, 19, 0, 0.125, 5.94, 7149.6285, 1.5, 25, 0, 0.124, 1.09, 49067.0695, 1.1, 55, 0, 0.121, 2.88, 15471.7666, 1.2, 28, 0, 0.111, 3.92, 41643.4571, 7.6, 125, -1, 0.11, 1.96, 8904.0299, 1.5, 25, 0, 0.106, 3.3, -18.0489, -2.2, -19, 0, 0.105, 2.3, -4.931, 1.5, 25, 0, 0.104, 2.22, -6.559, -1.9, -22, 0, 0.101, 1.44, 1884.9059, -0.1, 0, 0, 0.1, 5.92, 5471.1324, -5.9, -63, 0, 0.099, 1.12, 15149.7333, -0.7, 6, 0, 0.096, 4.73, 15508.9972, -0.4, 10, 0, 0.095, 5.18, 7230.9835, 1.5, 25, 0, 0.093, 3.37, 39900.5266, 3.9, 81, 0, 0.092, 2.01, 25057.0619, 2.7, 53, 0, 0.092, 1.21, -79.6298, 0, 0, 0, 0.092, 1.65, -26310.2523, -4, -68, 0, 0.091, 1.01, 42062.5561, -1, 23, 0, 0.09, 6.1, 29342.5781, -5, -32, 0, 0.09, 4.43, 15542.402, -0.7, 6, 0, 0.09, 3.8, 15543.1066, -0.7, 6, 0, 0.089, 4.15, 6063.3859, -2.2, -19, 0, 0.086, 4.03, 52.9691, 0, 0, 0, 0.085, 0.49, 47952.4409, -2.6, 11, 0, 0.085, 1.6, 7632.8154, 2.1, 32, 0, 0.084, 0.22, 14392.0773, -0.7, 6, 0, 0.083, 6.22, 6028.4466, -4, -41, 0, 0.083, 0.63, -7909.9389, 2.8, 26, 0, 0.083, 5.2, -77.5523, 0, 0, 0, 0.082, 2.74, 8786.1467, -2.2, -19, 0, 0.08, 2.43, 9166.5428, -2.8, -26, 0, 0.08, 3.7, -25405.1732, 4.1, 27, 0, 0.078, 5.68, 48857.52, 5.4, 106, -1, 0.077, 1.85, 8315.5735, -2.2, -19, 0, 0.075, 5.46, -18191.1103, 1.9, 8, 0, 0.075, 1.41, -16238.6304, 1.3, 1, 0, 0.074, 5.06, 40110.0761, -0.4, 30, 0, 0.072, 2.1, 64.4343, -3.7, -44, 0, 0.071, 2.17, 37671.2695, -3.5, -6, 0, 0.069, 1.71, 16693.4313, -0.7, 6, 0, 0.069, 3.33, -26100.7028, -8.3, -119, 1, 0.068, 1.09, 8329.4028, 1.5, 25, 0, 0.068, 3.62, 8327.9801, 1.5, 25, 0, 0.068, 2.41, 16833.1509, -1, 3, 0, 0.067, 3.4, 24709.2971, -3.5, -20, 0, 0.067, 1.65, 8346.7156, -0.3, 3, 0, 0.066, 2.61, 22547.2677, 1.5, 39, 0, 0.066, 3.5, 15576.5113, -1, 3, 0, 0.065, 5.76, 33037.9886, -2, 5, 0, 0.065, 4.58, 8322.1325, -0.3, 3, 0, 0.065, 6.2, 17913.9868, 3, 50, 0, 0.065, 1.5, 22685.8295, -1, 9, 0, 0.065, 2.37, 7180.3058, -1.9, -15, 0, 0.064, 1.06, 30943.5332, 2.4, 56, 0, 0.064, 1.89, 8288.8765, 1.5, 25, 0, 0.064, 4.7, 6.0335, 0.3, 4, 0, 0.063, 2.83, 8368.5063, 1.5, 25, 0, 0.063, 5.66, -2580.7819, 0.7, 7, 0, 0.062, 3.78, 7056.3285, -2.2, -19, 0, 0.061, 1.49, 8294.91, 1.8, 29, 0, 0.061, 0.12, -10281.1714, -0.9, -18, 0, 0.061, 3.06, -8362.4729, -1.2, -21, 0, 0.061, 4.43, 8170.9571, 1.5, 25, 0, 0.059, 5.78, -13.1179, -3.7, -44, 0, 0.059, 5.97, 6625.5702, -2.2, -19, 0, 0.058, 5.01, -0.508, -0.3, 0, 0, 0.058, 2.73, 7161.0938, -2.2, -19, 0, 0.057, 0.19, 7214.0629, -2.2, -19, 0, 0.057, 4, 22199.5029, -4.7, -35, 0, 0.057, 5.38, 8119.142, 5.8, 76, 0, 0.056, 1.07, 7542.6495, 1.5, 25, 0, 0.056, 0.28, 8486.4258, 1.5, 25, 0, 0.054, 4.19, 16655.0816, 4.6, 75, 0, 0.053, 0.72, 7267.032, -2.2, -19, 0, 0.053, 3.12, 12.6192, 0.6, 7, 0, 0.052, 2.99, -32896.013, -1.8, -49, 0, 0.052, 3.46, 1097.708, 0, 0, 0, 0.051, 5.37, -6443.786, -1.6, -25, 0, 0.051, 1.35, 7789.401, -2.2, -19, 0, 0.051, 5.83, 40042.502, 0.2, 38, 0, 0.051, 3.63, 9114.733, 1.5, 25, 0, 0.05, 1.51, 8504.484, -2.5, -22, 0, 0.05, 5.23, 16659.684, 1.5, 25, 0, 0.05, 1.15, 7247.82, -2.5, -23, 0, 0.047, 0.25, -1290.421, 0.3, 0, 0, 0.047, 4.67, -32686.464, -6.1, -100, 0, 0.047, 3.49, 548.678, 0, 0, 0, 0.047, 2.37, 6663.308, -2.2, -19, 0, 0.046, 0.98, 1572.084, 0, 0, 0, 0.046, 2.04, 14954.262, -0.7, 6, 0, 0.046, 3.72, 6691.693, -2.2, -19, 0, 0.045, 6.19, -235.287, 0, 0, 0, 0.044, 2.96, 32967.001, -0.1, 27, 0, 0.044, 3.82, -1671.943, -5.6, -66, 0, 0.043, 5.82, 1179.063, 0, 0, 0, 0.043, 0.07, 34152.617, 1.7, 49, 0, 0.043, 3.71, 6514.773, -0.3, 0, 0, 0.043, 5.62, 15.732, -2.5, -23, 0, 0.043, 5.8, 8351.233, -2.2, -19, 0, 0.042, 0.27, 7740.199, 1.5, 25, 0, 0.042, 6.14, 15385.02, -0.7, 6, 0, 0.042, 6.13, 7285.051, -4.1, -41, 0, 0.041, 1.27, 32757.451, 4.2, 78, 0, 0.041, 4.46, 8275.722, 1.5, 25, 0, 0.04, 0.23, 8381.661, 1.5, 25, 0, 0.04, 5.87, -766.864, 2.5, 29, 0, 0.04, 1.66, 254.431, 0, 0, 0, 0.04, 0.4, 9027.981, -0.4, 0, 0, 0.04, 2.96, 7777.936, 1.5, 25, 0, 0.039, 4.67, 33943.068, 6.1, 100, 0, 0.039, 3.52, 8326.062, 1.5, 25, 0, 0.039, 3.75, 21013.887, -6.5, -57, 0, 0.039, 5.6, 606.978, 0, 0, 0, 0.039, 1.19, 8331.321, 1.5, 25, 0, 0.039, 2.84, 7211.433, -2.2, -19, 0, 0.038, 0.67, 7216.693, -2.2, -19, 0, 0.038, 6.22, 25161.867, 0.6, 28, 0, 0.038, 4.4, 7806.322, 1.5, 25, 0, 0.038, 4.16, 9179.168, -2.2, -19, 0, 0.037, 4.73, 14991.999, -0.7, 6, 0, 0.036, 0.35, 67.514, -0.6, -7, 0, 0.036, 3.7, 25266.611, -1.6, 0, 0, 0.036, 5.39, 16328.796, -0.7, 6, 0, 0.035, 1.44, 7174.248, -2.2, -19, 0, 0.035, 5, 15684.73, -4.4, -38, 0, 0.035, 0.39, -15.419, -2.2, -19, 0, 0.035, 6.07, 15020.385, -0.7, 6, 0, 0.034, 6.01, 7371.797, -2.2, -19, 0, 0.034, 0.96, -16623.626, -3.4, -54, 0, 0.033, 6.24, 9479.368, 1.5, 25, 0, 0.033, 3.21, 23661.896, 5.2, 82, 0, 0.033, 4.06, 8311.418, -2.2, -19, 0, 0.033, 2.4, 1965.105, 0, 0, 0, 0.033, 5.17, 15489.785, -0.7, 6, 0, 0.033, 5.03, 21986.54, 0.9, 31, 0, 0.033, 4.1, 16691.14, 2.7, 46, 0, 0.033, 5.13, 47114.589, 1.7, 63, 0, 0.033, 4.45, 8917.184, 1.5, 25, 0, 0.033, 4.23, 2.078, 0, 0, 0, 0.032, 2.33, 75.251, 1.5, 25, 0, 0.032, 2.1, 7253.878, -2.2, -19, 0, 0.032, 3.11, -0.224, 1.5, 25, 0, 0.032, 4.43, 16640.462, -0.7, 6, 0, 0.032, 5.68, 8328.363, 0, 0, 0, 0.031, 5.32, 8329.02, 3, 50, 0, 0.031, 3.7, 16118.093, -0.7, 6, 0, 0.03, 3.67, 16721.817, -0.7, 6, 0, 0.03, 5.27, -1881.492, -1.2, -15, 0, 0.03, 5.72, 8157.839, -2.2, -19, 0, 0.029, 5.73, -18400.313, -6.7, -94, 0, 0.029, 2.76, 16, -2.2, -19, 0, 0.029, 1.75, 8879.447, 1.5, 25, 0, 0.029, 0.32, 8851.061, 1.5, 25, 0, 0.029, 0.9, 14704.903, 3.7, 57, 0, 0.028, 2.9, 15595.723, -0.7, 6, 0, 0.028, 5.88, 16864.631, 0.2, 24, 0, 0.028, 0.63, 16869.234, -2.8, -26, 0, 0.028, 4.04, -18609.863, -2.4, -43, 0, 0.027, 5.83, 6727.736, -5.9, -63, 0, 0.027, 6.12, 418.752, 4.3, 51, 0, 0.027, 0.14, 41157.131, 3.9, 81, 0, 0.026, 3.8, 15.542, 0, 0, 0, 0.026, 1.68, 50181.698, 4.8, 99, -1, 0.026, 0.32, 315.469, 0, 0, 0, 0.025, 5.67, 19.188, 0.3, 0, 0, 0.025, 3.16, 62.133, -2.2, -19, 0, 0.025, 3.76, 15502.939, -0.7, 6, 0, 0.025, 4.53, 45999.961, -2, 19, 0, 0.024, 3.21, 837.851, -4.4, -51, 0, 0.024, 2.82, 38157.596, 0.3, 37, 0, 0.024, 5.21, 15540.124, -0.7, 6, 0, 0.024, 0.26, 14218.576, 0, 13, 0, 0.024, 3.01, 15545.384, -0.7, 6, 0, 0.024, 1.16, -17424.247, -0.6, -21, 0, 0.023, 2.34, -67.574, 0.6, 7, 0, 0.023, 2.44, 18.024, -1.9, -22, 0, 0.023, 3.7, 469.4, 0, 0, 0, 0.023, 0.72, 7136.511, -2.2, -19, 0, 0.023, 4.5, 15582.569, -0.7, 6, 0, 0.023, 2.8, -16586.395, -4.9, -72, 0, 0.023, 1.51, 80.182, 0, 0, 0, 0.023, 1.09, 5261.583, -1.5, -12, 0, 0.023, 0.56, 54956.954, -0.5, 44, 0, 0.023, 4.01, 8550.86, -2.2, -19, 0, 0.023, 4.46, 38995.448, -4.1, -14, 0, 0.023, 3.82, 2358.126, 0, 0, 0, 0.022, 3.77, 32271.125, 0.5, 34, 0, 0.022, 0.82, 15935.775, -0.7, 6, 0, 0.022, 1.07, 24013.421, -2.9, -13, 0, 0.022, 0.4, 8940.078, -2.2, -19, 0, 0.022, 2.06, 15700.489, -0.7, 6, 0, 0.022, 4.27, 15124.002, -5, -45, 0, 0.021, 1.16, 56071.583, 3.2, 88, 0, 0.021, 5.58, 9572.189, -2.2, -19, 0, 0.02, 1.7, -17.273, -3.7, -44, 0, 0.02, 3.05, 214.617, 0, 0, 0, 0.02, 4.41, 8391.048, -2.2, -19, 0, 0.02, 5.95, 23869.145, 2.4, 56, 0, 0.02, 0.42, 40947.927, -4.7, -21, 0, 0.019, 1.39, 5818.897, 0.3, 10, 0, 0.019, 0.71, 23873.747, -0.7, 6, 0, 0.019, 2.81, 7291.615, -2.2, -19, 0, 0.019, 5.09, 8428.018, -2.2, -19, 0, 0.019, 4.14, 6518.187, -1.6, -12, 0, 0.019, 3.85, 21.33, 0, 0, 0, 0.018, 0.66, 14445.046, -0.7, 6, 0, 0.018, 1.65, 0.966, -4, -48, 0, 0.018, 5.64, -17143.709, -6.8, -94, 0, 0.018, 6.01, 7736.432, -2.2, -19, 0, 0.018, 2.74, 31153.083, -1.9, 5, 0, 0.018, 4.58, 6116.355, -2.2, -19, 0, 0.018, 2.28, 46.401, 0.3, 0, 0, 0.018, 3.8, 10213.597, 1.4, 25, 0, 0.018, 2.84, 56281.132, -1.1, 36, 0, 0.018, 3.53, 8249.062, 1.5, 25, 0, 0.017, 4.43, 20871.911, -3, -13, 0, 0.017, 4.44, 627.596, 0, 0, 0, 0.017, 1.85, 628.308, 0, 0, 0, 0.017, 1.19, 8408.321, 2, 25, 0, 0.017, 1.95, 7214.056, -2, -19, 0, 0.017, 1.57, 7214.07, -2, -19, 0, 0.017, 1.65, 13870.811, -6, -60, 0, 0.017, 0.3, 22.542, -4, -44, 0, 0.017, 2.62, -119.445, 0, 0, 0, 0.016, 4.87, 5747.909, 2, 32, 0, 0.016, 4.45, 14339.108, -1, 6, 0, 0.016, 1.83, 41366.68, 0, 30, 0, 0.016, 4.53, 16309.618, -3, -23, 0, 0.016, 2.54, 15542.754, -1, 6, 0, 0.016, 6.05, 1203.646, 0, 0, 0, 0.015, 5.2, 2751.147, 0, 0, 0, 0.015, 1.8, -10699.924, -5, -69, 0, 0.015, 0.4, 22824.391, -3, -20, 0, 0.015, 2.1, 30666.756, -6, -39, 0, 0.015, 2.1, 6010.417, -2, -19, 0, 0.015, 0.7, -23729.47, -5, -75, 0, 0.015, 1.4, 14363.691, -1, 6, 0, 0.015, 5.8, 16900.689, -2, 0, 0, 0.015, 5.2, 23800.458, 3, 53, 0, 0.015, 5.3, 6035, -2, -19, 0, 0.015, 1.2, 8251.139, 2, 25, 0, 0.015, 3.6, -8.86, 0, 0, 0, 0.015, 0.8, 882.739, 0, 0, 0, 0.015, 3, 1021.329, 0, 0, 0, 0.015, 0.6, 23296.107, 1, 31, 0, 0.014, 5.4, 7227.181, 2, 25, 0, 0.014, 0.1, 7213.352, -2, -19, 0, 0.014, 4, 15506.706, 3, 50, 0, 0.014, 3.4, 7214.774, -2, -19, 0, 0.014, 4.6, 6665.385, -2, -19, 0, 0.014, 0.1, -8.636, -2, -22, 0, 0.014, 3.1, 15465.202, -1, 6, 0, 0.014, 4.9, 508.863, 0, 0, 0, 0.014, 3.5, 8406.244, 2, 25, 0, 0.014, 1.3, 13313.497, -8, -82, 0, 0.014, 2.8, 49276.619, -3, 0, 0, 0.014, 0.1, 30528.194, -3, -10, 0, 0.013, 1.7, 25128.05, 1, 31, 0, 0.013, 2.9, 14128.405, -1, 6, 0, 0.013, 3.4, 57395.761, 3, 80, 0, 0.013, 2.7, 13029.546, -1, 6, 0, 0.013, 3.9, 7802.556, -2, -19, 0, 0.013, 1.6, 8258.802, -2, -19, 0, 0.013, 2.2, 8417.709, -2, -19, 0, 0.013, 0.7, 9965.21, -2, -19, 0, 0.013, 3.4, 50391.247, 0, 48, 0, 0.013, 3, 7134.433, -2, -19, 0, 0.013, 2.9, 30599.182, -5, -31, 0, 0.013, 3.6, -9723.857, 1, 0, 0, 0.013, 4.8, 7607.084, -2, -19, 0, 0.012, 0.8, 23837.689, 1, 35, 0, 0.012, 3.6, 4.409, -4, -44, 0, 0.012, 5, 16657.031, 3, 50, 0, 0.012, 4.4, 16657.735, 3, 50, 0, 0.012, 1.1, 15578.803, -4, -38, 0, 0.012, 6, -11.49, 0, 0, 0, 0.012, 1.9, 8164.398, 0, 0, 0, 0.012, 2.4, 31852.372, -4, -17, 0, 0.012, 2.4, 6607.085, -2, -19, 0, 0.012, 4.2, 8359.87, 0, 0, 0, 0.012, 0.5, 5799.713, -2, -19, 0, 0.012, 2.7, 7220.622, 0, 0, 0, 0.012, 4.3, -139.72, 0, 0, 0, 0.012, 2.3, 13728.836, -2, -16, 0, 0.011, 3.6, 14912.146, 1, 31, 0, 0.011, 4.7, 14916.748, -2, -19, 0],
          [1.6768, 4.66926, 628.301955, -0.0266, 0.1, -5e-3, 0.51642, 3.3721, 6585.76091, -2.158, -18.9, 0.09, 0.41383, 5.7277, 14914.452335, -0.635, 6.2, -0.04, 0.37115, 3.9695, 7700.389469, 1.55, 25, -0.12, 0.2756, 0.7416, 8956.99338, 1.496, 25.1, -0.13, 0.24599, 4.2253, -2.3012, 1.523, 25.1, -0.12, 0.07118, 0.1443, 7842.36482, -2.211, -19, 0.08, 0.06128, 2.4998, 16171.05625, -0.688, 6, 0, 0.04516, 0.443, 8399.6791, -0.36, 3, 0, 0.04048, 5.771, 14286.15038, -0.61, 6, 0, 0.03747, 4.626, 1256.60391, -0.05, 0, 0, 0.03707, 3.415, 5957.45895, -2.13, -19, 0.1, 0.03649, 1.8, 23243.14376, 0.89, 31, -0.2, 0.02438, 0.042, 16029.08089, 3.07, 50, -0.2, 0.02165, 1.017, -1742.93051, -3.68, -44, 0.2, 0.01923, 3.097, 17285.6848, 3.02, 50, -0.3, 0.01692, 1.28, 0.3286, 1.52, 25, -0.1, 0.01361, 0.298, 8326.3902, 3.05, 50, -0.2, 0.01293, 4.013, 7072.0875, 1.58, 25, -0.1, 0.01276, 4.413, 8330.9926, 0, 0, 0, 0.0127, 0.101, 8470.6668, -2.24, -19, 0.1, 0.01097, 1.203, 22128.5152, -2.82, -13, 0, 0.01088, 2.545, 15542.7543, -0.66, 6, 0, 835e-5, 0.19, 7214.0629, -2.18, -19, 0.1, 734e-5, 4.855, 24499.7477, 0.83, 31, -0.2, 686e-5, 5.13, 13799.8238, -4.34, -38, 0.2, 631e-5, 0.93, -486.3266, -3.73, -44, 0, 585e-5, 0.699, 9585.2953, 1.5, 25, 0, 566e-5, 4.073, 8328.3391, 1.5, 25, 0, 566e-5, 0.638, 8329.0437, 1.5, 25, 0, 539e-5, 2.472, -1952.48, 0.6, 7, 0, 509e-5, 2.88, -0.7113, 0, 0, 0, 469e-5, 3.56, 30457.2066, -1.3, 12, 0, 387e-5, 0.78, -0.3523, 0, 0, 0, 378e-5, 1.84, 22614.8418, 0.9, 31, 0, 362e-5, 5.53, -695.8761, 0.6, 7, 0, 317e-5, 2.8, 16728.3705, 1.2, 28, 0, 303e-5, 6.07, 157.7344, 0, 0, 0, 3e-3, 2.53, 33.757, -0.3, -4, 0, 295e-5, 4.16, 31571.8352, 2.4, 56, 0, 289e-5, 5.98, 7211.7617, -0.7, 6, 0, 285e-5, 2.06, 15540.4531, 0.9, 31, 0, 283e-5, 2.65, 2.6298, 0, 0, 0, 282e-5, 6.17, 15545.0555, -2.2, -19, 0, 278e-5, 1.23, -39.8149, 0, 0, 0, 272e-5, 3.82, 7216.3641, -3.7, -44, 0, 27e-4, 4.37, 70.9877, -1.9, -22, 0, 256e-5, 5.81, 13657.8484, -0.6, 6, 0, 244e-5, 5.64, -0.2237, 1.5, 25, 0, 24e-4, 2.96, 8311.7707, -2.2, -19, 0, 239e-5, 0.87, -33.7814, 0.3, 4, 0, 216e-5, 2.31, 15.9995, -2.2, -19, 0, 186e-5, 3.46, 5329.157, -2.1, -19, 0, 169e-5, 2.4, 24357.772, 4.6, 75, 0, 161e-5, 5.8, 8329.403, 1.5, 25, 0, 161e-5, 5.2, 8327.98, 1.5, 25, 0, 16e-4, 4.26, 23385.119, -2.9, -13, 0, 156e-5, 1.26, 550.755, 0, 0, 0, 155e-5, 1.25, 21500.213, -2.8, -13, 0, 152e-5, 0.6, -16.921, -3.7, -44, 0, 15e-4, 2.71, -79.63, 0, 0, 0, 15e-4, 5.29, 15.542, 0, 0, 0, 148e-5, 1.06, -2371.232, -3.7, -44, 0, 141e-5, 0.77, 8328.691, 1.5, 25, 0, 141e-5, 3.67, 7143.075, -0.3, 0, 0, 138e-5, 5.45, 25614.376, 4.5, 75, 0, 129e-5, 4.9, 23871.446, 0.9, 31, 0, 126e-5, 4.03, 141.975, -3.8, -44, 0, 124e-5, 6.01, 522.369, 0, 0, 0, 12e-4, 4.94, -10071.622, -5.2, -69, 0, 118e-5, 5.07, -15.419, -2.2, -19, 0, 107e-5, 3.49, 23452.693, -3.4, -20, 0, 104e-5, 4.78, 17495.234, -1.3, 0, 0, 103e-5, 1.44, -18.049, -2.2, -19, 0, 102e-5, 5.63, 15542.402, -0.7, 6, 0, 102e-5, 2.59, 15543.107, -0.7, 6, 0, 1e-3, 4.11, -6.559, -1.9, -22, 0, 97e-5, 0.08, 15400.779, 3.1, 50, 0, 96e-5, 5.84, 31781.385, -1.9, 5, 0, 94e-5, 1.08, 8328.363, 0, 0, 0, 94e-5, 2.46, 16799.358, -0.7, 6, 0, 94e-5, 1.69, 6376.211, 2.2, 32, 0, 93e-5, 3.64, 8329.02, 3, 50, 0, 93e-5, 2.65, 16655.082, 4.6, 75, 0, 9e-4, 1.9, 15056.428, -4.4, -38, 0, 89e-5, 1.59, 52.969, 0, 0, 0, 88e-5, 2.02, -8257.704, -3.4, -47, 0, 88e-5, 3.02, 7213.711, -2.2, -19, 0, 87e-5, 0.5, 7214.415, -2.2, -19, 0, 87e-5, 0.49, 16659.684, 1.5, 25, 0, 82e-5, 5.64, -4.931, 1.5, 25, 0, 79e-5, 5.17, 13171.522, -4.3, -38, 0, 76e-5, 3.6, 29828.905, -1.3, 12, 0, 76e-5, 4.08, 24567.322, 0.3, 24, 0, 76e-5, 4.58, 1884.906, -0.1, 0, 0, 73e-5, 0.33, 31713.811, -1.4, 12, 0, 73e-5, 0.93, 32828.439, 2.4, 56, 0, 71e-5, 5.91, 38785.898, 0.2, 37, 0, 69e-5, 2.2, 15613.742, -2.5, -16, 0, 66e-5, 3.87, 15.732, -2.5, -23, 0, 66e-5, 0.86, 25823.926, 0.2, 24, 0, 65e-5, 2.52, 8170.957, 1.5, 25, 0, 63e-5, 0.18, 8322.132, -0.3, 0, 0, 6e-4, 5.84, 8326.062, 1.5, 25, 0, 6e-4, 5.15, 8331.321, 1.5, 25, 0, 6e-4, 2.18, 8486.426, 1.5, 25, 0, 58e-5, 2.3, -1.731, -4, -44, 0, 58e-5, 5.43, 14357.138, -2, -16, 0, 57e-5, 3.09, 8294.91, 2, 29, 0, 57e-5, 4.67, -8362.473, -1, -21, 0, 56e-5, 4.15, 16833.151, -1, 0, 0, 54e-5, 1.93, 7056.329, -2, -19, 0, 54e-5, 5.27, 8315.574, -2, -19, 0, 52e-5, 5.6, 8311.418, -2, -19, 0, 52e-5, 2.7, -77.552, 0, 0, 0, 51e-5, 4.3, 7230.984, 2, 25, 0, 5e-4, 0.4, -0.508, 0, 0, 0, 49e-5, 5.4, 7211.433, -2, -19, 0, 49e-5, 4.4, 7216.693, -2, -19, 0, 49e-5, 4.3, 16864.631, 0, 24, 0, 49e-5, 2.2, 16869.234, -3, -26, 0, 47e-5, 6.1, 627.596, 0, 0, 0, 47e-5, 5, 12.619, 1, 7, 0, 45e-5, 4.9, -8815.018, -5, -69, 0, 44e-5, 1.6, 62.133, -2, -19, 0, 42e-5, 2.9, -13.118, -4, -44, 0, 42e-5, 4.1, -119.445, 0, 0, 0, 41e-5, 4.3, 22756.817, -3, -13, 0, 41e-5, 3.6, 8288.877, 2, 25, 0, 4e-4, 0.5, 6663.308, -2, -19, 0, 4e-4, 1.1, 8368.506, 2, 25, 0, 39e-5, 4.1, 6443.786, 2, 25, 0, 39e-5, 3.1, 16657.383, 3, 50, 0, 38e-5, 0.1, 16657.031, 3, 50, 0, 38e-5, 3, 16657.735, 3, 50, 0, 38e-5, 4.6, 23942.433, -1, 9, 0, 37e-5, 4.3, 15385.02, -1, 6, 0, 37e-5, 5, 548.678, 0, 0, 0, 36e-5, 1.8, 7213.352, -2, -19, 0, 36e-5, 1.7, 7214.774, -2, -19, 0, 35e-5, 1.1, 7777.936, 2, 25, 0, 35e-5, 1.6, -8.86, 0, 0, 0, 35e-5, 4.4, 23869.145, 2, 56, 0, 35e-5, 2, 6691.693, -2, -19, 0, 34e-5, 1.3, -1185.616, -2, -22, 0, 34e-5, 2.2, 23873.747, -1, 6, 0, 33e-5, 2, -235.287, 0, 0, 0, 33e-5, 3.1, 17913.987, 3, 50, 0, 33e-5, 1, 8351.233, -2, -19, 0],
          [487e-5, 4.6693, 628.30196, -0.027, 0, -0.01, 228e-5, 2.6746, -2.3012, 1.523, 25, -0.12, 15e-4, 3.372, 6585.76091, -2.16, -19, 0.1, 12e-4, 5.728, 14914.45233, -0.64, 6, 0, 108e-5, 3.969, 7700.38947, 1.55, 25, -0.1, 8e-4, 0.742, 8956.99338, 1.5, 25, -0.1, 254e-6, 6.002, 0.3286, 1.52, 25, -0.1, 21e-5, 0.144, 7842.3648, -2.21, -19, 0, 18e-5, 2.5, 16171.0562, -0.7, 6, 0, 13e-5, 0.44, 8399.6791, -0.4, 3, 0, 126e-6, 5.03, 8326.3902, 3, 50, 0, 12e-5, 5.77, 14286.1504, -0.6, 6, 0, 118e-6, 5.96, 8330.9926, 0, 0, 0, 11e-5, 1.8, 23243.1438, 0.9, 31, 0, 11e-5, 3.42, 5957.459, -2.1, -19, 0, 11e-5, 4.63, 1256.6039, -0.1, 0, 0, 99e-6, 4.7, -0.7113, 0, 0, 0, 7e-5, 0.04, 16029.0809, 3.1, 50, 0, 7e-5, 5.14, 8328.3391, 1.5, 25, 0, 7e-5, 5.85, 8329.0437, 1.5, 25, 0, 6e-5, 1.02, -1742.9305, -3.7, -44, 0, 6e-5, 3.1, 17285.6848, 3, 50, 0, 54e-6, 5.69, -0.352, 0, 0, 0, 43e-6, 0.52, 15.542, 0, 0, 0, 41e-6, 2.03, 2.63, 0, 0, 0, 4e-5, 0.1, 8470.667, -2.2, -19, 0, 4e-5, 4.01, 7072.088, 1.6, 25, 0, 36e-6, 2.93, -8.86, -0.3, 0, 0, 3e-5, 1.2, 22128.515, -2.8, -13, 0, 3e-5, 2.54, 15542.754, -0.7, 6, 0, 27e-6, 4.43, 7211.762, -0.7, 6, 0, 26e-6, 0.51, 15540.453, 0.9, 31, 0, 26e-6, 1.44, 15545.055, -2.2, -19, 0, 25e-6, 5.37, 7216.364, -3.7, -44, 0],
          [12e-6, 1.041, -2.3012, 1.52, 25, -0.1, 17e-7, 0.31, -0.711, 0, 0, 0]
        ],
        QI_KB: [
          1640650479938e-6,
          15.218425,
          1642476703182e-6,
          15.21874996,
          1683430515601e-6,
          15.218750011,
          1752157640664e-6,
          15.218749978,
          1807675003759e-6,
          15.218620279,
          1883627765182e-6,
          15.218612292,
          19073691281e-4,
          15.218449176,
          1936603140413e-6,
          15.218425,
          193914552418e-5,
          15.218466998,
          19471807983e-4,
          15.218524844,
          1964362041824e-6,
          15.218533526,
          1987372340971e-6,
          15.218513908,
          1999653819126e-6,
          15.218530782,
          2007445469786e-6,
          15.218535181,
          2021324917146e-6,
          15.218526248,
          2047257232342e-6,
          15.218519654,
          2070282898213e-6,
          15.218425,
          207320487285e-5,
          15.218515221,
          2080144500926e-6,
          15.218530782,
          2086703688963e-6,
          15.218523776,
          2110033182763e-6,
          15.218425,
          2111190300888e-6,
          15.218425,
          2113731271005e-6,
          15.218515671,
          2120670840263e-6,
          15.218425,
          2123973309063e-6,
          15.218425,
          2125068997336e-6,
          15.218477932,
          2136026312633e-6,
          15.218472436,
          2156099495538e-6,
          15.218425,
          2159021324663e-6,
          15.218425,
          2162308575254e-6,
          15.218461742,
          2178485706538e-6,
          15.218425,
          2178759662849e-6,
          15.218445786,
          21853340208e-4,
          15.218425,
          2187525481425e-6,
          15.218425,
          2188621191481e-6,
          15.218437494,
          232214776e-2
        ],
        QB: _decode("FrcFs22AFsckF2tsDtFqEtF1posFdFgiFseFtmelpsEfhkF2anmelpFlF1ikrotcnEqEq2FfqmcDsrFor22FgFrcgDscFs22FgEeFtE2sfFs22sCoEsaF2tsD1FpeE2eFsssEciFsFnmelpFcFhkF2tcnEqEpFgkrotcnEqrEtFermcDsrE222FgBmcmr22DaEfnaF222sD1FpeForeF2tssEfiFpEoeFssD1iFstEqFppDgFstcnEqEpFg11FscnEqrAoAF2ClAEsDmDtCtBaDlAFbAEpAAAAAD2FgBiBqoBbnBaBoAAAAAAAEgDqAdBqAFrBaBoACdAAf1AACgAAAeBbCamDgEifAE2AABa1C1BgFdiAAACoCeE1ADiEifDaAEqAAFe1AcFbcAAAAAF1iFaAAACpACmFmAAAAAAAACrDaAAADG0"),
        SHUO_KB: [1457698231017e-6, 29.53067166, 1546082512234e-6, 29.53085106, 16406407353e-4, 29.5306, 1642472151543e-6, 29.53085439, 16834305093e-4, 29.53086148, 1752148041079e-6, 29.53085097, 1807665420323e-6, 29.53059851, 18836181141e-4, 29.5306, 19073607047e-4, 29.5306, 19365962249e-4, 29.5306, 19391356753e-4, 29.5306, 1947168],
        SB: _decode("EqoFscDcrFpmEsF2DfFideFelFpFfFfFiaipqti1ksttikptikqckstekqttgkqttgkqteksttikptikq2fjstgjqttjkqttgkqtekstfkptikq2tijstgjiFkirFsAeACoFsiDaDiADc1AFbBfgdfikijFifegF1FhaikgFag1E2btaieeibggiffdeigFfqDfaiBkF1kEaikhkigeidhhdiegcFfakF1ggkidbiaedksaFffckekidhhdhdikcikiakicjF1deedFhFccgicdekgiFbiaikcfi1kbFibefgEgFdcFkFeFkdcfkF1kfkcickEiFkDacFiEfbiaejcFfffkhkdgkaiei1ehigikhdFikfckF1dhhdikcfgjikhfjicjicgiehdikcikggcifgiejF1jkieFhegikggcikFegiegkfjebhigikggcikdgkaFkijcfkcikfkcifikiggkaeeigefkcdfcfkhkdgkegieidhijcFfakhfgeidieidiegikhfkfckfcjbdehdikggikgkfkicjicjF1dbidikFiggcifgiejkiegkigcdiegfggcikdbgfgefjF1kfegikggcikdgFkeeijcfkcikfkekcikdgkabhkFikaffcfkhkdgkegbiaekfkiakicjhfgqdq2fkiakgkfkhfkfcjiekgFebicggbedF1jikejbbbiakgbgkacgiejkijjgigfiakggfggcibFifjefjF1kfekdgjcibFeFkijcfkfhkfkeaieigekgbhkfikidfcjeaibgekgdkiffiffkiakF1jhbakgdki1dj1ikfkicjicjieeFkgdkicggkighdF1jfgkgfgbdkicggfggkidFkiekgijkeigfiskiggfaidheigF1jekijcikickiggkidhhdbgcfkFikikhkigeidieFikggikhkffaffijhidhhakgdkhkijF1kiakF1kfheakgdkifiggkigicjiejkieedikgdfcggkigieeiejfgkgkigbgikicggkiaideeijkefjeijikhkiggkiaidheigcikaikffikijgkiahi1hhdikgjfifaakekighie1hiaikggikhkffakicjhiahaikggikhkijF1kfejfeFhidikggiffiggkigicjiekgieeigikggiffiggkidheigkgfjkeigiegikifiggkidhedeijcfkFikikhkiggkidhh1ehigcikaffkhkiggkidhh1hhigikekfiFkFikcidhh1hitcikggikhkfkicjicghiediaikggikhkijbjfejfeFhaikggifikiggkigiejkikgkgieeigikggiffiggkigieeigekijcijikggifikiggkideedeijkefkfckikhkiggkidhh1ehijcikaffkhkiggkidhh1hhigikhkikFikfckcidhh1hiaikgjikhfjicjicgiehdikcikggifikigiejfejkieFhegikggifikiggfghigkfjeijkhigikggifikiggkigieeijcijcikfksikifikiggkidehdeijcfdckikhkiggkhghh1ehijikifffffkhsFngErD1pAfBoDd1BlEtFqA2AqoEpDqElAEsEeB2BmADlDkqBtC1FnEpDqnEmFsFsAFnllBbFmDsDiCtDmAB2BmtCgpEplCpAEiBiEoFqFtEqsDcCnFtADnFlEgdkEgmEtEsCtDmADqFtAFrAtEcCqAE1BoFqC1F1DrFtBmFtAC2ACnFaoCgADcADcCcFfoFtDlAFgmFqBq2bpEoAEmkqnEeCtAE1bAEqgDfFfCrgEcBrACfAAABqAAB1AAClEnFeCtCgAADqDoBmtAAACbFiAAADsEtBqAB2FsDqpFqEmFsCeDtFlCeDtoEpClEqAAFrAFoCgFmFsFqEnAEcCqFeCtFtEnAEeFtAAEkFnErAABbFkADnAAeCtFeAfBoAEpFtAABtFqAApDcCGJ"),
        nutationLon2: function(t2) {
          var a = -1.742 * t2;
          var t22 = t2 * t2;
          var dl = 0;
          for (var i = 0, j = this.NUT_B.length; i < j; i += 5) {
            dl += (this.NUT_B[i + 3] + a) * Math.sin(this.NUT_B[i] + this.NUT_B[i + 1] * t2 + this.NUT_B[i + 2] * t22);
            a = 0;
          }
          return dl / 100 / this.SECOND_PER_RAD;
        },
        eLon: function(t2, n) {
          t2 /= 10;
          var v = 0;
          var tn = 1;
          var n1;
          var n2;
          var m;
          var c;
          var pn = 1;
          var n0;
          var m0 = this.XL0[pn + 1] - this.XL0[pn];
          for (var i = 0; i < 6; i++, tn *= t2) {
            n1 = Math.floor(this.XL0[pn + i]);
            n2 = Math.floor(this.XL0[pn + 1 + i]);
            n0 = n2 - n1;
            if (n0 === 0) {
              continue;
            }
            if (n < 0) {
              m = n2;
            } else {
              m = Math.floor(3 * n * n0 / m0 + 0.5 + n1);
              if (i !== 0) {
                m += 3;
              }
              if (m > n2) {
                m = n2;
              }
            }
            c = 0;
            for (var j = n1; j < m; j += 3) {
              c += this.XL0[j] * Math.cos(this.XL0[j + 1] + t2 * this.XL0[j + 2]);
            }
            v += c * tn;
          }
          v /= this.XL0[0];
          var t22 = t2 * t2;
          v += (-0.0728 - 2.7702 * t2 - 1.1019 * t22 - 0.0996 * t22 * t2) / this.SECOND_PER_RAD;
          return v;
        },
        mLon: function(t2, n) {
          var ob = this.XL1;
          var obl = ob[0].length;
          var tn = 1;
          var v = 0;
          var j;
          var c;
          var t22 = t2 * t2;
          var t3 = t22 * t2;
          var t4 = t3 * t2;
          var t5 = t4 * t2;
          var tx = t2 - 10;
          v += (3.81034409 + 8399.684730072 * t2 - 3319e-8 * t22 + 311e-10 * t3 - 2033e-13 * t4) * this.SECOND_PER_RAD;
          v += 5028.792262 * t2 + 1.1124406 * t22 + 7699e-8 * t3 - 23479e-9 * t4 - 178e-10 * t5;
          if (tx > 0) {
            v += -0.866 + 1.43 * tx + 0.054 * tx * tx;
          }
          t22 /= 1e4;
          t3 /= 1e8;
          t4 /= 1e8;
          n *= 6;
          if (n < 0) {
            n = obl;
          }
          for (var i = 0, x = ob.length; i < x; i++, tn *= t2) {
            var f2 = ob[i];
            var l = f2.length;
            var m = Math.floor(n * l / obl + 0.5);
            if (i > 0) {
              m += 6;
            }
            if (m >= l) {
              m = l;
            }
            for (j = 0, c = 0; j < m; j += 6) {
              c += f2[j] * Math.cos(f2[j + 1] + t2 * f2[j + 2] + t22 * f2[j + 3] + t3 * f2[j + 4] + t4 * f2[j + 5]);
            }
            v += c * tn;
          }
          v /= this.SECOND_PER_RAD;
          return v;
        },
        gxcSunLon: function(t2) {
          var t22 = t2 * t2;
          var v = -0.043126 + 628.301955 * t2 - 2732e-9 * t22;
          var e2 = 0.016708634 - 42037e-9 * t2 - 1267e-10 * t22;
          return -20.49552 * (1 + e2 * Math.cos(v)) / this.SECOND_PER_RAD;
        },
        ev: function(t2) {
          var f2 = 628.307585 * t2;
          return 628.332 + 21 * Math.sin(1.527 + f2) + 0.44 * Math.sin(1.48 + f2 * 2) + 0.129 * Math.sin(5.82 + f2) * t2 + 55e-5 * Math.sin(4.21 + f2) * t2 * t2;
        },
        saLon: function(t2, n) {
          return this.eLon(t2, n) + this.nutationLon2(t2) + this.gxcSunLon(t2) + Math.PI;
        },
        dtExt: function(y, jsd) {
          var dy = (y - 1820) / 100;
          return -20 + jsd * dy * dy;
        },
        dtCalc: function(y) {
          var size2 = this.DT_AT.length;
          var y0 = this.DT_AT[size2 - 2];
          var t0 = this.DT_AT[size2 - 1];
          if (y >= y0) {
            var jsd = 31;
            if (y > y0 + 100) {
              return this.dtExt(y, jsd);
            }
            return this.dtExt(y, jsd) - (this.dtExt(y0, jsd) - t0) * (y0 + 100 - y) / 100;
          }
          var i;
          for (i = 0; i < size2; i += 5) {
            if (y < this.DT_AT[i + 5]) {
              break;
            }
          }
          var t1 = (y - this.DT_AT[i]) / (this.DT_AT[i + 5] - this.DT_AT[i]) * 10;
          var t2 = t1 * t1;
          var t3 = t2 * t1;
          return this.DT_AT[i + 1] + this.DT_AT[i + 2] * t1 + this.DT_AT[i + 3] * t2 + this.DT_AT[i + 4] * t3;
        },
        dtT: function(t2) {
          return this.dtCalc(t2 / 365.2425 + 2e3) / this.SECOND_PER_DAY;
        },
        mv: function(t2) {
          var v = 8399.71 - 914 * Math.sin(0.7848 + 8328.691425 * t2 + 1523e-7 * t2 * t2);
          v -= 179 * Math.sin(2.543 + 15542.7543 * t2) + 160 * Math.sin(0.1874 + 7214.0629 * t2) + 62 * Math.sin(3.14 + 16657.3828 * t2) + 34 * Math.sin(4.827 + 16866.9323 * t2) + 22 * Math.sin(4.9 + 23871.4457 * t2) + 12 * Math.sin(2.59 + 14914.4523 * t2) + 7 * Math.sin(0.23 + 6585.7609 * t2) + 5 * Math.sin(0.9 + 25195.624 * t2) + 5 * Math.sin(2.32 - 7700.3895 * t2) + 5 * Math.sin(3.88 + 8956.9934 * t2) + 5 * Math.sin(0.49 + 7771.3771 * t2);
          return v;
        },
        saLonT: function(w) {
          var t2;
          var v = 628.3319653318;
          t2 = (w - 1.75347 - Math.PI) / v;
          v = this.ev(t2);
          t2 += (w - this.saLon(t2, 10)) / v;
          v = this.ev(t2);
          t2 += (w - this.saLon(t2, -1)) / v;
          return t2;
        },
        msaLon: function(t2, mn, sn) {
          return this.mLon(t2, mn) + -34e-7 - (this.eLon(t2, sn) + this.gxcSunLon(t2) + Math.PI);
        },
        msaLonT: function(w) {
          var t2;
          var v = 7771.37714500204;
          t2 = (w + 1.08472) / v;
          t2 += (w - this.msaLon(t2, 3, 3)) / v;
          v = this.mv(t2) - this.ev(t2);
          t2 += (w - this.msaLon(t2, 20, 10)) / v;
          t2 += (w - this.msaLon(t2, -1, 60)) / v;
          return t2;
        },
        saLonT2: function(w) {
          var v = 628.3319653318;
          var t2 = (w - 1.75347 - Math.PI) / v;
          t2 -= (5297e-9 * t2 * t2 + 0.0334166 * Math.cos(4.669257 + 628.307585 * t2) + 2061e-7 * Math.cos(2.67823 + 628.307585 * t2) * t2) / v;
          t2 += (w - ShouXingUtil2.eLon(t2, 8) - Math.PI + (20.5 + 17.2 * Math.sin(2.1824 - 33.75705 * t2)) / this.SECOND_PER_RAD) / v;
          return t2;
        },
        msaLonT2: function(w) {
          var t2;
          var l;
          var v = 7771.37714500204;
          t2 = (w + 1.08472) / v;
          var t22 = t2 * t2;
          t2 -= (-3309e-8 * t22 + 0.10976 * Math.cos(0.784758 + 8328.6914246 * t2 + 152292e-9 * t22) + 0.02224 * Math.cos(0.1874 + 7214.0628654 * t2 - 21848e-8 * t22) - 0.03342 * Math.cos(4.669257 + 628.307585 * t2)) / v;
          t22 = t2 * t2;
          l = this.mLon(t2, 20) - (4.8950632 + 628.3319653318 * t2 + 5297e-9 * t22 + 0.0334166 * Math.cos(4.669257 + 628.307585 * t2) + 2061e-7 * Math.cos(2.67823 + 628.307585 * t2) * t2 + 349e-6 * Math.cos(4.6261 + 1256.61517 * t2) - 20.5 / this.SECOND_PER_RAD);
          v = 7771.38 - 914 * Math.sin(0.7848 + 8328.691425 * t2 + 1523e-7 * t22) - 179 * Math.sin(2.543 + 15542.7543 * t2) - 160 * Math.sin(0.1874 + 7214.0629 * t2);
          t2 += (w - l) / v;
          return t2;
        },
        qiHigh: function(w) {
          var t2 = this.saLonT2(w) * 36525;
          t2 = t2 - this.dtT(t2) + this.ONE_THIRD;
          var v = (t2 + 0.5) % 1 * this.SECOND_PER_DAY;
          if (v < 1200 || v > this.SECOND_PER_DAY - 1200) {
            t2 = this.saLonT(w) * 36525 - this.dtT(t2) + this.ONE_THIRD;
          }
          return t2;
        },
        shuoHigh: function(w) {
          var t2 = this.msaLonT2(w) * 36525;
          t2 = t2 - this.dtT(t2) + this.ONE_THIRD;
          var v = (t2 + 0.5) % 1 * this.SECOND_PER_DAY;
          if (v < 1800 || v > this.SECOND_PER_DAY - 1800) {
            t2 = this.msaLonT(w) * 36525 - this.dtT(t2) + this.ONE_THIRD;
          }
          return t2;
        },
        qiLow: function(w) {
          var v = 628.3319653318;
          var t2 = (w - 4.895062166) / v;
          t2 -= (53 * t2 * t2 + 334116 * Math.cos(4.67 + 628.307585 * t2) + 2061 * Math.cos(2.678 + 628.3076 * t2) * t2) / v / 1e7;
          var n = 4895062166e-2 + 6283319653318e-3 * t2 + 53 * t2 * t2 + 334166 * Math.cos(4.669257 + 628.307585 * t2) + 3489 * Math.cos(4.6261 + 1256.61517 * t2) + 2060.6 * Math.cos(2.67823 + 628.307585 * t2) * t2 - 994 - 834 * Math.sin(2.1824 - 33.75705 * t2);
          t2 -= (n / 1e7 - w) / 628.332 + (32 * (t2 + 1.8) * (t2 + 1.8) - 20) / this.SECOND_PER_DAY / 36525;
          return t2 * 36525 + this.ONE_THIRD;
        },
        shuoLow: function(w) {
          var v = 7771.37714500204;
          var t2 = (w + 1.08472) / v;
          t2 -= (-331e-7 * t2 * t2 + 0.10976 * Math.cos(0.785 + 8328.6914 * t2) + 0.02224 * Math.cos(0.187 + 7214.0629 * t2) - 0.03342 * Math.cos(4.669 + 628.3076 * t2)) / v + (32 * (t2 + 1.8) * (t2 + 1.8) - 20) / this.SECOND_PER_DAY / 36525;
          return t2 * 36525 + this.ONE_THIRD;
        },
        calcShuo: function(jd2) {
          var size2 = this.SHUO_KB.length;
          var d = 0;
          var pc = 14;
          var i;
          jd2 += Solar2.J2000;
          var f1 = this.SHUO_KB[0] - pc, f2 = this.SHUO_KB[size2 - 1] - pc, f3 = 2436935;
          if (jd2 < f1 || jd2 >= f3) {
            d = Math.floor(this.shuoHigh(Math.floor((jd2 + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5);
          } else if (jd2 >= f1 && jd2 < f2) {
            for (i = 0; i < size2; i += 2) {
              if (jd2 + pc < this.SHUO_KB[i + 2]) {
                break;
              }
            }
            d = this.SHUO_KB[i] + this.SHUO_KB[i + 1] * Math.floor((jd2 + pc - this.SHUO_KB[i]) / this.SHUO_KB[i + 1]);
            d = Math.floor(d + 0.5);
            if (d === 1683460) {
              d++;
            }
            d -= Solar2.J2000;
          } else if (jd2 >= f2 && jd2 < f3) {
            d = Math.floor(this.shuoLow(Math.floor((jd2 + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5);
            var from2 = Math.floor((jd2 - f2) / 29.5306);
            var n = this.SB.substring(from2, from2 + 1);
            if ("1" === n) {
              d += 1;
            } else if ("2" === n) {
              d -= 1;
            }
          }
          return d;
        },
        calcQi: function(jd2) {
          var size2 = this.QI_KB.length;
          var d = 0;
          var pc = 7, i;
          jd2 += Solar2.J2000;
          var f1 = this.QI_KB[0] - pc, f2 = this.QI_KB[size2 - 1] - pc, f3 = 2436935;
          if (jd2 < f1 || jd2 >= f3) {
            d = Math.floor(this.qiHigh(Math.floor((jd2 + pc - 2451259) / 365.2422 * 24) * Math.PI / 12) + 0.5);
          } else if (jd2 >= f1 && jd2 < f2) {
            for (i = 0; i < size2; i += 2) {
              if (jd2 + pc < this.QI_KB[i + 2]) {
                break;
              }
            }
            d = this.QI_KB[i] + this.QI_KB[i + 1] * Math.floor((jd2 + pc - this.QI_KB[i]) / this.QI_KB[i + 1]);
            d = Math.floor(d + 0.5);
            if (d === 1683460) {
              d++;
            }
            d -= Solar2.J2000;
          } else if (jd2 >= f2 && jd2 < f3) {
            d = Math.floor(this.qiLow(Math.floor((jd2 + pc - 2451259) / 365.2422 * 24) * Math.PI / 12) + 0.5);
            var from2 = Math.floor((jd2 - f2) / 365.2422 * 24);
            var n = this.QB.substring(from2, from2 + 1);
            if ("1" === n) {
              d += 1;
            } else if ("2" === n) {
              d -= 1;
            }
          }
          return d;
        },
        qiAccurate: function(w) {
          var t2 = this.saLonT(w) * 36525;
          return t2 - this.dtT(t2) + this.ONE_THIRD;
        },
        qiAccurate2: function(jd2) {
          var d = Math.PI / 12;
          var w = Math.floor((jd2 + 293) / 365.2422 * 24) * d;
          var a = this.qiAccurate(w);
          if (a - jd2 > 5) {
            return this.qiAccurate(w - d);
          }
          if (a - jd2 < -5) {
            return this.qiAccurate(w + d);
          }
          return a;
        }
      };
    }();
    var SolarUtil2 = /* @__PURE__ */ function() {
      return {
        WEEK: ["{w.sun}", "{w.mon}", "{w.tues}", "{w.wed}", "{w.thur}", "{w.fri}", "{w.sat}"],
        DAYS_OF_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        XINGZUO: ["{xz.aries}", "{xz.taurus}", "{xz.gemini}", "{xz.cancer}", "{xz.leo}", "{xz.virgo}", "{xz.libra}", "{xz.scorpio}", "{xz.sagittarius}", "{xz.capricornus}", "{xz.aquarius}", "{xz.pisces}"],
        FESTIVAL: {
          "1-1": "{jr.yuanDan}",
          "2-14": "{jr.qingRen}",
          "3-8": "{jr.fuNv}",
          "3-12": "{jr.zhiShu}",
          "3-15": "{jr.xiaoFei}",
          "4-1": "{jr.yuRen}",
          "5-1": "{jr.wuYi}",
          "5-4": "{jr.qingNian}",
          "6-1": "{jr.erTong}",
          "7-1": "{jr.jianDang}",
          "8-1": "{jr.jianJun}",
          "9-10": "{jr.jiaoShi}",
          "10-1": "{jr.guoQing}",
          "10-31": "{jr.wanShengYe}",
          "11-1": "{jr.wanSheng}",
          "12-24": "{jr.pingAn}",
          "12-25": "{jr.shengDan}"
        },
        OTHER_FESTIVAL: {
          "1-8": ["周恩来逝世纪念日"],
          "1-10": ["中国人民警察节"],
          "1-14": ["日记情人节"],
          "1-21": ["列宁逝世纪念日"],
          "1-26": ["国际海关日"],
          "1-27": ["国际大屠杀纪念日"],
          "2-2": ["世界湿地日"],
          "2-4": ["世界抗癌日"],
          "2-7": ["京汉铁路罢工纪念日"],
          "2-10": ["国际气象节"],
          "2-19": ["邓小平逝世纪念日"],
          "2-20": ["世界社会公正日"],
          "2-21": ["国际母语日"],
          "2-24": ["第三世界青年日"],
          "3-1": ["国际海豹日"],
          "3-3": ["世界野生动植物日", "全国爱耳日"],
          "3-5": ["周恩来诞辰纪念日", "中国青年志愿者服务日"],
          "3-6": ["世界青光眼日"],
          "3-7": ["女生节"],
          "3-12": ["孙中山逝世纪念日"],
          "3-14": ["马克思逝世纪念日", "白色情人节"],
          "3-17": ["国际航海日"],
          "3-18": ["全国科技人才活动日", "全国爱肝日"],
          "3-20": ["国际幸福日"],
          "3-21": ["世界森林日", "世界睡眠日", "国际消除种族歧视日"],
          "3-22": ["世界水日"],
          "3-23": ["世界气象日"],
          "3-24": ["世界防治结核病日"],
          "3-29": ["中国黄花岗七十二烈士殉难纪念日"],
          "4-2": ["国际儿童图书日", "世界自闭症日"],
          "4-4": ["国际地雷行动日"],
          "4-7": ["世界卫生日"],
          "4-8": ["国际珍稀动物保护日"],
          "4-12": ["世界航天日"],
          "4-14": ["黑色情人节"],
          "4-15": ["全民国家安全教育日"],
          "4-22": ["世界地球日", "列宁诞辰纪念日"],
          "4-23": ["世界读书日"],
          "4-24": ["中国航天日"],
          "4-25": ["儿童预防接种宣传日"],
          "4-26": ["世界知识产权日", "全国疟疾日"],
          "4-28": ["世界安全生产与健康日"],
          "4-30": ["全国交通安全反思日"],
          "5-2": ["世界金枪鱼日"],
          "5-3": ["世界新闻自由日"],
          "5-5": ["马克思诞辰纪念日"],
          "5-8": ["世界红十字日"],
          "5-11": ["世界肥胖日"],
          "5-12": ["全国防灾减灾日", "护士节"],
          "5-14": ["玫瑰情人节"],
          "5-15": ["国际家庭日"],
          "5-19": ["中国旅游日"],
          "5-20": ["网络情人节"],
          "5-22": ["国际生物多样性日"],
          "5-25": ["525心理健康节"],
          "5-27": ["上海解放日"],
          "5-29": ["国际维和人员日"],
          "5-30": ["中国五卅运动纪念日"],
          "5-31": ["世界无烟日"],
          "6-3": ["世界自行车日"],
          "6-5": ["世界环境日"],
          "6-6": ["全国爱眼日"],
          "6-8": ["世界海洋日"],
          "6-11": ["中国人口日"],
          "6-14": ["世界献血日", "亲亲情人节"],
          "6-17": ["世界防治荒漠化与干旱日"],
          "6-20": ["世界难民日"],
          "6-21": ["国际瑜伽日"],
          "6-25": ["全国土地日"],
          "6-26": ["国际禁毒日", "联合国宪章日"],
          "7-1": ["香港回归纪念日"],
          "7-6": ["国际接吻日", "朱德逝世纪念日"],
          "7-7": ["七七事变纪念日"],
          "7-11": ["世界人口日", "中国航海日"],
          "7-14": ["银色情人节"],
          "7-18": ["曼德拉国际日"],
          "7-30": ["国际友谊日"],
          "8-3": ["男人节"],
          "8-5": ["恩格斯逝世纪念日"],
          "8-6": ["国际电影节"],
          "8-8": ["全民健身日"],
          "8-9": ["国际土著人日"],
          "8-12": ["国际青年节"],
          "8-14": ["绿色情人节"],
          "8-19": ["世界人道主义日", "中国医师节"],
          "8-22": ["邓小平诞辰纪念日"],
          "8-29": ["全国测绘法宣传日"],
          "9-3": ["中国抗日战争胜利纪念日"],
          "9-5": ["中华慈善日"],
          "9-8": ["世界扫盲日"],
          "9-9": ["毛泽东逝世纪念日", "全国拒绝酒驾日"],
          "9-14": ["世界清洁地球日", "相片情人节"],
          "9-15": ["国际民主日"],
          "9-16": ["国际臭氧层保护日"],
          "9-17": ["世界骑行日"],
          "9-18": ["九一八事变纪念日"],
          "9-20": ["全国爱牙日"],
          "9-21": ["国际和平日"],
          "9-27": ["世界旅游日"],
          "9-30": ["中国烈士纪念日"],
          "10-1": ["国际老年人日"],
          "10-2": ["国际非暴力日"],
          "10-4": ["世界动物日"],
          "10-11": ["国际女童日"],
          "10-10": ["辛亥革命纪念日"],
          "10-13": ["国际减轻自然灾害日", "中国少年先锋队诞辰日"],
          "10-14": ["葡萄酒情人节"],
          "10-16": ["世界粮食日"],
          "10-17": ["全国扶贫日"],
          "10-20": ["世界统计日"],
          "10-24": ["世界发展信息日", "程序员节"],
          "10-25": ["抗美援朝纪念日"],
          "11-5": ["世界海啸日"],
          "11-8": ["记者节"],
          "11-9": ["全国消防日"],
          "11-11": ["光棍节"],
          "11-12": ["孙中山诞辰纪念日"],
          "11-14": ["电影情人节"],
          "11-16": ["国际宽容日"],
          "11-17": ["国际大学生节"],
          "11-19": ["世界厕所日"],
          "11-28": ["恩格斯诞辰纪念日"],
          "11-29": ["国际声援巴勒斯坦人民日"],
          "12-1": ["世界艾滋病日"],
          "12-2": ["全国交通安全日"],
          "12-3": ["世界残疾人日"],
          "12-4": ["全国法制宣传日"],
          "12-5": ["世界弱能人士日", "国际志愿人员日"],
          "12-7": ["国际民航日"],
          "12-9": ["世界足球日", "国际反腐败日"],
          "12-10": ["世界人权日"],
          "12-11": ["国际山岳日"],
          "12-12": ["西安事变纪念日"],
          "12-13": ["国家公祭日"],
          "12-14": ["拥抱情人节"],
          "12-18": ["国际移徙者日"],
          "12-26": ["毛泽东诞辰纪念日"]
        },
        WEEK_FESTIVAL: { "3-0-1": "全国中小学生安全教育日", "5-2-0": "母亲节", "5-3-0": "全国助残日", "6-3-0": "父亲节", "9-3-6": "全民国防教育日", "10-1-1": "世界住房日", "11-4-4": "感恩节" },
        isLeapYear: function(year) {
          if (year < 1600) {
            return year % 4 === 0;
          }
          return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },
        getDaysOfMonth: function(year, month) {
          var oy = year;
          var om = month;
          year *= 1;
          if (isNaN(year)) {
            throw new Error("wrong solar year " + oy);
          }
          month *= 1;
          if (isNaN(month)) {
            throw new Error("wrong solar month " + om);
          }
          if (1582 === year && 10 === month) {
            return 21;
          }
          var m = month - 1;
          var d = this.DAYS_OF_MONTH[m];
          if (m === 1 && this.isLeapYear(year)) {
            d++;
          }
          return d;
        },
        getDaysOfYear: function(year) {
          var oy = year;
          year *= 1;
          if (isNaN(year)) {
            throw new Error("wrong solar year " + oy);
          }
          if (1582 === year) {
            return 355;
          }
          return this.isLeapYear(year) ? 366 : 365;
        },
        getDaysInYear: function(year, month, day) {
          var oy = year;
          var om = month;
          var od = day;
          year *= 1;
          if (isNaN(year)) {
            throw new Error("wrong solar year " + oy);
          }
          month *= 1;
          if (isNaN(month)) {
            throw new Error("wrong solar month " + om);
          }
          day *= 1;
          if (isNaN(day)) {
            throw new Error("wrong solar day " + od);
          }
          var days2 = 0;
          for (var i = 1; i < month; i++) {
            days2 += this.getDaysOfMonth(year, i);
          }
          var d = day;
          if (1582 === year && 10 === month) {
            if (day >= 15) {
              d -= 10;
            } else if (day > 4) {
              throw new Error("wrong solar year " + year + " month " + month + " day " + day);
            }
          }
          days2 += d;
          return days2;
        },
        getDaysBetween: function(ay, am, ad, by, bm, bd) {
          var oay = ay;
          var oam = am;
          var oad = ad;
          var oby = by;
          var obm = bm;
          var obd = bd;
          ay *= 1;
          if (isNaN(ay)) {
            throw new Error("wrong solar year " + oay);
          }
          am *= 1;
          if (isNaN(am)) {
            throw new Error("wrong solar month " + oam);
          }
          ad *= 1;
          if (isNaN(ad)) {
            throw new Error("wrong solar day " + oad);
          }
          by *= 1;
          if (isNaN(by)) {
            throw new Error("wrong solar year " + oby);
          }
          bm *= 1;
          if (isNaN(bm)) {
            throw new Error("wrong solar month " + obm);
          }
          bd *= 1;
          if (isNaN(bd)) {
            throw new Error("wrong solar day " + obd);
          }
          var n;
          var days2;
          var i;
          if (ay === by) {
            n = this.getDaysInYear(by, bm, bd) - this.getDaysInYear(ay, am, ad);
          } else if (ay > by) {
            days2 = this.getDaysOfYear(by) - this.getDaysInYear(by, bm, bd);
            for (i = by + 1; i < ay; i++) {
              days2 += this.getDaysOfYear(i);
            }
            days2 += this.getDaysInYear(ay, am, ad);
            n = -days2;
          } else {
            days2 = this.getDaysOfYear(ay) - this.getDaysInYear(ay, am, ad);
            for (i = ay + 1; i < by; i++) {
              days2 += this.getDaysOfYear(i);
            }
            days2 += this.getDaysInYear(by, bm, bd);
            n = days2;
          }
          return n;
        },
        getWeeksOfMonth: function(year, month, start) {
          return Math.ceil((this.getDaysOfMonth(year, month) + Solar2.fromYmd(year, month, 1).getWeek() - start) / 7);
        }
      };
    }();
    var LunarUtil2 = /* @__PURE__ */ function() {
      return {
        BASE_MONTH_ZHI_INDEX: 2,
        JIE_QI: ["{jq.dongZhi}", "{jq.xiaoHan}", "{jq.daHan}", "{jq.liChun}", "{jq.yuShui}", "{jq.jingZhe}", "{jq.chunFen}", "{jq.qingMing}", "{jq.guYu}", "{jq.liXia}", "{jq.xiaoMan}", "{jq.mangZhong}", "{jq.xiaZhi}", "{jq.xiaoShu}", "{jq.daShu}", "{jq.liQiu}", "{jq.chuShu}", "{jq.baiLu}", "{jq.qiuFen}", "{jq.hanLu}", "{jq.shuangJiang}", "{jq.liDong}", "{jq.xiaoXue}", "{jq.daXue}"],
        JIE_QI_IN_USE: ["DA_XUE", "{jq.dongZhi}", "{jq.xiaoHan}", "{jq.daHan}", "{jq.liChun}", "{jq.yuShui}", "{jq.jingZhe}", "{jq.chunFen}", "{jq.qingMing}", "{jq.guYu}", "{jq.liXia}", "{jq.xiaoMan}", "{jq.mangZhong}", "{jq.xiaZhi}", "{jq.xiaoShu}", "{jq.daShu}", "{jq.liQiu}", "{jq.chuShu}", "{jq.baiLu}", "{jq.qiuFen}", "{jq.hanLu}", "{jq.shuangJiang}", "{jq.liDong}", "{jq.xiaoXue}", "{jq.daXue}", "DONG_ZHI", "XIAO_HAN", "DA_HAN", "LI_CHUN", "YU_SHUI", "JING_ZHE"],
        CHANG_SHENG_OFFSET: {
          "{tg.jia}": 1,
          "{tg.bing}": 10,
          "{tg.wu}": 10,
          "{tg.geng}": 7,
          "{tg.ren}": 4,
          "{tg.yi}": 6,
          "{tg.ding}": 9,
          "{tg.ji}": 9,
          "{tg.xin}": 0,
          "{tg.gui}": 3
        },
        MONTH_ZHI: ["", "{dz.yin}", "{dz.mao}", "{dz.chen}", "{dz.si}", "{dz.wu}", "{dz.wei}", "{dz.shen}", "{dz.you}", "{dz.xu}", "{dz.hai}", "{dz.zi}", "{dz.chou}"],
        CHANG_SHENG: ["{ds.changSheng}", "{ds.muYu}", "{ds.guanDai}", "{ds.linGuan}", "{ds.diWang}", "{ds.shuai}", "{ds.bing}", "{ds.si}", "{ds.mu}", "{ds.jue}", "{ds.tai}", "{ds.yang}"],
        XUN: [
          "{jz.jiaZi}",
          "{jz.jiaXu}",
          "{jz.jiaShen}",
          "{jz.jiaWu}",
          "{jz.jiaChen}",
          "{jz.jiaYin}"
        ],
        XUN_KONG: [
          "{dz.xu}{dz.hai}",
          "{dz.shen}{dz.you}",
          "{dz.wu}{dz.wei}",
          "{dz.chen}{dz.si}",
          "{dz.yin}{dz.mao}",
          "{dz.zi}{dz.chou}"
        ],
        LIU_YAO: [
          "{ly.xianSheng}",
          "{ly.youYin}",
          "{ly.xianFu}",
          "{ly.foMie}",
          "{ly.daAn}",
          "{ly.chiKou}"
        ],
        HOU: ["{h.first}", "{h.second}", "{h.third}"],
        WU_HOU: [
          "{h.qiuYinJie}",
          "{h.miJiao}",
          "{h.shuiQuan}",
          "{h.yanBei}",
          "{h.queShi}",
          "{h.zhiShi}",
          "{h.jiShi}",
          "{h.zhengNiao}",
          "{h.shuiZe}",
          "{h.dongFeng}",
          "{h.zheChongShiZhen}",
          "{h.yuZhi}",
          "{h.taJi}",
          "{h.houYan}",
          "{h.caoMuMengDong}",
          "{h.taoShi}",
          "{h.cangGeng}",
          "{h.yingHua}",
          "{h.xuanNiaoZhi}",
          "{h.leiNai}",
          "{h.shiDian}",
          "{h.tongShi}",
          "{h.tianShu}",
          "{h.hongShi}",
          "{h.pingShi}",
          "{h.mingJiu}",
          "{h.daiSheng}",
          "{h.louGuo}",
          "{h.qiuYinChu}",
          "{h.wangGua}",
          "{h.kuCai}",
          "{h.miCao}",
          "{h.maiQiu}",
          "{h.tangLang}",
          "{h.juShi}",
          "{h.fanShe}",
          "{h.luJia}",
          "{h.tiaoShi}",
          "{h.banXia}",
          "{h.wenFeng}",
          "{h.xiShuai}",
          "{h.yingShi}",
          "{h.fuCao}",
          "{h.tuRun}",
          "{h.daYu}",
          "{h.liangFeng}",
          "{h.baiLu}",
          "{h.hanChan}",
          "{h.yingNai}",
          "{h.tianDi}",
          "{h.heNai}",
          "{h.hongYanLai}",
          "{h.xuanNiaoGui}",
          "{h.qunNiao}",
          "{h.leiShi}",
          "{h.zheChongPiHu}",
          "{h.shuiShiHe}",
          "{h.hongYanLaiBin}",
          "{h.queRu}",
          "{h.juYou}",
          "{h.caiNai}",
          "{h.caoMuHuangLuo}",
          "{h.zheChongXianFu}",
          "{h.shuiShiBing}",
          "{h.diShi}",
          "{h.zhiRu}",
          "{h.hongCang}",
          "{h.tianQi}",
          "{h.biSe}",
          "{h.heDan}",
          "{h.huShi}",
          "{h.liTing}"
        ],
        GAN: ["", "{tg.jia}", "{tg.yi}", "{tg.bing}", "{tg.ding}", "{tg.wu}", "{tg.ji}", "{tg.geng}", "{tg.xin}", "{tg.ren}", "{tg.gui}"],
        POSITION_XI: ["", "{bg.gen}", "{bg.qian}", "{bg.kun}", "{bg.li}", "{bg.xun}", "{bg.gen}", "{bg.qian}", "{bg.kun}", "{bg.li}", "{bg.xun}"],
        POSITION_YANG_GUI: ["", "{bg.kun}", "{bg.kun}", "{bg.dui}", "{bg.qian}", "{bg.gen}", "{bg.kan}", "{bg.li}", "{bg.gen}", "{bg.zhen}", "{bg.xun}"],
        POSITION_YIN_GUI: ["", "{bg.gen}", "{bg.kan}", "{bg.qian}", "{bg.dui}", "{bg.kun}", "{bg.kun}", "{bg.gen}", "{bg.li}", "{bg.xun}", "{bg.zhen}"],
        POSITION_FU: ["", "{bg.xun}", "{bg.xun}", "{bg.zhen}", "{bg.zhen}", "{bg.kan}", "{bg.li}", "{bg.kun}", "{bg.kun}", "{bg.qian}", "{bg.dui}"],
        POSITION_FU_2: ["", "{bg.kan}", "{bg.kun}", "{bg.qian}", "{bg.xun}", "{bg.gen}", "{bg.kan}", "{bg.kun}", "{bg.qian}", "{bg.xun}", "{bg.gen}"],
        POSITION_CAI: ["", "{bg.gen}", "{bg.gen}", "{bg.kun}", "{bg.kun}", "{bg.kan}", "{bg.kan}", "{bg.zhen}", "{bg.zhen}", "{bg.li}", "{bg.li}"],
        POSITION_TAI_SUI_YEAR: ["{bg.kan}", "{bg.gen}", "{bg.gen}", "{bg.zhen}", "{bg.xun}", "{bg.xun}", "{bg.li}", "{bg.kun}", "{bg.kun}", "{bg.dui}", "{bg.kan}", "{bg.kan}"],
        POSITION_GAN: ["{bg.zhen}", "{bg.zhen}", "{bg.li}", "{bg.li}", "{ps.center}", "{ps.center}", "{bg.dui}", "{bg.dui}", "{bg.kan}", "{bg.kan}"],
        POSITION_ZHI: ["{bg.kan}", "{ps.center}", "{bg.zhen}", "{bg.zhen}", "{ps.center}", "{bg.li}", "{bg.li}", "{ps.center}", "{bg.dui}", "{bg.dui}", "{ps.center}", "{bg.kan}"],
        POSITION_TAI_DAY: [
          "{ts.zhan}{ts.men}{ts.dui} {ps.wai}{ps.dongNan}",
          "{ts.dui}{ts.mo}{ts.ce} {ps.wai}{ps.dongNan}",
          "{ts.chu}{ts.zao}{ts.lu} {ps.wai}{ps.zhengNan}",
          "{ts.cangKu}{ts.men} {ps.wai}{ps.zhengNan}",
          "{ts.fang}{ts.chuang}{ts.xi} {ps.wai}{ps.zhengNan}",
          "{ts.zhan}{ts.men}{ts.chuang} {ps.wai}{ps.zhengNan}",
          "{ts.zhan}{ts.dui}{ts.mo} {ps.wai}{ps.zhengNan}",
          "{ts.chu}{ts.zao}{ts.ce} {ps.wai}{ps.xiNan}",
          "{ts.cangKu}{ts.lu} {ps.wai}{ps.xiNan}",
          "{ts.fang}{ts.chuang}{ts.men} {ps.wai}{ps.xiNan}",
          "{ts.zhan}{ts.men}{ts.xi} {ps.wai}{ps.xiNan}",
          "{ts.dui}{ts.mo}{ts.chuang} {ps.wai}{ps.xiNan}",
          "{ts.chu}{ts.zao}{ts.dui} {ps.wai}{ps.xiNan}",
          "{ts.cangKu}{ts.ce} {ps.wai}{ps.zhengXi}",
          "{ts.fang}{ts.chuang}{ts.lu} {ps.wai}{ps.zhengXi}",
          "{ts.zhan}{ts.daMen} {ps.wai}{ps.zhengXi}",
          "{ts.dui}{ts.mo}{ts.xi} {ps.wai}{ps.zhengXi}",
          "{ts.chu}{ts.zao}{ts.chuang} {ps.wai}{ps.zhengXi}",
          "{ts.cangKu}{ts.dui} {ps.wai}{ps.xiBei}",
          "{ts.fang}{ts.chuang}{ts.ce} {ps.wai}{ps.xiBei}",
          "{ts.zhan}{ts.men}{ts.lu} {ps.wai}{ps.xiBei}",
          "{ts.dui}{ts.mo}{ts.men} {ps.wai}{ps.xiBei}",
          "{ts.chu}{ts.zao}{ts.xi} {ps.wai}{ps.xiBei}",
          "{ts.cangKu}{ts.chuang} {ps.wai}{ps.xiBei}",
          "{ts.fang}{ts.chuang}{ts.dui} {ps.wai}{ps.zhengBei}",
          "{ts.zhan}{ts.men}{ts.ce} {ps.wai}{ps.zhengBei}",
          "{ts.dui}{ts.mo}{ts.lu} {ps.wai}{ps.zhengBei}",
          "{ts.chu}{ts.zao}{ts.men} {ps.wai}{ps.zhengBei}",
          "{ts.cangKu}{ts.xi} {ps.wai}{ps.zhengBei}",
          "{ts.zhan}{ts.fang}{ts.chuang} {ps.fangNei}{ps.bei}",
          "{ts.zhan}{ts.men}{ts.dui} {ps.fangNei}{ps.bei}",
          "{ts.dui}{ts.mo}{ts.ce} {ps.fangNei}{ps.bei}",
          "{ts.chu}{ts.zao}{ts.lu} {ps.fangNei}{ps.bei}",
          "{ts.cangKu}{ts.men} {ps.fangNei}{ps.bei}",
          "{ts.fang}{ts.chuang}{ts.xi} {ps.fangNei}{ps.center}",
          "{ts.zhan}{ts.men}{ts.chuang} {ps.fangNei}{ps.center}",
          "{ts.zhan}{ts.dui}{ts.mo} {ps.fangNei}{ps.nan}",
          "{ts.chu}{ts.zao}{ts.ce} {ps.fangNei}{ps.nan}",
          "{ts.cangKu}{ts.lu} {ps.fangNei}{ps.nan}",
          "{ts.fang}{ts.chuang}{ts.men} {ps.fangNei}{ps.xi}",
          "{ts.zhan}{ts.men}{ts.xi} {ps.fangNei}{ps.dong}",
          "{ts.dui}{ts.mo}{ts.chuang} {ps.fangNei}{ps.dong}",
          "{ts.chu}{ts.zao}{ts.dui} {ps.fangNei}{ps.dong}",
          "{ts.cangKu}{ts.ce} {ps.fangNei}{ps.dong}",
          "{ts.fang}{ts.chuang}{ts.lu} {ps.fangNei}{ps.center}",
          "{ts.zhan}{ts.daMen} {ps.wai}{ps.dongBei}",
          "{ts.dui}{ts.mo}{ts.xi} {ps.wai}{ps.dongBei}",
          "{ts.chu}{ts.zao}{ts.chuang} {ps.wai}{ps.dongBei}",
          "{ts.cangKu}{ts.dui} {ps.wai}{ps.dongBei}",
          "{ts.fang}{ts.chuang}{ts.ce} {ps.wai}{ps.dongBei}",
          "{ts.zhan}{ts.men}{ts.lu} {ps.wai}{ps.dongBei}",
          "{ts.dui}{ts.mo}{ts.men} {ps.wai}{ps.zhengDong}",
          "{ts.chu}{ts.zao}{ts.xi} {ps.wai}{ps.zhengDong}",
          "{ts.cangKu}{ts.chuang} {ps.wai}{ps.zhengDong}",
          "{ts.fang}{ts.chuang}{ts.dui} {ps.wai}{ps.zhengDong}",
          "{ts.zhan}{ts.men}{ts.ce} {ps.wai}{ps.zhengDong}",
          "{ts.dui}{ts.mo}{ts.lu} {ps.wai}{ps.dongNan}",
          "{ts.chu}{ts.zao}{ts.men} {ps.wai}{ps.dongNan}",
          "{ts.cangKu}{ts.xi} {ps.wai}{ps.dongNan}",
          "{ts.zhan}{ts.fang}{ts.chuang} {ps.wai}{ps.dongNan}"
        ],
        POSITION_TAI_MONTH: [
          "{ts.zhan}{ts.fang}{ts.chuang}",
          "{ts.zhan}{ts.hu}{ts.win}",
          "{ts.zhan}{ts.men}{ts.tang}",
          "{ts.zhan}{ts.chu}{ts.zao}",
          "{ts.zhan}{ts.fang}{ts.chuang}",
          "{ts.zhan}{ts.chuang}{ts.cang}",
          "{ts.zhan}{ts.dui}{ts.mo}",
          "{ts.zhan}{ts.ce}{ts.hu}",
          "{ts.zhan}{ts.men}{ts.fang}",
          "{ts.zhan}{ts.fang}{ts.chuang}",
          "{ts.zhan}{ts.zao}{ts.lu}",
          "{ts.zhan}{ts.fang}{ts.chuang}"
        ],
        ZHI: ["", "{dz.zi}", "{dz.chou}", "{dz.yin}", "{dz.mao}", "{dz.chen}", "{dz.si}", "{dz.wu}", "{dz.wei}", "{dz.shen}", "{dz.you}", "{dz.xu}", "{dz.hai}"],
        ZHI_XING: [
          "",
          "{zx.jian}",
          "{zx.chu}",
          "{zx.man}",
          "{zx.ping}",
          "{zx.ding}",
          "{zx.zhi}",
          "{zx.po}",
          "{zx.wei}",
          "{zx.cheng}",
          "{zx.shou}",
          "{zx.kai}",
          "{zx.bi}"
        ],
        JIA_ZI: [
          "{jz.jiaZi}",
          "{jz.yiChou}",
          "{jz.bingYin}",
          "{jz.dingMao}",
          "{jz.wuChen}",
          "{jz.jiSi}",
          "{jz.gengWu}",
          "{jz.xinWei}",
          "{jz.renShen}",
          "{jz.guiYou}",
          "{jz.jiaXu}",
          "{jz.yiHai}",
          "{jz.bingZi}",
          "{jz.dingChou}",
          "{jz.wuYin}",
          "{jz.jiMao}",
          "{jz.gengChen}",
          "{jz.xinSi}",
          "{jz.renWu}",
          "{jz.guiWei}",
          "{jz.jiaShen}",
          "{jz.yiYou}",
          "{jz.bingXu}",
          "{jz.dingHai}",
          "{jz.wuZi}",
          "{jz.jiChou}",
          "{jz.gengYin}",
          "{jz.xinMao}",
          "{jz.renChen}",
          "{jz.guiSi}",
          "{jz.jiaWu}",
          "{jz.yiWei}",
          "{jz.bingShen}",
          "{jz.dingYou}",
          "{jz.wuXu}",
          "{jz.jiHai}",
          "{jz.gengZi}",
          "{jz.xinChou}",
          "{jz.renYin}",
          "{jz.guiMao}",
          "{jz.jiaChen}",
          "{jz.yiSi}",
          "{jz.bingWu}",
          "{jz.dingWei}",
          "{jz.wuShen}",
          "{jz.jiYou}",
          "{jz.gengXu}",
          "{jz.xinHai}",
          "{jz.renZi}",
          "{jz.guiChou}",
          "{jz.jiaYin}",
          "{jz.yiMao}",
          "{jz.bingChen}",
          "{jz.dingSi}",
          "{jz.wuWu}",
          "{jz.jiWei}",
          "{jz.gengShen}",
          "{jz.xinYou}",
          "{jz.renXu}",
          "{jz.guiHai}"
        ],
        TIAN_SHEN: ["", "{sn.qingLong}", "{sn.mingTang}", "{sn.tianXing}", "{sn.zhuQue}", "{sn.jinKui}", "{sn.tianDe}", "{sn.baiHu}", "{sn.yuTang}", "{sn.tianLao}", "{sn.xuanWu}", "{sn.siMing}", "{sn.gouChen}"],
        ZHI_TIAN_SHEN_OFFSET: {
          "{dz.zi}": 4,
          "{dz.chou}": 2,
          "{dz.yin}": 0,
          "{dz.mao}": 10,
          "{dz.chen}": 8,
          "{dz.si}": 6,
          "{dz.wu}": 4,
          "{dz.wei}": 2,
          "{dz.shen}": 0,
          "{dz.you}": 10,
          "{dz.xu}": 8,
          "{dz.hai}": 6
        },
        TIAN_SHEN_TYPE: {
          "{sn.qingLong}": "{s.huangDao}",
          "{sn.mingTang}": "{s.huangDao}",
          "{sn.jinKui}": "{s.huangDao}",
          "{sn.tianDe}": "{s.huangDao}",
          "{sn.yuTang}": "{s.huangDao}",
          "{sn.siMing}": "{s.huangDao}",
          "{sn.tianXing}": "{s.heiDao}",
          "{sn.zhuQue}": "{s.heiDao}",
          "{sn.baiHu}": "{s.heiDao}",
          "{sn.tianLao}": "{s.heiDao}",
          "{sn.xuanWu}": "{s.heiDao}",
          "{sn.gouChen}": "{s.heiDao}"
        },
        TIAN_SHEN_TYPE_LUCK: {
          "{s.huangDao}": "{s.goodLuck}",
          "{s.heiDao}": "{s.badLuck}"
        },
        PENGZU_GAN: ["", "{tg.jia}不开仓财物耗散", "{tg.yi}不栽植千株不长", "{tg.bing}不修灶必见灾殃", "{tg.ding}不剃头头必生疮", "{tg.wu}不受田田主不祥", "{tg.ji}不破券二比并亡", "{tg.geng}不经络织机虚张", "{tg.xin}不合酱主人不尝", "{tg.ren}不泱水更难提防", "{tg.gui}不词讼理弱敌强"],
        PENGZU_ZHI: ["", "{dz.zi}不问卜自惹祸殃", "{dz.chou}不冠带主不还乡", "{dz.yin}不祭祀神鬼不尝", "{dz.mao}不穿井水泉不香", "{dz.chen}不哭泣必主重丧", "{dz.si}不远行财物伏藏", "{dz.wu}不苫盖屋主更张", "{dz.wei}不服药毒气入肠", "{dz.shen}不安床鬼祟入房", "{dz.you}不会客醉坐颠狂", "{dz.xu}不吃犬作怪上床", "{dz.hai}不嫁娶不利新郎"],
        NUMBER: ["{n.zero}", "{n.one}", "{n.two}", "{n.three}", "{n.four}", "{n.five}", "{n.six}", "{n.seven}", "{n.eight}", "{n.nine}", "{n.ten}", "{n.eleven}", "{n.twelve}"],
        MONTH: [
          "",
          "{m.one}",
          "{m.two}",
          "{m.three}",
          "{m.four}",
          "{m.five}",
          "{m.six}",
          "{m.seven}",
          "{m.eight}",
          "{m.nine}",
          "{m.ten}",
          "{m.eleven}",
          "{m.twelve}"
        ],
        SEASON: [
          "",
          "{od.first}{sz.chun}",
          "{od.second}{sz.chun}",
          "{od.third}{sz.chun}",
          "{od.first}{sz.xia}",
          "{od.second}{sz.xia}",
          "{od.third}{sz.xia}",
          "{od.first}{sz.qiu}",
          "{od.second}{sz.qiu}",
          "{od.third}{sz.qiu}",
          "{od.first}{sz.dong}",
          "{od.second}{sz.dong}",
          "{od.third}{sz.dong}"
        ],
        SHENGXIAO: ["", "{sx.rat}", "{sx.ox}", "{sx.tiger}", "{sx.rabbit}", "{sx.dragon}", "{sx.snake}", "{sx.horse}", "{sx.goat}", "{sx.monkey}", "{sx.rooster}", "{sx.dog}", "{sx.pig}"],
        DAY: [
          "",
          "{d.one}",
          "{d.two}",
          "{d.three}",
          "{d.four}",
          "{d.five}",
          "{d.six}",
          "{d.seven}",
          "{d.eight}",
          "{d.nine}",
          "{d.ten}",
          "{d.eleven}",
          "{d.twelve}",
          "{d.thirteen}",
          "{d.fourteen}",
          "{d.fifteen}",
          "{d.sixteen}",
          "{d.seventeen}",
          "{d.eighteen}",
          "{d.nighteen}",
          "{d.twenty}",
          "{d.twentyOne}",
          "{d.twentyTwo}",
          "{d.twentyThree}",
          "{d.twentyFour}",
          "{d.twentyFive}",
          "{d.twentySix}",
          "{d.twentySeven}",
          "{d.twentyEight}",
          "{d.twentyNine}",
          "{d.thirty}"
        ],
        YUE_XIANG: [
          "",
          "{yx.shuo}",
          "{yx.jiShuo}",
          "{yx.eMeiXin}",
          "{yx.eMeiXin}",
          "{yx.eMei}",
          "{yx.xi}",
          "{yx.shangXian}",
          "{yx.shangXian}",
          "{yx.jiuYe}",
          "{yx.night}",
          "{yx.night}",
          "{yx.night}",
          "{yx.jianYingTu}",
          "{yx.xiaoWang}",
          "{yx.wang}",
          "{yx.jiWang}",
          "{yx.liDai}",
          "{yx.juDai}",
          "{yx.qinDai}",
          "{yx.gengDai}",
          "{yx.jianKuiTu}",
          "{yx.xiaXian}",
          "{yx.xiaXian}",
          "{yx.youMing}",
          "{yx.youMing}",
          "{yx.eMeiCan}",
          "{yx.eMeiCan}",
          "{yx.can}",
          "{yx.xiao}",
          "{yx.hui}"
        ],
        XIU: {
          "{dz.shen}1": "{xx.bi}",
          "{dz.shen}2": "{xx.yi}",
          "{dz.shen}3": "{xx.ji}",
          "{dz.shen}4": "{xx.kui}",
          "{dz.shen}5": "{xx.gui}",
          "{dz.shen}6": "{xx.di}",
          "{dz.shen}0": "{xx.xu}",
          "{dz.zi}1": "{xx.bi}",
          "{dz.zi}2": "{xx.yi}",
          "{dz.zi}3": "{xx.ji}",
          "{dz.zi}4": "{xx.kui}",
          "{dz.zi}5": "{xx.gui}",
          "{dz.zi}6": "{xx.di}",
          "{dz.zi}0": "{xx.xu}",
          "{dz.chen}1": "{xx.bi}",
          "{dz.chen}2": "{xx.yi}",
          "{dz.chen}3": "{xx.ji}",
          "{dz.chen}4": "{xx.kui}",
          "{dz.chen}5": "{xx.gui}",
          "{dz.chen}6": "{xx.di}",
          "{dz.chen}0": "{xx.xu}",
          "{dz.si}1": "{xx.wei}",
          "{dz.si}2": "{xx.zi}",
          "{dz.si}3": "{xx.zhen}",
          "{dz.si}4": "{xx.dou}",
          "{dz.si}5": "{xx.lou}",
          "{dz.si}6": "{xx.liu}",
          "{dz.si}0": "{xx.fang}",
          "{dz.you}1": "{xx.wei}",
          "{dz.you}2": "{xx.zi}",
          "{dz.you}3": "{xx.zhen}",
          "{dz.you}4": "{xx.dou}",
          "{dz.you}5": "{xx.lou}",
          "{dz.you}6": "{xx.liu}",
          "{dz.you}0": "{xx.fang}",
          "{dz.chou}1": "{xx.wei}",
          "{dz.chou}2": "{xx.zi}",
          "{dz.chou}3": "{xx.zhen}",
          "{dz.chou}4": "{xx.dou}",
          "{dz.chou}5": "{xx.lou}",
          "{dz.chou}6": "{xx.liu}",
          "{dz.chou}0": "{xx.fang}",
          "{dz.yin}1": "{xx.xin}",
          "{dz.yin}2": "{xx.shi}",
          "{dz.yin}3": "{xx.can}",
          "{dz.yin}4": "{xx.jiao}",
          "{dz.yin}5": "{xx.niu}",
          "{dz.yin}6": "{xx.vei}",
          "{dz.yin}0": "{xx.xing}",
          "{dz.wu}1": "{xx.xin}",
          "{dz.wu}2": "{xx.shi}",
          "{dz.wu}3": "{xx.can}",
          "{dz.wu}4": "{xx.jiao}",
          "{dz.wu}5": "{xx.niu}",
          "{dz.wu}6": "{xx.vei}",
          "{dz.wu}0": "{xx.xing}",
          "{dz.xu}1": "{xx.xin}",
          "{dz.xu}2": "{xx.shi}",
          "{dz.xu}3": "{xx.can}",
          "{dz.xu}4": "{xx.jiao}",
          "{dz.xu}5": "{xx.niu}",
          "{dz.xu}6": "{xx.vei}",
          "{dz.xu}0": "{xx.xing}",
          "{dz.hai}1": "{xx.zhang}",
          "{dz.hai}2": "{xx.tail}",
          "{dz.hai}3": "{xx.qiang}",
          "{dz.hai}4": "{xx.jing}",
          "{dz.hai}5": "{xx.kang}",
          "{dz.hai}6": "{xx.nv}",
          "{dz.hai}0": "{xx.mao}",
          "{dz.mao}1": "{xx.zhang}",
          "{dz.mao}2": "{xx.tail}",
          "{dz.mao}3": "{xx.qiang}",
          "{dz.mao}4": "{xx.jing}",
          "{dz.mao}5": "{xx.kang}",
          "{dz.mao}6": "{xx.nv}",
          "{dz.mao}0": "{xx.mao}",
          "{dz.wei}1": "{xx.zhang}",
          "{dz.wei}2": "{xx.tail}",
          "{dz.wei}3": "{xx.qiang}",
          "{dz.wei}4": "{xx.jing}",
          "{dz.wei}5": "{xx.kang}",
          "{dz.wei}6": "{xx.nv}",
          "{dz.wei}0": "{xx.mao}"
        },
        XIU_LUCK: {
          "{xx.jiao}": "{s.goodLuck}",
          "{xx.kang}": "{s.badLuck}",
          "{xx.di}": "{s.badLuck}",
          "{xx.fang}": "{s.goodLuck}",
          "{xx.xin}": "{s.badLuck}",
          "{xx.tail}": "{s.goodLuck}",
          "{xx.ji}": "{s.goodLuck}",
          "{xx.dou}": "{s.goodLuck}",
          "{xx.niu}": "{s.badLuck}",
          "{xx.nv}": "{s.badLuck}",
          "{xx.xu}": "{s.badLuck}",
          "{xx.wei}": "{s.badLuck}",
          "{xx.shi}": "{s.goodLuck}",
          "{xx.qiang}": "{s.goodLuck}",
          "{xx.kui}": "{s.badLuck}",
          "{xx.lou}": "{s.goodLuck}",
          "{xx.vei}": "{s.goodLuck}",
          "{xx.mao}": "{s.badLuck}",
          "{xx.bi}": "{s.goodLuck}",
          "{xx.zi}": "{s.badLuck}",
          "{xx.can}": "{s.goodLuck}",
          "{xx.jing}": "{s.goodLuck}",
          "{xx.gui}": "{s.badLuck}",
          "{xx.liu}": "{s.badLuck}",
          "{xx.xing}": "{s.badLuck}",
          "{xx.zhang}": "{s.goodLuck}",
          "{xx.yi}": "{s.badLuck}",
          "{xx.zhen}": "{s.goodLuck}"
        },
        XIU_SONG: {
          "{xx.jiao}": "角星造作主荣昌，外进田财及女郎，嫁娶婚姻出贵子，文人及第见君王，惟有埋葬不可用，三年之后主瘟疫，起工修筑坟基地，堂前立见主人凶。",
          "{xx.kang}": "亢星造作长房当，十日之中主有殃，田地消磨官失职，接运定是虎狼伤，嫁娶婚姻用此日，儿孙新妇守空房，埋葬若还用此日，当时害祸主重伤。",
          "{xx.di}": "氐星造作主灾凶，费尽田园仓库空，埋葬不可用此日，悬绳吊颈祸重重，若是婚姻离别散，夜招浪子入房中，行船必定遭沉没，更生聋哑子孙穷。",
          "{xx.fang}": "房星造作田园进，钱财牛马遍山岗，更招外处田庄宅，荣华富贵福禄康，埋葬若然用此日，高官进职拜君王，嫁娶嫦娥至月殿，三年抱子至朝堂。",
          "{xx.xin}": "心星造作大为凶，更遭刑讼狱囚中，忤逆官非宅产退，埋葬卒暴死相从，婚姻若是用此日，子死儿亡泪满胸，三年之内连遭祸，事事教君没始终。",
          "{xx.tail}": "尾星造作主天恩，富贵荣华福禄增，招财进宝兴家宅，和合婚姻贵子孙，埋葬若能依此日，男清女正子孙兴，开门放水招田宅，代代公侯远播名。",
          "{xx.ji}": "箕星造作主高强，岁岁年年大吉昌，埋葬修坟大吉利，田蚕牛马遍山岗，开门放水招田宅，箧满金银谷满仓，福荫高官加禄位，六亲丰禄乐安康。",
          "{xx.dou}": "斗星造作主招财，文武官员位鼎台，田宅家财千万进，坟堂修筑贵富来，开门放水招牛马，旺蚕男女主和谐，遇此吉宿来照护，时支福庆永无灾。",
          "{xx.niu}": "牛星造作主灾危，九横三灾不可推，家宅不安人口退，田蚕不利主人衰，嫁娶婚姻皆自损，金银财谷渐无之，若是开门并放水，牛猪羊马亦伤悲。",
          "{xx.nv}": "女星造作损婆娘，兄弟相嫌似虎狼，埋葬生灾逢鬼怪，颠邪疾病主瘟惶，为事遭官财失散，泻利留连不可当，开门放水用此日，全家财散主离乡。",
          "{xx.xu}": "虚星造作主灾殃，男女孤眠不一双，内乱风声无礼节，儿孙媳妇伴人床，开门放水遭灾祸，虎咬蛇伤又卒亡，三三五五连年病，家破人亡不可当。",
          "{xx.wei}": "危星不可造高楼，自遭刑吊见血光，三年孩子遭水厄，后生出外永不还，埋葬若还逢此日，周年百日取高堂，三年两载一悲伤，开门放水到官堂。",
          "{xx.shi}": "室星修造进田牛，儿孙代代近王侯，家贵荣华天上至，寿如彭祖八千秋，开门放水招财帛，和合婚姻生贵儿，埋葬若能依此日，门庭兴旺福无休。",
          "{xx.qiang}": "壁星造作主增财，丝蚕大熟福滔天，奴婢自来人口进，开门放水出英贤，埋葬招财官品进，家中诸事乐陶然，婚姻吉利主贵子，早播名誉著祖鞭。",
          "{xx.kui}": "奎星造作得祯祥，家内荣和大吉昌，若是埋葬阴卒死，当年定主两三伤，看看军令刑伤到，重重官事主瘟惶，开门放水遭灾祸，三年两次损儿郎。",
          "{xx.lou}": "娄星修造起门庭，财旺家和事事兴，外进钱财百日进，一家兄弟播高名，婚姻进益生贵子，玉帛金银箱满盈，放水开门皆吉利，男荣女贵寿康宁。",
          "{xx.vei}": "胃星造作事如何，家贵荣华喜气多，埋葬贵临官禄位，夫妇齐眉永保康，婚姻遇此家富贵，三灾九祸不逢他，从此门前多吉庆，儿孙代代拜金阶。",
          "{xx.mao}": "昴星造作进田牛，埋葬官灾不得休，重丧二日三人死，尽卖田园不记增，开门放水招灾祸，三岁孩儿白了头，婚姻不可逢此日，死别生离是可愁。",
          "{xx.bi}": "毕星造作主光前，买得田园有余钱，埋葬此日添官职，田蚕大熟永丰年，开门放水多吉庆，合家人口得安然，婚姻若得逢此日，生得孩儿福寿全。",
          "{xx.zi}": "觜星造作有徒刑，三年必定主伶丁，埋葬卒死多因此，取定寅年使杀人，三丧不止皆由此，一人药毒二人身，家门田地皆退败，仓库金银化作尘。",
          "{xx.can}": "参星造作旺人家，文星照耀大光华，只因造作田财旺，埋葬招疾哭黄沙，开门放水加官职，房房子孙见田加，婚姻许遁遭刑克，男女朝开幕落花。",
          "{xx.jing}": "井星造作旺蚕田，金榜题名第一光，埋葬须防惊卒死，狂颠风疾入黄泉，开门放水招财帛，牛马猪羊旺莫言，贵人田塘来入宅，儿孙兴旺有余钱。",
          "{xx.gui}": "鬼星起造卒人亡，堂前不见主人郎，埋葬此日官禄至，儿孙代代近君王，开门放水须伤死，嫁娶夫妻不久长，修土筑墙伤产女，手扶双女泪汪汪。",
          "{xx.liu}": "柳星造作主遭官，昼夜偷闭不暂安，埋葬瘟惶多疾病，田园退尽守冬寒，开门放水遭聋瞎，腰驼背曲似弓弯，更有棒刑宜谨慎，妇人随客走盘桓。",
          "{xx.xing}": "星宿日好造新房，进职加官近帝王，不可埋葬并放水，凶星临位女人亡，生离死别无心恋，要自归休别嫁郎，孔子九曲殊难度，放水开门天命伤。",
          "{xx.zhang}": "张星日好造龙轩，年年并见进庄田，埋葬不久升官职，代代为官近帝前，开门放水招财帛，婚姻和合福绵绵，田蚕人满仓库满，百般顺意自安然。",
          "{xx.yi}": "翼星不利架高堂，三年二载见瘟惶，埋葬若还逢此日，子孙必定走他乡，婚姻此日不宜利，归家定是不相当，开门放水家须破，少女恋花贪外郎。",
          "{xx.zhen}": "轸星临水造龙宫，代代为官受皇封，富贵荣华增寿禄，库满仓盈自昌隆，埋葬文昌来照助，宅舍安宁不见凶，更有为官沾帝宠，婚姻龙子入龙宫。"
        },
        ZHENG: {
          "{xx.jiao}": "{wx.mu}",
          "{xx.jing}": "{wx.mu}",
          "{xx.kui}": "{wx.mu}",
          "{xx.dou}": "{wx.mu}",
          "{xx.kang}": "{wx.jin}",
          "{xx.gui}": "{wx.jin}",
          "{xx.lou}": "{wx.jin}",
          "{xx.niu}": "{wx.jin}",
          "{xx.di}": "{wx.tu}",
          "{xx.liu}": "{wx.tu}",
          "{xx.vei}": "{wx.tu}",
          "{xx.nv}": "{wx.tu}",
          "{xx.fang}": "{wx.ri}",
          "{xx.xing}": "{wx.ri}",
          "{xx.mao}": "{wx.ri}",
          "{xx.xu}": "{wx.ri}",
          "{xx.xin}": "{wx.yue}",
          "{xx.zhang}": "{wx.yue}",
          "{xx.bi}": "{wx.yue}",
          "{xx.wei}": "{wx.yue}",
          "{xx.tail}": "{wx.huo}",
          "{xx.yi}": "{wx.huo}",
          "{xx.zi}": "{wx.huo}",
          "{xx.shi}": "{wx.huo}",
          "{xx.ji}": "{wx.shui}",
          "{xx.zhen}": "{wx.shui}",
          "{xx.can}": "{wx.shui}",
          "{xx.qiang}": "{wx.shui}"
        },
        ANIMAL: {
          "{xx.jiao}": "{dw.jiao}",
          "{xx.dou}": "{dw.xie}",
          "{xx.kui}": "{dw.lang}",
          "{xx.jing}": "{dw.han}",
          "{xx.kang}": "{dw.long}",
          "{xx.niu}": "{dw.niu}",
          "{xx.lou}": "{dw.gou}",
          "{xx.gui}": "{dw.yang}",
          "{xx.nv}": "{dw.fu}",
          "{xx.di}": "{dw.he}",
          "{xx.vei}": "{dw.zhi}",
          "{xx.liu}": "{dw.zhang}",
          "{xx.fang}": "{dw.tu}",
          "{xx.xu}": "{dw.shu}",
          "{xx.mao}": "{dw.ji}",
          "{xx.xing}": "{dw.ma}",
          "{xx.xin}": "{dw.huLi}",
          "{xx.wei}": "{dw.yan}",
          "{xx.bi}": "{dw.wu}",
          "{xx.zhang}": "{dw.lu}",
          "{xx.tail}": "{dw.hu}",
          "{xx.shi}": "{dw.zhu}",
          "{xx.zi}": "{dw.hou}",
          "{xx.yi}": "{dw.she}",
          "{xx.ji}": "{dw.bao}",
          "{xx.qiang}": "{dw.xu}",
          "{xx.can}": "{dw.yuan}",
          "{xx.zhen}": "{dw.yin}"
        },
        GONG: {
          "{xx.jiao}": "{ps.dong}",
          "{xx.jing}": "{ps.nan}",
          "{xx.kui}": "{ps.xi}",
          "{xx.dou}": "{ps.bei}",
          "{xx.kang}": "{ps.dong}",
          "{xx.gui}": "{ps.nan}",
          "{xx.lou}": "{ps.xi}",
          "{xx.niu}": "{ps.bei}",
          "{xx.di}": "{ps.dong}",
          "{xx.liu}": "{ps.nan}",
          "{xx.vei}": "{ps.xi}",
          "{xx.nv}": "{ps.bei}",
          "{xx.fang}": "{ps.dong}",
          "{xx.xing}": "{ps.nan}",
          "{xx.mao}": "{ps.xi}",
          "{xx.xu}": "{ps.bei}",
          "{xx.xin}": "{ps.dong}",
          "{xx.zhang}": "{ps.nan}",
          "{xx.bi}": "{ps.xi}",
          "{xx.wei}": "{ps.bei}",
          "{xx.tail}": "{ps.dong}",
          "{xx.yi}": "{ps.nan}",
          "{xx.zi}": "{ps.xi}",
          "{xx.shi}": "{ps.bei}",
          "{xx.ji}": "{ps.dong}",
          "{xx.zhen}": "{ps.nan}",
          "{xx.can}": "{ps.xi}",
          "{xx.qiang}": "{ps.bei}"
        },
        SHOU: {
          "{ps.dong}": "{sn.qingLong}",
          "{ps.nan}": "{sn.zhuQue}",
          "{ps.xi}": "{sn.baiHu}",
          "{ps.bei}": "{sn.xuanWu}"
        },
        FESTIVAL: {
          "1-1": "{jr.chunJie}",
          "1-15": "{jr.yuanXiao}",
          "2-2": "{jr.longTou}",
          "5-5": "{jr.duanWu}",
          "7-7": "{jr.qiXi}",
          "8-15": "{jr.zhongQiu}",
          "9-9": "{jr.chongYang}",
          "12-8": "{jr.laBa}"
        },
        OTHER_FESTIVAL: { "1-4": ["接神日"], "1-5": ["隔开日"], "1-7": ["人日"], "1-8": ["谷日", "顺星节"], "1-9": ["天日"], "1-10": ["地日"], "1-20": ["天穿节"], "1-25": ["填仓节"], "1-30": ["正月晦"], "2-1": ["中和节"], "2-2": ["社日节"], "3-3": ["上巳节"], "5-20": ["分龙节"], "5-25": ["会龙节"], "6-6": ["天贶节"], "6-24": ["观莲节"], "6-25": ["五谷母节"], "7-15": ["中元节"], "7-22": ["财神节"], "7-29": ["地藏节"], "8-1": ["天灸日"], "10-1": ["寒衣节"], "10-10": ["十成节"], "10-15": ["下元节"], "12-7": ["驱傩日"], "12-16": ["尾牙"], "12-24": ["祭灶日"] },
        CHONG: ["{dz.wu}", "{dz.wei}", "{dz.shen}", "{dz.you}", "{dz.xu}", "{dz.hai}", "{dz.zi}", "{dz.chou}", "{dz.yin}", "{dz.mao}", "{dz.chen}", "{dz.si}"],
        CHONG_GAN: ["{tg.wu}", "{tg.ji}", "{tg.geng}", "{tg.xin}", "{tg.ren}", "{tg.gui}", "{tg.jia}", "{tg.yi}", "{tg.bing}", "{tg.ding}"],
        CHONG_GAN_TIE: ["{tg.ji}", "{tg.wu}", "{tg.xin}", "{tg.geng}", "{tg.gui}", "{tg.ren}", "{tg.yi}", "{tg.jia}", "{tg.ding}", "{tg.bing}"],
        CHONG_GAN_4: ["{tg.geng}", "{tg.xin}", "{tg.ren}", "{tg.gui}", "", "", "{tg.jia}", "{tg.yi}", "{tg.bing}", "{tg.ding}"],
        HE_GAN_5: ["{tg.ji}", "{tg.geng}", "{tg.xin}", "{tg.ren}", "{tg.gui}", "{tg.jia}", "{tg.yi}", "{tg.bing}", "{tg.ding}", "{tg.wu}"],
        HE_ZHI_6: ["{dz.chou}", "{dz.zi}", "{dz.hai}", "{dz.xu}", "{dz.you}", "{dz.shen}", "{dz.wei}", "{dz.wu}", "{dz.si}", "{dz.chen}", "{dz.mao}", "{dz.yin}"],
        SHA: {
          "{dz.zi}": "{ps.nan}",
          "{dz.chou}": "{ps.dong}",
          "{dz.yin}": "{ps.bei}",
          "{dz.mao}": "{ps.xi}",
          "{dz.chen}": "{ps.nan}",
          "{dz.si}": "{ps.dong}",
          "{dz.wu}": "{ps.bei}",
          "{dz.wei}": "{ps.xi}",
          "{dz.shen}": "{ps.nan}",
          "{dz.you}": "{ps.dong}",
          "{dz.xu}": "{ps.bei}",
          "{dz.hai}": "{ps.xi}"
        },
        POSITION_DESC: {
          "{bg.kan}": "{ps.zhengBei}",
          "{bg.gen}": "{ps.dongBei}",
          "{bg.zhen}": "{ps.zhengDong}",
          "{bg.xun}": "{ps.dongNan}",
          "{bg.li}": "{ps.zhengNan}",
          "{bg.kun}": "{ps.xiNan}",
          "{bg.dui}": "{ps.zhengXi}",
          "{bg.qian}": "{ps.xiBei}",
          "{ps.center}": "{ps.zhong}"
        },
        NAYIN: {
          "{jz.jiaZi}": "{ny.haiZhong}{wx.jin}",
          "{jz.jiaWu}": "{ny.shaZhong}{wx.jin}",
          "{jz.bingYin}": "{ny.luZhong}{wx.huo}",
          "{jz.bingShen}": "{ny.shanXia}{wx.huo}",
          "{jz.wuChen}": "{ny.daLin}{wx.mu}",
          "{jz.wuXu}": "{ny.pingDi}{wx.mu}",
          "{jz.gengWu}": "{ny.luPang}{wx.tu}",
          "{jz.gengZi}": "{ny.biShang}{wx.tu}",
          "{jz.renShen}": "{ny.jianFeng}{wx.jin}",
          "{jz.renYin}": "{ny.jinBo}{wx.jin}",
          "{jz.jiaXu}": "{ny.shanTou}{wx.huo}",
          "{jz.jiaChen}": "{ny.fuDeng}{wx.huo}",
          "{jz.bingZi}": "{ny.jianXia}{wx.shui}",
          "{jz.bingWu}": "{ny.tianHe}{wx.shui}",
          "{jz.wuYin}": "{ny.chengTou}{wx.tu}",
          "{jz.wuShen}": "{ny.daYi}{wx.tu}",
          "{jz.gengChen}": "{ny.baiLa}{wx.jin}",
          "{jz.gengXu}": "{ny.chaiChuan}{wx.jin}",
          "{jz.renWu}": "{ny.yangLiu}{wx.mu}",
          "{jz.renZi}": "{ny.sangZhe}{wx.mu}",
          "{jz.jiaShen}": "{ny.quanZhong}{wx.shui}",
          "{jz.jiaYin}": "{ny.daXi}{wx.shui}",
          "{jz.bingXu}": "{ny.wuShang}{wx.tu}",
          "{jz.bingChen}": "{ny.shaZhong}{wx.tu}",
          "{jz.wuZi}": "{ny.piLi}{wx.huo}",
          "{jz.wuWu}": "{ny.tianShang}{wx.huo}",
          "{jz.gengYin}": "{ny.songBo}{wx.mu}",
          "{jz.gengShen}": "{ny.shiLiu}{wx.mu}",
          "{jz.renChen}": "{ny.changLiu}{wx.shui}",
          "{jz.renXu}": "{ny.daHai}{wx.shui}",
          "{jz.yiChou}": "{ny.haiZhong}{wx.jin}",
          "{jz.yiWei}": "{ny.shaZhong}{wx.jin}",
          "{jz.dingMao}": "{ny.luZhong}{wx.huo}",
          "{jz.dingYou}": "{ny.shanXia}{wx.huo}",
          "{jz.jiSi}": "{ny.daLin}{wx.mu}",
          "{jz.jiHai}": "{ny.pingDi}{wx.mu}",
          "{jz.xinWei}": "{ny.luPang}{wx.tu}",
          "{jz.xinChou}": "{ny.biShang}{wx.tu}",
          "{jz.guiYou}": "{ny.jianFeng}{wx.jin}",
          "{jz.guiMao}": "{ny.jinBo}{wx.jin}",
          "{jz.yiHai}": "{ny.shanTou}{wx.huo}",
          "{jz.yiSi}": "{ny.fuDeng}{wx.huo}",
          "{jz.dingChou}": "{ny.jianXia}{wx.shui}",
          "{jz.dingWei}": "{ny.tianHe}{wx.shui}",
          "{jz.jiMao}": "{ny.chengTou}{wx.tu}",
          "{jz.jiYou}": "{ny.daYi}{wx.tu}",
          "{jz.xinSi}": "{ny.baiLa}{wx.jin}",
          "{jz.xinHai}": "{ny.chaiChuan}{wx.jin}",
          "{jz.guiWei}": "{ny.yangLiu}{wx.mu}",
          "{jz.guiChou}": "{ny.sangZhe}{wx.mu}",
          "{jz.yiYou}": "{ny.quanZhong}{wx.shui}",
          "{jz.yiMao}": "{ny.daXi}{wx.shui}",
          "{jz.dingHai}": "{ny.wuShang}{wx.tu}",
          "{jz.dingSi}": "{ny.shaZhong}{wx.tu}",
          "{jz.jiChou}": "{ny.piLi}{wx.huo}",
          "{jz.jiWei}": "{ny.tianShang}{wx.huo}",
          "{jz.xinMao}": "{ny.songBo}{wx.mu}",
          "{jz.xinYou}": "{ny.shiLiu}{wx.mu}",
          "{jz.guiSi}": "{ny.changLiu}{wx.shui}",
          "{jz.guiHai}": "{ny.daHai}{wx.shui}"
        },
        WU_XING_GAN: {
          "{tg.jia}": "{wx.mu}",
          "{tg.yi}": "{wx.mu}",
          "{tg.bing}": "{wx.huo}",
          "{tg.ding}": "{wx.huo}",
          "{tg.wu}": "{wx.tu}",
          "{tg.ji}": "{wx.tu}",
          "{tg.geng}": "{wx.jin}",
          "{tg.xin}": "{wx.jin}",
          "{tg.ren}": "{wx.shui}",
          "{tg.gui}": "{wx.shui}"
        },
        WU_XING_ZHI: {
          "{dz.yin}": "{wx.mu}",
          "{dz.mao}": "{wx.mu}",
          "{dz.si}": "{wx.huo}",
          "{dz.wu}": "{wx.huo}",
          "{dz.chen}": "{wx.tu}",
          "{dz.chou}": "{wx.tu}",
          "{dz.xu}": "{wx.tu}",
          "{dz.wei}": "{wx.tu}",
          "{dz.shen}": "{wx.jin}",
          "{dz.you}": "{wx.jin}",
          "{dz.hai}": "{wx.shui}",
          "{dz.zi}": "{wx.shui}"
        },
        SHI_SHEN: {
          "{tg.jia}{tg.jia}": "{ss.biJian}",
          "{tg.jia}{tg.yi}": "{ss.jieCai}",
          "{tg.jia}{tg.bing}": "{ss.shiShen}",
          "{tg.jia}{tg.ding}": "{ss.shangGuan}",
          "{tg.jia}{tg.wu}": "{ss.pianCai}",
          "{tg.jia}{tg.ji}": "{ss.zhengCai}",
          "{tg.jia}{tg.geng}": "{ss.qiSha}",
          "{tg.jia}{tg.xin}": "{ss.zhengGuan}",
          "{tg.jia}{tg.ren}": "{ss.pianYin}",
          "{tg.jia}{tg.gui}": "{ss.zhengYin}",
          "{tg.yi}{tg.yi}": "{ss.biJian}",
          "{tg.yi}{tg.jia}": "{ss.jieCai}",
          "{tg.yi}{tg.ding}": "{ss.shiShen}",
          "{tg.yi}{tg.bing}": "{ss.shangGuan}",
          "{tg.yi}{tg.ji}": "{ss.pianCai}",
          "{tg.yi}{tg.wu}": "{ss.zhengCai}",
          "{tg.yi}{tg.xin}": "{ss.qiSha}",
          "{tg.yi}{tg.geng}": "{ss.zhengGuan}",
          "{tg.yi}{tg.gui}": "{ss.pianYin}",
          "{tg.yi}{tg.ren}": "{ss.zhengYin}",
          "{tg.bing}{tg.bing}": "{ss.biJian}",
          "{tg.bing}{tg.ding}": "{ss.jieCai}",
          "{tg.bing}{tg.wu}": "{ss.shiShen}",
          "{tg.bing}{tg.ji}": "{ss.shangGuan}",
          "{tg.bing}{tg.geng}": "{ss.pianCai}",
          "{tg.bing}{tg.xin}": "{ss.zhengCai}",
          "{tg.bing}{tg.ren}": "{ss.qiSha}",
          "{tg.bing}{tg.gui}": "{ss.zhengGuan}",
          "{tg.bing}{tg.jia}": "{ss.pianYin}",
          "{tg.bing}{tg.yi}": "{ss.zhengYin}",
          "{tg.ding}{tg.ding}": "{ss.biJian}",
          "{tg.ding}{tg.bing}": "{ss.jieCai}",
          "{tg.ding}{tg.ji}": "{ss.shiShen}",
          "{tg.ding}{tg.wu}": "{ss.shangGuan}",
          "{tg.ding}{tg.xin}": "{ss.pianCai}",
          "{tg.ding}{tg.geng}": "{ss.zhengCai}",
          "{tg.ding}{tg.gui}": "{ss.qiSha}",
          "{tg.ding}{tg.ren}": "{ss.zhengGuan}",
          "{tg.ding}{tg.yi}": "{ss.pianYin}",
          "{tg.ding}{tg.jia}": "{ss.zhengYin}",
          "{tg.wu}{tg.wu}": "{ss.biJian}",
          "{tg.wu}{tg.ji}": "{ss.jieCai}",
          "{tg.wu}{tg.geng}": "{ss.shiShen}",
          "{tg.wu}{tg.xin}": "{ss.shangGuan}",
          "{tg.wu}{tg.ren}": "{ss.pianCai}",
          "{tg.wu}{tg.gui}": "{ss.zhengCai}",
          "{tg.wu}{tg.jia}": "{ss.qiSha}",
          "{tg.wu}{tg.yi}": "{ss.zhengGuan}",
          "{tg.wu}{tg.bing}": "{ss.pianYin}",
          "{tg.wu}{tg.ding}": "{ss.zhengYin}",
          "{tg.ji}{tg.ji}": "{ss.biJian}",
          "{tg.ji}{tg.wu}": "{ss.jieCai}",
          "{tg.ji}{tg.xin}": "{ss.shiShen}",
          "{tg.ji}{tg.geng}": "{ss.shangGuan}",
          "{tg.ji}{tg.gui}": "{ss.pianCai}",
          "{tg.ji}{tg.ren}": "{ss.zhengCai}",
          "{tg.ji}{tg.yi}": "{ss.qiSha}",
          "{tg.ji}{tg.jia}": "{ss.zhengGuan}",
          "{tg.ji}{tg.ding}": "{ss.pianYin}",
          "{tg.ji}{tg.bing}": "{ss.zhengYin}",
          "{tg.geng}{tg.geng}": "{ss.biJian}",
          "{tg.geng}{tg.xin}": "{ss.jieCai}",
          "{tg.geng}{tg.ren}": "{ss.shiShen}",
          "{tg.geng}{tg.gui}": "{ss.shangGuan}",
          "{tg.geng}{tg.jia}": "{ss.pianCai}",
          "{tg.geng}{tg.yi}": "{ss.zhengCai}",
          "{tg.geng}{tg.bing}": "{ss.qiSha}",
          "{tg.geng}{tg.ding}": "{ss.zhengGuan}",
          "{tg.geng}{tg.wu}": "{ss.pianYin}",
          "{tg.geng}{tg.ji}": "{ss.zhengYin}",
          "{tg.xin}{tg.xin}": "{ss.biJian}",
          "{tg.xin}{tg.geng}": "{ss.jieCai}",
          "{tg.xin}{tg.gui}": "{ss.shiShen}",
          "{tg.xin}{tg.ren}": "{ss.shangGuan}",
          "{tg.xin}{tg.yi}": "{ss.pianCai}",
          "{tg.xin}{tg.jia}": "{ss.zhengCai}",
          "{tg.xin}{tg.ding}": "{ss.qiSha}",
          "{tg.xin}{tg.bing}": "{ss.zhengGuan}",
          "{tg.xin}{tg.ji}": "{ss.pianYin}",
          "{tg.xin}{tg.wu}": "{ss.zhengYin}",
          "{tg.ren}{tg.ren}": "{ss.biJian}",
          "{tg.ren}{tg.gui}": "{ss.jieCai}",
          "{tg.ren}{tg.jia}": "{ss.shiShen}",
          "{tg.ren}{tg.yi}": "{ss.shangGuan}",
          "{tg.ren}{tg.bing}": "{ss.pianCai}",
          "{tg.ren}{tg.ding}": "{ss.zhengCai}",
          "{tg.ren}{tg.wu}": "{ss.qiSha}",
          "{tg.ren}{tg.ji}": "{ss.zhengGuan}",
          "{tg.ren}{tg.geng}": "{ss.pianYin}",
          "{tg.ren}{tg.xin}": "{ss.zhengYin}",
          "{tg.gui}{tg.gui}": "{ss.biJian}",
          "{tg.gui}{tg.ren}": "{ss.jieCai}",
          "{tg.gui}{tg.yi}": "{ss.shiShen}",
          "{tg.gui}{tg.jia}": "{ss.shangGuan}",
          "{tg.gui}{tg.ding}": "{ss.pianCai}",
          "{tg.gui}{tg.bing}": "{ss.zhengCai}",
          "{tg.gui}{tg.ji}": "{ss.qiSha}",
          "{tg.gui}{tg.wu}": "{ss.zhengGuan}",
          "{tg.gui}{tg.xin}": "{ss.pianYin}",
          "{tg.gui}{tg.geng}": "{ss.zhengYin}"
        },
        ZHI_HIDE_GAN: {
          "{dz.zi}": ["{tg.gui}"],
          "{dz.chou}": ["{tg.ji}", "{tg.gui}", "{tg.xin}"],
          "{dz.yin}": ["{tg.jia}", "{tg.bing}", "{tg.wu}"],
          "{dz.mao}": ["{tg.yi}"],
          "{dz.chen}": ["{tg.wu}", "{tg.yi}", "{tg.gui}"],
          "{dz.si}": ["{tg.bing}", "{tg.geng}", "{tg.wu}"],
          "{dz.wu}": ["{tg.ding}", "{tg.ji}"],
          "{dz.wei}": ["{tg.ji}", "{tg.ding}", "{tg.yi}"],
          "{dz.shen}": ["{tg.geng}", "{tg.ren}", "{tg.wu}"],
          "{dz.you}": ["{tg.xin}"],
          "{dz.xu}": ["{tg.wu}", "{tg.xin}", "{tg.ding}"],
          "{dz.hai}": ["{tg.ren}", "{tg.jia}"]
        },
        YI_JI: [
          "{yj.jiSi}",
          "{yj.qiFu}",
          "{yj.qiuSi}",
          "{yj.kaiGuang}",
          "{yj.suHui}",
          "{yj.qiJiao}",
          "{yj.zhaiJiao}",
          "{yj.muYu}",
          "{yj.chouShen}",
          "{yj.zaoMiao}",
          "{yj.siZhao}",
          "{yj.fenXiang}",
          "{yj.xieTu}",
          "{yj.chuHuo}",
          "{yj.diaoKe}",
          "{yj.jiaQu}",
          "{yj.DingHun}",
          "{yj.naCai}",
          "{yj.wenMing}",
          "{yj.naXu}",
          "{yj.guiNing}",
          "{yj.anChuang}",
          "{yj.heZhang}",
          "{yj.guanJi}",
          "{yj.dingMeng}",
          "{yj.jinRenKou}",
          "{yj.caiYi}",
          "{yj.wanMian}",
          "{yj.kaiRong}",
          "{yj.xiuFen}",
          "{yj.qiZuan}",
          "{yj.poTu}",
          "{yj.anZang}",
          "{yj.liBei}",
          "{yj.chengFu}",
          "{yj.chuFu}",
          "{yj.kaiShengFen}",
          "{yj.heShouMu}",
          "{yj.ruLian}",
          "{yj.yiJiu}",
          "{yj.puDu}",
          "{yj.ruZhai}",
          "{yj.anXiang}",
          "{yj.anMen}",
          "{yj.xiuZao}",
          "{yj.qiJi}",
          "{yj.dongTu}",
          "{yj.shangLiang}",
          "{yj.shuZhu}",
          "{yj.kaiJing}",
          "{yj.zuoBei}",
          "{yj.chaiXie}",
          "{yj.poWu}",
          "{yj.huaiYuan}",
          "{yj.buYuan}",
          "{yj.faMuZuoLiang}",
          "{yj.zuoZhao}",
          "{yj.jieChu}",
          "{yj.kaiZhuYan}",
          "{yj.chuanPing}",
          "{yj.gaiWuHeJi}",
          "{yj.kaiCe}",
          "{yj.zaoCang}",
          "{yj.saiXue}",
          "{yj.pingZhi}",
          "{yj.zaoQiao}",
          "{yj.zuoCe}",
          "{yj.zhuDi}",
          "{yj.kaiChi}",
          "{yj.faMu}",
          "{yj.kaiQu}",
          "{yj.jueJing}",
          "{yj.saoShe}",
          "{yj.fangShui}",
          "{yj.zaoWu}",
          "{yj.heJi}",
          "{yj.zaoChuChou}",
          "{yj.xiuMen}",
          "{yj.dingSang}",
          "{yj.zuoLiang}",
          "{yj.xiuShi}",
          "{yj.jiaMa}",
          "{yj.kaiShi}",
          "{yj.guaBian}",
          "{yj.naChai}",
          "{yj.qiuCai}",
          "{yj.kaiCang}",
          "{yj.maiChe}",
          "{yj.zhiChan}",
          "{yj.guYong}",
          "{yj.chuHuoCai}",
          "{yj.anJiXie}",
          "{yj.zaoCheQi}",
          "{yj.jingLuo}",
          "{yj.yunNiang}",
          "{yj.zuoRan}",
          "{yj.guZhu}",
          "{yj.zaoChuan}",
          "{yj.geMi}",
          "{yj.zaiZhong}",
          "{yj.quYu}",
          "{yj.jieWang}",
          "{yj.muYang}",
          "{yj.anDuiWei}",
          "{yj.xiYi}",
          "{yj.ruXue}",
          "{yj.liFa}",
          "{yj.tanBing}",
          "{yj.jianGui}",
          "{yj.chengChuan}",
          "{yj.duShui}",
          "{yj.zhenJiu}",
          "{yj.chuXing}",
          "{yj.yiXi}",
          "{yj.fenJu}",
          "{yj.TiTou}",
          "{yj.zhengShou}",
          "{yj.naChu}",
          "{yj.buZhuo}",
          "{yj.tianLie}",
          "{yj.jiaoNiuMa}",
          "{yj.huiQinYou}",
          "{yj.fuRen}",
          "{yj.qiuYi}",
          "{yj.zhiBing}",
          "{yj.ciSong}",
          "{yj.qiJiDongTu}",
          "{yj.poWuHuaiYuan}",
          "{yj.gaiWu}",
          "{yj.zaoCangKu}",
          "{yj.liQuanJiaoYi}",
          "{yj.jiaoYi}",
          "{yj.liQuan}",
          "{yj.anJi}",
          "{yj.huiYou}",
          "{yj.qiuYiLiaoBing}",
          "{yj.zhuShi}",
          "{yj.yuShi}",
          "{yj.xingSang}",
          "{yj.duanYi}",
          "{yj.guiXiu}",
          "{s.none}"
        ],
        LU: {
          "{tg.jia}": "{dz.yin}",
          "{tg.yi}": "{dz.mao}",
          "{tg.bing}": "{dz.si}",
          "{tg.ding}": "{dz.wu}",
          "{tg.wu}": "{dz.si}",
          "{tg.ji}": "{dz.wu}",
          "{tg.geng}": "{dz.shen}",
          "{tg.xin}": "{dz.you}",
          "{tg.ren}": "{dz.hai}",
          "{tg.gui}": "{dz.zi}",
          "{dz.yin}": "{tg.jia}",
          "{dz.mao}": "{tg.yi}",
          "{dz.si}": "{tg.bing},{tg.wu}",
          "{dz.wu}": "{tg.ding},{tg.ji}",
          "{dz.shen}": "{tg.geng}",
          "{dz.you}": "{tg.xin}",
          "{dz.hai}": "{tg.ren}",
          "{dz.zi}": "{tg.gui}"
        },
        DAY_YI_JI: "30=192531010D:838454151A4C200C1E23221D212726,030F522E1F00=2430000C18:8319000776262322200C1E1D,06292C2E1F04=32020E1A26:7917155B0001025D,0F522E38201D=162E3A0A22:790F181113332C2E2D302F1554,7001203810=0E1A263202:79026A17657603,522E201F05=0D19250131:7911192C2E302F00030401060F1571292A75,707C20522F=0C18243000:4F2C2E2B383F443D433663,0F01478A20151D=0E1A320226:3840,0001202B892F=14202C3808:3807504089,8829=0E1A263202:383940,6370018A75202B454F6605=32020E1A26:38394089,0001202B22=16223A0A2E:384C,8A2020=2B3707131F:2C2E5B000739337C38802D44484C2425201F1E272621,5229701535=121E2A3606:2C2E2D2B156343364C,0F4729710D708A20036A1904=0D19250131:5040262789,0F7129033B=202C380814:5040000738,0F7D7C584F012063452B35=1A2632020E:50400089,8813=1A2632020E:69687011180F791966762627201E,0352292E8034=182430000C:291503000D332E53261F2075,0F5238584F450B=000C182430:297170192C2E2D2F2B3E363F4C,0F521563200103470B=131F2B3707:297115030102195283840D332C2E,0F1F5863201D8A02=222E3A0A16:261F1E20232289,52290058363F32=16222E3A0A:261F201E232289,8D39=0D19310125:262322271E201D21,52450F4F09=0D19253101:262322271E202189,1F4526=16222E3A0A:262322271F1E20,712906=0F1B273303:17262322274050,80387C6B2C=0915212D39:1707702C2E71291F20,0F52000106111D15=16222E3A0A:170007386A7448363F261F1E,030F79636F2026=030F1B2733:1784832C2E5B26201F,0F010D2913=182430000C:175447440D15838477656A49,2B2E1F8A202228=101C283404:70504C7889,8803=0D19250131:700F181126151E20001A7919,8D2F=0915212D39:705283845B0D2F71,0F202E4106=3606121E2A:70786289,06802E1F23=1824000C30:70076A363F,292017=202C380814:700718111A302F717566,0F2B2E2026=3B0B17232F:70545283842E71291A7933192A5D5A5040,090C384F45208A1D6B38=212D390915:7039170F45513A2C2E7129242526271F201D,00010352153A=15212D3909:703911170E2C2E2D2F4B15712952633D,092B8A2027=010D192531:702D155483840F63262720,53292F017D4F38442B2E1F4717=16222E3A0A:705C4C39171A4F0E7971295B5248,0F2E1F1D37=1A2632020E:2E260F27201F,523815292F1A22=0E1A260232:64262322271F2021,0F2F293822=2F3B0B1723:161A0F1526271F4C,586103473818=2430000C18:161A7889,292E1F0F386131=17232F3B0B:04795B3F651A5D,0F5201062016=14202C3808:04170F79195D1A637566363F76,01522E8A2039=132B37071F:0470170F191A134C8384662426232227201E,8D08=0D19253101:040370181123220F1326271E2021,29153B=0D19310125:040307177938494C,0F26207017=0E2632021A:0403010218111A17332C2E2D2B15713E6575,45382064291D=142C380820:04033918110F0D2C2E7129332D2B72528384547566,8D1C=1830000C24:040318111A17332C15290D200C7A,4745063835=0F2733031B:040318111A16175B795452848315302F6563395D,387029202E=14202C3808:04031975363F6366,0F5401202C5283842E2F1E=0E1A320226:0403080618111A16332E2F152A09537919702C5445490D75072B,8063203820=182430000C:04067033392C7161262322271E1D210C,8D2F=101C283404:3F4889,881C=2733030F1B:3F74397677658988,0F3847201D=293505111D:3F8B657789,0F2029702E7D35=111D293505:3F8B6589,1F200A=020E1A2632:3F656477,0F2B71292005=111D290535:3F6589,8810=0F1B273303:3F88,2B38200F1C=293505111D:0F83843D363F776424,15462F2C520329712A=0F1B273303:0F17795B54838458,52807C3811=121E2A3606:0F172C2E387129363F7566512D4E4461,01034752203A=172F3B0B23:0F171511793F76584C,0347200C1D20=2D39091521:0F175B3975660745514F2B4825201E211D,010352292E2E=0F1B273303:0F170070792C2E261F,040341232228=05111D2935:0F1700707129385C363F3D1F1E232226,80412B202F14=14202C3808:0F17000728705448757A,522E1F15562F05=30000C1824:0F17000102061979454F3A15477677,241F8A2021=2F3B0B1723:0F17000102060370392E52838453331F,452F2C266A79292B203810=0C18243000:0F170001020E032A70692C2E302F802D2B0D7129474C201F2322,5211183809615D34=1A2632020E:0F171170792F5B1566770001032C2B802D,29387C207134=14202C3808:0F0D33000103452E528384297115752620,63386F7014=15212D3909:0F7045332C2E71201F1D21,4701155229530327=101C283404:0F70161715232238838426271F20,7D035219=121E2A3606:0F705B0004037C5D15653F1F26,522B473809=131F2B0737:0F705215261E20,012E1F25=182430000C:0F707B7C00012F75,52201B=2531010D19:0F706A151E201D528384544466,47010C2E292F2C3820=14202C3808:0F707500261E20,382E1F05=3606121E2A:0F161A17452F0D33712C2E2B5443633F,150170208A0327=0E1A263202:0F150370002E0D3979528384532971331F1E20,477D0D=06121E2A36:0F5B8370000102060403161A494447,386A418A201A=17232F3B0B:0F03700D332C2E2971152F52838463,01004547380C26=101C283404:0F03700D33195284835329711563,01260038206B0E=131F2B3707:0F03706A4F0D332C528384532E29711563,4500750F=131F2B3707:0F0370010239332E2C19528384532971156375262720,8D18=17232F3B0B:0F0370390D332C192E2971637547202322,581528=0E1A263202:0F0302791566046F,29710D722A38528384202E4530=0E1A263202:0F030102392E15634447001F1E,293845200D707538=1E2A360612:0F0300017039712952542D2C302F80380D2A363F3349483E616320,1118150C1F2E20=33030F1B27:0F03000102700D29713963451F0C20,528338542F15806128=121E2A3606:0F030001027039452971150D332C2F6327,2052838403=2C38081420:0F030001022A0D3945297115528384637020,476A382E1F4426=010D192531:0F03390D332C1929711563261D2E2322,382000521118750C706B15=131F2B3707:0F033915666A52261E272048,382E2F6329712C0114=0D19253101:0F52838403700D332C29712E1F27201E2322,1545017505=131F2B3707:0F528400012E7129,092026=3707131F2B:0F528471295B795D2B155333565A446375661F201E272621,00016B0C4113=14202C3808:0F280001363F8B4326232220,2E1F47032F7D35=16222E3A0A:0F0211195465756679,2F384570202B6A10=15212D3909:0F0102700D332C2E2F0319528384531529716345261F2322,8D32=101C283404:0F0102037039330D5284832971152E1F0C,0026206B37=16222E3A0A:0F003854,20521D2106=020E1A2632:0F00175058,5D6B80382E16=1B2733030F:0F00701784831952712C2E1526271F,033806201F=2B3707131F:0F00701A17830E544C5C78,7129632E1F38208A452F16=15212D3909:0F00040370396A742E15444948,458A384F2021=16222E3A0A:0F005B261F20,2E2F1D=2531010D19:0F0003450D3329712C2E2F1575,528A63705A20587D7C12=17232F3B0B:0F00030D70332C2E3952838453542971156375,6B2019=1B2733030F:0F000301020D297115332E1F0C,165220262E=121E2A3606:0F00030102700D332E2C192971155383846375261F1E20,8D1F=33030F1B27:0F00030102700D19297115332C2B535448,2E45208A00=2632020E1A:0F00030102705283842E544779,2920454F754C3836=16222E3A0A:0F0052037029710D332C15,7545584F8A201D2121=121E2A3606:0F00074850,8A2036=0D25310119:0F00071A706A717677492923221E202726,80522E1F39=1E2A360612:0F006A385040740717,1F70631E=212D390915:0F006A1938271779,565A4575522F801F1E632B=121E2A3606:0F00010D0302703352838453297115632E,208A454F2B=0E1A263202:0F000170390D332E2971152F63751F1E20,52846A381F=14202C3808:0F000106387129,2E1F24=14202C3808:0F0001062E7129,522010=0814202C38:0F0001062871292E7C528384032C5C2A15767765,11185D8A206B08=131F2B0737:0F0001067C1F20,522900=202C380814:0F0001020D700339332C192A83842971152E1F0C20262322,065256386110=111D293505:0F000102700D332C2E297115383F631F20,0347562B=14202C3808:0F000102700D332C712E15261F201E,80036A61473831=0C18243000:0F000102700D335283845329711563,38048A7D45202A=14202C3808:0F000102702E15471F1E,294F2B452C2F268011=0D19253101:0F0001022E792D3E75663D19,472063703852292B39=222E3A0A16:0F0001022E154826271F1E203874362322,036312=0D19253101:0F000102032971152C2E19,4720637038522B15=111D293505:0F000102030D70332E3919528384532971152B2F201F0C,8D1B=232F3B0B17:0F000102030D7033528384534529711520,63475814=131F2B3707:0F000102030D332C2E195283845329716375261E2322,8D19=15212D3909:0F00010203700D332C2E1929711552838453637526202322,8D09=111D293505:0F00010203700D332E2F192971152B52838453631F20,8D33=1A2632020E:0F00010203700D332E2F1929711552838453261F201E2322,8D03=2E3A0A1622:0F0001020370332C2E2F1575261F,2971476A458352380C=111D293505:0F0001020370332E2F0D19297115637566302B2C3979,8D08=000C182430:0F000102037039297175261F1D21,454F2E1563410F=17232F3B0B:0F0001020370390D3319297115632E2C752620212322,8D07=3606121E2A:0F0001020370390D332C1929712E157563548384534C,20248A38=16222E3A0A:0F0001020370390D1952838453542971631F0C,152036=14202C3808:0F00010203703915632719792322,80262045297158750F=111D293505:0F00010203528384157033,752971206B452F2B262E05=3404101C28:0F00010206030D7129302F79802D7C2B5C4744,11701D2052843833=111D293505:0F00010206181139702E1F686F6A792D2C304E153375664923221D21,52296B0D800D=15212D3909:0F000102070D70332C2E19528384297115637526201E2322,8D05=2C38081420:0F0001021A175D2C19152E302F7183846379,8A20704F7545410A=131F2B3707:0F001A651707,565A58202E1F476320=121E36062A:0F11707B7C5271291E20,2E1F39=111D293505:0F11700001522E71291F20,2B07=131F2B0737:0F11700001397129,2E2002=111D293505:0F11707129,2E1F2002=131F37072B:0F1152702E2F71291F20,000103=131F37072B:0F1152702E2F71291F20,7A3A=111D293505:0F117B7C2C2E71291F20,520300=111D350529:0F110001702E2F71291F20,0621=101C280434:0F11000170717B,522E1F0A=06121E2A36:0F110001708471292E1F20,03388051561C=121E2A3606:0F1100017B7C702E7129,522B22=2D39091521:0F110039702C2E522F1574487B7C2D4E804B,098A204538612B=05111D2935:0F1118795B65170002195D,52382E8A201E=2531010D19:0F111829711500010370390D332E750C201F,4552832F382B8004=2A3606121E:0F1118175C000301027039450D29332C2E2F15631F,8A582020=31010D1925:0F1118032A0D545283841A802D2C2E2B71296366774744201F26232221,010900150C06=2C38081420:0F11180300706A2E1549466319,292F26806B382B20754506=2E3A0A1622:0F1118528384530001035C702971152B332C2E63201F1E23222621,6B75452D4F802E=111D293505:0F1118060300017B7C792E39767566261F20,7129805136=232F3B0B17:0F111800171A454F514E3A3871157765443D23221E262720,80612E1F1C=212D390915:0F11180003706A4F0D332C2E192971155363751F20262322,524746416128=3B0B17232F:0F111800037039450D2971332C632026,1F2E2B38528327=3B0B17232F:0F11180006032A0D70332E011954838471152C202322,58477D630C=0814202C38:0F1118000106287129705B032C2E302F802D4E2B201F,528458384108=380814202C:0F11180001027039302971542F7526201E,63472E151F583A=1E2A360612:0F1118000102030D70332C2E192971158384535426201E2322,471F1B=1F2B370713:0F1118000102030D70332C2E195283845329711563261F0C20,4745752522=3505111D29:0F1118000102030D70332E2C192971153953631F0C262720,5284612528=390915212D:0F111800010203700D332C2E192971152F4B49471F270C2322,52562B2029=390915212D:0F111800010203391929710D1552838453,2075708A456309410F=0A16222E3A:0F111800010206032A0D097170292D302F1575761320,521F47251D=1F2B370713:0F18000102111A1703154F2C2E382D2F807566,7163708A1F207D2A=05111D2935:0F111800017C5C2C2E7129,527015382021=2B3707131F:0F11185C0370332D152322528384636626271E,2F292C2E1F00010601=2430000C18:0F11185C0001092A0D7014692983847B7C2C2E302F802D2B,06454F208A2E=0D19253101:0F11181200171A7919547638,5215201D09=3A0A16222E:0F1A1716007015713F261F2720,5263587D2B470304=111D293505:0F1A0070153871291F20,7A7629=010D192531:0F181179005B712980152D4E2A0D533358,5270208A11=0814202C38:0F181138171A7975665B52845415,47701F8A2013=121E2A3606:0F181117795B5C007054292A0D690403332D2C2E66632B3D,8A454F3822=121E2A3606:0F1811705200012E71291F20,382A=16222E0A3A:0F1811705200012E71291F20,062B27=14202C0838:0F18117052000171291E20,2E1F27=16222E0A3A:0F18117000012E71291F20,527A06=111D290535:0F1811700001062E2F1F20,712912=14202C3808:0F181100062839707952542C2E302F03565A7566441F1E,0D29802B2029=1824300C00:0F181100012C2E7129,522025=121E2A0636:0F18110001261F20,03522E=0915212D39:0F18110001702C2E7129,6F454F098A2025=030F1B2733:0F18110001702C2E71291F0D2B152F2127,5283162014=16222E3A0A:0F18110001707B7C0D7129,52565A152B2034=17232F3B0B:0F1811000104037115454F7677657B7C392023222726210C,52092E1F27=3707131F2B:0F181100010603797B7C802D302F2B6743441F202322,2952477D2528=14202C0838:0F181100017B7C2E71291F20,036F33=0D19253101:0F18110001027939706954528384685D15565A75201E1D26,29032E11=182430000C:0F1811000102062A0D2C2D804B2B672E2F7129,70471F8A2030=17232F3B0B:0F5C707971292C2E0E032A0D6A804B2D8C2B3348634C,52110915462031=15212D3909:0F5C5B0001032A0D7052842C2E71291F20,1118517D462B=0F1B273303:0F5C111800015B712952841F20,756A251A=2733030F1B:1545332C2E2F84836375662620,0F0003700D71292B1C=0E1A320226:1516291211020056,06382007=000C182430:1551000403706A454F3A3D771F262322271E1D21,382B41522016=17232F3B0B:1500443626271F1E,29710F47380D19520337=182430000C:150001021745512E443D65262322,2B63387C18=192531010D:151A83842627202322,580F7003632E1F297C26=0E1A263202:15391A302F83845475662627201E,0F702E4629004708=3606121E2A:5B000102073911522C302F3A678C363F33490D482425200C1E2322,0F15382E1F6116=1E2A360612:5B71297000010611182A0D39792C2E332D4E80151F202621,52454F3804=2C38081420:5B11180001020328700D332C2E195283847115632F751F2720,290F476630=0C18243000:201E27262322,8902=3404101C28:2A0D11180F52848353037039156358332C2E,3820002628=010D192531:4089,030F565A61206B27=1824300C00:4089,8836=1C28340410:0370833F0F6A5215,010D582E1F202C2F2938=112935051D:03700F,79192C2E2D715275262322271F201D2136=112935051D:0370110F45510D3371290941614C522623222720,8D3B=152D390921:03047039171A533852443D363F,8D11=0F1B273303:030402111A16175B4F3A2B153E0079015D54528483696A51,7006200F05=0F1B270333:03041A174533302F56795B3E808339528454,700F292026=121E2A3606:037B7C2E2F261F20,0F14=1E2A360612:030270170F45513A2C71295283842A0D532D24252623222720,155A382E1F2F=1B2733030F:03027011170D332D2C2E2F716152838454,010F201F2C=121E2A3606:03027039450D332C2F2D2971528384636626202322,581535=212D390915:03020E0F18110D332C2E2D2F4971293E615244756653,8A202531=1B2733030F:030102703945802D2C512B7129092322270C7566,112E528325=2D39091521:030102062C2E543E3D636679,380D19462971001F=293505111D:03111A171538193E3F,0F632C2E70454F200C19=17232F3B0B:031A2B7915656A,0F177001204529710D632E2F02=32020E1A26:033945302F838475262720,297071000F2E1F3810=17232F3B0B:0339332C2E1575201E26,0F520D631F29712A72473826=390915212D:0339332C2E302B66201D1F27,0D2971010015520F6B0E=15212D3909:03392D2E332F211D201F1E27,0F7015380029710D195824=16223A0A2E:036F791E20,522E1F31=1D29350511:5283845B79037B7C802D2C2E4E302F2B38493D4463664C1F2021,0F0D712917=15212D3909:5283845303702971150D2F,388A6A6D0F2012=111D293505:528384530370331929272E2B2F631F1D20,0F156B380E=0D19253101:528384530339454F0D297115332E2F637520,0F00705802=2A3606121E:528384530339332E152C2F58631F20,380D000F2900=283404101C:528384530003010215392C20,1112180F29560D2E1F754511=15212D3909:5283845300031929150D332C2E63,0F217045208A717521=3505111D29:5283845300010670802D2C2E4E155B201F1E232221,380F71296A0E=17232F3B0B:5283845354037029711575262720,631F58000F2E38010D=111D293505:528384000103451915332C2E631F2720,29716A0D0F7019=1D29350511:5283840001032E1570637566302F391F,0F4729712030=16222E3A0A:5283845479036A2627201E,0F380D70297115012F1A=1F2B370713:528384542E03700F111869565A7566631F1E2021,297138000C31=121E2A3606:52838454443D65002C2E15495D1F,0F417D712B38630F=0D19253101:5283845444360F11756415,2C2F29016B472E2B20381D=212D390915:528384545363000103332E15,0F1F197029710D757D2032=121E2A3606:528384546315332C2E2F26201F2322,0F0D45002971756B17=192531010D:52838454754C2971150301022E,0F63206A0938268A4117=1B2733030F:52848353000103297115332E2F19,0F8A514F6A6620754526=1824300C00:528403395B2F1E20,0F012D=0B17232F3B:5254700001020612692D4E584647336375662E1F1E,71290D262037=131F2B3707:525400045B17791A565D754C7866,2E1F207C34=0F2733031B:483F89,8838=232F3B0B17:767779392623222789,152B1F1D200E=0A16222E3A:767789,528300292025=14202C3808:7665261F20,0F291A=222E3A0A16:7665262322271F201E21,0F0029807124=1824000C30:7889,292E1F24=101C283404:8D,8832=1D29350511:63767789,522E0006206B31=131F2B3707:7B7C343589,0F7038=2632020E1A:7B7C343589,520F20=0E1A260232:7B34,8812=1C28340410:02703918110F7919155283756626232227201E,012C2E1F0C29=121E2A3606:020F11161A17454F2C2E2D302F2B38434C,2070016328=1824300C00:02060418110D332C2E415B637566262322271F20,520F23=142038082C:07504089,0F010C=15212D3909:07262723221F40,0F7129523B=2430000C18:0717363F1A2C4F3A67433D8B,71290F0103471A=2531010D19:0704031118528384542D2E4E49201F1E1D2127,292B000C3B=283404101C:073F7765644889,012014=111D293505:074048261F202322,0F71454F1500018008=111D293505:07404826271F1E2089,882C=0D19253101:07565A5283845463756677261F20,010F15296120=2F3B0B1723:07487677393F89,0F2952151F1D30=111D293505:074889,06520F3808=17232F3B0B:074889,883B=131F2B3707:074889,8832=15212D3909:07762623221F1E20,000F1552296B2F2A=0D19253101:0776776A742623221F200C211D1E,11180F2F5206802B0B=04101C2834:0776776564,000F29382011=101C283404:0706397B7C794C636A48,520F7129472026=14202C3808:077C343589,880A=380814202C:076A79040363660F5D363F,52292E1F20382F15560123=16223A0A2E:076A696819,0F2918=222E3A0A16:076A171552847983546578,712970010F2D=182430000C:076A48,45752F29384C0F204F612B30=131F2B3707:076A7626271F1E20,0D0F29382F2E0E=0814202C38:07343589,065238=1C28340410:070039201F0C2789,06030F292F23=101C280434:076564,0F292002=0D19253101:073918111A17332C2E71292322271F1E20481D45548384,38002F702A=1824300C00:7C343589,8801=172F3B0B23:6A79363F65,0F292B7118=1B2733030F:6A170F19,5845754C201F4F382430=1B2733030F:6A170F1963766F,5452201F32=0C18243000:6A0339332C20528384531563,29713801000F0C47806B3B=2A3606121E:77766564000789,0F52201E8A01=202C380814:1F2027260076232289,0F29528339=0F1B330327:3435,8809=0F1B273303:34357B7C,8818=121E2A3606:34357B7C7789,0F291D=232F3B0B17:34357B7C89,0F2021=33030F1B27:34357B7C89,030F27=390915212D:34357B7C89,712917=1D29350511:3435073989,8802=2C38081420:34357C89,0111180F292006=30000C1824:34357C89,71291A=14202C3808:34357C89,8A2036=182430000C:3435000789,8835=232F3B0B17:34350089,0F2025=3707131F2B:34353989,0F2037=0D25310119:343589,0F52202D=0F1B273303:343589,0F7152290D=131F2B3707:343589,8830=121E2A3606:343589,881C=16222E3A0A:343589,8819=131F2B3707:343589,880F=15212D3909:343589,8832=14202C3808:343589,8813=0D19253101:343589,8811=17232F3B0B:343589,881E=142C380820:017018110F1A2E15495247838463462322271F,8D03=0F1B270333:0103040818111A155284262322271E20217A79708330,38472E631B=14202C3808:010670170F0E3A294152838454262322271F201E,2E1815442C=0F1B273303:01067071292C2E1F20,1103150F520A=17232F0B3B:010670181126271F202165,293816=182430000C:0106111839513A2C2E2D2F8C804B4723221F63,7152292037=0F2733031B:010203040618110F3315292A271D200C6339171A712C2E30491E21,7A21=0E1A260232:010206040318110F2E292A27200C70072C302F541F392B49,381512=1A2632020E:010206110F452C2E7129095B5226232227201F0C,58804B036B2B381C=142C380820:01023918112E2D493E52756624262322271F20,8D12=121E2A3606:008354,06462F2E1F27=030F1B2733:00797084831754,0F2E472D4E1F06=0D19250131:0079701811072C2E01060F33152627200C7A1A302F4576631F2B,8052382900=172F3B0B23:00790F072C2E0103047018111A262322271E7A302F5448637545,293815561E=101C340428:007952151E20,0F2E1F33=0F1B273303:007984831A160F1719,632E20471D6B01=152D390921:0079110F0304062A528423222627207A19701A2C2E2F5D83,294513=0F1B273303:0079181A165B332F2B262322271E2021030469702D4E49712930845D,454F05=152139092D:0079192E2F030417332D1552847A5D,4E201F=162E3A0A22:003826232277,632E20523A=0D19310125:0038262389,521513=1C28340410:00384089,0F202E157C07=04101C2834:00384089,152967631F=101C283404:00384740,0F2037=1C28340410:00387765504089,0F157C04=131F37072B:00385476,521F13=16222E3A0A:003854767789,2E1F522010=131F2B3707:003854637519,205D1D1F52151E210F=121E2A3606:003889,52201F1D4733=121E2A3606:003889,881F=212D390915:001D23221E2789,52290F2E1F202B=07131F2B37:002C7080305C784C62,2E1F472001=283404101C:004D64547589,0F292E=131F2B3707:005040,522E1F0F2C2004=3404101C28:005089,032C2E1F33=182430000C:005089,8815=192531010D:00261F23221E201D2189,8D12=131F2B3707:00261F2322271E200C89,8D1E=121E2A3606:0026271E20,2F2E1F33=16222E3A0A:002627241F1E20232289,8D33=14202C3808:002627651E20232289,881B=182430000C:00262789,292C2E1F2B2F2A=07131F2B37:00262322271F1E203F8B65,52290F038002=15212D3909:001779332D2322271E2007760304,38290F1C=1F2B370713:00173883546365756619,466115201F701D47522434=0D25310119:00170F79191A6540,712909387C2015=0E1A263202:00170F332C2E2D2F802952443F26232227201F,15637C383A=132B37071F:00170F7665776489,8D2A=390915212D:00177689,0F52804F2507=2E3A0A1622:00177179546A76,0F52443D1F2D=0915212D39:0070,0F292C2E791F13=131F2B3707:007083624C,0F38202E7D4F45471F7107=380814202C:00704F0D332C2E2D15363F261F20274C,0F2906036F4703=3404101C28:00702C2E164C157126271F1E202425363F,29386A032B0F=0F1B273303:00700F1715262720,472E386309=15212D0939:007022230726,2E17712952302F15=15212D3909:00704889,8834=1C28340410:0070784889,0345201F21=2D39091521:007007482089,2E1F58470B=0D19253101:0070071A010618110F5B52846775,6326202E=16222E3A0A:00701A17794C0F302F715475,2E454F8A20243A=0F1B330327:007018111A1617192E15382627201F656477,4F090A=0F1B273303:002E2F18110F5B3315292A26271F20210C7A70710102393E19,035A37=14202C3808:002E4344793F26271F20,03702C2F292B381A31=0E1A263202:00161A5D454F153826201E27,7D0D2904=152139092D:0004037039180F332D152952262322271F0C533A83,4117804735=1F2B370713:0004037B7C0F79494766754667,80293869208A1E=162E3A0A22:00040301067018111A0F332C15292A261E200C7A7919712F5D52838454,5617454F06=3404101C28:000403110F527079156523221E2027,0129802E1F6B1D=1830000C24:0004031A170F11332C2E302F1571292A657677451949,70201D5218=102834041C:0004031811171A5B332C2E155D52,0D29204504=17233B0B2F:00040318110F1519262322271E2021,52831F3825=3B0B17232F:00046A7966444C7765,010C202F38520F70292E31=14202C3808:003F261F202789,8836=131F2B3707:003F657789,7152290F032B3A=2632020E1A:003F651F0C2027232289,0F292B=16222E3A0A:003F89,8836=212D390915:000F76,032E1F522C292B22=2B3707131F:000F7765,2E1F7C4607=0F1B273303:000F01111A1615292A2627200C2C670279538384543E49,634512=0F1B273303:000F1320,6380382936=0F2733031B:000F1323222627,2E3829031535=0D25310119:00676589,0F200F=0C18243000:00401D232289,71290F47202B=101C283404:0040395089,8803=30000C1824:004023222089,0F291118470D=0A16222E3A:004089,0F5211=1A2632020E:004089,0F0147200B=3A0A16222E:00037039454F0D332971152C4C48,090F476341382E0A=111D293505:00037039041A26271F1E202322,0F2F2C335129452E0D3A3B=222E3A0A16:000370396A450D332F4B154C,0F208A7D41381F2E14=0F1B273303:00030401061A16170F332E71292627200C02696A45514F0D2C2D4E497A,2B0B=0F1B273303:000304111A33152D2E302F71292A5284530770022B,0F6345203B=0F1B330327:00030418111617332E2D2F292A52845407020D302B,090F452001=0F1B273303:000304080618110F1A2E2D0D3371292A2C302F7566010239454E802B,632039=2430000C18:00036A7415384878,45751F20240F522E834F2E=182430000C:000301394F2E154763751F27,0F707A802629710D192035=14202C3808:0003391983845475,2E1F0F6A702971722A0D04=0F1B270333:00483F,6338200F2A=3B0B17232F:00481F2023221E27262189,0F292C2E1B=122A36061E:0076645089,8819=202C380814:0076777566262322271F201E,0F111852290D=101C283404:00763989,0F2036=1E2A360612:00788B89,0671292E25=010D192531:00784C793989,0F29702E1F208A21=31010D1925:0006261F1E201D212322,0F2938111801=2A3606121E:00060403702C2E4C154947443D651F,0D2920=101C283404:0006522E261F20,0F712939=2632020E1A:00060724232227261F2025,520F157929382F22=31010D1925:0006547677,0F5229151F201B=0E1A320226:00061A161718110F292A0C26271F21797001022F49,470D=0814202C38:002876396577261F20,5283290F37=212D390915:0028397976771E232227,0F522E47442027=121E2A3606:006389,8822=101C280434:007B7C3989,881E=1830000C24:007B343589,8805=2E3A0A1622:00021719792B155D5466774962,010611180F292030=14202C3808:00020370454F0D3933192C2E2D156375261F202322,0F7123=0E1A260232:0002070818111A16175B153E445D5452848365647576,2038454F15=182430000C:0007385476771548,52061F2024=2D39091521:0007504089,0F29157030=15212D3909:0007504089,060F71702F2918=15212D3909:0007504089,880B=17232F0B3B:000770171989,0F2E20382F=0B17232F3B:00077089,522E1F8A202C=07131F2B37:000704036939487C4466,0F7011293821=1824000C30:000715547776,521F18=0E2632021A:0007030401021811171A0F2E2322271F1E706749528483,202F293800=0F1B330327:00077663,0F297138202C=0B17232F3B:000776776548,0F1118152E1F2017=121E2A3606:00077665776489,52830F208A14=1A2632020E:00077B7C4834353989,2952203B=2632020E1A:00076A386563,0F7D8A2066454F52754C15=1E2A360612:00076A0F3874485040,06707C2509=3606121E2A:00076A74504089,5229702C7D15=14202C3808:00076A74173926271F1E20,0F7029522B09=000C182430:00076A54196348767765,7920297115528A0D382B16=101C283404:000734357B7C3989,0F528329200C=06121E2A36:0007343589,290F7104=2E3A0A1622:0007343589,0F292F702012=182430000C:0007343589,0F71296B708003=15212D3909:0007343589,7129706300=0D19310125:0007010618111A332D302F15262322271E530270164C,560F712924=0E1A263202:000701020618111A1752848354230C7027,262038292C=111D293505:0007711F204840,010F29153814=17232F3B0B:00076527262322,1552835A201D0F382D=0D19253101:0007363F8B3989,09292C208A0F28=030F1B2733:000739483F66,0F208A2B0A=04101C2834:0007397B7C343589,0106522008=020E1A2632:0007396A48343589,0F203A=283404101C:00073934357B7C89,0F5223=3505111D29:000739343589,032010=0A16222E3A:000739343589,520F2F=111D293505:000739343589,8A200A=15212D0939:00077A7089,8817=17232F3B0B:000789,8D3B=172F3B0B23:000789,8815=1B2733030F:007C343589,881B=212D390915:007C343589,8812=15212D3909:006A79190F6F2627,6B46204538290B=380814202C:006A38075040,0F630141202B454F2D=121E2A3606:006A5040077448,702B2C0F2F292E=0B17232F3B:006A583F232227261F20,0F291547031C=232F3B0B17:006A6F391974,0F2E614447702C292F71201F38521F=31010D1925:0034353989,522E1F2B=0D19253101:00343589,060F5200=2A3606121E:00343589,7129565A01=131F2B3707:00343589,883B=111D350529:00343589,8800=152D390921:000150402627,0F292F2B1E=2733030F1B:00010F17505840,565A80385283846315=101C283404:000103020611187B7C2D4E616439201E0C26,522E474429=101C283404:0001030239450D297115332C2E4C,0F542070528438632C=101C283404:000103392E54837548,19700F58157A20381F=1830000C24:00010670175B71292A152322271E,03637C2B380F=0E1A263202:0001067052842E71291F20,030F38477533=131F2B3707:0001067011185B0D332C2E2D712909262322271F200C,0F5263250C=17232F0B3B:000106040318111A170F33292A26276A201D0C7A71077C1F1E74694F,520A=0D19253101:0001060403232226380F767754,568020152D=111D293505:000106025B75712904032D302F382B2A0D801E20,2E1F0F0C=0D19253101:00010607155B5C26271E2021165D83,38470F2920=16222E3A0A:000106073018110F3329271E0C7A0D75,3826201508=0F1B273303:00010618111A16332C2E2F2D27200C07483A450D,1552843825=0E1A263202:000102261E2027,03476F700F2971382E39=15212D3909:0001027007834878,2E388A201D17=131F2B3707:00010203450D3329152C2E2F5375,0F638A6A1D382D=0E1A263202:000102030D70332C2E29712F534426201F1E,0F38152F=121E2A3606:0001020370450D332C2E2D152971,0F52838A201D1B=1D29350511:0001020370528384631575712D2E4E3E581F1E1D,292C2B452620803A=222E3A0A16:0001020370392F2971152B54754C,458A1F0F20462C=14202C3808:0001020370392F80712B546675201E26,1F58472E152F=16222E3A0A:000102037039714515750D33,201D381F092E0F1103=32020E1A26:000102030F7039453319152E2D2F63751F0C1E20,71290D38472C=16222E3A0A:000102035270392E2D5863,0F381D2B2921201511=131F2B3707:0001020352666A,0F7020262938172F3A=2430000C18:00010203332C2E2F1558631F,0F1920707A2971264627=05111D2935:0001020311180F702E1F7952838468332D6749443E46630C1E1D21,292B2035=1C28340410:000102031118396375664819,1D4138702080291F=232F3B0B17:000102033945332C6375201D21,0F1929710D702D=101C283404:00010203390D3329152C2B751E20,2E1F54475352458316=111D293505:0001020339161745514F2C190F1A152E2D2F304979,8D13=17232F3B0B:00010203396A79637566201D211E,29387D71707A30=101C283404:000102033911170D3319152E2F0947442627201F,8D25=3505111D29:000102031811392E2D19528384543E4463751F20,152F1A290F0D=0E1A263202:0001020626232227201E,0F2E03801F0F=101C283404:0001020617385483,030F47202B6B1B=2733030F1B:000102060F17705283797823221E2027,2E712910=121E2A3606:000102062A397129797B7C2E1F2425,162F5D20262B=182430000C:0001020603691817452C2E2D498344,412B6A09633808=3A0A16222E:0001020603700F7B7C2E1F692D48302F565A586366240C21,2B151A292039=17232F3B0B:000102060717706A33392D2E4E674447482322271E210C,71292B4F2023=33030F1B27:0001020607036A5D397C2163664744,0F4E25208A08=04101C2834:000102060775261F20,71290F70150C=101C283404:00010206111803302F565A802D4E2B881F261E0C,0D0F521B=16222E3A0A:00010206090D5B7952838454685D7B7C443D77656366201F1E,030F47454F24=010D192531:000102071283542627201D210C4C78,29580F2E6352031F01=32020E1A26:00010275261E0C2322,6303706F0F292E1F19=0E2632021A:000102081A158483262322270C1E,700F292E1B=101C283404:00011A1615262322271F1E200C214C,472B0F1124=3707131F2B:00013974150726271F1E200C,0F06520D297170382B4507=17233B0B2F:000118111A16175B154C26271E200C232279302F5D528384547543,0F297C7A03=17232F3B0B:000118111A332C2E2D1571292A2627200C7A1979,387C02=172F3B0B23:000118111A332C2E2D1571292A23222627200C7A791970302F5D5283845456,387C454F1F=0E1A263202:0001081811171A160F1571292A26271E20396476452B0D,632E523813=15212D3909:00211D1E232289,8D16=0E2632021A:006526232227201F,8926=05111D2935:00657689,6B0F5225=16223A0A2E:00654C89,8D03=2A3606121E:006589,2970472008=15212D3909:001A170F5B332E2D7129261E203E5D,1503528306=152139092D:001A170F1379232227761926,71293833=1C28340410:001A1715838444363F261F1E200C2322,0F476B52036338=14202C3808:001A2B5448701938754C,152E20242510=0D19253101:0039504089,8D39=283404101C:003926271E20747677642322480C06,2E1F38=0F1B273303:0039262322271E201D210C0748766465776A,150F382939=202C380814:0039332C2E2D2F152B4644261F1E,0F7019382971637A31=192531010D:0039787989,1F2E2010=101C283404:0039787089,2E1F8A034F206B29=05111D2935:00398B7989,0F200C=131F2B3707:0039077426271F1E20,0F29713852832B632D=14202C3808:0039076A7426271F2048,0F79197029717A382C=0E1A263202:00397C343548,8929=3B0B17232F:003934357B7C89,0F2028=16222E0A3A:0039343589,8D34=16222E3A0A:0039343589,880B=111D293505:0039343589,8805=17233B0B2F:0039343589,882E=101C283404:0039343589,8806=17233B0B2F:00390103040618111A17332C2E262322271E157A7071302F45631F2075,807C2B=0915212D39:00396577647969271E2322,52012E1F2620612D=16222E3A0A:00391A6A15384C4943363F7448,0F0379472B6319=192531010D:00394C786F89,0F2E442035=182430000C:003989,882A=121E2A3606:003989,8816=13191F252B313701070D:003989,8801=0D19310125:003989,880D=0F1B273303:0018112C2E01040607332D292A09270C2322696870302F47023945,382052801C=101C340428:00190F153917701A48,472E1F200334=1F2B370713:00195475667689,5229152E2019=222E3A0A16:004C504089,0F5215470A=3A0A16222E:005C702C2F802B154C78,5A562E1F208A45466319=102834041C:0089,090F1538=131F2B3707:71297C790001062A0F802D,5215705D2F=0E1A263202:7100030170391959152E2D2F2B,0F201F4F75668A3824=030F1B2733:5483846376656419786A,298030201A=2430000C18:5452838479195D00012A0D7B7C2C2E3348156366242526201E,0F71292D=07131F2B37:54528384700001020339482D301571565A363F637566,06292B201F8A29=030F1B2733:54528384036F796A153E65,7129631D=2733030F1B:5452848303152F802C2D,2E1F208A7A700F29710C7D22=33030F1B27:118384155B20272E1F21,0F03380E=0E1A263202:1179302F842627201E,0071292E1F0E=06121E2A36:11177B7C52842C2E5B1F20,060071292F0F0E=101C283404:110F70528475660D7129,012E1F20262A=101C283404:110F03706A795215636626271E,0C012F38062C292B07=020E1A2632:110F0001702C2E7129201F,52060C=0E1A263202:110F00017052792E1F1E,71290D2B2020=293505111D:110F1A6A702C2E1952838453712F6375,45201500011D=101C340428:11037B7C2E2F7129,0F52200B=0E1A263202:11000170792C2E7129,0F52201F01=111D350529:110001527B7C2E75,0F2009=04101C2834:1100010206702D804E2B2620,0F52540D00=131F2B3707:110001392E1F20,0F712932=17232F3B0B:117154528384292C2E302D4E092A0D50407970443D,5680410023=2B3707131F:111879690001020370396A2E2D528384543E637566,0F380D58292000=222E3A0A16:111879076A1A171523221E272024,5229700F1D012E2B0C2F0B=06121E2A36:111817000106702C2E71292A0D33802D302F4E2B44,0F52252029=07131F2B37:11180F000704030D7C684580302F153867534775,70204119=2430000C18:11180F00012A0D70795D7B7C39332D2C2E4E4863664C,064F478A2037=1E2A360612:11180F000152548471702C2E2D4E303348492A156144474C63,8A201F38450618=202C380814:11180F000128032A0D7129302C2E2F2D802B09411F1E20,5284543824=2F3B0B1723:11180F0001020370391952845329712B632E7B7C792D2C8020,385D151E=293505111D:11180F0001020339700D29716375662E1F2620,3815568016=16222E3A0A:11180F000102587B7C5283847971302F804B2B497675,09612E1F201E=232F3B0B17:11180F00010E715229702E79692C2D2B15093954444C66,2F565A806132=131F2B3707:11180F71297052838454792A0D33802D153853201F1E212627,012F56476628=3707131F2B:11180F71297000010604032A0D793969302F33802D636675,201F52565A1E18=1D29350511:11180F5C000102030D332C2E195329711563261F202322,52843A=202C380814:11180370392A0D3329712C2F156375795B5D,450C8A00382E1F20010C=3A0A16222E:11185283847975661271393D692D15565A201E262322,292F060D0C02=30000C1824:111852838470795B302F404533802D152B39201E23221D212726,0F2E1F010D2923=2D39091521:111852838453546319297115030D332B2C,060F8A2E38201F38=0D19253101:111800020D041A796933483E5347446563751F1D212026,010F09150C17=2430000C18:1118000717161A2C2E3371292B56433D6375363F,0F010347208A09=020E1A2632:111800012A0D2C705271292E201F,1538617904=30000C1824:11180001032A0D70795B2C2E302F802D4E152B33714161201F26,520958470A=000C182430:11180001020439332C2E302F2B5844477515634C1F2721,0F520D19267A2971702037=232F3B0B17:111800010206037939695483845D2D2E4E446375661F262120,0F52290D7123=31010D1925:111800010206071979697C67474475664C,0F16298A2014=182430000C:11187129705B79000106032A0D397B6F7C802D2C2B61756627261E0C1D21,0F2E15414732=192531010D:111871545283842979397B7C69152B2A0D33485324251F1D1E26,6B00702F800C201E=1F2B370713:5D0007363F232227261E21,037C0F471F202E=0E1A263202:6526232227201F,880E=111D293505:653989,8806=131F2B3707:363F6526232227201E89,8832=1A2632020E:1A454F548384,881D=121E2A3606:1A38712975,0F201A=0E1A263202:1A162623227954,0001710F290C=0F1B273303:1A16170F13152654,3852204F32=0F1B273303:1A5D453A332C2E2F4B25262322271F201E1D21,000F704723=2F3B0B1723:3950177089,522E1F0F201A=1D29350511:39701117302F713819297566,004551152C2E201D1F34=121E2A3606:393589,881A=15212D3909:393589,882C=182430000C:393589,8825=101C283404:393589,881C=2531010D19:394089,71294709636F7C440D=0D19253101:3948007889,8D38=2430000C18:394889,8811=111D293505:394889,882A=0E1A263202:3907,8807=0D19253101:39343589,8831=101C283404:393489,8801=222E3A0A16:390050404C89,0F528329692018=131F2B3707:39006A26201F,0F520D38580629712B09=380814202C:390001022C2E302F1575804B2D261F20,0D0F0319707D5229717A15=17232F3B0B:3989,8D11=0A16222E3A:181179838454637566,0F5229012007=111D293505:18117915384C,52200E=0C18243000:1811795B032C2E302F802D4163754C27261E1D2120,010D0F29521F29=16222E0A3A:1811795B5466,01202F=192531010D:181179000607040D03302F5283844F3A45512B1533664C47,090F702E208A2B=0B17232F3B:18117900012C2E5B1F20,0F710D52291A=122A36061E:181179190E332C2E2D52637566262322271F20,8D02=0F1B273303:181117332C2E1526232227201F1E3E,38030F522922=142038082C:181170792C2F7129,52201F=121E36062A:18117001061579,71292023=121E2A3606:18117000012C2E7129,522024=3505111D29:18110F3900010203700D3329711563752E1F0C201D,38525D1A=101C283404:18110F197983842E230C271F1E7A70525463,2620291503=111D293505:1811002E1F8384,0F2022=1824000C30:181100012C2E2F1F,0F3821=142038082C:181100012C2E2F1F20,0F5229=14202C3808:181100015B3875,2E2034=15212D3909:181100012A0D2C2E2F2B2D304E447129841F,0F09416138200F=0814202C38:181100012A0D52842953411E20,2E1F0F47152F=131F2B3707:18110001032A0D845B7129302F791533536678,0F208A1F1D33=17232F3B0B:18115452840001712970802D2C2E302F2B2A0D78791F,0F204758610E=0F1B273303:18111A16175B3315262322271F1E201D215D838454433E363F754551,00030F290D=0C18243000:18115C0001702A2C2E2F5283847129795B6375802D154C,1F208A2407=15212D3909:88,262052830D=17232F3B0B:88,8D17=102834041C:88,8D0B=15212D0939:88,8D24=121E2A0636:88,8D09=17232F0B3B:88,8D13=111D293505:1979,3F2F2E45207D37=112935051D:1966583F6589,8831=16222E3A0A:4C4089,880C=0C18243000:4C78,297172380D2A2E0F47484112=16222E3A0A:5C0F1811790070528471291F20,2F0380512514=1C28340410:5C0001020652835B0E03804B2D4E2B752024210C,292E565A36=1A2632020E:5C11180001027170520D2984832B15200C,03802E386333=15212D3909:89,6B34=111D293505:89,8D",
        TIME_YI_JI: "0D28=,2C2E2128=,2C2E0110=,2C2E0C1F=,2C2E7A701B1C=,01022308=,01026D003026=,000106037A702D02=,000106037A702802=,000106037A703131=,000106037A70341B=,000106087A701F0E=,000106087A702E15=,000106087A702C2E0E39=,000106087A702C2E0D2B=,881727=,88032D=,88352F=,882B2F=,882125=,882A22=,880C1E=,880220=,88161A=,882018=,883422=,880113=,880B11=,883315=,882915=,881F17=,88150D=,88122E=,88302A=,88262A=,883A28=,880826=,881C2C=,881905=,882303=,880F09=,88050B=,883701=,882D01=,88060C=,882410=,881A12=,882E0E=,88380E=,881010=,883630=,881834=,880E38=,882232=,882C30=,88043A=,881E0A=,880006=,883208=,880A04=,881400=,882808=,883137=,883B35=,882737=,881D39=,88133B=,880933=,88251D=,882F1B=,881B1F=,88111D=,880719=,88391B=,88212D=,7A702C0B15=,7A70551515=,7A70552D00=,7A7D2C2E1334=382C,000106083528=382C,7A70000106080504=382C7A6C55700F197120,00010608223A=380006082C,01026D0D2C=380006082C,01027A70551D30=380006082C0F71295283,01027A703636=380006082C0F71295283,0102416D1226=380006082C7A706C550F297120,0102251C=380006082C7A6C55700F197120,01026D2300=3800010608,2C2E0324=3800010608,7A702C2E082E=3800010608,7A70552C2E3B34=38000106082C,2F8026330C=38000106082C,2F80267A701622=38000106082C7A70556C0F197120,1904=38000106082C7A6C55700F197120,1514=38000106087A70556C0F197120,2C2E3138=38000106087A70556C0F197120,2C2E0B10=38000106087A6C55700F197120,2C2E2B28=387A6C55700F197120,000106082C2E2E16=38082C,000106037A700E3A=38082C,000106037A703708=38082C6C550F197120,000106037A701B20=38082C6C550F197120,000106037A70111C=38082C6C550F197120,000106037A703A2D=2C38,000106082733=2C38,000106081015=2C38020F71295283,000106083817=2C2920,7A700F03=2C2920,616D1839=2C292070556C100F,00010608161B=2C2920020F7100010608,302B=2C2920556C0F1971,7A701E07=2C2920010F,1B1B=2C2920010670100F00,352B=2C292000010206100F70,082B=2C292000010206100F707A,0C21=2C292000010870556C100F7A,0617=2C29206C0F1971,7A70552807=2C29207A70556C0F197100010206,122F=2C29207A706C55100F1971,1017=2C29207A706C55100F1971,2731=2C20,616D0436=2C2070550F,7A7D01022E12=2C200F71295283,01021831=2C20556C0F1971,7A702912=2C20100F52,01026D1D33=2C807138152952,000106080E31=2C80713815295270556C100F,000106083201=2C80713815295270556C100F7A,000106080327=2C80713815295202100F,000106037A702B2B=2C80713815295202100F,000106037A702801=2C80713815295202100F,000106083639=2C80713815295202100F7A7055,00010608341D=2C807138152952556C100F,000106037A701B23=2C807138152952010F6C55,7A70302D=2C8071381529520102100F7A7055,2231=2C8071381529520102100F7A6C55,1F13=2C80713815295200010206100F20,7A70313B=2C8071381529526C550F,000106037A701A15=2C8071381529527A70550F,000106080219=2C8071381529527A70556C0F19,000106082E0D=2C80713815295208556C100F,000106037A70161F=2C80711529525670556C100F,000106083813=2C80711529525670556C100F,000106082D05=2C807115295256020F7A706C55,2237=2C80711529525602100F,000106081F0D=2C80711529525602100F55,000106037A702627=2C8071152952560102100F7A706C,2C33=2C8071152952560102100F7A706C,0939=2C80711529525601100F7A7055,416D021F=2C80711529525600010206100F70,0E37=2C80711529525600010870556C10,2129=2C8071152952566C550F,7A702519=2C8071152952566C550F19,7A702417=2C8071152952566C55100F19,000106037A70043B=2C8071152952566C55100F19,000106037A700C1B=2C8071152952566C55100F19,7A703B31=2C8071152952566C100F19,7A705500010603172D=2C8071152952567A70550F,416D3A2F=2C8071152952567A70556C100F,1901=2C8071152952567A706C55100F19,1119=2C8071152952567A6C55700F19,1C2B=2C80711529525608556C100F,000106037A701403=2C80711529525608556C100F,000106037A70071D=2C80711529525608100F55,000106037A701908=292C20,7A7D01026D2E0F=292C200102100F7A7055,032C=292C20000608,0102071C=292C206C550F1971,000106037A700E33=292C207A70556C000108,0503=2920550F,7A702C2E0721=2920556C100F,7A702C1225=2920000108556C100F,7A702C2E1F11=2900010870556C100F7A,032C201A11=297A70556C100F,032C200E35=297A70556C100F,032C20000A=70556C0F197120,7A7D3A29=70556C100F2C20,000106081C25=70556C100F2C20,000106082805=70556C100F2C20,000106082F20=70556C100F2C20,00010608150C=70556C100F29522002,7A7D000106033314=70556C100F,00010608032C20122A=70556C08,7A7D000106032415=70100F2C715220,000106081A0D=4B0F2C20,000106037A701902=4B0F2C20,000106080E3B=4B0F20,7A702C000106032E17=0F2C09382920,7A7000010603363B=0F2C093829206C55,000106037A70082C=0F29528320,7A2C71707D01026D0718=0F712952832C20,7A7D01021C26=0F712952832C20,7A7D01026D3918=0F712952832C2038000608,01027A70552126=0F712952832C2010,01021330=0F712952832C207A7055,01021118=0F712952832C207A7055,01023524=0F715220,7A70552C2E3419=20556C0F1971,7A702C2E1D31=2000010206100F,7A702C1E05=0270290F2C207A,00010608212C=0270550F,00010608032C200C23=0270550F,00010608032C203706=0270550F20,000106082C2E2520=0270550F20,7A7D000106032E13=0270550F202C807115295256,000106081620=020F29528320,000106087A2C71707D0112=020F2952832055,7A2C71707D000106030F08=020F20,7A7055000106032A23=020F712952832C20,2521=020F712952832C20,000106082F21=020F712952832C20,000106080003=020F712952832C20,7A700432=020F712952832C2038000106086C,7A701E03=020F712952832C2070556C10,000106081623=020F712952832C2001,2236=020F712952832C2001,000B=020F712952832C2001,7A70552C36=020F712952832C20013800,416D341E=020F712952832C20017055,7A7D0E32=020F712952832C200110,7A7D0329=020F712952832C2001107A706C55,262D=020F712952832C20017A7055,1229=020F712952832C2000010608,122D=020F712952832C2000010608,1011=020F712952832C2000010608,0A0B=020F712952832C2000010608,1F0F=020F712952832C2000010870556C,1A0E=020F712952832C206C55,7A703312=020F712952832C2010,000106037A70172A=020F712952832C2010,7A7055000106033B3B=020F712952832C2010,416D000106037A700B12=020F712952832C20106C55,000106037A700615=020F712952832C207A7055,3203=020F712952832C207A7055,201B=020F712952832C207A706C5510,2023=020F712952832C207A6C7055,2A1B=020F7129528320,000106087A702C2629=020F7129528320,7A702C2E3709=020F7129528320,7A702C000106083A24=020F7129528320,7A70552C2E341A=020F712952832038000106087A70,2C2E1C2D=020F712952832001,7A702C2E0611=020F712952832001,7A702C2E021A=020F712952832001,7A7D2C2E3815=020F71295283200100,7A702C2E3024=020F71295283200110,616D2C2E093B=020F71295283206C55,7A702C2E000106030505=020F71295283206C55,7A702C030C1A=020F71295283207A706C55,000106082C2E3705=020F712952837A706C55,032C201F0C=02550F20,000106037A700508=02550F20,000106037A703029=02550F20,000106087A702C2E3027=02550F202C807115295256,000106037A703526=02100F2C29528320,000106037A70150E=02100F2C29528320,00010608380F=02100F2C29528320,000106083527=02100F2C29528320,7A70000106031C27=02100F2C2955528320,000106081227=02100F2C29555283207A706C,00010608060F=02100F2C29555283207A706C,000106081D34=02100F7020,7A7D000106030F02=02100F7055528315,2F8026000106083920=02100F7055528315,2F802600010608212A=02100F7055528315,000106082A20=02100F7055528315,000106083A26=02100F7055528315,000106080439=02100F7055528315,000106080008=02100F7055528315,000106081B21=02100F7055528315,00010608071B=02100F7055528315,000106080D24=02100F7055528315,000106082C2E2C32=02100F7055528315,000106082C2E2B2C=02100F7055528315,00010608032C201402=02100F7055528315,00010608032C20391C=02100F7055528315,7A7D000106031F10=02100F705552831538,2F8026000106082D06=02100F70555283157A,2F802600010608290D=02100F20,7A702C000106032416=02100F20,616D000106037A702C34=02100F20292C,7A70000106031C2A=02100F528315,7A7055000106032234=02100F528315,7A7055000106032A21=02100F55528315,000106037A703313=02100F55528315,000106037A700509=02100F55528315,000106037A702D03=02100F55528315,000106037A700613=02100F55528315,000106037A702235=02100F55528315,000106037A70391D=02100F55528315,000106037A70100F=02100F55528315,000106087A702C111B=02100F55528315,000106087A702C2E2916=02100F55528315,7A2C71707D000106030430=02100F55528315,7A2C71707D000106033B32=02100F55528315,7A2C71707D000106081903=02100F55528315,7A702C2E000106033A27=02100F55528315,7A702C000106030931=02100F55528315,7A702C000106030C1C=02100F55528315,7A70000106032735=02100F555283152C8071,000106037A700B13=02100F555283152C807138,000106037A701517=02100F555283152C807138,000106037A702917=02100F555283156C,000106037A703136=550F522010,7A2C71707D01022A1E=550F715220,7A702C2E1333=550F715220,7A702C2E000106081405=556C,000106087A702C2E0433=556C,7A70000106083B38=556C0F197120,7A702C2E1E01=556C0F19712001,7A702C2E190B=556C000108,7A70230B=556C000108,7A702C2E1A0F=556C0001082C807115295256,7A701830=556C0008,7A2C71707D01023814=556C100F295220,7A2C71707D03082F=556C100F295220,7A702C0C1D=556C100F295220,7A702C2E00010603021D=556C100F295220,7A70000106031121=556C100F2952202C,7A701835=556C100F2952202C80713815,000106037A703B30=556C100F29522002,000106037A70290C=556C100F29522002,7A70000106030930=556C100F2952200238,000106037A702B27=556C100F2952200102,7A702C2E3812=556C08,000106037A701012=556C08,000106037A701621=556C08,7A702C2E000106033209=556C08,7A702C2E000106032021=556C082C807138152952,000106037A700009=556C082C807138152952,000106037A702A1D=807138152952000170100F,032C200A05=807138152952000170100F,032C20273B=8071381529527A706C550F,032C203423=80711529525600010870556C100F,032C201511=80711529525600010870556C100F,032C20183B=80711529525600010870556C100F,032C203311=010F2C80093829206C55,7A702B29=010F2C80093829206C55,7A70616D3A25=010F2C09382920,7A70550825=010F2C093829207A6C5570,201E=010F09382920,7A702C2E352E=010670100F2C71522000,1C28=010670100F7152207A6C55,2C2E2E11=0106100F7152,7A70032C203205=0106100F71526C,7A70032C202A19=0102290F20,7A702C2E2A1F=010270290F2C207A6C55,2413=010270290F2C207A6C55,0437=010270290F2C207A6C55,0935=010270550F,032C201B18=010270550F20,2B24=010270550F20,2F80261906=010270550F20,2C2E2732=010270550F20,2C2E071A=010270550F20,2C2E3700=010270550F20,7A7D1724=010270550F203800,2F80263921=010270550F202C29,416D290F=010270550F202C807138152952,1619=010270550F202C8071381529527A,3207=010270550F202C80711529525600,0829=010270550F2000,060D=010270550F2000,0001=010270550F2000,2736=010270550F207A,1B1E=010270550F207A,2C2E140B=010270550F207A6C,0114=010270550F7A6C,032C202C3B=010270550F7A6C,032C20201F=0102550F20,7A702C1A13=0102550F20,7A702C3637=0102550F20,7A702C280B=0102550F20,7A702C223B=0102550F20,7A702C032D04=0102100F2C29528320,7A701409=0102100F2C29528320,7A70552307=0102100F2C2952832000,0005=0102100F295283,032C207A700A00=0102100F2955528320,7A2C71707D082D=0102100F2955528320,7A702C2E2809=0102100F295552832000,7A702C2E2B2D=0102100F7055528315,021E=0102100F7055528315,0C20=0102100F7055528315,2F80263420=0102100F7055528315,2F80261510=0102100F7055528315,2F80262E10=0102100F7055528315,2F80262806=0102100F7055528315,2F80263134=0102100F7055528315,2F80261D38=0102100F7055528315,2F8026251A=0102100F7055528315,2F80263A2A=0102100F7055528315,2F80267A7D1120=0102100F7055528315,2F80267A7D0824=0102100F7055528315,2C2E1E00=0102100F7055528315,2C2E7A2F1D=0102100F7055528315,032C200A06=0102100F7055528315,7A7D2C2E1C2E=0102100F70555283153800,2F80261832=0102100F70555283153800,2C2E280A=0102100F70555283153800,2C2E320A=0102100F705552831538007A,2738=0102100F705552831538007A6C,2F80260720=0102100F705552831538007A6C,2F8026032B=0102100F70555283152C292000,1907=0102100F70555283152C292000,3703=0102100F70555283152C292000,2739=0102100F70555283152C29207A,251B=0102100F70555283152C29207A,2B25=0102100F70555283152C29207A6C,1331=0102100F70555283152C207A,0D29=0102100F70555283152C80717A,1B1D=0102100F70555283158071,032C200D2D=0102100F705552831500,1725=0102100F705552831500,352D=0102100F705552831500,0C19=0102100F705552831500,150F=0102100F705552831500,3025=0102100F705552831500,0F07=0102100F705552831500,1E09=0102100F705552831500,251F=0102100F705552831500,010C=0102100F705552831500,2F80261A10=0102100F705552831500,2F80261016=0102100F705552831500,2F80260934=0102100F705552831500,2F80262910=0102100F705552831500,2F80267A7D1A14=0102100F705552831500,2C2E2304=0102100F705552831500,7A7D3421=0102100F7055528315002C2920,212F=0102100F7055528315002C807138,111F=0102100F7055528315002C807138,3135=0102100F7055528315008071,032C200828=0102100F7055528315007A6C,2022=0102100F70555283156C,7A7D140A=0102100F70555283156C,7A7D2C2E2127=0102100F70555283157A,1618=0102100F70555283157A,0B0F=0102100F70555283157A,1836=0102100F70555283157A,172E=0102100F70555283157A,2F8026352A=0102100F70555283157A,2F80262B2E=0102100F70555283157A,2F8026082A=0102100F70555283157A,2F80262306=0102100F70555283157A,2F80263702=0102100F70555283157A,2F80262C38=0102100F70555283157A,2F80261E06=0102100F70555283157A,2F80261B1A=0102100F70555283157A,2F8026032A=0102100F70555283157A,2C2E1F14=0102100F70555283157A,2C2E3810=0102100F70555283157A,2C2E262C=0102100F70555283157A29,032C20201A=0102100F70555283157A00,2F80260A02=0102100F70555283157A00,2F80261838=0102100F70555283157A6C,2F80260E34=0102100F70555283157A6C,2F80260438=0102100F70555283157A6C,2C2E2F1A=0102100F70555283157A6C,2C2E2305=0102100F528315,7A70553525=0102100F5283152C8071,7A70550723=0102100F528315807138,7A7055032C200D2A=0102100F55528315,2F80267A2C71707D3316=0102100F55528315,2F80267A2C71707D1224=0102100F55528315,2F80267A2C71707D212E=0102100F55528315,2F80267A700616=0102100F55528315,2F80267A70380C=0102100F55528315,2F80267A700434=0102100F55528315,2F80267A702A18=0102100F55528315,7A2C71707D2628=0102100F55528315,7A2C71707D100C=0102100F55528315,7A2C71707D2F80261729=0102100F55528315,7A701F15=0102100F55528315,7A70240E=0102100F55528315,7A703632=0102100F55528315,7A701339=0102100F55528315,7A700115=0102100F55528315,7A702C2C37=0102100F55528315,7A702C320B=0102100F55528315,7A702C3206=0102100F55528315,7A702C2E2238=0102100F55528315,616D2F80267A2C71707D3816=0102100F555283153800,2F80267A701406=0102100F555283153800,2F80267A700111=0102100F555283152C8071,7A700501=0102100F555283152C8071,7A70370B=0102100F555283152C807138,7A703B37=0102100F555283152C80713800,7A701C2F=0102100F555283152920,7A702C240F=0102100F555283152920,7A702C0A03=0102100F555283152920,7A702C0221=0102100F55528315292000,7A702C2E3317=0102100F55528315292000,7A702C2E3634=0102100F5552831500,2F80267A2C71707D3028=0102100F5552831500,7A2C71707D111A=0102100F5552831500,7A2C71707D071E=0102100F5552831500,7A2C71707D2913=0102100F5552831500,7A702F19=0102100F5552831500,7A702301=0102100F5552831500,7A702C3919=0102100F5552831500,7A702C3B33=0102100F5552831500,7A702C2E0223=0102100F5552831500,7A702C03032F=0102100F55528315006C,7A702C2E262E=0102100F555283156C,2F80267A70032E=0102100F555283156C,7A2C71707D0F0B=0102100F555283156C,7A701D3B=0102100F555283156C,7A702C2E030116=01100F1571292C20,2F80267A703200=01100F1571292C20,7A7055370A=01100F1571292C2000,7A701B22=01100F1571292C2000,7A701E04=01100F1571292C2000,416D1336=01100F1571292C20007A70556C,391A=01100F1571292C20007A6C7055,1C24=01100F1571292C207A7055,2F80260D2E=01100F15712920,7A702C2E2D0A=01100F15712920,7A702C2E2800=01100F15712920027A7055,2C2E251E=01100F157129207A70556C,2C2E1228=01100F157129207A70556C,416D2C2E050A=01100F5220,7A70550000=01100F5220,616D2624=01100F5220,616D2F80267A702804=01100F5220006C,7A70550F06=01100F52207A70556C,2C2E2F1E=01100F52207A70556C,2C2E1014=01100F527A70556C,032C20161E=01100F712920,7A702C2E0A0A=01100F71522C2920,616D161C=0070100F292C20,01020F04=0006100F7020,7A7D01026D183A=0006100F7020,616D0102201C=0006100F20,7A2C71707D01026D1D37=000170100F292C20,2F18=000170100F292C802038,161D=00014B0F,032C201338=00014B0F2C2002,2F80261728=00014B0F20,2C2E0F0A=00014B0F20,7A2C71707D1833=00014B0F20,7A702C1407=00014B0F20,7A702C1401=0001060838,2C2E1123=0001060838,416D032C202019=000106082C38,2C31=000106082C38,391F=000106082C38,2523=000106082C38,7A70416D1C29=000106082C38020F71295283,3811=000106082C38020F71295283,7A700937=000106082C386C550F197120,7A700117=00010252100F29202C7A706C55,1337=00010206700F202C807138152952,3A2E=00010206100F7020,616D0610=00010206100F20,7A2C71707D0328=00010206100F20,7A700F01=00010206100F20,7A702C3310=00010206100F20,7A702C2E3139=0001100F298020,7A702C2625=00010870556C100F2C20,1909=00010870556C100F2C20,391E=00010870556C100F2C20,2124=00010870556C100F2C20,2F80267A7D0F00=00010870556C100F2C2038,2D09=00010870556C100F2C2002,0500=00010870556C100F2C207A,2C39=00010870556C100F2C207A,2518=00010870556C100F2C207A,0B0C=00010870556C100F2C207A,2F80262911=00010870556C100F7A,032C200007=000108556C100F2C2029,7A700A07=000108556C100F2C2029,7A701332=000108556C100F20,2C2E7A70100D=000108556C100F20,7A702C2E2239=000108556C100F20,7A702C2E0A01=000108556C100F20,7A702C2E380D=0001086C100F2C20,7A70551D36=0001086C100F2C20,7A70552F1F=000108100F70552920,010D=000108100F70552920,616D0507=000108100F705529202C80713815,0B0D=000108100F705529202C8071157A,3133=000108100F7055292002,2309=000108100F7055292002,416D0002=000108100F705529207A,2F80263202=000108100F705529207A,2F80263638=000108100F705529207A,2C2E2A1A=000108100F705529207A38,2F80262414=000108100F705529207A6C,2C2E2E14=000108100F552920,7A2C71707D1404=000108100F552920,7A2C71707D0B17=000108100F552920,7A70330D=000108100F552920,7A702C172F=000108100F552920,7A702C2E3707=000108100F5529206C,616D7A702C2E302E=6C55700F197120,2C2E7A7D0C22=6C55700F197120,7A7D01026D1E02=6C550F297120,000106037A703923=6C550F297120,7A702C2E03230A=6C550F1920,7A2C71707D240C=6C550F19200210,7A2C71707D000106031A16=6C550F197120,000106037A701513=6C550F197120,7A703A2B=6C550F197120,7A701837=6C550F197120,7A702F23=6C550F197120,7A702F22=6C550F197120,7A702D07=6C550F197120,7A702C2E3922=6C550F197120,7A700102093A=6C550F197120,7A70000106031B19=6C550F197120,616D7A70071F=6C550F197120,616D7A702C2E212B=6C550F197120,616D7A702C2E000106032734=6C550F197120292C,000106037A700325=6C550F1971200001020610,7A702C122B=6C550F19712008,000106037A702411=6C100F2952,7A7055032C20010E=100F2C29528320,01023704=100F2C29528320,0102363A=100F292C206C55,000106037A702B26=100F2920,7A2C71707D01026D302C=100F7055528315,01021E08=100F7055528315,01022730=100F7055528315,01021512=100F7055528315,010200352C=100F7055528315,7A7D01026D2F1C=100F7055528315,7A7D01026D0222=100F70555283153800,01026D2412=100F70555283157A,01022230=100F70555283157A,0102060E=100F70555283157A6C,01022C3A=100F70555283157A6C,01026D1F12=100F1571292C20,01026D3B36=100F1571292C20,01026D1516=100F1571292C20,000106037A702302=100F1571292C20,000106037A701D32=100F1571292C20,000106082F8026330E=100F1571292C20,000106086D2A1C=100F1571292C20,7A7001026D313A=100F1571292C20,7A7000010603341C=100F1571292C20,416D7A70000106032B2A=100F1571292C2002,000106037A700326=100F1571292C20556C,000106037A70273A=100F1571292C2000,01026D0722=100F1571292C2000,01026D2E0C=100F1571292C206C55,000106037A701408=100F1571292C207A706C55,01022020=100F1571292C207A706C55,000106081726=100F1571292C207A6C7055,0102290E=100F1571292C207A6C7055,000106080932=100F1571292C207A6C7055,000106080D26=100F52,00010608032C20100E=100F5283153800,01027A70550B16=100F5220,2F8026000106081122=100F5220,6D010200133A=100F5220,01026D1F16=100F5220,000106037A703132=100F5220,000106083B3A=100F5220,000106082522=100F5220,00010608190A=100F5220,000106082C2E021C=100F5220,7A70000106030936=100F52202C,01026D3A2C=100F52206C55,01027A701A0C=100F52206C55,000106037A700E30=100F52206C55,000106037A700A08=100F52207A706C55,000106083204=100F52207A6C5570,01026D0B0E=100F55528315,01027A2C71707D0004=100F55528315,7A2C71707D01026D1D3A=100F55528315,7A2C71707D01026D3418=100F5552831500,7A2C71707D0102201D=100F712920,7A702C2E00010608030E36=100F71522C2920,01023635=100F715229,00010608032C20021B=7A70550F2C715220,1900=7A70550F715220,2C2E0A09=7A70556C,00010608172C=7A70556C,00010608032C200B14=7A70556C,00010608032C202914=7A70556C0F197120,2C2E0938=7A70556C0F197120,000106082C2E111E=7A70556C000108,0502=7A70556C000108,2F80260D2F=7A70556C0001082C807138152952,2D0B=7A70556C0001082C807138152952,3633=7A70556C0001082C807115295256,0C18=7A70556C0008,01020218=7A70556C0008,0102302F=7A70556C100F295220,000106082C35=7A70556C100F295220,000106081E0B=7A70556C100F2952202C807115,3130=7A70556C100F29522002,000106080506=7A70556C100F29522001,2C2E330F=7A70556C100F29522001022C8071,010F=7A70556C100F295220010200,0435=7A70556C100F295280713815,032C200614=7A70556C100F295201,032C20122C=7A70556C100F29520102,032C203B39=7A706C550F297120,0F05=7A706C550F297102,032C200D25=7A706C550F19712001,616D2233=7A706C550F19712000010608,2626=7A6C70550F197120,01021A17=7A6C70550F197120,00010608262F=7A6C70550F1971202C29,000106083529=7A6C70550F19712002,616D000106082D08=7A6C70550F197120103800,0102341F=7A6C55700F197120,2C2E172B=082C38,7A7055000106030D27=082C38,7A70000106030827=08556C100F2C20,000106037A702803=08556C100F2C20,000106037A701013=08556C100F2C20,7A7000010603262B=08556C100F2C20,7A7000010603240D=08556C100F2C20,7A70000106033631=08556C100F2C20,7A70000106030431=08556C100F20,7A702C2E000106031D35=08100F552920,000106037A701335=08100F552920,000106037A700612=08100F55292038,000106037A70",
        SHEN_SHA: [
          "{s.none}",
          "{sn.tianEn}",
          "{sn.mingFei}",
          "{sn.muCang}",
          "{sn.buJiang}",
          "{sn.siXiang}",
          "{sn.mingFeiDui}",
          "{sn.wuHe}",
          "{sn.sanHe}",
          "{sn.chuShen}",
          "{sn.yueDe}",
          "{sn.yueKong}",
          "{sn.yueDeHe}",
          "{sn.yueEn}",
          "{sn.shiYin}",
          "{sn.wuFu}",
          "{sn.shengQi}",
          "{sn.jinKui}",
          "{sn.xiangRi}",
          "{sn.yinDe}",
          "{sn.liuHe}",
          "{sn.yiHou}",
          "{sn.qingLong}",
          "{sn.xuShi}",
          "{sn.mingTang}",
          "{sn.wangRi}",
          "{sn.yaoAn}",
          "{sn.guanRi}",
          "{sn.jiQi}",
          "{sn.fuDe}",
          "{sn.liuYi}",
          "{sn.jinTang}",
          "{sn.baoGuang}",
          "{sn.minRi}",
          "{sn.linRi}",
          "{sn.tianMa}",
          "{sn.jingAn}",
          "{sn.puHu}",
          "{sn.yiMa}",
          "{sn.tianHou}",
          "{sn.yangDe}",
          "{sn.tianXi}",
          "{sn.tianYi}",
          "{sn.siMing}",
          "{sn.shengXin}",
          "{sn.yuYu}",
          "{sn.shouRi}",
          "{sn.shiDe}",
          "{sn.jieShen}",
          "{sn.shiYang}",
          "{sn.tianCang}",
          "{sn.tianWu}",
          "{sn.yuTang}",
          "{sn.fuSheng}",
          "{sn.tianDe}",
          "{sn.tianDeHe}",
          "{sn.tianYuan}",
          "{sn.tianShe}",
          "{sn.tianFu}",
          "{sn.yinShen}",
          "{sn.jieChu}",
          "{sn.wuXu}",
          "{sn.wuLi}",
          "{sn.chongRi}",
          "{sn.fuRi}",
          "{sn.xueZhi}",
          "{sn.tianZei}",
          "{sn.tuFu}",
          "{sn.youHuo}",
          "{sn.baiHu}",
          "{sn.xiaoHao}",
          "{sn.zhiSi}",
          "{sn.heKui}",
          "{sn.jieSha}",
          "{sn.yueSha}",
          "{sn.yueJian}",
          "{sn.wangWang}",
          "{sn.daShi}",
          "{sn.daBai}",
          "{sn.xianChi}",
          "{sn.yanDui}",
          "{sn.zhaoYao}",
          "{sn.jiuKan}",
          "{sn.jiuJiao}",
          "{sn.tianGang}",
          "{sn.siShen}",
          "{sn.yueHai}",
          "{sn.siQi}",
          "{sn.yuePo}",
          "{sn.daHao}",
          "{sn.tianLao}",
          "{sn.yuanWu}",
          "{sn.yueYan}",
          "{sn.yueXu}",
          "{sn.guiJi}",
          "{sn.xiaoShi}",
          "{sn.tianXing}",
          "{sn.zhuQue}",
          "{sn.jiuKong}",
          "{sn.tianLi}",
          "{sn.diHuo}",
          "{sn.fourHit}",
          "{sn.daSha}",
          "{sn.gouChen}",
          "{sn.baZhuan}",
          "{sn.zaiSha}",
          "{sn.tianHuo}",
          "{sn.xueJi}",
          "{sn.tuHu}",
          "{sn.yueXing}",
          "{sn.chuShuiLong}",
          "{sn.diNang}",
          "{sn.baFeng}",
          "{sn.siFei}",
          "{sn.siJi}",
          "{sn.siQiong}",
          "{sn.wuMu}",
          "{sn.yinCuo}",
          "{sn.siHao}",
          "{sn.yangCuo}",
          "{sn.guChen}",
          "{sn.xiaoHui}",
          "{sn.daHui}",
          "{sn.baLong}",
          "{sn.qiNiao}",
          "{sn.jiuHu}",
          "{sn.liuShe}",
          "{sn.tianGou}",
          "{sn.xingHen}",
          "{sn.liaoLi}",
          "{sn.suiBo}",
          "{sn.zhuZhen}",
          "{sn.sanSang}",
          "{sn.sanYin}",
          "{sn.yinDaoChongYang}",
          "{sn.yinWei}",
          "{sn.yinYangJiaoPo}",
          "{sn.yinYangJuCuo}",
          "{sn.yinYangJiChong}",
          "{sn.guiKu}",
          "{sn.danYin}",
          "{sn.jueYin}",
          "{sn.chunYang}",
          "{sn.yangCuoYinChong}",
          "{sn.qiFu}",
          "{sn.chengRi}",
          "{sn.guYang}",
          "{sn.jueYang}",
          "{sn.chunYin}",
          "{sn.daTui}",
          "{sn.siLi}",
          "{sn.yangPoYinChong}"
        ],
        DAY_SHEN_SHA: [
          ";000002300F14156869717A3F;01001617495C40413C425D6A;0209000C041831031906054A5E6B4B5F;033500041A1B032C06054C4D4E60;04002D321C1D1E104F50615152;05111F53546C55433C3E;062E200721220D01566E44;070B2333242F45;08360A2526242F080157583D59;091234080162463C3D5A;0A270728292A5B6364653F79;0B0237130E2B4748727A3E66;0C09020C04300F0314150568696D;0D3504031617495C40413C6F425D6A;0E38183119064A5E6B4B5F;0F001A1B032C064C4D4E60;10002D321C1D1E104F50615152;110B00111F53546C55433C3E;12360A002E200721220D015644;13002333456D;142526242F080157583F3D59;15001234080162463C3D5A;16090004270728292A5B636465;17350204130E032B47483E66;1802300F14156869;19031617495C40413C425D6A;1A1831031906054A5E6B4B5F;1B0B1A1B032C06054C4D4E;1C360A2D321C1D1E104F50615152;1D111F53546C55433C3E;1E2E200721220D01563F44;1F23334573;20090C042526242F080157583D;2135041234080162463C3D5A;22270728292A5B636465;2302130E032B47483E66;2402300F0314150568696E;250B031617495C40413C425D6A;26360A18311906054A5E6B4B5F;271A1B2C06054C4D4E60;282D321C1D1E104F506151523F;29111F53546C55433C3E;2A090C042E200721220D015644;2B350423334567;2C2526242F0857583D59;2D001234080162463C3D5A;2E00270728292A5B63646574;2F0B0002130E032B47483E66;30360A0002300F141505686975;31001617495C40413C425D6A676D;3218311906054A5E6B4B3F675F76;331A1B2C06054C4D4E60;34090C042D321C1D1E104F50615152;353504111F53546C55433C6F3E;362E200721220D5644;3723334567;382526242F08015758703D6759;390B123408016246703C3D5A84;3A360A270728292A5B636465;3B02130E2B47483E66;",
          ";00090002272A536C4C4D4E41717A;0100300F3103233C6151523F66;020004180E032406150543405D;03000C041A1D340617054A5E6B4F50;04002D1B555F;050B112526321C2B3C42654B3E60;060A2E2014100547546246;0712070D161F566A;0822192F0148453D44;092C083301575868695B633C3D;0A0937131E495C6459;0B020721282903727A3F3E5A;0C020427032A05536C4C4D4E416D;0D0C04300F03233C6F61515266;0E38180E24061543405D;0F0B001A1D3406174A5E6B4F5078;100A002D1B555F;1100112526321C2B3C42654B3E60;12002E2014100147546246;130012070D161F566A6D;140922192F080148453D44;152C083301575868695B633C3F3D44;160413031E495C6459;17020C0407212829033E5A;1802272A536C4C4D4E41;190B300F3103233C61515266;1A0A180E032406150543405D;1B1A1D340617014A5E6B4F50;1C2D1B555F;1D112526321C2B3C42654B3E60;1E092E2014100147546246;1F12070D161F56736E6A3F;200422192F080148453D44;210C042C083301575868695B633C3D;22131E495C6459;230B0207212829033E5A;240A0227032A05536C4C4D4E41;25300F31233C61515266;26180E2406150543405D;271A1D340617054A5E6B4F50;28092D1B555F;29112526321C2B3C42654B3F3E60;2A042E2014100147546246;2B0C0412070D161F566A67;2C22192F0848453D44;2D0B002C083301575868695B633C3D85;2E0A0013031E495C6459;2F0002072128293E5A;300002272A05536C4C4D4E4175;3100300F31233C6151526E676D66;3209180E2406150543405D;331A1D340617054A5E6B4F503F76;34042D1B555F;350C04112526321C2B3C6F42654B3E60;362E20141047546246;370B12070D161F566A67;380A22192F08014845703D6744;392C083301575868695B63703C3D74;3A131E495C6459;3B02072128293E5A;",
          ";00000207282931032B717A6E5D59;01000314473C5A;020A000427182526300F1D16062A054F506A;03360B00041A1906055562464066;04002D2C154A5E6B6C733F788B;0512111B0E1E17483C3E;060C2E20321C016869655F;0753544960;08350907210D230810015B63564B3D77;091324081F014C4D4E453C423D;0A2203342F57586461515244;0B02032C4341727A3E;0C0A020407282931032B055D6D59;0D360B040314473C6F5A;0E3827182526300F1D16062A4F506A3F;0F001A19065562464066;10000C2D2C154A5E6B6C86;110012111B0E1E17483C3E;123509002E20321C0168696E655F;13005354495C6D60;1407210D230810015B63564B3D7F;1537130324081F014C4D4E453C423D;160A042203342F57586461515244;17360B0204033343413E;1802072829312B5D3F59;190314473C5A;1A0C27182526300F1D16062A054F506A;1B1A1906055562464066;1C35092D2C154A5E6B6C;1D12111B0E1E17483C3E;1E2E20321C016869655F;1F5354495C60;200A0407210D230810015B63564B3D80;21360B04130324081F014C4D4E453C423D;2222342F5758646151523F44;2302033343413E;24020C072829312B055D59;2514473C5A;26120927182526300F1D16062A054F506A;271A1906055562464066;282D2C154A5E6B6C76;2912111B0E1E17483C3E;2A0A042E20321C016869655F;2B360B045354495C6760;2C07210D2308105B63564B3F3D77;2D00130324081F014C4D4E453C423D;2E000C22342F57586461515244;2F00023343413E;3035090002072829312B05755D59;310014473C676D5A;3227182526300F1D16062A054F506A67;331A1906055562464066;340A042D2C154A5E6B6C;35360B0412111B0E1E17483C6F3E;362E20321C6869653F5F;375354495C6760;380C07210D230810015B6356704B3D677774;391324081F014C4D4E45703C423D;3A350922342F57586461515244;3B023343413E;",
          ";000A00220362463C44;010B00072128291D334F50645D;02360002230605534855423F59;03000212300F24060568695A;0400042E27342A495C403C8C;050C04184A5E6B3E66788D76;06091A1B2B15014C4D4E;07352D321C14175B636151526577;0811130E16080147546C433C6A3D5F;0920070D190801563D60;0A0A032C2F104541;0B0B252631031E1F57584B3E;0C362203056246717B3C3F6D44;0D072128291D334F50645D;0E020423065348554259;0F00020C0412300F240668696E5A;1009002E12342A495C403C;113500184A5E6B3E66;12001A1B2B15014C4D4E;13002D321C14175B63615152656D77;140A11130E0316080147546C433C6F6A3D5F;150B20070D03190801563D60;1636032C2F104541733F;17252631031E1F5758727B4B3E;1804220362463C44;190C04072128291D334F50645D;1A09022306055348554259;1B3502120D0F24060568695A;1C2E27342A495C403C;1D184A5E6B3E66;1E0A381A1B2B15014C4D4E;1F0B2D321C14175B63615152657F;20363711130E0316080147546C433C6A3F3D5F;2120070D03190801563D60;2204032C2F104541;230C042526311E1F57584B3E;2409220562463C44;2535072128291D334F50645D;26022306055348554259;270212300F24060568695A;280A2E27342A495C403C6F;290B184A5E6B3E66;2A361A1B2B15014C4D4E3F81;2B2D321C14175B6361515265678074;2C0411130E03160847546C433C6A3D5F;2D000C0420070D190801566E3D60;2E09002C2F104541;2F35002526311E1F57584B3E;300022056246703C44;3100072128291D334F50645D676D;320A02230605534855426759;330B02120D0F2406056869755A;34362E27342A495C403C3F;35184A5E6B3E6676;36041A1B2B154C4D4E81;370C042D321C14175B6361515265677774;380911130E16080147546C433C6A3D675F;393520070D190801563D60;3A2C2F104541;3B2526311E1F5758704B3E87;",
          ";00001D2F10575868694F503C;0100122B1F495C5564;0209000207222829140605655D44;03000216063305474C4D4E51526A4B3F;04000C042E300F193C6159;0504182C43403E5A;06271A1E2A014A5E6B6C5B6342;070B2D1B1366;080A112526321C0815013C3D;0920032308170153546246413D;0A07210D310324565F;0B0E033448453E60;0C091D2F1005575868694F50717B3C6D;0D122B1F495C553F;0E020C04072228291406655D44;0F000204160633474C4D4E51526A4B;10002E300F193C6159;110B00182C43403E5A;120A00271A1E2A014A5E6B6C5B6342;13002D1B13036D66;14112526321C030815013C6F3D;1520032308170153546246413D;160907210D31032456735F;170E344845727B3F3E60;180C041D2F10575868694F503C;1904122B1F495C5564;1A0207222829140605655D44;1B0B0216063305474C4D4E51526A4B;1C0A2E300F193C6159;1D182C43403E5A;1E38271A1E2A014A5E6B6C5B6342;1F2D1B130366;2009112526321C030815013C3D;21202308170153546246413F3D;220C0407210D3103565F;23040E3448453E60;241D2F1005575868694F503C;250B122B1F495C5564;260A0207222829140605655D44;270216063305474C4D4E51526A4B;282E300F193C6F616E59;29182C43403E5A;2A09271A1E2A014A5E6B6C5B63427988;2B372D1B133F6766;2C0C04112526321C0308153C3D;2D0004202308170153546246413D;2E0007210D3124565F;2F0B000E3448453E60;300A001D2F1005575868694F50703C89;3100122B1F495C5564676D;320207222829140605655D6744;330216063305474C4D4E7551526A4B;34092E300F193C6159;35182C43403F3E5A;360904271A1E2A4A5E6B6C5B634278;37042D1B136766;38112526321C0815013C3D67;390B202308170153546246413D;3A0A07210D3124566E5F;3B0E03344845703E60;",
          ";003509001E2F554C4D4E453C51525D5F;010057586C646160;0200020E06100543;0300020721282923061F0565;0400042E2224533C7344;05360B04182526300F34335B633F3E74;060A1A13016246404B59;070C2D2B4A5E6B5A;0827111B0314082A0148413C3D;0920321C310316080148413C3D;0A35090319154754495C42;0B12070D1D2C174F50563E;0C1E2F05554C4D4E45717B3C51525D6D5F;0D57586C646160;0E02040E061043;0F360B0002040721282923061F653F;100A002E2224533C44;11000C182526300F34335B633E;12001A1303016246404B59;13002D032B4A5E6B6D5A;14350927111B0314082A0148413C6F3D;1520321C310316080168696A3D66;1619154754495C426E;1712070D1D2C174F5056727B3E;18041E2F554C4D4E453C51525D5F;19360B0457586C64613F60;1A0A020E06100543;1B020C0721282923061F0565;1C2E2224533C44;1D182526300F34335B633E;1E3509381A1303016246404B59;1F2D032B4A5E6B5A;2027111B14082A0148413C3D;2120321C3116080168696A3D66;22040319154754495C42;23360B0412070D1D2C174F50563F3E;240A1E2F05554C4D4E453C51525D5F;250C57586C646160;26020E06100543;27020721282923061F0565;2835092E2224533C6F44;29182526300F34335B633E;2A1A13016246404B5982;2B2D2B4A5E6B675A76;2C0427111B0314082A48413C3D;2D360B000420321C3116080168696A3F3D66;2E0A0019154754495C42;2F000C12070D1D2C174F50563E;30001E2F05554C4D4E45703C51525D5F;310057586C6461676D608E;323509020E0610054367;33020721282923061F057565;342E2224533C6E44;35182526300F34335B633E7974;3637041A13036246404B5982;37360B042D2B4A5E6B3F675A76;380A27111B14082A0148413C3D67;390C20321C3116080168696A3D66;3A0319154754495C42;3B12070D1D2C174F5056703E;",
          ";0000302007210D341556;01000217455D;020A0025262B2F060557586C5F;030B001406056246603C8F;0436000207282916105B6364656A;0537130E191F47483E;0622300F2C0168693F44;07021E33495C40413C;08090C04184A5E423D59;093504121A1B0308014C4D4E51524B3D5A;0A02272D321C1D232A4F507E61;0B1124535455433E66;0C0A2E2007210D341505566D;0D0B0217455D;0E3625262B2F0657586C;0F00140662463C4260;10000207282916105B6364656A3F79;1100130E191F47483E;1209350C0422300F032C01686944;1335000204031E33495C40413C6D;1418310308014A5E6B3D59;15121A1B0308014C4D4E51524B3D5A;160A02272D321C1D232A4F507E61;170B1124535455433C6F6E3E66;18362E2007210D341556;190217455D;1A25262B060557586C3F5F;1B14060562463C4260;1C09020C0407282916105B6364656A;1D3504130E03191F47483E;1E22300F032C01686944;1F02031E495C40413C;200A183108014A5E6B3D59;210B121A1B08014C4D4E51524B3D5A;223602272D321C1D232A4F507E61;231124535455433C3E66;242E2007210D34150556717C3F;25021745735D;26090C0425262B2F060557586C5F;27350414060562463C4260;280207282916105B6364656A74;29130E03191F47483E;2A0A22300F2C01686944;2B0B021E33495C40413C6F67;2C36381831034A5E6B3D59;2D00121A1B08014C4D4E51524B3D5A;2E0002272D321C1D232A4F507E613F;2F00112453545543727C3C3E66;3009000C042E2007210D34150556;313500020417455D676D;3225262B2F060557586C70675F;331406056246703C426084;340A0207282916105B6364656A;350B130E191F47486E3E;363622300F032C7544;37021E33495C40413C67;38183108014A5E6B3F3D675976;39121A1B08014C4D4E51524B3D5A;3A09020C04272D321C1D232A4F507E61;3B35041124535455433C3E66;",
          ";000A002E27202C2A475462464B;010B0002070D1E5666;02002F06150548456E5D;0300061705575868695B633C;040002130323495C645F;0507212829249060;0609341001534C4D4E415152;070212300F31031F3C61423F;080418220E032B080143403D44;090C041A1D14080833014A5E6B6C4F503D;0A0A022D1B16556A59;0B0B112526321C193C653E5A;0C2E27202C2A05475462464B6D;0D02070D1E5666;0E2F061548455D;0F000617575868695B633C85;10090002371323495C645F;11000721282903243F3E60;12000403341001534C4D4E415152;1300020C0412300F31031F3C61426D;140A18220E032B080143403D44;150B1A1D140833014A5E6B6C4F503D;16022D1B16556A59;17112526321C193C6F653E5A;182E27202C2A475462464B;1902070D1E5666;1A092F06150548455D;1B061705575868695B633C3F79;1C0204130323495C645F;1D0C040721282903243E60;1E0A03341001534C4D4E415152;1F0B0227300F311F3C6142;2018220E2B080143406E3D44;211A1D140833014A5E6B6C4F503D;22022D1B16556A59;23112526321C193C653E5A;24092E27202C2A0547546246717C4B;2502070D1E56733F66;26042F06150548455D;270C04061705575868695B633C;280A02130323495C645F;290B07212829243E60;2A341001534C4D4E415152;2B0212300F311F3C6F614267;2C3818220E032B0843403D44;2D001A1D140833014A5E6B5B4F503D78;2E0900022D1B16556A59;2F00112526321C19727C3C653F3E5A;3000042E27202C2A05475462464B;3100020C04070D1E56676D66;320A2F0615054845705D67;330B061705575868695B63703C74;34021323495C645F;3507212829243E60;36033410534C4D4E41755152;370212300F311F3C614267;380918220E2B080143403D6744;391A1D140833014A5E6B6C4F503F3D76;3A02042D1B16556A59;3B0C04112526321C193C653E5A;",
          ";00002E20391C246869655D59;010002345354495C5A;023509002707210D062A055B6356515277;0300132B06054C4D4E453C66;04000203142F1557586473614B3F;0512161743416A3E;060C072829310319015F;07360B02032C476C3C6E60;080A04182526300F1D1E0810014F503D;09041A081F01556246403D;0A022D224A5E6B4486;0B111B0E2333483C423E;0C35092E20321C24056869655D6D59;0D02345354495C5A;0E2707210D062A5B635651523F77;0F00132B064C4D4E453C66;1000020C03142F15575864614B;11360B001203161743416A3E;120A0004072829310319015F;13000204032C476C3C6D60;14182526300F1D1E0810014F503D;151A081F01556246403D;163509022D224A5E6B44;17111B0E2333483C6F423E;182E20321C246869655D3F59;1902345354495C5A;1A0C2707210D062A055B635651527F;1B360B3713032B06054C4D4E453C66;1C0A020403142F15575864614B;1D041203161743416A3E;1E0728293119015F;1F022C476C3C60;203509182526300F1D1E08104F503D;211A081F01556246403D;22022D224A5E6B3F447891;23111B0E2333483C423E;240C2E20321C24056869717C655D59;25360B021C5354495C6E5A;260A042707210D062A055B6356515280;270413032B06054C4D4E453C66;2802142F15575864614B;2912161743416A3E;2A35090728293119015F;2B022C476C3C6F6760;2C38182526300F1D1E08104F503F3D;2D001A081F01556246403D;2E0002092D224A5E6B4476;2F360B00111B0E233348727C3C423E;300A00042E20321C24056869655D59;31000204345354495C676D5A;322707210D062A055B6356705152677774;33132B06054C4D4E45703C66;34350902142F15575864614B;3512161743416A3E;36072829310319753F5F;37022C476C3C6760;380C182526300F1D1E0810014F503D67;39360B1A081F01556246403D;3A0A02042D224A5E6B44;3B04111B0E2333483C423E;",
          ";00090038041A221B194C4D4E44;0135000C042D321C2C335B6361655D77;02002E11130E1E06054754433C59;03001220070D0605565A;0400272F2A454142;050B252631032357583E66;06360A0324150162463C;07072128291D34174F50644B;080208015348553F3D5F;0902300F2B080168693D60;0A09041410495C403C6F;0B35090418161F4A5E6B6C5152403E;0C1A221B19054C4D4E6D44;0D2D321C2C335B6361655D77;0E2E11130E1E064754433C6E59;0F0B351220070D0306565A;10360A0027032F2A454142;1100252631032357583E66;12000324150162463C3F;1300072128291D34174F50644B6D;1409020408015348553D5F;1535020C04300F2B080168693D60;161410495C403C;1718161F4A5E6B6C51526A3E;181A221B194C4D4E4481;190B0A2E11130E031E06054754433C59;1A360A2E11130E031E06054754433C59;1B1220070D030605565A;1C27032F2A454173423F;1D252631032357583E66;1E090424150162463C;1F350C04072128291D34174F50644B;200208015348553D5F;2102300F2B080168693D60;221410495C403C92;230B18161F4A5E6B6C51526A3E7893;24360A1A221B19054C4D4E44;252D321C2C335B6361655D7F;26372E11130E031E06054754433C3F59;271220070D030605565A;280904272F2A454142;29350C042526312357583E66;2A2415016246703C;2B072128291D34174F50644B67;2C02085348556E3D5F;2D090002300F2B080168693D60;2E360A001410495C403C;2F0018161F4A5E6B6C51526A3E;30001A221B19054C4D4E717D3F4481;31002D321C2C335B6361655D676D8074;3209042E11130E1E06054754433C6F6759;33350C042720070D0605565A;34272F2A454142;35252631235758703E6687;36241562463C;370B072128291D34174F50644B67;38360A023A015348553D675F;3902300F2B08016869753D60;3A1410495C403C3F;3B18161F4A5E6B6C727D51526A3E76;",
          ";0000380C041A23104A5E6B5B63;010004122D1B13241F838A;020A002E11252622321C3406053C5D44;030B00200306330553544641;040007210D312B5659;050E031448453E5A;060E1D162F2A01575868694F503C6A;0719495C556466;0809020728292C081501515242653D;09021E081701474C4D4E3F3D;0A0C04300F3C6F614B5F;0B041843403E60;0C0A1A2310054A5E6B5B636D;0D0B122D1B1303241F838A94;0E2E11252622321C34063C5D44;0F002003063353546C624641;100007210D31032B5659;11000E031448453E5A;120900271D162F2A01575868694F503C6A;130019495C55643F6D66;14020C040728292C081501515242653D;1502041E081701474C4D4E3D;160A300F3C614B5F;170B1843403E60;181A23104A456B5B6378;19122D1B1303241F9583;1A2E11252622321C033406053C5D44;1B200306330553546C6246416E;1C0907210D31032B567359;1D0E1448453F3E5A;1E0C04271D163B2A01575868694F503C6A;1F0419495C556466;200A020728292C081501515242653D;210B021E081701474C4D4E3D;22300F3C614B5F;231843403E60;241A2310054A5E425B63;25122D1B1303241F;26092E11252622321C033406053C5D44;272006330553546C6246413F;280C0407210D312B5659;29040E1448453E5A;2A0A271D162F2A01575868694F50703C6A89;2B0B19495C55646766;2C020728292C0815515242653D;2D00021E081701474C4D4E3D;2E00300F3C614B5F;2F001843403E60;3009001A2310054A5E6B5B63717D7988;310037122D1B13241F3F676D;320C042E11252622321C3406053C6F5D6744;33042006330553546C624641;340A07210D312B5659;350B0E03144845703E5A;36271D162F2A575868694F503C6A;3719495C55646766;38020728292C081501515242653D67;39021E081701474C4D4E756E3D;3A09300F3C614B5F;3B184340727D3F3E60;",
          ";000A003837041A1316624640425D6A5F;01360B00042D194A5E6B4B60;020009111B032C06100548413C;030020321C310310061F056869;0400224754495C7344;05070D1D334F505651523F3E;063509232F01554C4D4E453C59;070C24575864615A;0802270E34082A01433D;09020721282908016E653D66;0A0A042B15536C3C6F;0B360B0412182526300F14175B633E;0C1A13031605624640425D6A6D5F;0D2D03194A5E6B4B60;0E2E111B33061048413C;0F0020321C31031E061F68693F;1035090022034754495C44;11000C070D1D334F505651523E;1200232F01554C4D4E453C59;130024575864616D5A;140A0204270E0F082A01433D;15360B0204072128290801653D66;162B15536C3C;17121825260D0F14175B633E;181A1316624640425D6A5F82;192D03194A5E6B4B3F60;1A35092E111B032C061048413C;1B0C20321C31031E061F056869;1C224754495C44;1D07121D334F505651523E;1E0A04232F01554C4D4E453C59;1F360B0424575864615A;2002270E34082A01433D;2102072128290801653D66;222B15536C3C;2312182526300F14175B633F3E;2435091A13031605624640425D6A5F;250C2D03194A5E6B4B60;262E111B2C06100548413C;2720321C311E061F056869;280A04224746495C44;29360B04070D1D334F505651523E;2A232F01554C4D4E45703C59;2B2457586461675A96;2C02270E34082A433D;2D0002072128290801653F3D66;2E3509002B15536C3C;2F000C12182526300F14175B633E;30001A1316624640717D425D6A5F82;31002D194A5E6B4B676D6076;320A042E111B2C06100548413C6F67;33360B0420321C311E061F0568696E;3422034754495C44;35070D1D334F50567051523E;36232F554C4D4E453C59;3724575864613F675A;38350902270E34082A01433D67;39020C07212829080175653D66;3A2B15536C3C;3B12182526300F14175B63727D3E7974;"
        ],
        getTimeZhiIndex: function(hm) {
          if (!hm) {
            return 0;
          }
          if (hm.length > 5) {
            hm = hm.substring(0, 5);
          }
          var x = 1;
          for (var i = 1; i < 22; i += 2) {
            if (hm >= (i < 10 ? "0" : "") + i + ":00" && hm <= (i + 1 < 10 ? "0" : "") + (i + 1) + ":59") {
              return x;
            }
            x++;
          }
          return 0;
        },
        convertTime: function(hm) {
          return this.ZHI[this.getTimeZhiIndex(hm) + 1];
        },
        getJiaZiIndex: function(ganZhi) {
          return this.index(ganZhi, this.JIA_ZI, 0);
        },
        hex: function(n) {
          var hex = n.toString(16);
          if (hex.length < 2) {
            hex = "0" + hex;
          }
          return hex.toUpperCase();
        },
        getDayYi: function(monthGanZhi, dayGanZhi) {
          var l = [];
          var day = this.hex(this.getJiaZiIndex(dayGanZhi));
          var month = this.hex(this.getJiaZiIndex(monthGanZhi));
          var right = this.DAY_YI_JI;
          var index2 = right.indexOf(day + "=");
          while (index2 > -1) {
            right = right.substring(index2 + 3);
            var left = right;
            if (left.indexOf("=") > -1) {
              left = left.substring(0, left.indexOf("=") - 2);
            }
            var matched = false;
            var months2 = left.substring(0, left.indexOf(":"));
            var i;
            var j;
            for (i = 0, j = months2.length; i < j; i += 2) {
              if (months2.substring(i, i + 2) === month) {
                matched = true;
                break;
              }
            }
            if (matched) {
              var ys = left.substring(left.indexOf(":") + 1);
              ys = ys.substring(0, ys.indexOf(","));
              for (i = 0, j = ys.length; i < j; i += 2) {
                l.push(this.YI_JI[parseInt(ys.substring(i, i + 2), 16)]);
              }
              break;
            }
            index2 = right.indexOf(day + "=");
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getDayJi: function(monthGanZhi, dayGanZhi) {
          var l = [];
          var day = this.hex(this.getJiaZiIndex(dayGanZhi));
          var month = this.hex(this.getJiaZiIndex(monthGanZhi));
          var right = this.DAY_YI_JI;
          var index2 = right.indexOf(day + "=");
          while (index2 > -1) {
            right = right.substring(index2 + 3);
            var left = right;
            if (left.indexOf("=") > -1) {
              left = left.substring(0, left.indexOf("=") - 2);
            }
            var matched = false;
            var months2 = left.substring(0, left.indexOf(":"));
            var i;
            var j;
            for (i = 0, j = months2.length; i < j; i += 2) {
              if (months2.substring(i, i + 2) === month) {
                matched = true;
                break;
              }
            }
            if (matched) {
              var js = left.substring(left.indexOf(",") + 1);
              for (i = 0, j = js.length; i < j; i += 2) {
                l.push(this.YI_JI[parseInt(js.substring(i, i + 2), 16)]);
              }
              break;
            }
            index2 = right.indexOf(day + "=");
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getDayJiShen: function(monthZhiIndex, dayGanZhi) {
          var l = [];
          var m = monthZhiIndex - 2;
          if (m < 0) {
            m += 12;
          }
          var index2 = this.getJiaZiIndex(dayGanZhi).toString(16).toUpperCase();
          if (index2.length < 2) {
            index2 = "0" + index2;
          }
          var matcher = new RegExp(";" + index2 + "(.[^;]*)", "g").exec(this.DAY_SHEN_SHA[m]);
          if (matcher) {
            var data = matcher[1];
            for (var i = 0, j = data.length; i < j; i += 2) {
              var n = parseInt(data.substring(i, i + 2), 16);
              if (n < 60) {
                l.push(this.SHEN_SHA[n + 1]);
              }
            }
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getDayXiongSha: function(monthZhiIndex, dayGanZhi) {
          var l = [];
          var m = monthZhiIndex - 2;
          if (m < 0) {
            m += 12;
          }
          var index2 = this.getJiaZiIndex(dayGanZhi).toString(16).toUpperCase();
          if (index2.length < 2) {
            index2 = "0" + index2;
          }
          var matcher = new RegExp(";" + index2 + "(.[^;]*)", "g").exec(this.DAY_SHEN_SHA[m]);
          if (matcher) {
            var data = matcher[1];
            for (var i = 0, j = data.length; i < j; i += 2) {
              var n = parseInt(data.substring(i, i + 2), 16);
              if (n >= 60) {
                l.push(this.SHEN_SHA[n + 1]);
              }
            }
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getTimeYi: function(dayGanZhi, timeGanZhi) {
          var l = [];
          var day = this.hex(this.getJiaZiIndex(dayGanZhi));
          var time = this.hex(this.getJiaZiIndex(timeGanZhi));
          var index2 = this.TIME_YI_JI.indexOf(day + time + "=");
          if (index2 > -1) {
            var left = this.TIME_YI_JI.substring(index2 + 5);
            if (left.indexOf("=") > -1) {
              left = left.substring(0, left.indexOf("=") - 4);
            }
            var ys = left.substring(0, left.indexOf(","));
            for (var i = 0, j = ys.length; i < j; i += 2) {
              l.push(this.YI_JI[parseInt(ys.substring(i, i + 2), 16)]);
            }
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getTimeJi: function(dayGanZhi, timeGanZhi) {
          var l = [];
          var day = this.hex(this.getJiaZiIndex(dayGanZhi));
          var time = this.hex(this.getJiaZiIndex(timeGanZhi));
          var index2 = this.TIME_YI_JI.indexOf(day + time + "=");
          if (index2 > -1) {
            var left = this.TIME_YI_JI.substring(index2 + 5);
            if (left.indexOf("=") > -1) {
              left = left.substring(0, left.indexOf("=") - 4);
            }
            var js = left.substring(left.indexOf(",") + 1);
            for (var i = 0, j = js.length; i < j; i += 2) {
              l.push(this.YI_JI[parseInt(js.substring(i, i + 2), 16)]);
            }
          }
          if (l.length < 1) {
            l.push(this.SHEN_SHA[0]);
          }
          return l;
        },
        getXunIndex: function(ganZhi) {
          var diff2 = this.find(ganZhi, this.GAN).index - this.find(ganZhi, this.ZHI).index;
          if (diff2 < 0) {
            diff2 += 12;
          }
          return Math.floor(diff2 / 2);
        },
        getXun: function(ganZhi) {
          return this.XUN[this.getXunIndex(ganZhi)];
        },
        getXunKong: function(ganZhi) {
          return this.XUN_KONG[this.getXunIndex(ganZhi)];
        },
        index: function(name, names, offset2) {
          for (var i = 0, j = names.length; i < j; i++) {
            if (names[i] === name) {
              return i + offset2;
            }
          }
          return -1;
        },
        find: function(s, arr) {
          for (var i = 0, j = arr.length; i < j; i++) {
            var v = arr[i];
            if (v.length < 1) {
              continue;
            }
            if (s.indexOf(v) > -1) {
              return {
                index: i,
                value: v
              };
            }
          }
          return null;
        }
      };
    }();
    var HolidayUtil2 = function(_NAMES) {
      var _SIZE = 18;
      var _ZERO = "0".charCodeAt(0);
      var _TAG_REMOVE = "~";
      var _NAMES_IN_USE = _NAMES, _DATA = "200112290020020101200112300020020101200201010120020101200201020120020101200201030120020101200202091020020212200202101020020212200202121120020212200202131120020212200202141120020212200202151120020212200202161120020212200202171120020212200202181120020212200204273020020501200204283020020501200205013120020501200205023120020501200205033120020501200205043120020501200205053120020501200205063120020501200205073120020501200209286020021001200209296020021001200210016120021001200210026120021001200210036120021001200210046120021001200210056120021001200210066120021001200210076120021001200301010120030101200302011120030201200302021120030201200302031120030201200302041120030201200302051120030201200302061120030201200302071120030201200302081020030201200302091020030201200304263020030501200304273020030501200305013120030501200305023120030501200305033120030501200305043120030501200305053120030501200305063120030501200305073120030501200309276020031001200309286020031001200310016120031001200310026120031001200310036120031001200310046120031001200310056120031001200310066120031001200310076120031001200401010120040101200401171020040122200401181020040122200401221120040122200401231120040122200401241120040122200401251120040122200401261120040122200401271120040122200401281120040122200405013120040501200405023120040501200405033120040501200405043120040501200405053120040501200405063120040501200405073120040501200405083020040501200405093020040501200410016120041001200410026120041001200410036120041001200410046120041001200410056120041001200410066120041001200410076120041001200410096020041001200410106020041001200501010120050101200501020120050101200501030120050101200502051020050209200502061020050209200502091120050209200502101120050209200502111120050209200502121120050209200502131120050209200502141120050209200502151120050209200504303020050501200505013120050501200505023120050501200505033120050501200505043120050501200505053120050501200505063120050501200505073120050501200505083020050501200510016120051001200510026120051001200510036120051001200510046120051001200510056120051001200510066120051001200510076120051001200510086020051001200510096020051001200512310020060101200601010120060101200601020120060101200601030120060101200601281020060129200601291120060129200601301120060129200601311120060129200602011120060129200602021120060129200602031120060129200602041120060129200602051020060129200604293020060501200604303020060501200605013120060501200605023120060501200605033120060501200605043120060501200605053120060501200605063120060501200605073120060501200609306020061001200610016120061001200610026120061001200610036120061001200610046120061001200610056120061001200610066120061001200610076120061001200610086020061001200612300020070101200612310020070101200701010120070101200701020120070101200701030120070101200702171020070218200702181120070218200702191120070218200702201120070218200702211120070218200702221120070218200702231120070218200702241120070218200702251020070218200704283020070501200704293020070501200705013120070501200705023120070501200705033120070501200705043120070501200705053120070501200705063120070501200705073120070501200709296020071001200709306020071001200710016120071001200710026120071001200710036120071001200710046120071001200710056120071001200710066120071001200710076120071001200712290020080101200712300120080101200712310120080101200801010120080101200802021020080206200802031020080206200802061120080206200802071120080206200802081120080206200802091120080206200802101120080206200802111120080206200802121120080206200804042120080404200804052120080404200804062120080404200805013120080501200805023120080501200805033120080501200805043020080501200806074120080608200806084120080608200806094120080608200809135120080914200809145120080914200809155120080914200809276020081001200809286020081001200809296120081001200809306120081001200810016120081001200810026120081001200810036120081001200810046120081001200810056120081001200901010120090101200901020120090101200901030120090101200901040020090101200901241020090125200901251120090125200901261120090125200901271120090125200901281120090125200901291120090125200901301120090125200901311120090125200902011020090125200904042120090404200904052120090404200904062120090404200905013120090501200905023120090501200905033120090501200905284120090528200905294120090528200905304120090528200905314020090528200909276020091001200910016120091001200910026120091001200910036120091001200910046120091001200910055120091003200910065120091003200910075120091003200910085120091003200910105020091003201001010120100101201001020120100101201001030120100101201002131120100213201002141120100213201002151120100213201002161120100213201002171120100213201002181120100213201002191120100213201002201020100213201002211020100213201004032120100405201004042120100405201004052120100405201005013120100501201005023120100501201005033120100501201006124020100616201006134020100616201006144120100616201006154120100616201006164120100616201009195020100922201009225120100922201009235120100922201009245120100922201009255020100922201009266020101001201010016120101001201010026120101001201010036120101001201010046120101001201010056120101001201010066120101001201010076120101001201010096020101001201101010120110101201101020120110101201101030120110101201101301020110203201102021120110203201102031120110203201102041120110203201102051120110203201102061120110203201102071120110203201102081120110203201102121020110203201104022020110405201104032120110405201104042120110405201104052120110405201104303120110501201105013120110501201105023120110501201106044120110606201106054120110606201106064120110606201109105120110912201109115120110912201109125120110912201110016120111001201110026120111001201110036120111001201110046120111001201110056120111001201110066120111001201110076120111001201110086020111001201110096020111001201112310020120101201201010120120101201201020120120101201201030120120101201201211020120123201201221120120123201201231120120123201201241120120123201201251120120123201201261120120123201201271120120123201201281120120123201201291020120123201203312020120404201204012020120404201204022120120404201204032120120404201204042120120404201204283020120501201204293120120501201204303120120501201205013120120501201205023020120501201206224120120623201206234120120623201206244120120623201209295020120930201209305120120930201210016120121001201210026120121001201210036120121001201210046120121001201210056120121001201210066120121001201210076120121001201210086020121001201301010120130101201301020120130101201301030120130101201301050020130101201301060020130101201302091120130210201302101120130210201302111120130210201302121120130210201302131120130210201302141120130210201302151120130210201302161020130210201302171020130210201304042120130404201304052120130404201304062120130404201304273020130501201304283020130501201304293120130501201304303120130501201305013120130501201306084020130612201306094020130612201306104120130612201306114120130612201306124120130612201309195120130919201309205120130919201309215120130919201309225020130919201309296020131001201310016120131001201310026120131001201310036120131001201310046120131001201310056120131001201310066120131001201310076120131001201401010120140101201401261020140131201401311120140131201402011120140131201402021120140131201402031120140131201402041120140131201402051120140131201402061120140131201402081020140131201404052120140405201404062120140405201404072120140405201405013120140501201405023120140501201405033120140501201405043020140501201405314120140602201406014120140602201406024120140602201409065120140908201409075120140908201409085120140908201409286020141001201410016120141001201410026120141001201410036120141001201410046120141004201410056120141001201410066120141001201410076120141001201410116020141001201501010120150101201501020120150101201501030120150101201501040020150101201502151020150219201502181120150219201502191120150219201502201120150219201502211120150219201502221120150219201502231120150219201502241120150219201502281020150219201504042120150405201504052120150405201504062120150405201505013120150501201505023120150501201505033120150501201506204120150620201506214120150620201506224120150620201509038120150903201509048120150903201509058120150903201509068020150903201509265120150927201509275120150927201510016120151001201510026120151001201510036120151001201510046120151004201510056120151001201510066120151001201510076120151001201510106020151001201601010120160101201601020120160101201601030120160101201602061020160208201602071120160208201602081120160208201602091120160208201602101120160208201602111120160208201602121120160208201602131120160208201602141020160208201604022120160404201604032120160404201604042120160404201604303120160501201605013120160501201605023120160501201606094120160609201606104120160609201606114120160609201606124020160609201609155120160915201609165120160915201609175120160915201609185020160915201610016120161001201610026120161001201610036120161001201610046120161001201610056120161001201610066120161001201610076120161001201610086020161001201610096020161001201612310120170101201701010120170101201701020120170101201701221020170128201701271120170128201701281120170128201701291120170128201701301120170128201701311120170128201702011120170128201702021120170128201702041020170128201704012020170404201704022120170404201704032120170404201704042120170404201704293120170501201704303120170501201705013120170501201705274020170530201705284120170530201705294120170530201705304120170530201709306020171001201710016120171001201710026120171001201710036120171001201710045120171004201710056120171001201710066120171001201710076120171001201710086120171001201712300120180101201712310120180101201801010120180101201802111020180216201802151120180216201802161120180216201802171120180216201802181120180216201802191120180216201802201120180216201802211120180216201802241020180216201804052120180405201804062120180405201804072120180405201804082020180405201804283020180501201804293120180501201804303120180501201805013120180501201806164120180618201806174120180618201806184120180618201809225120180924201809235120180924201809245120180924201809296020181001201809306020181001201810016120181001201810026120181001201810036120181001201810046120181001201810056120181001201810066120181001201810076120181001201812290020190101201812300120190101201812310120190101201901010120190101201902021020190205201902031020190205201902041120190205201902051120190205201902061120190205201902071120190205201902081120190205201902091120190205201902101120190205201904052120190405201904062120190405201904072120190405201904283020190501201905013120190501201905023120190501201905033120190501201905043120190501201905053020190501201906074120190607201906084120190607201906094120190607201909135120190913201909145120190913201909155120190913201909296020191001201910016120191001201910026120191001201910036120191001201910046120191001201910056120191001201910066120191001201910076120191001201910126020191001202001010120200101202001191020200125202001241120200125202001251120200125202001261120200125202001271120200125202001281120200125202001291120200125202001301120200125202001311120200125202002011120200125202002021120200125202004042120200404202004052120200404202004062120200404202004263020200501202005013120200501202005023120200501202005033120200501202005043120200501202005053120200501202005093020200501202006254120200625202006264120200625202006274120200625202006284020200625202009277020201001202010017120201001202010026120201001202010036120201001202010046120201001202010056120201001202010066120201001202010076120201001202010086120201001202010106020201001202101010120210101202101020120210101202101030120210101202102071020210212202102111120210212202102121120210212202102131120210212202102141120210212202102151120210212202102161120210212202102171120210212202102201020210212202104032120210404202104042120210404202104052120210404202104253020210501202105013120210501202105023120210501202105033120210501202105043120210501202105053120210501202105083020210501202106124120210614202106134120210614202106144120210614202109185020210921202109195120210921202109205120210921202109215120210921202109266020211001202110016120211001202110026120211001202110036120211001202110046120211001202110056120211001202110066120211001202110076120211001202110096020211001202201010120220101202201020120220101202201030120220101202201291020220201202201301020220201202201311120220201202202011120220201202202021120220201202202031120220201202202041120220201202202051120220201202202061120220201202204022020220405202204032120220405202204042120220405202204052120220405202204243020220501202204303120220501202205013120220501202205023120220501202205033120220501202205043120220501202205073020220501202206034120220603202206044120220603202206054120220603202209105120220910202209115120220910202209125120220910202210016120221001202210026120221001202210036120221001202210046120221001202210056120221001202210066120221001202210076120221001202210086020221001202210096020221001202212310120230101202301010120230101202301020120230101202301211120230122202301221120230122202301231120230122202301241120230122202301251120230122202301261120230122202301271120230122202301281020230122202301291020230122202304052120230405202304233020230501202304293120230501202304303120230501202305013120230501202305023120230501202305033120230501202305063020230501202306224120230622202306234120230622202306244120230622202306254020230622202309295120230929202309306120231001202310016120231001202310026120231001202310036120231001202310046120231001202310056120231001202310066120231001202310076020231001202310086020231001202312300120240101202312310120240101202401010120240101202402041020240210202402101120240210202402111120240210202402121120240210202402131120240210202402141120240210202402151120240210202402161120240210202402171120240210202402181020240210202404042120240404202404052120240404202404062120240404202404072020240404202404283020240501202405013120240501202405023120240501202405033120240501202405043120240501202405053120240501202405113020240501202406084120240610202406094120240610202406104120240610202409145020240917202409155120240917202409165120240917202409175120240917202409296020241001202410016120241001202410026120241001202410036120241001202410046120241001202410056120241001202410066120241001202410076120241001202410126020241001202501010120250101202501261020250129202501281120250129202501291120250129202501301120250129202501311120250129202502011120250129202502021120250129202502031120250129202502041120250129202502081020250129202504042120250404202504052120250404202504062120250404202504273020250501202505013120250501202505023120250501202505033120250501202505043120250501202505053120250501202505314120250531202506014120250531202506024120250531202509287020251001202510017120251001202510027120251001202510037120251001202510047120251001202510057120251001202510067120251001202510077120251001202510087120251001202510117020251001202601010120260101202601020120260101202601030120260101202601040020260101202602141020260217202602151120260217202602161120260217202602171120260217202602181120260217202602191120260217202602201120260217202602211120260217202602221120260217202602231120260217202602281020260217202604042120260405202604052120260405202604062120260405202605013120260501202605023120260501202605033120260501202605043120260501202605053120260501202605093020260501202606194120260619202606204120260619202606214120260619202609206020261001202609255120260925202609265120260925202609275120260925202610016120261001202610026120261001202610036120261001202610046120261001202610056120261001202610066120261001202610076120261001202610106020261001";
      var _DATA_IN_USE = _DATA;
      var _padding = function(n) {
        return (n < 10 ? "0" : "") + n;
      };
      var _ymd = function(s) {
        return s.indexOf("-") < 0 ? s.substring(0, 4) + "-" + s.substring(4, 6) + "-" + s.substring(6) : s;
      };
      var _buildHoliday = function(day, name, work, target) {
        return {
          _p: {
            day: _ymd(day),
            name,
            work,
            target: _ymd(target)
          },
          getDay: function() {
            return this._p.day;
          },
          setDay: function(v) {
            this._p.day = _ymd(v);
          },
          getName: function() {
            return this._p.name;
          },
          setName: function(v) {
            this._p.name = v;
          },
          isWork: function() {
            return this._p.work;
          },
          setWork: function(v) {
            this._p.work = v;
          },
          getTarget: function() {
            return this._p.target;
          },
          setTarget: function(v) {
            this._p.target = _ymd(v);
          },
          toString: function() {
            return this._p.day + " " + this._p.name + (this._p.work ? "调休" : "") + " " + this._p.target;
          }
        };
      };
      var _buildHolidayForward = function(s) {
        var day = s.substring(0, 8);
        var name = _NAMES_IN_USE[s.charCodeAt(8) - _ZERO];
        var work = s.charCodeAt(9) === _ZERO;
        var target = s.substring(10, 18);
        return _buildHoliday(day, name, work, target);
      };
      var _buildHolidayBackward = function(s) {
        var size2 = s.length;
        var day = s.substring(size2 - 18, size2 - 10);
        var name = _NAMES_IN_USE[s.charCodeAt(size2 - 10) - _ZERO];
        var work = s.charCodeAt(size2 - 9) === _ZERO;
        var target = s.substring(size2 - 8);
        return _buildHoliday(day, name, work, target);
      };
      var _findForward = function(key) {
        var start = _DATA_IN_USE.indexOf(key);
        if (start < 0) {
          return null;
        }
        var right = _DATA_IN_USE.substring(start);
        var n = right.length % _SIZE;
        if (n > 0) {
          right = right.substring(n);
        }
        while (0 !== right.indexOf(key) && right.length >= _SIZE) {
          right = right.substring(_SIZE);
        }
        return right;
      };
      var _findBackward = function(key) {
        var start = _DATA_IN_USE.lastIndexOf(key);
        if (start < 0) {
          return null;
        }
        var keySize = key.length;
        var left = _DATA_IN_USE.substring(0, start + keySize);
        var size2 = left.length;
        var n = size2 % _SIZE;
        if (n > 0) {
          left = left.substring(0, size2 - n);
        }
        size2 = left.length;
        while (size2 - keySize !== left.lastIndexOf(key) && size2 >= _SIZE) {
          left = left.substring(0, size2 - _SIZE);
          size2 = left.length;
        }
        return left;
      };
      var _findHolidaysForward = function(key) {
        var l = [];
        var s = _findForward(key);
        if (null == s) {
          return l;
        }
        while (0 === s.indexOf(key)) {
          l.push(_buildHolidayForward(s));
          s = s.substring(_SIZE);
        }
        return l;
      };
      var _findHolidaysBackward = function(key) {
        var l = [];
        var s = _findBackward(key);
        if (null == s) {
          return l;
        }
        var size2 = s.length;
        var keySize = key.length;
        while (size2 - keySize === s.lastIndexOf(key)) {
          l.push(_buildHolidayBackward(s));
          s = s.substring(0, size2 - _SIZE);
          size2 = s.length;
        }
        l.reverse();
        return l;
      };
      var _getHoliday = function(args) {
        var l = [];
        switch (args.length) {
          case 1:
            l = _findHolidaysForward(args[0].replace(/-/g, ""));
            break;
          case 3:
            l = _findHolidaysForward(args[0] + _padding(args[1]) + _padding(args[2]));
            break;
        }
        return l.length < 1 ? null : l[0];
      };
      var _getHolidays = function(args) {
        var l = [];
        switch (args.length) {
          case 1:
            l = _findHolidaysForward((args[0] + "").replace(/-/g, ""));
            break;
          case 2:
            l = _findHolidaysForward(args[0] + _padding(args[1]));
            break;
        }
        return l;
      };
      var _getHolidaysByTarget = function(args) {
        var l = [];
        switch (args.length) {
          case 1:
            l = _findHolidaysBackward((args[0] + "").replace(/-/g, ""));
            break;
          case 3:
            l = _findHolidaysBackward(args[0] + _padding(args[1]) + _padding(args[2]));
            break;
        }
        return l;
      };
      var _fixNames = function(names) {
        if (names) {
          _NAMES_IN_USE = names;
        }
      };
      var _fixData = function(data) {
        if (!data) {
          return;
        }
        var append = [];
        while (data.length >= _SIZE) {
          var segment = data.substring(0, _SIZE);
          var day = segment.substring(0, 8);
          var remove2 = _TAG_REMOVE === segment.substring(8, 9);
          var holiday = _getHoliday([day]);
          if (!holiday) {
            if (!remove2) {
              append.push(segment);
            }
          } else {
            var nameIndex = -1;
            for (var i = 0, j = _NAMES_IN_USE.length; i < j; i++) {
              if (_NAMES_IN_USE[i] === holiday.getName()) {
                nameIndex = i;
                break;
              }
            }
            if (nameIndex > -1) {
              var old = day + String.fromCharCode(nameIndex + _ZERO) + (holiday.isWork() ? "0" : "1") + holiday.getTarget().replace(/-/g, "");
              _DATA_IN_USE = _DATA_IN_USE.replace(new RegExp(old, "g"), remove2 ? "" : segment);
            }
          }
          data = data.substring(_SIZE);
        }
        if (append.length > 0) {
          _DATA_IN_USE += append.join("");
        }
      };
      var _fix = function(args) {
        switch (args.length) {
          case 1:
            _fixData(args[0]);
            break;
          case 2:
            _fixNames(args[0]);
            _fixData(args[1]);
            break;
        }
      };
      return {
        NAMES: _NAMES,
        getHoliday: function() {
          return _getHoliday(arguments);
        },
        getHolidays: function() {
          return _getHolidays(arguments);
        },
        getHolidaysByTarget: function() {
          return _getHolidaysByTarget(arguments);
        },
        fix: function() {
          _fix(arguments);
        }
      };
    }(["元旦节", "春节", "清明节", "劳动节", "端午节", "中秋节", "国庆节", "国庆中秋", "抗战胜利日"]);
    var NineStar2 = /* @__PURE__ */ function() {
      var _fromIndex = function(index2) {
        return {
          _p: { index: index2 },
          getNumber: function() {
            return NineStarUtil2.NUMBER[this._p.index];
          },
          getColor: function() {
            return NineStarUtil2.COLOR[this._p.index];
          },
          getWuXing: function() {
            return NineStarUtil2.WU_XING[this._p.index];
          },
          getPosition: function() {
            return NineStarUtil2.POSITION[this._p.index];
          },
          getPositionDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPosition()];
          },
          getNameInXuanKong: function() {
            return NineStar2.NAME_XUAN_KONG[this._p.index];
          },
          getNameInBeiDou: function() {
            return NineStar2.NAME_BEI_DOU[this._p.index];
          },
          getNameInQiMen: function() {
            return NineStar2.NAME_QI_MEN[this._p.index];
          },
          getNameInTaiYi: function() {
            return NineStar2.NAME_TAI_YI[this._p.index];
          },
          getLuckInQiMen: function() {
            return NineStar2.LUCK_QI_MEN[this._p.index];
          },
          getLuckInXuanKong: function() {
            return NineStarUtil2.LUCK_XUAN_KONG[this._p.index];
          },
          getYinYangInQiMen: function() {
            return NineStarUtil2.YIN_YANG_QI_MEN[this._p.index];
          },
          getTypeInTaiYi: function() {
            return NineStar2.TYPE_TAI_YI[this._p.index];
          },
          getBaMenInQiMen: function() {
            return NineStar2.BA_MEN_QI_MEN[this._p.index];
          },
          getSongInTaiYi: function() {
            return NineStar2.SONG_TAI_YI[this._p.index];
          },
          getIndex: function() {
            return this._p.index;
          },
          toString: function() {
            return this.getNumber() + this.getColor() + this.getWuXing() + this.getNameInBeiDou();
          },
          toFullString: function() {
            var s = this.getNumber();
            s += this.getColor();
            s += this.getWuXing();
            s += " ";
            s += this.getPosition();
            s += "(";
            s += this.getPositionDesc();
            s += ") ";
            s += this.getNameInBeiDou();
            s += " 玄空[";
            s += this.getNameInXuanKong();
            s += " ";
            s += this.getLuckInXuanKong();
            s += "] 奇门[";
            s += this.getNameInQiMen();
            s += " ";
            s += this.getLuckInQiMen();
            if (this.getBaMenInQiMen().length > 0) {
              s += " ";
              s += this.getBaMenInQiMen();
              s += "门";
            }
            s += " ";
            s += this.getYinYangInQiMen();
            s += "] 太乙[";
            s += this.getNameInTaiYi();
            s += " ";
            s += this.getTypeInTaiYi();
            s += "]";
            return s;
          }
        };
      };
      return {
        NAME_BEI_DOU: ["天枢", "天璇", "天玑", "天权", "玉衡", "开阳", "摇光", "洞明", "隐元"],
        NAME_XUAN_KONG: ["贪狼", "巨门", "禄存", "文曲", "廉贞", "武曲", "破军", "左辅", "右弼"],
        NAME_QI_MEN: ["天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"],
        BA_MEN_QI_MEN: ["休", "死", "伤", "杜", "", "开", "惊", "生", "景"],
        NAME_TAI_YI: ["太乙", "摄提", "轩辕", "招摇", "天符", "青龙", "咸池", "太阴", "天乙"],
        TYPE_TAI_YI: ["吉神", "凶神", "安神", "安神", "凶神", "吉神", "凶神", "吉神", "吉神"],
        SONG_TAI_YI: ["门中太乙明，星官号贪狼，赌彩财喜旺，婚姻大吉昌，出入无阻挡，参谒见贤良，此行三五里，黑衣别阴阳。", "门前见摄提，百事必忧疑，相生犹自可，相克祸必临，死门并相会，老妇哭悲啼，求谋并吉事，尽皆不相宜，只可藏隐遁，若动伤身疾。", "出入会轩辕，凡事必缠牵，相生全不美，相克更忧煎，远行多不利，博彩尽输钱，九天玄女法，句句不虚言。", "招摇号木星，当之事莫行，相克行人阻，阴人口舌迎，梦寐多惊惧，屋响斧自鸣，阴阳消息理，万法弗违情。", "五鬼为天符，当门阴女谋，相克无好事，行路阻中途，走失难寻觅，道逢有尼姑，此星当门值，万事有灾除。", "神光跃青龙，财气喜重重，投入有酒食，赌彩最兴隆，更逢相生旺，休言克破凶，见贵安营寨，万事总吉同。", "吾将为咸池，当之尽不宜，出入多不利，相克有灾情，赌彩全输尽，求财空手回，仙人真妙语，愚人莫与知，动用虚惊退，反复逆风吹。", "坐临太阴星，百祸不相侵，求谋悉成就，知交有觅寻，回风归来路，恐有殃伏起，密语中记取，慎乎莫轻行。", "迎来天乙星，相逢百事兴，运用和合庆，茶酒喜相迎，求谋并嫁娶，好合有天成，祸福如神验，吉凶甚分明。"],
        LUCK_QI_MEN: ["大凶", "大凶", "小吉", "大吉", "大吉", "大吉", "小凶", "小吉", "小凶"],
        fromIndex: function(index2) {
          return _fromIndex(index2);
        }
      };
    }();
    var EightChar2 = /* @__PURE__ */ function() {
      var _fromLunar = function(lunar2) {
        return {
          _p: { sect: 2, lunar: lunar2 },
          setSect: function(sect) {
            sect *= 1;
            this._p.sect = 1 === sect ? 1 : 2;
          },
          getSect: function() {
            return this._p.sect;
          },
          getDayGanIndex: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayGanIndexExact2() : this._p.lunar.getDayGanIndexExact();
          },
          getDayZhiIndex: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayZhiIndexExact2() : this._p.lunar.getDayZhiIndexExact();
          },
          getYear: function() {
            return this._p.lunar.getYearInGanZhiExact();
          },
          getYearGan: function() {
            return this._p.lunar.getYearGanExact();
          },
          getYearZhi: function() {
            return this._p.lunar.getYearZhiExact();
          },
          getYearHideGan: function() {
            return LunarUtil2.ZHI_HIDE_GAN[this.getYearZhi()];
          },
          getYearWuXing: function() {
            return LunarUtil2.WU_XING_GAN[this.getYearGan()] + LunarUtil2.WU_XING_ZHI[this.getYearZhi()];
          },
          getYearNaYin: function() {
            return LunarUtil2.NAYIN[this.getYear()];
          },
          getYearShiShenGan: function() {
            return LunarUtil2.SHI_SHEN[this.getDayGan() + this.getYearGan()];
          },
          getYearShiShenZhi: function() {
            var dayGan = this.getDayGan();
            var hideGan = LunarUtil2.ZHI_HIDE_GAN[this.getYearZhi()];
            var l = [];
            for (var i = 0, j = hideGan.length; i < j; i++) {
              l.push(LunarUtil2.SHI_SHEN[dayGan + hideGan[i]]);
            }
            return l;
          },
          _getDiShi: function(zhiIndex) {
            var offset2 = LunarUtil2.CHANG_SHENG_OFFSET[this.getDayGan()];
            var index2 = offset2 + (this.getDayGanIndex() % 2 === 0 ? zhiIndex : -zhiIndex);
            if (index2 >= 12) {
              index2 -= 12;
            }
            if (index2 < 0) {
              index2 += 12;
            }
            return LunarUtil2.CHANG_SHENG[index2];
          },
          getYearDiShi: function() {
            return this._getDiShi(this._p.lunar.getYearZhiIndexExact());
          },
          getYearXun: function() {
            return this._p.lunar.getYearXunExact();
          },
          getYearXunKong: function() {
            return this._p.lunar.getYearXunKongExact();
          },
          getMonth: function() {
            return this._p.lunar.getMonthInGanZhiExact();
          },
          getMonthGan: function() {
            return this._p.lunar.getMonthGanExact();
          },
          getMonthZhi: function() {
            return this._p.lunar.getMonthZhiExact();
          },
          getMonthHideGan: function() {
            return LunarUtil2.ZHI_HIDE_GAN[this.getMonthZhi()];
          },
          getMonthWuXing: function() {
            return LunarUtil2.WU_XING_GAN[this.getMonthGan()] + LunarUtil2.WU_XING_ZHI[this.getMonthZhi()];
          },
          getMonthNaYin: function() {
            return LunarUtil2.NAYIN[this.getMonth()];
          },
          getMonthShiShenGan: function() {
            return LunarUtil2.SHI_SHEN[this.getDayGan() + this.getMonthGan()];
          },
          getMonthShiShenZhi: function() {
            var dayGan = this.getDayGan();
            var hideGan = LunarUtil2.ZHI_HIDE_GAN[this.getMonthZhi()];
            var l = [];
            for (var i = 0, j = hideGan.length; i < j; i++) {
              l.push(LunarUtil2.SHI_SHEN[dayGan + hideGan[i]]);
            }
            return l;
          },
          getMonthDiShi: function() {
            return this._getDiShi(this._p.lunar.getMonthZhiIndexExact());
          },
          getMonthXun: function() {
            return this._p.lunar.getMonthXunExact();
          },
          getMonthXunKong: function() {
            return this._p.lunar.getMonthXunKongExact();
          },
          getDay: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayInGanZhiExact2() : this._p.lunar.getDayInGanZhiExact();
          },
          getDayGan: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayGanExact2() : this._p.lunar.getDayGanExact();
          },
          getDayZhi: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayZhiExact2() : this._p.lunar.getDayZhiExact();
          },
          getDayHideGan: function() {
            return LunarUtil2.ZHI_HIDE_GAN[this.getDayZhi()];
          },
          getDayWuXing: function() {
            return LunarUtil2.WU_XING_GAN[this.getDayGan()] + LunarUtil2.WU_XING_ZHI[this.getDayZhi()];
          },
          getDayNaYin: function() {
            return LunarUtil2.NAYIN[this.getDay()];
          },
          getDayShiShenGan: function() {
            return "日主";
          },
          getDayShiShenZhi: function() {
            var dayGan = this.getDayGan();
            var hideGan = LunarUtil2.ZHI_HIDE_GAN[this.getDayZhi()];
            var l = [];
            for (var i = 0, j = hideGan.length; i < j; i++) {
              l.push(LunarUtil2.SHI_SHEN[dayGan + hideGan[i]]);
            }
            return l;
          },
          getDayDiShi: function() {
            return this._getDiShi(this.getDayZhiIndex());
          },
          getDayXun: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayXunExact2() : this._p.lunar.getDayXunExact();
          },
          getDayXunKong: function() {
            return 2 === this._p.sect ? this._p.lunar.getDayXunKongExact2() : this._p.lunar.getDayXunKongExact();
          },
          getTime: function() {
            return this._p.lunar.getTimeInGanZhi();
          },
          getTimeGan: function() {
            return this._p.lunar.getTimeGan();
          },
          getTimeZhi: function() {
            return this._p.lunar.getTimeZhi();
          },
          getTimeHideGan: function() {
            return LunarUtil2.ZHI_HIDE_GAN[this.getTimeZhi()];
          },
          getTimeWuXing: function() {
            return LunarUtil2.WU_XING_GAN[this.getTimeGan()] + LunarUtil2.WU_XING_ZHI[this.getTimeZhi()];
          },
          getTimeNaYin: function() {
            return LunarUtil2.NAYIN[this.getTime()];
          },
          getTimeShiShenGan: function() {
            return LunarUtil2.SHI_SHEN[this.getDayGan() + this.getTimeGan()];
          },
          getTimeShiShenZhi: function() {
            var dayGan = this.getDayGan();
            var hideGan = LunarUtil2.ZHI_HIDE_GAN[this.getTimeZhi()];
            var l = [];
            for (var i = 0, j = hideGan.length; i < j; i++) {
              l.push(LunarUtil2.SHI_SHEN[dayGan + hideGan[i]]);
            }
            return l;
          },
          getTimeDiShi: function() {
            return this._getDiShi(this._p.lunar.getTimeZhiIndex());
          },
          getTimeXun: function() {
            return this._p.lunar.getTimeXun();
          },
          getTimeXunKong: function() {
            return this._p.lunar.getTimeXunKong();
          },
          getTaiYuan: function() {
            var ganIndex = this._p.lunar.getMonthGanIndexExact() + 1;
            if (ganIndex >= 10) {
              ganIndex -= 10;
            }
            var zhiIndex = this._p.lunar.getMonthZhiIndexExact() + 3;
            if (zhiIndex >= 12) {
              zhiIndex -= 12;
            }
            return LunarUtil2.GAN[ganIndex + 1] + LunarUtil2.ZHI[zhiIndex + 1];
          },
          getTaiYuanNaYin: function() {
            return LunarUtil2.NAYIN[this.getTaiYuan()];
          },
          getTaiXi: function() {
            var lunar3 = this._p.lunar;
            var ganIndex = 2 === this._p.sect ? lunar3.getDayGanIndexExact2() : lunar3.getDayGanIndexExact();
            var zhiIndex = 2 === this._p.sect ? lunar3.getDayZhiIndexExact2() : lunar3.getDayZhiIndexExact();
            return LunarUtil2.HE_GAN_5[ganIndex] + LunarUtil2.HE_ZHI_6[zhiIndex];
          },
          getTaiXiNaYin: function() {
            return LunarUtil2.NAYIN[this.getTaiXi()];
          },
          getMingGong: function() {
            var monthZhiIndex = LunarUtil2.index(this.getMonthZhi(), LunarUtil2.MONTH_ZHI, 0);
            var timeZhiIndex = LunarUtil2.index(this.getTimeZhi(), LunarUtil2.MONTH_ZHI, 0);
            var offset2 = monthZhiIndex + timeZhiIndex;
            offset2 = (offset2 >= 14 ? 26 : 14) - offset2;
            var ganIndex = (this._p.lunar.getYearGanIndexExact() + 1) * 2 + offset2;
            while (ganIndex > 10) {
              ganIndex -= 10;
            }
            return LunarUtil2.GAN[ganIndex] + LunarUtil2.MONTH_ZHI[offset2];
          },
          getMingGongNaYin: function() {
            return LunarUtil2.NAYIN[this.getMingGong()];
          },
          getShenGong: function() {
            var monthZhiIndex = LunarUtil2.index(this.getMonthZhi(), LunarUtil2.MONTH_ZHI, 0);
            var timeZhiIndex = LunarUtil2.index(this.getTimeZhi(), LunarUtil2.ZHI, 0);
            var offset2 = monthZhiIndex + timeZhiIndex;
            if (offset2 > 12) {
              offset2 -= 12;
            }
            var ganIndex = (this._p.lunar.getYearGanIndexExact() + 1) * 2 + offset2;
            while (ganIndex > 10) {
              ganIndex -= 10;
            }
            return LunarUtil2.GAN[ganIndex] + LunarUtil2.MONTH_ZHI[offset2];
          },
          getShenGongNaYin: function() {
            return LunarUtil2.NAYIN[this.getShenGong()];
          },
          getLunar: function() {
            return this._p.lunar;
          },
          getYun: function(gender, sect) {
            sect *= 1;
            sect = 2 === sect ? sect : 1;
            var lunar3 = this.getLunar();
            var yang = 0 === lunar3.getYearGanIndexExact() % 2;
            var man = 1 === gender;
            var forward = yang && man || !yang && !man;
            var start = function() {
              var prev = lunar3.getPrevJie();
              var next = lunar3.getNextJie();
              var current = lunar3.getSolar();
              var start2 = forward ? current : prev.getSolar();
              var end = forward ? next.getSolar() : current;
              var year;
              var month;
              var day;
              var hour = 0;
              if (2 === sect) {
                var minutes2 = end.subtractMinute(start2);
                year = Math.floor(minutes2 / 4320);
                minutes2 -= year * 4320;
                month = Math.floor(minutes2 / 360);
                minutes2 -= month * 360;
                day = Math.floor(minutes2 / 12);
                minutes2 -= day * 12;
                hour = minutes2 * 2;
              } else {
                var endTimeZhiIndex = end.getHour() === 23 ? 11 : LunarUtil2.getTimeZhiIndex(end.toYmdHms().substring(11, 16));
                var startTimeZhiIndex = start2.getHour() === 23 ? 11 : LunarUtil2.getTimeZhiIndex(start2.toYmdHms().substring(11, 16));
                var hourDiff = endTimeZhiIndex - startTimeZhiIndex;
                var dayDiff = end.subtract(start2);
                if (hourDiff < 0) {
                  hourDiff += 12;
                  dayDiff--;
                }
                var monthDiff2 = Math.floor(hourDiff * 10 / 30);
                month = dayDiff * 4 + monthDiff2;
                day = hourDiff * 10 - monthDiff2 * 30;
                year = Math.floor(month / 12);
                month = month - year * 12;
              }
              return {
                year,
                month,
                day,
                hour
              };
            }();
            var buildLiuYue = function(liuNian, index2) {
              return {
                _p: {
                  index: index2,
                  liuNian
                },
                getIndex: function() {
                  return this._p.index;
                },
                getMonthInChinese: function() {
                  return LunarUtil2.MONTH[this._p.index + 1];
                },
                getGanZhi: function() {
                  var yearGanIndex = LunarUtil2.find(this._p.liuNian.getGanZhi(), LunarUtil2.GAN).index - 1;
                  var offset2 = [2, 4, 6, 8, 0][yearGanIndex % 5];
                  var gan = LunarUtil2.GAN[(this._p.index + offset2) % 10 + 1];
                  var zhi = LunarUtil2.ZHI[(this._p.index + LunarUtil2.BASE_MONTH_ZHI_INDEX) % 12 + 1];
                  return gan + zhi;
                },
                getXun: function() {
                  return LunarUtil2.getXun(this.getGanZhi());
                },
                getXunKong: function() {
                  return LunarUtil2.getXunKong(this.getGanZhi());
                }
              };
            };
            var buildLiuNian = function(daYun, index2) {
              return {
                _p: {
                  year: daYun.getStartYear() + index2,
                  age: daYun.getStartAge() + index2,
                  index: index2,
                  daYun,
                  lunar: daYun.getLunar()
                },
                getYear: function() {
                  return this._p.year;
                },
                getAge: function() {
                  return this._p.age;
                },
                getIndex: function() {
                  return this._p.index;
                },
                getLunar: function() {
                  return this._p.lunar;
                },
                getGanZhi: function() {
                  var offset2 = LunarUtil2.getJiaZiIndex(this._p.lunar.getJieQiTable()[I18n2.getMessage("jq.liChun")].getLunar().getYearInGanZhiExact()) + this._p.index;
                  if (this._p.daYun.getIndex() > 0) {
                    offset2 += this._p.daYun.getStartAge() - 1;
                  }
                  offset2 %= LunarUtil2.JIA_ZI.length;
                  return LunarUtil2.JIA_ZI[offset2];
                },
                getXun: function() {
                  return LunarUtil2.getXun(this.getGanZhi());
                },
                getXunKong: function() {
                  return LunarUtil2.getXunKong(this.getGanZhi());
                },
                getLiuYue: function() {
                  var l = [];
                  for (var i = 0; i < 12; i++) {
                    l.push(buildLiuYue(this, i));
                  }
                  return l;
                }
              };
            };
            var buildXiaoYun = function(daYun, index2, forward2) {
              return {
                _p: {
                  year: daYun.getStartYear() + index2,
                  age: daYun.getStartAge() + index2,
                  index: index2,
                  daYun,
                  forward: forward2,
                  lunar: daYun.getLunar()
                },
                getYear: function() {
                  return this._p.year;
                },
                getAge: function() {
                  return this._p.age;
                },
                getIndex: function() {
                  return this._p.index;
                },
                getGanZhi: function() {
                  var offset2 = LunarUtil2.getJiaZiIndex(this._p.lunar.getTimeInGanZhi());
                  var add2 = this._p.index + 1;
                  if (this._p.daYun.getIndex() > 0) {
                    add2 += this._p.daYun.getStartAge() - 1;
                  }
                  offset2 += this._p.forward ? add2 : -add2;
                  var size2 = LunarUtil2.JIA_ZI.length;
                  while (offset2 < 0) {
                    offset2 += size2;
                  }
                  offset2 %= size2;
                  return LunarUtil2.JIA_ZI[offset2];
                },
                getXun: function() {
                  return LunarUtil2.getXun(this.getGanZhi());
                },
                getXunKong: function() {
                  return LunarUtil2.getXunKong(this.getGanZhi());
                }
              };
            };
            var buildDaYun = function(yun, index2) {
              var birthYear = yun.getLunar().getSolar().getYear();
              var year = yun.getStartSolar().getYear();
              var startYear;
              var startAge;
              var endYear;
              var endAge;
              if (index2 < 1) {
                startYear = birthYear;
                startAge = 1;
                endYear = year - 1;
                endAge = year - birthYear;
              } else {
                var add2 = (index2 - 1) * 10;
                startYear = year + add2;
                startAge = startYear - birthYear + 1;
                endYear = startYear + 9;
                endAge = startAge + 9;
              }
              return {
                _p: {
                  startYear,
                  endYear,
                  startAge,
                  endAge,
                  index: index2,
                  yun,
                  lunar: yun.getLunar()
                },
                getStartYear: function() {
                  return this._p.startYear;
                },
                getEndYear: function() {
                  return this._p.endYear;
                },
                getStartAge: function() {
                  return this._p.startAge;
                },
                getEndAge: function() {
                  return this._p.endAge;
                },
                getIndex: function() {
                  return this._p.index;
                },
                getLunar: function() {
                  return this._p.lunar;
                },
                getGanZhi: function() {
                  if (this._p.index < 1) {
                    return "";
                  }
                  var offset2 = LunarUtil2.getJiaZiIndex(this._p.lunar.getMonthInGanZhiExact());
                  offset2 += this._p.yun.isForward() ? this._p.index : -this._p.index;
                  var size2 = LunarUtil2.JIA_ZI.length;
                  if (offset2 >= size2) {
                    offset2 -= size2;
                  }
                  if (offset2 < 0) {
                    offset2 += size2;
                  }
                  return LunarUtil2.JIA_ZI[offset2];
                },
                getXun: function() {
                  return LunarUtil2.getXun(this.getGanZhi());
                },
                getXunKong: function() {
                  return LunarUtil2.getXunKong(this.getGanZhi());
                },
                getLiuNian: function(n) {
                  if (!n) {
                    n = 10;
                  }
                  if (this._p.index < 1) {
                    n = this._p.endYear - this._p.startYear + 1;
                  }
                  var l = [];
                  for (var i = 0; i < n; i++) {
                    l.push(buildLiuNian(this, i));
                  }
                  return l;
                },
                getXiaoYun: function(n) {
                  if (!n) {
                    n = 10;
                  }
                  if (this._p.index < 1) {
                    n = this._p.endYear - this._p.startYear + 1;
                  }
                  var l = [];
                  for (var i = 0; i < n; i++) {
                    l.push(buildXiaoYun(this, i, this._p.yun.isForward()));
                  }
                  return l;
                }
              };
            };
            return {
              _p: {
                gender,
                startYear: start.year,
                startMonth: start.month,
                startDay: start.day,
                startHour: start.hour,
                forward,
                lunar: lunar3
              },
              getGender: function() {
                return this._p.gender;
              },
              getStartYear: function() {
                return this._p.startYear;
              },
              getStartMonth: function() {
                return this._p.startMonth;
              },
              getStartDay: function() {
                return this._p.startDay;
              },
              getStartHour: function() {
                return this._p.startHour;
              },
              isForward: function() {
                return this._p.forward;
              },
              getLunar: function() {
                return this._p.lunar;
              },
              getStartSolar: function() {
                var solar = this._p.lunar.getSolar();
                solar = solar.nextYear(this._p.startYear);
                solar = solar.nextMonth(this._p.startMonth);
                solar = solar.next(this._p.startDay);
                return solar.nextHour(this._p.startHour);
              },
              getDaYun: function(n) {
                if (!n) {
                  n = 10;
                }
                var l = [];
                for (var i = 0; i < n; i++) {
                  l.push(buildDaYun(this, i));
                }
                return l;
              }
            };
          },
          toString: function() {
            return this.getYear() + " " + this.getMonth() + " " + this.getDay() + " " + this.getTime();
          }
        };
      };
      return {
        fromLunar: function(lunar2) {
          return _fromLunar(lunar2);
        }
      };
    }();
    var LunarTime2 = /* @__PURE__ */ function() {
      var _fromYmdHms = function(lunarYear, lunarMonth, lunarDay, hour, minute, second) {
        var lunar2 = Lunar2.fromYmdHms(lunarYear, lunarMonth, lunarDay, hour, minute, second);
        var zhiIndex = LunarUtil2.getTimeZhiIndex([(hour < 10 ? "0" : "") + hour, (minute < 10 ? "0" : "") + minute].join(":"));
        var ganIndex = (lunar2.getDayGanIndexExact() % 5 * 2 + zhiIndex) % 10;
        return {
          _p: {
            ganIndex,
            zhiIndex,
            lunar: lunar2
          },
          getGanIndex: function() {
            return this._p.ganIndex;
          },
          getZhiIndex: function() {
            return this._p.zhiIndex;
          },
          getGan: function() {
            return LunarUtil2.GAN[this._p.ganIndex + 1];
          },
          getZhi: function() {
            return LunarUtil2.ZHI[this._p.zhiIndex + 1];
          },
          getGanZhi: function() {
            return this.getGan() + this.getZhi();
          },
          getShengXiao: function() {
            return LunarUtil2.SHENGXIAO[this._p.zhiIndex + 1];
          },
          getPositionXi: function() {
            return LunarUtil2.POSITION_XI[this._p.ganIndex + 1];
          },
          getPositionXiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionXi()];
          },
          getPositionYangGui: function() {
            return LunarUtil2.POSITION_YANG_GUI[this._p.ganIndex + 1];
          },
          getPositionYangGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionYangGui()];
          },
          getPositionYinGui: function() {
            return LunarUtil2.POSITION_YIN_GUI[this._p.ganIndex + 1];
          },
          getPositionYinGuiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionYinGui()];
          },
          getPositionFu: function(sect) {
            return (1 === sect ? LunarUtil2.POSITION_FU : LunarUtil2.POSITION_FU_2)[this._p.ganIndex + 1];
          },
          getPositionFuDesc: function(sect) {
            return LunarUtil2.POSITION_DESC[this.getPositionFu(sect)];
          },
          getPositionCai: function() {
            return LunarUtil2.POSITION_CAI[this._p.ganIndex + 1];
          },
          getPositionCaiDesc: function() {
            return LunarUtil2.POSITION_DESC[this.getPositionCai()];
          },
          getNaYin: function() {
            return LunarUtil2.NAYIN[this.getGanZhi()];
          },
          getTianShen: function() {
            return LunarUtil2.TIAN_SHEN[(this._p.zhiIndex + LunarUtil2.ZHI_TIAN_SHEN_OFFSET[this._p.lunar.getDayZhiExact()]) % 12 + 1];
          },
          getTianShenType: function() {
            return LunarUtil2.TIAN_SHEN_TYPE[this.getTianShen()];
          },
          getTianShenLuck: function() {
            return LunarUtil2.TIAN_SHEN_TYPE_LUCK[this.getTianShenType()];
          },
          getChong: function() {
            return LunarUtil2.CHONG[this._p.zhiIndex];
          },
          getSha: function() {
            return LunarUtil2.SHA[this.getZhi()];
          },
          getChongShengXiao: function() {
            var chong = this.getChong();
            for (var i = 0, j = LunarUtil2.ZHI.length; i < j; i++) {
              if (LunarUtil2.ZHI[i] === chong) {
                return LunarUtil2.SHENGXIAO[i];
              }
            }
            return "";
          },
          getChongDesc: function() {
            return "(" + this.getChongGan() + this.getChong() + ")" + this.getChongShengXiao();
          },
          getChongGan: function() {
            return LunarUtil2.CHONG_GAN[this._p.ganIndex];
          },
          getChongGanTie: function() {
            return LunarUtil2.CHONG_GAN_TIE[this._p.ganIndex];
          },
          getYi: function() {
            return LunarUtil2.getTimeYi(this._p.lunar.getDayInGanZhiExact(), this.getGanZhi());
          },
          getJi: function() {
            return LunarUtil2.getTimeJi(this._p.lunar.getDayInGanZhiExact(), this.getGanZhi());
          },
          getNineStar: function() {
            var solarYmd = this._p.lunar.getSolar().toYmd();
            var jieQi = this._p.lunar.getJieQiTable();
            var asc = false;
            if (solarYmd >= jieQi[I18n2.getMessage("jq.dongZhi")].toYmd() && solarYmd < jieQi[I18n2.getMessage("jq.xiaZhi")].toYmd()) {
              asc = true;
            }
            var offset2 = asc ? [0, 3, 6] : [8, 5, 2];
            var start = offset2[this._p.lunar.getDayZhiIndex() % 3];
            var index2 = asc ? start + this._p.zhiIndex : start + 9 - this._p.zhiIndex;
            return NineStar2.fromIndex(index2 % 9);
          },
          getXun: function() {
            return LunarUtil2.getXun(this.getGanZhi());
          },
          getXunKong: function() {
            return LunarUtil2.getXunKong(this.getGanZhi());
          },
          getMinHm: function() {
            var hour2 = this._p.lunar.getHour();
            if (hour2 < 1) {
              return "00:00";
            } else if (hour2 > 22) {
              return "23:00";
            }
            if (hour2 % 2 === 0) {
              hour2 -= 1;
            }
            return (hour2 < 10 ? "0" : "") + hour2 + ":00";
          },
          getMaxHm: function() {
            var hour2 = this._p.lunar.getHour();
            if (hour2 < 1) {
              return "00:59";
            } else if (hour2 > 22) {
              return "23:59";
            }
            if (hour2 % 2 !== 0) {
              hour2 += 1;
            }
            return (hour2 < 10 ? "0" : "") + hour2 + ":59";
          },
          toString: function() {
            return this.getGanZhi();
          }
        };
      };
      return {
        fromYmdHms: function(lunarYear, lunarMonth, lunarDay, hour, minute, second) {
          return _fromYmdHms(lunarYear, lunarMonth, lunarDay, hour, minute, second);
        }
      };
    }();
    var FotoUtil2 = function() {
      var XIU_OFFSET = [11, 13, 15, 17, 19, 21, 24, 0, 2, 4, 7, 9];
      var _f = function(name, result, everyMonth, remark) {
        return {
          _p: {
            name,
            result: result ? result : "",
            everyMonth: !!everyMonth,
            remark: remark ? remark : ""
          },
          getName: function() {
            return this._p.name;
          },
          getResult: function() {
            return this._p.result;
          },
          isEveryMonth: function() {
            return this._p.everyMonth;
          },
          getRemark: function() {
            return this._p.remark;
          },
          toString: function() {
            return this._p.name;
          },
          toFullString: function() {
            var l = [this._p.name];
            if (this._p.result) {
              l.push(this._p.result);
            }
            if (this._p.remark) {
              l.push(this._p.remark);
            }
            return l.join(" ");
          }
        };
      };
      var _getXiu = function(m, d) {
        return FotoUtil2.XIU_27[(XIU_OFFSET[Math.abs(m) - 1] + d - 1) % FotoUtil2.XIU_27.length];
      };
      var dj = "犯者夺纪";
      var js = "犯者减寿";
      var ss = "犯者损寿";
      var xl = "犯者削禄夺纪";
      var jw = "犯者三年内夫妇俱亡";
      var _y = _f("杨公忌");
      var _t = _f("四天王巡行", "", true);
      var _d = _f("斗降", dj, true);
      var _s = _f("月朔", dj, true);
      var _w = _f("月望", dj, true);
      var _h = _f("月晦", js, true);
      var _l = _f("雷斋日", js, true);
      var _j = _f("九毒日", "犯者夭亡，奇祸不测");
      var _r = _f("人神在阴", "犯者得病", true, "宜先一日即戒");
      var _m = _f("司命奏事", js, true, "如月小，即戒廿九");
      var _hh = _f("月晦", js, true, "如月小，即戒廿九");
      return {
        XIU_27: [
          "{xx.jiao}",
          "{xx.kang}",
          "{xx.di}",
          "{xx.fang}",
          "{xx.xin}",
          "{xx.tail}",
          "{xx.ji}",
          "{xx.dou}",
          "{xx.nv}",
          "{xx.xu}",
          "{xx.wei}",
          "{xx.shi}",
          "{xx.qiang}",
          "{xx.kui}",
          "{xx.lou}",
          "{xx.vei}",
          "{xx.mao}",
          "{xx.bi}",
          "{xx.zi}",
          "{xx.can}",
          "{xx.jing}",
          "{xx.gui}",
          "{xx.liu}",
          "{xx.xing}",
          "{xx.zhang}",
          "{xx.yi}",
          "{xx.zhen}"
        ],
        DAY_ZHAI_GUAN_YIN: ["1-8", "2-7", "2-9", "2-19", "3-3", "3-6", "3-13", "4-22", "5-3", "5-17", "6-16", "6-18", "6-19", "6-23", "7-13", "8-16", "9-19", "9-23", "10-2", "11-19", "11-24", "12-25"],
        FESTIVAL: {
          "1-1": [_f("天腊，玉帝校世人神气禄命", xl), _s],
          "1-3": [_f("万神都会", dj), _d],
          "1-5": [_f("五虚忌")],
          "1-6": [_f("六耗忌"), _l],
          "1-7": [_f("上会日", ss)],
          "1-8": [_f("五殿阎罗天子诞", dj), _t],
          "1-9": [_f("玉皇上帝诞", dj)],
          "1-13": [_y],
          "1-14": [_f("三元降", js), _t],
          "1-15": [_f("三元降", js), _f("上元神会", dj), _w, _t],
          "1-16": [_f("三元降", js)],
          "1-19": [_f("长春真人诞")],
          "1-23": [_f("三尸神奏事"), _t],
          "1-25": [_h, _f("天地仓开日", "犯者损寿，子带疾")],
          "1-27": [_d],
          "1-28": [_r],
          "1-29": [_t],
          "1-30": [_hh, _m, _t],
          "2-1": [_f("一殿秦广王诞", dj), _s],
          "2-2": [_f("万神都会", dj), _f("福德土地正神诞", "犯者得祸")],
          "2-3": [_f("文昌帝君诞", xl), _d],
          "2-6": [_f("东华帝君诞"), _l],
          "2-8": [_f("释迦牟尼佛出家", dj), _f("三殿宋帝王诞", dj), _f("张大帝诞", dj), _t],
          "2-11": [_y],
          "2-14": [_t],
          "2-15": [_f("释迦牟尼佛涅槃", xl), _f("太上老君诞", xl), _f("月望", xl, true), _t],
          "2-17": [_f("东方杜将军诞")],
          "2-18": [_f("四殿五官王诞", xl), _f("至圣先师孔子讳辰", xl)],
          "2-19": [_f("观音大士诞", dj)],
          "2-21": [_f("普贤菩萨诞")],
          "2-23": [_t],
          "2-25": [_h],
          "2-27": [_d],
          "2-28": [_r],
          "2-29": [_t],
          "2-30": [_hh, _m, _t],
          "3-1": [_f("二殿楚江王诞", dj), _s],
          "3-3": [_f("玄天上帝诞", dj), _d],
          "3-6": [_l],
          "3-8": [_f("六殿卞城王诞", dj), _t],
          "3-9": [_f("牛鬼神出", "犯者产恶胎"), _y],
          "3-12": [_f("中央五道诞")],
          "3-14": [_t],
          "3-15": [_f("昊天上帝诞", dj), _f("玄坛诞", dj), _w, _t],
          "3-16": [_f("准提菩萨诞", dj)],
          "3-19": [_f("中岳大帝诞"), _f("后土娘娘诞"), _f("三茅降")],
          "3-20": [_f("天地仓开日", ss), _f("子孙娘娘诞")],
          "3-23": [_t],
          "3-25": [_h],
          "3-27": [_f("七殿泰山王诞"), _d],
          "3-28": [_r, _f("苍颉至圣先师诞", xl), _f("东岳大帝诞")],
          "3-29": [_t],
          "3-30": [_hh, _m, _t],
          "4-1": [_f("八殿都市王诞", dj), _s],
          "4-3": [_d],
          "4-4": [_f("万神善会", "犯者失瘼夭胎"), _f("文殊菩萨诞")],
          "4-6": [_l],
          "4-7": [_f("南斗、北斗、西斗同降", js), _y],
          "4-8": [_f("释迦牟尼佛诞", dj), _f("万神善会", "犯者失瘼夭胎"), _f("善恶童子降", "犯者血死"), _f("九殿平等王诞"), _t],
          "4-14": [_f("纯阳祖师诞", js), _t],
          "4-15": [_w, _f("钟离祖师诞"), _t],
          "4-16": [_f("天地仓开日", ss)],
          "4-17": [_f("十殿转轮王诞", dj)],
          "4-18": [_f("天地仓开日", ss), _f("紫徽大帝诞", ss)],
          "4-20": [_f("眼光圣母诞")],
          "4-23": [_t],
          "4-25": [_h],
          "4-27": [_d],
          "4-28": [_r],
          "4-29": [_t],
          "4-30": [_hh, _m, _t],
          "5-1": [_f("南极长生大帝诞", dj), _s],
          "5-3": [_d],
          "5-5": [_f("地腊", xl), _f("五帝校定生人官爵", xl), _j, _y],
          "5-6": [_j, _l],
          "5-7": [_j],
          "5-8": [_f("南方五道诞"), _t],
          "5-11": [_f("天地仓开日", ss), _f("天下都城隍诞")],
          "5-12": [_f("炳灵公诞")],
          "5-13": [_f("关圣降", xl)],
          "5-14": [_f("夜子时为天地交泰", jw), _t],
          "5-15": [_w, _j, _t],
          "5-16": [_f("九毒日", jw), _f("天地元气造化万物之辰", jw)],
          "5-17": [_j],
          "5-18": [_f("张天师诞")],
          "5-22": [_f("孝娥神诞", dj)],
          "5-23": [_t],
          "5-25": [_j, _h],
          "5-26": [_j],
          "5-27": [_j, _d],
          "5-28": [_r],
          "5-29": [_t],
          "5-30": [_hh, _m, _t],
          "6-1": [_s],
          "6-3": [_f("韦驮菩萨圣诞"), _d, _y],
          "6-5": [_f("南赡部洲转大轮", ss)],
          "6-6": [_f("天地仓开日", ss), _l],
          "6-8": [_t],
          "6-10": [_f("金粟如来诞")],
          "6-14": [_t],
          "6-15": [_w, _t],
          "6-19": [_f("观世音菩萨成道", dj)],
          "6-23": [_f("南方火神诞", "犯者遭回禄"), _t],
          "6-24": [_f("雷祖诞", xl), _f("关帝诞", xl)],
          "6-25": [_h],
          "6-27": [_d],
          "6-28": [_r],
          "6-29": [_t],
          "6-30": [_hh, _m, _t],
          "7-1": [_s, _y],
          "7-3": [_d],
          "7-5": [_f("中会日", ss, false, "一作初七")],
          "7-6": [_l],
          "7-7": [_f("道德腊", xl), _f("五帝校生人善恶", xl), _f("魁星诞", xl)],
          "7-8": [_t],
          "7-10": [_f("阴毒日", "", false, "大忌")],
          "7-12": [_f("长真谭真人诞")],
          "7-13": [_f("大势至菩萨诞", js)],
          "7-14": [_f("三元降", js), _t],
          "7-15": [_w, _f("三元降", dj), _f("地官校籍", dj), _t],
          "7-16": [_f("三元降", js)],
          "7-18": [_f("西王母诞", dj)],
          "7-19": [_f("太岁诞", dj)],
          "7-22": [_f("增福财神诞", xl)],
          "7-23": [_t],
          "7-25": [_h],
          "7-27": [_d],
          "7-28": [_r],
          "7-29": [_y, _t],
          "7-30": [_f("地藏菩萨诞", dj), _hh, _m, _t],
          "8-1": [_s, _f("许真君诞")],
          "8-3": [_d, _f("北斗诞", xl), _f("司命灶君诞", "犯者遭回禄")],
          "8-5": [_f("雷声大帝诞", dj)],
          "8-6": [_l],
          "8-8": [_t],
          "8-10": [_f("北斗大帝诞")],
          "8-12": [_f("西方五道诞")],
          "8-14": [_t],
          "8-15": [_w, _f("太明朝元", "犯者暴亡", false, "宜焚香守夜"), _t],
          "8-16": [_f("天曹掠刷真君降", "犯者贫夭")],
          "8-18": [_f("天人兴福之辰", "", false, "宜斋戒，存想吉事")],
          "8-23": [_f("汉恒候张显王诞"), _t],
          "8-24": [_f("灶君夫人诞")],
          "8-25": [_h],
          "8-27": [_d, _f("至圣先师孔子诞", xl), _y],
          "8-28": [_r, _f("四天会事")],
          "8-29": [_t],
          "8-30": [_f("诸神考校", "犯者夺算"), _hh, _m, _t],
          "9-1": [_s, _f("南斗诞", xl), _f("北斗九星降世", dj, false, "此九日俱宜斋戒")],
          "9-3": [_d, _f("五瘟神诞")],
          "9-6": [_l],
          "9-8": [_t],
          "9-9": [_f("斗母诞", xl), _f("酆都大帝诞"), _f("玄天上帝飞升")],
          "9-10": [_f("斗母降", dj)],
          "9-11": [_f("宜戒")],
          "9-13": [_f("孟婆尊神诞")],
          "9-14": [_t],
          "9-15": [_w, _t],
          "9-17": [_f("金龙四大王诞", "犯者遭水厄")],
          "9-19": [_f("日宫月宫会合", js), _f("观世音菩萨诞", js)],
          "9-23": [_t],
          "9-25": [_h, _y],
          "9-27": [_d],
          "9-28": [_r],
          "9-29": [_t],
          "9-30": [_f("药师琉璃光佛诞", "犯者危疾"), _hh, _m, _t],
          "10-1": [_s, _f("民岁腊", dj), _f("四天王降", "犯者一年内死")],
          "10-3": [_d, _f("三茅诞")],
          "10-5": [_f("下会日", js), _f("达摩祖师诞", js)],
          "10-6": [_l, _f("天曹考察", dj)],
          "10-8": [_f("佛涅槃日", "", false, "大忌色欲"), _t],
          "10-10": [_f("四天王降", "犯者一年内死")],
          "10-11": [_f("宜戒")],
          "10-14": [_f("三元降", js), _t],
          "10-15": [_w, _f("三元降", dj), _f("下元水府校籍", dj), _t],
          "10-16": [_f("三元降", js), _t],
          "10-23": [_y, _t],
          "10-25": [_h],
          "10-27": [_d, _f("北极紫徽大帝降")],
          "10-28": [_r],
          "10-29": [_t],
          "10-30": [_hh, _m, _t],
          "11-1": [_s],
          "11-3": [_d],
          "11-4": [_f("至圣先师孔子诞", xl)],
          "11-6": [_f("西岳大帝诞")],
          "11-8": [_t],
          "11-11": [_f("天地仓开日", dj), _f("太乙救苦天尊诞", dj)],
          "11-14": [_t],
          "11-15": [_f("月望", "上半夜犯男死 下半夜犯女死"), _f("四天王巡行", "上半夜犯男死 下半夜犯女死")],
          "11-17": [_f("阿弥陀佛诞")],
          "11-19": [_f("太阳日宫诞", "犯者得奇祸")],
          "11-21": [_y],
          "11-23": [_f("张仙诞", "犯者绝嗣"), _t],
          "11-25": [_f("掠刷大夫降", "犯者遭大凶"), _h],
          "11-26": [_f("北方五道诞")],
          "11-27": [_d],
          "11-28": [_r],
          "11-29": [_t],
          "11-30": [_hh, _m, _t],
          "12-1": [_s],
          "12-3": [_d],
          "12-6": [_f("天地仓开日", js), _l],
          "12-7": [_f("掠刷大夫降", "犯者得恶疾")],
          "12-8": [_f("王侯腊", dj), _f("释迦如来成佛之辰"), _t, _f("初旬内戊日，亦名王侯腊", dj)],
          "12-12": [_f("太素三元君朝真")],
          "12-14": [_t],
          "12-15": [_w, _t],
          "12-16": [_f("南岳大帝诞")],
          "12-19": [_y],
          "12-20": [_f("天地交道", "犯者促寿")],
          "12-21": [_f("天猷上帝诞")],
          "12-23": [_f("五岳诞降"), _t],
          "12-24": [_f("司今朝天奏人善恶", "犯者得大祸")],
          "12-25": [_f("三清玉帝同降，考察善恶", "犯者得奇祸"), _h],
          "12-27": [_d],
          "12-28": [_r],
          "12-29": [_f("华严菩萨诞"), _t],
          "12-30": [_f("诸神下降，察访善恶", "犯者男女俱亡")]
        },
        OTHER_FESTIVAL: {
          "1-1": ["弥勒菩萨圣诞"],
          "1-6": ["定光佛圣诞"],
          "2-8": ["释迦牟尼佛出家"],
          "2-15": ["释迦牟尼佛涅槃"],
          "2-19": ["观世音菩萨圣诞"],
          "2-21": ["普贤菩萨圣诞"],
          "3-16": ["准提菩萨圣诞"],
          "4-4": ["文殊菩萨圣诞"],
          "4-8": ["释迦牟尼佛圣诞"],
          "4-15": ["佛吉祥日"],
          "4-28": ["药王菩萨圣诞"],
          "5-13": ["伽蓝菩萨圣诞"],
          "6-3": ["韦驮菩萨圣诞"],
          "6-19": ["观音菩萨成道"],
          "7-13": ["大势至菩萨圣诞"],
          "7-15": ["佛欢喜日"],
          "7-24": ["龙树菩萨圣诞"],
          "7-30": ["地藏菩萨圣诞"],
          "8-15": ["月光菩萨圣诞"],
          "8-22": ["燃灯佛圣诞"],
          "9-9": ["摩利支天菩萨圣诞"],
          "9-19": ["观世音菩萨出家"],
          "9-30": ["药师琉璃光佛圣诞"],
          "10-5": ["达摩祖师圣诞"],
          "10-20": ["文殊菩萨出家"],
          "11-17": ["阿弥陀佛圣诞"],
          "11-19": ["日光菩萨圣诞"],
          "12-8": ["释迦牟尼佛成道"],
          "12-23": ["监斋菩萨圣诞"],
          "12-29": ["华严菩萨圣诞"]
        },
        getXiu: function(m, d) {
          return _getXiu(m, d);
        }
      };
    }();
    var Foto2 = /* @__PURE__ */ function() {
      var _fromYmdHms = function(y, m, d, hour, minute, second) {
        return _fromLunar(Lunar2.fromYmdHms(y + Foto2.DEAD_YEAR - 1, m, d, hour, minute, second));
      };
      var _fromLunar = function(lunar2) {
        return {
          _p: {
            lunar: lunar2
          },
          getLunar: function() {
            return this._p.lunar;
          },
          getYear: function() {
            var sy = this._p.lunar.getSolar().getYear();
            var y = sy - Foto2.DEAD_YEAR;
            if (sy === this._p.lunar.getYear()) {
              y++;
            }
            return y;
          },
          getMonth: function() {
            return this._p.lunar.getMonth();
          },
          getDay: function() {
            return this._p.lunar.getDay();
          },
          getYearInChinese: function() {
            var y = this.getYear() + "";
            var s = "";
            var zero = "0".charCodeAt(0);
            for (var i = 0, j = y.length; i < j; i++) {
              s += LunarUtil2.NUMBER[y.charCodeAt(i) - zero];
            }
            return s;
          },
          getMonthInChinese: function() {
            return this._p.lunar.getMonthInChinese();
          },
          getDayInChinese: function() {
            return this._p.lunar.getDayInChinese();
          },
          getFestivals: function() {
            var l = FotoUtil2.FESTIVAL[this.getMonth() + "-" + this.getDay()];
            return l ? l : [];
          },
          getOtherFestivals: function() {
            var l = [];
            var fs = FotoUtil2.OTHER_FESTIVAL[this.getMonth() + "-" + this.getDay()];
            if (fs) {
              l = l.concat(fs);
            }
            return l;
          },
          isMonthZhai: function() {
            var m = this.getMonth();
            return 1 === m || 5 === m || 9 === m;
          },
          isDayYangGong: function() {
            var l = this.getFestivals();
            for (var i = 0, j = l.length; i < j; i++) {
              if ("杨公忌" === l[i].getName()) {
                return true;
              }
            }
            return false;
          },
          isDayZhaiShuoWang: function() {
            var d = this.getDay();
            return 1 === d || 15 === d;
          },
          isDayZhaiSix: function() {
            var d = this.getDay();
            if (8 === d || 14 === d || 15 === d || 23 === d || 29 === d || 30 === d) {
              return true;
            } else if (28 === d) {
              var m = LunarMonth2.fromYm(this._p.lunar.getYear(), this.getMonth());
              if (30 !== m.getDayCount()) {
                return true;
              }
            }
            return false;
          },
          isDayZhaiTen: function() {
            var d = this.getDay();
            return 1 === d || 8 === d || 14 === d || 15 === d || 18 === d || 23 === d || 24 === d || 28 === d || 29 === d || 30 === d;
          },
          isDayZhaiGuanYin: function() {
            var k = this.getMonth() + "-" + this.getDay();
            for (var i = 0, j = FotoUtil2.DAY_ZHAI_GUAN_YIN.length; i < j; i++) {
              if (k === FotoUtil2.DAY_ZHAI_GUAN_YIN[i]) {
                return true;
              }
            }
            return false;
          },
          getXiu: function() {
            return FotoUtil2.getXiu(this.getMonth(), this.getDay());
          },
          getXiuLuck: function() {
            return LunarUtil2.XIU_LUCK[this.getXiu()];
          },
          getXiuSong: function() {
            return LunarUtil2.XIU_SONG[this.getXiu()];
          },
          getZheng: function() {
            return LunarUtil2.ZHENG[this.getXiu()];
          },
          getAnimal: function() {
            return LunarUtil2.ANIMAL[this.getXiu()];
          },
          getGong: function() {
            return LunarUtil2.GONG[this.getXiu()];
          },
          getShou: function() {
            return LunarUtil2.SHOU[this.getGong()];
          },
          toString: function() {
            return this.getYearInChinese() + "年" + this.getMonthInChinese() + "月" + this.getDayInChinese();
          },
          toFullString: function() {
            var s = this.toString();
            var fs = this.getFestivals();
            for (var i = 0, j = fs.length; i < j; i++) {
              s += " (" + fs[i] + ")";
            }
            return s;
          }
        };
      };
      return {
        DEAD_YEAR: -543,
        fromYmdHms: function(y, m, d, hour, minute, second) {
          return _fromYmdHms(y, m, d, hour, minute, second);
        },
        fromYmd: function(y, m, d) {
          return _fromYmdHms(y, m, d, 0, 0, 0);
        },
        fromLunar: function(lunar2) {
          return _fromLunar(lunar2);
        }
      };
    }();
    var TaoFestival = /* @__PURE__ */ function() {
      var _f = function(name, remark) {
        return {
          _p: {
            name,
            remark: remark ? remark : ""
          },
          getName: function() {
            return this._p.name;
          },
          getRemark: function() {
            return this._p.remark;
          },
          toString: function() {
            return this._p.name;
          },
          toFullString: function() {
            var l = [this._p.name];
            if (this._p.remark) {
              l.push("[" + this._p.remark + "]");
            }
            return l.join("");
          }
        };
      };
      return {
        create: function(name, remark) {
          return _f(name, remark);
        }
      };
    }();
    var TaoUtil2 = function() {
      var _f = TaoFestival.create;
      return {
        SAN_HUI: ["1-7", "7-7", "10-15"],
        SAN_YUAN: ["1-15", "7-15", "10-15"],
        WU_LA: ["1-1", "5-5", "7-7", "10-1", "12-8"],
        AN_WU: ["{dz.wei}", "{dz.xu}", "{dz.chen}", "{dz.yin}", "{dz.wu}", "{dz.zi}", "{dz.you}", "{dz.shen}", "{dz.si}", "{dz.hai}", "{dz.mao}", "{dz.chou}"],
        BA_HUI: {
          "{jz.bingWu}": "天会",
          "{jz.renWu}": "地会",
          "{jz.renZi}": "人会",
          "{jz.gengWu}": "日会",
          "{jz.gengShen}": "月会",
          "{jz.xinYou}": "星辰会",
          "{jz.jiaChen}": "五行会",
          "{jz.jiaXu}": "四时会"
        },
        BA_JIE: {
          "{jq.liChun}": "东北方度仙上圣天尊同梵炁始青天君下降",
          "{jq.chunFen}": "东方玉宝星上天尊同青帝九炁天君下降",
          "{jq.liXia}": "东南方好生度命天尊同梵炁始丹天君下降",
          "{jq.xiaZhi}": "南方玄真万福天尊同赤帝三炁天君下降",
          "{jq.liQiu}": "西南方太灵虚皇天尊同梵炁始素天君下降",
          "{jq.qiuFen}": "西方太妙至极天尊同白帝七炁天君下降",
          "{jq.liDong}": "西北方无量太华天尊同梵炁始玄天君下降",
          "{jq.dongZhi}": "北方玄上玉宸天尊同黑帝五炁天君下降"
        },
        FESTIVAL: {
          "1-1": [_f("天腊之辰", "天腊，此日五帝会于东方九炁青天")],
          "1-3": [_f("郝真人圣诞"), _f("孙真人圣诞")],
          "1-5": [_f("孙祖清静元君诞")],
          "1-7": [_f("举迁赏会", "此日上元赐福，天官同地水二官考校罪福")],
          "1-9": [_f("玉皇上帝圣诞")],
          "1-13": [_f("关圣帝君飞升")],
          "1-15": [_f("上元天官圣诞"), _f("老祖天师圣诞")],
          "1-19": [_f("长春邱真人(邱处机)圣诞")],
          "1-28": [_f("许真君(许逊天师)圣诞")],
          "2-1": [_f("勾陈天皇大帝圣诞"), _f("长春刘真人(刘渊然)圣诞")],
          "2-2": [_f("土地正神诞"), _f("姜太公圣诞")],
          "2-3": [_f("文昌梓潼帝君圣诞")],
          "2-6": [_f("东华帝君圣诞")],
          "2-13": [_f("度人无量葛真君圣诞")],
          "2-15": [_f("太清道德天尊(太上老君)圣诞")],
          "2-19": [_f("慈航真人圣诞")],
          "3-1": [_f("谭祖(谭处端)长真真人圣诞")],
          "3-3": [_f("玄天上帝圣诞")],
          "3-6": [_f("眼光娘娘圣诞")],
          "3-15": [_f("天师张大真人圣诞"), _f("财神赵公元帅圣诞")],
          "3-16": [_f("三茅真君得道之辰"), _f("中岳大帝圣诞")],
          "3-18": [_f("王祖(王处一)玉阳真人圣诞"), _f("后土娘娘圣诞")],
          "3-19": [_f("太阳星君圣诞")],
          "3-20": [_f("子孙娘娘圣诞")],
          "3-23": [_f("天后妈祖圣诞")],
          "3-26": [_f("鬼谷先师诞")],
          "3-28": [_f("东岳大帝圣诞")],
          "4-1": [_f("长生谭真君成道之辰")],
          "4-10": [_f("何仙姑圣诞")],
          "4-14": [_f("吕祖纯阳祖师圣诞")],
          "4-15": [_f("钟离祖师圣诞")],
          "4-18": [_f("北极紫微大帝圣诞"), _f("泰山圣母碧霞元君诞"), _f("华佗神医先师诞")],
          "4-20": [_f("眼光圣母娘娘诞")],
          "4-28": [_f("神农先帝诞")],
          "5-1": [_f("南极长生大帝圣诞")],
          "5-5": [_f("地腊之辰", "地腊，此日五帝会于南方三炁丹天"), _f("南方雷祖圣诞"), _f("地祗温元帅圣诞"), _f("雷霆邓天君圣诞")],
          "5-11": [_f("城隍爷圣诞")],
          "5-13": [_f("关圣帝君降神"), _f("关平太子圣诞")],
          "5-18": [_f("张天师圣诞")],
          "5-20": [_f("马祖丹阳真人圣诞")],
          "5-29": [_f("紫青白祖师圣诞")],
          "6-1": [_f("南斗星君下降")],
          "6-2": [_f("南斗星君下降")],
          "6-3": [_f("南斗星君下降")],
          "6-4": [_f("南斗星君下降")],
          "6-5": [_f("南斗星君下降")],
          "6-6": [_f("南斗星君下降")],
          "6-10": [_f("刘海蟾祖师圣诞")],
          "6-15": [_f("灵官王天君圣诞")],
          "6-19": [_f("慈航(观音)成道日")],
          "6-23": [_f("火神圣诞")],
          "6-24": [_f("南极大帝中方雷祖圣诞"), _f("关圣帝君圣诞")],
          "6-26": [_f("二郎真君圣诞")],
          "7-7": [_f("道德腊之辰", "道德腊，此日五帝会于西方七炁素天"), _f("庆生中会", "此日中元赦罪，地官同天水二官考校罪福")],
          "7-12": [_f("西方雷祖圣诞")],
          "7-15": [_f("中元地官大帝圣诞")],
          "7-18": [_f("王母娘娘圣诞")],
          "7-20": [_f("刘祖(刘处玄)长生真人圣诞")],
          "7-22": [_f("财帛星君文财神增福相公李诡祖圣诞")],
          "7-26": [_f("张三丰祖师圣诞")],
          "8-1": [_f("许真君飞升日")],
          "8-3": [_f("九天司命灶君诞")],
          "8-5": [_f("北方雷祖圣诞")],
          "8-10": [_f("北岳大帝诞辰")],
          "8-15": [_f("太阴星君诞")],
          "9-1": [_f("北斗九皇降世之辰")],
          "9-2": [_f("北斗九皇降世之辰")],
          "9-3": [_f("北斗九皇降世之辰")],
          "9-4": [_f("北斗九皇降世之辰")],
          "9-5": [_f("北斗九皇降世之辰")],
          "9-6": [_f("北斗九皇降世之辰")],
          "9-7": [_f("北斗九皇降世之辰")],
          "9-8": [_f("北斗九皇降世之辰")],
          "9-9": [_f("北斗九皇降世之辰"), _f("斗姥元君圣诞"), _f("重阳帝君圣诞"), _f("玄天上帝飞升"), _f("酆都大帝圣诞")],
          "9-22": [_f("增福财神诞")],
          "9-23": [_f("萨翁真君圣诞")],
          "9-28": [_f("五显灵官马元帅圣诞")],
          "10-1": [_f("民岁腊之辰", "民岁腊，此日五帝会于北方五炁黑天"), _f("东皇大帝圣诞")],
          "10-3": [_f("三茅应化真君圣诞")],
          "10-6": [_f("天曹诸司五岳五帝圣诞")],
          "10-15": [_f("下元水官大帝圣诞"), _f("建生大会", "此日下元解厄，水官同天地二官考校罪福")],
          "10-18": [_f("地母娘娘圣诞")],
          "10-19": [_f("长春邱真君飞升")],
          "10-20": [_f("虚靖天师(即三十代天师弘悟张真人)诞")],
          "11-6": [_f("西岳大帝圣诞")],
          "11-9": [_f("湘子韩祖圣诞")],
          "11-11": [_f("太乙救苦天尊圣诞")],
          "11-26": [_f("北方五道圣诞")],
          "12-8": [_f("王侯腊之辰", "王侯腊，此日五帝会于上方玄都玉京")],
          "12-16": [_f("南岳大帝圣诞"), _f("福德正神诞")],
          "12-20": [_f("鲁班先师圣诞")],
          "12-21": [_f("天猷上帝圣诞")],
          "12-22": [_f("重阳祖师圣诞")],
          "12-23": [_f("祭灶王", "最适宜谢旧年太岁，开启拜新年太岁")],
          "12-25": [_f("玉帝巡天"), _f("天神下降")],
          "12-29": [_f("清静孙真君(孙不二)成道")]
        }
      };
    }();
    var NineStarUtil2 = /* @__PURE__ */ function() {
      return {
        NUMBER: [
          "{n.one}",
          "{n.two}",
          "{n.three}",
          "{n.four}",
          "{n.five}",
          "{n.six}",
          "{n.seven}",
          "{n.eight}",
          "{n.nine}"
        ],
        WU_XING: [
          "{wx.shui}",
          "{wx.tu}",
          "{wx.mu}",
          "{wx.mu}",
          "{wx.tu}",
          "{wx.jin}",
          "{wx.jin}",
          "{wx.tu}",
          "{wx.huo}"
        ],
        POSITION: [
          "{bg.kan}",
          "{bg.kun}",
          "{bg.zhen}",
          "{bg.xun}",
          "{ps.center}",
          "{bg.qian}",
          "{bg.dui}",
          "{bg.gen}",
          "{bg.li}"
        ],
        LUCK_XUAN_KONG: [
          "{s.goodLuck}",
          "{s.badLuck}",
          "{s.badLuck}",
          "{s.goodLuck}",
          "{s.badLuck}",
          "{s.goodLuck}",
          "{s.badLuck}",
          "{s.goodLuck}",
          "{s.goodLuck}"
        ],
        YIN_YANG_QI_MEN: [
          "{s.yang}",
          "{s.yin}",
          "{s.yang}",
          "{s.yang}",
          "{s.yang}",
          "{s.yin}",
          "{s.yin}",
          "{s.yang}",
          "{s.yin}"
        ],
        COLOR: [
          "{s.white}",
          "{s.black}",
          "{s.blue}",
          "{s.green}",
          "{s.yellow}",
          "{s.white}",
          "{s.red}",
          "{s.white}",
          "{s.purple}"
        ]
      };
    }();
    var Tao2 = /* @__PURE__ */ function() {
      var _fromYmdHms = function(y, m, d, hour, minute, second) {
        return _fromLunar(Lunar2.fromYmdHms(y + Tao2.BIRTH_YEAR, m, d, hour, minute, second));
      };
      var _fromLunar = function(lunar2) {
        return {
          _p: {
            lunar: lunar2
          },
          getLunar: function() {
            return this._p.lunar;
          },
          getYear: function() {
            return this._p.lunar.getYear() - Tao2.BIRTH_YEAR;
          },
          getMonth: function() {
            return this._p.lunar.getMonth();
          },
          getDay: function() {
            return this._p.lunar.getDay();
          },
          getYearInChinese: function() {
            var y = this.getYear() + "";
            var s = "";
            var zero = "0".charCodeAt(0);
            for (var i = 0, j = y.length; i < j; i++) {
              s += LunarUtil2.NUMBER[y.charCodeAt(i) - zero];
            }
            return s;
          },
          getMonthInChinese: function() {
            return this._p.lunar.getMonthInChinese();
          },
          getDayInChinese: function() {
            return this._p.lunar.getDayInChinese();
          },
          getFestivals: function() {
            var l = [];
            var fs = TaoUtil2.FESTIVAL[this.getMonth() + "-" + this.getDay()];
            if (fs) {
              l = l.concat(fs);
            }
            var jq = this._p.lunar.getJieQi();
            if (I18n2.getMessage("jq.dongZhi") === jq) {
              l.push(TaoFestival.create("元始天尊圣诞"));
            } else if (I18n2.getMessage("jq.xiaZhi") === jq) {
              l.push(TaoFestival.create("灵宝天尊圣诞"));
            }
            var f2 = TaoUtil2.BA_JIE[jq];
            if (f2) {
              l.push(TaoFestival.create(f2));
            }
            f2 = TaoUtil2.BA_HUI[this._p.lunar.getDayInGanZhi()];
            if (f2) {
              l.push(TaoFestival.create(f2));
            }
            return l;
          },
          _isDayIn: function(days2) {
            var md = this.getMonth() + "-" + this.getDay();
            for (var i = 0, j = days2.length; i < j; i++) {
              if (md === days2[i]) {
                return true;
              }
            }
            return false;
          },
          isDaySanHui: function() {
            return this._isDayIn(TaoUtil2.SAN_HUI);
          },
          isDaySanYuan: function() {
            return this._isDayIn(TaoUtil2.SAN_YUAN);
          },
          isDayBaJie: function() {
            return !!TaoUtil2.BA_JIE[this._p.lunar.getJieQi()];
          },
          isDayWuLa: function() {
            return this._isDayIn(TaoUtil2.WU_LA);
          },
          isDayBaHui: function() {
            return !!TaoUtil2.BA_HUI[this._p.lunar.getDayInGanZhi()];
          },
          isDayMingWu: function() {
            return I18n2.getMessage("tg.wu") === this._p.lunar.getDayGan();
          },
          isDayAnWu: function() {
            return this._p.lunar.getDayZhi() === TaoUtil2.AN_WU[Math.abs(this.getMonth()) - 1];
          },
          isDayWu: function() {
            return this.isDayMingWu() || this.isDayAnWu();
          },
          isDayTianShe: function() {
            var ret = false;
            var mz = this._p.lunar.getMonthZhi();
            var dgz = this._p.lunar.getDayInGanZhi();
            if ([I18n2.getMessage("dz.yin"), I18n2.getMessage("dz.mao"), I18n2.getMessage("dz.chen")].join(",").indexOf(mz) > -1) {
              if (I18n2.getMessage("jz.wuYin") === dgz) {
                ret = true;
              }
            } else if ([I18n2.getMessage("dz.si"), I18n2.getMessage("dz.wu"), I18n2.getMessage("dz.wei")].join(",").indexOf(mz) > -1) {
              if (I18n2.getMessage("jz.jiaWu") === dgz) {
                ret = true;
              }
            } else if ([I18n2.getMessage("dz.shen"), I18n2.getMessage("dz.you"), I18n2.getMessage("dz.xu")].join(",").indexOf(mz) > -1) {
              if (I18n2.getMessage("jz.wuShen") === dgz) {
                ret = true;
              }
            } else if ([I18n2.getMessage("dz.hai"), I18n2.getMessage("dz.zi"), I18n2.getMessage("dz.chou")].join(",").indexOf(mz) > -1) {
              if (I18n2.getMessage("jz.jiaZi") === dgz) {
                ret = true;
              }
            }
            return ret;
          },
          toString: function() {
            return this.getYearInChinese() + "年" + this.getMonthInChinese() + "月" + this.getDayInChinese();
          },
          toFullString: function() {
            return "道歷" + this.getYearInChinese() + "年，天運" + this._p.lunar.getYearInGanZhi() + "年，" + this._p.lunar.getMonthInGanZhi() + "月，" + this._p.lunar.getDayInGanZhi() + "日。" + this.getMonthInChinese() + "月" + this.getDayInChinese() + "日，" + this._p.lunar.getTimeZhi() + "時。";
          }
        };
      };
      return {
        BIRTH_YEAR: -2697,
        fromYmdHms: function(y, m, d, hour, minute, second) {
          return _fromYmdHms(y, m, d, hour, minute, second);
        },
        fromYmd: function(y, m, d) {
          return _fromYmdHms(y, m, d, 0, 0, 0);
        },
        fromLunar: function(lunar2) {
          return _fromLunar(lunar2);
        }
      };
    }();
    var I18n2 = function() {
      var _defaultLang = "chs";
      var _lang = _defaultLang;
      var _inited = false;
      var _messages = {
        "chs": {
          "tg.jia": "甲",
          "tg.yi": "乙",
          "tg.bing": "丙",
          "tg.ding": "丁",
          "tg.wu": "戊",
          "tg.ji": "己",
          "tg.geng": "庚",
          "tg.xin": "辛",
          "tg.ren": "壬",
          "tg.gui": "癸",
          "dz.zi": "子",
          "dz.chou": "丑",
          "dz.yin": "寅",
          "dz.mao": "卯",
          "dz.chen": "辰",
          "dz.si": "巳",
          "dz.wu": "午",
          "dz.wei": "未",
          "dz.shen": "申",
          "dz.you": "酉",
          "dz.xu": "戌",
          "dz.hai": "亥",
          "zx.jian": "建",
          "zx.chu": "除",
          "zx.man": "满",
          "zx.ping": "平",
          "zx.ding": "定",
          "zx.zhi": "执",
          "zx.po": "破",
          "zx.wei": "危",
          "zx.cheng": "成",
          "zx.shou": "收",
          "zx.kai": "开",
          "zx.bi": "闭",
          "jz.jiaZi": "甲子",
          "jz.yiChou": "乙丑",
          "jz.bingYin": "丙寅",
          "jz.dingMao": "丁卯",
          "jz.wuChen": "戊辰",
          "jz.jiSi": "己巳",
          "jz.gengWu": "庚午",
          "jz.xinWei": "辛未",
          "jz.renShen": "壬申",
          "jz.guiYou": "癸酉",
          "jz.jiaXu": "甲戌",
          "jz.yiHai": "乙亥",
          "jz.bingZi": "丙子",
          "jz.dingChou": "丁丑",
          "jz.wuYin": "戊寅",
          "jz.jiMao": "己卯",
          "jz.gengChen": "庚辰",
          "jz.xinSi": "辛巳",
          "jz.renWu": "壬午",
          "jz.guiWei": "癸未",
          "jz.jiaShen": "甲申",
          "jz.yiYou": "乙酉",
          "jz.bingXu": "丙戌",
          "jz.dingHai": "丁亥",
          "jz.wuZi": "戊子",
          "jz.jiChou": "己丑",
          "jz.gengYin": "庚寅",
          "jz.xinMao": "辛卯",
          "jz.renChen": "壬辰",
          "jz.guiSi": "癸巳",
          "jz.jiaWu": "甲午",
          "jz.yiWei": "乙未",
          "jz.bingShen": "丙申",
          "jz.dingYou": "丁酉",
          "jz.wuXu": "戊戌",
          "jz.jiHai": "己亥",
          "jz.gengZi": "庚子",
          "jz.xinChou": "辛丑",
          "jz.renYin": "壬寅",
          "jz.guiMao": "癸卯",
          "jz.jiaChen": "甲辰",
          "jz.yiSi": "乙巳",
          "jz.bingWu": "丙午",
          "jz.dingWei": "丁未",
          "jz.wuShen": "戊申",
          "jz.jiYou": "己酉",
          "jz.gengXu": "庚戌",
          "jz.xinHai": "辛亥",
          "jz.renZi": "壬子",
          "jz.guiChou": "癸丑",
          "jz.jiaYin": "甲寅",
          "jz.yiMao": "乙卯",
          "jz.bingChen": "丙辰",
          "jz.dingSi": "丁巳",
          "jz.wuWu": "戊午",
          "jz.jiWei": "己未",
          "jz.gengShen": "庚申",
          "jz.xinYou": "辛酉",
          "jz.renXu": "壬戌",
          "jz.guiHai": "癸亥",
          "sx.rat": "鼠",
          "sx.ox": "牛",
          "sx.tiger": "虎",
          "sx.rabbit": "兔",
          "sx.dragon": "龙",
          "sx.snake": "蛇",
          "sx.horse": "马",
          "sx.goat": "羊",
          "sx.monkey": "猴",
          "sx.rooster": "鸡",
          "sx.dog": "狗",
          "sx.pig": "猪",
          "dw.long": "龙",
          "dw.niu": "牛",
          "dw.gou": "狗",
          "dw.yang": "羊",
          "dw.tu": "兔",
          "dw.shu": "鼠",
          "dw.ji": "鸡",
          "dw.ma": "马",
          "dw.hu": "虎",
          "dw.zhu": "猪",
          "dw.hou": "猴",
          "dw.she": "蛇",
          "dw.huLi": "狐",
          "dw.yan": "燕",
          "dw.bao": "豹",
          "dw.yuan": "猿",
          "dw.yin": "蚓",
          "dw.lu": "鹿",
          "dw.wu": "乌",
          "dw.jiao": "蛟",
          "dw.lang": "狼",
          "dw.fu": "蝠",
          "dw.zhang": "獐",
          "dw.xu": "獝",
          "dw.xie": "獬",
          "dw.han": "犴",
          "dw.he": "貉",
          "dw.zhi": "彘",
          "wx.jin": "金",
          "wx.mu": "木",
          "wx.shui": "水",
          "wx.huo": "火",
          "wx.tu": "土",
          "wx.ri": "日",
          "wx.yue": "月",
          "n.zero": "〇",
          "n.one": "一",
          "n.two": "二",
          "n.three": "三",
          "n.four": "四",
          "n.five": "五",
          "n.six": "六",
          "n.seven": "七",
          "n.eight": "八",
          "n.nine": "九",
          "n.ten": "十",
          "n.eleven": "十一",
          "n.twelve": "十二",
          "d.one": "初一",
          "d.two": "初二",
          "d.three": "初三",
          "d.four": "初四",
          "d.five": "初五",
          "d.six": "初六",
          "d.seven": "初七",
          "d.eight": "初八",
          "d.nine": "初九",
          "d.ten": "初十",
          "d.eleven": "十一",
          "d.twelve": "十二",
          "d.thirteen": "十三",
          "d.fourteen": "十四",
          "d.fifteen": "十五",
          "d.sixteen": "十六",
          "d.seventeen": "十七",
          "d.eighteen": "十八",
          "d.nighteen": "十九",
          "d.twenty": "二十",
          "d.twentyOne": "廿一",
          "d.twentyTwo": "廿二",
          "d.twentyThree": "廿三",
          "d.twentyFour": "廿四",
          "d.twentyFive": "廿五",
          "d.twentySix": "廿六",
          "d.twentySeven": "廿七",
          "d.twentyEight": "廿八",
          "d.twentyNine": "廿九",
          "d.thirty": "三十",
          "m.one": "正",
          "m.two": "二",
          "m.three": "三",
          "m.four": "四",
          "m.five": "五",
          "m.six": "六",
          "m.seven": "七",
          "m.eight": "八",
          "m.nine": "九",
          "m.ten": "十",
          "m.eleven": "冬",
          "m.twelve": "腊",
          "w.sun": "日",
          "w.mon": "一",
          "w.tues": "二",
          "w.wed": "三",
          "w.thur": "四",
          "w.fri": "五",
          "w.sat": "六",
          "xz.aries": "白羊",
          "xz.taurus": "金牛",
          "xz.gemini": "双子",
          "xz.cancer": "巨蟹",
          "xz.leo": "狮子",
          "xz.virgo": "处女",
          "xz.libra": "天秤",
          "xz.scorpio": "天蝎",
          "xz.sagittarius": "射手",
          "xz.capricornus": "摩羯",
          "xz.aquarius": "水瓶",
          "xz.pisces": "双鱼",
          "bg.qian": "乾",
          "bg.kun": "坤",
          "bg.zhen": "震",
          "bg.xun": "巽",
          "bg.kan": "坎",
          "bg.li": "离",
          "bg.gen": "艮",
          "bg.dui": "兑",
          "ps.center": "中",
          "ps.dong": "东",
          "ps.nan": "南",
          "ps.xi": "西",
          "ps.bei": "北",
          "ps.zhong": "中宫",
          "ps.zhengDong": "正东",
          "ps.zhengNan": "正南",
          "ps.zhengXi": "正西",
          "ps.zhengBei": "正北",
          "ps.dongBei": "东北",
          "ps.dongNan": "东南",
          "ps.xiBei": "西北",
          "ps.xiNan": "西南",
          "ps.wai": "外",
          "ps.fangNei": "房内",
          "jq.dongZhi": "冬至",
          "jq.xiaoHan": "小寒",
          "jq.daHan": "大寒",
          "jq.liChun": "立春",
          "jq.yuShui": "雨水",
          "jq.jingZhe": "惊蛰",
          "jq.chunFen": "春分",
          "jq.qingMing": "清明",
          "jq.guYu": "谷雨",
          "jq.liXia": "立夏",
          "jq.xiaoMan": "小满",
          "jq.mangZhong": "芒种",
          "jq.xiaZhi": "夏至",
          "jq.xiaoShu": "小暑",
          "jq.daShu": "大暑",
          "jq.liQiu": "立秋",
          "jq.chuShu": "处暑",
          "jq.baiLu": "白露",
          "jq.qiuFen": "秋分",
          "jq.hanLu": "寒露",
          "jq.shuangJiang": "霜降",
          "jq.liDong": "立冬",
          "jq.xiaoXue": "小雪",
          "jq.daXue": "大雪",
          "sn.qingLong": "青龙",
          "sn.baiHu": "白虎",
          "sn.zhuQue": "朱雀",
          "sn.xuanWu": "玄武",
          "sn.mingTang": "明堂",
          "sn.tianXing": "天刑",
          "sn.tianDe": "天德",
          "sn.jinKui": "金匮",
          "sn.yuTang": "玉堂",
          "sn.siMing": "司命",
          "sn.tianLao": "天牢",
          "sn.gouChen": "勾陈",
          "sn.tianEn": "天恩",
          "sn.muCang": "母仓",
          "sn.shiYang": "时阳",
          "sn.shengQi": "生气",
          "sn.yiHou": "益后",
          "sn.zaiSha": "灾煞",
          "sn.tianHuo": "天火",
          "sn.siJi": "四忌",
          "sn.baLong": "八龙",
          "sn.fuRi": "复日",
          "sn.xuShi": "续世",
          "sn.yueSha": "月煞",
          "sn.yueXu": "月虚",
          "sn.xueZhi": "血支",
          "sn.tianZei": "天贼",
          "sn.wuXu": "五虚",
          "sn.tuFu": "土符",
          "sn.guiJi": "归忌",
          "sn.xueJi": "血忌",
          "sn.yueDe": "月德",
          "sn.yueEn": "月恩",
          "sn.siXiang": "四相",
          "sn.wangRi": "王日",
          "sn.tianCang": "天仓",
          "sn.buJiang": "不将",
          "sn.wuHe": "五合",
          "sn.mingFeiDui": "鸣吠对",
          "sn.yueJian": "月建",
          "sn.xiaoShi": "小时",
          "sn.tuHu": "土府",
          "sn.wangWang": "往亡",
          "sn.yaoAn": "要安",
          "sn.siShen": "死神",
          "sn.tianMa": "天马",
          "sn.jiuHu": "九虎",
          "sn.qiNiao": "七鸟",
          "sn.liuShe": "六蛇",
          "sn.guanRi": "官日",
          "sn.jiQi": "吉期",
          "sn.yuYu": "玉宇",
          "sn.daShi": "大时",
          "sn.daBai": "大败",
          "sn.xianChi": "咸池",
          "sn.shouRi": "守日",
          "sn.tianWu": "天巫",
          "sn.fuDe": "福德",
          "sn.liuYi": "六仪",
          "sn.jinTang": "金堂",
          "sn.yanDui": "厌对",
          "sn.zhaoYao": "招摇",
          "sn.jiuKong": "九空",
          "sn.jiuKan": "九坎",
          "sn.jiuJiao": "九焦",
          "sn.xiangRi": "相日",
          "sn.baoGuang": "宝光",
          "sn.tianGang": "天罡",
          "sn.yueXing": "月刑",
          "sn.yueHai": "月害",
          "sn.youHuo": "游祸",
          "sn.chongRi": "重日",
          "sn.shiDe": "时德",
          "sn.minRi": "民日",
          "sn.sanHe": "三合",
          "sn.linRi": "临日",
          "sn.shiYin": "时阴",
          "sn.mingFei": "鸣吠",
          "sn.siQi": "死气",
          "sn.diNang": "地囊",
          "sn.yueDeHe": "月德合",
          "sn.jingAn": "敬安",
          "sn.puHu": "普护",
          "sn.jieShen": "解神",
          "sn.xiaoHao": "小耗",
          "sn.tianDeHe": "天德合",
          "sn.yueKong": "月空",
          "sn.yiMa": "驿马",
          "sn.tianHou": "天后",
          "sn.chuShen": "除神",
          "sn.yuePo": "月破",
          "sn.daHao": "大耗",
          "sn.wuLi": "五离",
          "sn.yinDe": "阴德",
          "sn.fuSheng": "福生",
          "sn.tianLi": "天吏",
          "sn.zhiSi": "致死",
          "sn.yuanWu": "元武",
          "sn.yangDe": "阳德",
          "sn.tianXi": "天喜",
          "sn.tianYi": "天医",
          "sn.yueYan": "月厌",
          "sn.diHuo": "地火",
          "sn.fourHit": "四击",
          "sn.daSha": "大煞",
          "sn.daHui": "大会",
          "sn.tianYuan": "天愿",
          "sn.liuHe": "六合",
          "sn.wuFu": "五富",
          "sn.shengXin": "圣心",
          "sn.heKui": "河魁",
          "sn.jieSha": "劫煞",
          "sn.siQiong": "四穷",
          "sn.chuShuiLong": "触水龙",
          "sn.baFeng": "八风",
          "sn.tianShe": "天赦",
          "sn.wuMu": "五墓",
          "sn.baZhuan": "八专",
          "sn.yinCuo": "阴错",
          "sn.siHao": "四耗",
          "sn.yangCuo": "阳错",
          "sn.siFei": "四废",
          "sn.sanYin": "三阴",
          "sn.xiaoHui": "小会",
          "sn.yinDaoChongYang": "阴道冲阳",
          "sn.danYin": "单阴",
          "sn.guChen": "孤辰",
          "sn.yinWei": "阴位",
          "sn.xingHen": "行狠",
          "sn.liaoLi": "了戾",
          "sn.jueYin": "绝阴",
          "sn.chunYang": "纯阳",
          "sn.suiBo": "岁薄",
          "sn.yinYangJiaoPo": "阴阳交破",
          "sn.yinYangJuCuo": "阴阳俱错",
          "sn.yinYangJiChong": "阴阳击冲",
          "sn.zhuZhen": "逐阵",
          "sn.yangCuoYinChong": "阳错阴冲",
          "sn.qiFu": "七符",
          "sn.tianGou": "天狗",
          "sn.chengRi": "成日",
          "sn.tianFu": "天符",
          "sn.guYang": "孤阳",
          "sn.jueYang": "绝阳",
          "sn.chunYin": "纯阴",
          "sn.yinShen": "阴神",
          "sn.jieChu": "解除",
          "sn.yangPoYinChong": "阳破阴冲",
          "sn.sanSang": "三丧",
          "sn.guiKu": "鬼哭",
          "sn.daTui": "大退",
          "sn.siLi": "四离",
          "ss.biJian": "比肩",
          "ss.jieCai": "劫财",
          "ss.shiShen": "食神",
          "ss.shangGuan": "伤官",
          "ss.pianCai": "偏财",
          "ss.zhengCai": "正财",
          "ss.qiSha": "七杀",
          "ss.zhengGuan": "正官",
          "ss.pianYin": "偏印",
          "ss.zhengYin": "正印",
          "s.none": "无",
          "s.huangDao": "黄道",
          "s.heiDao": "黑道",
          "s.goodLuck": "吉",
          "s.badLuck": "凶",
          "s.yin": "阴",
          "s.yang": "阳",
          "s.white": "白",
          "s.black": "黑",
          "s.blue": "碧",
          "s.green": "绿",
          "s.yellow": "黄",
          "s.red": "赤",
          "s.purple": "紫",
          "jr.chuXi": "除夕",
          "jr.chunJie": "春节",
          "jr.yuanXiao": "元宵节",
          "jr.longTou": "龙头节",
          "jr.duanWu": "端午节",
          "jr.qiXi": "七夕节",
          "jr.zhongQiu": "中秋节",
          "jr.chongYang": "重阳节",
          "jr.laBa": "腊八节",
          "jr.yuanDan": "元旦节",
          "jr.qingRen": "情人节",
          "jr.fuNv": "妇女节",
          "jr.zhiShu": "植树节",
          "jr.xiaoFei": "消费者权益日",
          "jr.wuYi": "劳动节",
          "jr.qingNian": "青年节",
          "jr.erTong": "儿童节",
          "jr.yuRen": "愚人节",
          "jr.jianDang": "建党节",
          "jr.jianJun": "建军节",
          "jr.jiaoShi": "教师节",
          "jr.guoQing": "国庆节",
          "jr.wanShengYe": "万圣节前夜",
          "jr.wanSheng": "万圣节",
          "jr.pingAn": "平安夜",
          "jr.shengDan": "圣诞节",
          "ds.changSheng": "长生",
          "ds.muYu": "沐浴",
          "ds.guanDai": "冠带",
          "ds.linGuan": "临官",
          "ds.diWang": "帝旺",
          "ds.shuai": "衰",
          "ds.bing": "病",
          "ds.si": "死",
          "ds.mu": "墓",
          "ds.jue": "绝",
          "ds.tai": "胎",
          "ds.yang": "养",
          "h.first": "初候",
          "h.second": "二候",
          "h.third": "三候",
          "h.qiuYinJie": "蚯蚓结",
          "h.miJiao": "麋角解",
          "h.shuiQuan": "水泉动",
          "h.yanBei": "雁北乡",
          "h.queShi": "鹊始巢",
          "h.zhiShi": "雉始雊",
          "h.jiShi": "鸡始乳",
          "h.zhengNiao": "征鸟厉疾",
          "h.shuiZe": "水泽腹坚",
          "h.dongFeng": "东风解冻",
          "h.zheChongShiZhen": "蛰虫始振",
          "h.yuZhi": "鱼陟负冰",
          "h.taJi": "獭祭鱼",
          "h.houYan": "候雁北",
          "h.caoMuMengDong": "草木萌动",
          "h.taoShi": "桃始华",
          "h.cangGeng": "仓庚鸣",
          "h.yingHua": "鹰化为鸠",
          "h.xuanNiaoZhi": "玄鸟至",
          "h.leiNai": "雷乃发声",
          "h.shiDian": "始电",
          "h.tongShi": "桐始华",
          "h.tianShu": "田鼠化为鴽",
          "h.hongShi": "虹始见",
          "h.pingShi": "萍始生",
          "h.mingJiu": "鸣鸠拂其羽",
          "h.daiSheng": "戴胜降于桑",
          "h.louGuo": "蝼蝈鸣",
          "h.qiuYinChu": "蚯蚓出",
          "h.wangGua": "王瓜生",
          "h.kuCai": "苦菜秀",
          "h.miCao": "靡草死",
          "h.maiQiu": "麦秋至",
          "h.tangLang": "螳螂生",
          "h.juShi": "鵙始鸣",
          "h.fanShe": "反舌无声",
          "h.luJia": "鹿角解",
          "h.tiaoShi": "蜩始鸣",
          "h.banXia": "半夏生",
          "h.wenFeng": "温风至",
          "h.xiShuai": "蟋蟀居壁",
          "h.yingShi": "鹰始挚",
          "h.fuCao": "腐草为萤",
          "h.tuRun": "土润溽暑",
          "h.daYu": "大雨行时",
          "h.liangFeng": "凉风至",
          "h.baiLu": "白露降",
          "h.hanChan": "寒蝉鸣",
          "h.yingNai": "鹰乃祭鸟",
          "h.tianDi": "天地始肃",
          "h.heNai": "禾乃登",
          "h.hongYanLai": "鸿雁来",
          "h.xuanNiaoGui": "玄鸟归",
          "h.qunNiao": "群鸟养羞",
          "h.leiShi": "雷始收声",
          "h.zheChongPiHu": "蛰虫坯户",
          "h.shuiShiHe": "水始涸",
          "h.hongYanLaiBin": "鸿雁来宾",
          "h.queRu": "雀入大水为蛤",
          "h.juYou": "菊有黄花",
          "h.caiNai": "豺乃祭兽",
          "h.caoMuHuangLuo": "草木黄落",
          "h.zheChongXianFu": "蛰虫咸俯",
          "h.shuiShiBing": "水始冰",
          "h.diShi": "地始冻",
          "h.zhiRu": "雉入大水为蜃",
          "h.hongCang": "虹藏不见",
          "h.tianQi": "天气上升地气下降",
          "h.biSe": "闭塞而成冬",
          "h.heDan": "鹖鴠不鸣",
          "h.huShi": "虎始交",
          "h.liTing": "荔挺出",
          "ts.zhan": "占",
          "ts.hu": "户",
          "ts.win": "窗",
          "ts.fang": "房",
          "ts.chuang": "床",
          "ts.lu": "炉",
          "ts.zao": "灶",
          "ts.dui": "碓",
          "ts.mo": "磨",
          "ts.xi": "栖",
          "ts.chu": "厨",
          "ts.ce": "厕",
          "ts.cang": "仓",
          "ts.cangKu": "仓库",
          "ts.daMen": "大门",
          "ts.men": "门",
          "ts.tang": "堂",
          "ly.xianSheng": "先胜",
          "ly.xianFu": "先负",
          "ly.youYin": "友引",
          "ly.foMie": "佛灭",
          "ly.daAn": "大安",
          "ly.chiKou": "赤口",
          "yj.jiSi": "祭祀",
          "yj.qiFu": "祈福",
          "yj.qiuSi": "求嗣",
          "yj.kaiGuang": "开光",
          "yj.suHui": "塑绘",
          "yj.qiJiao": "齐醮",
          "yj.zhaiJiao": "斋醮",
          "yj.muYu": "沐浴",
          "yj.chouShen": "酬神",
          "yj.zaoMiao": "造庙",
          "yj.siZhao": "祀灶",
          "yj.fenXiang": "焚香",
          "yj.xieTu": "谢土",
          "yj.chuHuo": "出火",
          "yj.diaoKe": "雕刻",
          "yj.jiaQu": "嫁娶",
          "yj.DingHun": "订婚",
          "yj.naCai": "纳采",
          "yj.wenMing": "问名",
          "yj.naXu": "纳婿",
          "yj.guiNing": "归宁",
          "yj.anChuang": "安床",
          "yj.heZhang": "合帐",
          "yj.guanJi": "冠笄",
          "yj.dingMeng": "订盟",
          "yj.jinRenKou": "进人口",
          "yj.caiYi": "裁衣",
          "yj.wanMian": "挽面",
          "yj.kaiRong": "开容",
          "yj.xiuFen": "修坟",
          "yj.qiZuan": "启钻",
          "yj.poTu": "破土",
          "yj.anZang": "安葬",
          "yj.liBei": "立碑",
          "yj.chengFu": "成服",
          "yj.chuFu": "除服",
          "yj.kaiShengFen": "开生坟",
          "yj.heShouMu": "合寿木",
          "yj.ruLian": "入殓",
          "yj.yiJiu": "移柩",
          "yj.puDu": "普渡",
          "yj.ruZhai": "入宅",
          "yj.anXiang": "安香",
          "yj.anMen": "安门",
          "yj.xiuZao": "修造",
          "yj.qiJi": "起基",
          "yj.dongTu": "动土",
          "yj.shangLiang": "上梁",
          "yj.shuZhu": "竖柱",
          "yj.kaiJing": "开井开池",
          "yj.zuoBei": "作陂放水",
          "yj.chaiXie": "拆卸",
          "yj.poWu": "破屋",
          "yj.huaiYuan": "坏垣",
          "yj.buYuan": "补垣",
          "yj.faMuZuoLiang": "伐木做梁",
          "yj.zuoZhao": "作灶",
          "yj.jieChu": "解除",
          "yj.kaiZhuYan": "开柱眼",
          "yj.chuanPing": "穿屏扇架",
          "yj.gaiWuHeJi": "盖屋合脊",
          "yj.kaiCe": "开厕",
          "yj.zaoCang": "造仓",
          "yj.saiXue": "塞穴",
          "yj.pingZhi": "平治道涂",
          "yj.zaoQiao": "造桥",
          "yj.zuoCe": "作厕",
          "yj.zhuDi": "筑堤",
          "yj.kaiChi": "开池",
          "yj.faMu": "伐木",
          "yj.kaiQu": "开渠",
          "yj.jueJing": "掘井",
          "yj.saoShe": "扫舍",
          "yj.fangShui": "放水",
          "yj.zaoWu": "造屋",
          "yj.heJi": "合脊",
          "yj.zaoChuChou": "造畜稠",
          "yj.xiuMen": "修门",
          "yj.dingSang": "定磉",
          "yj.zuoLiang": "作梁",
          "yj.xiuShi": "修饰垣墙",
          "yj.jiaMa": "架马",
          "yj.kaiShi": "开市",
          "yj.guaBian": "挂匾",
          "yj.naChai": "纳财",
          "yj.qiuCai": "求财",
          "yj.kaiCang": "开仓",
          "yj.maiChe": "买车",
          "yj.zhiChan": "置产",
          "yj.guYong": "雇佣",
          "yj.chuHuoCai": "出货财",
          "yj.anJiXie": "安机械",
          "yj.zaoCheQi": "造车器",
          "yj.jingLuo": "经络",
          "yj.yunNiang": "酝酿",
          "yj.zuoRan": "作染",
          "yj.guZhu": "鼓铸",
          "yj.zaoChuan": "造船",
          "yj.geMi": "割蜜",
          "yj.zaiZhong": "栽种",
          "yj.quYu": "取渔",
          "yj.jieWang": "结网",
          "yj.muYang": "牧养",
          "yj.anDuiWei": "安碓磑",
          "yj.xiYi": "习艺",
          "yj.ruXue": "入学",
          "yj.liFa": "理发",
          "yj.tanBing": "探病",
          "yj.jianGui": "见贵",
          "yj.chengChuan": "乘船",
          "yj.duShui": "渡水",
          "yj.zhenJiu": "针灸",
          "yj.chuXing": "出行",
          "yj.yiXi": "移徙",
          "yj.fenJu": "分居",
          "yj.TiTou": "剃头",
          "yj.zhengShou": "整手足甲",
          "yj.naChu": "纳畜",
          "yj.buZhuo": "捕捉",
          "yj.tianLie": "畋猎",
          "yj.jiaoNiuMa": "教牛马",
          "yj.huiQinYou": "会亲友",
          "yj.fuRen": "赴任",
          "yj.qiuYi": "求医",
          "yj.zhiBing": "治病",
          "yj.ciSong": "词讼",
          "yj.qiJiDongTu": "起基动土",
          "yj.poWuHuaiYuan": "破屋坏垣",
          "yj.gaiWu": "盖屋",
          "yj.zaoCangKu": "造仓库",
          "yj.liQuanJiaoYi": "立券交易",
          "yj.jiaoYi": "交易",
          "yj.liQuan": "立券",
          "yj.anJi": "安机",
          "yj.huiYou": "会友",
          "yj.qiuYiLiaoBing": "求医疗病",
          "yj.zhuShi": "诸事不宜",
          "yj.yuShi": "馀事勿取",
          "yj.xingSang": "行丧",
          "yj.duanYi": "断蚁",
          "yj.guiXiu": "归岫",
          "xx.bi": "毕",
          "xx.yi": "翼",
          "xx.ji": "箕",
          "xx.kui": "奎",
          "xx.gui": "鬼",
          "xx.di": "氐",
          "xx.xu": "虚",
          "xx.wei": "危",
          "xx.zi": "觜",
          "xx.zhen": "轸",
          "xx.dou": "斗",
          "xx.lou": "娄",
          "xx.liu": "柳",
          "xx.fang": "房",
          "xx.xin": "心",
          "xx.shi": "室",
          "xx.can": "参",
          "xx.jiao": "角",
          "xx.niu": "牛",
          "xx.vei": "胃",
          "xx.xing": "星",
          "xx.zhang": "张",
          "xx.tail": "尾",
          "xx.qiang": "壁",
          "xx.jing": "井",
          "xx.kang": "亢",
          "xx.nv": "女",
          "xx.mao": "昴",
          "sz.chun": "春",
          "sz.xia": "夏",
          "sz.qiu": "秋",
          "sz.dong": "冬",
          "od.first": "孟",
          "od.second": "仲",
          "od.third": "季",
          "yx.shuo": "朔",
          "yx.jiShuo": "既朔",
          "yx.eMeiXin": "蛾眉新",
          "yx.eMei": "蛾眉",
          "yx.xi": "夕",
          "yx.shangXian": "上弦",
          "yx.jiuYe": "九夜",
          "yx.night": "宵",
          "yx.jianYingTu": "渐盈凸",
          "yx.xiaoWang": "小望",
          "yx.wang": "望",
          "yx.jiWang": "既望",
          "yx.liDai": "立待",
          "yx.juDai": "居待",
          "yx.qinDai": "寝待",
          "yx.gengDai": "更待",
          "yx.jianKuiTu": "渐亏凸",
          "yx.xiaXian": "下弦",
          "yx.youMing": "有明",
          "yx.eMeiCan": "蛾眉残",
          "yx.can": "残",
          "yx.xiao": "晓",
          "yx.hui": "晦",
          "ny.sangZhe": "桑柘",
          "ny.baiLa": "白蜡",
          "ny.yangLiu": "杨柳",
          "ny.jinBo": "金箔",
          "ny.haiZhong": "海中",
          "ny.daHai": "大海",
          "ny.shaZhong": "沙中",
          "ny.luZhong": "炉中",
          "ny.shanXia": "山下",
          "ny.daLin": "大林",
          "ny.pingDi": "平地",
          "ny.luPang": "路旁",
          "ny.biShang": "壁上",
          "ny.jianFeng": "剑锋",
          "ny.shanTou": "山头",
          "ny.fuDeng": "覆灯",
          "ny.jianXia": "涧下",
          "ny.tianHe": "天河",
          "ny.chengTou": "城头",
          "ny.daYi": "大驿",
          "ny.chaiChuan": "钗钏",
          "ny.quanZhong": "泉中",
          "ny.daXi": "大溪",
          "ny.wuShang": "屋上",
          "ny.piLi": "霹雳",
          "ny.tianShang": "天上",
          "ny.songBo": "松柏",
          "ny.shiLiu": "石榴",
          "ny.changLiu": "长流"
        },
        "en": {
          "tg.jia": "Jia",
          "tg.yi": "Yi",
          "tg.bing": "Bing",
          "tg.ding": "Ding",
          "tg.wu": "Wu",
          "tg.ji": "Ji",
          "tg.geng": "Geng",
          "tg.xin": "Xin",
          "tg.ren": "Ren",
          "tg.gui": "Gui",
          "dz.zi": "Zi",
          "dz.chou": "Chou",
          "dz.yin": "Yin",
          "dz.mao": "Mao",
          "dz.chen": "Chen",
          "dz.si": "Si",
          "dz.wu": "Wu",
          "dz.wei": "Wei",
          "dz.shen": "Shen",
          "dz.you": "You",
          "dz.xu": "Xu",
          "dz.hai": "Hai",
          "zx.jian": "Build",
          "zx.chu": "Remove",
          "zx.man": "Full",
          "zx.ping": "Flat",
          "zx.ding": "Stable",
          "zx.zhi": "Hold",
          "zx.po": "Break",
          "zx.wei": "Danger",
          "zx.cheng": "Complete",
          "zx.shou": "Collect",
          "zx.kai": "Open",
          "zx.bi": "Close",
          "jz.jiaZi": "JiaZi",
          "jz.yiChou": "YiChou",
          "jz.bingYin": "BingYin",
          "jz.dingMao": "DingMao",
          "jz.wuChen": "WuChen",
          "jz.jiSi": "JiSi",
          "jz.gengWu": "GengWu",
          "jz.xinWei": "XinWei",
          "jz.renShen": "RenShen",
          "jz.guiYou": "GuiYou",
          "jz.jiaXu": "JiaXu",
          "jz.yiHai": "YiHai",
          "jz.bingZi": "BingZi",
          "jz.dingChou": "DingChou",
          "jz.wuYin": "WuYin",
          "jz.jiMao": "JiMao",
          "jz.gengChen": "GengChen",
          "jz.xinSi": "XinSi",
          "jz.renWu": "RenWu",
          "jz.guiWei": "GuiWei",
          "jz.jiaShen": "JiaShen",
          "jz.yiYou": "YiYou",
          "jz.bingXu": "BingXu",
          "jz.dingHai": "DingHai",
          "jz.wuZi": "WuZi",
          "jz.jiChou": "JiChou",
          "jz.gengYin": "GengYin",
          "jz.xinMao": "XinMao",
          "jz.renChen": "RenChen",
          "jz.guiSi": "GuiSi",
          "jz.jiaWu": "JiaWu",
          "jz.yiWei": "YiWei",
          "jz.bingShen": "BingShen",
          "jz.dingYou": "DingYou",
          "jz.wuXu": "WuXu",
          "jz.jiHai": "JiHai",
          "jz.gengZi": "GengZi",
          "jz.xinChou": "XinChou",
          "jz.renYin": "RenYin",
          "jz.guiMao": "GuiMao",
          "jz.jiaChen": "JiaChen",
          "jz.yiSi": "YiSi",
          "jz.bingWu": "BingWu",
          "jz.dingWei": "DingWei",
          "jz.wuShen": "WuShen",
          "jz.jiYou": "JiYou",
          "jz.gengXu": "GengXu",
          "jz.xinHai": "XinHai",
          "jz.renZi": "RenZi",
          "jz.guiChou": "GuiChou",
          "jz.jiaYin": "JiaYin",
          "jz.yiMao": "YiMao",
          "jz.bingChen": "BingChen",
          "jz.dingSi": "DingSi",
          "jz.wuWu": "WuWu",
          "jz.jiWei": "JiWei",
          "jz.gengShen": "GengShen",
          "jz.xinYou": "XinYou",
          "jz.renXu": "RenXu",
          "jz.guiHai": "GuiHai",
          "sx.rat": "Rat",
          "sx.ox": "Ox",
          "sx.tiger": "Tiger",
          "sx.rabbit": "Rabbit",
          "sx.dragon": "Dragon",
          "sx.snake": "Snake",
          "sx.horse": "Horse",
          "sx.goat": "Goat",
          "sx.monkey": "Monkey",
          "sx.rooster": "Rooster",
          "sx.dog": "Dog",
          "sx.pig": "Pig",
          "dw.long": "Dragon",
          "dw.niu": "Ox",
          "dw.gou": "Dog",
          "dw.yang": "Goat",
          "dw.tu": "Rabbit",
          "dw.shu": "Rat",
          "dw.ji": "Rooster",
          "dw.ma": "Horse",
          "dw.hu": "Tiger",
          "dw.zhu": "Pig",
          "dw.hou": "Monkey",
          "dw.she": "Snake",
          "dw.huLi": "Fox",
          "dw.yan": "Swallow",
          "dw.bao": "Leopard",
          "dw.yuan": "Ape",
          "dw.yin": "Earthworm",
          "dw.lu": "Deer",
          "dw.wu": "Crow",
          "dw.lang": "Wolf",
          "dw.fu": "Bat",
          "wx.jin": "Metal",
          "wx.mu": "Wood",
          "wx.shui": "Water",
          "wx.huo": "Fire",
          "wx.tu": "Earth",
          "wx.ri": "Sun",
          "wx.yue": "Moon",
          "n.zero": "0",
          "n.one": "1",
          "n.two": "2",
          "n.three": "3",
          "n.four": "4",
          "n.five": "5",
          "n.six": "6",
          "n.seven": "7",
          "n.eight": "8",
          "n.nine": "9",
          "n.ten": "10",
          "n.eleven": "11",
          "n.twelve": "12",
          "w.sun": "Sunday",
          "w.mon": "Monday",
          "w.tues": "Tuesday",
          "w.wed": "Wednesday",
          "w.thur": "Thursday",
          "w.fri": "Friday",
          "w.sat": "Saturday",
          "xz.aries": "Aries",
          "xz.taurus": "Taurus",
          "xz.gemini": "Gemini",
          "xz.cancer": "Cancer",
          "xz.leo": "Leo",
          "xz.virgo": "Virgo",
          "xz.libra": "Libra",
          "xz.scorpio": "Scorpio",
          "xz.sagittarius": "Sagittarius",
          "xz.capricornus": "Capricornus",
          "xz.aquarius": "Aquarius",
          "xz.pisces": "Pisces",
          "bg.qian": "Qian",
          "bg.kun": "Kun",
          "bg.zhen": "Zhen",
          "bg.xun": "Xun",
          "bg.kan": "Kan",
          "bg.li": "Li",
          "bg.gen": "Gen",
          "bg.dui": "Dui",
          "ps.center": "Center",
          "ps.dong": "East",
          "ps.nan": "South",
          "ps.xi": "West",
          "ps.bei": "North",
          "ps.zhong": "Center",
          "ps.zhengDong": "East",
          "ps.zhengNan": "South",
          "ps.zhengXi": "West",
          "ps.zhengBei": "North",
          "ps.dongBei": "Northeast",
          "ps.dongNan": "Southeast",
          "ps.xiBei": "Northwest",
          "ps.xiNan": "Southwest",
          "jq.dongZhi": "Winter Solstice",
          "jq.xiaoHan": "Lesser Cold",
          "jq.daHan": "Great Cold",
          "jq.liChun": "Spring Beginning",
          "jq.yuShui": "Rain Water",
          "jq.jingZhe": "Awakening from Hibernation",
          "jq.chunFen": "Spring Equinox",
          "jq.qingMing": "Fresh Green",
          "jq.guYu": "Grain Rain",
          "jq.liXia": "Beginning of Summer",
          "jq.xiaoMan": "Lesser Fullness",
          "jq.mangZhong": "Grain in Ear",
          "jq.xiaZhi": "Summer Solstice",
          "jq.xiaoShu": "Lesser Heat",
          "jq.daShu": "Greater Heat",
          "jq.liQiu": "Beginning of Autumn",
          "jq.chuShu": "End of Heat",
          "jq.baiLu": "White Dew",
          "jq.qiuFen": "Autumnal Equinox",
          "jq.hanLu": "Cold Dew",
          "jq.shuangJiang": "First Frost",
          "jq.liDong": "Beginning of Winter",
          "jq.xiaoXue": "Light Snow",
          "jq.daXue": "Heavy Snow",
          "sn.qingLong": "Azure Dragon",
          "sn.baiHu": "White Tiger",
          "sn.zhuQue": "Rosefinch",
          "sn.xuanWu": "Black Tortoise",
          "sn.tianEn": "Serene Grace",
          "sn.siShen": "Death",
          "sn.tianMa": "Pegasus",
          "sn.baLong": "Eight Dragon",
          "sn.jiuHu": "Nine Tiger",
          "sn.qiNiao": "Seven Bird",
          "sn.liuShe": "Six Snake",
          "s.none": "None",
          "s.goodLuck": "Good luck",
          "s.badLuck": "Bad luck",
          "s.yin": "Yin",
          "s.yang": "Yang",
          "s.white": "White",
          "s.black": "Black",
          "s.blue": "Blue",
          "s.green": "Green",
          "s.yellow": "Yellow",
          "s.red": "Red",
          "s.purple": "Purple",
          "jr.chuXi": "Chinese New Year's Eve",
          "jr.chunJie": "Luna New Year",
          "jr.yuanXiao": "Lantern Festival",
          "jr.duanWu": "Dragon Boat Festival",
          "jr.qiXi": "Begging Festival",
          "jr.zhongQiu": "Mid-Autumn Festival",
          "jr.laBa": "Laba Festival",
          "jr.yuanDan": "New Year's Day",
          "jr.qingRen": "Valentine's Day",
          "jr.fuNv": "Women's Day",
          "jr.xiaoFei": "Consumer Rights Day",
          "jr.zhiShu": "Arbor Day",
          "jr.wuYi": "International Worker's Day",
          "jr.erTong": "Children's Day",
          "jr.qingNian": "Youth Day",
          "jr.yuRen": "April Fools' Day",
          "jr.jianDang": "Party's Day",
          "jr.jianJun": "Army Day",
          "jr.jiaoShi": "Teachers' Day",
          "jr.guoQing": "National Day",
          "jr.wanShengYe": "All Saints' Eve",
          "jr.wanSheng": "All Saints' Day",
          "jr.pingAn": "Christmas Eve",
          "jr.shengDan": "Christmas Day",
          "ts.zhan": "At",
          "ts.hu": "Household",
          "ts.zao": "Cooker",
          "ts.dui": "Pestle",
          "ts.xi": "Habitat",
          "ts.win": "Window",
          "ts.fang": "Room",
          "ts.chuang": "Bed",
          "ts.lu": "Stove",
          "ts.mo": "Mill",
          "ts.chu": "Kitchen",
          "ts.ce": "Toilet",
          "ts.cang": "Depot",
          "ts.cangKu": "Depot",
          "ts.daMen": "Gate",
          "ts.men": "Door",
          "ts.tang": "Hall",
          "ly.xianSheng": "Win first",
          "ly.xianFu": "Lose first",
          "ly.youYin": "Friend's referral",
          "ly.foMie": "Buddhism's demise",
          "ly.daAn": "Great safety",
          "ly.chiKou": "Chikagoro",
          "yj.jiSi": "Sacrifice",
          "yj.qiFu": "Pray",
          "yj.qiuSi": "Seek heirs",
          "yj.kaiGuang": "Consecretion",
          "yj.suHui": "Paint sculptural",
          "yj.qiJiao": "Build altar",
          "yj.zhaiJiao": "Taoist rites",
          "yj.muYu": "Bathing",
          "yj.chouShen": "Reward gods",
          "yj.zaoMiao": "Build temple",
          "yj.siZhao": "Offer kitchen god",
          "yj.fenXiang": "Burn incense",
          "yj.xieTu": "Earth gratitude",
          "yj.chuHuo": "Expel the flame",
          "yj.diaoKe": "Carving",
          "yj.jiaQu": "Marriage",
          "yj.DingHun": "Engagement",
          "yj.naCai": "Proposing",
          "yj.wenMing": "Ask name",
          "yj.naXu": "Uxorilocal marriage",
          "yj.guiNing": "Visit parents",
          "yj.anChuang": "Bed placing",
          "yj.heZhang": "Make up accounts",
          "yj.guanJi": "Crowning adulthood",
          "yj.dingMeng": "Make alliance",
          "yj.jinRenKou": "Adopt",
          "yj.caiYi": "Dressmaking",
          "yj.wanMian": "Cosmeticsurgery",
          "yj.kaiRong": "Open face",
          "yj.xiuFen": "Grave repair",
          "yj.qiZuan": "Open coffin",
          "yj.poTu": "Break earth",
          "yj.anZang": "Burial",
          "yj.liBei": "Tombstone erecting",
          "yj.chengFu": "Formation of clothes",
          "yj.chuFu": "Mourning clothes removal",
          "yj.kaiShengFen": "Open grave",
          "yj.heShouMu": "Make coffin",
          "yj.ruLian": "Body placing",
          "yj.yiJiu": "Move coffin",
          "yj.puDu": "Save soul",
          "yj.ruZhai": "Enter house",
          "yj.anXiang": "Incenst placement",
          "yj.anMen": "Door placing",
          "yj.xiuZao": "Repair",
          "yj.qiJi": "Digging",
          "yj.dongTu": "Break ground",
          "yj.shangLiang": "Beam placing",
          "yj.shuZhu": "Erecting pillars",
          "yj.kaiJing": "Open pond and well",
          "yj.zuoBei": "Make pond and fill water",
          "yj.chaiXie": "Smash house",
          "yj.poWu": "Break house",
          "yj.huaiYuan": "Demolish",
          "yj.buYuan": "Mending",
          "yj.faMuZuoLiang": "Make beams",
          "yj.zuoZhao": "Make stove",
          "yj.jieChu": "Removal",
          "yj.kaiZhuYan": "Build beam",
          "yj.chuanPing": "Build door",
          "yj.gaiWuHeJi": "Cover house",
          "yj.kaiCe": "Open toilet",
          "yj.zaoCang": "Build depot",
          "yj.saiXue": "Block nest",
          "yj.pingZhi": "Repair roads",
          "yj.zaoQiao": "Build bridge",
          "yj.zuoCe": "Build toilet",
          "yj.zhuDi": "Fill",
          "yj.kaiChi": "Open pond",
          "yj.faMu": "Lumbering",
          "yj.kaiQu": "Canalization",
          "yj.jueJing": "Dig well",
          "yj.saoShe": "Sweep house",
          "yj.fangShui": "Drainage",
          "yj.zaoWu": "Build house",
          "yj.heJi": "Close ridge",
          "yj.zaoChuChou": "Livestock thickening",
          "yj.xiuMen": "Repair door",
          "yj.dingSang": "Fix stone",
          "yj.zuoLiang": "Beam construction",
          "yj.xiuShi": "Decorate wall",
          "yj.jiaMa": "Erect horse",
          "yj.kaiShi": "Opening",
          "yj.guaBian": "Hang plaque",
          "yj.naChai": "Accept wealth",
          "yj.qiuCai": "Seek wealth",
          "yj.kaiCang": "Open depot",
          "yj.maiChe": "Buy car",
          "yj.zhiChan": "Buy property",
          "yj.guYong": "Hire",
          "yj.chuHuoCai": "Delivery",
          "yj.anJiXie": "Build machine",
          "yj.zaoCheQi": "Build car",
          "yj.jingLuo": "Build loom",
          "yj.yunNiang": "Brew",
          "yj.zuoRan": "Dye",
          "yj.guZhu": "Cast",
          "yj.zaoChuan": "Build boat",
          "yj.geMi": "Harvest honey",
          "yj.zaiZhong": "Farming",
          "yj.quYu": "Fishing",
          "yj.jieWang": "Netting",
          "yj.muYang": "Graze",
          "yj.anDuiWei": "Build rub",
          "yj.xiYi": "Learn",
          "yj.ruXue": "Enter school",
          "yj.liFa": "Haircut",
          "yj.tanBing": "Visiting",
          "yj.jianGui": "Meet noble",
          "yj.chengChuan": "Ride boat",
          "yj.duShui": "Cross water",
          "yj.zhenJiu": "Acupuncture",
          "yj.chuXing": "Travel",
          "yj.yiXi": "Move",
          "yj.fenJu": "Live apart",
          "yj.TiTou": "Shave",
          "yj.zhengShou": "Manicure",
          "yj.naChu": "Feed livestock",
          "yj.buZhuo": "Catch",
          "yj.tianLie": "Hunt",
          "yj.jiaoNiuMa": "Train horse",
          "yj.huiQinYou": "Meet friends",
          "yj.fuRen": "Go post",
          "yj.qiuYi": "See doctor",
          "yj.zhiBing": "Treat",
          "yj.ciSong": "Litigation",
          "yj.qiJiDongTu": "Lay foundation",
          "yj.poWuHuaiYuan": "Demolish",
          "yj.gaiWu": "Build house",
          "yj.zaoCangKu": "Build depot",
          "yj.liQuanJiaoYi": "Covenant trade",
          "yj.jiaoYi": "Trade",
          "yj.liQuan": "Covenant",
          "yj.anJi": "Install machine",
          "yj.huiYou": "Meet friends",
          "yj.qiuYiLiaoBing": "Seek treatment",
          "yj.zhuShi": "Everything Sucks",
          "yj.yuShi": "Do nothing else",
          "yj.xingSang": "Funeral",
          "yj.duanYi": "Block ant hole",
          "yj.guiXiu": "Place beam",
          "xx.bi": "Finish",
          "xx.yi": "Wing",
          "xx.ji": "Sieve",
          "xx.kui": "Qui",
          "xx.gui": "Ghost",
          "xx.di": "Foundation",
          "xx.xu": "Virtual",
          "xx.wei": "Danger",
          "xx.zi": "Mouth",
          "xx.zhen": "Cross-bar",
          "xx.dou": "Fight",
          "xx.lou": "Weak",
          "xx.liu": "Willow",
          "xx.fang": "House",
          "xx.xin": "Heart",
          "xx.shi": "Room",
          "xx.can": "Join",
          "xx.jiao": "Horn",
          "xx.niu": "Ox",
          "xx.vei": "Stomach",
          "xx.xing": "Star",
          "xx.zhang": "Chang",
          "xx.tail": "Tail",
          "xx.qiang": "Wall",
          "xx.jing": "Well",
          "xx.kang": "Kang",
          "xx.nv": "Female",
          "xx.mao": "Mao",
          "sz.chun": "Spring",
          "sz.xia": "Summer",
          "sz.qiu": "Autumn",
          "sz.dong": "Winter",
          "yx.shuo": "New",
          "yx.eMeiXin": "New waxing",
          "yx.eMei": "Waxing",
          "yx.xi": "Evening",
          "yx.shangXian": "First quarter",
          "yx.jiuYe": "Nine night",
          "yx.night": "Night",
          "yx.jianYingTu": "Gibbous",
          "yx.xiaoWang": "Little full",
          "yx.wang": "Full",
          "yx.jianKuiTu": "Disseminating",
          "yx.xiaXian": "Third quarter",
          "yx.eMeiCan": "Waning waxing",
          "yx.can": "Waning",
          "yx.xiao": "Daybreak",
          "yx.hui": "Obscure",
          "ny.sangZhe": "Cudrania",
          "ny.baiLa": "Wax",
          "ny.yangLiu": "Willow",
          "ny.jinBo": "Foil",
          "ny.haiZhong": "Sea",
          "ny.daHai": "Ocean",
          "ny.shaZhong": "Sand",
          "ny.luZhong": "Stove",
          "ny.shanXia": "Piedmont",
          "ny.daLin": "Forest",
          "ny.pingDi": "Land",
          "ny.luPang": "Roadside",
          "ny.biShang": "Wall",
          "ny.jianFeng": "Blade",
          "ny.shanTou": "Hilltop",
          "ny.fuDeng": "Light",
          "ny.jianXia": "Valleyn",
          "ny.tianHe": "River",
          "ny.chengTou": "City",
          "ny.daYi": "Post",
          "ny.chaiChuan": "Ornaments",
          "ny.quanZhong": "Spring",
          "ny.daXi": "Stream",
          "ny.wuShang": "Roof",
          "ny.piLi": "Thunderbolt",
          "ny.tianShang": "Sky",
          "ny.songBo": "Coniferin",
          "ny.shiLiu": "Pomegranate",
          "ny.changLiu": "Flows"
        }
      };
      var _objs = {
        "LunarUtil": LunarUtil2,
        "SolarUtil": SolarUtil2,
        "TaoUtil": TaoUtil2,
        "FotoUtil": FotoUtil2,
        "NineStarUtil": NineStarUtil2
      };
      var _dictString = {
        "LunarUtil": {
          "TIAN_SHEN_TYPE": {},
          "TIAN_SHEN_TYPE_LUCK": {},
          "XIU_LUCK": {},
          "LU": {},
          "XIU": {},
          "SHA": {},
          "POSITION_DESC": {},
          "NAYIN": {},
          "WU_XING_GAN": {},
          "WU_XING_ZHI": {},
          "SHOU": {},
          "GONG": {},
          "FESTIVAL": {},
          "ZHENG": {},
          "ANIMAL": {},
          "SHI_SHEN": {},
          "XIU_SONG": {}
        },
        "SolarUtil": {
          "FESTIVAL": {}
        },
        "TaoUtil": {
          "BA_HUI": {},
          "BA_JIE": {}
        }
      };
      var _dictNumber = {
        "LunarUtil": {
          "ZHI_TIAN_SHEN_OFFSET": {},
          "CHANG_SHENG_OFFSET": {}
        }
      };
      var _dictArray = {
        "LunarUtil": {
          "ZHI_HIDE_GAN": {}
        }
      };
      var _arrays = {
        "LunarUtil": {
          "GAN": [],
          "ZHI": [],
          "JIA_ZI": [],
          "ZHI_XING": [],
          "XUN": [],
          "XUN_KONG": [],
          "CHONG": [],
          "CHONG_GAN": [],
          "CHONG_GAN_TIE": [],
          "HE_GAN_5": [],
          "HE_ZHI_6": [],
          "SHENGXIAO": [],
          "NUMBER": [],
          "POSITION_XI": [],
          "POSITION_YANG_GUI": [],
          "POSITION_YIN_GUI": [],
          "POSITION_FU": [],
          "POSITION_FU_2": [],
          "POSITION_CAI": [],
          "POSITION_TAI_SUI_YEAR": [],
          "POSITION_GAN": [],
          "POSITION_ZHI": [],
          "JIE_QI": [],
          "JIE_QI_IN_USE": [],
          "TIAN_SHEN": [],
          "SHEN_SHA": [],
          "PENGZU_GAN": [],
          "PENGZU_ZHI": [],
          "MONTH_ZHI": [],
          "CHANG_SHENG": [],
          "HOU": [],
          "WU_HOU": [],
          "POSITION_TAI_DAY": [],
          "POSITION_TAI_MONTH": [],
          "YI_JI": [],
          "LIU_YAO": [],
          "MONTH": [],
          "SEASON": [],
          "DAY": [],
          "YUE_XIANG": []
        },
        "SolarUtil": {
          "WEEK": [],
          "XINGZUO": []
        },
        "TaoUtil": {
          "AN_WU": []
        },
        "FotoUtil": {
          "XIU_27": []
        },
        "NineStarUtil": {
          "NUMBER": [],
          "WU_XING": [],
          "POSITION": [],
          "LUCK_XUAN_KONG": [],
          "YIN_YANG_QI_MEN": [],
          "COLOR": []
        }
      };
      var _updateArray = function(c) {
        var v = _arrays[c];
        var o2 = _objs[c];
        for (var k in v) {
          var arr = v[k];
          for (var i = 0, j = arr.length; i < j; i++) {
            o2[k][i] = arr[i].replace(/{(.[^}]*)}/g, function($0, $1) {
              return _getMessage($1);
            });
          }
        }
      };
      var _updateStringDictionary = function(c) {
        var v = _dictString[c];
        var o2 = _objs[c];
        for (var k in v) {
          var dict = v[k];
          for (var key in dict) {
            var i = key.replace(/{(.[^}]*)}/g, function($0, $1) {
              return _getMessage($1);
            });
            o2[k][i] = dict[key].replace(/{(.[^}]*)}/g, function($0, $1) {
              return _getMessage($1);
            });
          }
        }
      };
      var _updateNumberDictionary = function(c) {
        var v = _dictNumber[c];
        var o2 = _objs[c];
        for (var k in v) {
          var dict = v[k];
          for (var key in dict) {
            var i = key.replace(/{(.[^}]*)}/g, function($0, $1) {
              return _getMessage($1);
            });
            o2[k][i] = dict[key];
          }
        }
      };
      var _updateArrayDictionary = function(c) {
        var v = _dictArray[c];
        var o2 = _objs[c];
        for (var k in v) {
          var dict = v[k];
          for (var key in dict) {
            var x = key.replace(/{(.[^}]*)}/g, function($0, $1) {
              return _getMessage($1);
            });
            var arr = dict[key];
            for (var i = 0, j = arr.length; i < j; i++) {
              arr[i] = arr[i].replace(/{(.[^}]*)}/g, function($0, $1) {
                return _getMessage($1);
              });
            }
            o2[k][x] = arr;
          }
        }
      };
      var _update = function() {
        var c;
        for (c in _arrays) {
          _updateArray(c);
        }
        for (c in _dictString) {
          _updateStringDictionary(c);
        }
        for (c in _dictNumber) {
          _updateNumberDictionary(c);
        }
        for (c in _dictArray) {
          _updateArrayDictionary(c);
        }
      };
      var _setLanguage = function(lang2) {
        if (_messages[lang2]) {
          _lang = lang2;
          _update();
        }
      };
      var _getLanguage = function() {
        return _lang;
      };
      var _setMessages = function(lang2, messages) {
        if (!messages) {
          return;
        }
        if (!_messages[lang2]) {
          _messages[lang2] = {};
        }
        for (var key in messages) {
          _messages[lang2][key] = messages[key];
        }
        _update();
      };
      var _getMessage = function(key) {
        var s = _messages[_lang][key];
        if (void 0 === s) {
          s = _messages[_defaultLang][key];
        }
        if (void 0 === s) {
          s = key;
        }
        return s;
      };
      var _initArray = function(c) {
        var v = _arrays[c];
        var o2 = _objs[c];
        for (var k in v) {
          v[k].length = 0;
          var arr = o2[k];
          for (var i = 0, j = arr.length; i < j; i++) {
            v[k].push(arr[i]);
          }
        }
      };
      var _initDictionary = function(c, type) {
        var v;
        switch (type) {
          case "string":
            v = _dictString[c];
            break;
          case "number":
            v = _dictNumber[c];
            break;
          case "array":
            v = _dictArray[c];
            break;
        }
        var o2 = _objs[c];
        for (var k in v) {
          var dict = o2[k];
          for (var key in dict) {
            v[k][key] = dict[key];
          }
        }
      };
      var _init = function() {
        if (_inited) {
          return;
        }
        _inited = true;
        var c;
        for (c in _arrays) {
          _initArray(c);
        }
        for (c in _dictString) {
          _initDictionary(c, "string");
        }
        for (c in _dictNumber) {
          _initDictionary(c, "number");
        }
        for (c in _dictArray) {
          _initDictionary(c, "array");
        }
        _setLanguage(_defaultLang);
      };
      _init();
      return {
        getLanguage: function() {
          return _getLanguage();
        },
        setLanguage: function(lang2) {
          _setLanguage(lang2);
        },
        getMessage: function(key) {
          return _getMessage(key);
        },
        setMessages: function(lang2, messages) {
          _setMessages(lang2, messages);
        }
      };
    }();
    return {
      ShouXingUtil: ShouXingUtil2,
      SolarUtil: SolarUtil2,
      LunarUtil: LunarUtil2,
      FotoUtil: FotoUtil2,
      TaoUtil: TaoUtil2,
      NineStarUtil: NineStarUtil2,
      Solar: Solar2,
      Lunar: Lunar2,
      Foto: Foto2,
      Tao: Tao2,
      NineStar: NineStar2,
      EightChar: EightChar2,
      SolarWeek: SolarWeek2,
      SolarMonth: SolarMonth2,
      SolarSeason: SolarSeason2,
      SolarHalfYear: SolarHalfYear2,
      SolarYear: SolarYear2,
      LunarMonth: LunarMonth2,
      LunarYear: LunarYear2,
      LunarTime: LunarTime2,
      HolidayUtil: HolidayUtil2,
      I18n: I18n2
    };
  });
})(lunar);
var lunarExports = lunar.exports;
const { Solar, Lunar, Foto, Tao, NineStar, EightChar, SolarWeek, SolarMonth, SolarSeason, SolarHalfYear, SolarYear, LunarMonth, LunarYear, LunarTime, ShouXingUtil, SolarUtil, LunarUtil, FotoUtil, TaoUtil, HolidayUtil, NineStarUtil, I18n } = lunarExports;
var lunarJavascript = {
  Solar,
  Lunar,
  Foto,
  Tao,
  NineStar,
  EightChar,
  SolarWeek,
  SolarMonth,
  SolarSeason,
  SolarHalfYear,
  SolarYear,
  LunarMonth,
  LunarYear,
  LunarTime,
  ShouXingUtil,
  SolarUtil,
  LunarUtil,
  FotoUtil,
  TaoUtil,
  HolidayUtil,
  NineStarUtil,
  I18n
};
exports._export_sfc = _export_sfc;
exports.computed = computed;
exports.createApp = createApp$1;
exports.createPinia = createPinia;
exports.defineComponent = defineComponent;
exports.defineStore = defineStore;
exports.e = e;
exports.f = f;
exports.hooks = hooks;
exports.index = index;
exports.lunarJavascript = lunarJavascript;
exports.nextTick$1 = nextTick$1;
exports.o = o;
exports.onMounted = onMounted;
exports.reactive = reactive;
exports.ref = ref;
exports.t = t;
exports.unref = unref;
exports.watch = watch;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
