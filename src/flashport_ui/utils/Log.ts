/**
 * Logging utility
 * @author Kenny Lerma
 */

export class Log 
{
	public static disable:boolean = false;
	
	public static info = (msg:string):void =>
	{
		this.output("INFO:", msg);
	}
	
	public static warning = (msg:string):void =>
	{
		this.output("WARNING:", msg);
	}
	
	public static error = (msg:string):void =>
	{
		this.output("ERROR:", msg);
	}
	
	public static output = (type:string, msg:string):void =>
	{
		if (!this.disable)
		{
			switch (type) 
			{
			case "INFO":
				console.log(msg);
				break;
			case "ERROR":
				console.error(msg);
				break;
			case "WARNING":
				console.warn(msg);
				break;
			}
		}
	}
}