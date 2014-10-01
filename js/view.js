//view.js
//view interface in onlinetuner
(function () {
	
	//system
	var View = function(analyser) {		
		//Music analyser
		this.analyser = analyser;
	};
	
	//interface
	View.prototype = {
		update : OnlineTuner.virtual
	};
	
	OnlineTuner.View = View;
})();