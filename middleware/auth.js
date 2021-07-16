const {verifyToken} = require("../utils/JWTUtils");
const {verifyID} = require("../utils/MongoUtils");
const userService = require("../services/User");
const middleware = {};

middleware.verifyAuth = async (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(403).json({
            error:"Authorization is requiered"
        });
    }

    const [prefix,token] = authorization.split(" ")
    if(prefix !== "Bearer"){
        return res.status(400).json({
            error:"Incorrect Prefix",
        });
    }
    const tokenObject = verifyToken(token);
    if(!tokenObject){
        return res.status(401).json({
            error:"invalid token ",
        });
    }

    const userId = tokenObject._id;
    if(!verifyID(userId)){
        return res.status(400).json({
            error:"Error in ID",
        });
    }

    const userExist = await userService.findOneById(userId);
    if(!userExist.success){
        return res.status(404).json(userExist.content);
    }
    
    req.user = userExist.content;

    next();

} 


module.exports = middleware;