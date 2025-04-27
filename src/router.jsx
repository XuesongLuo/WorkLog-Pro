// src/router.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import TaskDetailPage from './pages/TaskDetailPage'; // 预留页面
import CreateOrEditTaskPage from './pages/CreateOrEditTaskPage'; // 预留页面


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/task/:id', element: <TaskDetailPage /> },
  { path: '/task/new', element: <CreateOrEditTaskPage /> },
  { path: '/task/edit/:id', element: <CreateOrEditTaskPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}