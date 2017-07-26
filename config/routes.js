var _ = require('underscore');
var express = require('express');
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var router = express.Router();//从express中取出router对象

var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/yangdb';
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);
//pre handle user
router.use(function(req,res,next){
	var _user = req.session.user;
	res.locals.user = _user;//预处理user,登出的时候，清除session.user,把改动也能同步到locals上
	next()
})
//加几个主要页面的路由

//first Page
router.get('/',Index.index);
//user
router.post('/user/signup',User.signup);
router.post('/user/signin',User.signin);
router.get('/logout',User.logout);
router.get('/signin',User.showSignin);
router.get('/signup',User.showSignup);
router.get('/admin/user/list',User.signinRequired,User.adminRequired,User.userlist);
//访问userlist,首先需要登录，再次是管理员权限
router.delete('/admin/user/list',User.signinRequired,User.adminRequired,User.delete);
//movie
router.get('/movie/:id',Movie.detail);
router.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
router.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
router.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.save);
router.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
router.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);

//commet
router.post('/user/comment',User.signinRequired,Comment.save);

module.exports = router;