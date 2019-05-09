const express = require('express')
const cron = require('node-cron')
const fetchAndParseXml = require('./src/helpers/fetchAndParseXml')
const formatJson = require('./src/helpers/formatJson')

const url = 'https://www.systembolaget.se/api/assortment/products/xml'
const outputFile = 'systemet-formatted.json'

const app = express()

cron.schedule('* * * * *', async () => {
  const rawJson = await fetchAndParseXml(url)
  formatJson(rawJson, outputFile)
})

app.get('/', (req, res) => {
  res.send('Hello world!')
})

const server = app.listen(3000, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
})
