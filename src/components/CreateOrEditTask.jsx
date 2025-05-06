// src/pages/CreateOrEditTask.jsx
import TaskPane from './TaskPane'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Editor from './Editor';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker }      from '@mui/x-date-pickers';
import { AdapterDateFns }      from '@mui/x-date-pickers/AdapterDateFns';
import { useTasks } from '../context/TaskContext';

const types = ['室外工程', '室内工程', '后院施工', '除霉处理'];

export default function CreateOrEditTask({ id: propId, embedded = false, onClose }) {
  const { id: routeId } = useParams();              // URL 参数
  const { tasks, dispatch } = useTasks();
  const navigate = useNavigate();

  /* 1️⃣ 统一 id 来源：父组件传的优先生效 */
  const id = propId ?? routeId;

  const isEdit = Boolean(id);


  /* 2️⃣ 有 id 就找旧任务，没有就用空模板 */
  const existing = tasks.find(t => t.id === Number(id));

  const [form, setForm] = useState(
    existing ?? {
    title: '',
    address: '',
    city: '',
    company: '',
    manager: '',
    applicant: '',
    type: '',
    start: new Date(),
    end: new Date(),
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existingTask = tasks.find((task) => task.id === parseInt(id));
      if (existingTask) {
        setForm(existingTask);
      }
    }
  }, [id, isEdit, tasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isEdit) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...form, id: parseInt(id) } });
    } else {
      dispatch({ type: 'ADD_TASK', payload: form });
    }
    navigate('/');
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: parseInt(id) });
    navigate('/');
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
        minWidth: 0, // 防止内容撑开容器
        justifyContent: 'flex-start',
        overflow: 'hidden', // 防止溢出
        mx: embedded ? 0 : 'auto',
        mt: 0,
        mb: embedded ? 0 : 4,
        pt: 0,
       }}>

        {/* 顶部返回按钮，只在独立页面出现 */}
        {!embedded && (
          <Button 
            onClick={() => navigate('/')} 
            variant="text" 
            size="small" 
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            返回首页
          </Button>
        )}

        {/* 任务创建类型 */}
        <Typography variant="h5" gutterBottom>
          {isEdit ? '编辑任务' : '创建新任务'}
        </Typography>
      
        <Divider sx={{ mb: 2 }} />

          
        <Grid container spacing={2}>
          {/* 第1行：任务标题、项目类型选择*/}
          <Grid item xs={6}>
            <TextField 
              name="title" 
              label="任务标题" 
              size="small" 
              fullWidth 
              value={form.title} 
              onChange={handleChange} 
            />
          </Grid>
           <Grid item xs={6}>
            <TextField
              name="type"
              label="项目类型"
              size="small"
              select
              fullWidth
              value={form.type}
              onChange={handleChange}
            >
              {types.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* 第2行：地址、城市、邮政编码 */}
          <Grid item xs={4}>
            <TextField 
              name="address" 
              label="地址" 
              size="small" 
              fullWidth 
              value={form.address} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              name="city" 
              label="城市" 
              size="small" 
              fullWidth 
              value={form.city} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              name="zipcode" 
              label="邮政编码" 
              size="small" 
              fullWidth 
              value={form.zipcode || ''} 
              onChange={(e) => setForm({ ...form, zipcode: e.target.value })} 
            />
          </Grid>

          {/* 第3行：公司、项目申请人、项目负责人 */}
          <Grid item xs={4}>
            <TextField 
              name="company" 
              label="公司" 
              size="small" 
              fullWidth 
              value={form.company} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              name="applicant" 
              label="项目申请人" 
              size="small" 
              fullWidth 
              value={form.applicant} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              name="manager" 
              label="项目负责人" 
              size="small" 
              fullWidth 
              value={form.manager} 
              onChange={handleChange} 
            />
          </Grid>

          {/* 第4行：开始日期、结束日期 */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="开始时间"
                value={form.start}
                onChange={(newValue) => setForm({ ...form, start: newValue })}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="结束时间"
                value={form.end}
                onChange={(newValue) => setForm({ ...form, end: newValue })}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid item xs={12}>
          <Typography gutterBottom>
            <strong>详细描述</strong>
          </Typography>
          <Editor />
        </Grid>

 
      
      {/* ---------- 按钮区 ---------- */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
        
        {embedded && (
        <Button
          variant="outlined"
          onClick={() => navigate(isEdit ? `/task/edit/${id}` : '/task/new')}
        >
          独立查看
        </Button>
        )}

        {embedded && (
        <Button variant="outlined" onClick={onClose}>取消</Button>
        )}
        
        {isEdit && (
          <Button variant={embedded ? 'outlined' : 'text'} color="error" onClick={() => setConfirmDeleteOpen(true)}>删除</Button>
        )}
        <Button variant={embedded ? 'outlined' : 'text'} onClick={handleSubmit}>{isEdit ? '保存修改' : '创建任务'}</Button>

      </Stack>
      </Box>
      </Box>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>确定要删除该任务吗？</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">确认删除</Button>
        </DialogActions>
      </Dialog>
    </TaskPane>
  )
}
