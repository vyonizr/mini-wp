module.exports = function isAuthorized(req, res, next) {
  try {
    if (req.authenticatedUser.id !== req.headers.authorization) {
      throw ({
        message: "You are not authorized to perform this action."
      });
    }
    else {
      console.log("<= authorized middleware");
      next()
    }
  }
  catch (err) {
    res.status(401).json(err)
  }
}