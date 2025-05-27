import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import TopAppBar from '../components/TopAppBar';
import ProjectTableEditor from '../components/ProjectTableEditor';


export default function EditPage() {
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh' }}>
      <TopAppBar />
      <ProjectTableEditor />
    </Box>
  );
}