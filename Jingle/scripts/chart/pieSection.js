define(function (require, exports, module) {
	var pageId = "#layout_laySection"
	function init()
	{
	      var pie,$chart;
        //重新设置canvas大小
        $chart = $('#pie_canvas');
        var wh = App.calcChartOffset();
        $chart.attr('width',wh.width).attr('height',wh.height-100);
        renderPie();
        $('#changePieType').on('change',function(e,el){
            updateChart(el.data('type'));
        });
    }

    function renderPie(){
        var pie_data = [
            {
                name : '直接访问',
                value: 335,
                color:"#F38630"
            },{
                name : '联盟广告',
                value : 234,
                color : "#E0E4CC"
            },{
                name : '视频广告',
                value : 135,
                color : "#72caed"
            },{
                name : '搜索引擎',
                value : 1400,
                color : "#a6d854"
            }
        ];
        pie = new JChart.Pie(pie_data,{
            id : 'pie_canvas',
            clickType : 'rotate'
        });
        pie.on('rotate',function(d,i,j){
            $('#pie_segment_info').html(d.name + '    '+ d.value).show();
        });
        pie.draw();
    }
    function updateChart(type){
        $('#pie_segment_info').hide();
        if(type == 'pie'){
            pie.refresh({
                isDount : false
            });
        }else if(type == 'dount'){
            pie.refresh({
                isDount : true,
                dountText : '访问来源'
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