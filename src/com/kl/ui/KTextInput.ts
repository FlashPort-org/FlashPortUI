import { Sprite } from "@fp/flash/display/Sprite";
import { TextFieldType } from "@fp/flash/text/TextFieldType";
import { ITextInput } from "../interfaces/ITextInput";
import { KLabel } from "./KLabel";
import { MouseEvent } from "@fp/flash/events/MouseEvent";
import { KeyboardEvent } from "@fp/flash/events/KeyboardEvent";
import { FocusEvent } from "@fp/flash/events/FocusEvent";
import { TextField } from "@fp/flash/text/TextField";
import { TextFormat } from "@fp/flash/text/TextFormat";
/**
 * ...
 * @author Kenny Lerma
 */
export class KTextInput extends Sprite implements ITextInput
{
	private _width:number;
	private _height:number;
	private _textColor:number;
	private _backgroundColor:number;
	private _borderColor:number;
	private _hint:string;
	private _input:KLabel;
	
	constructor(width:number, height:number, textColor:number = 0xFFFFFF, backgroundColor:number = 0x464646, borderColor:number = 0xCCCCCC, hint:string = "") 
	{
		super();

		this._width = width;
		this._height = height;
		this._textColor = textColor;
		this._backgroundColor = backgroundColor;
		this._borderColor = borderColor;
		this._hint = hint;
		
		this.Draw();
	}
	
	private Draw = ():void =>
	{
		this.graphics.clear();
		this.graphics.lineStyle(1.5, this._borderColor, 1, true, "none");
		this.graphics.beginFill(this._backgroundColor);
		this.graphics.drawRoundRect(0, 0, this._width, this._height, 6, 6);
		
		this._input = new KLabel(this._hint, this._textColor);
		this._input.type = TextFieldType.INPUT;
		this._input.width = this.width - 5;
		this._input.height = this._height;
		this._input.x = 2;
		this._input.y = ((this._height + 2 - this._input.textHeight) / 2) - 2;
		this._input.alpha = .35;
		
		this._input.addEventListener(KeyboardEvent.KEY_DOWN, this.OnKeyDown);
		this._input.addEventListener(FocusEvent.FOCUS_OUT, this.OnFocusOut);
		this._input.addEventListener(MouseEvent.MOUSE_DOWN, this.OnMouseDown);
		
		this.addChild(this._input);
	}
	
	protected OnMouseDown = (e:MouseEvent):void =>
	{
		if (this._input.text == this._hint)
		{
			this._input.text = "";
			this._input.alpha = 1;
		}
	}
	
	protected OnKeyDown = (e:KeyboardEvent):void =>
	{
		if (this._input.text == this._hint)
		{
			this._input.text = "";
			this._input.alpha = 1;
		}
	}
	
	private OnFocusOut = (e:FocusEvent):void =>
	{
		if (this._hint && this._input.text == "")
		{
			this._input.text = this._hint;
			this._input.alpha = .35;
		}
	}
	
	public get textfield():TextField 
	{
		return this._input
	}
	
	public set text(value:string) 
	{
		this._input.text = value;
		this._input.alpha = 1;
		this._input.y = ((this._height + 2 - this._input.textHeight) / 2) - 2;
	}
	
	public get text():string 
	{
		return this._input.text;
	}
	
	public set maxChars(value:number) 
	{
		this._input.maxChars = value;
	}
	
	public set fontSize(value:number) 
	{
		var tf:TextFormat = this._input.getTextFormat();
		tf.size = value;
		this._input.defaultTextFormat = tf;
		this._input.setTextFormat(tf);
		this._input.y = ((this._height + 2 - this._input.textHeight) / 2) - 2;
	}
	
	public set underline(value:Boolean) 
	{
		var tf:TextFormat = this._input.getTextFormat();
		tf.underline = value;
		this._input.defaultTextFormat = tf;
		this._input.setTextFormat(tf);
	}
	
	public set align(value:string) 
	{
		var tf:TextFormat = this._input.getTextFormat();
		tf.align = value;
		this._input.defaultTextFormat = tf;
		this._input.setTextFormat(tf);
	}
	
	public set restrict(value:string) 
	{
		this._input.restrict = value;
	}
	
	public enableFocus = ():void =>
	{
		if (this.stage) 
		{
			//this.stage.focus = this._input;  TODO fix focus
			this._input.setSelection(0, 0);
		}
	}
}