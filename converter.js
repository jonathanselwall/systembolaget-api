const fs = require('fs').promises
const util = require('util')
const xml2js = require('xml2js')
const axios = require('axios')

util.inspect.defaultOptions.depth = null

const url = 'https://www.systembolaget.se/api/assortment/products/xml'
const parser = new xml2js.Parser()
const outputFilename = 'systemet.json'

function parseXml() {
  return new Promise(async (resolve, reject) => {
    const response = await axios(url).catch(err => console.error(err))
    parser.parseString(response.data, (err, result) => {
      resolve(result)
    })
  })
}

async function writeFile(data) {
  try {
    await fs.access(__dirname + '/tmp')
  } catch (e) {
    await fs.mkdir(__dirname + '/tmp').catch(err => console.error(err))
  }

  fs.writeFile(
    __dirname + '/tmp/' + outputFilename,
    JSON.stringify(data, null, 2)
  )
}

async function convertXmlToJson() {
  const xml = await parseXml()
  writeFile(xml)
}

convertXmlToJson()

module.exports = convertXmlToJson
