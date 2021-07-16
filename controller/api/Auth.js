const controller = {};
const userService = require("../../services/User");
const {createToken} = require("../../utils/JWTUtils");


controller.register = async(req,res)=>{
    const fieldsValidation = userService.verifuRegisterFields(req.body);
    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }
    try {
        const{username,email}=req.body;
        const userExist = await userService.findOneUsernameEmail(username,email);
        if(userExist.success){
            return res.status(409).json({
                error:"User already exists"
            });
        }
        const userRegistered = await userService.register(req.body)
        if(!userRegistered.success){
            return res.status(409).json(userRegistered.content);
        }
        return res.status(201).json(userRegistered.content)
    } catch (error) {
        return res.status(500).json({
            error:"Internal Server Error"
        });
    }
}

controller.login = async(req,res)=>{
    const fieldValidation = userService.verifyLoginFields(req.body);
    if(!fieldValidation.success){
        return res.status(400).json(fieldValidation.content);
    }
    try {
        const{identifier, password} = req.body;
        const userExist = await userService.findOneUsernameEmail(identifier,identifier);
        if(!userExist.success){
            return res.status(404).json(userExist.content);
        }
        const user = userExist.content;
        if(!user.comparePassword(password)){
            return res.status(401).json({
                error:"Error incorrect password"
            })
        }
        return res.status(200).json({
            token: createToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }
}



module.exports= controller;