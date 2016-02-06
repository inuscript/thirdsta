import Storage from "../storage/firebase"
import websta from "./websta"
import tofo from "./tofo"

let storage = new Storage()

const store = (media) => {
  return media.map( m => {
    return storage.write(m)
  })
}

const reducePage = (results, page, depth) =>{
  return page.request().then( parser => {
    let nextPage = parser.next()
    let media = parser.parse()
    let stores = store(media)

    let nextResults = results.concat(media)
    if(nextPage && depth < 100){
      return reducePage(nextResults, nextPage, depth + 1)
    }
    return Promise.all(stores).then( (results) => {
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

export default function() {
  crawl().then( item => {
    process.exit(0)
  }).catch(e => {
    console.error(e.stack)
    process.exit(1)
  })
}