import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TableSortLabel
  } from '@mui/material';
import { forwardRef, useState, useMemo } from 'react';          // 供 <Fade> 使用


// 比较器：按数据类型自动选择
const getComparator = (field, order) => (a, b) => {
    const [x, y] = order === 'asc' ? [a, b] : [b, a];
  
    const vx = field === 'fulladdress'
    ? `${x.address ?? ''}, ${x.city ?? ''}, ${x.zipcode ?? ''}`
    : x[field];

  const vy = field === 'fulladdress'
    ? `${y.address ?? ''}, ${y.city ?? ''}, ${y.zipcode ?? ''}`
    : y[field];
  
    // 1) 日期 / 数字
    if (vx instanceof Date && vy instanceof Date) {
      return vx - vy;
    }
    if (typeof vx === 'number' && typeof vy === 'number') {
      return vx - vy;
    }
  
    // 2) 其他 -> 字符串本地比较（含中文拼音）
    return String(vx ?? '').localeCompare(String(vy ?? ''), 'zh');
};
  

// forwardRef 让父组件 <Fade> 能拿到 DOM 引用
const TaskList = forwardRef(function TaskList(
    { tasks, onSelectTask, sx = {} }, ref
) {
    /** ① 排序状态 */ 
    const [orderBy, setOrderBy] = useState('_id');
    const [order, setOrder]     = useState('asc');     // 'asc' | 'desc'

    /** ② 表头点击切换排序 */
    const handleSort = (field) => {
        if (orderBy === field) {
            setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrderBy(field);
            setOrder('asc');
        }
    };

    /** ③ 计算排序后的列表（useMemo 避免重复排序） */
    const sortedTasks = useMemo(() => {
        const cmp = getComparator(orderBy, order);
        return [...tasks].sort(cmp);
    }, [tasks, orderBy, order]);

    return (
      <TableContainer component={Paper} ref={ref} sx={{ flex: 1, ...sx }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
                {[
                    { field: 'fulladdress', label: '地址' },
                    { field: 'year', label: '房屋年份' },
                    { field: 'insurance', label: '保险公司' },
                    { field: 'type',    label: '类型', align: 'right' },
                ].map(col => (
                <TableCell
                    key={col.field}
                    align={col.align || 'left'}
                    sortDirection={orderBy === col.field ? order : false}
                >
                    <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : 'asc'}
                    onClick={() => handleSort(col.field)}
                    >
                    {col.label}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
          </TableHead>
  
          <TableBody>
            {sortedTasks.map(t => (
              <TableRow
                hover key={t._id}
                onClick={() => onSelectTask(t)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{`${t.address}, ${t.city}, ${t.state}, ${t.zipcode}`}</TableCell>
                <TableCell>{t.year}</TableCell>
                <TableCell>{t.insurance}</TableCell>
                <TableCell align="right">{t.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  });
  
  export default TaskList;
  