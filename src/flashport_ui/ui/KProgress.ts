import { Sprite } from "@flashport/flashport";
import { TextField } from "@flashport/flashport";
import { TextFormat } from "@flashport/flashport";
import { TextFormatAlign } from "@flashport/flashport";

/**
 * ...
 * @author Kenny Lerma
 */
export class KProgress extends Sprite
{
	private _width:number;
	private _height:number;
	private _msk:Sprite;
	private _border:Sprite;
	private _bar:Sprite;
	private _progTxt:TextField;
	
	constructor(width:number = 272, height:number = 31) 
	{
		super();
		
		this.mouseEnabled = false;
		this.mouseChildren = false;
		
		this._width = width;
		this._height = height;
		
		this.Draw();
	}
	
	private Draw = ():void =>
	{
		this.graphics.lineStyle(1.5, 0xCCCCCC, 1, true, "none");
		this.graphics.beginFill(0x464646);
		this.graphics.drawRoundRect(0, 0, this._width, this._height, 9, 9);
		
		this._bar = new Sprite();
		this._bar.graphics.beginFill(0x00E246);
		this._bar.graphics.drawRect(0, 0, this._width, this._height);
		this._bar.width = 0;
		this.addChild(this._bar);
		
		this._border = new Sprite();
		this._border.graphics.lineStyle(1.5, 0xCCCCCC, 1, true, "none");
		this._border.graphics.beginFill(0x464646, 0);
		this._border.graphics.drawRoundRect(0, 0, this._width, this._height, 9, 9);
		this.addChild(this._border);
		
		this._progTxt = new TextField();
		this._progTxt.defaultTextFormat = new TextFormat("Arial", 18, 0xFFFFFF, null, null, null, null, null, TextFormatAlign.CENTER);
		this._progTxt.width = this.width;
		this._progTxt.height = this.height - 5;
		this._progTxt.y = 5;
		this.addChild(this._progTxt);
		
		/*_msk = new Sprite();
		_msk.graphics.lineStyle(2, 0xCCCCCC, 1, true, "none");
		_msk.graphics.beginFill(0x464646);
		_msk.graphics.drawRoundRect(0, 0, _width, _height, 9, 9);
		addChild(_msk);
		this.mask = _msk;*/
	}
	
	public updateProgress = (percent:number):void =>
	{
		this._bar.width = percent * this._width;
		this._progTxt.text = (percent == 0) ? "" : String(Math.floor(percent * 10000) / 100) + "%";
		this._progTxt.textColor = (percent > .5) ? 0x000000 : 0xFFFFFF;
	}
	
	public get progTxt():TextField 
	{
		return this._progTxt;
	}
	
}