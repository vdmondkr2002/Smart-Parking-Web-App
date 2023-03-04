const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const helmet = require('helmet')

dotenv.config({path:'./config/config.env'})

const app = express()

//connect to database
connectDB()

app.get('/',(req,res)=>{
    res.send("Smart parking API running")
})

app.use(express.json({ limit: "80mb", extended: true }))
app.use(express.urlencoded({limit:"80mb",extended:true}))
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(cors())


app.use('/api/v1/users',require('./routes/users'))
app.use('/api/v1/parkingLots',require('./routes/parkingLots'))
app.use('/api/v1/admin',require('./routes/admin'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server Running ${PORT}`))
