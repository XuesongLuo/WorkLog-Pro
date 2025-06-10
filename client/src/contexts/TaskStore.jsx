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
    case 'replace': return state.map(t => t.p_id === action.payload.old ? action.payload.new : t);
    case 'delete':  return state.filter(t => t.p_id !== action.payload);
    default:        return state;
  }
}

function progressReducer(state, action) {
  switch (action.type) {
    case 'set':    return action.payload;                               // 替换整表
    case 'patch': {
      const prevRow = state[action.p_id];
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

      return { ...state, [action.p_id]: updatedRow };
    }
    default: return state;
  }
}

export function TaskProvider({ children }) {

  /* ---------- Project Progress reducer ---------- */
  const [progressRows, progressDispatch] = useReducer(progressReducer, {});
  const [tasks, taskDispatch] = useReducer(taskReducer, []);
  const taskMap = useMemo(() => Object.fromEntries(tasks.map(t => [t.p_id, t])), [tasks]);


  /* 公共 API（用 fetcher 自动带 loading + 报错） */
  const load = useCallback(async () => {
      const list = await fetcher('/api/tasks');
      taskDispatch({ type: 'set', payload: list });
  }, []);


  // 读取单条任务
  const getTask = useCallback(
    (p_id) => fetcher(`/api/tasks/${p_id}`),
    []
  );


  // 读取任务的富文本描述
  const getTaskDescription = useCallback(
    (p_id) => fetcher(`/api/descriptions/${p_id}`),
    []
  );
  

  const create = useCallback(async (mainData) => {
    const tempId = `temp-${Date.now()}`;              // 1️⃣ 乐观插入
    taskDispatch({ type: 'add', payload: { ...mainData, p_id: tempId } });
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

  const remove = useCallback(async (p_id) => {
    taskDispatch({ type: 'delete', payload: p_id });        // 先删
    try {
      await fetcher(`/api/tasks/${p_id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      await load();                             // 删除失败时回滚
    }
  }, []);

  const update = useCallback((p_id, data) => fetcher(`/api/tasks/${p_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }), []);

  const updateDesc = useCallback((p_id, description) => fetcher(`/api/descriptions/${p_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
  }), []);


  const patchTask = useCallback((p_id, data) => fetcher(`/api/tasks/${p_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }), []);


  // 读取全部进度 – ProjectTableEditor 首次挂载调用
  const loadProgress = useCallback(async () => {
    try {
      const arr = await fetcher('/api/progress');           // ① raw 是键值对对象
      const map = Object.fromEntries(arr.map(row => [row.p_id, row]));
      progressDispatch({ type: 'set', payload: map });    // 键值对对象直接传递
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  /** ① 本地乐观合并（不打网络）——给前端即时反馈用 */
  const mergeProgress = useCallback((p_id, data) => {
    progressDispatch({ type: 'patch', p_id, data });
  }, []);

  // ② 行级保存
  const saveProgress = useCallback(async (p_id, data) => {

    if (!p_id || typeof p_id !== 'string') {
      console.error('Invalid ID provided to saveProgress');
      return;
    }
    if (!data || typeof data !== 'object') {
      console.error('Invalid data provided to saveProgress');
      return;
    }
    try {
      //progressDispatch({ type: 'patch', p_id, data });            // Optimistic UI
      await fetcher(`/api/progress/${p_id}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to save progress for p_id:', p_id, error);
      // 回滚（保持原逻辑）
      progressDispatch({ type: 'patch', p_id, data: state.find(r => r.p_id === p_id) || {} }); // 清除失败的更新
      throw error;
    }
  }, []);

  const saveCell = useCallback((rowId, patch) => {
    console.log("saveCell: ", rowId, patch )
    const section = Object.keys(patch)[0];
    const value = patch[section];
    // 基础字段
    if (["location", "year", "insurance"].includes(section)) {
      // 写回 tasks
      console.log("if:", rowId, { [section]: value } )
      return patchTask(rowId, { [section]: value });
    } else {
      // 其他写入 progress
      /*
      const patch = key == null
        ? { [section]: value }
        : { [section]: { [key]: value } };
        */
      mergeProgress(rowId, patch);
      return saveProgress(rowId, patch);
    }
  }, [patchTask, mergeProgress, saveProgress]);


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
    saveProgress,
    saveCell
  }), [
    load, getTask, getTaskDescription, create, remove, update, updateDesc, loadProgress, mergeProgress, saveProgress, saveCell
  ]);

  return (
    <TaskCtx.Provider value={{ 
      tasks,       // 数组，for 渲染
      taskMap,     // map，for 查找
      progress: progressRows,
      api
    }}>
      {children}
    </TaskCtx.Provider>
  );
}