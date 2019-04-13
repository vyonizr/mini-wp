const { Article, User } = require("../models")
const ObjectId = require('mongodb').ObjectID

class ArticleController {
  static getAllArticles(req, res) {
    Article.find({})
    .then(articles => {
      res.status(200).json(articles)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static createAnArticle(req, res) {
    Article.create({
      title: req.body.title,
      content: req.body.content,
      featured_image: req.file.cloudStoragePublicUrl,
      UserId: req.authenticatedUser.id
    })
    .then(createdArticle => {
      res.status(201).json(createdArticle)
    })
    .catch(err => {
      if (err.errors.title || err.errors.content || err.errors.title) {
        res.status(400).json({
          message: err.message
        })
      }
      else {
        console.log(err);
        res.status(500).json(err)
      }
    })
  }

  static deleteAnArticle(req, res) {
    Article.deleteOne({
      _id: req.params.articleId
    })
    .then(() => {
      res.status(200).json({
        message: "delete success"
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
}

module.exports = ArticleController