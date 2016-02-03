const crawl = (req, userName) =>{
  let url = this.getUserPageUrl(userName)
  req.request( url ).then( parser => {
    parser.parse()
    return parser.next()
  })
}

let userName = "sqlatchdog"
let e = new Engine(userName)
let req = new WebstaRequest()

e.get(req)
.then( item => {
  console.log(item.data)
}).catch(e => {
  console.error(e)
})