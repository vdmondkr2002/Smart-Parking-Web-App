const cron = require('node-cron')
const User = require('../models/User')
const webpush = require('web-push')
const BookedTimeSlot = require('../models/BookedTimeSlot.js')

//send notification to user before their booking slot time arrives
exports.sendNotifs = ()=>{
    cron.schedule('*/2 * * * *',async()=>{
        console.log("notifications cron job running...")
        try{
            const payload = JSON.stringify({
                title:'Attention',
                body:"Hurry Up! Only few minutes left for your booked parking slot to start"
            })
    
            //get all those active slots with less than 10 mins left to start which haven't been notified 
            const bookedTimeSlots = await BookedTimeSlot.find({
                startTime:{
                    $gte:Date.now(),
                    $lte:Date.now()+1000*60*10
                },
                notified:false,
                paid:true,
                cancelled:false
            })
            //for all such slots
            for(let slot of bookedTimeSlots){
                const user = await User.findById(slot.booker)
                if(user.subscription){
                    //send web push notification to users who have booked and update notified as true for that particular slot booking
                    const result = await webpush.sendNotification(user.subscription,payload)
                    await BookedTimeSlot.findByIdAndUpdate(slot._id,{notified:true})
                    console.log(result)
                }
            }
        }catch(err){
            console.log("Error occured while sending notification",err)
        }
        
    })
}

