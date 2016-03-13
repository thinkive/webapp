define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
		$('#h_scroll_article').on('articleshow',function(){
            J.Scroll('#h_scroll_demo',{hScroll:true,hScrollbar : false});
        })
	}
	
	function bindPageEvent()
	{
		//$(document).on('tap','a[data-target]',_targetHandler);
	}
	
	/**
	 * 界面销毁
	 * */
	function destroy()
	{
		
	}
	var btnSection = {
		"init" : init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
    };
	module.exports = btnSection;
});	