// EditableNumberField.jsx
import React from 'react';
import { TableCell, TextField } from '@mui/material';

const EditableNumberField = React.memo(function EditableNumberField({
  value,
  onChange,
  disabled = false
}) {
  return (
    <TableCell>
      <TextField
        type="number"
        size="small"
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            paddingRight: 0
          },
          '& .MuiInputBase-input': {
            paddingLeft: '2px',
            paddingRight: '2px',
            paddingTop: '4px',
            paddingBottom: '4px',
            fontSize: '0.85rem'
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0
          },
        }}
      />
    </TableCell>
  );
});

export default EditableNumberField;