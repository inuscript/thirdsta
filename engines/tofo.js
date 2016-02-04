import axios from "axios"
import qs from "querystring"

const BASE_URL = "http://tofo.me"
const API_PATH = "MultiView/GetUserMediaRecent"

const generateUrl = (params) => {
  let prm = qs.stringify(params)
  return `${BASE_URL}/${API_PATH}?${prm}`

}
export default function(userId){
  let url = generateUrl({count: 20 , userId: userId})
  return new TofoPage(url)
}

class TofoPage{
  constructor(url){
    this.url = url
  }  
  request(){
    let p = axios(this.url)
    return p.then(res => res.data).then(body => {
      return new TofoParser(body)
    })
  }
}

class TofoParser{
  constructor( {pagination, data}){
    this.pagination = pagination
    this.data = data
  }
  get userId(){
    return this.pagination.next_max_id.split("_")[1]
  }
  next(){
    let params = qs.parse(this.pagination.next_url)
    params.userId = this.userId
    let url = generateUrl(params)
    console.log(url)
    return new TofoPage(url)
  }
  parse(){
    return this.data.map( (m) => {
      let timeParsed = m.created_time.match(/Date\(([0-9])\)/)
      console.log(m.created_time, timeParsed)
      return {
        id: m.id,
        like: m.likes.count,
        comment: m.comments.count,
        filter: m.filter,
        time: timeParsed,
        tags: m.tags
      }
    })
  }
}