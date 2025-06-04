// src/components/EditorTableComponents/EditableNumberCell.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Popover, TextField } from '@mui/material';

// 样式：与表格单元格保持一致
const numberCellStyle = {
  cursor: 'pointer',
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  padding: '4px',
  fontSize: '0.875rem',
  width: '100%',  // 占满父容器宽度，便于点击和对齐
  backgroundColor: 'lightblue',
};

function EditableNumberCell({ value, onChange, disabled = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [draft, setDraft] = useState(value ?? '');
  const cellRef = useRef(null);

  // 打开编辑浮层（除非处于禁用状态）
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
    if (draft !== value) {
      onChange(draft);
    }
  }, [draft, value, onChange, closeEditor]);

  // 取消修改（恢复原值）
  const cancel = useCallback(() => {
    setDraft(value ?? '');
    closeEditor();
  }, [value, closeEditor]);

  // 同步外部 value 改变到本地 draft
  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  const open = Boolean(anchorEl);
  // 计算弹出层宽度：略大于触发元素宽度，但设定上限
  const baseWidth = anchorEl?.getBoundingClientRect().width || 100;
  const popWidth = Math.min(baseWidth + 16, 180);

  return (
    <>
      {/* 展示态内容区域 */}
      <Box 
        ref={cellRef} 
        sx={numberCellStyle} 
        onClick={openEditor}
      >
        {value || ' '}
      </Box>
      {/* 编辑态弹出层 */}
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
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => open && commit()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') cancel();
          }}
          inputProps={{
            style: { textAlign: 'center' }  // 数字输入内容居中
          }}
          sx={{
            width: '100%',
            '& .MuiInputBase-input': {
              p: '4px',
              fontSize: '0.875rem'
            },
            // 去掉数字输入框自带的上下箭头
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