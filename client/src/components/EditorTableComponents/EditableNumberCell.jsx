// src/components/EditorTableComponents/EditableNumberCell.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';

function EditableNumberCell({ value, onChange, disabled = false, }) {
  const [draft, setDraft] = useState(value ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!disabled && draft !== value) {
      let v = draft;
      if (v !== '') {
        let n = Number(v);
        if (!isNaN(n)) {
          v = n.toFixed(2);  // 强制两位小数
          onChange(Number(v)); // 保证父组件拿到的就是数值型
        } else {
          onChange('');
        }
      } else {
        onChange('');
      }
      setDraft(v); // 输入框显示格式化后的
    }
  }, [value, draft, disabled, onChange]);

  const handleChange = useCallback((e) => {
    let val = e.target.value;
    if (val === '') {
      setDraft('');
      return;
    }
    // 只允许数字/小数点，最多两位小数
    if (!/^\d*(\.\d{0,2})?$/.test(val)) {
      return; // 非法输入直接忽略
    }
    setDraft(val);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setDraft(value ?? '');
    }
  }, [value, isEditing]);

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
        onChange={e => {
          // 只允许数字或空
          let val = e.target.value;
          if (val === '') {
            onChange('');
            return;
          }
          // 保证最多两位小数
          if (!/^\d*(\.\d{0,2})?$/.test(val)) {
            return;
          }
          onChange(val);
        }}
        inputProps={{ style: { textAlign: 'center' } }}  // 数字居中显示
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '12px',
            textAlign: 'center',
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "12px",
            paddingBottom: "0px"
          },
          // 移除默认的数字上下箭头（spin buttons）
          '& input[type=number]': { MozAppearance: 'textfield' },
          '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0},
          '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0},
          /*
          '& .MuiInput-underline:before': {
            borderBottom: 'none !important', // 常规状态无下划线
          },
          */
          '& .MuiInput-underline:hover:before': {
            borderBottom: '1px solid #1976d2 !important', // hover时有下划线，可换你想要的颜色
          },
        }}
      />
    </Box>
  );
}

export default React.memo(EditableNumberCell);