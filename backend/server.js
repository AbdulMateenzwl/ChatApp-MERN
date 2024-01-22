const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const app = express()

dotenv.config()
connectDB()

app.use(express.json()) // to accept json data in the body

app.use("/api/user", userRoutes)
app.use("/api/chat",chatRoutes)


app.use(notFound)

app.use(errorHandler)


const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server running on port ${PORT}`.yellow.bold))