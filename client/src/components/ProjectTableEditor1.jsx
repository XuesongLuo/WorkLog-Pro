// src/components/ProjectTableEditor.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import _ from 'lodash';
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
import ReadonlyGreenCheckbox from './EditorTableComponents/ReadonlyGreenCheckbox';
import ReadonlyToggleBox from './EditorTableComponents/ReadonlyToggleBox';
import ReadonlyEstimateCell from './EditorTableComponents/ReadonlyEstimateCell';
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

function updateIn(obj, path, val) {
  // path 为 ['pak', 'estimate', 'send', 'checked']
  if (path.length === 1) return { ...obj, [path[0]]: val };
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: updateIn(obj?.[head] || {}, rest, val)
  };
}

// 递归/深对比，取出有变字段  对比“原始行数据”和“编辑后的行数据”
function diffObject(orig, edited) {
  let diff = {};
  for (const key in edited) {
    if (typeof edited[key] === 'object' && edited[key] !== null && orig[key]) {
      const subDiff = diffObject(orig[key], edited[key]);
      if (Object.keys(subDiff).length) diff[key] = subDiff;
    } else if (!_.isEqual(orig[key], edited[key])) {
      diff[key] = edited[key];
    }
  }
  return diff;
}


export default function ProjectTableEditor() {
  //console.log("ProjectTableEditor rendered!!!");
  const { progress, api, progressHasMore, progressLoading, progressPage } = useTasks();
  const [containerRef, containerWidth] = useContainerWidth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editRowData, setEditRowData] = useState(null); // 用于保存正在编辑行的数据副本
  const editingRowRef = useRef(null);
  const inputRefs = useRef({});

  // 用 ref 固定 api，避免 callback 引用每次变
  const apiRef = useRef(api);
  useEffect(() => { apiRef.current = api; }, [api]);

  const rows = progress;

  //console.log('当前编辑行ID:', editingRowId);

  // 稳定的回调函数
  const handleChange = useCallback((rowId, section, key, value) => {
    console.log("handleChange", rowId, section, key, value);
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

  const tryEditRow = useCallback((rowId) => {
    const targetRow = rows.find(r => r._id === rowId);
    if (!targetRow) {
      console.warn('目标行数据尚未在 rows 中同步:', rowId);
      return;
    }
  
    setEditRowData({ ...targetRow }); // 先复制数据
    setEditingRowId(rowId);           // 再设置编辑状态
  }, [rows]);

  // 优化后的列定义
  const columns = useMemo(() => [
    {
        header: 'LOCATION',
        baseWidth: 110,
        accessorKey: 'location',
        Cell: ({ row }) => 
          <LocationCell 
            value={row.original.location} 
            onShowDetail={handleShowDetail} 
          />,
    },
    {
      header: 'YEAR',
      baseWidth: 60,
      accessorKey: 'year',
      Cell: ({ row }) => editingRowId === row.original._id
        ? <YearCell 
            value={editRowData?.year ?? ''}
            onChange={val => setEditRowData(d => ({ ...d, year: val }))}
          />
        : <span>
            {row.original.year}
          </span>
    },
    {
      header: 'INSURANCE',
      baseWidth: 80,
      accessorKey: 'insurance',
      Cell: ({ row }) => editingRowId === row.original._id
      ? <InsuranceCell 
          value={editRowData?.insurance ?? ''}
          onChange={val => setEditRowData(d => ({ ...d, insurance: val }))} 
        />
      : <span>
          {row.original.insurance}
        </span>
    },
    {
      header: 'AROL',
      baseWidth: 50,
      accessorKey: 'arol',
      Cell: ({ row }) => editingRowId === row.original._id
        ? <ArolCell
            value={editRowData?.arol ?? false}
            onChange={val => setEditRowData(d => ({ ...d, arol: val }))} 
          />
        : <ReadonlyGreenCheckbox checked={row.original.arol} />
    },
    {
        header: 'TEST',
        accessorKey: 'test',
        baseWidth: 50,
        Cell: ({ row }) => editingRowId === row.original._id
        ? <TestCell 
          value={editRowData?.test ?? false}
          onChange={val => setEditRowData(d => ({ ...d, test: val }))} 
          />
        : <ReadonlyGreenCheckbox checked={row.original.test} />
    },

    // PAK 部分
    {
      header: 'PAK',
      baseWidth: 80,
      accessorKey: 'pak',
      Cell: ({ row }) => 
        editingRowId === row.original._id
          ? <PakToggleCell
              value={{
                active: editRowData?.pak?.active ?? false,
                start_date: editRowData?.pak?.start_date ?? ''
              }}
              onToggleActive={val => setEditRowData(data =>
                updateIn(data, ['pak', 'active'], val)
              )}
              onDateChange={val => setEditRowData(data =>
                updateIn(data, ['pak', 'start_date'], val)
              )}
            />
          : <ReadonlyToggleBox section={row.original.pak} />
    },
    {
      header: 'POUT',
      baseWidth: 50,
      accessorKey: 'pak.pout',
      id: 'pak_pout',
      Cell: ({ row }) => editingRowId === row.original._id
          ? (
            <PakPoutCell
              value={editRowData?.pak?.pout ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['pak', 'pout'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.pak?.pout} />
          )
    },
    {
      header: 'PACK',
      baseWidth: 50,
      accessorKey: 'pak.pack',
      id: 'pak_pack',
      Cell: ({ row }) => 
        editingRowId === row.original._id
        ? (
          <PakPackCell
            value={editRowData?.pak?.pack ?? false}
            onChange={val =>
              setEditRowData(data =>
                updateIn(data, ['pak', 'pack'], val)
              )
            }
          />
        )
        : (
          <ReadonlyGreenCheckbox checked={row.original.pak?.pack} />
        )
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
      Cell: ({ row }) => {
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.pak?.estimate?.send?.checked ?? false,
              amount: editRowData?.pak?.estimate?.send?.amount ?? 0,
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['pak', 'estimate', 'send', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.pak?.estimate?.send?.checked}
            amount={row.original.pak?.estimate?.send?.amount}
            disabled={!row.original.pak?.active}
          />
      }
    },
    {
      header:(
          <>
            ESTIMATE<br/>REVIEW
          </>
        ),
      baseWidth: 75,
      id: 'pak_est_review',
      Cell: ({ row }) => {
        //const section = 'pak';
        //const type = 'review';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.pak?.estimate?.review?.checked ?? false,
              amount: editRowData?.pak?.estimate?.review?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['pak', 'estimate', 'review', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.pak?.estimate?.review?.checked}
            amount={row.original.pak?.estimate?.review?.amount}
            disabled={!row.original.pak?.active}
          />
      }
    },
    {
      header: (
          <>
            ESTIMATE<br/>AGREE
          </>
        ),
      baseWidth: 75,
      id: 'pak_est_agree',
      Cell: ({ row }) => {
        //const section = 'pak';
        //const type = 'agree';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.pak?.estimate?.agree?.checked ?? false,
              amount: editRowData?.pak?.estimate?.agree?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['pak', 'estimate', 'agree', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.pak?.estimate?.agree?.checked}
            amount={row.original.pak?.estimate?.agree?.amount}
            disabled={!row.original.pak?.active}
          />
      }
    },

    // WTR 部分
    {
      header: 'WTR',
      accessorKey: 'wtr',
      baseWidth: 80,
      Cell: ({ row }) => 
        editingRowId === row.original._id
        ? <WtrToggleCell
              value={{
                active: editRowData?.wtr?.active ?? false,
                start_date: editRowData?.wtr?.start_date ?? ''
              }}
              onToggleActive={val => setEditRowData(data =>
                updateIn(data, ['wtr', 'active'], val)
              )}
              onDateChange={val => setEditRowData(data =>
                updateIn(data, ['wtr', 'start_date'], val)
              )}
            />
          : <ReadonlyToggleBox section={row.original.wtr} />
    },
    {
      header: 'CTRC',
      baseWidth: 50,
      accessorKey: 'wtr.ctrc',
      id: 'wtr_ctrc',
      Cell: ({ row }) => 
        editingRowId === row.original._id
          ? (
            <WtrCtrcCell
              value={editRowData?.wtr?.ctrc ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['wtr', 'ctrc'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.wtr?.ctrc} />
          )
    },
    {
      header: 'DEMO',
      baseWidth: 50,
      accessorKey: 'wtr.demo',
      id: 'wtr_demo',
      Cell: ({ row }) => editingRowId === row.original._id
          ? (
            <WtrDemoCell
              value={editRowData?.wtr?.demo ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['wtr', 'demo'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.wtr?.demo} />
          )
    },
    {
      header: 'ITEL',
      baseWidth: 50,
      accessorKey: 'wtr.itel',
      id: 'wtr_itel',
      Cell: ({ row }) => editingRowId === row.original._id
          ? (
            <WtrItelCell
              value={editRowData?.wtr?.itel ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['wtr', 'itel'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.wtr?. itel} />
          )
    },
    {
      header: 'EQ',
      baseWidth: 50,
      accessorKey: 'wtr.eq',
      id: 'wtr_eq',
      Cell: ({ row }) => editingRowId === row.original._id
          ? (
            <WtrEqCell
              value={editRowData?.wtr?.eq ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['wtr', 'eq'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.wtr?. eq} />
          )
    },
    {
      header: 'PICK',
      baseWidth: 50,
      accessorKey: 'wtr.pick',
      id: 'wtr_pick',
      Cell: ({ row }) => editingRowId === row.original._id
          ? (
            <WtrPickCell
              value={editRowData?.wtr?.pick ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['wtr', 'pick'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.wtr?. pick} />
          )
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
      Cell: ({ row }) => {
        //const section = 'wtr';
        //const type = 'send';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.wtr?.estimate?.send?.checked ?? false,
              amount: editRowData?.wtr?.estimate?.send?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['wtr', 'estimate', 'send', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.wtr?.estimate?.send?.checked}
            amount={row.original.wtr?.estimate?.send?.amount}
            disabled={!row.original.wtr?.active}
          />
      }
    },
    {
      header: (
          <>
            ESTIMATE<br/>REVIEW
          </>
        ),
      baseWidth: 75,
      id: 'wtr_est_review',
      Cell: ({ row }) => {
        //const section = 'wtr';
        //const type = 'review';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.wtr?.estimate?.review?.checked ?? false,
              amount: editRowData?.wtr?.estimate?.review?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['wtr', 'estimate', 'review', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.wtr?.estimate?.review?.checked}
            amount={row.original.wtr?.estimate?.review?.amount}
            disabled={!row.original.wtr?.active}
          />
      }
    },
    {
      header: (
          <>
            ESTIMATE<br/>AGREE
          </>
        ),
      baseWidth: 75,
      id: 'wtr_est_agree',
      Cell: ({ row }) => {
        //const section = 'wtr';
        //const type = 'agree';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.wtr?.estimate?.agree?.checked ?? false,
              amount: editRowData?.wtr?.estimate?.agree?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['wtr', 'estimate', 'agree', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.wtr?.estimate?.agree?.checked}
            amount={row.original.wtr?.estimate?.agree?.amount}
            disabled={!row.original.wtr?.active}
          />
      }
    },
    
    // STR 部分
    {
      header: 'STR',
      baseWidth: 80,
      accessorKey: 'str',
      Cell: ({ row }) => editingRowId === row.original._id
        ? <StrToggleCell
            value={{
              active: editRowData?.str?.active ?? false,
              start_date: editRowData?.str?.start_date ?? 0
            }}
            onToggleActive={val => setEditRowData(data =>
              updateIn(data, ['str', 'active'], val)
            )}
            onDateChange={val => setEditRowData(data =>
              updateIn(data, ['str', 'start_date'], val)
            )}
          />
        : <ReadonlyToggleBox section={row.original.str} />
    },
    {
      header: 'CTRC',
      baseWidth: 50,
      accessorKey: 'str.ctrc',
      id: 'str_ctrc',
      Cell: ({ row }) => 
        editingRowId === row.original._id
          ? (
            <StrCtrcCell
              value={editRowData?.str?.ctrc ?? false}
              onChange={val =>
                setEditRowData(data =>
                  updateIn(data, ['str', 'ctrc'], val)
                )
              }
            />
          )
          : (
            <ReadonlyGreenCheckbox checked={row.original.str?.ctrc} />
          )
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
      Cell: ({ row }) => {
        //const section = 'str';
        //const type = 'send';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.str?.estimate?.send?.checked ?? false,
              amount: editRowData?.str?.estimate?.send?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['str', 'estimate', 'send', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.str?.estimate?.send?.checked}
            amount={row.original.str?.estimate?.send?.amount}
            disabled={!row.original.str?.active}
          />
      }
    },
    {
      header: (
          <>
            ESTIMATE<br/>REVIEW
          </>
        ),
      baseWidth: 75,
      id: 'str_est_review',
      Cell: ({ row }) => {
        //const section = 'str';
        //const type = 'review';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.str?.estimate?.review?.checked ?? false,
              amount: editRowData?.str?.estimate?.review?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['str', 'estimate', 'review', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.str?.estimate?.review?.checked}
            amount={row.original.str?.estimate?.review?.amount}
            disabled={!row.original.str?.active}
          />
      }
    },
    {
      header: (
          <>
            ESTIMATE<br/>AGREE
          </>
        ),
      baseWidth: 75,
      id: 'str_est_agree',
      Cell: ({ row }) => {
        //const section = 'str';
        //const type = 'agree';
        //const estimate = row.original[section]?.estimate || {};
        //const item = estimate[type] || {};
        //const disabled = !row.original[section]?.active;
    
        return editingRowId === row.original._id
        ? <EstimateCell
            value={{
              checked: editRowData?.str?.estimate?.agree?.checked ?? false,
              amount: editRowData?.str?.estimate?.agree?.amount ?? 0
            }}
            onChange={(field, val) => setEditRowData(data =>
              updateIn(data, ['str', 'estimate', 'agree', field], val)
            )}
          />
        : <ReadonlyEstimateCell
            checked={row.original.str?.estimate?.agree?.checked}
            amount={row.original.str?.estimate?.agree?.amount}
            disabled={!row.original.str?.active}
          />
      }
    },
    
    // 其他字段
    {
        header: 'PAYMENT',
        baseWidth: 75,
        accessorKey: 'payment',
        Cell: ({ row }) => editingRowId === row.original._id
        ? <PaymentCell
            value={editRowData?.payment ?? 0}
            onChange={val => setEditRowData(d => ({ ...d, payment: val }))}
          />
        : <span>
            ${row.original.payment}
          </span>
        //<PaymentCell row={row} onChange={handleChange} />,
    },
    {
        header: 'COMM.',
        baseWidth: 100,
        accessorKey: 'comments',
        Cell: ({ row }) => editingRowId === row.original._id
        ? <CommentsCell 
            value={editRowData?.comments ?? ''}
            onChange={val => setEditRowData(d => ({ ...d, comments: val }))}  
          />
        : <span>
            {row.original.comments}
          </span>
        //<CommentsCell row={row} onChange={handleChange} />,
    },
   
  ], [handleShowDetail, editingRowId, /*editRowData*/]);

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

  // 监听 editingRowId 变化，切换到某一行时把原始行数据复制到 editRowData
  useEffect(() => {
    if (editingRowId) {
      inputRefs.current = {};
      const row = rows.find(r => r._id === editingRowId);
      //console.log("row: ", row)
      setEditRowData(row ? { ...row } : null);
    } else {
      setEditRowData(null);
    }
  }, [editingRowId, rows]);

  // 编辑状态监听
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        editingRowRef.current &&
        !editingRowRef.current.contains(event.target)
      ) {
        // 让所有 ref 失焦，强制触发 onBlur
        Object.values(inputRefs.current).forEach(ref => {
          if (ref && typeof ref.blur === 'function') ref.blur();
        });
        setEditingRowId(null);
      }
    }
    if (editingRowId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingRowId]);
  
  // 监听 editingRowId 变化（退出编辑态），比对 editRowData 和原始行数据，有变则保存
  useEffect(() => {
    if (editingRowId === null && editRowData && editRowData._id) {
      const orig = rows.find(r => r._id === editRowData._id);
      const changedFields = diffObject(orig, editRowData);
      if (orig && Object.keys(changedFields).length > 0) {
        // 1. 先merge本地，显示为已保存
        console.log("editRowData._id:", editRowData._id, " changedFields: ", changedFields)
        apiRef.current.mergeProgress(editRowData._id, changedFields);
        // 2. 尝试保存到后端
        apiRef.current.saveCell(editRowData._id, changedFields)
          .catch(err => {
            // 3. 如果失败，回滚本地（用原始数据覆盖）
            apiRef.current.mergeProgress(editRowData._id, orig);
            // 你可以弹个消息提示：保存失败，已回滚
          });
      }
      setEditRowData(null); // 清空
    }
  }, [editingRowId]);
  
  // 滚动监听优化，可用节流进一步降低开销
  useEffect(() => {
    //console.log("滚动监听")
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
        muiTableBodyRowProps={({ row }) => ({
          ref: editingRowId === row.original._id ? editingRowRef : undefined,
          onDoubleClick: () => tryEditRow(row.original._id),
          style: { cursor: 'pointer' },
        })}
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