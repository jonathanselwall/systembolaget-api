const ArticleModel = require('../schemas/articleSchema')

const batchInsertion = data => {
  console.log('starting insertion')
  return ArticleModel.insertMany(data.articles)
    .then(data => console.log(`Added ${data.length} articles!`))
    .catch(err => console.error(err))
}

module.exports = batchInsertion
