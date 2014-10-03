//analyser.js
//Use web audio api to produce analyse data

(function(){
	var Analyser = function(highFrequency) {
		
		//height octave on 8000.0 hz
		this.highFrequency = highFrequency || 8000.0;
		
		this.audioContext = OnlineTuner.createAudioContext();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftsize = 2048;
		this.analyser.connect(this.audioContext.destination);
		this.filter = this.audioContext.createBiquadFilter();
		this.filter.frequency = this.highFrequency;
		this.filter.type = this.filter.LOWPASS;
		this.filter.Q.value = 0.1;
		this.filter.connect(this.analyser);
		
		this.delay = this.audioContext.createDelay(5.0);
		this.delay.connect(this.filter);
		
		this.input = null;
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
	};
	
	Analyser.prototype = {
			// Init tree analyser
			// onReady is the ready callback
			install : function(onReady) {
				var self = this;
				
				OnlineTuner.getUserMedia({audio : true}, function(stream) {
					
					self.input = self.audioContext.createMediaStreamSource(stream);
					self.input.connect(self.delay);
					//ready
					onReady();
					
				}, function(e) {
					alert("Error : " + e);
				});
			},
			
			//update fft with current values
			update : function() {
				this.analyser.getByteFrequencyData(this.dataArray);
			},
			
			//return deltaHz between two frequencies
			getDeltaHZ : function() {
				return this.audioContext.sampleRate / this.analyser.fftSize;
			},
			
			//Return FFT of input signal
			getData : function() {
				return this.dataArray;
			},
			
			//Return nb half step from C1 note
			getStep : function(frequency) {
				return 12 * Math.log2(frequency / 32.70);
			},
			
			//Compute Note from step
			//step represent half step from C1 (do 32.70Hz)
			getNote : function(step) {
				var note = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
				var idx = Math.round(step) % note.length;
				if(idx < 0)
					return note[12 + idx];
				else
					return note[idx];
			},
			
			//Compute octave from step
			//step represent half step from C1 (do 32.7Hz)
			getOctave : function(step) {
				return Math.floor(step / 12);
			},
			
			getInfo : function() {
				//frequencies computed by FFT
				var frequencies = this.getData();
				
				//Max frequency
		        var frequency = (frequencies.indexof(frequencies.max()) * this.getDeltaHZ());
		        
		        if(frequency == 0)
		        	return {frequency : 32.7, step : 0, note : "C", octave : 0};
		        //step from C1 (Do 32.7hz)
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