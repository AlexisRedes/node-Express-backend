const PostModel = require('../models/Post');
const tools = require('../utils/MongoUtils');
const services = {};

services.verifyCreateFields = ({title, description, image})=>{
    let servicesResponse = {
        success: true,
        content: {
            message:"Fields fine!"
        }
    }

    if(!title){
        servicesResponse = {
            success: true,
            content: {
                message:"Title is require"
            }
        }
        return servicesResponse;
    }

    //todas las verificaciones 
    
    return servicesResponse;
}

services.verifyUpdateFields = ({title,description,image})=>{
    let servicesResponse = {
        success: true,
        content: {}
    }
    if(!title &!description &!image){
        servicesResponse = {
            success: false,
            content: {
                error:"All fields are empty"
            }
        }
        return servicesResponse;
    };
    const x =servicesResponse.content;
    if(title) x.title=title;
    if(description) x.description=description;
    if(image) x.image=image;
    return servicesResponse;

};

services.create= async({title, description, image}, userId) => {
    let servicesResponse = {
        success: true,
        content: {
            message:"Post created!"
        }
    }
    try {
        const post = new PostModel({
            title,
            description,
            image,
            user:userId
        });

        const postSaved= await post.save();

        if(!postSaved){
            servicesResponse = {
                success: false,
                content: {
                    message:"Post not created"
                }
            }
        }
        return servicesResponse;
    } catch (error) {
        throw res.status(500).json({
            error:"internal server error"
        });
    }
};

services.findOneById =async (_id)=>{
    let servicesResponse = {
        success: true,
        content: {
            message:"Post Fount!",
        }
    }
    
    try {
        const post = await PostModel.findById(_id).populate("user", "_id username").exec();
        if(!post){
            servicesResponse = {
                success: false,
                content: {
                    error:"This Id dont exist",
                }
            }
        }
        else{
            servicesResponse.content = post;
        }
    return servicesResponse;
    } catch (error) {
        throw error;
    }
}

services.findAllByUserId = async (userId)=>{
    let serviceResponse = {
        success: true,
        content: {}
    }
    try {
        const posts = await PostModel.find({user:userId}).populate("user", "username _id").exec();
        serviceResponse.content = posts;
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

services.findAll=async(page, limit)=>{
    let serviceResponse = {
        success: true,
        content:{}
    }
    try {
        const posts = await PostModel.find({},undefined,{
            skip:page*limit,
            limit:limit,
            sort:[{
                updatedAt:-1
            }]
        }).populate("user", "_id username email").exec();  //primer parametro: es el Where sql //Segundo parametro Undefine //Ultimo parametro: Opciones
                    //exec() con esto se ejecuta la queri para que devuelva una promesa
                    // populate(camposeleccionado) te trae informacion de el campon que seleccionas en el primer parametro 
        serviceResponse.content={
            posts,
            count: posts.length,
            page,
            limit
        }
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

services.verifyUserAuthority = (post, user) =>{
    let serviceResponse = {
        success : true,
        content: {
            message:"User authority verified"
        }
    }
    if(!post.user._id.equals(user._id)){
        serviceResponse ={
            success: false,
            content: {
                message: "This post dont belong to you"
            }
        }
    }
    return serviceResponse;
}

services.addLike = async(post)=>{
    let serviceResponse={
        success:true,
        content:{
            message:"Post Liked!"
        }
    };
    try {
        post.likes+=1;
        const postUdated = await post.save();
        if(!postUdated){
            serviceResponse={
                success:false,
                content:{
                    message:"Post not Liked"
                }
            }
        };
        return serviceResponse;
    } catch (error) {
        throw error;
    }
}

services.updateOneById = async(post, contentToUdate)=>{
    let servicesResponse = {
        success: true,
        content: {
            message:"Post Update"
        }
    }
    try {
        post.history.push({
            title: post.title,
            description:post.description,
            image:post.image,
            modifiedAt: new Date(),
        })
        Object.keys(contentToUdate).forEach(key =>{
            post[key]= contentToUdate[key];
        });
        const updatePost = await post.save();
        
        if(!updatePost){
            servicesResponse = {
                success: false,
                content: {
                    message:"Post not Update"
                }
            }
        }
        return servicesResponse;
    } catch (error) {
        throw error;
    }
}

services.deleteOneById = async(_id)=>{
    let servicesResponse = {
        success: true,
        content: {
            message:"Post Deleted"
        }
    };
    try {
        const postDeleted = await PostModel.findByIdAndDelete(_id).exec();
        if(!postDeleted){
            servicesResponse = {
                success: false,
                content: {
                    message:"Post not Deleted"
                }
            }
        };
        return servicesResponse;
    } catch (error) {
        throw error;
    }

}

module.exports= services; 