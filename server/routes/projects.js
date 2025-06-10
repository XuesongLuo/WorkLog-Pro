// server/routes/projects.js
const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../db');
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
        const [rows] = await mysqlPool.query('SELECT * FROM projects');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// GET /api/tasks/:p_id - 获取单个项目详情（p_id）
router.get('/:p_id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM projects WHERE p_id=?', [req.params.p_id]);
        if (!rows.length) return res.status(404).json({ error: '项目未找到' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// POST /api/tasks - 创建项目（管理员权限）
router.post('/', auth, adminOnly, async (req, res) => {
    const { start, ...rest } = req.body;
    if (!start) return res.status(400).json({ error: '缺少 start 字段, 无法生成项目ID' });
    const p_id = generateIdFromStart(start);
    const conn = await mysqlPool.getConnection();
    try {
        await conn.beginTransaction();
        // 必填字段按你的表结构补全
        await mysqlPool.query(
            `INSERT INTO projects 
            (p_id, address, city, zipcode, year, insurance, type, company, referrer, manager, start, end) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                p_id,
                rest.address || null, rest.city || null, rest.zipcode || null, rest.year || null, rest.insurance || null,
                rest.type || null, rest.company || null, rest.referrer || null, rest.manager || null,
                start || null, rest.end || null
            ]
        );
        // 2. 初始化进度
        await conn.query(`
          INSERT INTO project_progress (
            p_id, arol, test,
            pak_active, pak_start_date, pak_pout, pak_pack, pak_estimate_send, pak_estimate_send_amount, pak_estimate_review, pak_estimate_review_amount, pak_estimate_agree, pak_estimate_agree_amount,
            wtr_active, wtr_start_date, wtr_ctrc, wtr_demo, wtr_itel, wtr_eq, wtr_pick, wtr_estimate_send, wtr_estimate_send_amount, wtr_estimate_review, wtr_estimate_review_amount, wtr_estimate_agree, wtr_estimate_agree_amount,
            str_active, str_start_date, str_ctrc, str_estimate_send, str_estimate_send_amount, str_estimate_review, str_estimate_review_amount, str_estimate_agree, str_estimate_agree_amount,
            payment, comments
          ) VALUES (
            ?, false, false,
            false, null, false, false, false, 0, false, 0, false, 0,
            false, null, false, false, false, false, false, false, 0, false, 0, false, 0,
            false, null, false, false, 0, false, 0, false, 0,
            0, ''
          )
        `, [p_id]);
        await conn.commit();

        // 返回新建项目内容
        const [rows] = await mysqlPool.query('SELECT * FROM projects WHERE p_id=?', [p_id]);
        res.status(201).json(rows[0]);
    } catch (e) {
        console.error(e);
        await conn.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        conn.release();
    }
});


// PUT /api/tasks/:p_id - 完全更新（管理员权限）
router.put('/:p_id', auth, adminOnly, async (req, res) => {
    try {
        // 这里只做全字段更新（一般业务可先查再改，也可直接update）
        const { address, city, zipcode, year, insurance, type, company, referrer, manager, start, end } = req.body;
        const [result] = await mysqlPool.query(
            `UPDATE projects SET address=?, city=?, zipcode=?, year=?, insurance=?, type=?, company=?, referrer=?, manager=?, start=?, end=? WHERE p_id=?`,
            [address, city, zipcode, year, insurance, type, company, referrer, manager, start, end, req.params.p_id]
        );
        if (!result.affectedRows) return res.status(404).json({ error: '项目未找到' });
        const [rows] = await mysqlPool.query('SELECT * FROM projects WHERE p_id=?', [req.params.p_id]);
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// PATCH /api/tasks/:p_id - 部分字段更新（管理员权限）
router.patch('/:p_id', auth, adminOnly, async (req, res) => {
    try {
        // 只更新传入的字段
        const fields = Object.keys(req.body);
        if (!fields.length) return res.status(400).json({ error: '无字段可更新' });
        const setSql = fields.map(f => `${f}=?`).join(', ');
        const params = fields.map(f => req.body[f]).concat(req.params.p_id);
        const [result] = await mysqlPool.query(`UPDATE projects SET ${setSql} WHERE p_id=?`, params);
        if (!result.affectedRows) return res.status(404).json({ error: '项目未找到' });
        const [rows] = await mysqlPool.query('SELECT * FROM projects WHERE p_id=?', [req.params.p_id]);
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// DELETE /api/tasks/:p_id - 删除项目（管理员权限）
router.delete('/:p_id', auth, adminOnly, async (req, res) => {
    try {
        const [result] = await mysqlPool.query('DELETE FROM projects WHERE p_id=?', [req.params.p_id]);
        if (!result.affectedRows) return res.status(404).json({ error: '项目未找到' });
        res.status(204).end();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;