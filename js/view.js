//view.js
//view interface in onlinetuner
(function () {
	
	//system
	var View = function(canvas, analyser) {
		//target of drawing
		this.canvas = canvas;
		this.canvasCtx = this.canvas.getContext("2d");
		
		//Music analyser
		this.analyser = analyser;
	};
	
	//interface
	View.prototype = {
		update : OnlineTuner.virtual
	};
	
	OnlineTuner.View = View;
})();