// src/pages/TaskDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TaskDetail from '../components/TaskDetail';
import TopAppBar from '../components/TopAppBar';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <TopAppBar 
        showHomeButton         
        onHomeClick={() => navigate('/')}
      />
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
