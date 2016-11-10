(function($){
	function formatDate(str){
		var dates = str.split('/');	
		var year = dates[2]||"";
		var month =dates[0]||"";
		var date = dates[1]||"";
		return year+'/'+month+'/'+date
		}
	function sum(moneys){
		var sumMoney = 0;
		for(var i=0;i<moneys.length;i++){
			sumMoney = sumMoney+Number(moneys[i])
		}
 		return sumMoney;
		}
    var templateRender = function(settings){
    	var resumeYear = '一年';
	  	var resumePrice = '750';
	  	var template = '<tr>'+
	  					'<td class=\"first\"\>'+settings.lockShortNum+
	 					'<input type="hidden" name="lockId"'+'value='+settings.lockNum+'>'+
	 					'<input type="hidden" id="lockShortNum"'+'value='+settings.lockShortNum+'>'+
	 					'<input type="hidden" id="prodId"'+'value='+settings.prodId+'>'+
						'</td>'+
						'<td><div class="lock-type">'+settings.prodName+
						'<input type="hidden" name="lockType"'+'value='+settings.prodName+'>'+
						'</input>'+
						'</td>'+
						'<td class="locknode">'+settings.nodeNum+
						'<input type="text" name="nodeNum"' +'value='+settings.nodeNum+'>'+
						'</input>'+
						'</td>'+
						'<td class="newDate">'+formatDate(settings.effStartDate)+
						'-'+formatDate(settings.effEndDate)+
						'</td>'+
						'<td>'+resumeYear+'</td>'+
						'<td class=\"\price\"\>'+'&yen;'+'<span>'+resumePrice+'</span>'+
						'</td>'+
						'<td><input type="button" class="delete continue-confirm" value="删除"></input>'+
						'<input type="hidden" name="suiteVersionId"'+'value='+settings.mallSuiteVersionId+'>'+
						'</td>'+
						'</tr>';
		return template;
	}
	
	//dom ready
	$(function(){
		if(window.visitor.path==''){
		    var path = '//shop.glodon.com'
		    }else{
		        var path = window.visitor.path;
	    }    
    	var actionURL = path + '/gz';
		var gz = new renewModule.renewByLocker(actionURL,$('.mini-info'));
		var waitingProgress = new waitProgress();

		function sumMoney(){
			var prices = $('td.price').find('span');
			var pricearray = []
			$.each(prices,function(i,item){
				pricearray.push($(item).text());
			})
			var sumM = sum(pricearray);
			$('.sum-money').text(sumM);
		}
		function reset(){
			$(".btn-add").prop('disabled',false);
			$(".btn-add").addClass('btn-search');
			$(".btn-add").removeClass('btn-clickon');
		}

		$(".btn-add").on('click',function(){
			$('.mini-info').html('');	
			var usbkeys = $.trim($('.input-lock').val());
			usbkeys = gz.checkInput(usbkeys);
			if(usbkeys.length>0){
				gz.ajaxCall({
					data:{"usbKeys":usbkeys},
					beforeSend:function(){
						waitingProgress.progress()
						$(".btn-add").prop('disabled',true);
						// $(".btn-add").addClass('btn-clickon');
						// $(".btn-add").removeClass('btn-search');
					}
				})
				.done(function(data){
					$(".btn-add").prop('disabled',false);					
					var locktpl = "";
					if(typeof data !='object'){
						gz.errors("GPlusError")
						return false;
					}else if(data.usbKeysList.length===0){
						gz.errors("mismatch")
						return false;
						}else if(data.usbKeysList.length>0){
							$('.btn-sub').prop('disabled',false);
							$('.btn-sub').css('color','#fff');
							var duplicateLock=[];
							$.each(data.usbKeysList,function(i,item){					
								var itemLockNum = item.lockNum;
								var itemProdId = item.prodId;
								var itemId = itemLockNum+'&'+itemProdId;
								if(gz.addedLockers[itemId]!=undefined){
									duplicateLock.push(item.lockShortNum);
								}else{
									locktpl = locktpl+templateRender(item); 
									gz.addedLockers[itemId]='0';
								}
							})
							if(locktpl==''){
								if(duplicateLock.length>0){
									return gz.errors("added",duplicateLock.join(','))
								}
							}else{
								$(locktpl).insertAfter($("#lockForm tr:last"));
							}
							$("#lockForm .info-panel").show()
							sumMoney()
							reset()
						}else{
								return gz.errors("busynetwork");
								return false;
							}
				})
				.fail(function(){
					gz.errors("GPlusError");
					$(".btn-add").prop('disabled',false);
				})
				.always(function(){
					waitingProgress.remove()
				})
			}
		})
		
	 	$("#lockForm").on('click','.delete',function(e){
	 		e.stopPropagation();
	 		var $this = $(this);
	 		var node_delete = $this.parents("tr");
			var usbKey = $this.parents("tr").find('.first input').val();
			var prodId = $this.parents("tr").find('#prodId').val();
			var usbkeyid = usbKey + '&'+prodId;
			gz.deleteLocker(usbkeyid);
			$(node_delete).remove();
			sumMoney();
			if($("#lockForm").find('.delete').length==0){
				gz.addedLockers = {}
				$('.mini-info').html(' ');
				$('.btn-sub').prop('disabled',true);
				$('.btn-sub').css('color','grey');
			}
	 	})

	 	$(".input-panel").find('.btn:last').on('click',function(){
			$(this).addClass('btn-myorder-clicked');	
			window.open(path+'/order/list');
		})

		$('input.btn-sub').one('click',function(e){
			e.preventDefault()
			waitingProgress.progress()
			$("#lockForm").submit()
		})

	 })
})(jQuery)