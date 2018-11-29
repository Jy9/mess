document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';
$(function() {
	
})

//confirm
$.confirm = function(msg,success,error){
	$("#confirm").fadeIn(200);
	$("#confirm").addClass("active");
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
		$("#confirm").removeClass("active");
	}
}

$.setFullscreen = function (element) {
    var el = document.documentElement;
    var rfs = el.requestFullscreen       || 
              el.webkitRequestFullscreen || 
              el.mozRequestFullScreen    || 
              el.msRequestFullscreen;
    if (rfs) {
        rfs.call(el);
    } else if (window.ActiveXObject) {
        var ws = new ActiveXObject("WScript.Shell");
        ws && ws.SendKeys("{F11}");
    }
}
$.exitFullscreen = function exitFullscreen(){
    var efs = document.exitFullscreen       || 
              document.webkitExitFullscreen || 
              document.mozCancelFullScreen  || 
              document.msExitFullscreen;
    if (efs) {
        efs.call(document);
    } else if (window.ActiveXObject) {
        var ws = new ActiveXObject("WScript.Shell");
        ws && ws.SendKeys("{F11}");
    }
}