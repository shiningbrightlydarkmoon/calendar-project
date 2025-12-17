var express = require('express');
var router = express.Router();
const Event = require('../models/Event');
const moment = require('moment');

// 获取所有日程（支持日期范围查询）
router.get('/', async (req, res) => {
  try {
    console.log('📥 接收查询参数:', req.query);
    
    const { 
      userId = 'default-user', 
      startDate, 
      endDate,
      date // 兼容单日查询
    } = req.query;
    
    let query = { userId };
    
    // 构建日期查询条件
    if (date) {
      // 单日查询：开始日期或结束日期在该天内的日程
      query.$or = [
        { startDate: date },
        { endDate: date },
        { 
          $and: [
            { startDate: { $lte: date } },
            { endDate: { $gte: date } }
          ]
        }
      ];
    } else if (startDate && endDate) {
      // 日期范围查询：与查询时间段有交集的日程
      query.$or = [
        // 日程在查询时间段内开始
        { 
          $and: [
            { startDate: { $gte: startDate } },
            { startDate: { $lte: endDate } }
          ]
        },
        // 日程在查询时间段内结束
        { 
          $and: [
            { endDate: { $gte: startDate } },
            { endDate: { $lte: endDate } }
          ]
        },
        // 日程跨越整个查询时间段
        { 
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ];
    }
    
    console.log('🔍 查询条件:', JSON.stringify(query, null, 2));
    
    const events = await Event.find(query).sort({ startDate: 1, startTime: 1 });
    
    console.log(`✅ 找到 ${events.length} 个日程`);
    
    // 统一响应格式 - 确保返回 { success: true, data: [...] } 格式
    res.json({
      success: true,
      message: '获取日程成功',
      data: events, // 确保使用 data 字段
      count: events.length
    });
  } catch (error) {
    console.error('❌ 获取日程失败:', error);
    res.status(500).json({
      success: false,
      message: '获取日程失败',
      error: error.message
    });
  }
});

// 获取单个日程
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }
    
    // 统一响应格式
    res.json({
      success: true,
      message: '获取日程成功',
      data: event
    });
  } catch (error) {
    console.error('获取日程详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取日程失败',
      error: error.message
    });
  }
});

// 创建新日程
router.post('/', async (req, res) => {
  try {
    console.log('📝 创建日程请求体:', req.body);
    
    const eventData = {
      ...req.body,
      userId: req.body.userId || 'default-user'
    };
    
    // 验证日期逻辑
    if (eventData.startDate > eventData.endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期不能晚于结束日期'
      });
    }
    
    // 如果是同一天，验证时间逻辑
    if (eventData.startDate === eventData.endDate && eventData.startTime >= eventData.endTime) {
      return res.status(400).json({
        success: false,
        message: '开始时间不能晚于或等于结束时间'
      });
    }
    
    const event = new Event(eventData);
    await event.save();
    
    console.log('✅ 日程创建成功:', event._id);
    
    // 统一响应格式
    res.status(201).json({
      success: true,
      message: '日程创建成功',
      data: event
    });
  } catch (error) {
    console.error('❌ 创建日程失败:', error);
    res.status(400).json({
      success: false,
      message: '创建日程失败',
      error: error.message
    });
  }
});

// 更新日程
router.put('/:id', async (req, res) => {
  try {
    console.log('✏️ 更新日程:', req.params.id, req.body);
    
    // 验证日期逻辑
    if (req.body.startDate && req.body.endDate && req.body.startDate > req.body.endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期不能晚于结束日期'
      });
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }
    
    console.log('✅ 日程更新成功:', event._id);
    
    // 统一响应格式
    res.json({
      success: true,
      message: '日程更新成功',
      data: event
    });
  } catch (error) {
    console.error('❌ 更新日程失败:', error);
    res.status(400).json({
      success: false,
      message: '更新日程失败',
      error: error.message
    });
  }
});

// 删除日程
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: '日程不存在'
      });
    }
    
    console.log('✅ 日程删除成功:', req.params.id);
    
    // 统一响应格式
    res.json({
      success: true,
      message: '日程删除成功',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('❌ 删除日程失败:', error);
    res.status(500).json({
      success: false,
      message: '删除日程失败',
      error: error.message
    });
  }
});

// 批量获取日程（按月份）
router.get('/batch/month', async (req, res) => {
  try {
    const { userId = 'default-user', year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: '年份和月份不能为空'
      });
    }
    
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
    
    const events = await Event.find({
      userId,
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { 
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    }).sort({ startDate: 1, startTime: 1 });
    
    // 统一响应格式
    res.json({
      success: true,
      message: '获取月日程成功',
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('❌ 获取月日程失败:', error);
    res.status(500).json({
      success: false,
      message: '获取月日程失败',
      error: error.message
    });
  }
});

// 健康检查端点
router.get('/health/check', async (req, res) => {
  try {
    const count = await Event.countDocuments();
    
    // 统一响应格式
    res.json({
      success: true,
      message: '日程服务运行正常',
      data: {
        totalEvents: count,
        timestamp: new Date().toISOString(),
        database: 'connected'
      }
    });
  } catch (error) {
    console.error('❌ 日程健康检查失败:', error);
    res.status(500).json({
      success: false,
      message: '日程服务异常',
      error: error.message
    });
  }
});

module.exports = router;