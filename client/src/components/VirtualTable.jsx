// VirtualTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import { VariableSizeGrid as Grid } from 'react-window';
import classNames from 'classnames';

/**
 * VirtualTable 组件：使用 react-window 的 VariableSizeGrid 实现表格行列的虚拟滚动:contentReference[oaicite:6]{index=6}。
 * 需要传入 columns、dataSource、scroll={ x: number, y: number }、rowKey 等属性。
 */
const VirtualTable = (props) => {
  const { columns, scroll = {}, dataSource, rowKey } = props;
  const [tableWidth, setTableWidth] = useState(0);
  // 计算未设置 width 的列数量，按表宽均分宽度
  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const mergedColumns = columns.map(col => {
    if (col.width) {
      return col;
    }
    // 如果没有指定列宽，则等分剩余宽度
    return {
      ...col,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef();
  // 定义一个对象，Expose scrollLeft 以同步横向滚动
  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => (gridRef.current ? gridRef.current.state.scrollLeft : null),
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });
    return obj;
  });

  // 虚拟列表渲染函数：替换 Table 的 body，生成一个 Grid 表格体
  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    // 将 rc-virtual-list 提供的 ref 与我们的 connectObject 关联，以支持横向滚动联动
    ref.current = connectObject;
    const rowHeight = 54; // 每行固定高度（可根据需要调整）
    const totalHeight = rawData.length * rowHeight;
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          // 最后一个可适当减去滚动条宽度
          const { width } = mergedColumns[index];
          if (totalHeight > scroll.y && index === mergedColumns.length - 1) {
            return width - scrollbarSize - 1;
          }
          return width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => rowHeight}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          // 水平滚动时同步触发 onScroll
          onScroll({ scrollLeft });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
  const column = mergedColumns[columnIndex];
  const dataIndex = column.dataIndex;
  const record = rawData[rowIndex];
  return (
    <div
      className={classNames('virtual-table-cell', {
        'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
      })}
      style={style}
    >
      {
        typeof column.render === 'function'
          ? column.render(undefined, record, rowIndex)
          : (
              Array.isArray(dataIndex)
                ? dataIndex.reduce((obj, key) => (obj ? obj[key] : undefined), record)
                : record[dataIndex]
            )
      }
    </div>
  );
}}
      </Grid>
    );
  };

  return (
    <ResizeObserver onResize={({ width }) => setTableWidth(width)}>
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={{ body: renderVirtualList }}
        // 注意：rowKey 传递给 Table
        rowKey={rowKey}
      />
    </ResizeObserver>
  );
};

export default VirtualTable;
