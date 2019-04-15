const router = require("express").Router()
const { images } = require('../helpers/')
const { ArticleController } = require("../controllers")
const { isAuthenticated, isAuthorized } = require("../middlewares")

router.get("/", isAuthenticated, ArticleController.getAllArticles)
router.get("/:userId", isAuthenticated, ArticleController.getOwnedArticles)
router.post("/", isAuthenticated, images.multer.single('image'), images.sendUploadToGCS, ArticleController.createAnArticle)
router.patch("/:articleId", isAuthenticated, isAuthorized, images.multer.single('image'), images.sendUploadToGCS, ArticleController.updateAnArticle)
router.delete("/:articleId", isAuthenticated, isAuthorized, ArticleController.deleteAnArticle)

module.exports = router