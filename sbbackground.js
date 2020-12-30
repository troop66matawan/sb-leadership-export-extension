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

var WARNtime = 25; // numbr of minutes before warning popup
var TOtime = 30; // Timeout period - 30 minutes
var greenTime = 1000 * 60 * WARNtime; //25 min in ms
var yellowTime = 1000 * 60 * (TOtime - WARNtime); // 5 min in ms
var redTime = 1000 * 60 * TOtime; // 30 minutes in ms
var id = ''; // tabs[0].id;

var othTimer; //interval timer handle
var wwwTimer; //interval timer handle
var wwwStartTime = -1; //Date.now()-30*60*1000;		// set initial to 30 minutes before chrome opened
var othStartTime = -1; //Date.now()-30*60*1000;

var wwwUserClosedWarning = false; //sticky notices
var wwwUserClosedLogoffNotice = false; //sticky notices
var othUserClosedWarning = false; //sticky notices
var othUserClosedLogoffNotice = false; //sticky notices
var wwwSession = false;
var othSession = false;
var wwwWarningShownOnce = false; // Allows warning to be displayed, but only on first clock tick.  Prevents a redisplay every second
var othWarningShownOnce = false;

var wwwInitLogoff = false; //Mirrors Session but is cleared by a close button on popup.  Logoff popup on shows if it is true.
var othInitLogoff = false;

var debugList = [];
var debug = false;

var wwwURLTime = [];
var othURLTime = [];

chrome.runtime.onMessage.addListener(function (msgobj, sender) {
    try {
        if (msgobj.msg) {
            ev = JSON.parse(msgobj.msg);
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

    if (ev.text == "RestartSession") {

        //logDebug('New message event rcv in background: '  + ev.text + ' ' + ev.sensitive + ' ' + ev.origin);
        if (ev.origin.indexOf('www.') != -1) {
            if (wwwURLTime.length >= 4) {
                wwwURLTime.shift();
            }
            wwwURLTime.push(logTime(Date.now()) + ' ' + ev.url);

            //what kind of reset? from a pger requiring a login or not
            var start = false;
            if (ev.sensitive == 'yes') {
                // from page requiring login
                start = true;
            } else {
                // from page not requiring login.

                if (wwwSession == true) {
                    start = true;
                }
            }

            if (start == true) {
                logDebug('Resetting www Active Session');

                chrome.browserAction.setBadgeText({
                    text: '+'
                });
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [24, 204, 0, 1]
                }); //Green

                wwwUserClosedWarning = false; //sticky notices
                wwwUserClosedLogoffNotice = false; //sticky notices
                //reset interval
                clearInterval(wwwTimer);
                wwwSession = true;
                wwwWarningShownOnce = false; // Re-allows a warning to be displayed
                wwwInitLogoff = true;
                // First set/reset a timer to trigger a prompt when the session is nearing an end
                wwwStartTime = Date.now();
                wwwTimer = setInterval(function () {
                        wwwShowTimer();
                    }, 1000);
            }
        } else {
            //othUserClosedWarning=false;
            //othUserClosedLogoffNotice=false;
            if (othURLTime.length >= 4) {
                othURLTime.shift();
            }
            othURLTime.push(logTime(Date.now()) + ' ' + ev.url);
            var start = false;
            if (ev.sensitive == 'yes') {
                start = true;
            } else {
                if (othSession == true) {
                    start = true;
                }
            }

            if (start == true) {
                logDebug('Resetting oth Active Session');

                othUserClosedWarning = false; //sticky notices
                othUserClosedLogoffNotice = false; //sticky notices
                //reset interval
                clearInterval(othTimer);
                othSession = true;
                othWarningShownOnce = false;
                othInitLogoff = true;
                // First set/reset a timer to trigger a prompt when the session is nearing an end
                othStartTime = Date.now();
                othTimer = setInterval(function () {
                        othShowTimer();
                    }, 1000);

            }
        }
    }

    if (ev.text == 'ClosePopup') {
        //logDebug('New message event rcv in background: '  + ev.text+ ' ' + ev.origin);
        if (ev.origin.indexOf('www.') != -1) {
            if (wwwSession == true) {
                wwwUserClosedWarning = true;

            } else {
                chrome.browserAction.setBadgeText({
                    text: ''
                });
                wwwUserClosedLogoffNotice = true;

                wwwInitLogoff = false;
            }
        } else {
            if (othSession == true) {
                othUserClosedWarning = true;
            } else {
                othUserClosedLogoffNotice = true;
                othInitLogoff = false;
            }
        }
    }

    // b71780684
    if (ev.text == 'Visible') {
        //logDebug('New message event rcv in background: '  + ev.text + ' ' + ev.origin);
        if (ev.origin.indexOf('www.') != -1) {

            if (wwwSession == true) {
                // as far as we know so far, a session is still active.  Could have been hibernated though...
                clearInterval(wwwTimer); // Stop the interval timer
                var wwwElapsed = Date.now() - wwwStartTime; // Get the new Elapsed time in ms from the saved start time, in case the cpu hibernated


                //Reasons to clear popups - popup showing on a page, navigation in another page reset the session
                if ((redTime - wwwElapsed) > yellowTime) {
                    //if more than 5 minutes is left ; 30 min in ms - elapsed in ms if gt 5 min in ms
                    //clear any popups

                    postMsg({
                        hostx: 'www.',
                        text: "HidePopups"
                    }, id);
                }
                // Previously requested a clear so if it is already displayed, clear it
                if (wwwUserClosedWarning == true) {
                    if (yellowTime > (redTime - wwwElapsed)) {
                        if ((redTime - wwwElapsed) >= 0) {
                            // clear if previously cleared and in warning period
                            postMsg({
                                hostx: 'www.',
                                text: "HidePopups"
                            }, id);
                        }
                    }
                }
                // Previously requested a clear so if it is already displayed, clear it
                if (wwwUserClosedLogoffNotice == true) {
                    postMsg({
                        hostx: 'www.',
                        text: "HidePopups"
                    }, id);
                }

                if (wwwElapsed > redTime) {
                    //good morning, we just woke up from hibernation and are logged out
                    // We handle this case when the interval timer fires
                }

                wwwWarningShownOnce = false; //when switching tabs, if someone clicked outside the box, re-allows warning display
                wwwTimer = setInterval(function () {
                        wwwShowTimer();
                    }, 1000);
            } else {
                //logged out
                if (wwwUserClosedLogoffNotice == true) {
                    // Previously requested a clear so if it is already displayed, clear it
                    postMsg({
                        hostx: 'www.',
                        text: "HidePopups"
                    }, id);
                } else {
                    if (wwwInitLogoff == true) {
                        postMsg({
                            hostx: 'www.',
                            text: "ShowLoggedOffPopup"
                        }, id);
                        chrome.browserAction.setBadgeText({
                            text: '-'
                        });
                        chrome.browserAction.setBadgeBackgroundColor({
                            color: [255, 0, 0, 255]
                        }); //red		+

                    }
                }
            }

        } else {
            if (othSession == true) {
                clearInterval(othTimer);
                var othElapsed = Date.now() - othStartTime;
                //console.log((redTime-othElapsed), yellowTime);
                if ((redTime - othElapsed) > yellowTime) {
                    //clear any popups
                    postMsg({
                        hostx: 'oth',
                        text: "HidePopups"
                    }, id);
                }
                if (othUserClosedWarning == true) {
                    if (yellowTime > (redTime - othElapsed)) {
                        if ((redTime - othElapsed) >= 0) {
                            // clear if previously cleared and in warning period
                            postMsg({
                                hostx: 'oth',
                                text: "HidePopups"
                            }, id);
                        }
                    }
                }

                if (othUserClosedLogoffNotice == true) {
                    postMsg({
                        hostx: 'oth',
                        text: "HidePopups"
                    }, id);
                }
                othWarningShownOnce = false;

                othTimer = setInterval(function () {
                        othShowTimer();
                    }, 1000);
            } else {
                //logged out
                if (othUserClosedLogoffNotice == true) {
                    postMsg({
                        hostx: 'oth',
                        text: "HidePopups"
                    }, id);
                } else {
                    if (othInitLogoff == true) {
                        postMsg({
                            hostx: 'oth',
                            text: "ShowLoggedOffPopup"
                        }, id);
                    }
                }
            }
        }
    }

    if (ev.text == 'LogOff') {
        //logDebug('New message event rcv in background: '  + ev.text );
        if (ev.origin.indexOf('www.') != -1) {
            //dbconsole.log('BG -----  user logout received.  Clearing all timers');
            wwwSession = false;
            clearInterval(wwwTimer);
            wwwStartTime = Date.now() - 30 * 60 * 1000;
            updateTimerPop('wwwtimer', 'User Logged Off');

            chrome.browserAction.setBadgeText({
                text: ''
            });

        } else {
            //dbconsole.log('BG -----  user logout received.  Clearing all timers');
            othSession = false;
            clearInterval(othTimer);
            othStartTime = Date.now() - 30 * 60 * 1000;
            updateTimerPop('othtimer', 'User Logged Off');
        }
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

// gets called every second
function wwwShowTimer() {

    var Elapsed = Date.now() - wwwStartTime;
    var mSecRemain = redTime - Elapsed;
    var SecRemain = (redTime - Elapsed) / 1000;
    var min = parseInt((SecRemain / 60) + '');
    var sec = (SecRemain - min * 60).toFixed(0);

    if (mSecRemain <= 0) {

        UpdatePopup('wwwtimer', "Logout", 1);
        clearInterval(wwwTimer); // Stop the interval timer, no longer needed
        if (wwwUserClosedLogoffNotice == false) {
            chrome.browserAction.setBadgeText({
                text: ''
            });
            if (wwwInitLogoff == true) {
                postMsg({
                    hostx: 'www.',
                    text: "ShowLoggedOffPopup"
                }, id);
                chrome.browserAction.setBadgeText({
                    text: '-'
                });
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                }); //red		+

            }
        }
        wwwSession = false;
        logDebug('No Time Remaining\n ' + varState());
    } else if (mSecRemain <= yellowTime) {
        //views[i].document.getElementById('wwwtimer').innerText = "Session Time Remaining "+min+"m "+sec+"s < 5 min";
        UpdatePopup('wwwtimer', "Session Time Remaining " + min + "m " + sec + "s < 5 min", 0);
        if (wwwUserClosedWarning == false) {
            if (wwwWarningShownOnce == false) {
                //the warning hasn't been displayed yet.  Don't display each clock tick, so disable after it has been shown once.
                var ev = {
                    hostx: 'www.',
                    text: "ShowTimeoutWarning",
                    endtime: ''
                };
                ev.endTime = wwwStartTime + redTime;
                postMsg(ev, id);
                wwwWarningShownOnce = true;
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

        UpdatePopup('wwwtimer', "Session Time Remaining " + min + "m " + sec + "s", 0);
    }

}

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

function othShowTimer() {

    var Elapsed = Date.now() - othStartTime;
    var mSecRemain = redTime - Elapsed;
    var SecRemain = (redTime - Elapsed) / 1000;

    var min = parseInt((SecRemain / 60) + '');
    var sec = (SecRemain - min * 60).toFixed(0);
    //var views = chrome.extension.getViews({
    //	type: "popup"
    //});
    //for (var i = 0; i < views.length; i++) {


    if (mSecRemain <= 0) {
        //views[i].document.getElementById('othtimer').innerText = "Test Logout";
        UpdatePopup('othtimer', "Test Logout", 1);
        clearInterval(othTimer);
        if (othUserClosedLogoffNotice == false) {
            if (othInitLogoff == true) {
                postMsg({
                    hostx: 'oth',
                    text: "ShowLoggedOffPopup"
                }, id);
            }
        }
        othSession = false;
    } else if (mSecRemain <= yellowTime) {
        //views[i].document.getElementById('othtimer').innerText = "Test Session Time Remaining "+min+"m "+sec+"s < 5 min";
        UpdatePopup('othtimer', "Test Session Time Remaining " + min + "m " + sec + "s < 5 min", 0);
        if (othUserClosedWarning == false) {
            if (othWarningShownOnce == false) {
                // no need to show this each second. Show once, then stop.
                var ev = {
                    hostx: 'oth',
                    text: "ShowTimeoutWarning",
                    endtime: ''
                };
                ev.endTime = othStartTime + redTime;
                postMsg(ev, id);
                othWarningShownOnce = true;
            }
        }
    } else {
        //views[i].document.getElementById('othtimer').innerText = "Test Session Time Remaining "+min+"m "+sec+"s";
        UpdatePopup('othtimer', "Test Session Time Remaining " + min + "m " + sec + "s", 0);
    }
    //}
}


function postMsg(ev, id) {

   // console.log('postMessage from background ', ev);
    var host = "www."
    if (ev.hostx == "oth" ) {
        host="qa.";
    }
    //active: true, currentWindow: true}
    //        active: true
    if (typeof(chrome.tabs) === 'object') {

        chrome.tabs.query({
            active: true,
            url: 'https://' + host + 'scoutbook.com/*'
        }, function (tabs) {
            if(tabs.length == 0) {
                //console.log('No tab matching ' + 'https://' + host + 'scoutbook.com/*' + ' was found to send msg');
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
    wwwSession = false;
    othSession = false;

    clearInterval(wwwTimer);
    clearInterval(othTimer);

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
chrome.tabs.query({
    url: '*://*.scoutbook.com/*'
}, function (tabs) {
    tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
    });
});

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
    res += '                wwwSession:' + wwwSession;
    res += ' wwwStartTime:' + logTime(wwwStartTime);
    res += ' wwwUserClosedWarning:' + wwwUserClosedWarning;
    res += ' wwwUserClosedLogoffNotice:' + wwwUserClosedLogoffNotice;
    res += ' wwwWarningShownOnce:' + wwwWarningShownOnce;
    res += ' wwwInitLogoff:' + wwwInitLogoff;
    res += '\n';
    res += '                 othSession:' + othSession;
    res += ' othStartTime:' + logTime(othStartTime);
    res += ' othUserClosedWarning:' + othUserClosedWarning;
    res += ' othUserClosedLogoffNotice:' + othUserClosedLogoffNotice;
    res += ' othWarningShownOnce:' + othWarningShownOnce;
    res += ' othInitLogoff:' + othInitLogoff;

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
            }, id);
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            postMsg({
                hostx: xhrOptions.hostx,
                text: 'xhrResponse',
                funcID: xhrOptions.funcID,
                status: this.status,
                data: 'Error See Status'
            }, id);
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
            }, id);
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
        }, id);
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