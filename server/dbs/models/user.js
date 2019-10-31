const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 定义模型
const userSchema = new Schema({
  'id': Number,
  'name': String,
  'password': String,
  'profession': String
})

// 使用模式“编译”模型
module.exports = mongoose.model('Users', userSchema)
