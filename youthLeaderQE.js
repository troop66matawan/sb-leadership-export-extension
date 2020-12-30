// Copyright © 1/28/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

//Position Name  Patrol
var leadershipLIs = '';

var positionCheck = {};

var scoutPosList = [];
var leaderDeleteList = [];
var leaderModifyList = [];
var leaderNewList = [];

function addRawYouthLeadershipQE(data, pageid, unitID, txtunit) {
    youthLeaderQE = false;
    leaderDeleteList = [];
    leaderModifyList = [];
    leaderNewList = [];

    // Replace heading
    var startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1);
    var endfunct = data.indexOf('</h1>', 1);

    var newdata = data.slice(0, startfunc);
    newdata += '<span style="margin-left: 5px; ">';
    newdata += '		<a href="#" id="buttonRefresh1" class="text">' + escapeHTML(txtunit) + '</a>';
    if (QEPatrol != '') {
        newdata += '		<a id="goToDenPatrol" href="' + escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID=' + unitID + '&DenID=&PatrolID=' + QEPatrolID) + '" class="text" data-direction="reverse">' + escapeHTML(QEPatrol) + '</a>';
    }
    newdata += '           Record Multiple Scout Leadership Positions';
    newdata += '</span>';
    newdata += data.slice(endfunct);

    data = newdata;

    var startfunc = data.indexOf('<a id="goBack"', 1);
    var endfunct = data.indexOf('<img src', startfunc);
    myfunc = '<a href="#" id="buttonRefresh" >';
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    // replace content
    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc);
    newdata += setYouthleadershipPageContent(txtunit, 'Page' + escapeHTML(pageid));
    newdata += data.slice(endfunct);
    data = newdata;

    // replace style
    var startfunc = data.indexOf('<style type="text/css">');
    var endfunct = data.indexOf('</style>');
    var newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">';
    newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' #popupDeleteLog								{ max-width: 400px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }';

    newdata += '		//#Page' + escapeHTML(pageid) + ' .ui-btn { margin-top:8px;  !important}';
    newdata += '		#Page' + escapeHTML(pageid) + ' .ui-input-text { font-weight:bold; padding-top:5px; padding-bottom:3.5px; margin:0; !important}';

    newdata += '		#Page' + escapeHTML(pageid) + ' .defaultDateDv input.ui-input-text	{ width: 50%; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .defaultDateDv label.ui-input-text	{ width: 50%; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' #popupDeletePosition									{ max-width: 400px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .slider													{ float: right; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' div.ui-slider											{ position: absolute; top: 2px; right: 10px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' div.ui-slider-switch									{ width: 5em; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #defaultPositionLI .questionIcon					{ position: absolute; top: 10px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #defaultPositionLI label.ui-input-text			{ margin-bottom: 0; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' #denLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #denNumberLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #patrolNameLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #meritBadgesLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #availabilityLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #listTypeLI,\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #listTypeUnitLI				{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #listTypeDistrictLI			{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #denIDLI							{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #patrolIDLI						{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #akelaUnitNumberLI			{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' #akelaUnitIDLI					{ display: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.denImage					{ position: absolute; height: 32px; top: -6px; left: -6px; }\n';

    newdata += '	</style>';
    newdata += data.slice(endfunct);
    data = newdata;

    // replace script.  Starsts after <script tag
    var startfunc = data.indexOf('var formPost;');
    var endfunct = data.indexOf('</script>', startfunc);

    var myfunc;

    myfunc = '' + y2script;

    myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID\s*=\s*X/g, 'UnitID=' + escapeHTML(unitID)).replace(/txtunit\s*=\s*X/, 'txtunit="' + escapeHTML(txtunit) + '"');
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    //scoutPermObjList=[];
    return data;
}

function setYouthleadershipPageContent(txtunit, tpageid) {
    var newdata;
    newdata = '	<div data-role="content">';

    newdata += '	<form id="leadershipForm">';
    newdata += '		<input type="hidden" name="Action" value="Submit" />';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

    newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';
    newdata += '			 Quick Edit Scout Leadership';
    newdata += '			</li>';

    newdata += '			<li id="scoutsLI" data-theme="d">';

    newdata += '					<p class="normalText">Now you can quickly and easily update Scout Leadership Positions for the whole Pack or Troop!</p>';

    newdata += '						<legend class="text-orange">';
    newdata += '								<strong>Update Scout Leadership Positions:</strong>';
    newdata += '						</legend>';
    newdata += '			</li>';
    newdata += '		</ul>';
    newdata += '		<fieldset data-role="controlgroup">';

    /*
    grid b has abc
    grid c has abcd
    grid d has abcde
    grid e has ab cd ef
     */
    newdata += '					<div class="ui-grid-b ui-responsive" >';
    newdata += '						<div class="ui-block-a">';
    newdata += '            			    </div>';
    newdata += '						<div class="ui-block-b">';
    newdata += '            			    </div>';
    newdata += '						<div class="ui-block-c">';
    newdata += '							<div data-role="fieldcontain" id="defaultDateDv" data-theme="h" style="float: right";>';
    newdata += '						      	<label for="defaultDate">Date Default:</label>';
    newdata += '								<input type="text"  name="DefaultDate" id="defaultDate"  value="' + escapeHTML(nowDate()) + '" defaultValue="' + escapeHTML(nowDate()) + '" class="calendar defaultDate" >';
    newdata += '            					</div>';
    newdata += '            				</div>';
    newdata += '            			</div>';
    newdata += '					<div class="ui-grid-d ui-responsive" >'; //5 blocks
    newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Scout';
    newdata += '            				</div>';

    newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Position';
    newdata += '            				</div>';

    newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Start Date';
    newdata += '            				</div>';
    newdata += '						<div class="ui-block-d" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							End Date';
    newdata += '            				</div>';

    newdata += '						<div class="ui-block-e" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							';
    newdata += '            				</div>';
    //   a black  b blue c grey d white e yellow f green g red h (white no border? looks light grey w white/blk font) i blk (background with blk font)


    var style = '';
    for (var i = 0; i < scoutPosList.length; i++) {
        if (scoutPosList[i].name.match(/^ACCOUNT,/) == null) {

            newdata += '					<div class="ui-block-a" >';
            newdata += '						<input readonly type="text" name="xID' + escapeHTML(scoutPosList[i].id) + '" id="xID' + escapeHTML(scoutPosList[i].id) + '" defaultValue="" value="' + escapeHTML(scoutPosList[i].name) + '" >';
            newdata += '            			</div>'; // end block a
            newdata += '					<div class="ui-block-b"  >';
            newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n'; //padding:5px;
            newdata += '				        	<input type="button"  data-role="button" value="+ Add Position" data-theme="e" class="buttonAddPosition" id="buttonAddPosition' + escapeHTML(scoutPosList[i].id) + '"/>';
            newdata += '					   </div >';
            newdata += '           			</div>';
            newdata += '					<div class="ui-block-c"  >';
            newdata += '           			</div>';
            newdata += '					<div class="ui-block-d" >';
            newdata += '           			</div>';
            newdata += '					<div class="ui-block-e" >';
            newdata += '           			</div>';

            for (var j = 0; j < scoutPosList[i].poslist.length; j++) {
                newdata += '					<div class="ui-block-a" >';
                newdata += '						<div id="status' + escapeHTML(scoutPosList[i].id) + '-' + j + '" style="font-weight:bold; text-align:right; padding:10px;"></div>';
                newdata += '           			</div>';

                newdata += '					<div class="ui-block-b" >';
                newdata += '						<input readonly type="text" class="lookupExistPos" name="posNameID' + escapeHTML(scoutPosList[i].id) + '-' + j + '" id="posNameID' + escapeHTML(scoutPosList[i].id) + '-' + j + '" defaultValue="" value="' + escapeHTML(scoutPosList[i].poslist[j].position) + '" data-posid="' + escapeHTML(scoutPosList[i].poslist[j].posid) + '">';
                newdata += '            			</div>'; // end block a

                newdata += '					<div class="ui-block-c" >';
                newdata += '						<input type="text" name="sdateID' + escapeHTML(scoutPosList[i].id) + j + '" id="sdateID' + escapeHTML(scoutPosList[i].id) + '-' + j + '" defaultValue="' + escapeHTML(scoutPosList[i].poslist[j].startdate) + '" value="' + escapeHTML(scoutPosList[i].poslist[j].startdate) + '"  class="calendar" data-posid="' + escapeHTML(scoutPosList[i].poslist[j].posid) + '">'; //style="font-size: 12px; width: 70%;"
                newdata += '           			</div>';

                newdata += '					<div class="ui-block-d" >';
                newdata += '						<input type="text" name="edateID' + escapeHTML(scoutPosList[i].id) + '-' + j + '" id="edateID' + escapeHTML(scoutPosList[i].id) + '-' + j + '" defaultValue="' + escapeHTML(scoutPosList[i].poslist[j].enddate) + '" value="' + escapeHTML(scoutPosList[i].poslist[j].enddate) + '"  class="calendar" data-posid="' + escapeHTML(scoutPosList[i].poslist[j].posid) + '">'; //style="font-size: 12px; width: 70%;"
                newdata += '           			</div>';
                newdata += '					<div class="ui-block-e" >';
                newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
                newdata += '				        	<input type="button"  data-role="button" value="End Position" class="endToday" data-theme="c" id="buttonEndPosition' + escapeHTML(scoutPosList[i].id) + '-' + j + '" data-posid="' + escapeHTML(scoutPosList[i].poslist[j].posid) + '" />';
                newdata += '					    </div >';
                newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
                newdata += '				        	<input type="button"  data-role="button" value="Delete Position" class="delPos" data-theme="g" id="buttonDeletePosition' + escapeHTML(scoutPosList[i].id) + '-' + j + '" data-posid="' + escapeHTML(scoutPosList[i].poslist[j].posid) + '" />';
                newdata += '					    </div >';
                newdata += '           			</div>';

            }

            // create hidden elements
            var jk = 0;
            for (k = 0; k < 3; k++) {
                jk = j + k;
                newdata += hiddenElement(scoutPosList[i].id + '-' + k, scoutPosList[i].id + '-' + jk, scoutPosList[i].denpatrol);
            }

        }
    }

    newdata += '					</div>'; // end of grid b


    newdata += '		</fieldset>';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

    newdata += '			<li class="ui-body ui-body-b">';
    newdata += '				<div class="ui-grid-a ui-responsive">';

    newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
    newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
    newdata += '			    </div>';
    newdata += '			</li>	';

    newdata += '		</ul>';
    newdata += '		</form>';

    //var trainingIDLI='';
    //                                                                                                max width 400px
    newdata += '<div data-role="popup" id="setLeaderMenu" data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 600px;" data-overlay-theme="b">'; //data-theme="d" data-history="false"  data-dismissible="false"
    newdata += '<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >'; //class="ui-icon-alt"
    newdata += '<li data-role="divider" data-theme="e">Select Position</li>';

    newdata += '		<p class="normalText">Select the Leadership Position.</p>';
    newdata += '		<ul data-role="listview" data-inset="true">';
    newdata += leadershipLIs;
    newdata += '		</ul>';
    newdata += '<li><input type="button" value="Set Leadership" data-theme="g" id="buttonSetVal" ><input type="button" value="Cancel" data-theme="d" id="buttonSetCancel" ></li>';
    newdata += '<li id="setValErrLI">';
    newdata += '</li>';
    newdata += '</ul>';
    newdata += '		<input type="hidden" id="setPopID",value="">';
    newdata += '</div>';

    newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '		<div id="errorPopupIcon"></div>';
    newdata += '		<div id="errorPopupContent"></div>';
    newdata += '		<div class="clearRight"></div>';

    newdata += '	</div>';

    newdata += '		<div id="footer" align="center">';

    newdata += logoutWarningPageContent(tpageid);
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '	<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '		</div>';

    return newdata;

}

function hiddenElement(kid, id, denpatrol) {
    var newdata = '';

    newdata += '					<div class="ui-block-a hidden' + escapeHTML(kid) + '" style="display:none;">';
    newdata += '           			</div>';

    newdata += '					<div class="ui-block-b hidden' + escapeHTML(kid) + '"  style="display:none;">';
    newdata += '						<input readonly type="text" name="posNameID' + escapeHTML(id) + '" class="lookupPos" id="posNameID' + escapeHTML(id) + '"   value="" placeholder="Select Position..." data-posid data-denpatrol="' + escapeHTML(denpatrol) + '" >';
    newdata += '            			</div>';

    newdata += '					<div class="ui-block-c hidden' + escapeHTML(kid) + '"  style="display:none;">';
    newdata += '						<input type="text" name="sdateID' + escapeHTML(id) + '" id="sdateID' + escapeHTML(id) + '" value=""  class="newpos calendar" data-posid>'; //style="font-size: 12px; width: 70%;"
    newdata += '           			</div>';

    newdata += '					<div class="ui-block-d hidden' + escapeHTML(kid) + '"  style="display:none;">';
    newdata += '						<input type="text" name="edateID' + escapeHTML(id) + '" id="edateID' + escapeHTML(id) + '"  value=""  class="newpos calendar" data-posid>'; //style="font-size: 12px; width: 70%;"
    newdata += '           			</div>';
    newdata += '					<div class="ui-block-e hidden' + escapeHTML(kid) + '"  style="display:none;">';
    newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
    newdata += '				        	<input type="button"  data-role="button" value="End Today" data-theme="c" class="endToday" id="buttonEndPosition' + escapeHTML(id) + '" data-posid />';
    newdata += '					    </div >';
    newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
    newdata += '				        	<input type="button"  data-role="button" value="Delete Position" class="delPos" data-theme="g" id="buttonDeletePosition' + escapeHTML(id) + '" data-posid data-hiddenid="' + escapeHTML(kid) + '"/>';
    newdata += '					    </div >';
    newdata += '           			</div>';

    return newdata;
}

function getLeadershipLIs(pageid, unitID, txtunit) {

    if (scoutPermObjList.length == 0) {
        //alert('You do not have permissions for any Scouts in this unit');
        genError(pageid, unitID, 'You do not have permissions for any Scouts in this unit');
        return false;
    }

    var thisScoutID = scoutPermObjList[0].id;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], getLeadershipLIs, [pageid, unitID, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            positionCheck = {};
            var resphtml = $('html', this.response).html();

            if (resphtml.indexOf('<li data-role="fieldcontain" id="akelaUnitNumberLI">') == -1) {
                $.mobile.loading('hide');

                //debugger;
                leadershipLIs = getHTMLElement('<li data-role="fieldcontain" id="membershipsLI">', 'li', resphtml);
                leadershipLIs += getHTMLElement('<li data-role="fieldcontain" id="positionIDLI">', 'li', resphtml).replace(/<img[^>]+>/, ''); // remove help
                leadershipLIs += getHTMLElement('<li data-role="fieldcontain" id="denLI" data-theme="d">', 'li', resphtml);
                leadershipLIs += getHTMLElement('<li data-role="fieldcontain" id="denNumberLI" data-theme="d">', 'li', resphtml);
                leadershipLIs += getHTMLElement('<li data-role="fieldcontain" id="patrolNameLI" data-theme="d">', 'li', resphtml);
                leadershipLIs += getHTMLElement('<li data-role="fieldcontain" id="patrolIDLI" data-theme="d">', 'li', resphtml);

                var st = resphtml.indexOf(":radio[id ^= userMembershipID");
                var en = resphtml.indexOf('})', st);
                if (resphtml.slice(st, en).match(/val\(\) == (\d+)/) != null) {
                    var tid = resphtml.slice(st, en).match(/val\(\) == (\d+)/)[1];

                    $(':radio[name=UserMembershipID]', this.response).each(function () {
                        if ($(this).val() == tid) {
                            positionCheck['UserMembershipID'] = $(this).val();
                            positionCheck['unitTypeID'] = $(this).attr('data-unittypeid');
                            positionCheck['unitID'] = $(this).attr('data-unitid');
                            positionCheck['councilID'] = $(this).attr('data-councilid');
                            positionCheck['akelaUnitID'] = $(this).attr('data-akelaunitid');
                            positionCheck['unitNumber'] = $(this).attr('data-unitnumber');
                        }
                    });
                } else {
                    if (resphtml.slice(st, en).match(/attr\('data-unitid'\) == (\d+)/) != null) {
                        var tid = resphtml.slice(st, en).match(/attr\('data-unitid'\) == (\d+)/)[1];
                        $(':radio[name=UserMembershipID]', this.response).each(function () {
                            if ($(this).attr('data-unitid') == tid) {
                                positionCheck['UserMembershipID'] = $(this).val();
                                positionCheck['unitTypeID'] = $(this).attr('data-unittypeid');
                                positionCheck['unitID'] = $(this).attr('data-unitid');
                                positionCheck['councilID'] = $(this).attr('data-councilid');
                                positionCheck['akelaUnitID'] = $(this).attr('data-akelaunitid');
                                positionCheck['unitNumber'] = $(this).attr('data-unitnumber');
                            }
                        });
                    } else {
                        //alert('Processing error determining Scout Unit');
                        genError(pageid, unitID, 'Processing error determining Scout Unit');
                        return false;
                    }
                }

                /*
                $(':radio[name=UserMembershipID]', this.response).each(function () {
                if($(this).val() == tid) {
                positionCheck['unitTypeID'] = $(this).attr('data-unittypeid');
                positionCheck['unitID'] = $(this).attr('data-unitid');
                positionCheck['councilID'] = $(this).attr('data-councilid');
                positionCheck['akelaUnitID'] = $(this).attr('data-akelaunitid');
                positionCheck['unitNumber'] = $(this).attr('data-unitnumber');
                }
                });
                 */

                getScoutPositionsFromRoster(pageid, unitID, txtunit);
                return;

            }

        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?ScoutUserID=' + escapeHTML(thisScoutID) + '&UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], getLeadershipLIs, [pageid, unitID, txtunit]);
    };

}

function getMyUserMembership(id, unitID, pageid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], getMyUserMembership, [id, unitID, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var leadershipLIs = getHTMLElement('<li data-role="fieldcontain" id="membershipsLI">', 'li', this.response);
            //reset this

            $('#membershipsLI', pageid).replaceWith(leadershipLIs).trigger('create').hide();

            $('#setLeaderMenu', pageid).popup('open');
            $('#membershipsLI', pageid).hide();
        }
    };
    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?ScoutUserID=' + escapeHTML(id) + '&UnitID=' + escapeHTML(unitID);
    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], getMyUserMembership, [id, unitID, pageid]);
    };
}

function getScoutPositionsFromRoster(pageid, unitID, txtunit) {
    scoutPosList = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], getScoutPositionsFromRoster, [pageid, unitID, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            var evObj = {};

            var pos = '';
            var poslist = [];
            $('li[data-scoutuserid]', this.response).each(function () {
                if ($('img[src*="securityapproved32.png"]', this).length > 0) {
                    pos = '';
                    evObj = {
                        name: '',
                        id: '',
                        denpatrol: '',
                        posexist: false,
                        checked: false,
                        poslist: []
                    };

                    pos = $('.positions', this).text().trim();
                    if (pos != '') {

                        evObj.denpatrol = pos.match(/[^ ]+ Den .+|.+Patrol/);
                        poslist = pos.split(',');

                        if (poslist[0].match(/Senior Patrol Leader/) != null) {
                            evObj.denpatrol = null; // an exception!  SPL not in a patrol
                        }

                        for (var i = 0; i < poslist.length; i++) {
                            poslist[i] = poslist[i].trim();
                        }

                        if (evObj.denpatrol != null) {
                            evObj.denpatrol = poslist.shift();
                        } else {
                            evObj.denpatrol = '';
                        }

                        if (poslist.length != 0) {
                            evObj.posexist = true;
                        }

                    }

                    evObj.name = $('a[href*="ScoutUserID"]', this).text().trim().split('\n')[0].trim();
                    if (evObj.name.match(/(^Account, | Account$)/) == null) {

                        evObj.id = $(this).attr('data-scoutuserid');

                        //Lions may not hold leadership positions
                        if (evObj.denpatrol.match(/Lion Den/) == null) {
                            scoutPosList.push(JSON.parse(JSON.stringify(evObj)));
                        }
                    }
                    //console.log(denpatrol,id,name,pos,poslist);
                }
            });

            iterateForLeaderDates(pageid, unitID, txtunit);

        }
    }

    var url = 'https://' + host +'/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], getScoutPositionsFromRoster, [pageid, unitID, txtunit]);
    }

}

//if posexist = true, this scout positions are loaded if the poslist isn't empty
function iterateForLeaderDates(pageid, unitID, txtunit) {

    var scoutid = '';
    for (var i = 0; i < scoutPosList.length; i++) {

        if (scoutPosList[i].checked == false && scoutPosList[i].posexist == true) {
            scoutid = scoutPosList[i].id;
            break;
        }

    }
    if (scoutid == '') {
        // Set global to modify next page
        // call for next page
        youthLeaderQE = true;
        $.mobile.changePage(
            '/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID), {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        });
        return;
    }

    // get the posisiotns page
    var pos = '';
    var posid = '';
    var unit = '';
    var denpatrol = '';
    var dates = [];
    var combopos = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], iterateForLeaderDates, [pageid, unitID, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('a[href*="UserPositionID"]', this.response).each(function () {
                pos = '';
                posid = '';
                if ($(this).attr('href').match(/UserPositionID=(\d+)/) != null) {
                    posid = $(this).attr('href').match(/UserPositionID=(\d+)/)[1];
                }
                unit = '';
                dates = [];
                startdate = '';
                enddate = '';
                denpatrol = '';
                if ($(this).attr('href').match(/mobile/) == null) {

                    for (var i = 0; i < scoutPosList.length; i++) {
                        if (scoutid == scoutPosList[i].id) {
                            scoutPosList[i].checked = true;
                            break;
                        }
                    }

                    pos = $('.noellipsis', this).text().trim();
                    combopos = pos;
                    unit = $('.orangeSmall', this).text().trim();

                    //unit might have a subunit name in it.
                    if (unit.match(/^(Troop \d|Pack \d|Crew \d|Ship \d)/) == null) {
                        denpatrol = unit.match(/(.+)(Troop |Pack |Crew |Ship )/)[1].trim();
                        combopos += ' ' + denpatrol;
                    }

                    if (unit.match(txtunit) == null) {
                        //console.log('filter on unit here.  Position is outside of unit, ignore it');
                    } else {
                        dates = $('div[style*="gray"]', this).text().match(/\w\w\w \d+, \d\d\d\d/g);
                        startdate = dates[0];
                        if (dates.length > 1) {
                            enddate = dates[1];
                        }

                        if (enddate == '') {
                            //Only list open positions for now.
                            if ($('img[src*="securityapproved32"]', this).length != 0) {
                                for (var i = 0; i < scoutPosList.length; i++) {
                                    if (scoutid == scoutPosList[i].id) {
                                        scoutPosList[i].poslist.push({
                                            position: combopos,
                                            posid: posid,
                                            startdate: dateC(startdate),
                                            enddate: dateC(enddate)
                                        });
                                        break;
                                    }
                                }
                            }
                        }

                    }

                }
            });

            iterateForLeaderDates(pageid, unitID, txtunit);

        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/positions.asp?ScoutUserID=' + escapeHTML(scoutid) + '&UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], iterateForLeaderDates, [pageid, unitID, txtunit]);
    }
}

function dateC(datein) {
    if (datein == '') {
        return '';
    }

    var monA = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var pdate = datein.match(/(\w\w\w) (\d+), (\d+)/);
    for (var i = 0; i < monA.length; i++) {
        if (monA[i] == pdate[1]) {
            break;
        }
    }
    i += 1;
    return i + '/' + pdate[2] + '/' + pdate[3];
}

function nowDate() {
    var d = new Date(Date.now());
    return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
}

function y2script() {

    var UnitID = X;
    var gLineID;
    //  2/12 18

    function pageInit() {

        $('#buttonRefresh, #buttonRefresh1', '#PageX').click(function () {

            scoutPermObjList.length = 0;
            schoolQE = false;
            $.mobile.loading('hide');
            $.mobile.changePage(

                'https://' + host +'/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
                {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            });

            //return false;
        });

        /*
        $('#unitNumber, #councilID', '#PageX').change(function() {
        $('#positionID', '#PageX').trigger('change');
        refreshBSAUnitDescriptionList();
        });

        $('#akelaUnitID', '#PageX').change(function() {
        var unitNumber = $('option:selected', this).attr('data-unitnumber');
        if(unitNumber != 0 && unitNumber != '' && unitNumber != undefined) {
        $('#akelaUnitNumber', '#PageX').val(unitNumber);
        $('#akelaUnitNumberLI', '#PageX').slideDown(200);
        } else {
        $('#akelaUnitNumber', '#PageX').val('');
        $('#akelaUnitNumberLI', '#PageX').slideUp(200);
        }
        });
         */

        //JAL, 012918: show the Patrol radio buttons
        $('#patrolIDLI', '#PageX').show();

        $('#positionID', '#PageX').change(function () {

            var denpatrol;
            if ($('#posNameID' + gLineID, '#PageX').attr('data-patrolid') != '') {
                denpatrol = $('#posNameID' + gLineID, '#PageX').attr('data-denpatrol');

            }

            // show or hide the den info
            var positionID = $(this).val();

            //debugger;
            var councilID = positionCheck.councilID;
            var unitTypeID = positionCheck.unitTypeID;
            var unitNumber = positionCheck.unitNumber;

            /*
            var councilID = $('#councilID', '#PageX').val();

            //JAL, 020118: get the unitTypeID
            if ($(':radio[name=UserMembershipID]', '#PageX').is(':checked')) {
            var unitTypeID = $(':radio[name=UserMembershipID]:checked', '#PageX').attr('data-unittypeid');
            } else {
            var unitTypeID = $('#unitTypeID', '#PageX').val();
            }

            var unitNumber = $('#unitNumber', '#PageX').val();


            //var councilapproved = $('option:selected', '#councilID').attr('data-council-approved');

             */
            //JAL, 013018: enable all patrol radio buttons
            $(':radio[id^=patrolID]', '#PageX').each(function () {
                $(this).checkboxradio('enable');
            });

            //JAL, 013018: if a position ID has been selected, manage the patrol radio buttons
            if (positionID != '') {

                //JAL, 013018: determine if the assigned patrol is listed  NOT USED

                /*
                $(':radio[id ^= patrolID]').each(function() {
                // GF  021218 base on data attr name
                //if($(this).val() == patrolID) {
                var id=$(this).attr('id');
                if (denpatrol == '') {
                assignedPatrolListed = false;
                } else {
                if( denpatrol.indexOf($('label[for="'+id+'"]').text().trim()) == 0) {
                assignedPatrolListed = true;
                }
                }
                });
                 */

                //JAL, 013018: if Patrol Leader or Assistant Patrol Leader is selected
                if (positionID == '5' || positionID == '6') {

                    if (denpatrol == '') {
                        alert('Scout is not in a Patrol, this position is not available');
                        $(this).val('').selectmenu('refresh');
                        $('#patrolIDLI', '#PageX').hide();
                        return false;
                    }

                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        // GF  021218 base on data attr name
                        //if($(this).val() == xxxxx) {
                        var id = $(this).attr('id');
                        if (denpatrol.indexOf($('label[for="' + id + '"]', '#PageX').text().trim()) == 0) {
                            $(this).prop('checked', true).checkboxradio('refresh');
                        } else {
                            $(this).prop('checked', false).checkboxradio('refresh');
                            $(this).checkboxradio('disable');
                        }
                    });
                }
                //JAL, 013018: if Quartermaster or Scribe is selected
                else if (positionID == '9' || positionID == '15') {
                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        // GF  021218 base on data attr name
                        //if ($(this).val() != patrolID && $(this).val() != '') {
                        var id = $(this).attr('id');
                        if (denpatrol.indexOf($('label[for="' + id + '"]', '#PageX').text().trim()) == -1 && $(this).val() != '') {

                            $(this).prop('checked', false).checkboxradio('refresh');
                            $(this).checkboxradio('disable');
                        }
                    });
                }
                //JAL, 013118: if Troop Guide is selected
                else if (positionID == '8') {
                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        $(this).checkboxradio('enable');
                    });
                }
                //JAL, 013118: if some other position is selected
                else if (positionID != '5' && positionID != '6' && positionID != '9' && positionID != '15' && positionID != '8') {
                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        if ($(this).val() == '') {
                            $(this).prop('checked', true).checkboxradio('refresh');
                        } else {
                            $(this).prop('checked', false).checkboxradio('refresh');
                            $(this).checkboxradio('disable');
                        }
                    });
                }

                //JAL, 013118: if Troop Guide is selected
                if (positionID == '8') {
                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        $(this).checkboxradio('enable');
                    });
                }
                //JAL, 013118: if some other position is selected
                else if (positionID != '5' && positionID != '6' && positionID != '9' && positionID != '15' && positionID != '8') {
                    $(':radio[id^=patrolID]', '#PageX').each(function () {
                        if ($(this).val() == '') {
                            $(this).prop('checked', true).checkboxradio('refresh');
                        } else {
                            $(this).prop('checked', false).checkboxradio('refresh');
                            $(this).checkboxradio('disable');
                        }
                    });
                }
            } else {
                //no positionid
                $('#patrolIDLI', '#PageX').hide();

            }

            if (positionID == '84' || positionID == '79' || positionID == '80' || positionID == '82' || positionID == '83' || positionID == '104' || positionID == '105' || positionID == '85' || positionID == '151' || positionID == '207' || positionID == '208') {
                $('#patrolNameLI', '#PageX').hide();

                //JAL, 020118: Do not show the radio buttons for Cub Scouts
                if (unitTypeID != '1') {
                    $('#denLI, #denIDLI', '#PageX').show();
                }

                //if we know who the scout is  scoutPosList
                $('#denNumberLI', '#PageX').show();

                $(':radio[id^=den]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
                $(':radio[id^=denID]', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
                if (positionID == '207' || positionID == '208') {
                    $('input:radio[name=DenID]:not([data-dentype="Lion"])', '#PageX').checkboxradio('disable');
                    $('#denLions', '#PageX').prop('checked', true).checkboxradio('refresh');
                    $('#denTigerCubs, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
                } else if (positionID == '84' || positionID == '85') {
                    $('input:radio[name=DenID]:not([data-dentype="Tiger"])', '#PageX').checkboxradio('disable');
                    $('#denTigerCubs', '#PageX').prop('checked', true).checkboxradio('refresh');
                    $('#denLions, #denWolves, #denBears, #denWebelos', '#PageX').checkboxradio('disable');
                } else if (positionID == '79' || positionID == '80') {
                    $('input:radio[name=DenID]:not([data-dentype=Wolf]):not([data-dentype=Bear])', '#PageX').checkboxradio('disable');
                    $('#denLions, #denTigerCubs, #denWebelos', '#PageX').checkboxradio('disable');
                } else if (positionID == '82' || positionID == '83') {
                    $('input:radio[name=DenID]:not([data-dentype=Webelos])', '#PageX').checkboxradio('disable');
                    $('#denLions, #denTigerCubs, #denWolves, #denBears', '#PageX').checkboxradio('disable');
                    $('#denWebelos', '#PageX').prop('checked', true).checkboxradio('refresh');
                }
            } else if (unitTypeID == '2' || unitTypeID == '3') {
                //	$('#patrolNameLI', '#PageX').show();
            } else if (positionID == '95' || positionID == '1' || positionID == '2' || positionID == '152' || positionID == '86' || positionID == '87' || positionID == '159') {
                //$('#patrolNameLI', '#PageX').show();
                $('#patrolIDLI', '#PageX').show();
            } else {
                $('#denLI, #denIDLI, #patrolIDLI', '#PageX').hide();
                $('#denNumberLI', '#PageX').hide();
                //$('#patrolNameLI', '#PageX').hide();
            }

            var txtunit = X;
            if (positionID != '') {
                if (txtunit.match(/Troop/) != null) {
                    $('#patrolIDLI', '#PageX').show();
                    //$('#patrolNameLI', '#PageX').hide();
                }
            }

            if ($('#setPopID', '#PageX').val().match(/(\d+)-/) != null) {
                var id = $('#setPopID', '#PageX').val().match(/(\d+)-/)[1];
                for (var i = 0; i < scoutPosList.length; i++) {
                    if (id == scoutPosList[i].id) {
                        //set den info if empty

                        if (scoutPosList[i].denpatrol.match(/(.+) Den/) != null) {
                            var denID = 'den' + scoutPosList[i].denpatrol.match(/(.+) Den/)[1];
                            var denNum = scoutPosList[i].denpatrol.match(/Den (.+)/)[1];
                            if ($('#denNumber', '#PageX').val() == '') {
                                var chk = $('input[name="Den"]:checked', '#PageX').length;
                                if (chk == 0) {
                                    $('#denNumber', '#PageX').val(denNum);
                                    $('#' + denID, '#PageX').prop("checked", true).checkboxradio("refresh");
                                }
                            }
                        }
                        break;
                    }
                }
            }

        });

        $('.delPos', '#PageX').click(function () {
            //mark as delete , if this is a new line, just clear it all
            if ($(this).attr('id').match(/\d+/) == null)
                return false;
            if ($(this).attr('id').match(/\d+-\d+/) == null)
                return false;
            var id = $(this).attr('id').match(/\d+/)[0];
            var lineID = $(this).attr('id').match(/\d+-\d+/)[0];

            //if this line is a new unsaved line, just clear it and hide it
            if ($(this).attr('data-posid') == '') {
                $('#edateID' + lineID, '#PageX').val('');
                $('#sdateID' + lineID, '#PageX').val('');
                $('#posNameID' + lineID, '#PageX').val('');
                $('#posNameID' + lineID, '#PageX').removeAttr('data-denid');
                $('#posNameID' + lineID, '#PageX').removeAttr('data-patrolid');
                $('#posNameID' + lineID, '#PageX').removeAttr('data-dennumber');
                $('#posNameID' + lineID, '#PageX').removeAttr('data-positionid');

                if ($(this).attr('data-hiddenid').match(/\d+-\d+/) == null)
                    return false;

                var plineID = $(this).attr('data-hiddenid').match(/\d+-\d+/)[0];
                $('.hidden' + plineID, '#PageX').hide();
            } else {
                if ($(this).attr('data-delete') == undefined) {
                    $(this).attr('data-delete', 'delete');
                    $('#status' + lineID, '#PageX').text('Delete Pending Update...');
                    $(this).val('Undelete').button('refresh');
                } else {
                    $(this).removeAttr('data-delete');
                    $('#status' + lineID, '#PageX').text('');
                    $(this).val('Delete Position').button('refresh');
                }
            }
            return false;
        });

        $('.endToday', '#PageX').click(function () {
            if ($(this).attr('id').match(/\d+/) == null)
                return false;
            if ($(this).attr('id').match(/\d+-\d+/) == null)
                return false;

            var id = $(this).attr('id').match(/\d+/)[0];
            var lineID = $(this).attr('id').match(/\d+-\d+/)[0];
            $('#edateID' + lineID, '#PageX').val($('#defaultDate').val());
            return false;
        });

        $('.lookupPos', '#PageX').click(function () {

            if ($(this).attr('id').match(/\d+/) == null)
                return false;
            if ($(this).attr('id').match(/\d+-\d+/) == null)
                return false;

            var id = $(this).attr('id').match(/\d+/)[0];
            var lineID = $(this).attr('id').match(/\d+-\d+/)[0];
            gLineID = lineID;

            //Clear Position Data first

            //refreshPositionList();	//  2/12/18

            // why disable if hidden
            //$('#councilID').attr('disabled',true);
            //$('#unitTypeID').attr('disabled',true);
            //$('#unitNumber').attr('readonly',true);

            /*
            $('#councilIDLI', '#PageX').hide();
            $('#unitTypeIDLI', '#PageX').hide();
            $('#unitNumberLI', '#PageX').hide();

            //hide help - popups don't work inside a popup
            $('#akelaUnitIDHelpButton', '#PageX').hide();
            $('#positionIDHelpButton', '#PageX').hide();
            $('#denNumberHelpButton', '#PageX').hide();
             */

            //$('#positionID
            $('#positionID', '#PageX').get(0).selectedIndex = 0;
            $('#positionID', '#PageX').selectmenu('refresh', true);

            $('input[name="PatrolID"]', '#PageX').removeAttr('checked').checkboxradio('refresh');
            $('input[name="Den"]', '#PageX').removeAttr('checked').checkboxradio('refresh');
            $('#denNumber', '#PageX').val('');

            //check data to see if anything was set before, so it can be preset
            //start with the position itself
            if ($('#posNameID' + lineID, '#PageX').attr('data-positionid') != '') {
                var posID = $('#posNameID' + lineID, '#PageX').attr('data-positionid');
                if (posID != undefined) {
                    $('#positionID', '#PageX').val(posID).selectmenu('refresh', true);
                }
            }
            //next, the den
            if ($('#posNameID' + lineID, '#PageX').attr('data-denid') != '') {
                var denID = $('#posNameID' + lineID, '#PageX').attr('data-denid');
                if (denID != undefined) {
                    $('#' + denID, '#PageX').prop("checked", true).checkboxradio("refresh");
                }
            }

            if ($('#posNameID' + lineID, '#PageX').attr('data-unitnumber') != '') {
                var unitNum = $('#posNameID' + lineID, '#PageX').attr('data-unitnumber');
                if (unitNum != undefined) {
                    $('#unitNumber', '#PageX').val(unitNum);
                }
            }

            //next the den number
            if ($('#posNameID' + lineID, '#PageX').attr('data-dennumber') != '') {
                var denNum = $('#posNameID' + lineID, '#PageX').attr('data-dennumber');
                if (denNum != undefined) {
                    $('#denNumber', '#PageX').val(denNum);
                }
            }

            //try the patrol
            if ($('#posNameID' + lineID, '#PageX').attr('data-patrolid') != '') {
                var patrolID = $('#posNameID' + lineID, '#PageX').attr('data-patrolid');
                if (patrolID != undefined) {
                    $('#' + patrolID, '#PageX').prop("checked", true).checkboxradio("refresh");
                }
            }

            //finally, akelaid
            if ($('#posNameID' + lineID, '#PageX').attr('data-akelaid') != '') {
                var akelaUnitID = $('#posNameID' + lineID, '#PageX').attr('data-akelaid');
                if (akelaUnitID != undefined && akelaUnitID != '') {
                    $('#akelaUnitID', '#PageX').val(akelaUnitID).selectmenu('refresh', true);
                }
            }

            if ($('#posNameID' + lineID, '#PageX').attr('data-akelaunitnumber') != '') {
                var akelaUnitNumber = $('#posNameID' + lineID, '#PageX').attr('data-akelaunitnumber');
                if (akelaUnitNumber != undefined && akelaUnitNumber != '') {
                    $('#akelaUnitNumber', '#PageX').val(akelaUnitNumber);
                }
            }

            if ($('#posNameID' + lineID, '#PageX').attr('data-unittypeid') != '') {
                var unitTypeID = $('#posNameID' + lineID, '#PageX').attr('data-unittypeid');
                if (unitTypeID != undefined) {
                    $('#unitTypeID', '#PageX').val(unitTypeID).selectmenu('refresh', true);
                }
            }

            $('#patrolIDLI', '#PageX').hide();
            $('#patrolNameLI', '#PageX').hide();
            $('#denLI, #denIDLI', '#PageX').hide();
            $('#denNumberLI', '#PageX').hide();

            //if akela is selected, allow position to show, otherwise hide
            //	if($('#akelaUnitID option:selected', '#PageX').val() =='') {
            //		$('#positionIDLI', '#PageX').hide();
            //	} else {
            $('#positionIDLI', '#PageX').show();

            //if position is selected, show subpos as needed

            if ($('#positionID option:selected', '#PageX').val() == '104' || $('#positionID option:selected', '#PageX').val() == '105') {
                $('#patrolIDLI', '#PageX').hide();
                //$('#patrolNameLI', '#PageX').hide();

                $('#denLI, #denIDLI', '#PageX').show();
                $('#denNumberLI', '#PageX').show();
            } else if ($('#positionID option:selected', '#PageX').val() != '') {
                $('#patrolIDLI', '#PageX').show();
                //$('#patrolNameLI', '#PageX').hide();

                $('#denLI, #denIDLI', '#PageX').hide();
                $('#denNumberLI', '#PageX').hide();

            } else {}

            //	}


            $('#setPopID', '#PageX').val(lineID);

            //Need to get new usermembershipid for this scout.
            //ajax
            getMyUserMembership(id, UnitID, '#PageX');
            //$('#setLeaderMenu').popup('open');


        });

        $('.buttonAddPosition', '#PageX').click(function () {

            // add row of data
            if ($(this).attr('id').match(/\d+/) == null)
                return false;

            var id = $(this).attr('id').match(/\d+/)[0];
            var hid;

            for (j = 0; j < 3; j++) {
                if ($('.hidden' + id + '-' + j, '#PageX').css('display') == 'none') {
                    $('.hidden' + id + '-' + j, '#PageX').show();
                    //get the id of the hidden object
                    hid = $('.hidden' + id + '-' + j, '#PageX');
                    //set the start date to now

                    $('input[name*="sdateID"]', hid).val($('#defaultDate', '#PageX').val());
                    break;
                }
            }

            return false;
        });

        $('#buttonSetCancel', '#PageX').click(function () {

            $('#setLeaderMenu', '#PageX').popup('close');
            return false;
        });

        $('#buttonSetVal', '#PageX').click(function () {

            var lineID = $('#setPopID', '#PageX').val();

            //if akelaUnitID is not set, clear everything

            var akelaUnitID = positionCheck.akelaUnitID;
            var akelaUnitNumber = ''; //not used;


            var posOpt = $('#positionID option:selected', '#PageX').val();
            var posTxt = $('#positionID option:selected', '#PageX').text().trim();

            //den or patrol
            var denID = $('input[name="Den"]:checked', '#PageX').attr('id'); //could be undefined if none selected
            var denVal = $('input[name="Den"]:checked', '#PageX').val(); //could be undefined if none selected
            var denNm = $('label[for="' + denID + '"]', '#PageX').text().trim();
            var denNum = $('#denNumber', '#PageX').val();
            var unitNum = positionCheck.unitNumber;
            var patrolID = $('input[name="PatrolID"]:checked', '#PageX').attr('id'); //could be undefined if none selected
            var patrolNm = $('label[for="' + patrolID + '"]', '#PageX').text().trim();

            var unitTypeID = positionCheck.unitTypeID;
            //debugger;
            var councilID = positionCheck.councilID;

            var userMembershipID = $(':radio[name=UserMembershipID]:checked', '#PageX').val();
            if (userMembershipID == undefined) {
                userMembershipID = positionCheck.UserMembershipID;
            }

            if (posOpt == '') {
                //nothing selected
            }

            $('#setLeaderMenu', '#PageX').popup('close');
            //debugger;
            if (patrolID == undefined)
                patrolID = '';
            if (denID == undefined)
                denID = '';

            //set data attributes for the current line
            $('#posNameID' + lineID, '#PageX').attr('data-councilid', councilID);
            $('#posNameID' + lineID, '#PageX').attr('data-positionid', posOpt);
            $('#posNameID' + lineID, '#PageX').attr('data-dennumber', denNum);
            $('#posNameID' + lineID, '#PageX').attr('data-unitnumber', unitNum);
            $('#posNameID' + lineID, '#PageX').attr('data-denid', denID);
            $('#posNameID' + lineID, '#PageX').attr('data-denval', denVal);
            $('#posNameID' + lineID, '#PageX').attr('data-patrolid', patrolID);
            $('#posNameID' + lineID, '#PageX').attr('data-akelaid', akelaUnitID);
            $('#posNameID' + lineID, '#PageX').attr('data-akelaunitnumber', akelaUnitNumber);
            $('#posNameID' + lineID, '#PageX').attr('data-unittypeid', unitTypeID);
            $('#posNameID' + lineID, '#PageX').attr('data-usermembershipid', userMembershipID);

            //set the visual text field
            if (posOpt == '104' || posOpt == '105') {
                //Den or Denner
                if (denID == undefined) {
                    $('#posNameID' + lineID, '#PageX').val(posTxt);
                } else {
                    if (denNum != '' && denNm != '') {
                        $('#posNameID' + lineID, '#PageX').val(posTxt + ' ' + denNm + ' Den (' + denNum + ')');
                    } else {
                        $('#posNameID' + lineID, '#PageX').val(posTxt);
                    }
                }
            } else {
                if (patrolNm == '' || patrolNm == 'N/A') {
                    $('#posNameID' + lineID, '#PageX').val(posTxt);
                } else {
                    $('#posNameID' + lineID, '#PageX').val(posTxt + ' ' + patrolNm + ' Patrol');
                }
            }

            return false;
        });

        $('#buttonSubmit', '#PageX').click(function () {

            extSubmit(UnitID, '#PageX');

            return false;
        });
        $('#buttonCancel', '#PageX').click(function () {
            $.mobile.changePage(
                '/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID, {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            });
            return false;
        });

        //debugger;
        // 11/19 keep or hide? 1
        refreshPositionList('');

    }

    function pageShow() {

        //JAL, 012918: if a membership selection is changed, refresh the position list
        $(':radio[name=UserMembershipID]', '#PageX').change(function () {
            //debugger;
            // 11/19 keep or hide? 2
            refreshPositionList('');
        });

        //JAL, 013118: check the first Membership radio button; trigger the change event on the Membership button
        // 11/19			$(':radio[id ^= userMembershipID]:first', '#PageX').prop('checked', true).checkboxradio('refresh');
        // 11/19			$(':radio[id ^= userMembershipID]:first', '#PageX').trigger('change');

        $('.calendar', '#PageX').each(function () {
            var id = $(this).attr('id');
            $(this).width('75%').before('<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
            $($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + id + '" value="' + $(this).val() + '" />');
        });

        $('input[id^=hidden_]:hidden', '#PageX').mobiscroll().calendar({
            theme: 'scoutbook',
            buttons: ['set', 'clear', 'cancel'],
            mode: 'scroller',
            display: 'bottom',
            controls: ['calendar', 'date'],
            closeOnSelect: true,
            rows: 7,
            onClose: function (valueText) {
                var id = $(this).attr('id');
                id = id.replace('hidden_', '');
                $('#' + id, '#PageX').val(valueText).trigger('change');
            }
        });

        $('.calendarIcon', '#PageX').on('click', function () {
            var id = $(this).next('input').attr('id');
            $('#hidden_' + id, '#PageX').mobiscroll('show');
        });

        $('#membershipControlGroup', '#PageX').controlgroup('refresh');

    }
    function deletePosition() {
        alert('delete');
    }

    /*
    function refreshBSAUnitDescriptionList() {
    var councilID			= $('#councilID', '#PageX').val();
    var unitTypeID			= $('#unitTypeID', '#PageX').val();
    var unitNumber			= $('#unitNumber', '#PageX').val();

    if(councilID !=- '' && unitTypeID != '' && unitNumber != '') {
    $('#akelaUnitIDLI', '#PageX').slideDown(200);
    $('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
    $('#akelaUnitID', '#PageX').load('/mobile/includes/ajax.asp?Action=GetBSAUnitDescription&CouncilID=' + councilID + '&UnitTypeID=' + unitTypeID + '&UnitNumber=' + unitNumber, function() {
    $(this).selectmenu('refresh');
    });
    } else {
    $('#akelaUnitIDLI', '#PageX').slideUp(200);
    $('#akelaUnitID', '#PageX').html('<option value="0" selected=""selected"">loading...</option>').selectmenu('refresh');
    }
    }
     */
    function refreshPositionList(selectedPositionID) {

        var unitID;
        var unitTypeID;
        var akelaUnitID;
        var unitNumber;

        unitTypeID = positionCheck.unitTypeID;
        unitID = positionCheck.unitID;
        councilID = positionCheck.councilID;
        akelaUnitID = positionCheck.akelaUnitID;
        unitNumber = positionCheck.unitNumber

            //JAL, 013118: Show/hide the Patrol radio buttons
            if (unitTypeID == 2 || unitTypeID == 3) {
                //Remove the Patrol radio buttons
                $('#patrolIDFieldSet', '#PageX').remove();

                $('#patrolIDFieldSet', '#PageX').controlgroup('refresh');

                //Call GetPatrolList and repopulate the Patrol radio buttons
                $.getJSON('/includes/ajax.asp?Action=GetPatrolList&CouncilID=' + councilID + '&UnitNumber=' + unitNumber + '&AkelaUnitID=' + akelaUnitID + '&UnitID=' + unitID, function (data) {
                    var controlGroup = '<fieldset data-role="controlgroup" id="patrolIDFieldSet"><legend>Patrol:</legend><label for="patrolID">N/A</label><input type="radio" name="PatrolID" id="patrolID" value="" data-theme="d" />';

                    $.each(data, function (key, val) {
                        controlGroup = controlGroup + '<label for="patrolID' + val.patrolID + '">' + val.patrolName + '</label>';
                        controlGroup = controlGroup + '<input type="radio" name="PatrolID" id="patrolID' + val.patrolID + '" value="' + val.patrolID + '" data-theme="d" />';
                    });

                    controlGroup = controlGroup + '</fieldset>';

                    $('#patrolIDLI div', '#PageX').html(controlGroup);
                    $(':radio[id^=patrolID]', '#PageX').trigger('create').checkboxradio();
                    $('#patrolIDFieldSet', '#PageX').trigger('create').controlgroup();

                    //Show the Patrol radio button control
                    $('#patrolIDLI', '#PageX').show();
                    //console.log('refreshed positions');
                });
            } else {
                $('#patrolIDLI', '#PageX').hide();
            }

            if (unitTypeID != '') {
                // clear position list first

                $('#positionID', '#PageX').html('<option value=""></option>');

                // populate position list
                $.getJSON('/includes/ajax.asp?Action=GetPositionList&CouncilID=' + councilID + '&AdultPosition=0&UnitTypeID=' + unitTypeID + '&AdultUserID=&UnitID=' + UnitID, function (data) {
                    var select = $('#positionID', '#PageX');
                    $.each(data, function (key, val) {
                        $('<option/>', '#PageX').attr('value', val.positionID)
                        .html(val.position)
                        .appendTo(select);
                    });

                    // if no results then put in a phrase
                    if ($('#positionID option', '#PageX').size() == 1) {
                        $('<option/>', '#PageX').attr('value', '').html('please select a unit type first').appendTo(select)
                    }

                    if (selectedPositionID != '') {
                        $('#positionID', '#PageX').val(selectedPositionID);
                    }
                    // refresh the menu
                    $('#positionID', '#PageX').selectmenu('refresh');
                });
            }
            $('#positionID', '#PageX').trigger('change');
    }
    /*
    function refreshDistrictList(selectedDistrictID) {
    // lookup districts based on council

    var councilID = $('#councilID option:selected', '#PageX').val();


    if(councilID != '') {
    // clear district list first
    $('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').html('');

    // populate district list
    $.getJSON('/includes/ajax.asp?Action=GetDistrictList&CouncilID=' + councilID, function(data) {
    $.each(data, function(key, val){
    var checkbox = '<input type="checkbox" name="DistrictID" data-theme="d" id="districtID' + val.districtID + '" value="' + val.districtID + '" />';
    checkbox += '<label for="districtID' + val.districtID + '">' + val.districtName + '</label>';

    // insert
    $('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').append(checkbox);

    });
    // if no results then disable District option and check council by default
    if($('input:checkbox[name=DistrictID]', '#PageX').length == 0) {
    $('#listTypeCouncil', '#PageX').prop('checked', true).checkboxradio('refresh');
    $('#listTypeDistrict', '#PageX').prop('checked', false).checkboxradio('refresh').checkboxradio('disable');
    $(':radio[name=ListType]', '#PageX').trigger('change');
    } else {
    $('#listTypeDistrict', '#PageX').checkboxradio('enable');
    }

    // enhance
    $('#listTypeDistrictLI div.ui-controlgroup-controls', '#PageX').trigger('create');
    // add rounded corners
    $('label:first', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-first-child');
    $('label:last', '#PageX #listTypeDistrictLI div.ui-controlgroup-controls').addClass('ui-last-child');
    });
    }
    }
     */
    //</script>
}

// what is changing?
// for existing lines, check if marked for delete.  If so, flag
// else
//   compare sdate and edates to defaults. If different, this is a change
//   dates must be proper format
//   edate must be after sdate
// Are lines updated?

// Any new lines - look for data-attributes, only pay attention if position is set
// dates must be proper format
// edate must be after sdate

// 18 and 21 LNT and Venture PL must have end dates

function extSubmit(unitID, pageid) {

    var err = '';

    $('input[name*="sdateID"]', pageid).each(function () {
        if ($(this).val() != '') {
            if ($(this).val().match(/\d[\d]*\/\d[\d]*\/\d\d\d\d/) == null) {
                if (err == '') {
                    err = 'Invalid start date format (must be dd/mm/yyyy)) ';
                }
                err += $(this).val() + ' ';
            } else {

                if (new Date($(this).val()) == 'Invalid Date') {
                    if (err == '') {
                        err = 'Invalid start date format (must be dd/mm/yyyy)) ';
                    }
                    err += $(this).val() + ' ';
                }
            }
        }
    });

    var oerr = err;
    err = '';

    $('input[name*="edateID"]', pageid).each(function () {
        if ($(this).val() != '') {
            if ($(this).val().match(/\d[\d]*\/\d[\d]*\/\d\d\d\d/) == null) {
                if (err == '') {
                    err = 'Invalid end date format (must be dd/mm/yyyy) ';
                }
                err += $(this).val() + ' ';
            } else {
                if (new Date($(this).val()) == 'Invalid Date') {
                    if (err == '') {
                        err = 'Invalid start date format (must be dd/mm/yyyy)) ';
                    }

                    err += $(this).val() + ' ';
                }
            }

        }
    });

    oerr += err;

    if (oerr != '') {
        alert(oerr);
        return false;
    }

    var id = '';
    err = '';
    //can't have an end date without a start date
    $('input[name*="edateID"]', pageid).each(function () {
        if ($(this).val() != '') {

            if ($(this).attr('id').match(/\d+-\d+/) != null) {
                id = $(this).attr('id').match(/\d+-\d+/)[0];
                if ($('#sdateID' + id).val() == '') {
                    err = 'If an end date is specified, there must be an associated start date';
                }
            }
        }
    });

    if (err != '') {
        alert(err);
        return false;
    }

    //end date must occur after a start date

    $('input[name*="edateID"]', pageid).each(function () {
        if ($(this).val() != '') {
            if ($(this).attr('id').match(/\d+-\d+/) != null) {
                id = $(this).attr('id').match(/\d+-\d+/)[0];
                var edt = new Date($(this).val());
                var sdt = new Date($('#sdateID' + id).val());
                if (sdt > edt) {
                    err = 'End dates must not be before start dates';
                }
            }
        }
    });

    if (err != '') {
        alert(err);
        return false;
    }

    //finally, dates must be before today
    $('input[name*="edateID"]', pageid).each(function () {
        if ($(this).val() != '') {
            if ($(this).attr('id').match(/\d+-\d+/) != null) {
                id = $(this).attr('id').match(/\d+-\d+/)[0];
                var edt = new Date($(this).val());
                var sdt = new Date(Date.now());
                if (edt > sdt) {
                    err = 'Dates must not be after today';
                }
            }
        }
    });
    $('input[name*="sdateID"]', pageid).each(function () {
        if ($(this).val() != '') {
            if ($(this).attr('id').match(/\d+-\d+/) != null) {
                id = $(this).attr('id').match(/\d+-\d+/)[0];
                var edt = new Date($(this).val());
                var sdt = new Date(Date.now());
                if (edt > sdt) {
                    err = 'Dates must not be after today';
                }
            }
        }
    });
    if (err != '') {
        alert(err);
        return false;
    }

    //one more. Any new position must have a start date
    $('input[name*="posNameID"][data-positionid]', pageid).each(function () {
        if ($(this).attr('id').match(/\d+-\d+/) != null) {
            id = $(this).attr('id').match(/\d+-\d+/)[0];
            if ($('#sdateID' + id, pageid).val() == '') {
                err = 'Any newly added positions must have a start date';
            }
        }

    });

    if (err != '') {
        alert(err);
        return false;
    }

    //data-posid is the id of the link to an existing leader position
    //data-positionid is the option value for a new position


    var scoutID = '';
    var posid = '';
    var sdate = '';
    var edate = '';

    //build list of positions to be deleted
    $('input[data-delete="delete"]', pageid).each(function () {
        if ($(this).attr('id').match(/buttonDeletePosition(\d+)/) != null) {
            scoutID = $(this).attr('id').match(/buttonDeletePosition(\d+)/)[1];
            posid = $(this).attr('data-posid');
            leaderDeleteList.push({
                scoutid: scoutID,
                posid: posid
            });
        }
    });

    // get a list of modified positions.  Careful not to put new positions here
    $('input[name*="sdateID"][defaultvalue]:not(".newpos")', pageid).each(function () {
        if ($(this).attr('id').match(/\d+-\d+/) != null) {
            id = $(this).attr('id').match(/\d+-\d+/)[0];
            if ($(this).val() != $(this).attr('defaultvalue') || $('#edateID' + id).val() != $('#edateID' + id).attr('defaultvalue')) {
                scoutID = $(this).attr('id').match(/sdateID(\d+)/)[1];
                posid = $(this).attr('data-posid');
                sdate = $(this).val();
                edate = $('#edateID' + id, pageid).val();
                leaderModifyList.push({
                    scoutid: scoutID,
                    posid: posid,
                    startdate: sdate,
                    enddate: edate
                });
            }
        }
    });

    //get a list of new positions
    var posLnk = '';
    var denID = '';
    var denVal = '';
    var patrolID = '';
    var denNum = '';
    var akelaUnitID = '';
    var unitTypeID = '';
    var unitNumber = '';
    var akelaUnitNumber = ''
        var councilID = '';
    var UserMembershipID = '';
    $('input[name*="posNameID"][data-positionid]', pageid).each(function () {
        if ($(this).attr('id').match(/\d+-\d+/) != null && $(this).attr('id').match(/posNameID(\d+)/) != null) {
            id = $(this).attr('id').match(/\d+-\d+/)[0];
            scoutID = $(this).attr('id').match(/posNameID(\d+)/)[1];
            posLnk = $(this).attr('data-positionid');
            denID = $(this).attr('data-denid');
            denVal = $(this).attr('data-denval');
            patrolID = $(this).attr('data-patrolid');
            denNum = $(this).attr('data-dennumber');
            edate = $('#edateID' + id, pageid).val();
            sdate = $('#sdateID' + id, pageid).val();
            akelaUnitID = $(this).attr('data-akelaid');
            UserMembershipID = $(this).attr('data-usermembershipid');

            unitTypeID = $(this).attr('data-unittypeid'); //UnitTypeID:1				xx
            unitNumber = $(this).attr('data-unitnumber'); //UnitNumber:194				xx
            akelaUnitNumber = $(this).attr('data-akelaunitnumber'); //AkelaUnitNumber:0194		xx
            councilID = $(this).attr('data-councilid');
            if (denVal == undefined)
                denVal = '';
            if (denID == undefined)
                denID = '';
            if (patrolID == undefined)
                patrolID = '';
            if (denNum == undefined)
                denNum = '';

            if ((posLnk == 18 || posLnk == 21) && edate == '') {
                alert('Leave No Trace and Venture Patrol Leader are discontinued positions, and show for legacy purposes.  An End Date is required for these positions');
                err = 'true';
            }
            leaderNewList.push({
                scoutid: scoutID,
                posLnk: posLnk,
                startdate: sdate,
                enddate: edate,
                denID: denID,
                denVal: denVal,
                denNum: denNum,
                patrolID: patrolID,
                akelaUnitID: akelaUnitID,
                unitTypeID: unitTypeID,
                unitNumber: unitNumber,
                akelaUnitNumber: akelaUnitNumber,
                councilID: councilID,
                userMembershipID: UserMembershipID
            });
        }
    });

    if (err != '') {
        return false;
    }
    //iterate through lists
    //ghbmnnjooekpmoecnnnilnnbdlolhkhi

    youthLeaderDeletePosGet(pageid, unitID, 0);
}

/*

Saving a new position with a patrol

https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=xxx&AdultUserID=&UnitID=xxxx&DenID=&PatrolID=
Post
old
Action=Submit&CouncilID=xxx&UnitTypeID=2&UnitNumber=xxx&AkelaUnitNumber=xxx&AkelaUnitID=xxxx&PositionID=xxx&DenNumber=&PatrolName=&PatrolID=xxx&Available=1&ListType=Council&UnitList=&DateStarted=01%2F20%2F2018&DateEnded=&Notes=
new
Action=Submit&UserMembershipID=xxxx&PositionID=xx&DenNumber=&PatrolName=&PatrolID=xxxx&Available=1&ListType=Council&UnitList=&DateStarted=02%2F08%2F2018&DateEnded=&Notes=&Approved=1




Remove a position - two steps.  Go to the page,
/mobile/dashboard/admin/position.asp?UserPositionID=xxx&ScoutUserID=xxx&UnitID=xxx
Need the pageid of the above page
Then
https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID=xxxx&ScoutUserID=xxx&AdultUserID=&PageID=Page99218&UnitID=xxx&_=15166526
/mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID=xxx&ScoutUserID=xxx&AdultUserID=&PageID=Page99218&UnitID=xx

GET
Action:DeletePosition
UserPositionID:xxx
ScoutUserID:xxx
AdultUserID:
PageID:Page99218
UnitID:xxx
_:1516652699530




modify a position

https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=xxxx8&ScoutUserID=xxxx&AdultUserID=&UnitID=xxxx&DenID=&PatrolID=
Post
Action:Submit
DateStarted:1/20/2018
DateEnded:1/21/2018
Notes:


 */

//iterate until all delete psositon are gone
function youthLeaderDeletePosGet(pageid, unitID, ptr) {

    if (leaderDeleteList.length == ptr) {
        youthLeaderModifyPosPost(pageid, unitID, 0)
        return;
    }

    var posID = leaderDeleteList[ptr].posid;
    var scoutID = leaderDeleteList[ptr].scoutid;
    //var patrolID==leaderDeleteList[ptr].??;
    //ptr +=1;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderDeletePosGet, [pageid, unitID, ptr]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //get the pageid
            var pageID = '';
            if ($('div[data-role="page"]', this.response).attr('id').match(/\d+/) != null) {
                pageID = $('div[data-role="page"]', this.response).attr('id').match(/\d+/)[0];
            }
            //now call to make the change
            youthLeaderDeletePosSet(unitID, ptr, pageID);
        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?UserPositionID=' + posID + '&ScoutUserID=' + scoutID + '&UnitID=' + unitID;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderDeletePosGet, [pageid, unitID, ptr]);
    };

}

function youthLeaderDeletePosSet(unitID, ptr, pageID) {

    var posID = leaderDeleteList[ptr].posid;
    var scoutID = leaderDeleteList[ptr].scoutid;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageID, unitID, 'Youth Leadership'], youthLeaderDeletePosSet, [unitID, ptr, pageID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            ptr += 1;
            //next
            youthLeaderDeletePosGet(pageID, unitID, ptr);
        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?Action=DeletePosition&UserPositionID=' + posID + '&ScoutUserID=' + scoutID + '&AdultUserID=&PageID=Page' + pageID + '&UnitID=' + unitID;

    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageID, unitID, 'Youth Leadership'], youthLeaderDeletePosSet, [unitID, ptr, pageID]);
    };

}

function youthLeaderModifyPosPost(pageid, unitID, ptr) {

    if (leaderModifyList.length == ptr) {
        youthLeaderNewPosPostGet(pageid, unitID, 0);
        return;
    }
    //{scoutid: scoutID, posid:posid, startdate:sdate, enddate:edate}
    var scoutID = leaderModifyList[ptr].scoutid;
    var posID = leaderModifyList[ptr].posid;
    var startdate = encodeURIComponent(filldate(leaderModifyList[ptr].startdate));
    var enddate = encodeURIComponent(filldate(leaderModifyList[ptr].enddate));

    var formPost = 'Action=Submit&DateStarted=' + startdate + '&DateEnded=' + enddate + '&Notes=&Approved=1';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderModifyPosPost, [pageid, unitID, ptr]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            ptr += 1;
            youthLeaderModifyPosPost(pageid, unitID, ptr);
        }
    };

    // New includes denid and patrolid... are they needed?

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?UserPositionID=' + posID + '&ScoutUserID=' + scoutID + '&AdultUserID=&UnitID=' + unitID + '&DenID=&PatrolID=';

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderModifyPosPost, [pageid, unitID, ptr]);
    };

}

/*
https://qa.scoutbook.com/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=xxxx&AdultUserID=&UnitID=xxx&DenID=&PatrolID=
Action:Submit
CouncilID:xxx
UnitTypeID:1				xx
UnitNumber:xxx				xx
AkelaUnitNumber:xxx		xx
AkelaUnitID:xxx
PositionID:xx
Den:wolves
DenNumber:x
PatrolName:
Available:x
ListType:Council
UnitList:
DateStarted:01/22/2018
DateEnded:
Notes:
 */

function youthLeaderNewPosPostGet(pageid, unitID, ptr) {
    if (leaderNewList.length == ptr) {
        youthLeaderDone(unitID);
        return;
    }

    var scoutID = leaderNewList[ptr].scoutid;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderNewPosPostGet, [pageid, unitID, ptr]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //get the userMemberShipID
            var umID = ''; // code set, raw html is not set =$(':radio[name=UserMembershipID]:checked', this.response).val();


            var resphtml = $('html', this.response).html();

            var st = resphtml.indexOf(":radio[id ^= userMembershipID");
            var en = resphtml.indexOf('})', st);
            if (resphtml.slice(st, en).match(/val\(\) == (\d+)/) != null) {
                umID = resphtml.slice(st, en).match(/val\(\) == (\d+)/)[1];

            } else {
                if (resphtml.slice(st, en).match(/attr\('data-unitid'\) == (\d+)/) != null) {
                    var tid = resphtml.slice(st, en).match(/attr\('data-unitid'\) == (\d+)/)[1];
                    $(':radio[name=UserMembershipID]', this.response).each(function () {
                        if ($(this).attr('data-unitid') == tid) {
                            umID = $(this).val();
                        }
                    });
                } else {
                    //alert('Processing error determining Scout Unit');
                    genError(pageid, unitID, 'Processing error determining Scout MembershipID');
                    return false;
                }
            }

            youthLeaderNewPosPost(pageid, unitID, ptr, umID);
        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=' + scoutID + '&AdultUserID=&UnitID=' + unitID + '&DenID=&PatrolID=';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderNewPosPostGet, [pageid, unitID, ptr]);
    };
}

function youthLeaderNewPosPost(pageid, unitID, ptr, umID) {

    var scoutID = leaderNewList[ptr].scoutid;
    var posid = leaderNewList[ptr].posLnk;
    var startdate = encodeURIComponent(filldate(leaderNewList[ptr].startdate));
    var enddate = encodeURIComponent(filldate(leaderNewList[ptr].enddate));

    var unitTypeID = leaderNewList[ptr].unitTypeID;
    var unitNumber = leaderNewList[ptr].unitNumber;
    var akelaUnitNumber = leaderNewList[ptr].akelaUnitNumber;
    var councilID = leaderNewList[ptr].councilID;
    var akelaUnitID = leaderNewList[ptr].akelaUnitID;
    var denID = leaderNewList[ptr].denID;
    var denVal = leaderNewList[ptr].denVal;
    var denNum = leaderNewList[ptr].denNum;

    var userMembershipID = umID; //leaderNewList[ptr].userMembershipID;


    var patrolID = '';
    if (leaderNewList[ptr].patrolID.match(/\d+/) != null) {
        patrolID = leaderNewList[ptr].patrolID.match(/\d+/)[0];
    }
    var denpatrol;
    if (unitTypeID == '1')
        denVal = '&Den=' + denVal;
    if (unitTypeID == '2')
        patrolID = '&PatrolID=' + escapeHTML(patrolID);

    //{scoutid: scoutID, posLnk:posLnk, startdate:sdate, enddate:edate, denID:denID, denNum:denNum, patrolID:patrolID, akelaUnitID:akelaUnitID,unitTypeID:unitTypeID,unitNumber:unitNumber, akelaUnitNumber:akelaUnitNumber}
    //			 'Action=Submit&CouncilID=271&          UnitTypeID=2&             UnitNumber=194&           AkelaUnitNumber=0194&               AkelaUnitID=266221&         PositionID=5&                      DenNumber=&          PatrolName=&PatrolID=21975&Available=1&ListType=Council&UnitList=&DateStarted=01%2F22%2F2018&DateEnded=&Notes=
    //old
    //debugger;
    if (leaderNewList[ptr].userMembershipID == undefined) {
        var formPost = 'Action=Submit&CouncilID=' + escapeHTML(councilID) + '&UnitTypeID=' + escapeHTML(unitTypeID) + '&UnitNumber=' + escapeHTML(unitNumber) + '&AkelaUnitID=' + escapeHTML(akelaUnitID) + '&PositionID=' + posid + denVal + '&DenNumber=' + escapeHTML(denNum) + '&PatrolName=' + escapeHTML(patrolID) + '&Available=1&ListType=Council&UnitList=&DateStarted=' + escapeHTML(startdate) + '&DateEnded=' + escapeHTML(enddate) + '&Notes=';
    } else {
        //new
        var formPost = 'Action=Submit&UserMembershipID=' + escapeHTML(userMembershipID) + '&PositionID=' + posid + denVal + '&DenNumber=' + escapeHTML(denNum) + '&PatrolName=' + patrolID + '&Available=1&ListType=Council&UnitList=&DateStarted=' + escapeHTML(startdate) + '&DateEnded=' + escapeHTML(enddate) + '&Notes=&Approved=1';
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderNewPosPost, [pageid, unitID, ptr, umID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            ptr += 1;

            youthLeaderNewPosPostGet(pageid, unitID, ptr);
        }
    };

    var url = 'https://' + host +'/mobile/dashboard/admin/position.asp?UserPositionID=&ScoutUserID=' + scoutID + '&AdultUserID=&UnitID=' + unitID + '&DenID=&PatrolID=';

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], youthLeaderNewPosPost, [pageid, unitID, ptr, umID]);
    };

}

function filldate(d) {
    if (d == '')
        return '';
    var bup = d.match(/(\d+)\/(\d+)\/(\d+)/);
    if (bup[1].length == 1) {
        bup[1] = '0' + bup[1]
    }
    if (bup[2].length == 1) {
        bup[2] = '0' + bup[2]
    }
    return bup[1] + '/' + bup[2] + '/' + bup[3];
}

//codeBlock(data,'if(councilID ==')
//returns simple code snippet
/*
function ifCodeBlock(data,snipStart) {
var si=data.indexOf(snipStart);
if (si==-1) {
return '';
}
//look for a close brace after the open {
var clb =data.indexOf('}',si);
// check for an else in the next text after whiteSpace
var els = data.indexOf('else',clb);

if(els==-1) {
// no else statement
} else {
//look for next closing brace after open {
clb =data.indexOf('}',els);
}

return data.slice(si,clb+1);

}




 */

function youthLeaderDone(unitID) {

    $.mobile.changePage(
        '/mobile/dashboard/admin/unit.asp?UnitID=' + unitID, {
        allowSamePageTransition: true,
        transition: 'none',
        showLoadMsg: true,
        reloadPage: true
    });
}

function unEscapeHTML(str) {
    var strr = str + '';
    return strr.replace(/&amp;|&quot;|&#39;|&lt;|&gt;/g, (m) => unEscapeHTML.replacements[m]); //[&"'<>]
}
unEscapeHTML.replacements = {
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">"
};