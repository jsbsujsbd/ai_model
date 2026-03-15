// 1. 必须直接从官方库导入 mongoose
import mongoose from 'mongoose'; 

// 2. 如果你需要确保数据库已连接，可以引入你的连接文件（可选）
import '../db/mogDb/index.js'; 

// 3. 使用导入的 mongoose 来创建 Schema
const aiRoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  systemPrompt: String,
  userId: { type: String, required: true },
  profile: {
    age: String,
    sex: String,
    role: String,
    character: String
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); // 建议加上这个，会自动生成上次说过的 updatedAt

export const AiRole = mongoose.model('AiRole', aiRoleSchema);