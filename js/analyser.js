//analyser.js
//Use web audio api to produce analyse data

(function(){
	
	var Analyser = function(views, precision) {
		this.precision = precision || 16384;
		
		//analyser views
		this.views = views;
		
		//create audio context
		this.audioContext = OnlineTuner.createAudioContext();
		
		//create fft object
		this.fft = new OnlineTuner.FFT(this.precision, this.audioContext.sampleRate);
		
		//test
		this.scriptNode = this.audioContext.createScriptProcessor(this.precision, 1, 1);
		var self = this;
		this.scriptNode.onaudioprocess = function(audioProcessingEvent) {
			// The input buffer is the song we loaded earlier
			var inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
			self.update(inputData);
		};
		
		this.scriptNode.connect(this.audioContext.destination);
		
		//input node
		this.input = null;
		
		//init window
		this.window = hammingWindow(this.precision);
		
		//last note
		this.contextNote = {frequency : 440.0, step : 0, note : "C", octave : 0};
	};
	
	var blackmanWindow = function(size) {
		var window = new Float32Array(size);
		for(var i = 0; i < window.length; i++) {
			window[i] = 0.42 - 0.5 * Math.cos(2* Math.PI * i / window.length) + 0.08 * Math.cos(4 * Math.PI * i / window.length);
		}
		
		return window;
	};
	
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
				//apply window
				for(var i = 0; i < inputData.length; i++) {
					inputData[i] *= 10000 * this.window[i];
				}
				
				//compute fft
				this.fft.forward(inputData);
				
			    for(var id in this.views) {
					this.views[id].update(this);
				}
			},
			
			//return deltaHz between two frequencies
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
				return Math.floor(step / 12);
			},
			
			//Return error of measurement in step
			getStepError : function(frequency) {
				return this.getStep(frequency + this.getDeltaHZ()) - this.getStep(frequency);
			},
			
			getInfo : function() {
				//frequencies computed by FFT
				var frequencies = this.getData();
				
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