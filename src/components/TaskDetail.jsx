// src/components/TaskDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import TaskPane from './TaskPane';


export default function TaskDetail({ id, embedded = false, onClose }) {
  const navigate = useNavigate();
  const { tasks, dispatch } = useTasks();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const task = tasks.find((t) => t.id === parseInt(id));


  useEffect(() => {
      if (!task && embedded && onClose) onClose();
  }, [task, embedded, onClose]);

  if (!task) {
    return embedded ? null : <Typography sx={{ mt: 4, textAlign: 'center' }}>任务未找到</Typography>;
  }


  const handleEditClick = () => {
    if (embedded) {
      onClose?.({ id: task.id, mode: 'edit' });   // 通知父组件切换到编辑表单
    } else {
      navigate(`/task/edit/${task.id}`);          // 常规页面跳转
    }
  };


  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: parseInt(id) });
    if (embedded && onClose) {
      onClose(); // 关闭嵌入式详情
    } else {
      navigate('/'); // 导航回首页
    }
  };

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

        {!embedded && (
          <Button 
            onClick={() => navigate('/')} 
            variant="text" 
            size="large" 
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            返回首页
          </Button>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom textAlign="center">
            {task.title}
            {embedded && (
              <IconButton onClick={() => navigate(`/task/${task.id}`)}>
                <OpenInNewIcon />
              </IconButton>
            )}
          </Typography>

          <Stack direction="row" spacing={1}>
            {isEdit && embedded && (
              <IconButton color="error" onClick={() => setConfirmDeleteOpen(true)}>
                <DeleteIcon />
              </IconButton>
            )}
            {embedded && ( 
              <IconButton color="primary" onClick={handleEditClick}>
                <SaveIcon />
              </IconButton>
            )}
            {embedded && (  
              <IconButton onClick={onClose}>
                <CancelIcon />
              </IconButton>
            )}
          </Stack>

        </Box>
        <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {/* 第一行：地址 城市 邮编 */}
        <Grid item xs={4}>
          <Typography><strong>地址：</strong>{task.address}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography><strong>城市：</strong>{task.city}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography><strong>邮编：</strong>{task.zipcode || '未填写'}</Typography>
        </Grid>

        {/* 第二行：公司 项目申请人 项目负责人 项目类型 */}
        <Grid item xs={3}>
          <Typography><strong>公司：</strong>{task.company}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography><strong>项目申请人：</strong>{task.applicant}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography><strong>项目负责人：</strong>{task.manager}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography><strong>类型：</strong>{task.type}</Typography>
        </Grid>
      
        {/* 第三行：开始日期 结束日期 */}
        <Grid item xs={6}>
          <Typography>
            <strong>开始日期：</strong>
            {task.start ? new Date(task.start).toLocaleString() : '未填写'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>结束日期：</strong>
            {task.end ? new Date(task.end).toLocaleString() : '未填写'}
          </Typography>
        </Grid>
      </Grid>
        
        <Divider sx={{ my: 2 }} />
        <Typography gutterBottom>
        <strong>详细描述：</strong>
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '500px', // 限制描述高度，可滚动
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid #ddd',
          }}
        >
          {task.descriptions || '暂无描述内容'}
        </Box>

       <Stack direction="row" spacing={2} mt="auto" pt={embedded ? 4 : 1} justifyContent="center">
       
        {embedded && (
        <Button
          variant="outlined"
          onClick={() => navigate(`/task/${task.id}`)}
        >
          独立查看
        </Button>
        )}

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
        {embedded && (
          <Button variant="outlined" onClick={onClose}>
            退出
          </Button>
        )}
      </Stack>
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