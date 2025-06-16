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
    //const [containerRef, containerWidth] = useContainerWidth();

    const containerWidth = lockedWidth ?? 1200;
    //console.log("containerWidth:", containerWidth)
    const containerRef = useRef();
    // 列定义
    const columns = useMemo(
        () => [
        {
            accessorKey: 'start',
            header: '开始日期',
            baseWidth: 50,
            Cell: ({ cell }) => formatDate(cell.getValue()),
            sortingFn: (rowA, rowB) => {
            // 直接按时间戳倒序
            const a = new Date(rowA.original.start).getTime() || 0;
            const b = new Date(rowB.original.start).getTime() || 0;
            return b - a; // 降序，最近在前
            },
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

    const dynamicColumns = useMemo(() => {
        const totalBase = columns.reduce((sum, col) => sum + (col.baseWidth || 80), 0);
        const w = containerWidth - 180; // 增加余量，防止溢出
        return columns.map((col, index) => {
            const ratio = (col.baseWidth || 80) / totalBase;
            let size = Math.round(w * ratio);
            // 确保最小宽度
            const minWidth = Math.max(60, col.baseWidth * 0.6);
            size = Math.max(minWidth, size);
            // 最后一列特殊处理，确保不超出
            if (index === columns.length - 1) {
                const usedWidth = columns.slice(0, -1).reduce((sum, _, i) => {
                    const prevRatio = (columns[i].baseWidth || 80) / totalBase;
                    return sum + Math.max(Math.max(60, columns[i].baseWidth * 0.6), Math.floor(w * prevRatio));
                }, 0);
                size = Math.max(minWidth, w - usedWidth);
            }
            return {
                ...col,
                size,
                minSize: minWidth,
                maxSize: size * 1.5,
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
                overflow: 'auto', // 防止MRT溢出
                position: 'relative',
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
                initialState={{
                    sorting: [{ id: 'start', desc: true }], // 默认按开始日期倒序
                }}
                muiTableBodyRowProps={({ row }) => ({
                    hover: true,
                    sx: { cursor: 'pointer' },
                    onClick: () => onSelectTask && onSelectTask(row.original),
                })}
                muiTablePaperProps={{
                    ref,
                    sx: { width: '100%', maxWidth: '100%', ...sx, height: '100%', boxShadow: 'none', border: 'none', boxSizing: 'border-box' }
                    //sx: { flex: 1, ...sx, height: '100%', boxShadow: 'none', border: 'none', boxSizing: 'border-box' },
                }}
                muiTableContainerProps={{
                    sx: { height: '100%', width: '100%', maxWidth: '100%' },
                }}
                muiTableHeadCellProps={{
                    align: 'center',
                    sx: {
                        fontWeight: 700,
                        fontSize: 13,
                        background: '#f8fafd',
                        //border: '0.2px solid #e0e0e0',
                    },
                }}
                muiTableBodyCellProps={{
                    align: 'center',
                    sx: {
                        fontSize: 12,
                        //border: '0.2px solid #e0e0e0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
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
            {/* 到底提示 */}
            {!hasMore && (
                <div style={{
                    textAlign: 'center', color: '#999', padding: 8,
                    position: 'absolute', left: 0, right: 0, bottom: 0,
                }}>
                    已经到底了
                </div>
            )}
        </div>
    );
});

export default TaskList;
