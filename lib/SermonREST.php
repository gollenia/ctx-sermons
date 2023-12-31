<?php 

class SermonREST {

	public static function init() {
		return new self();
	}

	public function __construct() {
		add_action('rest_api_init', array($this, 'register_sermon_routes'));
	}

	public function register_sermon_routes() {
		register_rest_route('ctx-sermons/v2', '/list', array(
			'methods' => 'GET',
			'callback' => array($this, 'get_rest_list'),
		));
	}

	public function get_rest_list($query) {

		$filter = isset($query['filter']) ? explode(',', $query['filter']) : array();
		$perPage = isset($query['per_page']) ? $query['per_page'] : 5;
		$page = isset($query['page']) ? $query['page'] : 1;
		$offset = isset($query['offset']) ? $query['offset'] : ($page - 1) * $perPage;

		$searchTerm = isset($query['search']) ? $query['search'] : '';
		
		if($searchTerm) {
			$sermons = Sermons::find($searchTerm, $offset, $perPage);
			return $this->return_list($sermons, $filter);
		} 

		if(isset($query['speaker'])) {
			$sermons = Sermons::by('speaker', $query['speaker'], $offset, $perPage);
			return $this->return_list($sermons, $filter);
		}

		if(isset($query['series'])) {
			$sermons = Sermons::by('series', $query['series'], $offset, $perPage);
			return $this->return_list($sermons, $filter);
		}

		$sermons = Sermons::all($offset, $perPage);
		return $this->return_list($sermons, $filter);
	}

	
	public function return_list(Sermons $sermons, $filter) {
		header('X-WP-TotalPages: ' . $sermons->totalPages);
		header('X-WP-Total: ' . $sermons->total);
		return new WP_REST_Response($sermons->filter($filter), 200);
	}


	
}

SermonREST::init();