import sample from "./sample"
import Bandit from "ucb"

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
  return tags
}
function normalized(){
  let max = Math.max.apply(null, likes(sample))
  let min = Math.min.apply(null, likes(sample))
  let tl = tagLikes(sample)
  let cm = Object.entries(tl).map( ([tag, counts]) => {
    return {
      tag: tag,
      counts: counts.map( (c) => (c - min) / (max - min)),
    }
  })
  return cm
}

function start(){
  let n = normalized()
  let b = new Bandit({
    arms: 4
  })
  b.reward(2, 0.5)
  b.reward(3, 0.2)
  b.reward(0, 0.1)
  b.reward(1, 0.9)
  b.reward(1, 0.2)
  b.select().then( (r) => {
    console.log(r)
  })
}

start()