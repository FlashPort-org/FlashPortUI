import { Sprite } from "flashport";
import { AEvent } from "flashport";
import { MouseEvent } from "flashport";
/**
	* ...
	* @author Kenny Lerma
	*/
export class PlotCircle extends Sprite
{
	private _xLabel:string;
	private _yLabel:string;
	
	constructor(color:number, radius:number, xLabel:string, yLabel:string) 
	{
		super();

		this._xLabel = xLabel;
		this._yLabel = yLabel;
		
		this.graphics.beginFill(color);
		this.graphics.drawCircle(0, 0, radius);
		
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.OnAddedToStage);
	}
	
	private OnAddedToStage = (e:AEvent):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.OnAddedToStage);
		this.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
	}
	
	private onMouseOver = (e:MouseEvent):void =>
	{
		this.addEventListener(MouseEvent.MOUSE_OUT, this.OnMouseOut);
		this.scaleX = this.scaleY = 1.5;
	}
	
	private OnMouseOut = (e:MouseEvent):void =>
	{
		this.removeEventListener(MouseEvent.MOUSE_OUT, this.OnMouseOut);
		this.scaleX = this.scaleY = 1;
	}
	
	public get xLabel():string 
	{
		return this._xLabel;
	}
	
	public get yLabel():string 
	{
		return this._yLabel;
	}
	
}