$(function() {
	//配置
	var config = {
		vx: 4, //小球x轴速度,正为右，负为左
		vy: 4, //小球y轴速度
		height: 2, //小球高宽，其实为正方形，所以不宜太大
		width: 2,
		count: 200, //点个数
		color: "121, 162, 185", //点颜色
		stroke: "130,255,255", //线条颜色
		dist: 6000, //点吸附距离
		e_dist: 20000, //鼠标吸附加速距离
		max_conn: 10 //点到点最大连接数
	}
	//调用
	CanvasParticle(config);

	// Create a new instance of kontext
	var k = kontext(document.querySelector('.kontext'));
	// API METHODS:
	// k.prev(); // Show prev layer
	// k.next(); // Show next layer
	// k.show( 3 ); // Show specific layer
	// k.getIndex(); // Index of current layer
	// k.getTotal(); // Total number of layers

	//one
	//检测登陆

	var user = $.session("user");
	if(user) {
		//已登陆
		writeList();
		k.next();
	}
	
	//将现有的列表写入页面
	function writeList(){
		var fictionlist = setArticleList($.session("fiction"));
		if(fictionlist == "") {
			fictionlist = "<p class='noarticle' id='noFictionWarn'>您还没有小说</p>"
		}else{
			fictionlist = "<p class='noarticle' id='noFictionWarn'>您创建的小说</p>"+fictionlist;
		}
		fictionlist += "<p id='hr' class='hr lt'></p>"
		var storylist = setArticleList($.session("story"));
		if(storylist == "") {
			storylist = "<p class='noarticle' id='noStoryWarn'>您还没有短文</p>"
		}else{
			storylist = "<p class='noarticle' id='noStoryWarn'>您创建的短文</p>"+storylist;
		}
		$("#articles").html(fictionlist + storylist);
		loginSuccess();
	}
	
	function setArticleList(article) {
		var li = "";
		for(var i in article) {
			var removetype = 'remove_fiction',
				redacttype = 'redact_fiction',
				type = "fiction";
			if(article[i].type == "短文"){
				removetype = 'remove_story';
				redacttype = 'redact_story';
				type = "story";
			}
			li += '<div class="lt articles" type="'+type+'" articleType="'+article[i].articleType+'" articleid=' + article[i].Id + ' >' +
					'<div class="img lt" style="background-image:url(' + article[i].img + ')">' +
						'<div class="'+redacttype+'">' +
							'<img src="icon/redact.png"/>' +
						'</div>' +
						'<div class="'+removetype+'">' +
							'<img src="icon/del.png"/>' +
						'</div>' +
					'</div>' +
					'<div class="lt article">' +
						'<p class="time">' + article[i].time + '</p>' +
						'<p class="name">' + article[i].name + '</p>' +
						'<div class="content">' + article[i].des + '</div>' +
						'<div class="articlefooter">' +
							'<p class="lt">' + article[i].type + '</p>' +
							'<p class="lt">（' + article[i].over + '）</p>' +
						'</div>' +
					'</div>' +
					'<img src="icon/loading.gif"/>'+
				'</div>'
		}
		return li;
	}
	
	function loginIn(){
		var name = $("#num").val();
		var pw = $("#pw").val();
		if(!name){
			$.hint("warn","请输入你的账号");
			return false;
		}
		if(!pw){
			$.hint("warn","请输入你的密码");
			return false;
		}
		$("#loginLoading").fadeIn();
		$.query({
			url: "user/login",
			data: {
				name: name,
				password: hex_md5(pw)
			},
			success: function(data) {
				$.hint("success", "登陆成功 正在获取小说/短文 列表")
				$.session("user", data.user);
				user = data.user;
				var getFictionList = false;
				var getStoryList = false;
				//登陆成功 获取小说
				$.query({
					url: "article/getmyfiction",
					data: {
						uid: data.user.uid
					},
					success: function(data) {
						$.session("fiction",data.article);
						//获取小说成功
						getFictionList = true;
					}
				})
				//登陆成功 获取短文
				$.query({
					url: "article/getmystory",
					data: {
						uid: data.user.uid
					},
					success: function(data) {
						$.session("story",data.article);
						//获取短文成功
						getStoryList = true;
					}
				})
				var t = setInterval(function() {
					if(getStoryList && getFictionList) {
						//全部获取成功
						writeList();
						clearInterval(t)
						$.hint("success", "小说/短文 列表加载成功")
						$("#loginLoading").fadeOut();
						k.next();
					}
				}, 400)
			},
			error: function(data) {
				$.hint("warn", data.msg)
				$("#loginLoading").fadeOut();
			}
		})
	}
	
	$("#login").click(function() {
		loginIn();
	})
	
	var fictionlistid = null;//要编辑的小说章节id
	var storyid = null;//要编辑的短文id
	var fictionId = null;//要编辑的小说id
	function loginSuccess(){
		
		$(".articles").css("width", $(window).width() / 3 - 20);
		$(".article").css("width", $(window).width() / 3 - 210);
		
		$(".redact_fiction").click(function() {
			redact_fiction(this);
			return false;
		})
		$(".remove_fiction").click(function() {
			remove_fiction(this);
			return false;
		})
		$(".redact_story").click(function() {
			redact_story(this)
			return false;
		})
		$(".remove_story").click(function() {
			remove_story(this);
			return false;
		})
		$(".articles").click(function(){
			setFictionList(this);
		})
		
	}
	
	//计算#articles高度
	$("#articles").height($(window).height());
	$("#articles").width($(window).width());
	
	//编辑小说详情
	function setFictionList(thisobj){
		$(thisobj).children("img").fadeIn();
		var type = $(thisobj).attr("type");
		if(type == "fiction"){
			fictionId = $(thisobj).attr("articleid");
			$.query({
				url:"article/getfictionlist",
				data:{Id:fictionId},
				success:function(data){
					var json = data.data;
					var len = json.length-1;
					var li = "";
					for(var i in json){
						if(i == len){
							fictionlistid = json[i].Id;
							li += "<li class='active' sort="+json[i].sort+" fictionlist="+json[i].Id+" >"+json[i].name+"<img src='icon/loading.gif'/></li>"
						}else{
							li += "<li sort="+json[i].sort+" fictionlist="+json[i].Id+" >"+json[i].name+"<img src='icon/loading.gif'/></li>"
						}
					}
					$("#fictionList").html(li);
					if(fictionlistid){
						$.query({
							url:"article/getInfo",
							data:{
								Id:fictionlistid,
								type:"fiction"
							},
							success:function(data){
								$("#text1").val(data.data.content);
								$(thisobj).children("img").fadeOut();
								k.show(2);
							}
						})
					}else{
						$(thisobj).children("img").fadeOut();
						k.show(2);
					}
				}
			})
		}else if(type == "story"){
			storyid = $(thisobj).attr("articleid");
			$.query({
				url:"article/getInfo",
				data:{
					Id:storyid,
					type:"story"
				},
				success:function(data){
					$("#text2").html(data.data.content);
					$(thisobj).children("img").fadeOut();
					k.show(3);
				}
			})
		}
	}
	//编辑小说基本信息
	function redact_fiction(thisobj){
		saveSimp(thisobj,"fiction")
	}
	//删除小说
	function remove_fiction(thisobj){
		$.confirm("是否确定删除这本小说",function(){
			var obj = $(thisobj).parent("div").parent("div");
			var img = $(thisobj).children("img");
			img.attr("src", "icon/loading.gif");
			$.query({
				url:"article/removemyfiction",
				data:{
					Id:obj.attr("articleid")
				},
				success:function(data){
					img.attr("src", "icon/del.png");
					$.hint("success", "删除成功");
					$.session('articlelist', $("#articles").html())
					obj.fadeOut(400,function(){
						obj.remove();
					})
				}
			});
		},function(){
			$.hint("error", "删除失败");
		})
	}
	//编辑短文基本信息
	function redact_story(thisobj){
		saveSimp(thisobj,"story",)
	}
	//删除故事
	function remove_story(thisobj){
		$.confirm("是否确定删除这篇短文",function(){
			var obj = $(thisobj).parent("div").parent("div");
			var img = $(thisobj).children("img");
			img.attr("src", "icon/loading.gif")
			$.query({
				url:"article/removemystory",
				data:{
					Id:obj.attr("articleid")
				},
				success:function(data){
					img.attr("src", "icon/del.png");
					$.hint("success", "删除成功");
					$.session('articlelist', $("#articles").html())
					obj.fadeOut(400,function(){
						obj.remove();
					})
				}
			});
		},function(){
			$.hint("error", "删除失败");
		})
	}

	var createObj = {};
	createObj.img = "image/DSCN0614_small.jpg";
	//新建小说
	$("#createfiction").click(function() {
		createObj.type = "小说";
		createObj.articleType = fictionType[0];
		var li = "";
		for(var i in fictionType) {
			if(i == 0) {
				li += '<li class="active">' + fictionType[i] + '<img src="icon/success.png"/></li>';
			} else {
				li += '<li>' + fictionType[i] + '<img src="icon/success.png"/></li>';
			}
		}
		$("#createType").html(li);
		$("#create").fadeIn(200);
	})
	//新建故事
	$("#createstory").click(function() {
		createObj.type = "短文";
		createObj.articleType = storyType[0];
		var li = "";
		for(var i in storyType) {
			if(i == 0) {
				li += '<li class="active">' + storyType[i] + '<img src="icon/success.png"/></li>';
			} else {
				li += '<li>' + storyType[i] + '<img src="icon/success.png"/></li>';
			}
		}
		$("#createType").html(li);
		$("#create").fadeIn(200);
	})
	
	//编辑基本信息
	var saveSimpId = null;
	var saveSimpType = null;
	var saveSimpPosition = null;
	function saveSimp(thisobj,type){
		saveSimpType = type
		var thisparent = $(thisobj).parent("div").parent("div");
		saveSimpId = thisparent.attr("articleid");
		
		var data = $.session(type);
		//设置封面名字 介绍
		for(var l in data){
			if(data[l].Id == saveSimpId){
				saveSimpPosition = l;
				$("#createName").val(data[l].name);
				$("#createText").val(data[l].des);
				$("#createImg").css("background-image",data[l].img)
				articleType = data[l].articleType
				break;
			}
		}
		
		var articletype = fictionType;
		if(type == "story"){
			articletype = storyType;
		}
		var li = "";
		for(var i in articletype) {
			if(articletype[i] == articleType) {
				li += '<li class="active">' + articletype[i] + '<img src="icon/success.png"/></li>';
			} else {
				li += '<li>' + articletype[i] + '<img src="icon/success.png"/></li>';
			}
		}
		$("#createType").html(li);
		$("#create").fadeIn(200);
		ifRevamp = true;
		
	}
	
	//选择类型
	$("#createType").click(function(e) {
		var target = e.target;
		if($(target)[0].tagName == "LI") {
			$("#createType>li").removeClass("active");
			$(target).addClass("active");
			createObj.articleType = $(target)[0].textContent;
		}
	})
	//确认创建
	var fictionType = ["武侠小说", "修真小说", "玄幻小说", "历史小说", "都市小说", "网游小说", "科幻小说", "恐怖小说", "穿越小说", "言情小说", "校园小说"];
	var storyType = ["校园", "生活家", "故事", "社会热点", "城市专题", "手绘", "电影", "读书", "摄影", "程序员", "IT互联网"]
	var closeCreate = function(msg) {
		$("#createArticleLoading").fadeOut();
		$("#create").fadeOut();
		$("#createName,#createText").val("");
		createObj.img = "image/DSCN0614_small.jpg"
		$("#createImg").css("background-image", "url(image/DSCN0614_small.jpg)")
		$.hint("success", msg)
	}
	
	var ifRevamp = false;
	$("#createOk").click(function() {
		$("#createArticleLoading").fadeIn();
		createObj.name = $("#createName").val();
		createObj.des = $("#createText").val();
		createObj.createUser = user.uid;
		createObj.over = "未完结";
		if(!createObj.name || !createObj.des) {
			$.hint("warn", "请补全书籍信息");
			$("#createArticleLoading").fadeOut();
			return false;
		}
		
		//如果是修改信息
		if(ifRevamp){
			var obj = {
				name:createObj.name,
				des:createObj.des,
				articleType:createObj.articleType
			};
			if(typeof(createObj.img) != "string"){
				var fdata = new FormData();
				fdata.append("image", createObj.img);
				$.query({
					url: "upload/image",
					data: fdata,
					isfile: true,
					success: function(data) {
						obj.img = data.url;
						submitSimp(obj);
					}
				})
			}else{
				submitSimp();
			}
			function submitSimp(){
				obj.Id = saveSimpId;
				obj.type = saveSimpType;
				$.query({
					url:"article/saveSimp",
					data:obj,
					success:function(data){
						var type = obj.type;
						delete obj.Id;
						delete obj.type;
						var article = $.session(type);
						for(var l in obj){
							article[saveSimpPosition][l] = obj[l];
						}
						$.session(type,article);
						writeList()
						closeCreate("修改成功");
						
					},
					error:function(){
						closeCreate("修改失败");
					}
				})
			}
		}else{
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			var d = date.getDate();
			createObj.time = y + "/" + m + "/" + d;
	
			function submit() {
				if(createObj.type == "小说") {
					$.query({
						url: "article/newfiction",
						data: createObj,
						success: function(data) {
							$("#hr").before(setArticleList([data.data]));
							var fiction = $.session("fiction").push(data.data)
							$.session('fiction',fiction);
							closeCreate("小说添加成功");
							$("#noFictionWarn").html("您创建的小说");
							$(".redact_fiction").unbind("click").click(function() {
								redact_fiction(this);
							})
							$(".remove_fiction").unbind("click").click(function() {
								remove_fiction(this);
							})
							$(".articles").unbind("click").click(function(){
								setFictionList(this);
							})
						},
						error: function(data) {
							$("#createArticleLoading").fadeOut();
							$.hint("wran", data.msg)
						}
					})
				} else {
					$.query({
						url: "article/newstory",
						data: createObj,
						success: function(data) {
							$("#articles").append(setArticleList([data.data]));
							var story = $.session("story").push(data.data)
							$.session('story',story);
							closeCreate("短文添加成功");
							$("#noStoryWarn").html("您创建的短文");
							$(".redact_story").unbind("click").click(function() {
								redact_story(this)
							})
							$(".remove_story").unbind("click").click(function() {
								remove_story(this);
							})
							$(".articles").unbind("click").click(function(){
								setFictionList(this);
							})
						},
						error: function(data) {
							$("#createArticleLoading").fadeOut();
							$.hint("wran", data.msg)
						}
					})
				}
			}
			if(typeof(createObj.img) == "string") {
				submit();
			} else {
				var fdata = new FormData();
				fdata.append("image", createObj.img);
				$.query({
					url: "upload/image",
					data: fdata,
					isfile: true,
					success: function(data) {
						createObj.img = data.url;
						submit();
					}
				})
			}
		}
	})
	//选择封面
	$.imgshow($("#createImgs")[0], function(data) {
		$("#createImg").css("background-image", "url(" + data[0].result + ")")
		createObj.img = data[0].file;
	})
	//取消创建
	$("#createNo").click(function() {
		closeCreate("取消创建")
	})
	//点击退出登陆
	$("#loginOut").click(function() {
		$.confirm("是否确认退出登陆", function() {
			$.session("user", "null");
			$.hint("success", "退出登陆成功")
			k.prev();
		})
	})

	//three
	//设置text宽度
	$("#text1").width($("body").width() - 320);

	//点击新建章节
	$("#createChapter").click(function() {
		$("#chapterNameNo").fadeIn();
		$("#chapterNameNo>div>input").focus();
	})

	//处理新建章节
	$("#chapterNameNo").click(function() {
		$.hint("error", "取消新建章节");
		$(this).fadeOut();
	})
	$("#chapterNameNo>div").click(function(){
		return false;
	})
	$("#chapterNameOk").click(function() {
		cerateFictionList();
	})
	
	var isCreaateFictionList = false;
	function cerateFictionList(){
		if(isCreaateFictionList){
			return false;
		}
		isCreaateFictionList = true;
		$("#chapterNameOk").attr("src", "icon/loading.gif");
		var sort = $("#fictionList>li:last-child").attr("sort")-0+1;
		var name = $("#chapterNameNo>div>input").val();
		sort || (sort=1);
		$.query({
			url:"article/addfictionlist",
			data:{
				name:name,
				fictionId:fictionId,
		 		sort :sort
			},
			success:function(data){
				$("#chapterNameOk").attr("src", "icon/right.png");
				$.hint("success", "新建章节成功");
				$("#chapterNameNo>div>input").val("");
				$("#chapterNameNo").fadeOut();
				$("#text1").val("");
				$("#fictionList>li").removeClass("active");
				fictionlistid = data.data.Id;
				isCreaateFictionList = false;
				$("#fictionList").append("<li class='active' sort="+sort+" fictionlist="+data.data.Id+" >"+name+"</li>")
			}
		})
		return false;
	}
	
	//点击保存
	$("#save1").click(function(){
		saveFiction();
	});
	
	//点击选择章节
	$("#fictionList").click(function(e){
		var target = e.target;
		$(target).children("img").fadeIn();
		fictionlistid = $(target).attr("fictionlist");
		$.query({
			url:"article/getInfo",
			data:{
				Id:fictionlistid,
				type:"fiction"
			},
			success:function(data){
				$("#fictionList>li").removeClass("active");
				$(target).addClass("active");
				$(target).children("img").fadeOut();
				$("#text1").val(data.data.content);
			}
		})
	})

	//four

	//添加图片
	$.imgshow($("#addImg")[0], function(data) {
		//添加图片
		var i = 0;
		var len = data.length;
		function queryimg(){
			var fdata = new FormData();
			fdata.append("image", data[i].file);
			$.query({
				url: "upload/image",
				data: fdata,
				isfile: true,
				success: function(data) {
					document.execCommand('insertImage', true, data.url);
				}
			})
			i++;
			if(i<len-1){
				queryimg()
			}
		}
		queryimg();
		$("#text2").focus()
	})
	
	//保存短文
	$("#save2").click(function(){
		saveStory();
	})
	//点击返回
	$(".back").click(function() {
		k.show(1);
	})
	function saveStory(){
		$("#save2>img").attr("src","icon/loading.gif");
		saveContent({
			Id:storyid,
			type:"story",
			content:$("#text2").html()
		})
	}
	function saveFiction(){
		$("#save1>img").attr("src","icon/loading.gif");
		saveContent({
			Id:fictionlistid,
			type:"fiction",
			content:$("#text1").val()
		});
	}
	var isSvaeContent = false;
	function saveContent(data){
		/*{
			Id:0,
			type:"",
			content:""
		}*/
		if(!data.Id){
			$.hint("warn","您没有章节需要保存");
			return false;
		}
		if(isSvaeContent){
			$.hint("warn","正在保存 请稍后");
			return false;
		}
		isSvaeContent = true;
		$.query({
			url:"article/setInfo",
			data:data,
			success:function(){
				isSvaeContent = false;
				$("#save1>img,#save2>img").attr("src","icon/save.png");
				$.hint("success","保存成功")
			}
		})
	}
	//监听按键
	$(window).keydown(function(e){
		if(e.keyCode == "13"){
			if(k.getIndex() == 0){
				loginIn();
			}else if(k.getIndex() == 2 && $("#chapterNameNo").css("display") == "block"){
				cerateFictionList();
			}
		}else if(e.ctrlKey && e.keyCode == 83) {
            //保存内容
            if(k.getIndex() == 2){
            	saveFiction()
            }else if(k.getIndex() == 3){
            	saveStory()
            }
            return false;
        }else if(e.keyCode == "27" && k.getIndex() == 2 && $("#chapterNameNo").css("display") == "block"){
        	$.hint("error", "取消新建章节");
        	$("#chapterNameNo").fadeOut();
        }
	})
})