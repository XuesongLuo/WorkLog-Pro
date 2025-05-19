// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 路由挂载
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('WorkLog-Pro 后端已启动。');
});

app.listen(PORT, () => {
  console.log(`🚀 后端运行中： http://localhost:${PORT}`);
});
