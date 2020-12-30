var versionshown = localStorage.getItem('version_fa_shown');
var notifyOpt = localStorage.getItem('notifyOpt');

window.onload = function () {
    if (!versionshown || versionshown != chrome.runtime.getManifest().version) {
        //alert(localStorage.getItem('version_fa'));

        document.getElementById('newversion').innerText = 'An Update has been installed to provide New Features and Bug Fixes';
    }

    document.getElementById('version').innerText = 'V' + localStorage.getItem('version_fa');

    //  Actively set the radio boxes depending on the status
    if (notifyOpt == "1") {
        // check option 1
        document.getElementById("NoNotify").checked = false;
        document.getElementById("MajorNotify").checked = true;

    }

    if (notifyOpt == "2") {
        // check option 2
        document.getElementById("NoNotify").checked = false;
        document.getElementById("AllNotify").checked = true;
    }

    document.getElementById("NoNotify").onclick = function () {
        setVal('0')
    };
    document.getElementById("MajorNotify").onclick = function () {
        setVal('1')
    };
    document.getElementById("AllNotify").onclick = function () {
        setVal('2')
    };
}

function setVal(val) {
    localStorage.setItem('notifyOpt', val);
}