import { WebstaRequest } from "./websta"
const crawl = (req, userName, depth = 3) =>{
  let results = []
  return req.start( userName ).then( parser => {
    parser.parse()
    return parser.next()
  })
}

let userName = "sqlatchdog"
let userId = "1453092205"
let req = new WebstaRequest()
// let req = new TofoRequest()

crawl(req, userName)
.then( item => {
  // console.log(item.data)
}).catch(e => {
  console.error(e)
})