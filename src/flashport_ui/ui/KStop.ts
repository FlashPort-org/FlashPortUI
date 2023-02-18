import { GradientType } from "flashport";
import { Sprite } from "flashport";
import { Matrix } from "flashport";

	
/**
 * ...
 * @author Kenny Lerma
 */
export class KStop extends Sprite 
{
	private _stop:Sprite;
	
	constructor(size:number = 33) 
	{
		super();
		
		this.mouseChildren = false;
		this.buttonMode = true;
		
		var colors:number[] = [0xFFFFFF, 0x999999];
		var alphas:number[] = [1, 1];
		var ratios:number[] = [127, 255];
		var matrix:Matrix = new Matrix()
		matrix.createGradientBox(size, size, 90/180*Math.PI);
		
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, matrix );
		this.graphics.drawRoundRect(0, 0, size, size, 9, 9);
		
		this._stop = new Sprite();
		this._stop.graphics.lineStyle(1.25, 0xCCCCCC, 1, true, "none");
		this._stop.graphics.beginFill(0xBF0000);
		this._stop.graphics.drawRoundRect(0, 0, size / 2, size / 2, 3, 3);
		this._stop.x = (this.width - this._stop.width) / 2;
		this._stop.y = (this.height - this._stop.height) / 2;
		this.addChild(this._stop);
	}
	
	public set enabled(value:boolean) 
	{
		if (value)
		{
			this.alpha = 1;
		}
		else
		{
			this.alpha = .50;
		}
	}
}