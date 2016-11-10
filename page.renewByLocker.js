/**
 * @desc this renew module generally contains functions like, the AjaxCall to get the details and
 * the check function which examine which locker detail should be added for the end users. 
 * Use the form to submit the locker details. 
 * @param object $addedLockers- store the locks added.
 */
var renewModule = (function(){
	var renewByLocker = function(path,$error){
			this.path = path;
			this.addedLockers = {};
	  		this.usbkeys ="";
	  		this.$error = $error;
			this.errormsg ={
	  				"busynetwork":"网络繁忙，请稍后再试",
	  				"mismatch":"您所查询的锁号不在此次搜索范围内!",
	  				"emptyinput":"请输入有效锁号!",
	  				"GPlusError":"系统异常，请联系管理员！",
	  				"added":function(locker){
								var msg="";
								if($.trim(locker)!=""){
									msg= '您所查询的锁号'+locker+'信息已经存在！'
								}
								return msg
							}
	  			}
		}
	renewByLocker.prototype.errors = function(option,locker){
		switch(option){
			case "busynetwork":
			this.$error.html(this.errormsg.busynetwork)
			break;
			case "mismatch":
			this.$error.html(this.errormsg.mismatch)
			break;
			case "emptyinput":
			this.$error.html(this.errormsg.emptyinput)
			break;
			case "GPlusError":
			this.$error.html(this.errormsg.GPlusError)
			break;
			case "added":
			this.$error.html(this.errormsg.added(locker))
			break;
		}
	}
	renewByLocker.prototype.ajaxCall = function(options){
		var settings = {
			url:this.path,
			data:{"usbKeys":this.usbkeys},
			cache:false,
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			method:'POST'
		}
		settings = $.extend(settings,options)
		var req = $.ajax(settings);
		return req;
	}
	renewByLocker.prototype.checkInput = function(str){
		var str = $.trim(str);
		if(str==""){
			this.errors("emptyinput")
			return false;
		}	
		return str;
	}
	renewByLocker.prototype.checkDuplicate = function(str){
		var dupLockers = [];
		var str = $.trim(str);
		var strArray = str.split(',')
		for(var i =0;i<strArray.length;i++){
			if(this.addedLockers[strArray[i]]){
				dupLockers.push(strArray[i]);
			}
		}
		return dupLockers;
	}
	renewByLocker.prototype.deleteLocker = function(lockerid){
		delete this.addedLockers[lockerid]
	}
	renewByLocker.prototype.addLocker = function(lockerid){
		this.addedLockers[lockerid] = '0'
	}

	return {
		renewByLocker:renewByLocker
	}
})(jQuery)