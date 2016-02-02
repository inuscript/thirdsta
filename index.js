import axios from "axios"
import cheerio from "cheerio"

class WebstaRequest{
  get baseUrl(){
    return "http://websta.me"
  }
  getUserPageUrl(){
    return `${this.baseUrl}/n/${this.user}`
  }
  request(url){
    return axios(url).then(res => res.data).then(body => {
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
  photos(){
    return this.$(".photoeach").map((i, el) =>{
      return new WebstaPhoto(el)
    }).get()
  }
  next(){
    let next = this.$("a[rel='next']").attr("href")
    return `${this.baseUrl}${next}`
  }
  parse(){
    return this.photos().map((p) => {
      return p.get()
    })
  }
}

class WebstaPhoto{
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
  get(){
    return {
      id: this.id,
      like: this.like,
      comment: this.comment,
      tags: this.tags
    }
  }
}

let b = new WebstaRequest()

b.request( b.getUserPageUrl() ).then(parser => {
  return {
    data: parser.parse(),
    next: parser.next()
  }
}).then( item => {

}).catch(e => {
  console.error(e)
})