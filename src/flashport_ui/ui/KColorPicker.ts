import { InterpolationMethod } from "flashport";
import { GradientType } from "flashport";
import { Shape } from "flashport";
import { SpreadMethod } from "flashport";
import { Sprite } from "flashport";
import { Matrix } from "flashport";
import { KTextInput } from './KTextInput';

/**
 * ...
 * @author Kenny Lerma
 */
export class KColorPicker extends Sprite
{
	private _width:number = 200;
	private _height:number = 200;
	private _colorPanel:ColorPanel;
	
	constructor() 
	{
		super();

		this.Draw();
	}
	
	private Draw = ():void =>
	{
		// color panel bg
		this.graphics.clear();
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xCCCCCC);
		this.graphics.drawRect(0, 0, 60, 20);
		
		this._colorPanel = new ColorPanel();
		this._colorPanel.y = this.height + 1;
		this.addChild(this._colorPanel);
	}
	
}


export class ColorPanel extends Sprite
{
	private _colorBar:Shape;
	private _gradient:Shape;
	private _marker:Shape;
	private _hex:KTextInput;
	
	private _color:number = 0xFFFFFF;
	private _alpha:number = 100;
	private _prevColor:number = 0xFFFFFF;
	private _prevAlpha:number = 1;
	private _brightness:number = 1;
	private _saturation:number = 0;
	private _hue:number = 0;
	private _red:number = 0;
	private _green:number = 0;
	private _blue:number = 0;
	
	constructor() 
	{
		super();
		
		// color panel bg
		this.graphics.clear();
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xCCCCCC);
		this.graphics.drawRect(0, 0, 250, 200);
		
		this._colorBar = new Shape();
		this._colorBar.x = 5;
		this._colorBar.y = 10;
		this.addChild(this._colorBar);
		
		this._gradient = new Shape();
		this._gradient.x = 5;
		this._gradient.y = 45;
		this.addChild(this._gradient);
		
		this._marker = new Shape();
		this._marker.graphics.clear();
		this._marker.graphics.lineStyle(2, 0xFFFFFF);
		this._marker.graphics.drawCircle(0, 0, 7);
		this._marker.graphics.lineStyle(1, 0x404040);
		this._marker.graphics.drawCircle(0, 0, 6);
		this.addChild(this._marker);
		
		this._hex = new KTextInput(60, 20);
		this._hex.x = this.width - this._hex.width - 25;
		this._hex.y = this.height - this._hex.height - 70;
		this._hex.text = "FFFFFF";
		this.addChild(this._hex);
		
		this.Draw();
	}
	
	private Draw = ():void =>
	{
		var mt:Matrix = new Matrix();
		mt.createGradientBox(150, this.height);
		this._colorBar.graphics.clear();
		this._colorBar.graphics.lineStyle(1, 0x404040);
		
		var colors:number[] = [0xFF0000, 0xFFFF00, 0xFF00, 0xFFFF, 0xFF, 0xFF00FF, 0xFF0000];
		//this._colorBar.graphics.beginGradientFill(GradientType.LINEAR, colors, null, null, mt, SpreadMethod.PAD, InterpolationMethod.RGB);
		//this._colorBar.graphics.drawRect(0, 0, 150, 15);
		
		this._colorBar.graphics.lineStyle(1, 0x404040);
		this._colorBar.graphics.beginFill(0x464646);
		this._colorBar.graphics.endFill();
		
		var hue:number = ((this._hue / 360) * 150);
		this._colorBar.graphics.lineStyle(1, 0xD6D6D6, 1, true);
		this._colorBar.graphics.beginFill(0x464646);
		this._colorBar.graphics.moveTo(hue, -2);
		this._colorBar.graphics.lineTo((hue + 4), -6);
		this._colorBar.graphics.lineTo((hue - 4), -6);
		mt.createGradientBox(150, 150);
		//colors = [0xFFFFFF, updateRGB(_hue)];
		//_colorTable.graphics.clear();
		//_colorTable.graphics.lineStyle(1, 0x404040);
		
		//_colorTable.scrollRect = new Rectangle(0, 0, 151, 151);
		
		
		this.drawGradient();
		
		
		mt.setTo(1, 0, 0, 1, 3, 0);
		
		/*
		this._resultBox.view.graphics.clear();
		this._resultBox.view.graphics.beginBitmapFill(nullBitmapData, mt);
		this._resultBox.view.graphics.drawRect(0, 0, 85, 40);
		this._resultBox.view.graphics.beginFill(this._color, this._alpha);
		this._resultBox.view.graphics.drawRect(0, 0, 85, 20);
		this._resultBox.view.graphics.beginFill(this._prevColor, this._alpha);
		this._resultBox.view.graphics.drawRect(0, 20, 85, 20);
		this._resultBox.view.graphics.lineStyle(1, Style.borderColor2);
		this._resultBox.view.graphics.beginFill(0, 0);
		this._resultBox.view.graphics.drawRect(0, 0, 85, 40);
		*/
		this._marker.x = ((this._saturation * 150) + this._gradient.x);
		this._marker.y = (150 - (this._brightness * 150) + this._gradient.y);
		
		/*
		var colorStr : String = this._color.toString(16);

		while (colorStr.length < 6) {
			colorStr = "0" + colorStr;
		}

		if (this._targetControl != null) {
			this._targetControl.color = this._color;
			this._targetControl.alpha = this._alpha;
		}

		if (this.view.stage != null && this.view.stage.focus != this._h.textField) {
			this._h.text = colorStr.toUpperCase();
		}*/
	}
	
	private drawGradient = ():void =>
	{
		var mt:Matrix = new Matrix();
		mt.createGradientBox(150, 150, (Math.PI / 2), 0, 0);
		this._gradient.graphics.clear();
		this._gradient.graphics.beginGradientFill(GradientType.LINEAR, [0, 0], [0, 1], [0, 255], mt, SpreadMethod.PAD);
		this._gradient.graphics.drawRect(0, 0, 150, 150);
	}
}