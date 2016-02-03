import random from "lodash.random"

const zeroPad = (len) => {
  return Array.apply(null, new Array(len)).map(Number.prototype.valueOf,0);
}
export default class MultiBandit{
  constructor({arms}){
    this.arms = arms
    this.counts = zeroPad(arms)
    this.values = zeroPad(arms)

    this.tau = undefined
    this.gamma = 1e-7
  }
  reward(arm, reward){
    let ct = ++this.counts[arm]
    let pre = this.values[arm]
    let post = ((ct-1) / ct) * pre + (1/ct) * reward;
    this.values[arm] = post
    return this.values
  }
  get n(){
    return this.counts.reduce( (sum, ct) => {
      return sum + ct
    }, 0)
  }
  select(num){
    return new Promise((resolve, reject) => {
      let arm = -1
      let temp = this.tau || 1 / Math.log(this.n + 1 + this.gamma);
      let values = this.values.map( (v) => {
        return Math.exp(v / temp)
      })
      let z = values.reduce( (sum, v) => {
        return sum + v
      }, 0)
      let accum = 0;
      let r = random(0, 1, true);
      values.forEach( (v, i) => {
        if(arm > -1){
          return
        }
        accum += v;
        if(accum > r){
          arm = i
          return false
        }
      })
      resolve(arm)
    })
  }
}