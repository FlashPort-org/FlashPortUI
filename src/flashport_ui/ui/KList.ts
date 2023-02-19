import { Equations } from "@flashport/flashport";
import { Tweener } from "@flashport/flashport";
import { DisplayObject } from "@flashport/flashport";
import { Sprite } from "@flashport/flashport";
import { AEvent } from "@flashport/flashport";
import { MouseEvent } from "@flashport/flashport";
import { DEvent } from "../events/DEvent";
import { KListItem } from "./KListItem";
import { KScrollbar } from "./KScrollbar";
	
/**
 * ...
 * @author Kenny Lerma
 */
export class KList extends Sprite 
{
	private _width:number;
	private _height:number;
	private _container:Sprite;
	private _containerMask:Sprite;
	private _scrollbar:KScrollbar;
	private _selectedItem:KListItem;
	private _items:KListItem[] = [];
	
	constructor(WIDTH:number, HEIGHT:number) 
	{
		super();
		
		this._width = WIDTH;
		this._height = HEIGHT;
		
		this._container = new Sprite();
		this._scrollbar = new KScrollbar(this._height - 3.5, 18);
		this._scrollbar.rotation = 90;
		this._scrollbar.x = this._width - 2;
		this._scrollbar.y = 2;
		this._scrollbar.active = false;
		
		this.Draw();
		
		this.addChild(this._container);
		this.addChild(this._scrollbar);
	}
	
	private Draw = ():void =>
	{
		this.graphics.clear();
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xCCCCCC);
		this.graphics.drawRect(0, 0, this._width, this._height);
		
		this._containerMask = new Sprite();
		this._containerMask.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this._containerMask.graphics.beginFill(0xFFFFFF);
		this._containerMask.graphics.drawRect(0, 5, this._width, this._height - 10);
		this.addChild(this._containerMask);
		this._container.mask = this._containerMask;
	}
	
	public addItem = (title:string, fontSize:number = 16, params:Object = null, deleteEnabled:boolean = false, icon:DisplayObject = null ):void =>
	{
		var newItem:KListItem = new KListItem(title, fontSize, params, icon, deleteEnabled);
		newItem.addEventListener(KListItem.DELETE_ITEM, this.OnDeleteItem);
		newItem.updateWidth = this._width - this._scrollbar.width - 10;
		this._items.push(newItem);
		this.RefreshList();
	}
	
	public addItems = (items:KListItem[]):void =>
	{
		for (var item of items) 
		{
			item.addEventListener(KListItem.DELETE_ITEM, this.OnDeleteItem);
			item.updateWidth = this._width - this._scrollbar.width - 10;
			this._items.push(item);
		}
		this.RefreshList();
	}
	
	public removeAll = ():void =>
	{
		for (var item of this._items) 
		{
			if (this._container.contains(item)) this._container.removeChild(item);
		}
		this._items = [];
		this._selectedItem = null;
		this.RefreshList();
		this._scrollbar.value = 0;
	}
	
	private OnDeleteItem = (e:AEvent):void =>
	{
		var item:KListItem = e.target as KListItem
		item.active = false;
		
		this.RefreshList();
	}
	
	private RefreshList = ():void =>
	{
		var lastY:number = 2;
		
		for (var i:number = 0; i < this._items.length; i++) 
		{
			var item:KListItem = this._items[i];
			if (item.active)
			{
				item.x = 5;
				item.y = lastY;
				item.doubleClickEnabled = true;
				item.addEventListener(MouseEvent.CLICK, this.OnItemClicked);
				item.addEventListener(MouseEvent.DOUBLE_CLICK, this.OnItemClicked);
				this._container.addChild(item);
				
				lastY = item.y + item.height + 2;
			}
			else
			{
				this._container.removeChild(item);
				this._items.splice(i, 1);
				item.removeEventListener(MouseEvent.CLICK, this.OnItemClicked);
				item.removeEventListener(MouseEvent.DOUBLE_CLICK, this.OnItemClicked);
				i--;
			}
		}
		
		if (this._container.height > this._height)
		{
			this._scrollbar.active = true;
			this._scrollbar.addEventListener(KScrollbar.SLIDE_CHANGE, this.OnScrollbarChange);
			this.addEventListener(MouseEvent.MOUSE_WHEEL, this.OnMouseWheel);
		}
		else
		{
			this._scrollbar.active = false;
			this._scrollbar.removeEventListener(KScrollbar.SLIDE_CHANGE, this.OnScrollbarChange);
			this.removeEventListener(MouseEvent.MOUSE_WHEEL, this.OnMouseWheel);
		}
		
		this._scrollbar.value = this._scrollbar.value;
	}
	
	private OnMouseWheel = (e:MouseEvent):void =>
	{
		var topBottomPadding:number = 2;
		var scrollRate:number = (this._items[0].height + 3) / (this._container.height - this._containerMask.height);
		//trace("Rate: " + scrollRate + ", Delta: " + e.delta);
		
		if (e.delta < 0)
		{
			if (this._scrollbar.value + Math.abs((e.delta / 3) * .1) < 1) this._scrollbar.value += Math.abs((e.delta / 3) * scrollRate);
			else this._scrollbar.value = 1;
		}
		else if (e.delta > 0)
		{
			if (this._scrollbar.value - Math.abs((e.delta / 3) * .1) > 0) this._scrollbar.value -= Math.abs((e.delta / 3) * scrollRate);
			else this._scrollbar.value = 0;
		}
	}
	
	private OnScrollbarChange = (e:DEvent):void =>
	{
		var topBottomPadding:number = 2;
		var scrollArea:number = this._container.height - this._containerMask.height + topBottomPadding;
		
		Tweener.addTween(this._container, { time:.5, y: -(scrollArea * e.data), transition:Equations.easeOutExpo } );
	}
	
	private OnItemClicked = (e:MouseEvent):void =>
	{
		this._selectedItem = e.currentTarget as KListItem;
		this.clearSelected(this._selectedItem);
		this._selectedItem = e.currentTarget as KListItem;
		this._selectedItem.selected = true;
		this.dispatchEvent(new AEvent(AEvent.CHANGE));
	}
	
	public clearSelected = (excludeItem:KListItem = null):void =>
	{
		for (var item of this._items) 
		{
			if (excludeItem == null || excludeItem != item)
			{
				item.selected = false;
			}
		}
		this._selectedItem = null;
	}
	
	public get selectedItem():KListItem 
	{
		return this._selectedItem;
	}
	
	public sortOn = (param:any, sortType:number, DESCENDING:boolean = false):void =>
	{
		
		var sortingFunction = function(a:KListItem, b:KListItem):number
		{
			if (a.params[param].valueOf() < b.params[param].valueOf()) return -1; //ITEM A is before ITEM B
			else if (a.params[param].valueOf() > b.params[param].valueOf()) return 1; //ITEM A is after ITEM B
			else return 0; //ITEM A and ITEM B have same date
		}
		
		if (sortType == 16) // Numeric
		{
			this._items.sort(sortingFunction);
			if (DESCENDING) this._items.reverse();
		}
		
		this.RefreshList();
	}
	
	public selectedIndex = (index:number, dispatch:boolean = false):void =>
	{
		if (index < this._items.length)
		{
			if (this._selectedItem) this._selectedItem.selected = false;
			this._selectedItem = this._items[index];
			this._selectedItem.selected = true;
			if (dispatch) this.dispatchEvent(new AEvent(AEvent.CHANGE));
		}
	}
	
	public selectLastItem = ():void =>
	{
		this.clearSelected();
		
		if (this._items.length > 0)
		{
			var lastItem:KListItem = this._items[this._items.length - 1];
			lastItem.selected = true;
			this._selectedItem = lastItem;
		}
	}
	
	public getItemAt = (index:number):KListItem =>
	{
		if (index < this._items.length)
		{
			return this._items[index];
		}
		return null
	}
	
	public get length():number 
	{
		return this._items.length;
	}
}