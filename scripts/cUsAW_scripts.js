
var cUsAW_myjq = jQuery.noConflict();

cUsAW_myjq(window).error(function(e){
    e.preventDefault();
});

cUsAW_myjq(document).ready(function($) {

    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o ) ) ) {
            return false;
        } else {
            return true;
        }
    }
    
    try{
        cUsAW_myjq( "#cUs_tabs" ).tabs({active: false});
        cUsAW_myjq( "#cUs_exampletabs" ).tabs({active: false});

        cUsAW_myjq( '.options' ).buttonset();
        cUsAW_myjq( '#inlineradio' ).buttonset();

        cUsAW_myjq( "#terminology" ).accordion({
            collapsible: true,
            heightStyle: "content",
            active: false,
            icons: { "header": "ui-icon-info", "activeHeader": "ui-icon-arrowreturnthick-1-n" }
        });
        
        cUsAW_myjq( "#form_examples, #tab_examples" ).accordion({
            collapsible: true,
            heightStyle: "content",
            icons: { "header": "ui-icon-info", "activeHeader": "ui-icon-arrowreturnthick-1-n" }
        });
       
    }catch(err){
        cUsAW_myjq('.advice_notice').html('Oops, something wrong happened, please try again later!').slideToggle().delay(1200).fadeOut(1200);
    }
    
    
    try{
        //cUsAW_myjq( '.examples_gallery, .ui-state-default, .page_title' ).tooltip({
           //track: true
        //});
        cUsAW_myjq("#selectable").selectable({
            selected: function(event, ui) { 
                cUsAW_myjq(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected");           
            }                   
        });
        
    }catch(err){
        console.log('Please upadate you WP version. ['+ err +']');
    }
    
    
    //SEND API KEY AJAX CALL /////// STEP 1
    try{ 
       cUsAW_myjq('.cUsAW_sendapikey').click(function() {
           
           var mcApiKey = cUsAW_myjq('#apikey').val();
           var postData = {};
           cUsAW_myjq('.advice_notice').hide();
           
           if(!mcApiKey.length){
               cUsAW_myjq('.advice_notice').html('Aweber Auth. Code is a required field!').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#apikey').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();

           }else{
               
                cUsAW_myjq('.cUsAW_sendapikey').val('Loading . . .').attr({disabled:'disabled'});
                cUsAW_myjq('.loadingMessage').show();
                
                postData = {action: 'cUsAW_checkApikey', apikey:mcApiKey};
//                if( cUsAW_myjq('.user-data').is(':visible') ){
//                    postData = {action: 'cUsAW_checkApikey', apikey:mcApiKey,fName:str_clean(awFname),lName:str_clean(awLname)};
//                }
                
                
                cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: postData,
                    success: function(data) {

                        switch(data){
                            case '1':
                                
                                message = 'You are already logged into you AWeber account, please continue with next steps.';
                                cUsAW_myjq('.cUsAW_sendapikey').val('Connected . . .');
                                setTimeout(function(){
                                    cUsAW_getlist();
                                },2000)
                                
                            break;
                            default:
                                message = 'There something wrong with your AWeber account: {'+data +'}, please try again!';
                                cUsAW_myjq('.advice_notice').html(message).show().delay(1900).fadeOut(800);
                                cUsAW_myjq('.cUsAW_sendapikey').val('Continue to Step 2').removeAttr('disabled');
                            break;;
                        }
                        
                        cUsAW_myjq('.loadingMessage').fadeOut();

                    },
                    async: false
                });
           }
           
            
       });
       
       function str_clean(str){
           
           str = str.replace("'" , " ");
           str = str.replace("," , "");
           str = str.replace("\"" , "");
           str = str.replace("/" , "");
           
           return str;
       }
       
       function cUsAW_getlist(){
           
           cUsAW_myjq('.loadingMessage').show();
           cUsAW_myjq('.cUsAW_sendapikey').val('Loading Lists. . .').attr({disabled:'disabled'});
           cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: {action:'cUsAW_getList'},
                success: function(data) {
                    switch(data){
                        case '1':
                            message = "Seems like you don't have Contact List in you AWeber Account, please add at least one <a href='https://www.aweber.com/users/autoresponder/manage' target='_blank'>here</a> to continue.";
                            cUsAW_myjq('.advice_notice').html(message).slideToggle();
                            
                            cUsAW_myjq('.cUsAW_sendapikey').val('Reloading . . .');
                            
                            setTimeout(function(){
                                //location.reload();
                                cUsAW_myjq('.cUsAW_sendapikey').val('Continue to Step 2').removeAttr('disabled');
                            },3000)
                            
                        break;
                        case '2':
                            message = 'There something wrong with your AWeber Account, please try again!';
                            cUsAW_myjq('.advice_notice').html(message).slideToggle().delay(1800).fadeOut(600);
                        break;
                        default:
                            cUsAW_myjq('#listid').html(data);
                            cUsAW_myjq('.step1').slideUp().fadeOut();
                            cUsAW_myjq('.step2').slideDown().delay(800);
                        break;
                    }
                    cUsAW_myjq('.loadingMessage').fadeOut();

                },
                async: false
            });
       }
       
    }catch(err){
        cUsAW_myjq('.advice_notice').html('Oops, something wrong happened, please try again later!').slideToggle().delay(1200).fadeOut(1200);
    }
    
    
    //SENT LIST ID AJAX CALL /// STEP 2
    try{
        cUsAW_myjq('.cUsAW_Sendlistid').click(function() {
           
           var awFname = cUsAW_myjq('#cUsAW_first_name').val();
           var awLname = cUsAW_myjq('#cUsAW_last_name').val();
           var awEmail = cUsAW_myjq('#cUsAW_email').val();
           var awEmailValid = checkRegexp( awEmail, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. sergio@jquery.com" );  
           var awWebsite = cUsAW_myjq('#cUsAW_web').val();
           var awListID = cUsAW_myjq('#listid').val();
           var awListName = cUsAW_myjq('#listid option:selected').text();
           
           cUsAW_myjq('.loadingMessage').show();
           
           if( cUsAW_myjq('.user-data').is(':visible') && !awFname.length){
               cUsAW_myjq('.advice_notice').html('Your First Name is a required field').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#cUsAW_first_name').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();
           }else if( cUsAW_myjq('.user-data').is(':visible') && !awLname.length){
               cUsAW_myjq('.advice_notice').html('Your Last Name is a required field').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#cUsAW_last_name').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();
           }else if(!awEmail.length){
               cUsAW_myjq('.advice_notice').html('AWeber Email is a required field!').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#cUsAW_email').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();
           }else if(!awEmailValid){
                cUsAW_myjq('.advice_notice').html('Please enter a valid Email!').slideToggle().delay(1200).fadeOut(1200);
                cUsAW_myjq('#cUsAW_email').focus();
                cUsAW_myjq('.loadingMessage').fadeOut();
           }else if(!awWebsite.length){
               cUsAW_myjq('.advice_notice').html('Your Website is a required field').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#cUsAW_web').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();
           }else{
                
                cUsAW_myjq('.cUsAW_Sendlistid').val('Loading . . .').attr({disabled:'disabled'});
                
                postData = {action: 'cUsAW_sendClientList', fName:str_clean(awFname),lName:str_clean(awLname),listID:awListID,awListName:awListName,Email:awEmail,website:awWebsite}
                
                cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: postData,
                    success: function(data) {

                        switch(data){
                            case '1':
                                message = '<p>Welcome to ContactUs.com, and thank you for your registration.</p>';
                                message += '<p>We have sent a verification email.</b>.<br/>Please find the email, and login to your new ContactUs.com account.</p>';
                                cUsAW_myjq('.cUsAW_Sendlistid').val('Connected . . .');
                                setTimeout(function(){
                                    cUsAW_myjq('.step3').slideUp().fadeOut();
                                    location.reload();
                                },2000)
                            break;
                            case '2':
                                message = 'Seems like you already have one Contactus.com Account, Please Login below!';
                                setTimeout(function(){
                                    cUsAW_myjq('.step2').slideUp().fadeOut();
                                    cUsAW_myjq('.step3').slideDown().delay(800);
                                },2000)
                            break;  
                            default:
                                message = '<p>Ouch! unfortunately there has being an error during the application: <b>' + data + '</b>. Please try again!</a></p>';
                                cUsAW_myjq('.cUsAW_Sendlistid').val('Continue to Step 3').removeAttr('disabled');
                            break;
                        }
                        
                        cUsAW_myjq('.loadingMessage').fadeOut();
                        cUsAW_myjq('.advice_notice').html(message).show().delay(1900).fadeOut(800);

                    },
                    async: false
                });
           }
           
            
        });
    }catch(err){
        cUsAW_myjq('.advice_notice').html('Oops, something wrong happened, please try again later!').slideToggle().delay(1200).fadeOut(1200);
    }
    
    
    cUsAW_myjq('.cUsAW_LoginUser').click(function(){//LOGIN ALREADY USERS
        var email = cUsAW_myjq('#login_email').val();
        var pass = cUsAW_myjq('#user_pass').val();
        cUsAW_myjq('.loadingMessage').show();
        
        if(!email.length){
            cUsAW_myjq('.advice_notice').html('User Email is a required and valid field!').slideToggle().delay(1200).fadeOut(1200);
            cUsAW_myjq('#login_email').focus();
            cUsAW_myjq('.loadingMessage').fadeOut();
        }else if(!pass.length){
            cUsAW_myjq('.advice_notice').html('User password is a required field!').slideToggle().delay(1200).fadeOut(1200);
            cUsAW_myjq('#user_pass').focus();
            cUsAW_myjq('.loadingMessage').fadeOut();
        }else{
            var bValid = checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. sergio@jquery.com" );  
            if(!bValid){
                cUsAW_myjq('.advice_notice').html('Please enter a valid User Email!').slideToggle().delay(1200).fadeOut(1200);
                cUsAW_myjq('.loadingMessage').fadeOut();
            }else{
                cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: {action:'cUsAW_loginAlreadyUser',email:email,pass:pass},
                    success: function(data) {

                        switch(data){
                            case '1':
                                message = '<p>Welcome to ContactUs.com, and thank you for your registration.</p>';
                                //message += '<p>First we’ll need to activate your account. We have sent a verification email to <b>' + email + '</b>.<br/>Please find the email, and click on the activation link in the email.  Then, come back to this page.</p>';
                                
                                setTimeout(function(){
                                    cUsAW_myjq('.step3').slideUp().fadeOut();
                                    //cUsAW_myjq('.mainWindow').slideDown().delay(800);
                                    location.reload();
                                },2000)
                                
                            break;
                            default:
                                message = '<p>Ouch! unfortunately there has being an error during the application: <b>' + data + '</b>. Please try again!</a></p>';
                                break;
                        }
                        
                        cUsAW_myjq('.loadingMessage').fadeOut();
                        cUsAW_myjq('.advice_notice').html(message).show();

                    },
                    async: false
                });
            }
        }
    });
    
    cUsAW_myjq('.cUsAW_LogoutUser').click(function(){
        if(confirm('Are you sure you want to quit?')){
            cUsAW_myjq('.loadingMessage').show();
            cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: {action:'cUsAW_logoutUser'},
                success: function(data) {
                    cUsAW_myjq('.loadingMessage').fadeOut();
                      location.reload();
                },
                async: false
            });
        }
    });
    
    
    try{ cUsAW_myjq('.sendtemplate').click(function() {
           
           var mcApiKey = cUsAW_myjq('#apikey').val();
           var mcTemplateID = cUsAW_myjq('#templateid').val();
           cUsAW_myjq('.loadingMessage').show();
           
           if(!mcApiKey.length){
               cUsAW_myjq('.advice_notice').html('AWeber API Key is a required field!').slideToggle().delay(1200).fadeOut(1200);
               cUsAW_myjq('#apikey').focus();
               cUsAW_myjq('.loadingMessage').fadeOut();
           }else{
                
                cUsAW_myjq.ajax({ type: "POST", url: ajax_object.ajax_url, data: {action:'sendTemplateID',templateID:mcTemplateID},
                    success: function(data) {

                        switch(data){
                            case '1':
                                message = 'Template saved succesfuly . . . .';
                                
                                setTimeout(function(){
                                    cUsAW_myjq('.step3').slideUp().fadeOut();
                                    cUsAW_myjq('.step4').slideDown().delay(800);
                                },2000)
                                
                            break;
                        }
                        
                        cUsAW_myjq('.loadingMessage').fadeOut();
                        cUsAW_myjq('.advice_notice').html(message).show().delay(1900).fadeOut(800);

                    },
                    async: false
                });
           }
           
            
        });
    }catch(err){
        cUsAW_myjq('.advice_notice').html('Oops, something wrong happened, please try again later!').slideToggle().delay(1200).fadeOut(1200);
    }
    
    
    cUsAW_myjq('.form_version').change(function(){
        var val = cUsAW_myjq(this).val();
        cUsAW_myjq('.cus_versionform').fadeOut();
        cUsAW_myjq('.' + val).slideToggle();
    });
    
    cUsAW_myjq('#contactus_settings_page').change(function(){
        cUsAW_myjq('.show_preview').fadeOut();
        cUsAW_myjq('.save_page').fadeOut( "highlight" ).fadeIn().val('>> Save your settings');
    });
    
    cUsAW_myjq('.callout-button').click(function() {
        cUsAW_myjq('.getting_wpr').slideToggle('slow');
    });
    
    cUsAW_myjq('#mc_yes').click(function() {
        cUsAW_myjq('#cUsAW_mcsettings').slideToggle('slow');
    });
    
    
});
