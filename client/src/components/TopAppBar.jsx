// src/components/TopAppBar.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getCurrentUser, logout } from '../utils/authUtils';
import { useTranslation } from 'react-i18next';

  /**
   * Top level app bar
   * @param {boolean}  showHomeButton  是否显示“返回”按钮
   * @param {function} onHomeClick     点击回调
   */
export default function TopAppBar({ showHomeButton = false, onHomeClick }) {
  /* ===== 菜单开关 ===== */
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { t, i18n, ready } = useTranslation();
  if (!ready) return null;
  
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);
  
  const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  /* 切换语言并关闭菜单 */
  const chooseLang = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem('appLang', value);
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/login');
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
          {/* 可切换的抽屉或侧边栏按钮 */}
          <IconButton edge="start" color="inherit" onClick={handleMenuOpen} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem selected={i18n.language === 'en'} onClick={() => chooseLang('en')}>
            English
          </MenuItem>
          <MenuItem selected={i18n.language === 'es'} onClick={() => chooseLang('es')}>
            Español
          </MenuItem>
          <MenuItem selected={i18n.language === 'zh'} onClick={() => chooseLang('zh')}>
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
            {t('TopAppBar.BackButton')}
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />
        {/* 用户名和登出 */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">
              {currentUser.username}
            </Typography>
            <Button 
              color="inherit"
              size="small"
              onClick={handleLogout}
              sx={{ minWidth: 0, px: 1, fontSize: '0.75rem' }}
            >
              {t('TopAppBar.logOut')}
            </Button>
          </Box>
        )}
        
      </Toolbar>
    </AppBar>
  );
}
  