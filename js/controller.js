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
	
	//Step compute from La 440 Hz
	var GUITARE_STEP = [-5, -10, -14, -19, -24, -29];
	//notes of guitare strings
	var GUITARE_NOTE = ["E", "B", "G", "D", "A", "E"];
	
	//compute guitare string and delta from note step (la 440Hz)
	var computeGuitareString = function(info) {
		//search nearest note
		var diff = GUITARE_STEP.map(function(e) {
			return Math.abs(e - info.step);
		});
		
		var string = diff.indexOf(Math.min.apply(null, diff));
		
		//compute error
		var delta = GUITARE_STEP[string] - info.step;
		if(Math.abs(delta) - info.stepError < 0) {
			delta = 0;
		}
		
		return { string : string + 1, note : GUITARE_NOTE[string], delta : delta };
	};
	
	//Controller
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
		// draw guitare tubner state
		notify : function(info) {

			var guitareInfo = computeGuitareString(info);
			
			//update associate widget
			this.widget.show(- (guitareInfo.delta) / 5.0, guitareInfo.note, "string " + guitareInfo.string, info.note + "" + info.octave + "(" + Math.round(info.frequency) + "Hz)");
		}
	};
	
	//Namespace declaration
	OnlineTuner.Controller = {GuitareTuner : GuitareTuner};
})();
