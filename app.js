const http = require("http"),
	https = require("https"),
	express = require('express'),
	app = express(),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('body-parser');
	

const config = require('./config.json'),
	upload = require('./router/upload'),
	user = require("./router/user"),
	article = require('./router/article'),
	suggest = require('./router/suggest');

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//router
app.use("/user",user);
app.use("/article",article);
app.use("/upload",upload);
app.use("/suggest",suggest);

var options = {
	key:fs.readFileSync('./2_ccskill.club.key'),
	cert:fs.readFileSync('./1_ccskill.club_bundle.crt')
};
 
https.createServer(options, app).listen(config.POST,function(){
	console.log(config.POST+"端口已启动！")
});