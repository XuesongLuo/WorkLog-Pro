// src/components/ProjectTableEditor.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';
import { useTasks } from '../contexts/TaskStore';
import {
  PakToggleCell,
  PakPoutCell,
  PakPackCell,
  WtrToggleCell,
  WtrCtrcCell,
  WtrDemoCell,
  WtrItelCell,
  WtrEqCell,
  WtrPickCell,
  StrToggleCell,
  StrCtrcCell,
  EstimateCell,
  LocationCell,
  YearCell,
  InsuranceCell,
  ArolCell,
  TestCell,
  PaymentCell,
  CommentsCell
} from './EditorTableComponents/EditTableCells';


function useContainerWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(1200);
  
    useEffect(() => {
      function updateWidth() {
        if (ref.current) setWidth(ref.current.offsetWidth);
        else setWidth(window.innerWidth);
      }
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);
    
    return [ref, width];
  }


export default function ProjectTableEditor() {
  const { progress, api } = useTasks();
  const [containerRef, containerWidth] = useContainerWidth();
  
  // 优化后的 rows 创建
  const rows = useMemo(() => {
    if (!progress) return [];
    return Object.entries(progress).map(([p_id, record]) => ({
      p_id,
      ...record
    }));
  }, [progress]);

  // 稳定的回调函数
  const handleChange = useCallback((rowId, section, key, value) => {
    if (!rowId) return;
    const patch = key == null
      ? { [section]: value }
      : { [section]: { [key]: value } };
    api.mergeProgress(rowId, patch);
    api.saveCell(rowId, patch);
    console.log("api.saveCell: ", rowId, patch)
  }, [api]);

  const handleToggleActive = useCallback((rowId, section) => {
    if (!rowId) return;
    const rowObj = progress[rowId];
    if (!rowObj) return;
    const newActive = !rowObj[section]?.active;
    const patch = { [section]: { active: newActive } };
    api.mergeProgress(rowId, patch);
    api.saveCell(rowId, patch);
  }, [api, progress]);

  // 优化后的列定义
  const columns = useMemo(() => [
    {
        header: 'LOCATION',
        baseWidth: 110,
        accessorKey: 'location',
        Cell: ({ row }) => <LocationCell row={row} onChange={handleChange} />,
    },
    {
        header: 'YEAR',
        baseWidth: 60,
        accessorKey: 'year',
        Cell: ({ row }) => <YearCell row={row} onChange={handleChange} />,
    },
    {
        header: 'INSURANCE',
        baseWidth: 80,
        accessorKey: 'insurance',
        Cell: ({ row }) => <InsuranceCell row={row} onChange={handleChange} />,
    },
    {
        header: 'AROL',
        baseWidth: 50,
        accessorKey: 'arol',
        Cell: ({ row }) => <ArolCell row={row} onChange={handleChange} />,
    },
    {
        header: 'TEST',
        accessorKey: 'test',
        baseWidth: 50,
        Cell: ({ row }) => <TestCell row={row} onChange={handleChange} />,
    },

    // PAK 部分
    {
        header: 'PAK',
        baseWidth: 80,
        accessorKey: 'pak',
        Cell: ({ row }) => (
          <PakToggleCell 
            row={row} 
            onToggleActive={handleToggleActive}
            onDateChange={handleChange}
          />
        ),
    },
    {
        header: 'POUT',
        baseWidth: 50,
        accessorKey: 'pak.pout',
        id: 'pak_pout',
        Cell: ({ row }) => <PakPoutCell row={row} onChange={handleChange} />,
    },
    {
        header: 'PACK',
        baseWidth: 50,
        accessorKey: 'pak.pack',
        id: 'pak_pack',
        Cell: ({ row }) => <PakPackCell row={row} onChange={handleChange} />,
    },
    
    // PAK ESTIMATE 分组
    {
        header: (
            <>
              ESTIMATE<br/>SEND
            </>
          ),
        baseWidth: 75,
        id: 'pak_est_send',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="pak" 
            type="Send" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header:(
            <>
              ESTIMATE<br/>REVIEW
            </>
          ),
        baseWidth: 75,
        id: 'pak_est_review',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="pak" 
            type="Review" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header: (
            <>
              ESTIMATE<br/>AGREE
            </>
          ),
        baseWidth: 75,
        id: 'pak_est_agree',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="pak" 
            type="Agree" 
            onChange={handleChange} 
          />
        ),
    },

    // WTR 部分
    {
        header: 'WTR',
        accessorKey: 'wtr',
        baseWidth: 80,
        Cell: ({ row }) => (
          <WtrToggleCell 
            row={row} 
            onToggleActive={handleToggleActive}
            onDateChange={handleChange}
          />
        ),
    },
    {
        header: 'CTRC',
        baseWidth: 50,
        accessorKey: 'wtr.ctrc',
        id: 'wtr_ctrc',
        Cell: ({ row }) => <WtrCtrcCell row={row} onChange={handleChange} />,
    },
    {
        header: 'DEMO',
        baseWidth: 50,
        accessorKey: 'wtr.demo',
        id: 'wtr_demo',
        Cell: ({ row }) => <WtrDemoCell row={row} onChange={handleChange} />,
    },
    {
        header: 'ITEL',
        baseWidth: 50,
        accessorKey: 'wtr.itel',
        id: 'wtr_itel',
        Cell: ({ row }) => <WtrItelCell row={row} onChange={handleChange} />,
    },
    {
        header: 'EQ',
        baseWidth: 50,
        accessorKey: 'wtr.eq',
        id: 'wtr_eq',
        Cell: ({ row }) => <WtrEqCell row={row} onChange={handleChange} />,
    },
    {
        header: 'PICK',
        baseWidth: 50,
        accessorKey: 'wtr.pick',
        id: 'wtr_pick',
        Cell: ({ row }) => <WtrPickCell row={row} onChange={handleChange} />,
    },
        
    // WTR ESTIMATE 分组
    {
        header: (
            <>
              ESTIMATE<br/>SEND
            </>
          ),
        baseWidth: 75,
        id: 'wtr_est_send',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="wtr" 
            type="Send" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header: (
            <>
              ESTIMATE<br/>REVIEW
            </>
          ),
        baseWidth: 75,
        id: 'wtr_est_review',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="wtr" 
            type="Review" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header: (
            <>
              ESTIMATE<br/>AGREE
            </>
          ),
        baseWidth: 75,
        id: 'wtr_est_agree',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="wtr" 
            type="Agree" 
            onChange={handleChange} 
          />
        ),
    },
    
    // STR 部分
    {
        header: 'STR',
        baseWidth: 80,
        accessorKey: 'str',
        Cell: ({ row }) => (
          <StrToggleCell 
            row={row} 
            onToggleActive={handleToggleActive}
            onDateChange={handleChange}
          />
        ),
    },
    {
        header: 'CTRC',
        baseWidth: 50,
        accessorKey: 'str.ctrc',
        id: 'str_ctrc',
        Cell: ({ row }) => <StrCtrcCell row={row} onChange={handleChange} />,
    },
        
    // STR ESTIMATE 分组
    {
        header: (
            <>
              ESTIMATE<br/>SEND
            </>
          ),
        baseWidth: 75,
        id: 'str_est_send',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="str" 
            type="Send" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header: (
            <>
              ESTIMATE<br/>REVIEW
            </>
          ),
        baseWidth: 75,
        id: 'str_est_review',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="str" 
            type="Review" 
            onChange={handleChange} 
          />
        ),
    },
    {
        header: (
            <>
              ESTIMATE<br/>AGREE
            </>
          ),
        baseWidth: 75,
        id: 'str_est_agree',
        Cell: ({ row }) => (
          <EstimateCell 
            row={row} 
            section="str" 
            type="Agree" 
            onChange={handleChange} 
          />
        ),
    },
    
    // 其他字段
    {
        header: 'PAYMENT',
        baseWidth: 75,
        accessorKey: 'payment',
        Cell: ({ row }) => <PaymentCell row={row} onChange={handleChange} />,
    },
    {
        header: 'COMM.',
        baseWidth: 100,
        accessorKey: 'comments',
        Cell: ({ row }) => <CommentsCell row={row} onChange={handleChange} />,
    },
   
  ], [handleChange, handleToggleActive]);

  const dynamicColumns = useMemo(() => {
    const totalBase = columns.reduce((sum, col) => sum + (col.baseWidth || 60), 0);
    const w = containerWidth - 4;
    let used = 0;
    // 1. 先分配前n-1列
    const newCols = columns.map((col, idx) => {
      const ratio = (col.baseWidth || 60) / totalBase;
      let size = Math.round(w * ratio);
      if (col.accessorKey === 'pak' || col.accessorKey === 'wtr' || col.accessorKey === 'str') {
        size = Math.max(95, size);
      }
      // 只对前n-1列累加
      if (idx < columns.length - 1) {
        used += size;
        return {
          ...col,
          size,
          minSize: Math.max(40, size - 20),
          maxSize: size + 40,
        };
      }
      // 2. 最后一列：用剩下的所有宽度
      const lastColSize = w - used;
      return {
        ...col,
        size: lastColSize,
        minSize: Math.max(40, lastColSize - 20),
        maxSize: lastColSize + 40,
      };
    });
    return newCols;
  }, [columns, containerWidth]);

  useEffect(() => {
    api.loadProgress();
  }, [api]);

  return (
    <Box 
        ref={containerRef} 
        sx={{ 
            maxWidth: '100vw', 
            overflowX: 'hidden', 
            p:0, 
            mx: 'auto', 
            my: 0,
        }}
    >
      <MaterialReactTable 
        enableColumnActions={false}
        columns={dynamicColumns}
        data={rows}
        enableRowVirtualization={true}
        enablePagination={false}
        enableSorting={false}
        enableColumnResizing={true}              // ★ 开启列宽手动调整
        columnResizeMode="onChange"   
        getRowId={(row) => row.p_id}
        muiTablePaperProps={{
        sx: {
          height: '100%',
          p: 0,
          my: 0,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
          border: 'none',
          boxSizing: 'border-box',
        }
      }}
      muiTableContainerProps={{
        sx: {
            flex: 1,
            height: '100%',
            p: 0,
            '& .MuiTable-root': {
                tableLayout: 'fixed',
                width: '100%',
            },
            overflowX: 'auto',
        }
      }}
      muiTableHeadCellProps={{
        align: 'center',
        sx: {
          verticalAlign: 'middle',
          p: "2px",
          fontWeight: 700,
          fontSize: 13,   // 更小
          background: '#f8fafd',
          boxSizing: 'border-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          border: '0.2px solid #e0e0e0',
        }
      }}
      muiTableBodyCellProps={{
        align: 'center',
        sx: {
          p: 0,        // 更小padding
          minHeight: '80px',  // 行高压缩
          fontSize: 12,
          boxSizing: 'border-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          border: '0.2px solid #e0e0e0',
        }
      }}
      
    />
    </Box>
  );
}