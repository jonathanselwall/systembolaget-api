const { gql, AuthenticationError } = require('apollo-server-express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ArticleModel = require('../../mongo/schemas/articleSchema')
const UserModel = require('../../mongo/schemas/userSchema')

const checkAuth = ({ auth }) => {
  console.log('------------')
  console.log(auth)
  if (!auth) throw new AuthenticationError('You are not logged in.')
}

const resolvers = {
  Query: {
    article: async (parent, args, context, info) => {
      checkAuth(context)

      try {
        const byId = await ArticleModel.findOne({ id: args.id })
        if (!byId) return await ArticleModel.findOne({ commodityCode: args.id })
        return byId
      } catch (err) {
        throw new AuthenticationError(err)
      }
    },
    allArticles: async (parent, { page, perPage }, context, info) => {
      checkAuth(context)

      const totalArticles = await ArticleModel.count((err, count) => count)
      const articles = await ArticleModel.find()
        .limit(perPage)
        .skip(perPage * page)

      return {
        articles,
        page,
        totalPages: Math.round(totalArticles / perPage),
        totalArticles,
      }
    },
  },
  Mutation: {
    register: async (parent, { username, password, secret }, context, info) => {
      if (secret === process.env.REGISTER_SECRET) {
        return UserModel.create({
          username,
          password: await bcrypt.hash(password, 12),
        })
      }
    },
    login: async (parent, { username, password }, context, info) => {
      const user = await UserModel.findOne({ username })
      if (!user) throw new Error('Wrong credentials 1')

      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) throw new Error('Wrong credentials 2')

      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '1y',
        }
      )

      return token
    },
  },
}

module.exports = resolvers
