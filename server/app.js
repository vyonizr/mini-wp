require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const port = process.env.PORT || 80
const routes = require("./routes")

mongoose.connect("mongodb://localhost:27017/miniwp", { useNewUrlParser: true })
// mongodb+srv://admin:<password>@median-yqers.gcp.mongodb.net/test?retryWrites=true
// mongoose.connect(`mongodb+srv://${process.env.ATLAS_USERID}:${process.env.ATLAS_PASSWORD}@median-yqers.gcp.mongodb.net/miniwp`, { useNewUrlParser: true })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/", routes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})