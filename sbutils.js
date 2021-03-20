// sbutils.js
// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//PUBLIC
//window.console &&console.log("injected script execute event page " );
/*
Global variables
well global in the context of a specific SB tab
Each Chrome tab has its own set
 */
//window.console &&console.log("pagebeforeshow event page " +document.getElementsByClassName("ui-page")[0].id)
//not allowed in inject. var manifestData = chrome.runtime.getManifest();

//console.log('in inject . Reload will cause this to appear.  So does opening a new tab.');
var current
var trainingQA = false;
var enableTrainingQA = false;
var injectver = '0.0.22';
var councilTextName = '';
var mbcCouncils = ['Three Fires Council'];
var scoutlist = '';
var scoutUserID = [];
var payObj = {
    paymentLogIDList: [],
    paymentLogTxtList: [],
    paymentLogScoutList: []
};
//var paymentLogIDList=[];
//var paymentLogTxtList=[];
//var paymentLogScoutList=[];
var mbsearch = false;
var unitID;
var denID;
var patrolID;
var QEPatrol = '';
var QEPatrolID = '';
var scoutPermObjList = [];
var scoutPermPayObjList = [];
var addMBFlag = '';
var MBCdata = [];
var MBCQEMBflag = false;
var MBCqeReqFlag = false;
var pickMBCFlag = false;
var pickMBCFlagUnit = '';
var fulltable = [];
var uniqlist = [];
var counselorApprvLst = [];
var counselorApprvReqLst = [];
var mbclist = [];
var mbcpages = 0;

var addMBID = []; //list of mb ids to be added for each scout selected
var scoutUserIDMB = []; // list of selected scouts for adding mbs
var scoutUserIDMBmbc = []; //duplicate list, used for inviting counselors
var scoutUserIDMBname = []; // list of selected scout names for adding mbs
var sUIindex = -1;
var inviteMBCperm = false;
//var addMBC =[];
var addMBIDindex = -1;
var debug = 0;
//################
var iPage = '';

var payPos = ["Unit Treasurer", "Troop Admin", "Pack Admin", "Crew Admin", "Den Admin", "Patrol Admin", "Ship Admin"];
var payTotals = [];
var iEventID = '';
var initEventID = '';
var stDate = [];
var enDate = [];
var stDateFromArchive = [];
var enDateFromArchive = [];
var calLst = []; // entry list of calendar IDs selected by the user.  May want to move this into the page context

var cPage = ''; // the current pageID for the calendar page
var eventArr = [];
var evMsgObj = {
    scoutid: [],
    leaderid: [],
    parentid: [],
    scoutname: [],
    event: '',
    where: '',
    when: '',
    eventid: '',
    stat: '',
    descript: '',
    units: [],
    shown: false,
    body: '',
    subject: '',
    type: ''
};

var evLst = []; // selected list of event ids used for updating events when adding invitees

var rptArray = new Array();
var eventArray = new Array();
var recurEventIDs;
var preExistEvent; //boolean.  If the event is NEW it will be set to false.  If it is prexisting it will be set to true

var preExistRemind = false;
var preExistAdvance = false;
var hrflist = [];
var links = [];

//######  Black Pug Import Vars
var mbfirst = true; //process mbs before mbreqs
var bpdata = {};
var servErrCnt = 0;
var maxErr = 5;
var firstoff;
var lastoff;

var noNameMatch = [];
var scoutArr = [];
var mbArr = []; //array of objects with .id, .name, .bpmbname
var unitlist = [];
var recordPtr = {}; //pointer to start and end of Black Pug recordset
var mbInQ; // a black pug mb bame that isn't matched and is currently present to user as in question
var toSaveObj = {
    lst: [],
    scoutid: '',
    id: '',
    yrid: '',
    date: '',
    scout: '',
    bpreq: []
};
var myPositions = [];
var submitCompleteList = [];
var tryName = '';
var unmatchedmb = [];
var bpdataScouts = [];

var leadershipExport = false;
var scoutProfileObjList = [];
var scoutHealthObjList = [];
var scoutHealthObjListPtr = 0;

var scoutSchoolObjList = [];
var scoutSchoolObjListPtr = 0;

var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
var lastEvent = 0;
var warned = false;

var stickyDate = '';
var gInviteScout = '';
//ismobile=true;  set true to test mobile version

//##################

// Set URL host  - moved to localsession,js
//var host = window.location.hostname;
//var host = document.baseURI.match(/\/\/([^\.]+)/)[1] + '.';

// Reload the page so scripts may be embedded
//dbconsole.log('inject has loaded');

// bindings moved to bindings.js

function asetup(bindToFilter, cnt) {

    try {
        $.ajaxSetup({
            dataFilter: function (data, type) {
                //console.log('ajax rx '+type, this.url);
                for (var i = 0; i < bindToFilter.funcDefs.length; i++) {
                    var newdata = bindToFilter.funcDefs[i](data, type, this.url);
                    if (newdata != undefined && newdata != '')
                        data = newdata;
                }

                return data;
            },
            beforeSend: function (xhr, settings) {
                if (typeof detectSendLogoff != 'undefined') {
                    detectSendLogoff(settings); //session
                }
                //return xhr;
            }
        });
    } catch {
        if (cnt > 3) {
            console.log("Can't setup ajax");
        } else {
            console.log("error setup ajax - retry");
            cnt += 1;
            setTimeout(function () {
                asetup(bindToFilter, cnt);
            }, 500);
        }
    }

}

function detectSendLogoff(settings) {
    if (settings.url.indexOf('/mobile/login.asp?Action=Logout') != -1) {
        //alert('logout');
        //console.log('ajax send '+ settings.url);
        var msgObj = {
            hostx: host,
            text: "LogOff"
        };

        sendTimerMsg(msgObj, "*");
    }
}
/*******************************************************
 *	To bind to the filter, use bindToFilter.addFuncDef(yourfunc);
 *
 *   If you want your function to modify the received data, return it in
 *   your function
 *
 ********************  End Common Code  *****************/

// Simple pass through func.  Def will be bound to Ajax Call
function faFilter(data, type, thisurl) {
    var newdata = processRawData(data, type, thisurl);
    //if (typeof lastcall === 'undefined') {
    //} else {
    //	data=lastcall(data);
    //}
    return newdata;
}

//bindings moved to bindings.js

function localDataFilter(data, type, url) {
    //console.log('ajax rx '+type, this.url);
    for (var i = 0; i < bindToFilter.funcDefs.length; i++) {
        var newdata = bindToFilter.funcDefs[i](data, type, url);
        if (newdata != undefined && newdata != '')
            data = newdata;
    }

    return data;
}

function processRawData(data, type, thisurl) {

var indata = data;

    if(/^\$\.mobile\.changePage/.test(data)) {
       //do not modify changepages
       /* temp add console.log */
        //console.log('Skip modify ' +thisurl + ' ' + data);
        return data;
    }
    //get a fuller url for ajax responses
    if (thisurl.match(/\/includes\/ajax\.asp/) != null) {
        thisurl = host + '/mobile' + thisurl;
    }

    // DO NOT PROCESS FURTHER IF THIS PAGE IS DETECTED
    if (thisurl.match(/\/mobile\/signup/) != null) {
        //console.log('This page is undisturbed -signup'+thisurl);
        return data;
    }

    //handle Site Wide functions and Monitors
    if (thisurl.match(/(\.com|\.org)\/mobile\//) != null) {

        if (thisurl.match(/\/mobile\/includes\/ajax/) == null) {
            procOnMobilePageRcvd(thisurl); //this response is a full Page
        } else {
            data = proc_AjaxSnippet(data, thisurl); // This response is a snippet
            return data;
        }

        if (data == 'mobile_refreshPage();')
            return data;

        //common pageid handling
        //Reports do not have pageids

        var pageid = '';
        var tpageid = '';
        // For some reason, this code was added.
        // 10/31 if(thisurl.match(/mobile\/dashboard\/reports/) == null ) {
        //  When looking now, the only pages I see issue with are roster reports witn a reports/roster.asp?Action=Print		or /dashboard/reports/individualrecord.asp?ReportType=
        if (thisurl.match(/mobile\/dashboard\/reports\/individualrecord\.asp\?ReportType=/) == null && thisurl.match(/mobile\/dashboard\/reports\/roster\.asp\?Action=Print/) == null) {
            if (data.match(/id[^=]*=[^"]*\"Page(\d+)/) == null) {
                //possible default page
                if (data.match(/id[^=]*[^"]*=\"defaultPage/) == null) {
                    if (data.match(/id[^=]*[^"]*=\"helpPage/) != null) {
                        tpageid = 'helpPage';
                    } else {
                        //No page ID, posible user session timeout or unrecognized snippet;
                        //No further processing
                        return data;
                    }
                } else {
                    tpageid = 'defaultPage';
                }
            } else {
                pageid = data.match(/id[^=]*=[^"]*\"Page(\d+)/)[1]; // pageid is num
                tpageid = 'Page' + pageid;
            }

            var err = false;
/* temp out removed */ 
            data = rawDataFullPageSession(data, tpageid, err, thisurl);

            if (err == true) {
                return data; //page is unrecognized
            }

        }
        /*  10/31 else {
        if(thisurl.match(/mobile\/dashboard\/reports\/reportbuilder/) != null ) {
        if(data.match(/id[^=]*=[^"]*\"Page(\d+)/) != null) {
        pageid = data.match(/id[^=]*=[^"]*\"Page(\d+)/)[1];		// pageid is num
        tpageid='Page'+pageid;
        }
        }
        }*/
        var newdata = '';
        //add modification notice to all pages

/* temp out removal of footer  removed*/
        if (pageid != '') {
            startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
            newdata = data.slice(0, startfunc);
            newdata += '<div id="FeatureAssistant" style="margin-top: 6px;">T66 Feature Assistant Active</div>';
            data = newdata + data.slice(startfunc);
        }
       

    }



    // page specific modifications defined her
    if (thisurl.match(/mobile\/dashboard\//) != null) {



        if (data.match(/<title>Scoutbook<\/title>/) != null) {
            //alert('Scoutbook has terminated your session');
            //the session terminated for some unknown reason, just return
            return data;
        }

        //if(thisurl.match(/scoutbook\.com\/mobile\/dashboard\/reports\/roster\.asp/) != null ) {
        //if(thisurl.match(/Action=Print/) != null) {
        //	data=data.replace('formPost','');
        //	alert('got it');
        //	console.log('replace formPost');
        //}
        //data=data.replace(/target="_blank"/g,'');
        //}



        data = procRaw_Admin_Unit(data, thisurl, pageid);
        data = addOverlay(data, thisurl, pageid);
    }
    return data;
}

function proc_AjaxSnippet(data, thisurl) {
    // process an ajax response to insert calendar import link
    pokeSessionAjax(thisurl);

    return data;
}

//function gets called when a full page (no snippet) is received
var hideQAfooter = false;
function procOnMobilePageRcvd(thisurl) {
    
    
    $(document).one('pageshow', function () {
        // this code will run when the DOM is ready

        if (hideQAfooter) {
            $('#footer div[style="text-align: left;"]').hide();  // hides the QA stuff
        }
        // Session Timer Screen Resets
        pokeSession(thisurl);
    });
}

function addOverlay(data, thisurl, pageid) {
    var st = data.indexOf('</div><!-- /content');

    if (st != -1) {
        data = data.slice(0, st) + '<div id="faOverlay"  style="display:none; position:fixed; width:100%; height:100%; top: 0; left:0; right:0; bottom:0; cursor:pointer; background-color: rgba(0,0,0,0.5); z-index: 2;"></div>\n' + data.slice(st);
    } else {
        //console.error('no faOverlay ' + thisurl);
    }

    return data;
}


function procRaw_Admin_Unit(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/unit\.asp/) != null) {

        if (data.match(/<title>([^<]+)/) == null) {
            //console.log('No Title, posible user session timeout');
            return data;
        }
        if (data.match(/MB Counselor List/) == null) {
            mbsearch = false;
        } else {
            mbsearch = true;
        }
        if (data.match(/class="councilPatchDIV" title="([^"]+)/) != null) {
            councilTextName = data.match(/class="councilPatchDIV" title="([^"]+)/)[1];
        }

        var txtunit = data.match(/<title>([^<]+)/)[1];

        if (thisurl.match(/UnitID\=(\d+)/) == null) {
            return data;
        }
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];

        if (leadershipExport === true) {
            data = addRawLeadershipExport(data, pageid, unitID, txtunit);
        } else {
            $(document).one('pagebeforeshow', function () {
                addExportMenuItem(unitID, '', '', '#Page' + escapeHTML(escapeHTML(pageid)), txtunit);
            });
        }
    }
    return data;
}
/*
adds menu item to Export popup
 */
function addExportMenuItem(unitID, denID, patrolID, pageid, txtunit) {
    denID = denID || '';
    patrolID = patrolID || '';
    var utype;
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
    } else {
        utype = "unit";
    }

    if ($('#exportMenu >ul')[0] == null) {
        return;
    }

    // stupid inefficient fix to remove dynamic var var sel = 'payLogEntry' + utype;
    //var payPos = ["Committee Treasurer","Troop Admin","Pack Admin","Crew Admin","Den Admin","Patrol Admin"];
    var adminPos = ["Troop Admin", "Pack Admin", "Crew Admin", "Ship Admin"];
    var adminPosVis = ' style="display: none;" ';
    if (/*myPositionIs(adminPos, unitID) == true*/1) {
        adminPosVis = '';
    }
    var visiblePos = ' style="display: none;" ';  //tried hiding first but not working

    if (utype == 'denpatrol') {
     } else {
        $('#exportMenu >ul').append('<li id="expLeadershipVis" ' + adminPosVis + ' data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="exportLeadershipReport" class="showLoading ui-link-inherit">Leadership</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    }



    if (utype == 'unit') {
        // this should only show for admins and treasurers

        //$('#payLogEntryunit', pageid).click(function () {
        //hide popup, lock page
        //    $('#quickEntryMenu', pageid).popup('close');
        //    $('#faOverlay', pageid).show();
        //document.getElementById("faOverlay").style.display = "block";
        //    procPayQuickEntryItemNewRos(pageid, unitID, denID, patrolID);

        //});
        $('#exportLeadershipReport', pageid).click(function () {
            //alert('stub');
            //hide popup, lock page
            $('#exportMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procYouthLeadershipExportItem(unitID, denID, patrolID, pageid, txtunit);
        });


    }
}

function ifPosExist(args) {
    if (myPositions.length > 0) {
        $('#stDPmb').show();
        $('#stUmb').show();
    }
    var adminPos = ["Troop Admin", "Pack Admin", "Crew Admin", "Ship Admin"];
    if (myPositionIs(adminPos, args.unitID) == true) {
        $('#swimVis').show();
        $('#schoolVis').show();
        $('#adYptVis').show();
        $('#adYpt2Vis').show();
    }
    if (unitPosition(args.unitID) == true) {
        $('#scoutTrainVis').show();
        $('#oaDataVis').show();
        $('#oaRepVis').show();
        $('#oaRep2Vis').show();
        $('#youthLdrVis').show();
    }
    
    if (myPositionIs(payPos, unitID) == true || args.payQE == true) {
         $('#payBalVis').show();
         $('#payBal2Vis').show();
    }
}

function unitPosition(unitID) {
    for (var i = 0; i < myPositions.length; i++) {
        if (myPositions[i].unitID == unitID) {
            return true;
        }
    }
    return false;
}

function procYouthLeadershipExportItem(unitID, denID, patrolID, pageid, txtunit) {
    var utype;
    var patrolScouts = [];
    var DenPatrolName = '';
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
        DenPatrolName = $('Title').text();

        $('li[data-scoutuserid]').each(function () {
            patrolScouts.push($(this).attr('data-scoutuserid'));
        });

    } else {
        utype = "unit";
    }
    QEPatrol = DenPatrolName.replace(' Patrol', '').replace(' Den', '');
    QEPatrolID = patrolID;
    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };

    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    } else {
        var troop = $('#goToUnit').text(); //denpatrol page
    }

    // need to get my connections to build scout list of scouts that user has view profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procYouthLeadershipExportItem, [unitID, denID, patrolID, pageid, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function () {

                var txtUnit = localDataFilter($('.orangeSmall', this)[0].textContent, '', 'local');
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest

                    //now can we determine if scout is in patrol of interest
                    var okToUse = false;
                    if (patrolScouts.length != 0) {
                        for (var i = 0; i < patrolScouts.length; i++) {
                            if (patrolScouts[i] == $('a', this).attr('href').match(/\d+/)[0]) {
                                okToUse = true;
                                break;
                            }
                        }

                    } else {
                        okToUse = true;
                    }

                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1 || $('.permission', this)[0].textContent.indexOf('View Profile') != -1) {
                            // The User has permission to view this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = localDataFilter($('a', this)[0].textContent.trim(), '', 'local');

                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));

                            //set flags for change page

                        }
                    }
                }
            });

            scoutProfileObjList = [];

            //getLeadershipLIsExport(pageid, unitID, txtunit);
            getScoutPositionsFromRosterForExport(pageid, unitID, txtunit);
            return;

            // Set global to modify next page
            // call for next page
            $.mobile.changePage(
                '/mobile/dashboard/admin/unit.asp?UnitID=' + unitID, {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                });

        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/adultconnections.asp';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, ''], procYouthLeadershipExportItem, [unitID, denID, patrolID, pageid, txtunit]);
    };
}

function genError(pageid, unitid, typemsg) {
    $.mobile.loading('hide');
    healthQE = false;
    swimQE = false;
    schoolQE = false;

    $('#faOverlay', pageid).hide();

    if (unitid == '') {
        if (/UnitID\=\d+/.exec($('base')[0].href) != null) {
            unitid = /UnitID\=\d+/.exec($('base')[0].href)
        }
    }
    if (typemsg == '') {
        alert('Error , halted');
    } else {
        alert('Error posting ' + typemsg + ' data, discontinuing updates.  Not all Scouts Selected are updated');
    }
    try {
        $('#buttonCancel, #buttonSubmit').button('enable');
    } catch {}
    //		$(':input', sPage +' #swimmingForm').attr('disabled', false);
    $.mobile.changePage(
        '/mobile/dashboard/admin/unit.asp?UnitID=' + unitid, {
        allowSamePageTransition: true,
        transition: 'none',
        showLoadMsg: true,
        reloadPage: true
    });
}

function procProfileGetEditScouts(unitID, pageid) {
    var utype;

    utype = "unit";

    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };

    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    }

    // need to get my connections to build scout list of scouts that user has edit profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procProfileGetEditScouts, [unitID, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log(this);
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function () {
                //console.log('x');
                //console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
                var txtUnit = $('.orangeSmall', this)[0].textContent;
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest


                    okToUse = true;

                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1) {
                            // The User has permission to edit this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = $('a', this)[0].textContent.trim();
                            //console.log(evObj.name,evObj.id);
                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));
                        }
                    }
                }
            });

            //we have scouts, ok to continue
            scoutProfileObjList = [];
            getAccount2(unitID, pageid, troop, 'report', oaCB, unitID, 'report', ''); // end that event string with the changepage
            return;

        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/adultconnections.asp';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, ''], procProfileGetEditScouts, [unitID, pageid]);
    };
}