//tunerview.js
//Use to see correct

(function(){
	
	var TunerView = function(canvas) {
		OnlineTuner.View.call(this, canvas);
	};
	
	TunerView.prototype = {
		// draw a particular array
		update : function(array) {
			this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
	};
	
	//Namespace declaration
	OnlineTuner.TunerView = TunerView;
})();