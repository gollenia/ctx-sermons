<?php

class Sermon {

	public $title;
	public $date;
	public $audio;
	public $bibleverse;
	public $series;
	public $speaker;
	public $id;

	public function __construct($post) {
		$this->title = $post->post_title;
		$this->date = get_post_meta($post->ID, '_sermon_date', true);
		$this->audio = get_post_meta($post->ID, '_sermon_audio', true);
		$this->bibleverse = get_post_meta($post->ID, '_sermon_bibleverse', true);
		$this->series = $this->get_name_and_id(get_the_terms($post->ID, 'sermon_series'));
		$this->speaker = $this->get_name_and_id(get_the_terms($post->ID, 'sermon_speaker'));
		$this->id = $post->ID;
	}

	public function get_name_and_id(array | bool $terms) {
		if(!$terms) {
			return array();
		}
		$terms_array = array();
		foreach ($terms as $term) {
			$terms_array[] = array(
				'id' => $term->term_id,
				'name' => $term->name,
			);
		}
		return $terms_array;
	}

	public function get_filtered($filter) {
		if(!is_array($filter) || empty($filter)) {
			return get_object_vars($this);
		}

		$filtered = array();
		$keys = get_object_vars($this);
		foreach ($keys as $key => $value) {
			if (in_array($key, $filter)) {
				$filtered[$key] = $value;
			}
		}
		return $filtered;
	}
}