import { Sprite } from "@fp/flash/display/Sprite";
import { Stage } from "@fp/flash/display/Stage";
import { AEvent } from "@fp/flash/events/AEvent";

/**
 * ...
 * @author Kenny Lerma
 */
export class Blackout extends Sprite
{
	private _mainStage:Stage;
	
	constructor() 
	{
		super();

		this.mouseChildren = false;
		
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.OnAddedToStage);
	}
	
	private OnAddedToStage = (e:Event):void =>
	{
		this._mainStage = this.stage;
		
		this.addEventListener(AEvent.REMOVED_FROM_STAGE, this.OnRemovedFromStage);
		this.stage.addEventListener(AEvent.RESIZE, this.OnResize);
		
		this.graphics.clear();
		this.graphics.beginFill(0x000000, .75);
		this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
	}
	
	private OnRemovedFromStage = (e:Event):void =>
	{
		this.removeEventListener(AEvent.REMOVED_FROM_STAGE, this.OnRemovedFromStage);
		this._mainStage.removeEventListener(AEvent.RESIZE, this.OnResize);
		this._mainStage = null;
	}
	
	private OnResize = (e:Event):void =>
	{
		this.graphics.clear();
		this.graphics.beginFill(0x000000, .75);
		this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
	}
	
}