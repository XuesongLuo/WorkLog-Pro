// src/pages/CreateOrEditTask.jsx
import TaskPane from './TaskPane'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  IconButton,
  Grid,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker }      from '@mui/x-date-pickers';
import { AdapterDateFns }      from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../api/tasks';

import React, { lazy, Suspense } from 'react';
const LazyEditor = lazy(() => 
  import('./Editor').then(module => ({
    default: React.memo(module.default)
  }))
);

const types = ['室外工程', '室内工程', '后院施工', '除霉处理'];

export default function CreateOrEditTask({ id: propId, task: propTask, embedded = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const taskFromRoute = location.state?.task;

  const { id: routeId } = useParams();
  // 最终 ID：优先使用 props 传入，其次是路由参数
  const id = propId ?? taskFromRoute?.id ?? (routeId !== 'new' ? routeId : undefined);
  // 判断是否是“新建”任务
  const isCreateMode = routeId === 'new' || (embedded && !id);
  // 编辑模式 = 非创建模式，且 id 存在
  const isEdit = Boolean(id) && !isCreateMode;
  
  const [form, setForm] = useState({
    title: '',
    address: '',
    city: '',
    company: '',
    manager: '',
    applicant: '',
    type: '',
    start: new Date(),
    end: new Date(),
    zipcode: '',
    descriptions: ''
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
  
    const cachedTask = propTask ?? taskFromRoute;
  
    if (cachedTask) {
      const parsedTask = {
        ...cachedTask,
        start: new Date(cachedTask.start),
        end: new Date(cachedTask.end),
        description: '',
      };
      setForm(parsedTask);

      api.getTaskDescription(id)
        .then(descData => {
          setForm(prev => ({ ...prev, description: descData.description }));
          // 等富文本内容准备好后，再延迟加载 Editor
          requestIdleCallback(() => setEditorReady(true));
        })
        .catch(err => console.error('加载描述失败', err));
  
    } else {
      // 完全从接口获取所有数据
      Promise.all([
        api.getTask(id),
        api.getTaskDescription(id),
      ])
      .then(([taskData, descData]) => {
        setForm({ ...taskData, description: descData.description });
        requestIdleCallback(() => setEditorReady(true));
      })
      .catch(err => console.error('加载任务失败', err));
    }
  }, [id, isEdit, propTask, taskFromRoute]);

  useEffect(() => {
    if (!isEdit) {
      // 新建模式直接准备好编辑器
      requestIdleCallback(() => setEditorReady(true));
    }
  }, [isEdit]);

  // 使用 useCallback 优化 handleChange
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);
  // 使用 useCallback 优化日期更改
  const handleStartDateChange = useCallback((newValue) => {
    setForm(prev => ({ ...prev, start: newValue }));
  }, []);
  
  const handleEndDateChange = useCallback((newValue) => {
    setForm(prev => ({ ...prev, end: newValue }));
  }, []);
  // 使用 useCallback 优化描述更改
  const handleDescriptionChange = useCallback((val) => {
    setForm(prev => ({ ...prev, description: val }));
  }, []);
  
  const handleSubmit = () => {
    const {
      description, // 单独提取 description
      ...mainData  // 主体数据：form 中除 description 外的所有字段
    } = form;
  
    if (isEdit) {
      // 更新任务：先更新主体，再更新描述
      Promise.all([
        api.updateTask(id, mainData),
        api.updateTaskDescription(id, description)
      ])
        .then(() => {
          if (embedded) {
            onClose?.('reload');
          } else {
            navigate('/');
          }
        })
        .catch(err => console.error('更新失败', err));
    } else {
      // 创建任务：先创建主体，再用新 ID 更新描述
      api.createTask(mainData)
        .then((newTask) => {
          return api.updateTaskDescription(newTask.id, description).then(() => newTask);
        })
        .then(() => {
          if (embedded) {
            onClose?.('reload');
          } else {
            navigate('/');
          }
        })
        .catch(err => console.error('创建失败', err));
    }
  };

  const handleDelete = () => {
    api.deleteTask(id)
      .then(() => {
          if (embedded) {
            onClose?.('reload');
          } else {
            navigate('/');
          }
        })
      .catch(err => console.error('delete failed', err));
  };

  return (
    <TaskPane embedded={embedded}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: embedded ? '100%' : 'auto',
        //minHeight: embedded ? '100%' : '80vh',
        width: embedded ? '100%' : '80%',
        maxWidth: embedded ? 'none' : '1920px',
        minWidth: 0, // 防止内容撑开容器
        justifyContent: 'flex-start',
        overflowX: 'hidden', // 防止溢出
        overflowY: 'auto', 
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ m: 0 }}>
            {isCreateMode ? '新建任务' : '编辑任务'}
            {embedded && (
              <IconButton onClick={() => navigate(isEdit ? `/task/edit/${id}` : '/task/new', { state: { task: form } } )}>
                <OpenInNewIcon />
              </IconButton>
            )}
          </Typography>
          <Stack direction="row" spacing={1}>
           
            {embedded && (
            <>
              {isEdit && (
                <IconButton color="error" onClick={() => setConfirmDeleteOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton color="primary" onClick={handleSubmit}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={() => {
                requestAnimationFrame(() => {
                  onClose?.();
                });
              }}
              >
                <CancelIcon />
              </IconButton>
            </>
          )}
          </Stack>
        </Box>
      
        <Divider sx={{ mb: 2 }} />

          
        <Grid 
          container 
          spacing={2} 
          columns={12} 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(6, 1fr)',
              md: 'repeat(8, 1fr)',
              lg: 'repeat(12, 1fr)',
            }, 
          }}>
          {/* 第1行：任务标题、项目类型选择*/}
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 4', md: 'span 6', lg: 'span 8' } }}>
            <TextField 
              name="title" 
              label="任务标题" 
              size="small" 
              fullWidth 
              value={form.title} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 2', lg: 'span 4' } }}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-label">项目类型</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={form.type}
                onChange={handleChange}
                label="项目类型"
                sx={{ minWidth: 120 }}
              >
                {types.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 第2行：地址、城市、邮政编码 */}
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 6', lg: 'span 6' } }}>
            <TextField 
              name="address" 
              label="地址" 
              size="small" 
              fullWidth 
              value={form.address} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 1', lg: 'span 3' } }}>
            <TextField 
              name="city" 
              label="城市" 
              size="small" 
              fullWidth 
              value={form.city} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 1', lg: 'span 3' } }}>
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
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 4', lg: 'span 6' } }}>
            <TextField 
              name="company" 
              label="公司" 
              size="small" 
              fullWidth 
              value={form.company} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 2', lg: 'span 3' } }}>
            <TextField 
              name="applicant" 
              label="项目申请人" 
              size="small" 
              fullWidth 
              value={form.applicant} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 2', lg: 'span 3' } }}>
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
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 4', lg: 'span 6' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="开始时间"
                value={form.start}
                onChange={handleStartDateChange}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 4', lg: 'span 6' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="结束时间"
                value={form.end}
                onChange={handleEndDateChange}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid 
            item 
            sx={{ gridColumn: '1 / -1' }}
          >
            <Typography gutterBottom>
              <strong>详细描述</strong>
            </Typography>
            {editorReady ? (
              <Suspense fallback={<Typography variant="body2">加载编辑器中...</Typography>}>
                <LazyEditor
                  value={form.description}
                  onChange={handleDescriptionChange}
                />
              </Suspense>
            ) : (
              <Typography variant="body2" sx={{ color: '#aaa' }}>等待编辑器加载...</Typography>
            )}
          </Grid>
        </Grid>

      {/* ---------- 按钮区 ---------- */}
      {!embedded && (
        <Stack direction="row" spacing={2} mt="auto" pt={1} justifyContent="center">
          {isEdit &&(
            <Button variant='text' color="error" onClick={() => setConfirmDeleteOpen(true)}>删除</Button>
          )}
          <Button variant='text' onClick={handleSubmit}>{isEdit ? '保存修改' : '创建任务'}</Button>
        </Stack>

      )}
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
