
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
/* VARS */
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import {
    SystemKeyboard
} from 'keyboard';

let MyField = Container.template($ => ({ 
    width: 200, height: 30, skin: whiteSkin, top: 0, left: 20, right: 20, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, name: "directions",
            Behavior: FieldScrollerBehavior, clip: true, 
            contents: [
                Label($, { 
                    left: 0, width: 200, top: 0, bottom: 0, skin: whiteSkin, 
                    style: blackBodyStyle, anchor: 'Directions',
                    editable: true, string: $.default,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                        	label.container.container.skin = whiteSkin;
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                        }
                    },
                }),
            ]
        })
    ]
}));
var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
var weekNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

var myMedicines = {"Sertraline": {
		"directions": "1 100mg pill per day",
		"quantity": 10,
		"daysOfWeek": ["sunday, monday, tuesday, wednesday, thursday, friday, saturday"],
		"timesOfDay": [new Date(2006, 11, 5, 10, 0, 0, 0), new Date(2006, 11, 5, 21, 0, 0, 0)],
		"pillsTakenToday": 0
	},
	"Vitamin A": {
		"directions": "1 tablet a day",
		"quantity": 10,
		"daysOfWeek": ["sunday, monday, tuesday, wednesday, thursday, friday, saturday"],
		"timesOfDay": [new Date(2006, 11, 5, 10, 0, 0, 0)],
		"pillsTakenToday": 0
	}}
var currentMedicine = "";
/* SKINS */
let whiteSkin = new Skin({fill: 'white'});
let graySkin = new Skin({fill: 'black'});
let redSkin = new Skin({fill: '#E71D32'});
let greenSkin = new Skin({fill: '#5AA700'});
var blackBorderedSkin = new Skin({ fill: 'white',
    borders: {left: 2, right: 2, top: 2, bottom: 2}, 
    stroke: "black"
});
//updated skins below:
let darkBlue = new Skin({fill: '#205DAB'});
let mediumBlue = new Skin({fill: '#4679BD'});
let lightBlue = new Skin({fill: '#77A9DA'});
let darkYellow = new Skin({fill: '#FDB737'});
let lightYellow = new Skin({fill: '#FFD385'});
let Yellow = new Skin({fill: '#FCB637'})
var darkBlueBorderedSkin = new Skin({
    borders: {left: 2, right: 2, top: 2, bottom: 2}, 
    stroke: '#205DAB'
});

//added a green & red style and changed their sizes! -Stacy
var blackHeadingStyle = new Style ({ font: '32px Avenir-Heavy', color: 'black', horizontal: 'center'});
var boldBlackBodyStyle = new Style ({ font: 'bold 20px Avenir-Roman', color: 'black', horizontal: 'center'});
var blackBodyStyle = new Style ({ font: '20px Avenir-Roman', color: 'black', horizontal: 'left'});
var whiteHeadingStyle = new Style ({ font: '32px Avenir-Heavy', color: 'white', horizontal: 'center'});
var whiteBodyStyle = new Style ({ font: '20px Avenir-Roman', color: 'white', horizontal: 'center'});
var boldWhiteBodyStyle = new Style ({ font: '20px Avenir-Heavy', color: 'white', horizontal: 'center'});
var whiteSmallStyle = new Style ({ font: '18px Avenir-Roman', color: 'white', horizontal: 'center'});
var blueTitleStyle = new Style ({ font: 'bold 20px Avenir-Roman', color: '#205DAB', horizontal: 'left'});
var blueBodyStyle = new Style ({ font: 'bold 18px Avenir-Roman', color: '#205DAB', horizontal: 'center'});
var navbarStyle = new Style({font: 'bold 18px Avenir-Roman', color: 'white', horizontal: 'left'});
var redBodyStyle = new Style ({ font: '20px Avenir-Roman', color: 'red', horizontal: 'center'});
/* Data Objects */
var refilled = false;
/*  Templates */
function getDate() {
	var date = new Date();
	return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}

//Home Screen
let homeScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new Line({
			top: 0, left: 0, right: 0, height: 50, skin: darkBlue,
			contents: [
				new Picture({width: 20, left: 15, url: "assets/menubar.png", active: true, behavior: new menuOpenBehavior()}),
				new Label({ top: 10, left: 10, bottom: 10, string: "Lemonaid", style: whiteSmallStyle }),
			], 
		}),
		new Picture({height: 100, top: 25, left: 0, right: 0, url: "assets/calendar.png"}),
		new Line({
			top: 15, left: 0, right: 0, skin: whiteSkin,
			contents: [
			//left arrow,
			new Column({ top: 0, left: 0, right: 0, skin: whiteSkin,
				contents: [
				new Label({ string: getDate(), style: blackHeadingStyle }),
				], 
			}),
			//right arrow,
			],
		}),
		new incompletelist(),
		new completedlist(),
	],
}));

class addMedicineBehavior extends Behavior {
	onTouchEnded(button) {
		var box = new lightbox({
				top: 100, content: new addMedicineLightboxContent({fillColor: 'white'})});
			mainContainer.add(box);
	}
}
let addMedicineLightboxContent = Column.template($ => ({
    top: 15, bottom: 15, left: 0, right: 0, height: 300,
    skin: darkBlue,
    contents: [
    	new Label({string: "Add New Medication", style: boldWhiteBodyStyle, left: 0, right: 0, top: 25}),
    	new Label({string: "NAME:", style: boldWhiteBodyStyle, height: 15, top: 15, left: 20}),
    	new MyField({name: "name", buttonName: "name", default: "New name here..."}),
    	new Label({string: "MILLIGRAMS PER PILL:", style: boldWhiteBodyStyle, height: 15, top: 15, left: 20}),
    	new MyField({name: "milligrams", buttonName: "milligrams", default: "100"}),
    	new saveNewMedicineButton(),
    	new cancelButton()
    ]
}));
let saveNewMedicineButton = Container.template($ => ({
	top: 35, left: 20, right: 20, active: true, height: 40, skin: whiteSkin,
	contents: 
		[new Label({string: "SAVE", style: boldBlackBodyStyle})],
	Behavior: class extends Behavior {
		onTouchEnded(button) {
			mainContainer.remove(mainContainer.last);
			mainContainer.remove(currentScreen);
			var newMedicine = button.previous.previous.previous.first.first.string;
			var weight = button.previous.first.first.string;
			var newData = {
					"directions": "Add directions here.",
					"quantity": 0,
					"daysOfWeek": ["sunday, monday, tuesday, wednesday, thursday, friday, saturday"],
					"timesOfDay": [new Date(2006, 11, 5, 10, 0, 0, 0)],
					"pillsTakenToday": 0
				};
			myMedicines[newMedicine] = newData;
			currentScreen = new myMedicineScreen();
			mainContainer.insert(currentScreen, mainContainer.last);
			var data = JSON.stringify([newMedicine, [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")), 0, parseInt(weight)]);
			trace("HERES THE DATA SENT: " + data + "\n");
			let message = new MessageWithObject(discovery.url + "addMedicine");
			message.requestText = data;
			message.invoke();
		}
	}
}));
let cancelButton = Container.template($ => ({
	top: 10, left: 20, right: 20, active: true, height: 40, skin: whiteSkin,
	contents: 
		[new Label({string: "CANCEL", style: boldBlackBodyStyle})],
	Behavior: class extends Behavior {
		onTouchEnded(button) {
			mainContainer.remove(mainContainer.last);
		}
	}
}));
//My Medicine Screen
let myMedicineScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Line({
		top: 0, left: 0, right: 0, height: 50, skin: darkBlue,
		contents: [
			new Picture({width: 20, left: 15, url: "assets/menubar.png", active: true, behavior: new menuOpenBehavior()}),
			new Label({ top: 10, left: 15, bottom: 10, string: "My Medicine", style: whiteSmallStyle }),
		], 
	}),
	new Picture({height: 100, top: 25, left: 0, right: 0, url: "assets/medicines.png"}),
	new Label({ left: 25, name: 'my medicines', top: 20, string: 'MY MEDICINES', style: blueTitleStyle }),
	new Picture({name: "addMedicine", height: 50, right: 15, top: 50, url: "assets/plus.png", active: true, behavior: new addMedicineBehavior()}),
	],
	active: true,
	Behavior: class extends Behavior{
		onDisplayed(container) {
			trace('~~~~ LAUNCHED! ~~~~~ \n');
			for (var medicine in myMedicines) {
				var data = myMedicines[medicine];
				container.insert(
					new medicineButton({ name: medicine, top: 10, left: 25, right: 25, height: 45, 
					skin: blackBorderedSkin, 
					content: new Label({left: 15, string: medicine, style: blackBodyStyle}),	
					nextScreen: individualMedicineScreen,
				}), container.last);
			}
		}
	}
}));

//Traveling Screen
var travelling_days = 1;
let numberContainer = Container.template($ => ({ height: 50, top: 20, left: 0, right: 0, skin: blackBorderedSkin, 
	contents: [ new Label({ name: "numberLabel", string: travelling_days, style: blackHeadingStyle, active: true,
		behavior: Behavior({
			onUpdate: function(container) {
				trace("number label updated! \n");
				container.string = travelling_days;
			}
		})}) ]
}));
let numberEntryLine = Line.template($ => ({
	height: 50, top: 20, left: 0, right: 0, skin: whiteSkin,
	contents: [
		new Container({ height: 50, top: 20, left: 0, right: 0, name: "-", 
			contents: [new Label({ string: " - ", style: blackHeadingStyle, })],
			active: true,
			behavior: Behavior({
				onTouchEnded: function(container){
					if (travelling_days > 1) {
						travelling_days -= 1;
						container.next.first.string = travelling_days;
					}
				},	
			}),
		}),
		new numberContainer(),
		new Container({ height: 50, top: 20, left: 0, right: 0, name: "+", 
			contents: [new Label({ string: " + ", style: blackHeadingStyle, })],
			active: true,
			behavior: Behavior({
				onTouchEnded: function(container){
					travelling_days += 1;
					container.previous.first.string = travelling_days; 
					},
					
			}),
		}),
	],
}));
let travelingScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
	new Line({
		top: 0, left: 0, right: 0, height: 50, skin: darkBlue,
		contents: [
			new Picture({width: 20, left: 15, url: "assets/menubar.png", active: true, behavior: new menuOpenBehavior()}),
			new Label({ top: 10, left: 15, bottom: 10, string: "Travelling", style: whiteSmallStyle }),
		], 
	}),
	new Picture({height: 100, top: 25, left: 0, right: 0, url: "assets/traveling.png"}),
	new Text({ width: 250, top: 20, string: "You can dispense more than a day's worth of pills if you're traveling.", style: boldBlackBodyStyle }),
	new Label({ left: 25, right: 25, top: 20, string: "HOW MANY DAYS ARE YOU TRAVELING?", style: blueBodyStyle }),
	new numberEntryLine(),
	new travellingButton({ name: 'dispense', height: 50, top: 35, left: 50, right: 50, 
			skin: darkBlue,
			content: new Label({ string: "DISPENSE", style: whiteBodyStyle}),	
		}),
	],
	active: true,
	Behavior: class extends Behavior{
		onDisplayed(container) {
			trace('~~~~ LAUNCHED! ~~~~~ \n');
			travelling_days = 1;
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

function formatTime(date) {
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return date.getHours() + ":" + minutes;
}
function contains(obj, item) {
    var i = obj.length;
    while (i--) {
        if (obj[i] == item) {
            return true;
        }
    }
    return false;
}

function updateMedicine(medicine) {
	var data = myMedicines[medicine];
	var daysOfWeek = data["daysOfWeek"];
	var weekArray = [];
	var pillsPerDay = data["timesOfDay"].length;
	for (var day in weekNames) {
		if (contains(daysOfWeek, weekNames[day])) {
			weekArray.push(pillsPerDay);
		} else {
			weekArray.push(0);
		}
	} trace("Updated week array for " + medicine + " : " + weekArray + " \n");
	let message = new MessageWithObject(discovery.url + "updateMedicine");
	var jsonData = {"name": medicine, "schedule": weekArray};
	message.requestText = JSON.stringify(jsonData);
	message.invoke();
}

let individualMedicineScreen = Column.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin,
	contents: [
		new button({ name: 'medicine-back-button', top: 15, left: 5, height: 15, 
			skin: whiteSkin, 
			content: new Picture({top: 0, height: 15, url: "assets/back_button.png"}),	
			nextScreen: myMedicineScreen,
		}),
		new editButton({ name: 'editButton', top: -15, left: 270, right: 10, width: 100, height: 25,
			skin: darkBlue, 
			content: new Label({string: "EDIT", style: whiteBodyStyle}),	
		}),
		new Column({
			top: 0, left: 0, right: 0, skin: whiteSkin,
			contents: [
			//this is hard-coded for now but we can change this later!
			new Picture({top: 20, height: 100, url: "assets/sertraline.png"}),
			new Label({ string: currentMedicine, style: blackHeadingStyle}),
			new Label({bottom: 20, string: myMedicines[currentMedicine]["quantity"] + " remaining", style: blueBodyStyle}),
			new Label({left: 15, top: 15, string: "DIRECTIONS", style: new Style({font: 'bold 18px Avenir-Roman', color: '#205DAB', horizontal: 'left'})}),
			new Label({left: 15, top: 5, string: myMedicines[currentMedicine]["directions"], style: blackBodyStyle}),
			new Label({left: 15, top: 15, string: "NOTIFICATIONS", style: new Style({font: 'bold 18px Avenir-Roman', color: '#205DAB', horizontal: 'left'})}),
			new Column({top: 0, left: 0, right: 0, skin: whiteSkin,
				contents: [], active: true,
				behavior: Behavior({
					onCreate: function(container) {
						// trace("RECREATING TIMES  FOR " + currentMedicine + "\n");
						// trace("HERE ARE THE TIMES: " + myMedicines[currentMedicine]["timesOfDay"] + "\n");
						for (var time in myMedicines[currentMedicine]["timesOfDay"]) {
							trace("RELOADING TIMES: " + myMedicines[currentMedicine]["timesOfDay"][time] + "\n")
							container.add(new Label({left: 15, top: 5, string: formatTime(myMedicines[currentMedicine]["timesOfDay"][time]), style: blackBodyStyle}))
						}
					}
				})}),
			new Line({top: 0, left: 10, right: 10, skin: whiteSkin,
				contents: [], active: true,
				behavior: Behavior({
					onDisplayed: function(container) {
						var daysOfWeek = myMedicines[currentMedicine]["daysOfWeek"];
						for (var day in weekNames) {
							if (contains(daysOfWeek, weekNames[day])) {
								container.add(new Picture({name: weekNames[day], height: 50, url: "assets/blue_" + weekNames[day] + ".png", active: true,
								behavior: Behavior({
									onTouchEnded: function(container) {
										trace(container.url.indexOf('blue') + "\n");
										if (container.url.indexOf('blue') != -1) {
											container.url = "assets/white_" + container.name + ".png";
											var index = daysOfWeek.indexOf(container.name);
											myMedicines[currentMedicine]["daysOfWeek"] = myMedicines[currentMedicine]["daysOfWeek"].splice(index, 1);
											updateMedicine(currentMedicine);
										} else {
											container.url = "assets/blue_" + container.name + ".png";
											myMedicines[currentMedicine]["daysOfWeek"].push(container.name);
											updateMedicine(currentMedicine);
										}
									}
								}) 
							}));
							} else {
								container.add(new Picture({name: weekNames[day], height: 50, url: "assets/white_" + weekNames[day] + ".png", active: true,
							behavior: Behavior({
									onTouchEnded: function(container) {
										if (container.url.indexOf('blue') != -1) {
											container.url = "assets/white_" + container.name + ".png";
											var index = daysOfWeek.indexOf(container.name);
											myMedicines[currentMedicine]["daysOfWeek"] = myMedicines[currentMedicine]["daysOfWeek"].splice(index, 1);
											updateMedicine(currentMedicine);
										} else {
											container.url = "assets/blue_" + container.name + ".png";
											myMedicines[currentMedicine]["daysOfWeek"].push(container.name);
											updateMedicine(currentMedicine);
										}
									}
								}) }));
							}
						}
					}
				})})
			], 
		}),
		new refillButton({ name: "requestRefillButton", height: 50, top: 50, left: 60, right: 60,
			skin: darkBlueBorderedSkin,
			content: new Label({ string: "REQUEST REFILL", style: blueBodyStyle })
		}),
	],
}));

var timer = 0;
var up = true;
//Refill Confirmation
let refillConfirmation = Layer.template($ => ({
	skin: greenSkin, left: 0, right: 0, height: 100, bottom: 0,
	contents: [new Container({skin: Yellow, left: 0, right: 0, top: 0, bottom: 0,
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
let refillError = Layer.template($ => ({
	skin: greenSkin, left: 0, right: 0, height: 100, bottom: 0,
	contents: [new Column({skin: mediumBlue, left: 0, right: 0, top: 0, bottom: 0,
		contents: [
				    new Label({top: 15, string: $.date, style: whiteHeadingStyle})]}),
					new Label({top: 40, string: "Please contact your doctor if this is a mistake", style: whiteBodyStyle})],
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
//Navbar
var navbarOut = false;
var navbarIn = false;

class menuOpenBehavior extends Behavior {
	onTouchEnded(button) {
		navbarIn = false;
		navbarOut = true;
	}
}

class menuCloseBehavior extends Behavior {
	onTouchEnded(button) {
		navbarOut = false;
		navbarIn = true;
		trace("menu close triggered! \n")
		trace(button.container.x + "\n")
	}
}

class NavBarBehavior extends Behavior {
	constructor(delta) {
		super(delta);
		this.dx = delta;
		this.dy = delta;
		this.width = 150;
		this.height = 568;
    }
    onDisplaying(ball) {
		ball.start();
		ball.moveBy(-150, 0)
    }
    onTimeChanged(ball) {
		if (ball.x < 555 && navbarOut) {
			let dx = this.dx;
			let dy = this.dy;
			ball.moveBy(dx, 0);
		} else {
			navbarOut = false;
			if (navbarIn && ball.x > 415) {
				let dx = this.dx;
				let dy = this.dy;
				ball.moveBy(-dx, 0);
			} else {
				navbarIn = false;
			}
		}
    }
};

let navbar = Layer.template($ => ({
	top: 0, left: 0, height: 568, width: 150, name: navbar,
	Behavior: class extends Behavior{
		onCreate(container) {
			container.opacity = 0;
			container.interval = 25;
			container.start();
		}
		onTimeChanged(container) {
			if (container.opacity < 1 ) {
				container.opacity = container.opacity + 0.05;
			} 
			else {
			}
		}
	}, skin: mediumBlue, opacity: 0,
	contents: [
		new Column({
			top: 0, left: 0, height: 568, width: 150, skin: mediumBlue,
			behavior: new NavBarBehavior(10),
			contents: [
				new Picture({height: 10, url: "assets/white_arrow.png", right: 15, top: 15, active: true, behavior: new menuCloseBehavior()}),
				new button({ name: 'nav-home', top: 25, left: 5,
					content: 
					new Line({contents: [
						new Picture({width: 15, url: "assets/home_icon.png", right: 5, active: true, behavior: new menuCloseBehavior()}),
						new Label({string: "HOME", style: navbarStyle, top: 0, left: 0})
					]}),
					nextScreen: homeScreen,
				}),
				new button({ name: 'nav-medicines', top: 10, left: 5,
					content: new Line({contents: [
						new Picture({width: 15, url: "assets/pill_icon.png", right: 5, active: true, behavior: new menuCloseBehavior()}),
						new Label({string: "MY MEDICINES", style: navbarStyle, top: 0, left: 0})
					]}),
					nextScreen: myMedicineScreen,
				}),
				new button({ name: 'nav-traveling', top: 10, left: 5,
					content: new Line({contents: [
						new Picture({width: 15, url: "assets/traveling_icon.png", right: 5, active: true, behavior: new menuCloseBehavior()}),
						new Label({string: "TRAVELING", style: navbarStyle, top: 0, left: 0})
					]}),	
					nextScreen: travelingScreen,
				})
				// // new Label({string: "Home", style: navbarStyle, top: 25, left: 15}),
				// new Label({string: "My Medicine", style: navbarStyle, top: 5, left: 15}),
				// new Label({string: "Travelling", style: navbarStyle, top: 5, left: 15})
			]
		})
	]
}));


//Lightbox
let lightbox = Layer.template($ => ({ 
    top: $.top, height: 350, left: $.left, width: 230,
    Behavior: $.behavior, skin: graySkin, opacity: 0.5,
    contents: [
        $.content
    ]
}));


let lightboxContent = Container.template($ => ({
	top: 0, left: 0, right: 0, bottom: 0, skin: whiteSkin, 
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
		// onTouchBegan: $.onTouchBegan,
		onTouchEnded: function(container) {
			mainContainer.remove(currentScreen);
			trace('removed current screen \n')
			currentScreen = new $.nextScreen;
			trace('set equal to next screen \n')
			mainContainer.insert(currentScreen, mainContainer.last);
			trace('added screen \n');		
		}
	})
}));
var stringTimes = "";

function parseTimes(str) {
	var array = stringTimes.split(/[ ,]+/);
	myMedicines[currentMedicine]["timesOfDay"] = [];
	for (var i in array) {
		var time = array[i];
		time = time.replace("AM", "");
		time = time.replace("PM", "");
		var date = Date.parse('Wed, 09 Aug 1995 ' + time + ':00');
		date = new Date(date);
		myMedicines[currentMedicine]["timesOfDay"].push(date);
		trace(date + "\n")
	}
	trace("HERE ARE THE NEW TIMES: " + myMedicines[currentMedicine]["timesOfDay"] + "\n" );
	return myMedicines[currentMedicine]["timesOfDay"];
}
function makeTimeString(array) {
	var string = "";
	for (var i in array) {
		var time = array[i];
		var minutes = time.getMinutes();
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		var time_string = "";
		if (i != 0) {
			time_string += ", "
		}
		time_string = time_string + time.getHours() + ":" + minutes;
		string += time_string;
	}
	return string;
}
let saveEditButton = Container.template($ => ({
	top: 45, left: 20, right: 20, active: true, height: 40, skin: whiteSkin,
	contents: 
		[new Label({string: "SAVE", style: boldBlackBodyStyle})],
	Behavior: class extends Behavior {
		onTouchEnded(button) {
			mainContainer.remove(mainContainer.last);
			var notifications = button.previous.first.first.string;
			stringTimes = notifications;
			var directions = button.previous.previous.previous.first.first.string;
			var medicine = currentMedicine;
			myMedicines[medicine]["directions"] = directions;
			myMedicines[medicine]["timesOfDay"] = parseTimes(notifications);
			updateMedicine(medicine);
			mainContainer.remove(currentScreen);
			currentScreen = new individualMedicineScreen();
			mainContainer.insert(currentScreen, mainContainer.last);
		}
	}
}));
let editLightboxContent = Column.template($ => ({
    top: 25, bottom: 50, left: 0, right: 0, height: 300,
    skin: darkBlue,
    contents: [
    	new Label({string: currentMedicine.toUpperCase(), style: boldWhiteBodyStyle, left: 0, right: 0, top: 25}),
    	new Label({string: "DIRECTIONS:", style: boldWhiteBodyStyle, height: 15, top: 15, left: 20}),
    	new MyField({name: "directions", buttonName: "directions", default: $.directions}),
    	new Label({string: "NOTIFICATION TIMES:", style: boldWhiteBodyStyle, height: 15, top: 10, left: 20}),
    	new MyField({name: "notifications", default: $.notifications}),
    	new saveEditButton()
    ]
}));

let editButton = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, 
	contents: [
		$.content
	],
	behavior: Behavior({
		// onTouchBegan: $.onTouchBegan,
		onTouchEnded: function(container) {
			var medicine = currentMedicine;
			var box = new lightbox({
				top: 100, content: new editLightboxContent({fillColor: 'white', directions: myMedicines[medicine]["directions"], notifications: makeTimeString(myMedicines[medicine]["timesOfDay"])})});
			mainContainer.add(box);
		}
	})
}));

let homeButton = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, name: $.name,
	contents: [
		$.content
	],
	behavior: Behavior({
		// onTouchBegan: $.onTouchBegan,
		onTouchEnded: function(container) {
			var medicine = currentMedicine;
			var lightbox_content;
			if (myMedicines[$.medicine]["quantity"] == 0) {
				lightbox_content = new lightboxContent({content: 
				new Column({
					contents: [
					new Picture({url: "assets/error.png", height: 100}),
					new Text({width: 200, string: "Unable to dispense " + $.medicine + ", there are 0 pills left.", style: boldBlackBodyStyle })]
				})
			});
			} else {
				lightbox_content = new lightboxContent({content: 
				new Column({
					contents: [
					new Picture({url: "assets/checkmark.png", height: 100}),
					new Text({width: 200, string: "Dispensing " + $.medicine + " from the device.", style: boldBlackBodyStyle })]
				})
			});
			}
			var box = new lightbox({
				behavior: class extends Behavior{
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
				},
				content: lightbox_content});
			mainContainer.add(box);
			if (myMedicines[$.medicine]["quantity"] != 0) {
				let message = new MessageWithObject(discovery.url + "dispense");
				message.requestText = $.medicine;
				message.invoke();
				myMedicines[$.medicine]["pillsTakenToday"] += 1;
				myMedicines[$.medicine]["quantity"] -= 1;
				trace("PILLS TAKEN: " + myMedicines[$.medicine]["pillsTakenToday"]  + " TIMES OF DAY: " + myMedicines[$.medicine]["timesOfDay"].length + "\n");
				if (myMedicines[$.medicine]["pillsTakenToday"] == myMedicines[$.medicine]["timesOfDay"].length) {
								// var index = medicineList["incomplete"].indexOf($.medicine);
								// trace("The index is: " + index + "\n");
								// trace(medicineList["incomplete"]+ "\n") ;
								// if (index > -1) {
								//     medicineList["incomplete"].splice(index, 1);
								//     trace(medicineList["incomplete"]+ "\n") ;
								// }
								// medicineList["complete"].push(container.name);
								currentScreen.remove(currentScreen.last);
								currentScreen.remove(currentScreen.last);
								currentScreen.add(new incompletelist());
								currentScreen.add(new completedlist());
				}
			}
		}
	})
}));
let travellingButton = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, name: $.name,
	contents: [
		$.content
	],
	behavior: Behavior({
		// onTouchBegan: $.onTouchBegan,
		onTouchEnded: function(container) {
			var medicine = currentMedicine;
			var canDispense = true;
			var tooLittleMedicines = ""
			for (var m in myMedicines) {
				var data = myMedicines[m];
				var pillsPerDay = data["timesOfDay"].length;
				var totalPills = travelling_days * pillsPerDay;
				if (totalPills > data["quantity"]) {
					canDispense = false;
					tooLittleMedicines = tooLittleMedicines + " " + m;
				}
			}
			var lightbox_content;
			if (canDispense) {
				lightbox_content = new lightboxContent({content: 
					new Column({
						contents: [
						new Picture({url: "assets/checkmark.png", height: 100}),
						new Text({width: 200, string: "Dispensing " + travelling_days + " worth of medicine from the device.", style: boldBlackBodyStyle })]
					})
				});
			} else {
				lightbox_content = new lightboxContent({content: 
					new Column({
						contents: [
						new Picture({url: "assets/error.png", height: 100}),
						new Text({width: 200, string: "You don't have enough " + tooLittleMedicines + " for " + travelling_days + " days", style: boldBlackBodyStyle })]
					})
				});
			}
			var box = new lightbox({
				behavior: class extends Behavior{
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
				},
				content: lightbox_content});
			if (canDispense) {
				mainContainer.add(box);
				let message = new MessageWithObject(discovery.url + "travelling");
				message.requestText = travelling_days;
				message.invoke();
				for (var m in myMedicines) {
					var data = myMedicines[m];
					var pillsPerDay = data["timesOfDay"].length;
					var totalPills = travelling_days * pillsPerDay;
					data["quantity"] -= totalPills;
				}
			} else {
				mainContainer.add(box);
			}
			travelling_days = 1;
			currentScreen.distribute("onUpdate");
		}
	})
}));



let medicineButton = Container.template($ => ({
	top: $.top, bottom: $.bottom, right: $.right, left: $.left, height: $.height,
	skin: $.skin, active: true, 
	contents: [
		$.content
	],
	behavior: Behavior({

		onTouchEnded: function(container) {
			currentMedicine = container.first.string;
			trace("current medicine is: " + currentMedicine + "\n");
			mainContainer.remove(currentScreen);
			trace('removed current screen \n')
			currentScreen = new $.nextScreen;
			trace('set equal to next screen \n')
			mainContainer.insert(currentScreen, mainContainer.last);
			trace('added screen \n');
			
			
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
					mainContainer.add(new refillError({date: container.first.string}));
			} else {
				mainContainer.add(new refillConfirmation());
				refilled = true;	
				var tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				container.first.string = "Your next refill is " + tomorrow.getMonth() + "/" + tomorrow.getDate();
				container.skin = darkBlue;
				container.first.style = whiteBodyStyle;
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

function getLists() {
	var complete = [];
	var incomplete = [];
	for (var medicine in myMedicines) {
		var data = myMedicines[medicine];
		var pillsPerDay = data["timesOfDay"].length;
		if (data["pillsTakenToday"] == pillsPerDay) {
			complete.push(medicine);
		} else {
			incomplete.push(medicine);
		}
	} return {"complete": complete, "incomplete": incomplete};
}

let completedlist = Column.template($ => ({
	top: 15, left: 0, right: 0, skin: whiteSkin,
	Behavior: class extends Behavior{
		onCreate(container) {
			var medicineList = getLists();
			for (var i in medicineList["complete"]) {
				var name = medicineList["complete"][i];
				container.add(
					new Container({name: name, top: 5, left: 25, 
						skin: whiteSkin, 
						contents: 
						new Line({contents: [
							new Picture({height: 15, url: "assets/completed.png", right: 5}),
							new Label({ string: name, style: blackBodyStyle}),	
						]})
						
						//nextScreen: dispensingLightbox,
					})
				);
			}
		}
	},
	contents: [
	new Label({ top: 25, left: 25, name: 'complete', string: 'COMPLETE', style: blueTitleStyle }),
	]
}));

let incompletelist = Column.template($ => ({
	top: 15, left: 0, right: 0, skin: whiteSkin,
	Behavior: class extends Behavior{
		onCreate(container) {
			var medicineList = getLists();
			for (var i in medicineList["incomplete"]) {
				var name = medicineList["incomplete"][i];
				container.add(
					new homeButton({medicine: name,  name: name, top: 5, left: 25, 
						skin: whiteSkin, 
						content: 
						new Line({contents: [
							new Picture({height: 15, url: "assets/incomplete.png", right: 5}),
							new Label({ string: name, style: blackBodyStyle}),	
						]})
					})
				);
			}
		}
	},
	contents: [
	new Label({ left: 25, name: 'incomplete', top: 20, string: 'INCOMPLETE', style: blueTitleStyle }),
	]
}));

/* Main Container */
var currentScreen;

let mainContainer = new Container({
	top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin,
	contents: [],
});

var discovery;
Handler.bind("/discover", Behavior({
    onInvoke: function(handler, message) {
        trace("found the device\n");
        discovery = JSON.parse(message.requestText);
        handler.invoke(new Message(discovery.url + "respond"), Message.TEXT);
    },
    onComplete: function(handler, message) {
        trace("hi\n");
    }
}));

application.add(mainContainer);
application.behavior = Behavior({
	onLaunch: function(application) {
		//hard-coded in the notification screen just for the purpose of this assignment - Stacy
			currentScreen = new Picture({ left: 0, right: 0, height: 568, url: "assets/homescreennotification.png",
			active: true, 
			behavior: Behavior({ onTouchEnded(container) {currentScreen = new homeScreen(); mainContainer.insert(currentScreen, mainContainer.last);}}), });
		mainContainer.add(currentScreen);
		mainContainer.add(new navbar());
	},
	onDisplayed: function(application) {
        application.discover("cs160-device.project.kinoma.marvell.com");
    },
    onQuit: function(application) {
        application.forget("cs160-device.project.kinoma.marvell.com");
    }
});

