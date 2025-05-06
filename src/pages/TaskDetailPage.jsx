// src/pages/TaskDetailPage.jsx
import { useParams } from 'react-router-dom';
import TaskDetail from '../components/TaskDetail';
import { Box, Container } from '@mui/material';

import TopAppBar from '../components/TopAppBar';

export default function TaskDetailPage() {
  const { id } = useParams();

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <TopAppBar />
      <Box 
        sx={{ 
          width: '100%', 
          margin: '0 auto', // 水平居中
          maxWidth: '1920px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2, 
          boxSizing: 'border-box', 
        }}>
        <TaskDetail id={id} />
      </Box>
    </Box>
  );
}
