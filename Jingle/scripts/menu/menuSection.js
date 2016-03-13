define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
        $.get('views/aside/aside.html',function(aside){
            $('#aside_container').append(aside);
            J.Menu.init();
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