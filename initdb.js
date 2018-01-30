const faker = require('faker')
const config = require('./config')
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(config.DB_URL, (error, conn) => {
  if (error) throw error
  Promise.all(
    chunkedSubscribers.map(chunk => {
      return conn.db('subform').collection('subscribers').insertMany(chunk)
    })
  ).then(() => {
    conn.close()
  })
})

let countSubscribers = 51

let lengthChunk = 25

let subscribers = range(0, countSubscribers).map(generateSubscriber)

let chunkedSubscribers = chunkify(subscribers, lengthChunk)

let range = (from, to) => {
  return Array(to).fill(null).map((_, i) => i)
}

let generateSubscriber = () => {
  return { 
    "username": faker.fake("{{internet.userName}}"), 
    "email": faker.fake("{{internet.email}}"), 
    "status": "subscribed"
  }
}

let chunkify = (arr, len) => {
  return range(0, Math.ceil(arr.length / len)).map((el, i) => arr.slice(i * len, i * len + len))
}
