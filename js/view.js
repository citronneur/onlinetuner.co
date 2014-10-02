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
	
	//Guitare tuner view
	var GuitareTunerView = function(widget, analyser) {
		OnlineTuner.View.call(this, analyser);
		//target of drawing
		this.widget = widget;
	};
	
	GuitareTunerView.prototype = {
		// draw a particular array
		update : function() {
			var info = this.analyser.getInfo();
			this.widget.show(info.note + "" + info.octave, -0.5);
		}
	};
	
	//BarChartView
	//Frequency chart view
	var BarChartView = function(widget, analyser) {
		OnlineTuner.View.call(this, analyser);
		//target of drawing
		this.widget = widget;
	};
	
	BarChartView.prototype = {
		// draw a particular array
		update : function() {
			var array = this.analyser.getData().slice(0, this.analyser.highFrequency / this.analyser.getDeltaHZ());
			this.widget.show(array);
		}
	};
	
	//Namespace declaration
	OnlineTuner.View = View;
	OnlineTuner.GuitareTunerView = GuitareTunerView;
	OnlineTuner.BarChartView = BarChartView;
})();