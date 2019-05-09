const express = require('express')
const dotenv = require('dotenv')
const cron = require('node-cron')
const mongoose = require('mongoose')

const fetchAndParseXml = require('./src/helpers/fetchAndParseXml')
const formatJson = require('./src/helpers/formatJson')

dotenv.config()
mongoose.Promise = global.Promise

const startSever = () => {
  const app = express()

  cron.schedule('* * * * *', async () => {
    const rawJson = await fetchAndParseXml(process.env.BOLAGET_URL)
    await formatJson(rawJson, process.env.OUTPUT_FILENAME)
  })

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  const server = app.listen(3000, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
  })
}

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to the database!')
    startSever()
  })
  .catch(err => console.error(err))
