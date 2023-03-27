
const axios = require('axios')


exports.getNews = async(req,res)=>{
    try{
        //latest news are obtained from newsapi.org
        const {data} = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=3204f12540ee4cca967f8decf27bf1b9&category=technology`)
        //max 10 articles are fetched
    
        return res.status(200).json({msg:"News fetched",news:data.articles.splice(0,Math.min(data.articles.length,10))})
    }catch(err){
        return res.status(500).json({msg:"Something went wrong..."})
    }
}
