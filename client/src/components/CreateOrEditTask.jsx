// src/pages/CreateOrEditTask.jsx
import React, { useEffect, useState, useCallback, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker }      from '@mui/x-date-pickers';
import { AdapterDateFns }      from '@mui/x-date-pickers/AdapterDateFns';

import { useSnackbar } from 'notistack';

import { useTasks } from '../contexts/TaskStore';
import TaskPane from './TaskPane'; 

const LazyEditor = lazy(() => 
  import('./Editor').then(module => ({
    default: React.memo(module.default)
  }))
);

function formatDateToYMD(date) {
  if (!date) return null;
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const types = ['室外工程', '室内工程', '后院施工', '除霉处理'];

export default function CreateOrEditTask({ p_id: propId, task: propTask, embedded = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef();
  const taskFromRoute = location.state?.task;

  const { p_id: routeId } = useParams();
  // 最终 ID：优先使用 props 传入，其次是路由参数
  const p_id = propId ?? taskFromRoute?.p_id ?? (routeId !== 'new' ? routeId : undefined);
  // 判断是否是“新建”任务
  const isCreateMode = routeId === 'new' || (embedded && !p_id);
  // 编辑模式 = 非创建模式，且 p_id 存在
  const isEdit = Boolean(p_id) && !isCreateMode;
  
  const [form, setForm] = useState({
    address: '',
    city: '',
    zipcode: '',
    year: '',
    insurance: '',
    type: '',
    company: '',
    manager: '',
    referrer: '',
    start: new Date(),
    end: new Date(),
    description: ''
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const { taskMap, api: taskApi } = useTasks();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (!isEdit || !p_id) return;
  
    const cachedTask = propTask ?? taskFromRoute ?? taskMap[p_id];
  
    if (cachedTask) {
      const { mode, ...cleanTask } = cachedTask;
      const parsedTask = {
        ...cleanTask,
        start: new Date(cleanTask.start),
        end: new Date(cleanTask.end),
      };
      setForm(prev => ({ ...prev, ...parsedTask }));
      taskApi.getTaskDescription(p_id)
        .then(descData => {
          setForm(prev => ({ ...prev, description: descData.description }));
          // 等富文本内容准备好后，再延迟加载 Editor
          requestIdleCallback(() => setEditorReady(true));
        })
        .catch(err => console.error('加载描述失败', err));
  
    } else {
      // 完全从接口获取所有数据
      Promise.all([
        taskApi.getTask(p_id),
        taskApi.getTaskDescription(p_id),
      ])
      .then(([taskData, descData]) => {
        setForm({ ...taskData, description: descData.description });
        requestIdleCallback(() => setEditorReady(true));
      })
      .catch(err => console.error('加载任务失败', err));
    }
  }, [p_id, isEdit, propTask, taskFromRoute]);

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
    setForm(prev => {
      let newEnd = prev.end;
      if (newValue && newEnd && new Date(newValue) > new Date(newEnd)) {
        newEnd = newValue;
      }
      return { ...prev, start: newValue, end: newEnd };
    });
  }, []);
  
  const handleEndDateChange = useCallback((newValue) => {
    setForm(prev => ({ ...prev, end: newValue }));
  }, []);
  // 使用 useCallback 优化描述更改
  const handleDescriptionChange = useCallback((val) => {
    setForm(prev => ({ ...prev, description: val }));
  }, []);

  const handleSubmit = async () => {
    const description = editorRef.current?.getHTML?.() || '';   // 单独提取 description
    const {
      description: _desc, 
      start,
      end,
      ...mainData          // 主体数据：form 中除 description 外的所有字段
    } = form;

    const finalData = {
      ...mainData,
      start: formatDateToYMD(start),
      end: formatDateToYMD(end)
    };

    try {
      setSaving(true);
      if (isEdit) {
        await Promise.all([
          taskApi.update(p_id, finalData),
          taskApi.updateDesc(p_id, description),
        ]);
      } else {
        console.log(0)
        const newTask = await taskApi.create(finalData);   // 乐观插入已完成
        console.log(1)
        let projectId = newTask.p_id;
        console.log(projectId)
        await taskApi.updateDesc(projectId, description);    // 才写描述
        console.log(2)
      }
      embedded ? onClose?.('reload') : navigate('/');
    } catch (e) {
      /* fetcher 已有全局报错，若要局部提示可加 enqueueSnackbar */
      enqueueSnackbar(e.message || '新建失败', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    const doDelete = async () => {       // ★ 真正的删除逻辑
      try {
        await taskApi.remove(p_id);
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

  return (
    <TaskPane embedded={embedded}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        //height: embedded ? '100%' : 'auto',
        width: embedded ? '100%' : '80%',
        maxWidth: embedded ? 'none' : '100vw',
        minWidth: 0, // 防止内容撑开容器
        justifyContent: 'flex-start',
        overflowX: 'hidden', // 防止溢出
        overflowY: 'auto', 
        mx: embedded ? 0 : 'auto',
        mt: 0,
        mb: embedded ? 0 : 4,
        pt: 0,
       }}>
        {/* 任务创建类型 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ m: 0 }}>
            {isCreateMode ? '新建任务' : '编辑任务'}
            {embedded && (
              <IconButton onClick={() => navigate(isEdit ? `/task/edit/${p_id}` : '/task/new', { state: { task: form } } )}>
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
          {/* 第1行：地址、城市、邮政编码 */}
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
          {/* 第2行：房子年份、保险公司、项目类型选择*/}
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 6', lg: 'span 2' } }}>
            <TextField 
              name="year" 
              label="年份" 
              size="small" 
              fullWidth 
              value={form.year} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 1', lg: 'span 6' } }}>
            <TextField 
              name="insurance" 
              label="保险公司" 
              size="small" 
              fullWidth 
              value={form.insurance} 
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

          {/* 第3行：公司、项目推荐人、项目负责人 */}
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
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 3', md: 'span 2', lg: 'span 3' } }}>
            <TextField 
              name="referrer" 
              label="项目推荐人" 
              size="small" 
              fullWidth 
              value={form.referrer} 
              onChange={handleChange} 
            />
          </Grid>
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
          
          {/* 第4行：开始日期、结束日期 */}
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 4', lg: 'span 6' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="开始日期"
                value={form.start}
                onChange={handleStartDateChange}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item sx={{ gridColumn: { xs: 'span 1', sm: 'span 6', md: 'span 4', lg: 'span 6' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="结束日期"
                value={form.end}
                minDate={form.start}
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
                  ref={editorRef}
                  key={p_id ?? 'new'}
                  value={form.description}
                  maxHeightOffset={embedded ? 40 : 100}
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
          <Button
            loading={saving}
            onClick={handleSubmit}
          >
            {isEdit ? '保存修改' : '创建任务'}
          </Button>
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
