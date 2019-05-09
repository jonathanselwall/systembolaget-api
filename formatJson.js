const util = require('util')
const fs = require('fs').promises
const rimraf = require('rimraf')

util.inspect.defaultOptions.depth = null

const inputFileName = 'systemet.json'
const outputFileName = 'systemet-formatted.json'

function flattenObjectValues(article) {
  return Object.keys(article).reduce((sum, value) => {
    sum[value] =
      article[value].length === 1 ? article[value][0] : article[value]
    return sum
  }, {})
}

function formatArticles(article) {
  const {
    nr,
    Artikelid,
    Varnummer,
    Namn,
    Namn2,
    Prisinklmoms,
    Volymiml,
    PrisPerLiter,
    Saljstart,
    Utgått,
    Varugrupp,
    Typ,
    Stil,
    Forpackning,
    Forslutning,
    Ursprung,
    Ursprunglandnamn,
    Producent,
    Leverantor,
    Argang,
    Provadargang,
    Alkoholhalt,
    Sortiment,
    SortimentText,
    Ekologisk,
    Etiskt,
    Koscher,
    RavarorBeskrivning,
  } = article

  const formatted = {
    nr: nr || '',
    id: Artikelid || '',
    commodityCode: Varnummer || '',
    name: Namn || '',
    secondaryName: Namn2 || '',
    price: Prisinklmoms || '',
    volume: Volymiml || '',
    costPerLiter: PrisPerLiter || '',
    salesStart: Saljstart || '',
    expired: Utgått === '1',
    category: Varugrupp || '',
    type: Typ || '',
    style: Stil || '',
    packaging: Forpackning || '',
    seal: Forslutning || '',
    origin: Ursprung || '',
    originCountry: Ursprunglandnamn || '',
    manufacturer: Producent || '',
    supplier: Leverantor || '',
    vintage: Argang || '',
    testedVintage: Provadargang || '',
    alcoholContent: Alkoholhalt || '',
    assortment: Sortiment || '',
    assortmentText: SortimentText || '',
    organic: Ekologisk === '1',
    ethical: Etiskt === '1',
    koscher: Koscher === '1',
    rawMaterials: RavarorBeskrivning || '',
  }
  return formatted
}

function formatJsonData(fileName) {
  const data = require(__dirname + '/tmp/' + fileName)
  const formattedArticles = data.artiklar.artikel
    .map(flattenObjectValues)
    .map(formatArticles)
  return {
    createdAt: data.artiklar['skapad-tid'][0],
    articles: formattedArticles,
  }
}

async function createFormattedJsonFile() {
  rimraf(__dirname + '/tmp', async () => {
    try {
      await fs.access(__dirname + '/json')
    } catch (e) {
      await fs.mkdir(__dirname + '/json').catch(err => console.error(err))
    }
  })
  return await fs.writeFile(
    __dirname + `/json/${outputFileName}-${Date.now()}`,
    JSON.stringify(formatJsonData(inputFileName), null, 2)
  )
}

createFormattedJsonFile()

module.exports = createFormattedJsonFile
