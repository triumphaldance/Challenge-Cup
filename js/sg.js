
var zindex = 100;
var timerInterval = null;
var isMouseDownDoing = false;
var ajaxTimeout = null;
(function($){
	$.tmUtil = {
		dialogHtml : function(opts){
			if(opts.single){
				$(".tmui-modal").remove();
				$(".tmui-overlay").remove();
			};
			var dialogHtml = "<div class='b_l w460'><div class='bcom_ti'>"+
			                 "<a href='javascript:void(0)' class='bide layer_icon fr tmui-modal-close'></a>"+
			                 "<span>"+opts.title+"</span></div>"+
			                 "<div class='bcom_cent'>"+
	                 	     "<p class='bcomti'>"+opts.content+"</p>"+
	                 	     "<p class='bcoma'><a href='javascript:void(0)' class='bc_abut1 tmui-modal-sure'>"+opts.sureText+"</a>"+
	                 	     "<a href='javascript:void(0)' class='bc_abut2 tmui-modal-cancle'>"+opts.cancleText+"</a></p>"+
	                 	     "</div>";
			return $(dialogHtml);
		},
		_position : function($obj,opts){
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var left =opts.left || (windowWidth - $obj.width())/2;
			var top = opts.top || (windowHeight - $obj.height())/2;
			if(opts.open=="top"){
				$obj.css("left",left).stop().animate({top:top});
			}else if(opts.open=="left"){
				$obj.css("top",top).stop().animate({left:left});
			}else if(opts.open=="fade"){
				$obj.hide().css({left:left,top:top}).stop().fadeIn("slow");
			}else if(opts.open=="slide"){
				$obj.hide().css({left:left,top:top}).stop().slideDown("slow");
			}else if(opts.open=="message"){
				var left = $.tmUtil._getClientWidth()-opts.width-3;
				var top = $.tmUtil._getClientHeight()-opts.height-3;
				$obj.css({left:left,top:$.tmUtil._getClientHeight()}).stop().animate({top:"+"+top+"px"});
			}else{
				$obj.css({"left":left,"top":top});
			}
		},
		_resize : function($obj,opts){
			$(window).on("resize",function(){
				$.tmUtil._position($obj,opts);
				$obj.next(".tmui-overlay").height($.tmUtil._getScrollHeight());
			});
		},
		_overlay:function($dialog){
	    	var height = this._getScrollHeight();
	    	var zindexc = $dialog.css("z-index");
	    	zindexc--;
    		var $overLayObj = $('<div class="tmui-overlay" style="height:'+height+'px;z-index:'+zindexc+'"></div>');
    		$dialog.after($overLayObj);
	    },
		_getClientHeight : function() {
		    var clientHeight = 0;
		    if (document.body.clientHeight && document.documentElement.clientHeight) {
		        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
		    } else {
		        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
		    }
		    return clientHeight;
		},
		_getClientWidth : function() {
		    var clientWidth = 0;
		    if (document.body.clientWidth && document.documentElement.clientWidth) {
		        clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
		    } else {
		        clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
		    }
		    return clientWidth;
		},
		_getScrollHeight : function (){
			return  Math.max(this._getClientHeight(),document.body.scrollHeight,document.documentElement.scrollHeight);
		},
		_getHeight: function() {
	        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
	    },
	    _getWidth: function() {
	        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth;
	    },
		_showOpen : function($dialog,opts){
			zindex++;
			$dialog.css("zIndex",zindex);
			if(opts.open !="other"){
				$dialog.show().css({width:opts.width,height:opts.height,"margin":"none"});
				$("body").append($dialog);
				$.tmUtil._position($dialog,opts);
				$.tmUtil._resize($dialog,opts);
			}
			if(opts.open=="other"){
				if(opts.animateBefore=="before"){
					$dialog.css("margin","auto").show().stop().animate({width:opts.width,height:opts.height});
					$("body").append($dialog);
				}
				if(opts.animateBefore=="after"){
					$("body").append($dialog);
					$dialog.css("margin","auto").show().stop().animate({width:opts.width,height:opts.height});
				}
			}
		},
		_animateClose : function($obj,opts){
			var height = $obj.offset().top+$obj.height()*2;
			var width = $obj.offset().left+$obj.width()*2;
			if(opts.open=="top"){
				$obj.stop().animate({top:"-"+height+"px"},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="left"){
				$obj.stop().animate({left:"-"+width+"px"},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open =="fade"){
				$obj.stop().fadeOut("slow",function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="slide"){
				$obj.stop().slideUp("slow",function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="other"){
				$obj.stop().animate({width:0,height:0},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="message"){
				$obj.stop().animate({top:$.tmUtil._getClientHeight()},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else{
				if(opts.showOverlay)$obj.next().remove();
				$obj.remove();
			}
		},
		_shake : function (obj){
		    var style = obj.style,
		        p = [14, 18, 14, 10, -14, -18, -14, 10,12,0,-12,11],
		        fx = function () {
		            style.marginLeft = p.shift() + 'px';
		            if (p.length <= 0) {
		                style.marginLeft = 0;
		                clearInterval(timerId);
		            };
		        };
		    p = p.concat(p.concat(p));
		    timerId = setInterval(fx, 13);
		},
		_overlayClick:function($dialog,opts){
			$dialog.next().click(function(e){
				$.tmUtil._animateClose($dialog,opts);
				stopBubble(e);
			});
		}
	};
	
	$.tmDialog = {
		confirm :function(options){
			if(isEmpty(options.icon))options.icon = "warn";
			this._init(options);
		},
		_init:function(options){
			var opts = $.extend({},$.tmDialog,$.tmDialog.defaults,options);
			var $dialog = $.tmUtil.dialogHtml(opts);
			if(isNotEmpty(opts.id))$dialog.attr("id",opts.id);
			$dialog.data("options",opts);
			$.tmUtil._showOpen($dialog,opts);//打开特效
			this._bindEvent($dialog,opts);//绑定事件
			if(!eval(opts.showIcon))$dialog.find(".tmui-modal-icon").remove();
			if(opts.drag)$dialog.tmDrag({handle:$dialog.find(".tmui-modal-header")});//是否允许拖动
			if(opts.width<=360)opts.width = 360;
			if(opts.height<=200)opts.height = 260;
			if(opts.showOverlay)$.tmUtil._overlay($dialog);//是否有阴影层
			if(opts.showHeader){$dialog.find(".tmui-modal-header").hide();}
			
			if(eval(opts.showIcon)){
				$dialog.find(".tmui-modal-content").width(opts.width-148);
			}else{
				$dialog.find(".tmui-modal-content").css({"width":(opts.width-100),"textAlign":opts.arrow||"center","padding":0,"padding":50});
			}
			
			if(!eval(opts.showBottom)){
				$dialog.find(".tmui-modal-bottom").remove();
				var h = opts.height-55;
				$dialog.height(h).find(".tmui-modal-body").height(h);
			}else{
				$dialog.find(".tmui-modal-body").height(opts.height-125);
			}
			if(!eval(opts.showClose)){
				$dialog.find(".tmui-modal-close").remove();
				$dialog.find(".tmui-modal-cancle").remove();
			}
			
			if(eval(opts.overlayHide))$.tmUtil._overlayClick($dialog,opts);
			if(eval(opts.colors).length>0){
				var colorx = eval(opts.colors);
				$dialog.find(".tmui-modal-header").css({"background":colorx[0]});
				$dialog.find(".tmui-modal-sure").css({"background":colorx[1]||colorx[0]});
				$dialog.find(".tmui-modal-cancle").css({"background":colorx[2]||colorx[0]});
			}
			if(isNotEmpty(opts.timer))this._timer($dialog,opts);
			if(eval(opts.shake))$.tmUtil._shake($dialog.get(0));
			if(isNotEmpty(opts.left))$dialog.css("left",opts.left);
			if(isNotEmpty(opts.top)){$dialog.css("top",opts.top);}
			if(isNotEmpty(opts.zindex)){
				$dialog.css("zIndex",opts.zindex).next().css("zIndex",opts.zindex-1);
			}
			return $dialog;
		},
		
		_limitRandom : function (begin,end){
			 return Math.floor(Math.random()*(end-begin))+begin;
		},
		_bindEvent :function($dialog,opts){
			$dialog.find(".tmui-modal-cancle,.tmui-modal-close").off().on("click",function(e){
				if(opts.callback)opts.callback(false);
				$.tmDialog._remove($dialog,opts);
				if(opts.content instanceof jQuery){
					$("body").append(opts.content.hide());
				}
			});
			
			$dialog.find(".tmui-modal-sure").off().on("click",function(){
				if(opts.callback)opts.callback(true);
				$.tmDialog._remove($dialog,opts);
			});
		},
		_timer : function($dialog,opts){
			var timecount = opts.timer*1000 / 1000;
			clearInterval(timerInterval);
			timerInterval = setInterval(function(){
				$dialog.find(".tmui-modal-timer").html("("+timecount+")");
				if(timecount<=1){
					$.tmUtil._animateClose($dialog,opts);
					clearInterval(timerInterval);
				}
				timecount--;
			},1000);
		},
		_remove : function($dialog,opts){
			if(timerInterval)clearInterval(timerInterval);
			$.tmUtil._animateClose($dialog,opts);
		},
		_zindex:function(){
			var arr = [];
			$(".tmui-modal").each(function(){
				arr.push($(this).css("z-index"));
			});
			var max = Math.max.apply({},arr)*1 || 100;
			max++;
			return max;
		},
		window : function(options){
			options = $.extend({},$.tmDialog.defaults,options);
			var $wp = $("#tm_window_"+options.id);
			if(isNotEmpty($wp.html())){
				var max = $.tmDialog._zindex();
				$wp.show().css({"zIndex":max});
				$wp.next().css({"zIndex":(max-1)});
				return;
			}
			options.id = "tm_window_"+options.id;/*给id重命名*/
			options.showBottom = false;
			options.showIcon = false;
			if(!options.showCenter){//是否居中显示
				options.top = this._limitRandom(30,60);
				options.left = this._limitRandom(300,400);
			}
			var $window = this._init(options);
			$window.find(".tmui-modal-body").html("<div id='tmDialog_loading' style='position:absolute;top:50%;left:45%;'><img src='images/loading.gif'><label style='font-size:12px;'>数据马上就来...</label></div>");
			if(!options.ajax){
				var iframe=document.createElement("iframe");
				iframe.id = "tmiframe_"+options.id ;
				iframe.width= options.width;
				iframe.height = options.height;
				iframe.scrolling = "auto";
				iframe.frameborder = "no";
				iframe.src = options.content;
				iframe.style.display ="none";
				iframe.style.border ="0";
				$(iframe).attr("frameborder","no");
				$window.find(".tmui-modal-body").css({"overflowX":"hidden","overflowY":"auto","height":options.height}).append(iframe);
				$(iframe).load(function(){
					$window.find("#tmDialog_loading").remove();
					iframe.style.display ="block";
				});
			}else{
				$window.find(".tmui-modal-body").css({"height":options.height}).load(options.content,function(){
					$window.find(".tmui-modal-close-proxy").on("click",function(){
						$window.fadeOut("slow",function(){
							$window.next().remove();
							$window.remove();
						});
					});
					$window.tmDrag({handle:$window.find(".tmui-drag-header")});//是否允许拖动
				});
			}
			
			$window.find(".tmui-modal-header").css("paddingLeft",3).prepend("<div class='fl' style='padding-top:4px;padding-right:5px;'><img src='"+options.wicon+"' width='22' height='23'/></div>&nbsp;");
			$window.find(".tmui-modal-toolbars").append("<button type='button' title='最大化' class='tmui-modal-max'><span class='tmui-modal-span'>□</span></button><button type='button' title='最大小化' class='tmui-modal-min'><span class='tmui-modal-span'>-</span></button>");
			$window.find(".tmui-modal-min").on("click",function(){
				$window.tmDrag({handle:$window.find(".tmui-modal-header")});//是否允许拖动
			});
			var max = $.tmDialog._zindex();
			$window.show().css("zIndex",max);
			$window.next().css({"zIndex":(max-1)});
			/*附加代理层*/
			$("#tmui_resizable").remove();
			$("body").append("<div id='tmui_resizable'></div>");
			/*添加resize边角*/
			$window.append("<div class='tmui-resize tmui-resize-ll'></div>" +
					"<div class='tmui-resize tmui-resize-tt'></div>" +
					"<div class='tmui-resize tmui-resize-rr'></div>" +
					"<div class='tmui-resize tmui-resize-bb'></div>" +
					"<div class='tmui-resize tmui-resize-tr'></div>" +
					"<div class='tmui-resize tmui-resize-tl'></div>" +
					"<div class='tmui-resize tmui-resize-br'></div>" +
					"<div class='tmui-resize tmui-resize-bl'></div>");
			/*最大化*/
			$window.find(".tmui-modal-max").off().on("click",function(){
				var open = $(this).data("open");
				var max = $.tmDialog._zindex();
				$window.css("zIndex",max);
				var width = $.tmUtil._getClientWidth();
				var height = $.tmUtil._getClientHeight();
				if(isEmpty(open)){
					var styleData = $window.attr("style");
					$(this).data({"open":"open","style":styleData});
					$window.css({left:0,top:1,width:"100%",height:height-70});
					$(this).find("span").text("■");
					$window.find(".tmui-modal-header").css("cursor","default").off();
					$window.find("iframe").height(height).width(width);
					$window.find(".tmui-modal-body").height(height).width(width);
				}else{
					$window.attr("style",$(this).data("style"));
					$window.find("iframe").height($window.height()).width($window.width());
					$window.find(".tmui-modal-body").height(height).width(width);
					$window.tmDrag({handle:$window.find(".tmui-modal-header")});//是否允许拖动
					$(this).find("span").text("□");
					$(this).removeData("open");
					$(this).removeData("style");
				}
				if(options.maxcallback)options.maxcallback($window,options);
			});
			
			$window.find(".tmui-modal-min").off().on("click",function(){
				if(options.mincallback)options.mincallback($window,options);
				var max = $.tmDialog._zindex();
				$window.css("zIndex",max);
			});
			
			if(!options.showMax){
				$window.find(".tmui-modal-min").css("right",45);
				$window.find(".tmui-modal-max").remove();
			}
			
			if(!options.showMin)$window.find(".tmui-modal-min").remove();
			if(!options.showHeader){
				$window.find(".tmui-modal-header").css({"position":"absolute","width":"100%","height":47,"zIndex":2});
				$window.hover(function(){
					$(this).find(".tmui-modal-header").show();
				},function(){
					$(this).find(".tmui-modal-header").hide();
				});
			}
			
			if(!options.removeHeader){
				$window.find(".tmui-modal-header").remove();
			}
			if(options.showResize){
				var windowDom = $window.get(0);
				var oL = $window.find(".tmui-resize-ll").get(0);
				var oT = $window.find(".tmui-resize-tt").get(0);
				var oR = $window.find(".tmui-resize-rr").get(0);
				var oB = $window.find(".tmui-resize-bb").get(0);
				var oLT = $window.find(".tmui-resize-tr").get(0);
				var oTR = $window.find(".tmui-resize-tl").get(0);
				var oBR = $window.find(".tmui-resize-br").get(0);
				var oLB = $window.find(".tmui-resize-bl").get(0);
				
	
				/*四角*/
				this._windowResize(windowDom, oLT, true, true, false, false,options);
				this._windowResize(windowDom, oTR, false, true, false, false,options);
				this._windowResize(windowDom, oBR, false, false, false, false,options);
				this._windowResize(windowDom, oLB, true, false, false, false,options);
				/*四边*/
				this._windowResize(windowDom, oL, true, false, false, true,options);
				this._windowResize(windowDom, oT, false, true, true, false,options);
				this._windowResize(windowDom, oR, false, false, false, true,options);
				this._windowResize(windowDom, oB, false, false, true, false,options);
			}else{
				$window.find(".tmui-resize").remove();
			}
		},
		_windowResize : function(oParent, handle, isLeft, isTop, lockX, lockY,opts){
			var dragMinWidth = opts.limitWidth;
			var dragMinHeight = opts.limitHeight;
			handle.onmousedown = function (event){
				var max = $.tmDialog._zindex();
				$(oParent).css("zIndex",max);
				var e = event || window.event;
				var disX = e.clientX - handle.offsetLeft;
				var disY = e.clientY - handle.offsetTop;
				var iParentTop = oParent.offsetTop;
				var iParentLeft = oParent.offsetLeft;
				var iParentWidth = oParent.offsetWidth;
				var iParentHeight = oParent.offsetHeight;
				document.onmousemove = function (event){
					var e = event || window.event;
					var iL = e.clientX - disX;
					var iT = e.clientY - disY;
					var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
					var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;
					var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
					var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
					isLeft && (oParent.style.left = iParentLeft + iL + "px");
					isTop && (oParent.style.top = iParentTop + iT + "px");
					iW < dragMinWidth && (iW = dragMinWidth);
					iW > maxW && (iW = maxW);
					lockX || (oParent.style.width = iW + "px");
					iH < dragMinHeight && (iH = dragMinHeight);
					iH > maxH && (iH = maxH);
					lockY || (oParent.style.height = iH + "px");
					if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
					$(oParent).find("iframe").height(iH).width(iW);
					$(oParent).find(".tmui-modal-body").height(iH).width(iW);
					return false;
				};
				document.onmouseup = function (){
					document.onmousemove = null;
					document.onmouseup = null;
				};
				return false;
			};
		}
	};
	
	$.fn.tmDrag = function (settings) {
		return this.each(function () {
			var $drag = $(this),options = $.extend({},$.fn.tmDrag.defaults,$.fn.tmDrag.defaults.parseOptions(this),settings),
			// 拖动对象
			$handle = options.handle ? $drag.find(options.handle) : $drag,
			// 拖动区域对象
			$zoom = $(options.zoom),
			// 拖动开始的位置
			startPos = {},
			dragFix = {},
			// body 默认 cursor
			cursor = $("body").css("cursor"),
			// 默认的 zIndex 值
			zIndex = $drag.css("z-index"),
			// 是否正在拖动
			isDraging = 0,ghsotDiv;
			$handle.css("cursor", "move");
			_checkPosition($drag);
			if(!options.isDrag)return;
			// html4 拖拽
			$handle.mousedown(function (e) {
				var evt = e || event;
				if(evt.which==3 || evt.button==2)return;
				var left = $drag.offset().left;
				var top = $drag.offset().top;
				$drag.css({top:top,left:left,"margin":0,"position":"absolute"});
				if(options.ghsot){ghsotDiv = options.ghsotEvent($drag);}
				if (!isDraging) {
					_ondragstrart(e);
					return false;
				}
			});
			
			$(document).mousemove(function (e) {
				if (isDraging) {
					_ondragpos(e);
					return false;
				}
			}).mouseup(function (e) {
				if (isDraging) {
					_ondragpos(e, true);
					return false;
				}
			});

			/**
			 * 检查拖动对象的position
			 * @return {undefined}
			 */
			function _checkPosition() {
				if (!$drag.css("position")) {
					$drag.css({
						position: "absolute",
						left: 0,
						top: 0
					});
				}
			}
			
			/**
			 * 开始拖动
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragstrart(e) {
				isDraging = 1;
				startPos.screenX = e.screenX;
				startPos.screenY = e.screenY;
				startPos.left = $drag.offset().left;
				startPos.top = $drag.offset().top;
				$parentbox = options.parent;
				boxHeight = $(window).height()+$(window).scrollTop()-($drag.height()/5);
			    boxWidth = $.tmUtil._getClientWidth()-($drag.width()/5);
				if($parentbox){
					limitLeft =$parentbox.offset().left;
					limitTop = $parentbox.offset().top;
					//limitWidth = $parentbox.width();
					//limitHeight = $parentbox.height();
				}
				var max = $.tmDialog._zindex();
				$drag.css("zIndex",max);
				options.ondragstart.call($drag, e);
				$("body").css("cursor", "move");
			}
			
			/**
			 * 改变拖拽位置
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragpos(e, isStop) {
				// 正在拖动并且不支持html5
				if (isDraging) {
					var _left = e.screenX - startPos.screenX + startPos.left;
					var _top = e.screenY - startPos.screenY + startPos.top;
					if($parentbox){
						if(_left<limitLeft)_left=limitLeft+3;
						if(_top<limitTop)_top=limitTop+3;
						if(_top>boxHeight)_top = boxHeight+8;
						if(_left>boxWidth)_left=boxWidth+8;
					}else{
						if(_left<(boxWidth*-1))_left= boxWidth*-1;
						if(_top<2)_top=2;
						if(_left>boxWidth)_left = boxWidth;
						if(_top>boxHeight)_top=boxHeight-options.arrowTop;
					}
					
					if(isNotEmpty(options.arrow) && options.arrow=="left"){
						_top = $drag.offset().top;
					}
					if(isNotEmpty(options.arrow) && options.arrow=="top"){
						_left = $drag.offset().left;
					}
					
					dragFix.left = _left;
					dragFix.top = _top;
					/*镜像处理*/
					if(options.ghsot){
						ghsotDiv.css({left:_left+"px",top:_top+"px"});
					}else{
						/*普通处理*/
						$drag.offset({left: _left,top: _top});
					}
				}
				// 停止
				if (isStop && isDraging) {
					if(options.ghsot){
						$drag.css({left:dragFix.left,top:dragFix.top});
						ghsotDiv.remove();
					}
					//$drag.css("z-index", zIndex);
					isDraging = 0;
					options.ondragend.call($drag, e);
					$("body").css("cursor", cursor);
				} else {
					options.ondrag.call($drag, e);
				}
			}
		});
	};
	
	$.fn.tmDrag.defaults = {
		// 鼠标操作区域
		handle: "",
		parent:"",
		arrow:"",
		arrowTop:30,
		isDrag:true,
		// 拖动的时候层级的高度
		zIndex: 999,
		// 拖动开始回调
		ondragstart: function () {},
		// 拖动中回调
		ondrag: function () {},
		// 拖动结束回调
		ondragend: function () {},
		ghsot:true,
		ghsotEvent:function($this){
			var ghsotDiv = $("<div class='ghsot'><div>");
			var selfHeight = $this.outerHeight(true);//容器自身的高度加border
			var selfWidth = $this.outerWidth(true);//容器自身的宽度加border
			var $offset = $this.offset();
			$("body").append(ghsotDiv);
			ghsotDiv.css({zIndex:999,border:"2px dotted #f9f9f9","boxShadow":"0px 0px 1.5em #111",opacity:0.35,position:"absolute",width:selfWidth,height:selfHeight});
			return ghsotDiv;
		}
	};
	
	$.fn.tmDrag.defaults.parseOptions = function(target){
		var $this = $(target);
		var ghsot = true;
		var arrow = "";
		var parent = "";
		var handle = "";
		var ghsotp = $this.attr("ghsot");
		var arrowp = $this.attr("arrow");
		var parentp = $this.attr("parent");
		var handlep = $this.attr("handle");
		if(isNotEmpty(ghsotp) && ghsotp=="false")ghsot=false;
		if(isNotEmpty(arrowp))arrow = arrowp;
		if(isNotEmpty(parentp))parent = $("#"+parentp);
		if(isNotEmpty(handlep))handle = $("#"+handlep);
		return {
			ghsot:ghsot,
			arrow:arrow,
			parent:parent,
			handle:handle
		};
	};
	
	
	$.tmDialog.defaults = {
		id:"",//标示符
		ajax:false,
	    open:"top",//打开方式。如果是default的话没有动画效果 //关闭动画的效果 fade left top default slide,other
	    animateBefore:"before",//如果open不是默认的动画效果，如果为true打开为前置动画，false为后置动画
		position:"fixed",//定位方式
		single:false,//是否采用单例模式
		width:358,//宽度
		height:228,//高度
		colors:[],//换肤
		drag:true,//是否允许拖拽
		shake:false,//是否抖动代开
		showIcon:true,//是否显示图标
		showBottom:true,//是否显示底部
		showHeader:false,//是否显示头部
		showResize:true,//是否resize
		showMin:true,//是否显示最小化
		showMax:true,//是否显示最大化
		showClose:true,//是否显示关闭
		showCenter:false,//默认随机显示位置
		showOverlay:true,//是否需要阴影层
		removeHeader:true,//删除头
		zindex:"",
		overlayHide:false,//
		icon:"success",//默认按钮
		limitWidth :360,//resize限制宽度
		limitHeight:88,//resize限制宽度
		wicon:"",//窗体图标
		message:false,//消息设置
		title:"提示",//标题
		value:"",//prompt的值
		left:'40%',//设定left
		top:'40%',//设定top
		timer:"",//几秒关闭
		content:"请输入内容....",//显示的内容
		cancleText:"取消",//取消按钮文件
		sureText :"确定",//确定按钮文件
		textarea:false,//prompt的展示
		finish:function(){
			
		},
		loadSuccess:function(){
			
		},
		validator:function($input){
			return true;
		},
		callback:function(ok){
			
		},
		mincallback:function(){
			
		},
		maxcallback:function(){
			
		}
	};
	
	$.tmLoading = function(content,options){
		var opts = $.extend({},$.tmLoading.defaults,options);
		if($(".tmui-loading").length==0)$("body").append('<div class="tmui-loading" title="click close me!"><span id="tm-loading-content"></span></div>');
		var $loading = 	$(".tmui-loading");
		if(opts.skin=="black"){
			$(".tmui-loading").css({background:"#3e4146","color":"#fff","border":"1px solid #555"});
		}
		if(opts.overlay){
			var overlayHeight = Math.max($.tmUtil._getClientHeight(),document.body.scrollHeight,document.documentElement.scrollHeight);
			$("body").append("<div class=\"tmui_loading_overlay\" style=\"z-index: 1001; height: 100%; display: none;\"></div>");
			$(".tmui_loading_overlay").on("click",function(){
				$loading.slideUp(250,function(){
					$(this).remove();
					clearInterval(loadingTimer);
				});
				$(this).remove();
			}).css({"opacity":"0.6","z-index":"999","height":overlayHeight}).show();
		}
		if(!opts.showLoad)$loading.find("#tm-loading-content").css("background","none");
		if(content=="remove"){
			$loading.slideUp(250,function(){
				opts.timeSuccess($loading);
				$(".tmui_loading_overlay").remove();
				if(opts._remove)$loading.remove();
			});
		}else{
			if(isEmpty(content))content = opts.content ;
			$loading.show().find("#tm-loading-content").html(content);
			var selfWidth = $loading.width();
			var selfHeight = $loading.height();
			var left = ($.tmUtil._getClientWidth()-selfWidth)/2;
			var top = ($.tmUtil._getHeight()-selfHeight)/2;
			if(isNotEmpty(opts.left))left= opts.left;
			if(isNotEmpty(opts.top))top = opts.top;
			$loading.css({left:left,top:top});
			opts.callback($loading,opts);
			var loadingTimer = null;
			if(opts.timer>0){
				loadingTimer = setTimeout(function(){
					$loading.slideUp(250,function(){
						clearInterval(loadingTimer);
						opts.timeSuccess($loading);
						$(".tmui_loading_overlay").remove();
						if(opts._remove)$loading.remove();
				});},opts.timer*1000);
			}else{
				$(".tmui_loading_overlay").remove();
				if(opts._remove)$loading.remove();
			}
		}
	};
	
	$.tmLoading.defaults = {
		top:"",
		left:"",
		timer:0,
		_remove:false,
		skin:"black",
		content:"loading...",
		showLoad:true,
		overlay:false,
		timeSuccess:function(){
			
		},
		callback:function($this,opts){
			if(opts._remove){
				$this.on("click",function(){
					$this.slideUp(250,function(){
						$(this).remove();
					});
					$(".tmui_loading_overlay").remove();
				});
			}else{
				$this.on("click",function(){
					$this.slideUp(250,function(){
						$(this).hide();
					});
					$(".tmui_loading_overlay").remove();
				});
			}
		}
	};
	/*loading plugin end*/
	/*tpAjax*/
	$.tpAjax = {
		request : function(options,dataJson){
			var opts = $.extend({},{limit:true,beforeSend:function(){
				//tmLoading("数据处理中,请稍后...",1);
			},error:function(){
				
			},callback:function(data){
				
			}},options);
			var _url = opts.url;
			if(isEmpty(_url)){
				_url = jsonPath+"/"+opts.model+"/"+opts.method+"?ajax=true";
			}
			if(isNotEmpty(opts.params)){
				_url+="&"+opts.params;
			}
			
			if(opts.limit){
				clearTimeout(ajaxTimeout);
				ajaxTimeout = setTimeout(function(){
					$.tpAjax.ajaxMain(opts,_url,dataJson);
				},200);
			}else{
				$.tpAjax.ajaxMain(opts,_url, dataJson);
			}
		},
		ajaxMain:function(opts,_url,dataJson){
			$.ajax({
				type:"post",
				data : dataJson,
				url : _url,
				beforeSend:function(){opts.beforeSend();},
				error:function(){tmLoading("抱歉！因为操作不能够及时响应，请稍后在试...",1);opts.error();clearTimeout(ajaxTimeout);},
				success:function(data){
					if(data.result=="logout"){
						$.tmLogin._dialogLogin();
					}else if(data.result=="frontLogout"){
						window.location = "/tp/login/login.html";
					}else{
						if(opts.callback)opts.callback(data);
					}
					clearTimeout(ajaxTimeout);
				}
			});
		}
	};
})(jQuery);

