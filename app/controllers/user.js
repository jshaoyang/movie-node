var User = require('../models/user');

//singin
//showSignup
exports.showSignup = function(req,res){
    res.render('signup',{
        title:'注册页面'
    })
}    
exports.showSignin = function(req,res){
    res.render('signin',{
        title:'登录页面'
    })
}
//通过一些异步的方案：人性化方案：通知用户名被注册，建议用什么用户名，提示密码错误，
//signup
exports.signup = function(req,res){
    var _user = req.body.user;//还有其他方式param
    //var _user = req.param('user');//express内部的实现，param其实是对于body,query,router三种方式的封装
    var user = new User(_user);//不做校验，生成user数据
    //做登录用户去重判断
    User.findOne({name:_user.name},function(err,user){
        if(err){//查找用户名是否存在出现异常
            console.log(err)
        }
        if(user){//如果数据库没有相同name 会返回find 返回的是个[]，findOne返回的是{}
            return res.redirect('/signin')
        }else{
            var user = new User(_user);
            req.session.user = user;
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
            })
            res.redirect('/');
        }
    })
    //优先级 router>body>query
    //var _userid = req.params.userid;
    // /user/signup/1111?userid= 11123
    //var _userid = req.query.userid;
    //var _userid = req.body.userid;//表单提交数据，根据提交方式不同，能在后台路由处以不同方式拿到值
    //打印出来是个对象，因为我们在前面加的express bodyParser中间件，将post body里的内容将它初始化成一个对象。
}
exports.signin = function(req,res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/signup')
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err)
            }
            if(isMatch) {
                req.session.user = user;//服务器和客户端会话状态
                console.log('Password is Matched')
                return res.redirect('/')
            }else{
                return res.redirect('/signin')
                console.log('Password is not Matched')
            }
        })
    })
}
//logout
exports.logout = function(req,res){
    delete req.session.user;
    delete res.locals.user;
    res.redirect('/')
}
//userlist page
exports.userlist = function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.render('userlist',{
            title:'movie 用户列表',
            users:users
        })
    })
    
}

//midware for user
exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();  
}
exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role <= 10){
        return res.redirect('/signin');
    }
    next();  
}
exports.delete = function(req,res) {
    var id = req.query.id;
    console.log(id)
    //res.json({success:1})
    if(id){
        User.remove({_id:id},function(err,user) {
            if(err){
                console.log(err);
            }else{
                res.json({success:2})
            }
        })
    }
}