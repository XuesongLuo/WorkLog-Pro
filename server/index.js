// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const descriptionRoutes = require('./routes/descriptions');
const progressRoutes = require('./routes/progress');
const typeRoutes = require('./routes/type');

const ensureAdminAccount = require('./utils/initAdmin');

const app = express();
const PORT = process.env.SERVER_PORT || 4399;

app.use(cors());
app.use(express.json());

// 路由挂载
app.use('/api', userRoutes); 
app.use('/api/tasks', projectRoutes);
app.use('/api/descriptions', descriptionRoutes);
app.use('/api/progress', progressRoutes); 
app.use('/api/types', typeRoutes); 

app.get('/', (req, res) => {
  res.send('WorkLog Server start!');
});

ensureAdminAccount()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('启动时检测/生成管理员账号失败:', err);
    process.exit(1); // 启动失败直接退出
  });