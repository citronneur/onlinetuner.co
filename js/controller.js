//
// Copyright (c) 2014 Sylvain Peyrefitte
//
// This file is part of onlinetuner.co.
//
// onlinetuner.co is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//

//controller.js
//Interface between analyser and widgets
(function () {
	
	//View
	var Controller = function() {		
	};
	
	//interface
	Controller.prototype = {
		notify : OnlineTuner.virtual
	};
	
	//Guitare tuner view
	var GuitareTuner = function(widget) {
		Controller.call(this);
		//target of drawing
		this.widget = widget;
	};
	
	GuitareTuner.prototype = {
		// draw a particular array
		notify : function(analyser) {
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
			this.widget.show(- (delta) / 5.0, GUITARE_NOTE[index], "string " + (6 - index), info.note + "" + info.octave + "(" + Math.round(info.frequency) + "Hz)");
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
		notify : function(analyser) {
			var array = analyser.getData().slice(0, this.maxFrequency / analyser.getDeltaHZ());
			this.widget.show(array);
		}
	};
	
	//Namespace declaration
	OnlineTuner.Controller = {GuitareTuner : GuitareTuner, BarChart : BarChartController};
})();
