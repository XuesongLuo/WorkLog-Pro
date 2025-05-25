import React, { useState } from 'react';
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
    payment: 9628.21
  }
];

export default function ProjectTableEditor() {
  const [rows, setRows] = useState(initialData);

  const handleChange = (rowIndex, section, key, value) => {
    const updatedRows = [...rows];
    if (section === 'arol' || section === 'test' || section === 'payment') {
      updatedRows[rowIndex][section] = value;
    } else {
      updatedRows[rowIndex][section][key] = value;
    }
    setRows(updatedRows);
  };

  const renderCheckAndInput = (checked, inputValue, onCheckChange, onInputChange, disabled) => (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Checkbox checked={checked} onChange={onCheckChange} disabled={disabled} />
      <Divider style={{ width: '100%' }} />
      <TextField
        type="date"
        size="small"
        value={inputValue || ''}
        onChange={onInputChange}
        disabled={disabled}
        sx={{ width: '100%' }}
      />
    </Box>
  );

  const renderEstimateCells = (row, section, index, disabled) => (
    <>
      {["Send", "Review", "Agree"].map((type) => {
        const lc = type.toLowerCase();
        return (
          <TableCell key={section + lc} sx={{ borderLeft: '1px solid #ccc' }}>
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
              />
            </Box>
          </TableCell>
        );
      })}
    </>
  );

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        项目数据表格编辑器
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
            <TableRow>
                <TableCell rowSpan={2}>地点</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>YEAR</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>INSURANCE</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>AROL</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>TEST</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>PAK</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>POUT</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>PACK</TableCell>
                <TableCell colSpan={3} align="center" sx={{ borderLeft: '1px solid #ccc' }}>PAK ESTIMATE</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>WTR</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>CTRC</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>DEMO</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>ITEL</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>EQ</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>PICK</TableCell>
                <TableCell colSpan={3} align="center" sx={{ borderLeft: '1px solid #ccc' }}>WTR ESTIMATE</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>STR</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>CTRC</TableCell>
                <TableCell colSpan={3} align="center" sx={{ borderLeft: '1px solid #ccc' }}>STR ESTIMATE</TableCell>
                <TableCell rowSpan={2} sx={{ borderLeft: '1px solid #ccc' }}>付款</TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>SEND</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>REVIEW</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>AGREE</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>SEND</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>REVIEW</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>AGREE</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>SEND</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>REVIEW</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>AGREE</TableCell>
            </TableRow>
            </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.location}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>{row.year}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>{row.insurance}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox checked={row.arol} onChange={(e) => handleChange(index, 'arol', null, e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox checked={row.test} onChange={(e) => handleChange(index, 'test', null, e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>{renderCheckAndInput(row.pak?.active, row.pak?.startDate, (e) => handleChange(index, 'pak', 'active', e.target.checked), (e) => handleChange(index, 'pak', 'startDate', e.target.value), false)}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.pak?.active} checked={row.pak?.pout} onChange={(e) => handleChange(index, 'pak', 'pout', e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.pak?.active} checked={row.pak?.pack} onChange={(e) => handleChange(index, 'pak', 'pack', e.target.checked)} /></TableCell>
                {renderEstimateCells(row, 'pak', index, !row.pak?.active)}
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>{renderCheckAndInput(row.wtr?.active, row.wtr?.startDate, (e) => handleChange(index, 'wtr', 'active', e.target.checked), (e) => handleChange(index, 'wtr', 'startDate', e.target.value), false)}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.ctrc} onChange={(e) => handleChange(index, 'wtr', 'ctrc', e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.demo} onChange={(e) => handleChange(index, 'wtr', 'demo', e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.itel} onChange={(e) => handleChange(index, 'wtr', 'itel', e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.eq} onChange={(e) => handleChange(index, 'wtr', 'eq', e.target.checked)} /></TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.wtr?.active} checked={row.wtr?.pick} onChange={(e) => handleChange(index, 'wtr', 'pick', e.target.checked)} /></TableCell>
                {renderEstimateCells(row, 'wtr', index, !row.wtr?.active)}
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>{renderCheckAndInput(row.str?.active, row.str?.startDate, (e) => handleChange(index, 'str', 'active', e.target.checked), (e) => handleChange(index, 'str', 'startDate', e.target.value), false)}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}><Checkbox disabled={!row.str?.active} checked={row.str?.ctrc} onChange={(e) => handleChange(index, 'str', 'ctrc', e.target.checked)} /></TableCell>
                {renderEstimateCells(row, 'str', index, !row.str?.active)}
                <TableCell sx={{ borderLeft: '1px solid #ccc' }}>
                  <TextField
                    type="number"
                    size="small"
                    value={row.payment || ''}
                    onChange={(e) => handleChange(index, 'payment', null, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
