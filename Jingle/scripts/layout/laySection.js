define(function (require, exports, module) {
	var pageId = "#layout_laySection"
	function init()
	{
	   $('#layout_header_ctrl').on('change',function(event,el){
            J.alert('提示','你点了'+$(el).text());
        })
        $('#layout-btn-getmore').tap(function(){
            J.popup({
                html: '<div style="height: 100px;line-height: 100px;font-size: 20px;font-weight: 600;text-align: center;">这里展示更多功能</div>',
                pos : 'bottom-second',
                showCloseBtn : false
            });
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