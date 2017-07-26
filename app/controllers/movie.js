var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');
//detail page
exports.detail = function(req,res){
	var id = req.params.id;
	//:id 就可以这样拿到id
	Movie.findById(id,function(err, movie) {
		Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
	            res.render('detail',{
					title:'movie 详情'+movie.title,
					movie:movie,
					comments:comments
				})
			})	
	})
}
//在列表页点击更新的时候，重新回到录入页，将电影的数据初始化到表单中
//admin update movie
exports.update = function(req, res){
   var id = req.params.id;
   if(id) {
	   	Movie.findById(id, function(err, movie){
	   		res.render('admin',{
	   			title:'imooc 后台更新页',
	   			movie:movie
	   		})
	   	})
    }
}
//admin new page
exports.new = function(req,res){
	res.render('admin',{
		title:'movie 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
}
//电影列表
exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
        res.render('list',{
			title:'movie 列表',
			movies:movies
		})
	})
}
//admin post movie 拿到从后台录入页post过来的数据
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== 'undefined'){
		Movie.findById(id,function(err, movie){
			if(err) {
				console.log(err);
			}
			//用post过来的数据来替换掉老的电影数据
            //使用一个 underscore，里面有个方法extend，可以用另外一个对象的新字段，替换掉老的对象里对应字段
			_movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie){
            	if(err){
            		console.log(err);
            	}
            	res.redirect('/movie/'+movie._id);
            })
		})
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
		    country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			flash:movieObj.flash,
			summary:movieObj.sammary
		})
		_movie.save(function(err, movie){
        	if(err){
        		console.log(err);
        	}
        	res.redirect('/movie/'+movie._id);
        })
	}
}

exports.del = function(req,res) {
	var id = req.query.id;
	//res.json({success:1})
	if(id){
		Movie.remove({_id:id},function(err,movie) {
			if(err){
				console.log(err);
			}else{
				res.json({success:1})
			}
		})
	}
}