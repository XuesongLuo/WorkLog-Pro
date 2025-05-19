// server/routes/tasks.js
const express = require('express');
const router = express.Router();


const mockTasks = require('../mockData'); // ✅ 引入 mock 数据
let tasks = [...mockTasks]; // ✅ 作为初始数据使用

// 自动生成 ID
const getNextId = () => (tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1);

// GET /api/tasks - 获取所有任务
router.get('/', (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id - 获取单个任务
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: '任务未找到' });
  res.json(task);
});

// POST /api/tasks - 创建任务
router.post('/', (req, res) => {
  const newTask = { ...req.body, id: getNextId() };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - 更新任务
router.put('/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  tasks[idx] = { ...req.body, id: parseInt(req.params.id) };
  res.json(tasks[idx]);
});

// DELETE /api/tasks/:id - 删除任务
router.delete('/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  tasks.splice(idx, 1);
  res.status(204).end(); // 无返回内容
});

module.exports = router;