import { Sprite } from "flashport";

/**
 * ...
 * @author Kenny Lerma
 */
export class KXButton extends Sprite
{
	private _size:number;
	
	public KXButton(size:number) 
	{
		this._size = size;
		this.Draw();
		
		this.buttonMode = true;
	}
	
	private Draw = ():void =>
	{
		this.graphics.lineStyle(1.5, 0xCCCCCC, 1, true, "none");
		this.graphics.beginFill(0xB00000);
		this.graphics.drawRoundRect(0, 0, this._size, this._size, 9, 9);
		this.graphics.moveTo(6, 6);
		this.graphics.lineTo(this._size - 6, this._size - 6);
		this.graphics.moveTo(this._size - 6, 6);
		this.graphics.lineTo(6, this._size - 6);
	}
}