//onlinetuner.js
//Namespace declaration
//Global function

(function () {
	OnlineTuner = function() {
		this.VERSION = "1.0";
		
		//init audio context
		if(!this.isHtml5Compatible()) {
			alert("Not html5 browser compliant");
			return;
		}
	};
	
	OnlineTuner.prototype = {
		//shortcut
		$ : function (id) {
			return document.getElementById(id);
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
		},
		
		// Init tree analyser
		install : function(onReady) {
			var self = this;
			//Create audio context 
			this.audioContext = this.createAudioContext();
			
			this.getUserMedia({audio : true}, function(stream) {
				
				//create audio tree for analysing
				self.analyser = self.audioContext.createAnalyser();
				self.analyser.connect(self.audioContext.destination);
				var input = self.audioContext.createMediaStreamSource(stream);
				input.connect(self.analyser);
				
				self.analyser.fftsize = 2048;
				
				self.dataArray = new Uint8Array(self.analyser.frequencyBinCount);
				
				//ready
				onReady();
				
			}, function(e) {
				alert("Error : " + e);
			});
		},
		
		getFrequencyData : function() {
			this.analyser.getByteFrequencyData(this.dataArray);
			return this.dataArray;
		}
	};
})();

this.OnlineTuner = new OnlineTuner();