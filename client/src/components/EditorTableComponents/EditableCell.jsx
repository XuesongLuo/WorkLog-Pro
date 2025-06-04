// src/components/EditorTableComponents/EditableCell.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TableCell, Popover, TextField } from '@mui/material';

// 公共样式：与表格保持一致
const cellStyles = {
  cursor: 'pointer',
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  padding: '4px',
  fontSize: '0.875rem',
  backgroundColor: 'lightblue', // 调试用
};

function EditableCell({ field, value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null); // Popover 锚点
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);
  const cellRef = useRef(null);
  /**
   * 打开编辑器
   */
  const openEditor = useCallback((e) => {
    console.log('openEditor called', { cellRef: cellRef.current });
    /*
    if (cellRef.current) {
      setAnchorEl(cellRef.current);
      setDraft(value ?? '');
    }
    */
    setAnchorEl(e.currentTarget);
  }, [value]);

  /**
   * 关闭 Popover
   */
  const closeEditor = useCallback(() => {
    console.log('closeEditor called');
    setAnchorEl(null);
  }, []);

  /**
   * 取消修改（恢复原值）
   */
  const cancel = useCallback(() => {
    console.log('cancel called');
    setDraft(value ?? '');
    closeEditor();
  }, [value, closeEditor]);

  /**
   * 提交修改
   * 注意：这里调用 onChange 的签名必须与 DataRow 的 `change` 一致。
   * 不需要 rowIndex，因为 DataRow 已经在闭包里注入。
   */
  const commit = useCallback(() => {
    console.log('commit called:', { draft, value });
    closeEditor();
    if (draft !== value) {
      onChange(field, null, draft); // ✅ section = field, key = null
    }
  }, [closeEditor, draft, value, field, onChange]);

  const open = Boolean(anchorEl);
  const baseWidth = anchorEl?.getBoundingClientRect().width ?? 100;
  const popWidth  = Math.min(baseWidth + 16, 180);

  useEffect(() => {
    console.log('EditableCell state:', { field, anchorEl, open: Boolean(anchorEl) });
    console.log('Popover opened', { anchorEl });
    if (!anchorEl) return;
    if (!document.contains(anchorEl) && cellRef.current) {
      console.warn('anchorEl is invalid, resetting');
      setAnchorEl(cellRef.current);
    }
    
  }, [anchorEl]);


  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  useEffect(() => {
    if (anchorEl && inputRef.current) {
      inputRef.current.focus();
    }
  }, [anchorEl]);

  return (
    <>
      {/* 展示态 */}
      <TableCell ref={cellRef} sx={cellStyles} onClick={openEditor}>
        {value || ' '}
      </TableCell>

      {/* 编辑态 */}
      <Popover
        //open={Boolean(anchorEl)}
        open={open}
        anchorEl={anchorEl}
        onClose={commit}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ 
            sx: { 
                p: 0.5,
                width: popWidth 
            } 
        }}
      >
        <TextField
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (open) commit()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') cancel();
          }}
          variant="standard"
          autoFocus
          multiline
          maxRows={10}
          sx={{
            width: '100%',  
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              p: '4px',
              textAlign: 'center',
            },
          }}
        />
      </Popover>
    </>
  );
}

export default React.memo(EditableCell);
