HyperApp Auto History
=====================

Monitor a few selected fields in the `state` object.
Whenever one of those fields changes, update the URL
hash and push a new history entry.

If the page is loaded with no hash, populate it with
default settings. If the page is loaded with a hash,
load our initial settings from there.

Hash is encoded as URIEncode'd JSON, eg if you're tracking
state.screen and it currently has the value "About":
`http://localhost:1234/#%7B%22screen%22%3A%22About%22%7D`

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

HistoryManager = AutoHistory({
    init: state,
    push: ["page", "track_id"],
    replace: ["search"],
})

app({
    init: state,
    subscriptions: function(state) {
        HistoryManager.push_if_state_changed(state);
        return [HistoryManager];
    }
})
```
