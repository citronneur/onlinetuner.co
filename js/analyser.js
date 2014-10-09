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
	
	//All note handle by analyser in Latin representation
	var NOTE = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
	
	//init window with blackman algorithm
	var blackmanWindow = function(size) {
		var window = new Float32Array(size);
		for(var i = 0; i < window.length; i++) {
			window[i] = 0.42 - 0.5 * Math.cos(2* Math.PI * i / (window.length - 1)) + 0.08 * Math.cos(4 * Math.PI * i / (window.length - 1));
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
	
	//compute step from frequency
	//step is the between La 440Hz (A4)
	var computeStep = function(frequency) {
		return 12 * Math.log(frequency / 440.0) / Math.LN2;
	};
	
	//Compute octave from step compute from La 440hz (4th octave)
	var computeOctave = function(step) {
		return ((step - 2) / Math.abs(step - 2)) * Math.floor(Math.abs(step - 2) / 12) + 4;
	};
	
	//Compute Note from step compute from La 440hz (A4)
	var computeNote = function(step) {
		var idx = Math.round(step) % NOTE.length;
		if(idx < 0)
			return NOTE[12 + idx];
		else
			return NOTE[idx];
	};
	
	var Analyser = function(controllers, precision, highFrequency) {
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
		
	};
	
	Analyser.prototype = {
			// Init tree analyser
			// onReady is the ready callback
			install : function(onReady, onError) {
				
				//init audio context
				if(!OnlineTuner.isHtml5Compatible()) {
					onError("Not html5 browser compliant");
					return;
				}
				
				var self = this;
				
				OnlineTuner.getUserMedia({audio : true}, function(stream) {
					
					self.input = self.audioContext.createMediaStreamSource(stream);
					self.input.connect(self.scriptNode);
					//ready
					onReady();
					
				}, function(e) {
					onError(e);
				});
			},

			//update fft with current values
			update : function(inputData) {
				//buffer turn
				this.inputStream.set(this.inputStream.subarray(this.precision));
				this.inputStream.set(inputData, this.inputStream.length - inputData.length);
				
				//apply window
				for(var i = 0; i < inputData.length; i++) {
					this.inputStream[i] *= this.window[i];
				}
				
				//compute fft
				this.fft.forward(this.inputStream);
				
				//compensate micro response
				for (var i = 0; i < this.fft.spectrum.length; i++) {
					this.fft.spectrum[i] *= this.microResponse(i);
				}
				
				//update view
			    for(var i = 0; i < this.controllers.length; i++) {
					this.controllers[i].notify(this.getInfo());
				}
			},
			
			//return error
			getError : function() {
				return this.audioContext.sampleRate / this.precision;
			},
			
			//Return FFT of input signal
			getData : function() {
				return this.fft.spectrum;
			},
			
			//Return error of measurement in step
			getStepError : function(frequency) {
				return computeStep(frequency + this.getError()) - computeStep(frequency);
			},
			
			getInfo : function() {
				//frequencies computed by FFT
				//Apply lowpass filter directly on fft
				var frequencies = this.getData().subarray(0, this.highFrequency / this.getError());
				
				//Max frequency
		        var frequency = (frequencies.indexof(frequencies.max()) * this.getError());
				
		        //no sound
		        if(frequency == 0)
		        	//default note is 440.0
		        	frequency = 440.0;
		        	
		        var step = computeStep(frequency);
		        
		        return {frequency : frequency, step : step, error : this.getError(frequency), stepError : this.getStepError(frequency), note : computeNote(step), octave : computeOctave(step)};
			},
			
			//microphone response is not linear
			//for low frequency there are an attenuation
			//that need to be compensate.
			microResponse : function(i) {
				if (i * this.getError() < this.microphoneResponseFrequency) {
					return - 1 * 0.06 * this.getError() * i + 13;
				}
				else {
					return 1.0;
				}
			}
	};
	
	//Namespace declaration
	OnlineTuner.Analyser = Analyser;
})();