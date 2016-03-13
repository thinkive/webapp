/**
 * 程序入口配置读取
 */
define(function(require, exports, module) {
	var configuration = {
		//项目中模块的别名配置
		"pAlias": {
			"customerService":"scripts/services/customerService",
		},
		
		//全局常量,变量配置
		"global":{
			"pushServer":"http://demo.dcloud.net.cn/helloh5/push/"
		},
		//缺省页面
		"defaultPage":"index"
		
	};
	//暴露对外的接口
	module.exports = window.configuration = configuration;
});