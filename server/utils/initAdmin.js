// utils/initAdmin.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function ensureAdminAccount() {

    const uuid = require('crypto').randomUUID();

    const connection = await mysql.createConnection({
      host:     process.env.MYSQL_HOST,
      user:     process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
  
    // 查询是否已有管理员
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE role = 'admin' LIMIT 1"
    );
  
    if (rows.length === 0) {
      // 没有管理员，创建一个
      const username = 'admin';
      const email = 'admin@example.com';
      const password = '123456';           // 默认密码，可自定义
  
      const password_hash = await bcrypt.hash(password, 10);
  
      await connection.execute(
        "INSERT INTO users (id, username, email, password_hash, role, status) VALUES (?, ?, ?, ?, 'admin', 'active')",
        [uuid, username, email, password_hash]
      );
  
      console.log(`🌟 已自动生成管理员账号 admin / ${password}，请尽快修改密码！`);
    } else {
      console.log('✅ 管理员账号已存在，不重复生成');
    }
  
    await connection.end();
  }

  module.exports = ensureAdminAccount;