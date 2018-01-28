const faker = require('faker')
const config = require('./config')
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(config.DB_URL, (error, conn) => {
  if (error) {
    throw error
  } else {
    generateSubscribers(conn, 50, () => {
      if(error) {
        throw error
      } else {
        console.log("END")
      }
    })
  }
  conn.close()
})

let generateSubscribers = (connection, numberSubscribers) => {
  let listFakeUsers = []

  for(let i = 0; i < numberSubscribers; i++){
    let username = faker.fake("{{internet.userName}}")
    let email = faker.fake("{{internet.email}}")
    listFakeUsers.push({ username: username, email: email, status: "subscribed" })
  }

  let subscribers = chunkify(2, listFakeUsers)

  for(chunk of subscribers) {
    connection.db('subform').collection('subscribers').insertMany(chunk)
  }
}

let chunkify = (chunk, arr) => {
  let tmp = []
  let lengthChunk = Math.ceil(arr.length / chunk)
  for(let i = 0; i < arr.length; i += lengthChunk) {
    tmp.push(arr.slice(i, i + lengthChunk))
  }
  return tmp
}