require('./models/subscriber.model')
const bodyParser = require('body-parser')
const config = require('./config')
const express = require('express')
// const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')
const qs = require('querystring')
const Subscriber = mongoose.model('subscribers')
const validateSubscriptionForm = require('./public/common/validation')
// const waitInterval = 100000

mongoose.connect(config.DB_URL, {
  useMongoClient: true
}).then(() => console.log('MongoDB connected')).catch((err) => console.log(err))

const app = express()

// let db = JSON.parse(fs.readFileSync('db.json', 'utf-8'))

app.use('/', express.static(path.join(__dirname, './public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// app.get('/users', (req, res, next) => {
//   let html = "<h3>Подписчики</h3><ol>"
//   for (let user of db.users) {
//     html = html + "<li>" + user.username + " - " + user.email + "</li>"
//   }
//   html += "</ol>"
//   res.send(html)
// })

app.post('/subscribe', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let result = validateSubscriptionForm({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (result) {
    // db.users.push({username: req.body.username, email: req.body.email, status: 'subscribed'})
    new Subscriber({ username: username, email: email, status: "subscribed" })
      .save().then(() => console.log('Save successfully'))

    res.end(JSON.stringify({ 'status': 'subscribed' }))
  } else {
    res.end(JSON.stringify({ 'status': 'did not subscribe' }))
  }
})

app.listen(8000, () => {
  console.log('server start on port 8000')
})