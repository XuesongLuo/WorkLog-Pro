//client  /src/api/tasks.js
const BASE = import.meta.env.VITE_API_URL || '';

export const api = {

  getTasks: () => fetch(`${BASE}/api/tasks`)
                    .then(res => res.json()),  
  
  getTask: (id) => fetch(`${BASE}/api/tasks/${id}`).then(res => res.json()),

  getTaskDescription: (id) =>
    fetch(`${BASE}/api/tasks/${id}/description`).then(res => res.json()),

  
  createTask: (data) =>
    fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  
  updateTask: (id, data) =>
    fetch(`${BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateTaskDescription: (id, description) =>
    fetch(`${BASE}/api/tasks/${id}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    }).then(res => res.json()),
  
  deleteTask: (id) =>
    fetch(`${BASE}/api/tasks/${id}`, {
      method: 'DELETE',
    }),
};