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
      let mediaRef = this.ref.child("media")
      let itemRef = mediaRef.child(data.id)
      return itemRef.once("value", (snap) => {
        let newItem = Object.assign({}, snap.val(), data)
        // console.log(itemRef.toString())
        return itemRef.set(newItem)
      })
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