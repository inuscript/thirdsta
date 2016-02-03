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
    let top = 2 * Math.log(this.n)
    let check = this.counts.indexOf(0);
    if (check !== -1) {
      return check
    }

    let valuesUCB = this.counts.map( (ct, i ) => {
      return this.values[i] + Math.sqrt(top / ct)
    })

    let arm = valuesUCB.indexOf(Math.max.apply(null, valuesUCB))
    return arm
  }
}