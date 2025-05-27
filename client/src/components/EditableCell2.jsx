import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { TableCell, TextField } from '@mui/material';


// 将样式对象提取到组件外部，避免每次渲染都重新创建
const cellStyles = {
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    padding: '4px',
};


const getTextFieldStyles = (isEditing) => ({
    transition: 'none !important',
    width: '100%',
    '& .MuiInputBase-root': {
        padding: 0,
        height: '100%',
        overflow: 'hidden',
        transition: 'none !important',
    },
    '& .MuiInputBase-input': {
        fontSize: '0.875rem',
        padding: 0,
        lineHeight: '1.43',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        height: '100%',
        transition: 'none !important',
    },
    '& .MuiInput-underline:before': {
        borderBottom: isEditing ? '1px solid #ddd' : '0px',
    },
    '& .MuiInput-underline:after': {
        borderBottom: isEditing ? '1px solid #000' : '0px',
        transition: 'none !important',
    },
});

function EditableCell({ rowIndex, field, value, onChange }) {
    const [editing, setEditing] = useState(false);
    const isEditing = editing;
    const [draft, setDraft]   = useState(value); 
    const inputRef = useRef();

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    // 使用useMemo缓存样式对象
    const textFieldStyles = useMemo(() => getTextFieldStyles(isEditing), [isEditing]);
    
    // 单元格“提交”
    const commit = () => {
        setEditing(false);
            if (draft !== value) onChange(rowIndex, field, null, draft);
        };

   return (
    <TableCell
        sx={cellStyles}
        onClick={() => !editing && setEditing(true)}
    >
        {editing ? (
        <TextField
            inputRef={inputRef}
            fullWidth
            variant="standard"
            multiline
            maxRows={10}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && commit()}
            sx={getTextFieldStyles(true)}
        />
        ) : (
        <span>{value || ' '}</span>
        )}
    </TableCell>
    );
};

export default memo(EditableCell);