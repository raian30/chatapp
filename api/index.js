const mongoose = require('mongoose')
const Msg = require('./models/messages')
const Room = require('./models/rooms')
const User = require('./models/users')
const { Server } = require("socket.io")
const { writeFile } = require("fs")
const express = require('express')
const path = require('path')
const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const mongoDB = 'mongodb+srv://rajko:w1e2r3T4@cluster0.rjvy3nc.mongodb.net/?retryWrites=true&w=majority'
mongoose.set("strictQuery", false);
mongoose.connect(mongoDB, {useNewUrlParser: true})

const io = new Server({
    cors: {
        origin: ["http://localhost:5173","http://192.168.42.126:5173"]
    },
    maxHttpBufferSize: 1e8
})

function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('get-messages', result)
    })
    socket.on('chat message', (msg) => {
        console.log(msg)
        const message = new Msg({roomid:msg.id, msg: msg.message, username: msg.username, imageUrl: msg.url })
        message.save().then(() => {
            io.emit('chat message', {roomid:msg.roomid, msg: msg.message, username: msg.username, imageUrl: msg.url });
        })
    });
    Room.find().then(result => {
        socket.emit('get-rooms', result)
    })
    socket.on('create room', (roomId) => {
        console.log(roomId)
        const room = new Room({roomId: roomId.roomjoin})
        room.save().then(() => {
            io.emit('create room', {roomId: roomId.roomjoin});
        })
    });
    User.find().then(result => {
        socket.emit('get-users', result)
    })
    socket.on('create user', (user) => {
        console.log(user)
        const newuser = new User({email:user.email, username: user.username, password: user.password})
        newuser.save().then(() => {
            io.emit('create user', {email:user.email, username: user.username, password: user.password});
        })
    });
    socket.on("upload", (file, callback) => {
        const fileName = `uploads/${makeid(10)}.jpg`

        writeFile(fileName, file, (err) => {
            callback({ message: err ? console.log(err) : fileName });
        });
    });
});

io.listen(3000);
app.listen(4000)