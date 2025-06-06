// ProjectTableEditorAnt.jsx
import React, { useEffect, useMemo, useCallback } from 'react';
import { Table } from 'antd';
import { useTasks } from '../contexts/TaskStore';
import VirtualTable from './VirtualTable';
import {
  PakToggleCell, PakPoutCell, PakPackCell,
  WtrToggleCell, WtrCtrcCell, WtrDemoCell, WtrItelCell, WtrEqCell, WtrPickCell,
  StrToggleCell, StrCtrcCell,
  EstimateCell,
  LocationCell, YearCell, InsuranceCell, ArolCell, TestCell,
  PaymentCell, CommentsCell
} from './EditorTableComponents/EditTableCells';

export default function ProjectTableEditorAnt() {
  const { progress, api } = useTasks();

  // 从进度对象生成表格行数组，每行包含唯一的 id
  const rows = useMemo(() => {
    if (!progress) return [];
    return Object.entries(progress).map(([id, record]) => ({ id, ...record }));
  }, [progress]);

  // 保持与原有逻辑一致：在单元格变化时调用 mergeProgress 和 saveCell:contentReference[oaicite:7]{index=7}
  const handleChange = useCallback((rowId, section, key, value) => {
    if (!rowId) return;
    const patch = (key == null)
      ? { [section]: value }
      : { [section]: { [key]: value } };
    api.mergeProgress(rowId, patch);
    api.saveCell(rowId, patch);
  }, [api]);

  // 对应切换按钮（Active 切换）逻辑
  const handleToggleActive = useCallback((rowId, section) => {
    if (!rowId || !progress[rowId]) return;
    const newActive = !progress[rowId][section]?.active;
    const patch = { [section]: { active: newActive } };
    api.mergeProgress(rowId, patch);
    api.saveCell(rowId, patch);
  }, [api, progress]);

  // 初始化加载数据
  useEffect(() => {
    api.loadProgress();
  }, [api]);

  // 列定义：按需求进行分组
  const columns = useMemo(() => [
    // 基础信息列
    {
      title: 'LOCATION',
      dataIndex: 'location',
      width: 120,
      render: (_, record) => (
        <LocationCell row={{ original: record }} /* 无需 onChange */ />
      ),
    },
    {
      title: '基本信息',
      children: [
        {
          title: 'YEAR',
          dataIndex: 'year',
          width: 80,
          render: (_, record) => (
            <YearCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'INSURANCE',
          dataIndex: 'insurance',
          width: 100,
          render: (_, record) => (
            <InsuranceCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'AROL',
          dataIndex: 'arol',
          width: 60,
          render: (_, record) => (
            <ArolCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'TEST',
          dataIndex: 'test',
          width: 60,
          render: (_, record) => (
            <TestCell row={{ original: record }} onChange={handleChange} />
          ),
        },
      ],
    },
    // PAK 及其估价分组
    {
      title: 'PAK',
      children: [
        {
          title: 'PAK',
          dataIndex: ['pak', 'active'], // 仅用于宽度占位，具体渲染由组件处理
          width: 100,
          render: (_, record) => (
            <PakToggleCell
              row={{ original: record }}
              onToggleActive={handleToggleActive}
              onDateChange={handleChange}
            />
          ),
        },
        {
          title: 'POUT',
          dataIndex: ['pak', 'pout'],
          width: 60,
          render: (_, record) => (
            <PakPoutCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'PACK',
          dataIndex: ['pak', 'pack'],
          width: 60,
          render: (_, record) => (
            <PakPackCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'PAK ESTIMATE',
          children: [
            {
              title: 'SEND',
              dataIndex: ['pak', 'estimateSend'], // 占位
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="pak" type="Send" onChange={handleChange} />
              ),
            },
            {
              title: 'REVIEW',
              dataIndex: ['pak', 'estimateReview'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="pak" type="Review" onChange={handleChange} />
              ),
            },
            {
              title: 'AGREE',
              dataIndex: ['pak', 'estimateAgree'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="pak" type="Agree" onChange={handleChange} />
              ),
            },
          ],
        },
      ],
    },
    // WTR 及其估价分组
    {
      title: 'WTR',
      children: [
        {
          title: 'WTR',
          dataIndex: ['wtr', 'active'],
          width: 100,
          render: (_, record) => (
            <WtrToggleCell
              row={{ original: record }}
              onToggleActive={handleToggleActive}
              onDateChange={handleChange}
            />
          ),
        },
        {
          title: 'CTRC',
          dataIndex: ['wtr', 'ctrc'],
          width: 60,
          render: (_, record) => (
            <WtrCtrcCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'DEMO',
          dataIndex: ['wtr', 'demo'],
          width: 60,
          render: (_, record) => (
            <WtrDemoCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'ITEL',
          dataIndex: ['wtr', 'itel'],
          width: 60,
          render: (_, record) => (
            <WtrItelCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'EQ',
          dataIndex: ['wtr', 'eq'],
          width: 60,
          render: (_, record) => (
            <WtrEqCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'PICK',
          dataIndex: ['wtr', 'pick'],
          width: 60,
          render: (_, record) => (
            <WtrPickCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'WTR ESTIMATE',
          children: [
            {
              title: 'SEND',
              dataIndex: ['wtr', 'estimateSend'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="wtr" type="Send" onChange={handleChange} />
              ),
            },
            {
              title: 'REVIEW',
              dataIndex: ['wtr', 'estimateReview'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="wtr" type="Review" onChange={handleChange} />
              ),
            },
            {
              title: 'AGREE',
              dataIndex: ['wtr', 'estimateAgree'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="wtr" type="Agree" onChange={handleChange} />
              ),
            },
          ],
        },
      ],
    },
    // STR 及其估价分组
    {
      title: 'STR',
      children: [
        {
          title: 'STR',
          dataIndex: ['str', 'active'],
          width: 100,
          render: (_, record) => (
            <StrToggleCell
              row={{ original: record }}
              onToggleActive={handleToggleActive}
              onDateChange={handleChange}
            />
          ),
        },
        {
          title: 'CTRC',
          dataIndex: ['str', 'ctrc'],
          width: 60,
          render: (_, record) => (
            <StrCtrcCell row={{ original: record }} onChange={handleChange} />
          ),
        },
        {
          title: 'STR ESTIMATE',
          children: [
            {
              title: 'SEND',
              dataIndex: ['str', 'estimateSend'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="str" type="Send" onChange={handleChange} />
              ),
            },
            {
              title: 'REVIEW',
              dataIndex: ['str', 'estimateReview'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="str" type="Review" onChange={handleChange} />
              ),
            },
            {
              title: 'AGREE',
              dataIndex: ['str', 'estimateAgree'],
              width: 70,
              render: (_, record) => (
                <EstimateCell row={{ original: record }} section="str" type="Agree" onChange={handleChange} />
              ),
            },
          ],
        },
      ],
    },
    // 其他字段
    {
      title: 'PAYMENT',
      dataIndex: 'payment',
      width: 80,
      render: (_, record) => (
        <PaymentCell row={{ original: record }} onChange={handleChange} />
      ),
    },
    {
      title: 'COMMENTS',
      dataIndex: 'comments',
      width: 200,
      render: (_, record) => (
        <CommentsCell row={{ original: record }} onChange={handleChange} />
      ),
    },
  ], [handleChange, handleToggleActive]);

  return (
    <VirtualTable
      columns={columns}
      dataSource={rows}
      rowKey="id"
      // 设置 scroll.y 以启用垂直滚动，scroll.x 可根据实际列宽设定
      scroll={{ y: 600, x: 2000 }}
    />
  );
}
