const xml2js = require('xml2js')
const axios = require('axios')

const fetchAndParseXml = url => {
  const parser = new xml2js.Parser()
  return new Promise(async (resolve, reject) => {
    const response = await axios(url).catch(err => console.error(err))
    parser.parseString(response.data, (err, result) => {
      resolve(result)
    })
  })
}

module.exports = fetchAndParseXml
