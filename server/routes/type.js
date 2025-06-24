// server/routes/type.js
const express = require('express');
const router = express.Router();
const getMongoDb = require('../db/mongo');
const auth = require('../middleware/auth'); // 如需鉴权，保留

// GET /api/types - 获取全部类型
router.get('/', async (req, res) => {
  try {
    const db = await getMongoDb();
    const list = await db.collection('types').find().sort({ name: 1 }).toArray();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/types - 新增类型（需登录）
router.post('/', auth, async (req, res) => {
  try {
    const db = await getMongoDb();
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: '缺少类型名称' });
    // 检查是否已存在
    const exists = await db.collection('types').findOne({ name });
    if (exists) return res.status(409).json({ error: '类型已存在' });
    const result = await db.collection('types').insertOne({ name });
    res.json({ _id: result.insertedId, name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/types/:_id - 修改类型名称（需登录）
router.put('/:_id', auth, async (req, res) => {
  try {
    const db = await getMongoDb();
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: '缺少类型名称' });
    // 检查是否有重复
    const exists = await db.collection('types').findOne({ name, _id: { $ne: req.params._id } });
    if (exists) return res.status(409).json({ error: '类型已存在' });
    await db.collection('types').updateOne(
      { _id: req.params._id },
      { $set: { name } }
    );
    res.json({ _id: req.params._id, name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/types/:_id - 删除类型（需登录）
router.delete('/:_id', auth, async (req, res) => {
  try {
    const db = await getMongoDb();
    await db.collection('types').deleteOne({ _id: req.params._id });
    res.json({ message: '类型已删除', _id: req.params._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;