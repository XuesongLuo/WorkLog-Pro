//client  /src/api/tasks.js

export const api = {

  getTasks: () => fetch('/api/tasks').then(res => res.json()),  
  
  getTask: (id) => fetch(`/api/tasks/${id}`).then(res => res.json()),

  getTaskDescription: (id) =>
    fetch(`/api/tasks/${id}/description`).then(res => res.json()),

  
  createTask: (data) =>
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  
  updateTask: (id, data) =>
    fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateTaskDescription: (id, description) =>
    fetch(`/api/tasks/${id}/description`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    }).then(res => res.json()),
  
  deleteTask: (id) =>
    fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),
};