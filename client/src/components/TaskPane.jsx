// src/components/TaskPane.jsx
import { forwardRef } from 'react';
import { Paper } from '@mui/material';

/**
 * 统一的右侧面板外壳。
 * 必须用 forwardRef，让父级动画组件（如 <Fade>）拿到 DOM。
 */
const TaskPane = forwardRef(function TaskPane({ children, embedded = true }, ref) {
  return (
      <Paper
        ref={ref} 
        elevation={embedded ? 1 : 0}  // 嵌套模式下有阴影，独立页面没有
        sx={{
          flex: 1,
          width: '100%',
          height: '100%',
          minWidth: 0, // 重要：防止flex项目超出其容器
          p: 0,    // 嵌套2=16px padding，独立页面0padding
          display: 'flex',
          alignItems: embedded ? 'stretch' : 'center',
          maxWidth: embedded ? 'none' : '1920px',
          flexDirection: 'column',
          overflow: 'auto',
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: embedded ? undefined : 'none',  // 确保独立页面完全没阴影
          backgroundColor: embedded ? 'background.paper' : 'transparent', // 背景透明
        }}
      >
        {children}
      </Paper>
  );
});

export default TaskPane;
