// src/context/TaskContext.jsx
import { createContext, useReducer, useContext, useMemo } from 'react';

const TaskContext = createContext();

// 初始数据只保留结构而不重复大量内容
const initialState = [
  {
    id: 1,
    title: '室内除霉任务',
    start: new Date(2025, 1, 24, 10, 0),
    end: new Date(2025, 1, 25, 12, 0),
    address: '4324 McCart Ave',
    city: '上海',
    zipcode: "430070",
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
    zipcode: "430070",
    company: '清洁之家',
    manager: '李强',
    applicant: '王伟',
    type: '室外工程',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  {
    id: 3,
    title: '后院泳池',
    start: new Date(2025, 3, 26, 10, 0),
    end: new Date(2025, 3, 29, 12, 0),
    address: '2250 Patterson St Unit 174',
    city: 'Eugene',
    zipcode: "97405",
    company: '后院速通',
    manager: 'Zee',
    applicant: 'Zee',
    type: '后院施工',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  {
    id: 4,
    title: '后院泳池',
    start: new Date(2025, 3, 26, 10, 0),
    end: new Date(2025, 3, 29, 12, 0),
    address: '2250 Patterson St Unit 174',
    city: 'Eugene',
    zipcode: "97405",
    company: '后院速通',
    manager: 'Zee',
    applicant: 'Zee',
    type: '后院施工',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  {
    id: 5,
    title: '后院泳池',
    start: new Date(2025, 3, 26, 10, 0),
    end: new Date(2025, 3, 29, 12, 0),
    address: '2250 Patterson St Unit 174',
    city: 'Eugene',
    zipcode: "97405",
    company: '后院速通',
    manager: 'Zee',
    applicant: 'Zee',
    type: '后院施工',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  {
    id: 6,
    title: '后院泳池',
    start: new Date(2025, 3, 26, 10, 0),
    end: new Date(2025, 3, 29, 12, 0),
    address: '2250 Patterson St Unit 174',
    city: 'Eugene',
    zipcode: "97405",
    company: '后院速通',
    manager: 'Zee',
    applicant: 'Zee',
    type: '后院施工',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  
];

// 动态创建更多任务用于测试
function createMoreTasks(baseState, count = 20) {
  const result = [...baseState];
  const baseTask = baseState[2]; // 使用第三个任务作为模板
  
  // 创建一个很长的描述文本，模拟实际场景中的大量文本
  const longDescription = `
项目细节：这是一个复杂的后院改造项目，需要进行全面规划和实施。首先，我们需要清理现有的杂草和杂物，确保工作区域干净整洁。然后，我们将进行土壤评估，确定是否需要额外的土壤改良措施。接下来，我们将按照设计图纸修建新的围栏系统，包括设置门和栅栏柱。之后，我们将进行草坪铺设，包括地面平整、土壤准备和草皮铺设。在此过程中，我们还将安装灌溉系统，确保新草坪得到适当的水分。

安全注意事项：施工期间，工作区域将被围起来，防止未经授权的人员进入。所有工人都必须佩戴适当的安全装备，包括安全帽、手套和工作靴。在挖掘过程中，我们将确保已标记所有地下公用设施的位置，以避免意外损坏。如果发现任何安全隐患，工作将立即停止，直到问题得到解决。

材料规格：本项目将使用优质的围栏材料，包括防腐处理的木材或复合材料，具体取决于客户偏好。草皮将使用当地适应性强的草种，确保长期存活和美观。灌溉系统将包括高效节水喷头和自动控制器，允许根据天气条件进行调整。

时间安排：项目计划在X天内完成，具体如下：
第1-2天：场地准备和清理
第3-4天：围栏安装
第5-6天：灌溉系统安装
第7-8天：草坪铺设
第9-10天：最终检查和清理

额外考虑因素：如果在项目执行过程中遇到恶劣天气，时间表可能需要调整。任何发现的地下问题（如岩石或旧基础设施）可能需要额外的工作和时间来解决。客户对设计的任何更改可能会影响项目范围和时间表。

完工后，我们将提供详细的维护指南，帮助客户正确护理新安装的草坪和围栏系统。这将包括灌溉调度建议、草坪修剪频率以及围栏维护提示。

项目保证：我们的工作享有X年保修，涵盖任何工艺缺陷。如果在保修期内发现任何问题，我们将免费进行必要的修复或更换。
`.repeat(5); // 重复5次使其非常长
  
  for (let i = 0; i < count; i++) {
    const id = baseState.length + i + 1;
    const startDate = new Date(baseTask.start);
    startDate.setDate(startDate.getDate() + i); // 每个任务间隔1天
    
    const endDate = new Date(baseTask.end);
    endDate.setDate(endDate.getDate() + i);
    
    result.push({
      ...baseTask,
      id,
      title: `后院泳池 #${id}`,
      start: startDate,
      end: endDate,
      descriptions: longDescription // 使用非常长的描述文本
    });
  }
  
  return result;
}

// 创建扩展的初始状态
const expandedInitialState = createMoreTasks(initialState);

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
  const [tasks, dispatch] = useReducer(taskReducer, expandedInitialState);

  // 添加性能优化: 使用useMemo缓存任务列表，避免不必要的重渲染
  const contextValue = useMemo(() => ({
    tasks,
    dispatch
  }), [tasks]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}