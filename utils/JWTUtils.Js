const jwt = require("jsonwebtoken");
const secret = process.env.JWTSECRET || "Secret";
const tools = {};

tools.createToken = (_id)=>{
    const payload = {        //informacion que quiero mandar
        _id
    };
    return jwt.sign(payload,secret,{
        expiresIn: process.env.EXPIRETIME || "10h",           //tiempo que dura el touken
    });

}

tools.verifyToken = (token)=>{
    try {
        return jwt.verify(token,secret)
    } catch (error) {
        return false;
    }
}

module.exports = tools;