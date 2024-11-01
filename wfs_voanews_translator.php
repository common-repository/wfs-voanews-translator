<?php
/*
	Plugin Name: WFS VOANews translator
	Plugin URI: http://webfaceScript.com
	Description: VOANews translator that help post english content to easily explained to english with sound
	Version: 0.5
	Author: WebfaceScript
	Author URI: http://webfaceScript.com
*/

/*  
	Copyright 2013  WebfaceScript.com 
*/

require_once( dirname( __FILE__ ) . '/translator.php' );
require_once( dirname( __FILE__ ) . '/ajax.php' );

if(!function_exists('wfs_voanews_translator_register_main_menu'))
{
	function wfs_voanews_translator_register_main_menu()
	{
		// add_menu_page( $page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position );
		add_menu_page( 
			'WFS VOANes Translater', 
			'WFS VOANes Translater', 
			'edit_posts', 
			'wfs_voanews_translator.php', 
			'load_wfs_voanews_translator', 
			plugins_url('assets/images/menu_icon.png', __FILE__ ), 
			9005
		); 
		
		add_action( 'admin_init', 'register_wfs_voanews_translator_settings' );
	}	
	function register_wfs_voanews_translator_settings() 
	{
		//register our settings
		register_setting( 'wfs_voanews_translator', 'active' ); 
		register_setting( 'wfs_voanews_translator', 'color' ); 
		register_setting( 'wfs_voanews_translator', 'contentClass' ); 
	}
}
add_action( 'admin_menu', 'wfs_voanews_translator_register_main_menu' );



/*
 * adding javascript, jquery player 
 */
add_action( 'init', 'wfs_voanews_translator_script_enqueuer' );
function wfs_voanews_translator_script_enqueuer() 
{		
	wp_register_script( "wfs_voanews_translator_ajax", WP_PLUGIN_URL.'/wfs_voanews_translator/js/wfs_ajax.js', array('jquery') );
	wp_localize_script( 'wfs_voanews_translator_ajax', 'myAjax', array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ))); 
   
	wp_register_script( "wfs_voanews_translator_dic", WP_PLUGIN_URL.'/wfs_voanews_translator/js/wfs_dictionary_prototype.js', array('jquery') );   
	wp_register_script( "wfs_voanews_translator_player", WP_PLUGIN_URL.'/wfs_voanews_translator/js/wfs_jquery_002.js', array('jquery') );   
   
} 

// for logged users
add_action("wp_ajax_save_wfs_voasnew_translator_setting", "save_wfs_voasnew_translator_setting");

// check
add_action("wp_footer", 'wfs_voasnew_translator_check');
function wfs_voasnew_translator_check()
{	
	$active = get_option('active', false);
	
	if($active)
	{
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'wfs_voanews_translator_player' );
		wp_enqueue_script( 'wfs_voanews_translator_dic' );
		
		$color = get_option('color', '#FFEFD5');
		$contentClass = get_option('contentClass', 'entry-content')
		?>
		<script>
		jQuery(document).ready(function($)
		{			
			dictionaryInit(".<?php echo $contentClass; ?>", "<?php echo $color;?>");  
		});
		</script>
		<?php
	}
}
?>