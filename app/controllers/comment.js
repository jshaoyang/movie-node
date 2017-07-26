var Comment = require('../models/comment');
var _ = require('underscore');
//comment
exports.save = function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	console.log(_comment.cid);
	if(_comment.cid){//提交的表单不是评论而是回复的处理
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			//console.log(comment);
			// console.log(comment.reply);
			// console.log(reply);
			comment.reply.push(reply);
            comment.save(function(err,comment){
            	console.log(comment)
                if(err){
    				console.log(err);
    			}
    			res.redirect('/movie/' + movieId);
           	})
		})
	}else{
		var comment = new Comment(_comment);
		comment.save(function(err, comment){
	    	if(err){
	    		console.log(err);
	    	}
	    	res.redirect('/movie/' + movieId);
    	})
	}
}
