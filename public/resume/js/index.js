$(function(){
	var app = new Vue({
	    el: '#app',
	    data: {
	    	infos:[
	    		"姓名：贾越",
	    		"职位：前端工程师",
	    		"住址：朝阳区",
	    		"邮箱：15601215226@163.com",
	    		"手机：15601215226",
	    		"简介：学历是大专学历 因为喜欢编程 离校后继续到北京学习 正在考自考项目管理本科  除去公司项目 其他app都是下班后写的 下班后喜欢窝在家里写代码 学一些新的技术"
	    	],
	    	skills:[
	    		"ps 设计图测量 切图等 经常使用",
	    		"HTML5+CSS3 按照设计图绘制页面 及编写部分动画效果 经常使用",
	    		"js,jquery,vue 实现动态页面 局部刷新  部分动画等 经常使用",
	    		"bootstrap 设计响应式页面",
	    		"node.js 有几个个人的完整后端项目",
	    		"微信小程序 有完整个人项目",
	    		"git 经常使用 自己服务器有部署自己的git服务",
	    		"npm 包管理器 有已上线的包 npm install -g yue-cli",
	    		"easyui 上家公司使用",
	    		"echarts 上家公司使用",
	    		"svn 上家公司使用",
	    		"基于websocket node jq 实现联网对战的斗兽棋游戏"
	    	],
	    	educations:[
	    		{msg:"学历",type:"title"},
	    		{msg:"2017 年 7 月  榆林职业技术学院",type:"info"},
	    		{msg:"2016 年 10 月 北京百知教育科技 参加培训",type:"info"},
	    		{msg:"工作",type:"title"},
	    		{msg:"2017 年 4 月  北京中骏博研科技有限公司",type:"info"},
	    		{msg:"2017 年 8 月  杭州村游网络有限公司",type:"info"}
	    	],
	    	applist:[
	    		{
	    			img:"img/cc.jpg",
	    			name:"CC写书",
	    			msg:"提供免费免费的创作、阅读的微信小程序 因为腾讯不让发布这类小程序 所以没有正式上线",
	    			git:"https://github.com/Jy9/CC",
	    			gourl:"javascript:alert('腾讯审核不给通过 原因是此类小程序不让发布')"
	    		},
	    		{
	    			img:"img/cc.jpg",
	    			name:"CC写书 node后端代码",
	    			msg:"node+mongodb实现登陆注册 发表文章读取文章，文章审核等一系列接口实现",
	    			git:"https://github.com/Jy9/serverCC",
	    			gourl:"javascript:alert('腾讯审核不给通过 原因是此类小程序不让发布')"
	    		},
	    		{
	    			img:"img/beas.png",
	    			name:"斗兽棋",
	    			msg:"基于websocket 联网对战版斗兽棋",
	    			git:"https://github.com/Jy9/beastflag.git",
	    			gourl:"https://ccskill.club:3000"
	    		},
	    		{
	    			img:"img/cwritePC.jpg",
	    			name:"小说发布站点",
	    			msg:"node+mongodb实完成后台接口的实现和数据库的增删改查",
	    			git:"javascript:alert('地址为私有仓库')",
	    			gourl:"https://ccskill.club/cwritePC/"
	    		},
	    		{
	    			img:"img/cwrite.jpg",
	    			name:"小说站点",
	    			msg:"swiper+jq实现页面 未完成",
	    			git:"javascript:alert('地址为私有仓库')",
	    			gourl:"https://ccskill.club/cwrite/"
	    		},
	    		{
	    			img:"img/index.jpg",
	    			name:"主页站点",
	    			msg:"swiper+jq+vue实现页面 实现界面滚动位置实时记录页面左右滑动及滑动嵌套 未完成",
	    			git:"javascript:alert('地址为私有仓库')",
	    			gourl:"https://ccskill.club/index/"
	    		},
	    		{
	    			img:"img/cyq.jpg",
	    			name:"趣村游",
	    			msg:"公司项目 前端是我一个人开发的 app也是我做的",
	    			git:"javascript:alert('代码不能公开')",
	    			gourl:"https://m.cunyougo.com"
	    		},
	    		{
	    			img:"img/resume.jpg",
	    			name:"简历站点",
	    			msg:"利用jq+vue+bootstrap开发的响应式页面",
	    			git:"javascript:alert('地址为私有仓库')",
	    			gourl:"https://ccskill.club/resume/"
	    		}
	    	]
	    }
	})
})
