// src/pages/Home.jsx
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton,
  Box, Button, Stack, Select, MenuItem,
  Grid, Container, Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useNavigate } from 'react-router-dom';

import TaskList from '../components/TaskList'; 
import CalendarView from '../components/CalendarView';
import TaskDetail from '../components/TaskDetail';
import CreateOrEditTask from '../components/CreateOrEditTask';


import { useTasks } from '../context/TaskContext';

export default function Home() {
  const { tasks } = useTasks();
  const [lang, setLang] = useState('zh');
  const [selectedTask, setSelectedTask] = useState(null); // null / {id} / {id:'new'} / {id:x,mode:'edit'}
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const navigate = useNavigate();

  // 顶部语言切换
  const handleLangChange = (e) => setLang(e.target.value);

  // “新增任务”——用虚拟 id 标记
  const handleNewTask = () => setSelectedTask({ id: 'new' });

  // 视图切换
  const toggleView = () =>
    setViewMode(prev => (prev === 'calendar' ? 'list' : 'calendar'));


  /* --------------------- 组件渲染 --------------------- */
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WorkLog Pro
          </Typography>

          <Select
            value={lang}
            onChange={handleLangChange}
            size="small"
            variant="standard"
            sx={{ color: '#fff', borderBottom: '1px solid white' }}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>

      {/* 主体 */}
      <Container
        maxWidth="lg"
        disableGutters
        sx={{ py: 3, height: 'calc(100vh - 64px)', overflowX: 'hidden', }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            height: '100%',
            width: '100%',
            alignItems: 'flex-start',
            justifyContent: selectedTask ? 'space-between' : 'center',
            flexWrap: 'nowrap',
          }}
        >
          {/* 日历或列表 列 */}
          <Grid
            //xs={12}
            //md={selectedTask ? 6 : 10}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              mx: { md: selectedTask ? 0 : 'auto' },
              width: selectedTask ? '50%' : '100%', // 明确指定宽度
              maxWidth: selectedTask ? '50%' : '100%', // 在未选择任务时允许更大的宽度
              flexBasis: selectedTask ? '50%' : '100%', // 设置flex基础大小
              pl: selectedTask ? 0 : 2, // 左侧间距
              pr: selectedTask ? 0 : 2, // 右侧间距
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Button
                  variant="outlined"
                  startIcon={viewMode === 'calendar' ? <ViewListIcon /> : <CalendarMonthIcon />}
                  onClick={toggleView}
                >
                  {viewMode === 'calendar' ? '列表视图' : '日历视图'}
              </Button>
              <Typography variant="h5">
                {viewMode === 'calendar' ? '项目--日历' : '项目--列表'}
              </Typography>
              

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => setSelectedTask(null)}>
                  返回首页
                </Button>
                <Button variant="contained" color="secondary" onClick={handleNewTask}>
                  新增任务
                </Button>
              </Stack>
            </Stack>
            {viewMode === 'calendar' ? (
              <CalendarView
                events={tasks}
                style={{ height: '80vh', width: '100%' }}
                onSelectEvent={(event) => setSelectedTask(event)}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onSelectTask={(task) => setSelectedTask(task)}
                sx={{ height: '80vh' }}
              />
            )}
          </Grid>

          {/* 右侧面板：详情 / 新建 / 编辑 */}
          {selectedTask && (
            <Grid
              //xs={12}
              //md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                maxWidth: '50%',
                flexBasis: '50%', // 重要：设置flex基础大小
                transition: 'all 0.3s ease',
                borderLeft: { md: '1px solid #ddd' },
                height: '80vh',
                pl: { md: 2 },
                overflow: 'hidden',
              }}
            >
              <Fade in>
              <Box sx={{ width: '100%', height: '100%', overflow: 'auto', }}>
                {/* Fade 里的直接子元素必须是能接收 ref 的 DOM；TaskPane.forwardRef 已满足 */}
                {selectedTask.id === 'new' ? (
                  <CreateOrEditTask
                    key="new"
                    embedded
                    onClose={() => setSelectedTask(null)}
                  />
                ) : selectedTask.mode === 'edit' ? (
                  <CreateOrEditTask
                    key={selectedTask.id}   // ← id 变化时强制重建组件
                    embedded
                    id={selectedTask.id}
                    onClose={() => setSelectedTask(null)}
                  />
                ) : (
                  <TaskDetail
                    id={selectedTask.id}
                    embedded
                    // 在 TaskDetail 内点击“编辑”时把 mode 带回
                    onClose={(payload) => setSelectedTask(payload || null)}
                  />
                )}
                </Box>
              </Fade>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
