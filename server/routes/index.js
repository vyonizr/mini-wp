const router = require("express").Router()
const usersRoute = require("./articleRoute")
const articleRoute = require("./articleRoute")

router.use("/users", usersRoute)
router.use("/articles", articleRoute)

module.exports = router