import axios from "axios"
let url = "https://raw.githubusercontent.com/inuscript/randomtag/gh-pages/tags.txt"

function tags(){
  return axios(url).then(res => {
    return res.data.split("\n").filter( t => {
      return t.length > 0
    })
  }).then(tags => {
    console.log(tags)
  })
}
tags()