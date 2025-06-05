// src/components/EditorTableComponents/ToggleBox.jsx
import React from 'react';
import { TableCell, Box, Checkbox, TextField } from '@mui/material';
import EditableDate from './EditableDate';

const ToggleBox = React.memo(function ToggleBox({section, data, onToggleActive, onDateChange}) {
  const { active, startDate } = data;

  const toggle = React.useCallback( () => onToggleActive(section),  [section, onToggleActive]);

  const changeDate = React.useCallback(
    e => onDateChange(section, 'startDate', e.target.value),
    [section, onDateChange]
  );

  return (
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          py: 0.5,
          boxSizing: 'border-box'
        }}
      >
        <Checkbox
          size="small"
          checked={active}
          onChange={toggle}
          sx={{
            position: 'absolute',
            top: 2,
            left: 2,
            p: 0,
            '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
          }}
        />
       
        <EditableDate
          value={startDate}
          onChange={changeDate}
          disabled={!active}
        />
      </Box>
  );
}, 
// 自定义比较函数：只有当 active 状态改变时才重新渲染整个组件
// 日期字段变化不会触发整个 ToggleBox 重渲染
(prevProps, nextProps) => {
  return prevProps.data.active === nextProps.data.active &&
         prevProps.data.startDate === nextProps.data.startDate &&
         prevProps.section === nextProps.section;
});
//(a, b) => a.data === b.data);     // 只有 pak/wtr/str 对象引用变才重绘

export default ToggleBox;
