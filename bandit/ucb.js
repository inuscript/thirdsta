import random from "lodash.random"

const zeroPad = (len) => {
  return Array.apply(null, new Array(len)).map(Number.prototype.valueOf,0);
}
export default class MultiBandit{
  constructor({arms}){
    this.arms = arms
    this.rewards = new Array(arms)

    this.tau = undefined
    this.gamma = 1e-7
  }
  reward(arm, reward){
    let rs = this.rewards[arm] ? this.rewards[arm] : []
    rs.push(reward)
    this.rewards[arm] = rs
  }
  get values(){
    return this.rewards.map( (r) => {
      let sum = r.reduce( (sum, val) => {
        return sum + val
      }, 0)
      return sum / r.length
    })
  }
  get counts(){
    return this.rewards.map( (r) => {
      return r.length
    })
  }
  get n(){
    return this.counts.reduce( (sum, ct) => {
      return sum + ct
    }, 0)
  }
  select(num){
    let top = 2 * Math.log(this.n)
    let check = this.counts.indexOf(0);
    if (check !== -1) {
      return check
    }

    let valuesUCB = this.counts.map( (ct, i ) => {
      // return this.values[i] + Math.sqrt(top / ct)
      return this.values[i] + Math.sqrt(top) / ct
    })
    // let valuesUCB2 = this.counts.map( (ct, i ) => {
    //   return this.values[i] + Math.sqrt(top / ct)
    //   // return this.values[i] + Math.sqrt(top) / ct
    // })
    console.log(valuesUCB)
    let arm = valuesUCB.indexOf(Math.max.apply(null, valuesUCB))
    return arm
  }
}