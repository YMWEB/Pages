// {
//    "usbKeysList": [
//       {
//          "id": 903190317851904,
//          "accountId": "1-ONVCOX",
//          "accountNum": "1-ONVCOX",
//          "accountName": "郭微测试",
//          "login": "GAOJQ",
//          "lockNum": "ZZ320149201",
//          "lockMode": "",
//          "prodId": "1-12JDGY3",
//          "prodName": "黑龙江：云计价5.0（全专业）-年费版",
//          "prodPartNum": "",
//          "prodType": "计价",
//          "prodSubType": "单机版",
//          "packageType": "单品",
//          "nodeNum": "1",
//          "installDate": "08/23/2016",
//          "effStartDate": "08/23/2016",
//          "effEndDate": "12/01/2016",
//          "assetId": "1-1HE7RK8",
//          "parAssetId": "1-1HE7RK4",
//          "rootAssetId": "1-1HE7RK4",
//          "syncTime": 1472006463000
//       }
//    ]
// }
P5Pages= (function($){

function P5Page(url,imgSrc){
	this.actionURL = url;
	this.imgSrc = imgSrc;
	this.lockExist ={};
	this.accountId={};
	this.accountIdCheck = true;
}

P5Page.prototype.selectComponent ={

	settings:{
		versionid1:'',
		versionid2:'',
		versionid3:''
	},

	productPrice:function(options){
		$.extend(this.settings,options);
		
							return [
											{	
												"name": "云计价+数据包",
												"price":"2400",
												"suitVersionId":this.settings.versionid1
												
											},
											{	
												"name": "云计价",
												"price":"1800",
												"suitVersionId":this.settings.versionid2
												
											},
											{	
												"name": "云计价+数据包+广材信息服务",
												"price":"3980",
												"suitVersionId":this.settings.versionid3
												
											}

											];
						},

	create:function(options){
		var productPrice = this.productPrice(options);
		var selectComponent = "";
	
		$.each(productPrice,function(i){
  		  selectComponent = selectComponent + '<option'+' value='+productPrice[i].suitVersionId+'>'+productPrice[i].name+'</option>';		
  		});
  		return selectComponent;
	}

}

P5Page.prototype.errorMSG = {
	busynetwork:function(){
		 var msg = '网络繁忙，请稍后再试'
		 return msg
	},


	mismatch:function(locker){
		var msg='您所查询的锁号'+locker+"不在此次升级范围内！"
		return msg
	},
	emptyinput:function(){
		var msg='请输入有效锁号！'
		return msg
	},
	exist:function(){
		var msg= '您所查询的锁号信息已经存在！'
		return msg
	},
	differentAccount:function(){
		var msg= '您所查询的锁号不能同时下单！'
		return msg
	}

}

P5Page.prototype.renderErr = function(root,msg){
	
	root.html('<p class="error-msg">'+msg+'</p>');
}


P5Page.prototype.formatDate = function(datastr){

		var dates = datastr.split('/');
	
			var year = dates[2]||"";
			var month =dates[0]||"";
			var date = dates[1]||""
	
		 return year+'-'+month+'-'+date
}

P5Page.prototype.removeDuplicate = function(usbkey,keycollection){
	var uniKey = [];

					 		if(usbkey.indexOf(',')>0){
					 			var usbkeyCollection = usbkey.split(',');
					 			
					 			for(var i=0;i<usbkeyCollection.length;i++){
					 				if(keycollection[usbkeyCollection[i]]===undefined){
					 					uniKey.push(usbkeyCollection[i]);
					 				}
					 				
					 			}
					 			
					 		}
					 		else{
					 			if(keycollection[usbkey]===undefined){
					 					uniKey.push(usbkey);
					 				}
					 		}
					 		
					 		return uniKey;

}

P5Page.prototype.filterKeys =function(lockkey){
	var lockExist = this.lockExist;
	var unikey;
		
			if(lockkey===""||$.trim(lockkey)===" "){
				return this.errorMSG.emptyinput;

			}else {
				unikey = this.removeDuplicate(lockkey,lockExist)
				if (unikey.length===0){
					return this.errorMSG.exist
				}else{
					return unikey
				}
			}

}




P5Page.prototype.trigger = function(){
	this.ajaxCall();
}





P5Page.prototype.ajaxCall = function(usbkeys,callback,docallback){

	$.ajax({
		url:this.actionURL,
		data:{"usbKeys":usbkeys},
		cache:false,
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		method:'POST',
		error:function(err){console.log('error:'+err)},
		success:function(data){
			if(typeof callback ==='function'){
				
				callback(data,usbkeys);
			}
		},
		complete:function(){

			if (typeof docallback === 'function'){
				docallback();
			}
		}

	})
},



P5Page.prototype.renderTo = function(selectComponent,productPrice,options,target){


	var settings = {
		picture:"",
		value:{
			lockNum:"",
		prodSubType:"",
		nodeNum:"",
		effEndDate:""
		},
	}
	$.extend(settings,options);

	var newDate = target.formatDate(settings.value.effEndDate);

	var template = '<tr>'+'<td class=\"first\"\>'+settings.value.lockNum+
 					'<input type="text" name="lockId"'+'value='+settings.value.lockNum+'>'+
					'</td>'+
					'<td><div class="lock-img">'+settings.value.prodSubType+
					'<input type="text" name="lockType"'+'value='+settings.value.prodSubType+'>'+
					'<img src="'+settings.picture+'"/>'+
					'</div></td>'+
					'<td>'+newDate+'</td>'+
					'<td class="locknode">'+settings.value.nodeNum+
					'<input type="text" name="nodeNum"'+'value='+settings.value.nodeNum+'>'+

					'</td>'+
					'<td>'+'<select name="suiteId">'+selectComponent+'</select>'+'</td>'+
					'<td>'+'一年'+'</td>'+
					'<td class=\"\price\"\>'+'&yen;'+'<span>'+(productPrice[0].price)*settings.value.nodeNum+'</span>'+
					'</td>'+
					'<td><input type="button" class="continue-confirm" value="删除"></input></td>'+
					
					'</tr>';
		return template;

}

P5Page.prototype.calculateMoney = function(array){
	var sumMoney = 0;
	$.each(array,function(i,item){
 			sumMoney = sumMoney +Number(item.innerText);

 		})
 		return sumMoney;
}
return {
	P5Page:P5Page
}
})(jQuery)




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





$(function(){

		$('.tabs ul').tabShowandHide();
		var actionURL= window.visitor.path + '/p5'
		var imgSrc = "//static.glodon.com/open/market2/css/page/images/p5/";


		$.mockjax({
	url:actionURL,
	status:200,
	responseTime:900,
	responseText:{
   "usbKeysList": [
      {
         "id": 903190317851904,
         "accountId": "111",
         "accountNum": "1-ONVCOX",
         "accountName": "郭微测试",
         "login": "GAOJQ",
         "lockNum": "1",
         "lockMode": "",
         "prodId": "1-12JDGY3",
         "prodName": "黑龙江：云计价5.0（全专业）-年费版",
         "prodPartNum": "",
         "prodType": "计价",
         "prodSubType": "单机版",
         "packageType": "单品",
         "nodeNum": "1",
         "installDate": "08/23/2016",
         "effStartDate": "08/23/2016",
         "effEndDate": "12/01/2016",
         "assetId": "1-1HE7RK8",
         "parAssetId": "1-1HE7RK4",
         "rootAssetId": "1-1HE7RK4",
         "syncTime": 1472006463000
      },
      //  {
      //    "id": 903190317851904,
      //    "accountId": "1-ONVCOX",
      //    "accountNum": "1-ONVCOX",
      //    "accountName": "郭微测试",
      //    "login": "GAOJQ",
      //    "lockNum": "2",
      //    "lockMode": "",
      //    "prodId": "1-12JDGY3",
      //    "prodName": "黑龙江：云计价5.0（全专业）-年费版",
      //    "prodPartNum": "",
      //    "prodType": "计价",
      //    "prodSubType": "单机版",
      //    "packageType": "单品",
      //    "nodeNum": "1",
      //    "installDate": "08/23/2016",
      //    "effStartDate": "08/23/2016",
      //    "effEndDate": "12/01/2016",
      //    "assetId": "1-1HE7RK8",
      //    "parAssetId": "1-1HE7RK4",
      //    "rootAssetId": "1-1HE7RK4",
      //    "syncTime": 1472006463000
      // },
       {
         "id": 903190317851904,
         "accountId": "111",
         "accountNum": "1-ONVCOX",
         "accountName": "郭微测试",
         "login": "GAOJQ",
         "lockNum": "3",
         "lockMode": "",
         "prodId": "1-12JDGY3",
         "prodName": "黑龙江：云计价5.0（全专业）-年费版",
         "prodPartNum": "",
         "prodType": "计价",
         "prodSubType": "单机版",
         "packageType": "单品",
         "nodeNum": "1",
         "installDate": "08/23/2016",
         "effStartDate": "08/23/2016",
         "effEndDate": "12/01/2016",
         "assetId": "1-1HE7RK8",
         "parAssetId": "1-1HE7RK4",
         "rootAssetId": "1-1HE7RK4",
         "syncTime": 1472006463000
      }
   ]
}
		
})


		var p5mini = new P5Pages.P5Page(actionURL,imgSrc);
		
		var lockExist =p5mini.lockExist;
		var accountId=p5mini.accountId;
		var accountIdCheck = p5mini.accountIdCheck;
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


		var successCallback = function(data,usbkey){
			var template = "";
			$('.mini-info').html(' ');

			if(typeof data ==='object'){
				if(data.usbKeysList.length ===0){
					lockExist[usbkey] = '0';
					p5mini.renderErr($('.mini-info'),p5mini.errorMSG.mismatch(usbkey));
				}else{

					$.each(data.usbKeysList,function(i,value){
						if($.isEmptyObject(accountId)){
									accountId[value.accountId]='0';
									
								}else if(accountId[value.accountId]===undefined){
									accountIdCheck = false;
								}
						if(accountIdCheck === true){
									
							lockExist[value.lockNum]='0';	
										
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

				$('.btn-sub').removeAttr('disabled');
							$('.btn-sub').css('color','#fff');
							
							$('.btn-add').removeClass('btn-clickon');
							$('.btn-add').addClass('btn-search');
							$('body').css('cursor','default');

							var sumMoney = p5mini.calculateMoney($(".price>span"));	
							$(".sum-money").text(sumMoney);	
						};



	$(".btn-add").on('click',function(){
		
		var usbkeys = $('.input-lock').val();

		var searchKey = p5mini.filterKeys(usbkeys);

		if(typeof searchKey ==='function'){
			p5mini.renderErr($('.mini-info'),searchKey())
		 	return;
		}
	
		p5mini.ajaxCall(searchKey,successCallback,doCallback);

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

		delete lockExist[usbKey];
	
		$(node_delete).remove();
		//no items, reset accountId
		if($("#lockForm").find('.continue-confirm').length===0){
			accountId ={};
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

	$('.footer-text label').on('click',function(){
		$('.footer-text').find('ol').show();
	})

	$(".btn-sub").on('click',function(e){

  		var $this = $(this);			
	  		$this.removeClass('btn-sub');
	  		$this.addClass('btn-clickon');

  	});

})

