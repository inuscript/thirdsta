import axios from "axios"
import cheerio from "cheerio"

class WebstaRequest{
  get baseUrl(){
    return "http://websta.me"
  }
  getUserPageUrl(user){
    return `${this.baseUrl}/n/${user}`
  }
  request(url){
    let p = axios(url)
    return this.toParser(p)
  }
  toParser(p){
    return p.then(res => res.data).then(body => {
      return new WebstaParser(body, this.baseUrl)
    })
  }
}

class WebstaParser{
  constructor(body, baseUrl){
    this.body = body
    this.baseUrl = baseUrl
    this.$ = cheerio.load(this.body)
  }
  media(){
    return this.$(".photoeach").map((i, el) =>{
      return new WebstaMedia(el)
    }).get()
  }
  nextUrl(){
    let next = this.$("a[rel='next']").attr("href")
    let url = `${this.baseUrl}${next}`
    return 
  }
  parse(){
    return this.media().map((p) => {
      return p.get()
    })
  }
}

class WebstaMedia{
  constructor(dom){
    this.$ = cheerio.load(dom)
  }
  get id(){
    let url = this.$(".mainimg").attr("href")
    return url.replace("/p/", "")
  }
  get like(){
    return parseInt(this.$(`.like_count_${this.id}`).text())
  }
  get comment(){
    return parseInt(this.$(`.comment_count_${this.id}`).text())
  }
  get tags(){
    return this.$(".caption strong a").map( (i, el) => {
      return this.$(el).text().replace(/^#/, "")
    }).get()
  }
  get filter(){
    return this.$(".secondinfo .filter")
  }
  get time(){
    let before = this.$(".firstinfo .time")
    // TODO
  }
  get(){
    return {
      id: this.id,
      like: this.like,
      comment: this.comment,
      tags: this.tags
      filter: this.filter
    }
  }
}

let b = new WebstaRequest()
let userName = "sqlatchdog"
console.log(b.getUserPageUrl(userName))
b.request( b.getUserPageUrl(userName) ).then(parser => {
  return {
    data: parser.parse(),
    next: parser.next()
  }
}).then( item => {
  console.log(item.data)
}).catch(e => {
  console.error(e)
})