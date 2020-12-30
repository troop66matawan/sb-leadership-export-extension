// sbbackground.js
// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

// TODO  refactor code using setInterval   Clumsy now.


/*

chrome.browserAction.setBadgeText({text:'+'});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});	//red		+
chrome.browserAction.setBadgeBackgroundColor({color: [253, 255, 112, 1]});	//Yellow	!
chrome.browserAction.setBadgeBackgroundColor({color: [24,204 , 0, 1});	//Green			-
*/


/*
---------------------------------------
Page Event Messages
Visible	- The tab became visible
Reset - navigation to a sensitive page occurred.  This can occur as a result of the user clicking Continue on a warning
ClosePopup	- User hit Close on Popup
Logoff - User manually  Logged out of Scoutbook

New
PageChange - navigation to a non-sensitive page occurred


Messages received contain an origin (host) e.g. www.  and the message name
---------------------------------------

Page Control Message - messages sent to the Page

ShowTimeoutWarning	- 		Display warning popup
LoggedOff	- 	Display Logout popup
HidePopups - 	Clear any popups



--------------------------------------------
Basic logic is this: 

On Startup 
	save clock to now - 30 minutes
	clear all timers
	clear Session Flag - not logged in
 
	Receive Reset for host, ev.sensitive=='yes'
		save clock, 
		start interval timer
		send HidePopups for host
		Set Session Flag - logged in
		clear stickyclosewarn
		clear stickycloseloggoff

	Receive PageChange for host ev.sensitive=='no'
		If Session Flag indicates logged in
			same as Receive Reset
			
			
		
	Receive	Visible for host
		Compare clock to saved clock
		Reset interval timers based on clock diffs
		if in warning period 
			if stickyclosewarn not set
				send ShowTimeoutWarning
		
		If timers expired
			If Session Flag indicates logged in
			    if stickycloseloggoff not set
					send Loggedoff
				clear Session Flag - not logged in


				
	Receive ClosePopup for host
		If in warning period
			set stickyclosewarn
		if session logged off 
		    set stickycloseloggoff
			
	Receive Logoff
		clear Session Flag - not logged in
		save clock -current time - 31 minutes
		clear timers
		

		
	IntervalTimer- set to full length of time	
	
	on a new tab, I don't want any popups.
	
*/
var bkgHostArray = chrome.runtime.getManifest().content_scripts[0].matches;

var WARNtime = 25; // numbr of minutes before warning popup
var TOtime = 30; // Timeout period - 30 minutes
var greenTime = 1000 * 60 * WARNtime; //25 min in ms
var yellowTime = 1000 * 60 * (TOtime - WARNtime); // 5 min in ms
var redTime = 1000 * 60 * TOtime; // 30 minutes in ms
var id = ''; // tabs[0].id;

var originObjList=[];       // contains list of origin objects
var debugList = [];
var debug = false;



chrome.runtime.onMessage.addListener(function (msgobj, sender) {
    try {
        if (msgobj.msg) {
            ev = JSON.parse(msgobj.msg);
            if (!(typeof ev === 'object')) {
                return true;
            }
        } else {
            //console.log("unrecognized message", msgobj);
            return true;
        }
    } catch (e) {
        console.log("parse error", e, msgobj);
        return true;
    }
    
    logDebug('New message event rcv in background: ' + ev.text);
    if (isLocalLibraryCmd(ev.text) == false) {
        //log only if received cmd
        logDebug('Message start' + msgobj.msg + '\n ' + varState());
    }

    if (ev.text == "showHelp") {
        chrome.tabs.create({
            url: "options.html"
        });
    }

    if (ev.text == "XHRProxy_") {
        //evx.msg= JSON.stringify(ev.data);
        XHR_Proxy(ev);
    }

    var originPtr = -1;
    for (var i = 0;i < originObjList.length;i++) {
        if (originObjList[i].origin == ev.origin) {
            originPtr = i;
            break;
        }
    }
    
    if(originPtr == -1) {
        //init timers and flags for this origin
       // console.log(ev);
        originObjList.push({origin:ev.origin,
                 timer:'',
                 startTime:-1,
                 userClosedWarning:false,
                 userClosedLogoffNotice:false,
                 session:false,
                 warningShownOnce:false,
                 initLogoff:false,
                 URLTime:[],
                });
        originPtr =  originObjList.length - 1;       
    }


    if (ev.text == "RestartSession") {
        //logDebug('New message event rcv in background: '  + ev.text + ' ' + ev.sensitive + ' ' + ev.origin);
        //Find the origin

        if (originObjList[originPtr].URLTime.length >= 4) {
            originObjList[originPtr].URLTime.shift();
        }
        originObjList[originPtr].URLTime.push(logTime(Date.now()) + ' ' + ev.url);

        //what kind of reset? from a pger requiring a login or not
        var start = false;
        if (ev.sensitive == 'yes') {
            // from page requiring login
            start = true;
        } else {
            // from page not requiring login.

            if (originObjList[originPtr].session == true) {
                start = true;
            }
        }

        if (start == true) {
            logDebug('Resetting '+originObjList[originPtr].origin+' Active Session');

            chrome.browserAction.setBadgeText({
                text: '+'
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: [24, 204, 0, 1]
            }); //Green

            originObjList[originPtr].userClosedWarning = false; //sticky notices
            originObjList[originPtr].userClosedLogoffNotice = false; //sticky notices
            //reset interval
            clearInterval(originObjList[originPtr].timer);
            originObjList[originPtr].session = true;
            originObjList[originPtr].warningShownOnce = false; // Re-allows a warning to be displayed
            originObjList[originPtr].initLogoff = true;
            // First set/reset a timer to trigger a prompt when the session is nearing an end
            originObjList[originPtr].startTime = Date.now();
            originObjList[originPtr].timer = setInterval(function () {
                    originShowTimer(originPtr);
                }, 1000);
        }

    }

    if (ev.text == 'ClosePopup') {
        //logDebug('New message event rcv in background: '  + ev.text+ ' ' + ev.origin);
        //ev.origin.indexOf('www.') != -1) 


        if (originObjList[originPtr].session == true) {
            originObjList[originPtr].userClosedWarning = true;

        } else {
            chrome.browserAction.setBadgeText({
                text: ''
            });
            originObjList[originPtr].userClosedLogoffNotice = true;

            originObjList[originPtr].initLogoff = false;
        }        
        
       
    }

    // b71780684
    if (ev.text == 'Visible') {
        //logDebug('New message event rcv in background: '  + ev.text + ' ' + ev.origin);
        //if (ev.origin.indexOf('www.') != -1) 
        if (originObjList[originPtr].session == true) {
            // as far as we know so far, a session is still active.  Could have been hibernated though...
            clearInterval(originObjList[originPtr].timer); // Stop the interval timer
            var elapsedTime = Date.now() - originObjList[originPtr].startTime; // Get the new Elapsed time in ms from the saved start time, in case the cpu hibernated


            //Reasons to clear popups - popup showing on a page, navigation in another page reset the session
            if ((redTime - elapsedTime) > yellowTime) {
                //if more than 5 minutes is left ; 30 min in ms - elapsed in ms if gt 5 min in ms
                //clear any popups

                postMsg({
                    hostx: originObjList[originPtr].origin,
                    text: "HidePopups"
                });
            }
            // Previously requested a clear so if it is already displayed, clear it
            if (originObjList[originPtr].userClosedWarning == true) {
                if (yellowTime > (redTime - elapsedTime)) {
                    if ((redTime - elapsedTime) >= 0) {
                        // clear if previously cleared and in warning period
                        postMsg({
                            hostx: originObjList[originPtr].origin,
                            text: "HidePopups"
                        });
                    }
                }
            }
            // Previously requested a clear so if it is already displayed, clear it
            if (originObjList[originPtr].userClosedLogoffNotice == true) {
                postMsg({
                    hostx: originObjList[originPtr].origin,
                    text: "HidePopups"
                });
            }

            if (elapsedTime > redTime) {
                //good morning, we just woke up from hibernation and are logged out
                // We handle this case when the interval timer fires
            }

            originObjList[originPtr].warningShownOnce = false; //when switching tabs, if someone clicked outside the box, re-allows warning display
            originObjList[originPtr].timer = setInterval(function () {
                    originShowTimer(originPtr);
                }, 1000);
        } else {
            //logged out
            if (originObjList[originPtr].userClosedLogoffNotice == true) {
                // Previously requested a clear so if it is already displayed, clear it
                postMsg({
                    hostx: originObjList[originPtr].origin,
                    text: "HidePopups"
                });
            } else {
                if (originObjList[originPtr].initLogoff == true) {
                    postMsg({
                        hostx: originObjList[originPtr].origin,
                        text: "ShowLoggedOffPopup"
                    });
                    chrome.browserAction.setBadgeText({
                        text: '-'
                    });
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: [255, 0, 0, 255]
                    }); //red
                }
            }
        }
    }

    if (ev.text == 'LogOff') {
        //logDebug('New message event rcv in background: '  + ev.text );

        var popupDiv='wwwtimer';
        
        if (/qa/.test(originObjList[originPtr].origin)) {
            popupDiv='othtimer';
        }
        
        originObjList[originPtr].session = false;
        clearInterval(originObjList[originPtr].timer);
        originObjList[originPtr].startTime = Date.now() - 30 * 60 * 1000;
        updateTimerPop(popupDiv, 'User Logged Off');

        chrome.browserAction.setBadgeText({
            text: ''
        });           
            
           
    }

    if (isLocalLibraryCmd(ev.text) == false) {
        //log only if received cmd
        logDebug('Message exit\n ' + varState());
    }
}); // use


function isLocalLibraryCmd(cmd) {
    var cmds = ['ShowTimeoutWarning', 'ShowLoggedOffPopup', 'HidePopups']; //var cmds=['Ack','RestartSession','Logoff','ClosePopup','Visible'];  //

    for (var i = 0; i < cmds.length; i++) {
        if (cmds[i] == cmd) {
            return true;
        }
    }
    return false;
}

function updateTimerPop(divId, msg) {
    var views = chrome.extension.getViews({
            type: "popup"
        });
    for (var i = 0; i < views.length; i++) {
        views[i].document.getElementById(divId).innerText = msg;
    }
}

function originShowTimer(originPtr) {

    var Elapsed = Date.now() - originObjList[originPtr].startTime;
    var mSecRemain = redTime - Elapsed;
    var SecRemain = (redTime - Elapsed) / 1000;
    var min = parseInt((SecRemain / 60) + '');
    var sec = (SecRemain - min * 60).toFixed(0);

    var popupDiv='wwwtimer';
    
    if (/qa/.test(originObjList[originPtr].origin)) {
        popupDiv='othtimer';
    }

    if (mSecRemain <= 0) {

        UpdatePopup(popupDiv, "Logout", 1);
        clearInterval(originObjList[originPtr].timer); // Stop the interval timer, no longer needed
        if (originObjList[originPtr].userClosedLogoffNotice == false) {
            chrome.browserAction.setBadgeText({
                text: ''
            });
            if (originObjList[originPtr].initLogoff == true) {
                postMsg({
                    hostx: originObjList[originPtr].origin,
                    text: "ShowLoggedOffPopup"
                });
                chrome.browserAction.setBadgeText({
                    text: '-'
                });
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                }); //red		+

            }
        }
        originObjList[originPtr].session = false;
        logDebug('No Time Remaining\n ' + varState());
    } else if (mSecRemain <= yellowTime) {
        //views[i].document.getElementById('wwwtimer').innerText = "Session Time Remaining "+min+"m "+sec+"s < 5 min";
        UpdatePopup(popupDiv, "Session Time Remaining " + min + "m " + sec + "s < 5 min", 0);
        if (originObjList[originPtr].userClosedWarning == false) {
            if (originObjList[originPtr].warningShownOnce == false) {
                //the warning hasn't been displayed yet.  Don't display each clock tick, so disable after it has been shown once.
                var ev = {
                    hostx: originObjList[originPtr].origin,
                    text: "ShowTimeoutWarning",
                    endtime: ''
                };
                ev.endTime = originObjList[originPtr].startTime + redTime;
                postMsg(ev, id);
                originObjList[originPtr].warningShownOnce = true;
                logDebug('After Warn Shown\n ' + varState());
                chrome.browserAction.setBadgeText({
                    text: '!'
                });

                chrome.browserAction.setBadgeBackgroundColor({
                    color: [253, 255, 112, 1]
                }); //Yellow	!

            }
        }
    } else {

        UpdatePopup(popupDiv, "Session Time Remaining " + min + "m " + sec + "s", 0);
    }

}

// gets called every second


function UpdatePopup(divId, statusMsg, logStat) {
    var views = chrome.extension.getViews({
            type: "popup"
        });
    for (var i = 0; i < views.length; i++) {
        views[i].document.getElementById(divId).innerText = statusMsg;
    }
    if (logStat == 1) {
        logDebug('UpdatePopup ' + divId + ' ' + statusMsg);
    }
}


function postMsg(ev) {

   // console.log('postMessage from background ', ev);
    var host = ev.hostx;

    if (typeof(chrome.tabs) === 'object') {

        chrome.tabs.query({
            active: true,
            url:  host +'/*'
        }, function (tabs) {
            if(tabs.length == 0) {
                //console.log('No tab matching ' + 'https://' + host +'/*' + ' was found to send msg');
            } else {
                //console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id, ev);
                //console.log('Sending to tab ' + tabs[0].id);
            }
        });
    }
    // else not supported; Android needs V54 to work
}



// this function is a test function, not used normally
function setTimePeriod(beforewarn, warntime) {
    
    for (var i = 0;i < originObjList.length;i++) {
        originObjList[i].session = false;
        clearInterval(originObjList[i].timer);
    }
    


    if (beforewarn != 0) {
        greenTime = 1000 * beforewarn; //e.g. 30 is 30 seconds
        yellowTime = 1000 * warntime; //60 is 60 seconds
        redTime = 1000 * (beforewarn + warntime);
    } else {

        greenTime = 1000 * 60 * WARNtime;
        yellowTime = 1000 * 60 * (TOtime - WARNtime);
        redTime = 1000 * 60 * TOtime;
    }

    return 'OK';

}

// Force load if content script when extension is loaded	getAll may not be supported
/*
chrome.windows.getAll({
populate: true
}, function (windows) {
var i = 0, w = windows.length, currentWindow;
for( ; i < w; i++ ) {
currentWindow = windows[i];
var j = 0, t = currentWindow.tabs.length, currentTab;
for( ; j < t; j++ ) {
currentTab = currentWindow.tabs[j];
// Skip chrome:// and https:// pages
if(  currentTab.url!= undefined) {
//console.log(currentTab.url,currentTab.id);
chrome.tabs.update(currentTab.id, {url: currentTab.url});
}
}
}
});
 */

// only reload scoutbook tabs  -Adam Koch suggestion
//?? Extension is only permitted for urls in manifest
// url: '*://*.scoutbook.com/*'
for (var i = 0; i<bkgHostArray.length; i++) {
    chrome.tabs.query({
        url: bkgHostArray[i]
    }, function (tabs) {
        tabs.forEach((tab) => {
            chrome.tabs.reload(tab.id);
        });
    });
}


function logDebug(msg) {
    if (debug == true) {
        console.log(logTime(Date.now()) + ": " + msg);
    }

    //save 60 events
    if (debugList.length > 60) {
        debugList.shift();
    }

    debugList.push(logTime(Date.now()) + ": " + msg);
}

// This function is available via console request only and is not called by any other function
function showLog() {
    console.log('Debug Log');
    for (var i = 0; i < debugList.length; i++) {
        console.log(debugList[i]);
    }

}

function varState() {
    var res = '';
    for (var i = 0; i < originObjList.length;i++) {
        res += ' origin' + originObjList[i].origin;
        res += ' Session:' + originObjList[i].session;
        res += ' StartTime:' + logTime(originObjList[i].startTime);
        res += ' UserClosedWarning:' + originObjList[i].userClosedWarning;
        res += ' UserClosedLogoffNotice:' + originObjList[i].userClosedLogoffNotice;
        res += ' WarningShownOnce:' + originObjList[i].warningShownOnce;
        res += ' InitLogoff:' + originObjList[i].initLogoff;
        res += '\n';        
        
    }
    
    return res;
}

function logTime(dt) {
    if (dt == -1) {
        return 'notSet';
    }
    var d = new Date(dt);
    return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds();
}

/*******************************************************************/

function XHR_Proxy(xhrOptions) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {

            postMsg({
                hostx: xhrOptions.hostx,
                text: 'xhrResponse',
                funcID: xhrOptions.funcID,
                status: this.status,
                data: 'Error Page not Found'
            });
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            postMsg({
                hostx: xhrOptions.hostx,
                text: 'xhrResponse',
                funcID: xhrOptions.funcID,
                status: this.status,
                data: 'Error See Status'
            });
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            
            //console.log(this.responseText);
            postMsg({
                hostx: xhrOptions.hostx,
                text: 'xhrResponse',
                funcID: xhrOptions.funcID,
                status: this.status,
                data: this.responseText
            });
        }
    }

    xhr.open(xhrOptions.method, xhrOptions.url, true);
    
     if (xhrOptions.accHeader != '') {
        xhr.setRequestHeader("Accept", xhrOptions.accHeader);
        //"Content-type", "application/x-www-form-urlencoded"
        //  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }   
    
    if (xhrOptions.upgradeInsecureRequests) {
        xhr.setRequestHeader("Upgrade-Insecure-Requests", "1");
      /*
      "Service-Worker: script",
    "Sec-Fetch-Site: same-origin",
    "Sec-Fetch-Mode: same-origin",
    "Sec-Fetch-Dest: serviceworker",
      */  
        xhr.setRequestHeader("Service-Worker", "script");
        //xhr.setRequestHeader("Sec-Fetch-Dest", "serviceworker");
        //xhr.setRequestHeader("Sec-Fetch-Site", "same-origin");
        //xhr.setRequestHeader("Sec-Fetch-Mode", "same-origin");
        
    }   
    
    if (xhrOptions.withCredentials) {
        xhr.withCredentials = true;
    }
    
    
    if (xhrOptions.reqHeader != '') {
        xhr.setRequestHeader("Content-Type", xhrOptions.reqHeader);
        //"Content-type", "application/x-www-form-urlencoded"
        //  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }
    if (xhrOptions.respType != '') {
        xhr.responseType = xhrOptions.respType;
    }

    xhr.send(xhrOptions.formdata);

    xhr.onerror = function () {
        postMsg({
            hostx: xhrOptions.hostx,
            text: 'xhrResponse',
            funcID: xhrOptions.funcID,
            status: 'General Error',
            data: 'Error See Status'
        });
        return;
    }
}

logDebug('Initialized');

var versionshown = localStorage.getItem('version_fa_shown');
var version = localStorage.getItem('version_fa');
var notifyOpt = localStorage.getItem('notifyOpt');

if (!version || version != chrome.runtime.getManifest().version) {
    // Open the options page directly after installing or updating the extension

    //disabled openoptionspage 2/9/18   in future make optional
    if (notifyOpt == "1") {
        //show if major feature update only
        var mjPrior = version.match(/0\.(\d+)/)[1];
        var mjNew = chrome.runtime.getManifest().version.match(/0\.(\d+)/)[1];
        if (mjPrior != mjNew) {
            chrome.runtime.openOptionsPage();
        }
    }
    if (notifyOpt == "2") {
        chrome.runtime.openOptionsPage();
    }
    //chrome.runtime.openOptionsPage();


    //chrome.tabs.create({ url: "options.html" });
	    localStorage.setItem('version_fa', chrome.runtime.getManifest().version);
}

setTimeout(function () {
    localStorage.setItem('version_fa_shown', chrome.runtime.getManifest().version);
    // inside of the options, look
}, 200);