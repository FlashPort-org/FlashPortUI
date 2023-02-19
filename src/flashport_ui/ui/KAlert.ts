import { Sprite } from "@flashport/flashport";
import { AEvent } from "@flashport/flashport";
import { TextField } from "@flashport/flashport";
import { TextFieldAutoSize } from "@flashport/flashport";
import { TextFormat } from "@flashport/flashport";
import { KButton } from "./KButton";

/**
	* ...
	* @author Kenny Lerma
	*/
export class KAlert extends Sprite
{
	private _messageTxt:TextField;
	private _okBTN:KButton;
	private _cancelBTN:KButton;
	
	constructor(message:string, maxWidth:number = 300) 
	{
		super();
		
		this._messageTxt = new TextField();
		this._messageTxt.defaultTextFormat = new TextFormat("Arial", 16, 0x464646);
		this._messageTxt.selectable = false;
		this._messageTxt.multiline = true;
		this._messageTxt.autoSize = TextFieldAutoSize.CENTER;
		this._messageTxt.width = maxWidth;
		this._messageTxt.text = message;
		
		this.graphics.lineStyle(1.5, 0x666666, 1, true, "none");
		this.graphics.beginFill(0xFFFFFF);
		this.graphics.drawRoundRect(0, 0, this._messageTxt.width + 20, this._messageTxt.height + 80, 9, 9);
		
		this._messageTxt.x = (this.width - this._messageTxt.width) / 2;
		this._messageTxt.y = 10;
		this.addChild(this._messageTxt);
		
		this._okBTN = new KButton("OK");
		this._okBTN.x = 60;
		this._okBTN.y = this.height - this._okBTN.height - 20;
		this.addChild(this._okBTN);
		
		this._cancelBTN = new KButton("CANCEL");
		this._cancelBTN.x = this.width - this._cancelBTN.width - 60
		this._cancelBTN.y = this.height - this._cancelBTN.height - 20;
		this.addChild(this._cancelBTN);
		
		this.addEventListener(AEvent.ADDED_TO_STAGE, this.OnAddedToStage, false, 0, true);
	}
	
	private OnAddedToStage = (e:Event):void =>
	{
		this.removeEventListener(AEvent.ADDED_TO_STAGE, this.OnAddedToStage);
		this.x = (this.stage.stageWidth - this.width) / 2;
		this.y = (this.stage.stageHeight - this.height) / 2;
	}
	
	public get okBTN():KButton
	{
		return this._okBTN;
	}
	
	public get cancelBTN():KButton 
	{
		return this._cancelBTN;
	}
	
	public set hideCancel(value:boolean) 
	{
		if (value)
		{
			this._cancelBTN.visible = false;
			this._okBTN.x = (this.width - this._okBTN.width) / 2;
		}
		else
		{
			this._okBTN.x = 60;
			this._cancelBTN.visible = true;
		}
	}
}