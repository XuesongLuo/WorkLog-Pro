// src/components/EditorTableComponents/EditTableCells.jsx
import React from 'react';
import EditableCell from './EditableTextfield';
import EditableCheckbox from './EditableCheckbox';
import EditableNumberCell from './EditableNumberCell';
import ToggleBox from './ToggleBox';

// 1. PAK 相关单元格组件
const PakToggleCell = React.memo(({ row, onToggleActive, onDateChange }) => (
  <ToggleBox 
    section="pak"
    data={row.original.pak || {}} 
    onToggleActive={(sect) => onToggleActive(row.original.id, sect)}
    onDateChange={(sect, key, val) => onDateChange(row.original.id, sect, key, val)}
  />
), (prevProps, nextProps) => {
  // 只有 pak 相关数据变化时才重新渲染
  const prevPak = prevProps.row.original.pak || {};
  const nextPak = nextProps.row.original.pak || {};
  return prevPak.active === nextPak.active && prevPak.startDate === nextPak.startDate;
});

// PAK 的 POUT checkbox - 会响应 pak.active 的变化
const PakPoutCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.pak?.pout || false}
    disabled={!row.original.pak?.active}  // 关键：依赖 pak.active
    onChange={(e) => onChange(row.original.id, 'pak', 'pout', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevPak = prevProps.row.original.pak || {};
  const nextPak = nextProps.row.original.pak || {};
  // 比较 pout 值和 active 状态
  return prevPak.pout === nextPak.pout && prevPak.active === nextPak.active;
});

// PAK 的 PACK checkbox
const PakPackCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.pak?.pack || false}
    disabled={!row.original.pak?.active}
    onChange={(e) => onChange(row.original.id, 'pak', 'pack', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevPak = prevProps.row.original.pak || {};
  const nextPak = nextProps.row.original.pak || {};
  return prevPak.pack === nextPak.pack && prevPak.active === nextPak.active;
});

// 通用的估价单元格组件
const EstimateCell = React.memo(({ row, section, type, onChange }) => {
  const sectionData = row.original[section] || {};
  const checkboxField = `estimate${type}`;
  const amountField = `estimate${type}Amount`;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, minHeight: 60 }}>
      <input 
        type="checkbox" 
        checked={sectionData[checkboxField] || false}
        disabled={!sectionData.active}  // 关键：依赖对应 section 的 active 状态
        onChange={(e) => onChange(row.original.id, section, checkboxField, e.target.checked)}
        style={{ marginBottom: '4px' }}
      />
      <input 
        type="number" 
        value={sectionData[amountField] ?? ''} 
        disabled={!sectionData.active}  // 关键：依赖对应 section 的 active 状态
        onChange={(e) => onChange(row.original.id, section, amountField, e.target.value)}
        style={{ width: '3.5rem', textAlign: 'center' }}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // 比较相关字段和 active 状态
  const { row: prevRow, section, type } = prevProps;
  const { row: nextRow } = nextProps;
  
  const prevSection = prevRow.original[section] || {};
  const nextSection = nextRow.original[section] || {};
  
  const checkboxField = `estimate${type}`;
  const amountField = `estimate${type}Amount`;
  
  return (
    prevSection[checkboxField] === nextSection[checkboxField] &&
    prevSection[amountField] === nextSection[amountField] &&
    prevSection.active === nextSection.active  // 关键：比较 active 状态
  );
});

// 2. WTR 相关单元格组件
const WtrToggleCell = React.memo(({ row, onToggleActive, onDateChange }) => (
  <ToggleBox 
    section="wtr"
    data={row.original.wtr || {}} 
    onToggleActive={(sect) => onToggleActive(row.original.id, sect)}
    onDateChange={(sect, key, val) => onDateChange(row.original.id, sect, key, val)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.active === nextWtr.active && prevWtr.startDate === nextWtr.startDate;
});

// WTR 的各个 checkbox 组件
const WtrCtrcCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.wtr?.ctrc || false}
    disabled={!row.original.wtr?.active}
    onChange={(e) => onChange(row.original.id, 'wtr', 'ctrc', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.ctrc === nextWtr.ctrc && prevWtr.active === nextWtr.active;
});

const WtrDemoCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.wtr?.demo || false}
    disabled={!row.original.wtr?.active}
    onChange={(e) => onChange(row.original.id, 'wtr', 'demo', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.demo === nextWtr.demo && prevWtr.active === nextWtr.active;
});

// 继续其他 WTR 字段...
const WtrItelCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.wtr?.itel || false}
    disabled={!row.original.wtr?.active}
    onChange={(e) => onChange(row.original.id, 'wtr', 'itel', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.itel === nextWtr.itel && prevWtr.active === nextWtr.active;
});

const WtrEqCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.wtr?.eq || false}
    disabled={!row.original.wtr?.active}
    onChange={(e) => onChange(row.original.id, 'wtr', 'eq', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.eq === nextWtr.eq && prevWtr.active === nextWtr.active;
});

const WtrPickCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.wtr?.pick || false}
    disabled={!row.original.wtr?.active}
    onChange={(e) => onChange(row.original.id, 'wtr', 'pick', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevWtr = prevProps.row.original.wtr || {};
  const nextWtr = nextProps.row.original.wtr || {};
  return prevWtr.pick === nextWtr.pick && prevWtr.active === nextWtr.active;
});

// 3. STR 相关单元格组件
const StrToggleCell = React.memo(({ row, onToggleActive, onDateChange }) => (
  <ToggleBox 
    section="str"
    data={row.original.str || {}}
    onToggleActive={(sect) => onToggleActive(row.original.id, sect)}
    onDateChange={(sect, key, val) => onDateChange(row.original.id, sect, key, val)}
  />
), (prevProps, nextProps) => {
  const prevStr = prevProps.row.original.str || {};
  const nextStr = nextProps.row.original.str || {};
  return prevStr.active === nextStr.active && prevStr.startDate === nextStr.startDate;
});

const StrCtrcCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.str?.ctrc || false}
    disabled={!row.original.str?.active}
    onChange={(e) => onChange(row.original.id, 'str', 'ctrc', e.target.checked)}
  />
), (prevProps, nextProps) => {
  const prevStr = prevProps.row.original.str || {};
  const nextStr = nextProps.row.original.str || {};
  return prevStr.ctrc === nextStr.ctrc && prevStr.active === nextStr.active;
});

// 4. 基础单元格组件（不依赖 active 状态）
const LocationCell = React.memo(({ row, /*onChange*/ }) => (
  /*
  <EditableCell
    field="location"
    value={row.original.location}
    onChange={(field, _key, val) => onChange(row.original.id, field, null, val)}
  />
  */
  <span>{row.original.location}</span>
), (prevProps, nextProps) => {
  return prevProps.row.original.location === nextProps.row.original.location;
});

const YearCell = React.memo(({ row, onChange }) => (
  <EditableCell 
    field="year" 
    value={row.original.year} 
    onChange={(field, _key, val) => onChange(row.original.id, field, null, val)}
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.year === nextProps.row.original.year;
});

const InsuranceCell = React.memo(({ row, onChange }) => (
  <EditableCell 
    field="insurance" 
    value={row.original.insurance} 
    onChange={(field, _key, val) => onChange(row.original.id, field, null, val)}
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.insurance === nextProps.row.original.insurance;
});

const ArolCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.arol || false}
    onChange={(e) => onChange(row.original.id, 'arol', null, e.target.checked)}
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.arol === nextProps.row.original.arol;
});

const TestCell = React.memo(({ row, onChange }) => (
  <EditableCheckbox 
    value={row.original.test || false}
    onChange={(e) => onChange(row.original.id, 'test', null, e.target.checked)}
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.test === nextProps.row.original.test;
});

const PaymentCell = React.memo(({ row, onChange }) => (
  <EditableNumberCell 
    value={row.original.payment} 
    onChange={(val) => onChange(row.original.id, 'payment', null, val)} 
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.payment === nextProps.row.original.payment;
});

const CommentsCell = React.memo(({ row, onChange }) => (
  <EditableCell 
    field="comments" 
    value={row.original.comments} 
    onChange={(field, _key, val) => onChange(row.original.id, field, null, val)}
  />
), (prevProps, nextProps) => {
  return prevProps.row.original.comments === nextProps.row.original.comments;
});

// 导出所有组件
export {
    LocationCell,
    YearCell,
    InsuranceCell,
    ArolCell,
    TestCell,
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
    PaymentCell,
    CommentsCell
};