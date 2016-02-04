import { WebstaRequest } from "./websta"
import fs from "fs"

const parse = (results, page, depth) =>{
  return page.request().then( parser => {
    let nextPage = parser.next()
    let nextResults = results.concat(parser.parse())
    if(nextPage && depth < 3){
      return parse(nextResults, nextPage, depth + 1)
    }
    return nextResults
  })
}

const crawl = (req, userName, depth = 3) =>{
  let results = []
  let page = req.startPage( userName )
  return parse(results, page, 0)
}

let userName = "sqlatchdog"
let userId = "1453092205"
let req = new WebstaRequest()
// let req = new TofoRequest()

crawl(req, userName).then( item => {
  let json = JSON.stringify(item, null, 2)
  fs.writeFileSync("./foo.json", json)
  console.log(item)
}).catch(e => {
  console.error(e.stack)
})