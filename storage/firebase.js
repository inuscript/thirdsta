import Firebase from "firebase"

export default class {
  constructor(){
    this.ref = new Firebase("http://thridsta.firebaseio.com")
    this.ping()
  }
  auth(){
    let token = process.env.FIREBASE_SECRET
    return this.ref.authWithCustomToken(token)
  }
  write(data){
    return this.auth().then( (auth) => {
      // console.log("aaa")
      let mediaRef = this.ref.child("media")
      let itemRef = mediaRef.child(data.id)
      // console.log(data.id, itemRef)
      // console.log(data.id)
      return itemRef.once("value").then( (snap) => {
        let newItem = Object.assign({}, snap.val(), data)
        return newItem
        // console.log(newItem.id)
      }).then(newItem => {
        return itemRef.set(newItem)
      }).then( e => {
        console.log(e, data.id)
      })
    }).catch(e => {
      console.log(e)
    })
  }
  ping(){
    return this.auth().then( (authData) => {
      let times = []
      let pingRef = this.ref.child("ping")
      return pingRef.once("value", (snap) => {
        times.push( snap.val() )
        return
      }).then( () => {
        return pingRef.set(new Date().getTime())
      }).then( () => {
        return pingRef.once("value") 
      }).then( (snap) => {
        times.push(snap.val())
        return times
      })
    })
  }
}