const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件 - 允许所有来源访问（开发环境）
app.use(cors({
  origin: '*', // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// 预检请求处理
app.options('*', cors());

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 请求体:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// 连接 MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://calendaruser:WgevXeEW5nLL0Qn9@calendar-project.grel4xe.mongodb.net/calendar-app?retryWrites=true&w=majority';

console.log('🔗 正在连接 MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ 成功连接到 MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB 连接失败:', error);
  process.exit(1); // 如果数据库连接失败，退出应用
});

// 路由
app.use('/api/events', require('./routes/events'));

// 健康检查端点
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    message: '日历后端服务运行正常'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '日历后端服务运行中',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      events: '/api/events',
      'create-event': 'POST /api/events',
      'update-event': 'PUT /api/events/:id',
      'delete-event': 'DELETE /api/events/:id'
    }
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/events',
      'POST /api/events',
      'GET /api/events/:id',
      'PUT /api/events/:id',
      'DELETE /api/events/:id'
    ]
  });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
  console.error('💥 服务器错误:', error);
  
  // Mongoose 验证错误
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      error: Object.values(error.errors).map(e => e.message)
    });
  }
  
  // Mongoose CastError (无效的ID)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: '无效的ID格式'
    });
  }
  
  // 重复键错误
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在'
    });
  }
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '内部服务器错误'
  });
});

// 获取IP地址函数
const getLocalIP = () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
};

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // 重要：绑定所有网络接口
const localIP = getLocalIP();

// 启动服务器
const server = app.listen(PORT, HOST, () => {
  console.log('\n🚀 =================================');
  console.log('📅 日历后端服务启动成功!');
  console.log('=================================');
  console.log(`📍 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 局域网访问: http://${localIP}:${PORT}`);
  console.log(`⏰ 启动时间: ${new Date().toISOString()}`);
  console.log('=================================\n');
  
  // 显示重要提示
  console.log('💡 重要提示:');
  console.log('   1. 确保手机和电脑连接同一WiFi');
  console.log('   2. 在前端配置中使用局域网IP地址');
  console.log('   3. 如果需要外网访问，请使用内网穿透工具');
  console.log('   4. 检查防火墙设置，确保端口3000可访问\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 收到终止信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    mongoose.connection.close();
    process.exit(0);
  });
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('💥 未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 未处理的Promise拒绝:', reason);
  process.exit(1);
});

module.exports = app;