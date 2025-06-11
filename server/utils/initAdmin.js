// utils/initAdmin.js
const { getMongoDb } = require('../db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function ensureAdminAccount() {
  const db = await getMongoDb();
  
  // 检查是否已有管理员
  const admin = await db.collection('users').findOne({ role: 'admin' });
  if (!admin) {
    // 没有管理员，自动创建一个
    const username = 'admin';
    const email = '422836560@qq.com';
    const password = '123456';   // 默认密码，记得后续修改

    const hash = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
        _id: uuidv4(),
        username,
        email,
        password_hash: hash,
        role: 'admin',
        status: 'active',
        created_at: new Date(),
    });

    console.log(`🌟 已自动生成管理员账号 admin / ${password}，请尽快修改密码！`);
  } else {
      console.log('✅ 管理员账号已存在，不重复生成');
  }
 
}
module.exports = ensureAdminAccount;