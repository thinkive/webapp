define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
	    $('#btn_t_default').tap(function(){
            J.showToast('这是默认的Toast,默认3s后小时');
        })
        $('#btn_t_success').tap(function(){
            J.showToast('恭喜，success,5s后消失','success',5000);
        })
        $('#btn_t_error').tap(function(){
            J.showToast('抱歉，error','error');
        })
        $('#btn_t_info').tap(function(){
            J.showToast('提示，info','info');
        })
        $('#btn_t_top').tap(function(){
            J.showToast('更新了50条数据','toast top');
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