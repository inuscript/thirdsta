import {parseMedia} from "../engines/tofo"
import tofo from "./fixture/tofo.json"
describe("tofo", () => {
  it("", () => {
    let result = parseMedia(tofo)
    console.log(result)
  })
})