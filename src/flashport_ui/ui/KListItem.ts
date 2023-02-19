import { DisplayObject } from "@flashport/flashport";
import { Sprite } from "@flashport/flashport";
import { KLabel } from "./KLabel";
import { MouseEvent } from "@flashport/flashport";
import { AEvent } from "@flashport/flashport";
import { TrashCan } from './TrashCan';

	
/**
 * ...
 * @author Kenny Lerma
 */
export class KListItem extends Sprite
{
	public static readonly DELETE_ITEM:string = "deleteItem";
	private _title:string;
	private _params:any;
	private _active:boolean;
	private _selected:boolean = false;
	private _titleTxt:KLabel;
	private _deleteBtn:TrashCan;
	private _width:number = 100;
	private _icon:DisplayObject;
	private _msk:Sprite;
	
	constructor(title:string, fontSize:number = 16, params:Object = null, icon:DisplayObject = null, deleteEnabled:boolean = false)
	{
		super();
		
		this._title = title;
		this._params = params;
		this._icon = icon;
		this._active = true;
		this.buttonMode = true;
		
		this._titleTxt = new KLabel(title, 0x313131, fontSize);
		this._titleTxt.x = (this._icon) ? 50 : 10;
		this._titleTxt.mouseEnabled = false;
		
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRect(0, 0, this._width, Math.ceil(this._titleTxt.textHeight) + 5);
		this.graphics.endFill();
		
		this._msk = new Sprite();
		this._msk.graphics.beginFill(0x000000);
		this._msk.graphics.drawRect(0, 0, this._width, Math.ceil(this._titleTxt.textHeight) + 5);
		this.addChild(this._msk);
		this.mask = this._msk;
		
		if (this._icon)
		{
			//icon.height = _height - 3;
			//icon.scaleX = icon.scaleY;
			this._icon.x = (40 - this._icon.width) / 2;
			this._icon.y = (this.height - this._icon.height) / 2;
			this.addChild(this._icon);
		}
		
		this._titleTxt.y = ((this.height - Math.ceil(this._titleTxt.textHeight)) / 2) - 2;
		this.addChild(this._titleTxt);
		
		if (deleteEnabled)
		{
			this._deleteBtn = new TrashCan();
			this._deleteBtn.height = this.height - 2;
			this._deleteBtn.scaleX = this._deleteBtn.scaleY;
			this._deleteBtn.x = Math.round(this._width - this._deleteBtn.width - 10);
			this._deleteBtn.y = Math.round((this.height - this._deleteBtn.height) / 2);
			this._deleteBtn.addEventListener(MouseEvent.CLICK, this.OnDelete);
			this._deleteBtn.visible = false;
			this.addChild(this._deleteBtn);
		}
		
		this.addEventListener(MouseEvent.ROLL_OVER, this.OnRollover);
	}
	
	public set updateWidth(value:number) 
	{
		this._width = value;
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRect(0, 0, this._width, Math.ceil(this._titleTxt.textHeight) + 5);
		this.graphics.endFill();
		
		this._msk.graphics.clear();
		this._msk.graphics.beginFill(0x000000);
		this._msk.graphics.drawRect(0, 0, this._width, Math.ceil(this._titleTxt.textHeight) + 5);
		
		this._titleTxt.y = ((this.height - Math.ceil(this._titleTxt.textHeight)) / 2) - 2;
		
		if (this._deleteBtn)
		{
			this._deleteBtn.x = Math.round(this._width - this._deleteBtn.width - 10);
			this._deleteBtn.y = Math.round((this.height - this._deleteBtn.height) / 2);
		}
	}
	
	private OnDelete = (e:MouseEvent):void =>
	{
		e.stopPropagation();
		this.dispatchEvent(new AEvent(KListItem.DELETE_ITEM));
	}
	
	private OnRollover = (e:MouseEvent):void =>
	{
		this.addEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		
		if (!this._selected)
		{
			this.graphics.clear();
			this.graphics.lineStyle(1, 0x666666, 1, true, "none");
			this.graphics.beginFill(0xE2EAF5);
			this.graphics.drawRect(0, 0, this._width, this.height);
		}
		
		if (this._deleteBtn) this._deleteBtn.visible = true;
	}
	
	private OnRollout = (e:MouseEvent = null):void =>
	{
		this.removeEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		if (!this._selected)
		{
			this.graphics.clear();
			this.graphics.lineStyle(1, 0xFFFFFF, 1, true, "none");
			this.graphics.beginFill(0xFFFFFF);
			this.graphics.drawRect(0, 0, this._width, this.height);
		}
		if (this._deleteBtn) this._deleteBtn.visible = false;
	}
	
	public get title():string 
	{
		return this._title;
	}
	
	public set title(value:string) 
	{
		this._title = value;
		this._titleTxt.text = this._title;
	}
	
	public get params():Object 
	{
		return this._params;
	}
	
	public get active():boolean 
	{
		return this._active;
	}
	
	public set active(value:boolean) 
	{
		this._active = value;
	}
	
	public get selected():boolean 
	{
		return this._selected;
	}
	
	public set selected(value:boolean) 
	{
		this._selected = value;
		if (!this._selected)
		{
			this.OnRollout();
		}
		else
		{
			this.graphics.clear();
			this.graphics.lineStyle(1, 0x666666, 1, true, "none");
			this.graphics.beginFill(0xC4D2EA);
			this.graphics.drawRect(0, 0, this._width, this.height);
		}
	}
	
	public setIcon = (icon:DisplayObject):void =>
	{
		if (this._icon && this.contains(this._icon)) this.removeChild(this._icon);
		this._icon = icon;
		this._icon.x = (40 - this._icon.width) / 2;
		this._icon.y = (this.height - this._icon.height) / 2;
		this.addChild(this._icon);
	}
	
}