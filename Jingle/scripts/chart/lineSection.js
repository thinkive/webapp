define(function (require, exports, module) {
	var pageId = "#layout_laySection";
	 var line,$chart;
	function init()
	{
	  
        //重新设置canvas大小
        $chart = $('#line_canvas');
        var wh = App.calcChartOffset();
        $chart.attr('width',wh.width).attr('height',wh.height-30);
        renderLine();
        $('#changeLineType').on('change',function(e,el){
            updateChart(el.data('type'));
        })
   }
    function renderLine(){
        var data = {
            labels : ["一月","二月","三月","四月","五月","六月","七月",'八月','九月','十月','十一月','十二月'],
            datasets : [
                {
                    name : 'A产品',
                    color : "#72caed",
                    pointColor : "#95A5A6",
                    pointBorderColor : "#fff",
                    data : [65,59,90,81,56,55,40,20,13,20,11,60]
                },
                {
                    name : 'B产品',
                    color : "#a6d854",
                    pointColor : "#95A5A6",
                    pointBorderColor : "#fff",
                    data : [28,48,40,19,96,27,100,40,40,70,11,89]
                }
            ]
        }
        line = new JChart.Line(data,{
            id : 'line_canvas',
            smooth : false,
            fill : false
        });
        line.on('tap.point',function(d,i,j){
            J.alert(data.labels[i],d);
        });
        line.draw();
    }
    function updateChart(type){
        if(type == 'smooth'){
            line.refresh({
                smooth : true,
                fill : false
            });
        }else if(type == 'area'){
            line.refresh({
                smooth : true,
                fill : true
            });
        }else{
            line.refresh({
                smooth : false,
                fill : false
            });
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