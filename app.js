var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);//利用moongodb做会话的持久化
var app = express();//启动一个web服务
var router = require('./config/routes');
var dbUrl = 'mongodb://localhost/yangdb';
var logger = require('morgan');
var fs = require('fs');
app.use(logger(':method :url :status'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());//session依赖cookie中间件
mongoose.Promise = global.Promise;
//mongoose.connect(dbUrl) ;
//models loading
var models_path = __dirname +'/app/models';
var walk = function(path){//遍历目录
    fs
      .readdirSync(path)
      .forEach(function(file){
        var newPath = path + '/'+file;
        var stat = fs.statSync(newPath);
        if(stat.isFile()){//是个文件
          if(/(.*)(js|coffee)/.test(file)){//校验 js/coffee文件
            require(newPath);
          }
        }else if(stat.isDirectory()){//如果是个文件夹
          walk(newPath)
        }
      })
}
walk(models_path);
app.set('views',path.join(__dirname, './app/views/pages'));
app.set('view engine','jade');
app.use(session({//
	secret:'movie',//配置项
  key:'moviecookie',
  store:new mongoStore({
  	url:dbUrl,
  	collection:'sessions',
  })
}));
 // 表单数据格式化
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);
console.log('movie start on'+port);
//配置入口文件，配置环境安排，打印日志，显示：客户端和服务端有多少请求，请求是什么类型，请求的状态是怎么样的，数据库查询的情况
if('development' === app.get('env')){//确定生成环境
   app.set('showStackError',true);
   app.use(logger(':method :url :status'));
   app.locals.pretty = true;
   mongoose.set('debug',true);
}
app.use(router);
module.exports = app;

//pre handle user 会话持久逻辑预处理