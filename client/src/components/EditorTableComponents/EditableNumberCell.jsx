// src/components/EditorTableComponents/EditableNumberCell.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';

function EditableNumberCell({ value, onChange, disabled = false }) {
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  const handleBlur = useCallback(() => {
    if (!disabled && draft !== value) {
      // 提交数值变更，将字符串转换为数字或按需要处理
      onChange(draft);
    }
  }, [value, draft, disabled, onChange]);

  return (
    <Box 
      onClick={() => { if (!disabled) inputRef.current?.focus(); }}
      sx={{ p: 0.5 }}
    >
      <TextField 
        inputRef={inputRef}
        type="number"
        variant="standard"
        fullWidth
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        inputProps={{ style: { textAlign: 'center' } }}  // 数字居中显示
        sx={{
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            padding: '4px'
          },
          // 移除默认的数字上下箭头（spin buttons）
          '& input[type=number]': { MozAppearance: 'textfield' },
          '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
          '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 }
        }}
      />
    </Box>
  );
}

export default React.memo(EditableNumberCell);