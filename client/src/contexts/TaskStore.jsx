// src/contexts/TaskStore.jsx
import merge from 'lodash.merge'; 
import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { fetcher } from '../utils/fetcher';

const TaskCtx = createContext();
export const useTasks = () => useContext(TaskCtx);

function taskReducer(state, action) {
  switch (action.type) {
    case 'set':     return action.payload;
    case 'add':     return [...state, action.payload];
    case 'replace': return state.map(t => t.id === action.payload.old ? action.payload.new : t);
    case 'delete':  return state.filter(t => t.id !== action.payload);
    default:        return state;
  }
}

function progressReducer(state, action) {
  switch (action.type) {
    case 'set':    return action.payload;                               // 替换整表
    case 'patch':
      console.log('Patch action:', { id: action.id, data: action.data });
      const index = state.findIndex(r => r.id === action.id);
      if (index === -1) return state; // 未找到行，保持不变
      const updatedRow = merge({}, state[index], action.data);
      return [
        ...state.slice(0, index),
        updatedRow,
        ...state.slice(index + 1)
      ];
    default:       return state;
  }
}

export function TaskProvider({ children }) {

  /* ---------- Project Progress reducer ---------- */
  const [progressRows, progressDispatch] = useReducer(progressReducer, []);

  //const [tasks, dispatch] = useReducer(reducer, []);
  const [tasks, taskDispatch] = useReducer(taskReducer, []);

  /* 公共 API（用 fetcher 自动带 loading + 报错） */
  const load = useCallback(async () => {
      const list = await fetcher('/api/tasks');
      taskDispatch({ type: 'set', payload: list });
  }, []);

  // 读取单条任务
  const getTask = useCallback(
    (id) => fetcher(`/api/tasks/${id}`),
    []
  );

  // 读取任务的富文本描述
  const getTaskDescription = useCallback(
    (id) => fetcher(`/api/tasks/${id}/description`),
    []
  );
  

  const create = useCallback(async (mainData) => {
    const tempId = `temp-${Date.now()}`;              // 1️⃣ 乐观插入
    taskDispatch({ type: 'add', payload: { ...mainData, id: tempId } });
    try {
      const real = await fetcher('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify(mainData),
      });
      taskDispatch({ type: 'replace', payload: { old: tempId, new: real } }); // 2️⃣ 成功替换
      await load();
      return real;
    } catch (err) {
      taskDispatch({ type: 'delete', payload: tempId });  // 3️⃣ 失败回滚
      throw err;
    }
  }, [load]);

  const remove = useCallback(async (id) => {
    taskDispatch({ type: 'delete', payload: id });        // 先删
    try {
      await fetcher(`/api/tasks/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      await load();                             // 删除失败时回滚
    }
  }, []);

  const update = useCallback((id, data) => fetcher(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }), []);

  const updateDesc = useCallback((id, description) => fetcher(`/api/tasks/${id}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
  }), []);


  // 读取全部进度 – ProjectTableEditor 首次挂载调用
  const loadProgress = useCallback(async () => {
    try {
      const raw = await fetcher('/api/progress');           // ① raw 可能是对象
      const array = Array.isArray(raw)
        ? raw
        : Object.entries(raw).map(([id, row]) => ({ id, ...row }));
      progressDispatch({ type: 'set', payload: array });    // ② 一律转成数组后再塞
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  /** ① 本地乐观合并（不打网络）——给前端即时反馈用 */
  const mergeProgress = useCallback((id, data) => {
    console.log('Merging progress for id:', id, 'data:', data);
    progressDispatch({ type: 'patch', id, data });
  }, []);

  // ② 行级保存
  const saveProgress = useCallback(async (id, data) => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid ID provided to saveProgress');
      return;
    }
    if (!data || typeof data !== 'object') {
      console.error('Invalid data provided to saveProgress');
      return;
    }
    try {
      progressDispatch({ type: 'patch', id, data });            // Optimistic UI
      await fetcher(`/api/progress/${id}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      });
      console.log('Progress saved successfully for id:', id);
    } catch (error) {
      console.error('Failed to save progress for id:', id, error);
      // 可以考虑回滚或显示错误消息
      progressDispatch({ type: 'patch', id, data: state.find(r => r.id === id) || {} }); // 清除失败的更新
      throw error;
    }
  }, []);


  const api = useMemo(() => ({ 
    load, 
    getTask, 
    getTaskDescription, 
    create, 
    remove, 
    update, 
    updateDesc, 
    loadProgress, 
    mergeProgress, 
    saveProgress 
  }), [
    load, getTask, getTaskDescription, create, remove, update, updateDesc, loadProgress, mergeProgress, saveProgress
  ]);

  return (
    <TaskCtx.Provider value={{ tasks, progress: progressRows, api }}>
      {children}
    </TaskCtx.Provider>
  );
}