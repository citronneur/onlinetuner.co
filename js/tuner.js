//tuner.js
//Use to compute main frequency of a signal

(function(){
	var Tuner = function() {
		//Create audio context 
		this.audioContext = OnlineTuner.createAudioContext();
	};
	
	Tuner.prototype = {
		start : function(input) {
			var self = this;
			this.getUserMedia({audio : true}, function(stream) {
				
				//create audio tree for analysing
				var analyser = self.audioContext.createAnalyser();
				analyser.connect(self.audioContext.destination);
				var input = self.audioContext.createMediaStreamSource(stream);
				input.connect(analyser);
				
				
			}, function(e) {
				alert("Error : " + e);
			});
		},
	};
	
	//Namespace declaration
	OnlineTuner.Tuner = Tuner;
})();