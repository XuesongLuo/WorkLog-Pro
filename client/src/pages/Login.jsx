// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../api/authApi';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onLogin?.(res.user);
      navigate('/'); 
    } catch (err) {
      setError(err.message || '登录失败');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#f7f7f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, minWidth: 340, maxWidth: 400 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <LockOutlinedIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography component="h1" variant="h5" fontWeight={600}>
            用户登录
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="用户名"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="密码"
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="切换密码可见性"
                    onClick={() => setShowPwd((v) => !v)}
                    edge="end"
                  >
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" fontSize="0.95rem" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? '登录中...' : '登 录'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
