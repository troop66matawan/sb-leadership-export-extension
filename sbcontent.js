// sbcontent.js
// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

//window.console && console.log("content script loaded" + document.baseURI);

//var manifestData = chrome.runtime.getManifest();
//console.log('in content ver= '+ manifestData.version);

//console.log('loaded sbcontent');
window.onload = handleReports; //if new reports need jquery or files loaded
//window.onload = ldit;				//if new reports do not need jquery or files loaded

function handleReports() {

    if (document.URL.match(/vim2/) != null) {
        return;
        /*
        var script = document.createElement('script');
        script.src ="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
        //script.src = "https://www.scoutbook.com/includes/mobile-concat.js";		// contains jquery
        script.async = false;
        //(document.head||document.documentElement).appendChild(script);
        var head=document.head || document.getElementsByTagName('head')[0];
        head.insertBefore(script,head.firstChild);
        script.remove();
        //ldit needs to wait until mobile-concat is actually loaded somehow
        // typeof jQuery will return 'undefined' if jQuery isn't loaded yet
         */

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status > 399 && this.status < 500) {

                alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
                return;
            }
            if (this.readyState == 4 && this.status > 499) {
                alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
                return;
            }
            if (this.readyState == 4 && this.status == 200) {
                var js_src = this.response;

                var script = document.createElement('script'); ;
                script.textContent = js_src;
                (document.head || document.documentElement).appendChild(script);
                script.remove();
                //may also need
                //<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">
                //<script src="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js"></script>

                ldit(); // will still have errors until mobile js is loaded
            }
        }

        var url = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
        xhttp.open("GET", url, true);
        xhttp.responseType = "text";
        xhttp.send();

        xhttp.onerror = function () {
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
        }

        return;
        //	  "exclude_matches": ["*://*/*vim2*"],
    } else {
        // seems as though mobileconcat.js may not be loaded yet - lets wait 2 seconds

        ldit();
    }
}

function ldit() {

    var fileList = [
        "leadershipExport.js",
        "youthLeaderQE.js",
        "localsession.js",
        "sbutils.js",
        "common.js",
        "recur.js",
        "bindings.js"
    ];
    localPath();

    insertFiles(fileList);

}

function insertFiles(fileList) {
    if (fileList.length == 0) {
        loadVars(false, 'permissionDefaults'); // This is an async call to get vars from storage
        loadVars(false, 'mailGroups'); // This is an async call to get vars from storage
        //localPath();
        window.console && console.log('FA content loaded');
        return;
    }

    var jsFile = fileList.shift();

    var s = document.createElement('script');

    s.src = chrome.extension.getURL(jsFile);
    s.onload = function () {
        s.remove(); // supposedly prevents leaks
        insertFiles(fileList);
    };
    (document.head || document.documentElement).appendChild(s);
}

function loadVars(option, namevar) {

    chrome.storage.local.get(namevar, function (items) {
        //if (!chrome.runtime.error) {

        //alert('async got storage ' + items[namevar]);
        var namedata = items[namevar];
        if (namedata == undefined || option == true) {
            //alert('No permissionDefaults are configured.' );
        } else {
            var script = document.createElement('script');
            var contentStr = namevar + ' = ' + items[namevar] + ';\n'
                //console.log(contentStr);
                script.textContent = contentStr;
            (document.head || document.documentElement).appendChild(script);
            script.remove();
        }

        //}
    });
}

function localPath() {
    var script = document.createElement('script');
    var contentStr = 'localpath = "' + chrome.extension.getURL('') + '";\n'
        //console.log(contentStr);
        script.textContent = contentStr;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}
/*
chrome.storage.local.get(namevar, function(items) {
if (!chrome.runtime.error) {
//debugger
}
}
);
 */
// handles message from inject script
window.addEventListener('message', function (ev) {
//console.log('forwarding to Background',ev);
    //check if msg is getPerms
    if (ev.data.text == 'setPerms') {

        saveChanges('permissionDefaults', ev.data.permissionDefaults);
        return;
    }
    if (ev.data.text == 'setMailGrps') {

        saveChanges('mailGroups', ev.data.mailGroups);
        return;
    }
    if (ev.data.text == 'XHRProxy_') {
        //		XHR_Proxy(ev); //  need to forward to background
        //		return;
    }

    // now sending to background script
    ev.data.origin = ev.origin;
    //dbconsole.log('forwarding to background'+JSON.stringify(ev.data));
    var evx = {
        msg: ''
    };
    evx.msg = JSON.stringify(ev.data);
    //JSON.parse(JSON.stringify(evObj)
    try {
        chrome.runtime.sendMessage(evx);
    } catch (e) {
        if (e.toString().includes('Extension context invalidated')) {
            console.trace('Extension context invalidated probably due to reloading the page during development');
        }
        else {
            throw e;
        }
    }
});

//handles message from background script

chrome.runtime.onMessage.addListener(function (ev, sender) {
    //handles message to injected script
    //console.log('forwarding to Inject',ev);
    window.postMessage(ev, "*");
});

//console.log('loaded content');


function removeStorage(namevar) {
    chrome.storage.local.remove(namevar, function (items) {
        alert(namevar + ' removed from local storage');
    });
}

function saveChanges(varname, theValue) {
    // Get a value saved in a form.
    //var theValue = "test value";
    // Check that there's some code there.
    if (!theValue) {
        alert('Error: No value specified');
        return;
    }
    // Save it using the Chrome extension storage API.

    var setObj = {};
    setObj[varname] = theValue;
    chrome.storage.local.set(setObj, function () {
        // Notify that we saved.
        //alert('Settings saved');
        //console.log('names saved to local storage');
        alert(varname + ' saved to local storage');
    });
}

/*******************************************************************/

function XHR_Proxy(xhrOptions) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {

            window.postMessage({
                text: 'xhrResponse',
                funcID: xhrOptions.data.funcID,
                status: this.status,
                data: 'Error Page not Found'
            }, "*");
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            window.postMessage({
                text: 'xhrResponse',
                funcID: xhrOptions.data.funcID,
                status: this.status,
                data: 'Error See Status'
            }, "*");
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            window.postMessage({
                text: 'xhrResponse',
                funcID: xhrOptions.data.funcID,
                status: this.status,
                data: this.responseText
            }, "*");
        }
    }
    xhr.open(xhrOptions.data.method, xhrOptions.data.url, true);
    xhr.responseType = "text";
    xhr.send();

    xhr.onerror = function () {
        window.postMessage({
            text: 'xhrResponse',
            funcID: xhrOptions.data.funcID,
            status: 'General Error',
            data: 'Error See Status'
        }, "*");
        return;
    }
}