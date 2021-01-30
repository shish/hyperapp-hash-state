///////////////////////////////////////////////////////////////////////
// Generic js-object to string (and back) functions

export function encode(data, props) {
  if (props.encoder === "json") {
    return encodeURIComponent(JSON.stringify(data));
  } else if (props.encoder === "url") {
    return new URLSearchParams(data).toString();
  }
}

export function decode(data, props) {
  if (props.encoder === "json") {
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch (error) {
      console.log("Error while decoding state in hash:", error);
      return {};
    }
  } else if (props.encoder === "url") {
    return Object.fromEntries(new URLSearchParams(data));
  }
}

///////////////////////////////////////////////////////////////////////
// The actual state management

let we_just_changed_the_state = false;
let last_state = {};
let initialised = false;

// every time the state changes, check if we care about any of those
// changes, and update the hash if we do
function onstatechange(state, props) {
  if (we_just_changed_the_state) {
    // If the change is our fault (eg, onhashchange was fired, so we
    // took data from the hash and put it into the state), then don't
    // react to the change
    we_just_changed_the_state = false;
    return state;
  }
  let mode = "no-change";
  let our_state = {};
  props.push.concat(props.replace).forEach(function(attr) {
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
  let hashed = "#" + encode(our_state, props);
  if (mode === "push") window.history.pushState(our_state, "", hashed);
  if (mode === "replace") window.history.replaceState(our_state, "", hashed);
  last_state = our_state;
  return state;
}

function onhashchange(state, props) {
  we_just_changed_the_state = true;
  let new_state = { ...state };
  if (window.location.hash) {
    let hash_state = decode(window.location.hash.slice(1), props);
    props.push.concat(props.replace).forEach(function(attr) {
      if (hash_state[attr] !== undefined) {
        new_state[attr] = hash_state[attr];
      }
    });
    last_state = hash_state;
  }
  return new_state;
}

function init(dispatch, { encoded }) {
  // creating the subscription calls init(), which calls
  // dispatch(onhashload), which updates the state, which
  // updates the subscriptions, which calls init() (because
  // the first call hasn't returned yet)
  if (initialised) {
    return () => null;
  }
  initialised = true;

  let props = JSON.parse(encoded);

  // load initial state from initial hash
  dispatch(onhashchange, props);
  dispatch(onstatechange, props);

  // Whenever the hash changes (either via user typing, or back / forward
  // button, or some other programatic thing) we want to sync our state
  let handler = dispatch.bind(null, onhashchange, props);
  window.addEventListener("hashchange", handler);
  return function() {
    window.removeEventListener("hashchange", handler);
  };
}

export function AutoHistory(_props, state) {
  let props = {
    push: [],
    replace: [],
    encoder: "smart-url",
    ..._props
  };

  // the subscription-generator gets called on every state change -
  // let's hijack that to run our diff-since-last-state code
  if (initialised) {
    onstatechange(state, props);
  }

  // JSON because hyperapp refreshes the subscription every
  // time props changes - and it sees "a new object with the
  // same contents as the old object" as a change. But it sees
  // "a new string with the same bytes as the old string" as
  // not-a-change \o/
  return [init, { encoded: JSON.stringify(props) }];
}
