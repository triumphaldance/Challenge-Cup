
$(function(){
		$('#listNewsPage').addClass("selected");
		$(".dynamic01").animate({opacity:"1"},1000);
		$(".dynamic02").delay(300).animate({bottom:"0px",opacity:"1"},1000);
		$(".dnt01").click(function(){
			$(this).addClass("dnt");
			$(".dnt02").removeClass("dnt");
			$(".Tztrends").fadeTo(200,1);
			$(".Tzmedia").hide();
		});
		$(".dnt02").click(function(){
			$(this).addClass("dnt");
			$(".dnt01").removeClass("dnt");				
			$(".Tzmedia").fadeTo(200,1);
			$(".Tztrends").hide();
		});
	//分页初始化
	$.ajax({
		url:basePath+"/listNewsPage.htmls",
		data:{
			"offset" : 0,
			"pageNo": 5
		},
		success:function(data){
			$("#homeNewsListTemplate").html(data);
			$("#page").show();
			var newsCount=$("#newsCount").val();
			tm_init_page(newsCount); 
		}
	})

});

function tm_init_page(itemCount) {
	$("#page").pagination(itemCount, {
		num_edge_entries : 3, //边缘页数
		num_display_entries : 3, //主体页数
		num_edge_entries : 3,
		current_page : 0,
		showSelect:false,
		showGo:true, 
		items_per_page : 5, //每页显示X项
		prev_text : "前一页",
		next_text : "后一页",
		callback : function(pageNo,psize) {
			tm_load_template(pageNo,psize);
		}
	});
};
/*分页模板   */
function tm_load_template(pageNo,psize,callback){
	$.ajax({
		url: basePath + "/listNewsPage.htmls",
		data : {
			"offset" : pageNo*psize,
			"pageNo": psize
		},
		success : function(data) {
			$("#homeNewsListTemplate").html(data);
		    $('html, body').animate({scrollTop:1000}, 'slow'); 
		}
	});            
};



  
