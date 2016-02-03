import sample, { masterTags } from "./sample"
import Bandit from "ucb"
import MultiBandit from "./bandit/ucb"
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
  let n = normalized().map
  let sp = Math.ceil(masterTags.length / 25)
  let groups = [masterTags] // chunk( shuffle(masterTags), sp)
  // let b = new Bandit({ arms: g.length })
  // let b = new MultiBandit({ arms: masterTags.length })
  let b = new MultiBandit({ arms: masterTags })
  masterTags.forEach( (tag, i) => {
    n[tag].forEach( (countReward) => {
      b.reward(i, countReward)
    })
  })
  // console.log(b.values)
  // console.log(b.serialize())
  let arm = b.select(10)
  let r = arm.map( i => {
    return "#" + masterTags[i]
  })
  console.log(r.splice(0, 25).join(" "))
  let result = masterTags[arm]
  // console.log(result)
}

start()