const { Article } = require("../models")

module.exports = function isAuthorized(req, res, next) {
  Article.findById(req.params.articleId)
  .then(foundArticle => {
    if (foundArticle.author.toString() !== req.authenticatedUser.id.toString()) {
      res.status(403).json({
        message: "You are not authorized to perform this action."
      });
    }
    else {
      next()
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
}