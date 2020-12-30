

/*
This timeout is necessary to ensure that extension code has modified the __visible current__ page view after a hard reload.
*/

setTimeout(function () {

    //only change the page if it is not in the signup process || display of login process
    if (document.URL.indexOf('/mobile/signup') == -1 && window.location.search.substring(1).indexOf("ShowLogin=1") === -1) {
        //Only "change" the page if Feature Assistant is not already on the page view
        if (/scoutbook\.com\/mobile\/.+/.test(document.URL)) {

            var thisPage = document.URL;
            if( $('#FeatureAssistant').length == 0) {
                console.log('Modifying current page view for Feature Assistant');

                // lock everything until refresh completes
                $('a','#'+$('div[data-role="page"]').attr('id')).bind("click.myDisable", function() {
                        return false;
                });
                $('input','#'+$('div[data-role="page"]').attr('id')).prop("disabled", true);
 
                $.mobile.loading('show', {
                    theme: 'a',
                    text: 'loading extension...',
                    textonly: false
                });
                var pre = document.URL.match(/(http.+)scoutbook\.com/)[1];

                // Discovered that reloading the "same" page can cause animation issues and CSS issues. It is avoided by loading another page first
                $.mobile.changePage(
                    pre+'scoutbook.com/mobile/', {
                        allowSamePageTransition: false,
                        transition: 'none',
                        showLoadMsg: false,
                        reloadPage: false
                    }
                );

                $(document).one("pageshow", function(e, t) {
                    $('div[data-role="page"]').hide();
                });
                changepageurl(thisPage);


            }

        }
    }
}, 100);

/*
future reliability enhancements for server or network errors

add globals
var servErrCnt=0;
var maxErr=5;

in functions using xhttp calls

			if (this.readyState == 4 && this.status == 200) {
				servErrCnt=0;

			if (this.readyState == 4 && this.status != 200 && this.status == 500) 
				 console.log('Server Error ' +servErrCnt);
				 if (servErrCnt > maxErr) {
					 $.mobile.loading('hide');
					alert('Halted due to excessive Server errors');
					return;
				 }
				 servErrCnt++;
				
				setTimeout(function() {*currentFunction*(*current args*);},1000);	//reset 

*/

/*
  ajaxSetup
  Scoutbook pages have dynamic content.  
  Listen for ajax events and inject code only on specific pages
  When I say inject code here - as there are many types of inject - I mean get into the raw 
  message so the SB dynamic rendering is done just once
   i.e. when the proper url is detected
*/
/*********************COMMON CODE***************
This defines storage location for function names to be executed 
in the AjaxSetup dataFilter.  Essentially, it is acting as though we are
binding functions to an Ajax event

Each extension shall contain this code.

The first extension loaded contains the master.
Unloading a function may disable all extensions 

***********************************************/


if (typeof Funclist == 'undefined') {
    var Funclist = function () {
        var _funcDefs = [];
        Object.defineProperties(this, {
            "funcDefs": {
                get: function () {
                    return _funcDefs.concat();
                }
            },
            "addFuncDef": {
                value: function (funcDef) {
                    _funcDefs.push(funcDef);
                }
            }
        });
    };

    var bindToFilter = new Funclist();
    asetup(bindToFilter, 0);

}

bindToFilter.addFuncDef(faFilter);