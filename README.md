HyperApp Auto History
=====================

tl;dr: Keeps some fields in your `state` object in-sync with the browser's
URL bar. Changing the state changes the URL, changing the URL changes the
state. You can copy-paste the URL to somebody, so that not only do they see
the same page, but they also see the same data inside the page :D

If the page is loaded with no hash, populate it with default settings. If
the page is loaded with a hash, load our initial settings from there.

For apps who only care about "what page is the user viewing", it's probably
nicer to use a router plugin which looks at the whole url, so that the user
sees `mysite.com/cats` where this plugin would give `mysite.com/#page=cats`.
But if you want to have multiple state variables in the URL, this can work :)

There are currently three supplied encoders:

- `smart-url`: key / value pairs, but attempt to cast data types to match
  what was supplied in `init`
  - If `init.foo` is a number, `state.foo` will be set to `parseFloat(value)`.
  - If `init.foo` is a boolean, `state.foo` will be `true` if `value` is
    any of "on", "true", or "1"
  - If `init.foo` is null, then `"null"` will be cast to `null` and all other
    inputs will be strings
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

See [demo.html](demo.html) for an interactive demo

Usage:

```js
import { AutoHistory } from "hyperapp-auto-history";

let state = {
    page: "track_list",
    selected_track: null,
    search: "",
    track_list: [
      {title: "Best Cat", artist: "Ciri"},
      {title: "Test Data", artist: "The Examples"},
      {title: "My Cat", artist: "Bonobo"},
    ],
};

app({
    init: state,
    subscriptions: (state) => [
        AutoHistory({
            push: ["page", "selected_track"],
            replace: ["search"],
            encoder: "json",
        }, state)
    ],
})
```
