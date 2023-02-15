import { Sprite } from "@fp/flash/display/Sprite";
import { AEvent } from "@fp/flash/events/AEvent";
import { MouseEvent } from "@fp/flash/events/MouseEvent";

/**
 * ...
 * @author Kenny Lerma
 */
export class KCheck extends Sprite
{
	private _size:number;
	private _check:Sprite;
	private _checked:boolean = false;
	private _active:boolean = true;
	
	constructor(size:number = 20) 
	{
		super();

		this._size = 20;
		this.Draw();
		
		this.mouseChildren = false;
		this.buttonMode = true;
		this.addEventListener(MouseEvent.CLICK, this.OnClicked);
	}
	
	private OnClicked = (e:MouseEvent):void =>
	{
		this._checked = !this._checked;
		this._check.visible = this._checked;
		this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	private Draw = ():void =>
	{
		this.graphics.lineStyle(1.5, 0x666666, 1, true);
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRoundRect(0, 0, this._size, this._size, 6, 6);
		
		this._check = new Sprite();
		this._check.graphics.lineStyle(3, 0x000000, 1, true, "none");
		this._check.graphics.moveTo(3, (this._size / 2) + 2);
		this._check.graphics.lineTo(this._size / 4, this._size -4);
		this._check.graphics.lineTo(this._size - 6, 4);
		this._check.x = 3;
		this._check.y = -3;
		this._check.visible = false;
		this.addChild(this._check);
	}
	
	public get checked():boolean 
	{
		return this._checked;
	}
	
	public set checked(value:boolean) 
	{
		this._checked = value;
		this._check.visible = this._checked;
	}
	
	public set active(value:boolean)
	{
		this._active = value;
		if (this._active)
		{
			this.addEventListener(MouseEvent.CLICK, this.OnClicked);
			this.alpha = 1;
		}
		else
		{
			this.removeEventListener(MouseEvent.CLICK, this.OnClicked);
			this.alpha = .35;
		}
	}
	
	public get active():boolean
	{
		return this._active;
	}
}