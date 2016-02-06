import Store from "./storage/firebase"

let s = new Store()
s.ping().then( () => {
  // s.exit()
  process.exit(0)
} ).catch(e => {
  console.error(e.stack)
  process.exit(1)
})