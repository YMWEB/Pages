var waitProgress = (function(){	
	var ProgressBar = function(options){
		this.$element = $('<div id="progress-bar-glodon"><div></div></div>')
		var defaultCSS = ({
			"position":"absolute",
			"top":"560px",
			"left":"50%"
		})
		$.extend(defaultCSS,options);
		this.$element.css(defaultCSS);
		this.$element.find('div').addClass('progress-bar-glodon')
	}
		
	ProgressBar.prototype.progress= function(){
		this.$element.appendTo($('body'))
	}

	ProgressBar.prototype.remove = function(){
		this.$element.remove();
	}
	return ProgressBar
})()