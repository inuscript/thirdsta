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

export class TofoParser{
  constructor( {pagination, data}){
    this.pagination = pagination
    this.data = data
  }
  get userId(){
    return this.pagination.next_max_id.split("_")[1]
  }
  next(){
    if(!this.pagination.next_url){
      return
    }
    let params = qs.parse(this.pagination.next_url)
    params.userId = this.userId
    let url = generateUrl(params)
    return new TofoPage(url)
  }
  parse(){
    return this.data.map( (m) => {
      return parseMedia(m)
    })
  }
}

export const parseMedia = (m) => {
  let timeParsed = m.created_time.match(/[0-9]+/)
  let time = parseInt(timeParsed[0])
  return {
    id: m.id,
    like: m.likes.count,
    comment: m.comments.count,
    filter: m.filter,
    time: time,
    tags: m.tags
  }
}