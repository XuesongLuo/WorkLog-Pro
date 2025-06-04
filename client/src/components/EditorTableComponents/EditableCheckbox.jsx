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
      />
    </Box>
  );
});

export default EditableCheckbox;