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
import TaskCard from './TaskCard';
import Dialog from '@mui/material/Dialog';


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
  console.log("ProjectTableEditor rendered!!!");
  const { progress, api, progressHasMore, progressLoading, progressPage } = useTasks();
  const [containerRef, containerWidth] = useContainerWidth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  
  // 用 ref 固定 api，避免 callback 引用每次变
  const apiRef = useRef(api);
  useEffect(() => { apiRef.current = api; }, [api]);

  const rows = progress;

  // 稳定的回调函数
  const handleChange = useCallback((rowId, section, key, value) => {
    console.log('handleChange render')
    if (!rowId) return;
    let patch;
    if (Array.isArray(key)) {
      // 多层嵌套路径 ['estimate', 'send', 'checked']
      patch = { [section]: key.reduceRight((acc, cur) => ({ [cur]: acc }), value) };
    } else if (key == null) {
      patch = { [section]: value };
    } else {
      patch = { [section]: { [key]: value } };
    }
    apiRef.current.mergeProgress(rowId, patch);
    apiRef.current.saveCell(rowId, patch);
  }, []);

  const handleToggleActive = useCallback((rowObj, section) => {
    if (!rowObj || !rowObj._id) return;
    const newActive = !rowObj[section]?.active;
    const patch = { [section]: { active: newActive } };
    apiRef.current.mergeProgress(rowObj._id, patch);
    apiRef.current.saveCell(rowObj._id, patch);
  }, []);

  // 拉取详情并打开弹窗
  const handleShowDetail = useCallback(async (_id) => {
    setDialogOpen(true);
    setLoading(true);
    try {
      const task = await apiRef.current.getTask(_id);
      setTaskDetail(task); // {...task, description: desc.description }
    } finally {
      setLoading(false);
    }
  }, []);

  // 优化后的列定义
  const columns = useMemo(() => [
    {
        header: 'LOCATION',
        baseWidth: 110,
        accessorKey: 'location',
        Cell: ({ row }) => <LocationCell row={row} onShowDetail={handleShowDetail} />,
    },
    {
      header: 'YEAR',
      baseWidth: 60,
      accessorKey: 'year',
      Cell: ({ row }) => editingRowId === row.original._id
        ? <YearCell row={row} onChange={handleChange} autoFocus />
        : <span>{row.original.year}</span>
    },
    {
        header: 'INSURANCE',
        baseWidth: 80,
        accessorKey: 'insurance',
        Cell: ({ row }) => editingRowId === row.original._id
        ? <InsuranceCell row={row} onChange={handleChange} autoFocus />
        : <span>{row.original.insurance}</span>
    },
    {
      header: 'AROL',
      baseWidth: 50,
      accessorKey: 'arol',
      Cell: ({ row }) => editingRowId === row.original._id
        ? <ArolCell row={row} onChange={handleChange} autoFocus />
        : <span>{row.original.arol}</span>
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
            onToggleActive={() => handleToggleActive(row.original, 'pak')}
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
            type="send" 
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
            type="review" 
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
            type="agree" 
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
            onToggleActive={() => handleToggleActive(row.original, 'wtr')}
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
            type="send" 
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
            type="review" 
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
            type="agree" 
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
            onToggleActive={() => handleToggleActive(row.original, 'str')}
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
            type="send" 
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
            type="review" 
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
            type="agree" 
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
   
  ], [handleChange, handleToggleActive, handleShowDetail]);

  const dynamicColumns = useMemo(() => {
    console.log('dynamicColumns computed!');
    const totalBase = columns.reduce((sum, col) => sum + (col.baseWidth || 60), 0);
    const w = containerWidth - 18;
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

  // 只在需要时拉取更多
  const handleLoadMore = useCallback(() => {
    if (progressHasMore && !progressLoading) {
      api.loadProgressPage(progressPage + 1);
    }
  }, [progressHasMore, progressLoading, progressPage, api]);


  // 滚动监听优化，可用节流进一步降低开销
  useEffect(() => {
    console.log("滚动监听")
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (progressLoading || !progressHasMore) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
        handleLoadMore();
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [progressLoading, progressHasMore, handleLoadMore, containerRef]);

  useEffect(() => {
    apiRef.current.loadProgressPage(1);
  }, []);

  return (
    <Box 
        ref={containerRef} 
        sx={{
            flex: 1,
            minHeight: 0,
            height: '100%',
            maxWidth: '100vw', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: 0, 
            m: 0,
        }}
    >
      <MaterialReactTable 
        enableColumnActions={false}
        columns={dynamicColumns}
        data={rows}
        enableRowVirtualization={false}
        enablePagination={false}
        enableSorting={false}
        enableColumnResizing={true}              // ★ 开启列宽手动调整
        columnResizeMode="onChange"   
        getRowId={(row) => row._id}
        muiTablePaperProps={{
          sx: {
            flex: 1,
            minHeight: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            border: 'none',
            p: 0,
            m: 0,
            boxSizing: 'border-box',
          }
        }}
        muiTableContainerProps={{
          sx: {
              flex: 1,
              minHeight: 0,
              height: '100%',
              //maxHeight: '100%',
              p: 0,
              overflow: 'auto',
              '& .MuiTable-root': {
                  tableLayout: 'fixed',
                  width: '100%',
              },
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
        muiTableBodyCellProps={({ row }) => ({
          onDoubleClick: () => setEditingRowId(row.original._id),
          style: { cursor: 'pointer' },
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
        })}
      />
      <Dialog open={dialogOpen} maxWidth="md" fullWidth onClose={() => setDialogOpen(false)}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>加载中...</Box>
        ) : (
          <TaskCard task={taskDetail} onClose={() => setDialogOpen(false)} />
        )}
      </Dialog>
    </Box>
  );
}