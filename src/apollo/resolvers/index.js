const { gql } = require('apollo-server-express')
const ArticleModel = require('../../mongo/schemas/articleSchema')

const resolvers = {
  Query: {
    article: async (parent, args, context, info) => {
      return await ArticleModel.findOne({ id: args.id }).catch(err =>
        console.error(err)
      )
    },
    allArticles: async (parent, { page, perPage }, context, info) => {
      return await ArticleModel.find()
        .limit(perPage)
        .skip(perPage * page)
    },
  },
}

module.exports = resolvers
