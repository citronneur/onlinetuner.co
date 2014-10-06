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

//onlinetuner.js
//Namespace declaration
//Global function

(function () {
	OnlineTuner = function() {
		this.VERSION = "1.0";
		
		this.installArray();
		this.installFloat32Array();
	};
	
	OnlineTuner.prototype = {
		//shortcut
		$ : function (id) {
			return document.getElementById(id);
		},
		
		virtual : function() {
			throw "call pure virtual function";
		},
		
		installFloat32Array : function() {
			//Add max function
			Float32Array.prototype.max = function() {
				return Math.max.apply(null, this);
			};
			
			//Add indexof function
			Float32Array.prototype.indexof = function(value) {
				return Array.prototype.indexOf.call(this, value);
			};
			
			//Slice array
			Float32Array.prototype.slice = function(start, count) {
				return Array.prototype.slice.call(this, start, count);
			};
			
			//Slice array
			Float32Array.prototype.select = function(f) {
				for(var i = 0; i < this.length; i++) {
					this[i] = f(this[i]);
				}
			};
		},
		
		installArray : function() {
			//Add foreach function
			Array.prototype.map = function(f) {
				var map = new Array(this.length);
				for(var i in this) {
					map[i] = f(this[i]);
				};
				return map;
			};
			
			Array.prototype.where = function(f) {
				var where = new Array();
				for(var i in this) {
					if(f(this[i])) {
						where[i] = this[i];
					}
				};
				return where;
			};
		},
		
		//Return getUserMedia function for
		//every browser
		getUserMediaFunction : function() {
			return 	navigator.getUserMedia || 
					navigator.webkitGetUserMedia || 
					navigator.mozGetUserMedia || 
					navigator.msGetUserMedia;
		},
		
		//Test html5 API
		//return false if html5 webRTC API is not available
		//for browser
		isHtml5Compatible : function() {
			return !!this.getUserMediaFunction();
		},
		
		//Call getUsermedia function
		getUserMedia : function(constraint, successCallback, errorCallback) {
			return this.getUserMediaFunction().call(navigator, constraint, successCallback, errorCallback);
		},
		
		//Create generic audio context
		createAudioContext : function() {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			return new AudioContext();
		}
	};
})();

this.OnlineTuner = new OnlineTuner();