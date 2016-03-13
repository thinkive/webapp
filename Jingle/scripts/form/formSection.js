define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
	    $('#checkbox_1').on('change',function(){
            alert($(this).data('checkbox'));
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