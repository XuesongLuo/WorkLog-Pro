// src/components/EditorTableComponents/EditableTextfield.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';

function EditableCell({ field, value, onChange, disabled = false }) {
  const [draft, setDraft] = useState(value ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  // 当 props.value 改变时，同步更新本地 draft（若非正在编辑或可根据需要调整条件）
  useEffect(() => {
    if (!isEditing) {
      setDraft(value ?? '');
    }
  }, [value, isEditing]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!disabled && draft !== value) {
      onChange(field, null, draft);
    }
  }, [field, value, draft, disabled, onChange]);

  const handleChange = useCallback((e) => {
    setDraft(e.target.value);
  }, []);

  return (
    <Box
      onClick={() => { 
        // 若需要点击单元格时聚焦输入框：
        if (!disabled) inputRef.current?.focus();
      }} 
      sx={{ 
        p: 0,
        m: 0,
        display: 'flex',
        alignItems: 'center',     // ★ 垂直居中
        justifyContent: 'center', // ★ 水平居中（如果需要）
        width: "100%", 
        height: "100%"
      }}  
    >
      <TextField
        inputRef={inputRef}
        variant="standard"
        fullWidth
        multiline  // 支持多行文本
        maxRows={10}
        value={draft}
        disabled={disabled}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            textAlign: 'center',
            p: 0
          },
          '& .MuiInput-underline:before': {
            borderBottom: 'none !important', // 常规状态无下划线
          },
          '& .MuiInput-underline:hover:before': {
            borderBottom: '1px solid #1976d2 !important', // hover时有下划线，可换你想要的颜色
          },
          // 根据需要可调整 TextField 外观，使其与单元格融合
        }}
      />
    </Box>
  );
}

export default React.memo(EditableCell);