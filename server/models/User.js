const mongoose = require('mongoose')

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
    // profilePic:String,
    email:{
        type:String,
        required:true,
    },
    mobileNo:{
        type:String,
        requried:true,
    },
    // bio:{
    //     type:String
    // },
    password:{
        type:String,
        required:true,
        min:6
    },
    verified:{
        type:Boolean,
        default:false
    },
    // quizesTaken:{
    //     type:Number,
    //     required:true
    // },
    // totalScore:{
    //     type:Number,
    //     required:true
    // },
    // questionsAttempted:{
    //     type:Number,
    //     required:true
    // },
    // correctSolved:{
    //     type:Number,
    //     required:true
    // },
    // questionsContributed:{
    //     type:Number,
    //     required:true
    // },
    // timeSpent:{
    //     type:Number,
    //     required:true
    // },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const User = mongoose.model('User',UserSchema)
module.exports = User