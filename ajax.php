<?php 

if(!function_exists('save_wfs_voasnew_translator_setting'))
{
	function save_wfs_voasnew_translator_setting()
	{
		if(current_user_can('edit_posts') === false) 
		{
			echo 'access_denined';
		}
		else
		{
			$active = $_REQUEST["translator_active"] == 'true' ? true : false;
			$color = $_REQUEST["tooltip_color"];
			$contentClass = $_REQUEST["content_class"];
			
			update_option('active', $active);
			update_option('color', $color);
			update_option('contentClass', $contentClass);
			
			echo 'true';
		}
		
		die();
	}  
}
?>