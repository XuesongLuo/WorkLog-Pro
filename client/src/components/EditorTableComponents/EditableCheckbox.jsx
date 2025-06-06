// src/components/EditorTableComponents/EditableCheckbox.jsx
import React from 'react';
import { Box, Checkbox } from '@mui/material';

const EditableCheckbox = React.memo(function EditableCheckbox({ 
  value, 
  onChange, 
  disabled = false 
}) {
  return (
    <Box>
      <Checkbox 
        checked={value || false}
        disabled={disabled}
        onChange={onChange}
        size="small"
        sx={{
          p: 0, // 更小的内边距
          m: 0,   // 去除margin
          '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
        }}
      />
    </Box>
  );
});

export default EditableCheckbox;