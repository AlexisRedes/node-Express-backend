const Crypto = require("crypto");
const mongosse= require("mongoose");
const Schema = mongosse.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:String,
        unique:true
    },
    hashedPassword:{
        type:String,
        default:"",
    },
    name:{
        type:String,
        require:true,
    },
    photo:String,
    savedPosts:{
        type:[{
            type:mongosse.Schema.Types.ObjectId,
            ref: "Post"
        }]
    }
},

{
    timestamps:true
});

UserSchema.virtual("password").set(function(password){
    this.hashedPassword = Crypto.createHmac("sha256",password).digest("hex");
});

UserSchema.methods = {
    comparePassword: function(password){
        return(Crypto.createHmac("sha256",password).digest("hex")===this.hashedPassword);
    }
}


module.exports = mongosse.model("User", UserSchema);