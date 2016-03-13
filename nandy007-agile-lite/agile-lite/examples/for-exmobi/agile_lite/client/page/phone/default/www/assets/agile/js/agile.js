/*
*	Agile Lite 移动前端框架
*	Version	:	1.1.5 beta
*	Author	:	nandy007
*   License MIT @ https://git.oschina.net/nandy007/agile-lite
*/
var A = (function($){
	var Agile = function(){
		this.$ = $;
		this.options = {
			version : '1.1.5',
			clickEvent : ('ontouchstart' in window)?'tap':'click',
			agileReadyEvent : 'agileready',
			agileStartEvent : 'agilestart', //agile生命周期事件之start，需要宿主容器触发
			readyEvent : 'ready', //宿主容器的准备事件，默认是document的ready事件
			backEvent : 'backmenu', //宿主容器的返回按钮
			complete : false, //是否启动完成
			crossDomainHandler : null, //跨域请求的处理类
			showPageLoading : false, //ajax默认是否有loading界面
			viewSuffix : '.html', //加载静态文件的默认后缀
			lazyloadPlaceholder : '' //懒人加载默认图片
		};
		
		this.pop = {
			hasAside : false,
			hasPop : false
		};
	};
	
	var _launchMap = {};
	
	/**
     * 注册Agile框架的各个部分，可扩充
     * @param {String} 控制器的唯一标识
     * @param {Object} 任意可操作的对象，建议面向对象方式返回的对象
     */
	Agile.prototype.register = function(key, obj){
		//if(this[key]) return false;
		this[key] = obj;
		if(obj.launch){
			_launchMap[key] = obj.launch;
		}
	};
	var _doLaunch = function(){
		for(var k in _launchMap){ try{ _launchMap[k](); }catch(e){ console.log(e);} }
		A.options.complete = true;
		$(document).trigger(A.options.agileReadyEvent);
	};
	
	/**
     * 启动Agile
     * @param {Object} 要初始化的一些参数
     */
	Agile.prototype.launch = function(opts){
		if(A.options.complete==true) return;
		$.extend(this.options, opts);
		var _this = this;
		if(!this.options.readyEvent){
			_doLaunch();
		}else if($(document)[this.options.readyEvent]){
			$(document)[this.options.readyEvent](_doLaunch);
		}else{
			$(document).on(this.options.readyEvent, _doLaunch);
		}
	};
	return new Agile();
})(window.Zepto||jQuery);

//控制器
(function($){
	/**
     * 控制器的基本结构，形如{key:{selector:'控制器选择器'，默认为body',handler:function($trigger){}}}
     * selector为选择器，handler为处理函数
     * @private
     */
	var _controllers = {
		default : {//默认控制器
			selector : '[data-toggle="view"]',
			handler : function(hash, el){				
				$el = $(el);				
				var toggleType = $el.data('toggle');
				var urlObj = A.util.parseURL(hash);
				var hashObj = urlObj.getHashobject();				
				var controllerObj = _controllers[toggleType]||{};				
				var $target = $(hashObj.tag);
				var $container = $(controllerObj.container);				
				function _event($target, $current){				
					if(urlObj.getQueryobject()) $target.data('params', A.JSON.stringify(urlObj.getQueryobject()));					
					var targetRole = $target.data('role')||'';					
					var show = function($el){
						if(!$el.hasClass('active')) $el.addClass('active');					
						if(!$el.attr('__init_controller__')){												
							$el.attr('__init_controller__', true);
							$el.trigger(targetRole+'load');
						}													
						$el.trigger(targetRole+'show');
					};
					
					var hide = function($el){
						$el.removeClass('active').trigger(targetRole+'hide');
					};
					if(controllerObj.isToggle){
						if($target.hasClass('active')){
							hide($target);
						}else{
							show($target);
						}
						return;
					}

					show($target);
					if($current&&$current.length>0) {
						hide($current);
					}
				}
				
				function _setDefaultTransition($el){
					var targetTransition = $el.data('transition')||controllerObj.transition;
					if(targetTransition) $el.data('transition', targetTransition);
				};
				
				function _next(){														
					var targetRole = $target.data('role');
					var toggleSelector = targetRole?'[data-role="'+targetRole+'"].active':'.active';
					if($target.hasClass('active')){
						_event($target);
						controllerObj.complete&&controllerObj.complete($target, {result:'thesame'});
					}else{
						var $current = $target.siblings(toggleSelector);
						_setDefaultTransition($current);_setDefaultTransition($target);
						A.anim.change($current, $target, false, function(){				
							_event($target, $current);
						});	
						controllerObj.complete&&controllerObj.complete($target, {result:'success'});
					}
				}
				
				if($target.length==0){
					if($container.length==0){
						controllerObj.complete&&controllerObj.complete($target, {result:'nocontainer'});
						return;
					};
										
					A.util.getHTML(urlObj.getURL(), function(html){
						if(!html){
							controllerObj.complete&&controllerObj.complete($target, {result:'requesterror'});
							return;
						}
						$target = $(html);
						$container.append($target);
						$target = $(hashObj.tag);
						_next();
					});
				}else{
					_next();
				}

			}
		},
		html : {//多页模式请复写此控制器
			selector : '[data-toggle="html"]',
			handler : function(hash){
				var urlObj = A.util.parseURL(hash);
				location.href = urlObj.getURL();
			}
		},
		section : {
			selector : '[data-toggle="section"]',
			container : '#section_container',
			transition : 'slide',
			history : [],
			complete : function($target, msg){
				var _add2History = function(hash,noState){
			    	var hashObj = A.util.parseURL(hash).getHashobject();
			    	var _history = _controllers.section.history;
			    	if(_history.length==0||(_history.length>1&&$(_history[0].tag).data('cache')==false||$(_history[0].tag).data('cache')=='false')){
			    		noState = true;
			    	}
			        if(noState){//不添加浏览器历史记录
			            _history.shift(hashObj);
			            window.history.replaceState(hashObj,'',hash);
			        }else{
			            window.history.pushState(hashObj,'',hash);
			        }
			        _history.unshift(hashObj);
			    };
				var hash = '#'+$target.attr('id');
				msg = msg||{};
				if(msg.result=='thesame'){
					_add2History(hash ,true);
				}else if(msg.result=='success'){
					_add2History(hash ,false);
				}
			}
		},
		article : {
			selector : '[data-toggle="article"]',
			container : '[data-role="section"].active'
		},
		modal : {
			selector : '[data-toggle="modal"]',
			container : 'body',
			isToggle : true
		},
		aside : {
			selector : '[data-toggle="aside"]',
			container : '#aside_container',
			handler : function(hash){
				if(hash){
					A.Aside.show(hash);
				}else{
					A.Aside.hide();
				}
				
			}
		},
		back : {
			selector : '[data-toggle="back"]',
			handler : function(hash){
				if(arguments.length==0||typeof hash=='string'||typeof hash=='undefined'){
					$(document).trigger(A.options.backEvent);
					return;
				}
				var _history = _controllers.section.history;				
				var locationObj = A.util.parseURL(location.href);
				if('#'+locationObj.getFragment()==_history[0].tag){
					return;
				}
				if(_history.length<2) return;
				var $current = $(_history.shift().tag);
		    	var $target = $(_history[0].tag);	
		        A.anim.change($current, $target, true, function(){		        			       	       	
		        	var targetRole = $target.data('role');
		        	$target.addClass('active').trigger(targetRole+'show');
					$current.removeClass('active').trigger(targetRole+'hide');
		        });
			}
		},
		page : {
			selector : '[data-toggle="page"]',
			handler : function(el){
				var $el = $(el);
				var _index = $el.index();
				var $parent = $el.parent().parent();
				var slider = A.Slider($parent);
				slider.index(_index);
			}
		},
		scrollTop : {
			selector : '[data-toggle="scrollTop"]',
			handler : function(el){
				var scroll = A.Scroll(el);
				scroll.scrollTo(0, 0, 1000, IScroll.utils.ease.circular);
			}
		}
	};	
		
	var controller = {};//定义控制器
	/**
     * 添加控制器
     * @param {Object} 控制器对象，形如{key:{selector:'',handler:function(){}}}
     */
	controller.add = function(c){	
		$.extend(_controllers, c);
	};
	
	/**
     * 获取全部控制器
     * @param {String} 控制器的key，如果有key则返回当前key的控制器，没有key则返回全部控制器
     */
	controller.get = function(key){
		return key?_controllers[key]:_controllers;
	};	
	
	/**
     * 为所有控制器创建调用方法
     * @private 只能初始化一次，启动后添加的不生效
     */
	var _makeHandler = function(){
		for(var k in _controllers){			
			(function(k){
				//定义JS调用函数
				controller[k] = function(hash, el){					
					var toggleType = k;
					var $el = el?$(el):$('<a data-toggle="'+k+'" href="'+hash+'"></a>');
					var curr = _controllers[toggleType]?(_controllers[toggleType].handler?toggleType:'default'):'default';
					_controllers[curr].handler(hash, $el);
				};
				//定义点击触发事件
				$(document).on(A.options.clickEvent, _controllers[k]['selector'], function(){
					var k = $(this).data('toggle');
					var hash = $(this).attr('href')||'#';
					(controller[k]||controller['default'])(hash, $(this));
					return false;
				});
			})(k);
		}
	};
	
	/**
     * 启动控制器，如果需要在启动agile的时候启动，则函数名必须叫launch
     */
	controller.launch = function(){
		_makeHandler();
	};

	A.register('Controller', controller);
})(A.$);

//组件
(function($){
	var component = {};
	
	var _components = {
		default : {
			selector : '[data-role="view"]',
			handler : function(el, roleType){				
				var $el = $(el);
				roleType = roleType=='default'?$el.data('role'):roleType;
				var componentObj = _components[roleType]||{};

				if(componentObj.isToggle){
					$el[$el.hasClass('active')?'removeClass':'addClass']('active');
					return;
				}else if($el.hasClass('active')){
					return;
				}
				
				var $current;
				var curSelector = '[data-role="'+roleType+'"].active';
				if(componentObj.container){
					$current = $el.parents(componentObj.container).first().find(curSelector);
				}else{
					$current = $el.siblings(curSelector+'.active');
				}
				$el.addClass('active');
				$current.removeClass('active');
			}
		},
		tab : {
			selector : '[data-role="tab"]',
			handler : function(el, roleType){
				var $el = $(el);
				var toggleType = $el.data('toggle');
				if(toggleType=='section'||toggleType=='modal'||toggleType=='html'){
					return;
				}
				_components['default'].handler(el, roleType);
			}
		},
		scroll : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var onPullDown = function(){};
				var onPullUp = function(){};
				var options = {
					verticle : { },
					horizontal : {
						scrollbars : false, scrollX : true, scrollY : false, bindToWrapper : true
					},
					scroll : {
						scrollX : true, scrollY : true
					},
					pulldown : {
						onPullDown : onPullDown
					},
					pullup : {
						onPullUp : onPullUp
					},
					pull : {
						onPullDown : onPullDown, onPullUp : onPullUp
					}
				};

				var _doScroll = function($scroll){
					var opts = options[$scroll.data('scroll')];					
					A.Scroll('#'+$scroll.attr('id'), opts).refresh();
				};
				
				var _doRefresh = function($el){
					A.Refresh('#'+$el.attr('id'), options[$el.data('scroll')]).refresh();
				};
				
				var $el = $(el||this);
				var scrollType = $el.data('scroll');
				
				if(scrollType=='verticle'||scrollType=='horizontal'||scrollType=='scroll') _doScroll($el);	
							
				if(scrollType=='pulldown'||scrollType=='pullup'||scrollType=='pull') _doRefresh($el);
				
				var scrolls = $el.find('[data-scroll="verticle"],[data-scroll="horizontal"],[data-scroll="scroll"]');
				for(var i=0;i<scrolls.length;i++){
					_doScroll($(scrolls[i]));
				}
				
				scrolls = $el.find('[data-scroll="pulldown"],[data-scroll="pullup"],[data-scroll="pull"]');
				for(var i=0;i<scrolls.length;i++){
					_doRefresh($(scrolls[i]));
				}
			}
		},
		formcheck : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);
				
				var _doInit = function($el){
					$el.on(A.options.clickEvent, function(e){
						if(e.target.tagName.toLowerCase()=='input'||e.target.tagName.toLowerCase()=='label'){
							return true;
						}
			    		try{
			        		var checkObj = $el.find('input')[0];
			        		checkObj.checked = !checkObj.checked;
			    		}catch(e){}
			    		return false;
			    	});
				};
				
				if($el.data('role')=='select'||$el.data('role')=='checkbox'||$el.data('role')=='radio'){
					_doInit($el);
				}else{
					var els = $el.find('[data-role="select"],[data-role="checkbox"],[data-role="radio"]');
					for(var i=0;i<els.length;i++){
						_doInit($(els[i]));
					}
				}
			}
		},
		toggle : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);
				var _doToggle = function($el){					
					if($el.find('div.toggle-handle').length>0){//已经初始化
			            return;
			        }
			        var name = $el.attr('name');
			        var onValue = $el.data('on-value');
			        onValue = typeof onValue=='undefined'?'':onValue;
			        var offValue = $el.data('off-value');
			        offValue = typeof offValue=='undefined'?'':offValue;
			        //添加隐藏域，方便获取值
			        if(name){
			            $el.append('<input type="hidden" name="'+name+'" value="'+($el.hasClass('active')?onValue:offValue)+'"/>');
			        }
			        $el.append('<div class="toggle-handle"></div>');
			        $el.on(A.options.clickEvent, function(){
			            var $t = $(this),v = $t.hasClass('active')?offValue:onValue;
			            $t.toggleClass('active').trigger('toggle',[v]);//定义toggle事件
			            $t.find('input').val(v);
			            return false;
			        });
				};
				
				if($el.data('role')=='toggle'){
					_doToggle($el);
				}else{
					var toggles = $el.find('[data-role="toggle"]');
					for(var i=0;i<toggles.length;i++){
						_doToggle($(toggles[i]));
					}
				}
			}
		},
		'lazyload' : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);
		    	var _doLazyload = function($el){
		    		var placeholder = $el.attr('placeholder')||A.options.lazyloadPlaceholder;
			    	if(!$el.attr('src')&&placeholder) $el.attr('src', placeholder);
					var source = A.util.script($el.data('source'));
			    	var eTop = $el.offset().top;//元素的位置
			    	var validateDistance = 100;
			    	var winHeight = $(window).height()+validateDistance;
			    	if(eTop<0||eTop>winHeight) return;
			    	
			    	var type = $el.data('type');
			    	if(type=='base64'){
			    		A.ajax({
			    			url : source,
			    			success : function(data){
			    				_injectImg($el, data);
			    			},
			    			isBlock : false
			    		});
			    	}else{
			    		var img = new Image();
			    		img.src = source;
			    		if(img.complete) {
			    			_injectImg($el, source);
			    			img = null;
			    	    }else{
			    	    	img.onload = function(){
			    				_injectImg($el, source);
			    				img = null;
			        		};
			    	    }
			    	}
		    	};
		    	
		    	var _injectImg = function($el, data){
		    		if(!$el.data('source')) return;
		    		A.anim.run($el,'fadeOut', function(){
		    			$el.css('opacity', '0');		    				    			
		    			$el[0].onload = function(){			
		    				A.anim.run($el,'fadeIn', function(){
		    					$el.css('opacity', '1');
		    					A.Component.scroll($el.closest('[data-scroll]'));
		    				});
		        		};
		        		$el.attr('src', data);	
		    		});
		    		$el.removeAttr('data-source');
		    	};

		    	if($el.data('source')){
		    		_doLazyload($el);
		    	}else{
		    		var lazyloads = $el.find('img[data-source]');
		    		for(var i=0;i<lazyloads.length;i++){
		    			_doLazyload($(lazyloads[i]));
		    		}
		    	}		    	
			}
		},
		scrollTop : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){				
				var _work = function($el){
					$el.on(A.options.clickEvent, function(){ $el.removeClass('active');});
					var scroll = A.Scroll($el.attr('href'));
					scroll.on('scrollEnd', function(){
						$el[this.y<-120?'addClass':'removeClass']('active');
					});
				};
				var $el = $(el);
				if($el.data('role')=='scrollTop'){
					_work($el);
				}else{
					var comps = $el.find('[data-role="scrollTop"]');
					for(var i=0;i<comps.length;i++){
						_work($(comps[i]));
					}
				}
			}
		}
	};
	
	/**
     * 添加组件
     * @param {Object} 控制器对象，形如{key:{selector:'',handler:function(){}}}
     */
	component.add = function(c){
		$.extend(_components, c);
	};
	
	/**
     * 获取全部组件
     * @param {String} 组件的key，如果有key则返回当前key的组件，没有key则返回全部组件
     */
	component.get = function(key){
		return key?_components[key]:_components;
	};
	
	/**
     * 初始化组件
     * @private 仅能调用一次
     */
	_makeHandler = function(){		
		for(var k in _components){		
			(function(k){	
				//定义JS调用函数
				component[k] = function(hash){
					var roleType = k;
					var curr = _components[roleType]?(_components[roleType].handler?roleType:'default'):'default';
					_components[curr].handler(hash, roleType);
				};
				//定义触发事件	
				if(!_components[k]['selector']) return;
				$(document).on(_components[k].event||A.options.clickEvent, _components[k]['selector'], function(){
					var curr = _components[k].handler?k:'default';				
					_components[curr].handler(this, k);
					return false;
				});
				
			})(k);
		}

	};
	/**
     * 获取控制器传给组件的参数,hash为被控制的组件的#id
     */
	component.params = function(hash){
		return A.JSON.parse($(hash).data('params'))||{};
	};
	
	//启动组件
	component.launch = function(){
		_makeHandler();
	};
	
	A.register('Component', component);
})(A.$);

//动画封装
(function($){
	
	var anim = {};
	
	anim.classes = {//形如：[[currentOut,targetIn],[currentOut,targetIn]]
		empty : [['empty','empty'],['empty','empty']],
		slide : [['slideLeftOut','slideLeftIn'],['slideRightOut','slideRightIn']],
		cover : [['','slideLeftIn'],['slideRightOut','']],
		slideUp : [['','slideUpIn'],['slideDownOut','']],
		slideDown : [['','slideDownIn'],['slideUpOut','']],
		popup : [['','scaleIn'],['scaleOut','']],
		flip : [['slideLeftOut','flipOut'],['slideRightOut','flipIn']]
	};
	
	anim.addClass = function(cssObj){
		$.extend(anim.classes, cssObj||{});
	};
	
	/**
     * 添加控制器
     * @param {Object} 要切换动画的jQuery对象
     * @param {String} 动画样式
     * @param {Number} 动画时间
     * @param {Function} 动画结束的回调函数
     */
	anim.run = function($el, cls, cb){
		var $el = $($el);
		var eName = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		if($el.length==0){
			cb&&cb();
			return;
		}
		if(typeof cls=='object'){
			$el.animate(cls,250,'linear',function(){ cb&&cb();});
			return;
		}
		cls = (cls||'empty')+' anim';
		$el.addClass(cls).one(eName,function(){			
			$el.removeClass(cls);
			cb&&cb();
			$el.unbind(eName);
		});
	};
	
	/**
     * 添加控制器
     * @param {String} 要切换的当前对象selector
     * @param {String} 要切换的目标对象selector
     * @param {Boolean} 是否返回
     * @param {Function} 动画结束的回调函数
     */
	anim.change = function(current, target, isBack ,callback){
		
		var $current = $(current);
		var $target = $(target);
		
		if($current.length+$target.length==0){
			callback&&callback();
			return;
		}
		
		var targetTransition = $target.data('transition');
		if(!anim.classes[targetTransition]){
			callback&&callback();
			return;
		}
		var transitionType = anim.classes[targetTransition][isBack?1:0];
		anim.run($current, transitionType[0]);							
		anim.run($target, transitionType[1], function(){	
			callback&&callback();
		});
	};
	
	A.register('anim', anim);

})(A.$);

//ajax封装
(function($){
	
	//用法继承jQuery的$.ajax
	var ajax = function(opts){
		
		var success = opts.success;
		var error = opts.error;
		
		var random = '__ajax_random__='+Math.random();
    	opts.url += (opts.url.split(/\?|&/i).length==1?'?':'&')+random;

		var _success = function(data){
			success&&success(data);
		};
		var _error = function(data){
			error&&error();
		};

		opts.success = _success;
		opts.error = _error;
		
		$.ajax(opts);
	};
	
	A.register('ajax', ajax);
})(A.$);

(function($){
	var util = {};
	
	util.script = function(str){	
		str = (str||'').trim();
		var tag = false;
		
    	str = str.replace(/\$\{([^\}]*)\}/g, function(s, s1){
    		try{
    			tag = true;
    			return eval(s1.trim());
    		}catch(e){
    			return '';
    		}

    	});

    	return tag?util.script(str):str;
    };	
	
	util.provider = function(str, data){
    	str = (str||'').trim();
    	return str.replace(/\$\{([^\}]*)\}/g, function(s, s1){   		
    		return data[s1.trim()]||'';
    	});
    };
    
	var URLParser = function(url) {

	    this._fields = {
	        'Username' : 4,   //用户
	        'Password' : 5,   //密码
	        'Port' : 7,       //端口
	        'Protocol' : 2,   //协议
	        'Host' : 6,       //主机
	        'Pathname' : 8,   //路径
	        'URL' : 0,
	        'Querystring' : 9,//查询字符串
	        'Fragment' : 10,   //锚点
	        'Filename' : -1,//文件名,不含后缀
	        'Queryobject' : -1, //查询字串对象
	        'Hashobject' : -1 //hash对象
	    };

	    this._values = {};
	    this._regex = null;
	    this.version = 0.1;
	    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
	    for(var f in this._fields)
	    {
	        this['get' + f] = this._makeGetter(f);
	    }

	    if (typeof url != 'undefined')
	    {
	        this._parse(url);
	    }
	};
	URLParser.prototype.setURL = function(url) {
	    this._parse(url);
	};

	URLParser.prototype._initValues = function() {
	    for(var f in this._fields)
	    {
	        this._values[f] = '';
	    }
	};

	URLParser.prototype._parse = function(url) {
	    this._initValues();
	    var r = this._regex.exec(url);

	    if (!r) throw "DPURLParser::_parse -> Invalid URL";

	    for(var f in this._fields) if (typeof r[this._fields[f]] != 'undefined')
	    {
	        this._values[f] = r[this._fields[f]];
	    }
	};
	URLParser.prototype._makeGetter = function(field) {
	    return function() {
	    	if(field=='Filename'){
	    		var path = this._values['URL'];
	    		return path.substring((path.lastIndexOf('/')||-1)+1,path.indexOf('.')||path.indexOf('?')||path.indexOf('#')||path.length);
	    	}else if(field=='Queryobject'){
	    		var query = this._values['Querystring']||'';
	            var seg = query.split('&');
	            var obj = {};
	            for(var i=0;i<seg.length;i++){
	                var s = seg[i].split('=');
	                obj[s[0]] = s[1];
	            }
	            return obj;
	    	}else if(field=='Hashobject'){
	    		return {
		        	url : this.getURL(),
		            hash : '#'+(this.getFragment()||this.getFilename()),
		            tag : '#'+(this.getFragment()||this.getFilename()),
		            query : this.getQuerystring(),
		            param : this.getQueryobject()
		       };
	    	}
	    	
	        return this._values[field];
	    };
	};
	
	//url解析类
	util.parseURL = function(url){
		url = util.script(url||'');
		if(url.indexOf('#')==0){
			url = url.replace('#','')+(A.options.viewSuffix?A.options.viewSuffix:'');
		}	

		return new URLParser(url);
   	};
   	
   	util.isCrossDomain = function(url){
    	if(!url||url.indexOf(':')<0) return false;
    	var urlOpts = util.parseURL(url);
    	if(!urlOpts.getProtocol()) return false;
    	return !((location.protocol.replace(':','')+location.host)==(urlOpts.getProtocol()+urlOpts.getHost()+':'+urlOpts.getPort()));
    };

    util.checkBoolean = function(){
    	var result = false;
    	for(var i=0;i<arguments.length;i++){
    		if(typeof arguments[i]=='boolean'){
    			return arguments[i];
    		}
    	}
    	return result;
    };
	
	var _isCrossDomain = function(url){
    	if(!url||url.indexOf(':')<0) return false;

    	var urlOpts = A.util.parseURL(url);

    	if(!urlOpts.getProtocol()) return false;

    	return !((location.protocol.replace(':','')+location.host)==(urlOpts.getProtocol()+urlOpts.getHost()+':'+urlOpts.getPort()));
    };
    

    /*
     * $.ajax函数封装，判断是否有跨域，并且设置跨域处理函数
     * @param ajax json对象，进行简单统一处理，如果需要完整功能请使用$.ajax
     * */
    util.ajax = function(opts){
    	if(!opts||!opts.url) return;
    	opts.url = util.script(opts.url);
    	var _isBlock = util.checkBoolean(opts.isBlock,A.options.showPageLoading);

    	opts.dataType = (opts.dataType||'text').toLowerCase();
    	var ajaxData = {
        	url : opts.url,
            timeout : 20000,
            type : opts.type||'get',
            dataType : opts.dataType,
            success : function(html){
            	if(_isBlock) A.hideMask();
                opts.success && opts.success(opts.dataType=='text'?util.script(html):html);
            },
            error : function(html){
            	if(_isBlock) A.hideMask();
               	opts.error && opts.error(null);
            },
            reqCharset : opts.reqCharset||'utf-8'
        };
        if(opts.data) ajaxData.data = opts.data;
        if(opts.headers) ajaxData.headers = opts.headers;
    	var isCross = _isCrossDomain(opts.url);
    	var handler = A.ajax;		
    	if(isCross){
    		ajaxData.dataType = A.options.crossDomainHandler?ajaxData.dataType:'jsonp';
    		handler = A.options.crossDomainHandler||handler;
    	}
    	if(ajaxData.dataType.toLowerCase()=='jsonp'){
    		ajaxData.jsonp = opts.jsonp||'agilecallback';
    	}
    	if(_isBlock) A.showMask();
    	handler(ajaxData);
    };
    
    /*
     * $.ajax函数封装，不允许跨域
     * @param url地址，必选
     * @param callback回调函数，可选
     * 
     * */
    util.getHTML = function(url, callback){
    	A.ajax({
    		url : url,
    		type : 'get',
    		dataType : 'text',
    		success : function(html){
    			callback&&callback(A.util.script(html||''));
    		},
    		error : callback
    	});
    };
    
    util.readyAlarm = function($inner,targetName,eventName){
		var _return = {};		
		for(var k in $inner){
			if(typeof $inner[k]!='function'){
				_return[k] = $inner[k];
				continue;
			}
			_return[k] = (function(k){
				return function(){
							try{
								return $inner[k].apply(this, arguments);
							}catch(e){
								console.log('提示', '请在'+(eventName||A.options.readyEvent)+'之后调用'+targetName+'.'+k+'桥接函数');
							}						
						};
			})(k);
		}
		return _return;
	};
    A.register('util', util);

})(A.$);

(function($){	
	var _index_key_ = {};	
	
	var scroll = function(selector, opts){		
		var $el = $(selector);
		var eId = $el.attr('id');
		if($el.length==0||!eId){
			return null;
		}else if(_index_key_[eId]){
			return _index_key_[eId];
		}
		
		var $scroll;
		
		var costomOpts = {
			scrollTop : 'scrollTop',
			scrollBottom : 'scrollBottom'
		};

		var options = {
			mouseWheel: true,
			scrollbars : 'custom',
			fadeScrollbars : true,
			preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL|A)$/ }
		};
		$.extend(options, $el.data('scroll-options')||{});
		$.extend(options, opts||{});
		IScroll.utils.isBadAndroid = false;//处理页面抖动
		$scroll = new IScroll(selector, options);
		$scroll.on('scrollEnd' , function(){
			if(this.y==0){
            	this._execEvent(costomOpts.scrollTop);//自定义事件滑动到顶部
            }else if(this.y==this.maxScrollY){
            	this._execEvent(costomOpts.scrollBottom);//自定义事件滑动到底部
            }
			A.Component.lazyload($el);//初始化懒人加载
		});		
		_index_key_[eId] = $scroll;
		$scroll.on('destroy', function(){ delete _index_key_[eId]; });
		$el.trigger('scrollInit');//自定义scroll初始化事件
		return _index_key_[eId];
	};
    A.register('Scroll', scroll);
})(A.$);

(function($){	
	var _index_key_ = {};	
	/*
     * refresh上拉下拉刷新
     * @param selector，scroll容器的id选择器
     * @param 选项，目前仅支持onPullDown事件和onPullUp事件，{onPullDown:function(){},onPullUp:function(){}}
     * 
     * */
    function refresh(selector, opts) {
    	var $el = $(selector);
    	var eId = $el.attr('id'); 	
    	if(_index_key_[eId]) return _index_key_[eId];
    	
		var $scroller = $el.children().first();
		var myScroll; 
    	var $pullDownEl, $pullDownL;  
    	var $pullUpEl, $pullUpL; 
    	var pullDownHeight, pullUpHeight; 
    	var refreshStep = -1;//加载状态-1默认，0显示提示下拉信息，1显示释放刷新信息，2执行加载数据，只有当为-1时才能再次加载
    	
    	var pullDownOpts = {
    		id : 'agile-pulldown',
    		iconStyle : 'agile-pulldown-icon',
    		labelStyle : 'agile-pulldown-label',
    		normalLabel : '下拉刷新',
    		releaseLabel : '释放加载',
    		refreshLabel : '加载中，请稍后',
    		normalStyle : '',
    		releaseStyle : 'release',
    		refreshStyle : 'refresh',
    		callback : null,
    		callbackEvent : 'pulldown'
    	};
    	var pullUpOpts = {
    		id : 'agile-pullup',
    		iconStyle : 'agile-pullup-icon',
    		labelStyle : 'agile-pullup-label',
    		normalLabel : '上拉刷新',
    		releaseLabel : '释放加载',
    		refreshLabel : '加载中，请稍后',
    		normalStyle : '',
    		releaseStyle : 'release',
    		refreshStyle : 'refresh',
    		callback : null,
    		callbackEvent : 'pullup'
    	};
    	
    	if(opts.onPullDown){
    		$pullDownEl = $('<div id="'+pullDownOpts.id+'"><div class="'+pullDownOpts.iconStyle+'"></div><div class="'+pullDownOpts.labelStyle+'">'+pullDownOpts.normalLabel+'</div></div>').prependTo($scroller);
	        $pullDownL = $pullDownEl.find('.'+pullDownOpts.labelStyle);   
	        pullDownHeight = $pullDownEl.height();
	        $pullDownEl.attr('class','').hide();
	        pullDownOpts.callback = opts.onPullDown;
    	}
    	
    	if(opts.onPullUp){
    		$pullUpEl = $('<div id="'+pullUpOpts.id+'"><div class="'+pullUpOpts.iconStyle+'"></div><div class="'+pullUpOpts.labelStyle+'">'+pullUpOpts.normalLabel+'</div></div>').appendTo($scroller);
	        $pullUpL = $pullUpEl.find('.'+pullUpOpts.labelStyle);   
	        pullUpHeight = $pullUpEl.height();
	        $pullUpEl.attr('class','').hide();
	        pullUpOpts.callback = opts.onPullUp;
    	}

        myScroll = A.Scroll('#'+eId, {  
			probeType: 2,//probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。  
            bounce:true,//边界反弹  
            interactiveScrollbars:true,//滚动条可以拖动  
            shrinkScrollbars:'scale',// 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.  
            click: true ,// 允许点击事件  
            keyBindings:true,//允许使用按键控制  
            momentum:true// 允许有惯性滑动  
        });

        if(!myScroll) return null;
        //滚动时  
        myScroll.on('scroll', function(){
        	if(refreshStep==2){
        		//do nothing
        	}else if($pullDownEl && this.y > 0 && this.y < pullDownHeight){
           		$pullDownEl.show().removeClass(pullDownOpts.releaseStyle);
           		$pullDownL.html(pullDownOpts.normalLabel);  
           		refreshStep = 0;
           	}else if($pullDownEl && this.y >= pullDownHeight){
           		$pullDownEl.addClass(pullDownOpts.releaseStyle);
           		$pullDownL.html(pullDownOpts.releaseLabel);
           		refreshStep = 1;
           	}else if($pullUpEl && this.y < 0 && -this.y > -(this.maxScrollY - pullUpHeight)){
	            $pullUpEl.addClass(pullUpOpts.releaseStyle);
           		$pullUpL.html(pullUpOpts.releaseLabel); 
           		refreshStep = 1;
           	}else if($pullUpEl && this.y < 0 && -this.y > -this.maxScrollY && -this.y <= -(this.maxScrollY - pullUpHeight) ){
           		$pullUpEl.show().removeClass(pullUpOpts.releaseStyle);  
	            $pullUpL.html(pullUpOpts.normalLabel);  
	           	refreshStep = 0;
           	}
            
            if(this.y >0 && refreshStep > -1 && refreshStep < 2){
            	$pullDownEl.css('margin-top', - Math.max(pullDownHeight - this.y, 0));
            }
        }); 
        //滚动完毕  
        myScroll.on('scrollEnd', function(){
            if(refreshStep == 1){
	            if ($pullUpEl && $pullUpEl.hasClass(pullUpOpts.releaseStyle)) {  
	                $pullUpEl.removeClass(pullUpOpts.releaseStyle).addClass(pullUpOpts.refreshStyle);  
	                $pullUpL.html(pullUpOpts.refreshLabel);  
	                refreshStep = 2;  
	                pullUpOpts.callback.call(this);
	                this._execEvent(pullUpOpts.callbackEvent);
	            }else if($pullDownEl && $pullDownEl.hasClass(pullDownOpts.releaseStyle)){  	            	
	                $pullDownEl.removeClass(pullDownOpts.releaseStyle).addClass(pullDownOpts.refreshStyle);  
	                $pullDownL.html(pullDownOpts.refreshLabel);  
	                refreshStep = 2;  
	                pullDownOpts.callback.call(this);
	                this._execEvent(pullDownOpts.callbackEvent);
	            }
	            window.setTimeout(function(){
	            	if(refreshStep==2) myScroll.refresh();
	            },5000);
            }else{
            	myScroll.refresh();
            }
        });  
        
        myScroll.on('refresh', function(){

        	if(refreshStep!=-1){
	        	refreshStep = -1;	        	 
	            if($pullDownEl){
	            	$pullDownEl.attr('class','').hide();  
	            	$pullDownEl.css('margin-top', 0);
	            }	            
	            if($pullUpEl){
	            	$pullUpEl.attr('class','').hide();
	            }
        	}
        	
        });

        _index_key_[eId] = myScroll;
        
        myScroll.on('destroy', function(){ delete _index_key_[eId]; });
        
        $el.trigger('refreshInit');
        
        return _index_key_[eId];
    }
    
    A.register('Refresh', refresh);
    
})(A.$);

(function($){
	
	var _index_key_ = {};
	/*
     * slider滑动容器
     * @param selector，slider容器的id选择器
     * @param 选项，auto：是否自动播放|自动播放的毫秒数；dots：指示点显示的位置，center|right|left|hide；change：每次切换slider后的事件，{auto:false,dots:'right',change:function(){}}
     * */
	var slider = function(selector, opts){
		var $el = $(selector);
		var eId = $el.attr('id');
		
		if(_index_key_[eId]) return _index_key_[eId];
		
		var sliderOpts = {
			auto : false,
			change : function(){
				
			},
			dots : ''
		};
		$.extend(sliderOpts, opts);
		
		var $scroller,$slide,outWidth,slideNum,$dots;

		var init = function(){
			if(!$el.hasClass('active')) $el.addClass('active');
			$scroller = $el.children('.scroller');
			$slide = $scroller.children('.slide');
			outWidth = $el.parent().width();
			slideNum = $slide.length;
			$scroller.width(outWidth*slideNum);
			$slide.width(outWidth);
			$el.height()?$scroller.height($el.height()):$el.height($scroller.height());
		};
		
		var createDots = function(){			
			$el.children('.dots').remove();			
			var arr = [];
			arr.push('<div class="dots">');
			for(var i=0;i<slideNum;i++){
				arr.push('<div class="dotty"></div>');
			}
			arr.push('</div>');
			$dots = $(arr.join('')).appendTo($el).addClass(sliderOpts.dots).find('.dotty');
		};
		
		init();//第一步初始化
		createDots();//第二步创建dots

		var options = {
			scrollbars : false,
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			keyBindings: true,
			bounceEasing : 'circular'
		};		
		var myScroll = A.Scroll('#'+eId, options);		
		var index = 0,outerSlider;
		myScroll.on('beforeScrollStart', function(){
			var $outerSlider = $el.parent().closest('[data-role="slider"]');
			if($outerSlider.length==0) return;
			outerSlider = A.Slider($outerSlider[0]);
			outerSlider._execEvent('__setdiabled');
		});
		myScroll.on('__setdiabled', function(){
			this.enabled = false;
		});
		myScroll.on('__setenabled', function(){
			this.enabled = true;
		});
		myScroll.on('scrollEnd', function(){
			if(outerSlider) outerSlider._execEvent('__setenabled');
			index = this.currentPage.pageX;
			var curSlide = $($slide.get(index));
			var curDots = $($dots.get(index));
			
			if(!curSlide.hasClass('active')){
				sliderOpts.change&&sliderOpts.change.call(this, index);
				curSlide.addClass('active').trigger('slidershow').siblings('.active').removeClass('active').trigger('sliderhide');
				curDots.addClass('active').siblings('.active').removeClass('active');
			}
		});		
		myScroll.on('refresh', function(){
			init();
			createDots();
		});
		myScroll.index = function(){
			if(arguments.length==0) return index;
			myScroll.goToPage(arguments[0], 0, options.snapSpeed);
			myScroll._execEvent('scrollEnd');
		};
		myScroll.goToPage(index, 0, options.snapSpeed);

		if(sliderOpts.auto){
			window.setInterval(function(){
				index = index==slideNum?0:index+1;
				myScroll.goToPage(index, 0, options.snapSpeed);
			}, typeof sliderOpts.auto=='boolean'?5000:sliderOpts.auto);
		}
		
		_index_key_[eId] = myScroll;
		
		myScroll.on('destroy', function(){ delete _index_key_[eId]; });
		
		return _index_key_[eId];
	};
	
	A.register('Slider', slider);
})(A.$);

//侧边栏
(function($){
	var $asideContainer=$('#aside_container'), $sectionContainer=$('#section_container'), $sectionMask=$('#section_container_mask');
	
	var Aside = function(){	
		if($asideContainer.length==0) $asideContainer = $('<div id="aside_container"></div>').appendTo('body');
        if($sectionContainer.length==0) $sectionContainer = $('<div id="section_container"></div>').appendTo('body');
        if($sectionMask.length==0) $sectionMask = $('<div id="section_container_mask"></div>').appendTo('#section_container');
  		var _this = this;
  		$sectionMask.on(A.options.clickEvent, function(){
        	_this.hide();
        	return false;
        });
		
		$sectionMask.on('swipeleft', function(e){
			var $activeAside = $('#aside_container aside.active');
			if($activeAside.data('position') == 'left'){
				_this.hide();
			}
		});
		
		$sectionMask.on('swiperight', function(e){
			var $activeAside = $('#aside_container aside.active');
			if($activeAside.data('position') == 'right'){
				_this.hide();
			}
		});

        $(document).on('swiperight','section.active[data-aside-left]',function(e){
        	if($(e.target).closest('[data-role="slider"]').length==0){
        		_this.show($(this).data('aside-left'));
        	}
        });
        
        $(document).on('swipeleft','section.active[data-aside-right]',function(e){
        	if($(e.target).closest('[data-role="slider"]').length==0){
        		_this.show($(this).data('aside-right'));
        	}
        });
	};
	 /**
     * 打开侧边菜单
     * @param selector css选择器或element实例
     * @param callback 动画完毕回调函数
     */
	Aside.prototype.show = function(selector, callback){
		var $aside = $(selector).addClass('active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            showClose = $aside.data('show-close'),
            width = $aside.width(),
            translateX = (position=='left'?'':'-')+width+'px';
        var cssName = {
        	aside : {},
        	section : {}
        };
        cssName.aside[position] = width+'px';
        cssName.section['left'] = translateX;
        var _finish = function(){
        	callback&&callback();$aside.trigger('asideshow');
        };
        if(transition == 'overlay'){
            A.anim.run($aside, cssName.aside, _finish);
        }else if(transition == 'reveal'){
            A.anim.run($sectionContainer, cssName.section, _finish);
        }else{//默认为push
            A.anim.run($aside, cssName.aside);
            A.anim.run($sectionContainer, cssName.section, _finish);
        }

        $('#section_container_mask').show();
        A.pop.hasAside = true;
	};
	
	/**
     * 关闭侧边菜单
     * @param callback 动画完毕回调函数
     */
    Aside.prototype.hide = function(callback){
        var $aside = $('#aside_container aside.active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            translateX = position == 'left'?'-100%':'100%';

        var _finish = function(){
            $aside.removeClass('active');
            A.pop.hasAside = false;
            callback&&callback.call(this);$aside.trigger('asidehide');
        };
        
        var cssName = {
        	aside : {},
        	section : {}
        };
        cssName.aside[position] = 0;
        cssName.section['left'] = 0;
        
        if(transition == 'overlay'){
            A.anim.run($aside, cssName.aside, _finish);
        }else if(transition == 'reveal'){
            A.anim.run($sectionContainer, cssName.section, _finish);
        }else{//默认为push
            A.anim.run($aside, cssName.aside);
            A.anim.run($sectionContainer, cssName.section, _finish);
        }
        $('#section_container_mask').hide();
    };
    A.register('Aside', new Aside());
})(A.$);

/**
 * 弹出框组件
 */
(function($){
	var _popMap= {index:0};
    var transitionMap = {
    	default : ['fadeIn','fadeOut'],
        top : ['slideDownIn','slideUpOut'],
        bottom : ['slideUpIn','slideDownOut'],
        center : ['bounceIn','bounceOut'],
        left : ['slideRightIn','slideLeftOut'],
        right : ['slideLeftIn','slideRightOut']           
	};
 
    var Popup = function(opts){
    	var _index = _popMap.index++;  
    	var options = {
    		id : '__popup__'+_index,//popup对象的id
    		html : '',//位于pop中的内容
    		pos : 'default',//pop显示的位置和样式,default|top|bottom|center|left|right|custom
    		css : {},//自定义的样式
    		isBlock : false//是否禁止关闭，false为不禁止，true为禁止
    	};
    	$.extend(options,opts);
    	if(_popMap[options.id]) return _popMap[options.id];
    	var _this = _popMap[options.id] = this;
    	$('<div data-refer="'+options.id+'" class="popup-mask"></div><div id="'+options.id+'" class="agile-popup"></div>').appendTo('body');
    	var $popup = $('#'+options.id), $mask = $('[data-refer="'+options.id+'"]');
    	$popup.data('block', options.isBlock);
    	$popup.css(options.css);
    	$popup.addClass(options.pos);
		$popup.html(options.html);
		$mask.on(A.options.clickEvent, function(){
        	if(options.isBlock) return false;
        	_this.close();
        	return false;
        });
        $popup.on(A.options.clickEvent,'[data-toggle="popup"]',function(){
        	_this.close();
			return false;
		});
		this.options = options;
		this.popup = $popup;
		this.mask = $mask;
		this._event = {};
    };    
	Popup.prototype.on = function(eType, callback){
    	if(this._event[eType]){
    		this._event[eType].push(callback);
    	}else{
    		this._event[eType] = [callback];
    	}
    	return this;
    };
    Popup.prototype.trigger = function(eType, callback){
    	var arr = this._event[eType];
    	for(var i=0;i<(arr||[]).length;i++){
    		arr[i].apply(this);
    	};
    	callback&&callback.apply(this);
    	return this;
    };
    
    Popup.prototype.open = function(callback){
    	var $popup=this.popup, $mask=this.mask, options=this.options;
    	if($mask.hasClass('active')) return _popMap[options.id];
    	$('body').children('.popup-mask.active').removeClass('active');
    	$mask.addClass('active').show();
        $popup.show();
        var popHeight = $popup.height();
        if(options.pos == 'center') $popup.css('margin-top','-'+popHeight/2+'px');
        var transition = transitionMap[options.pos];
        if(transition) A.anim.run($popup,transition[0]);
		this.trigger('popupopen');callback&&callback.call(this);
		A.pop.hasPop = $popup;
		return this;
    };
    
    var _finish = function(){   	
    	var $popup=this.popup, $mask=this.mask, callback=this.callback;
    	$popup.remove();$mask.remove();this.trigger('popupclose');setTimeout(function(){ callback&&callback(); }, 200);
    	$last = $('body').children('.popup-mask').last().addClass('active');
    	A.pop.hasPop = $last.length==0?false:$('body').children('.agile-popup').last();
    };
    
    Popup.prototype.close = function(callback){
    	var _this=this,$popup=this.popup, $mask=this.mask, options=this.options;
        var transition = transitionMap[options.pos];
        if(transition){
            A.anim.run($popup,transition[1],function(){ _finish.call(_this); });
        }else{
            _finish.call(_this);
        }
        delete _popMap[options.id];
        //return this;
    };
    
    A.register('Popup' , Popup);
    
    var _ext = {};
    
    _ext.popup = function(opts){
    	return new Popup(opts).open();
    };
    
    _ext.closePopup = function(callback){
    	var _id = A.pop.hasPop.attr('id');
    	if(_popMap[_id]) _popMap[_id].close(callback);
    };
    
    /**
     * alert组件
     * @param title 标题
     * @param content 内容
     * @param callback 点击确定按钮后的回调
     */
    _ext.alert = function(title,content,callback){
    	if(!content){
    		content = title;
    		title = '提示';
    	}else if(typeof content=='function'){
    		callback = content;
    		content = title;
    		title = '提示';
    	}
        return new Popup({
            html : A.util.provider('<div class="popup-title">${title}</div><div class="popup-content">${content}</div><div class="popup-handler"><a data-toggle="popup" class="popup-handler-ok">${ok}</a></div>', {title : title, content:content, ok:'确定'}),
            pos : 'center',
            isBlock : true
        }).on('popupclose', function(){
        	callback&&callback();
        }).open();
    };
    
    /**
     * confirm 组件
     * @param title 标题
     * @param content 内容
     * @param okCallback 确定按钮handler
     * @param cancelCallback 取消按钮handler
     */
    _ext.confirm = function(title,content,okCallback,cancelCallback){
    	if(typeof content=='function'){
    		cancelCallback = okCallback;
    		okCallback = content;
    		content = title;
    		title = '提示';
    	}
        return new Popup({
            html : A.util.provider('<div class="popup-title">${title}</div><div class="popup-content">${content}</div><div class="popup-handler"><a data-toggle="popup" class="popup-handler-cancel">${cancel}</a><a data-toggle="popup" class="popup-handler-ok">${ok}</a></div>', {title : title, content:content, cancel:'取消', ok:'确定'}),
            pos : 'center',
            isBlock : true
        }).open(function(){    	
        	var $popup = $(this.popup), _this=this;
        	$popup.find('.popup-handler-ok').on(A.options.clickEvent, function(){
	            okCallback&&okCallback.call(this);
	        });
	        $popup.find('.popup-handler-cancel').on(A.options.clickEvent, function(){
	            cancelCallback&&cancelCallback.call(this);
	        });
        });        
    };

    /**
     * loading组件
     * @param text 文本，默认为“加载中...”
     * @param callback 函数，当loading被人为关闭的时候的触发事件
     */
    _ext.showMask = function(text,callback){
    	if(typeof text=='function'){
    		callback = text;
    		text = '加载中';
    	}
        return new Popup({
        	id : 'popup_loading',
            html : A.util.provider('<i class="popup-spinner"></i><p>${title}</p>', {title : text||'加载中'}),
            pos : 'loading',
            isBlock : true
        }).on('popupclose', function(){
        	callback&&callback();
        }).open();
    };
    
    _ext.hideMask = function(callback){
    	if(_popMap['popup_loading']) _popMap['popup_loading'].close();
    };

    /**
     * actionsheet组件
     * @param buttons 按钮集合
     * [{css:'red',text:'btn',handler:function(){}},{css:'red',text:'btn',handler:function(){}}]
     */
    _ext.actionsheet = function(buttons,showCancel){
        var markMap = ['<div class="actionsheet"><div class="actionsheet-group">'];
        var defaultCalssName = "popup-actionsheet-normal";
        var defaultCancelCalssName = "popup-actionsheet-cancel";
        var showCancel = showCancel==false?false:(showCancel||true);
        $.each(buttons,function(i,n){
            markMap.push('<button data-toggle="popup" class="'+(n.css||defaultCalssName)+'">'+ n.text +'</button>');
        });
        markMap.push('</div>');
        if(showCancel) markMap.push('<button data-toggle="popup" class="'+(typeof showCancel=='string'?showCancel:defaultCancelCalssName)+'">取消</button>');
        markMap.push('</div>');
        return new Popup({
            html : markMap.join(''),
            pos : 'bottom',
            css : {'background':'transparent'},
       	}).open(function(){           	
 			$(this.popup).find('button').each(function(i,button){              	
            	$(button).on(A.options.clickEvent,function(){
                	if(buttons[i] && buttons[i].handler){
                    	buttons[i].handler.call(button);
                    }
                });
            });
    	});
    };
    
    /**
     * 带箭头的弹出框
     * @param html 弹出的内容可以是html文本也可以输button数组
     * @param el 弹出位置相对的元素对象
     */
    _ext.popover = function(html,el){
    	var markMap = [];
    	markMap.push('<div class="popover-angle"></div>');
    	if(typeof html=='object'){
    		markMap.push('<ul class="popover-items">');
    		for(var i=0;i<html.length;i++){
    			markMap.push('<li data-toggle="popup">'+html[i].text+'</li>');
    		}
    		markMap.push('</ul>');
    	}else{
    		markMap.push(html);
    	}

        return new Popup({
            html : markMap.join('')
        }).on('popupopen', function(){
        	var $del = $(document);
			var dHeight = $del.height();
			var dWidth = $del.width();
			
			var $rel = $(el);
			var rHeight = $rel.height();
			var rWidth = $rel.width();
			var rTop = $rel.offset().top;
			var rLeft = $rel.offset().left;
			var rCenter = rLeft+(rWidth/2);
			
			var $el = $(this.popup).addClass('popover');
			var $angle = $($el.find('.popover-angle').get(0));
			var gapH = $angle.height()/2;
			var gapW = Math.ceil(($angle.width()-2)*Math.sqrt(2));			
			var height = $el.height();
			var width = $el.width();
			
			var posY = dHeight-height-rHeight<0&&rTop>height?'up':'down';			
			var elCss = {}, anCss = {};   		
    		if(posY=='up'){
    			elCss.top = rTop - (height + gapH);
    			anCss.bottom = -gapH+4;
    		}else{
    			elCss.top = rTop + (rHeight + gapH);
    			anCss.top = -gapH+4;
    		}
    		elCss.left = rCenter-width/2;
			if(elCss.left+width>=dWidth-4){
				elCss.left = dWidth - width - 4;
			}else if(elCss.left<4){
				elCss.left = 4;
			}			
			anCss.left = rCenter - elCss.left - gapW/2;
    		$el.css(elCss);
    		$angle.css(anCss);
            $el.find('.popover-items li').each(function(i,button){             	
                $(button).on(A.options.clickEvent,function(){
                    if(html[i] && html[i].handler){
                        html[i].handler.call(button);
                    }
                });
            });
        }).open();
    };
	
	for(var k in _ext){
		A.register(k, _ext[k]);
	}
    
})(A.$);

/*
 * Toast提示框
 * */
(function($){
    var _toastMap= {index:0};
    var Toast = function(opts){
    	var _index = _toastMap.index++;
    	var options = {
    		id : '__toast__'+_index,//popup对象的id
    		isBlock : false,
    		duration : 2000,
    		css : '',
    		text : ''
    	};
    	$.extend(options, opts);
    	if(_toastMap[options.id]) return this;
    	var _this = _toastMap[options.id] = this;
    	var $toast = this.toast = $('<div id="'+options.id+'" class="agile-toast"><a>'+options.text+'</a></div>').appendTo('body');
    	$toast.addClass('class', options.css);
    	this.options = options;
    };
    Toast.prototype.show = function(){
    	var $toast = this.toast, options = this.options;
        $toast.show();
        var _this = this;
        A.anim.run($toast,'scaleIn', function(){
        	if(options.isBlock==false) setTimeout(function(){ _this.hide();}, options.duration);
        });
        return this;
    };
    Toast.prototype.hide = function(){
    	var $toast = this.toast, options = this.options;
    	A.anim.run($toast,'scaleOut',function(){
        	$toast.remove();
        	delete _toastMap[options.id];
        });
        return this;
    };
    
    A.register('Toast', Toast);

    var _ext = {};
    /**
     *  显示消息
     * @param text
     * @param duration 持续时间
     */
    _ext.showToast = function(text,duration){
        new Toast({
        	text : text,
        	duration : duration
        }).show();
    };   
    _ext.alarmToast = function(text,duration){
        new Toast({
        	text : text,
        	duration : duration,
        	css : 'alarm'
        }).show();
    };
    
    for(var k in _ext){
    	A.register(k, _ext[k]);
    }
    
})(A.$);

/*
 * 事件处理
 * */
(function($){
	var event = {},_events = {};
	 /**
     * 处理浏览器的后退事件
     * @private
     */
	_events.back = function(){
		$(window).on('popstate', function(e){  
			A.Controller.back(false);
			return;
    	});
	};
	
	/**
     * 处理data-cache="false"的容器缓存
     * @private
     */
	_events.removeCache = function(){
		var controller = A.Controller.get();
		var eName = [];
		for(var k in controller){
			eName.push(k+'hide');
		}
		$(document).on(eName.join(' '), '[data-cache="false"]', function(){
			var $el = $(this);
			if($el.data('scroll')) A.Scroll($el).destroy();
			$el.find('[data-scroll],[data-role="slider"]').each(function(){ A.Scroll(this).destroy(); });
			$el.remove();
		});
	};
	
	/**
     * 处理返回事件
     * @private
     */
	_events.backEvent = function(){
		$(document).on(A.options.backEvent, function(event, func){
			if(A.pop.hasPop){
				if(A.pop.hasPop.data('block')==false){
					A.closePopup();
				}
			}else if($('.modal.active').length>0){
				A.Controller.modal('#'+$('.modal.active').first().attr('id'));
			}else if(A.pop.hasAside){
				A.Controller.aside();
			}else if(A.Controller.get('section').history.length<2){	
	    		$(document).trigger('beforeunload');//触发关闭页面事件
	    	}else{
	    		window.history.go(-1);
	    	}
		});
	};
	
	_events.zepto = function(){	
		if($==window.Zepto){
			$(document).on('click', 'a[data-toggle]', function(){return false; });
			$(document).on('swipeLeft','[data-aside-right],[data-role="calendar"],.swipe_block', function(){$(this).trigger('swipeleft');});
			$(document).on('swipeRight','[data-aside-left],[data-role="calendar"],.swipe_block',function(){$(this).trigger('swiperight');});
		}	
	};
	/*
	 * 初始化agilestart事件
	 * */
	var _initSection = function(){
		//初始化section
		var sectionSelecor = A.Controller.get()['section']['container']+' [data-role="section"]';
		var $section = $(sectionSelecor+'.active').first();
		if($section.length==0) $section = $(sectionSelecor).first();
		A.Controller.section('#'+$section.attr('id'));
	};
	_events.agileStart = function(){
		var flag = true;
		_initSection();
		$(document).on(A.options.agileReadyEvent, function(){
			_initSection();
		});
		$(document).on(A.options.agileStartEvent, function(){
			if(flag) {
				flag = false;
				return;	
			}
			_initSection();
		});
	};
	
	/**
     * 初始化相关组件
     */
	_events.initComponents = function(){
		$(document).on('sectionshow', 'section', function(){
			//初始化article
			A.Controller.article('#'+$(this).children('[data-role="article"].active').first().attr('id'));		
		});		
		$(document).on('modalshow', '.modal', function(){
			//初始化article
			A.Controller.article('#'+$(this).children('[data-role="article"].active').first().attr('id'));		
		});
		$(document).on('slidershow', '[data-role="page"]', function(){
			var id = $(this).attr('id');
			A.Component.default($('[href="#'+id+'"]'));//初始化slider page
		});
		$(document).on('renderEnd', 'script', function(e,h){
			A.Component.lazyload(h);
		});
		$(document).on('modalhide', 'div.modal', function(e,h){
			_initSection();
		});
	};	
	/**
     * @param {Object} 添加的事件对象 {key:function(){}}
     */
	event.add = function(obj){
		$.extend(_events, obj||{});
	};
	/**
     * 启动event
     */
	event.launch = function(){
		for(var k in _events){
			_events[k]();
		}
	};
	A.register('event', event);
})(A.$);

(function($){
	var Template = function(selecotr){
		this.$el = $(selecotr);
	};
	
	Template.prototype.getTemplate = function(cb){
		var $el = this.$el;
		var source = $el.attr('src');
		var tmpl = $el.html().trim();
		if(tmpl){
			cb&&cb(tmpl);
		}else if(source){
			A.util.getHTML(A.util.script(source), function(html){
				$el.text(html);
				cb&&cb(html);
			});
		}else{
			cb&&cb('');
		}
	};
	
	Template.prototype.render = function(url, cb){
		var data;
		if(typeof url=='object'){
			data = url;
			url = '';
		}
		if(!data&&!url){
			cb&&cb();
			return;
		}
		var tmplHTML = this.$el.html().trim();
		if(data&&tmplHTML){
			var html = '';
			try{
				html =  template.compile(tmplHTML)(data);
			}catch(e){}
			cb&&cb(html, tmplHTML, data);
			return html;
		}
		
		this.getTemplate(function(tmpl){
			if(url){
				A.util.ajax({
					url : url,
					dataType : 'json',
					success : function(data){
						var render = template.compile(tmpl);
                    	html = render(data);
                    	cb&&cb(html, tmpl, data);
					},
					error : function(){
						cb&&cb();
					}
				});
			}else{
				var render = template.compile(tmpl);
                html = render(data);
                cb&&cb(html, tmpl, data);
			}
		});

	};
	
	var _render = function(type, url, cb){
		var $el = this.$el;	
		this.render(url, function(html, tmpl, data){
			var $referObj = $el;
			var id = $el.attr('id');
			var tag = '#'+$el.attr('id');
			var $oldObj = $el.parent().find('[__inject_dependence__="'+tag+'"]');
			if(type=='replace'){
				$oldObj.remove();
				//$referObj = $el;
			}else if(type=='after'){
				$referObj = $oldObj.length==0?$el:$oldObj.last();
			}else if(type=='before'){
				//$referObj = $el;
			}

			var $html = $(html).attr('__inject_dependence__',tag);
			$referObj.after($html);			
			cb&&cb($html, tmpl, data);
			$el.trigger('renderEnd', [$html]);
		});
	};
	
	Template.prototype.renderReplace = function(url, cb){
		_render.call(this, 'replace', url, cb);
	};
	
	Template.prototype.renderAfter = function(url, cb){
		_render.call(this, 'after', url, cb);
	};
	Template.prototype.renderBefore = function(url, cb){
		_render.call(this, 'before', url, cb);
	};
	
	A.register('template', function(selecotr){
		return new Template(selecotr);
	});
})(A.$);

/*
 * 扩展JSON:A.JSON.stringify和A.JSON.parse，用法你懂
 * */
(function(){
	var JSON = {};
	JSON.parse = function(str){
		try{
			return eval("("+str+")");
		}catch(e){
			return null;
		}
	};
	JSON.stringify = function(o){
		var r = [];
		if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
		if(typeof o =="undefined") return "";
		if(typeof o != "object") return o.toString();
		if(o===null) return null;
		if(o instanceof Array){
			for(var i =0;i<o.length;i++){
		        r.push(this.stringify(o[i]));
		    }
		    r="["+r.join()+"]";
		}else{
			for(var i in o){
			   r.push('"'+i+'":'+this.stringify(o[i]));
		    }
		    r="{"+r.join()+"}";
		}
		return r;
	};
	A.register('JSON', JSON);
})();