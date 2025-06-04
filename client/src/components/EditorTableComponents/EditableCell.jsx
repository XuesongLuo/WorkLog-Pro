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

/**
 * Popover 行内编辑版 EditableCell
 *
 * props
 * ─────────────────────────────────────────
 * rowIndex : number     // 行号（仅用于 key 或调试，不会回传）
 * field    : string     // 字段名，如 'year' | 'insurance' …
 * value    : any        // 当前值
 * onChange : (section:string, key:null, value:any) => void
 *            与 DataRow.useRowCallbacks 返回的 change 保持一致：
 *            1️⃣ section = 字段名
 *            2️⃣ key     = null（顶层字段）
 *            3️⃣ value   = 新值
 */
function EditableCell({ field, value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null); // Popover 锚点
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  /**
   * 打开编辑器
   */
  const openEditor = (e) => {
    console.log('openEditor called for field:', field, 'event:', e);
    setDraft(value ?? '');       // 每次打开时取最新值
    const target = e.currentTarget;
    //setAnchorEl(e.currentTarget);
    if (target && document.contains(target)) {
      setAnchorEl(target);
      setTimeout(() => {
        if (document.contains(target)) {
          setAnchorEl(target);
        } else {
          console.warn('Event target no longer in DOM');
          setAnchorEl(null);
        }
      }, 0);
    } else {
      console.warn('Cell ref not available');
    }
  };

  /**
   * 关闭 Popover
   */
  const closeEditor = useCallback(() => {
    console.log('closeEditor called');
    setAnchorEl(null);
  }, []);

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

  useEffect(() => {
    /*
    console.log('EditableCell state:', { field, anchorEl, open: Boolean(anchorEl) });
    if (anchorEl && !document.contains(anchorEl)) {
      console.warn('anchorEl is invalid, resetting');
      setAnchorEl(null);
    }
    */
  }, [anchorEl, field]);

  const open = Boolean(anchorEl);
  const baseWidth = anchorEl?.getBoundingClientRect().width ?? 100;
  const popWidth  = Math.min(baseWidth + 16, 180);

  return (
    <>
      {/* 展示态 */}
      <TableCell sx={cellStyles} onClick={openEditor}>
        {value || ' '}
      </TableCell>

      {/* 编辑态 */}
      <Popover
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
          onKeyDown={(e) => e.key === 'Enter' && commit()}
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
