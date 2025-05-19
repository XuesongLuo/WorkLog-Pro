import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

import { useEffect } from 'react';
import TopAppBar from '../components/TopAppBar';


const CELL_HEIGHT = 30; // 每行高度估算（px）
const CELL_WIDTH = 100; // 每列宽度估算（px）

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 30;
const generateEmptyTable = (rows, cols) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));


export default function ExcelEditor() {

    useEffect(() => {
        const handleResize = () => {
          const availableHeight = window.innerHeight - 150; // 减去导航栏+标题高度
          const availableWidth = window.innerWidth - 100;
      
          const rows = Math.floor(availableHeight / CELL_HEIGHT);
          const cols = Math.floor(availableWidth / CELL_WIDTH);
      
          setTableData((prev) => {
            const data = [...prev];
            while (data.length < rows) data.push([]);
            for (let i = 0; i < data.length; i++) {
              while (data[i].length < cols) data[i].push('');
            }
            return data;
          });
        };
      
        handleResize(); // 初始调用
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);


    const [tableData, setTableData] = useState(generateEmptyTable(DEFAULT_ROWS, DEFAULT_COLS));
    const hotRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // 二维数组
        setTableData(json);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExport = () => {
        const exportData = hotRef.current.hotInstance.getData(); // 获取表格数据
        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, '导出结果.xlsx');
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <TopAppBar />
            {/* 内容区，占满剩余高度（AppBar默认高度64px） */}
            <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px' }}>
                    <h2>Excel 页面功能演示</h2>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <button onClick={handleExport} style={{ marginLeft: '10px' }}>
                    导出 Excel
                    </button>
                </div>

                {/* 表格容器，自适应填满剩余空间 */}
                <div style={{ 
                    flexGrow: 1,
                }}>
                    <HotTable
                        data={tableData}
                        colHeaders={true}
                        rowHeaders={true}
                        contextMenu={true}
                        ref={hotRef}
                        columns={tableData[0]?.map(() => ({ editor: 'text' }))} 
                        minSpareRows={10}
                        minSpareCols={10}
                        manualRowMove={true}
                        manualColumnMove={true}
                        filters={true}
                        dropdownMenu={true}
                        licenseKey="non-commercial-and-evaluation"
                        width="100%"
                        height="100%" 
                    />
                </div>
            </div>
        </div>
    );
}
