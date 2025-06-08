// src/pages/TaskDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TaskDetail from '../components/TaskDetail';
import TopAppBar from '../components/TopAppBar';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', m: 0, p: 0 }}>
      <TopAppBar 
        showHomeButton         
        onHomeClick={() => navigate('/')}
      />
      <Box 
        sx={{ 
          width: '100%', 
          margin: '0 auto', // 水平居中
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 2, 
          boxSizing: 'border-box', 
        }}>
        <TaskDetail id={id} />
      </Box>
    </Box>
  );
}
