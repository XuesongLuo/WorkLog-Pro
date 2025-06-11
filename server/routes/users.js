// server/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); // 可选
const { mysqlPool, getMongoDb } = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');


// 建议用环境变量配置
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';


// 1. 登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ username });
    //const [[user]] = await mysqlPool.query('SELECT * FROM users WHERE username=?', [username]);
    if (!user) return res.status(401).json({ message: '用户不存在' });
    if (user.status !== 'active') return res.status(403).json({ message: '账号未通过审核' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: '密码错误' });
    // 生成token
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});


// 2. 用户注册（待审核）
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: '缺少信息' });
    // 检查重复
    const db = await getMongoDb();
    const exists = await db.collection('users').findOne({ $or: [ { username }, { email } ] });
    if (exists.length) return res.status(409).json({ message: '用户名或邮箱已存在' });
    const id = uuidv4();
    const hash = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({
        _id: id,
        username,
        email,
        password_hash: hash,
        role: 'user',
        status: 'pending',
        created_at: new Date()
    });
    res.json({ message: '注册成功，请等待管理员审核' });
});
  
// 3. 获取待审核用户列表
router.get('/users', auth, adminOnly, async (req, res) => {
    if (req.query.status === 'pending') {
        const db = await getMongoDb();
        const users = await db.collection('users').find({ status: 'pending' }).project({ _id: 1, username: 1, email: 1 }).toArray();
        res.json(users.map(u => ({ id: u._id, username: u.username, email: u.email })));
    } else {
        res.status(400).json({ message: '仅支持status=pending' });
    }
});
  
// 4. 审核通过/拒绝
router.patch('/users/:_id/status', auth, adminOnly, async (req, res) => {
    const { status } = req.body;
    if (!['active', 'rejected'].includes(status)) return res.status(400).json({ message: '无效状态' });
    const db = await getMongoDb();
    await db.collection('users').updateOne({ _id: req.params._id }, { $set: { status } });
    res.json({ message: '操作成功' });
});
  


module.exports = router;