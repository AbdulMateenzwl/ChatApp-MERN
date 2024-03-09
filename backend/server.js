const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")

const app = express()

dotenv.config()
connectDB()

app.use(express.json()) // to accept json data in the body

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)


app.use(notFound)

app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(5000, console.log(`Server running on port ${PORT}`.yellow.bold))

const io = require('socket.io')(server, {
    pingTimeout: 120000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log("joined", userData._id)
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        // console.log("joined", room)
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if (!chat.users) return console.log("Chat.users not defined")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})