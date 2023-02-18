import { BitmapData } from "flashport";
import { Shape } from "flashport";
import { Rectangle } from "flashport";

export class DottedLine extends Shape
{
	private _w:number;
	private _h:number;
	private _color:number;
	private _dotAlpha:number;
	private _dotWidth:number;
	private _spacing:number;
	
	constructor(w:number = 100, h:number = 1, color:number = 0x777777, dotAlpha:number = 1, dotWidth:number = 1, spacing:number = 1)
	{
		super();

		this._w = w;
		this._h = h;
		this._color = color;
		this.alpha = dotAlpha;
		this._dotWidth = dotWidth;
		this._spacing = spacing;
		this.drawDottedLine();
	}
	
	private drawDottedLine = ():void =>
	{
		this.graphics.clear();
		var tile:BitmapData = new BitmapData(this._dotWidth + this._spacing, this._h + 1, true);
		var r1:Rectangle = new Rectangle(0, 0, this._dotWidth, this._h);
		var argb:number = this.returnARGB(this._color, 255);
		tile.fillRect(r1, argb);
		var r2:Rectangle = new Rectangle(this._dotWidth, 0, this._dotWidth + this._spacing, this._h);
		tile.fillRect(r2, 0x00000000);
		this.graphics.beginBitmapFill(tile, null, true);
		this.graphics.drawRect(0, 0, this._w, this._h);
		this.graphics.endFill();
	}
	
	private returnARGB = (rgb:number, newAlpha:number):number =>
	{
		var argb:number = 0;
		argb += (newAlpha<<24);
		argb += (rgb);
		return argb;
	}
	
}