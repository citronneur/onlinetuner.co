//tunerview.js
//guitare tuner view

(function(){
	
	var TunerView = function(canvas, analyser) {
		OnlineTuner.View.call(this, analyser);
		//target of drawing
		this.canvas = canvas;
		this.canvasCtx = this.canvas.getContext("2d");
	};
	
	TunerView.prototype = {
		// draw a particular array
		update : function() {
			this.canvasCtx.fillStyle = 'rgb(255, 255, 255)';
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
	};
	
	//Namespace declaration
	OnlineTuner.TunerView = TunerView;
})();