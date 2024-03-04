<?php

$latest_sermon = get_posts(array(
	'post_type' => 'sermon',
	'posts_per_page' => 1,
	'orderby' => 'date',
	'order' => 'DESC',
	'tax_query' => $attributes['sermonSerie'] ? array(
		array(
			'taxonomy' => 'sermon_series',
			'terms' => $attributes['sermonSerie']
		)
	) : null
));

?>

<div id="latest-sermon" class="ctx-sermons-latest-sermon" data-id="">
	