//noteview.js
//guitare tuner view

(function(){
	
	var NoteView = function(node, analyser) {
		OnlineTuner.View.call(this, analyser);
		this.node = node;
	};
	
	NoteView.prototype = {
		// draw a particular array
		update : function() {
			var note = this.analyser.getInfo();
			this.node.innerHTML = note.note + " " +note.octave;
		}
	};
	
	//Namespace declaration
	OnlineTuner.NoteView = NoteView;
})();