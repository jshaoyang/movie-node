var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);
//编译生成User 模型  模型名，模式
//模型通过模式(schema)的定义构造而来
module.exports = User