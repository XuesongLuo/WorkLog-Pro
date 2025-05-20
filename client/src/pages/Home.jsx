// src/pages/Home.jsx
import { useState } from 'react';
import { Typography, Box, Button, Stack, Grid, Container, Slide} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useNavigate } from 'react-router-dom';

import TopAppBar from '../components/TopAppBar';
import TaskList from '../components/TaskList'; 
import CalendarView from '../components/CalendarView';
import TaskDetail from '../components/TaskDetail';
import CreateOrEditTask from '../components/CreateOrEditTask';
import { api } from '../api/tasks';
import { useEffect } from 'react';

import useTaskDetailState from '../hooks/useTaskDetailState';


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [lang, setLang] = useState('zh');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const navigate = useNavigate();

  // 从后端加载任务列表
  useEffect(() => {
    api.getTasks()
      .then(data => setTasks(data))
      .catch(err => console.error('获取任务失败:', err));
  }, []);

  // 语言切换
  const handleLangChange = (e) => setLang(e.target.value);
  // 视图切换
  const toggleView = () =>
    setViewMode(prev => (prev === 'calendar' ? 'list' : 'calendar'));

  /*
  const [selectedTask, setSelectedTask] = useState(null); // null / {id} / {id:'new'} / {id:x,mode:'edit'}
  // 控制“是否展示 TaskDetail”的变量
  const [showDetail, setShowDetail] = useState(false);
  // 设置任务
  const handleSelectTask = (task) => {
    setShowDetail(true);          // 日历滑到左边
    setSelectedTask(task);        // 右侧详情出现
  };
  // 关闭任务面板
  const handleCloseTask = () => {
    setShowDetail(false);         // 日历滑回来
    setTimeout(() => setSelectedTask(null), 200); // 延迟卸载右侧面板
  };
  */
  const {
    selectedTask,
    showDetail,
    openTaskDetail,
    openTaskEdit,
    openTaskCreate,
    handleTaskClose
  } = useTaskDetailState();
  
  /* --------------------- 组件渲染 --------------------- */
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <TopAppBar /> 

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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.5s ease',
              flexGrow: 1,
              width: showDetail ? '50%' : '100%', // 明确指定宽度
              maxWidth: showDetail ? '50%' : '100%', // 在未选择任务时允许更大的宽度
              flexBasis: showDetail ? '50%' : '100%', // 设置flex基础大小
              pl: 1, // 左侧间距
              pr: 1, // 右侧间距
              ml: showDetail ? 0 : 'auto',
              mr: showDetail ? 0 : 'auto',
              height: '100%',
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
                <Button variant="outlined" onClick={/*handleCloseTask*/handleTaskClose}>
                  返回首页
                </Button>
                <Button variant="contained" color="secondary" /*onClick={() => handleSelectTask({ id: 'new' })}*/ onClick={openTaskCreate}>
                  新增任务
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/excel')}
                >
                  打开 Excel 编辑器
                </Button>
                
              </Stack>
            </Stack>
            {viewMode === 'calendar' ? (
              <CalendarView
                events={tasks}
                style={{ height: '100%', width: '100%' }}
                //onSelectEvent={(event) => handleSelectTask(event)}
                onSelectEvent={(event) => openTaskDetail(event.id)}
              />
            ) : (
              <TaskList
                tasks={tasks}
                //onSelectTask={(task) => handleSelectTask(task)}
                onSelectEvent={(task) => openTaskDetail(task.id)}
                sx={{ height: '100%' }}
              />
            )}
          </Grid>


          {/* 右侧面板：详情 / 新建 / 编辑 */}
          <Grid
              sx={{
                display: 'flex',         // ⚠️ 保留容器
                flexDirection: 'column',
                flexGrow: showDetail ? 1 : 0,
                width: showDetail ? '50%' : 0,                  // ⚠️ 动画收缩
                maxWidth: showDetail ? '50%' : 0,
                flexBasis: showDetail ? '50%' : 0,
                transition: 'all 0.5s ease',                      // ⚠️ 动画
                opacity: showDetail ? 1 : 0,   
                pl: showDetail ? 2 : 0,
                borderLeft: showDetail ? '1px solid #ddd' : 'none',
                
                height: '100%', 
                //height: '80vh',
                overflow: 'hidden',
              }}
            >
              <Slide direction="left" in={!!selectedTask} mountOnEnter unmountOnExit>
              <Box sx={{ width: '100%', height: '100%', overflow: 'auto', }}>
                {/* Fade 里的直接子元素必须是能接收 ref 的 DOM；TaskPane.forwardRef 已满足 */}
                {/*
                {selectedTask?.id === 'new' ? (
                  <CreateOrEditTask
                    key="new"
                    embedded
                    onClose={
                      //handleCloseTask
                      handleTaskClose
                    }
                  />
                ) : selectedTask?.mode === 'edit' ? (
                  <CreateOrEditTask
                    key={selectedTask.id}   // ← id 变化时强制重建组件
                    embedded
                    id={selectedTask.id}
                    onClose={
                      //handleCloseTask
                      handleTaskClose
                    }
                  />
                ) : selectedTask ? (
                  <TaskDetail
                    id={selectedTask.id}
                    embedded
                    // 在 TaskDetail 内点击“编辑”时把 mode 带回
                    onClose={
                      
                      (payload) => {
                      if (payload) {
                        setSelectedTask(payload);
                      } else {
                        handleCloseTask();  // 点击“退出”
                      }
                    }
                     
                    handleTaskClose}
                  />
                ): null}
                */}
                {selectedTask?.mode === 'edit' && (
                  <CreateOrEditTask
                    key={selectedTask?.id ?? 'new'}
                    embedded
                    id={selectedTask?.id}
                    onClose={handleTaskClose}
                  />
                )}

                {selectedTask?.mode === 'view' && (
                  <TaskDetail
                    id={selectedTask.id}
                    embedded
                    onClose={handleTaskClose}
                  />
                )}
                </Box>
              </Slide>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
