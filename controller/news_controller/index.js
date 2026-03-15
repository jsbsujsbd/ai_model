exports.aiCatMEssage=async(req,res)=>{
    const {userId,roleId,content}=req.body
    const userMsg=await ChatMessage.creat({
        userId,
        roleId,
        role:'user',
        content:content
    })
        

    const aiMsg=await ChatMessage.creat({
      userId,
      roleId,
      role:'ai',
      content:aiReplyText
    })
}