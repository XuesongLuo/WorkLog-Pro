const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = path.join(__dirname, '../data/progress.json');

// 工具函数
const readJSON = (file, fallback = {}) => {
  if (!fs.existsSync(file)) return fallback;
  try {
  // 读出来可能是 '' / 半截内容
    const txt = fs.readFileSync(file, 'utf-8').trim();
    return txt ? JSON.parse(txt) : fallback;
  } catch (e) {
    console.error('[readJSON] 解析失败 → 使用 fallback', file, e.message);
    return fallback;          // 不让整个接口 500
  }
};
function writeJSON(file, data) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, file);
}
// 深度合并
function deepMerge(oldObj, patchObj) {
  for (const [k, v] of Object.entries(patchObj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      oldObj[k] = deepMerge({ ...(oldObj[k] || {}) }, v);
    } else {
      oldObj[k] = v;
    }
  }
  return oldObj;
}


// GET /api/progress          → 表格一次性加载
router.get('/', (req, res) => {
    const byId = readJSON(PROGRESS_FILE, {});              // { id1:{…}, id2:{…} }
    const list = Object.entries(byId).map(([id, body]) => ({ id, ...body }));
    res.json(list);
  });
    
// PUT /api/progress/:id      → 行级保存
router.put('/:id', (req, res) => {
  const id   = req.params.id;
  const all  = readJSON(PROGRESS_FILE, {});      // 整张表
  const old  = all[id] || {};                    // 旧行，不存在就空对象
  // 递归合并，不会覆盖掉 pak.active 这类已存在字段
  const merged = deepMerge({ ...old }, req.body);
  all[id] = merged;
  writeJSON(PROGRESS_FILE, all);                 // 覆盖写回
  res.json(merged);  
});

module.exports = router;
  