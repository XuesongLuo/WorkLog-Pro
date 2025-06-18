// src/components/EditorTableComponents/ReadonlyToggleBox.jsx
import React from 'react';
import { Box } from '@mui/material';
import ReadonlyGreenCheckbox from './ReadonlyGreenCheckbox';
import dayjs from 'dayjs';


function ReadonlyToggleBox({ section }) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 0,
          boxSizing: 'border-box',
          minHeight: 48 // 或根据表格行高调整
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 5,
            left: 5,
          }}
        >
          <ReadonlyGreenCheckbox checked={section?.active} />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1, mt: 2 }}>
          <span
            style={{
              fontSize: 12,
              color: section?.active ? '#222' : '#bbb',
              minWidth: 80, // 或你需要的宽度
              textAlign: 'center'
            }}
          >
            {section?.start_date ? dayjs(section.start_date).format('YYYY-MM-DD') : '--'}
          </span>
        </Box>
      </Box>
    );
  }

export default React.memo(ReadonlyToggleBox);
