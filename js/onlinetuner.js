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