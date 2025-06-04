import React from 'react';
import { TableCell, Box, Checkbox, TextField } from '@mui/material';
import EditableDate from './EditableDate';

const ToggleBox = React.memo(function ToggleBox({section, data, onToggleActive, onDateChange}) {
  const { active, startDate } = data;

  const toggle = React.useCallback(
    () => onToggleActive(section), 
    [section, onToggleActive]
  );
  const changeDate = React.useCallback(
    e => onDateChange(section, 'startDate', e.target.value),
    [section, onDateChange]
  );

  return (
    <TableCell
      sx={{
        backgroundColor: '#f8bcbc',
        minHeight: 60,
        minWidth: 110,
        verticalAlign: 'top',
        position: 'relative',
        p: 0
      }}
    >
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
         {/*
        <TextField
          type="date"
          size="small"
          value={startDate || ''}
          onChange={changeDate}
          disabled={!active}
          fullWidth
          sx={{
            '& .MuiInputBase-input': { p: '4px', fontSize: '0.85rem' },
            '& .MuiOutlinedInput-root': { pr: 0 }
          }}
        />
        */}
        <EditableDate
          value={startDate}
          onChange={changeDate}
          disabled={!active}
        />
      </Box>
    </TableCell>
  );
}, 
// 自定义比较函数：只有当 active 状态改变时才重新渲染整个组件
// 日期字段变化不会触发整个 ToggleBox 重渲染
(prevProps, nextProps) => {
  return prevProps.data.active === nextProps.data.active &&
         prevProps.section === nextProps.section;
});
//(a, b) => a.data === b.data);     // 只有 pak/wtr/str 对象引用变才重绘

export default ToggleBox;
