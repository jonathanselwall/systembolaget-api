const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Article {
    nr: String
    id: String
    commodityCode: String
    name: String
    secondaryName: String
    price: String
    volume: String
    costPerLiter: String
    salesStart: String
    expired: Boolean
    category: String
    type: String
    style: String
    packaging: String
    seal: String
    origin: String
    originCountry: String
    manufacturer: String
    supplier: String
    vintage: String
    testedVintage: String
    alcoholContent: String
    assortment: String
    assortmentText: String
    organic: Boolean
    ethical: Boolean
    koscher: Boolean
    rawMaterials: String
  }

  type Articles {
    articles: [Article]
    page: Int
    totalPages: Int
    totalArticles: Int
  }

  type Query {
    article(id: String!): Article
    allArticles(perPage: Int!, page: Int!): Articles
  }
`

module.exports = typeDefs
