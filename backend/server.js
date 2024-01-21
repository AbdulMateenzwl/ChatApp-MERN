const express = require("express")
const dotenv = require("dotenv")
const {chats}  = require("./data/data")
const connectDB = require("./config/db")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")

const app = express()

dotenv.config()
connectDB()

app.use(express.json()) // to accept json data in the body

app.use("/api/user",userRoutes)


const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server running on port ${PORT}`.yellow.bold))