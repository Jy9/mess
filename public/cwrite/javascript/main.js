var URL = "https://ccskill.club/";
document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
//var URL = "https://localhost/";
//confirm
$.confirm = function(msg,success,error){
	$("#confirm").fadeIn(200);
	$("#confirm").css("background","rgba(255,255,255,0.3)");
	$("#confirm>div").css({"width":"4rem","opacity":"1","padding":"0.2rem 0.1rem"});
	$("#confirmMsg").html(msg);
	$("#confirmError").unbind("click").click(function(){
		hideConfirm();
		error && error();
	})
	$("#confirmSuccess").unbind("click").click(function(){
		hideConfirm();
		success && success();
	})
	function hideConfirm(){
		setTimeout(function(){
			$("#confirm").fadeOut(200);
		},200)
		$("#confirm").css("background","rgba(255,255,255,0)");
		$("#confirm>div").css({"width":"6.4rem","opacity":"0","padding":"0.4rem 0.2rem"});
	}
}

//hint
$.hint = function(type,msg){
	var dom = $("#hint").clone().attr("id","").show();
	//默认为警告 warn
	if(type == "success"){
		dom.children("img").attr("src","../icon/success.png");
	}else if(type == "error"){
		dom.children("img").attr("src","../icon/error.png");
	}
	dom.children("p").html(msg);
	setTimeout(function(){
		dom.fadeOut(400,function(){
			dom.remove()
		})
	},2000)
	$("#hints").append(dom)
}

//sessionStorage
$.session = function(key, str) {
	if(str) {
		if(typeof(str) != "string") {
			str = JSON.stringify(str);
		};
		sessionStorage.setItem(key, str);
		return true;
	} else {
		var str = sessionStorage.getItem(key);
		if(str) {
			try {
				return JSON.parse(str);
			} catch(err) {
				return str;
			}
		};
	}
};
//localStorage 
$.local = function(key, str) {
	if(str) {
		if(typeof(str) != "string") {
			str = JSON.stringify(str);
		}
		localStorage.setItem(key, str);
		return false
	} else {
		var str = localStorage.getItem(key);
		if(str) {
			try {
				return JSON.parse(str)
			} catch(err) {
				return str;
			}
		}
	}
};
//展示获取图片
$.imgshow = function(input, fn) {
	if(typeof(FileReader) === 'undefined') {
		$.hint("warn", "抱歉，你的浏览器不支持 FileReader，请更换浏览器再进行操作！");
		input.setAttribute('disabled', 'disabled');
	} else {
		input.addEventListener('change', function() {
			var data = [];
			var datalength = input.files.length;

			var reader = new FileReader();
			getData(0);

			function canvasDataURL(path, Orientation, callback) {
				var img = new Image();
				img.src = path;
				img.onload = function() {
					var that = this;
					// 默认按比例压缩
					var w = that.width,
						h = that.height,
						scale = w / h;
					w = 640;
					h = w / scale;
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					var srcOrientation = 1;
					if(Orientation) {
						srcOrientation = Orientation;
					}
					// set proper canvas dimensions before transform & export 
					if([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
						canvas.width = h;
						canvas.height = w;
					} else {
						canvas.width = w;
						canvas.height = h;
					}
					// transform context before drawing image
					switch(srcOrientation) {
						case 2:
							ctx.transform(-1, 0, 0, 1, w, 0);
							break;
						case 3:
							ctx.transform(-1, 0, 0, -1, w, h);
							break;
						case 4:
							ctx.transform(1, 0, 0, -1, 0, h);
							break;
						case 5:
							ctx.transform(0, 1, 1, 0, 0, 0);
							break;
						case 6:
							ctx.transform(0, 1, -1, 0, h, 0);
							break;
						case 7:
							ctx.transform(0, -1, -1, 0, h, w);
							break;
						case 8:
							ctx.transform(0, -1, 1, 0, 0, w);
							break;
						default:
							ctx.transform(1, 0, 0, 1, 0, 0);
					}
					ctx.drawImage(that, 0, 0, w, h);
					var base64 = canvas.toDataURL('image/jpeg');
					// 回调函数返回base64的值
					callback(base64);
				}
			}

			function photoCompress(file, num, Orientation) {
				var ready = new FileReader();
				/*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
				ready.readAsDataURL(file);
				ready.onload = function() {
					canvasDataURL(this.result, Orientation, function(urlData) {
						var arr = urlData.split(','),
							mime = arr[0].match(/:(.*?);/)[1],
							bstr = atob(arr[1]),
							n = bstr.length,
							u8arr = new Uint8Array(n);
						while(n--) {
							u8arr[n] = bstr.charCodeAt(n);
						}
						var fileBlob = new Blob([u8arr], {
							type: mime
						});
						data.push({
							file: file,
							result: urlData
						})
						ifReturn(num)
					})
				}
			}

			function getData(num) {
				reader.readAsArrayBuffer(input.files[num]);
				reader.onload = function(e) {
					var view = new DataView(this.result);
					if(view.getUint16(0, false) != 0xFFD8)
						return photoCompress(input.files[num], num, -2);
					var length = view.byteLength,
						offset = 2;
					while(offset < length) {
						var marker = view.getUint16(offset, false);
						offset += 2;
						if(marker == 0xFFE1) {
							if(view.getUint32(offset += 2, false) != 0x45786966){
								return photoCompress(input.files[num], num, -1);
							}
							var little = view.getUint16(offset += 6, false) == 0x4949;
							offset += view.getUint32(offset + 4, little);
							var tags = view.getUint16(offset, little);
							offset += 2;
							for(var i = 0; i < tags; i++){
								if(view.getUint16(offset + (i * 12), little) == 0x0112){
									return photoCompress(input.files[num], num, view.getUint16(offset + (i * 12) + 8, little));
								}
							}
						} else if((marker & 0xFF00) != 0xFF00){
							break;
						}else{
							offset += view.getUint16(offset, false);
						}
					}
					return photoCompress(input.files[num], num, -1);
				}
			}

			function ifReturn(num) {
				if(num < datalength - 1) {
					num++;
					getData(num);
				} else {
					fn(data)
				}
			}
		}, false)
	}
};

//ajax封装
$.query = Query = function(parameter) {
	if(!parameter.data) {
		parameter.data = {}
	}
	var option = {
		url: URL + parameter.url,
		type: 'POST',
		data: parameter.data,
		success: function(jsonData) {
			if(typeof(jsonData) != "object") {
				jsonData = JSON.parse(jsonData);
			}
			if(jsonData.status) {
				parameter.success(jsonData);
			} else {
				if(parameter.error) {
					parameter.error(jsonData);
				} else {
					$.hint("warn", jsonData.msg)
				}
			}
		},
		error: function(err) {
			console.log(JSON.stringify(err));
			$.hint("warn","网络连接中断 请刷新重新加载！");
		}
	};
	if(parameter.isfile) {
		option.contentType = false;
		option.processData = false;
	}
	$.ajax(option);
};