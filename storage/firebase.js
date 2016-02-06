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
      let refPath = `media/${data.id}`
      let itemRef = this.ref.child(refPath)
      itemRef.once("value", (snap) => {
        let newItem = Object.assign({}, item, snap.val())
        itemRef.set(newItem)
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