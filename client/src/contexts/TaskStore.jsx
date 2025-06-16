// src/contexts/TaskStore.jsx
import merge from 'lodash.merge'; 
import { useState, createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { fetcher } from '../utils/fetcher';

const TaskCtx = createContext();
export const useTasks = () => useContext(TaskCtx);

function taskReducer(state, action) {
  switch (action.type) {
    case 'set':     return action.payload;
    case 'add':     return [...state, action.payload];
    case 'replace': return state.map(t => t._id === action.payload.old ? action.payload.new : t);
    case 'delete':  return state.filter(t => t._id !== action.payload);
    default:        return state;
  }
}

function progressReducer(state, action) {
  switch (action.type) {
    case 'set':    return action.payload;                               // 替换整表
    case 'patch': {
      const prevRow = state[action._id];
      if (!prevRow) return state;
      // 使用浅比较优化
      const updatedRow = merge({}, prevRow, action.data);

       // 快速比较关键字段而不是整个对象序列化
       const hasChanged = Object.keys(action.data).some(key => {
        if (typeof action.data[key] === 'object' && action.data[key] !== null) {
          return Object.keys(action.data[key]).some(subKey => 
            prevRow[key]?.[subKey] !== action.data[key][subKey]
          );
        }
        return prevRow[key] !== action.data[key];
      });
      if (!hasChanged) return state;

      return { ...state, [action._id]: updatedRow };
    }
    default: return state;
  }
}

export function TaskProvider({ children }) {

  /* ---------- Project Progress reducer ---------- */
  const [progressRows, progressDispatch] = useReducer(progressReducer, {});
  const [tasks, taskDispatch] = useReducer(taskReducer, []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const taskMap = useMemo(() => Object.fromEntries(tasks.map(t => [t._id, t])), [tasks]);

  // 分页加载
  const loadPage = useCallback(async (pageNumber = 1, pageSize = 100) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetcher(`/api/tasks?page=${pageNumber}&pageSize=${pageSize}`);
      const { data, total } = res;
      if (pageNumber === 1) {
        taskDispatch({ type: 'set', payload: data });
      } else {
        data.forEach(t => taskDispatch({ type: 'add', payload: t }));
      }
      const totalSoFar = tasks.length + data.length;
      setPage(pageNumber);
      setHasMore(totalSoFar < total);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [tasks, loading]);



  /* 公共 API（用 fetcher 自动带 loading + 报错） */
  // 废弃
  /*
  const load = useCallback(async () => {
      const list = await fetcher('/api/tasks');
      taskDispatch({ type: 'set', payload: list });
  }, []);
  */

  // 读取单条任务
  const getTask = useCallback(
    (_id) => fetcher(`/api/tasks/${_id}`),
    []
  );


  // 读取任务的富文本描述
  const getTaskDescription = useCallback(
    (_id) => fetcher(`/api/descriptions/${_id}`),
    []
  );
  

  const create = useCallback(async (mainData) => {
    const tempId = `temp-${Date.now()}`;              // 1️⃣ 乐观插入
    taskDispatch({ type: 'add', payload: { ...mainData, _id: tempId } });
    try {
      const real = await fetcher('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify(mainData),
      });
      taskDispatch({ type: 'replace', payload: { old: tempId, new: real } }); // 2️⃣ 成功替换
      //await loadPage(1);
      return real;
    } catch (err) {
      taskDispatch({ type: 'delete', payload: tempId });  // 3️⃣ 失败回滚
      throw err;
    }
  }, []);


  const remove = useCallback(async (_id) => {
    taskDispatch({ type: 'delete', payload: _id });        // 先删
    try {
      await fetcher(`/api/tasks/${_id}`, { method: 'DELETE' });
      await loadPage(1);
    } catch (err) {
      await loadPage(1);                             // 删除失败时回滚
    }
  }, []);


  const update = useCallback((_id, data) => fetcher(`/api/tasks/${_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }), []);


  const updateDesc = useCallback((_id, description, userId) => fetcher(`/api/descriptions/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, userId }),
  }), []);


  const patchTask = useCallback((_id, data) => fetcher(`/api/tasks/${_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }), []);


  // 读取全部进度 – ProjectTableEditor 首次挂载调用
  const loadProgress = useCallback(async () => {
    try {
      const arr = await fetcher('/api/progress');           // ① raw 是键值对对象
      const map = Object.fromEntries(arr.map(row => [row._id, row]));
      progressDispatch({ type: 'set', payload: map });    // 键值对对象直接传递
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);


  /** ① 本地乐观合并（不打网络）——给前端即时反馈用 */
  const mergeProgress = useCallback((_id, data) => {
    progressDispatch({ type: 'patch', _id, data });
  }, []);


  // ② 行级保存
  const saveProgress = useCallback(async (_id, data) => {
    if (!_id || typeof _id !== 'string') {
      console.error('Invalid ID provided to saveProgress');
      return;
    }
    if (!data || typeof data !== 'object') {
      console.error('Invalid data provided to saveProgress');
      return;
    }
    try {
      //progressDispatch({ type: 'patch', _id, data });            // Optimistic UI
      await fetcher(`/api/progress/${_id}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to save progress for _id:', _id, error);
      // 回滚（保持原逻辑）
      progressDispatch({ type: 'patch', _id, data: state.find(r => r._id === _id) || {} }); // 清除失败的更新
      throw error;
    }
  }, []);


  const saveCell = useCallback((rowId, patch) => {
    console.log('saveCell', rowId, patch);
    if (!rowId || typeof rowId !== 'string') return;
    if (!patch || typeof patch !== 'object') return;
    
    const section = Object.keys(patch)[0];
    const value = patch[section];
    // 基础字段
    if (["year", "insurance"].includes(section)) {
      // 写回 tasks
      console.log("if:", rowId, { [section]: value } )
      return patchTask(rowId, { [section]: value });
    } else {
      // 其他写入 progress
      mergeProgress(rowId, patch);
      //return saveProgress(rowId, patch);
      return fetcher(`/api/progress/${rowId}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(patch),
      });
    }
  }, [patchTask, mergeProgress]);



  const api = useMemo(() => ({ 
    loadPage,
    getTask, 
    getTaskDescription, 
    create, 
    remove, 
    update, 
    updateDesc, 
    loadProgress, 
    mergeProgress, 
    saveProgress,
    saveCell
  }), [
    loadPage, getTask, getTaskDescription, create, remove, update, updateDesc, loadProgress, mergeProgress, saveProgress, saveCell
  ]);

  return (
    <TaskCtx.Provider value={{ 
      tasks,       // 数组，for 渲染
      taskMap,     // map，for 查找
      progress: progressRows,
      api,
      page, hasMore, loaded, setPage, loading
    }}>
      {children}
    </TaskCtx.Provider>
  );
}