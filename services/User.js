const UserModel = require("../models/Users")
const emailReguex = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
const service = {}

service.verifuRegisterFields = ({username,email,password,name,photo}) => {
    let serviceResponse= {
        success:true,
        content:{}
    }
    if(!username || !email || !password || !name){
        serviceResponse= {
            success:false,
            content:{
                error:"Required fields empy"
            }
        }
        return serviceResponse;
    }

    if(!emailReguex.test(email)){
        serviceResponse= {
            success:false,
            content:{
                error:"field Format incorrect"
            }
        }
        return serviceResponse;
    }

    if(!passwordRegex.test(password)){
        serviceResponse= {
            success:false,
            content:{
                error:"Password must be 8-16 and strong"
            }
        }
        return serviceResponse;
    }
    return serviceResponse;
}

service.verifyLoginFields=({identifier,password})=>{
    let serviceResponse= {
        success:true,
        content:{}
    }
    if(!identifier || !password){
        serviceResponse= {
            success:false,
            content:{
                error:"Required fields empy"
            }
        }
        return serviceResponse;
    }
    return serviceResponse;
}

service.veryfyUpdateFields = ({username,email,password,name,photo})=>{
    let serviceResponse= {
        success:true,
        content:{}
    }

    if(!username && !email && !password && !name && !photo){
        serviceResponse= {
            success:false,
            content:{
                error:"All field are empty"
            }
        }
        return serviceResponse;
    }
    if(username) serviceResponse.content.username = username;
    if(name)serviceResponse.content.name=name;
    if(photo)serviceResponse.content.photo=photo;
    if(password){
        if(!passwordRegex.test(password)){
            serviceResponse= {
                success:false,
                content:{
                    error:"Password must be 8-16 and strong"
                }
            }
            return serviceResponse;
        }
        serviceResponse.content.password = password;
    }
    if(email){
        if(!emailReguex.test(email)){
            serviceResponse= {
                success:false,
                content:{
                    error:"field Format incorrect"
                }
            }
            return serviceResponse;
        }
        serviceResponse.content.email = email;
    }
    

    return serviceResponse;

}

service.findOneUsernameEmail = async(username, email)=>{
    let serviceResponse= {
        success:true,
        content:{}
    }
    try {
        const user = await UserModel.findOne({
            $or:[{username:username},{email:email}]
        }).exec();
        
        if(!user){
            
            serviceResponse= {
                success:false,
                content:{
                    error:"User not found"
                }
            }
            return serviceResponse;
        }else{
            serviceResponse.content=user;
        }
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

service.findOneById= async(_id)=>{
    let serviceResponse = {
        success: true,
        content: {}
    }
    try {
        const user = await UserModel.findById(_id).select("-hashedPassword").exec(); //trae toda la informacion del usuario con la id dada menos la contraseña 
        if(!user){
            serviceResponse = {
                success:false,
                content: {
                    error:"User not found"
                }
            };
        }
        else{
            serviceResponse.content = user; 
        }
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

service.register = async ({username, email, password,name,photo})=>{
    let serviceResponse = {
        success:true,
        content:{
            message: "User registered"
        }
    }
    try {
        const user = new UserModel({
            username:username,
            email:email,
            password:password,
            name:name,
            photo:photo,

        });
        const userSaved = await user.save();
        if(!userSaved){
            serviceResponse={
                success: false,
                content:{
                    error:"User not register"
                }
            }
        }
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

service.updateById = async (user, contentToUpdate)=>{
    let ServiceResponse={
        success:true,
        content: {
            message: "User update"
        }
    }
    try {
        Object.keys(contentToUpdate).forEach(key=>{
            user[key] = contentToUpdate[key];
        });
        
        const userUpdated = await user.save();
        if(!userUpdated){
            ServiceResponse={
                success:false,
                content:{
                    error:"User not updated"
                }
            }
        }
        return ServiceResponse;
    } catch (error) {
        throw error;
    }

}

service.registerSavedPost = async (user, posId) =>{
    let serviceResponse = {
        success: true,
        content: {
            message: "Post Registered"
        }
    }

    try {
        const alreadyExists = user.savedPosts.some(post => post.equals(postId))
        if(alreadyExists){
            serviceResponse = {
                success:true,
                content: {
                    message: "Post Already in list"
                }
            }
            return serviceResponse;
        }
        user.savedPosts.push(posId);
        const userUpdate = await user.save();
        if(!userUpdate){
            serviceResponse={
                success:false,
                content: {
                    error:"Cannot register post"
                }
            }
        }
        return serviceResponse;
    } catch (error) {
        throw error;
    }

}
module.exports = service;