import type { Dispatch, Subscription, Unsubscribe } from "hyperapp";

type HashStateManagerArgs = {
  push?: Array<string>;
  replace?: Array<string>;
};
type HashStateManagerInternalProps = {
  push: Array<string>;
  replace: Array<string>;
};
type HashStateManagerProps = {
  encoded: string;
};

let we_just_changed_the_state = false;
let last_state = {};
let initialised = false;

// every time the state changes, check if we care about any of those
// changes, and update the hash if we do
function onstatechange<S>(state: S, props: HashStateManagerInternalProps): S {
  if (we_just_changed_the_state) {
    // If the change is our fault (eg, onhashchange was fired, so we
    // took data from the hash and put it into the state), then don't
    // react to the change
    we_just_changed_the_state = false;
    return state;
  }
  let mode = "no-change";
  let our_state = {};
  props.push.concat(props.replace).forEach(function (attr) {
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
  let hashed = "#" + encodeURIComponent(JSON.stringify(our_state));
  if (mode === "push") window.history.pushState(our_state, "", hashed);
  if (mode === "replace") window.history.replaceState(our_state, "", hashed);
  last_state = our_state;
  return state;
}

function onhashchange<S>(state: S, props: HashStateManagerInternalProps): S {
  we_just_changed_the_state = true;
  let new_state = { ...state };
  if (window.location.hash) {
    let hash_state = {};
    try {
      hash_state = JSON.parse(
        decodeURIComponent(window.location.hash.slice(1))
      );
    } catch (error) {
      console.log("Error while decoding state in hash:", error);
    }
    props.push.concat(props.replace).forEach(function (attr) {
      if (hash_state[attr] !== undefined) {
        new_state[attr] = hash_state[attr];
      }
    });
    last_state = hash_state;
  }
  return new_state;
}

function init<S>(
  dispatch: Dispatch<S>,
  { encoded }: HashStateManagerProps
): Unsubscribe {
  let props = JSON.parse(encoded);

  if (!initialised) {
    // The first time this subscription is ever active,
    // load state from hash
    requestAnimationFrame(() => {
      dispatch(onhashchange, props);
      dispatch(onstatechange, props);
      initialised = true;
    });
  }

  // Whenever the hash changes (either via user typing, or back / forward
  // button, or some other programatic thing) we want to sync our state
  let handler = dispatch.bind(null, onhashchange, props);
  window.addEventListener("hashchange", handler);
  return function () {
    window.removeEventListener("hashchange", handler);
  };
}

export function HashStateManager<S>(
  _props: HashStateManagerArgs,
  state: S
): Subscription<S, HashStateManagerProps> {
  let props: HashStateManagerInternalProps = {
    push: [],
    replace: [],
    ..._props,
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
