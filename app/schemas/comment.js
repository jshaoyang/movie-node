var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;//存一个电影的id
// 引入建模模块
// 通过mongose.schema模式接口，定义用户的文档结构，或者数据类型，还可以增加中间件，静态方法，插件等等
var CommentSchema = new Schema({
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	reply:[
  {
	    from:{type:ObjectId,ref:'User'},	
      to:{type:ObjectId,ref:'User'},
      content:String,
	}
  ],
	content:String,
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
CommentSchema.pre('save', function(next){
   if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
   }else{
   	  this.meta.updateAt = Date.now()
   }
   next();
})

CommentSchema.statics = {
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

module.exports = CommentSchema

