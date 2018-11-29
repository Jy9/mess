const express = require('express');
const router = express.Router();
const mongod = require("../mongod");

function createArticle(collections,req,res){
	var option = {
        action:"find",
        collections:collections,
        selector:{ "name": req.body.name,"isShow":true},
        fn:fn
    }
    function fn(jsonData){
    	var data = {}
        if (jsonData.length == 0) {
        	var obj = req.body;
        	/*
        	{
	        	"img" : "image/DSCN0614_small.jpg", //封面
	        	"type" : "小说", //类型 （小说 短文）
	        	"articleType" : "武侠小说", //小说分类
	        	"name" : "测试专用小说4", //小说名字
	        	"des" : "测试专用小说4", //小说介绍
	        	"createUser" : "1",  //创建人uid
	        	"over" : "未完结",  //小说状态
	        	"time" : "2018/6/17",  //创建时间
	        	"Id" : 5, //小说id
        		"isShow" : true //是否被删除
        	}
        	 * */
        	var option1 = {
		        action:"find",
		        collections:collections,
		        selector:{},
		        fn:function(jsonData1){
		        	obj.Id = jsonData1.length-0+1;
		        	obj.isShow = true;
		        	var option2 = {
				        action:"add",
				        collections:collections,
				        selector:obj,
				        fn:function(jsonData2){
				        	if(collections == "story"){
				        		saveInfo(obj.Id,"story")
				        	}
				        	res.send({
				        		status:true,
				        		data:obj
				        	})
				        }
				    }
		        	mongod(option2)
		        }
		    }
        	mongod(option1)
        } else {
            res.send({
            	status:false,
            	msg:obj.type+"名字重复，请更换名称后重新创建"
            })
        }
    }
    mongod(option)
}
//创建小说
router.post("/newfiction", function(req, res) {
    createArticle("fiction",req,res)
});
//创建短文
router.post("/newstory", function(req, res) {
    createArticle("story",req,res)
});

//修改基本信息
router.post("/saveSimp", function(req, res) {
	var obj = req.body
	collections = obj.type;
	id = obj.Id-0;
	delete obj.Id;
	delete obj.type;
    var option = {
        action:"update",
        collections:collections,
        selector:[{ "Id": id},{$set:obj}],
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool
        	})
        }
    }
	mongod(option)
});

function getMyArticle(collections,req,res){
	var option = {
        action:"find",
        collections:collections,
        selector:{ "createUser": req.body.uid,"isShow":true},
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool,
        		article:data
        	})
        }
    }
	mongod(option)
}
//获取我的小说列表
router.post("/getmyfiction", function(req, res) {
    getMyArticle("fiction",req,res)
});
//获取我的短文列表
router.post("/getmystory", function(req, res) {
    getMyArticle("story",req,res)
});

function removeMyArticle(collections,req,res){
	var option = {
        action:"update",
        collections:collections,
        selector:[{ "Id": req.body.Id-0},{$set:{"isShow":false}}],
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool
        	})
        }
    }
	mongod(option)
}
//删除小说
router.post("/removemyfiction", function(req, res) {
    removeMyArticle("fiction",req,res)
});
//获取我的短文列表
router.post("/removemystory", function(req, res) {
    removeMyArticle("story",req,res)
});

//获取小说章节列表
router.post("/getfictionlist", function(req, res) {
    var option = {
        action:"find",
        collections:"fictionlist",
        selector:{fictionId:req.body.Id},
        sort:{sort:1},
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool,
        		data:data
        	})
        }
    }
	mongod(option)
});

//添加小说章节
router.post("/addfictionlist", function(req, res) {
	mongod({
		action:"find",
		collections:"fictionlist",
		selector:{},
		fn:function(data){
        	var obj = req.body;
        	obj.Id = data.length+1;
			/*
			 	fictionId:1	小说id
			 	sort :1// 章节排序
			 	Id 	:1// 章节id
			 	name :"名字"//章节名字
			 * */
		    var option = {
		        action:"add",
		        collections:"fictionlist",
		        selector:obj,
		        fn:function(data1){
		        	saveInfo(obj.Id,"fiction");
		        	var bool = true;
		        	if(data.err){
		        		bool = false;
		        	}
		        	res.send({
		        		status:bool,
		        		data:data1.ops[0]
		        	})
		        }
		    }
			mongod(option)
        }
	})
});

//创建内容
function saveInfo(id,type){
	var option = {
        action:"add",
        collections:"articleinfo",
        selector:{id:id,type:type,content:""},
        fn:function(data){
        	
        }
    }
	mongod(option)
}

//修改章节内容
router.post("/setInfo", function(req, res) {
    var option = {
        action:"update",
        collections:"articleinfo",
        selector:[{id:req.body.Id-0,type:req.body.type},{$set:{content:req.body.content}}],
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool
        	})
        }
    }
	mongod(option)
});

//获取内容
router.post("/getInfo", function(req, res) {
    var option = {
        action:"find",
        collections:"articleinfo",
        selector:{id:req.body.Id-0,type:req.body.type},
        fn:function(data){
        	var bool = true;
        	if(data.err){
        		bool = false;
        	}
        	res.send({
        		status:bool,
        		data:data[0]
        	})
        }
    }
	mongod(option)
});

module.exports = router