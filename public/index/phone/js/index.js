$(function(){
	/*$.confirm("是否启用全屏浏览",function(){
		$.setFullscreen();
	})*/
	
	var bodyScrollTop = {
			scroll1 : 0,
			scroll2 : 0,
			scroll3 : 0,
			scroll4 : 0,
			scroll5 : 0
	}
	var bodyScrollTopName = ["scroll1","scroll2","scroll3","scroll4","scroll5"]
	
	$("footer p[tabindex]").click(function(){
		var index = $(this).attr("tabindex");
		setIndex(index);
		mySwiper.slideTo(index);
	})
	
	var tabindex = 1;
	function setIndex(index){
		if(tabindex == index){
			return false;
		}
		var oDiv = $("footer>div");
		
		if(tabindex > index){
			oDiv.width(((tabindex-index)*1.35)+"rem");
			setTimeout(function(){
				if(index == 0){
					oDiv.width(0);
				}else{
					oDiv.width("0.5rem");
				}
			},300)
		}else{
			oDiv.width("0.5rem");
		}
		oDiv.css("left",(index*1.35)+0.25+"rem");
		
		//如果是好友页
		if(messageSwiper && index == 3){
			messageSwiper.slideTo(0);
		}
		
		//记录上一页的scroll值 并设置当前页的scroll
		bodyScrollTop[bodyScrollTopName[tabindex]] = $("#indexView").scrollTop();
		setTimeout(function(){
			$("#indexView").animate({scrollTop: bodyScrollTop[bodyScrollTopName[index]]}, 400);
		},200)
		tabindex = index;
	}
	//首页模块
	var mySwiper = new Swiper('.content', {
		on: {
		    slideChange: function(e){
		    	if(mySwiper){
		      		setIndex(mySwiper.activeIndex)
		      	}
		    },
		},
		initialSlide :1,
		autoHeight: true,
		noSwiping : true
	});
	
	//确保整页任意位置都可以滑动
	$("#index>div>.swiper-slide").css("min-height",$(window).height())
	
	//空间页 搜索框
	$("#indexSeachInput").focus(function(){
		$("#indexSeach").addClass("active");
		$("#index .swiper-slide").addClass("swiper-no-swiping");
		$("footer").hide();
	})
	$("#indexSeachInput").blur(function(){
		$("#indexSeach").removeClass("active");
		$("#index .swiper-slide").removeClass("swiper-no-swiping");
		$("footer").show();
	});
	
	
	//message
	//messageswiper
	$("#messageTitle>li").click(function(){
		var index = $(this).attr("tabindex");
		messageSwiper.slideTo(index);
		messageSwiperFn(index)
	})
	var msgtabindex = 0;
	var messageSwiperFn = function(index){
		if(msgtabindex == index){
			return false;
		}
		$("#messageTitle>li").removeClass("active");
		$("#messageTitle>li[tabindex="+index+"]").addClass("active");
		msgtabindex = index;
	}
	var messageSwiper = new Swiper('#messageSwiper', {
		on: {
		    slideChange: function(e){
		      	messageSwiperFn(messageSwiper.activeIndex)
		    },
		},
		autoHeight: true,
		nested:true
	});
	//确保整页任意位置都可以滑动
	$("#messageSwiper .swiper-slide>").css("min-height",$(window).height()-(( document.documentElement.clientWidth / 6.4 ) * 1.3))
	//搜索用户名称 先在好友列表和群列表搜索 如果搜索到了则跳转到相应的swiper 如果没有 则请求接口查找用户
	
	
	//弹出页 弹出和关闭
	$(".ss").click(function(){
		$("#alertView").fadeIn().css("animation", "alertViewShow 0.4s");
		//$("#viewContent").load("src/message.html")
	})
	$("#alertViewClose").click(function(){
		$("#alertView").css("animation", "alertViewHide 0.8s");
		setTimeout(function(){
			$("#alertView").hide();
		},800)
	})
	
	//打开新页面和关闭新页面
	$(".dd").click(function(){
		$("#newView").css("left", "0px");
	});
	$("#newView").click(function(){
		$("#newView").css("left", "6.4rem");
	})
	
	console.log(pinyinUtil.getFirstLetter('小茗同学')); // 输出 XMTX
})
