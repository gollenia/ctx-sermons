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
			'permission_callback' => '__return_true',
		));

		register_rest_route('ctx-sermons/v2', '/sermon/(?P<id>\d+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'get_rest_sermon_by_id'),
			'permission_callback' => '__return_true',
		));
	}

	public function get_rest_sermon_by_id($request) {
		$id = $request['id'];
		$post = get_post($id);
		if(!$post) {
			return new WP_REST_Response(array(), 404);
		}
		$sermon = new Sermon($post);
		return new WP_REST_Response($sermon, 200);
	}


	public function get_rest_list($query) {

		$filter = isset($query['filter']) ? $query['filter'] : array();
		$perPage = isset($query['per_page']) ? $query['per_page'] : 5;
		$page = isset($query['page']) ? $query['page'] : 1;
		$offset = isset($query['offset']) ? $query['offset'] : ($page - 1) * $perPage;

		$searchTerm = isset($query['search']) ? $query['search'] : '';
		
		if($searchTerm) {
			$sermons = Sermons::find($searchTerm, $offset, $perPage);
			return $this->return_list($sermons, $filter);
		} 

		if(isset($query['sermon_speaker']) && $query['sermon_speaker']) {
			$sermons = Sermons::by('sermon_speaker', $query['sermon_speaker'], $offset, $perPage);
			return $this->return_list($sermons, $filter);
		}

		if(isset($query['sermon_series']) && $query['sermon_series']) {
			$sermons = Sermons::by('sermon_series', $query['sermon_series'], $offset, $perPage);
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