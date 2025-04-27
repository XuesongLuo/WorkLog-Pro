// src/context/TaskContext.jsx
import { createContext, useReducer, useContext } from 'react';

const TaskContext = createContext();

const initialState = [
  {
    id: 1,
    title: '室内除霉任务',
    start: new Date(2025, 1, 24, 10, 0),
    end: new Date(2025, 1, 25, 12, 0),
    address: '4324 McCart Ave',
    city: '上海',
    "zipcode": "430070",
    company: '除霉大师',
    manager: '赵六',
    applicant: '刘二',
    type: '除霉处理',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  {
    id: 2,
    title: '后院修整项目',
    start: new Date(2025, 3, 15, 9, 0),
    end: new Date(2025, 3, 28, 17, 0),
    address: '123 花园路',
    city: '武汉',
    "zipcode": "430070",
    company: '清洁之家',
    manager: '李强',
    applicant: '王伟',
    type: '室外工程',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n\n项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。\n'
  },
  {
    id: 3,
    title: '后院泳池',
    start: new Date(2025, 3, 26, 10, 0),
    end: new Date(2025, 3, 29, 12, 0),
    address: '2250 Patterson St Unit 174',
    city: 'Eugene',
    "zipcode": "97405",
    company: '后院速通',
    manager: 'Zee',
    applicant: 'Zee',
    type: '后院施工',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
];

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { ...action.payload, id: Date.now() }];
    case 'UPDATE_TASK':
      return state.map((task) => (task.id === action.payload.id ? action.payload : task));
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
