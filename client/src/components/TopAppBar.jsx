// src/components/TopAppBar.jsx
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Select,
    MenuItem
  } from '@mui/material';
  import MenuIcon from '@mui/icons-material/Menu';
  import { useState } from 'react';
  
  export default function TopAppBar() {
    const [lang, setLang] = useState('zh');
  
    const handleLangChange = (e) => setLang(e.target.value);
  
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WorkLog Pro
          </Typography>
          <Select
            value={lang}
            onChange={handleLangChange}
            size="small"
            variant="standard"
            sx={{ color: '#fff', borderBottom: '1px solid white' }}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
    );
  }
  