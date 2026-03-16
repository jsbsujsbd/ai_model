import express from 'express'
import cors from 'cors'
import router from './interface/ai_interface/index.js'
import mogDb from './db/mogDb/index.js'
import dotenv from 'dotenv'
import schedule from 'node-schedule'
import {AiRole} from './build_ai_model/AiRole.js'
import {processChatLogic} from './controller/ai_controller/index.js'
import {cors} from 'cors'

dotenv.config()

console.log("API KEY:", process.env.DEEPSEEK_API_KEY)

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)
schedule.scheduleJob('*/1 * * * *', async () => {
  try{
     const allRoles=await AiRole.find({});
     if (allRoles.length === 0) return;
     const luckyRoles=allRoles[Math.floor(Math.random()*allRoles.length)]
      console.log('allRoles',luckyRoles)
     const hint="请根据你们之前的聊天记录，主动给用户发一条问候或开启新话题"
     await processChatLogic(luckyRoles.userId,luckyRoles._id,hint,true)
  }catch(err){
      console.log(err)
  }
 
})
mogDb()

app.listen(9094, () => {
  console.log(`服务器运行在 http://192.168.88.130:9094`)
})