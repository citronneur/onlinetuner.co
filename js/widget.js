//
// Copyright (c) 2014 Sylvain Peyrefitte
//
// This file is part of onlinetuner.co.
//
// onlinetuner.co is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//

//widget.js
//view of data

(function(){
	
	//View a particular widget
	var CircleWidget = function(canvas, bgColor, deltaColor, okColor, fontColor) {
		//canvas use to draw
		this.canvas = canvas;
		//backgroud color
		this.bgColor = bgColor;
		//out circle color
		this.deltaColor = deltaColor;
		//inner circle color
		this.okColor = okColor;
		//text color
		this.fontColor = fontColor;
		
		//context use to draw
		this.ctx = this.canvas.getContext("2d");
	};
	
	CircleWidget.prototype = {
			show : function(delta, note, info1, info2) {
				//backgroud
				this.ctx.fillStyle = this.bgColor;;
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				
				//out arc
				this.ctx.beginPath();
				this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
				this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, - Math.PI / 2.0, - Math.PI / 2.0 + delta * Math.PI, delta <= 0);
				this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
				this.ctx.fillStyle = this.deltaColor;
				this.ctx.fill();
				this.ctx.closePath();
				
				//in arc
				this.ctx.beginPath();
				this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, (4 * this.canvas.width) / 10, 0, 2*Math.PI);
				this.ctx.fillStyle = delta == 0 ?this.okColor : this.bgColor;
				this.ctx.fill();
				this.ctx.closePath();
				
				//Note info
				this.ctx.font = '70pt Arial';
				this.ctx.textAlign = 'center';
				this.ctx.fillStyle = this.fontColor;
				this.ctx.fillText(note, this.canvas.width / 2, this.canvas.height / 2 + 15);
				
				//information 1
				this.ctx.font = '20pt Arial';
				this.ctx.textAlign = 'center';
				this.ctx.fillStyle = this.fontColor;
				this.ctx.fillText(info1, this.canvas.width / 2, this.canvas.height / 2 + 55);
				
				//information 1
				this.ctx.font = '15pt Arial';
				this.ctx.textAlign = 'center';
				this.ctx.fillStyle = this.fontColor;
				this.ctx.fillText(info2, this.canvas.width / 2, this.canvas.height / 2 + 85);
			
			}
	};
	
	//Namespace declaration
	OnlineTuner.Widget = {CircleWidget : CircleWidget};
})();