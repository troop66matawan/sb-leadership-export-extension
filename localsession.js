// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//----------------------------------------------------
// Code below is for the session timer.  It has been copied/reduced from the background page to handle Android FF installations
// FF Android woin't support background messaging until version 54.  So this is a workaround, and only supports a session on a single tab on android
//THis codeset "emulates" the message hadling in the background.
var WARNtime = 25; // numbr of minutes before warning popup
var TOtime = 30; // Timeout period - 30 minutes
var greenTime = 1000 * 60 * WARNtime;
var yellowTime = 1000 * 60 * (TOtime - WARNtime);
var redTime = 1000 * 60 * TOtime;
var id = ''; // tabs[0].id;

var wwwTimer; //interval timer handle
var wwwStartTime = Date.now() - 30 * 60 * 1000;
var wwwCloseWarn = false; //sticky notices
var wwwCloseLogoff = false; //sticky notices
var wwwSession = false;
var wwwWarnShown = false;
var wwwInitLogoff = false; //Mirrors Session but is cleared by a close button on popup.  Logoff popup on shows if it is true.
var othInitLogoff = false;
//var host = window.location.hostname.substr(0, location.hostname.indexOf('.') - 1);
var host = window.location.hostname;

function rawDataFullPageSession(data, tpageid, err, thisurl) {
    // All pages should have this
    var startfunc = data.indexOf('<div data-role="popup" id="loginPopup"');
    if (startfunc == -1) {
        if (thisurl.match(/roster\.asp\?Action=Print/) == null) {
            startfunc = data.indexOf('</body>');
        }
    }
    if (startfunc == -1) {
        var msgObj = {
            hostx: host,
            text: "UnrecognizedPage",
            url: thisurl
        };

        sendTimerMsg(msgObj, "*");

        if (debug == 1) {
            alert('This page no insert point');
        }
        //console.log('This page is undisturbed '+thisurl);
        err = true;
        return data;
    }

    // Add session timeout to all pages
    var newdata = data.slice(0, startfunc);
    newdata += logoutWarningPageContent(tpageid);
    newdata += data.slice(startfunc);
    data = newdata;
    return data;
}

function logoutWarningPageContent(tpageid) {

    var newdata = '';
    //was data theme c and d
    newdata += '	<div data-role="popup" id="logoutWarningPopup" data-overlay-theme="a" data-theme="a" class="ui-corner-all">';
    newdata += '	<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    //   a black  b blue c grey d white e yellow f green g red h white no border i blk
    newdata += '	<div data-role="header" data-theme="g" class="ui-corner-top">';
    newdata += '		<h2>Session Timeout Notice</h2>';
    newdata += '	</div>';
    newdata += '	<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content">';
    //newdata += '		<p class="normalText">Your Login session is about to end. Click Reset to stay logged in.</p>';
    newdata += '		<p></p><div id="logoutWarningPopupContent"></div><p></p>';
    newdata += '		<a href="#" id="resetWarningPopupButton"  data-role="button" data-theme="f"  class="ui-btn-right">Continue</a>';
    newdata += '		<a href="#" id="loginPopupButton"  data-role="button" data-theme="f"  class="ui-btn-right ui-disabled" style="display:none">Login</a>';
    newdata += '		<a href="#" id="closeWarningPopupButton"  data-role="button" data-theme="c"  class="ui-btn-left">Close</a>';
    newdata += '	</div>';
    newdata += '	</div>';
    newdata += '	<div id="hostx" style="display: none;">';
    newdata += '	</div>';

    newdata += '	<script>\n';

    newdata += '		function showLogoutWarningPopup(msg,hostx) {\n';
    newdata += "		//dbconsole.log('in showLogoutWarningPopup');\n";
    newdata += "			$('#logoutWarningPopupContent', '#" + escapeHTML(tpageid) + "').html(msg);\n";
    newdata += "			$('#hostx', '#" + escapeHTML(tpageid) + "').html(hostx);\n";
    newdata += "			$('#resetWarningPopupButton').removeClass('ui-disabled');\n";
    newdata += "			$('#logoutWarningPopup', '#" + escapeHTML(tpageid) + "').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');\n";
    newdata += '		}\n\n';

    newdata += "		$('#logoutWarningPopup #closeWarningPopupButton').click(function () {\n"; //'#"+escapeHTML(tpageid)+"
    newdata += "			//dbconsole.log('in closeWarningPopupButton');\n";
    newdata += "			$('#logoutWarningPopup', '#" + escapeHTML(tpageid) + "').popup('close');\n";
    newdata += "			$('#logoutWarningPopup', '#" + escapeHTML(tpageid) + "').popup('close');\n";
    // send msg that popup was closed
    newdata += "			sendPopupClosed();";
    newdata += "		});\n";

    newdata += "		$('#logoutWarningPopup #resetWarningPopupButton').click(function () {\n"; //#"+escapeHTML(tpageid)+"
    newdata += "			logCB($('#hostx', '#" + escapeHTML(tpageid) + "').text());\n";
    newdata += "			$('#logoutWarningPopup', '#" + escapeHTML(tpageid) + "').popup('close');\n";
    newdata += "		});\n";
    newdata += '	</script>\n';

    return newdata;
}

function localSession(ev, inStr) {

    //window.console &&console.log('bk--------------------------New message event rcv in background:', ev.text);

    if (ev.text == 'RestartSession') {
        //window.console &&console.log('bk--------------------------New message event rcv in background:', ev.text,ev.sensitive);


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
            wwwCloseWarn = false; //sticky notices
            wwwCloseLogoff = false; //sticky notices
            //reset interval
            clearInterval(wwwTimer);
            wwwSession = true;
            wwwWarnShown = false;
            wwwInitLogoff = true;
            // First set/reset a timer to trigger a prompt when the session is nearing an end
            wwwStartTime = Date.now();
            wwwTimer = setInterval(function () {
                    wwwShowTimer();
                }, 1000);
        }

    }

    if (ev.text == 'ClosePopup') {
        if (wwwSession == true) {
            wwwCloseWarn = true;
        } else {
            wwwCloseLogoff = true;
            wwwInitLogoff = false;
        }
    }

    if (ev.text == 'Visible') {
        if (wwwSession == true) {
            clearInterval(wwwTimer);
            var wwwElapsed = Date.now() - wwwStartTime;

            //Reasons to clear popups - popup showing on a page, navigation in another page reset the session
            if ((redTime - wwwElapsed) > yellowTime) {
                //clear any popups

                postMsg({
                    hostx: host,
                    text: "HidePopups"
                }, id);
            }
            // Previously requested a clear so if it is already displayed, clear it
            if (wwwCloseWarn == true) {
                if (yellowTime > (redTime - wwwElapsed)) {
                    if ((redTime - wwwElapsed) >= 0) {
                        // clear if previously cleared and in warning period
                        postMsg({
                            hostx: host,
                            text: "HidePopups"
                        }, id);
                    }
                }
            }
            // Previously requested a clear so if it is already displayed, clear it
            if (wwwCloseLogoff == true) {
                postMsg({
                    hostx: host,
                    text: "HidePopups"
                }, id);
            }
            //wwwWarnShown=false;
            wwwTimer = setInterval(function () {
                    wwwShowTimer();
                }, 1000);
        } else {
            //logged out
            if (wwwCloseLogoff == true) {
                // Previously requested a clear so if it is already displayed, clear it
                postMsg({
                    hostx: host,
                    text: "HidePopups"
                }, id);
            } else {
                if (wwwInitLogoff == true) {
                    postMsg({
                        hostx: host,
                        text: "ShowLoggedOffPopup"
                    }, id);
                }
            }
        }

    }

    if (ev.text == 'LogOff') {
        wwwSession = false;
        clearInterval(wwwTimer);
        wwwStartTime = Date.now() - 30 * 60 * 1000;
        updateTimerPop('wwwtimer', 'User Logged Off');
    }

}

function updateTimerPop(divId, msg) {
    //nothing to display on with android...
}

// gets called every second
function wwwShowTimer() {

    var Elapsed = Date.now() - wwwStartTime;
    var mSecRemain = redTime - Elapsed;
    var SecRemain = (redTime - Elapsed) / 1000;
    var min = parseInt((SecRemain / 60) + '');
    var sec = (SecRemain - min * 60).toFixed(0);

    if (mSecRemain <= 0) {
        //views[i].document.getElementById('wwwtimer').innerText = "Logout";
        clearInterval(wwwTimer);
        if (wwwCloseLogoff == false) {
            if (wwwInitLogoff == true) {
                postMsg({
                    hostx: host,
                    text: "ShowLoggedOffPopup"
                }, id);
            }
        }
        wwwSession = false;
    } else if (mSecRemain <= yellowTime) {
        //views[i].document.getElementById('wwwtimer').innerText = "Session Time Remaining "+min+"m "+sec+"s < 5 min";
        if (wwwCloseWarn == false) {
            //if(wwwWarnShown==false) {
            var ev = {
                hostx: host,
                text: "ShowTimeoutWarning",
                endtime: ''
            }
            ev.endTime = wwwStartTime + redTime;
            postMsg(ev, id);
            wwwWarnShown = true;
            //}
        }
    } else {
        //views[i].document.getElementById('wwwtimer').innerText = "Session Time Remaining "+min+"m "+sec+"s";
    }

}

function postMsg(ev, id) {
    //console.log('fake background send',ev);
    var sev = {
        data: {}
    };
    sev.data = ev;
    handleSession(sev);
}

function setTimePeriod(beforewarn, warntime) {
    wwwSession = false;
    clearInterval(wwwTimer);
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

window.addEventListener('message', function (ev) {
    if (ev.data.text == 'xhrResponse') {

        for (var i = 0; i < funcIDs.length; i++) {
            if (funcIDs[i].id == ev.data.funcID) {

                funcIDs[i].funcDef(ev);
                //remove this function from the list
                funcIDs.splice(i, 1);
                break;
            }
        }
        return;
    }
    handleSession(ev);
}, true); // useCapture: true

function handleSession(ev) {
    // console.log('---------------------------New event in script:', ev.data.hostx,ev.data.text,host,lastEvent);
    //console.log(JSON.stringify(ev.data))
    //if (ev.data.hostx == host || ((ev.data.hostx == 'oth') && (host != 'www.')))
    if (ev.data.hostx == 'https://'+ host) { 
     //console.log('ok, process it');
        lastEvent += 1;
        if (ev.data.text == 'ShowTimeoutWarning') {
            var endtime = ev.data.endTime
                //dbconsole.log('calling showLogoutWarningPopup');
                //showLogoutWarningPopup(sbTime(Date.now()) + ': Your Scoutbook session will be logged out in 5 minutes due to inactivity. Click Continue to stay logged in',ev.data.hostx);

                showLogoutWarningPopup('Your Scoutbook session will be logged out in 5 minutes (at ' + escapeHTML(sbTime(endtime)) + ') due to inactivity. Click Continue to stay logged in', ev.data.hostx);

            //popup, call logCB

        }

        if (ev.data.text == 'ShowLoggedOffPopup') {
            //Popup may or may not be currently displayed.
            // If it is, change it
            if ($('#logoutWarningPopup-popup.ui-popup-active').length != 0) {
                //dbconsole.log('popup showing already, set message to logged off');
                $('#logoutWarningPopupContent').html('Your Scoutbook Session has ended and you have been logged out');
                $('#resetWarningPopupButton').addClass('ui-disabled');
            } else {
                $('#logoutWarningPopup').popup('open');
                $('#logoutWarningPopupContent').html('Your Scoutbook Session has ended and you have been logged out!');
                $('#resetWarningPopupButton').addClass('ui-disabled');
            }
        }

        if (ev.data.text == 'HidePopups') {
            //another tab re-activated, any popup here shoud go away
            //dbconsole.log('popup should close');
            if ($('#logoutWarningPopup-popup.ui-popup-active').length != 0) {
                //dbconsole.log('trying to close popup');
                $('#logoutWarningPopup').popup('close');
            }
        }
        //Ack the response but only if not from tab


        if (isLocalLibraryCmd(ev.data.text) == false) {
            var msgObj = {
                hostx: host,
                text: "Ack",
                msg: ''
            };

            msgObj.msg = ev.data.text;
            //Only care if url of this page is a dashboard OR mobile has dashboard visible
            sendTimerMsg(msgObj, "*");
        }

    }
}

function isLocalLibraryCmd(cmd) {
    return ['Ack', 'RestartSession', 'Logoff', 'ClosePopup', 'Visible'].includes(cmd)
}

function sendTimerMsg(inObj, inStr) {
    if (ismobile == null) {
        //console.log('sending',inObj);
        window.postMessage(inObj, "*");
    } else {
        // on mobile platform.  Call function that mimics content and background
        localSession(inObj, inStr);
    }
}

/*
function sends a simple get message to the server to get reset the server's logout timer.
Checks to make sure request to do this is for the current domain
 */
function logCB(hostx) {

/*
    if (host == 'www.') {
        if (hostx == 'www.') {
            getDashboard();
        }
    } else {
        if (hostx != 'www.') {
            getDashboard();
        }
    }
    */
    if(host == hostx) {
        getDashboard();
    }
}

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState == "visible") {
        var msgObj = {
            hostx: host,
            text: "Visible"
        };

        sendTimerMsg(msgObj, "*");
    }
});

function sendPopupClosed() {
    var msgObj = {
        hostx: host,
        text: "ClosePopup"
    };

    sendTimerMsg(msgObj, "*");
}

function resetLogoutTimer(thisurl) {

    var msgObj = {
        hostx: host,
        text: "RestartSession",
        sensitive: 'yes',
        url: ''
    };
    msgObj.url = thisurl;

    sendTimerMsg(msgObj, "*");
}

function pokeSession(thisurl) {
    var msgObj = {
        hostx: host,
        text: "RestartSession",
        sensitive: 'no',
        url: ''
    };
    msgObj.url = thisurl;

    if (thisurl.indexOf('mobile/dashboard') != -1) {
        //check for blog on this page; check for 302 on url

        if ($('#blog').length == 0) {
            //console.log('detected mobile/dashboard with no Blog so appears to be sensitive page, reset as such');
            msgObj.sensitive = 'yes';
        } else {
            //nbconsole.log('detected incomplete URL transitions on click after logoff on dashboard  blog found on dashboard url '+thisurl);
        }
    }
    if (thisurl.match(/mobile\/./) == null) {
        // determine if the dashboard is present
        if ($('#dashboard').length != 0) {
            //console.log(thisurl +' contains a dashboard link, assuming its sensitive page, reset as such');
            msgObj.sensitive = 'yes';
        }
    }
    //another odd case...
    if (thisurl.match(/mobile\/\?DenID=&PatrolID=&Refresh=1/) != null) {
        // determine if the dashboard is present
        if ($('#dashboard').length != 0) {
            //console.log(thisurl +' contains a dashboard link, assuming its sensitive page, reset as such');
            msgObj.sensitive = 'yes';
        }
    }

    sendTimerMsg(msgObj, "*");
}

function pokeSessionAjax(thisurl) {
    var msgObj = {
        hostx: host,
        text: "RestartSession",
        sensitive: 'no',
        url: ''
    };

    setTimeout(function () {
        sendTimerMsg(msgObj, "*");
    }, 200);

}

'/mobile/dashboard/'
//session
function getDashboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getDashboard, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer('/mobile/dashboard/');
        }
    };
    var url = 'https://' + host +'/mobile/dashboard/';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function () {
        errStatusHandle(500, '', [], getDashboard, []);
    };
}