var scoutExportPosList = [];

function addRawLeadershipExport(data, pageid, unitID, txtunit) {
    leadershipExport = false;

    // Replace heading
    var startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1);
    var endfunct = data.indexOf('</h1>', 1);

    var newdata = data.slice(0, startfunc);
    newdata += '<span style="margin-left: 5px; ">';
    newdata += '		<a href="#" id="buttonRefresh1" class="text">' + escapeHTML(txtunit) + '</a>';
    if (QEPatrol != '') {
        newdata += '		<a id="goToDenPatrol" href="' + escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID=' + unitID + '&DenID=&PatrolID=' + QEPatrolID) + '" class="text" data-direction="reverse">' + escapeHTML(QEPatrol) + '</a>';
    }
    newdata += '           Scout Leadership Export';
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
    newdata += setYouthLeadershipExportPageContent(txtunit, 'Page' + escapeHTML(pageid));
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

    myfunc = '' + y2Exportscript;

    //myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID\s*=\s*X/g, 'UnitID=' + escapeHTML(unitID)).replace(/txtunit\s*=\s*X/, 'txtunit="' + escapeHTML(txtunit) + '"');
    var newdata = data.slice(0, startfunc)/* + myfunc*/ + '\n' + data.slice(endfunct);
    data = newdata;

    //scoutPermObjList=[];
    return data;
}

function setYouthLeadershipExportPageContent(txtunit, tpageid) {
    var newdata;
    newdata = '<script type="text/javascript">\n';
    newdata += 'var leadershipExport = ' + JSON.stringify(scoutExportPosList,null,'\t') +';';
    newdata += '</script>';
    newdata += '<script type="text/javascript">\n';
    newdata += 'function addCSV(csv,field,lastField){\n';
    newdata += '  if (field !== undefined){\n';
    newdata += '    csv += field;\n';
    newdata += '  }';
    newdata += '  if (lastField !== true){\n';
    newdata += '    csv += ",";\n';
    newdata += '  } else {\n';
    newdata += '     csv += "\\n";\n';
    newdata += '  }';
    newdata += ' return csv;\n';
    newdata += '}';
    newdata += 'function getLeaderExportCSV() {\n';
    newdata += '  var csv = "BSA Member ID,First Name,Middle Name,Last Name,Position,Start Date,End Date\\n";\n';
    newdata += '  for (var i=0; i < leadershipExport.length; i++){\n';
    newdata += '     var row = leadershipExport[i]\n';
    newdata += '     if (row.poslist.length === 0) {\n';
    newdata += '        csv = addCSV(csv,row.bsaMemberID,false);\n'
    newdata += '        csv = addCSV(csv,row.firstName, false);\n';
    newdata += '        csv = addCSV(csv,row.middleName, false);\n';
    newdata += '        csv = addCSV(csv,row.lastName, false);\n';
    newdata += '        csv += ",,\\n";\n';
    newdata += '     } else {\n';
    newdata += '        for (var j=0; j < row.poslist.length; j++){\n';
    newdata += '            pos = row.poslist[j];\n';
    newdata += '            csv = addCSV(csv,row.bsaMemberID,false);\n'
    newdata += '            csv = addCSV(csv,row.firstName, false);\n';
    newdata += '            csv = addCSV(csv,row.middleName, false);\n';
    newdata += '            csv = addCSV(csv,row.lastName, false);\n';
    newdata += '            csv = addCSV(csv,pos.position,false);\n';
    newdata += '            csv = addCSV(csv,pos.startdate,false);\n';
    newdata += '            csv = addCSV(csv,pos.enddate,true);\n';
    newdata += '        };\n';
    newdata += '     };\n';
    newdata += '  }\n;'
    newdata += '  return csv;\n';
    newdata += '}\n';
    newdata += 'function download_csv(){\n';
    newdata += '    var hiddenElement = document.createElement(\'a\');\n';
    newdata += '    hiddenElement.href = \'data:text/csv;charset=utf-8,\' + encodeURI(getLeaderExportCSV());\n';
    newdata += '    hiddenElement.target = \'_blank\';';
    newdata += '    hiddenElement.download = \'' + txtunit.toLowerCase() + '_leadership.csv\';';
    newdata += '    hiddenElement.click();';
    newdata += '}\n';
    newdata += '</script>';
    newdata += '	<div data-role="content">';

    newdata += '	<form id="leadershipForm">';
    newdata += '		<input type="hidden" name="Action" value="Submit" />';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

    newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';
    newdata += '			 Scout Leadership History Report';
    newdata += '			</li>';

    newdata += '			<li id="scoutsLI" data-theme="d">';

    newdata += '					<p class="normalText">Now you can quickly and easily view Scout Leadership Positions for the whole Pack or Troop!</p>';
    newdata += '			</li>';
    newdata += '		</ul>';
    newdata += '		<fieldset data-role="controlgroup">';

    /*
    grid b has abc
    grid c has abcd
    grid d has abcde
    grid e has ab cd ef
     */
/*    newdata += '					<div class="ui-grid-b ui-responsive" >';
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
    newdata += '            			</div>';*/
    newdata += '					<div class="ui-grid-d ui-responsive" >'; //5 blocks
    newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Last Name';
    newdata += '            				</div>';
    newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							First Name';
    newdata += '            				</div>';
    newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							BSA ID';
    newdata += '            				</div>';

    newdata += '						<div class="ui-block-d" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Position';
    newdata += '            				</div>';

    newdata += '						<div class="ui-block-e" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Start Date / End Date';
    newdata += '            				</div>';
    //   a black  b blue c grey d white e yellow f green g red h (white no border? looks light grey w white/blk font) i blk (background with blk font)


    var style = '';
    for (var i = 0; i < scoutExportPosList.length; i++) {
        if (scoutExportPosList[i].name.match(/^ACCOUNT,/) == null) {

            if (scoutExportPosList[i].poslist.length === 0) {
                newdata += '					<div class="ui-block-a" >';
                //newdata += '						<input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '" id="xID' + escapeHTML(scoutExportPosList[i].id) + '" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].name) + '" >';
                newdata += '						<input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-lastName" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-lastName-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].lastName) + '" >';
                newdata += '            		</div>'; // end block a
                newdata += '					<div class="ui-block-b" >';
                newdata += '						<input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-firstName" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-firstName-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].firstName) + '" >';
                newdata += '            		 </div>'; // end block b
                newdata += '					 <div class="ui-block-c" >';
                newdata += '						 <input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-memberId" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-memberId-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].bsaMemberID) + '" >';
                newdata += '            		 </div>'; // end block c
                newdata += '					<div class="ui-block-d" >';
                newdata += '           			</div>';
                newdata += '					<div class="ui-block-e"  >';
                newdata += '           			</div>';
            }
            for (var j = 0; j < scoutExportPosList[i].poslist.length; j++) {
                newdata += '					<div class="ui-block-a" >';
                newdata += '						 <input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-lastName" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-lastName-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].lastName) + '" >';
                newdata += '            		</div>'; // end block a
                newdata += '					<div class="ui-block-b" >';
                newdata += '						<input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-firstName" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-firstName-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].firstName) + '" >';
                newdata += '            		</div>'; // end block b
                newdata += '					<div class="ui-block-c" >';
                newdata += '						 <input readonly type="text" name="xID' + escapeHTML(scoutExportPosList[i].id) + '-memberId" id="xID' + escapeHTML(scoutExportPosList[i].id) + '-memberId-'+j+'" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].bsaMemberID) + '" >';
                newdata += '            		</div>'; // end block c

                newdata += '					<div class="ui-block-d" >';
                newdata += '						<input readonly type="text" class="lookupExistPos" name="posNameID' + escapeHTML(scoutExportPosList[i].id) + '-' + j + '" id="posNameID' + escapeHTML(scoutExportPosList[i].id) + '-' + j + '" defaultValue="" value="' + escapeHTML(scoutExportPosList[i].poslist[j].position) + '" data-posid="' + escapeHTML(scoutExportPosList[i].poslist[j].posid) + '">';
                newdata += '            			</div>'; // end block a

                newdata += '					<div class="ui-block-e" >';
                newdata += '                        <div style="display:flex">';
                newdata += '					        <div >';
                newdata += '						        <input type="text" name="sdateID' + escapeHTML(scoutExportPosList[i].id) + j + '" id="sdateID' + escapeHTML(scoutExportPosList[i].id) + '-' + j + '" defaultValue="' + escapeHTML(scoutExportPosList[i].poslist[j].startdate) + '" value="' + escapeHTML(scoutExportPosList[i].poslist[j].startdate) + '"  class="calendar" data-posid="' + escapeHTML(scoutExportPosList[i].poslist[j].posid) + '">'; //style="font-size: 12px; width: 70%;"
                newdata += '           			        </div>';
                newdata += '					        <div  >';
                newdata += '						        <input type="text" name="edateID' + escapeHTML(scoutExportPosList[i].id) + '-' + j + '" id="edateID' + escapeHTML(scoutExportPosList[i].id) + '-' + j + '" defaultValue="' + escapeHTML(scoutExportPosList[i].poslist[j].enddate) + '" value="' + escapeHTML(scoutExportPosList[i].poslist[j].enddate) + '"  class="calendar" data-posid="' + escapeHTML(scoutExportPosList[i].poslist[j].posid) + '">'; //style="font-size: 12px; width: 70%;"
                newdata += '           			        </div>';
                newdata += '           			    </div>';
                newdata += '           			</div>';
            }
        }
    }

    newdata += '					</div>'; // end of grid b


    newdata += '		</fieldset>';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

    newdata += '			<li class="ui-body ui-body-b">';
    newdata += '				<div class="ui-grid-a ui-responsive">';

    //newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
    newdata += '					<div class="ui-block-b" onclick="download_csv()"><input type="button" data-role="button" value="Download" data-theme="d" id="buttonCancel" /></div>';
    newdata += '			    </div>';
    newdata += '			</li>	';

    newdata += '		</ul>';
    newdata += '		</form>';

    //var trainingIDLI='';
    //                                                                                                max width 400px
 /*   newdata += '<div data-role="popup" id="setLeaderMenu" data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 600px;" data-overlay-theme="b">'; //data-theme="d" data-history="false"  data-dismissible="false"
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
*/
/*
    newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '		<div id="errorPopupIcon"></div>';
    newdata += '		<div id="errorPopupContent"></div>';
    newdata += '		<div class="clearRight"></div>';

    newdata += '	</div>';
*/

    newdata += '		<div id="footer" align="center">';

    newdata += logoutWarningPageContent(tpageid);
    newdata += '<div style="margin-top: 6px;">This page was produced by the TROOP 66 Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '	<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '		</div>';

    return newdata;

}

function getLeadershipLIsExport(pageid, unitID, txtunit) {

    if (scoutPermObjList.length == 0) {
        //alert('You do not have permissions for any Scouts in this unit');
        genError(pageid, unitID, 'You do not have permissions for any Scouts in this unit');
        return false;
    }

    var thisScoutID = scoutPermObjList[0].id;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], getLeadershipLIsExport, [pageid, unitID, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            positionCheck = {};
            var resphtml = $('html', this.response).html();

            if (resphtml.indexOf('<li data-role="fieldcontain" id="akelaUnitNumberLI">') == -1) {

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

                getScoutPositionsFromRosterForExport(pageid, unitID, txtunit);
                return;

            }

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/position.asp?ScoutUserID=' + escapeHTML(thisScoutID) + '&UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], getLeadershipLIsExport, [pageid, unitID, txtunit]);
    };

}

function getScoutPositionsFromRosterForExport(pageid, unitID, txtunit) {
    scoutExportPosList = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], getScoutPositionsFromRosterForExport, [pageid, unitID, txtunit]);
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
                        checked: false,
                        pii: false,
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

                    }

                    evObj.name = $('a[href*="ScoutUserID"]', this).text().trim().split('\n')[0].trim();
                    if (evObj.name.match(/(^Account, | Account$)/) == null) {

                        evObj.id = $(this).attr('data-scoutuserid');

                        //Lions may not hold leadership positions
                        if (evObj.denpatrol.match(/Lion Den/) == null) {
                            scoutExportPosList.push(JSON.parse(JSON.stringify(evObj)));
                        }
                    }
                    //console.log(denpatrol,id,name,pos,poslist);
                }
            });

            iterateForLeaderDatesExport(pageid, unitID, txtunit);

        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], getScoutPositionsFromRosterForExport, [pageid, unitID, txtunit]);
    }

}
function iterateForLeaderDatesExport(pageid, unitID, txtunit) {

    var scoutid = '';
    for (var i = 0; i < scoutExportPosList.length; i++) {

        if (scoutExportPosList[i].checked == false ) {
            scoutid = scoutExportPosList[i].id;
            break;
        }

    }
    if (scoutid == '') {
        iterateForScoutPII(pageid, unitID, txtunit);
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
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], iterateForLeaderDatesExport, [pageid, unitID, txtunit]);
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

                        if ($('img[src*="securityapproved32"]', this).length != 0) {
                            for (var i = 0; i < scoutExportPosList.length; i++) {
                                if (scoutid == scoutExportPosList[i].id) {
                                    scoutExportPosList[i].poslist.push({
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
            });
            for (var i = 0; i < scoutExportPosList.length; i++) {
                if (scoutid == scoutExportPosList[i].id) {
                    const scout = scoutExportPosList[i];
                    scout.checked = true;
                    break;
                }
            }

            iterateForLeaderDatesExport(pageid, unitID, txtunit);

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp?ScoutUserID=' + escapeHTML(scoutid) + '&UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], iterateForLeaderDatesExport, [pageid, unitID, txtunit]);
    }
}
function iterateForScoutPII(pageid, unitID, txtunit) {

    var scoutid = '';
    for (var i = 0; i < scoutExportPosList.length; i++) {

        if (scoutExportPosList[i].pii == false ) {
            scoutid = scoutExportPosList[i].id;
            break;
        }

    }
    if (scoutid == '') {
        // Set global to modify next page
        // call for next page
        leadershipExport = true;
        $.mobile.loading('hide');
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
            errStatusHandle(this.status, genError, [pageid, unitID, 'Youth Leadership'], iterateForScoutPII, [pageid, unitID, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            let scout;

            for (var i = 0; i < scoutExportPosList.length; i++) {
                if (scoutid == scoutExportPosList[i].id) {
                    scout = scoutExportPosList[i];
                    break;
                }
            }

            var firstNameEl = $('input#firstName', this.response);
            var lastNameEl = $('input#lastName', this.response);
            var idEl = $('input#bsaMemberID', this.response);
            var middleNameEL = $('input#middleName', this.response);

            if (firstNameEl.length === 1) {
                scout.firstName = firstNameEl[0].value;
            }
            if (middleNameEL.length === 1) {
                scout.middleName = middleNameEL[0].value;
            }
            if (lastNameEl.length === 1) {
                scout.lastName = lastNameEl[0].value;
            }
            if (idEl.length === 1) {
                scout.bsaMemberID = idEl[0].value;
            }
            scout.pii = true;

            iterateForScoutPII(pageid, unitID, txtunit);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + escapeHTML(scoutid) + '&UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, genError, [pageid, unitID, 'Youth Leadership'], iterateForScoutPII, [pageid, unitID, txtunit]);
    }
}

function y2Exportscript() {

    var UnitID = X;
    var gLineID;
    //  2/12 18

    function pageInit() {

        $('#buttonRefresh, #buttonRefresh1', '#PageX').click(function () {

            scoutPermObjList.length = 0;
            schoolQE = false;
            $.mobile.loading('hide');
            $.mobile.changePage(

                'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
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
