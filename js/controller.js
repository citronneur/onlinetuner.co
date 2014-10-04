//controller.js
//Interface between analyser and widgets
(function () {
	
	//View
	var Controller = function() {		
	};
	
	//interface
	Controller.prototype = {
		update : OnlineTuner.virtual
	};
	
	//Guitare tuner view
	var GuitareTuner = function(widget) {
		Controller.call(this);
		//target of drawing
		this.widget = widget;
	};
	
	GuitareTuner.prototype = {
		// draw a particular array
		update : function(analyser) {
			//step of quitare note
			var GUITARE_STEP = [-29, -24, -19, -14, -10, -5];
			var GUITARE_NOTE = ["E", "A", "D", "G", "B", "E"];
			
			//analyser informations
			var info = analyser.getInfo();
			
			//search nearest note
			var diff = GUITARE_STEP.map(function(e) {
				return Math.abs(e - info.step);
			});
			var index = diff.indexOf(Math.min.apply(null, diff));
			//compute error
			var delta = GUITARE_STEP[index] - info.step;
			if(Math.abs(delta) - analyser.getStepError(info.frequency) < 0) {
				console.log(analyser.getStepError(info.frequency) + " " + delta);
				delta = 0;
			}
			this.widget.show(GUITARE_NOTE[index], info.note + "" + info.octave + "(" + Math.round(info.frequency) + "Hz)",(delta) / 5.0);
		}
	};
	
	//BarChartView
	//Frequency chart view
	var BarChartController = function(widget, maxFrequency) {
		Controller.call(this);
		//target of drawing
		this.widget = widget;
		//maxFrequency to show
		this.maxFrequency = maxFrequency;
	};
	
	BarChartController.prototype = {
		// draw a particular array
		update : function(analyser) {
			var array = analyser.getData().slice(0, this.maxFrequency / analyser.getDeltaHZ());
			this.widget.show(array);
		}
	};
	
	//Namespace declaration
	OnlineTuner.Controller = {GuitareTuner : GuitareTuner, BarChart : BarChartController};
})();
