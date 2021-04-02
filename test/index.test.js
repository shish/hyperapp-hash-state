import { HashStateManager } from "../src";

describe("HashStateManager", () => {
  it("should initialise from empty", () => {
    window.location.hash = "";
    let init = { foo: "bar", baz: "qux" };
    HashStateManager({ push: ["foo"], replace: ["baz"] }, init);
    expect(init).toEqual({ foo: "bar", baz: "qux" });
  });
  /*
  it("should initialise with hash", () => {
    window.location.hash = "#foo=asdf";
    let init = { foo: "bar", baz: "qux" };
    AutoHistory({ init: init, push: ["foo"], replace: ["baz"] });
    expect(init).toEqual({ foo: "asdf", baz: "qux" });
  });
  it("should push history on push change", () => {
    window.location.hash = "";
    let init = { foo: "bar", baz: "qux" };
    let ah = AutoHistory({ init: init, push: ["foo"], replace: ["baz"] });
    expect(init).toEqual({ foo: "bar", baz: "qux" });
    ah.push_state_if_changed({ foo: "cake" });
    // expect(window.history.pushState).toBeCalledWith("#foo=cake&baz=pie");
  });
  it("should replace history on replace change", () => {
    let init = { foo: "bar", baz: "qux" };
    let ah = AutoHistory({ init: init, push: ["foo"], replace: ["baz"] });
    expect(init).toEqual({ foo: "bar", baz: "qux" });
    ah.push_state_if_changed({ baz: "pie" });
    // expect(window.history.replaceState).toBeCalledWith("#foo=cake&baz=pie");
  });
  */
});
