const fs = require('fs').promises
const util = require('util')
const xml2js = require('xml2js')
const axios = require('axios')

function fetchAndparseXml(url) {
  const parser = new xml2js.Parser()
  return new Promise(async (resolve, reject) => {
    const response = await axios(url).catch(err => console.error(err))
    parser.parseString(response.data, (err, result) => {
      resolve(result)
    })
  })
}

module.exports = fetchAndparseXml
