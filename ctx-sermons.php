<?php
/**
 * Plugin Name:       CTX Sermons
 * Description:       A plugin to manage sermons for a Church website
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.3.0
 * Author:            Thomas Gollenia
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ctx-sermons
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/lib/SermonPost.php';
require_once __DIR__ . '/lib/SermonREST.php';
require_once __DIR__ . '/lib/Sermon.php';
require_once __DIR__ . '/lib/Sermons.php';
require_once __DIR__ . '/lib/Update.php';


function ctx_sermons_init() {

	$script_asset = __DIR__ . '/build/index.asset.php';
	$list_script_asset = __DIR__ . '/build/list.asset.php';
	$cards_script_asset = __DIR__ . '/build/cards.asset.php';
	
	if ( ! file_exists( $script_asset ) || ! file_exists( $list_script_asset ) || ! file_exists( $cards_script_asset )) {
		return;
	}

	$script_asset = require( $script_asset );
	$list_script_asset = require( $list_script_asset );
	$cards_script_asset = require( $cards_script_asset );
	
	if(is_admin()) {
		wp_register_script(
			'ctx-sermons-admin',
			plugins_url( 'build/index.js', __FILE__ ),
			$script_asset['dependencies'],
			$script_asset['version']
		);

		wp_register_style(
			'ctx-sermons-admin-style',
			plugins_url( 'build/style-index.css', __FILE__ ),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
		);

		wp_set_script_translations( "ctx-sermons-admin", 'ctx-sermons', plugin_dir_path( __FILE__ ) . 'languages' );
	}

	register_block_type( __DIR__ . '/build/blocks/sermon-cards' );
	register_block_type( __DIR__ . '/build/blocks/sermon-list' );

	wp_register_script(
		'ctx-sermons-list',
		plugins_url( 'build/list.js', __FILE__ ),
		$list_script_asset['dependencies'],
		$list_script_asset['version']
	);

	wp_register_script(
		'ctx-sermons-cards',
		plugins_url( 'build/cards.js', __FILE__ ),
		$cards_script_asset['dependencies'],
		$cards_script_asset['version']
	);

	wp_register_style(
		'ctx-sermons-list-style',
		plugins_url( 'build/style-list.css', __FILE__ ),
		array(),
		$list_script_asset['version']
	);

	wp_register_style(
		'ctx-sermons-cards-style',
		plugins_url( 'build/style-cards.css', __FILE__ ),
		array(),
		$cards_script_asset['version']
	);

	wp_set_script_translations( "ctx-sermons-list", 'ctx-sermons', plugin_dir_path( __FILE__ ) . 'languages' );
	wp_set_script_translations( "ctx-sermons-cards", 'ctx-sermons', plugin_dir_path( __FILE__ ) . 'languages' );
}

function ctx_sermons_load_textdomain() {
	load_plugin_textdomain('ctx-sermons', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' ); 
}

add_action( 'init', 'ctx_sermons_init' );
add_action( 'plugins_loaded', 'ctx_sermons_load_textdomain' );


Contexis\Update::init('ctx-sermons');
