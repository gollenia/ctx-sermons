<?php

$latest_sermons = get_posts(array(
	'post_type' => 'sermon',
	'posts_per_page' => $attributes['limit'],
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

<div class="ctx-latest-sermons row-<?php echo $attributes["perRow"] ?>" style="display: grid;">
	<?php foreach($latest_sermons as $sermon) { ?>
		<div class="ctx-sermon">
		<?php $sermon_media = wp_get_attachment_url(get_post_meta($sermon->ID, '_sermon_audio', true)); ?>	
		<?php $sermon_image = wp_get_attachment_image_src(get_post_thumbnail_id($sermon->ID), 'medium'); ?>
		
		<?php if($attributes['showImage']): ?><img src="<?php echo $sermon_image[0]; ?>" /><?php endif; ?>
			<?php if($attributes['showTitle']): ?><h2><?php echo $sermon->post_title; ?></h2><?php endif; ?>
			<?php if($attributes['showBiblePassage']): ?><p><?php echo get_post_meta($sermon->ID, '_sermon_bibleverse', true); ?></p><?php endif; ?>
		<?php if($attributes['showDate']): ?><p><?php echo get_post_meta($sermon->ID, '_sermon_date', true); ?></p><?php endif; ?>
		<?php if($attributes['showSeries']): ?><p><?php echo strip_tags(get_the_term_list($sermon->ID, 'sermon_series', '', ', ', '')); ?></p><?php endif; ?>
		<?php if($attributes['showSpeaker']): ?><p><?php echo strip_tags(get_the_term_list($sermon->ID, 'sermon_speaker', '', ', ', '')); ?></p><?php endif; ?>
		<?php if($attributes['showAudio']): ?>
			<audio controls src="<?php echo $sermon_media; ?>">
				<button>PLAY</button>
			</audio>
		<?php endif; ?>
		</div>
	<?php } ?>
	
		
		
</div>