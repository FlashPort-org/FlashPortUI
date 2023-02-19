
import { KLabel } from '../../ui/KLabel';
import { Sprite } from "@flashport/flashport";
import { DropShadowFilter } from "@flashport/flashport";

/**
	* ...
	* @author Kenny Lerma
	*/
export class PlotLabel extends Sprite
{
	private _xLabel:string;
	private _yLabel:string;
	private _labelX:KLabel;
	private _labelY:KLabel;
	
	constructor(xLabel:string, yLabel:string) 
	{
		super();
		
		this._xLabel = xLabel;
		this._yLabel = yLabel;
		
		this._labelY = new KLabel(this._yLabel, 0x313131, 14);
		this._labelY.y = this._labelY.x = 2;
		
		this._labelX = new KLabel(this._xLabel, 0x313131, 14);
		this._labelX.x = 2;
		this._labelX.y = this._labelY.textHeight + this._labelY.y;
		this.addChild(this._labelX);
		this.addChild(this._labelY);
		
		this.Draw();
		
		this.filters = [new DropShadowFilter(4, 45, 0, .75, 8, 8, 1)];
	}
	
	private Draw = ():void =>
	{
		this.graphics.clear();
		var w:number = Math.max(this._labelX.textWidth, this._labelY.textWidth) + 10;
		var h:number = this._labelX.textHeight + this._labelY.textHeight + 10;
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.lineStyle(2, 0xE67300, 1, true, "none");
		this.graphics.lineTo(w, 0);
		this.graphics.lineTo(w, (h/2) - 5);
		this.graphics.lineTo(w + 5, (h/2));
		this.graphics.lineTo(w, (h/2) + 5);
		this.graphics.lineTo(w, h);
		this.graphics.lineTo(0, h);
		this.graphics.lineTo(0, 0);
	}
	
	public get xLabel():string 
	{
		return this._xLabel;
	}
	
	public set xLabel(value:string) 
	{
		this._xLabel = value;
		this._labelX.text = this._xLabel;
		this.Draw();
	}
	
	public get yLabel():string 
	{
		return this._yLabel;
	}
	
	public set yLabel(value:string) 
	{
		this._yLabel = value;
		this._labelY.text = this._yLabel;
		this.Draw();
	}
	
}