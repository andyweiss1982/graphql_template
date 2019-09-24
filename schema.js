const { gql } = require('apollo-server')

exports.typeDefs = gql`

type User {
  _id: ID!
  email: String!
}

type JWT {
  token: String!
}

type Query {
  authenticateUser(email: String, password: String): JWT!
  public: String!
  private: String!
}

type Mutation {
  registerUser(email: String, password: String, passwordConfirmation: String): JWT!
}

`
