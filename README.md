HyperApp Auto History
=====================

Monitor a few selected fields in the `state` object.
Whenever one of those fields changes, update the URL
hash and push a new history entry.

```
import {AutoHistory} from "hyperapp-auto-history";

HistoryManager = AutoHistory({
    init: state,
    // when eg state.page changes, a new history
    // entry will be pushed
	push: ["page", "track_id"],
    // when state.search changes, the current history
    // entry will be replaced
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
