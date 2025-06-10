// src/utils/fetcher.js
import { enqueueSnackbar } from 'notistack';

let loadingApi; // 延迟注入，避免循环依赖

export function injectLoading(ctx) { loadingApi = ctx; }

export async function fetcher(url, options = {}) {
  loadingApi?.start();
  try {

    // 1. 获取token
    const token = localStorage.getItem('token');

    // 2. 合并headers
    options.headers = options.headers || {};
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    if (options.method === 'DELETE') return true;
    return res.json();
  } catch (err) {
    enqueueSnackbar(`请求失败：${err.message}`, { variant: 'error' });
    throw err;
  } finally {
    loadingApi?.end();
  }
}
