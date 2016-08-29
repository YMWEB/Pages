'use strict'
$.fn.classChange = function(){
	var defaults = {
		classone:"classone",
		classtwo:"classtwo"
	}

	this.addClass(classone);
	this.removeClass(classtwo);

}



$.fn.tabShowandHide = function(){


	var defaults ={
		className:'selected',
		defaultTab:'tab1'
	};

	return this.each(function(){

		var $this = $(this);

		$this.find('li[name="'+defaults.defaultTab+'"]').addClass(defaults.className);
		$('body').find('#'+defaults.defaultTab).show();
	
		$this.find('li').on('click',function(){
		
		var $that = $(this);
		var showtab = $that.attr('name');

		$that.addClass(defaults.className);
		$('body').find('#'+showtab).show();

		var li_array = $this.find('li[name!="'+showtab+'"]');
		
	$.each(li_array,function(i,item){
			 var $item = $(item);
			if($item.hasClass(defaults.className)){
			$item.removeClass(defaults.className);
		}
		
			var li_id = $(item).attr('name');
		
			$('body').find('#'+li_id).hide();
		
	})

	})
	
	})
}

function getLockInfo(){
	// trigger();
}

$(function(){

		$('.tabs ul').tabShowandHide();
		var actionURL= window.visitor.path + '/p5'
		var imgSrc = "//static.glodon.com/open/market2/css/page/images/p5/";
		var p5mini = new P5Pages.P5Page(actionURL,imgSrc);
		
		// var lockExist =p5mini.lockExist;
		// var accountId=p5mini.accountId;
		// var accountIdCheck = p5mini.accountIdCheck;
		var productPrice = p5mini.selectComponent.productPrice({
			versionid1:$("input[name='typeP5DataPacket']").attr("value"),
			versionid2:$("input[name='typeP5']").attr("value"),
			
			versionid3:$("input[name='typeP5DataPacketGc']").attr("value")
		});

		var selectComponent = p5mini.selectComponent.create({
			versionid1:$("input[name='typeP5DataPacket']").attr("value"),
			versionid2:$("input[name='typeP5']").attr("value"),
			
			versionid3:$("input[name='typeP5DataPacketGc']").attr("value")
		});

			$('.footer-text label').on('click',function(){
		$('.footer-activity').css('z-index','999');
	})

  	$(".close-btn").on('click',function(){
  		$('.footer-activity').css('z-index','-1')
  	})


		var successCallback = function(data,usbkey){

			$(".btn-add").removeAttr('disabled')
			var template = "";
			$('.mini-info').html(' ');

			$('.info-panel').show();

			if(typeof data ==='object'){
				if(data.usbKeysList.length ===0){
					p5mini.lockExist[usbkey] = '0';
					p5mini.renderErr($('.mini-info'),p5mini.errorMSG.mismatch(usbkey));
				}else{

					$.each(data.usbKeysList,function(i,value){
						if($.isEmptyObject(p5mini.accountId)){
									p5mini.accountId[value.accountId]='0';
									
								}else if(accountId[value.accountId]===undefined){
									p5mini.accountIdCheck = false;
								}
						if(p5mini.accountIdCheck === true){
									
							p5mini.lockExist[value.lockNum]='0';	
										
										if(value.prodSubType == '单机版'){
											var picture = imgSrc+'p5locka.png';
										}else{
											var picture = imgSrc+'p5lockb.png';
										}
											
							template = template + p5mini.renderTo(selectComponent,productPrice,{value:value,picture:picture},p5mini);
						
									}
						else{
							p5mini.renderErr($('.mini-info'),p5mini.errorMSG.differentAccount());
						}


					})
					$(template).insertAfter($("#lockForm tr:last"));
				}
			}
			else{
				p5mini.renderErr($('.mini-info'),p5mini.errorMSG.busynetwork());
			}
		}


		var doCallback = function(){

				if($("#lockForm").find('.continue-confirm').length===0){
			  		$('.btn-sub').attr('disabled','true');
			  		$('.btn-sub').css('color','grey');
	  			}else{
	  				$('.btn-sub').removeAttr('disabled');
	  				$('.btn-sub').css('color','#fff');
	  					$('.btn-add').removeClass('btn-clickon');
							$('.btn-add').addClass('btn-search');
	  			}	
						
							$('body').css('cursor','default');
						};

	 var errCallback = function(){
	 		$(".btn-add").removeAttr('disabled');
			p5mini.renderErr($('.mini-info'),p5normal.errorMSG.busynetwork());
		}

	$(".btn-add").on('click',function(){
		
		$(".btn-add").attr('disabled','disabled')
		var usbkeys = $('.input-lock').val();

		var searchKey = p5mini.filterKeys(usbkeys);

		if(typeof searchKey ==='function'){
			p5mini.renderErr($('.mini-info'),searchKey())
			$(".btn-add").removeAttr('disabled')
		 	return;
		}
	$('body').css('cursor','wait');
		p5mini.ajaxCall(searchKey,successCallback,doCallback,errCallback);

	});

	$("#lockForm").on('change','select',function(e){
		e.stopPropagation();

		var $this = $(this);
		var node = $this.parent().siblings('.locknode').text();
		var newValue = $this.find("option:selected").text();
		var newPrice = "";
		$.each(productPrice,function(){				
			if(this.name == newValue){
				newPrice = this.price;
				return false;
			}
		})
		$this.parent().siblings('.price').find('span').text(newPrice*node);
					var sumMoney = p5mini.calculateMoney($(".price>span"));	
					$(".sum-money").text(sumMoney);	
		

	});
	$("#lockForm").on('click','.continue-confirm',function(e){
		e.stopPropagation();
		var $this = $(this);
		var node_delete = $this.parents("tr");
		var usbKey = $this.parents("tr").find('.first').text();

		delete p5mini.lockExist[usbKey];
	
		$(node_delete).remove();
		//no items, reset accountId
		if($("#lockForm").find('.continue-confirm').length===0){
			p5mini.accountId ={};
			p5mini.lockExist ={};
			p5mini.accountIdCheck = true;
			$('.btn-sub').attr('disabled','true');
			$('.btn-sub').css('color','grey');
		}

			var sumMoney = p5mini.calculateMoney($(".price>span"));	
					$(".sum-money").text(sumMoney);	
		

	})
	
	$(".input-panel").find('.btn:last').on('click',function(){
		$(this).addClass('btn-myorder-clicked');
		
		window.open(window.visitor.path+'/order/list');
	});
	

  	var joinFormStr = function(){
  		var trs = $('tr[class!=tdheader]');
  		
  		var str=[];

  		$.each(trs,function(i,item){
  			var $item = $(item);
  			var lockId = $item.find('input[name=lockId]').val();
  			var lockType =$item.find('input[name=lockType]').val();
  			var nodeNum = $item.find('input[name=nodeNum]').val();
  			var suiteId = $item.find('select').val();

  			var string_='lockId='+lockId+
  				'&'+'lockType='+lockType+
  				'&'+'nodeNum=' + nodeNum +
  				'&'+'suiteId=' + suiteId;
  				str.push(string_);
  		})

  		return'http:'+window.visitor.path+ '/buyP5?'+str.join('&');  		
  	}

	$(".btn-submit").on('click',function(e){
		if($("#lockForm").find('.continue-confirm').length>0){
			var strToSubmit = joinFormStr();
			window.open(strToSubmit);
			// openWebBrowser(strToSubmit);
		}

  		var $this = $(this);			
	  		$this.removeClass('btn-sub');
	  		$this.addClass('btn-clickon');

  	});
 

  	// $('.close').on('click',function(){
  	// 	GPPWebViewLmpl.close();
  	// })

  	// $('.minimize').on('click',function(){
  	// 	GPPWebViewLmpl.minimize();
  	// })

  	// $('.input-panel .btn').on('click',function(){
  	// 	GPPWebViewLmpl.checkLock();
  	// })

})

