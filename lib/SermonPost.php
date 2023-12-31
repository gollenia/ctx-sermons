<?php

class SermonPost {

	public static function init () {
		return new self();
	}

	public function __construct() {
		add_action('init', array($this, 'create_post_type'));
		add_action('init', array($this, 'register_sermon_taxonomies'));
		add_action('rest_api_init', array($this, 'register_sermon_meta'));
		
		add_filter('manage_sermon_posts_columns', array($this, 'sermon_columns'));
		add_action('manage_sermon_posts_custom_column', array($this, 'sermon_custom_columns'));
	}

	public function create_post_type() {
		register_post_type('sermon', array(
			'labels' => array(
				'name' => __('Sermons', 'ctx-sermons'),
				'singular_name' => __('Sermon', 'ctx-sermons'),
			),
			'description' => 'Sermons from the church.',
			'menu_position' => 5,
			'menu_icon' => "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='24px' height='24px' stroke-width='1.5' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' color='%23000000'%3E%3Cpath d='M12 6L4.282 10.8237C4.10657 10.9334 4 11.1257 4 11.3325V21.4C4 21.7314 4.26863 22 4.6 22H12M12 6L19.718 10.8237C19.8934 10.9334 20 11.1257 20 11.3325V21.4C20 21.7314 19.7314 22 19.4 22H12M12 6V4M12 2V4M10 4H12M12 4H14M12 22V17' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M16 17.01L16.01 16.9989' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M16 13.01L16.01 12.9989' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M12 13.01L12.01 12.9989' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M8 13.01L8.01 12.9989' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3Cpath d='M8 17.01L8.01 16.9989' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C/path%3E%3C/svg%3E",
			'exclude_from_search' => false,
			'publicly_queryable' => true,
			'query_var' => 'sermon',
			'show_in_nav_menus' => true,
			'show_in_menu' => true,
			'show_in_rest' => true,
			'public' => true,
			'has_archive' => true,
			'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
			'taxonomies' => array('category', 'post_tag')
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
	}

	public function register_sermon_taxonomies() {
		register_taxonomy('sermon_series', 'sermon', array(
			'labels' => array(
				'name' => __('Sermon Series', 'ctx-sermons'),
				'singular_name' => __('Sermon Series', 'ctx-sermons')
			),
			'public' => true,
			'show_in_rest' => true,
			'hierarchical' => true,
			'show_admin_column' => true,
			'show_ui' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud' => true
		));

		register_taxonomy('sermon_speaker', 'sermon', array(
			'labels' => array(
				'name' => __('Sermon Speakers', 'ctx-sermons'),
				'singular_name' => __('Sermon Speaker', 'ctx-sermons'),
				'add_new_item' => __('Add New Sermon Speaker', 'ctx-sermons'),
			),
			'public' => true,
			'show_in_rest' => true,
			'hierarchical' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud' => true
		));
	}

	public function sermon_columns($columns) {
		$columns = array(
			'cb' => '<input type="checkbox" />',
			'title' => __('Title', 'ctx-sermons'),
			'sermon_series' => __('Series', 'ctx-sermons'),
			'sermon_speaker' => __('Speaker', 'ctx-sermons'),
			'sermon_date' => __('Date', 'ctx-sermons'),
			'date' => __('Date', 'ctx-sermons')
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
					echo $sermon_date;
				} else {
					_e('No date', 'ctx-sermons');
				}
				break;
		}
	}

	

}

SermonPost::init();