define(function (require, exports, module) {
	var pageId = "#button_section";
	 var slider;
	function init()
	{
        slider = new J.Slider({
            selector : '#slider_test',
            onBeforeSlide : function(){
                return true;
            },
            onAfterSlide : function(i){
                //alert(i);
            }
        });
        $('#slider_prev').tap(function(){slider.prev()});
        $('#slider_next').tap(function(){slider.next()});
	}
	
	function bindPageEvent()
	{

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