import { Sprite } from "@flashport/flashport";
import { KLabel } from '../ui/KLabel';
import { PlotCircle } from "./ui/PlotCircle";
import { PlotLabel } from "./ui/PlotLabel";
import { MouseEvent } from "@flashport/flashport";
import { DropShadowFilter } from "@flashport/flashport";
import { Tweener } from "@flashport/flashport";
import { Equations } from "@flashport/flashport";
import { Plot } from "./Plot";

/**
 * ...
 * @author Kenny Lerma
 */
export class LineChart extends Sprite
{
	private _width:number;
	private _height:number;
	private _data:Plot[];
	private _xMax:number;
	private _xMin:number;
	private _yMax:number;
	private _yMin:number;
	private _xLinesMax:number = 10;
	private _yLinesMax:number = 10;
	private _yLabelFormatFunc:Function;
	private _xLabelFormatFunc:Function;
	private _plotCircles:PlotCircle[];
	
	private _plotLabel:PlotLabel;
	
	private _chart:Sprite;
	private _lineContainer:Sprite;
	
	constructor(width:number, height:number, xLabel:string = "", yLabel:string = "", xLabelFormatFunc:Function = null, yLabelFormatFunc:Function = null) 
	{
		super();
		
		this._width = width;
		this._height = height;
		
		this._xLabelFormatFunc = xLabelFormatFunc;
		this._yLabelFormatFunc = yLabelFormatFunc;
		
		this.graphics.beginFill(0x464646);
		this.graphics.drawRoundRect(0, 0, width, height, 15, 15);
		this.graphics.endFill();
		
		var labelX:KLabel = new KLabel(xLabel, 0x313131, 14);
		labelX.x = (this._width - labelX.textWidth) / 2;
		labelX.y = -labelX.textHeight - 2;
		this.addChild(labelX);
		
		var labelY:KLabel = new KLabel(yLabel, 0x313131, 14);
		labelY.rotation = 90;
		labelY.x = 0;
		labelY.y = (this._height - labelY.textWidth) / 2;
		this.addChild(labelY);
		
		this._chart = new Sprite();
		this.addChild(this._chart);
		
		this._lineContainer = new Sprite();
		//this._lineContainer.filters = [new DropShadowFilter(4, 45, 0, .75, 8, 8, 1)];
		this._chart.addChild(this._lineContainer);
		
		this._plotLabel = new PlotLabel("Test 1", "Test 2");
		
		this.addEventListener(MouseEvent.MOUSE_MOVE, this.OnMouseMove);
	}
	
	private OnMouseMove = (e:MouseEvent):void =>
	{
		var minX:number;
		var plotCircle:PlotCircle;
		
		for (var plot of this._plotCircles) 
		{
			var diff:number = Math.abs(plot.x - this.mouseX);
			if (isNaN(minX))
			{
				minX = diff;
				plotCircle = plot;
			}
			else
			{
				if (diff < minX)
				{
					minX = diff;
					plotCircle = plot;
				}
			}
		}
		
		Tweener.removeTweens(this._plotLabel);
		Tweener.addTween(this._plotLabel, { time:.20, x:plotCircle.x - this._plotLabel.width, y:plotCircle.y - (this._plotLabel.height / 2), transition:Equations.easeOutSine } );
		
		this._plotLabel.xLabel = plotCircle.xLabel;
		this._plotLabel.yLabel = plotCircle.yLabel;
		this._chart.addChild(this._plotLabel);
	}
	
	
	public setData = (data:Plot[]):void =>
	{
		this._data = data;
		this._plotCircles = [];
		
		for (var plot of data) 
		{
			this._xMax = isNaN(this._xMax) ? plot.x : Math.max(this._xMax, plot.x);
			this._yMax = isNaN(this._yMax) ? plot.y : Math.max(this._yMax, plot.y);
			
			this._xMin = isNaN(this._xMin) ? plot.x : Math.min(this._xMin, plot.x);
			this._yMin = isNaN(this._yMin) ? plot.y : Math.min(this._yMin, plot.y);
		}
		
		var incrementX:number = this._xMax / this._xLinesMax;
		var incrementY:number = this._yMax / this._yLinesMax;
		var graphXIncrement:number = this._width / this._xLinesMax;
		var graphYIncrement:number = this._height / this._yLinesMax;
		
		this._chart.graphics.lineStyle(1, 0x7C7C7C, 1, true, "none");
		// x axis
		for (var i:number = 0; i <= this._yLinesMax; i++) 
		{
			this._chart.graphics.moveTo(0, i * graphYIncrement);
			this._chart.graphics.lineTo(this._width, i * graphYIncrement);
			
			var incrY:number = (this._yMax - this._yMin) / this._yLinesMax;
			
			var yLabelTxt:string = Math.round(this._yMin + (i * incrY)).toString();
			if (this._yLabelFormatFunc != null) yLabelTxt = this._yLabelFormatFunc(this._yMin + (i * incrY)).toString();
			var yLabel:KLabel = new KLabel(yLabelTxt, 0xFFFFFF, 11);
			yLabel.x = 1;
			yLabel.y = (i == 0) ? this._height - yLabel.textHeight : this._height - (i * graphYIncrement) - 1;
			this._chart.addChild(yLabel);
		}
		
		// y axis
		for (var k:number = 0; k <= this._xLinesMax; k++) 
		{
			this._chart.graphics.moveTo(k * graphXIncrement, 0);
			this._chart.graphics.lineTo(k * graphXIncrement, this._height);
			
			var incrX:number = (this._xMax - this._xMin) / this._xLinesMax;
			var xLabelTxt:string = String(Math.round(this._xMin + (k * incrX)));
			if (this._xLabelFormatFunc != null) xLabelTxt = String(this._xLabelFormatFunc(this._xMin + (k * incrX)));
			
			var xLabel:KLabel = new KLabel(xLabelTxt, 0x313131, 11);
			xLabel.rotation = 90;
			xLabel.x =  (k * graphXIncrement) + 4;
			xLabel.y = this._height - xLabel.textHeight + 14;
			this._chart.addChild(xLabel);
		}
		
		// draw line
		this._lineContainer.graphics.lineStyle(1.5, 0xE67300, 1, true, "none");
		this._lineContainer.graphics.moveTo(0, this._height - (this._height * ((this._data[0].y - this._yMin) / (this._yMax - this._yMin))));
		
		
		var plotCircle:PlotCircle = new PlotCircle(0xE67300, 4, (this._xLabelFormatFunc) ? this._xLabelFormatFunc(this._data[0].x) : this._data[0].x.toString(), (this._yLabelFormatFunc) ? this._yLabelFormatFunc(this._data[0].y) : this._data[0].y.toString());
		plotCircle.x = 0;
		plotCircle.y = this._height - (this._height * ((this._data[0].y - this._yMin) / (this._yMax - this._yMin)));
		this._plotCircles.push(plotCircle);
		this._lineContainer.addChildAt(plotCircle, 0);
		
		for (var j:number = 1; j < this._data.length; j++) 
		{
			this._lineContainer.graphics.lineTo(this._width * ((this._data[j].x - this._xMin) / (this._xMax - this._xMin)), this._height - (this._height * ((this._data[j].y - this._yMin) / (this._yMax - this._yMin))));
			
			plotCircle = new PlotCircle(0xE67300, 4, (this._xLabelFormatFunc) ? this._xLabelFormatFunc(this._data[j].x) : this._data[j].x.toString(), (this._yLabelFormatFunc) ? this._yLabelFormatFunc(this._data[j].y) : this._data[j].y.toString());
			plotCircle.x = this._width * ((this._data[j].x - this._xMin) / (this._xMax - this._xMin));
			plotCircle.y = this._height - (this._height * ((this._data[j].y - this._yMin) / (this._yMax - this._yMin)));
			this._plotCircles.push(plotCircle);
			this._lineContainer.addChildAt(plotCircle, 0);
		}
	}
	
}