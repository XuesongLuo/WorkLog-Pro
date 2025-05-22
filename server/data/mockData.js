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
  },
  // ... 如需更多，可粘贴前端 TaskContext 中生成的条目（建议删掉重复的）
];

const mockTaskDescriptions = {
    1: `
    <p><strong>项目细节：</strong>清除霉斑与异味，施工区域包括厨房与浴室。</p>
    <p><em>注意事项：</em></p>
    <ul>
      <li>工人需佩戴防护口罩</li>
      <li>避免化学清洗剂残留</li>
      <li>预计工期：<strong>2天</strong></li>
    </ul>
  `,
    2: `
    <p><strong>后院改造</strong>包括以下内容：</p>
    <ol>
      <li>清理杂草</li>
      <li>修建围栏</li>
      <li><em>铺设草坪（人工草或真草）</em></li>
    </ol>
    <p>所有施工由“清洁之家”负责。</p>
  `,
}

module.exports = {mockTasks, mockTaskDescriptions};
