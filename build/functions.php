<?php

/* Automatic Feed Links */
add_theme_support( 'automatic-feed-links' );

/* Enqueue Stylesheets */
function theme_enqueue_style() {
	wp_enqueue_style('core', 'style.css', false);
	wp_enqueue_style('core', 'stylesheets/master.css', false);
}

/* Enqueue Scripts */
function theme_enqueue_script() {
	wp_enqueue_script('my-js', 'scripts/plugins.js', false );
	wp_enqueue_script('my-js', 'scripts/functions.js', false );
}

/* Add Action Block */
add_action( 'wp_enqueue_scripts', 'theme_enqueue_style' );
add_action( 'wp_enqueue_scripts', 'theme_enqueue_script' );

?>
