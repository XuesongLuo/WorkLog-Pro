// src/components/EditorTableComponents/EditableNumberCell.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';

function EditableNumberCell({ value, onChange, disabled = false }) {
  const [draft, setDraft] = useState(value ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

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
      onChange(draft);
    }
  }, [value, draft, disabled, onChange]);

  const handleChange = useCallback((e) => {
    setDraft(e.target.value);
  }, []);

  return (
    <Box 
      onClick={() => { if (!disabled) inputRef.current?.focus(); }}
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
        type="number"
        variant="standard"
        fullWidth
        value={draft}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputProps={{ style: { textAlign: 'center' } }}  // 数字居中显示
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            textAlign: 'center',
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "12px",
            paddingBottom: 0
          },
          // 移除默认的数字上下箭头（spin buttons）
          '& input[type=number]': { MozAppearance: 'textfield' },
          '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0},
          '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0},
          '& .MuiInput-underline:before': {
            borderBottom: 'none !important', // 常规状态无下划线
          },
          '& .MuiInput-underline:hover:before': {
            borderBottom: '1px solid #1976d2 !important', // hover时有下划线，可换你想要的颜色
          },
        }}
      />
    </Box>
  );
}

export default React.memo(EditableNumberCell);