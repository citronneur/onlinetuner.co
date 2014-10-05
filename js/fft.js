//Copyright (c) 2010 Corban Brook
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//"Software"), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//Fourier Transform Module used by DFT, FFT, RFFT
(function(){
	function FourierTransform(bufferSize, sampleRate) {
		this.bufferSize = bufferSize;
		this.sampleRate = sampleRate;
		this.bandwidth  = 2 / bufferSize * sampleRate / 2;

		this.spectrum   = new Float32Array(bufferSize/2);
		this.real       = new Float32Array(bufferSize);
		this.imag       = new Float32Array(bufferSize);

		this.peakBand   = 0;
		this.peak       = 0;

		this.getBandFrequency = function(index) {
			return this.bandwidth * index + this.bandwidth / 2;
		};

		this.calculateSpectrum = function() {
			var spectrum  = this.spectrum,
			real      = this.real,
			imag      = this.imag,
			bSi       = 2 / this.bufferSize,
			sqrt      = Math.sqrt,
			rval, 
			ival,
			mag;

			for (var i = 0, N = bufferSize/2; i < N; i++) {
				rval = real[i];
				ival = imag[i];
				mag = bSi * sqrt(rval * rval + ival * ival);

				if (mag > this.peak) {
					this.peakBand = i;
					this.peak = mag;
				}

				spectrum[i] = mag;
			}
		};
	}

	function FFT(bufferSize, sampleRate) {
		FourierTransform.call(this, bufferSize, sampleRate);

		this.reverseTable = new Uint32Array(bufferSize);

		var limit = 1;
		var bit = bufferSize >> 1;

		var i;

		while (limit < bufferSize) {
			for (i = 0; i < limit; i++) {
				this.reverseTable[i + limit] = this.reverseTable[i] + bit;
			}

			limit = limit << 1;
			bit = bit >> 1;
		}

		this.sinTable = new Float32Array(bufferSize);
		this.cosTable = new Float32Array(bufferSize);

		for (i = 0; i < bufferSize; i++) {
			this.sinTable[i] = Math.sin(-Math.PI/i);
			this.cosTable[i] = Math.cos(-Math.PI/i);
		}
	}

	FFT.prototype = {
			forward : function(buffer) {
				// Locally scope variables for speed up
				var bufferSize      = this.bufferSize,
				cosTable        = this.cosTable,
				sinTable        = this.sinTable,
				reverseTable    = this.reverseTable,
				real            = this.real,
				imag            = this.imag,
				spectrum        = this.spectrum;

				var k = Math.floor(Math.log(bufferSize) / Math.LN2);

				if (Math.pow(2, k) !== bufferSize) { throw "Invalid buffer size, must be a power of 2."; }
				if (bufferSize !== buffer.length)  { throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length; }

				var halfSize = 1,
				phaseShiftStepReal,
				phaseShiftStepImag,
				currentPhaseShiftReal,
				currentPhaseShiftImag,
				off,
				tr,
				ti,
				tmpReal,
				i;

				for (i = 0; i < bufferSize; i++) {
					real[i] = buffer[reverseTable[i]];
					imag[i] = 0;
				}

				while (halfSize < bufferSize) {
					//phaseShiftStepReal = Math.cos(-Math.PI/halfSize);
					//phaseShiftStepImag = Math.sin(-Math.PI/halfSize);
					phaseShiftStepReal = cosTable[halfSize];
					phaseShiftStepImag = sinTable[halfSize];

					currentPhaseShiftReal = 1;
					currentPhaseShiftImag = 0;

					for (var fftStep = 0; fftStep < halfSize; fftStep++) {
						i = fftStep;

						while (i < bufferSize) {
							off = i + halfSize;
							tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
							ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

							real[off] = real[i] - tr;
							imag[off] = imag[i] - ti;
							real[i] += tr;
							imag[i] += ti;

							i += halfSize << 1;
						}

						tmpReal = currentPhaseShiftReal;
						currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
						currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
					}

					halfSize = halfSize << 1;
				}

				return this.calculateSpectrum();
			},

			inverse : function(real, imag) {
				// Locally scope variables for speed up
				var bufferSize      = this.bufferSize,
				cosTable        = this.cosTable,
				sinTable        = this.sinTable,
				reverseTable    = this.reverseTable,
				spectrum        = this.spectrum;

				real = real || this.real;
				imag = imag || this.imag;

				var halfSize = 1,
				phaseShiftStepReal,
				phaseShiftStepImag,
				currentPhaseShiftReal,
				currentPhaseShiftImag,
				off,
				tr,
				ti,
				tmpReal,
				i;

				for (i = 0; i < bufferSize; i++) {
					imag[i] *= -1;
				}

				var revReal = new Float32Array(bufferSize);
				var revImag = new Float32Array(bufferSize);

				for (i = 0; i < real.length; i++) {
					revReal[i] = real[reverseTable[i]];
					revImag[i] = imag[reverseTable[i]];
				}

				real = revReal;
				imag = revImag;

				while (halfSize < bufferSize) {
					phaseShiftStepReal = cosTable[halfSize];
					phaseShiftStepImag = sinTable[halfSize];
					currentPhaseShiftReal = 1;
					currentPhaseShiftImag = 0;

					for (var fftStep = 0; fftStep < halfSize; fftStep++) {
						i = fftStep;

						while (i < bufferSize) {
							off = i + halfSize;
							tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
							ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

							real[off] = real[i] - tr;
							imag[off] = imag[i] - ti;
							real[i] += tr;
							imag[i] += ti;

							i += halfSize << 1;
						}

						tmpReal = currentPhaseShiftReal;
						currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
						currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
					}

					halfSize = halfSize << 1;
				}

				var buffer = new Float32Array(bufferSize); // this should be reused instead
				for (i = 0; i < bufferSize; i++) {
					buffer[i] = real[i] / bufferSize;
				}

				return buffer;
			}
		};
	
		OnlineTuner.FFT = FFT;
})();