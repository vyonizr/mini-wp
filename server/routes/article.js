const router = require("express").Router()
const { images } = require('../helpers/images')
const { ArticleController } = require("../controllers/")
const { isAuthenticated, isAuthorized } = require("../middlewares/")

router.get("/", isAuthenticated, ArticleController.getArticles)
router.post("/", isAuthenticated, images.multer.single('image'), images.sendUploadToGCS, ArticleController.createAnArticle)
router.delete("/:articleId", isAuthenticated, isAuthorized, ArticleController.deleteanArticle)

module.exports = router