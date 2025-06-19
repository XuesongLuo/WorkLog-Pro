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
          minHeight:'100px',  
          height: '100%',
          display: 'flex', // 使用 flex 布局
          flexDirection: 'column', // 垂直排列
          justifyContent: 'center', // 垂直居中
          alignItems: 'center', // 水平居中
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 5,
            left: 5,
            p: 0,
            m: 0,
          }}
        >
          <ReadonlyGreenCheckbox checked={section?.active} />
        </Box>
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            pointerEvents: 'none',        // 不影响点击表格
          }}
        >
          <span
            style={{
              fontSize: 12,
              height: '1.7em',
              color: section?.active ? '#222' : '#bbb',
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
