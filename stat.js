import _sample, { masterTags } from "./sample"
import sample from "./foo"
import { UCBBandit as MultiBandit } from "@inuscript/to-zok"
import groupify from "groupify"
import shuffle from "shuffle-array"
import chunk from "lodash.chunk"

function likes(media){
  return media.map( (media) => {
    return media.like
  })
}

function tagLikes(media){
  let tags = {}
  media.map( (media) => {
    media.tags.map( (tag) => {
      let t = tags[tag] || []
      t.push(media.like)
      tags[tag] = t
    })
  })
  delete tags.dog
  delete tags.norfolkterrier
  return tags
}
function normalized(){
  let result = {}
  let max = Math.max.apply(null, likes(sample))
  let min = Math.min.apply(null, likes(sample))
  let tl = tagLikes(sample)
  let cm = Object.entries(tl).map( ([tag, counts]) => {
    let norm = counts.map( (c) => (c - min) / (max - min))
    result[tag] = norm
    return {
      tag: tag,
      count: norm
    }
  })
  return {
    k: cm,
    map: result
  }
}

function start(){
  let n = normalized().k
  let b = new MultiBandit( masterTags )
  n.forEach( ({tag, count}) => {
    count.forEach( c => b.reward(tag, c))
  })
  let tags = b.select()
  console.log( masterTags )
  let r = tags.map( tag => `#${tag}`)
  console.log(r.splice(0, 25).join(" "))
}

start()