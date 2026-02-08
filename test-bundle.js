"use strict";
(() => {
  // src/styleshift/build-in-functions/logger-forwarder.ts
  var log_colors = {
    main: "color: #bada55",
    info: "color: #00ffff",
    warn: "color: #ffae00",
    error: "color: #ff0000",
    category: "color: #6a6a6a"
  };
  var create_forwarder = (level, color) => (category, ...args) => {
    const target = window.StyleShift?.logger;
    if (target && target.is_forwarder !== true) {
      target[level](category, ...args);
    } else {
      const method = level === "info" ? "log" : level;
      console[method](
        `%c StyleShift %c [${level.toUpperCase()}] %c [${category.toUpperCase()}]`,
        log_colors.main,
        color,
        log_colors.category,
        ...args
      );
    }
  };
  var logger = {
    is_forwarder: true,
    info: create_forwarder("info", log_colors.info),
    warn: create_forwarder("warn", log_colors.warn),
    error: create_forwarder("error", log_colors.error)
  };

  // src/styleshift/communication/web-page.ts
  var build_in_functions = {
    /*
    -------------------------------------------------------
    For normal user !!!
    -------------------------------------------------------
    */
    set_value: function(id, value) {
      window["StyleShift"]["build-in"]["_variables"][id] = value;
    },
    get_value: function(id) {
      return window["StyleShift"]["build-in"]["_variables"][id];
    },
    /*
    -------------------------------------------------------
    For advanced user !!!
    -------------------------------------------------------
    */
    load_styleshift_value: async function(id) {
      return JSON.parse(await StyleShift["build-in"]["_call_function"]("_load_styleshift_value", id));
    },
    save_styleshift_value: async function(id, value) {
      return JSON.parse(
        await StyleShift["build-in"]["_call_function"]("_save_styleshift_value", id, JSON.stringify(value))
      );
    },
    create_styleshift_setting_ui: async function(type, this_setting, ...args) {
      const ui_id = await StyleShift["build-in"]["_call_function"](
        "create_styleshift_setting_ui",
        type,
        this_setting,
        ...args
      );
      const ui = await StyleShift["build-in"]["wait_for_element"](
        `.StyleShift-Station [styleshift-ui-id="${ui_id}"]`
      );
      logger.info("ui", ui);
      ui.removeAttribute("styleshift-ui-id");
      return ui;
    },
    /*
    -------------------------------------------------------
    Danger zone !!!
    -------------------------------------------------------
    */
    _variables: {},
    _call_function: async function(function_name, ...args) {
      return await StyleShift["build-in"]["fire_function_event_with_return"]("StyleShift", function_name, ...args);
    }
  };
  for (const [function_name, this_function] of Object.entries(build_in_functions)) {
    StyleShift["build-in"][function_name] = this_function;
  }
})();
