const router = require("express").Router()
const { images } = require('../helpers/')
const { ArticleController } = require("../controllers")
const { isAuthenticated, isAuthorized } = require("../middlewares")

router.get("/", isAuthenticated, ArticleController.getAllArticles)
router.post("/", isAuthenticated, images.multer.single('image'), images.sendUploadToGCS, ArticleController.createAnArticle)
router.delete("/:articleId", isAuthenticated, isAuthorized, ArticleController.deleteAnArticle)

module.exports = router