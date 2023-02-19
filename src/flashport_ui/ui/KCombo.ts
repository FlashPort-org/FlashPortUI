import { Sprite } from "@flashport/flashport";
import { TextField } from "@flashport/flashport";
import { MouseEvent } from "@flashport/flashport";
import { KScrollbar } from './KScrollbar';
import { AEvent } from "@flashport/flashport";
import { DEvent } from "../events/DEvent";
import { Matrix } from "@flashport/flashport";
import { GradientType } from "@flashport/flashport";
import { Shape } from "@flashport/flashport";
import { TextFormat } from "@flashport/flashport";
import { TextFieldAutoSize } from "@flashport/flashport";

	
/**
 * ...
 * @author Kenny Lerma
 */
export class KCombo extends Sprite
{
	public static readonly OPEN_UP:string = "openUP";
	public static readonly OPEN_DOWN:string = "openDown";
	
	private _width:number;
	private _height:number;
	private _openDir:string;
	private _prompt:string;
	
	private _header:Sprite;
	private _itemMenu:Sprite;
	private _msk:Sprite;
	private _itemContainer:Sprite;
	private _selectedItemText:TextField;
	private _items:ComboItem[] = [];
	private _scrollbar:KScrollbar;
	
	private _selectedItem:ComboItem;
	
	
	constructor(width:number = 150, height:number = 25, openDir:string = "openDown", prompt:string = "Select One") 
	{
		super();
		
		this.name = "KCombo";
		this._width = width;
		this._height = height;
		this._openDir = openDir;
		this._prompt = prompt;
		
		this._header = new Sprite();
		this._header.mouseChildren = false;
		this._header.buttonMode = true;
		this._header.name = "header";
		this.addChild(this._header);
		
		this._itemMenu = new Sprite();
		this._itemMenu.name = "_itemMenu";
		this._msk = new Sprite();
		this._msk.name = "mask";
		this._itemContainer = new Sprite();
		this._itemContainer.name = "_itemContainer";
		
		this._scrollbar = new KScrollbar((this._height * 6) - 6, 20);
		this._scrollbar.name = "scrollbar";
		this._scrollbar.rotation = 90;
		this._scrollbar.y = 2;
		this._scrollbar.x = this._width + 2;
		
		this.Draw();
		
		this._header.addEventListener(MouseEvent.CLICK, this.OnHeaderClicked);
	}
	
	public addItem = (title:string, iconPath:string = "", color:number = 0x000000, params:Object = null):void =>
	{
		this._items.push(new ComboItem(this._height, this._width, title, color, iconPath, params));
		
		for (var i:number = 0; i < this._items.length; i++) 
		{
			var item:ComboItem = this._items[i];
			item.name = "item" + i;
			item.y = (item.height * i) - (i * 2);
			item.addEventListener(MouseEvent.CLICK, this.OnItemClicked);
			this._itemContainer.addChild(item);
		}
		
		this._itemContainer.graphics.clear();
		this._itemContainer.graphics.beginFill(0xFFFFFF, 1);
		this._itemContainer.graphics.drawRect(0, 0, this._itemContainer.width, this._itemContainer.height);
		
		for (var itm of this._items) 
		{
			itm.updateSize(this._itemContainer.width - 1);
		}
		
		var maskHeight:number = (this._items.length > 6) ? (this._height * 6) - 6 : (this._height * this._items.length) - 6;
		this._msk.graphics.clear();
		this._msk.graphics.beginFill(0xFFFFFF, 0);
		this._msk.graphics.drawRect(0, 0, this._itemContainer.width + 1 + this._scrollbar.width, maskHeight + ((this._openDir == KCombo.OPEN_DOWN) ? 3 : 0));
		
		this._scrollbar.x = Math.floor(this._itemContainer.width) + Math.floor(this._scrollbar.width) - 1;
		if(this._items.length > 6) this._itemMenu.addChild(this._scrollbar);
	}
	
	public removeAllItems = ():void =>
	{
		for (var item of this._items) 
		{
			this._itemContainer.removeChild(item);
			item.destroy();
		}
		
		this._items = [];
		this._itemContainer.graphics.clear();
		this._msk.graphics.clear();
		if (this._itemMenu.contains(this._scrollbar)) this._itemMenu.removeChild(this._scrollbar);
		this.reset();
	}
	
	private OnItemClicked = (e:MouseEvent):void =>
	{
		var cItem:ComboItem = e.target as ComboItem;
		this._selectedItem = cItem;
		this._selectedItemText.text = cItem.title;
		this.OnRollout();
		this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	private OnHeaderClicked = (e:MouseEvent):void =>
	{
		if (this.contains(this._itemMenu))
		{
			this.OnRollout();
			return;
		}
		
		this._itemMenu.y = (this._openDir == KCombo.OPEN_UP) ? -this._msk.height : this._header.height - 2;
		this.addChild(this._itemMenu);
		this.addEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		
		this._scrollbar.addEventListener(KScrollbar.SLIDE_CHANGE, this.OnScrollbarChange);
		if (this._items.length > 6) this.addEventListener(MouseEvent.MOUSE_WHEEL, this.OnMouseWheel);
		
		this.dispatchEvent(new AEvent(AEvent.OPEN));
	}
	
	private OnMouseWheel = (e:MouseEvent):void =>
	{
		if (e.delta < 0)
		{
			if (this._scrollbar.value + Math.abs((e.delta / 3) * .1) < 1) this._scrollbar.value += Math.abs((e.delta / 3) * .1);
			else this._scrollbar.value = 1;
		}
		else if (e.delta > 0)
		{
			if (this._scrollbar.value - Math.abs((e.delta / 3) * .1) > 0) this._scrollbar.value -= Math.abs((e.delta / 3) * .1);
			else this._scrollbar.value = 0;
		}
	}
	
	private OnScrollbarChange = (e:DEvent):void =>
	{
		var scrollArea:number = this._itemContainer.height - this._msk.height;
		this._itemContainer.y = -(scrollArea * e.data);
	}
	
	private OnRollout = (e:MouseEvent = null):void =>
	{
		if (this._scrollbar.isMouseDown) return;
		
		this.removeEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
		this._scrollbar.removeEventListener(KScrollbar.SLIDE_CHANGE, this.OnScrollbarChange);
		this.stage.removeEventListener(MouseEvent.MOUSE_WHEEL, this.OnMouseWheel);
		if (this.contains(this._itemMenu)) this.removeChild(this._itemMenu);
	}
	
	private Draw = ():void =>
	{
		this._header.graphics.clear();
		
		var colors:number[] = [0xFFFFFF, 0x999999];
		var alphas:number[] = [1, 1];
		var ratios:number[] = [127, 255];
		var matrix:Matrix = new Matrix()
		matrix.createGradientBox(this._width, this._height, 90/180*Math.PI);
		
		this._header.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this._header.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, matrix );
		this._header.graphics.drawRoundRect(0, 0, this._width, this._height, 6, 6);
		this._header.graphics.moveTo(this._width - 20, 0);
		this._header.graphics.lineTo(this._width - 20, this._height);
		
		var triangle:Shape = this.drawTriangle(0, 0, 8, 0x464646);
		triangle.x = this.width - triangle.width;
		triangle.y = (this._height - triangle.height);
		this._header.addChild(triangle);
		
		var tf:TextFormat = new TextFormat("Arial", 14, 0x000000, true);
		this._selectedItemText = new TextField();
		this._selectedItemText.defaultTextFormat = tf;
		this._selectedItemText.multiline = false;
		this._selectedItemText.wordWrap = false;
		this._selectedItemText.autoSize = TextFieldAutoSize.LEFT;
		this._selectedItemText.text = this._prompt;
		this._selectedItemText.height = this._selectedItemText.textHeight + 2;
		this._selectedItemText.x = 2;
		this._selectedItemText.y = ((this.height - this._selectedItemText.height) / 2) - 2;
		
		var headerMask:Sprite = new Sprite();
		headerMask.graphics.beginFill(0xFFFFFF, 0);
		headerMask.graphics.drawRect(0, 0, this._width - 22, this._height);
		this._selectedItemText.mask = headerMask;
		this._header.addChild(this._selectedItemText);
		this._header.addChild(headerMask);
		
		
		this._msk.graphics.clear();
		this._msk.graphics.beginFill(0xFFFFFF,0);
		var maskHeight:number = (this._items.length > 6) ? (this._height * 6) - 6 : (this._height * this._items.length) - 6;
		this._msk.graphics.drawRect(0, 0, this._width + 1 + this._scrollbar.width, maskHeight);
		this._itemContainer.mask = this._msk;
		this._itemMenu.addChild(this._itemContainer);
		this._itemMenu.addChild(this._msk);
	}
	
	private drawTriangle = (x:number, y:number, height:number, color:number):Shape =>
	{
		var triangle:Shape = new Shape; 
		triangle.graphics.beginFill(color);
		triangle.graphics.moveTo(height/2, y);
		triangle.graphics.lineTo(height, height+y);
		triangle.graphics.lineTo(x, height+y);
		triangle.graphics.lineTo(height / 2, y);
		triangle.rotation = 180;
		return triangle;  
	}
	
	public selectedIndex = (index:number, dispatch:Boolean = false):void =>
	{
		var selectedItem:ComboItem = this._items[index];
		selectedItem.selected = true;
		this._selectedItem = selectedItem;
		this._selectedItemText.text = selectedItem.title;
		if(dispatch) this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	public get getSelectedIndex():number 
	{
		for (var i:number = 0; i < this._items.length; i++) 
		{
			if (this._items[i] == this._selectedItem)
			{
				return i;
			}
		}
		
		return -1;
	}
	
	public get selectedItem():ComboItem 
	{
		return this._selectedItem;
	}
	
	public get selectedItemParams():Object 
	{
		return this._selectedItem.params;
	}
	
	public reset = ():void =>
	{
		this._scrollbar.value = 0;
		this._itemContainer.y = 0;
		this._selectedItemText.text = this._prompt;
		this._selectedItem = null;
	}
	
	public selectLastItem = ():void =>
	{
		if (this._items.length > 0)
		{
			var lastItem:ComboItem = this._items[this._items.length - 1];
			lastItem.selected = true;
			this._selectedItem = lastItem;
			this._selectedItemText.text = lastItem.title;
			this.dispatchEvent(new AEvent(AEvent.CHANGE));
		}
	}
	
	public labelExists = (label:string):number =>
	{
		for (var i:number = 0; i < this._items.length; i++) 
		{
			if (this._items[i].title == label)
			{
				return i;
			}
		}
		return -1;
	}
}


export class ComboItem extends Sprite
{
	private _width:number;
	private _height:number;
	private _title:string;
	private _params:Object;
	private _selected:Boolean = false;
	
	constructor(height:number, width:number, title:string, color:number = 0x000000, iconPath:string = "", params:Object = null)
	{
		super();

		this._width = width;
		this._height = height;
		this._title = title;
		this._params = params;
		
		this.mouseChildren = false;
		this.buttonMode = true;
		
		this.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRect(0, 0, this._width, this._height);
		
		var tf:TextFormat = new TextFormat("Arial", 14, color, true);
		var header:TextField = new TextField();
		header.defaultTextFormat = tf;
		header.wordWrap = false;
		header.multiline = false;
		header.autoSize = TextFieldAutoSize.LEFT;
		header.text = title;
		header.x = 2;
		header.y = ((this.height - header.height) / 2) - 2;
		this.addChild(header);
		
		this.addEventListener(MouseEvent.ROLL_OVER, this.OnRollover);
	}
	
	public destroy = ():void =>
	{
		this.graphics.clear();
		this.removeEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
	}
	
	private OnRollover = (e:MouseEvent):void =>
	{
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xCCCCCC);
		this.graphics.drawRect(0, 0, this._width, this._height);
		
		this.addEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
	}
	
	private OnRollout = (e:MouseEvent):void =>
	{
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRect(0, 0, this._width, this._height);
		
		this.removeEventListener(MouseEvent.ROLL_OUT, this.OnRollout);
	}
	
	public updateSize = (size:number):void =>
	{
		this._width = size;
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRect(0, 0, size, this._height);
	}
	
	
	public get selected():Boolean 
	{
		return this._selected;
	}
	
	public set selected(value:Boolean) 
	{
		this._selected = value;
	}
	
	public get title():string 
	{
		return this._title;
	}
	
	public get params():any 
	{
		return this._params;
	}
	
}