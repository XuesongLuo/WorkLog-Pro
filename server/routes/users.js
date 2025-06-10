// server/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); // 可选
const { mysqlPool } = require('../db');


// 建议用环境变量配置
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';


// 1. 登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [[user]] = await mysqlPool.query('SELECT * FROM users WHERE username=?', [username]);
    if (!user) return res.status(401).json({ message: '用户不存在' });
    if (user.status !== 'active') return res.status(403).json({ message: '账号未通过审核' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: '密码错误' });
    // 生成token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});


// 2. 用户注册（待审核）
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: '缺少信息' });
    // 检查重复
    const [exists] = await mysqlPool.query('SELECT 1 FROM users WHERE username=? OR email=?', [username, email]);
    if (exists.length) return res.status(409).json({ message: '用户名或邮箱已存在' });
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    await mysqlPool.query('INSERT INTO users (id, username, email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [id, username, email, hash, 'user', 'pending']);
    res.json({ message: '注册成功，请等待管理员审核' });
});
  
// 3. 管理员审核用户列表
router.get('/users', async (req, res) => {
    if (req.query.status === 'pending') {
        const [rows] = await mysqlPool.query('SELECT id, username, email FROM users WHERE status=?', ['pending']);
        res.json(rows);
    } else {
        res.status(400).json({ message: '仅支持status=pending' });
    }
});
  
// 4. 审核通过/拒绝
router.patch('/users/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!['active', 'rejected'].includes(status)) return res.status(400).json({ message: '无效状态' });
    await mysqlPool.query('UPDATE users SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: '操作成功' });
});
  


module.exports = router;