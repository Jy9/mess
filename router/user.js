const express = require('express');
const router = express.Router();
const mongod = require("../mongod");

router.post("/login", function(req, res) {
    var option = {
        action:"find",
        collections:"user",
        selector:{ "name": req.body.name},
        fn:fn
    }
    function fn(user){
    	var data = {}
        if (user.length != 0) {
        	if(user.password == req.body.pw){
        		data.status = true;
            	data.user = user[0];
        	}else{
        		data.status = false;
           		data.msg = "账号或密码错误"
        	}
        } else {
        	data.status = false;
            data.msg = "没有该账号，请注册"
            //暂时代替注册
            var obj = req.body;
        	var option1 = {
        		action:"find",
                collections:"user",
                selector:{},
                fn:function(user1){
                    obj.uid = user1.length -0 +1;
                    var option2 = {
		                action:"add",
		                collections:"user",
		                selector:req.body,
		                fn:function(user2){
		                    console.log("注册成功")
		                }
		            }
		            mongod(option2)
                }
        	}
            mongod(option1)
        }
        res.send(data)
    }
    mongod(option)
});

router.post("/register", function(req, res) {
    var option = {
        action:"find",
        collections:"user",
        selector:{ "name": req.body.name },
        fn:fn
    }
    function fn(user){
        if (user.length != 0) {
            res.send({
            	status:false,
                msg: "用户已存在"
            })
        } else {
        	var obj = req.body;
        	/*
        	 {
        	 	name:"" //账号名称 （必须）
        	 	password:"" //密码（必须）
        	 }
        	 * */
        	var option1 = {
        		action:"find",
                collections:"user",
                selector:{},
                fn:function(user1){
                    obj.uid = user1.length -0 +1;
                    var option2 = {
		                action:"add",
		                collections:"user",
		                selector:req.body,
		                fn:function(user2){
		                    res.send({
		                    	status:true,
		                        data: obj
		                    })
		                }
		            }
		            mongod(option2)
                }
        	}
            mongod(option1)
        }
    }
    mongod(option)
})

module.exports = router