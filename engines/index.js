import Storage from "../storage/firebase"
import websta from "./websta"
import tofo from "./tofo"
import api from "./api"

let storage = new Storage()

const store = (media) => {
  return media.map( m => {
    return storage.write(m)
  })
}

const reducePage = (results, page, depth, maxDepth) =>{
  return page.request().then( parser => {
    let nextPage = parser.next()
    // console.log(page.url)
    let media = parser.parse()
    // console.log(media.id, media.like)
    let stores = store(media)
    // let nextResults = results.concat(media)
    // if(nextPage && depth < maxDepth){
    //   return reducePage(nextResults, nextPage, depth + 1, maxDepth)
    // }
    console.log(stores)

    return Promise.all(stores).then( (results) => {
      console.log("then")
      // return nextResults
    }).catch(e => {
      console.log(e)
    })
  })
}

const crawl = ( depth = 10 ) =>{
  let userName = "sqlatchdog"
  let userId = "1453092205"
  let token = process.env.INSTAGRAM_API_SECRET
  // let page = websta( userName )
  // let page = tofo( userId )
  let page = api( token )
  return reducePage([], page, 0, depth)
}

export default function(pages) {
  crawl(pages).then( item => {
    process.exit(0)
  }).catch(e => {
    console.error(e.stack)
    process.exit(1)
  })
}