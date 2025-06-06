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
      sx={{ p: 0.5 }}
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