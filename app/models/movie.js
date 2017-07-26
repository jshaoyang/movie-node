var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieSchema);
//编译生成movie 模型  模型名，模式
//模型通过模式(schema)的定义构造而来
console.log('models')
module.exports = Movie