const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomId:{
        type:Number,
        required:true
    }
})

const Room = mongoose.model('room', roomSchema)
module.exports = Room