// EditableCheckbox.jsx
import React from 'react';
import { TableCell, Checkbox } from '@mui/material';

const EditableCheckbox = React.memo(function EditableCheckbox({ 
  value, 
  onChange, 
  disabled = false 
}) {
  return (
    <TableCell>
      <Checkbox 
        checked={value || false}
        disabled={disabled}
        onChange={onChange}
      />
    </TableCell>
  );
});

export default EditableCheckbox;