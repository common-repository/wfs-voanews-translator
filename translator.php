<?php
if(!function_exists('load_wfs_voanews_translator'))
{
	function load_wfs_voanews_translator()
	{?>
		
		<?php
		wp_enqueue_script('jquery');
		wp_enqueue_script( 'wfs_voanews_translator_ajax' );
		?>
		
		<h2>WFS VOANews Translator</h2>
		<h4>Version 0.5 - Minimum control panel</h4>   
		<fieldset style="border: 1px solid #DFDFDF; padding: 10px; margin-top: 10px; max-width: 600px;">
			<legend>Setting</legend> 
			<table class="form-table">
				<tbody>
					<tr valign="top">
						<th scope="row">WFS VOANews translator active: </th>
						<td>
							<input type="checkbox" id="wfsTranslatorActive" checked/>
							<label for="wfsTranslatorActive">Active</label>
							<p class="description">Un-check to disable the translator</p>
						</td>
					</tr> 
					<tr valign="top">
						<th scope="row">Tooltip box color:</th>
						<td> 
							<div style="width: 140px; height:175px; overflow: hidden; border: 0;">
								<select id="wfsTooltipColor" size="11" style="width:160px; height:175px; border: 0; margin: 0;"> 
								<?php 
									$arr = array( 
										array( 'Default', '#FFEFD5' ),
										array( 'Magenta', '#FF0094' ),
										array( 'Purple', '#A500FF' ),
										array( 'Teal', '#00AAAD' ),
										array( 'Lime', '#8CBE29' ),
										array( 'Brown', '#9C5100' ),
										array( 'Pink', '#E671B5' ),
										array( 'Mango', '#EF9608' ),
										array( 'Blue', '#19A2DE' ),
										array( 'Red', '#E61400' ),
										array( 'Green', '#319A31' ),
									);
									$tooltipColor = get_option('color', '#FFEFD5');
									foreach ($arr as $colorItem)
									{ ?>
									<option value="<?php echo $colorItem[1];?>" style="color:<?php echo $colorItem[1];?>; text-transform: uppercase;" <?php if($tooltipColor == $colorItem[1]) echo 'selected'; ?>><?php echo $colorItem[0];?></option>   <?php
									} ?>
								 </select> 
							</div>
							<p class="description">Change tooltip background color</p>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">Wordpress post content tag's class:</th>
						<td>
							<input id="wfsContentClass" class="regular-text" value="<?php echo get_option('contentClass', 'entry-content'); ?>">
							<p class="description">If your wordpress theme changed the post content class, please enter the new (by default the value is 'entry-content')</p>
						</td>
					</tr>  
					<tr valign="top">
						<th scope="row"></th>
						<td>
							<a id="wfsSubmit" href="javascript:void();" class="button">Save</a>
						</td>
					</tr>
				</tbody>
			</table>				
		</fieldset> 
		<?php
	}
}
?>