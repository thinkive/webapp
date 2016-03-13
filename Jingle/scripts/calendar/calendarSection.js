define(function (require, exports, module) {
	var pageId = "#button_section"
	function init()
	{
        new J.Calendar('#calendar_demo',{
            onRenderDay : function(day,date){
                if(day == 5){
                    return '<div>'+day+'</div><div style="font-size: .8em;color: red">威武</div>'
                }
                return day;
            },
            onSelect:function(date){
                alert(date);
            }
        });
        $('#btn_popup_calendar').tap(function(){
            J.popup({
                html : '<div id="popup_calendar"></div>',
                pos : 'center',
                backgroundOpacity : 0.4,
                showCloseBtn : false,
                onShow : function(){
                    new J.Calendar('#popup_calendar',{
                        date : new Date(2013,7,1),
                        onSelect:function(date){
                            $('#btn_popup_calendar').text(date);
                            J.closePopup();
                        }
                    });
                }
            });
        });
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