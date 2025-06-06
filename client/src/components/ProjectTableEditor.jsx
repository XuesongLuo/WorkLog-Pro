// src/components/ProjectTableEditor.jsx
import React, { useEffect, useCallback, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
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


export default function ProjectTableEditor() {
  const { progress, api } = useTasks();
  
  // 优化后的 rows 创建
  const rows = useMemo(() => {
    if (!progress) return [];
    console.log(222)
    return Object.entries(progress).map(([id, record]) => ({
      id,
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
        accessorKey: 'location',
        Cell: ({ row }) => <LocationCell row={row} onChange={handleChange} />,
    },
    {
        header: '1',
        id: 'basic_info',
        columns: [

    {
      header: 'YEAR',
      accessorKey: 'year',
      Cell: ({ row }) => <YearCell row={row} onChange={handleChange} />,
    },
    {
      header: 'INSURANCE',
      accessorKey: 'insurance',
      Cell: ({ row }) => <InsuranceCell row={row} onChange={handleChange} />,
    },
    {
      header: 'AROL',
      accessorKey: 'arol',
      Cell: ({ row }) => <ArolCell row={row} onChange={handleChange} />,
    },
    {
      header: 'TEST',
      accessorKey: 'test',
      Cell: ({ row }) => <TestCell row={row} onChange={handleChange} />,
    },
    ]
    },

    // PAK 部分

    {
        header: '2',
        id: 'pak_info',
        columns: [
    {
      header: 'PAK',
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
      accessorKey: 'pak.pout',
      id: 'pak_pout',
      Cell: ({ row }) => <PakPoutCell row={row} onChange={handleChange} />,
    },
    {
      header: 'PACK',
      accessorKey: 'pak.pack',
      id: 'pak_pack',
      Cell: ({ row }) => <PakPackCell row={row} onChange={handleChange} />,
    },
    ]
    },
    
    // PAK ESTIMATE 分组
    {
      header: 'ESTIMATE',
      id: 'pak_estimate',
      columns: [
        {
          header: 'SEND',
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
          header: 'REVIEW',
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
          header: 'AGREE',
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
      ],
    },
    
    // WTR 部分
    {
        header: '3',
        id: 'wtr_info',
        columns: [
    {
      header: 'WTR',
      accessorKey: 'wtr',
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
      accessorKey: 'wtr.ctrc',
      id: 'wtr_ctrc',
      Cell: ({ row }) => <WtrCtrcCell row={row} onChange={handleChange} />,
    },
    {
      header: 'DEMO',
      accessorKey: 'wtr.demo',
      id: 'wtr_demo',
      Cell: ({ row }) => <WtrDemoCell row={row} onChange={handleChange} />,
    },
    {
      header: 'ITEL',
      accessorKey: 'wtr.itel',
      id: 'wtr_itel',
      Cell: ({ row }) => <WtrItelCell row={row} onChange={handleChange} />,
    },
    {
      header: 'EQ',
      accessorKey: 'wtr.eq',
      id: 'wtr_eq',
      Cell: ({ row }) => <WtrEqCell row={row} onChange={handleChange} />,
    },
    {
      header: 'PICK',
      accessorKey: 'wtr.pick',
      id: 'wtr_pick',
      Cell: ({ row }) => <WtrPickCell row={row} onChange={handleChange} />,
    },
    ]
    },
        
    // WTR ESTIMATE 分组
    {
      header: 'ESTIMATE',
      id: 'wtr_estimate',
      columns: [
        {
          header: 'SEND',
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
          header: 'REVIEW',
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
          header: 'AGREE',
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
      ],
    },
    
    // STR 部分
    {
        header: '4',
        id: 'str_info',
        columns: [
    {
      header: 'STR',
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
      accessorKey: 'str.ctrc',
      id: 'str_ctrc',
      Cell: ({ row }) => <StrCtrcCell row={row} onChange={handleChange} />,
    },
    ]
    },
        
    
    // STR ESTIMATE 分组
    {
      header: 'ESTIMATE',
      id: 'str_estimate',
      columns: [
        {
          header: 'SEND',
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
          header: 'REVIEW',
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
          header: 'AGREE',
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
      ],
    },
    
    // 其他字段
    {
        header: '5',
        id: 'other_info',
        columns: [
    {
      header: 'PAYMENT',
      accessorKey: 'payment',
      Cell: ({ row }) => <PaymentCell row={row} onChange={handleChange} />,
    },
    {
      header: 'COMMENTS',
      accessorKey: 'comments',
      Cell: ({ row }) => <CommentsCell row={row} onChange={handleChange} />,
    },
    ]
    },
   
  ], [handleChange, handleToggleActive]);


  useEffect(() => {
    console.log('111')
    api.loadProgress();
  }, [api]);

  return (
    <MaterialReactTable 
      columns={columns}
      data={rows}
      enableRowVirtualization={true}
      enablePagination={false}
      enableSorting={false}
      getRowId={(row) => row.id}
      muiTablePaperProps={{ 
        sx: { 
            height: '100%', 
            p: 0, 
            display: 'flex', 
            flexDirection: 'column' 
        } 
      }}
      muiTableContainerProps={{ 
        sx: { 
            flex: 1, 
            height: '100%', 
            p: 0,
            '& .MuiTable-root': {
                tableLayout: 'fixed', // Ensure uniform column widths
                width: '100%'         // Stretch table to container width
            }
        } 
      }}
      muiTableHeadCellProps={{ 
        align: 'center',
        sx: {
            verticalAlign: 'middle',
            p: "2px",
            fontWeight: 700,
            fontSize: 16,
            border: '1px solid #1976d2',
            background: '#f8fafd',
            boxSizing: 'border-box',
            minWidth: '60px', // Minimum width to accommodate content
            //maxWidth: '150px', // Prevent overly wide columns
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
      }}
      muiTableBodyCellProps={{ 
        align: 'center',
        sx: {
          p: '2px', // Match header padding
          minWidth: '60px', // Match header minWidth
          minHeight: '80px',
          height: 'auto',
          boxSizing: 'border-box',
          whiteSpace: 'normal', // 允许表头文本换行
        }
      }}
      
    />
  );
}