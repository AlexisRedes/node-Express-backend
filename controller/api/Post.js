const PostService = require("../../services/Post");
const UserService = require("../../services/User")
const {verifyID} = require("../../utils/MongoUtils");
const {verifyTypeNumber} = require("../../utils/MiscUtils");
const debug = require("debug")("log");
const controller = {};
// const { restart } = require("nodemon");

controller.create = async (req,res)=>{
    const {body} = req;
    const fieldsValidation = PostService.verifyCreateFields(body);
    if(!fieldsValidation.success){
        return res.status(400).json(fieldsValidation.content);
    }
    try {
        const CreatePost = await PostService.create(body,req.user._id)
        if(!CreatePost.success){
            return res.status(409).json(CreatePost.content);
        }
        res.status(201).json(CreatePost.content);
    } catch (error) {
        return res.status(500).json(error);
    }
     
};

controller.findOneById =async (req, res)=>{
    const{_id} = req.params;
    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID",
        })
    }
    try {
        const postExist= await PostService.findOneById(_id);
        if(!postExist.success){
            return res.status(404).json(postExist.content)
        }
        return res.status(200).json(postExist.content)
    } catch (error) {
        return res.status(500).json({error:"Interna server error"})
    }
};

controller.findAllByUser = async (req, res)=>{
    const {id = req.user._id} = req.query;
    if(!verifyID(id)){
        return res.status(400).json({
            error: "Error in ID"
        })
    }
    try {
         const userExists = await UserService.findOneById(id);
         if(!userExists.success){
             return res.status(404).json(userExists.content);
         }
         const postByUser = await PostService.findAllByUserId(id);
         return res.status(200).json(postByUser.content); 
    } catch (error) {
        return res.status(500).json({
            error:"Error in ID"
        })
    }
}

controller.findAll = async (req, res)=>{
    const {page =0 , limit=10}= req.query;
    if(!verifyTypeNumber(page,limit)){
        return res.status(400).json({
            error:"Mistype in queri"
        })
    };
    try {
        const postsResponse = await PostService.findAll(parseInt(page),parseInt(limit));
        res.status(200).json(postsResponse.content);
    } catch (error) {
        return res.status(500).json({error:"Interna server error"})
    }
};

controller.addLike =  async(req,res)=>{
    const {_id} = req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID",
        })
    };
    try {
        const postExist = await PostService.findOneById(_id)
        if(!postExist){
            return res.status(404).json(postExist.content)
        };
        const LikeAdded = await PostService.addLike(postExist.content);
        if(!LikeAdded.success){
            res.status(409).json(LikeAdded.content);
        }
        return res.status(200).json(LikeAdded.content);
    } catch (error) {
        return res.status(500).json({error:"Interna server error"})
    }
};

controller.updatePost= async(req,res)=>{
    const {_id}= req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID"
            }
        )}
    const fieldVerify= PostService.verifyUpdateFields(req.body);
    if(!fieldVerify.success){
        return res.status(400).json(fieldVerify.content);
    }
    try {
        const postExist =await PostService.findOneById(_id);
        if(!postExist.success){
            return res.status(403).json(postExist.content);
        }
        const {user} = req;
        const userAuthority = PostService.verifyUserAuthority(postExist.content, user);
        if(!userAuthority.success){
            return res.Status(401).json(userAuthority.content);
        }
        const postUpdated= await PostService.updateOneById(postExist.content,fieldVerify.content);
        if(!postUpdated.success){
            return res.status(409).json(postUpdated.content)
        }
        return res.status(200).json(postUpdated.content);
    } catch (error) {
        return res.status(500).json({
            error:"Interna server error"
        })
    }
};
controller.deleteOneById= async(req,res)=>{
    const {_id}= req.body;
    if(!verifyID(_id)){
        return res.status(400).json({
            error:"Error in ID"
        })
    };
    try {
        const postExist = await PostService.findOneById(_id);
        if(!postExist.success){
            return res.status(404).json(postExist.content)
        }
        const {user} = req;
        const userAuthority = PostService.verifyUserAuthority(postExist.content, user);
        if(!userAuthority.success){
            return re.Status(401).json(userAuthority.content);
        }
        const deleted = await PostService.deleteOneById(_id);
        debug(deleted);
        if(!deleted.success){
            return res.sttus(409).json(deleted.content)
        }
        return res.status(200).json(deleted.content);
    } catch (error) {
        return res.status(500).json({
            error:"internal server error"
        })
    }
}

module.exports = controller; 
 