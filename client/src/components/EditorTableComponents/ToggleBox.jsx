// src/components/EditorTableComponents/ToggleBox.jsx
import React from 'react';
import { Box, Checkbox } from '@mui/material';
import EditableDate from './EditableDate';

const ToggleBox = React.memo(function ToggleBox({section, data, onToggleActive, onDateChange}) {
  const { active, startDate } = data;

  const toggle = React.useCallback( () => {
    console.log('ToggleBox toggle clicked:', section);
    onToggleActive(section);  
  }, [section, onToggleActive]);

  const changeDate = React.useCallback(
    e => onDateChange(section, 'startDate', e.target.value),
    [section, onDateChange]
  );

  return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 0,
          boxSizing: 'border-box'
        }}
      >
        <Checkbox
          size="small"
          checked={active}
          onChange={toggle}
          sx={{
            position: 'absolute',
            top: 5,
            left: 5,
            p: 0,
            m: 0,
            '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
          }}
        />
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
          <EditableDate
            value={startDate}
            onChange={changeDate}
            disabled={!active}
          />
        </Box>
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

export default ToggleBox;
