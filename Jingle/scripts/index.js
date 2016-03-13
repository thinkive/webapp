define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
		$('#btn_show_welcome').on('tap', J.Welcome.show);
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