import { Bitmap } from "flashport";
import { BitmapData } from "flashport";
import { Sprite } from "flashport";
import { Stage } from "flashport";
import { AEvent } from "flashport";
import { KeyboardEvent } from "flashport";
import { Keyboard } from "flashport";
import { DEvent } from "../events/DEvent";
import { KLabel } from "./KLabel";
import { MouseEvent } from "flashport";
import { setTimeout } from "flashport";
/**
 * ...
 * @author Kenny Lerma
 */
export class Tree extends Sprite
{
	public static readonly TREE_ITEM_DELETED:string = "treeItemDeleted";
	public static readonly TREE_ITEM_CLICKED:string = "treeItemClicked";
	private _items:TreeItem[] = [];
	
	constructor() 
	{
		super();

		this.addEventListener(AEvent.ADDED_TO_STAGE, this.HandleAddedToStage);
	}
	
	private HandleAddedToStage = (e:Event):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.HandleAddedToStage);
		TreeConfig.tree = this;
		this.addEventListener("TreeUpdate", this.UpdateItems);
		this.stage.addEventListener(KeyboardEvent.KEY_UP, this.HandleKeyboard);
	}
	
	private HandleKeyboard = (e:KeyboardEvent):void =>
	{
		if (e.keyCode == Keyboard.DELETE && TreeConfig.selected)
		{
			this.dispatchEvent(new DEvent(Tree.TREE_ITEM_DELETED, TreeConfig.selected.info));
			TreeConfig.selected.dispose();
		}
	}
	
	public addItem = (itemName:string, addToName:string = "root", info:any = null):TreeItem =>
	{
		var treeItem:TreeItem = new TreeItem(itemName, info);
		treeItem.stored = this._items;
		this._items.push(treeItem);
		
		this.UpdateItems();
		
		return treeItem;
	}
	
	private UpdateItems = (e:Event = null):void =>
	{
		var prevY:number = 0;
		for (var item of this._items) 
		{
			if (item != TreeConfig.selected) item.selected = false;
			item.y = prevY;
			item.x = 0;
			prevY += item.height + 2;
			this.addChild(item);
		}
	}
	
	public get items():TreeItem[]
	{
		return this._items;
	}
	
	public get selectedItem():TreeItem 
	{
		return TreeConfig.selected;
	}
	
}


export class TreeItem extends Sprite
{
	private _selected:boolean = false;
	private _itemHeight:number;
	private _startingHeight:number;
	private _dragInterval:number;
	private _collapse:boolean = false;
	private _info:Object;
	private _plus:Sprite;
	private _minus:Sprite;
	private _label:KLabel;
	private _items:TreeItem[] = [];
	public stored:TreeItem[];
	private _highlight:Sprite;
	private _dragItem:Sprite;
	private _copy:Bitmap;
	private _bar:Sprite;
	private _barPos:string = "none";
	private _mainStage:Stage;
	
	constructor(itemName:string, info:any) 
	{
		super();

		this.name = itemName;
		this._info = info;
		this.Draw();
		
		this.addEventListener("TreeUpdate", this.UpdateItems);
		this.addEventListener(MouseEvent.MOUSE_UP, this.HandleMouseUp);
	}
	
	public addItem = (subItemName:string, info:any = null):TreeItem =>
	{
		var item:TreeItem = new TreeItem(subItemName, info);
		item.stored = this._items;
		this._items.push(item);
		this.UpdateItems();
		
		return item;
	}
	
	private UpdateItems = (e:AEvent = null):void =>
	{
		var prevY:number = this._startingHeight;
		for (var item of this._items) 
		{
			if (item != TreeConfig.selected) item.selected = false;
			item.y = prevY;
			item.x = 20; // indent
			prevY += item.height + 2;
			if (!this._collapse && item != this) this.addChild(item);
		}
	}
	
	private Draw = ():void =>
	{
		this._label = new KLabel(this.name, 0xFFFFFF, 14);
		
		// plus sign
		this._plus = new Sprite();
		this._plus.graphics.lineStyle(1, 0x464646, 1, true, "none");
		this._plus.graphics.beginFill(0x00C600);
		var rad:number = (this._label.height / 2) - 4;
		this._plus.graphics.drawCircle(rad, rad, rad);
		this._plus.graphics.lineStyle(2, 0x000000, 1, true, "none");
		this._plus.graphics.moveTo(rad, 4);
		this._plus.graphics.lineTo(rad, (rad * 2) - 4);
		this._plus.graphics.moveTo(4, rad);
		this._plus.graphics.lineTo((rad * 2) - 4, rad);
		
		this._minus = new Sprite();
		this._minus.graphics.lineStyle(2, 0x464646, 1, true, "none");
		this._minus.graphics.beginFill(0x00C600);
		this._minus.graphics.drawCircle(rad, rad, rad);
		this._minus.graphics.moveTo(4, rad);
		this._minus.graphics.lineStyle(2, 0x000000, 1, true, "none");
		this._minus.graphics.lineTo((rad * 2) - 4, rad);
		this.addChild(this._minus);
		
		this._label.selectable = false;
		this._label.x = this._plus.width + 2;
		this._label.y = -4;
		this.addChild(this._label);
		
		this._highlight = new Sprite();
		this._highlight.graphics.beginFill(0x000000);
		this._highlight.graphics.drawRect(0, 0, this.width + 6, this.height);
		this._highlight.x = this._highlight.y = -4;
		this._highlight.alpha = .30;
		this._highlight.visible = false;
		this.addChildAt(this._highlight, 0);
		
		// bar
		this._bar = new Sprite();
		this._bar.graphics.lineStyle(3, 0xFFFFFF, 1, true, "none");
		this._bar.graphics.lineTo(this.width, 0);
		this._bar.x = -4;
		
		this._startingHeight = this.height;
		
		this._label.doubleClickEnabled = true;
		this._label.addEventListener(MouseEvent.DOUBLE_CLICK, this.HandleClicked);
		this.addEventListener(MouseEvent.MOUSE_OVER, this.HandleMouseOver);
		this.addEventListener(MouseEvent.MOUSE_DOWN, this.HandleMouseDown);
		this._plus.buttonMode = true;
		this._plus.addEventListener(MouseEvent.CLICK, this.HandleClicked);
		this._minus.buttonMode = true;
		this._minus.addEventListener(MouseEvent.CLICK, this.HandleClicked);
	}
	
	private HandleMouseDown = (e:MouseEvent):void =>
	{
		e.stopPropagation();
		
		this._dragInterval = setTimeout(this.startItemDrag, 500);
		this.selected = true;
		if (TreeConfig.selected && TreeConfig.selected != this) TreeConfig.selected.selected = false;
		TreeConfig.selected = this;
		
		this._mainStage = this.stage;
		this._mainStage.addEventListener(MouseEvent.MOUSE_UP, this.HandleMouseUp);
		TreeConfig.tree.dispatchEvent(new AEvent("treeItemClicked", true));
	}
	
	private startItemDrag = ():void =>
	{
		this._highlight.visible = false;
		var bmd:BitmapData = new BitmapData(this.width, this.height, true, 0x00FFFFFF);
		bmd.draw(this);
		this._copy = new Bitmap(bmd);
		this._copy.x = -(this.width / 2);
		this._copy.y = -(this.height / 2) + 4;
		this._dragItem = new Sprite();
		this._dragItem.addChild(this._copy);
		this._dragItem.mouseEnabled = false;
		this.stage.addChild(this._dragItem);
		this._dragItem.startDrag(true);
		this._highlight.visible = true;
		
		TreeConfig.dragItem = this;
		
		this._mainStage = this.stage;
		this._mainStage.addEventListener(MouseEvent.MOUSE_MOVE, this.HandleMouseMove);
	}
	
	private HandleMouseMove = (e:MouseEvent):void =>
	{
		if (TreeConfig.overItem)
		{
			//var half:number = TreeConfig.overItem.startingHeight / 2;
			if (TreeConfig.overItem.mouseY < 0)
			{
				TreeConfig.overItem.showBar(true);
			}
			else if (TreeConfig.overItem.mouseY > TreeConfig.overItem.startingHeight - 8)
			{
				//trace("Bottom");
				TreeConfig.overItem.showBar(false);
			}
			else
			{
				//trace("Middle");
				TreeConfig.overItem.hideBar();
			}
			//trace("y: " + TreeConfig.overItem.mouseY);
		}
	}
	
	private HandleMouseUp = (e:MouseEvent):void =>
	{
		if (this._mainStage) this._mainStage.removeEventListener(MouseEvent.MOUSE_MOVE, this.HandleMouseMove);
		if (this._bar.parent) this._bar.parent.removeChild(this._bar);
		
		if (e.currentTarget instanceof Stage)
		{
			clearTimeout(this._dragInterval);
			this.stopDrag();
			if (this._dragItem && this.stage && this.stage.contains(this._dragItem)) this.stage.removeChild(this._dragItem);
			if (this._copy)
			{
				this._copy.bitmapData.dispose();
				this._copy = null;
			}
			if (this._dragItem) this._dragItem = null;
			
			TreeConfig.dragItem = null;
		}
		else if (TreeConfig.dragItem)
		{
			//trace("Add Drag Item " + TreeConfig.dragItem.name + " to " + this.name);
			
			var dragItemIndex:number = TreeConfig.dragItem.stored.indexOf(TreeConfig.dragItem);
			if (dragItemIndex != -1) TreeConfig.dragItem.stored.splice(dragItemIndex, 1);
			if (this._items.indexOf(TreeConfig.dragItem) == -1)
			{
				if (this._barPos == "top")
				{
					var parentItems:TreeItem[] = (this.parent as Tree).items;
					var index:number = parentItems.indexOf(this);
					parentItems.splice(index, 0, TreeConfig.dragItem);
					TreeConfig.dragItem.stored = parentItems;
					//trace("Item Parent Top: " + this.parent);
				}
				else if (this._barPos == "bottom")
				{
					parentItems = (this.parent as Tree).items;
					index = parentItems.indexOf(this);
					parentItems.splice(index + 1, 0, TreeConfig.dragItem);
					TreeConfig.dragItem.stored = parentItems;
					//trace("Item Parent Bottom: " + this.parent);
				}
				else
				{
					this._items.splice(0, 0, TreeConfig.dragItem);
					TreeConfig.dragItem.stored = this._items;
				}
			}
			
			TreeConfig.dragItem = null;
			this.dispatchEvent(new AEvent("TreeUpdate", true));
			this.dispatchEvent(new AEvent("TreeUpdate", true));
		}
	}
	
	private HandleClicked = (e:MouseEvent):void =>
	{
		this._collapse = !this._collapse;
		if (this._collapse)
		{
			this.removeChild(this._minus);
			this.addChild(this._plus);
			for (var item of this._items) 
			{
				this.removeChild(item);
			}
		}
		else
		{
			this.UpdateItems();
			this.addChild(this._minus);
			this.removeChild(this._plus);
		}
		
		this.dispatchEvent(new AEvent("TreeUpdate", true));
	}
	
	private HandleMouseOver = (e:MouseEvent):void =>
	{
		this.addEventListener(MouseEvent.MOUSE_OUT, this.HandleMouseOut);
		
		e.stopPropagation();
		this._highlight.visible = true;
		TreeConfig.overItem = this;
	}
	
	private HandleMouseOut = (e:MouseEvent):void =>
	{
		this.removeEventListener(MouseEvent.MOUSE_OUT, this.HandleMouseOut);
		if (!this._selected) this._highlight.visible = false;
		if (TreeConfig.overItem == this) TreeConfig.overItem = null;
		this.hideBar();
	}
	
	public showBar = (top:boolean = true):void =>
	{
		this._bar.y = (top) ? - 8 : this._startingHeight;
		this._barPos = (top) ? "top" : "bottom";
		this.addChild(this._bar);
	}
	
	public hideBar = ():void =>
	{
		if (this.contains(this._bar)) this.removeChild(this._bar);
		this._barPos = "none";
	}
	
	public get info():Object 
	{
		return this._info;
	}
	
	public get items():TreeItem[]
	{
		return this._items;
	}
	
	public get selected():boolean 
	{
		return this._selected;
	}
	
	public set selected(value:boolean) 
	{
		this._selected = value;
		this._highlight.alpha = (this._selected) ? 1 : .30;
		this._highlight.visible = this._selected;
	}
	
	public get startingHeight():number 
	{
		return this._startingHeight;
	}
	
	public get bar():Sprite 
	{
		return this._bar;
	}
	
	public dispose = ():void =>
	{
		//trace("Dispose: " + this.name);
		TreeConfig.selected = null;
		this._selected = false;
		var index:number = this.stored.indexOf(this);
		if (index != -1) this.stored.splice(index, 1);
		this.parent.removeChild(this);
		
		this.dispatchEvent(new AEvent("TreeUpdate", true));
			
		this.removeEventListener(MouseEvent.MOUSE_OVER, this.HandleMouseOver);
		this.removeEventListener(MouseEvent.MOUSE_DOWN, this.HandleMouseDown);
		this.removeEventListener(MouseEvent.MOUSE_OUT, this.HandleMouseOut);
		this._plus.removeEventListener(MouseEvent.CLICK, this.HandleClicked);
		this._minus.removeEventListener(MouseEvent.CLICK, this.HandleClicked);
		if (this._mainStage) this._mainStage.removeEventListener(MouseEvent.MOUSE_UP, this.HandleMouseUp);
		
		this._highlight = null;
		this._plus = null;
		this._minus = null;
		this._label = null;

		for (var item of this._items) 
		{
			item.dispose();
		}
		
		this._info = null;
		this.stored = null;
		this._dragItem = null
		if (this._copy)
		{
			this._copy.bitmapData.dispose();
			this._copy = null;
		}
		
		TreeConfig.tree.dispatchEvent(new AEvent("TreeUpdate", true));
	}
}


export class TreeConfig
{
	public static dragItem:TreeItem;
	public static selected:TreeItem;
	public static overItem:TreeItem;
	public static tree:Tree;
}