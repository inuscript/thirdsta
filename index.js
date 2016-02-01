import axios from "axios"
import cheerio from "cheerio"

class WebstaRequest{
  constructor(user){
    this.user = user
  }
  userPageUrl(){
    return `http://websta.me/n/${this.user}`
  }
  request(){
    return axios(this.userPageUrl()).then(res => res.data)
  }
}

class WebstaParser{
  constructor(body){
    this.body = body
    this.$ = cheerio.load(this.body)
  }
  photos(){
    return this.$(".photoeach").map((i, el) =>{
      let p = new WebstaPhoto(el)
      console.log(p.dump())
      return p
    })
  }
  parse(){
    this.photos()
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
  dump(){
    return {
      id: this.id,
      like: this.like,
      comment: this.comment,
      tags: this.tags
    }
  }
}
let w = new WebstaRequest("sqlatchdog")
w.request().then(body => {
  let parser = new WebstaParser(body)
  parser.parse()
}).catch(e => {
  console.error(e)
})