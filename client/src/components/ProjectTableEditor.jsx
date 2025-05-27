import React, { useState, useCallback } from 'react';
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

import EditableCell from './EditableCell';
import ToggleBox from './ToggleBox';

const EXTRA_FIELDS = ['pout', 'pack', 'ctrc', 'demo', 'itel', 'eq', 'pick', 'ctrc'];
const ESTIMATE = ['Send', 'Review', 'Agree'];


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

function useRowCallbacks(rowIndex, onFieldChange, onToggleActive) {
  // 顶层字段或嵌套字段都走同一个入口
    const change = useCallback(
        (section, key, val) => onFieldChange(rowIndex, section, key, val),
        [rowIndex, onFieldChange]
    );
    const toggleMain = useCallback(
        section => onToggleActive(rowIndex, section),
        [rowIndex, onToggleActive]
    );
    return { change, toggleMain };
}


const DataRow = React.memo(function DataRow({ row, index, onFieldChange, onToggleActive }) {
    const { change, toggleMain } = useRowCallbacks(index, onFieldChange, onToggleActive);

    const toggleArol = useCallback(e => change('arol', null, e.target.checked), [change]);
    const toggleTest = useCallback(e => change('test', null, e.target.checked), [change]);
    return (
        <TableRow>
            <EditableCell rowIndex={index} field="location"  value={row.location}  onChange={onFieldChange} />
            <EditableCell rowIndex={index} field="year"      value={row.year}      onChange={onFieldChange} />
            <EditableCell rowIndex={index} field="insurance" value={row.insurance} onChange={onFieldChange} />
            <TableCell ><Checkbox checked={row.arol} onChange={(e) => change('arol', null, e.target.checked)} /></TableCell>
            <TableCell ><Checkbox checked={row.test} onChange={(e) => change('test', null, e.target.checked)} /></TableCell>

            <ToggleBox
                section="pak"
                rowIndex={index}
                data={row.pak}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
            {EXTRA_FIELDS.slice(0, 2).map(key => (   // 'pout', 'pack'
                <TableCell key={key}>
                <Checkbox
                    disabled={!row.pak.active}
                    checked={row.pak[key] || false}
                    onChange={e =>
                    change('pak', key, e.target.checked)
                    }
                />
                </TableCell>
            ))}
            {renderEstimateCells(row, 'pak', index, !row.pak.active)} 

            <ToggleBox                   // ① WTR 主开关 + 日期
                section="wtr"
                rowIndex={index}
                data={row.wtr}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
            {EXTRA_FIELDS.slice(2, 7).map(key => (   // 'ctrc', 'demo', 'itel', 'eq', 'pick'
                <TableCell key={key}>
                <Checkbox
                    disabled={!row.wtr.active}
                    checked={row.wtr[key] || false}
                    onChange={e =>
                    change('wtr', key, e.target.checked)
                    }
                />
                </TableCell>
            ))}
            {renderEstimateCells(row, 'wtr', index, !row.wtr.active)} 

            <ToggleBox                   // ① STR 主开关 + 日期
                section="str"
                rowIndex={index}
                data={row.str}
                onToggleActive={toggleMain} 
                onDateChange={change}
            />
            {EXTRA_FIELDS.slice(7, 8).map(key => (   // 'ctrc'
                <TableCell key={key}>
                <Checkbox
                    disabled={!row.str.active}
                    checked={row.str[key] || false}
                    onChange={e =>
                    change('str', key, e.target.checked)
                    }
                />
            {renderEstimateCells(row, 'str', index, !row.str.active)} 
            <TableCell >
                <TextField
                    type="number"
                    size="small"
                    value={row.payment || ''}
                    onChange={(e) => change('payment', null, e.target.value)}
                    sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                            paddingLeft: '2px',
                            paddingRight: '2px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            fontSize: '0.85rem'
                        },
                        '& .MuiOutlinedInput-root': {
                            paddingRight: 0
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
            </TableCell>
            <EditableCell
                rowIndex={index}
                field="comments"
                value={row.comments}
                onChange={handleChange}
            />
        </TableRow>
    );
});


export default function ProjectTableEditor() {
    const [rows, setRows] = useState(initialData);
    const [feedback, setFeedback] = useState({});

    const handleChangeStable = useCallback((rowIndex, section, key, value) => {
        //if (['arol', 'test', 'payment', 'location', 'year', 'insurance', 'comments'].includes(section)) {
        //    updatedRows[rowIndex][section] = value;
        //}
        setRows(prev =>
            prev.map((r,i) =>
                i !== rowIndex
                ? r
                : key == null
                    ? { ...r, [section]: value }                             // 顶层字段
                    : { ...r, [section]: { ...r[section], [key]: value } }   // 嵌套字段
            )
        );
    }, []);

    const handleToggleActiveStable = useCallback((rowIndex, section) => {
        setRows(prev => prev.map((r,i)=>
            i!==rowIndex
            ? r
            : { ...r, [section]: { ...r[section], active: !r[section].active } }
        ));
        const id = `${rowIndex}-${section}`;
        setFeedback(p => ({ ...p, [id]: true }));
        setTimeout(() => setFeedback(p => ({ ...p, [id]: false })), 800);
    }, []);


    const handleToggleActive = (rowIndex, section) => {
        //const updatedRows = [...rows];
        //updatedRows[rowIndex][section].active = !updatedRows[rowIndex][section].active;
        //setRows(updatedRows);
        setRows(prev =>
            prev.map((r,i)=>
                i!==rowIndex
                ? r
                : { ...r, [section]: { ...r[section], active: !r[section].active } }
            )
        );

        const id = `${rowIndex}-${section}`;
        setFeedback((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [id]: false }));
        }, 800);
    };


    const renderCheckAndInput = (active, date, onToggle, onDateChange) => {
        return (
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    px: 0.5,  
                    py: 0.5,              
                    boxSizing: 'border-box'
                }}
                >
                {/* 左上角控制启用/禁用 */}
                <Checkbox
                    size="small"
                    checked={active}
                    onChange={onToggle}
                    sx={{
                    position: 'absolute',
                    top: 2,                // 稍微向下调整
                    left: 2,               // 稍微向右调整
                    p: 0,                  // 完全去掉内边距
                    '& .MuiSvgIcon-root': {
                        fontSize: '1.2rem'  // 稍微调小图标大小
                    }
                    }}
                />
                {/* 底部日期输入框 */}
                <TextField
                    type="date"
                    size="small"
                    value={date || ''}
                    onChange={onDateChange}
                    disabled={!active}
                    fullWidth
                    sx={{    
                        '& .MuiInputBase-input': {
                            p: '4px',
                            fontSize: '0.85rem'
                        },
                        '& .MuiOutlinedInput-root': { pr: 0 }
                    }}
                />
                </Box>
        );
    };

    const renderEstimateCells = (row, section, index, disabled) => (
        ESTIMATE.map((type) => {
            const lc = type.toLowerCase();
            return (
                <TableCell 
                    key={section + lc}
                >
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
        })
    );

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                项目数据表格编辑器
            </Typography>
            <TableContainer component={Paper}>
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
                        {rows.map((row, index) => (
                            <DataRow
                                key={index}
                                row={row}
                                index={index}
                                onFieldChange={handleChangeStable}
                                onToggleActive={handleToggleActiveStable}
                            />
                          /*<TableRow key={index}>
                            <EditableCell
                                rowIndex={index}
                                field="location"
                                value={row.location}
                                onChange={handleChange}
                            />
                            <EditableCell
                                rowIndex={index}
                                field="year"
                                value={row.year}
                                onChange={handleChange}
                            />
                            <EditableCell
                                rowIndex={index}
                                field="insurance"
                                value={row.insurance}
                                onChange={handleChange}
                            />
                            <TableCell ><Checkbox checked={row.arol} onChange={(e) => handleChange(index, 'arol', null, e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox checked={row.test} onChange={(e) => handleChange(index, 'test', null, e.target.checked)} /></TableCell>
                            {/*<TableCell sx={{backgroundColor: '#f8bcbc', minHeight: '60px', minWidth: '110px', verticalAlign: 'top', position: 'relative', p: 0 }} >{renderCheckAndInput(row.pak?.active, row.pak?.startDate, () => handleToggleActive(index, 'pak'), (e) => handleChange(index, 'pak', 'startDate', e.target.value), 'pak', index)}</TableCell>
                            <ToggleBox
                                section="pak"
                                rowIndex={index}
                                data={row.pak}
                                onToggleActive={handleToggleActive}
                                onDateChange={handleChange}
                            />
                            {EXTRA_FIELDS.slice(0, 2).map(key => (   // 'pout', 'pack'
                                <TableCell key={key}>
                                <Checkbox
                                    disabled={!row.pak.active}
                                    checked={row.pak[key] || false}
                                    onChange={e =>
                                    handleChange(index, 'pak', key, e.target.checked)
                                    }
                                />
                                </TableCell>
                            ))}
                            {renderEstimateCells(row, 'pak', index, !row.pak.active)} 
                           <TableCell ><Checkbox disabled={!row.pak?.active} checked={row.pak?.pout} onChange={(e) => handleChange(index, 'pak', 'pout', e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox disabled={!row.pak?.active} checked={row.pak?.pack} onChange={(e) => handleChange(index, 'pak', 'pack', e.target.checked)} /></TableCell>
                            {renderEstimateCells(row, 'pak', index, !row.pak?.active)}
                            <ToggleBox                   // ① WTR 主开关 + 日期
                                section="wtr"
                                rowIndex={index}
                                data={row.wtr}
                                onToggleActive={handleToggleActive}
                                onDateChange={handleChange}
                            />

                            {EXTRA_FIELDS.slice(2, 7).map(key => (   // 'ctrc', 'demo', 'itel', 'eq', 'pick'
                                <TableCell key={key}>
                                <Checkbox
                                    disabled={!row.wtr.active}
                                    checked={row.wtr[key] || false}
                                    onChange={e =>
                                    handleChange(index, 'wtr', key, e.target.checked)
                                    }
                                />
                                </TableCell>
                            ))}
                    
                            {renderEstimateCells(row, 'wtr', index, !row.wtr.active)} 

                            {/*<TableCell sx={{backgroundColor: '#f8bcbc', minHeight: '60px', minWidth: '110px', verticalAlign: 'top', position: 'relative', p: 0 }} >{renderCheckAndInput(row.wtr?.active, row.wtr?.startDate, () => handleToggleActive(index, 'wtr'), (e) => handleChange(index, 'wtr', 'startDate', e.target.value), 'wtr', index)}</TableCell>
                            <TableCell ><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.ctrc} onChange={(e) => handleChange(index, 'wtr', 'ctrc', e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.demo} onChange={(e) => handleChange(index, 'wtr', 'demo', e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.itel} onChange={(e) => handleChange(index, 'wtr', 'itel', e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.eq} onChange={(e) => handleChange(index, 'wtr', 'eq', e.target.checked)} /></TableCell>
                            <TableCell ><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.pick} onChange={(e) => handleChange(index, 'wtr', 'pick', e.target.checked)} /></TableCell>
                            {renderEstimateCells(row, 'wtr', index, !row.wtr?.active)}

                            <ToggleBox                   // ① STR 主开关 + 日期
                                section="str"
                                rowIndex={index}
                                data={row.str}
                                onToggleActive={handleToggleActive}
                                onDateChange={handleChange}
                            />

                          
                            {EXTRA_FIELDS.slice(7, 8).map(key => (   // 'ctrc'
                                <TableCell key={key}>
                                <Checkbox
                                    disabled={!row.str.active}
                                    checked={row.str[key] || false}
                                    onChange={e =>
                                    handleChange(index, 'str', key, e.target.checked)
                                    }
                                />
                                </TableCell>
                            ))}

                            
                            {renderEstimateCells(row, 'str', index, !row.str.active)} 
                            {/*<TableCell sx={{backgroundColor: '#f8bcbc', minHeight: '60px', minWidth: '110px', verticalAlign: 'top', position: 'relative', p: 0 }} >{renderCheckAndInput(row.str?.active, row.str?.startDate, () => handleToggleActive(index, 'str'), (e) => handleChange(index, 'str', 'startDate', e.target.value), 'str', index)}</TableCell>
                            <TableCell ><Checkbox disabled={!row.str?.active} checked={row.str?.ctrc} onChange={(e) => handleChange(index, 'str', 'ctrc', e.target.checked)} /></TableCell>
                            {renderEstimateCells(row, 'str', index, !row.str?.active)}
                            <TableCell >
                                <TextField
                                    type="number"
                                    size="small"
                                    value={row.payment || ''}
                                    onChange={(e) => handleChange(index, 'payment', null, e.target.value)}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputBase-input': {
                                            paddingLeft: '2px',
                                            paddingRight: '2px',
                                            paddingTop: '4px',
                                            paddingBottom: '4px',
                                            fontSize: '0.85rem'
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            paddingRight: 0
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
                            </TableCell>
                            <EditableCell
                                rowIndex={index}
                                field="comments"
                                value={row.comments}
                                onChange={handleChange}
                            />
                            
                        </TableRow>*/
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
