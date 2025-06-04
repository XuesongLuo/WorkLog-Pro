// src/components/EditorTableComponents/EstimateCell.jsx
import React from 'react';
import { TableCell, Box, Checkbox } from '@mui/material';
import EditableNumberCell from './EditableNumberCell';

function EstimateCell({ checked, amount, onCheckChange, onAmountChange, disabled }) {
  return (
    <TableCell 
      align="center" 
      sx={{ verticalAlign: 'top', minWidth: 60, minHeight: 60 }}  // 确保列宽和行高
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        {/* 复选框 */}
        <Checkbox 
          size="small"
          checked={checked || false}
          onChange={onCheckChange}
          disabled={disabled}
          sx={{ mb: 0.5 }}
        />
        {/* 数字输入区域（可编辑） */}
        <EditableNumberCell 
          value={amount || ''} 
          onChange={onAmountChange}
          disabled={disabled}
        />
      </Box>
    </TableCell>
  );
}

export default React.memo(EstimateCell);