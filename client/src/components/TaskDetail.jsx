// src/components/TaskDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Stack,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
//import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useSnackbar } from 'notistack';

import Editor from './Editor';
import TaskPane from './TaskPane';
//import { api } from '../api/tasks';
import { useTasks } from '../contexts/TaskStore';

export default function TaskDetail({ id, embedded = false, onClose }) {
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { taskMap, api: taskApi } = useTasks();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // 先看缓存（taskMap），再决定是否要远程加载
    const cachedTask = taskMap[id];
    if (cachedTask) {
      setTask({ ...cachedTask });
      setLoading(false);
      // 可选：补充 description 字段，如果 description 单独存
      taskApi.getTaskDescription(id).then(descData => {
        setTask(prev => ({ ...prev, description: descData.description }));
      });
    } else {
      setLoading(true);
      Promise.all([
        taskApi.getTask(id),
        taskApi.getTaskDescription(id),
      ])
      .then(([taskData, descData]) => {
        setTask({ ...taskData, description: descData.description });
        setLoading(false);
      })
      .catch(err => {
        console.error('获取任务失败', err);
        setLoading(false);
        if (embedded && onClose) onClose();
      });
    }
  }, [id, taskMap, taskApi]);

  const handleEditClick = () => {
    if (!task) return;
    const { description, ...taskWithoutDescription } = task;
    // 使用 requestAnimationFrame 延迟执行，避免阻塞当前事件循环
    requestAnimationFrame(() => {
      if (embedded) {
        setTimeout(() => {
          onClose?.({ id: task.id, mode: 'edit', task: taskWithoutDescription });   // 通知父组件切换到编辑表单
        }, 0);
      } else {
        setTimeout(() => {
          navigate(`/task/edit/${task.id}`, { state: { task: taskWithoutDescription } });     // 常规页面跳转
        }, 0);      
      }
    });
  };

  const handleDelete = () => {
    /*
    taskApi.remove(id)
    .then(() => {
      if (embedded && onClose) {
        onClose('reload'); // 关闭嵌入式详情
      } else {
        navigate('/'); // 返回首页
      }
    })
    .catch(err => console.error('删除失败', err));
    */
    const doDelete = async () => {       // ★ 真正的删除逻辑
      try {
        await taskApi.remove(id);
        enqueueSnackbar('已删除', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar('删除失败，已还原', { variant: 'error' });
      }
    };
    
    if (embedded) {
      onClose?.(doDelete);               // ★ 1) 先关闭；2) 把 doDelete 交给 Home
    } else {
      doDelete().then(() => navigate('/'));
    }
  };


  if (loading) {
    return embedded ? null : <Typography sx={{ mt: 4, textAlign: 'center' }}>加载中...</Typography>;
  }
  if (!task) {
    return embedded ? null : <Typography sx={{ mt: 4, textAlign: 'center' }}>任务未找到</Typography>;
  }
  return (
    <TaskPane embedded={embedded}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: embedded ? '100%' : 'auto',
        minHeight: embedded ? '100%' : '80vh', 
        width: embedded ? '100%' : '80%',
        maxWidth: embedded ? 'none' : '1920px',
        minWidth: 0,
        justifyContent: embedded ? 'flex-start' : 'flex-start',  // 靠上对齐
        overflow: 'hidden',
        mx: embedded ? 0 : 'auto', // mx: auto 居中
        mt: 0,       // 如果是独立页面，顶部留些空
        mb: embedded ? 0 : 2,        // 底部留空
        pt: 0,
       }}>


        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" textAlign="center" gutterBottom={false} sx={{ mb: 0 }}>
            任务详细内容
            {embedded && (
              <IconButton onClick={() => navigate(`/task/${task.id}`, { state: { task } } )}>
                <OpenInNewIcon />
              </IconButton>
            )}
          </Typography>
          <Stack direction="row" spacing={1}>
            {embedded && (
              <IconButton color="error" onClick={() => setConfirmDeleteOpen(true)}>
                <DeleteIcon />
              </IconButton>
            )}
            {embedded && ( 
              <IconButton color="primary" onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
            )}
            {embedded && (  
              <IconButton onClick={
              () => {onClose?.()}
              }>
                <CancelIcon />
              </IconButton>
            )}
          </Stack>

        </Box>
        <Divider sx={{ mb: 2 }} />

      <Grid 
        container
        spacing={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(6, 1fr)',
            md: 'repeat(8, 1fr)',
            lg: 'repeat(12, 1fr)',
          },
        }}
      >
        {/* 第一行：地址 城市 邮编 */}
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 12', md: 'span 12', lg: 'span 8' } }}>
          <Typography>
            <strong>地址：</strong>
            {`${task.address ?? ''}, ${task.city ?? ''}, ${task.zipcode ?? ''}`}
          </Typography>
        </Grid>
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 3', lg: 'span 4' }, textAlign: 'right' }}>
          <Typography><strong>房屋年份：</strong>{task.year ?? '未填写'}</Typography>
        </Grid>

        {/* 第二行：公司 项目申请人 项目负责人 项目类型 */}
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 3', lg: 'span 6' } }}>
          <Typography><strong>保险公司：</strong>{task.insurance ?? '未填写'}</Typography>
        </Grid>
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 2', lg: 'span 6' }, textAlign: 'right' }}>
          <Typography><strong>类型：</strong>{task.type}</Typography>
        </Grid>
      
        {/* 第三行：开始日期 结束日期 */}
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
          <Typography><strong>开始日期：</strong>{task.start ? new Date(task.start).toLocaleDateString() : '未填写'}</Typography>
        </Grid>
        <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 6', lg: 'span 6' }, textAlign: 'right' }}>
          <Typography><strong>结束日期：</strong>{task.end ? new Date(task.end).toLocaleDateString() : '未填写'}</Typography>
        </Grid>
      </Grid>
        
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom>
        <strong>详细描述：</strong>
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Editor value={task.description} readOnly hideToolbar />
        </Box>

      {!embedded && (
        <Stack direction="row" spacing={2} mt="auto" pt={1} justifyContent="center">
          <Button 
            variant={embedded ? 'outlined' : 'text'}
            size={embedded ? 'medium' : 'large'} 
            onClick={handleEditClick}
          >
            编辑
          </Button>
          <Button
            variant={embedded ? 'outlined' : 'text'}
            size={embedded ? 'medium' : 'large'} 
            color="error"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            删除
          </Button>
        </Stack>
      )}
      </Box>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>确定要删除该任务吗？</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </TaskPane>       
  );
}