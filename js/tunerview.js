//tunerview.js
//Use to see correct

(function(){
	
	var FREQUENCIES = {"E1" : 329.6, "B" : 246.9, "G" : 196, "D" : 146.8, "A" : 110, "E2" : 82.4 };
	
	var TunerView = function(canvas, sampleRate) {
		OnlineTuner.View.call(this, canvas);
		this.sampleRate = sampleRate;
	};
	
	TunerView.prototype = {
		maxFrequency : function(array) {
	        var idx = Array.prototype.indexOf.call(array, Math.max.apply(null, array));
	        return (idx * this.sampleRate / array.length);
		},
		
		getNote : function(maxFrequency) {
			var diffFrequencies = {};
			for(var i in FREQUENCIES) {
				diffFrequencies[i] = FREQUENCIES[i] - maxFrequency;
			}
			
			var note = "E1";
			var min = Math.abs(diffFrequencies[note]);
			for(var i in diffFrequencies) {
				if(Math.abs(diffFrequencies[i]) < min) {
					min = Math.abs(diffFrequencies[i]);
					note = i;
				}
			}
			
			console.log(note + " " + min + " " + maxFrequency);
		},
		
		// draw a particular array
		update : function(array) {
			this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			
			this.getNote(this.maxFrequency(array));
		}
	};
	
	//Namespace declaration
	OnlineTuner.TunerView = TunerView;
})();