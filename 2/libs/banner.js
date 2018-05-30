;
+function($){
	$.fn.banner = function(banner_sele,options){
		new Banner(banner_sele,options,this);
	}

	function Banner(banner_sele,options,base_ele){
		this.init(banner_sele,options,base_ele);
	}
	Banner.prototype = {
		constructor:Banner,
		init:function(banner_sele,options,base_ele){
			// 当前显示的图片下标
			this.index = 0;
			// 选择要轮播的元素
			this.bannerImg = $(banner_sele);
			// console.log(this.bannerImg);
			// 播放方式
			this.animate = options.animate ? options.animate : "fade";
			// 获取轮播的具体元素
			this.bannerItem = this.bannerImg.children();
			// 元素的个数
			this.bannerNum = this.bannerItem.length;
			// console.log(this.bannerNum);  5个
			// 判断pagination 是否传入,在选择器中判断
			this.pagination = $(options.pagination ? options.pagination.el : "");
			// console.log(this.pagination)
			// this.pagination 分页存在
			if(this.pagination.length !== 0){
				 
				for(var i = 0;i < this.bannerNum;i++){
					// 创建分页元素 span 并添加到页面上
					var span = $("<span></span>");
					// 创建图片元素 将图片放入bannerImg中
					var img = $("<img>"); 
					this.pagination.append(span);
					this.bannerImg.append(img);
					// console.log(this.bannerImg);
					// 判断如果当前显示的图片和要显示的图片下标一致,给分页按钮和图片添加样式
					if(i == this.index){
						span.addClass("sp1");
						img.addClass("banner-img");
					}
					// console.log(img);
				}
				this.paginationItem = this.pagination.children();
				// 鼠标移入移出时分页按钮的运动效果
			
				this.paginationItem.on("mouseover.changeIndex",{"turn":"toIndex"},$.proxy(this.changeIndex,this));
				this.paginationItem.on("mouseover.animation",$.proxy(this.animation,this));	
			}

			//按钮元素获取 => 按钮元素获取有风险所以加以判断;
            if(typeof options.navigation == "object"){
                this.btnPrev = $(options.navigation.prevEl)
                this.btnNext = $(options.navigation.nextEl)
                //on 中间参数 添加一个对象默认为当前事件对象中的data属性;
                this.btnPrev
                .on("click.changeIndex",{turn:"prev"},$.proxy(this.change_index,this))
                .on("click.animation",$.proxy(this.animation,this))
                this.btnNext
                .on("click",{turn:"next"},$.proxy(this.change_index,this))
                .on("click",$.proxy(this.animation,this))
            }
			// 获取pagination元素
			if(typeof options.pagination == "object"){
				this.paginationEl = $(options.pagination.el);
			}
			// console.log(this.bannerImg);
		},
		// 切换图片 
		changeIndex:function(event){
			// console.log(1)
			var turnList = {
				// 上一张
				"prev":function(){
                    this.prev = this.index;
                    if(this.index  == 0){
                        this.index = this.bannerNum - 1;
                    }else{
                        this.index --;
                    }
                }.bind(this),
                // 下一张
                "next":function(){
                    this.prev = this.index;
                    if(this.index == this.bannerNum - 1){
                        this.index = 0;
                    }else{
                        this.index ++;
                    }
                }.bind(this),
                // 让span分页按钮对应的图片显示
				"toIndex":function(){
					// console.log(event.target);
					this.prev = this.index;
					this.index = $(event.target).index();
				}.bind(this)
			}
			if(!(typeof turnList[event.data.turn] == "function")) return 0;
			turnList[event.data.turn]();
			// console.log(this.index);
		},
		animation:function(event){
			if(this.prev == this.index) return ;
			var animationList = {
				// slide动画
				"slide":function(){
					animationList.slideFadeInit();
					this.bannerItem.eq(this.index)
					.addClass("sp1","banner-img")
					.css({display:"none"})
					.slideDown()
					.siblings()
					.removeClass("sp1","banner-img");
				}.bind(this),
				// 淡入淡出
				"fade":function(){
					animationList.slideFadeInit();
					this.bannerItem.eq(this.index)
					.addClass("sp1","banner-img")
					.css({
						display:"none"
					})
					.fadeIn()
					.siblings()
					.removeClass("sp1","banner-img");
				}.bind(this),
				"slideFadeInit":function(){
					this.bannerItem.eq(this.prev)
					.css({
						zIndex:1
					})
					// .end()
					.siblings()
					.css({
						zIndex:""
					})
				}.bind(this)
			}
			animationList[this.animate]();
			this.pagination.children().eq(this.index)
			.addClass("sp1","banner-img")
			.siblings()
			.removeClass("sp1","banner-img");
		}
	}

}(jQuery);
