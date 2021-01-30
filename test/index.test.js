import { encode, decode } from "../src";

describe("url encoder", () => {
  it("should work", () => {
    let encoded = encode({ state: 42, foo: "bar" }, { encoder: "url" });
    expect(encoded).toEqual("state=42&foo=bar");
  });
});

describe("url decoder", () => {
  it("should work", () => {
    let decoded = decode("state=42&foo=bar", { encoder: "url" });
    expect(decoded).toEqual({ state: "42", foo: "bar" });
  });
  it("should leave everything as strings", () => {
    let init = { string: "cake", int: 123, bool: false };
    let decoded = decode("int=42&string=42&bool=42", { encoder: "url", init });
    expect(decoded).toEqual({ string: "42", int: "42", bool: "42" });
  });
});

describe("json encoder", () => {
  it("should work", () => {
    let encoded = encode({ state: 42 }, { encoder: "json" });
    expect(encoded).toEqual("%7B%22state%22%3A42%7D");
  });
  it("should be urlencoded json", () => {
    let decoded = decodeURIComponent(
      encode({ state: 42 }, { encoder: "json" })
    );
    expect(decoded).toEqual('{"state":42}');
  });
});

describe("json decoder", () => {
  it("should work", () => {
    let decoded = decode("%7B%22state%22%3A42%7D", { encoder: "json" });
    expect(decoded).toEqual({ state: 42 });
  });
});

/*
describe("AutoHistory", () => {
  it("should initialise from empty", () => {
    window.location.hash = "";
    let init = { foo: "bar", baz: "qux" };
    AutoHistory({ push: ["foo"], replace: ["baz"] }, init);
    expect(init).toEqual({ foo: "bar", baz: "qux" });
  });
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
});
*/
