// server/mockData.js

// 时间统一格式为 ISO 字符串（便于 JSON 存储）
const mockTasks = [
  {
    id: 1,
    title: '室内除霉任务',
    start: '2025-05-24T10:00:00.000Z',
    end: '2025-05-25T12:00:00.000Z',
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
    start: '2025-05-15T09:00:00.000Z',
    end: '2025-05-28T17:00:00.000Z',
    address: '123 花园路',
    city: '武汉',
    zipcode: "430070",
    company: '清洁之家',
    manager: '李强',
    applicant: '王伟',
    type: '室外工程',
    descriptions: '项目细节：需要清理杂草，修建围栏，重新铺设草坪。注意施工期间安全防护。'
  },
  // ... 如需更多，可粘贴前端 TaskContext 中生成的条目（建议删掉重复的）
];

module.exports = mockTasks;
