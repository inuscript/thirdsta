import Storage from "../storage/firebase"
import websta from "./websta"
import tofo from "./tofo"
import fs from "fs"

let storage = new Storage()

const store = (media) => {
  return media.map( m => {
    return storage.write(m)
  })
}

const reducePage = (results, page, depth) =>{
  return page.request().then( parser => {
    // console.log(depth)
    // console.log(page.url)
    let nextPage = parser.next()
    let media = parser.parse()
    let stores = store(media)

    let nextResults = results.concat(media)
    if(nextPage && depth < 100){
      return reducePage(nextResults, nextPage, depth + 1)
    }
    return Promise.all(stores).then( (results) => {
      // console.log(results)
      return nextResults
    })
  })
}

const crawl = ( depth = 10 ) =>{
  let userName = "sqlatchdog"
  let userId = "1453092205"

  // let page = websta( userName )
  let page = tofo( userId )
  return reducePage([], page, 0)
}

export default const = () => {
  crawl().then( item => {
    let json = JSON.stringify(item, null, 2)
    // fs.writeFileSync("./foo.json", json)
    // console.log(item)
    process.exit(0)
  }).catch(e => {
    console.error(e.stack)
    process.exit(1)
  })
}