// src/components/TaskList.jsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

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

function useContainerWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(1200);
    useEffect(() => {
        function updateWidth() {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setWidth(Math.floor(rect.width));
            }
        }
        // 延迟获取宽度，确保元素已渲染
        const timer = setTimeout(updateWidth, 100);
        //updateWidth();
        // 使用 ResizeObserver
        const observer = new window.ResizeObserver(() => {
            updateWidth();
        });
        if (ref.current) observer.observe(ref.current);
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);
    return [ref, width];
}

const TaskList = React.forwardRef(function TaskList( { tasks, onSelectTask, sx = {} }, ref) {
    const [containerRef, containerWidth] = useContainerWidth();
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
        const w = containerWidth - 164; // 增加余量，防止溢出
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

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: '100%', 
                maxWidth: '100%',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                overflow: 'auto', // 防止MRT溢出
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
                    onClick: () => onSelectTask && onSelectTask(row.original),
                    sx: { cursor: 'pointer' },
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
        </div>
    );
});

export default TaskList;
