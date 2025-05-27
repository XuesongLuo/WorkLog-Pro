// src/components/TopAppBar.jsx
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Box,
  } from '@mui/material';
  import MenuIcon from '@mui/icons-material/Menu';
  import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; 
  import { useState } from 'react';
  

  /**
   * Top level app bar
   * @param {boolean}  showHomeButton  是否显示“返回”按钮
   * @param {function} onHomeClick     点击回调
   */
  export default function TopAppBar({ showHomeButton = false, onHomeClick }) {
    const [lang, setLang] = useState('zh');
    /* ===== 菜单开关 ===== */
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    /* 切换语言并关闭菜单 */
    const chooseLang = (value) => {
      setLang(value);
      handleMenuClose();
      // 👉 这里如果有 i18n / Context，可同步更新全局语言
    };
  
    return (
      <AppBar position="static">
        <Toolbar>
           {/* 可切换的抽屉或侧边栏按钮（保留原有） */}
           <IconButton edge="start" color="inherit" onClick={handleMenuOpen} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem selected={lang === 'en'} onClick={() => chooseLang('en')}>
              English
            </MenuItem>
            <MenuItem selected={lang === 'es'} onClick={() => chooseLang('es')}>
              Español
            </MenuItem>
            <MenuItem selected={lang === 'zh'} onClick={() => chooseLang('zh')}>
              中文
            </MenuItem>
          </Menu>
          <Typography variant="h6" sx={{ mr: 2 }}>
            WorkLog
          </Typography>
          {/* ↓↓↓  新增“返回首页”按钮  ↓↓↓ */}
          {showHomeButton && (
            <Button
              color="inherit"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={onHomeClick}
              sx={{ ml: 2 }}
            >
              返回
            </Button>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
        </Toolbar>
      </AppBar>
    );
  }
  