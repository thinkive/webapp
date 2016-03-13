define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
        J.Refresh({
            selector : '#down_refresh_article',
            type : 'pullDown',
            pullText : '你敢往下拉么...',
            releaseText : '什么时候你才愿意放手？',
            refreshTip : '最后一次拉的人：<span style="color:#e222a5">骚年</span>',
            callback : function(){
                var scroll = this;
                setTimeout(function () {
                    $('#down_refresh_article ul.list li').text('嗯哈，长大后我就成了你~');
                    scroll.refresh();
                    J.showToast('更新成功','success');
                }, 2000);
            }
        });
//    最简约的调用方式
        J.Refresh( '#up_refresh_article','pullUp', function(){
            var scroll = this;
            setTimeout(function () {
                var html = '';
                for(var i=0;i<10;i++){
                    html += '<li style="color:#E74C3C">我是被拉出来的...</li>'
                }
                $('#up_refresh_article ul.list').append(html);
                scroll.refresh();
                J.showToast('加载成功','success');
            }, 2000);
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