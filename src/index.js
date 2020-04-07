const DEBUG = false;

export function encode(data, props) {
  if (props.encoder === "json") {
    return encodeURIComponent(JSON.stringify(data));
  } else if (props.encoder === "smart-url") {
    return new URLSearchParams(data).toString();
  } else if (props.encoder === "url") {
    return new URLSearchParams(data).toString();
  }
}

export function decode(data, props) {
  if (props.encoder === "json") {
    return JSON.parse(decodeURIComponent(data));
  } else if (props.encoder === "smart-url") {
    let obj = Object.fromEntries(new URLSearchParams(data));
    Object.keys(obj).forEach(function(key) {
      if (props.init !== undefined) {
        if (props.init[key] === null) {
          obj[key] = obj[key] === "null" ? null : obj[key];
        }
        if (typeof props.init[key] === "boolean") {
          obj[key] = ["true", "on", "1"].indexOf(obj[key].toLowerCase()) !== -1;
        }
        if (typeof props.init[key] === "number") {
          obj[key] = parseFloat(obj[key]);
        }
        if (Array.isArray(props.init[key])) {
          if (obj[key] === "") obj[key] = [];
          else obj[key] = obj[key].split(",");
        }
      }
    });
    return obj;
  } else if (props.encoder === "url") {
    return Object.fromEntries(new URLSearchParams(data));
  }
}

let just_popped = false;
let last_state = {};
function save_if_changed(state, props) {
  if (just_popped) {
    // If the change is due to popstate, then we don't want to save
    // this as a new state
    just_popped = false;
    return;
  }
  let mode = "no-change";
  let our_state = {};
  props.all_attrs.forEach(function(attr) {
    our_state[attr] = state[attr];
    if (last_state[attr] !== our_state[attr]) {
      // if any of our changed attributes are in the push list
      // then push, else replace
      if (props.push.indexOf(attr) >= 0 || mode === "push") {
        mode = "push";
      } else {
        mode = "replace";
      }
    }
  });
  if (DEBUG)
    console.log("State change:", last_state, "->", our_state, "=", mode);
  let hashed = "#" + encode(our_state, props);
  if (mode === "push") window.history.pushState(our_state, "", hashed);
  if (mode === "replace") window.history.replaceState(our_state, "", hashed);
  last_state = our_state;
}

/*
 * Whenever the hash changes (either via user typing, or back / forward
 * button, or some other programatic thing) we want to sync our state
 */
function historyPopEffect(dispatch, action) {
  let handler = dispatch.bind(null, action);
  window.addEventListener("hashchange", handler);
  return function() {
    window.removeEventListener("hashchange", handler);
  };
}

function mergeHashIntoState(state, props) {
  just_popped = true;
  let state_to_restore = {};
  if (window.location.hash) {
    let hash = window.location.hash.slice(1);
    let json = decode(hash, props);
    props.all_attrs.forEach(function(attr) {
      if (json[attr] !== undefined) {
        state_to_restore[attr] = json[attr];
      }
    });
  }
  return { ...state, ...state_to_restore };
}

export function AutoHistory(args) {
  let props = {
    init: {},
    push: [],
    replace: [],
    encoder: "smart-url",
    ...args
  };
  props.all_attrs = props.push.concat(props.replace);

  // On initial load
  if (window.location.hash) {
    // If we have some state in the hash, stick that into the app state
    let hash = window.location.hash.slice(1);
    let json = decode(hash, props);
    if (DEBUG) console.log("Loading initial state from hash:", json);
    props.all_attrs.forEach(function(attr) {
      if (json[attr] !== undefined) {
        props.init[attr] = json[attr];
      }
    });
    last_state = json;
    just_popped = true;
  } else {
    // if the hash is empty, then fill it with initial app state
    let our_state = {};
    props.all_attrs.forEach(function(attr) {
      our_state[attr] = props.init[attr];
    });
    if (DEBUG) console.log("Saving initial state to hash:", our_state);
    window.location.hash = "#" + encode(our_state, props);
    just_popped = true;
  }

  let manager = [historyPopEffect, [mergeHashIntoState, props]];
  manager.push_state_if_changed = function(state) {
    save_if_changed(state, props);
  };
  return manager;
}
