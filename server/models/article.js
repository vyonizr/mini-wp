const mongoose = require("mongoose")
const { Schema } = mongoose

const articleSchema = new Schema({
  title: String,
  content: String,
  featured_image: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "USer"
  }
})

const Article = mongoose.model("Article", articleSchema)

module.exports = Article