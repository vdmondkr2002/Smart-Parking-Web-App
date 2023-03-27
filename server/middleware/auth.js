const jwt = require('jsonwebtoken')

/*
This is a middleware here used for authorization purpose-> 
it intercepts incoming requests and checks if request contains authorization header
if yes gets the user id by verifying token and adds it to request object
else proceeds to route as it is
*/
const auth = (req,res,next)=>{
    try{
        //get token from header
        if(!req.headers.authorization){
            next()
        }else{
            const token = req.headers.authorization.split(" ")[1];
            console.log("Token found",token)
            //verify token
            if(token){
                const decodedData = jwt.verify(token,process.env.TOKEN_SECRET)
                //attach user id to request object
                req.userId = decodedData?.id
            }
            next()
        }
        
    }catch(err){
        console.log(err)
    }
}

module.exports = auth