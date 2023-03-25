
const axios = require('axios')
exports.getNews = async(req,res)=>{
    try{
        const {data} = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=3204f12540ee4cca967f8decf27bf1b9&category=technology`)
        if(data.articles){
            console.log(data.articles.splice(0,Math.min(data.articles.length,10)))
        }
        // console.log(data)
        return res.status(200).json({msg:"News fetched",news:data.articles.splice(0,Math.min(data.articles.length,10))})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong..."})
    }
}
