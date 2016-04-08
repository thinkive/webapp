//aside swiper
$('.aside-menu').swipeLeft(function() {
	$('.aside-menu').removeClass("show-aside").addClass("hide-aside")
})
$('.container').swipeRight(function() {
		$('.aside-menu').removeClass("hide-aside").addClass("show-aside");
		$(".aside-menu .none").show(800);
	})
	//aside tap
$(".fa-bars").tap(function() {
	$('.aside-menu').removeClass("hide-aside").addClass("show-aside");
	$(".aside-menu .none").show(800);
})
$('.aside-menu .none').tap(function() {
	$('.aside-menu').removeClass("show-aside").addClass("hide-aside")
});
//商品点击展开
$(".aside-menu .item").tap(function() {
		if ($(this).parent().hasClass("item-active")) {
			$(this).parent().removeClass("item-active");
		} else {
			$(this).parent().addClass("item-active");
		}
		$(this).parent().find(".item-body").toggle(300);

	})
	//头部快捷购物车
$(".fa-shopping-cart").tap(function() {
	if ($(".top-header").hasClass("cart-show")) {
		$(".top-header").removeClass("cart-show")
		$(this).removeClass("fa-remove").addClass("fa-shopping-cart")
	} else {
		$(".top-header").addClass("cart-show")
		$(this).removeClass("fa-shopping-cart").addClass("fa-remove")
	}
	$(".shop-cart").toggle();
})
$(".cart-item").swipeRight(function() {
	$(this).addClass("delet-item")
})
$(".cart-item").swipeLeft(function() {
		$(this).removeClass("delet-item")
	})
//页面跳转
$(".shop-cart input").tap(function(){
	location.href="checkout.html"
})

	//删除(注释弹窗，不适用)
$(".cart-item button").tap(function() {
		//	$(".popupbox").show()
		$(this).parent().hide()
	})
	//$(".popupbox .popup .true-btn").tap(function(){
	//	$(".popupbox").hide();
	//	$(".shop-cart .cart-item").hide()
	//})
	//$(".popupbox .popup .false-btn").tap(function(){
	//	$(".popupbox").hide();
	//})
	//购物车的数字加减
$(".shop-cart .add .fa-chevron-up").tap(function() {
	var add = $(".shop-cart ul li b").text();
	add = parseInt(add) + 1
	$(".shop-cart ul li b").text(add)
})
$(".shop-cart .add .fa-chevron-down").tap(function() {
		var minus = $(".shop-cart ul li b").text();
		minus = parseInt(minus) - 1;
		$(".shop-cart ul li b").text(minus);
		if (minus < 0) {
			$(".shop-cart ul li b").text(0);
		}
	})
	//排序
$(".fa-tag").tap(function() {
		if ($(this).hasClass("tag-white")) {
			$(this).removeClass("tag-white")
		} else {
			$(this).addClass("tag-white")
		}
		$(".shop-sort").toggle();
	})
	//$(".shop-sort span").tap(function(){
	//	$(".shop-sort span").removeClass("sort-active");
	//	$(this).addClass("sort-active");
	//})

//推荐等
//$(".fa-chevron-left").tap(function() {
//		location.href = "index.html"
//	})
	//产品
$(".prodocts .filter-btn span i").tap(function() {
		$(this).parent().hide()
	})
	//分类
$(".assort .assort-head").tap(function() {
		if ($(this).parent().hasClass("show-assort")) {
			$(".assort").removeClass("show-assort");
			$(".assort .assort-head .fa").removeClass("fa-angle-down").addClass("fa-angle-right");
			$(".top-header").css({
				backgroundColor: "#67b0d6"
			});
		} else {
			$(".assort").addClass("show-assort");
			$(".assort .assort-head .fa").removeClass("fa-angle-right").addClass("fa-angle-down");
			$(".top-header").css({
				backgroundColor: "#38474f"
			});
		}

		$(".assort dl").toggle();
	})
	//筛选
$(".top-header .fa-filter").tap(function() {
	$(".filter").css({
		right: 0
	});
	$(".filter-head").css({
		right: 0
	});
})
$(".filter .fa-filter").tap(function() {
	$(".filter-head").css({
		right: "-240px"
	});
	$(".filter").css({
		right: "-240px"
	});
})
$("#quxiao").tap(function() {
	$(".filter-head").css({
		right: "-240px"
	});
	$(".filter").css({
		right: "-240px"
	});
})
//详情
$(".dis-head").tap(function(){
	$(".discription figure").toggle()
})
//支付
$(".order dl .fa-close").tap(function(){
	$(this).parent().parent().hide()
})









