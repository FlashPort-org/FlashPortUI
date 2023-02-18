import { Tweener } from "flashport";
import { GradientType } from "flashport";
import { Sprite } from "flashport";
import { AEvent } from "flashport";
import { MouseEvent } from "flashport";
import { Matrix } from "flashport";
import { TextField } from "flashport";
import { TextFieldAutoSize } from "flashport";
import { TextFormat } from "flashport";

/**
 * Custom button class for Admin Panel.
 * @author Kenny Lerma
 * @since 1.1.2011
 * @langversion 3.0
 * @playerversion Flash 10.1
*/
export class KButton extends Sprite
{
	private _nameText:string;
	private _fontSize:number;
	private _buttonName:TextField;
	private _pulseBG:Sprite;
	private _data:any;
	private _storedWidth:number;
	private _storedHeight:number;
	private _storedX:number;
	private _storedY:number;
	private _active:boolean = false;
	private _pulsate:boolean = false;
	private _origX:number;
	private _origY:number;
	
	/**
	 * Stores the name to display on the button.
	 * @param	name	the name on the button.
	 */
	constructor(name:string, fontSize:number = 14) 
	{
		super();

		this._nameText = name;
		this._fontSize = fontSize;
		
		this.Draw();
		
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
	}
	
	private onAddedToStage = (e:Event):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
		if (!this._active)
		{
			this.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
			this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
		}
	}
	
	private onMouseOver = (e:MouseEvent):void =>
	{
		this.addEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
		
		this._storedX = this.x;
		this._storedY = this.y;
		
		var prevWidth:number = this.width;
		var prevHeight:number = this.height;
		
		this.scaleX = this.scaleY = 1.05;
		
		var diffX:number = this.width - prevWidth;
		var diffY:number = this.height - prevHeight;
		
		this.x -= diffX / 2;
		this.y -= diffY / 4;
	}
	
	private onMouseOut = (e:MouseEvent):void =>
	{
		this.removeEventListener(MouseEvent.MOUSE_OUT, this.onMouseOut);
		
		this.scaleX = this.scaleY = 1;
		
		this.x = this._storedX;
		this.y = this._storedY;
	}
	
	private onMouseUp = (e:MouseEvent):void =>
	{
		var prevWidth:number = this.width;
		var prevHeight:number = this.height;
		
		this.scaleX = this.scaleY = 1.05;
		
		var diffX:number = this.width - prevWidth;
		var diffY:number = this.height - prevHeight;
		
		this.x -= diffX / 2;
		this.y -= diffY / 4;
	}
	
	private onMouseDown = (e:MouseEvent):void =>
	{
		this.scaleX = this.scaleY = 1;
		
		this.x = this._storedX;
		this.y = this._storedY;
	}
	
	private Draw = ():void =>
	{	
		this.graphics.clear();
		
		if(!this._buttonName) this._buttonName = new TextField();
		this._buttonName.defaultTextFormat = new TextFormat("Arial", this._fontSize, 0x464646, true);
		//buttonName.embedFonts = true;
		this._buttonName.autoSize = TextFieldAutoSize.CENTER;
		this._buttonName.wordWrap = false;
		this._buttonName.selectable = false;
		this._buttonName.text = this._nameText;
		this._buttonName.x = 5;
		this._buttonName.y = 0;
		this.addChild(this._buttonName);
		
		var colors:number[] = [0xFFFFFF, 0x999999];
		var alphas:number[] = [1, 1];
		var ratios:number[] = [127, 255];
		var matrix:Matrix = new Matrix()
		matrix.createGradientBox(this._buttonName.textWidth + 15, this._buttonName.height + 13, 90/180*Math.PI);
		
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, matrix );
		//this.graphics.beginFill(0xFFFFFF);
		
		this.graphics.drawRoundRect(0, 0, this._buttonName.textWidth + 15, this._buttonName.textHeight + 13, 6, 6);
		this._buttonName.y = ((this.height - this._buttonName.textHeight) / 2) - 2;
		
		this.mouseChildren = false;
		this.buttonMode = true;
		this._storedWidth = this.width;
		this._storedHeight = this.height;
		
		if (this._origX) this.x = this._origX;
		if (this._origY) this.y = this._origY;
	}
	
	/**
	 * Method to store custom data.
	 */
	public get data():any
	{
		return this._data;
	}
	
	/**
	 * Method to retrieve custom data.
	 */
	public set data(value:any) 
	{
		this._data = value;
	}
	
	/**
	 * Set the button to an active or inactive state.
	 */
	public set active(value:boolean)
	{
		if (value == true)
		{
			this.alpha = 1;
			this._active = false;
			this.buttonMode = true;
			this.addEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
			this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
		}
		else
		{
			this.alpha = .50;
			this._active = true;
			this.buttonMode = false;
			this.removeEventListener(MouseEvent.MOUSE_OVER, this.onMouseOver);
			this.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
			this.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
		}
	}
	
	public get active():boolean 
	{
		return this._active;
	}
	
	public set label(value:string) 
	{
		this._nameText = value;
		if (!this._origX)
		{
			this._origX = this.x;
			this._origY = this.y;
		}
		this.Draw();
	}
	
	public set pulsate(value:boolean) 
	{
		this._pulsate = value;
		
		if (this._pulsate)
		{
			if (!this._pulseBG)
			{
				this._pulseBG = new Sprite();
				this._pulseBG.graphics.lineStyle(1.5, 0x666666, 1, true);
				this._pulseBG.graphics.beginFill(0x800000);
				this._pulseBG.graphics.drawRoundRect(0, 0, this._buttonName.textWidth + 15, this._buttonName.height + 13, 9, 9);
				this.addChildAt(this._pulseBG, 0);
			}
			this.onPulseOut();
		}
		else
		{
			if(this._pulseBG) this._pulseBG.alpha = 0;
		}
	}
	
	private onPulseOut = ():void =>
	{
		if (this._pulsate)
		{
			Tweener.addTween(this._pulseBG, { time:.5, alpha:.2, onComplete:this.onPulseIn } );
		}
		else
		{
			this._pulseBG.alpha = 0;
		}
	}
	
	private onPulseIn = ():void =>
	{
		if (this._pulsate)
		{
			Tweener.addTween(this._pulseBG, { time:.5, alpha:0, onComplete:this.onPulseOut } );
		}
		else
		{
			this._pulseBG.alpha = 0;
		}
	}
}