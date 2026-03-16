// const newsDb =require('../news_controller/index')

// const OpenAI=require('openai');
// const dotenv=require('dotenv'); 
// const {AiRole}= require('../../build_ai_model/AiRole.js')
// const {CMS}=require('../../build_ai_model/ChatMessage.js');
import OpenAI from 'openai';
import dotenv from 'dotenv';
import {AiRole} from '../../build_ai_model/AiRole.js'
import {CMS} from '../../build_ai_model/ChatMessage.js'
dotenv.config()
console.log("API KEY:", process.env.DEEPSEEK_API_KEY)
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-ai/DeepSeek-V3',
  baseURL: 'https://api.siliconflow.cn/v1'
})
export const chat=async(req,res)=>{
    try {
    const { systemPrompt, name, age, sex, role, character,userId } = req.body
    
    console.log('userId', userId)
    console.log('System Prompt:\n', systemPrompt)
    
    const newRole = await AiRole.create({
      name,
      systemPrompt,
      userId,
      profile: { age, sex, role, character }
    });
    const list = await AiRole.find({ userId: userId }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      message: 'AI角色创建成功',
      aiId: newRole.id,
      data:list
    })



  } catch (error) {
    console.error('创建失败:', error)
    res.status(500).json({ error: error.message })
  }
}




export const talk=async(req,res)=>{
   console.log('接口被触发了！');
    try {
    const { userId,roleId,message,isSystem} = req.body

    const result=await processChatLogic(userId,roleId,message,isSystem)

    res.json({
    success:true,
    data:result
   })

  } catch (error) {
    console.error('聊天失败:', error)
    res.status(500).json({ error: error.message })
  }
}



// ai_controller/index.js

export const getAllroles = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // 🚩 1. 打印前端传过来的 ID 是什么，什么类型
    console.log('--- 收到查询请求 ---');
    console.log('查询参数 userId:', userId);
    console.log('参数类型:', typeof userId);

    // 🚩 2. 尝试不带条件查一下，看看数据库到底有没有数据
    const allData = await AiRole.find({});
    console.log('数据库里总共有几条角色数据:', allData.length);
    if(allData.length > 0) {
        console.log('第一条数据的 userId 是:', allData[0].userId);
        console.log('第一条数据 userId 的类型:', typeof allData[0].userId);
    }

    const list = await AiRole.find({ userId: userId }).sort({ updatedAt: -1 });
    
    console.log('最终匹配到的结果数量:', list.length);

    res.json({ success: true, data: list });
  } catch (err) {
    console.error('查询报错:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getHistory=async (req,res)=>{
  try{
     const {roleId,userId} =req.query
     const message=await CMS.find({roleId,userId}).sort({updatedAt:1})
     res.json({
      success:true,
      data:message
     })
  }catch(err){
    res.status(500).json({ success: false, error: error.message });
  }
}


export async function processChatLogic(userId,roleId,message,isSystem){
const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
const currentTimeString = `当前时间：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ` +
                          `星期${['日','一','二','三','四','五','六'][now.getDay()]} ` +
                          `${now.getHours()}:${now.getMinutes()}`;
    console.log('收到 roleId:', roleId);
    console.log('收到 userId:', userId);
    console.log('用户发送的消息是'+message)
    const roleInfo=await AiRole.findById(roleId)
    if(!roleInfo){
      throw new Error('角色不存在')
    }
    // 构建消息数组
    const lastMessage=await CMS.find({userId,roleId}).sort({createdAt:-1}).limit(10)
    const historyForAi=lastMessage.reverse().map(m=>({
      role:m.role,
      content: m.content
    }))
    if(!isSystem){
         await CMS.create({userId,roleId,role:'user',content:message})
    }
   
    
    // 调用 DeepSeek
    const response = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3',  // V3，无思考过程
      messages: [
        {role:'system',content: `【系统强制设定】${currentTimeString}。请严格基于此时间背景进行对话。以下是你的角色设定：${roleInfo.systemPrompt}`},
        ...historyForAi,
        {role:'user',content:message}
      ],
      temperature: 0.7,
      stream: false  // 流式输出
    })

     const aiReplyText=response.choices[0].message.content


     const aiMsg=await CMS.create({
      userId,
      roleId,
      role:'assistant',
      content:aiReplyText
     })
     console.log('aiMsg'+aiMsg)

     return aiMsg
}