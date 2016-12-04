//@program
/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */

/* SKINS */
let whiteSkin = new Skin({fill: 'white'});
let graySkin = new Skin({fill: 'black'});
let redSkin = new Skin({fill: '#E71D32'});
let greenSkin = new Skin({fill: '#5AA700'});
var blackBorderedSkin = new Skin({
    borders: {left: 2, right: 2, top: 2, bottom: 2}, 
    stroke: "black"
});
//updated skins below:
let darkBlue = new Skin({fill: '#205DAB'});
let mediumBlue = new Skin({fill: '#4679BD'});
let lightBlue = new Skin({fill: '#77A9DA'});
let darkYellow = new Skin({fill: '#FDB737'});
let lightYellow = new Skin({fill: '#FFD385'});

//added a green & red style and changed their sizes! -Stacy
var blackHeadingStyle = new Style ({ font: '32px Avenir-Heavy', color: 'black', horizontal: 'center'});
var boldBlackBodyStyle = new Style ({ font: 'bold 20px Avenir-Roman', color: 'black', horizontal: 'center'});
var blackBodyStyle = new Style ({ font: '20px Avenir-Roman', color: 'black', horizontal: 'left'});
var whiteHeadingStyle = new Style ({ font: '32px Avenir-Heavy', color: 'white', horizontal: 'center'});
var whiteBodyStyle = new Style ({ font: '20px Avenir-Roman', color: 'white', horizontal: 'center'});
var whiteSmallStyle = new Style ({ font: '18px Avenir-Roman', color: 'white', horizontal: 'center'});
var blueTitleStyle = new Style ({ font: 'bold 20px Avenir-Roman', color: '#205DAB', horizontal: 'left'});
var blueBodyStyle = new Style ({ font: 'bold 18px Avenir-Roman', color: '#205DAB', horizontal: 'center'});

/* Data Objects */
var refilled = false;
/*  Templates */

//Home Screen
let homeScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new Line({
			top: 0, left: 0, right: 0, bottom: 0, height: 20, skin: darkBlue,
			contents: [
				//menu icon,
				new Label({ top: 10, left: 0, right: 100, bottom: 10, string: "Lemonaid", style: whiteSmallStyle }),
			], 
		}),
		//calendar picture,
		new Line({
			top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
			contents: [
			//left arrow,
			new Column({ top: 50, left: 0, right: 0, bottom: 0, skin: whiteSkin,
				contents: [
				new Label({ string: '4 October 2016', style: blackHeadingStyle }),
				], 
			}),
			//right arrow,
			],
		}),
		incompletelist,
		completedlist,
	],
}));

//My Medicine Screen
let myMedicineScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Line({
		top: 0, left: 0, right: 0, bottom: 0, height: 20, skin: darkBlue,
		contents: [
			//menu icon,
			new Label({ top: 10, left: 0, right: 100, bottom: 10, string: "My Medicine", style: whiteSmallStyle }),
		], 
	}),
	//medicine picture,
	new Label({ left: 25, name: 'my medicines', top: 20, string: 'MY MEDICINES', style: blueTitleStyle }),
	new button({ name: 'sertraline', top: 5, left: 25, right: 25, bottom: 5, 
			skin: blackBorderedSkin, 
			content: new Label({ string: "Sertraline", style: blackBodyStyle}),	
			nextScreen: individualMedicineScreen,
		}),
	new button({ name: 'vitamin a', top: 5, left: 25, right: 25, bottom: 5, 
			skin: blackBorderedSkin, 
			content: new Label({ string: "Vitamin A", style: blackBodyStyle}),	
			nextScreen: individualMedicineScreen,
		}),
	new button({ name: 'levofloxacin', top: 5, left: 25, right: 25, bottom: 5,
			skin: blackBorderedSkin, 
			content: new Label({ string: "Levofloxacin", style: blackBodyStyle}),	
			nextScreen: individualMedicineScreen,
		}),
	//change this below to be the "add new medicine" picture
	new Picture({height: 100, left: 100, right: 0, url: "assets/pillphoto.png"}),
	],
	active: true,
	Behavior: class extends Behavior{
		onDisplayed(container) {
			trace('~~~~ LAUNCHED! ~~~~~ \n');
			/*
			var medicines = completedpills.split(/[,]+/);
			for (var i = 0; i < medicines.length; i++) { 
				trace(medicines[i] + '\n');
			    container.insert(
			    	new button({ name: medicines[i], left: 25, right: 25, top: 10, height: 40,
					skin: graySkin, 
						content: new Label({ string: medicines[i], style: whiteBodyStyle }),
						onTouchBegan: function(container) {container.skin = blackBorderedSkin; container.first.style = blackBodyStyle},
						nextScreen: individualMedicineScreen,		
				}), container.last);
				trace('Added ' + medicines[i] + '\n');
				trace(container.first.name + '\n');
			}
			*/
		}
	}
}));

//Traveling Screen
let numberLabel = new Label({ name: "numberLabel", string: 1, style: blackHeadingStyle, })
let numberContainer = new Container({ top: 20, left: 0, right: 0, bottom: 20, skin: blackBorderedSkin, 
	contents: [ numberLabel ]
});
let numberEntryLine = new Line({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new Container({ top: 0, left: 0, right: 0, bottom: 0, name: "-", 
			contents: [new Label({ string: " - ", style: blackHeadingStyle, })],
			active: true,
			behavior: Behavior({
				onTouchEnded: function(container){
					numberLabel.string -= 1; 
					trace(numberLabel.string + "\n");
					},
					
			}),
		}),
		numberContainer,
		new Container({ top: 0, left: 0, right: 0, bottom: 0, name: "+", 
			contents: [new Label({ string: " + ", style: blackHeadingStyle, })],
			active: true,
			behavior: Behavior({
				onTouchEnded: function(container){
					numberLabel.string += 1; 
					trace(numberLabel.string + "\n");
					},
					
			}),
		}),
	],
});
let travelingScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Line({
		top: 0, left: 0, right: 0, bottom: 0, height: 20, skin: darkBlue,
		contents: [
			//menu icon,
			new Label({ top: 10, left: 0, right: 100, bottom: 10, string: "Travelling", style: whiteSmallStyle }),
		], 
	}),
	//traveling picture,
	new Text({ width: 250, top: 20, string: "You can dispense more than a day's worth of pills if you're traveling.", style: boldBlackBodyStyle }),
	new Label({ left: 25, right: 25, top: 20, string: "HOW MANY DAYS ARE YOU TRAVELING?", style: blueBodyStyle }),
	numberEntryLine,
	new button({ name: 'dispense', top: 5, left: 50, right: 50, bottom: 20,
			skin: darkBlue, 
			content: new Label({ string: "DISPENSE", style: whiteBodyStyle}),	
			//nextScreen: dispenseLightbox,
		}),
	],
	active: true,
	Behavior: class extends Behavior{
		onDisplayed(container) {
			trace('~~~~ LAUNCHED! ~~~~~ \n');
		}
	}
}));

//Individual Medicine Screen
let pillDetails = new Column({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
		contents: [
		//this is hard-coded for now but we can change this later!
		new Picture({height: 100, url: "assets/pillphoto.png"}),
		new Label({ string: "Sertraline", style: blackHeadingStyle}),
		new Label({ string: "100mg, once daily", style: blackBodyStyle}),
		new Label({ string: "6% REMAINING", style: blueBodyStyle}),
		], 
	});
let individualMedicineScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
		//editButton not finished yet!
		new button({ name: 'medicine-back-button', top: 5, left: 5, 
			skin: whiteSkin, 
			content: new Label({ string: "←", style: blackBodyStyle}),	
			nextScreen: myMedicineScreen,
		}),
		new button({ name: 'editButton', top: -40, left: 280, right: 0, bottom: 0,
			skin: whiteSkin, 
			content: new Picture({ height: 15, url: "assets/editicon.png" }),	
		}),
		new Label({ string: "Medicine", style: blackHeadingStyle}),
		new Column({
			top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
			contents: [
			//this is hard-coded for now but we can change this later!
			new Picture({height: 100, url: "assets/pillphoto.png"}),
			new Label({ string: "Sertraline", style: blackHeadingStyle}),
			new Label({ string: "100mg, once daily", style: blackBodyStyle}),
			new Label({ string: "6% REMAINING", style: redBodyStyle}),
			], 
		}),
		new refillButton({ name: "requestRefillButton", top: 100, left: 60, right: 60, bottom: 20,
			skin: graySkin,
			content: new Label({ string: "REQUEST REFILL", style: whiteBodyStyle })
		}),
	],
}));

var timer = 0;
var up = true;
//Refill Confirmation
let refillConfirmation = Layer.template($ => ({
	skin: greenSkin, left: 0, right: 0, height: 100, bottom: 0,
	contents: [new Container({skin: greenSkin, left: 0, right: 0, top: 0, bottom: 0,
		contents: [new Label({string: "Refill Requested!", style: whiteHeadingStyle})]})],
	Behavior: class extends Behavior{
		onCreate(container) {
			container.opacity = 0;
			container.interval = 15;
			container.start();
		}
		onTimeChanged(container) {
			if ((container.opacity < 0.95 ) && up) {
				container.opacity = container.opacity + 0.05;
			} 
			else {
				up = false;
				if (timer == 75) {
					mainContainer.remove(mainContainer.last);
					up = true;
					timer = 0;
				} else {
					timer += 1;
				}
			}
		}
	}
}));

//Lightbox
let lightbox = Layer.template($ => ({ 
    top: $.top, height: 250, left: $.left, width: 230,
    behavior: $.behavior, skin: graySkin, opacity: 0.5,
    contents: [
        $.content
    ]
}));

let lightboxContent = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: redSkin, 
	contents: [
		$.content
	]
}));

let button = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, 
	contents: [
		$.content
	],
	behavior: Behavior({
		onTouchBegan: $.onTouchBegan,
		onTouchEnded: function(container) {
			mainContainer.remove(currentScreen);
			trace('removed current screen \n')
			currentScreen = new $.nextScreen;
			trace('set equal to next screen \n')
			mainContainer.add(currentScreen);
			trace('added screen \n')
		}
	})
}));

let refillButton = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, 
	contents: [
		$.content
	],
	behavior: Behavior({
		onTouchEnded: function(container) {
			if (refilled) {
				mainContainer.add(new lightbox({content: new lightboxContent({
					content: new Column({left: 0, right: 0, top: 0, bottom: 0,
						contents: [
						new xButton({style: whiteBodyStyle}),
						new Label({string: "Oops!", style: whiteHeadingStyle, top: 50}),
						new Text({left: 10, right: 10, string: "Looks like you can't refill at this time. Please contact your doctor if this is a mistake.", style: whiteSmallStyle})]})}),
					top: 75, left: 50}))
			} else {
				mainContainer.add(new refillConfirmation());
				refilled = true;	
			}
		}
	})
}));

let xButton = Container.template($ => ({
	top: 10, right: 10, active: true,
	contents: 
		[new Label({string: "x", style: $.style})],
	Behavior: class extends Behavior {
		onTouchEnded(button) {
			mainContainer.remove(mainContainer.last);
		}
	}
}));

let completedlist = new Column({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Label({ top: 25, left: 25, name: 'complete', string: 'COMPLETE', style: blueTitleStyle }),
	new Container({ name: 'vitamin a', top: 5, left: 25, 
		skin: whiteSkin, 
		contents:
		//filled-in circle icon,  
		new Label({ string: "Vitamin A", style: blackBodyStyle}),	
	}),
	new Container({ name: 'vitamin c', top: 5, left: 25, 
		skin: whiteSkin, 
		contents:
		//filled-in circle icon,  
		new Label({ string: "Vitamin C", style: blackBodyStyle}),	
	}), 
	]
});

let incompletelist = new Column({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Label({ left: 25, name: 'incomplete', top: 20, string: 'INCOMPLETE', style: blueTitleStyle }),

	new button({ name: 'sertraline', top: 5, left: 25, 
		skin: whiteSkin, 
		content:
		//circle icon,  
		new Label({ string: "Sertraline", style: blackBodyStyle}),	
		//nextScreen: dispensingLightbox,
	}),

	new Container({ name: 'levofloxacin', top: 5, left: 25, 
		skin: whiteSkin, 
		contents:
		//circle icon,  
		new Label({ string: "Levofloxacin", style: blackBodyStyle}),	
	}),
	]
});

/* Main Container */
var currentScreen;

let mainContainer = new Container({
	top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin,
	contents: [],
});



application.add(mainContainer);
application.behavior = Behavior({
	onLaunch: function(application) {
		//hard-coded in the notification screen just for the purpose of this assignment - Stacy
			currentScreen = new Picture({ left: 0, right: 0, height: 568, url: "assets/homescreennotification.png",
			active: true, 
			behavior: Behavior({ onTouchEnded(container) {currentScreen = new homeScreen(); mainContainer.add(currentScreen);}}), });
		mainContainer.add(currentScreen);
	}	
});

