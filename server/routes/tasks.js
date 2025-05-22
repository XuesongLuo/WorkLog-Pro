// server/routes/tasks.js
const express = require('express');
const router = express.Router();


// 每次读取都从 JSON 文件中读取，修改时也写回文件
const fs = require('fs');
const path = require('path');
const TASKS_FILE = path.join(__dirname, '../data/tasks.json');
const DESCRIPTIONS_FILE = path.join(__dirname, '../data/descriptions.json');

// 工具函数
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');

const getNextId = (tasks) => (tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1);

/*
const {mockTasks, mockTaskDescriptions} = require('../data/mockData'); // 引入 mock 数据
let tasks = [...mockTasks]; // 作为初始数据使用
let taskDescriptions = {...mockTaskDescriptions};

// 自动生成 ID
const getNextId = () => (tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1);
*/

// GET /api/tasks - 获取所有任务
router.get('/', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  res.json(tasks);
});


// GET /api/tasks/:id/description  - 获取单个任务详细内容
router.get('/:id/description', (req, res) => {
  const taskDescriptions = readJSON(DESCRIPTIONS_FILE);
  const desc = taskDescriptions[req.params.id];
  if (!desc) return res.status(404).json({ error: '描述未找到' });
  res.json({ description: desc });
});


// GET /api/tasks/:id - 获取单个任务
router.get('/:id', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: '任务未找到' });
  res.json(task);
});



// POST /api/tasks - 创建任务
router.post('/', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const newTask = { ...req.body, id: getNextId(tasks) };
  tasks.push(newTask);
  writeJSON(TASKS_FILE, tasks);
  res.status(201).json(newTask);
});


// PUT /api/tasks/:id/description - 更新描述内容
router.put('/:id/description', (req, res) => {
  const descriptions = readJSON(DESCRIPTIONS_FILE);
  descriptions[req.params.id] = req.body.description || '';
  writeJSON(DESCRIPTIONS_FILE, descriptions);
  res.json({ id: req.params.id, description: req.body.description });
});

// PUT /api/tasks/:id - 更新任务
router.put('/:id', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  tasks[idx] = { ...req.body, id: parseInt(req.params.id) };
  writeJSON(TASKS_FILE, tasks);
  res.json(tasks[idx]);
});



// DELETE /api/tasks/:id - 删除任务
router.delete('/:id', (req, res) => {
  const tasks = readJSON(TASKS_FILE);
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  const updatedTasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  writeJSON(TASKS_FILE, updatedTasks);

  const descriptions = readJSON(DESCRIPTIONS_FILE);
  delete descriptions[req.params.id];
  writeJSON(DESCRIPTIONS_FILE, descriptions);
  
  res.status(204).end(); // 无返回内容
});

module.exports = router;