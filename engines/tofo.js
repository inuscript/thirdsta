import axios from "axios"


export class WebstaRequest{
  get baseUrl(){
    return "http://tofo.me/"
  }
  getUserPageUrl(userId){
    return `MultiView/GetUserMediaRecent?userID=${userId}&count=20`
  }
  request(url){
    let p = axios(url)
    return this._toParser(p)
  }
  start(userId){
    let url = this.getUserPageUrl(userId)
    return this.request(url)
  }
  _toParser(p){
    return p.then(res => res.data).then(body => {
      console.log(body)
      // return new TofoParser(body, this.baseUrl)
    })
  }
}

