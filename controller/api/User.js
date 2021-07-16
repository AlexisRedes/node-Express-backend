const { veryfyUpdateFields } = require("../../services/User");
const {verifyID} = require("../../utils/MongoUtils")
const userService = require("../../services/User");
const PostService = require("../../services/Post")
const controller = {};


controller.getUser = (req,res)=> {
    const {user} = req;
    if(!user){
        return res.status(404).json({
            error:"User Not Found"
        });
    }

    return res.status(200).json(user);
}

controller.updateById= async (req,res)=>{
    const {user} = req;
    const verifyField = userService.veryfyUpdateFields(req.body);
    if(!verifyField.success) return res.Status(400).json(verifyField.content);
    if(!user) return res.status(404).json({error:"User not Found"});
    
    try {
        const userUpdate = await userService.updateById(user ,verifyField.content);
        if(!userUpdate.success) return res.status(409).json(userUpdated.content);
        return res.status(200).json(userUpdate.content);
    } catch (error) {
        return res.status(500).json({
            error:"Internal server error"
        })
    }
}

controller.savePost = async (req,res)=>{
    const {postID} = req.body;
    const {user}= req;
    if(!verifyID(postID)){
        return res.status(400).json({
            error:"Error in ID"
        });
    }

    try {
        const postExists = await PostService.findOneById(postID);
        if(!postExists.success){
            return res.status(404).json(postExists.content);
        }
        const userUpdated = await userService.registerSavedPost(user,postID)
        if(!userUpdated.success){
            return res.Status(409).json(userUpdated.content);
        }
        return res.status(200).json(userUpdated.content);
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

module.exports = controller; 