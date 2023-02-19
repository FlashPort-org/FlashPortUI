import { AEvent } from "@flashport/flashport";

/*
* @author Kenny Lerma
* @since 1.1.2011
* @langversion 3.0
* @playerversion Flash 11.1
*/

export class DEvent extends AEvent
{
	public data:any;
	
	
	constructor(type:string, _data:any, bubbles:boolean = false, cancelable:boolean = false)
	{
		super(type, bubbles, cancelable);
		this.data = _data;
	}
	
	// Override clone
	override clone = ():AEvent =>
	{
		return new DEvent(this.type, this.data, this.bubbles, this.cancelable);
	}
	
	// Override toString
	override toString = ():string =>
	{ 
		return this.formatToString("DEvent", "type", "bubbles", "cancelable", "eventPhase");
	}
}