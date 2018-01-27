const faker = require('faker')
const config = require('./config')
const MongoClient = require('mongodb').MongoClient

let numberSubscribers = 50

MongoClient.connect(config.DB_URL, (error, connection) => {
  conn = connection
  console.log('Connect to database successfully')

  for(let i = 0; i < numberSubscribers; i++){
    let username = faker.fake("{{internet.userName}}")
    let email = faker.fake("{{internet.email}}")
    console.log(username + ": " + email)
    conn.db('subform').collection('subscribers')
      .insertOne({ username: username, email: email, status: "subscribed"})
  }
  conn.close()
})
