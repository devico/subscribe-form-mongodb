const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubscriberSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  }
})

mongoose.model('subscribers', SubscriberSchema)