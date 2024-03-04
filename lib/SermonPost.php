<?php

class SermonPost {

	public static function init () {
		return new self();
	}

	public function __construct() {
		add_action('init', array($this, 'create_post_type'));
		add_action('init', array($this, 'register_sermon_taxonomies'));
		add_action('rest_api_init', array($this, 'register_sermon_meta'));
		add_action( 'admin_menu' , array($this, 'remove_custom_meta_form'));
		add_filter('manage_sermon_posts_columns', array($this, 'sermon_columns'));
		add_action('manage_sermon_posts_custom_column', array($this, 'sermon_custom_columns'));
	}

	public function create_post_type() {

		$menu_icon = file_get_contents(plugin_dir_path(__FILE__) . '../sermons.svg');
		register_post_type('sermon', array(
			'labels' => array(
				'name' => __('Sermons', 'ctx-sermons'),
				'singular_name' => __('Sermon', 'ctx-sermons'),
			),
			'description' => 'Sermons from the church.',
			'menu_position' => 5,
			"menu_icon" => 'dashicons-microphone',
			'exclude_from_search' => false,
			'publicly_queryable' => true,
			'query_var' => 'sermon',
			'show_in_nav_menus' => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
			'public' => true,
			'has_archive' => true,
			'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
			
		));
	}

	public function register_sermon_meta() {
		register_post_meta('sermon', '_sermon_date', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
			'sanitize_callback' => '',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},

		));

		register_post_meta('sermon', '_sermon_audio', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'number',
			'sanitize_callback' => '',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		));

		register_post_meta('sermon', '_sermon_bibleverse', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
			'sanitize_callback' => '',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		));

		register_post_meta('sermon', '_sermon_link', array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
			'sanitize_callback' => function($value) {
				return esc_url_raw($value);
			},
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		));
	}

	public function register_sermon_taxonomies() {
		register_taxonomy('sermon_series', 'sermon', array(
			'labels' => array(
				'name' => __('Sermon Series', 'ctx-sermons'),
				'singular_name' => __('Sermon Series', 'ctx-sermons'),
				'add_new_item' => __('Add New Serie', 'ctx-sermons'),
				'new_item_name' => __('Series Name', 'ctx-sermons'),
				'name_field_description' => 'Series Name',
				'slug_field_description' => 'Slug of the Series',
				'edit_item' => __('Edit Series', 'ctx-sermons'),
				'update_item' => __('Update Series', 'ctx-sermons'),
				'view_item' => __('View Series', 'ctx-sermons'),
				'separate_items_with_commas' => __('Separate series with commas', 'ctx-sermons'),
				'add_or_remove_items' => __('Add or remove series', 'ctx-sermons'),
				'choose_from_most_used' => __('Choose from the most used series', 'ctx-sermons'),
				'not_found' => __('No series found', 'ctx-sermons'),
				'no_terms' => __('No series', 'ctx-sermons'),
			),
			'public' => true,
			'show_in_rest' => true,
			'hierarchical' => true,
			'show_admin_column' => true,
			'meta_box_cb' => false,
			'show_ui' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud' => true
		));

		register_taxonomy('sermon_speaker', 'sermon', array(
			'labels' => array(
				'name' => __('Preachers', 'ctx-sermons'),
				'singular_name' => __('Preacher', 'ctx-sermons'),
				'add_new_item' => __('Add New Preacher', 'ctx-sermons'),
				'new_item_name' => __('Preacher Name', 'ctx-sermons'),
				'name_field_description' => 'Speaker\'s Name',
				'slug_field_description' => 'Slug of the Preacher',
				'edit_item' => __('Edit Preacher', 'ctx-sermons'),
				'update_item' => __('Update Preacher', 'ctx-sermons'),
				'view_item' => __('View Preacher', 'ctx-sermons'),
				'separate_items_with_commas' => __('Separate preachers with commas', 'ctx-sermons'),
				'add_or_remove_items' => __('Add or remove preachers', 'ctx-sermons'),
				'choose_from_most_used' => __('Choose from the most used preachers', 'ctx-sermons'),
				'not_found' => __('No preachers found', 'ctx-sermons'),
				'no_terms' => __('No preachers', 'ctx-sermons'),
			),
			'public' => true,
			'show_in_rest' => true,
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud' => false
		));
	}

	public function remove_custom_meta_form() {
		remove_meta_box('postcustom', 'sermon', 'normal');
	}

	public function sermon_columns($columns) {
		$columns = array(
			
			'cb' => '<input type="checkbox" />',
			'image' => '',
			'title' => __('Title', 'ctx-sermons'),
			'sermon_series' => __('Series', 'ctx-sermons'),
			'sermon_speaker' => __('Speaker', 'ctx-sermons'),
			'sermon_date' => __('Date', 'ctx-sermons'),
		);

		
		return $columns;
	}

	public function sermon_custom_columns($column) {
		global $post;
		switch ($column) {
			case 'sermon_series':
				$terms = get_the_term_list($post->ID, 'sermon_series', '', ', ', '');
				if (is_string($terms)) {
					echo $terms;
				} else {
					_e('No serie', 'ctx-sermons');
				}
				break;
			case 'sermon_speaker':
				$terms = get_the_term_list($post->ID, 'sermon_speaker', '', ', ', '');
				if (is_string($terms)) {
					echo $terms;
				} else {
					_e('No speaker', 'ctx-sermons');
				}
				break;
			case 'sermon_date':
				$sermon_date = get_post_meta($post->ID, '_sermon_date', true);
				if (!empty($sermon_date)) {
					echo wp_date(get_option( 'date_format' ), strtotime($sermon_date));
				} else {
					_e('No date', 'ctx-sermons');
				}
				break;
			case 'image':
				$thumbnail_id = get_post_thumbnail_id($post->ID);
				if ($thumbnail_id) {
					$thumbnail = wp_get_attachment_image_src($thumbnail_id, 'thumbnail', false);
					echo '<img src="' . esc_url($thumbnail[0]) . '" alt="' . esc_attr($post->post_title) . '" style="max-width:48px;"/>';
				} else {
					echo '<div class="sermon-icon" style="background: #ccc; width: 48px; height: 48px; display: grid; place-content: center"><div class="dashicons dashicons-microphone"></div></div>';
					echo '<style>.sermon-icon .dashicons {font-size: 24px;} .column-image {width: 3rem; }</style>';
				}
				break;
		}
	}
}

SermonPost::init();