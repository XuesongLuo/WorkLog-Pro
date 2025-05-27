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
  },
];

const EXTRA_FIELDS = ['pout', 'pack', 'ctrc', 'demo', 'itel', 'eq', 'pick', 'ctrc'];
const ESTIMATE = ['Send', 'Review', 'Agree'];

function renderEstimateCells(row, section, disabled, onChange) {
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
                        onChange={e => onChange(section, `estimate${type}`, e.target.checked)}
                    />
                    <Divider style={{ width: '100%' }} />
                    <TextField
                        type="number"
                        size="small"
                        disabled={disabled}
                        value={row[section]?.[`estimate${type}Amount`] || ''}
                        onChange={e => onChange(section, `estimate${type}Amount`, e.target.value)}
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
}

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
            <EditableCell rowIndex={index} field="location"  value={row.location}  onChange={change} />
            <EditableCell rowIndex={index} field="year"      value={row.year}      onChange={change} />
            <EditableCell rowIndex={index} field="insurance" value={row.insurance} onChange={change} />
            <TableCell><Checkbox checked={row.arol} onChange={toggleArol} /></TableCell>
            <TableCell><Checkbox checked={row.test} onChange={toggleTest} /></TableCell>
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
            {renderEstimateCells(row, 'pak', !row.pak.active, change)}

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
            {renderEstimateCells(row, 'wtr', !row.wtr.active, change)}

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
                </TableCell>
            ))}
            {renderEstimateCells(row, 'str', !row.str.active, change)} 
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
                onChange={change}
            />
        </TableRow>
    );
});

export default function ProjectTableEditor() {
    const [rows, setRows] = useState(initialData);
    const [feedback, setFeedback] = useState({});

    const handleChange = useCallback((rowIndex, section, key, value) => {
        setRows(prev =>
            prev.map((r,i) =>
                i !== rowIndex
                ? r
                : key == null
                    ? { ...r, [section]: value }                             
                    : { ...r, [section]: { ...r[section], [key]: value } }   
            )
        );
    }, []);

    const handleToggleActive = useCallback((rowIndex, section) => {
        setRows(prev => prev.map((r,i)=>
            i!==rowIndex
            ? r
            : { ...r, [section]: { ...r[section], active: !r[section].active } }
        ));
        const id = `${rowIndex}-${section}`;
        setFeedback(p => ({ ...p, [id]: true }));
        setTimeout(() => setFeedback(p => ({ ...p, [id]: false })), 800);
    }, []);

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                项目编辑器
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
                                onFieldChange={handleChange}
                                onToggleActive={handleToggleActive}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
