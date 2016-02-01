class Websta{
  userPage(user){
    return `http://websta.me/n/${user}`
  }
}
let w = new Websta()
console.log(w.userPage("sqlatchdog"))