import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TopAppBar from '../components/TopAppBar';
import ProjectTableEditor from '../components/ProjectTableEditor';
import ProjectTableEditorAnt from '../components/ProjectTableEditorAnt';

export default function EditPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopAppBar 
        showHomeButton         
        onHomeClick={() => navigate('/')}
      />
      <Box sx={{ flex: 1, overflow: 'hidden', p: 0, m: 0}}>  {/* 添加容器 */}
        <ProjectTableEditor />
        {/*<ProjectTableEditorAnt />*/}
      </Box>
    </Box>
  );
}