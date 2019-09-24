const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  email: {
    type:       String,
    unique:     true,
    lowercase:  true,
    trim:       true,
    required:   true,
    validate:   [validator.isEmail, 'Invalid Email Address']
  },
  passwordHash: {
    type:       String,
    required:   true
  }
})

userSchema.virtual('authToken').get(function() {
  const { _id, email } = this
  return jwt.sign({ _id, email }, process.env.JWT_SECRET)
})

module.exports = mongoose.model('User', userSchema)
