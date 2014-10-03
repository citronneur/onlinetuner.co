//controller.js
//Interface between analyser and widgets
(function () {
	
	//View
	var Controller = function(analyser) {		
		//Music analyser
		this.analyser = analyser;
	};
	
	//interface
	Controller.prototype = {
		update : OnlineTuner.virtual
	};
	
	//Guitare tuner view
	var GuitareTuner = function(widget, analyser) {
		Controller.call(this, analyser);
		//target of drawing
		this.widget = widget;
	};
	
	GuitareTuner.prototype = {
		// draw a particular array
		update : function() {
			//step of quitare note
			var GUITARE_STEP = [17, 22, 27, 32, 36, 41];
			var GUITARE_NOTE = ["E", "A", "D", "G", "B", "E"];
			
			//analyser informations
			var info = this.analyser.getInfo();
			
			//search nearest note
			var diff = GUITARE_STEP.map(function(e) {
				return Math.abs(e - info.step);
			});
			var index = diff.indexOf(Math.min.apply(null, diff));
			
			//compute error
			var delta = GUITARE_STEP[index] - info.step;
			if(Math.abs(delta - this.analyser.getStepError(info.frequency)) < 0) {
				delta = 0;
			}
			this.widget.show(GUITARE_NOTE[index], info.note + "" + info.octave + "(" + info.frenquency + "Hz)", delta);
		}
	};
	
	//BarChartView
	//Frequency chart view
	var BarChartController = function(widget, analyser) {
		Controller.call(this, analyser);
		//target of drawing
		this.widget = widget;
	};
	
	BarChartController.prototype = {
		// draw a particular array
		update : function() {
			var array = this.analyser.getData().slice(0, this.analyser.highFrequency / this.analyser.getDeltaHZ());
			this.widget.show(array);
		}
	};
	
	//Namespace declaration
	OnlineTuner.Controller = {GuitareTuner : GuitareTuner, BarChart : BarChartController};
})();