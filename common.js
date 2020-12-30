// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function cleanString(input) {

    var output = "";
    for (var i = 0; i < input.length; i++) {
        //console.log(input[i],input.charCodeAt(i));
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        } else {
            switch (input.charCodeAt(i)) {
            case 169:
                output += "(C)";
                break;
            case 174:
                output += "(R)";
                break;
            case 177:
                output += "+/-";
                break;
            case 189:
                output += "1/2";
                break;
            case 188:
                output += "1/4";
                break;
            case 8532:
                output += "2/3";
                break;
            case 190:
                output += "3/4";
                break;
            case 247:
                output += "/";
                break;
            case 8208:
            case 8209:
            case 8210:
            case 8211:
            case 8212:
            case 8213:
                output += "-";
                break;
            case 8216:
            case 8217:
            case 8218:
            case 8219:
                output += "'";
                break;
            case 8220:
            case 8221:
            case 8222:
            case 8223:
                output += '"';
                break;

            case 8226:
            case 8227:
                output += '*';
                break;
            case 8531:
                output += '1/3';
                break;

            }
        }
    }
    return output;
}

function tokenVal(formpost, token, val) {
    var re = RegExp(token + "=[^&]*");
    return formpost.replace(re, token + '=' + val);
}

function getFormVal(formPost, varName) {
    //console.log(formPost,varName);
    var res = '';
    if (formPost.match('&' + varName + '=([^&]*)') != null) {
        res = formPost.match('&' + varName + '=([^&]*)')[1];
    }
    return res;
}

function getToken(formpost, token) {
    var re = RegExp(token + "=([^&]+)");
    res = formpost.match(re);
    if (res != null) {
        return formpost.match(re)[1];
    }
    return '';
}

function phonecheck(phonenum) {
    return /^(\d\d\d-\d\d\d-\d\d\d\d)$/.test(phonenum);
}

function statecheck(state) {
    return ["AA", "AE", "AK", "AL", "AP", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"].includes(state);
}

function zipcheck(zip) {
    return !isNaN(zip) && parseInt(zip) <= 99999;
}

function emailcheck(email) {
    if (email.match(/^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/) == null) return false;
    //if(email.match(/[^@]+@[^\.]+\.[a-zA-Z][a-zA-Z][a-zA-Z]$/) == null) return false;
    return true;
}

/* 
 * function looks to see if val is a member of array arr
 *
 * @deprecated Use array.includes(element);
 */
function arrContain(arr, val) { //tested used
    for (var x = 0; x < arr.length; x++) {
        if (arr[x] == val) {
            return true;
        }
    }
    return false;
}

/* function looks to see if val is a member of array arr, if not, pushes it*/
function pushUnique(arr, val) { //tested used
    for (var x = 0; x < arr.length; x++) {
        if (arr[x] == val) {
            return true;
        }
    }
    arr.push(val);
    return false;
}

function cyear() {
    var d = new Date(Date.now());
    return d.getFullYear();
}

function escapeHTML(str) {
    var strr = str + '';
    return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]);
}
escapeHTML.replacements = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#39;",
    "<": "&lt;",
    ">": "&gt;"
};

function changepageurl(url) {
    //console.log('changing page to '+ url);
    // if the URL contains scoutbook.com but nothing else, do not nav to it
    $('#faOverlay').hide();
    var skipNav = false;
    //if (url.match(/scoutbook.com\//) != null) {
        //if (url.match(/scoutbook.com\/./) == null) {
    if(/\.com|\.org/.test(url)) {
        if (url.match(/\.com|\.org\/./) == null) {
            skipNav = true;
        }
        if (url.match(/Action=Print/) != null) {
            //reports do not have mobile-concat-js loaded
            skipNav = true;
        }
    }
    if (skipNav == false) {
        $.mobile.changePage(
            url, {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    }
}

//pure test function
function sendhttpreqmsg(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            alert(this.getAllResponseHeaders());
            //this.setRequestHeader( 'Content-Disposition', 'attachment;filename=troop_194_advancement2.csv' );
            //alert(this.getAllResponseHeaders());			
            //alert('got response');
        }
    };
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function () {
        //alert('error');
        return;
    };
}
function getHTMLElement(start, type, data) {
    var srchstr = data.slice(data.indexOf(start));

    if (srchstr == -1) {
        return '';
    }
    var depth = 0;
    var glob = 'g';
    var pat = '<' + type + '|</' + type;
    var re = new RegExp(pat, glob);
    var res;
    do {
        res = re.exec(srchstr);
        if (res != undefined) {
            if (res[0] == '<' + type) {
                depth += 1;
            } else {
                depth -= 1;
            }
            if (depth == 0) {
                var end = srchstr.indexOf('>', res.index);
                return srchstr.slice(0, end + 1);
            }
            //console.log(res[0],res.index);
        }
    } while (res != undefined);

    return '';
}