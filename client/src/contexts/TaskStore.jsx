import { createContext, useContext, useReducer } from 'react';
import { fetcher } from '../utils/fetcher';

const TaskCtx = createContext();
export const useTasks = () => useContext(TaskCtx);

function reducer(state, action) {
  switch (action.type) {
    case 'set':     return action.payload;
    case 'add':     return [...state, action.payload];
    case 'replace': return state.map(t => t.id === action.payload.old ? action.payload.new : t);
    case 'delete':  return state.filter(t => t.id !== action.payload);
    default:        return state;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, []);

  /* 公共 API（用 fetcher 自动带 loading + 报错） */
  const api = {
    async load() {
      const list = await fetcher('/api/tasks');
      dispatch({ type: 'set', payload: list });
    },

    async create(mainData) {
      const tempId = `temp-${Date.now()}`;              // 1️⃣ 乐观插入
      dispatch({ type: 'add', payload: { ...mainData, id: tempId } });
      try {
        const real = await fetcher('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:   JSON.stringify(mainData),
        });
        dispatch({ type: 'replace', payload: { old: tempId, new: real } }); // 2️⃣ 成功替换
        return real;
      } catch (err) {
        dispatch({ type: 'delete', payload: tempId });  // 3️⃣ 失败回滚
        throw err;
      }
    },

    async remove(id) {
      dispatch({ type: 'delete', payload: id });        // 先删
      try {
        await fetcher(`/api/tasks/${id}`, { method: 'DELETE' });
      } catch (err) {
        await this.load();                              // 失败重新拉列表
      }
    },

    update(id, data) {
      return fetcher(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    updateDesc(id, description) {
      return fetcher(`/api/tasks/${id}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
    },
  };

  return (
    <TaskCtx.Provider value={{ tasks, api }}>
      {children}
    </TaskCtx.Provider>
  );
}
