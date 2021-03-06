const express = require('express')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const dotenv = require('dotenv')
const cron = require('node-cron')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./src/apollo/typeDefs')
const resolvers = require('./src/apollo/resolvers')
const fetchAndParseXml = require('./src/helpers/fetchAndParseXml')
const formatJson = require('./src/helpers/formatJson')

dotenv.config()
mongoose.Promise = global.Promise

const cronJob = async () => {
  cron.schedule('* * * * *', async () => {
    const rawJson = await fetchAndParseXml(process.env.BOLAGET_URL)
    const data = await formatJson(rawJson, process.env.OUTPUT_FILENAME)
    //! Set up a batch update method for the articles.
  })
}

const setAuth = async ({ req }) => {
  const token = req.headers.authentication || ''
  try {
    await jwt.verify(token, process.env.TOKEN_SECRET)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

const startSever = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: async ctx => ({
      auth: await setAuth(ctx),
    }),
  })

  const app = express()
  server.applyMiddleware({ app })

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
  )
}

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to the database!')
    startSever()
  })
  .catch(err => console.error(err))
