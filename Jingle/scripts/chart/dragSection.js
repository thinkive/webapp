define(function (require, exports, module) {
	var pageId = "#layout_laySection";
	var $lineChart,$barChart;
	function init()
	{
        //重新设置canvas大小
        $lineChart = $('#chart_drag_line_canvas');
        $barChart = $('#chart_drag_bar_canvas');
        var wh = App.calcChartOffset();
        $lineChart.attr('width',wh.width).attr('height',wh.height-30);
        $barChart.attr('width',wh.width).attr('height',wh.height-30);
        var data = {
            labels : ["2012","二月","三月","四月","五月","六月","七月",'八月','九月','十月','十一月','十二月','2013',"二月","三月","四月","五月","六月","七月",'八月','九月','十月','十一月','十二月','2014','一月','二月'],
            datasets : [
                {
                    name : 'A产品',
                    color : "#72caed",
                    pointColor : "#95A5A6",
                    pointBorderColor : "#fff",
                    data : [65,59,90,81,56,55,40,20,13,20,11,60,65,59,90,81,56,55,40,20,11,20,10,60,11,60,65]
                },
                {
                    name : 'B产品',
                    color : "#a6d854",
                    pointColor : "#95A5A6",
                    pointBorderColor : "#fff",
                    data : [28,48,40,19,96,27,100,40,40,70,11,89,28,48,40,19,96,27,100,40,40,70,10,89,28,48,40]
                }
            ]
        }
        $('#changeDragChartType').on('change',function(e,el){
            renderChart(el.data('type'),data);
        })
        renderChart('line',data);
    }
    var renderChart = function(type,data){
        if(type == 'line'){
            $lineChart.show();
            $barChart.hide();
            new JChart.Line(data,{
                id : 'chart_drag_line_canvas',
                datasetGesture : true,
                datasetOffsetNumber : 10
            }).draw(true);
        }else{
            $lineChart.hide();
            $barChart.show();
            new JChart.Bar(data,{
                id : 'chart_drag_bar_canvas',
                datasetGesture : true,
                datasetOffsetNumber : 10
            }).draw(true);
        }
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