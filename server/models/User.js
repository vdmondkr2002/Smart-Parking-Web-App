const mongoose = require('mongoose')

/* 
This schema holds data for user details
such as user's basic info,
whether user verified or not,
subscription object if subscribed for notification which will be used in future to send push notification,
otp while registration,
role of user or admin
*/
const UserSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2
    },
    lastName:{
        type:String,
        required:true,
        min:2
    },
    userName:{
        type:String,
        required:true,
        min:5
    },
    email:{
        type:String,
        required:true,
    },
    mobileNo:{
        type:String,
        requried:true,
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    profilePic:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    subscription:{
        type:Object,
    },
    otp:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const User = mongoose.model('User',UserSchema)
module.exports = User