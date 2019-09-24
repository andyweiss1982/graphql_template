require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const db = `${process.env.MONGO_URI}/${env}?retryWrites=true&w=majority`
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })

const User = require('./models/User')
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')

const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let user
    const token = req.headers.authorization || ''
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    if (decoded) user = await User.findOne({ _id: decoded._id })
    return { models: { User }, user }
  }
})

server.listen().then(({ url }) => console.log(`Listening at ${url}`))
