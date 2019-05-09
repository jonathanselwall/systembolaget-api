const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  nr: String,
  id: String,
  commodityCode: String,
  name: String,
  secondaryName: String,
  price: String,
  volume: String,
  costPerLiter: String,
  salesStart: String,
  expired: Boolean,
  category: String,
  type: String,
  style: String,
  packaging: String,
  seal: String,
  origin: String,
  originCountry: String,
  manufacturer: String,
  supplier: String,
  vintage: String,
  testedVintage: String,
  alcoholContent: String,
  assortment: String,
  assortmentText: String,
  organic: Boolean,
  ethical: Boolean,
  koscher: Boolean,
  rawMaterials: String,
})

module.exports = mongoose.model('Article', articleSchema, 'articles')
