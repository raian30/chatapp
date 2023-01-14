const mongoose = require('mongoose')

const msgSchema = new mongoose.Schema({
    roomid:{
        type:Number,
        required:true
    },
    msg:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String,
        required: false
    }
})

const Msg = mongoose.model('msg', msgSchema)
module.exports = Msg
