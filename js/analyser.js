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

//analyser.js
//Use web audio api to produce analyse data

(function(){
	
	var Analyser = function(controllers, highFrequency, precision) {
		//max frequency to analyse
		this.highFrequency = highFrequency || 350.0;
		
		//precision of computation
		this.precision = precision || (4 * 16384);
		
		//analyser views
		this.controllers = controllers;
		
		//create audio context
		this.audioContext = OnlineTuner.createAudioContext();
		
		//turn buffer
		this.inputStream = new Float32Array(this.precision);
		
		//create fft object
		this.fft = new OnlineTuner.FFT(this.precision, this.audioContext.sampleRate);
		
		//test
		this.scriptNode = this.audioContext.createScriptProcessor(Math.min(this.precision, 16384), 1, 1);
		
		//loop
		var self = this;
		this.scriptNode.onaudioprocess = function(audioProcessingEvent) {
			// The input buffer is the song we loaded earlier
			var inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
			self.update(inputData);
		};
		
		this.scriptNode.connect(this.audioContext.destination);
		
		//input node
		this.input = null;
		
		//init window for sound analyse
		this.window = blackmanWindow(this.precision);
		
		//last note
		this.contextNote = {frequency : 440.0, step : 0, note : "A", octave : 4};
	};
	
	//init window with blackman algorithm
	var blackmanWindow = function(size) {
		var window = new Float32Array(size);
		for(var i = 0; i < window.length; i++) {
			window[i] = 0.42 - 0.5 * Math.cos(2* Math.PI * i / window.length) + 0.08 * Math.cos(4 * Math.PI * i / window.length);
		}
		
		return window;
	};
	
	//init window with hamming algorithm
	var hammingWindow = function(size) {
		var window = new Float32Array(size);
		for(var i = 0; i < window.length; i++) {
			window[i] = 0.54 - 0.46 * Math.cos(2* Math.PI * i / window.length);
		}
		
		return window;
	};
	
	Analyser.prototype = {
			// Init tree analyser
			// onReady is the ready callback
			install : function(onReady) {
				var self = this;
				
				OnlineTuner.getUserMedia({audio : true}, function(stream) {
					
					self.input = self.audioContext.createMediaStreamSource(stream);
					self.input.connect(self.scriptNode);
					//ready
					onReady();
					
				}, function(e) {
					alert("Error : " + e);
				});
			},

			//update fft with current values
			update : function(inputData) {
				//buffer turn
				this.inputStream.set(this.inputStream.subarray(this.precision));
				this.inputStream.set(inputData, this.inputStream.length - inputData.length);
				
				//normalize
				var max = this.inputStream.max();
				if (max > 0) {
					this.inputStream.select(function(e) {
						return e/max;
					});
				}
				
				//apply window
				for(var i = 0; i < inputData.length; i++) {
					this.inputStream[i] *= this.window[i];
				}
				
				//compute fft
				this.fft.forward(this.inputStream);
				
				//update view
			    for(var i = 0; i < this.controllers.length; i++) {
					this.controllers[i].notify(this);
				}
			},
			
			//return error
			getDeltaHZ : function() {
				return this.audioContext.sampleRate / this.precision;
			},
			
			//Return FFT of input signal
			getData : function() {
				return this.fft.spectrum;
			},
			
			//Return nb half step from A4 note
			getStep : function(frequency) {
				return 12 * Math.log(frequency / 440.0) / Math.LN2;
			},
			
			//Compute Note from step
			//step represent half step from A4 (do 440.0Hz)
			getNote : function(step) {
				var note = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
				var idx = Math.round(step) % note.length;
				if(idx < 0)
					return note[12 + idx];
				else
					return note[idx];
			},
			
			//Compute octave from step
			//step represent half step from A4 (la 440Hz)
			getOctave : function(step) {
				return Math.floor((step - 2) / 12) + 4;
			},
			
			//Return error of measurement in step
			getStepError : function(frequency) {
				return this.getStep(frequency + this.getDeltaHZ()) - this.getStep(frequency);
			},
			
			getInfo : function() {
				//frequencies computed by FFT
				var frequencies = this.getData().subarray(0, this.highFrequency / this.getDeltaHZ());
				
				//Max frequency
		        var frequency = (frequencies.indexof(frequencies.max()) * this.getDeltaHZ());
		        
		        if(frequency == 0)
		        	return this.contextNote;
		        //step from A4 (la 440hz)
		        var step = this.getStep(frequency);
		        
		        //Note and octave from step
		        var note = this.getNote(step);
		        var octave = this.getOctave(step);
		        
		        return {frequency : frequency, step : step, note : note, octave : octave};
			}
	};
	
	//Namespace declaration
	OnlineTuner.Analyser = Analyser;
})();