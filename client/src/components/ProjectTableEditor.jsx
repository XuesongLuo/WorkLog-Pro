import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { Table, TableBody, TableHead, TableRow, TableCell, Paper } from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';  // 虚拟滚动组件
import { useTasks } from '../contexts/TaskStore';  // 提供 progress 数据和 API 方法
import EditableCell from './EditorTableComponents/EditableCell';        // 文本/多行文本单元格，点击弹出编辑
import EditableCheckbox from './EditorTableComponents/EditableCheckbox';// 独立复选框单元格
import EditableNumberField from './EditorTableComponents/EditableNumberField';// 数字输入单元格
import ToggleBox from './EditorTableComponents/ToggleBox';              // 阶段激活切换及日期输入单元格

// 子组件：表示一行数据，由 React.memo 包裹以避免不必要渲染
const DataRow = React.memo(function DataRow({ row, onFieldChange, onToggleActive }) {
  // 提供各字段编辑/切换的事件处理函数，使用 useCallback 确保引用稳定
  const change = onFieldChange;               // 用于顶层或嵌套字段值修改
  const toggleMain = onToggleActive;          // 用于阶段 active 状态切换

  // 独立字段复选框开关处理
  const toggleArol = useCallback(e => change('arol', null, e.target.checked), [change]);
  const toggleTest = useCallback(e => change('test', null, e.target.checked), [change]);
  // PAK 阶段内部复选框处理
  const togglePout = useCallback(e => change('pak', 'pout', e.target.checked), [change]);
  const togglePack = useCallback(e => change('pak', 'pack', e.target.checked), [change]);
  // WTR 阶段内部复选框处理
  const toggleCtrc = useCallback(e => change('wtr', 'ctrc', e.target.checked), [change]);
  const toggleDemo = useCallback(e => change('wtr', 'demo', e.target.checked), [change]);
  const toggleItel = useCallback(e => change('wtr', 'itel', e.target.checked), [change]);
  const toggleEq   = useCallback(e => change('wtr', 'eq',   e.target.checked), [change]);
  const togglePick = useCallback(e => change('wtr', 'pick', e.target.checked), [change]);
  // STR 阶段内部复选框处理
  const toggleStrCtrc = useCallback(e => change('str', 'ctrc', e.target.checked), [change]);
  // 金额字段变更处理
  const changePayment = useCallback(e => change('payment', null, e.target.value), [change]);

  // 预估 (estimate) 字段复选框及数字输入处理（为每个阶段构造）
  const estimateFields = ['Send', 'Review', 'Agree'];
  const pakEstimateCells = estimateFields.map(type => {
    const key = `estimate${type}`;                // 例如 "estimateSend"
    const amountKey = `${key}Amount`;             // 例如 "estimateSendAmount"
    return (
      //<TableCell key={`pak-${key}`} align="center">
      <React.Fragment key={`pak-${key}`}>
        <EditableCheckbox 
          value={row.pak?.[key] || false}
          onChange={e => change('pak', key, e.target.checked)}
          disabled={!row.pak?.active}
        />
        <EditableNumberField 
          value={row.pak?.[amountKey] || ''} 
          onChange={e => change('pak', amountKey, e.target.value)} 
          disabled={!row.pak?.active}
        />
      </React.Fragment>
      //</TableCell>

    );
  });
  const wtrEstimateCells = estimateFields.map(type => {
    const key = `estimate${type}`, amountKey = `${key}Amount`;
    return (
      //<TableCell key={`wtr-${key}`} align="center">
      <React.Fragment key={`pak-${key}`}>
        <EditableCheckbox 
          value={row.wtr?.[key] || false}
          onChange={e => change('wtr', key, e.target.checked)}
          disabled={!row.wtr?.active}
        />
        <EditableNumberField 
          value={row.wtr?.[amountKey] || ''} 
          onChange={e => change('wtr', amountKey, e.target.value)} 
          disabled={!row.wtr?.active}
        />
      </React.Fragment>
      //</TableCell>
    );
  });
  const strEstimateCells = estimateFields.map(type => {
    const key = `estimate${type}`, amountKey = `${key}Amount`;
    return (
      //<TableCell key={`str-${key}`} align="center">
      <React.Fragment key={`pak-${key}`}>
        <EditableCheckbox 
          value={row.str?.[key] || false}
          onChange={e => change('str', key, e.target.checked)}
          disabled={!row.str?.active}
        />
        <EditableNumberField 
          value={row.str?.[amountKey] || ''} 
          onChange={e => change('str', amountKey, e.target.value)} 
          disabled={!row.str?.active}
        />
      </React.Fragment>
      //</TableCell>
    );
  });

  // 返回渲染的表格行单元格集合
  return (
    <>
      {/* 可编辑文本单元格 */}
      <EditableCell field="location"  value={row.location}  onChange={change} />
      <EditableCell field="year"      value={row.year}      onChange={change} />
      <EditableCell field="insurance" value={row.insurance} onChange={change} />
      {/* 独立布尔复选框字段 */}
      <EditableCheckbox value={row.arol} onChange={toggleArol} />
      <EditableCheckbox value={row.test} onChange={toggleTest} />
      {/* PAK 阶段 */}
      <ToggleBox section="pak" data={row.pak} onToggleActive={toggleMain} onDateChange={change} />
      <EditableCheckbox value={row.pak?.pout} onChange={togglePout} disabled={!row.pak?.active} />
      <EditableCheckbox value={row.pak?.pack} onChange={togglePack} disabled={!row.pak?.active} />
      {pakEstimateCells}
      {/* WTR 阶段 */}
      <ToggleBox section="wtr" data={row.wtr} onToggleActive={toggleMain} onDateChange={change} />
      <EditableCheckbox value={row.wtr?.ctrc} onChange={toggleCtrc} disabled={!row.wtr?.active} />
      <EditableCheckbox value={row.wtr?.demo} onChange={toggleDemo} disabled={!row.wtr?.active} />
      <EditableCheckbox value={row.wtr?.itel} onChange={toggleItel} disabled={!row.wtr?.active} />
      <EditableCheckbox value={row.wtr?.eq}   onChange={toggleEq}   disabled={!row.wtr?.active} />
      <EditableCheckbox value={row.wtr?.pick} onChange={togglePick} disabled={!row.wtr?.active} />
      {wtrEstimateCells}
      {/* STR 阶段 */}
      <ToggleBox section="str" data={row.str} onToggleActive={toggleMain} onDateChange={change} />
      <EditableCheckbox value={row.str?.ctrc} onChange={toggleStrCtrc} disabled={!row.str?.active} />
      {strEstimateCells}
      {/* 付款和备注字段 */}
      <EditableNumberField value={row.payment}  onChange={changePayment} />
      <EditableCell field="comments" value={row.comments} onChange={change} />
    </>
  );
});

export default function ProjectProgressTable() {
  const { progress, api } = useTasks();           // 从上下文获取进度数据和 API 函数
  const pendingRef = useRef({});                  // 待发送补丁池

  // 将 progress 转换为行数组，确保 id 存在
  const rows = useMemo(() => {
    if (!progress) return [];
    if (Array.isArray(progress)) {
      return progress;
    }
    // 若 progress 是对象映射，则转换为数组并补充 id 字段
    if (typeof progress === 'object') {
      return Object.entries(progress).map(([id, record]) => 
        record.id ? record : { ...record, id }
      );
    }
    console.error('无效的 progress 数据格式:', progress);
    return [];
  }, [progress]);

  // 防抖函数：在用户停止编辑一段时间后，发送合并后的补丁
  const flushPatches = useCallback(() => {
    const allPatches = pendingRef.current;
    pendingRef.current = {};  // 清空补丁池，重置收集
    // 逐条发送每一行的汇总补丁
    Object.entries(allPatches).forEach(([id, patch]) => {
      api.saveProgress(id, patch);  // 调用 API 保存该行最新进度:contentReference[oaicite:16]{index=16}
    });
  }, [api]);

  // 当某个单元格变化时调用：本地合并数据并将改动加入补丁池
  const handleFieldChange = useCallback((section, key, value, rowId) => {
    if (!rowId) return;
    // 构造最小补丁对象
    const patch = key == null 
      ? { [section]: value }                     // 修改顶层字段
      : { [section]: { [key]: value } };         // 修改嵌套字段
    api.mergeProgress(rowId, patch);             // **即时**本地合并更新（不触发整表重绘）
    // 合并补丁到待发送池（同一行的多次编辑将merge成一个补丁）
    pendingRef.current[rowId] = pendingRef.current[rowId] 
      ? { ...pendingRef.current[rowId], ...patch }
      : patch;
    // 重置防抖计时
    debounceFlush();
  }, [api]);

  // 当阶段 active 状态切换时调用：更新 active 并加入补丁池
  const handleToggleActive = useCallback((section, rowId) => {
    if (!rowId) return;
    // 计算新的 active 值并构造补丁
    const newActive = !(progress.find(r => r.id === rowId)?.[section].active);
    const patch = { [section]: { active: newActive } };
    api.mergeProgress(rowId, patch);    // 本地更新 active 状态
    pendingRef.current[rowId] = pendingRef.current[rowId] 
      ? { ...pendingRef.current[rowId], ...patch }
      : patch;
    debounceFlush();
  }, [api, progress]);

  // 防抖触发更新：1500ms内无新的编辑则触发 flush
  const debounceFlush = useCallback(() => {
    // 清除已有计时器，重新计时（使用 setTimeout 模拟，也可用自定义 useDebounce Hook）
    if (debounceFlush.timer) clearTimeout(debounceFlush.timer);
    debounceFlush.timer = setTimeout(flushPatches, 1500);
  }, [flushPatches]);
  
  // 定义表头内容（两行表头，包括合并单元格）
  const renderTableHeader = () => (
    <>
      <TableRow>
        <TableCell rowSpan={2} align="center">LOCATION</TableCell>
        <TableCell rowSpan={2} align="center">YEAR</TableCell>
        <TableCell rowSpan={2} align="center">INSURANCE</TableCell>
        <TableCell rowSpan={2} align="center">AROL</TableCell>
        <TableCell rowSpan={2} align="center">TEST</TableCell>
        <TableCell rowSpan={2} align="center">PAK</TableCell>
        <TableCell rowSpan={2} align="center">POUT</TableCell>
        <TableCell rowSpan={2} align="center">PACK</TableCell>
        <TableCell colSpan={2} align="center">PAK ESTIMATE</TableCell>
        <TableCell rowSpan={2} align="center">WTR</TableCell>
        <TableCell rowSpan={2} align="center">CTRC</TableCell>
        <TableCell rowSpan={2} align="center">DEMO</TableCell>
        <TableCell rowSpan={2} align="center">ITEL</TableCell>
        <TableCell rowSpan={2} align="center">EQ</TableCell>
        <TableCell rowSpan={2} align="center">PICK</TableCell>
        <TableCell colSpan={2} align="center">WTR ESTIMATE</TableCell>
        <TableCell rowSpan={2} align="center">STR</TableCell>
        <TableCell rowSpan={2} align="center">CTRC</TableCell>
        <TableCell colSpan={2} align="center">STR ESTIMATE</TableCell>
        <TableCell rowSpan={2} align="center">PAYMENT</TableCell>
        <TableCell rowSpan={2} align="center">COMMENTS</TableCell>
      </TableRow>
      <TableRow>
        <TableCell align="center">SEND</TableCell>
        <TableCell align="center">REVIEW</TableCell>
        <TableCell align="center">SEND</TableCell>
        <TableCell align="center">REVIEW</TableCell>
        <TableCell align="center">SEND</TableCell>
        <TableCell align="center">REVIEW</TableCell>
      </TableRow>
    </>
  );

  useEffect(() => {
    // 首次进入页面拉一次进度表
    api.loadProgress();
  }, [api]);

  // 渲染组件主体：使用 TableVirtuoso 实现虚拟列表
  return (
    <Paper style={{ height: 600, width: '100%', position: 'relative' }}>
      <TableVirtuoso
        data={rows}
        components={{
          Scroller: React.forwardRef((props, ref) => (
            // 自定义 Scroller 保持 MUI Paper 容器
            <Paper {...props} ref={ref} style={{ ...props.style, overflowY: 'auto' }}/>
          )),
          Table: (props) => (
            <Table {...props} size="small" sx={{ borderCollapse: 'collapse', '& td, & th': { border: '1px solid #ccc', padding: '4px' } }}/>
          ),
          TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
          TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
        }}
        fixedHeaderContent={renderTableHeader}         // 固定表头（两行）
        itemContent={(index, row) => (
          // 渲染每一行内容，传入局部更新的回调（已绑定当前行ID）
          <DataRow 
            row={row}
            onFieldChange={(section, key, value) => handleFieldChange(section, key, value, row.id)}
            onToggleActive={(section) => handleToggleActive(section, row.id)}
          />
        )}
      />
    </Paper>
  );
}
