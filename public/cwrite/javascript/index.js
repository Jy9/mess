$(function(){
	$("footer li[index]").click(function(){
		setIndex($(this).attr("index"))
	})
	function setIndex(index){
		mySwiper.slideTo(index-1)
		$("footer>div>div").attr("index",index);
	}
	
	//首页模块
	var mySwiper = new Swiper('.content', {
		on: {
		    slideChange: function(e){
		      	setIndex(mySwiper.activeIndex+1)
		    },
		},
		noSwiping : true
	});
	var contentSwiper = new Swiper('#storyType', {
		pagination: {
		    el: '.swiper-pagination-storytype',
		},
		uniqueNavElements: false
	});
	
	//推荐轮播
	var contentSwiper = new Swiper('#recommend', {
		pagination: {
		    el: '.swiper-pagination-recommend',
		},
		uniqueNavElements: false,
		loop:true
	});
	
	//推荐作者
	var contentSwiper = new Swiper('#pennerwriterpenman', {
		slidesPerView : 1.2,
		spaceBetween : "3%",
	});
    
	
	//点击菜单
	$("#select").click(function(){
		$("#selectContent").fadeIn();
		$("#selectContent>div").css("left","0rem");
	})
	//点击退出
	$("#selectContent").click(function(){
		$("#selectContent").fadeOut();
		$("#selectContent>div").css("left","-5rem");
	})
	
//短文
	//搜索
	$("#storySeach").focus(function(){
		$(".seach").height($(window).height());
		$("footer").fadeOut();
		$(".content>.swiper-wrapper>.swiper-slide").addClass("swiper-no-swiping");
	})
	$("#storySeach").blur(function(){
		$(".seach").height("0.8rem");
		$("footer").fadeIn();
		$(".content>.swiper-wrapper>.swiper-slide").removeClass("swiper-no-swiping");
	})
})
