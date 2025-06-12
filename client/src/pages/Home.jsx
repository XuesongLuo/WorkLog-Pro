// src/pages/Home.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Stack, Grid, Container, Slide} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import TopAppBar from '../components/TopAppBar';
import TaskList from '../components/TaskList'; 
import CalendarView from '../components/CalendarView';
import TaskDetail from '../components/TaskDetail';
import CreateOrEditTask from '../components/CreateOrEditTask';
import { useDebounce }  from '../hooks/useDebounce';
import useTaskDetailState from '../hooks/useTaskDetailState';
import { useTasks } from '../contexts/TaskStore'; 


const SlideContent = React.memo(
  ({ selectedTask, handleTaskClose }) => (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {selectedTask?.mode === 'edit' && (
        <CreateOrEditTask
          key={selectedTask?._id ? selectedTask._id : 'new'}
          embedded
          _id={selectedTask?._id}
          task={selectedTask}
          onClose={handleTaskClose}
        />
      )}
      {selectedTask?.mode === 'view' && (
        <TaskDetail
          _id={selectedTask._id}
          embedded
          onClose={handleTaskClose}
        />
      )}
    </Box>
  ),
  (prevProps, nextProps) =>
    prevProps.selectedTask?._id === nextProps.selectedTask?._id &&
    prevProps.selectedTask?.mode === nextProps.selectedTask?.mode &&
    prevProps.handleTaskClose === nextProps.handleTaskClose
);

const useNormalizedEvents = (tasks) => useMemo(() => {
  return tasks.map(t => ({
    ...t,
    id   : t._id,
    start: t.start instanceof Date ? t.start : new Date(t.start),
    end  : t.end   instanceof Date ? t.end   : new Date(t.end),
    title: `${t.address ?? ''}, ${t.city ?? ''}, ${t.state ?? ''}, ${t.zipcode ?? ''}`,
  }));
}, [tasks]);

export default function Home() {
  const { tasks, api } = useTasks(); 
  const events = useNormalizedEvents(tasks);
  const [lang, setLang] = useState('zh');
  const [viewMode, setViewMode] = useState('list'); // 'calendar' | 'list'
  const navigate = useNavigate();

  const {
    selectedTask,
    showDetail,
    openTaskDetail,
    openTaskEdit,
    openTaskCreate,
    handleTaskClose,
    setSelectedTask
  } = useTaskDetailState(() => api.load());

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

  const [afterClose, setAfterClose] = useState(null);
  const debouncedTaskClose = useDebounce(handleTaskClose, 100);   // 包装防抖版本的 handleTaskClose

  const handleSlideClose = (payload) => {
    /* ① 编辑：直接切换，不收起面板 */
    if (payload && typeof payload === 'object' && payload.mode === 'edit') {
      openTaskEdit(payload._id, payload.task);   // 来自 useTaskDetailState
      return;                                   // 提前退出
    }
    /* ② 其它情况：先收起面板 */
    debouncedTaskClose();
    // 关键：确保 always 触发 Slide 收起
    setSelectedTask(null);
    /* ②-b 删除 → 真删 */
    if (typeof payload === 'function') {
      //setTimeout(payload, ANIM_MS);
      setAfterClose(() => payload);
    }
     /* ②-a 保存 → 刷新列表 */
    if (payload === 'reload') {
      //setTimeout(() => api.load(), ANIM_MS);
      setAfterClose(() => () => api.load());
    }
  };

  // 新的关闭&刷新逻辑
  const handlePanelClose = (payload) => {
    // 1. 如果是编辑payload，切换到编辑模式（而不是关闭面板）
    if (payload && typeof payload === 'object' && payload.mode === 'edit') {
      openTaskEdit(payload._id, payload.task);
      return;  // 不要关闭面板
    }
    // 关闭面板
    handleTaskClose();
    // 只要 payload === 'reload'，就刷新
    if (payload === 'reload') {
      api.load();
    }
    // 其它情况不用管，比如 payload === 'close'
  };

  // 从后端加载任务列表
  useEffect(() => {         // 组件挂载 → 拉一次任务
    api.load();
  }, [api]);

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
      <TopAppBar /> 
      <Container
        maxWidth={false}
        disableGutters
        sx={{ 
          py: 3,
          height: 'calc(100vh - 64px)',
          overflowX: 'hidden',
          width: '80vw',          // 固定 80% 视口宽度
          minWidth: 0,
          maxWidth: 'none',
          mx: 'auto',             // 居中
        }}
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
                <Button variant="contained" color="secondary" onClick={openTaskCreate}>
                  新增任务
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/project-table')}
                >
                  打开项目编辑器
                </Button>
              </Stack>
            </Stack>
            {viewMode === 'calendar' ? (
              <CalendarView
                events={events}
                style={{ height: '100%', width: '100%' }}
                onSelectEvent={(event) => openTaskDetail(event._id)}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onSelectTask={(task) => openTaskDetail(task._id)}
                sx={{ height: '100%' }}
              />
            )}
          </Grid>
          {/* 右侧面板：详情 / 新建 / 编辑 */}
          <Grid sx={rightPanelStyles}>
            <Slide 
              direction="left" 
              in={!!selectedTask} 
              mountOnEnter 
              unmountOnExit
              onExited={() => {              // 动画完全收起 → 执行回调
                // 可选：面板动画结束后也可以再做一次清理
                setSelectedTask(null);
              }}
            >
              <div style={{ height: '100%' }}>
                
                  <SlideContent
                    selectedTask={selectedTask}
                    handleTaskClose={handlePanelClose}
                  />
               
              </div>
              </Slide>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
