// src/pages/Home.jsx
import React from 'react';
import { useEffect, useState, useMemo } from 'react';
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

import { useDebounce } from '../hooks/useDebounce';
import useTaskDetailState from '../hooks/useTaskDetailState';


const SlideContent = React.memo(
  ({ selectedTask, handleTaskClose }) => (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {selectedTask?.mode === 'edit' && (
        <CreateOrEditTask
          key={selectedTask?.id ?? 'new'}
          embedded
          id={selectedTask?.id}
          task={selectedTask}
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
  ),
  (prevProps, nextProps) =>
    prevProps.selectedTask?.id === nextProps.selectedTask?.id &&
    prevProps.selectedTask?.mode === nextProps.selectedTask?.mode &&
    prevProps.handleTaskClose === nextProps.handleTaskClose
);

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [lang, setLang] = useState('zh');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const navigate = useNavigate();

  const fetchTasks = () => {
    api.getTasks()
      .then(data => setTasks(data))
      .catch(err => console.error('获取任务失败:', err));
  };
  const {
    selectedTask,
    showDetail,
    openTaskDetail,
    openTaskEdit,
    openTaskCreate,
    handleTaskClose
  } = useTaskDetailState(fetchTasks);

  const debouncedTaskClose = useDebounce(handleTaskClose, 100);   // 包装防抖版本的 handleTaskClose

  // 使用 useMemo 优化计算
  const gridStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.5s ease',
    flexGrow: 1,
    width: showDetail ? '50%' : '100%',
    maxWidth: showDetail ? '50%' : '100%',
    flexBasis: showDetail ? '50%' : '100%',
    pl: 1,
    pr: 1,
    ml: showDetail ? 0 : 'auto',
    mr: showDetail ? 0 : 'auto',
    height: '100%',
  }), [showDetail]);

  const rightPanelStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: showDetail ? 1 : 0,
    width: showDetail ? '50%' : 0,
    maxWidth: showDetail ? '50%' : 0,
    flexBasis: showDetail ? '50%' : 0,
    transition: 'all 0.5s ease',
    opacity: showDetail ? 1 : 0,
    pl: showDetail ? 2 : 0,
    borderLeft: showDetail ? '1px solid #ddd' : 'none',
    height: '100%',
    overflow: 'hidden',
  }), [showDetail]);


  // 从后端加载任务列表
  useEffect(() => {
    api.getTasks()
      .then(data => setTasks(data))
      .catch(err => console.error('获取任务失败:', err));
  }, []);

  // 卸载行为延迟进行
  const DelayedUnmount = ({ show, children }) => {
    const [render, setRender] = useState(show);
    useEffect(() => {
      if (show) setRender(true);
      else {
        const id = setTimeout(() => setRender(false), 500); // 等动画完成
        return () => clearTimeout(id);
      }
    }, [show]);
    return render ? children : null;
  };

  // 语言切换
  const handleLangChange = (e) => setLang(e.target.value);
  // 视图切换
  const toggleView = () =>
    setViewMode(prev => (prev === 'calendar' ? 'list' : 'calendar'));
  
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
          <Grid sx={gridStyles}>
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
                <Button variant="outlined" onClick={debouncedTaskClose}>
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
          <Grid sx={rightPanelStyles}>
            <Slide direction="left" in={!!selectedTask} mountOnEnter unmountOnExit>
              <div>
                <DelayedUnmount show={!!selectedTask}>
                  <SlideContent
                    selectedTask={selectedTask}
                    handleTaskClose={debouncedTaskClose}
                  />
                </DelayedUnmount>
              </div>
                {/* Fade 里的直接子元素必须是能接收 ref 的 DOM；TaskPane.forwardRef 已满足 
                <Box sx={{ width: '100%', height: '100%', overflow: 'auto', }}>
                  
                  {selectedTask?.mode === 'edit' && (
                    <CreateOrEditTask
                      key={selectedTask?.id ?? 'new'}
                      embedded
                      id={selectedTask?.id}
                      task={selectedTask}
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
                */}
              </Slide>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
