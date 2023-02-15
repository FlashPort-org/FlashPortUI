import { Sprite } from "@fp/flash/display/Sprite";
import { MouseEvent } from "@fp/flash/events/MouseEvent";

/**
 * Creates an arrow shape with a center registration.
 * @author Kenny Lerma
 */
export class KArrow extends Sprite
{
	private _lineColor:number;
	private _fillColor:number;
	private _width:number;
	private _height:number;
	
	constructor(width:number, height:number, fillColor:number = 0xCCCCCC, lineColor:number = 0x000000) 
	{
		super();
		
		this._width = width;
		this._height = height;
		this._fillColor = fillColor;
		this._lineColor = lineColor;
		
		this.buttonMode = true;
		
		this.Draw();
		
		this.addEventListener(MouseEvent.ROLL_OVER, this.OnRollover);
	}
	
	private Draw = ():void =>
	{
		this.graphics.lineStyle(2, this._lineColor, 1, true, "none");
		this.graphics.beginFill(this._fillColor);
		this.graphics.moveTo( -(this._width / 2), -(this._height / 4));
		this.graphics.lineTo(0, -(this._height / 4));
		this.graphics.lineTo(0, -(this._height/ 2));
		this.graphics.lineTo(this._width / 2, 0);
		this.graphics.lineTo(0, (this._height / 2));
		this.graphics.lineTo(0, (this._height / 4));
		this.graphics.lineTo( -(this._width / 2), (this._height / 4));
		this.graphics.lineTo( -(this._width / 2) , -(this._height / 4));
	}
	
	private OnRollover = (e:MouseEvent = null):void =>
	{
		this.scaleX = this.scaleY = 1.1;
		this.addEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		this.addEventListener(MouseEvent.MOUSE_DOWN, this.OnDown);
		this.stage.addEventListener(MouseEvent.ROLL_OVER, this.OnRollout);
	}
	
	private OnDown = (e:MouseEvent):void =>
	{
		this.OnRollout();
		this.addEventListener(MouseEvent.MOUSE_UP, this.OnUp);
	}
	
	private OnUp = (e:MouseEvent):void =>
	{
		this.OnRollover();
	}
	
	private OnRollout = (e:MouseEvent = null):void =>
	{
		this.removeEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		this.removeEventListener(MouseEvent.CLICK, this.OnDown);
		if(this.stage) this.stage.removeEventListener(MouseEvent.ROLL_OVER, this.OnRollout);
		this.scaleX = this.scaleY = 1;
	}
	
	public set active(value:boolean) 
	{
		if (value)
		{
			this.addEventListener(MouseEvent.ROLL_OVER, this.OnRollover);
			this.addEventListener(MouseEvent.CLICK, this.OnDown);
			this.addEventListener(MouseEvent.MOUSE_DOWN, this.OnDown);
			this.addEventListener(MouseEvent.MOUSE_UP, this.OnUp);
			if (this.stage) this.stage.addEventListener(MouseEvent.ROLL_OVER, this.OnRollout);
			this.alpha = 1;
			this.scaleX = this.scaleY = 1;
		}
		else
		{
			this.removeEventListener(MouseEvent.ROLL_OVER, this.OnRollover);
			this.removeEventListener(MouseEvent.CLICK, this.OnDown);
			this.removeEventListener(MouseEvent.MOUSE_DOWN, this.OnDown);
			this.removeEventListener(MouseEvent.MOUSE_UP, this.OnUp);
			if (this.stage) this.stage.removeEventListener(MouseEvent.ROLL_OVER, this.OnRollout);
			this.alpha = .2;
			this.scaleX = this.scaleY = 1;
		}
	}
}