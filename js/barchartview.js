//barchartview.js
//Use canvas to see bar chart 

(function(){
	var BarChartView = function(canvas, analyser) {
		OnlineTuner.View.call(this, canvas, analyser);
	};
	
	BarChartView.prototype = {
		// draw a particular array
		update : function() {
			var array = this.analyser.getData().slice(0, this.analyser.highFrequency / this.analyser.getDeltaHZ());
			this.canvasCtx.fillStyle = 'rgb(255, 255, 255)';
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			
			var barWidth = (this.canvas.width / array.length);
			var barHeight;
			var x = 0;
			
			for(var i = 0; i < array.length; i++) {
				barHeight = array[i];
				this.canvasCtx.fillStyle = 'rgb(211 ,42, 42)';
				this.canvasCtx.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
				x += barWidth + 1;
			}
		}
	};
	
	//Namespace declaration
	OnlineTuner.BarChartView = BarChartView;
})();