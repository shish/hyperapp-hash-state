const DEBUG = false

let just_popped = false
let last_state = {}
function save_if_changed(state, props) {
  if (just_popped) {
    // If the change is due to popstate, then we don't want to save
    // this as a new state
    just_popped = false
    return
  }
  let mode = "no-change"
  let our_state = {}
  for (let i = 0; i < props.all_attrs.length; i++) {
    let attr = props.all_attrs[i]
    our_state[attr] = state[attr]
    if (last_state[attr] !== our_state[attr]) {
      if (props.push.indexOf(attr) >= 0) {
        mode = "push"
        break
      }
      mode = "replace"
    }
  }
  if (DEBUG)
    console.log("State change:", last_state, "->", our_state, "=", mode)
  let hashed = "#" + encodeURIComponent(JSON.stringify(our_state))
  if (mode === "push") window.history.pushState(our_state, "", hashed)
  if (mode === "replace") window.history.replaceState(our_state, "", hashed)
  last_state = our_state
}

/*
 * Subscriber - listen for window.history.popstate, update our state
 * object using the saved state
 */
function historyPopEffect(dispatch, action) {
  let handler = dispatch.bind(null, action)
  window.addEventListener("popstate", handler)
  return function() {
    window.removeEventListener("popstate", handler)
  }
}

function mergeHashIntoState(state, props) {
  just_popped = true
  let state_to_restore = {}
  if (window.location.hash) {
    let hash = window.location.hash.slice(1)
    let json = JSON.parse(decodeURIComponent(hash))
    for (let i = 0; i < props.all_attrs.length; i++) {
      state_to_restore[props.all_attrs[i]] = json[props.all_attrs[i]]
    }
  }
  return { ...state, ...state_to_restore }
}

export function AutoHistory(props) {
  props.all_attrs = (props.push || []).concat(props.replace || [])

  // On initial load
  if (window.location.hash) {
    // If we have some state in the hash, stick that into the app state
    let hash = window.location.hash.slice(1)
    let json = JSON.parse(decodeURIComponent(hash))
    if (DEBUG) console.log("Loading initial state from hash:", json)
    for (let i = 0; i < props.all_attrs.length; i++) {
      props.init[props.all_attrs[i]] = json[props.all_attrs[i]]
    }
    last_state = json
    just_popped = true
  } else {
    // if the hash is empty, then fill it with initial app state
    let our_state = {}
    for (let i = 0; i < props.all_attrs.length; i++) {
      let attr = props.all_attrs[i]
      our_state[attr] = props.init[attr]
    }
    if (DEBUG) console.log("Saving initial state to hash:", our_state)
    window.location.hash = "#" + encodeURIComponent(JSON.stringify(our_state))
    just_popped = true
  }

  let manager = [historyPopEffect, [mergeHashIntoState, props]]
  manager.push_state_if_changed = function(state) {
    save_if_changed(state, props)
  }
  return manager
}
