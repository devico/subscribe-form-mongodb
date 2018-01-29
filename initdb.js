const faker = require('faker')
const config = require('./config')
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(config.DB_URL, (error, conn) => {
  if (error) throw error
  generateSubscribers(conn, 50, () => {
    if(error) throw error
    console.log("END")
  })
})

let generateSubscribers = (conn, cs) => {
  let subscribers = []
  let lch = 15
  let cch = Math.ceil(cs / lch)

  for(let i = 0; i < cch; i++){
    let to = ((cs - lch * i) > lch) ? lch : cs - lch
    let chunk = chunkify(to)
    subscribers.push(chunk)
  }

  for(chunk of subscribers) {
    conn.db('subform').collection('subscribers').insertMany(chunk)
  }
  conn.close()
}

let chunkify = (lch) => {
  let range = (from, to) => {
    return Array(to).fill(null).map((_, i) => i)
  }

  return range(0, lch).map(() => {
      return ({ 
        "username": faker.fake("{{internet.userName}}"), 
        "email": faker.fake("{{internet.email}}"), 
        "status": "subscribed"
      })
  })
}
