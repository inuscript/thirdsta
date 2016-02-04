import axios from "axios"

const BASE_URL = "http://tofo.me/"

export default function(user){
  let pt = `MultiView/GetUserMediaRecent?userID=${userId}&count=20`
  let url = `${BASE_URL}/${pt}`
  console.log(url)
  return new TofoPage(url)
}

class TofoPage{
  
}