import CanvasKitInit from "canvaskit-wasm/bin/canvaskit.js";
import CanvasKitWasm from "canvaskit-wasm/bin/canvaskit.wasm?url";
import { CanvasKit } from "canvaskit-wasm";
import { Sprite } from "@fp/flash/display/Sprite";
import { FlashPort } from "@fp/FlashPort";
import { LineChart } from "./com/kl/charts/LineChart";
import { Plot } from "./com/kl/charts/Plot";
import { KColorPicker } from "./com/kl/ui/KColorPicker";
import { KCombo } from "./com/kl/ui/KCombo";
import { KList } from "./com/kl/ui/KList";
import { KListItem } from "./com/kl/ui/KListItem";
import { KSpinner } from "./com/kl/ui/KSpinner";
import { KStepper } from "./com/kl/ui/KStepper";
import { KTextInput } from "./com/kl/ui/KTextInput";
import { Tree } from "./com/kl/ui/Tree";
import { AEvent } from "@fp/flash/events";
import { AssetLoader } from "@fp/flash/__native/AssetLoader";
import { KSlider } from "./com/kl/ui/KSlider";
import { KCheck } from "./com/kl/ui/KCheck";
import { KButton } from "./com/kl/ui/KButton";
import { MouseEvent } from "@fp/flash/events/MouseEvent";
import { KAlert } from "./com/kl/ui/KAlert";

;
/**
 * ...
 * @author Kenny Lerma
 */
export class Main extends Sprite
{
	constructor() 
	{
		FlashPort.stageWidth = 550;
		
		super();

		this.stage.opaqueBackground = 0x87CEEB;

		let assets:string[] = [
			"assets/fonts/Arial.ttf"
		];

		let ld:AssetLoader = new AssetLoader(assets);
		ld.addEventListener(AEvent.COMPLETE, this.onAssetsLoaded);
		ld.load();
		
		
	}

	private onAssetsLoaded = (e:AEvent):void =>
	{
		this.init();
	}

	private init = () =>
	{
		var chart:LineChart = new LineChart(500, 300, "Day", "Stock Quantity", this.xFormat);
			chart.name = "chart";
			var plots:Plot[] = [];
			
			for (var i:number = 0; i < 25; i++) 
			{
				var t:number = new Date().getTime() + (i * 43200000);
				var plot:Plot = new Plot(t, Math.floor((Math.random() * i) * 10) / 10);
				plots.push(plot);
			}
			chart.setData(plots);
			
			chart.x = 25;
			chart.y = 120;
			this.addChild(chart);
			
			var slider:KSlider = new KSlider(150);
			slider.x = 195;
			slider.y = 20;
			this.addChild(slider);
			
			var spinner:KSpinner = new KSpinner(24, 24);
			spinner.x = slider.x + slider.width + 20;
			spinner.y = 20;
			this.addChild(spinner);
			
			var stepper:KStepper = new KStepper();
			stepper.x = spinner.x + spinner.width + 20;
			stepper.y = 20;
			this.addChild(stepper);
			
			var check:KCheck = new KCheck();
			check.x = 25;
			check.y = 60;
			check.checked = true;
			this.addChild(check);
			
			var button:KButton = new KButton("BUTTON");
			button.x = check.x + check.width + 20;
			button.y = check.y;
			this.addChild(button);
			
			var btnAlert:KButton = new KButton("ALERT");
			btnAlert.x = button.x + button.width + 20;
			btnAlert.y = button.y;
			btnAlert.addEventListener(MouseEvent.CLICK, this.handleAlert);
			this.addChild(btnAlert);
			
			var txt:KTextInput = new KTextInput(120, 26);
			txt.text = "This is a TextInput";
			txt.y = btnAlert.y;
			txt.x = btnAlert.x + btnAlert.width + 20;
			this.addChild(txt);
			
			/*var colorPicker:KColorPicker = new KColorPicker();
			colorPicker.x = txt.x + txt.width + 20;
			colorPicker.y = txt.y;
			addChild(colorPicker);*/
			
			var dropdown:KCombo = new KCombo();
			for (var j:number = 0; j < 50; j++) 
			{
				dropdown.addItem("item " + j);
			}
			dropdown.x = 25;
			dropdown.y = 20;
			this.addChild(dropdown);
	}
	
	private handleAlert = (e:MouseEvent):void =>
	{
		var alertBox:KAlert = new KAlert("Hello, this is an Alert!", 250);
		alertBox.okBTN.addEventListener(MouseEvent.CLICK, this.alertClicked);
		alertBox.cancelBTN.addEventListener(MouseEvent.CLICK, this.alertClicked);
		this.addChild(alertBox);
	}
	
	private alertClicked = (e:MouseEvent):void =>
	{
		this.removeChild(e.currentTarget.parent);
	}

	private xFormat = (chartX:number):string =>
	{
		var format:string = new Date(chartX).toDateString();
		return format;
	}
	
}

CanvasKitInit({
    locateFile: (file) => '/node_modules/canvaskit-wasm/bin/'+file,
}).then((canvasKit:CanvasKit) => {
    FlashPort.canvasKit = canvasKit;
    new Main();
});