var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);
//编译生成movie 模型  模型名，模式
//模型通过模式(schema)的定义构造而来
module.exports = Comment