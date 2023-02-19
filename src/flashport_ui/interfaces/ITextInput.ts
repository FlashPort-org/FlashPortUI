import { AEvent } from "@flashport/flashport";

/**
	* ...
	* @author Kenny Lerma
	*/
export interface ITextInput 
{
	//EventDispatcher
	addEventListener(type:string, listener:Function, useCapture?:boolean, priority?:number, useWeakReference?:boolean):void; 
	removeEventListener(type:string, listener:Function, useCapture?:boolean):void; 
	dispatchEvent(event:AEvent):boolean; 
	hasEventListener(type:string):boolean; 
	willTrigger(type:string):boolean;
	
	get text():string;
	set text(value:string);
	
	get width():number;
	set width(value:number);
	
	get height():number;
	set height(value:number);
	
	get x():number;
	set x(value:number);
	
	get y():number;
	set y(value:number);
	
	set align(value:string);
}