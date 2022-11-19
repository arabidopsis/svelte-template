"use strict";
(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_style(node, key, value, important) {
    if (value === null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function tick() {
    schedule_update();
    return resolved_promise;
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = /* @__PURE__ */ new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // app/commands/src/Command.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[17] = list[i];
    return child_ctx;
  }
  function create_else_block(ctx) {
    let button0;
    let t0;
    let button0_disabled_value;
    let t1;
    let button1;
    let t2;
    let button1_disabled_value;
    let t3;
    let t4_value = (ctx[8] / 1e3).toFixed(2) + "";
    let t4;
    let t5;
    let t6;
    let t7;
    let show_if = ["CANCELLED", "DONE", "KILLED"].includes(ctx[3]);
    let if_block2_anchor;
    let mounted;
    let dispose;
    let if_block0 = ctx[5] !== 0 && create_if_block_3(ctx);
    let if_block1 = ctx[6] !== null && create_if_block_2(ctx);
    let if_block2 = show_if && create_if_block_1(ctx);
    return {
      c() {
        button0 = element("button");
        t0 = text("Stop Process");
        t1 = space();
        button1 = element("button");
        t2 = text("Kill Process");
        t3 = space();
        t4 = text(t4_value);
        t5 = text(" seconds\n  ");
        if (if_block0)
          if_block0.c();
        t6 = space();
        if (if_block1)
          if_block1.c();
        t7 = space();
        if (if_block2)
          if_block2.c();
        if_block2_anchor = empty();
        attr(button0, "class", "btn btn-primary");
        button0.disabled = button0_disabled_value = ctx[3] !== "STARTED";
        attr(button1, "class", "btn btn-danger");
        button1.disabled = button1_disabled_value = ctx[3] !== "STARTED";
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        append(button0, t0);
        insert(target, t1, anchor);
        insert(target, button1, anchor);
        append(button1, t2);
        insert(target, t3, anchor);
        insert(target, t4, anchor);
        insert(target, t5, anchor);
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t6, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t7, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, if_block2_anchor, anchor);
        if (!mounted) {
          dispose = [
            listen(button0, "click", ctx[13]),
            listen(button1, "click", ctx[10])
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 8 && button0_disabled_value !== (button0_disabled_value = ctx2[3] !== "STARTED")) {
          button0.disabled = button0_disabled_value;
        }
        if (dirty & 8 && button1_disabled_value !== (button1_disabled_value = ctx2[3] !== "STARTED")) {
          button1.disabled = button1_disabled_value;
        }
        if (dirty & 256 && t4_value !== (t4_value = (ctx2[8] / 1e3).toFixed(2) + ""))
          set_data(t4, t4_value);
        if (ctx2[5] !== 0) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_3(ctx2);
            if_block0.c();
            if_block0.m(t6.parentNode, t6);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (ctx2[6] !== null) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_2(ctx2);
            if_block1.c();
            if_block1.m(t7.parentNode, t7);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (dirty & 8)
          show_if = ["CANCELLED", "DONE", "KILLED"].includes(ctx2[3]);
        if (show_if) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_1(ctx2);
            if_block2.c();
            if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
      },
      d(detaching) {
        if (detaching)
          detach(button0);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(button1);
        if (detaching)
          detach(t3);
        if (detaching)
          detach(t4);
        if (detaching)
          detach(t5);
        if (if_block0)
          if_block0.d(detaching);
        if (detaching)
          detach(t6);
        if (if_block1)
          if_block1.d(detaching);
        if (detaching)
          detach(t7);
        if (if_block2)
          if_block2.d(detaching);
        if (detaching)
          detach(if_block2_anchor);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Start Process";
        attr(button, "class", "btn btn-info");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", ctx[11]);
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(button);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_3(ctx) {
    let code;
    let t0;
    let t1;
    return {
      c() {
        code = element("code");
        t0 = text("PID:");
        t1 = text(ctx[5]);
      },
      m(target, anchor) {
        insert(target, code, anchor);
        append(code, t0);
        append(code, t1);
      },
      p(ctx2, dirty) {
        if (dirty & 32)
          set_data(t1, ctx2[5]);
      },
      d(detaching) {
        if (detaching)
          detach(code);
      }
    };
  }
  function create_if_block_2(ctx) {
    let span;
    let t0;
    let t1;
    return {
      c() {
        span = element("span");
        t0 = text("retcode: ");
        t1 = text(ctx[6]);
        attr(span, "class", "r svelte-p02cmh");
        toggle_class(span, "retcode", ctx[6]);
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty & 64)
          set_data(t1, ctx2[6]);
        if (dirty & 64) {
          toggle_class(span, "retcode", ctx2[6]);
        }
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_1(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Reset";
        attr(button, "class", "btn btn-warning");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", ctx[9]);
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(button);
        mounted = false;
        dispose();
      }
    };
  }
  function create_each_block(ctx) {
    let t_value = ctx[17] + "";
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & 4 && t_value !== (t_value = ctx2[17] + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_fragment(ctx) {
    let t0;
    let pre;
    let style_max_height = `${ctx[0]}em`;
    let style_height = `${ctx[0]}em`;
    let t1;
    let h3;
    let t2;
    let code;
    let t3;
    let t4;
    let t5_value = (ctx[7] ? ctx[7] : "") + "";
    let t5;
    function select_block_type(ctx2, dirty) {
      if (ctx2[3] == "PENDING")
        return create_if_block;
      return create_else_block;
    }
    let current_block_type = select_block_type(ctx, -1);
    let if_block = current_block_type(ctx);
    let each_value = ctx[2];
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    return {
      c() {
        if_block.c();
        t0 = space();
        pre = element("pre");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t1 = space();
        h3 = element("h3");
        t2 = text("status: ");
        code = element("code");
        t3 = text(ctx[3]);
        t4 = space();
        t5 = text(t5_value);
        attr(pre, "class", "build-log mt-1 svelte-p02cmh");
        set_style(pre, "max-height", style_max_height, false);
        set_style(pre, "height", style_height, false);
        attr(h3, "class", "svelte-p02cmh");
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, t0, anchor);
        insert(target, pre, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(pre, null);
        }
        ctx[14](pre);
        insert(target, t1, anchor);
        insert(target, h3, anchor);
        append(h3, t2);
        append(h3, code);
        append(code, t3);
        append(h3, t4);
        append(h3, t5);
      },
      p(ctx2, [dirty]) {
        if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(t0.parentNode, t0);
          }
        }
        if (dirty & 4) {
          each_value = ctx2[2];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(pre, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (dirty & 1 && style_max_height !== (style_max_height = `${ctx2[0]}em`)) {
          set_style(pre, "max-height", style_max_height, false);
        }
        if (dirty & 1 && style_height !== (style_height = `${ctx2[0]}em`)) {
          set_style(pre, "height", style_height, false);
        }
        if (dirty & 8)
          set_data(t3, ctx2[3]);
        if (dirty & 128 && t5_value !== (t5_value = (ctx2[7] ? ctx2[7] : "") + ""))
          set_data(t5, t5_value);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if_block.d(detaching);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(pre);
        destroy_each(each_blocks, detaching);
        ctx[14](null);
        if (detaching)
          detach(t1);
        if (detaching)
          detach(h3);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    let { url = Config.url } = $$props;
    let { maxHeight = 20 } = $$props;
    let logarea;
    let logs = [];
    let currentState = "PENDING";
    let cancel = false;
    let pid = 0;
    let retcode = null;
    let error = null;
    let start = 0;
    let elapsed = 0;
    function reset() {
      $$invalidate(2, logs = []);
      $$invalidate(3, currentState = "PENDING");
      $$invalidate(4, cancel = false);
      $$invalidate(5, pid = 0);
      $$invalidate(6, retcode = null);
      $$invalidate(7, error = null);
    }
    function kill() {
      return __awaiter(this, void 0, void 0, function* () {
        if (pid !== 0) {
          const res = yield fetch(`${url}/kill/${pid}`);
          const txt = yield res.text();
          if (txt === "KILLED")
            $$invalidate(3, currentState = "KILLED");
        }
      });
    }
    function run2() {
      start = Date.now();
      const es = new EventSource(url);
      es.addEventListener("message", (event) => __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(event.data);
        if (data === null || cancel) {
          if (currentState != "KILLED") {
            $$invalidate(3, currentState = cancel ? "CANCELLED" : "DONE");
          }
          $$invalidate(5, pid = 0);
          es.close();
        } else if (data.kind === "pid") {
          $$invalidate(5, pid = data.pid);
        } else if (data.kind === "retcode") {
          $$invalidate(6, retcode = data.retcode);
        } else if (data.kind === "line") {
          logs.push(data.line + "\n");
          $$invalidate(2, logs);
          yield tick();
          $$invalidate(1, logarea.scrollTop = logarea.scrollHeight, logarea);
          $$invalidate(8, elapsed = Date.now() - start);
        } else {
          $$invalidate(7, error = data.msg);
        }
      }));
      $$invalidate(3, currentState = "STARTED");
    }
    const click_handler = () => $$invalidate(4, cancel = true);
    function pre_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        logarea = $$value;
        $$invalidate(1, logarea);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("url" in $$props2)
        $$invalidate(12, url = $$props2.url);
      if ("maxHeight" in $$props2)
        $$invalidate(0, maxHeight = $$props2.maxHeight);
    };
    return [
      maxHeight,
      logarea,
      logs,
      currentState,
      cancel,
      pid,
      retcode,
      error,
      elapsed,
      reset,
      kill,
      run2,
      url,
      click_handler,
      pre_binding
    ];
  }
  var Command = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { url: 12, maxHeight: 0 });
    }
  };
  var Command_default = Command;

  // app/commands/src/cmd.js
  var app = new Command_default({
    target: document.getElementById("app"),
    props: {
      maxHeight: 20
    }
  });
})();
//# sourceMappingURL=cmd.js.map
