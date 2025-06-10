// server/routes/descriptions.js
const express = require('express');
const router = express.Router();
const getMongoDb = require('../db/mongo');
const auth = require('../middleware/auth'); // 解析token的中间件

// GET /api/descriptions/:p_id - 查找描述内容
router.get('/:p_id', async (req, res) => {
  try {
    const db = await getMongoDb();
    const doc = await db.collection('project_descriptions').findOne({ p_id: req.params.p_id });
    if (!doc) return res.status(404).json({ error: '描述未找到' });
    res.json({ description: doc.description, user_id: doc.user_id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/descriptions/:p_id - 更新或新建描述（需登录）
router.put('/:p_id', auth, async (req, res) => {
  console.log("mongodb save description")
  try {
    const db = await getMongoDb();
    const { description } = req.body;
    if (description === undefined) return res.status(400).json({ error: '缺少描述内容' });
    await db.collection('project_descriptions').updateOne(
      { p_id: req.params.p_id },
      { $set: { description, user_id: req.user.id, updated_at: new Date() } },
      { upsert: true }
    );
    res.json({ message: '描述已保存', p_id: req.params.p_id, user_id: req.user.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;