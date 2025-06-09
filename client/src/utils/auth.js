// src/utils/auth.js
export function isLoggedIn() {
  // 推荐用token/session等方式
  return !!localStorage.getItem('user');
}