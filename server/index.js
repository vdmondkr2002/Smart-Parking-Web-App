const express = require('express')
const cors = require('cors')
const razorpay = require('razorpay')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const helmet = require('helmet')
const webpush = require('web-push')
const { sendNotifs } = require('./Utils/sendNotifs')


dotenv.config({path:'./config/config.env'})

const app = express()

//connect to database
connectDB()

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT,process.env.PUBLIC_VAPID_KEY,process.env.PRIVATE_VAPID_KEY)

app.get('/',(req,res)=>{
    res.send("Smart parking API running")
})

app.use(express.json({ limit: "80mb", extended: true }))
app.use(express.urlencoded({limit:"80mb",extended:true}))
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(cors())

// sendNotifs()



app.use('/api/v1/users',require('./routes/users'))
app.use('/api/v1/parkingLots',require('./routes/parkingLots'))
app.use('/api/v1/admin',require('./routes/admin'))
app.use('/api/v1/payments',require('./routes/payments'))
app.use('/api/v1/news',require('./routes/news'))


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server Running ${PORT}`))
