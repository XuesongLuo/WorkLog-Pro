// src/utils/authUtils.js

// 是否已登录（检测token是否存在且有效）
export function isLoggedIn() {
  const token = localStorage.getItem('token');
  // 可选：简单判断是否存在，复杂场景可解码/校验token是否过期
  return !!token;
}

// 获取当前用户（user对象）
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// 登出（清理本地缓存）
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// 可选：获取token
export function getToken() {
  return localStorage.getItem('token');
}