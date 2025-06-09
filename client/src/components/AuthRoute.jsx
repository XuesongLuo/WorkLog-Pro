// src/components/AuthRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

// 关键：判断环境变量
const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === 'true';
console.log('111AUTH_DISABLED:', AUTH_DISABLED); // 建议打印调试

export default function AuthRoute({ children }) {
  const location = useLocation();
  console.log('2222AUTH_DISABLED:', AUTH_DISABLED); 
  if (AUTH_DISABLED) {
    // 开发环境直接放行
    console.log(111)
    return children;
  }
  if (!isLoggedIn()) {
    // 未登录则重定向到登录页，保留原路由
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}