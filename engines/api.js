import axios from "axios"
import cheerio from "cheerio"

const BASE_URL = "https://api.instagram.com/v1/users/self/media/recent/"

export default function(token){
  let url = `${BASE_URL}?access_token=${token}`
  return new ApiPage(url)
}

class ApiPage{
  constructor(url){
    this.url = url
  }  
  request(){
    let p = axios(this.url)
    return p.then(res => res.data).then(body => {
      return new ApiParser(body)
    })
  }
}

class ApiParser{
  constructor(json){
    this.json = json
  }
  media(){
    return this.json.data.map( (item) => {
      return new ApiMedia(item)
    })
  }
  next(){
    return
  }
  parse(){
    let result = this.media().map((p) => {
      return p.get()
    })
    return result
  }
}

class ApiMedia{
  constructor(item){
    this.item = item
  }
  get(){
    let item = {
      id: this.item.id,
      like: this.item.like,
      comment: this.item.comment,
      tags: this.item.tags,
      filter: this.item.filter
    }
    return item
  }
}

