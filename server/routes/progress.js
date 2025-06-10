const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');



// GET /api/progress  → 表格一次性加载（管理员可访问）
router.get('/', auth, adminOnly, async (req, res) => {
    try {
      // 查主表项目数据
      const [projects] = await mysqlPool.query('SELECT * FROM projects');
      // 查进度表
      const [progressRows] = await mysqlPool.query('SELECT * FROM project_progress');
      // 组装返回
      const progressArray = progressRows.map(progress => {
        const project = projects.find(proj => proj.p_id === progress.p_id) || {};
        const location = [project.address, project.city, project.zipcode].filter(Boolean).join(', ');
        return {
          p_id: progress.p_id,
          ...progress,
          location,
          year: project.year,
          insurance: project.insurance,
        };
      });
      res.json(progressArray);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  

// PUT /api/progress/:p_id  → 行级保存（仅管理员可用，禁止自动插入新行）
router.put('/:p_id', auth, adminOnly, async (req, res) => {
    const p_id = req.params.p_id;
    const fields = Object.keys(req.body);
    if (!fields.length) return res.status(400).json({ error: '无可更新字段' });
  
    const setSql = fields.map(f => `${f}=?`).join(', ');
    const values = fields.map(f => req.body[f]);
    values.push(p_id);
  
    try {
      // 先查当前进度（判断是否存在）
      const [rows] = await mysqlPool.query('SELECT * FROM project_progress WHERE p_id=?', [p_id]);
      if (!rows.length) {
        // 不存在则返回404，不插入新行
        return res.status(404).json({ error: '进度行不存在，无法修改' });
      }
      // 存在则更新
      await mysqlPool.query(
        `UPDATE progress SET ${setSql} WHERE p_id=?`, values
      );
      const [[row]] = await mysqlPool.query('SELECT * FROM project_progress WHERE p_id=?', [p_id]);
      res.json(row);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  module.exports = router;