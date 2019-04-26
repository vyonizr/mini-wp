const { Article, } = require("../models")
const ObjectId = require('mongodb').ObjectID

class ArticleController {
  static getAllArticles(req, res) {
    Article.find({}, {}, {
      sort: {
        created_at: -1
      }
    })
    .populate({
      path: "author",
      select: "name"
    })
    .then(articles => {
      res.status(200).json(articles)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    })
  }

  static getOwnedArticles(req, res) {
    Article.find({
      author: req.params.userId
    }, {}, {
      sort: {
        created_at: 1
      }
    })
    .populate({
      path: "author",
      select: "name"
    })
    .then(ownedArticles => {
      res.status(200).json(ownedArticles)
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
      author: ObjectId(req.authenticatedUser.id)
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

  static updateAnArticle(req, res) {
    Article.findByIdAndUpdate(req.params.articleId, {
      title: req.body.title,
      content: req.body.content,
      featured_image: req.file.cloudStoragePublicUrl,
      updatedAt: new Date()
    }, { new: true })
    .then(updatedArticle => {
      res.status(200).json(updatedArticle)
    })
    .catch(err => {
      res.send(500).json(err)
    })
  }
}

module.exports = ArticleController