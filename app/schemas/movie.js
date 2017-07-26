var mongoose = require('mongoose');
// 引入建模模块
// 通过mongose.schema模式接口，定义用户的文档结构，或者数据类型，还可以增加中间件，静态方法，插件等等
var MovieSchema = new mongoose.Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
// 保存前触发的方法
MovieSchema.pre('save', function(next){
   if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
   }else{
   	  this.meta.updateAt = Date.now()
   }
   next();
})

MovieSchema.statics = {
	//取数据库数据
	fetch:function(cb){
       return this
       	.find({})
       	.sort('meta.updateAt')
        .exec(cb)
    },
    //查询单条数据
    findById:function(id, cb){
    	return this
    	.findOne({_id:id})
    	.exec(cb)
    }
}

module.exports = MovieSchema
