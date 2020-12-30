// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
/* recur
waitforShow
Callback function called when ajax event finds editevent url
Inserts new submitForm and deleteEvent function to overide local page functions
 */
 
 
 
function rawDataAddRepeatEvent(data,pageid) {


//init stuff

    iPage = '';
    iEventID = '';
    initEventID = '';
    stDate.length = 0;
    enDate.length = 0;
    stDateFromArchive.length = 0;
    enDateFromArchive.length = 0;

    rptArray.length = 0;
    eventArray.length = 0;
    recurEventIDs = '';
    preExistEvent = false; //boolean.  If the event is NEW it will be set to false.  If it is prexisting it will be set to true

    preExistRemind = false;
    preExistAdvance = false;
    hrflist.length = 0;
    links.length = 0;

    //hardcode iPage = "#" + document.getElementsByClassName("ui-page")[0].id;
    
    iPage='#Page'+ pageid;
    
    //hardcode if ($('a[href*="EventID="]').attr('href').match(/EventID=\d+/) != null) {
    //hardcode     iEventID = $('a[href*="EventID="]').attr('href').match(/EventID=\d+/)[0];
    //hardcode }
    //hardcode initEventID = iEventID; 



    if (/EventID=\d+/.test(data)) {
        iEventID = data.match(/EventID=\d+/)[0];
        initEventID = iEventID;
    } else {
        return data;
    }

    if(/function submitForm/.test(data)) {
        data = data.replace(/function submitForm\(\) {/, 'function submitForm() {\npreSubmitForm();\nreturn\n');
    }

    if(/function deleteEvent/.test(data)) {
        data = data.replace(/function deleteEvent\(\) {/, 'function deleteEvent() {\npredeleteEvent();\nreturn\n');
    }

// getNoteCode

    var recurEventVis = {Off:'selected="selected"', On:''};
    var repeatLIvis = 'style="display: none;"';
    var optValLst = {Days: "" ,Weeks: "", MonthsOpt1: "", MonthsOpt2: "", MonthsOpt3: ""};   
    var optionValue = '';  //Days
    var strpat = /\<textarea name="Notes" id="notes" >&lt;Repeat:(\d+):([a-zA-Z]+):(\d+):*(\w*)-*(\d*)/;

    if(strpat.test(data)) {
        var result = strpat.exec(data);
        if (result == undefined) {
            rptArray.length = 0;
        } else {
            rptArray.length = 0;
            rptArray.push(result[1]); //0number   RepeatEvery
            rptArray.push(result[2]); //1days 		RepeatType
            rptArray.push(result[3]); //2number of occurrences
            rptArray.push(result[4]); //3opt
            rptArray.push(result[5]); //4 Unique ID - actually the event ID of the 1st instance
        }
        
        
        if (rptArray.length != 0) {
            //This is a repeating event that will be Edited!
            // preset the fields
            preExistEvent = true;

            /* hARDCODE These come in the future.  
            var inst = $('#advancement').mobiscroll('getInst');
            var values = inst.getValues('advancement');
            if (values.length > 0) {
                preExistAdvance = true;
            }
            inst = $('#reminders').mobiscroll('getInst');
            values = inst.getValues('reminders');
            if (values.length > 0) {
                preExistRemind = true;
            }
            */
            //hardcode $('#repeatEveryType').val(rptArray[0]); //every *2* days for 4 days


            optionValue = rptArray[1] + rptArray[3];
            
            
            
            optValLst[optionValue] = ' selected="selected"';

            
           //hardcoded $("#repeatType").val(optionValue).find("option[value=" + optionValue + "]").attr('selected', true);

            //hardcoded var optionText = $("#repeatType").find("option[value=" + optionValue + "]").text();

            //hardcoded $('#repeatType_dummy').val(optionText); //every 2 *days* for 4 days

           //hardcoded $('#occurrenceSType').val(rptArray[2]); //every 2 days for *4* days

            //createRepeatDatesFromForm then move stDate and enDate elsewhere for safekeeping
            //createRepeatDatesFromRawForm(data,Period,Interval,Occurrences)  1 days 2 opt
            createRepeatDatesFromRawForm(data,optionValue,rptArray[0],rptArray[2]); //includes date of this event

            stDateFromArchive = stDate.slice(0);
            enDateFromArchive = enDate.slice(0);
            stDate.length = 0;
            enDate.length = 0;
            //window.console &&console.log("#recurEvent set to " + $('#recurEvent', iPage).val());

            recurEventVis.On = recurEventVis.Off;
            recurEventVis.Off = '';
            
            repeatLIvis = '';
 
            
            
            /* hardcode
            if ($('#recurEvent', iPage).val() == 'off') {
                //toggle the slider to on
                $('#recurEventLI', iPage).find('[role="application"]', iPage).trigger('mousedown');
                $('#recurEventLI', iPage).find('[role="application"]', iPage).trigger('mouseup');


                $('#repeatLI').show();
                $('#repeatEveryLI').show();
                $('#occurrencesLI').show();   

            }
            */
        }        
        
        
    }



    // set up recur buttons after endDate

    var startfunc = data.indexOf('<li data-role="fieldcontain" id="endDateLI">', 1);
    if (startfunc != -1) {
        
        var endfunc = data.indexOf('</li>', startfunc) + 5;   
        var newbuttons = `
            <li id="recurEventLI" class="recurOption ui-li ui-li-static ui-btn-up-d" style="display: block;">
                <div class="slider">
                    <select name="RecurEvent" id="recurEvent" data-role="slider" data-mini="true" class="ui-slider-switch">
                        <option value="off" ` + recurEventVis.Off + ` ></option>
                        <option value="on" ` + recurEventVis.On + `></option>
                    </select>
                 </div>
                 <div style="margin-left: 0px; font-weight: normal;">Repeating Events:</div>
            </li>
            
            
            
            
            <li data-role="fieldcontain" id="repeatLI"  ` + repeatLIvis + `>
                <label for="repeatType">Interval:</label>
                
                <select name="RepeatType" id="repeatType"   class="selectScroller" data-role="none">
                    <option value="" ></option>
                    <option value="Days" ` + optValLst.Days +`>Days</option>
                    <option value="Weeks"` + optValLst.Weeks +`>Weeks</option>
                    <option value="MonthsOpt1"` + optValLst.MonthsOpt1 +`>Monthly - Fwd eg 2nd Tue</option>
                    <option value="MonthsOpt3"` + optValLst.MonthsOpt2 +`>Monthly - Rev eg last Wed</option>
                    <option value="MonthsOpt2"` + optValLst.MonthsOpt3 +`>Monthly - Same Day eg 5th</option>
                </select>
            </li>
            <li data-role="fieldcontain" id="repeatEveryLI" ` + repeatLIvis + `>
                <label for="repeatEveryType" class="ui-input-text">Interval Length:</label>

                    <input type="number" name="RepeatEveryType" id="repeatEveryType" value="` + rptArray[0] + `" max="31" min="1" placeholder="select how many intervals between events">

            </li>
            <li data-role="fieldcontain" id="occurrencesLI" ` + repeatLIvis + `>
                <label for="occurrenceSType" class="ui-input-text">Occurrences:</label>
                
                    <input type="number" name="OccurrencesType" id="occurrenceSType" value="` + rptArray[2] + `" max="52" min="1"  placeholder="select how many events">
                
            </li>
            `; 
                        
        data = data.slice(0, endfunc) + newbuttons + data.slice(endfunc);
    
        startfunc = data.indexOf('<div data-role="header"', 1);
        if (startfunc != -1) {    
            endfunc = data.indexOf('function pageInit() {', startfunc);
            if (endfunc != -1) {
                endfunc += 'function pageInit() {'.length;
                var mobi = `  

                    $('#repeatType', '#Page`+pageid+`').mobiscroll().select({
                        theme: 'scoutbook',
                        display: 'bubble',
                        counter: true,
                        animate: 'flip',
                        buttons: ['set', 'clear', 'cancel'],
                        mode: 'mixed',
                        placeholder: 'select the units of time',
                        rows: 5,
                        disabled: false
                    });
                `;
                
                data = data.slice(0, endfunc) + mobi + data.slice(endfunc);
            }
            
            endfunc = data.indexOf('function pageShow() {', startfunc);
            if (endfunc != -1) {
                endfunc += 'function pageShow() {'.length;       

                var sliderTog = `
                    $('#recurEvent', '#Page`+pageid+`').on('slidestop', function () {

                        var recurEvent = $(this).val();
                        //alert('show directive' + recurEvent);
                        if ($(this).val() == 'on') {

                            $('#repeatLI', '#Page`+pageid+`').show();
                            $('#repeatEveryLI', '#Page`+pageid+`').show();
                            $('#occurrencesLI', '#Page`+pageid+`').show();
                            //$('.dwwr').attr('style', "width: 370px; white-space: nowrap;");

                        } else {

                            //Clear the Event Date Array
                            resetDateArray();


                            // Hide the options
                            $('#repeatLI', '#Page`+pageid+`').hide();
                            $('#repeatEveryLI', '#Page`+pageid+`').hide();
                            $('#occurrencesLI', '#Page`+pageid+`').hide();
                        }
                    

                    });
                    
                    $('#buttonDelete', '#Page`+pageid+`').click(function () {
                        if ($('#recurEvent', '#Page`+pageid+`').val() == 'on' && preExistEvent == true) {
                            //alert("trapped delete for multiple events");
                            // on the fly modify the popup...
                            $('#popupDeleteEvent h2').text("Delete Remaining Repeat Calendar Events?");
                            $('#popupDeleteEvent h3').text("Are you sure you want to delete all remaining Events?");
                            $('#popupDeleteEvent p').text("If you only want delete this event, select cancel, turn the Repeating Events switch to OFF, and click Delete again. Events store important information such at attendance, JTE requirements and more.  Only delete an event if you are sure you want all information associated with the event to be deleted also.");
                        } else {
                            $('#popupDeleteEvent h2').text("Delete Calendar Event?");
                            $('#popupDeleteEvent h3').text("Are you sure you want to delete this event?");
                            $('#popupDeleteEvent p').text("Events store important information such at attendance, JTE requirements and more.  Only delete an event if you are sure you want all information associated with the event to be deleted also.");

                        }
                        return false;
                    });                     
                    
                    
                `
                data = data.slice(0, endfunc) + sliderTog + data.slice(endfunc);
            }
            
        }
    }

    return data;
}    
 
 
 
function resetDateArray() {
    stDate.length = 0;
    enDate.length = 0;
}
 

 
function waitforShow() {
return;
     $(document).one('pageshow', function () {
        enableButtons();
    });        

}
function enableButtons() {

  
    iPage = '';
    iEventID = '';
    initEventID = '';
    stDate.length = 0;
    enDate.length = 0;
    stDateFromArchive.length = 0;
    enDateFromArchive.length = 0;

    rptArray.length = 0;
    eventArray.length = 0;
    recurEventIDs = '';
    preExistEvent = false; //boolean.  If the event is NEW it will be set to false.  If it is prexisting it will be set to true

    preExistRemind = false;
    preExistAdvance = false;
    hrflist.length = 0;
    links.length = 0;

    iPage = "#" + document.getElementsByClassName("ui-page")[0].id;
    if ($('a[href*="EventID="]').attr('href').match(/EventID=\d+/) != null) {
        iEventID = $('a[href*="EventID="]').attr('href').match(/EventID=\d+/)[0];
    }
    initEventID = iEventID;  
  
  
  
   SetupPage(); //recur
}



function pushUniquec(arr, arrdup, val) {
    //tested used
    for (var x = 0; x < arr.length; x++) {
        if (arr[x] == val) { //if the val already exists in arr, push the dup into arrdup
            //arrdup.push(val);
            pushUnique(arrdup, val); //arrdup will have unique repeated dates
            return true;

        }
    }
    arr.push(val);

    return false;
}

function testUnique(arr, val) {
    for (var x = 0; x < arr.length; x++) {
        if (arr[x] == val) {

            return true;

        }
    }
    return false;

}


function SetupPage() {
    // clear globals
    
    preExistEvent = false;
    stDateFromArchive.length = 0;
    stDate.length = 0;

    // Check to see if this page is a retrieved repeating event
    getNoteCode();

    if (rptArray.length != 0) {
        //This is a repeating event that will be Edited!
        // preset the fields
        preExistEvent = true;

        /*  this code rewritten to look directly at incoming msg data
        var inst = $('#advancement').mobiscroll('getInst');
        var values = inst.getValues('advancement');
        if (values.length > 0) {
            preExistAdvance = true;
        }
        inst = $('#reminders').mobiscroll('getInst');
        values = inst.getValues('reminders');
        if (values.length > 0) {
            preExistRemind = true;
        }
        */
        $('#repeatEveryType').val(rptArray[0]); //every *2* days for 4 days


        var optionValue = rptArray[1] + rptArray[3];
        $("#repeatType").val(optionValue).find("option[value=" + optionValue + "]").attr('selected', true);

        var optionText = $("#repeatType").find("option[value=" + optionValue + "]").text();

        $('#repeatType_dummy').val(optionText); //every 2 *days* for 4 days
        //$('#repeatType').val(rptArray[1]+rptArray[4]);
        $('#occurrenceSType').val(rptArray[2]); //every 2 days for *4* days

        //createRepeatDatesFromForm then move stDate and enDate elsewhere for safekeeping

        createRepeatDatesFromForm(); //includes date of this event

        stDateFromArchive = stDate.slice(0);
        enDateFromArchive = enDate.slice(0);
        stDate.length = 0;
        enDate.length = 0;
        //window.console &&console.log("#recurEvent set to " + $('#recurEvent', iPage).val());

        if ($('#recurEvent', iPage).val() == 'off') {
            //toggle the slider to on
            $('#recurEventLI', iPage).find('[role="application"]', iPage).trigger('mousedown');
            $('#recurEventLI', iPage).find('[role="application"]', iPage).trigger('mouseup');
            // setting toggle on/off ok but not causing slidestop...
            //alert('tried to trigger slide event');
            //window.console &&console.log("tried to trigger slide event");

            $('#repeatLI').show();
            $('#repeatEveryLI').show();
            $('#occurrencesLI').show();
            //$('.dwwr').attr('style', "width: 370px; white-space: nowrap;");

        }
    }

    /*  killed following code 8_20_2020  not sure why its here

    //Loaaded, but reload if needed
    $(document).one('pagehide', function (e, t) {
        //window.console &&console.log("pagehide event triggered after button load" + $(e.target).id + " " + iPage);
        if ($(e.target).id == undefined) {
            // Are we on a good page?
            if ($.mobile.activePage[0].baseURI.includes('https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp') == false) {
                //window.console &&console.log("page not editevent.asp, no reload needed " + $.mobile.activePage[0].baseURI);
                return
            }
        }
        waitforShow(); //recur
    });
    */



}


/*
checkForm
Form check to make sure all fields are filled out
Creates popop error text strings, displays popup on missing entrydata
returns false on errors
 */
function checkForm(checkrecur) {

    var errMsg;
    errMsg = '';

    if ($('#calendarID_dummy', iPage).val() == "") {
        errMsg = errMsg + '<p><strong>Event Type:</strong> Please choose an event type.</p>';
        $('#calendarLI').removeClass('ui-btn-up-c').addClass('ui-body-e'); // shades the errors
    }

    if ($('#eventType_dummy', iPage).val() == "") {
        errMsg = errMsg + '<p><strong>Event Type:</strong> Please choose an event type.</p>';
        $('#eventTypeLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
    }

    if ($('#name', iPage).val() == "") {
        errMsg = errMsg + '<p><strong>Name:</strong> Please enter the event name.</p>';
        $('#nameLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
    }

    if (checkrecur == true) {
        if ($('#recurEvent', iPage).val() == 'on') {
            if ($('#repeatType_dummy', iPage).val() == "") {
                //errMsg = "Repeat Interval not set";
                errMsg = errMsg + '<p><strong>Interval:</strong> Please choose a repeat interval type.</p>';
                $('#repeatLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
            }

            if ($('#repeatEveryType', iPage).val() == "") {
                //errMsg = errMsg + " Repeat Every value not set";
                errMsg = errMsg + '<p><strong>Repeat Every:</strong> Please choose an interval length.</p>';
                $('#repeatEveryLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
            }

            if ($('#occurrenceSType', iPage).val() == "") {
                //errMsg = errMsg + " Repeat Occurrences not set";
                errMsg = errMsg + '<p><strong>Occurrences:</strong> Please choose how many intervals.</p>';
                $('#occurrencesLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
            }
            if ($('#repeatType', iPage).val() == "Days") {
                if (parseInt($('#occurrenceSType', iPage).val()) > 31) {
                    //errMsg = errMsg + " Repeat Occurrences not set";
                    errMsg = errMsg + '<p><strong>Occurrences:</strong> You may not schedule more than 31 Day events at one time.</p>';
                    $('#occurrencesLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
                }
            }
            if ($('#repeatType', iPage).val() == "Weeks") {
                if (parseInt($('#occurrenceSType', iPage).val()) > 52) {
                    //errMsg = errMsg + " Repeat Occurrences not set";
                    errMsg = errMsg + '<p><strong>Occurrences:</strong> You may not schedule more than 52 Week events at one time.</p>';
                    $('#occurrencesLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
                }
            }
            if ($('#repeatType', iPage).val().indexOf("Month") != -1) {
                if (parseInt($('#occurrenceSType', iPage).val()) > 12) {
                    //errMsg = errMsg + " Repeat Occurrences not set";
                    errMsg = errMsg + '<p><strong>Occurrences:</strong> You may not schedule more than 12 Month events at one time.</p>';
                    $('#occurrencesLI').removeClass('ui-btn-up-c').addClass('ui-body-e');
                }
            }

        }

        if ($('#recurEvent', iPage).val() == 'on') {
            //
            if (errMsg == "") {
                createRepeatDatesFromForm();
                //if($('#endDate').val() > 1st form date #endDate
                if (dateDiff($('#endDate').val(), stDate[1]) > 0) {
                    errMsg = '<p><strong>Overlapping Events:</strong> You may not schedule events that overlap</p>';
                }
            }
        }
    }

    if (errMsg != "") {
        $.mobile.loading('hide');

        showErrorPopup(errMsg);
        return false;
    }

    // Make sure that the recur interval is less than the event length
    // how.  If the nrxt event date is efore the end date of thepage disallow

    if (checkrecur == true) {
        if ($('#recurEvent', iPage).val() == 'on') {

            //how about a confirm
            var tres = confirm('Are you sure you want ' + $('#occurrenceSType', iPage).val() + ' occurences of this event??  Press OK to continue and Cancel to quit');
            if (tres == false) {
                $.mobile.loading('hide');
                return false;
            }
        }
    }
    return true;
}

/***************************************************************
This function supersedes the function on the web page

When user is entering a normal event, it falls through this function to submitForm2

If user is entering a NEW repeating event (Repeating toggle is ON and there are no preexisting valuse in Notes)
then we begin process of creating new events

If the user toggles OFF but there WAS a pre-existing repeating evetn series...  just fall through.

Last case - if the user is EDITING a pre-existing repeating event, we need to get eventIDs and such
 ****************************************************************/
function preSubmitForm() {
    var junk;
    //Go figure.  Server checks data instead of locally before submitting, so we have to avoid a server issue...
    if (checkForm(true) == false) {
        return;
    }

    // reset all LI's to normal color

    $('li[id$=LI]', iPage).removeClass('ui-body-e').addClass('ui-btn-up-c');

    //Check if calendar repeat toggle is set
    if ($('#recurEvent', iPage).val() == 'on') {
        //if (repeatSet() == false ) { return false};
        $.mobile.loading('hide');
        $.mobile.loading('show', {
            theme: 'a',
            text: 'saving multiple events.  Please be patient...',
            textonly: false
        });

        // if pre-existing event, we can get the event IDs
        // Build array of dates
        createRepeatDatesFromForm(); //includes date of this event
        if (preExistEvent == true) {
            // This and all future events will appear in eventArray
            //push first ID in

            setNoteCode();
            getEventIDs("keep"); //this is an Async process that must end with submitForm2 because nothing after his gets executed


        } else {
            eventArray.length = 0;
            // Set the Notes code on the form for repeating events
            //get these out, they were already loaded in formPost
            $('#startDate', iPage).text(stDate.shift()); // Shifts existing date back in
            $('#endDate', iPage).text(enDate.shift());
            setNoteCode();
            formPost = ''; //formPost was already serialized but we changed the note field.  Do it again
            formPost = $('#editEventForm', iPage).serialize();
            fixFormPost();
            submitForm2();
        }
    } else {

        submitForm2();
    }

}

/*
fixFormPost
the formpost variable contains form field data and it was set in web page javascript
Since the repeating event fields are unrecognozed by the server, we need to yank them out
This function removes them.
 */
function fixFormPost() {
    // Removes RecurEvent=off&RepeatType=Days&RepeatEveryType=&OccurrencesType
    formPost = formPost.replace(/&RecurEvent=[^&]*/, '');
    formPost = formPost.replace(/&RepeatType=[^&]*/, '');
    formPost = formPost.replace(/&RepeatEveryType=[^&]*/, '');
    formPost = formPost.replace(/&OccurrencesType=[^&]*/, '');
}

/*
postAdvancement
Called on last repeating event call to update advancement infro
 */
function postAdvancement() {
    var inst = $('#advancement').mobiscroll('getInst');
    var values = inst.getValues('advancement');
    if (values.length == 0 && preExistAdvance == false) {
        finalUpdate();
        return;
    }
    // send values to server
    var arrayLength = values.length;
    var formData = '';
    for (var i = 0; i < arrayLength; i++) {
        if (formData != '') {
            formData += "&";
        }
        formData += 'Advancement=' + escape(values[i]);
    }

    $.ajax({
        type: "POST",
        url: '/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=UpdateAdvancementLI',
        data: formData,
        success: function () {
            finalUpdate();
        }
    });

    //window.console &&console.log(formData);

}

/*
AdvancementSave
Saves advancement info from form  for all repeating events except the last
 */
function AdvancementSave() {
    var inst = $('#advancement').mobiscroll('getInst');
    var values = inst.getValues('advancement');
    if (values.length == 0 && preExistAdvance == false) {
        IntermediateSave();
        return;
    }
    // send values to server
    var arrayLength = values.length;
    var formData = '';
    for (var i = 0; i < arrayLength; i++) {
        if (formData != '') {
            formData += "&";
        }
        formData += 'Advancement=' + escape(values[i]);
    }

    //window.console &&console.log("Using standard XMLHttpRequest");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], AdvancementSave, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            IntermediateSave();
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=UpdateAdvancementLI';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);

    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], AdvancementSave, []);
    };
}

//this one on last repeating event
function postReminder() {
    var inst = $('#reminders').mobiscroll('getInst');
    var values = inst.getValues('reminders');
    if (values.length == 0 && preExistRemind == false) {
        postAdvancement();
        return;
    }
    // send values to server
    var arrayLength = values.length;
    var formData = '';
    for (var i = 0; i < arrayLength; i++) {
        if (formData != '') {
            formData += "&";
        }
        formData += 'Reminders=' + escape(values[i]);
    }
    //catch the response

    $.ajax({
        type: "POST",
        url: '/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=SaveReminders',
        data: formData,
        success: function () {
            postAdvancement();
        }
    });

    //window.console &&console.log(formData);

}

function ReminderSave() {
    var inst = $('#reminders').mobiscroll('getInst');
    var values = inst.getValues('reminders');
    if (values.length == 0 && preExistRemind == false) {
        AdvancementSave();
        return;
    }
    // send values to server
    var arrayLength = values.length;
    var formData = '';
    for (var i = 0; i < arrayLength; i++) {
        if (formData != '') {
            formData += "&";
        }
        formData += 'Reminders=' + escape(values[i]);
    }

    // Allow immediate sendnow for first event but clear it for any others
    if ($("#reminders option[value='0']").prop("selected") == true) {
        $('#remindersUL li').eq(1).remove(); // removes the visible list item for Now but mobiscroll list still has check in it
        $("#reminders option[value='0']").prop("selected", false); // this changes the element..
        $("#reminders option[value='0']").prop("outerHTML", "<option value='0'>send now</option>"); // this changes teh html
        delete inst._selectedValues["0"]; //removes the property from the popup
    }

    //window.console &&console.log("Using standard XMLHttpRequest");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], ReminderSave, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            AdvancementSave();

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=SaveReminders';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formData);

    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], ReminderSave, []);
    };
}

function recurErr() {
    stDate.length = 0; // kill the remaining dates
    eventArray.length = 0;
    alert('Halted, Error processing recurring events');

    $.mobile.changePage(
        '/mobile/dashboard/calendar/', {
        allowSamePageTransition: true,
        transition: 'none',
        showLoadMsg: true,
        reloadPage: true
    });
}
/*
submitForm2
// Always enter this with an iEventID

//If there are repeating event posts (multiple requests), we need to intercept intermediate responses and do not want the deaful
//browser handlers to update the DOM or this instance of script.  Therefore, we will
//use the datearray to indicate whether this is the final call.  If not the final, we will use
//an xmlhttprequest to isolate the responses in the function IntermediateSave


// https://host.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=590239&Action=SaveReminders
// New twist - reminders are saved/set independent of the event.  Weird, but somehow understandable...

Form Data
PageID:Page78448	// do we need a pageID  Hope not!  If we do, slows things down even more because we would have to retrieve an event page to get one
Reminders:0
Reminders:2


 */

function submitForm2() {

    if (stDate.length == 0) {

        //window.console &&console.log("Using standard .ajax");
        //alert('In submitForm. This is where formPost should be updated with new dates');

        postReminder();
        //postAdvancement();
        /*
        var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID;
        $.ajax({
        url: url,
        type: 'POST',
        data: formPost,
        dataType: 'xxscript',
        error: function (xhr, ajaxOptions, thrownError) {
        location.href = '/mobile/500.asp?Error=' + escape('url: ' + url + ' postData: ' + formPost + ' Status: ' + xhr.status + ' thrownError: ' + thrownError + ' responseText: ' + xhr.responseText.substring(0, 400));
        }
    ,
        complete: atEnd
        });
         */
    } else {

        ReminderSave();

    }
}

function finalUpdate() {
    var err = true;
    //remove repeat from formpost
    fixFormPost();
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID;
    $.ajax({
        url: url,
        type: 'POST',
        data: formPost,
        dataType: 'text',
        error: function (xhr, ajaxOptions, thrownError) {
            location.href = '/mobile/500.asp?Error=' + escape('url: ' + url + ' postData: ' + formPost + ' Status: ' + xhr.status + ' thrownError: ' + thrownError + ' responseText: ' + xhr.responseText.substring(0, 400));
        },
        complete: function (xhr) {
            var arglist = xhr.responseText.split(');');
            for (var i = 0; i < arglist.length; i++) {
                if (arglist[i].match(/'show'|Invitees/) != null) {
                    if (arglist[i].match(/Event saved/) != null) {

                        $.mobile.loading('show', {
                            theme: 'a',
                            html: '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/flaggreen72.png" style="width: 36px; vertical-align: -9px; margin-right: 5px; "> <span><strong>Event saved!</strong></span>',
                            textonly: true
                        });

                        var curl = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/event.asp?' + iEventID;
                        setTimeout(function () {
                            calChgPg(curl);
                        }, 1000);
                        setTimeout(function () {
                            $.mobile.loading('hide');
                        }, 1400);
                        err = false;
                        break;

                    } else {

                        // otherwise an error of some kind
                        //$.mobile.loading('show', { theme: 'a', text: 'An Error saving occurred...', textonly: false });
                        if (arglist[i].match(/Invitees:/) != null) {
                            $.mobile.loading('hide');
                            showErrorPopup('<p><strong>Invitees:</strong> Please invite at least two active leaders.</p>');
                            err = false; // show the error and resume
                            break;
                        } 
                    }
                } else if (arglist[i].match(/showErrorPopup/) != null) {
                             $.mobile.loading('hide');
                            var strong = "Error:";
                            if(/strong>.+<\/strong/.test(arglist[i])) {
                               strong= arglist[i].match(/strong>(.+)<\/strong/)[1];
                            }
                            var msg='Something went wrong';
                             if(/<\/strong>.+<\/p/.test(arglist[i])) {
                               msg= arglist[i].match(/<\/strong>(.+)<\/p/)[1];
                            }                           
                            
                            
                            
                            showErrorPopup('<p><strong>'+strong+'</strong> '+msg+'</p>');
                            err = false; // show the error and resume
                            break;                           
                            
                        }
                /*
                if(arglist[i].match(/'hide'/) != null) {
                setTimeout(function () {
                $.mobile.loading('hide');
                }, 1400);
                }


                if(arglist[i].match(/EventID=\d+/) != null) {
                debugger;
                var curl='/mobile/dashboard/calendar/event.asp?'+arglist[i].match(/EventID=\d+/)[0];
                setTimeout(function (curl) {
                $.mobile.changePage(curl, { reverse: true, showLoadMsg: true, transition: 'flip' });
                }, 1000);
                }
                 */
            }

            if (err == true) {
                $.mobile.loading('show', {
                    theme: 'a',
                    text: 'An Error saving occurred...',
                    textonly: false
                });
                var curl = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/event.asp?' + iEventID;
                setTimeout(function () {
                    calChgPg(curl);
                }, 1000);
                setTimeout(function () {
                    $.mobile.loading('hide');
                }, 1400);
            }

            atEnd();
        }
    });

    /*


    "$.mobile.loading('show', { theme: 'a', html: '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/flaggreen72.png" style="width: 36px; vertical-align: -9px; margin-right: 5px; "> <span><strong>Event saved!</strong></span>', textonly: true });
    setTimeout("$.mobile.changePage('/mobile/dashboard/calendar/event.asp?EventID=1882430', { reverse: true, showLoadMsg: true, transition: 'flip' })", 1000);
    setTimeout("$.mobile.loading('hide')", 1400);

    "$.mobile.loading('show', { theme: 'a', html: '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/flaggreen72.png" style="width: 36px; vertical-align: -9px; margin-right: 5px; "> <span><strong>Event saved!</strong></span>', textonly: true });setTimeout("$.mobile.changePage('/mobile/dashboard/calendar/event.asp?EventID=1910796', { reverse: true, showLoadMsg: true, transition: 'flip' })", 1000);setTimeout("$.mobile.loading('hide')", 1400);"

     */

}

function calChgPg(url) {
    $.mobile.changePage(
        url, {
        reverse: true,
        showLoadMsg: true,
        transition: 'flip'
    });

    /*				$.mobile.changePage(
    url,{
    allowSamePageTransition: true,
    transition: 'none',
    showLoadMsg: true,
    reloadPage: true
    }
    );

     */

}
/*****************************************************************************************
IntermediateSave
This function posts an event, using data in formPost

When the async response is received, it calls atEnd

The DOM is not updated

 *****************************************************************************************/

function IntermediateSave() {
    //window.console &&console.log("Using standard XMLHttpRequest");


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], IntermediateSave, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // event saved
            if (this.response.match(/Event saved/) != null) {
                atEnd();
                return;
            }

            if (this.response.match(/showErrorPopup/) != null) {
                $.mobile.loading('hide');
                var strong = "Error:";
                if(/strong>.+<\/strong/.test(this.response)) {
                   strong= this.response.match(/strong>(.+)<\/strong/)[1];
                }
                var msg='Something went wrong';
                 if(/<\/strong>.+<\/p/.test(this.response)) {
                   msg= this.response.match(/<\/strong>(.+)<\/p/)[1];
                }                           

                showErrorPopup('<p><strong>'+strong+'</strong> '+msg+'</p>');
            }
            stDate.length = 0; // kill the remaining dates
            eventArray.length = 0;
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], IntermediateSave, []);
    };
}

/*****************************************************************************************
getEventIDs(cb)
deprecated
This function gets all calendar events from server

compares retrieved dates to dates calculated from the server supplied start date using
the server supplied Notes string for repeating events

For each calculated date, it pushes the event ID into eventArray

NOTE:  If an intermediate event is missing it is possible that there could be a hole in the event IDs

When array filled, calls submitForm2

Many date formats are presented by SB on page. Need to handle all of them
//Date format Sep 29, 2017, 7pm -9pm
//            Jun 18, 2017 7am to Jun 24, 2017 3pm
//            Jun 19, 2017, 7pm - 8:30pm
//            Sep 29, 2017 to Oct 1, 2017
Today, 7pm - 8pm
// Calculated Dates will look like Sep 29, 2017 7:00 pm
 *****************************************************************************************/

/*
createRepeatDatesFromForm

Using dates and repeat field data, create date arrays for events in the series
update stDate and enDate arrays.  The results INCLUDE the initial start date
 */
function createRepeatDatesFromForm() {
    //'every Interval periods for Occurencess
    var StartDate = document.getElementById("startDate").value;
    var EndDate = document.getElementById("endDate").value;
    // Init Date Arrays
    stDate.length = 0;
    enDate.length = 0;

    var Period = $('#repeatType', iPage).val(); // every x days
    var Interval = $('#repeatEveryType', iPage).val(); //every 5 x
    var Occurrences = $('#occurrenceSType', iPage).val(); //for x days
    var nOccur = Number(Occurrences);
    var nInter = Number(Interval);
    var diff = dateDiff(EndDate, StartDate);

    var mtglen = diff / 1000 / 60; //difference in minutes

    if (Period == "Days") {

        var tempD;
        var sum;
        for (x = 0; x < nOccur; x++) {
            tempD = addDays(StartDate, x * Interval);
            stDate.push(sbDateFormat(tempD));
            enDate.push(sbDateFormat(addMinutes(tempD, mtglen))); // n is minutes
        }
    }

    if (Period == "Weeks") {
        for (x = 0; x < nOccur; x++) {
            tempD = addDays(StartDate, x * Interval * 7);
            stDate.push(sbDateFormat(tempD));
            enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
        }
    }

    if (Period == "MonthsOpt1" || Period == "MonthsOpt2" || Period == "MonthsOpt3") {
        for (x = 0; x < nOccur; x++) {

            //if based on day number
            if (Period == "MonthsOpt2") {
                tempD = addMonths(StartDate, x * Interval, false);
                if (tempD != '') {
                    stDate.push(sbDateFormat(tempD));
                    enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                }
            } else {
                if (Period == "MonthsOpt1") {
                    // we find the day of the week
                    tempD = get_sameWeekandDay(StartDate, addMonths(StartDate, x * Interval, true));
                    if (tempD != '') {
                        stDate.push(sbDateFormat(tempD));
                        enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                    }
                } else {
                    // from end of month MonthsOpt3
                    tempD = get_sameWeekandDayRev(StartDate, addMonths(StartDate, x * Interval, true));
                    if (tempD != '') {
                        stDate.push(sbDateFormat(tempD));
                        enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                    }
                }
            }
        }
    }
}

function createRepeatDatesFromRawForm(data,Period,Interval,Occurrences) {
    //'every Interval periods for Occurencess
    
    var StartDate = "";
    var EndDate = "";
    if(/"StartDate" id="startDate" value="[^"]+/.test(data)) {
        StartDate = data.match(/"StartDate" id="startDate" value="([^"]+)/)[1];
    }
    if(/"EndDate" id="endDate" value="[^"]+/.test(data)) {
        EndDate = data.match(/"EndDate" id="endDate" value="([^"]+)/)[1];
    }   
    // Init Date Arrays
    stDate.length = 0;
    enDate.length = 0;

   // var Period = $('#repeatType', iPage).val(); // every x days
   // var Interval = $('#repeatEveryType', iPage).val(); //every 5 x
   // var Occurrences = $('#occurrenceSType', iPage).val(); //for x days
    var nOccur = Number(Occurrences);
    var nInter = Number(Interval);
    var diff = dateDiff(EndDate, StartDate);

    var mtglen = diff / 1000 / 60; //difference in minutes

    if (Period == "Days") {

        var tempD;
        var sum;
        for (x = 0; x < nOccur; x++) {
            tempD = addDays(StartDate, x * Interval);
            stDate.push(sbDateFormat(tempD));
            enDate.push(sbDateFormat(addMinutes(tempD, mtglen))); // n is minutes
        }
    }

    if (Period == "Weeks") {
        for (x = 0; x < nOccur; x++) {
            tempD = addDays(StartDate, x * Interval * 7);
            stDate.push(sbDateFormat(tempD));
            enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
        }
    }

    if (Period == "MonthsOpt1" || Period == "MonthsOpt2" || Period == "MonthsOpt3") {
        for (x = 0; x < nOccur; x++) {

            //if based on day number
            if (Period == "MonthsOpt2") {
                tempD = addMonths(StartDate, x * Interval, false);
                if (tempD != '') {
                    stDate.push(sbDateFormat(tempD));
                    enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                }
            } else {
                if (Period == "MonthsOpt1") {
                    // we find the day of the week
                    tempD = get_sameWeekandDay(StartDate, addMonths(StartDate, x * Interval, true));
                    if (tempD != '') {
                        stDate.push(sbDateFormat(tempD));
                        enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                    }
                } else {
                    // from end of month MonthsOpt3
                    tempD = get_sameWeekandDayRev(StartDate, addMonths(StartDate, x * Interval, true));
                    if (tempD != '') {
                        stDate.push(sbDateFormat(tempD));
                        enDate.push(sbDateFormat(addMinutes(tempD, mtglen)));
                    }
                }
            }
        }
    }
}
/*
sbDateFormat

Given a date string, return a string that SB displays when selecting a calendar date

 */
function sbDateFormat(dtin) {
    var d = new Date(dtin);
    //Assumes 24 hour format
    var monA = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var yr = d.getFullYear();
    var mon = d.getMonth();
    var day = d.getDate();
    var hour = d.getHours(); // Returns the hour (from 0-23)
    var minutes = d.getMinutes(); // Returns the minutes (from 0-59)
    var result = hour;
    var ext = '';

    if (hour > 12) {
        ext = 'PM';
        hour = (hour - 12);

        if (hour < 10) {
            result = "0" + hour;
        }
    } else if (hour == 0) {
        hour = 12;
        ext = "AM";
    } else if (hour < 12) {
        result = ((hour < 10) ? "0" + hour : hour);
        ext = 'AM';
    } else if (hour == 12) {
        ext = 'PM';
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    //result was +result instead of +hour...
    result = monA[mon] + " " + day + ", " + yr + " " + hour + ":" + minutes + ' ' + ext;

    return result;
}

function sbTime(dtin) {
    var d = new Date(dtin);
    //Assumes 24 hour format

    var hour = d.getHours(); // Returns the hour (from 0-23)
    var minutes = d.getMinutes(); // Returns the minutes (from 0-59)
    var result = hour;
    var ext = '';

    if (hour > 12) {
        ext = 'PM';
        hour = (hour - 12);

        if (hour < 10) {
            result = "0" + hour;
        }
    } else if (hour == 0) {
        hour = 12;
        ext = "AM";
    } else if (hour < 12) {
        result = ((hour < 10) ? "0" + hour : hour);
        ext = 'AM';
    } else if (hour == 12) {
        ext = 'PM';
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    //result was +result instead of +hour...
    result = hour + ":" + minutes + ' ' + ext;

    return result;
}

/*
get_sameWeekandDay

Given a date (curdate)  return a date in the month defined in newdate
that happens on the same weekday and occurrence of that weekday in the month

e.g.  if the curdat is the 2nd tuesday, return the second tuesday date in the newdate month
 */
function get_sameWeekandDay(curdate, newdate) {

    var cd = new Date(curdate);
    var nd = getdayone(newdate);
    var nthwk = getnth(curdate);
    var mon = nd.getMonth() + 1;
    var yr = nd.getFullYear();
    var hr = cd.getHours();
    var min = cd.getMinutes();
    var DayofWeek = cd.getDay() + 1;

    var dr = new Date(yr, mon - 1, 8 - DayofWeek, hr, min, "0", "0");
    var wd = dr.getDay() + 1;

    var d = nthwk * 7 + 1 - wd;

    var newdt = new Date(yr, mon - 1, d, hr, min, "0", "0");
    if (newdt.getMonth() + 1 != mon) {
        //spillover
        return '';
    }
    return newdt + '';

}

//returns the 1st of the month
function getdayone(curdate) {
    var nd = new Date(curdate);
    var mon = nd.getMonth() + 1;
    var yr = nd.getFullYear();

    return new Date(yr, mon - 1, 1);

}
function get_sameWeekandDayRev(curdate, newdate) {
    var mlen = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "30", "31"];
    var cd = new Date(curdate);
    var nd = getdayone(newdate);
    var nthwk = getnthrev(curdate);
    var mon = nd.getMonth() + 1;
    var yr = nd.getFullYear();
    var hr = cd.getHours();
    var min = cd.getMinutes();
    var DayofWeek = cd.getDay() + 1;

    var ly = yr / 4;
    if (ly.toString().indexOf(".") == -1) {
        //Leap year
        mlen[1] = "29";
    }

    var lastdayofmonth = mlen[mon - 1];

    var dr = new Date(yr, mon - 1, lastdayofmonth, hr, min, "0", "0");
    var ldofmwd = dr.getDay() + 1; // day of week of th last day of teh month of the target date

    // number to be between 0 and 6
    var d;
    if (ldofmwd < DayofWeek) {
        d = lastdayofmonth - (nthwk - 1) * 7 - (8 - DayofWeek) - ldofmwd + 1;
    } else {
        var d = lastdayofmonth - (nthwk - 1) * 7 - (ldofmwd - DayofWeek);
    }

    // number of weeks from the 1st- day number+1
    // last day - number of weeks - dau +1
    //var d = lastday - nthwk -wd;


    var newdt = new Date(yr, mon - 1, d, hr, min, "0", "0");

    if (newdt.getMonth() + 1 != mon) {
        //spillover
        return '';
    }
    return newdt + '';
}

/*
getnth
returns the nth occurrence of the weekday specified by curdate in the given month from beginning of month
 */
function getnth(curdate) {

    var cd = new Date(curdate);
    var m = cd.getMonth();
    var y = cd.getFullYear();
    var d = cd.getDate();
    var h = cd.getHours();
    var min = cd.getMinutes();

    var monthday1 = new Date(y, m, "1", h, min, "0", "0");
    var day1ofmonth = monthday1.getDay() + 1;

    var DayofWeek = cd.getDay() + 1;

    var satofcurweek = d + 7 - DayofWeek;
    var satof1stweek = 8 - day1ofmonth;

    var physicalweek = (satofcurweek - satof1stweek) / 7 + 1;
    var res;
    if (DayofWeek < day1ofmonth) {
        res = physicalweek - 1;
    } else {
        res = physicalweek;
    }

    return res;
}

// get the week number of the month calculated in reverse!
function getnthrev(curdate) {

    var mlen = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "30", "31"];
    var cd = new Date(curdate);
    var m = cd.getMonth(); // Jan is 0
    var y = cd.getFullYear();
    var d = cd.getDate();
    var h = cd.getHours();
    var min = cd.getMinutes();

    var ly = y / 4;
    if (ly.toString().indexOf(".") == -1) {
        //Leap year
        mlen[1] = "29";
    }

    //
    var lastday = mlen[m];
    var monthdaylast = new Date(y, m, lastday, h, min, "0", "0"); //date format of the last day of the month for curdate        monthday1
    var daylastofmonth = monthdaylast.getDay() + 1; //the day of the week for the last day of the month           day1ofmonth

    var DayofWeek = cd.getDay() + 1; //The day of the week for curdate

    var sunofcurweek = d - DayofWeek + 1;
    var sunoflastweek = lastday - daylastofmonth + 1;

    var physicalweek = (sunoflastweek - sunofcurweek) / 7 + 1;
    var res;
    if (DayofWeek > daylastofmonth) {
        res = physicalweek - 1;
    } else {
        res = physicalweek;
    }

    return res;
}
/*
dateDiff   difference in ms between 2 dates

Factor in DST hour diff
 */
function dateDiff(date1, date2) {

    var stdt = new Date(date2);
    var endt = new Date(date1);
    var stOffst = stdt.getTimezoneOffset();
    var enOffst = endt.getTimezoneOffset();
    var minOffset = stOffst - enOffst;

    var dt = Date.parse(date1) - Date.parse(date2) + minOffset * 60 * 1000;
    return dt;

}

/*
addDays
return a new date based on given date and number of days to add to it\

DST is an issue here.  If the in and out dates straddle a DST date, need to manually adjust.


 */
function addDays(date, days) {
    var dt = new Date();
    var indt = new Date(date);
    var inOffst = indt.getTimezoneOffset();

    dt.setTime(Date.parse(date) + (days * 1000 * 60 * 60 * 24));

    var outOffst = dt.getTimezoneOffset();

    if (inOffst != outOffst) {
        // recalculate
        var minOffset = outOffst - inOffst;
        dt.setTime(Date.parse(date) + (days * 1000 * 60 * 60 * 24) + minOffset * 60 * 1000);
    }
    return dt;
}

/*
addMinutes
Adds specified number of minutes to the date/time supplied

 */
function addMinutes(date, minutes) {
    var dt = new Date();
    var indt = new Date(date);
    var inOffst = indt.getTimezoneOffset();

    dt.setTime(Date.parse(date) + (minutes * 1000 * 60));
    var outOffst = dt.getTimezoneOffset();

    if (inOffst != outOffst) {
        // recalculate
        var minOffset = outOffst - inOffst;
        dt.setTime(Date.parse(date) + (minutes * 1000 * 60) + minOffset * 60 * 1000);
    }

    return dt;
}

/*
addMonths
Adds specified number of months to the date/time supplied
// get the day, month, and yr
// add months to month
// if result > 12 then div res/12.
//    add int of that to yr
//    subtract int of that*12 from res/12
// add that back to days
 */
function addMonths(date, months, rev) {

    var mlen = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "30", "31"];
    var dt = new Date(date);
    var m = dt.getMonth(); //Jan = 0
    var y = dt.getFullYear();
    var cy = y;
    var d = dt.getDate();
    var h = dt.getHours();
    var min = dt.getMinutes();

    var msum = m + 1 + Number(months); //Add 1 - to get math to work out
    //alert(msum);
    if (msum > 12) {
        // split to months and years
        var mdiv = msum / 12;
        if (mdiv.toString().indexOf(".") == -1) {
            // the result will add years but no months
            y = y + mdiv - 1;
            // if Feb and d=29 and 1st yr was leap, adjust d down
        } else {

            y = y + parseInt(mdiv.toString().split('.')[0]);
            m = Math.round(12 * (mdiv - parseInt(mdiv.toString().split('.')[0])) - 1);
        }

        var ly = y / 4;
        if (ly.toString().indexOf(".") == -1) {
            //Leap year
            mlen[1] = "29";
        }

    } else {
        m = m + Number(months);
    }

    //adjust days
    // now, if day > max days in that month
    /*
    if (d > mlen[m+Number(months)]) {

    d = mlen[Number(months)];  //adjust day to end of month
    return null;
    }
     */

    if (d > mlen[m]) {

        d = mlen[m]; //adjust day to end of month
        if (rev == false) {
            return '';
        }
    }

    var newdt = new Date(y, m, d, h, min, "0", "0");

    return newdt + '';

}

/*
setNoteCode
Enters a code into the notes field on the form.
Code format is <Repeat:nn:type:nn:opt-nnnnn>


 */
function setNoteCode() {

    var interv = $('#repeatType', iPage).val();
    var iOpt = "";
    if (interv.indexOf('Month') != -1) {
        iOpt = interv.substr(6, 4);
        interv = "Months";
    }
    // If the note field has something else in it, leave it there
    var newCode = "<Repeat:" + escapeHTML($('#repeatEveryType').val()) + ":" + escapeHTML(interv) + ":" + escapeHTML($('#occurrenceSType').val()) + ":" + escapeHTML(iOpt) + "-" + initEventID.match(/\d+/) + ">";
    var newVal = newCode; // if nothing there
    var curFieldVal = $('#notes', iPage).val(); //.text();  don't know why .text() doesn't work anymore

    var strpat = /\<Repeat:(\d+):([a-zA-Z]+):(\d+):*(\w*)-*(\d*)/;
    var result = strpat.exec(curFieldVal);
    if (result == undefined) {
        // no code exists in field
        if (curFieldVal != '') {
            //append to it
            newVal = curFieldVal + "\n" + newCode;
        }
    } else {
        // code exists, replace it
        newVal = curFieldVal.replace(/\<Repeat:\d+:[a-zA-Z]+:\d+:*\w*-*\d*\>/, newCode);
    }

    $('#notes', iPage).val(newVal); //text(newVal);  don't know why text() doesn't work anymore...
    //window.console &&console.log('Set Notes ' + $('#notes',iPage).text());
    //window.console &&console.log('Set Notes ' + $('#notes',iPage).val());
}

/*
getNoteCode
Reads and parses the note field and poulates rptArray with codes
 */
function getNoteCode() {
    //var repeatCode = $('#notes',iPage).text();
    var repeatCode = $('#notes', iPage).val();

    var strpat = /\<Repeat:(\d+):([a-zA-Z]+):(\d+):*(\w*)-*(\d*)/;
    var result = strpat.exec(repeatCode);
    if (result == undefined) {
        rptArray.length = 0;
    } else {
        rptArray.length = 0;
        rptArray.push(result[1]); //number   RepeatEvery
        rptArray.push(result[2]); //days 		RepeatType
        rptArray.push(result[3]); //number of occurrences
        rptArray.push(result[4]); //opt
        rptArray.push(result[5]); // Unique ID - actually the event ID of the 1st instance
    }
}

/*
atEnd
This is normally a callback function when a post to the server has completed
If there are remaining dates in the date array, and nothing in the eventArray, continue with adding new events
If there are remaining dates in the date array, and remaining events in the eventArray, continue updating events
If there are no dates in the date array, and remaining events in the eventArray, start deleting the remaining events

 */
function atEnd() {

    iEventID = ''; // cannot re-use this event
    // If there are any dates in the Array left, we need a new EventID
    if (stDate.length > 0) {
        // Lets see if there are no mre eventIDs to use
        if (eventArray.length == 0) {
            // process any more dates as New Repeat Entries
            preExistEvent = false;
        }
        setTimeout(function () {
            NextEvent();
        }, 200);
    } else {
        //if there are eventIDs left, we need to delete them
        if (eventArray.length > 0) {
            iEventID = eventArray.shift();
            deleteNextEvent();
        } else {
            // If no dates are left,
            // enable all fields  $('#popupDeleteEvent').popup('close');

            $('#buttonCancel, #buttonSubmit', iPage).button('enable');
        }
    }

}

/*
NextEvent

If on entry, there is a flag set to indicate we are updating events , get the next event ID from the array and make a
call to post it with current form data (with dates updated)

If no flag, request a new ID from the server.  On the async response, make a call to post it with current form data (with dates updated)

 */
function NextEvent() {

    if (preExistEvent == false) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status != 200) {
                errStatusHandle(this.status, recurErr, [], NextEvent, []);
            }
            if (this.readyState == 4 && this.status == 200) {
                resetLogoutTimer(url);
                servErrCnt = 0;
                if (this.responseText.match(/(EventID=\d+)/) != null) {
                    iEventID = this.responseText.match(/(EventID=\d+)/)[0];
                }
                //alert("Next EventID=" + iEventID);

                $('#startDate', iPage).val(stDate.shift());
                $('#endDate', iPage).val(enDate.shift());

                $('#occurrenceSType').val($('#occurrenceSType').val() - 1);
                setNoteCode();

                // where is formpost getting updated?
                //alert(formPost);
                formPost = '';
                formPost = $('#editEventForm', iPage).serialize();
                fixFormPost();
                //alert("after clear and refill" + formPost);
                setTimeout(function () {
                    submitForm2();
                }, 200);
            }
        };
        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onerror = function () {
            errStatusHandle(500, recurErr, [], NextEvent, []);
        };
    } else {
        //don't need to get the next eventID in a server call, we already have it in the array
        iEventID = eventArray.shift();
        $('#startDate', iPage).val(stDate.shift());
        $('#endDate', iPage).val(enDate.shift());

        $('#occurrenceSType').val($('#occurrenceSType').val() - 1);
        setNoteCode();

        formPost = '';
        formPost = $('#editEventForm', iPage).serialize();
        fixFormPost();
        //alert("after clear and refill" + formPost);
        setTimeout(function () {
            submitForm2();
        }, 200);
    }
}

/*
deleteNextEvent
Post a delete event action to the server for the current event id.
 */
function deleteNextEvent() {
    var xhttp = new XMLHttpRequest();
    formPost = '';
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], deleteNextEvent, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // keep going un til none left

            atEnd();
        }
    };
    //"https://www.' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=" & EventID & "&Action=DeleteEvent&_=" & timeout() + 1, "https://www.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=" & EventID)
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID + "&Action=DeleteEvent";
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], deleteNextEvent, []);
    };
}

/*
predeleteEvent

THis function is executed instead of the one embedded on the page
If repeat toggle on form is on, it buidls a list of dates and events to delete

Otherwise, deletes normally
 */
function predeleteEvent() {
    formPost = '';
    if ($('#recurEvent', iPage).val() == 'on' && preExistEvent == true) {
        $.mobile.loading('hide');
        $.mobile.loading('show', {
            theme: 'a',
            text: 'deleting multiple events.  Please be patient...',
            textonly: false
        });
        createRepeatDatesFromForm(); //includes date of this event
        getEventIDs("delete"); //Async Call

    } else {
        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=DeleteEvent';
        formPost = '';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'text',

            error: function (xhr, ajaxOptions, thrownError) {
                location.href = '/mobile/500.asp?Error=' + escape('url: ' + url + ' postData: ' + formPost + ' Status: ' + xhr.status + ' thrownError: ' + thrownError + ' responseText: ' + xhr.responseText.substring(0, 400));
            },

            complete: function (xhr) {

                var arglist = xhr.responseText;

                if (arglist.match(/'show'/) != null) {
                    $.mobile.loading('show', {
                        theme: 'a',
                        html: '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/flaggreen72.png" style="width: 36px; vertical-align: -9px; margin-right: 5px; "> <span><strong>Event deleted!</strong></span>',
                        textonly: true
                    });
                }
                if (arglist.match(/changePage/) != null) {
                    setTimeout(function () {
                        $.mobile.changePage('/mobile/dashboard/calendar/', {
                            reverse: true,
                            showLoadMsg: true,
                            transition: 'flip'
                        });
                    }, 1400);
                }

            }

        });
    }
}
/*
"$.mobile.loading('show', { theme: 'a', html: '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/flaggreen72.png" style="width: 36px; vertical-align: -9px; margin-right: 5px; "> <span><strong>Event deleted!</strong></span>', textonly: true });
setTimeout("$.mobile.changePage('/mobile/dashboard/calendar/', { reverse: true, showLoadMsg: true, transition: 'flip' })", 1400);"

 */

/*
deleteListEvent

Sends server request to delete the current event ID.  On callback, sets current event id with
next id from event array

if not the last id, it calls itself

if it is the last id, it will call the original delete logic

 */
function deleteListEvent() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], deleteListEvent, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            // keep going un til none left

            iEventID = eventArray.shift();
            if (eventArray.length == 0) {
                preExistEvent = false;
                setTimeout(function () {
                    predeleteEvent();
                }, 200);
            } else {
                setTimeout(function () {
                    deleteListEvent();
                }, 200);
            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + iEventID + '&Action=DeleteEvent';
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], deleteListEvent, []);
    };
}

/*
matchdate

ugly little thing to match up all the potential SB date field formats with a given date

//dt2 Date format Sep 29, 2017, 7pm -9pm
//            Jun 18, 2017 7am to Jun 24, 2017 3pm
//            Jun 19, 2017, 7pm - 8:30pm
//            Sep 29, 2017 to Oct 1, 2017
//			  Today, 7pm
// dt Calculated Dates will look like Sep 29, 2017 7:00 pm
 */
function matchdate(dt, dt2) {

    if (dt2 == undefined) {
        return false;
    }
    if (dt2 == '') {
        return false;
    }

    //window.console &&console.log(dt + " ?? " + dt2);

    //dt2 will have a range in it, denoted by either a - or the word 'to'

    var dtt = dt2; //handles case of 0 meeting length
    if (dt2.indexOf("to") != -1) {
        dtt = dt2.substring(0, dt2.indexOf("to") - 1);
    }
    if (dt2.indexOf("-") != -1) {
        dtt = dt2.substring(0, dt2.indexOf("-") - 1);
    }

    // next, it is possible that the time is like 7pm but needs to be changed to 7:00pm
    // So, first see if it contains a :  although some might not even have a time....
    if (dtt == "Today") {
        dtt = "Today 12:00am";
    }
    if (dtt.indexOf(":") == -1) {
        // precede the am or pm with a ':00 '
        if (dtt.indexOf("am") != -1) {
            //concatenate on
            dtt = dtt.substring(0, dtt.indexOf("am")) + ":00 am";
        }
        if (dtt.indexOf("pm") != -1) {
            //concatenate on
            dtt = dtt.substring(0, dtt.indexOf("pm")) + ":00 pm";
        }

    } else {
        if (dtt.indexOf("am") != -1) {
            //concatenate on
            dtt = dtt.substring(0, dtt.indexOf("am")) + " am";
        }
        if (dtt.indexOf("pm") != -1) {
            //concatenate on
            dtt = dtt.substring(0, dtt.indexOf("pm")) + " pm";
        }

    }
    //replace today
    if (dtt.indexOf("Today") != -1) {
        //concatenate on
        var dtt1 = sbDateFormat(Date.now());
        //replace up to the comma
        dtt = dtt1.match(/\w+ \d+, \d+/) + " " + dtt.match(/\d+:\d+ \w+/);
    }
    if (Date.parse(dt) == Date.parse(dtt)) {

        //window.console &&console.log(dt + " == " + dtt);
        return true;
    }

    //window.console &&console.log(dt + " != " + dtt);
    return false;

}

function getmaxCalEvents(document) {

    var maxEvent = 0;
    for (var x = 0; x < document.scripts.length; x++) {
        //if (eventIndex >= 67)
        if (document.scripts[x].text.match(/if \(eventIndex >= (\d+)/) != null) {
            maxEvent = document.scripts[x].text.match(/if \(eventIndex >= (\d+)/)[1];
            return maxEvent;
        }
    }
    return maxEvent;
}

/*
getEventIDs(cb)
This function gets all calendar events from server
populates a global links array with potential links to calendar events
then calls processLinks to look for events of interest

Dec 2, 2017 7pm to Dec 3, 2017 8:30pm

 */

function getEventIDs(cb) {
    // This function is called t retrieve event list.  Matches each stDateFromArchive to find associated EventID
    var eventName;
    var lnkobj = {
        id: '',
        date: ''
    };

    //push this if older than now


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], getEventIDs, [cb]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //populate eventArray
            var maxEvent = getmaxCalEvents(this.response);
            var lnk = this.responseXML.getElementsByTagName('a');

            var i;
            for (i = 0; i < lnk.length; i++) {
                hrf = lnk[i].href.match(/EventID=\d+/);

                if (hrf != null) {

                    lnkobj.id = hrf[0];
                    lnkobj.date = lnk[i].getElementsByClassName('tinyText')[0].innerText;

                    //links.push(lnkobj);		6/15/2017
                    links.push(JSON.parse(JSON.stringify(lnkobj)));
                }
            }

            if (maxEvent > 24) {
                getMoreEvents(25, maxEvent, cb);
            } else {
                allEventsCaptured(cb);
            }

            // there may be more links to get.

            /*	moved to allEventsCaptured
            var found=false;
            for(i=0;i<links.length;i++){
            found=true;
            if (links[0].id == lnkobj.id) {
            break;
            }
            }
            if (found==false) {
            links.push(JSON.parse(JSON.stringify(lnkobj)));
            }

            // check for current id in this list
            processLinks(cb);

             */
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], getEventIDs, [cb]); ;
    };

}

function getMoreEvents(start, maxEvent, cb) {
    var eventName;
    var lnkobj = {
        id: '',
        date: ''
    };

    //push this if older than now


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], getMoreEvents, [start, maxEvent, cb]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //populate eventArray

            var lnk = this.responseXML.getElementsByTagName('a');

            var i;
            for (i = 0; i < lnk.length; i++) {
                hrf = lnk[i].href.match(/EventID=\d+/);

                if (hrf != null) {

                    lnkobj.id = hrf[0];
                    lnkobj.date = lnk[i].getElementsByClassName('tinyText')[0].innerText;

                    //links.push(lnkobj);		6/15/2017
                    links.push(JSON.parse(JSON.stringify(lnkobj)));
                }
            }
            //Get the current page data as it could be in the past


            if (maxEvent > start + 24) {
                start += 25;
                getMoreEvents(start, maxEvent, cb);
            } else {
                allEventsCaptured(cb);
            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=SeeMoreEvents&EventIndex=' + start;

    xhttp.open("POST", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], getMoreEvents, [start, maxEvent, cb]); ;
    };
}

function allEventsCaptured(cb) {
    var lnkobj = {
        id: '',
        date: ''
    };
    //Get the current page data as it could be in the past
    lnkobj.id = document.baseURI.match(/EventID=\d+/);
    lnkobj.date = $('#startDate').val();

    var found = false;
    for (i = 0; i < links.length; i++) {
        found = true;
        if (links[0].id == lnkobj.id) {
            break;
        }
    }
    if (found == false) {
        links.push(JSON.parse(JSON.stringify(lnkobj)));
    }

    // check for current id in this list
    processLinks(cb);
}

/*
processLinks
This function retrieves a link from the global links array
If it is found to be a link to an event, it compares the date of that
event to the dates in the stDateFromArchive array for a match.
If a match is found, it will call getNoteIDfromEvent for further verification

If no links are left on the global links array, it sets up to begin
updating or deleting events based on cb


 */
function processLinks(cb) {

    // enter function with links array of  a elements

    var numDel = 0;
    var occur = Number($('#occurrenceSType', iPage).val());
    hrflist.length = 0;

    if (links.length != 0) {
        var curLink = links.shift();

        //window.console &&console.log(curLink.href);

        var hrf = curLink.id;
        var cdt = curLink.date;
        if (hrf != null) {
            //		window.console &&console.log(hrf[0]);		//Event ID in format EventID=12344
            //		window.console &&console.log("<" + $.trim(curLink.children[1].textContent.match(/[^\n]+/)) + ">");  //Name
            //eventName=$.trim(curLink.children[1].textContent.match(/[^\n]+/));
            numDel = 0;
            stDateFromArchive.forEach(function (dt) {
                // On a delete command,
                // we only want to delete the number of events specified.

                if (numDel < occur || cb != "delete") {
                    if (matchdate(dt, cdt) == true) {

                        // we have a possible match, lets get the event to find out...   Need to edit the event to get data
                        // TODO  create function to edit event with this ID
                        // CB for that function is to compare its note field with contents of rptArray[4]  44 day 55 opt1 a1233
                        // if match then eventArray.push(hrf[0]);
                        // then call processLinks again
                        //eventArray.push(hrf[0]);

                        hrflist.push(hrf);

                    }
                }
                numDel++;
            });

            if (hrflist.length != 0) {
                getNoteIDfromEvent(cb); //async call  problem her is that next time thru processlinks things get funky
                return; // this linear logic done
            }

            // setTimeout(function(){ processLinks(cb); }, 200);
        } else {
            // get next link, this one isn't the right type
            // setTimeout(function(){ processLinks(cb); }, 200);
        }
        setTimeout(function () {
            processLinks(cb);
        }, 200);
    } else {

        //window.console &&console.log("Number of events to be processed based on length of eventArray " + eventArray.length);

        if (eventArray.length == 0) {
            //window.console &&console.log("Program error - 0 IDs match");
            // need to halt exec ans stop process
            $('#popupDeleteEvent', iPage).popup('close');
            $('#buttonDeleteEventConfirm, #buttonDeleteEventCancel', iPage).removeClass('ui-disabled');
            $.mobile.loading('hide');
            stDate.length = 0; // kill the remaining dates
            atEnd();
            return;
        }

        if (cb == "keep") {
            // these events to be updated
            $('#startDate', iPage).text(stDate.shift()); // Shifts existing date back in
            $('#endDate', iPage).text(enDate.shift());
            junk = eventArray.shift();
            //setNoteCode();
            formPost = ''; //formPost was already serialized but we changed the note field.  Do it again
            formPost = $('#editEventForm', iPage).serialize();
            fixFormPost();
            setTimeout(function () {
                submitForm2();
            }, 200);
        } else {
            // these events to be deleted
            iEventID = eventArray.shift();
            if (eventArray.length == 0) {
                //only one event to delete
                preExistEvent = false;
                setTimeout(function () {
                    predeleteEvent();
                }, 200);
            } else {
                setTimeout(function () {
                    deleteListEvent();
                }, 200);
            }
        }
    }
}

/*
getNoteIDfromEvent
function retrieves an editevent page for the given eventid

When the response is received, compares  note field with contents of rptArray[4]
it looks for a match in the unique ID...

if match then save the id of the current event into eventArray


When done, call processLinks
 */
function getNoteIDfromEvent(cb) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, recurErr, [], getNoteIDfromEvent, [cb]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var thiseventid = this.responseText.match(/(EventID=\d+)/)[0];
            //alert("REMOVE THIS " + eventid + " ==? " + thiseventid);
            //var repeatCode = rdoc.getElementById('notes').value;
            //>&lt;Repeat:1:Weeks:7:-590025&gt;</textarea>

            //var strpat = /\<Repeat:([\d]+):([a-zA-Z]+):([\d]+):*(\w*)-*[\d]*/;
            var strpat = /\&lt;Repeat:(\d+):([a-zA-Z]+):(\d+):*(\w*)-*(\d*)/;
            var result = strpat.exec(this.responseText);
            if (result == undefined) {
                //No match on this event, get another
                //setTimeout('processLinks()',200);
                //window.console &&console.log("this event doesn't have a noteCode " + eventid);
            } else {

                if (result[5] == rptArray[4]) {
                    // we have a matchevent
                    // 8/31/17 eventArray.push(thiseventid);
                    pushUnique(eventArray, thiseventid);
                    //window.console &&console.log("this event noteCode matches " + eventid);
                    //setTimeout('processLinks()',200);
                } else {
                    //window.console &&console.log("this event noteCode ID doesn't match " + eventid + " " + result[5]+ "<>" + rptArray[4]);
                }
            }

            if (hrflist.length == 0) {
                setTimeout(function () {
                    processLinks(cb);
                }, 200);
                // setTimeout('processLinks()',200);		// get the next one
            } else {
                setTimeout(function () {
                    getNoteIDfromEvent(cb);
                }, 200); // call myself because I have at least 2 events ont he same date to look at
            }
        }
    };

    eventid = hrflist.shift();
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + eventid;
    xhttp.open("GET", url, true);
    //xhttp.responseType="document";
    xhttp.send();
    xhttp.onerror = function () {
        errStatusHandle(500, recurErr, [], getNoteIDfromEvent, [cb]); ;
    };
}