import { Stage } from "@flashport/flashport";
import { AEvent } from "@flashport/flashport";
import { TextFormatAlign } from "@flashport/flashport";
import { ITextInput } from "../interfaces/ITextInput";
import { KeyboardEvent } from "@flashport/flashport";
import { FocusEvent } from "@flashport/flashport";
import { MouseEvent } from "@flashport/flashport";
import { Keyboard } from "@flashport/flashport";
import { KTextInput } from "./KTextInput";
/**
 * ...
 * @author Kenny Lerma
 */
export class KSpinner extends KTextInput implements ITextInput
{
	private _lastX:number = 0;
	private _increment:number;
	private _decimals:number;
	private _mainStage:Stage;
	
	constructor(width:number, height:number, increment:number = 1, decimals:number = 0, textColor:number=0xFFFFFF, backgroundColor:number=0x464646, borderColor:number=0xCCCCCC) 
	{
		super(width, height, textColor, backgroundColor, borderColor);

		this._increment = increment;
		this._decimals = decimals;
		this.align = TextFormatAlign.CENTER;
		this.underline = true;
		this.fontSize = 12;
		this.text = "0";
		
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
	}
	
	private onAddedToStage = (e:Event):void =>
	{
		this._mainStage = this.stage;
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
		this.textfield.addEventListener(FocusEvent.FOCUS_IN, this.onFocusIn);
	}
	
	private onFocusIn = (e:FocusEvent):void =>
	{
		this.textfield.addEventListener(KeyboardEvent.KEY_UP, this.onKeyUp);
		this._mainStage.addEventListener(FocusEvent.FOCUS_OUT, this.onFocusOut);
	}
	
	private onFocusOut = (e:FocusEvent):void =>
	{
		this._mainStage.removeEventListener(KeyboardEvent.KEY_UP, this.onKeyUp);
		this.textfield.removeEventListener(FocusEvent.FOCUS_OUT, this.onFocusOut);
		this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	private onKeyUp = (e:KeyboardEvent):void =>
	{
		if (this._mainStage && this._mainStage.focus == this.textfield && e.keyCode == Keyboard.ENTER)
		{
			this.dispatchEvent(new AEvent(AEvent.CHANGE));
		}
	}
	
	protected override OnMouseDown = (e:MouseEvent):void =>
	{
		super.OnMouseDown(e);
		this.textfield.setSelection(0, this.text.length);
		this._lastX = this.stage.mouseX;
		this._mainStage.addEventListener(MouseEvent.MOUSE_MOVE, this.OnMouseMove);
		this._mainStage.addEventListener(MouseEvent.MOUSE_UP, this.OnMouseUp);
	}
	
	private OnMouseUp = (e:MouseEvent):void =>
	{
		this._mainStage.removeEventListener(MouseEvent.MOUSE_MOVE, this.OnMouseMove);
		this._mainStage.removeEventListener(MouseEvent.MOUSE_UP, this.OnMouseUp);
	}
	
	private OnMouseMove = (e:MouseEvent):void =>
	{
		if (this.stage.mouseX > this._lastX)
		{
			this.text = Number(Number(this.text) + this._increment).toFixed(this._decimals);
		}
		else if (this.stage.mouseX < this._lastX)
		{
			this.text = Number(Number(this.text) - this._increment).toFixed(this._decimals);
		}
		this.textfield.setSelection(0, this.text.length);
		this._lastX = this.stage.mouseX;
		
		this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	public set value(n:number) 
	{
		this.text = n.toFixed(this._decimals);
	}
	
	public get value():number 
	{
		return Number(this.text);
	}
}