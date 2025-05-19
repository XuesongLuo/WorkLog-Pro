// src/components/TaskCard.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { useState } from 'react';

export default function TaskCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, dispatch } = useTasks();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>任务未找到</Typography>;
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: parseInt(id) });
    navigate('/');
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', px: 4, py: 4 }}>
      <Paper sx={{ p: 4, maxWidth: '900px', margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom>
          {task.title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography><strong>地址：</strong>{task.address}</Typography>
        <Typography><strong>城市：</strong>{task.city}</Typography>
        <Typography><strong>公司：</strong>{task.company}</Typography>
        <Typography><strong>项目负责人：</strong>{task.manager}</Typography>
        <Typography><strong>申请人：</strong>{task.applicant}</Typography>
        <Typography><strong>类型：</strong>{task.type}</Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
          <Button variant="outlined" onClick={() => navigate(`/task/edit/${task.id}`)}>编辑</Button>
          <Button variant="outlined" color="error" onClick={() => setConfirmDeleteOpen(true)}>删除</Button>
        </Stack>
      </Paper>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>确定要删除该任务吗？</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">确认删除</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
