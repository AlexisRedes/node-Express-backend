const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: String,
    likes:{
        type:Number,
        default:0,
    },
    history:{
        type:[{
            title:String,
            description:String,
            image:String,
            modifieldAt:Date,
        }],
        default:[]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
}, {
    timestamps:true //guarda la fecha de creacion
});


module.exports =mongoose.model("Post", PostSchema);