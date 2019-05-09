const util = require('util')
const fs = require('fs').promises

util.inspect.defaultOptions.depth = null

const flattenObjectValues = article =>
  Object.keys(article).reduce((sum, value) => {
    sum[value] =
      article[value].length === 1 ? article[value][0] : article[value]
    return sum
  }, {})

const formatArticles = article => {
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

const formatJsonData = data => {
  const createdAt = data.artiklar['skapad-tid'][0]
  const articles = data.artiklar.artikel
    .map(flattenObjectValues)
    .map(formatArticles)
  return {
    createdAt,
    articles,
  }
}

const createFormattedJsonFile = async (data, output) => {
  try {
    await fs.access(process.env.NODE_PATH + '/json')
  } catch (e) {
    await fs
      .mkdir(process.env.NODE_PATH + '/json')
      .catch(err => console.error(err))
  }

  await fs
    .writeFile(
      process.env.NODE_PATH + `/json/${output}-${Date.now()}`,
      JSON.stringify(formatJsonData(data), null, 2)
    )
    .catch(err => console.error(err))

  return new Promise((resolve, reject) => {
    resolve(formatJsonData(data))
  })
}

module.exports = createFormattedJsonFile
