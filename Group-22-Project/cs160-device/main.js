/* DEF */
let MED_MAX = 6;
let PILL_MAX = 100;
let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let dayMS = 86400000; //24 * 60 * 60 * 1000 = milliseconds in a day
let colors = ['#205dab', '#77a9da', '#4679bd', '#fdb737', '#ffd385'];
let popHeight = 180;
let popWidth = 240;

/*
@data.binding //object mapping the name of the medicine to the index in medicineList
{
	"{medicine_name}": //index in array
}
@data.container //array representing the container, storing the names of medicines, 0-5 for 6 containers
[
	//object in array
	"medicine_name"
]
@data.medicineList //array of objects containing medicine details
[
	//each object in this array looks like:
	{
		name: //string
		schedule: //length 7 array that stores the amount/dosage needed to take each day; 0=sunday to 6=saturday 
		start_date: //unix Date
		end_date: //unix Date
		amount: //amount of medicine pills
		history: //JS object - see below
		container: //handled/set by system
	}
]
@data.medicineList[].history //amount of pills dispensed on date; NOT_IMPLEMENTED: this thing is theoretically infinite sized so should flush data at some point
{
	"date": //number
}
@addMedicine call example: //addMedicine("test", [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")));
//refill button is actually really poor coding, done for the sake of time(it works though), i'd like to go back and clean it up if there is time in the future
*/

//COMMUNICATION TEST CODE FOR NOW
/* SKINS */
let whiteSkin = new Skin({fill: 'white'});
let graySkin = new Skin({fill: 'gray'});

let blue1Skin = new Skin({fill: '#205dab'});
let blue2Skin = new Skin({fill: '#77a9da'});
let blue3Skin = new Skin({fill: '#4679bd'});
let yellow1Skin = new Skin({fill: '#fdb737'});
let yellow2Skin = new Skin({fill: '#ffd385'});

/* STYLES */
let blackDateStyle = new Style({ font: '28px Avenir-Heavy', color: 'black', horizontal: 'center' });
let blackTextStyle = new Style({ font: '18px Avenir-Roman', color: 'black', horizontal: 'center' });
let blackHeaderStyle = new Style({ font: '20px Avenir-Heavy', color: 'black', horizontal: 'center' });
let whiteHeaderStyle = new Style({ font: '20px Avenir-Heavy', color: 'white', horizontal: 'center' });
let blueHeaderStyle = new Style({ font: '20px Avenir-Heavy', color: colors[2], horizontal: 'center' });
let blueBIGStyle = new Style({ font: '32px Avenir-Heavy', color: colors[2], horizontal: 'center' });
let yellowBIGStyle = new Style({ font: '26px Avenir-Heavy', color: colors[4], horizontal: 'center' });


/*  TEMPLATES */
let medicationButton = Line.template($ => ({
	top: 1, bottom: 1,
	skin: whiteSkin, active: true, 
	contents: $.contents,
	behavior: Behavior({
		onTouchEnded: function(content) {
			pop = new popup({ contentType: popContent2, parameters: {name: $.name, date: $.date} });
			mainContainer.add(pop);
		}
	})
}));

let medicationButton2 = Line.template($ => ({
	top: 1, bottom: 1,
	skin: whiteSkin, active: false, 
	contents: $.contents,
	//behavior: $.behavior
}));

let refillContentButton = Line.template($ => ({
	left: 0, top: 1, bottom: 1, skin: whiteSkin, active: true,
	contents: $.contents,
	behavior: Behavior({	
		onTouchEnded: function(container) {
			refillSelect = $.name;
			container.container.container.last.active = true; //set next button to Active
			container.container.container.last.skin = blue1Skin;
			container.first.url = "assets/Checkedbutton.png";
			for (var i = 0; i < data.medicineList.length; i++) {
				if (i != $.index) {refillList[i].first.url = "assets/Uncheckedbutton.png";}
			}
		}
	})
}));

let refillContentButton2 = Container.template($ => ({
	width: 120, height: 32, bottom: 6, skin: $.skin, active: $.active,
	contents: [ new Label({ string: $.string, style: whiteHeaderStyle }) ],
	behavior: Behavior({	
		onTouchEnded: function(container) {
			//trace("" + refillSelect +"\n");
			pop.remove(pop.first.next);
			pop.add(new $.nextScreen($.parameters));
		}
	})
}));

let refillButton = Container.template($ => ({
	bottom: 4, right: 4, height: 50, width: 50, skin: whiteSkin, active: true, 
	contents: [ new Picture({ height: 50, width: 50, url: "assets/refill.png" }) ],
	behavior: Behavior({
		onTouchEnded: function(content) {
			var refillContent = [];
			refillContent.push(new Label({ top: 6, string: "Select a pill to refill:", style: blackHeaderStyle }));
			
			refillList = [];
			for (var i = 0; i < data.medicineList.length; i++) {
				refillList.push(new refillContentButton({ 
					name: data.medicineList[i].name, index: i,
					contents: [
						new Picture({ right: 5, height: 15, width: 15, url: "assets/Uncheckedbutton.png" }),
						new Label({ string: data.medicineList[i].name, style: blackTextStyle }) 
					] 
				}));
			}
			refillContent.push(new Column({ top: 26, left: 64, skin: whiteSkin, contents: refillList }));
			
			refillContent.push(new refillContentButton2({ string: "NEXT", nextScreen: popContent11, skin: graySkin, active: false, parameters: {}}));
			pop = new popup({ contentType: popContent1, parameters: {contents: refillContent} });
			mainContainer.add(pop);
		}
	})
}));

let prevDayButton = Container.template($ => ({
	right:14, height: 26, width: 26, skin: whiteSkin, active: true, 
	contents: [ new Picture({ height:26, width:26, url:"assets/leftarrow.png"}) ],
	behavior: Behavior({
		onTouchEnded: function(content) {
			if (currentDatePointer - dayMS >= lowerDateLimit) {
				currentDatePointer -= dayMS;
				updateAllContent(currentDatePointer);
			} else {
				trace("HIT DATE LIMIT\n");
			}
		}
	})
}));

let nextDayButton = Container.template($ => ({
	left:14, height: 26, width: 26, skin: whiteSkin, active: true, 
	contents: [ new Picture({ height:26, width:26, url:"assets/rightarrow.png"}) ],
	behavior: Behavior({
		onTouchEnded: function(content) {
			if (currentDatePointer + dayMS <= upperDateLimit) {
				currentDatePointer += dayMS;
				updateAllContent(currentDatePointer);
			} else {
				trace("HIT DATE LIMIT\n");
			}
		}
	})
}));

let shadowBox = Layer.template($ => ({
	top: 0, bottom: 0, left: 0, right: 0, active: true,
	contents: [ new Container({ top: 0, left: 0, right: 0, bottom: 0, skin: graySkin }) ],
	behavior: Behavior({
		onCreate: function(layer) {
			layer.opacity = 0.5;
		},
		onTouchEnded: function(layer) {
			mainContainer.remove(pop);
		}
	})
}));

let popContent1 = Container.template($ => ({
	height: popHeight, width: popWidth, skin: whiteSkin, active: true,
	contents: $.contents
}));

let popContent11 = Container.template($ => ({
	height: popHeight, width: popWidth, skin: whiteSkin, active: true,
	contents: [
		new Label({ top: 6, string: "Open top of device and refill:", style: blackHeaderStyle }),
		new Label({ top: 64, string: "Compartment #" + data.medicineList[data.binding[refillSelect]].container, style: blueBIGStyle }),
		new refillContentButton2({ string: "DONE", nextScreen: popContent111, skin: blue1Skin, active: true, parameters: {} })
	]
}));

let popContent111 = Container.template($ => ({
	height: popHeight, width: popWidth, skin: whiteSkin, active: true,
	contents: [ 
		new Picture({ top: 20, height: 100, width: 100, url: "assets/checkmark.png"}),
		new Label({ bottom: 16, string: "Success!", style: yellowBIGStyle })
	],
	behavior: Behavior({
		onCreate: function(application) {	
			data.medicineList[data.binding[refillSelect]].amount = PILL_MAX; //just set to pillmax for now
		}
	})
}));

let popContent2 = Container.template($ => ({
	height: popHeight, width: popWidth, skin: whiteSkin,
	active: true,
	contents: [
		new Picture({ top: 20, height: 100, width: 100, url: "assets/checkmark.png"}),
		new Label({ bottom: 20, string: "Dispensing " + $.name + " Now.", style: blackTextStyle })
	],
	behavior: Behavior({
		onCreate: function(container) {
			container.duration = 2000;
			container.start();
			//handle medicine logic here for now, should actually be in onFinished with a method to cancel(such as clicking on shadowbox) in the future ?
		},
		onFinished: function(container) {
			var a = data.binding[$.name];
			data.medicineList[a].history[$.date] += 1 //data.medicineList[a].schedule[(new Date($.date).getDay())];
			mainContainer.remove(pop);
			updateMedicineContent($.date);
			writeData();
		}
	})
}));

let popup = Container.template($ => ({
	top: 0, bottom: 0, left: 0, right: 0, 
	contents: [
		new shadowBox({}),
		new $.contentType($.parameters)
	]
}));

let header = Column.template($ => ({
	top: 0, left: 0, right: 0, skin: whiteSkin,
	contents: [
		new Picture({ top: 4, height:60, width:60, url:"assets/calendar.png" }),
		new Line({
			contents: [
				//new Picture({ right:14, height:26, width:26, url:"assets/leftarrow.png"}), //TODO:button
				new prevDayButton({}),
				new Label({ string: $.date, style: blackDateStyle }),
				new nextDayButton({})
				//new Picture({ left:14, height:26, width:26, url:"assets/rightarrow.png"}) //TODO:button
			]
		}),
	],
}));

/* VARIABLES */
var uri;
var data;
var pop;
var medicineContent;
var headerContent;
var loadingComplete;
var currentDatePointer;
var refillList;
var refillSelect;
var cache;
var tempName;
var schedule;

var lowerDateLimit;
var upperDateLimit;

var mainContainer = new Container({
	top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin,
	contents: [
		//new Picture({ bottom: 4, right: 4, height: 50, width: 50, url: "assets/refill.png" }) //needs to become button
		new refillButton({})
	]
});

var loadingScreen = new Container({
	top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin, active: true,
	contents: [
		new Layer({
			top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin, active: true,
			contents: [ new Picture({ height:240, width:320, url:"assets/loading.png" }) ],
			behavior: Behavior ({
				onCreate: function(layer) {
					layer.opacity = 0;
					layer.interval = 30;
					layer.duration = 3000;
					layer.start();
				},
				onTimeChanged: function(layer) {
					if (layer.opacity < 1) {layer.opacity = layer.opacity + 0.01;}
				},
			})
		})
	],
	behavior: Behavior({
		onCreate: function(container) {
			container.duration = 4000; //set back to 4000 for loading
			container.start();
		},
		onFinished: function(container) {
			if (loadingComplete) {
				application.remove(loadingScreen);
				application.add(mainContainer);
			} else {
				container.duration = 1000;
				container.time = 0;
            	container.start();
			}
		}
	})
});

/* FUNCTIONS */
function loadData() {data = Files.readJSON(uri);}
function writeData() {Files.writeJSON(uri, data);}
function clearMedicineList() {Files.writeJSON(uri, { binding: {}, container: [], medicineList: [] });}

function currentDate() {
	var t = new Date();
	return (new Date(t.getFullYear(), t.getMonth(), t.getDate())).valueOf();
}

function isInRange(date, index) {
	if (date >= data.medicineList[index].start_date && date <= data.medicineList[index].end_date) {return true;}
	return false;
}

function getFormattedDate(unixDate) {
	var date = new Date(unixDate);
	var datestring = ""
	datestring += date.getDate() + " ";
	datestring += monthNames[date.getMonth()] + " ";
	datestring += date.getFullYear();
	return datestring;
}

function updateMedicine(name, schedule) {
	var index = data.binding[name];
	trace("Updating " + name + " on device with schedule " + schedule + "\n");
	trace("This is what data looks like rn: " + JSON.stringify(data.medicineList) + "\n");
	data.medicineList[index].schedule = schedule;
	writeData();
	updateMedicineContent(currentDate());
	return true;
}

function addMedicine(mn, ms, msd, med, am, weight, index) {
	index = index || -1; //0-5 means rewrite index, -1 means push
	am = am || 0; //amount of medicine, default 0
	trace("here's the weight: " + weight + "\n");
	weight = weight || -1;
	if (index > (MED_MAX-1) || index < -1) {trace("invalid index\n"); return false;}
	if (am < 0) {trace("invalid amount\n"); return false;}
	if (mn in data.binding) {trace("medicine already exists\n"); return false;}
	if (weight == -1) {trace("invalid weight amount\n"); return false;}
	if (index == -1) {
		if (data.medicineList.length >= MED_MAX) {trace("medicine list is full\n"); return false;}
		var c;
		for (var c = 0; c <= MED_MAX; c++) {
			if (c == MED_MAX) {trace("strange error; this shouldn't happen; container full\n"); return false;}
			if (data.container[c] == undefined) {
				data.container[c] = mn; break;
			}
		}
		trace("Now adding new medicine on device: " + mn);
		index = data.medicineList.push({ name: mn, schedule: ms, start_date: msd.valueOf(), end_date: med.valueOf(), amount: am, history: {}, container: c, weight: weight}) - 1;
		data.binding[mn] = index;		
	} else {
		var tempname = data.medicineList[index].name;
		var c = data.medicineList[index].container;
		delete data.binding[tempname];
		data.container[c] = mn;
		data.medicineList[index] = { name: mn, schedule: ms, start_date: msd.valueOf(), end_date: med.valueOf(), amount: am, history: {}, container: c, weight: weight };
		data.binding[mn] = index;
	}	
	writeData();
	return true;
}

function removeMedicine(mn) {
	if (!(mn in data.binding)) {return false;}
	var i = data.binding[mn];
	delete data.binding[mn];
	var c = data.medicineList[i].container;
	data.container[c] = undefined;
	data.medicineList.splice(i, 1);
	return true;
}; 

function generateMedicineContent(date, useCache) {
	if (useCache) {
		if (date in cache) {trace("cache hit\n"); return cache[date];} 
	}
	
	var tempList = [];
	var tempList2 = [];
	var tempDay = new Date(date).getDay();
	tempList.push(new Label({ string: "INCOMPLETE", style: blueHeaderStyle }));
	//push incomplete medicines
	for (var i = 0; i < data.medicineList.length; i++) {
		trace("HISTORY IS: "  + data.medicineList[i].history + "\n");
		trace("DEALING WITH " + data.medicineList[i].name + " NOW , IT'S DATE IS: " + data.medicineList[i].history[date] + "\n");
		if (data.medicineList[i].schedule[tempDay] > 0 && isInRange(date, i)) {
			if (date in data.medicineList[i].history) {
				if (data.medicineList[i].history[date] < data.medicineList[i].schedule[tempDay]) {
						tempList.push(new medicationButton({ name: data.medicineList[i].name, date: date, contents: [ new Label({ string: data.medicineList[i].name, style: blackTextStyle }) ] }));
				} else if (data.medicineList[i].history[date] == undefined){
				  	data.medicineList[i].history[date] = 0;
				  	tempList.push(new medicationButton({ name: data.medicineList[i].name, date: date, contents: [ new Label({ string: data.medicineList[i].name, style: blackTextStyle }) ] }));
				} else {
				  	tempList2.push(new medicationButton2({ contents: [ new Label({ string: data.medicineList[i].name, style: blackTextStyle }) ] }));
				}
			} else {
				data.medicineList[i].history[date] = 0;
				tempList.push(new medicationButton({ name: data.medicineList[i].name, date: date, contents: [ new Label({ string: data.medicineList[i].name, style: blackTextStyle }) ] }));
			}
		}
	}
	tempList.push(new Label({ string: "COMPLETE", style: blueHeaderStyle }));
	//push complete medicines
	tempList = tempList.concat(tempList2);
	var tempContent = new Column({ horizontal:'center', top: 90, skin: whiteSkin, contents: tempList });
	cache[date] = tempContent;
	
	return tempContent;
}

function generateHeaderContent(date) {	
	return new header({ date: getFormattedDate(date) });
}

function updateMedicineContent(date) {
	mainContainer.remove(medicineContent);	
	medicineContent = generateMedicineContent(date, false); //can't use cache hits for this call because same page update
	mainContainer.add(medicineContent);
}

function updateAllContent(date) {
	mainContainer.remove(headerContent);
	mainContainer.remove(medicineContent);
	headerContent = generateHeaderContent(date);	
	medicineContent = generateMedicineContent(date, true); //can use cache hits since this is used to go to next or prev day
	mainContainer.add(headerContent);
	mainContainer.add(medicineContent);
}

function validConfigFile() {
	if (!("binding" in data)) {return false;}
	if (!("container" in data)) {return false;}
	if (!("medicineList" in data)) {return false;}
	return true;
}

function startup() {
	Files.ensureDirectory(mergeURI(Files.documentsDirectory, "cs160/")); //creates folder if it does not exist
	uri = mergeURI(Files.documentsDirectory, "cs160/data.json");
	if (!Files.exists(uri)) {
		trace("no config file found; creating new config file\n");
		Files.writeJSON(uri, { binding: {}, container: [], medicineList: [] }); //creates empty config file if it does not exist
	}
	clearMedicineList(); //uncomment to clear all config settings
	data = Files.readJSON(uri);
	if (!validConfigFile()) {
		trace("invalid config file; creating new config file\n");
		Files.writeJSON(uri, { binding: {}, container: [], medicineList: [] }); //creates empty config file if current one is corrupt; should back up corrupt file in case?
		data = Files.readJSON(uri);
	}
	cache = {};
	//some add / remove test commands
	
	addMedicine("Sertraline", [2,2,2,2,2,2,2], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")), 10, 100);
	addMedicine("Vitamin A", [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")), 10, 100);
	// addMedicine("hello3", [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")));
	// addMedicine("hello4", [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")));
	// //addMedicine("hello5", [1,1,1,1,1,1,1], new Date(Date.parse("November 10 2016")), new Date(Date.parse("January 17 2017")));
	// addMedicine("hello6", [1,0,1,0,1,0,1], new Date(Date.parse("December 10 2016")), new Date(Date.parse("January 17 2017")));
	
	
	headerContent = generateHeaderContent(currentDate());
	mainContainer.add(headerContent);	
	medicineContent = generateMedicineContent(currentDate(), false);
	mainContainer.add(medicineContent);
	currentDatePointer = currentDate();
	lowerDateLimit = currentDatePointer - 20 * dayMS;
	upperDateLimit = currentDatePointer + 20 * dayMS;
	
	loadingComplete = true;
}

/* HANDLERS */
Handler.bind("/respond", Behavior({
	onInvoke: function(handler, message) {
		message.responseText = "You found me!";
		message.status = 200;
	}
}));

Handler.bind("/dispense", Behavior({
	onInvoke: function(handler, message) {
		tempName = message.requestText;
		trace("Message request text is: " + message.requestText + "\n");
		pop = new popup({ contentType: popContent2, parameters: {name: tempName, date: currentDate()} });
		mainContainer.add(pop);
	}
}));

Handler.bind("/addMedicine", Behavior({
	onInvoke: function(handler, message) {
		var tempArray = JSON.parse(message.requestText);
		trace("ADDING NEW MEDICINE! \n")
		trace("TEMPARRAY 0:" + tempArray[0] + " \n");
		trace("TEMPARRAY 1:" + typeof tempArray[1] + " \n");
		trace("TEMPARRAY 2:" + typeof tempArray[2] + " \n");
		trace("TEMPARRAY 3:" + typeof tempArray[3] + " \n");
		trace("TEMPARRAY 4:" + typeof tempArray[4] + " \n");
		trace("TEMPARRAY 5:" + typeof tempArray[5] + " \n");
		addMedicine(tempArray[0], tempArray[1], new Date(parseInt(tempArray[2])), new Date(parseInt(tempArray[3])), tempArray[4], tempArray[5]); //name, schedule, start, end
		pop = new popup({contentType: popContent1, parameters: {contents: [
			new Picture({ top: 20, height: 100, width: 100, url: "assets/checkmark.png"}),
			new Text({ left: 10, right: 10, bottom: 20, string: "Successfully added new medicine, " + tempArray[0], style: blackTextStyle })
			]
		}});
		mainContainer.add(pop);
	}
}));

Handler.bind("/travelling", Behavior({
	onInvoke: function(handler, message) {
		//Orson please add functionality to reduce quantity of each pill by pills_per_day * num_days_travelling
		var num_days = parseInt(message.requestText);
		for (var i = 0; i < data.medicineList.length; i++) {
			data.medicineList[i].amount -= data.medicineList[i].schedule[(new Date(currentDate())).getDay()] * num_days;
		}
		pop = new popup({contentType: popContent1, parameters: {contents: [
			new Picture({ top: 20, height: 100, width: 100, url: "assets/checkmark.png"}),
			new Label({ bottom: 20, string: "Dispensing " + message.requestText + " days worth of pills.", style: blackTextStyle })
			]
		}});
		mainContainer.add(pop);
	}
}));

Handler.bind("/updateMedicine", Behavior({
	onInvoke: function(handler, message) {
		var information = JSON.parse(message.requestText);
		trace("Recieved update information: " + JSON.stringify(information) + " \n");
		tempName = information["name"];
		schedule = information["schedule"];
		updateMedicine(tempName, schedule); //schedule should be an array [1,1,1,1,1,1,1]
		pop = new popup({contentType: popContent1, parameters: {contents: [
			new Picture({ top: 20, height: 100, width: 100, url: "assets/checkmark.png"}),
			new Label({ bottom: 20, string: "Successfully updated information for " + tempName, style: blackTextStyle })
			]
		}});
	}
}))

/* MAIN */
class AppBehavior extends Behavior{
	onLaunch(application) {
		application.shared = true;
		loadingComplete = false;
		application.add(loadingScreen); //load loading screen
		startup(); //run startup functions
		//application.add(mainContainer);
	}
	onQuit(application) {
		application.shared = false;
	}
};

application.behavior = new AppBehavior();

/* RANDOM JS TESTS */

/*
var testarray = [];
testarray[5] = "hi";
trace("\n" + testarray[6] + "\n");
if (testarray[6] == undefined) {trace("HOHOHAHA\n");}
trace("\n" + testarray.length + "\n");
testarray.splice(1,1);
trace("\n" + testarray[4] + "\n");
trace("\n" + testarray.length + "\n");
var d = Date.parse("December 5 2016");
var f = new Date(d + dayMS);
var v = new Date();
var z = new Date(v.getFullYear(), v.getMonth(), v.getDate());
trace("" + f.toDateString() +"\n");
trace("" + z.toDateString() +"\n");
trace("" + v.valueOf() +"\n"); //includes hours minutes seconds and milliseconds (in v but not in z)
trace("" + z.valueOf() +"\n"); //confirmed z.valueOf == d.valueOf, typeof valueOf is number
var o = {};
var r = 1444
o[r] = "hi";
trace(JSON.stringify(o));
trace(o["1444"]);
if (r in o) {trace("aloha\n");}*/

/* OLD CODE */
/*
let popContent0 = Container.template($ => ({
	height: 180, width: 200, skin: whiteSkin,
	active: true,
	contents: [	
		new Container({
			height: 100, width: 100,
			active: true,
			contents: [ new Picture({height: 100, width: 100, url: "assets/checkmark.png"}) ],
			behavior: Behavior({	
				onTouchEnded: function(content) {
					pop.remove(pop.first.next); //removes this popContent1
					//pop.first.active = false; //disable background cancel function
					pop.add(new popContent2({ name: $.name, date: $.date }));
				}
			})
		})
	]
}));*/