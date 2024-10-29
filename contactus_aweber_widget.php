<?php
/*
  The AWeber Form Plugin by ContactUs.com.
 */

//MailChimp Subscribe Box widget extend 

class contactus_aweber_Widget extends WP_Widget {

	function contactus_aweber_Widget() {
		$widget_ops = array( 
			'description' => __('Displays AWeber Newsletter Subscribe Form', 'contactus_aw')
		);
		$this->WP_Widget('contactus_aweber_Widget', __('AWeber Form by ContactUs.com', 'contactus_aw'), $widget_ops);
	}

	function widget( $args, $instance ) {
		if (!is_array($instance)) {
			$instance = array();
		}
		contactus_aweber_signup_form(array_merge($args, $instance));
	}
};

function contactus_aweber_signup_form($args = array()) {
    extract($args);
    $cUs_form_key = get_option('cUsAW_settings_form_key'); //get the saved form key
    
    if(strlen($cUs_form_key)):
        $xHTML  = '<aside id="cUsAW_form_widget" style="clear:both;min-height:230px;margin:10px auto;">';
        $xHTML .= '<script type="text/javascript" src="//cdn.contactus.com/cdn/forms/'. $cUs_form_key .'/inline.js"></script>';
        $xHTML .= '</aside>';
        
        echo $xHTML;
    endif;
};  

?>
