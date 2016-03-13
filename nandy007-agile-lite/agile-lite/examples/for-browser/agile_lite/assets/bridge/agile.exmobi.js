(function(){
	A.event.add({
		beforeunload : function(){
			$(document).on('beforeunload', function(){
				A.Controller.close();
			});
		},
		renderEnd : function(){
			$(document).on('renderEnd', 'script', function(e, el){			
				var $el = el;
				A.Component.toggle($el);
				A.Component.formcheck($el);
				A.Component.datetime($el);
				A.Component.scanning($el);
				A.Component.file($el);
			});
		},
		exmobiOnstart : function(){
			$(document).on('onstart', function(){
				$(document).trigger(A.options.agileStartEvent);
			});
		}
	});
	
	A.Controller.add({
		close : {
			selector : '[data-toggle="close"]',
			handler : function(hash){
				try{
					ExMobiWindow;
					$native.close();
				}catch(e){
					history.go(-1);
				}
				
			}
		},
		html : {
			selector : '[data-toggle="html"]',
			handler : function(hash, el){
				try{
					ExMobiWindow;
					var $el = $(el);
					var isBlank = $el.attr('target')=='_self'?false:true;
					var transition = $el.data('transition')||'';
					$native.openWebview(hash, isBlank, transition);
				}catch(e){
					location.href = A.util.parseURL(hash).getURL();
				}
				
			}
		},
		nativepage : {
			selector : '[data-toggle="nativepage"]',
			handler : function(hash, el){
				var $el = $(el);
				var isBlank = $el.attr('target')=='_self'?false:true;
	
				$native.openNativePage(hash, isBlank);
			}
		},
		exit : {
			selector : '[data-toggle="exit"]',
			handler : function(){
				$native.exit('是否退出程序？');
			}
		}
	});
	
	A.Component.add({
		datetime : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);		
				var _work = function($el){			
					var $label = $el.find('label');
					var $input = $el.find('input');
					var placeholder = $label.html();
					$el.on(A.options.clickEvent, function(e){
						$native.openDateTimeSelector({
							mode : $el.data('role'),
							val : $input.val(),
							callback : function(str){
								if(str&&($input.val()!=str)&&$el.data('change')){
									eval($el.data('change'));
								}
								$label.html(str?str:placeholder);
								$input.val(str||'');
							}
						});
						return false;
					});
					$label.html($input.val()||placeholder);
				};
	
				if($el.data('role')=='date'||$el.data('role')=='time'){
					_work($el);
				}else{
					var components = $el.find('[data-role="date"],[data-role="time"]');
					for(var i=0;i<components.length;i++){
						_work($(components[i]));
					}
				}
				
			}
		},
		scanning : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);		
				var _work = function($el){			
					var $label = $el.find('label');
					var $input = $el.find('input');
					var placeholder = $label.html();
					$el.on(A.options.clickEvent, function(e){					
						$native.openDecodeScan(function(str){
							if(str&&($input.val()!=str)&&$el.data('change')){
								eval($el.data('change'));
							}
							$label.html(str?str:placeholder);
							$input.val(str||'');
						});
						return false;
					});
					$label.html($input.val()||placeholder);
				};
	
				if($el.data('role')=='barcode'||$el.data('role')=='qrcode'){
					_work($el);
				}else{
					var components = $el.find('[data-role="barcode"],[data-role="qrcode"]');
					for(var i=0;i<components.length;i++){
						_work($(components[i]));
					}
				}
			}
		},
		file : {
			selector : '[data-role="article"].active',
			event : 'articleload',
			handler : function(el, roleType){
				var $el = $(el);		
				var _work = function($el){			
					var $label = $el.find('label');
					var $input = $el.find('input');
					var placeholder = $label.html();
					$el.on(A.options.clickEvent, function(e){					
						$native.openFileGroupSelector(function(str){
							str = str?str.join(';'):'';
							if(str&&($input.val()!=str)&&$el.data('change')){
								eval($el.data('change'));
							}
							$label.html(str?str:placeholder);
							$input.val(str||'');
						});
						return false;
					});
					$label.html($input.val()||placeholder);
				};
	
				if($el.data('role')=='file'){
					_work($el);
				}else{
					var components = $el.find('[data-role="file"]');
					for(var i=0;i<components.length;i++){
						_work($(components[i]));
					}
				}
			}
		}
	});
	
})();



