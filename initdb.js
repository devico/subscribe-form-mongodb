const faker = require('faker')
const config = require('./config')
const MongoClient = require('mongodb').MongoClient
let {range, chunkify} = require("./helpers")

let generateSubscribers = (n) => {
  MongoClient.connect(config.DB_URL, (error, conn) => {
    if (error) throw error

    let subscribers = range(0, n).map(generateSubscriber)
    let lengthChunk = 25
    let chunkedSubscribers = chunkify(subscribers, lengthChunk)

    Promise.all(
      chunkedSubscribers.map(chunk => {
        return conn.db('subform').collection('subscribers').insertMany(chunk)
      })
    ).then(() => {
      conn.close()
    })
  })
}

let generateSubscriber = () => {
  return { 
    "username": faker.fake("{{internet.userName}}"), 
    "email": faker.fake("{{internet.email}}"), 
    "status": "subscribed"
  }
}

generateSubscribers(51)