HyperApp Hash-State Manager
===========================

tl;dr: Keeps some fields in your `state` object in-sync with the browser's
URL bar. Changing the state changes the URL, changing the URL changes the
state. You can copy-paste the URL to somebody, so that not only do they see
the same page, but they also see the same data inside the page :D

See [demo.html](demo.html) for a self-contained, well-commented example

WARNING: the code inside here is an abomination and I'm pretty sure I'm
Doing It Wrong(tm) - pull requests from hyperapp experts who can help me
to do the same basic thing in a non-awful way would be appreciated :)

If the page is loaded with no hash, populate it with default settings. If
the page is loaded with a hash, load our initial settings from there.

For apps who only care about "what page is the user viewing", it's probably
nicer to use a router plugin which looks at the whole url, so that the user
sees `mysite.com/cats` where this plugin would give `mysite.com/#{"page":"cats"}`.
But if you want to have multiple state variables in the URL, this can work :)
