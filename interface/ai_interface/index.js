const express=require('express');
const router=express.Router();
router.post('/chat',require('../../controller/ai_controller').chat)
router.post('/talk',require('../../controller/ai_controller').talk)
router.get('/getAllroles',require('../../controller/ai_controller/').getAllroles)
router.get('/getHistory',require('../../controller/ai_controller/').getHistory)
module.exports=router;