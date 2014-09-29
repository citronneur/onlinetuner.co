//tunerview.js
//Use to see correct

(function(){
	
	var TunerView = function(canvas, analyser) {
		OnlineTuner.View.call(this, canvas, analyser);
	};
	
	TunerView.prototype = {
		// draw a particular array
		update : function(array) {
			this.canvasCtx.fillStyle = 'rgb(255, 255, 255)';
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
	};
	
	//Namespace declaration
	OnlineTuner.TunerView = TunerView;
})();