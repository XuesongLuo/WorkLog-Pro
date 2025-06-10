// src/api/authApi.js
import { fetcher } from '../utils/fetcher';

export async function login(username, password) {
  return await fetcher('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

// 也可以加登出、注册等方法
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
