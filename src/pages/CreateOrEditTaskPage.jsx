// src/pages/CreateOrEditTaskPage.jsx
import { useParams } from 'react-router-dom';
import CreateOrEditTask from '../components/CreateOrEditTask';
import { Box } from '@mui/material';

export default function CreateOrEditTaskPage() {
  const { id } = useParams();

  return (
    <Box sx={{ 
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
      <CreateOrEditTask id={id} />
    </Box>
  );
}