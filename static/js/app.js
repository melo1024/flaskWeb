//参数配置
var config = {
	"apiDomain": 'http://api.wantuole.com/api/'
}

$(function() {
	var source = getQueryString('source');
	if(source == 'wx') {
		$('.page-header').hide();
		var links = $('a');
		for(var i = 0; i < links.length; i++) {
			if($(links[i]).attr('href')) {
				if($(links[i]).attr('href').indexOf('?') >= 0) {
					$(links[i]).attr('href', $(links[i]).attr('href') + '&source=wx');
				} else {
					$(links[i]).attr('href', $(links[i]).attr('href') + '?source=wx');
				}
			}
		}
	}
})

$(function() {
	$("#head").load("../../parts/head.html");
	$("#top-ad").load("../../parts/top-ad.html");
})

function urlPara() {
	var source = getQueryString('source');
	if(source == 'wx') {
		return "source=wx";
	} else {
		return "";
	}
}

function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for(var v = 0; v < Agents.length; v++) {
		if(userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return r[2];
	return '';
}

//异步请求
var ajax = {
	get: function(url, callback) {
		$.ajax({
			type: 'get',
			url: config.apiDomain + url,
			data: {},
			cache: false,
			dataType: 'json',
			success: callback
		});
	},
	post: function(url, data, callback) {
		$.ajax({
			type: 'post',
			url: config.apiDomain + url,
			data: data,
			cache: false,
			dataType: 'json',
			success: callback
		});
	}
}

function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

$.fn.serializeObject = function() {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	return this.serializeArray().reduce(function(data, pair) {
		if(!hasOwnProperty.call(data, pair.name)) {
			data[pair.name] = pair.value;
		}
		return data;
	}, {});
};

function GetUrlParms() {
	var args = new Object();
	var query = location.search.substring(1); //获取查询串   
	var pairs = query.split("&"); //在逗号处断开   
	for(var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('='); //查找name=value   
		if(pos == -1) continue; //如果没有找到就跳过   
		var argname = pairs[i].substring(0, pos); //提取name   
		var value = pairs[i].substring(pos + 1); //提取value   
		args[argname] = unescape(value); //存为属性   
	}
	return args;
}

function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for(var v = 0; v < Agents.length; v++) {
		if(userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}