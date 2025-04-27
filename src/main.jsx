import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router.jsx';
import './i18n';

import { TaskProvider } from './context/TaskContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskProvider>
    <AppRouter />
    </TaskProvider>
  </StrictMode>
);
