//widget.js
//widget use

(function(){
	//View a barchart in canvas 2d
	var BarChartWidget = function(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.delta = 1;
	};
	
	BarChartWidget.prototype = {
			show : function(data) {
				this.ctx.fillStyle = 'rgb(255, 255, 255)';
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				
				var barWidth = (this.canvas.width / data.length) - this.delta;
				var barHeight;
				var x = 0;
				
				for(var i = 0; i < data.length; i++) {
					barHeight = data[i];
					this.ctx.fillStyle = 'rgb(211 ,42, 42)';
					this.ctx.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
					x += barWidth + this.delta;
				}
			}
	};
	
	//View a barchart in canvas 2d
	var CircleWidget = function(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
	};
	
	CircleWidget.prototype = {
			show : function(text, delta) {
				this.ctx.fillStyle = 'rgb(255, 255, 255)';
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.font = '70pt Arial';
				this.ctx.textAlign = 'center';
				this.ctx.fillStyle = 'blue';
				this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 + 35);
				
				this.ctx.beginPath();
				this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, 0, 2*Math.PI);
				this.ctx.stroke();
			}
	};
	
	//Namespace declaration
	OnlineTuner.BarChartWidget = BarChartWidget;
	OnlineTuner.CircleWidget = CircleWidget;
})();