const util = require('util')
const fs = require('fs');

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
  const data = require(__dirname + '/' + fileName)
  const formattedArticles = data.artiklar.artikel
    .map(flattenObjectValues)
    .map(formatArticles)
  return {
    createdAt: data.artiklar['skapad-tid'][0],
    articles: formattedArticles
  }
}

const formattedJson = formatJsonData(inputFileName);

fs.writeFile(__dirname + '/' + outputFileName, JSON.stringify(formattedJson, null, 2), err => {
  if(err) return console.error('Error writing file', err)
  console.log(`Successfully wrote ${outputFileName}`)
})
