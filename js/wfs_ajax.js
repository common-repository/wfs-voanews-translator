jQuery(document).ready(function($)
{	
	// events
	if($('#wfsSubmit'))
	{
		$('#wfsSubmit').unbind('click');
		$('#wfsSubmit').bind('click', function()
		{    
			var active = $('#wfsTranslatorActive').is(':checked'); 
			var tooltipColor = $('#wfsTooltipColor option:selected').val(); 
			var contentClass = $('#wfsContentClass').val(); 
			wfsVOANewsTranslatorAjax.saveSetting(active, tooltipColor, contentClass); 
		});
	} 
	
	// ajax object
	var wfsVOANewsTranslatorAjax = 
	{
		saveSetting: function(translatorActive, tooltipColor, contentClass)
		{
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: myAjax.ajaxUrl,
				data: {
					action: 'save_wfs_voasnew_translator_setting',
					translator_active: translatorActive,
					tooltip_color: tooltipColor,
					content_class: contentClass
				},			
				success: function(data)
				{  
					if(data == 'access_denined')
						alert('Access denined.')
					else if(data == true) 
						alert('Saving successfully.'); 
					else
						alert('There has a problem when applying.');
				},
				error: function(errorThrown){
					alert(errorThrown.responseText);
				}
			}); 
		} 
	}
});

