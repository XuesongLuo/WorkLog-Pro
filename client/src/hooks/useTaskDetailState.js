// src/hooks/useTaskDetailState.js
import { useState } from 'react'

/**
 * 自定义 Hook：统一管理任务详情、编辑、新增状态。
 * 用于 Home.jsx 中简化 selectedTask、showDetail 和切换逻辑。
 */
export default function useTaskDetailState() {
  const [selectedTask, setSelectedTask] = useState(null);  // { id?, mode: 'view' | 'edit' | 'new' } | null
  const [showDetail, setShowDetail] = useState(false);

  // 打开任务详情（只读模式）
  const openTaskDetail = (id) => {
    setSelectedTask({ id, mode: 'view' });
    setShowDetail(true);
  };

  // 打开任务编辑
  const openTaskEdit = (id) => {
    setSelectedTask({ id, mode: 'edit' });
    setShowDetail(true);
  };

  // 打开任务创建
  const openTaskCreate = () => {
    setSelectedTask({ mode: 'new' });
    setShowDetail(true);
  };

  // 从任务组件中回调关闭或切换编辑
  const handleTaskClose = (payload) => {
    if (payload?.mode === 'edit') {
      setSelectedTask(payload);
    } else {
      setShowDetail(false);
      setTimeout(() => setSelectedTask(null), 200); // 延迟卸载右侧面板
    }
  };

  return {
    selectedTask,
    showDetail,
    openTaskDetail,
    openTaskEdit,
    openTaskCreate,
    handleTaskClose,
  };
}
