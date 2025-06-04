// src/components/ProjectTableEditor.jsx
import merge from 'lodash/merge'; 
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Table,
  TableCell,
  TableRow,
  TextField,
  Checkbox,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';
import { useDebounce } from '../hooks/useDebounce';
import { useTasks }   from '../contexts/TaskStore';
import EditableCell from './EditorTableComponents/EditableCell';
import EditableCheckbox from './EditorTableComponents/EditableCheckbox';
import EditableNumberField from './EditorTableComponents/EditableNumberField';
import ToggleBox from './EditorTableComponents/ToggleBox';

// 修改后的 renderEstimateCells 函数，支持独立回调
function renderEstimateCellsWithCallbacks(row, section, disabled, callbacks) {
    const ESTIMATE = ['Send', 'Review', 'Agree'];
    
    return ESTIMATE.map((type) => {
        const lc = type.toLowerCase();
        return (
            <TableCell 
                key={section + lc}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Checkbox
                        checked={row[section]?.[`estimate${type}`] || false}
                        disabled={disabled}
                        onChange={callbacks[`estimate${type}`]}
                    />
                    <Divider style={{ width: '100%' }} />
                    <TextField
                        type="number"
                        size="small"
                        disabled={disabled}
                        value={row[section]?.[`estimate${type}Amount`] || ''}
                        onChange={callbacks[`estimate${type}Amount`]}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                paddingRight: 0
                            },
                            '& .MuiInputBase-input': {
                                paddingLeft: '2px',
                                paddingRight: '2px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                fontSize: '0.85rem'
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',        // Firefox
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                                WebkitAppearance: 'none',          // Chrome, Safari
                                margin: 0
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0
                            },
                        }}
                    />
                </Box>
            </TableCell>
        );
    });
}


function useRowCallbacks(rowIndex, onFieldChange, onToggleActive, rowId) {
  // 顶层字段或嵌套字段都走同一个入口
    const change = useCallback(
      (section, key, val) => onFieldChange(rowIndex, section, key, val),
      [rowIndex, onFieldChange, rowId]
    );
    const toggleMain = useCallback(
      section => onToggleActive(rowIndex, section),
      [rowIndex, onToggleActive, rowId]
    );
    return { change, toggleMain };
}

const DataRow = React.memo(function DataRow({ row, index, onFieldChange, onToggleActive }) {
    console.log('DataRow rendered:', index, row.id);
    //console.log('DataRow props changed:', { row, index });
    const { change, toggleMain } = useRowCallbacks(index, onFieldChange, onToggleActive);
    // 为每个独立字段创建单独的回调
    const toggleArol = useCallback(e => change('arol', null, e.target.checked), [change, row.id]);
    const toggleTest = useCallback(e => change('test', null, e.target.checked), [change, row.id]);
    // PAK 相关回调
    const togglePout = useCallback(e => change('pak', 'pout', e.target.checked), [change, row.id]);
    const togglePack = useCallback(e => change('pak', 'pack', e.target.checked), [change, row.id]);
    // WTR 相关回调
    const toggleWtrCtrc = useCallback(e => change('wtr', 'ctrc', e.target.checked), [change, row.id]);
    const toggleDemo = useCallback(e => change('wtr', 'demo', e.target.checked), [change, row.id]);
    const toggleItel = useCallback(e => change('wtr', 'itel', e.target.checked), [change, row.id]);
    const toggleEq = useCallback(e => change('wtr', 'eq', e.target.checked), [change, row.id]);
    const togglePick = useCallback(e => change('wtr', 'pick', e.target.checked), [change, row.id]);
    // STR 相关回调
    const toggleStrCtrc = useCallback(e => change('str', 'ctrc', e.target.checked), [change, row.id]);
    // 金额字段回调
    const changePayment = useCallback(e => change('payment', null, e.target.value), [change, row.id]);
    // Estimate 金额回调
    const changePakSendAmount = useCallback(e => change('pak', 'estimateSendAmount', e.target.value), [change, row.id]);
    const changePakReviewAmount = useCallback(e => change('pak', 'estimateReviewAmount', e.target.value), [change, row.id]);
    const changePakAgreeAmount = useCallback(e => change('pak', 'estimateAgreeAmount', e.target.value), [change, row.id]);
    
    const changeWtrSendAmount = useCallback(e => change('wtr', 'estimateSendAmount', e.target.value), [change, row.id]);
    const changeWtrReviewAmount = useCallback(e => change('wtr', 'estimateReviewAmount', e.target.value), [change, row.id]);
    const changeWtrAgreeAmount = useCallback(e => change('wtr', 'estimateAgreeAmount', e.target.value), [change, row.id]);
    
    const changeStrSendAmount = useCallback(e => change('str', 'estimateSendAmount', e.target.value), [change, row.id]);
    const changeStrReviewAmount = useCallback(e => change('str', 'estimateReviewAmount', e.target.value), [change, row.id]);
    const changeStrAgreeAmount = useCallback(e => change('str', 'estimateAgreeAmount', e.target.value), [change, row.id]);
    const pakCallbacks = {
      estimateSend: useCallback(e => change('pak', 'estimateSend', e.target.checked), [change, row.id]),
      estimateReview: useCallback(e => change('pak', 'estimateReview', e.target.checked), [change, row.id]),
      estimateAgree: useCallback(e => change('pak', 'estimateAgree', e.target.checked), [change, row.id]),
      estimateSendAmount: changePakSendAmount,
      estimateReviewAmount: changePakReviewAmount,
      estimateAgreeAmount: changePakAgreeAmount
    };
    const wtrCallbacks = {
      estimateSend: useCallback(e => change('wtr', 'estimateSend', e.target.checked), [change, row.id]),
      estimateReview: useCallback(e => change('wtr', 'estimateReview', e.target.checked), [change, row.id]),
      estimateAgree: useCallback(e => change('wtr', 'estimateAgree', e.target.checked), [change, row.id]),
      estimateSendAmount: changeWtrSendAmount,
      estimateReviewAmount: changeWtrReviewAmount,
      estimateAgreeAmount: changeWtrAgreeAmount
    };
    const strCallbacks = {
      estimateSend: useCallback(e => change('str', 'estimateSend', e.target.checked), [change, row.id]),
      estimateReview: useCallback(e => change('str', 'estimateReview', e.target.checked), [change, row.id]),
      estimateAgree: useCallback(e => change('str', 'estimateAgree', e.target.checked), [change, row.id]),
      estimateSendAmount: changeStrSendAmount,
      estimateReviewAmount: changeStrReviewAmount,
      estimateAgreeAmount: changeStrAgreeAmount
    };

    return (
        <>
            <EditableCell rowIndex={index} field="location"  value={row.location}  onChange={change} />
            <EditableCell rowIndex={index} field="year"      value={row.year}      onChange={change} />
            <EditableCell rowIndex={index} field="insurance" value={row.insurance} onChange={change} />
            {/* 独立刷新的 checkbox */}
            <EditableCheckbox value={row.arol} onChange={toggleArol} />
            <EditableCheckbox value={row.test} onChange={toggleTest} />
            <ToggleBox                  // PAK 主开关 + 日期
                section="pak"
                rowIndex={index}
                data={row.pak}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
            <EditableCheckbox 
                value={row.pak?.pout} 
                onChange={togglePout} 
                disabled={!row.pak?.active} 
            />
            <EditableCheckbox 
                value={row.pak?.pack} 
                onChange={togglePack} 
                disabled={!row.pak?.active} 
            />
            {/*renderEstimateCells(row, 'pak', !row.pak.active, change)*/}
            {renderEstimateCellsWithCallbacks(row, 'pak', !row.pak?.active, pakCallbacks)}
            <ToggleBox                   // WTR 主开关 + 日期
                section="wtr"
                rowIndex={index}
                data={row.wtr}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
            {/* WTR 相关独立 checkbox */}
            <EditableCheckbox value={row.wtr?.ctrc} onChange={toggleWtrCtrc} disabled={!row.wtr?.active} />
            <EditableCheckbox value={row.wtr?.demo} onChange={toggleDemo} disabled={!row.wtr?.active} />
            <EditableCheckbox value={row.wtr?.itel} onChange={toggleItel} disabled={!row.wtr?.active} />
            <EditableCheckbox value={row.wtr?.eq} onChange={toggleEq} disabled={!row.wtr?.active} />
            <EditableCheckbox value={row.wtr?.pick} onChange={togglePick} disabled={!row.wtr?.active} />
            {/*renderEstimateCells(row, 'wtr', !row.wtr.active, change)*/}
            {renderEstimateCellsWithCallbacks(row, 'wtr', !row.wtr?.active, wtrCallbacks)}
            <ToggleBox                   // STR 主开关 + 日期
                section="str"
                rowIndex={index}
                data={row.str}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
             <EditableCheckbox value={row.str?.ctrc} onChange={toggleStrCtrc} disabled={!row.str?.active} />
            {/*renderEstimateCells(row, 'str', !row.str.active, change)*/} 
            {renderEstimateCellsWithCallbacks(row, 'str', !row.str?.active, strCallbacks)}
            {/* Payment 字段 - 独立刷新 */}
            <EditableNumberField value={row.payment} onChange={changePayment} />
            <EditableCell
                rowIndex={index}
                field="comments"
                value={row.comments}
                onChange={change}
            />
         </> 
    );
});

export default function ProjectTableEditor() {
  const pendingRef = useRef({});   // 待发送池
  const { progress, api } = useTasks();   // 真实数据
  const [feedback, setFeedback] = useState({});
  

  /* 页面挂载时拉一次进度表 */
  useEffect(() => { api.loadProgress() }, [api]);

  const rows = useMemo(() => {
    if (!progress) {
      console.log('无 progress 数据');
      return [];
    }
    if (Array.isArray(progress)) {
      return progress;
    }
    if (typeof progress === 'object' && progress !== null) {
      return Object.entries(progress).map(([id, r]) => {
        return r.id === id ? r : { ...r, id };
      //({ id, ...r }));
      });
    }
    console.error('progress 数据格式无效:', progress);
    return [];
  }, [progress]);



  // 用 useDebounce 做定时冲刷
  const flushPatches = useDebounce(() => {
    const all = pendingRef.current;
    pendingRef.current = {};                     // 先清空，防抖窗口重开
    // 把收集到的每个 row 的合并 patch 发给服务器
    Object.entries(all).forEach(([id, patch]) => {
      api.saveProgress(id, patch);               // 仍是最小 patch
    });
  }, 1500);

  const queuePatch = useCallback((id, newPatch) => {
    // ❶ 累积：lodash.merge 能递归合并，保持最小 patch 形态
    pendingRef.current[id] = merge(
      {},                         // 不改原对象
      pendingRef.current[id] || {},
      newPatch
    );
    // ❷ 每次修改都启动 / 重置防抖计时器
    flushPatches();
  }, [flushPatches]);
  
  /*
  const handleChange = useCallback((rowIndex, section, key, value) => {
    setRows(prev => {
      
      const next = prev.map((r, i) =>
        i !== rowIndex
          ? r
          : key == null
          ? { ...r, [section]: value }                             
          : { ...r, [section]: { ...r[section], [key]: value } }   
      );
      
      const row = next[rowIndex];
      const patch = key == null
      ? { [section]: value }
      : { [section]: { [key]: value } };
        
      queuePatch(row.id, patch);
      
      const next       = [...prev];          // ① 浅拷贝数组
      const oldRow     = prev[rowIndex];     // 原行引用
      const newSection = key == null
        ? value                               // section = 纯值（location / year / insurance）
        : { ...oldRow[section], [key]: value }; // 修改 section 内部字段

      const updatedRow = { ...oldRow, [section]: newSection };  // ② 克隆行并改值
      next[rowIndex]   = updatedRow;          // ③ 就地替换

      // ⚡ 生成最小 patch 并入池
      const patch = key == null
        ? { [section]: value }
        : { [section]: { [key]: value } };

      queuePatch(updatedRow.id, patch);       // 不丢字段
      return next;
    });
  }, [queuePatch]);
  */

  const handleChange = useCallback((rowIndex, section, key, value, rowId) => {
    if (!rowId) return;
    const patch = key == null
      ? { [section]: value }
      : { [section]: { [key]: value } };

    // 仅本地合并，不立即触发重渲染
    api.mergeProgress(rowId, patch);   // 本地立即合并
    queuePatch(rowId, patch);        // 进入防抖队列，稍后保存
  }, [api, queuePatch]);

  const handleToggleActive = useCallback((rowIndex, section, rowId) => {
    if (!rowId) return;
    //const active = !row[section].active;
    //const patch  = { [section]: { active } };
    const patch = { [section]: { active: true } };
    
    api.mergeProgress(rowId, patch);
    queuePatch(rowId, patch);
  }, [api, queuePatch, progress]);


   /*
  const handleToggleActive = useCallback((rowIndex, section) => {
    setRows(prev => {
     
      const next = prev.map((r, i) =>
        i!==rowIndex
          ? r
          : { ...r, [section]: { ...r[section], active: !r[section].active } }
        );
      const row = next[rowIndex];
      queuePatch(row.id, { [section]: { active: next[rowIndex][section].active } });
      */

      /* 小绿勾/× 的 800 ms 视觉反馈 
      const id = `${rowIndex}-${section}`;
      setFeedback(p => ({ ...p, [id]: true }));
      setTimeout(() => setFeedback(p => ({ ...p, [id]: false })), 800);
      
      const next     = [...prev];
      const oldRow   = prev[rowIndex];
      const oldSect  = oldRow[section];
      const active   = !oldSect.active;       // 取反
  
      const updatedRow = {
        ...oldRow,
        [section]: { ...oldSect, active }     // 只克隆这一层
      };
      next[rowIndex] = updatedRow;
  
      queuePatch(updatedRow.id, { [section]: { active } });

      return next;
    });


    }, [queuePatch]);
    */

    return (
        <Box 
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            gap: 1,              // ← theme.spacing(1) ≈ 8 px 间距
            padding: 2,              // 添加内边距
            position: 'relative',
            margin: 0,
          }}
        >
          <Typography variant="h5" gutterBottom>项目编辑器</Typography>
            {/*< TableContainer component={Paper}>
                <Table 
                    size="small" 
                    sx={{
                        borderCollapse: 'collapse',
                        '& td, & th': {
                            px: 0.15,
                            paddingBottom: 0.15,
                            paddingTop: 0,
                            border: '1px solid #000',
                        }, 
                    }}
                >
                    <TableHead sx={{ '& th': { textAlign: 'center', fontWeight: 600 } }}>
                        <TableRow>
                            <TableCell rowSpan={2} >LOCATION</TableCell>
                            <TableCell rowSpan={2} >YEAR</TableCell>
                            <TableCell rowSpan={2} >INSURANCE</TableCell>
                            <TableCell rowSpan={2} >AROL</TableCell>
                            <TableCell rowSpan={2} >TEST</TableCell>
                            <TableCell rowSpan={2}>PAK</TableCell>
                            <TableCell rowSpan={2} >POUT</TableCell>
                            <TableCell rowSpan={2} >PACK</TableCell>
                            <TableCell colSpan={3} >PAK ESTIMATE</TableCell>
                            <TableCell rowSpan={2} >WTR</TableCell>
                            <TableCell rowSpan={2} >CTRC</TableCell>
                            <TableCell rowSpan={2} >DEMO</TableCell>
                            <TableCell rowSpan={2} >ITEL</TableCell>
                            <TableCell rowSpan={2} >EQ</TableCell>
                            <TableCell rowSpan={2} >PICK</TableCell>
                            <TableCell colSpan={3} >WTR ESTIMATE</TableCell>
                            <TableCell rowSpan={2} >STR</TableCell>
                            <TableCell rowSpan={2} >CTRC</TableCell>
                            <TableCell colSpan={3} >STR ESTIMATE</TableCell>
                            <TableCell rowSpan={2} >PAYMENT</TableCell>
                            <TableCell rowSpan={2} >COMMENTS</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell >SEND</TableCell>
                            <TableCell >REVIEW</TableCell>
                            <TableCell >AGREE</TableCell>
                            <TableCell >SEND</TableCell>
                            <TableCell >REVIEW</TableCell>
                            <TableCell >AGREE</TableCell>
                            <TableCell >SEND</TableCell>
                            <TableCell >REVIEW</TableCell>
                            <TableCell >AGREE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rows ?? []).map((row, index) => (
                            <DataRow
                                key={index}
                                row={row}
                                index={index}
                                onFieldChange={handleChange}
                                onToggleActive={handleToggleActive}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>*/}
          
          <Box 
            sx={{ 
              flex: 1, 
              width: '100%',
              position: 'relative',  // 确保相对定位
              minHeight: 0          // 防止 flex 子元素溢出
            }}
          >

          <TableVirtuoso
            style={{ minHeight: 800, width: '100%' }}   // 滚动区域
            data={rows}                              // 列表数据
            initialTopMostItemIndex={0}
            //itemKey={index => (rows[index] ? rows[index].id : index)}
            //itemSize={48}  
            components={{                            // ⬅ 维持 MUI Table 皮肤
              //Scroller: React.forwardRef((props, ref) => ( <div {...props} ref={ref} style={{ ...props.style, overflowY: 'auto' }} />)),
              /*
              Scroller: React.forwardRef(({ itemKey, ...rest }, ref) => (
                // 把 Virtuoso 自己的专用 prop “解构出来并忽略”
                <div
                  ref={ref}
                  {...rest}
                  style={{ ...rest.style, overflowY: 'auto' }}
                />
              )),
              */
              Table: (props) => (<Table {...props} size="small" sx={{
                  borderCollapse:'collapse',
                  '& td, & th': { px:0.15, pb:0.15, pt:0, border:'1px solid #000' }
              }}/>),
              TableHead: React.forwardRef((props, ref) => <thead {...props} ref={ref} />),
              TableBody: React.forwardRef((props, ref) => <tbody {...props} ref={ref} />),
            }}
            fixedHeaderContent={() => (              // 👈 渲染表头（你的两行）
              <>
                <TableRow>
                  <TableCell rowSpan={2} >LOCATION</TableCell>
                  <TableCell rowSpan={2} >YEAR</TableCell>
                  <TableCell rowSpan={2} >INSURANCE</TableCell>
                  <TableCell rowSpan={2} >AROL</TableCell>
                  <TableCell rowSpan={2} >TEST</TableCell>
                  <TableCell rowSpan={2}>PAK</TableCell>
                  <TableCell rowSpan={2} >POUT</TableCell>
                  <TableCell rowSpan={2} >PACK</TableCell>
                  <TableCell colSpan={3} >PAK ESTIMATE</TableCell>
                  <TableCell rowSpan={2} >WTR</TableCell>
                  <TableCell rowSpan={2} >CTRC</TableCell>
                  <TableCell rowSpan={2} >DEMO</TableCell>
                  <TableCell rowSpan={2} >ITEL</TableCell>
                  <TableCell rowSpan={2} >EQ</TableCell>
                  <TableCell rowSpan={2} >PICK</TableCell>
                  <TableCell colSpan={3} >WTR ESTIMATE</TableCell>
                  <TableCell rowSpan={2} >STR</TableCell>
                  <TableCell rowSpan={2} >CTRC</TableCell>
                  <TableCell colSpan={3} >STR ESTIMATE</TableCell>
                  <TableCell rowSpan={2} >PAYMENT</TableCell>
                  <TableCell rowSpan={2} >COMMENTS</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell >SEND</TableCell>
                  <TableCell >REVIEW</TableCell>
                  <TableCell >AGREE</TableCell>
                  <TableCell >SEND</TableCell>
                  <TableCell >REVIEW</TableCell>
                  <TableCell >AGREE</TableCell>
                  <TableCell >SEND</TableCell>
                  <TableCell >REVIEW</TableCell>
                  <TableCell >AGREE</TableCell>
                </TableRow>
              </>
            )}
            itemContent={(index, row) => {           // 👈 渲染每一行
              return (
              <DataRow
                key={row.id}
                row={row}
                index={index}
                onFieldChange={(section, key, value) => handleChange(index, section, key, value, row.id)}
                onToggleActive={(section) => handleToggleActive(index, section, row.id)}
              />)
            }}

          /> 
          </Box>
        </Box>
    );
}
