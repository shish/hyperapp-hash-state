import { encode, decode, AutoHistory } from "../src"

describe("url encoder", () => {
  it("should work", () => {
    let encoded = encode({ state: 42, foo: "bar" }, { encoder: "url" })
    expect(encoded).toEqual("state=42&foo=bar")
  })
})

describe("url decoder", () => {
  it("should work", () => {
    let decoded = decode("state=42&foo=bar", { encoder: "url" })
    expect(decoded).toEqual({ state: "42", foo: "bar" })
  })
  it("should leave everything as strings", () => {
    let init = { string: "cake", int: 123, bool: false }
    let decoded = decode("int=42&string=42&bool=42", { encoder: "url", init })
    expect(decoded).toEqual({ string: "42", int: "42", bool: "42" })
  })
})

describe("smart-url encoder", () => {
  it("should work", () => {
    let encoded = encode({ state: 42, foo: "bar" }, { encoder: "smart-url" })
    expect(encoded).toEqual("state=42&foo=bar")
  })
})

describe("smart-url decoder", () => {
  it("should work", () => {
    let decoded = decode("state=42&foo=bar", { encoder: "smart-url" })
    expect(decoded).toEqual({ state: "42", foo: "bar" })
  })
  it("should try to keep type hints", () => {
    let init = { string: "cake", int: 123, bool: false, null: null }
    let decoded = decode("int=42&string=42&bool=42&null=null", {
      encoder: "smart-url",
      init
    })
    expect(decoded).toEqual({ string: "42", int: 42, bool: false, null: null })
  })
})

describe("json encoder", () => {
  it("should work", () => {
    let encoded = encode({ state: 42 }, { encoder: "json" })
    expect(encoded).toEqual("%7B%22state%22%3A42%7D")
  })
  it("should be urlencoded json", () => {
    let decoded = decodeURIComponent(encode({ state: 42 }, { encoder: "json" }))
    expect(decoded).toEqual('{"state":42}')
  })
})

describe("json decoder", () => {
  it("should work", () => {
    let decoded = decode("%7B%22state%22%3A42%7D", { encoder: "json" })
    expect(decoded).toEqual({ state: 42 })
  })
})

describe("AutoHistory", () => {
  it("should initialise from empty", () => {
    let ah = AutoHistory({
      init: { foo: "bar", baz: "qux" },
      push: ["foo"],
      replace: ["baz"]
    })
    ah.push_state_if_changed({ foo: "cake" })
    ah.push_state_if_changed({ baz: "pie" })
  })
  it("should initialise with hash", () => {
    window.location.hash = "#foo=asdf"
    let ah = AutoHistory({
      init: { foo: "bar", baz: "qux" },
      push: ["foo"],
      replace: ["baz"]
    })
    ah.push_state_if_changed({ foo: "cake" })
    ah.push_state_if_changed({ baz: "pie" })
  })
})
