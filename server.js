require('./models/subscriber.model')
const bodyParser = require('body-parser')
const config = require('./config')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const qs = require('querystring')
const Subscriber = mongoose.model('subscribers')
const validateSubscriptionForm = require('./public/common/validation')

mongoose.connect(config.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

const app = express()

app.use('/', express.static(path.join(__dirname, './public')))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/users', (req, res, next) => {
  Subscriber.find((err, subscribers) => {
    let html = "<h3>Подписчики</h3><ol>"
    for (let user of subscribers) {
      html = html + "<li>" + user.username + " - " + user.email + "</li>"
    }
    html += "</ol>"
    res.send(html)
  })
})

app.post('/subscribe', (req, res) => {
  let username = req.body.username
  let email = req.body.email
  let result = validateSubscriptionForm({username, email})
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (result) {
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