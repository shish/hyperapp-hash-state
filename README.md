HyperApp Auto History
=====================

Monitor a few selected fields in the `state` object. Whenever one of those
fields changes, update the URL hash and push a new history entry.

If the page is loaded with no hash, populate it with default settings. If
the page is loaded with a hash, load our initial settings from there.

There are currently three supplied encoders:

- `smart-url`: key / value pairs, but attempt to cast data types to match
  what was supplied in `init`
  - If `init.foo` is a number, `state.foo` will be set to `parseFloat(value)`.
  - If `init.foo` is a boolean, `state.foo` will be `true` if `value` is
    any of "on", "true", or "1"
- `url`: everything is strings, this is the raw data and it's up to you to
  handle it correctly.
- `json`: state is stored as a `URIEncode`'d JSON dictionary, this gives the
  most accurate types (eg it deals with `null` in a sane way), but it does look
  awfully ugly in the URL bar.

Args:

* init: an initial state object; may be modified if
  the page was loaded with args in the hash
* push: a list of attribute names; when any of these
  change, a new history entry is pushed
* replace: a list of attribute names; when any of these
  change, replace the current history entry

Usage:
```
import {AutoHistory} from "hyperapp-auto-history";

const HistoryManager = AutoHistory({
    init: state,
    push: ["page", "track_id"],
    replace: ["search"],
    encoder: "json",
})

app({
    init: state,
    subscriptions: function(state) {
        HistoryManager.push_state_if_changed(state);
        return [HistoryManager];
    }
})
```
