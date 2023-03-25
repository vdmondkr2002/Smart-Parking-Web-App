const cron = require('node-cron')
const User = require('../models/User')
const webpush = require('web-push')
const BookedTimeSlot = require('../models/BookedTimeSlot.js')

exports.sendNotifs = ()=>{
    cron.schedule('5 * * * *',async()=>{
        // startTime-Date.now()<=1000*60
        //statrTime<=1000*60
        try{
            const payload = JSON.stringify({
                title:'Attention',
                body:"Hurry Up! Only few minutes left for your booked parking slot to start"
            })
    
            const bookedTimeSlots = await BookedTimeSlot.find({
                startTime:{
                    $lte:Date.now()+1000*60*10
                },
                notified:false
            })
            for(let slot of bookedTimeSlots){
                const user = await User.findById(slot.booker)
                if(user.subscription){
                    const result = await webpush.sendNotification(user.subscription,payload)
                    await BookedTimeSlot.findByIdAndUpdate(slot._id,{notified:true})
                    console.log(result)
                }
            }
        }catch(err){
            console.log("Error occured while sending notification",err)
        }
        
        // const users = await User.find();
        // const payload = JSON.stringify({
        //     title:'Attention',
        //     body:"Hurry Up! Only few minutes left for your booked parking slot to start"
        // })
        
        // for(let user of users){
        //     console.log(user.subscription)
        //     if(user.subscription){
        //         const result = await webpush.sendNotification(user.subscription,payload)
        //         console.log(result)
        //     }
        // }
    })
}

