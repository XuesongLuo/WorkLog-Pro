// server/routes/projects.js
const express = require('express');
const router = express.Router();
const { mysqlPool, getMongoDb } = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');


// 自动生成唯一 ID：yyyyMMdd-时间戳
const generateIdFromStart = (start) => {
    const d = new Date(start);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}-${Date.now()}`;
};


// GET /api/tasks - 获取所有项目
router.get('/', async (req, res) => {
    try {
        const db = await getMongoDb();
        const rows = await db.collection('projects').find().toArray();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// GET /api/tasks/:_id - 获取单个项目详情（p_id）
router.get('/:_id', async (req, res) => {
    try {
        const db = await getMongoDb();
        const project = await db.collection('projects').findOne({ _id: req.params._id });
        if (!project) return res.status(404).json({ error: '项目未找到' });
        res.json(project);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// POST /api/tasks - 创建项目（管理员权限）
router.post('/', auth, adminOnly, async (req, res) => {
    const { start, ...rest } = req.body;
    if (!start) return res.status(400).json({ error: '缺少 start 字段, 无法生成项目ID' });
    const _id = generateIdFromStart(start);
    try {
        const db = await getMongoDb();
        // 必填字段按你的表结构补全
        await db.collection('projects').insertOne({
            _id: _id,
            address: rest.address || null,
            city: rest.city || null,
            zipcode: rest.zipcode || null,
            year: rest.year || null,
            insurance: rest.insurance || null,
            type: rest.type || null,
            company: rest.company || null,
            referrer: rest.referrer || null,
            manager: rest.manager || null,
            start: start ? new Date(start) : null,
            end: rest.end ? new Date(rest.end) : null,
        });
        // 进度表初始化
        await db.collection('progress').insertOne({
            _id : _id,
            arol: false,
            test: false,
            pak: {
                active: false, start_date: null, pout: false, pack: false,
                estimate: {
                    send: { checked: false, amount: 0 },
                    review: { checked: false, amount: 0 },
                    agree: { checked: false, amount: 0 }
                }
            },
            wtr: {
                active: false, start_date: null, ctrc: false, demo: false, itel: false, eq: false, pick: false,
                estimate: {
                    send: { checked: false, amount: 0 },
                    review: { checked: false, amount: 0 },
                    agree: { checked: false, amount: 0 }
                }
            },
            str: {
                active: false, start_date: null, ctrc: false,
                estimate: {
                    send: { checked: false, amount: 0 },
                    review: { checked: false, amount: 0 },
                    agree: { checked: false, amount: 0 }
                }
            },
            payment: 0,
            comments: ""
        });
        // 返回新建项目内容
        const project = await db.collection('projects').findOne({ _id: _id });
        res.status(201).json(project);
    } catch (e) {

        res.status(500).json({ error: e.message });
    }
});


// PUT /api/tasks/:_id - 完全更新（管理员权限）
router.put('/:_id', auth, adminOnly, async (req, res) => {
    try {
        const db = await getMongoDb();
        // 这里只做全字段更新（一般业务可先查再改，也可直接update）
        const { address, city, zipcode, year, insurance, type, company, referrer, manager, start, end } = req.body;
        const result = await db.collection('projects').updateOne(
            { _id: req.params._id },
            { $set: { address, city, zipcode, year, insurance, type, company, referrer, manager, start, end } }
        );
        if (!result.matchedCount) return res.status(404).json({ error: '项目未找到' });
        const project = await db.collection('projects').findOne({ _id: req.params._id });
        res.json(project);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// PATCH /api/tasks/:_id - 部分字段更新（管理员权限）
router.patch('/:_id', auth, adminOnly, async (req, res) => {
    try {
        const db = await getMongoDb();
        // 只更新传入的字段
        const updateFields = { ...req.body };
        //const fields = Object.keys(req.body);
        const result = await db.collection('projects').updateOne(
            { _id: req.params._id },
            { $set: updateFields }
        );
        if (!result.matchedCount) return res.status(404).json({ error: '项目未找到' });
        const project = await db.collection('projects').findOne({ _id: req.params._id });
        res.json(project);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// DELETE /api/tasks/:_id - 删除项目（管理员权限）
router.delete('/:_id', auth, adminOnly, async (req, res) => {
    try {
        const db = await getMongoDb();
        // 1. 删除项目主表
        const result = await db.collection('projects').deleteOne({ _id: req.params._id });
        // 2. 删除进度表相关行
        await db.collection('progress').deleteOne({ _id: req.params._id });
         // 3. 删除描述表相关行
        await db.collection('descriptions').deleteOne({ _id: req.params._id });
        if (!result.deletedCount) {
            return res.status(404).json({ error: '项目未找到' });
        } 
        res.status(204).end();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;