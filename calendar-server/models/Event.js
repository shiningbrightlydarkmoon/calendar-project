const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '日程标题不能为空'],
    trim: true,
    maxlength: [100, '标题不能超过100个字符']
  },
  startDate: {
    type: String,
    required: [true, '开始日期不能为空'],
    match: [/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确']
  },
  endDate: {
    type: String,
    required: [true, '结束日期不能为空'],
    match: [/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确']
  },
  startTime: {
    type: String,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '时间格式不正确']
  },
  endTime: {
    type: String,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '时间格式不正确']
  },
  color: {
    type: String,
    default: '#2979ff',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '颜色格式不正确']
  },
  notes: {
    type: String,
    maxlength: [500, '备注不能超过500个字符']
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// 添加索引以提高查询性能
eventSchema.index({ userId: 1, startDate: 1 });
eventSchema.index({ userId: 1, endDate: 1 });
eventSchema.index({ userId: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Event', eventSchema);