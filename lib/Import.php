<?php

class SermonImport {

	public static function init() {
		new self();
	}

    public $plugin_name = "ctx-sermons";

	public function __construct() {
		add_action('admin_menu', array( $this, 'add_settings_menu' ), 9);    
		add_action( 'rest_api_init', array($this, 'register_sermon_import') );
		
	}

	public function add_settings_menu(){
        add_submenu_page( 
			'edit.php?post_type=sermon', 			
			__('Import Sermons', 'ctx-sermons'),	
			__('Import', 'ctx-sermons'), 								
			'administrator', 	
			'expose-settings', 			
			[$this, 'display_admin_settings']
		);
	}

	public function display_admin_settings() {
		?>
		<div class="wrap">
		        <div id="icon-themes" class="icon32"></div>  
		        <h2><?php echo __("Product Shop Settings", 'ctx-sermons') ?></h2>  
				
		        <h1>Test</h1>

				<textarea name="sermon_import" id="sermon_import" rows="10" style="width:100%"></textarea>
				<button id="import_sermons">Import</button>
		</div>

		<script type="text/javascript">
			document.getElementById('import_sermons').addEventListener('click', function() {
				console.log('click');
				const data = document.getElementById('sermon_import').value;
				
				fetch('/wp-json/sermons/v2/import', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({data: data})
				})
			});
		</script>
		<?php
	}

	public function register_sermon_import() {
		register_rest_route( 'sermons/v2', '/import', array(
			'methods' => 'POST',
			'callback' => array($this, 'import_sermons'),
			'permission_callback' => function() {
				return true; // true or false
			}
		));
	}

	public function import_sermons($data) {
		$sermons = json_decode($data['data']);
		foreach($sermons as $sermon) {
			$file = $this->get_file_by_filename($sermon->dateiname);
			if(!$file) {
				continue;
			}
			file_put_contents('/var/www/vhosts/kids-team.internal/log/sermon_import.log', print_r($sermon, true), FILE_APPEND);
			if(get_page_by_title($sermon->titel, OBJECT, 'sermon')) {
				continue;
			}
			$post = array(
				'post_title' => $sermon->titel,
				'post_content' => $sermon->kommentar,
				'post_status' => 'publish',
				'post_type' => 'sermon',
				'post_date' => $sermon->datum,
			);
			$post_id = wp_insert_post($post);
			update_post_meta($post_id, '_sermon_date', $sermon->datum);
			update_post_meta($post_id, '_sermon_audio', $file->ID);
			update_post_meta($post_id, '_sermon_bibleverse', $sermon->bibelstelle);
			update_post_meta($post_id, '_sermon_link', $sermon->link);

			if(!term_exists($sermon->reihe, 'sermon_series')) {
				wp_insert_term($sermon->reihe, 'sermon_series');
			} 
			$series = get_term_by('name', $sermon->reihe, 'sermon_series');
			
			wp_set_object_terms($post_id, $series->term_id, 'sermon_series');

			$speaker = $sermon->vorname . ' ' . $sermon->nachname;
			if(!term_exists($speaker, 'sermon_speaker')) {
				wp_insert_term($speaker, 'sermon_speaker');
			}

			$speaker_term = get_term_by('name', $speaker, 'sermon_speaker');
			wp_set_object_terms($post_id, $speaker_term->term_id, 'sermon_speaker');
		}
		return $sermons;
	}

	public function get_file_by_filename($filename) {

		$title = substr($filename, 0, strrpos($filename, '.'));
		$args = array(
			'post_type' => 'attachment',
			'title' => $title,
			'posts_per_page' => 1,
			'post_status' => 'inherit',
		);
		$attachments = get_posts($args);
		//file_put_contents('/var/www/vhosts/kids-team.internal/log/sermon_import.log', print_r($attachments, true), FILE_APPEND);
		if($attachments) {
			return $attachments[0];
		}
		return false;
	}



	

}

