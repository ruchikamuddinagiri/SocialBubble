const express = require('express')
const path = require('path')
const http = require('http')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
const { addUser, getUser, removeUser, getUsersInRoom} = require('./utils/users')

const publicDirectoryPath = path.join(__dirname, './public')

//database
const db = require('./database/connect')
db()
//console.log(mongoose.connection)
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' })
//routers
const userRouter = require('./routers/userRoutes')
const chatRouter = require('./routers/chatRoutes')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static(publicDirectoryPath))
app.use(cookieParser()) 

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    unset: "destroy",
    cookie: {
        maxAge: 60000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouter)
app.use(chatRouter)

const welcome = "Welcome!"
io.on('connection', (socket)=>{
  
    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback("message delivered")
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            const text = `${user.username} has left the chat`
            io.to(user.room).emit('message', generateMessage('Admin',text))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })
    //location
    socket.on('sendLocation', (location, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUser({id: socket.id, username, room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
})

//set up server
server.listen(port, () => {
    console.log("Server is up on port", process.env.PORT)
})  
