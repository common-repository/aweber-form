<?php

// checkMCapikey handler function...
add_action('wp_ajax_cUsAW_checkApikey', 'cUsAW_checkApikey_callback');
function cUsAW_checkApikey_callback() {
    
    $oauth_id = $_REQUEST[apikey];
    
    $error_code = "";
    try {
        list($consumer_key, $consumer_secret, $access_key, $access_secret) = AWeberAPI::getDataFromAweberID($oauth_id);

        $cUsAW_AWeberAPI = new AWeberAPI($consumer_key, $consumer_secret);
        $cUsAW_UserAccount = $cUsAW_AWeberAPI->getAccount($access_key, $access_secret);
        
        if (!$cUsAW_UserAccount) {
            echo 2; //INVALID USER DATA
        } else {
            echo 1; //VALID USER DATA
            $cUsAW_lists = $cUsAW_UserAccount->lists;
            //$cUsAW_user = $cUsAW_AWeberAPI->user;
            $cUsAW_userData = array(
                'consumer_key' => $consumer_key,
                'consumer_secret' => $consumer_secret,
                'access_key' => $access_key,
                'access_secret' => $access_secret
            );
            
            update_option('cUsAW_settings_lists', $cUsAW_lists);
            update_option('cUsAW_settings_userData', $cUsAW_userData);
        }
        
        
    } catch (AWeberAPIException $exc) {
        list($consumer_key, $consumer_secret, $access_key, $access_secret) = null;
        $error_code = $exc->description;
        $error_code = preg_replace('/http.*$/i', '', $error_code);
        $error_code = preg_replace('/[\.\!:]+.*$/i', '', $error_code);
        
        echo $error_code;
    }
        
    die();
}

// getMCList handler function...
add_action('wp_ajax_cUsAW_getList', 'cUsAW_getList_callback');
function cUsAW_getList_callback() {
    
    $cUsAW_lists    = get_option('cUsAW_settings_lists'); //get the saved user LIST MATRIX
    $cUsAW_lists    = $cUsAW_lists->data; //get the saved user LIST MATRIX
    $cUsAW_lists    = $cUsAW_lists[entries]; //get the saved user LIST MATRIX
    $userData       = get_option('cUsAW_settings_userData'); //get the saved user data
    
    if($userData):
        
        if ( is_array($cUsAW_lists) && !empty($cUsAW_lists) ) :
            foreach($cUsAW_lists as $key => $list) {?>
                <option value="<?php echo $list['id'];?>"><?php echo $list['name'];?></option><?php
            }
        else:
            echo 1; //empty matrix list
        endif;

    else:    
        echo 2; // no user data
    endif;
    
    die();
}

// sendClientList handler function...
add_action('wp_ajax_cUsAW_sendClientList', 'cUsAW_sendClientList_callback');
function cUsAW_sendClientList_callback() {
    
    $cUsAW_userData = get_option('cUsAW_settings_userData'); //get the saved mailchimp user data
    $cUsAW_api = new cUsComAPI_AW(); //CONTACTUS.COM API
    
    if      ( !strlen($_REQUEST[fName]) ):      echo 'Missing First Name';      die();
    elseif  ( !strlen($_REQUEST[lName]) ):      echo 'Missing Last Name';       die();
    elseif  ( !strlen($_REQUEST[Email]) ):      echo 'Missing/Invalid Email';   die();
    elseif  ( !strlen($_REQUEST[website]) ):    echo 'Missing Website';         die();
    else:
        
        $postData = array(
            'fname' => $_REQUEST[fName],
            'lname' => $_REQUEST[lName],
            'email' => $_REQUEST[Email],
            'consumer_key' => $cUsAW_userData[consumer_key],
            'consumer_secret' => $cUsAW_userData[consumer_secret],
            'access_key' => $cUsAW_userData[access_key],
            'access_secret' => $cUsAW_userData[access_secret],
            'website' => $_REQUEST[website],
            'listID' => $_REQUEST['listID'],
            'awListName' => $_REQUEST['awListName']
        );
        
        update_option('cUsAW_settings_userData', $postData);

        $cUsAW_API_result = $cUsAW_api->createCustomer($postData);

        if($cUsAW_API_result) :

            $cUs_json = json_decode($cUsAW_API_result);

            switch ( $cUs_json->status  ) :

                case 'success':
                    echo 1;//GREAT
                    update_option('cUsAW_settings_form_key', $cUs_json->form_key ); //finally get form key form contactus.com // SESSION IN
                    $aryFormOptions = array( //DEFAULT SETTINGS / FIRST TIME
                        'tab_user'          => 1,
                        'cus_version'       => 'tab'
                    ); 
                    update_option('cUsAW_FORM_settings', $aryFormOptions );//UPDATE FORM SETTINGS
                break;

                case 'error':

                    if($cUs_json->error[0] == 'Email exists'):
                        echo 2;//ALREDY CUS USER
                        //$cUsAW_api->resetData(); //RESET DATA
                    else:
                        //ANY ERROR
                        echo $cUs_json->error;
                        //$cUsAW_api->resetData(); //RESET DATA
                    endif;
                break;

            endswitch;
         else:
             //echo 3;//API ERROR
             echo $cUs_json->error;
             $cUsAW_api->resetData(); //RESET DATA
         endif;
    endif;
    die();
}

// loginAlreadyUser handler function...
add_action('wp_ajax_cUsAW_loginAlreadyUser', 'cUsAW_loginAlreadyUser_callback');
function cUsAW_loginAlreadyUser_callback() {
    $cUsAW_api = new cUsComAPI_AW();
    $cUs_email = $_REQUEST['email'];
    $cUs_pass = $_REQUEST['pass'];
    $cUsAW_userData = get_option('cUsAW_settings_userData'); //get the saved mailchimp user data
    
    
    $cUsAW_API_result = $cUsAW_api->getFormKeyAPI($cUs_email, $cUs_pass); //api hook;
    if($cUsAW_API_result){
        $cUs_json = json_decode($cUsAW_API_result);

        switch ( $cUs_json->status  ) :
            case 'success':
                update_option('cUsAW_settings_form_key', $cUs_json->form_key);
                $cUsAW_API_UPDATE = $cUsAW_api->updateDeliveryOptions($cUsAW_userData, $cUs_email, $cUs_pass, $cUs_json->form_key); //UPDATE DELIVERY OPTIONS;
                $aryFormOptions = array( //DEFAULT SETTINGS / FIRST TIME
                    'tab_user'          => 1,
                    'cus_version'       => 'tab'
                ); 
                update_option('cUsAW_FORM_settings', $aryFormOptions );//UPDATE FORM SETTINGS
                echo 1;
                break;

            case 'error':
                echo $cUs_json->error;
                //$cUsAW_api->resetData(); //RESET DATA
                break;
        endswitch;
    }
    
    die();
}

// logoutUser handler function...
add_action('wp_ajax_cUsAW_logoutUser', 'cUsAW_logoutUser_callback');
function cUsAW_logoutUser_callback() {
    
    $cUsAW_api = new cUsComAPI_AW();
    $cUsAW_api->resetData(); //RESET DATA
    
    delete_option( 'cUsAW_settings_api_key' );  
    delete_option( 'cUsAW_settings_form_key' );  
    delete_option( 'cUsAW_settings_list_Name' );  
    delete_option( 'cUsAW_settings_list_ID' );  
    
    echo 'Deleted.... User data'; //none list
    
    die();
}

// sendTemplateID handler function...
add_action('wp_ajax_cUsAW_sendTemplateID', 'cUsAW_sendTemplateID_callback');
function cUsAW_sendTemplateID_callback() {
    echo 1; //none list
    
    die();
}


?>
