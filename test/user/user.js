//测试用例  用到一些测试用的模块
//密码。对于随机字符串的生成

var crypto = require('crypto');
var bcrypt = require('bcrypt');//密码加密

function getRandomString(len){//用来测试user有一个名字
   if(!len) len = 16;
   return crypto.randomBytes(Math.ceil(len/2)).toString('hex');
}
var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
//var User = require('../../app/models/user');
var User = mongoose.model('User');//使通过mongoose.model拿User
var user;
//test 测试用例
describe('<Unit Test',function(){//可嵌套
	describe('Model User:',function(){
		before(function(done){//测试用例开始前
			user = {
				name: getRandomString(),
				password:'password',
			}
			done();
		})
		describe('Before Method save',function(){
			//it代表一个测试用例
			it('should begin without test user',function(done){
				User.find({name:user.name},function(err,users){//user数据是不存在的
					users.should.have.length(0);//users数组为空,查不到name用户
                    done()
				})
			})
		})
		describe('User save',function(){
			//it代表一个测试用例
			it('should save without problems',function(done){
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);//判断err是否是真，若是真会有问题
					_user.remove(function(err){//删除user，后面还会save其他user
                    	should.not.exist(err);
                    	done();

					})
				})
			})
			//new user 会生密码，确定密码的生成是没有问题的。
			it('should password be hashed correctly',function(done){
				var password = user.password;
				var _user = new User(user);
				_user.save(function(err){
					should.not.exist(err);//判断err是否是真，若是真会有问题
					_user.password.should.not.have.length(0);
					bcrypt.compare(password, _user.password, function(err,isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);
						_user.remove(function(err){//删除user，后面还会save其他user
                    		should.not.exist(err);
                    		done()
                    	})
					})
				})
			})
			//权限问题，判断是否是0
			it('should have default role 0',function(done){
				var _user = new User(user);
				_user.save(function(err){
					_user.role.should.equal(0);
					_user.remove(function(err){//删除user，后面还会save其他user
                		done()
                	})
				})
			})

			//存储一个存在的user 要报错
			it('should fail to save an existing user',function(done){
				var _user1 = new User(user);
				_user1.save(function(err){
					should.not.exist(err);
					var _user2 = new User(user);
					_user2.save(function(err){
                		should.exist(err);
                		_user1.remove(function(err){
	                		if(!err){
	                			_user2.remove(function(err){
	                				done();
	                			})
	                		}
                		})
                	})
				})
			})
		})
	})
})