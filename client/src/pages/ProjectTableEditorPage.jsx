import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TopAppBar from '../components/TopAppBar';
import ProjectTableEditor from '../components/ProjectTableEditor';


export default function EditPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <TopAppBar 
        showHomeButton         
        onHomeClick={() => navigate('/')}
      />
      <ProjectTableEditor />
    </Box>
  );
}