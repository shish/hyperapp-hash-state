import { encode, decode } from "../src"

describe("default encoder", () => {
  it("should work", () => {
    expect(encode({ state: 42, foo: "bar" }, { encoder: "url" })).toEqual(
      "state=42&foo=bar"
    )
  })
})

describe("default decoder", () => {
  it("should work", () => {
    expect(decode("state=42&foo=bar", { encoder: "url" })).toEqual({
      state: "42",
      foo: "bar"
    })
  })
})

describe("json encoder", () => {
  it("should work", () => {
    expect(encode({ state: 42 }, { encoder: "json" })).toEqual(
      "%7B%22state%22%3A42%7D"
    )
  })
  it("should be urlencoded json", () => {
    expect(
      decodeURIComponent(encode({ state: 42 }, { encoder: "json" }))
    ).toEqual('{"state":42}')
  })
})

describe("json decoder", () => {
  it("should work", () => {
    expect(decode("%7B%22state%22%3A42%7D", { encoder: "json" })).toEqual({
      state: 42
    })
  })
})
