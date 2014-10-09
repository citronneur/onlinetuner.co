[www.onlinetuner.co](http://www.onlinetuner.co)
==============

Guitar Tuner in HTML5.

onlinetuner.co is a web site that use WebAudio API to capture Guitar sound, analyse it and determine the difference from nearest string.
Algorithm can be apply for other instruments or other type of tuning.

Please visit website : [www.onlinetuner.co](http://www.onlinetuner.co)

How does it works
-----------------

1.	Use [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to construct tree Analyse
2.	Use [getUserMedia](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia) to capture sound from client
3.	Apply [Blackman](http://en.wikipedia.org/wiki/Window_function#Blackman_windows) window on input signal
4.	Apply FFT from [dsp.js](https://github.com/corbanbrook/dsp.js/)
5.	Apply microphone response correction
6.	Retrieve most contributed frequency
7.	Find nearest note from frequency
8.	Use HTML5 canvas to show difference and note

Widget
-------
CircleWidget show difference in circle mode.
```
var widget = new OnlineTuner.Widget.CircleWidget(canvasElement, backColor, deltaColor, okColor, fontColor);
```

Tuner
-----
GuitarTuner is use in classic Guitar Tuning case. It compute frequency difference from guitar strings.
```
var tuner = new OnlineTuner.Controller.GuitareTuner(widget);
```

Use it in your own site
--------
You can use onlinertuner as widget in your own website, and if you implement more controllers or widgets, keep it back!
```
<script type="text/javascript" src="https://raw.githubusercontent.com/citronneur/onlinetuner.co/master/js/onlinetuner.min.js"></script>
<script type="text/javascript">
	function start() {
		var tuners = [
			new OnlineTuner.Controller.GuitareTuner(new OnlineTuner.Widget.CircleWidget(canvasElement, backColor, deltaColor, okColor, fontColor));
		];
		
		new OnlineTuner.Analyser(tuners).install(function() {
			//ok 
		}, function(errorMessage) {
			//nok
		});
	}
</script>
```


