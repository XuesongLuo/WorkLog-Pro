const express = require('express');
const router = express.Router();
const { mysqlPool, getMongoDb } = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');


function flattenForSet(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenForSet(val, prefix ? `${prefix}.${key}` : key));
    } else {
      acc[prefix ? `${prefix}.${key}` : key] = val;
    }
    return acc;
  }, {});
}


// GET /api/progress?page=1&pageSize=20
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const db = await getMongoDb();
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '100');
    const skip = (page - 1) * pageSize;
    // 查主表
    const projects = await db.collection('projects').find().toArray();
    const projectMap = Object.fromEntries(projects.map(p => [p._id, p]));
    // 查进度表分页
    const progressRows = await db.collection('progress')
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const total = await db.collection('progress').countDocuments();
    const progressArray = progressRows.map(progress => {
      const project = projectMap[progress._id] || {};
      const location = [project.address, project.city, project.state, project.zipcode].filter(Boolean).join(', ');
      return {
        ...progress,
        location,
        year: project.year,
        insurance: project.insurance,
      };
    });
    res.json({ data: progressArray, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/progress  → 表格一次性加载（管理员可访问）
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const db = await getMongoDb();
    // 查主表项目数据
    const projects = await db.collection('projects').find().toArray();
    const projectMap = Object.fromEntries(projects.map(p => [p._id, p]));
    // 查进度表
    const progressRows = await db.collection('progress').find().toArray();
    // 合并：为每一行进度加 location/year/insurance 字段
    const progressArray = progressRows.map(progress => {
      const project = projectMap[progress._id] || {};
      const location = [project.address, project.city, project.state, project.zipcode].filter(Boolean).join(', ');
      return {
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


router.patch('/:_id', auth, adminOnly, async (req, res) => {
  const _id = req.params._id;
  const updateFields = { ...req.body };
  if (!Object.keys(updateFields).length)
    return res.status(400).json({ error: '无可更新字段' });
  try {
    const db = await getMongoDb();
    // --- 关键：扁平化传入字段 ---
    const setFields = flattenForSet(updateFields);
    // 只更新传入的字段（可嵌套）
    const result = await db.collection('progress').updateOne({ _id }, { $set: setFields });
    if (!result.matchedCount)
      return res.status(404).json({ error: '进度行不存在，无法修改' });
    const row = await db.collection('progress').findOne({ _id });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/*
// PUT /api/progress/:_id  → 行级保存（仅管理员可用，禁止自动插入新行）
router.put('/:_id', auth, adminOnly, async (req, res) => {
  const _id = req.params._id;
  const updateFields = { ...req.body };
  //const fields = Object.keys(req.body);
  if (!Object.keys(updateFields).length) return res.status(400).json({ error: '无可更新字段' });
  //if (!fields.length) return res.status(400).json({ error: '无可更新字段' });
  try {
    const db = await getMongoDb();
    // 先查当前进度（判断是否存在）
    const result = await db.collection('progress').updateOne({ _id }, { $set: updateFields });

    if (!result.matchedCount) return res.status(404).json({ error: '进度行不存在，无法修改' });
    // 存在则更新
    const row = await db.collection('progress').findOne({ _id });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
*/


module.exports = router;