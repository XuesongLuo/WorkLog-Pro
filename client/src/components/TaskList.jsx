// src/components/TaskList.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { CircularProgress } from '@mui/material';

// 日期格式化工具
function formatDate(val) {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d)) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


const TaskList = React.forwardRef(function TaskList( { tasks, onSelectTask, sx = {}, lockedWidth, loading, hasMore, onLoadMore }, ref) {
    const containerWidth = lockedWidth ?? 1200;
    const containerRef = useRef();
    // 列定义
    const columns = useMemo(
        () => [
        {
            accessorKey: 'start',
            header: '开始日期',
            baseWidth: 50,
            Cell: ({ cell }) => formatDate(cell.getValue()),
            /*
            sortingFn: (rowA, rowB) => {
            // 直接按时间戳倒序
            const a = new Date(rowA.original.start).getTime() || 0;
            const b = new Date(rowB.original.start).getTime() || 0;
            return b - a; // 降序，最近在前
            },
            */
        },
        {
            accessorKey: 'fulladdress',
            header: '地址',
            baseWidth: 150,
            Cell: ({ row }) =>
            (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {`${row.original.address ?? ''}, ${row.original.city ?? ''}, ${row.original.state ?? ''}, ${row.original.zipcode ?? ''}`}
                </div>
            ),
            sortingFn: (rowA, rowB) => {
            const a = `${rowA.original.address ?? ''},${rowA.original.city ?? ''},${rowA.original.state ?? ''},${rowA.original.zipcode ?? ''}`;
            const b = `${rowB.original.address ?? ''},${rowB.original.city ?? ''},${rowB.original.state ?? ''},${rowB.original.zipcode ?? ''}`;
            return a.localeCompare(b, 'zh');
            },
        },
        {
            accessorKey: 'year',
            header: '房屋年份',
            baseWidth: 50
        },
        {
            accessorKey: 'insurance',
            header: '保险公司',
            baseWidth: 80
        },
        {
            accessorKey: 'type',
            header: '类型',
            baseWidth: 50,
            align: 'right',
        },
        ],
        []
    );

    // 动态列宽计算 - 更精确的计算
    const dynamicColumns = useMemo(() => {
        const totalBase = columns.reduce((sum, col) => sum + (col.baseWidth || 80), 0);
        const availableWidth = containerWidth;
        return columns.map((col, index) => {
        const ratio = (col.baseWidth || 80) / totalBase;
        let calculatedWidth = Math.floor(availableWidth * ratio);
        // 设置最小宽度
        const minWidth = Math.max(60, Math.floor((col.baseWidth || 80) * 0.7));
        calculatedWidth = Math.max(minWidth, calculatedWidth);
        
        return {
            ...col,
            size: calculatedWidth,
            minSize: minWidth,
            maxSize: calculatedWidth, // 重要：限制最大宽度防止扩展
            enableResizing: false, // 禁用列宽调整
        };
        });
    }, [columns, containerWidth]);

    // 数据
    const data = useMemo(() => {
        return tasks.map(t => ({
            ...t,
            fulladdress: `${t.address ?? ''}, ${t.city ?? ''}, ${t.state ?? ''}, ${t.zipcode ?? ''}`,
        }));
    }, [tasks]);

    // 滚动触底监听
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const handleScroll = () => {
        if (loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
          if (typeof onLoadMore === 'function') onLoadMore();
        }
      };
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, onLoadMore]);

    return (
        <div 
            style={{ 
                width: '100%', 
                maxWidth: '100%',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden', // 改为 hidden，让内部表格处理滚动
                position: 'relative',
                boxSizing: 'border-box',
            }}
        >
            <MaterialReactTable
                enableColumnActions={false}
                columns={dynamicColumns}
                data={data}
                enableRowVirtualization={true}
                enablePagination={false}
                enableColumnResizing={false}
                enableSorting={true}
                // 关键配置：强制表格布局
                muiTableProps={{
                    sx: {
                    tableLayout: 'fixed', // 强制固定表格布局
                    width: '100%',
                    maxWidth: '100%',
                    }
                }}
                muiTableBodyRowProps={({ row }) => ({
                    hover: true,
                    sx: { 
                        cursor: 'pointer',
                        '& td': {
                            maxWidth: 0, // 配合 tableLayout: 'fixed' 使用
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }
                    },
                    onClick: () => onSelectTask && onSelectTask(row.original),
                })}
                muiTablePaperProps={{
                    sx: { width: '100%', maxWidth: '100%', ...sx, height: '100%', boxShadow: 'none', border: 'none', boxSizing: 'border-box', overflow: 'hidden' }
                  }}
                muiTableContainerProps={{
                sx: { width: '100%', maxWidth: '100%', height: '100%', maxHeight: '70vh', boxSizing: 'border-box',overflowX: 'hidden', overflowY: 'overlay', }
                }}
                muiTableHeaderProps={{
                    sx: { maxHeight: '100%', width: '100%', maxWidth: '100%', boxSizing: 'border-box' },
                }}
                muiTableHeadCellProps={{
                    align: 'center',
                    sx: {
                      fontWeight: 700,
                      fontSize: 13,
                      background: '#f8fafd',
                      boxSizing: 'border-box',
                      padding: '8px 4px', // 减小内边距
                    },
                }}
                muiTableBodyCellProps={{
                    align: 'center',
                    sx: {
                      fontSize: 12,
                      boxSizing: 'border-box',
                      padding: '8px 4px', // 减小内边距
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                }}
            />
            {/* 底部 loading */}
            {loading && (
                <div style={{
                    position: 'absolute', left: 0, right: 0, bottom: 8,
                    display: 'flex', justifyContent: 'center', pointerEvents: 'none',
                }}>
                    <CircularProgress size={24} />
                </div>
            )}
        </div>
    );
});

export default TaskList;
