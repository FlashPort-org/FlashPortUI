import { Sprite } from "@fp/flash/display/Sprite";

/**
 * ...
 * @author Kenny Lerma
 */
export class TrashCan extends Sprite
{
	
	constructor() 
	{
		super();

		//base
		this.graphics.beginFill(0x800000);
		this.graphics.drawRoundRectComplex(0, 13, 40, 50, 5, 5, 9, 9);

		//lid
		this.graphics.beginFill(0x800000);
		this.graphics.drawRoundRectComplex(-2, 6, 44, 5, 5, 5, 0, 0);
		//lid handle
		this.graphics.drawRect(15, 0, 10, 5);

		//can lines
		this.graphics.moveTo(8, 21);
		this.graphics.lineStyle(2, 0xFFFFFF, 1, true);
		this.graphics.lineTo(8, 55);
		this.graphics.moveTo(20, 21);
		this.graphics.lineTo(20, 55);
		this.graphics.moveTo(32, 21);
		this.graphics.lineTo(32, 55);
		
		this.graphics.endFill();
	}
	
}