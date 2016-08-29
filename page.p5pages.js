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
					 		
					 		return uniKey.join(',');

}

P5Page.prototype.filterKeys =function(lockkey){
	
	var unikey;
		
			if(lockkey===""||$.trim(lockkey)===""){
				return this.errorMSG.emptyinput;

			}else {

				unikey = this.removeDuplicate(lockkey,this.lockExist)
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





P5Page.prototype.ajaxCall = function(usbkeys,callback,docallback,errcallback){

	$.ajax({
		url:this.actionURL,
		data:{"usbKeys":usbkeys},
		cache:false,
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		method:'POST',
		error:function(){
			if(typeof callback ==='function'){
				
				errcallback();
			}
		},
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
					'<td class="newDate">'+newDate+'</td>'+
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