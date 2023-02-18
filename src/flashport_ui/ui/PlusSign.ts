import { GradientType } from "flashport";
import { Sprite } from "flashport";
import { Matrix } from "flashport";

	
/**
 * ...
 * @author Kenny Lerma
 */
export class PlusSign extends Sprite
{
	
	constructor() 
	{
		super();
		
		var mat:Matrix = new Matrix();
		mat.createGradientBox(12*2,12*2,0,-12,-12);
		this.graphics.lineStyle(2, 0x464646, 1, true, "none");
		this.graphics.beginGradientFill(GradientType.RADIAL, [0x2BFF2B, 0x008000], [1, 1], [0, 255], mat, "linear");
		this.graphics.drawCircle(0, 0, 12);
		
		this.graphics.lineStyle(2, 0xFFFFFF, 1, true, "none");
		this.graphics.moveTo( -4, 0);
		this.graphics.lineTo(4, 0);
		this.graphics.moveTo(0, -4);
		this.graphics.lineTo(0, 4);
		
	}
	
}