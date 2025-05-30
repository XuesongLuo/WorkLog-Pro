if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
}

if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function (id) {
    clearTimeout(id);
  };
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router.jsx';
import './i18n';
import { LoadingProvider } from './contexts/LoadingContext';
import { TaskProvider } from './contexts/TaskStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <TaskProvider>
         <AppRouter />
      </TaskProvider>
    </LoadingProvider>
  </StrictMode>
);
