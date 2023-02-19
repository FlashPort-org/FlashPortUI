import { GradientType } from "@flashport/flashport";
import { LineScaleMode } from "@flashport/flashport";
import { Sprite } from "@flashport/flashport";
import { MouseEvent } from "@flashport/flashport";
import { Matrix } from "@flashport/flashport";
import { Rectangle } from "@flashport/flashport";
import { DEvent } from "../events/DEvent";
	
/**
 * ...
 * @author Kenny Lerma
 */
export class KSlider extends Sprite
{
	public static readonly SLIDE_CHANGE:string = "slideChange";
	private _width:number;
	private _height:number;
	private _track:Sprite;
	private _handle:Sprite;
	private _value:number;
	private _active:boolean = true;
	
	constructor(widthHorizontal:number = 250, heightHorizontal:number = 24) 
	{
		super();

		this._width = widthHorizontal;
		this._height = heightHorizontal;
		this._track = new Sprite();
		this._handle = new Sprite();
		this.Draw();
		this.enable();
	}
	
	private enable = ():void =>
	{
		this._handle.addEventListener(MouseEvent.MOUSE_DOWN, this.onHandleDown);
	}
	
	private onHandleDown = (e:MouseEvent):void =>
	{
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onHandleUp);
		this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.onHandleMouseMove);
		this._handle.startDrag(false, new Rectangle(0, Math.floor((this._track.height - this._handle.height) / 2), this._width - this._handle.width , 0));
	}
	
	private onHandleUp = (e:MouseEvent):void =>
	{
		this.stopDrag();
		this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onHandleUp);
		this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onHandleMouseMove);
	}
	
	private onHandleMouseMove = (e:MouseEvent):void =>
	{
		//trace("onHandleMouseMove");
		var currentPos:number = this._handle.x;
		var endPos:number = this._width - this._handle.width;
		this._value = currentPos / endPos;
		this.dispatchEvent(new DEvent(KSlider.SLIDE_CHANGE, this._value));
	}
	
	private Draw = ():void =>
	{
		var mat:Matrix = new Matrix();
		mat.createGradientBox(this._width, this._height, 1.58);
		
		this._track.graphics.clear();
		this._track.graphics.lineStyle(2, 0xCCCCCC, 1, true, LineScaleMode.NONE);
		this._track.graphics.beginGradientFill(GradientType.LINEAR, [0xCCCCCC, 0x464646], [1, 1], [0, 255], mat);
		this._track.graphics.drawRoundRect(0, 0, this._width, this._height, 5, 5);
		this._track.graphics.moveTo(10, this._height / 2);
		this._track.graphics.lineTo(this._width - 10, this._height / 2);
		this.addChild(this._track);
		
		var handleHeight:number = this._height + 5;
		var handleMat:Matrix = new Matrix();
		handleMat.createGradientBox(handleHeight, handleHeight, 1.58);
		this._handle.graphics.clear();
		this._handle.graphics.lineStyle(2, 0xCCCCCC, 1, true, LineScaleMode.NONE);
		this._handle.graphics.beginGradientFill(GradientType.LINEAR, [0x800000, 0x464646], [1, 1], [0, 255], mat);
		this._handle.graphics.drawRoundRect(0, 0, handleHeight, handleHeight, 5, 5);
		this._handle.graphics.lineStyle(1, 0xCCCCCC, 1, true, LineScaleMode.NONE);
		this._handle.graphics.moveTo(handleHeight / 2, 7);
		this._handle.graphics.lineTo(handleHeight / 2, handleHeight - 7);
		this._handle.y = Math.floor((this.height - handleHeight) / 2);
		this._handle.buttonMode = true;
		this.addChild(this._handle);
	}
	
	public set value(value:number) 
	{
		this._value = value;
		if (value > 1) this._value = 1;
		if (value < 0) this._value = 0;
		this._handle.x = (this._width - this._handle.width) *this._value;
		this.dispatchEvent(new DEvent(KSlider.SLIDE_CHANGE, this._value));
	}
	
	public get value():number 
	{
		return this._value;
	}
	
	public set active(value:boolean) 
	{
		this._active = value;
		if (this._active)
		{
			this._handle.addEventListener(MouseEvent.MOUSE_DOWN, this.onHandleDown);
			this.alpha = 1;
		}
		else
		{
			this._handle.removeEventListener(MouseEvent.MOUSE_DOWN, this.onHandleDown);
			this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onHandleUp);
			this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.onHandleMouseMove);
			this.stopDrag();
			this.alpha = .35;
		}
	}
}