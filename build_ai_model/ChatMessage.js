import mongoose from "mongoose";
const chatMessageSchema=new mongoose.Schema({
    userId:{
        type:String,
        ref:'User',
        required:true
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AiRole',
        required:true
    },
    role:{type:String,enum:['user','assistant']},
    content:{type:String,required:true}
},{timestamps:true})
chatMessageSchema.index({userId:1,roleId:1,createdAt:1})
export const CMS = mongoose.model('cms', chatMessageSchema);