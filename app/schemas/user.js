var mongoose = require('mongoose');
var bcrypt = require('bcrypt');//用此库给密码加盐，专门为密码存储设计的算法
var SALT_WORK_FACTOR = 10;
// 引入建模模块
// 通过mongose.schema模式接口，定义用户的文档结构，或者数据类型，还可以增加中间件，静态方法，插件等等 
//通过mongoose.schema 接口，传入一个对象，对象里面描述用户模型的文档结构和数据类型，生成的模式赋值给userschema,
//
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
  //admin
  //admin
  //super admin
  //0:normal user  1:verfied user 2:professional user
  //>10:admin
  //>50:super admin
  role:{
    type:Number,
    default:0
  },
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
UserSchema.pre('save', function(next){
	var user = this;
   if(this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
   }else{
   	  this.meta.updateAt = Date.now()
   }

   bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
      if(err) return next(err);
      bcrypt.hash(user.password,salt,function(err,hash) {
      	if(err) return next(err);
      	user.password = hash;
      	next()
      })
   })
})

//增加实例方法：通过实例调用方法
UserSchema.methods = {
  comparePassword:function(_password, cb){
    bcrypt.compare(_password,this.password,function(err,isMatch){
      if(err) return cb(err)
      cb(null,isMatch)
    })
  }
}

UserSchema.statics = {
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
    	.sort('meta.updateAt')
    	.exec(cb)
    }
}

module.exports = UserSchema
