// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const makeBlankProgress = require('../utils/blankProgress');

const PROJECTS_FILE = path.join(__dirname, '../data/projects.json');
const DESCRIPTIONS_FILE = path.join(__dirname, '../data/descriptions.json');
 const PROGRESS_FILE = path.join(__dirname, '../data/progress.json');

// 工具函数
const readJSON = (file, fallback = {}) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : fallback;
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
//const getNextId = (tasks) => (tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1);
// 自动生成唯一 ID：yyyyMMdd-时间戳
const generateIdFromStart = (start) => {
  const d = new Date(start);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${Date.now()}`;
};

// GET /api/tasks - 获取所有任务
router.get('/', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE, []);
  res.json(tasks);
});

// GET /api/tasks/:id/description  - 获取单个任务详细内容
router.get('/:id/description', (req, res) => {
  const taskDescriptions = readJSON(DESCRIPTIONS_FILE, {});
  const desc = taskDescriptions[req.params.id];
  if (!desc) return res.status(404).json({ error: '描述未找到' });
  res.json({ description: desc });
});

// GET /api/tasks/:id - 获取单个任务
router.get('/:id', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE, []);
  const task = tasks.find(t => String(t.id) === req.params.id);
  if (!task) return res.status(404).json({ error: '任务未找到' });
  res.json(task);
});

// POST /api/tasks - 创建任务
router.post('/', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE, []);
  const { start } = req.body;
  if (!start) {
    return res.status(400).json({ error: '缺少 start 字段，无法生成任务 ID' });
  }
  const generatedId = generateIdFromStart(start);
  const newTask = { ...req.body, id: generatedId };
  tasks.push(newTask);
  writeJSON(PROJECTS_FILE, tasks);

  const progress = readJSON(PROGRESS_FILE, {});
  progress[generatedId] = makeBlankProgress();                
  writeJSON(PROGRESS_FILE, progress);

  res.status(201).json(newTask);
});
/*
router.post('/', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE);
  const newTask = { ...req.body, id: getNextId(tasks) };
  tasks.push(newTask);
  writeJSON(PROJECTS_FILE, tasks);
  res.status(201).json(newTask);
});
*/

// PUT /api/tasks/:id/description - 更新描述内容
router.put('/:id/description', (req, res) => {
  const descriptions = readJSON(DESCRIPTIONS_FILE, {});
  descriptions[req.params.id] = req.body.description || '';
  writeJSON(DESCRIPTIONS_FILE, descriptions);
  res.json({ id: req.params.id, description: req.body.description });
});

// PUT /api/tasks/:id - 更新任务
router.put('/:id', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE, []);
  const idx = tasks.findIndex(t => String(t.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  tasks[idx] = { ...req.body, id: req.params.id };
  writeJSON(PROJECTS_FILE, tasks);
  res.json(tasks[idx]);
});

// DELETE /api/tasks/:id - 删除任务
router.delete('/:id', (req, res) => {
  const tasks = readJSON(PROJECTS_FILE, []);
  const idx = tasks.findIndex(t => String(t.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '任务未找到' });
  const updatedTasks = tasks.filter(t => String(t.id) !== req.params.id);
  writeJSON(PROJECTS_FILE, updatedTasks);

  const descriptions = readJSON(DESCRIPTIONS_FILE, {});
  delete descriptions[req.params.id];
  writeJSON(DESCRIPTIONS_FILE, descriptions);
  
  res.status(204).end(); // 无返回内容
});

module.exports = router;