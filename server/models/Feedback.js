const mongoose = require('mongoose')

const FeedbackSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Feedback = mongoose.model('Feedback',FeedbackSchema)
module.exports = Feedback