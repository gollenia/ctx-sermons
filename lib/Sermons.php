<?php

namespace Contexis\Sermons;

class Sermons {

	public $sermons = array();
	public $total = 0;
	public $totalPages = 0;

	/**
	 * Get all sermons
	 *
	 * @return Sermons
	 */
	public static function all($offset = 0, $limit = 5) {
		$instance = new self();
		$instance->sermons = array();
		$posts = get_posts(array(
			'post_type' => 'sermon',
			'posts_per_page' => $limit,
			'offset' => $offset,
			'orderby' => '_sermon_date',
			'meta_type' => 'DATE',
			'order' => 'DESC',
			'meta_query' => array(
				array(
					'key' => '_sermon_date',
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE'
				)
			)
		));

		foreach ($posts as $post) {
			$instance->sermons[] = new Sermon($post);
		}

		$instance->total = wp_count_posts('sermon')->publish;
		$instance->totalPages = ceil($instance->total / $limit);

		return $instance;
	}

	/**
	 * Get sermons by taxonomy
	 *
	 * @param string $series
	 * @return Sermons
	 */
	public static function by($taxonomy, $id, $offset = 0, $limit = 5) {

		$instance = new self();
		$instance->sermons = array();
		
		$posts = get_posts(array(
			'post_type' => 'sermon',
			'posts_per_page' => $limit,
			'offset' => $offset,
			'orderby' => '_sermon_date',
			'meta_type' => 'DATE',
			'order' => 'DESC',
			'meta_query' => array(
				array(
					'key' => '_sermon_date',
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE'
				)
			),
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'field' => 'id',
					'terms' => $id,
				)
			)
		));

		foreach ($posts as $post) {
			$instance->sermons[] = new Sermon($post);
		}

		return $instance;
	}

	/**
	 * Get sermons by search term
	 *
	 * @param string $search
	 * @return Sermons
	 */
	public static function find($search, $offset = 0, $limit = 5) {

		$instance = new self();
		if(empty($search)) {
			return $instance;
		}

		$posts = get_posts(array(
			'post_type' => 'sermon',
			'posts_per_page' => -1,
			'orderby' => '_sermon_date',
			'order' => 'DESC',
			'meta_type' => 'DATE',
			'order' => 'DESC',
			'meta_query' => array(
				array(
					'key' => '_sermon_date',
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE'
				)
			),
			's' => $search,
		));

		$preacher_terms = $instance->get_terms_by_search($search, 'sermon_speaker');

		$preachers = get_posts(array(
			'post_type' => 'sermon',
			'posts_per_page' => -1,
			'orderby' => '_sermon_date',
			'order' => 'DESC',
			'meta_type' => 'DATE',
			'order' => 'DESC',
			'meta_query' => array(
				array(
					'key' => '_sermon_date',
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE'
				)
			),
			'tax_query' => array(
				array(
					'taxonomy' => 'sermon_speaker',
					'field' => 'id',
					'terms' => $preacher_terms,
					'operator' => 'IN'
				)
			)
		));


		$series_terms = $instance->get_terms_by_search($search, 'sermon_series');
		$series = get_posts(array(
			'post_type' => 'sermon',
			'posts_per_page' => -1,
			'orderby' => '_sermon_date',
			'order' => 'DESC',
			'meta_type' => 'DATE',
			'order' => 'DESC',
			'meta_query' => array(
				array(
					'key' => '_sermon_date',
					'value' => date('Y-m-d'),
					'compare' => '<=',
					'type' => 'DATE'
				)
			),
			'tax_query' => array(
				array(
					'taxonomy' => 'sermon_series',
					'field' => 'id',
					'terms' => $series_terms,
				)
			)
		));

		$posts = array_merge($posts, $preachers, $series);
		$posts = array_unique($posts, SORT_REGULAR);

		foreach ($posts as $post) {
			$instance->sermons[] = new Sermon($post);
		}

		$instance->slice($offset, $limit);
		$instance->sort_by_date();

		$instance->total = count($posts);
		$instance->totalPages = ceil($instance->total / $limit);

		return $instance;
	}

	public function sort_by_date() {
		usort($this->sermons, function($a, $b) {
			return $a->date < $b->date;
		});
	}

	/**
	 * Filter sermons by keys
	 *
	 * @param array $filter
	 * @return array
	 */
	public function filter($filter) {
		$filtered = array();
		foreach ($this->sermons as $sermon) {
			$filtered[] = $sermon->get_filtered($filter);
		}
		return $filtered;
	}

	/**
	 * Slice function for pagination
	 *
	 * @param integer $offset
	 * @param integer $limit
	 * @return void
	 */
	public function slice($offset, $limit) {
		if($offset > $this->total) {
			return;
		}
		$this->sermons = array_slice($this->sermons, $offset, $limit, true);
	}

	/**
	 * Get term ids by search term
	 *
	 * @param string $search
	 * @param string $taxonomy
	 * @return array
	 */
	private function get_terms_by_search($search, $taxonomy) {
		$terms = get_terms(array(
			'taxonomy' => $taxonomy,
			'hide_empty' => false,
			'search' => $search
		));
		
		$result = [];
		foreach ($terms as $term) {
			$result[] = $term->term_id;
		}

		return $result;
	}
}