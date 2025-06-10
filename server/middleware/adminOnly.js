// middleware/adminOnly.js
function adminOnly(req, res, next) {
    // 依赖于前面的 auth，把 req.user 挂载上来了
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' });
    }
    next();
  }
  module.exports = adminOnly;
  