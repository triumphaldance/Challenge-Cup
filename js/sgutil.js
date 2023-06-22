
function getHeight() {
	return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
};

function getWidth() {
	return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth;
};

function getTop() {
	return window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
};

function getLeft() {
	window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft;
};

function getRight() {
	return windowPosition.left() + windowPosition.width();
};

/**
 * 获取窗体可见度高度
 * 
 * @returns
 */
function getClientHeight() {
	var clientHeight = 0;
	if (document.body.clientHeight && document.documentElement.clientHeight) {
		clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	} else {
		clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	}
	return clientHeight;
}


/**
 * 获取窗体可见度宽度
 * 
 * @returns
 */
function getClientWidth() {
	var clientWidth = 0;
	if (document.body.clientWidth && document.documentElement.clientWidth) {
		clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	} else {
		clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	}
	return clientWidth;
}

function getScrollHeight() {
	return Math.max(getClientHeight(), document.body.scrollHeight,
			document.documentElement.scrollHeight);
}

function getScrollTop() {
	var scrollTop = 0;
	if (document.documentElement && document.documentElement.scrollTop) {
		scrollTop = document.documentElement.scrollTop;
	} else if (document.body) {
		scrollTop = document.body.scrollTop;
	}
	return scrollTop;
}


/* 获取文件后缀 */
function tm_getExt(fileName) {
	if (fileName.lastIndexOf(".") == -1)
		return fileName;
	var pos = fileName.lastIndexOf(".") + 1;
	return fileName.substring(pos, fileName.length).toLowerCase();
}

/* 获取文件名称 */
function tm_getFileName(fileName) {
	var pos = fileName.lastIndexOf(".");
	if (pos == -1) {
		return fileName;
	} else {
		return fileName.substring(pos,fileName.length);
	}
}
/**
 * 判断非空
 * 
 * @param val
 * @returns {Boolean}
 */
function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}

function isNotEmpty(val) {
	return !isEmpty(val);
}



//trim() , ltrim() , rtrim()
String.prototype.trim = function(){ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
} 
String.prototype.ltrim = function(){ 
	return this.replace(/(^\s*)/g, ""); 
} 
String.prototype.rtrim = function() { 
	return this.replace(/(\s*$)/g, ""); 
}


/* 刷新当前 */
function tm_refreash() {
	window.location.href = window.location.href;
}

/** ******************json*************** */
function jsonToString(obj) {
	var THIS = this;
	switch (typeof (obj)) {
	case 'string':
		return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
	case 'array':
		return '[' + obj.map(THIS.jsonToString).join(',') + ']';
	case 'object':
		if (obj instanceof Array) {
			var strArr = [];
			var len = obj.length;
			for (var i = 0; i < len; i++) {
				strArr.push(THIS.jsonToString(obj[i]));
			}
			return '[' + strArr.join(',') + ']';
		} else if (obj == null) {
			return 'null';

		} else {
			var string = [];
			for ( var property in obj)
				string.push(THIS.jsonToString(property) + ':'
						+ THIS.jsonToString(obj[property]));
			return '{' + string.join(',') + '}';
		}
	case 'number':
		return obj;
	case false:
		return obj;
	}
}

/* loading快速加载方法 */
function tmLoading(content, timeout, overlay) {
	$.tmLoading(content, {
		timer : timeout,
		skin : "black",
		overlay : overlay
	});
};
/* 获取浏览器的版本 */
function tm_getBroswerVersion() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	if (ua) {
		window.ActiveXObject ? Sys.version = "ie_"
				+ ua.match(/msie ([\d]+)/)[1]
				: document.getBoxObjectFor ? Sys.version = "firefox_"
						+ ua.match(/firefox\/([\d.]+)/)[1]
						: window.MessageEvent && !document.getBoxObjectFor ? Sys.version = "chrome"
								: window.opera ? Sys.version = "opera_"
										+ ua.match(/opera.([\d.]+)/)[1]
										: window.openDatabase ? Sys.version = ua
												.match(/version\/([\d.]+)/)[1]
												: 0;
	}
	return Sys;
}

/* 判断一个元素释放包含在数组中。 */
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

function getTimeFormat(startTime) {
	var startTimeMills = startTime.getTime();
	var endTimeMills = new Date().getTime();
	var diff = parseInt((endTimeMills - startTimeMills) / 1000);//秒
	var day_diff = parseInt(Math.floor(diff / 86400));//天
	var buffer = Array();
	if (day_diff < 0) {
		return "[error],时间越界...";
	} else {
		if (day_diff == 0 && diff < 60) {
			if (diff <= 0)
				diff = 1;
			buffer.push(diff + "秒前");
		} else if (day_diff == 0 && diff < 120) {
			buffer.push("1 分钟前");
		} else if (day_diff == 0 && diff < 3600) {
			buffer.push(Math.round(Math.floor(diff / 60)) + "分钟前");
		} else if (day_diff == 0 && diff < 7200) {
			buffer.push("1小时前");
		} else if (day_diff == 0 && diff < 86400) {
			buffer.push(Math.round(Math.floor(diff / 3600)) + "小时前");
		} else if (day_diff == 1) {
			buffer.push("1天前");
		} else if (day_diff < 7) {
			buffer.push(day_diff + "天前");
		} else if (day_diff < 30) {
			buffer.push(Math.round(Math.floor(day_diff / 7)) + " 星期前");
		} else if (day_diff >= 30 && day_diff <= 179) {
			buffer.push(Math.round(Math.floor(day_diff / 30)) + "月前");
		} else if (day_diff >= 180 && day_diff < 365) {
			buffer.push("半年前");
		} else if (day_diff >= 365) {
			buffer.push(Math.round(Math.floor(day_diff / 30 / 12)) + "年前");
		}
	}
	return buffer.toString();
}

/**flash版本号*/
function exmayFlashVersion() {
	var f = "", n = navigator;
	if (n.plugins && n.plugins.length) {
		for ( var ii = 0; ii < n.plugins.length; ii++) {
			if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
				f = n.plugins[ii].description.split('Shockwave Flash ')[1];
				break;
			}
		}
	} else if (window.ActiveXObject) {
		for ( var ii = 10; ii >= 2; ii--) {
			try {
				var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash."
						+ ii + "');");
				if (fl) {
					f = ii + '.0';
					break;
				}
			} catch (e) {
			}
		}
	}
	return f;
};

function tp_getBrowse() {  
    var sUA=navigator.userAgent;
     //检测IE浏览器  
    if ((navigator.appName == "Microsoft Internet Explorer")) {  
        //检测模拟IE浏览的OPERA。edit at 2006-11-08(ver 0.1.2)  
        if (sUA.indexOf('Opera')!=-1) {  
            this.browseKernel='Presto';  
            if(window.opera && document.childNodes ) {  
                return 'Opera 7+';  
            } else {  
                return 'Opera 6-';  
            }  
        }  
        this.browseKernel='Trident';  
        if(sUA.indexOf('Maxthon')!=-1) {  
            return 'Maxthon';  
        }  
        if(sUA.indexOf('TencentTraveler')!=-1) { //ver 0.1.3  
            return '腾迅TT';  
        }  
        if(document.getElementById) {  
            return "IE5+";  
        } else {  
             return "IE4-";  
        }  
    }  
    //检测Gecko浏览器  
    if(sUA.indexOf('Gecko')!=-1) {
        this.browseKernel='Gecko';  
        if(navigator.vendor=="Mozilla") {return "Mozilla";}  
        if(navigator.vendor=="Firebird") {return "Firebird"; }  
        if (navigator.vendor.indexOf('Google')!=-1 || sUA.indexOf('Google')!=-1) {return 'Google';  }  
        if (sUA.indexOf('Firefox')!=-1) {return 'Firefox';  }
        return "Gecko";  
    }  
    //Netscape浏览器  
    if(sUA.indexOf('Netscape')!=-1) {  
        this.browseKernel='Gecko';  
        if(document.getElementById) {  
            return "Netscape 6+";  
        } else {  
            return 'Netscape 5-';  
        }  
    }  
    //检测Safari浏览器  
    if(sUA.indexOf('Safari') != -1) {this.browseKernel='KHTML';return 'Safari';}  
    if(sUA.indexOf('konqueror')!=-1) {this.browseKernel='KHTML';return 'Konqueror';}  
    //目前世界公认浏览网页速度最快的浏览器，但它占用的系统资源也很大。  
    if(sUA.indexOf('Opera') != -1) {  
        this.browseKernel='Presto';  
        if(window.opera && document.childNodes ) {  
            return 'Opera 7+';  
        } else {  
            return 'Opera 6-';  
        }  
        return 'Opera';  
    }  
    if((sUA.indexOf( 'hotjava' )!=-1) && typeof( navigator.accentColorName ) == 'undefined' ) {return 'HotJava';}  
    if( document.all && document.getElementById && navigator.savePreferences && (sUA.indexOf( 'netfront' ) < 0 ) && navigator.appName != 'Blazer' ) {return 'Escape 5'; }  
    //Konqueror / Safari / OmniWeb 4.5+  
    if( navigator.vendor == 'KDE' || ( document.childNodes && ( !document.all || navigator.accentColorName ) && !navigator.taintEnabled ) ) {this.browseKernel='KHTML';return 'KDE';}  
    if( navigator.__ice_version ) { return 'ICEbrowser';}  
    if( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) {  
        if( document.createElement ) {  
            return 'iCab 3+';  
        } else {  
            return 'iCab 2-';  
        }  
    }  
    if(document.layers && !document.classes ) {return 'Omniweb 4.2-';}  
    if(document.layers && !navigator.mimeTypes['*'] ) {return 'Escape 4';}  
    if(navigator.appName.indexOf( 'WebTV' ) + 1 ) {return 'WebTV';}  
    if(sUA.indexOf( 'netgem' )!=-1 ) {return 'Netgem NetBox';}  
    if(sUA.indexOf( 'opentv' )!=-1 ) {return 'OpenTV';}  
    if(sUA.indexOf( 'ipanel' )!=-1) {return 'iPanel MicroBrowser';}  
    if(document.getElementById && !document.childNodes) {return 'Clue browser';}  
    if(document.getElementById && ( (sUA.indexOf( 'netfront' ) !=-1) || navigator.appName == 'Blazer' ) ) {return 'NetFront 3+';}  
    if((sUA.indexOf( 'msie' ) + 1 ) && window.ActiveXObject ) {return 'Pocket Internet Explorer'; }  
    return "Unknown";  
}  

/*字符串转日期格式，strDate要转为日期格式的字符串*/
function getDate(strDate){
  var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, 
   function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
  return date;
}
