import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  Typography,
  Box,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import EditableCell from './EditableCell';

const initialData = [
  {
    location: '5215 Rosemead Blvd APT F, San Gabriel, CA 91776',
    year: 1984,
    insurance: 'State Farms',
    arol: true,
    test: true,
    pak: {
      active: true,
      startDate: '2024-05-01',
      pout: true,
      pack: true,
      estimateSend: true,
      estimateSendAmount: 1000,
      estimateReview: true,
      estimateReviewAmount: 2000,
      estimateAgree: true,
      estimateAgreeAmount: 3000
    },
    wtr: {
      active: false,
      startDate: '',
      ctrc: false,
      demo: false,
      itel: false,
      eq: false,
      pick: false,
      estimateSend: false,
      estimateSendAmount: '',
      estimateReview: false,
      estimateReviewAmount: '',
      estimateAgree: false,
      estimateAgreeAmount: ''
    },
    str: {
      active: true,
      startDate: '2024-06-01',
      ctrc: true,
      estimateSend: true,
      estimateSendAmount: 1200,
      estimateReview: true,
      estimateReviewAmount: 2200,
      estimateAgree: true,
      estimateAgreeAmount: 3200
    },
    payment: 9628.21,
    comments: ''
  },
  {
    location: '5215 Rosemead Blvd APT F, San Gabriel, CA 91776',
    year: 1984,
    insurance: 'State Farms',
    arol: true,
    test: true,
    pak: {
      active: true,
      startDate: '2024-05-01',
      pout: true,
      pack: true,
      estimateSend: true,
      estimateSendAmount: 1000,
      estimateReview: true,
      estimateReviewAmount: 2000,
      estimateAgree: true,
      estimateAgreeAmount: 3000
    },
    wtr: {
      active: false,
      startDate: '',
      ctrc: false,
      demo: false,
      itel: false,
      eq: false,
      pick: false,
      estimateSend: false,
      estimateSendAmount: '',
      estimateReview: false,
      estimateReviewAmount: '',
      estimateAgree: false,
      estimateAgreeAmount: ''
    },
    str: {
      active: true,
      startDate: '2024-06-01',
      ctrc: true,
      estimateSend: true,
      estimateSendAmount: 1200,
      estimateReview: true,
      estimateReviewAmount: 2200,
      estimateAgree: true,
      estimateAgreeAmount: 3200
    },
    payment: 9628.21,
    comments: ''
  }
];

// 将样式对象提取到组件外部
const tableStyles = { 
    borderCollapse: 'collapse',
    '& td, & th': {
        px: 0.15,
        paddingBottom: 0.15,
        paddingTop: 0,
        border: '1px solid #000',
    }, 
};

const headerStyles = { '& th': { textAlign: 'center', fontWeight: 600 } };

const sectionCellStyles = {
    backgroundColor: '#f8bcbc', 
    minHeight: '60px', 
    minWidth: '110px', 
    verticalAlign: 'top', 
    position: 'relative', 
    p: 0 
};

const checkAndInputBoxStyles = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    px: 0.5,  
    py: 0.5,              
    boxSizing: 'border-box'
};

const checkboxStyles = {
    position: 'absolute',
    top: 2,
    left: 2,
    p: 0,
    '& .MuiSvgIcon-root': {
        fontSize: '1.2rem'
    }
};

const dateFieldStyles = {    
    '& .MuiInputBase-input': {
        p: '4px',
        fontSize: '0.85rem'
    },
    '& .MuiOutlinedInput-root': { pr: 0 }
};

const numberFieldStyles = {
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
        MozAppearance: 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
        WebkitAppearance: 'none',
        margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0
    },
};

export default function ProjectTableEditor() {
    const [rows, setRows] = useState(initialData);
    const [feedback, setFeedback] = useState({});
    const [editingCell, setEditingCell] = useState(null); 

    // 使用useCallback优化事件处理函数
    const handleChange = useCallback((rowIndex, section, key, value) => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            if (['arol', 'test', 'payment', 'location', 'year', 'insurance', 'comments'].includes(section)) {
                updatedRows[rowIndex][section] = value;
            } else if (updatedRows[rowIndex][section]) {
                updatedRows[rowIndex][section][key] = value;
            }
            return updatedRows;
        });
    }, []);

    const handleToggleActive = useCallback((rowIndex, section) => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[rowIndex][section].active = !updatedRows[rowIndex][section].active;
            return updatedRows;
        });

        const id = `${rowIndex}-${section}`;
        setFeedback(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setFeedback(prev => ({ ...prev, [id]: false }));
        }, 800);
    }, []);

    const renderCheckAndInput = useCallback((active, date, onToggle, onDateChange) => {
        return (
            <Box sx={checkAndInputBoxStyles}>
                <Checkbox
                    size="small"
                    checked={active}
                    onChange={onToggle}
                    sx={checkboxStyles}
                />
                <TextField
                    type="date"
                    size="small"
                    value={date || ''}
                    onChange={onDateChange}
                    disabled={!active}
                    fullWidth
                    sx={dateFieldStyles}
                />
            </Box>
        );
    }, []);

    const renderEstimateCells = useCallback((row, section, index, disabled) => {
        return ["Send", "Review", "Agree"].map((type) => {
            const lc = type.toLowerCase();
            return (
                <TableCell key={section + lc}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Checkbox
                            checked={row[section]?.[`estimate${type}`] || false}
                            disabled={disabled}
                            onChange={(e) => handleChange(index, section, `estimate${type}`, e.target.checked)}
                        />
                        <Divider style={{ width: '100%' }} />
                        <TextField
                            type="number"
                            size="small"
                            disabled={disabled}
                            value={row[section]?.[`estimate${type}Amount`] || ''}
                            onChange={(e) => handleChange(index, section, `estimate${type}Amount`, e.target.value)}
                            sx={numberFieldStyles}
                        />
                    </Box>
                </TableCell>
            );
        });
    }, [handleChange]);

    // 使用useMemo缓存渲染的行数据
    const renderedRows = useMemo(() => {
        return rows.map((row, index) => (
            <TableRow key={index}>
                <EditableCell
                    rowIndex={index}
                    field="location"
                    value={row.location}
                    isEditing={editingCell?.rowIndex === index && editingCell?.field === 'location'}
                    onEdit={setEditingCell}
                    onChange={handleChange}
                />
                <EditableCell
                    rowIndex={index}
                    field="year"
                    value={row.year}
                    isEditing={editingCell?.rowIndex === index && editingCell?.field === 'year'}
                    onEdit={setEditingCell}
                    onChange={handleChange}
                />
                <EditableCell
                    rowIndex={index}
                    field="insurance"
                    value={row.insurance}
                    isEditing={editingCell?.rowIndex === index && editingCell?.field === 'insurance'}
                    onEdit={setEditingCell}
                    onChange={handleChange}
                />
                <TableCell>
                    <Checkbox 
                        checked={row.arol} 
                        onChange={(e) => handleChange(index, 'arol', null, e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        checked={row.test} 
                        onChange={(e) => handleChange(index, 'test', null, e.target.checked)} 
                    />
                </TableCell>
                <TableCell sx={sectionCellStyles}>
                    {renderCheckAndInput(
                        row.pak?.active, 
                        row.pak?.startDate, 
                        () => handleToggleActive(index, 'pak'), 
                        (e) => handleChange(index, 'pak', 'startDate', e.target.value)
                    )}
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.pak?.active} 
                        checked={row.pak?.pout} 
                        onChange={(e) => handleChange(index, 'pak', 'pout', e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.pak?.active} 
                        checked={row.pak?.pack} 
                        onChange={(e) => handleChange(index, 'pak', 'pack', e.target.checked)} 
                    />
                </TableCell>
                {renderEstimateCells(row, 'pak', index, !row.pak?.active)}
                <TableCell sx={sectionCellStyles}>
                    {renderCheckAndInput(
                        row.wtr?.active, 
                        row.wtr?.startDate, 
                        () => handleToggleActive(index, 'wtr'), 
                        (e) => handleChange(index, 'wtr', 'startDate', e.target.value)
                    )}
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.wtr?.active} 
                        checked={row.wtr?.ctrc} 
                        onChange={(e) => handleChange(index, 'wtr', 'ctrc', e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.wtr?.active} 
                        checked={row.wtr?.demo} 
                        onChange={(e) => handleChange(index, 'wtr', 'demo', e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.wtr?.active} 
                        checked={row.wtr?.itel} 
                        onChange={(e) => handleChange(index, 'wtr', 'itel', e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.wtr?.active} 
                        checked={row.wtr?.eq} 
                        onChange={(e) => handleChange(index, 'wtr', 'eq', e.target.checked)} 
                    />
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.wtr?.active} 
                        checked={row.wtr?.pick} 
                        onChange={(e) => handleChange(index, 'wtr', 'pick', e.target.checked)} 
                    />
                </TableCell>
                {renderEstimateCells(row, 'wtr', index, !row.wtr?.active)}
                <TableCell sx={sectionCellStyles}>
                    {renderCheckAndInput(
                        row.str?.active, 
                        row.str?.startDate, 
                        () => handleToggleActive(index, 'str'), 
                        (e) => handleChange(index, 'str', 'startDate', e.target.value)
                    )}
                </TableCell>
                <TableCell>
                    <Checkbox 
                        disabled={!row.str?.active} 
                        checked={row.str?.ctrc} 
                        onChange={(e) => handleChange(index, 'str', 'ctrc', e.target.checked)} 
                    />
                </TableCell>
                {renderEstimateCells(row, 'str', index, !row.str?.active)}
                <TableCell>
                    <TextField
                        type="number"
                        size="small"
                        value={row.payment || ''}
                        onChange={(e) => handleChange(index, 'payment', null, e.target.value)}
                        sx={numberFieldStyles}
                    />
                </TableCell>
                <EditableCell
                    rowIndex={index}
                    field="comments"
                    value={row.comments}
                    isEditing={editingCell?.rowIndex === index && editingCell?.field === 'comments'}
                    onEdit={setEditingCell}
                    onChange={handleChange}
                />
            </TableRow>
        ));
    }, [rows, editingCell, handleChange, handleToggleActive, renderCheckAndInput, renderEstimateCells]);

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                项目数据表格编辑器
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small" sx={tableStyles}>
                    <TableHead sx={headerStyles}>
                        <TableRow>
                            <TableCell rowSpan={2}>LOCATION</TableCell>
                            <TableCell rowSpan={2}>YEAR</TableCell>
                            <TableCell rowSpan={2}>INSURANCE</TableCell>
                            <TableCell rowSpan={2}>AROL</TableCell>
                            <TableCell rowSpan={2}>TEST</TableCell>
                            <TableCell rowSpan={2}>PAK</TableCell>
                            <TableCell rowSpan={2}>POUT</TableCell>
                            <TableCell rowSpan={2}>PACK</TableCell>
                            <TableCell colSpan={3}>PAK ESTIMATE</TableCell>
                            <TableCell rowSpan={2}>WTR</TableCell>
                            <TableCell rowSpan={2}>CTRC</TableCell>
                            <TableCell rowSpan={2}>DEMO</TableCell>
                            <TableCell rowSpan={2}>ITEL</TableCell>
                            <TableCell rowSpan={2}>EQ</TableCell>
                            <TableCell rowSpan={2}>PICK</TableCell>
                            <TableCell colSpan={3}>WTR ESTIMATE</TableCell>
                            <TableCell rowSpan={2}>STR</TableCell>
                            <TableCell rowSpan={2}>CTRC</TableCell>
                            <TableCell colSpan={3}>STR ESTIMATE</TableCell>
                            <TableCell rowSpan={2}>PAYMENT</TableCell>
                            <TableCell rowSpan={2}>COMMENTS</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SEND</TableCell>
                            <TableCell>REVIEW</TableCell>
                            <TableCell>AGREE</TableCell>
                            <TableCell>SEND</TableCell>
                            <TableCell>REVIEW</TableCell>
                            <TableCell>AGREE</TableCell>
                            <TableCell>SEND</TableCell>
                            <TableCell>REVIEW</TableCell>
                            <TableCell>AGREE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderedRows}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}