import { DisplayObject } from "flashport";
import { GradientType } from "flashport";
import { Sprite } from "flashport";
import { Stage } from "flashport";
import { AEvent } from "flashport";
import { Matrix } from "flashport";
import { TextFormatAlign } from "flashport";
import { ITextInput } from "../interfaces/ITextInput";
import { KSpinner } from "./KSpinner";
import { MouseEvent } from "flashport";
import { DEvent } from "../events/DEvent";
import { KTextInput } from "./KTextInput";

/**
 * ...
 * @author Kenny Lerma
 */
export class KStepper extends Sprite
{
	public static readonly RIGHT:string = "right";
	public static readonly LEFT:string = "left";
	public static readonly TOP:string = "top";
	public static readonly BOTTOM:string = "bottom";
	
	private _mainStage:Stage;
	private _topHandle:Sprite;
	private _bottomHandle:Sprite;
	private _topTri:Sprite;
	private _bottomTri:Sprite;
	private _currentDown:Sprite;
	private _inputText:ITextInput;
	private _showInput:boolean;
	private _labelSide:string;
	private _useStepper:boolean;
	private _stepValue:number;
	private _value:number = 0;
	private _isIncrement:boolean = false;
	
	constructor(stepValue:number = 1, showInputField:boolean = true, labelSide:string = "right", useStepper:boolean = false) 
	{
		super();

		this._stepValue = stepValue;
		this._showInput = showInputField;
		this._labelSide = labelSide;
		this._useStepper = useStepper;
		
		this.Draw();
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
	}
	
	private onAddedToStage = (e:AEvent):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.onAddedToStage);
		this.addEventListener(AEvent.REMOVED_FROM_STAGE, this.onRemovedFromStage);
		this._mainStage = this.stage;
		this.enable();
	}
	
	private onRemovedFromStage = (e:Event):void =>
	{
		this.removeEventListener(AEvent.REMOVED_FROM_STAGE, this.onRemovedFromStage);
		this.disable();
		this._mainStage = null;
	}
	
	private Draw = ():void =>
	{
		var colors:number[] = [0xFFFFFF, 0x999999];
		var alphas:number[] = [1, 1];
		var ratios:number[] = [127, 255];
		var matrix:Matrix = new Matrix()
		matrix.createGradientBox(35, 17, 90 / 180 * Math.PI);
		
		this._topHandle = new Sprite();
		this._topHandle.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this._topHandle.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, matrix );
		this._topHandle.graphics.drawRoundRect(0, 0, 35, 14, 5, 5);
		this._topHandle.mouseChildren = false;
		this._topHandle.buttonMode = true;
		this._topHandle.name = "top";
		
		this._bottomHandle = new Sprite();
		this._bottomHandle.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this._bottomHandle.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, matrix );
		this._bottomHandle.graphics.drawRoundRect(0, 0, 35, 14, 5, 5);
		this._bottomHandle.y = this._topHandle.height;
		this._bottomHandle.mouseChildren = false;
		this._bottomHandle.buttonMode = true;
		this._bottomHandle.name = "bottom";
		
		this._topTri = new Sprite();
		this._topTri.graphics.lineStyle(1.25, 0xCCCCCC, 1, true, "none");
		this._topTri.graphics.beginFill(0x000000, 0.5);
		this._topTri.graphics.moveTo(0,-3);
		this._topTri.graphics.lineTo(5,4);
		this._topTri.graphics.lineTo(-5,4);
		this._topTri.graphics.lineTo(0,-3);
		this._topTri.graphics.endFill();
		this._topTri.x = this._topHandle.width / 2;
		this._topTri.y = this._topHandle.height / 2;
		this._topHandle.addChild(this._topTri);
		
		this._bottomTri = new Sprite();
		this._bottomTri.graphics.lineStyle(1.25, 0xCCCCCC, 1, true, "none");
		this._bottomTri.graphics.beginFill(0x000000, 0.5);
		this._bottomTri.graphics.moveTo(0,-3);
		this._bottomTri.graphics.lineTo(5,4);
		this._bottomTri.graphics.lineTo(-5,4);
		this._bottomTri.graphics.lineTo(0,-3);
		this._bottomTri.graphics.endFill();
		this._bottomTri.x = this._bottomHandle.width / 2;
		this._bottomTri.y = this._bottomHandle.height / 2;
		this._bottomTri.rotation = 180;
		this._bottomHandle.addChild(this._bottomTri);
		
		this.addChild(this._topHandle);
		this.addChild(this._bottomHandle);
		
		if (this._showInput)
		{
			this._inputText = this._useStepper ? new KSpinner(this.width, this.height) : new KTextInput(this.width, this.height);
			this._inputText.align = TextFormatAlign.CENTER;
			this._inputText.text = "0";
			
			switch (this._labelSide) 
			{
				case KStepper.LEFT:
					this._topHandle.x = this._inputText.width;
					this._bottomHandle.x = this._inputText.width;
				break;
				
				case KStepper.RIGHT:
					this._inputText.x = this.width;
				break;
				
				case KStepper.TOP:
					this._topHandle.y = this._inputText.height;
					this._bottomHandle.y = this._topHandle.y + this._topHandle.height;
					
				case KStepper.BOTTOM:
					this._inputText.y = this.height;
				break;
			}
			
			this._inputText.addEventListener(AEvent.CHANGE, this.inputChanged);
			this.addChild(this._inputText as KSpinner | KTextInput);
		}
	}
	
	public enable = ():void =>
	{
		if (this._inputText) this._inputText.addEventListener(AEvent.CHANGE, this.inputChanged);
		this._topHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
		this._bottomHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
		this._mainStage.addEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
	}
	
	public disable = ():void =>
	{
		if (this._inputText) this._inputText.removeEventListener(AEvent.CHANGE, this.inputChanged);
		this._topHandle.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
		this._bottomHandle.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
		this._mainStage.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseUp);
	}
	
	private onMouseDown = (e:MouseEvent):void =>
	{
		this._currentDown = e.currentTarget as Sprite;
		
		var prevWidth:number = e.currentTarget.width;
		var prevHeight:number = e.currentTarget.height;
		
		e.currentTarget.scaleX = e.currentTarget.scaleY = .95;
		
		var diffX:number = prevWidth - e.currentTarget.width;
		var diffY:number = prevHeight - e.currentTarget.height;
		
		e.currentTarget.x += diffX / 2;
		e.currentTarget.y += diffY / 4;
		
		if (this._currentDown.name == "top")
		{
			this._isIncrement = true;
			this._value += this._stepValue;
			
			if (this._inputText) this._inputText.text = this._value.toString();
		}
		else
		{
			this._isIncrement = false;
			this._value -= this._stepValue;
			if (this._inputText) this._inputText.text = this._value.toString();
		}
		
		this.dispatchEvent(new DEvent(AEvent.CHANGE, this._value));
	}
	
	private onMouseUp = (e:MouseEvent):void =>
	{
		if (!this._currentDown) return;
		
		var prevWidth:number = this._currentDown.width;
		var prevHeight:number = this._currentDown.height;
		
		this._currentDown.scaleX = this._currentDown.scaleY = 1;
		
		var diffX:number = prevWidth - this._currentDown.width;
		var diffY:number = prevHeight - this._currentDown.height;
		
		this._currentDown.x += diffX / 2;
		this._currentDown.y += diffY / 4;
	}
	
	private inputChanged = (e:Event):void =>
	{
		this._value = parseFloat(this._inputText.text);
		this.dispatchEvent(new DEvent(AEvent.CHANGE, this._value));
	}
	
	public get value():number 
	{
		return this._value;
	}
	
	public set value(value:number) 
	{
		this._value = value;
		if (this._inputText) this._inputText.text = this._value.toString();
	}
	
	public get isIncrement():boolean 
	{
		return this._isIncrement;
	}
	
}