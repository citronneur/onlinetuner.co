//onlinetuner.js
//Namespace declaration

(function () {
	OnlineTuner = function() {
		this.VERSION = "1.0";
			
	};
	
	OnlineTuner.prototype = {
		getUserMedia : function(p) {
			var getUserMedia = 	navigator.getUserMedia || 
								navigator.webkitGetUserMedia || 
								navigator.mozGetUserMedia || 
								navigator.msGetUserMedia;
			return getUserMedia.call(navigator, p);
		}
	};
})();

this.OnlineTuner = new OnlineTuner();