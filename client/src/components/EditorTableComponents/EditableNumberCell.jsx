// src/components/EditorTableComponents/EditableNumberCell.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TableCell, Popover, TextField } from '@mui/material';

const numberCellStyle = {
  cursor: 'pointer',
  textAlign: 'center',
  padding: '4px',
  fontSize: '0.875rem'
  // 可根据需要增加其他样式，例如禁用时灰色背景等
};

function EditableNumberCell({ value, onChange, disabled = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [draft, setDraft] = useState(value ?? '');
  const cellRef = useRef(null);

  // 打开编辑浮层
  const openEditor = useCallback(() => {
    if (!disabled) {
      setAnchorEl(cellRef.current);
      setDraft(value ?? '');
    }
  }, [disabled, value]);

  // 关闭浮层
  const closeEditor = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // 提交修改
  const commit = useCallback(() => {
    closeEditor();
    // 将 draft 转换为数值或原格式后提交
    if (draft !== value) {
      onChange(draft);
    }
  }, [draft, value, onChange, closeEditor]);

  // 取消修改并关闭
  const cancel = useCallback(() => {
    setDraft(value ?? '');
    closeEditor();
  }, [value, closeEditor]);

  // 监听 value 变化，同步更新草稿值
  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  const open = Boolean(anchorEl);
  // 计算浮层宽度：略大于单元格宽度，设定上限
  const baseWidth = anchorEl?.getBoundingClientRect().width || 100;
  const popWidth = Math.min(baseWidth + 16, 180);

  return (
    <>
      {/* 展示状态单元格 */}
      <TableCell ref={cellRef} sx={numberCellStyle} onClick={openEditor}>
        {value || ' '}
      </TableCell>
      {/* 编辑浮层：点击单元格后出现 */}
      <Popover 
        open={open} 
        anchorEl={anchorEl} 
        onClose={commit}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 0.5, width: popWidth } }}
      >
        <TextField
          type="number"
          variant="standard"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => open && commit()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') cancel();
          }}
          inputProps={{
            // 控制数字输入的样式，去掉上下箭头
            style: { textAlign: 'center' },
          }}
          sx={{
            width: '100%',
            '& .MuiInputBase-input': {
              p: '4px',
              fontSize: '0.875rem',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none', margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none', margin: 0
            }
          }}
        />
      </Popover>
    </>
  );
}

export default React.memo(EditableNumberCell);
