import { Bitmap } from "@fp/flash/display/Bitmap";
import { BitmapData } from "@fp/flash/display/BitmapData";
import { DisplayObject } from "@fp/flash/display/DisplayObject";
import { Matrix } from "@fp/flash/geom/Matrix";
import { Rectangle } from "@fp/flash/geom/Rectangle";
/**
 * ...
 * @author Kenny Lerma
 */
export class ImageUtil 
{
	
	public static cropImage = (rect:DisplayObject, image:Bitmap):Bitmap =>
	{
		var bmd:BitmapData = new BitmapData(rect.width, rect.height, true, 0x00FFFFFF);
		var matrix:Matrix = new Matrix(1, 0, 0, 1, -rect.x + image.x, -rect.y + image.y);
		//matrix.scale(image.scaleX, image.scaleY);
		bmd.draw(image, matrix, null, null, new Rectangle(0, 0, rect.width, rect.height), true);
		var croppedBitmap:Bitmap = new Bitmap(bmd, "auto", true);
		
		return croppedBitmap;
	}
	
	public static redrawScaledImage = (image:DisplayObject):Bitmap =>
	{
		var result:BitmapData = new BitmapData(image.width, image.height, true, 0x00FFFFFF);
		var matrix:Matrix = new Matrix();
		matrix.scale(image.scaleX, image.scaleY);
		result.draw((image instanceof Bitmap) ? image.bitmapData : image, matrix, null, null, null, true);
		return new Bitmap(result, "auto", true);
	}
}