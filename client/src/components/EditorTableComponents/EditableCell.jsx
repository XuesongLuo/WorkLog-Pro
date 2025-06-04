// src/components/EditorTableComponents/EditableCell.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';

function EditableCell({ field, value, onChange, disabled = false }) {
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  // 当 props.value 改变时，同步更新本地 draft（若非正在编辑或可根据需要调整条件）
  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  // 失焦时提交修改
  const handleBlur = useCallback(() => {
    if (!disabled && draft !== value) {
      // 调用上传回调，签名与现有 DataRow 的 change 函数一致
      onChange(field, null, draft); 
    }
    // 可在此重置 draft 或保持现有值，视需求决定
  }, [field, value, draft, disabled, onChange]);

  return (
    <Box 
      onClick={() => { 
        // 若需要点击单元格时聚焦输入框：
        if (!disabled) inputRef.current?.focus();
      }} 
      sx={{ p: 0.5 }}  /* 可选：减少内边距，使输入框更贴合单元格 */
    >
      <TextField
        inputRef={inputRef}
        variant="standard"
        fullWidth
        multiline  // 支持多行文本
        maxRows={10}
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        // 删除 onKeyDown 中对 Enter/Esc 的处理，保留默认行为
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            textAlign: 'center',
            p: '4px'
          },
          // 根据需要可调整 TextField 外观，使其与单元格融合
        }}
      />
    </Box>
  );
}

export default React.memo(EditableCell);