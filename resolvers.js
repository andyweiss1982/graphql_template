const { AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.resolvers = {
  Query: {
    authenticateUser: async (_, { email, password }, { models: { User } }) => {
      const user = await User.findOne({ email })
      if (!user) throw new AuthenticationError("Invalid Credentials")
      const match = await bcrypt.compare(password, user.passwordHash)
      if (!match) throw new AuthenticationError("Invalid Credentials")
      return { token: user.authToken }
    },
    public: () => "Hello, whoever you are!",
    private: (_parent, _args, { user }) => {
      if (!user) throw new ForbiddenError("You must be logged in")
      return `Hello, ${user.email}!`
    }
  },
  Mutation: {
    registerUser: async (_, { email, password, passwordConfirmation }, { models: { User } }) => {
      if (!email) throw new UserInputError("Email is required")
      const existingUser = await User.findOne({ email })
      if (existingUser) throw new UserInputError("Email is already taken")
      if (!password || password.length < 8) throw new UserInputError("Password must be at least 8 characters")
      if (password !== passwordConfirmation) throw new UserInputError("Password confirmation does not match")
      const passwordHash = await bcrypt.hash(password, saltRounds)
      const user = await new User({ email, passwordHash }).save()
      return { token: user.authToken }
    },
  }
}
