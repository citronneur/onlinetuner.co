//analyser.js
//Use web audio api to produce analyse data

(function(){
	var Analyser = function() {
		this.audioContext = OnlineTuner.createAudioContext();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftsize = 2048;
		this.analyser.connect(this.audioContext.destination);
		this.filter = this.audioContext.createBiquadFilter();
		this.filter.frequency = 4000.0;
		this.filter.type = this.filter.LOWPASS;
		this.filter.Q = 0.1;
		this.filter.connect(this.analyser);
		
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
					self.input.connect(self.filter);
					//ready
					onReady();
					
				}, function(e) {
					alert("Error : " + e);
				});
			},
			
			getData : function() {
				this.analyser.getByteFrequencyData(this.dataArray);
				return this.dataArray;
			}
	};
	
	//Namespace declaration
	OnlineTuner.Analyser = Analyser;
})();