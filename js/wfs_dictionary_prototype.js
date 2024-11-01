/*
 * Webfacecript.com thanks VOANews.com for the useful script!
 */

// // ==UserScript==
// @name        dictionary prototype
// @namespace   dino
// @include     http://www.voanews.com/content/*
// @include     http://blogs.voanews.com/breaking-news/*
// @version     1.02
// ==/UserScript==

// ================================================================
// isolated so it can be reused in external elements
// ================================================================
var dict_query_word_context = null;

// add mouse paramenter
function dict_query_word( word, context, mouse ) {
	dict_query_word_context = context;
	jQuery.getJSON(
		"http://tools.voanews.com/dictionary/?word=" + escape(word) + "&callback=?", null, function(data) {
			jQuery(context).removeClass('d_clicked');
			dict_tooltip( context, data.definition, mouse);
		}
	);
	
	try {
		_gaq.push([ '_trackEvent', 'dictionary', 'display definition', word ]);
	} catch( err ) {

	}
	
}

function dict_patch_audio_fragment( selctr, r_wav, word ) {

	jQuery(selctr).jPlayer({
		supplied: "wav",
		ready: function () {
			jQuery(this).jPlayer("setMedia", {
				//wav: "http://pp19dd.com/sec/tngchime.wav"
				//wav: "{$word.sound}"
				wav: r_wav
				//m4a: "/media/mysound.mp4",
				//oga: "/media/mysound.ogg"
			});
		},
		play: function() {
			try {
				_gaq.push([ '_trackEvent', 'dictionary', 'play audio', word ]);
			} catch( err ) {
			
			}			
		},
		error: function() {
			jQuery(selctr).hide();
			jQuery("#jp_container_1").hide();
			jQuery("#dict_backup_play_method").show();
		}
		//, errorAlerts: true
	});

}

// add mouse paramenter
function dict_tooltip( word_node, word_definition, mouse ) {

	/*
	 * Webfacescript comment:
	 * word_node for word => but top position is wrong in wordpress
	 * mouse to get top position
	 */
	var node = jQuery(".tooltip_div_for_dict");
	
	// coords.top, coords.left
	var coords = jQuery(word_node).position();
	
	node.hide().html( word_definition );
	
	/* wfs code for the case: left is too near the right browser border	
	 * - fix: width, left css 
	 */
	var nodeStandarOuterW = 450+22*2;
	var browserW = jQuery(window).width(); 
	var left = coords.left;
	
	if(browserW < nodeStandarOuterW)
		nodeStandarOuterW = browserW;
	
	var delta = browserW - nodeStandarOuterW;
	delta = delta < 11 ? 11 : delta;
	if(delta < coords.left)
		left = delta;
	
	node.css({
		left: left,
		top: mouse.pageY + 25,
		width: nodeStandarOuterW - 22*2
	});
	
	node.fadeIn("fast");
}

// ================================================================
// meat and potatoes
// ================================================================
function dictionaryInit(destContentTag, tooltipColor)
{
	function step_1_convert_nodes_into_spans( perform_debug ) {
		var get_nodes = function(el) {
			return jQuery(el).find(":not(iframe,style,div)").andSelf().contents().filter(function() {
				return( this.nodeType == 3 );
			});
		};

		function write_node( ref, val ) {
			jQuery(ref).text(function(i,e) {
				this.nodeValue = val; 
			});
		}

		var t = get_nodes(jQuery(destContentTag), false );
		for( i = 0; i < t.length; i++ ) {
			var txt = jQuery(t[i]).text();
			if( jQuery.trim(txt).length == 0 ) continue;
			
			write_node( t[i], "" );
			jQuery(t[i]).after( "<span class='dict_parse_word'>" + txt + "</span>" );
		}

		if( perform_debug == true ) {
			jQuery(".dict_parse_word").each( function(i,e) {
				jQuery(this).css({
					backgroundColor: "rgb(" + 
					(100 + parseInt(Math.random()*100)) + "," + 
					(100 + parseInt(Math.random()*100)) + "," + 
					(100 + parseInt(Math.random()*100)) + ")"
				});
			});
		}

	}

	function step_2_inject_css() {
		jQuery("<div/>", {
			style: 'display: none',
			html:
				"<div><a href='http://webfacescript.com'>webfacescript - simple and useful ideas</a></div>\n" +
				"<style type='text/css'>\n" +
				".tooltip_div_for_dict { position: absolute; border: 2px solid gray; padding: 10px; border-radius: 5px; display: block; width:450px; font-size:12px; box-shadow:0 0 20px gray;  }\n" +
				".tooltip_div_for_dict { background-color: "+tooltipColor+";  }\n" +
				".tooltip_dict_word { float: left; font-weight: bold; padding-right:10px; padding-left:10px }\n" +
				".tooltip_dict_part {  }\n" +
				".tooltip_dict_logo { float: right }\n" +
				".tooltip_dict_sugs { margin-bottom:0px }\n" +
				".tooltip_dict_sugs li { font-size:12px; float: left; padding-right:10px }\n" +
				".tooltip_dict_defs { margin-bottom:0px; margin-top:10px }\n" +
				".tooltip_dict_defs li { font-size:12px }\n" +
				".dict_suggestion { color: gray; padding-right:10px }\n" +
				".dict_suggestion li { float: left; padding:2px }\n" +
				".dict_suggestion a { color: black; font-weight: bold; text-decoration: underline; }\n" +
				"span.w { cursor:help }\n" +
				"span.d_clicked { background-color: beige; cursor:wait; color:white }\n" +
				"span.wo { text-decoration: underline; background-color: beige }\n" +
				".m_w_vi { display: block; margin-top:10px; color: darkgoldenrod; font-style: oblique }\n" +
				".m_w_it { padding:2px; background-color: wheat }\n" +
				".m_w_gram, .m_w_wsgram, .m_w_sl, .m_w_ssl, .m_w_sgram { display: none }\n" +
				".m_w_snote, .m_w_usage { display: none }\n" + // make these click-expandable?
				".m_w_dx, .m_w_bnote, .m_w_svr { display: none }\n" + // enable these related?
				".m_w_slb, .m_w_un, .m_w_snotebox { display: block }\n" + // examine: criminal, some
				//".m_w_slb, .m_w_un { display: none }\n" + // examine: criminal, some
				"</style>"
		}).appendTo(document.body);
	
	}
	
	function step_3_tokenize_spans() {

		var exclude_words = [
			'and', 'an', 'the', 'be', 'has', 'was', 'will', 
			'but', 'a', 'in', 'from', 'as', 'on', 'of', 'for', 
			'is', 'at', 'to', 'out', 'by', 'voa', 'us', 's',
			'not', 'no', 'yes', 'it', 'that', 'had', 'been',
			'off', 'ap', 'afp', 'reuters', 'he', 'she', 'it',
			'its', 'are', 'or', 'go', 'this', 'we'
		];

		var unique_words = { };
		var unique_words_array = [];
		
		jQuery("span.dict_parse_word").each( function(i,e) {
			var text = jQuery(e).text();
			var text_words = text.toLowerCase().match(/[a-z|\ |\.|\'|\-|\n]/ig).join('');
			var cleaner_text = text_words.replace(/'/g, " ").replace(/\./g, " ").replace(/\n/g, " ");
			var token_words = cleaner_text.split(' ');

			for( i = 0; i < token_words.length; i++ ) {
				if( jQuery.trim(token_words[i]).length < 2 ) continue;
				
				if( typeof unique_words[token_words[i]] == 'undefined' ) {
					unique_words[token_words[i]] = 1;
				} else {
					unique_words[token_words[i]]++;
				}
			}
			
			for( i = 0; i < exclude_words.length; i++ ) {
				if( typeof unique_words[exclude_words[i]] != 'undefined' ) {
					delete unique_words[exclude_words[i]];
				}
			}
			
			for( unique_word in unique_words ) {
				unique_words_array.push( unique_word );
			}
			
			
			var RE = '';
			for( unique_word in unique_words ) {
				RE += "\\b" + unique_word + "\\b|";
			}
			RE = RE.substr(0, RE.length-1);

			var html_snapshot = text.replace(RegExp(RE, "ig"), function(f) {
				return( "<span class='w'>" + f + "</span>" );
			});

			jQuery(e).html( html_snapshot );
		});
		

	
	}
	
	function step_4_activate_word_spans(parms) {

		jQuery(parms.node + " span.w").click( function(e) {

			jQuery(this).addClass("d_clicked");
			
			// if( jQuery(this).
			
			//jQuery(this).css({ 'background-color':'beige', 'color': 'black' });
			var word = jQuery(this).text();
			var context = this;
			
			dict_query_word( word, context, e );

		});

		jQuery(parms.node + " span.w").mouseover( function(e) {
			//jQuery(this).stop().animate({ 'background-color':'beige' }, "slow");
			// jQuery(this).css({ 'text-decoration': 'underline' });
			jQuery(this).addClass('wo');
		});

		jQuery(parms.node + " span.w").mouseout( function(e) {
			//jQuery(this).stop().animate({ 'background-color':'none' }, "slow");
			// jQuery(this).css({ 'text-decoration': 'none' });
			jQuery(this).removeClass('wo');
		});
		
	
	}

	function step_5_setup_environment() {
		
		jQuery("<div/>", {
			'class': 'tooltip_div_for_dict',
			html: 'Loading...'
		}).appendTo(document.body);
		
		jQuery(document).keydown(function(e) {
			if( e.keyCode == 27 ) {
				jQuery(".tooltip_div_for_dict").hide();
			}
		});
		
		jQuery("body").click( function() {
			jQuery(".tooltip_div_for_dict").hide() }
		);
	
		jQuery(".tooltip_div_for_dict").hide();
	
	}
	
	// wfs function
	function step_6_wfs_body_click()
	{
		jQuery(document).click(function()
		{
			var node = jQuery(".tooltip_div_for_dict");
			node.fadeOut("fast");
		});
	}
	
	step_1_convert_nodes_into_spans();
	step_2_inject_css();
	step_3_tokenize_spans();
	step_4_activate_word_spans({ node: destContentTag });
	step_5_setup_environment();
	step_6_wfs_body_click();	
}
