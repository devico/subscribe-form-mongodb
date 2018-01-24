const bodyParser = require('body-parser')
const config = require('./config')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const qs = require('querystring')
const validateSubscriptionForm = require('./public/common/validation')


let db


const app = express()

app.use((req, res, next) => {
  MongoClient.connect(config.DB_URL, (error, connection) => {
    req.conn = connection.db('subform')
    next()
  })
})

app.use('/', express.static(path.join(__dirname, './public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/users', (req, res, next) => {
  req.conn.collection('subscribers').find().toArray().then(subscribers => {
    let html = "<h3>Подписчики</h3><ol>"
    for (let user of subscribers) {
      html = html + "<li>" + user.username + " - " + user.email + "</li>"
    }
    html += "</ol>"
    res.send(html)
  })
})

app.post('/subscribe', (req, res, next) => {
  let username = req.body.username
  let email = req.body.email
  let result = validateSubscriptionForm({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (result) {
    req.conn.collection('subscribers')
      .insertOne({ username: username, email: email, status: "subscribed"}, () => {
        console.log('Subscriber saved successfully')
        res.end(JSON.stringify({ 'status': 'subscribed' }))
      })
  } else {
    res.end(JSON.stringify({ 'status': 'did not subscribe' }))
  }
})

app.listen(8000, () => {
  console.log('Server start on port 8000')
})
