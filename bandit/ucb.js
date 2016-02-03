import random from "lodash.random"

class Arm{
  constructor({label}){
    this.label = label
    this.rewards = []
  }
  reward(r){
    this.rewards.push()
  }
}
export default class MultiBandit{
  constructor({arms}){
    this.arms = arms.length
    this.rewards = arms.map( (label) => {
      return []
    })
  }
  reward(arm, reward){
    this.rewards[arm].push(reward)    
  }
  get values(){ // expectation
    return this.rewards.map( (r) => {
      let sum = r.reduce( (sum, val) => sum + val, 0)
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
  calcUCB(arm){
    let r = this.rewards[arm]
    if(r.length == 0){
      return 
    }
  }
  select(num){
    let top = 2 * Math.log(this.n)
    let check = this.counts.indexOf(0);
    if (check !== -1) {
      return check
    }

    let valuesUCB = this.counts.map( (ct, i ) => {
      return this.values[i] + Math.sqrt(top / ct)
    })
    let sorted = valuesUCB.concat().sort().reverse()
    console.log(sorted)
    return sorted.map( (val) => {
      // console.log(val)
      let idx = valuesUCB.indexOf(val)
      return idx
    })
    let arm = valuesUCB.indexOf(Math.max.apply(null, valuesUCB))
    return arm
  }
}