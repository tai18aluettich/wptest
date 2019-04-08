<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://getstencil.com/
 * @since             1.0.0
 * @package           Stencil
 *
 * @wordpress-plugin
 * Plugin Name:       Stencil for WordPress
 * Plugin URI:        https://getstencil.com/stencil-for-wordpress
 * Description:       The fastest and easiest way to design images as you write posts in Wordpress. Millions of stock photos, premium icons & templates at your fingertips.
 * Version:           1.11.2
 * Author:            Stencil
 * Author URI:        https://getstencil.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       stencil
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'STENCIL_VERSION', '1.11.2' );


/**
 * Due to some browsers not supporting the HTML5 File Constructor call, it's
 * neccessary to allow unfiltered uploads in order to facilitate image exporting
 * from the Stencil app into the WordPress installation.c
 * 
 * Without this, image exporting fails for browsers include:
 * - Internet Explorer (all versions)
 * - Microsoft Edge (all versions)
 * - Mozilla Firefox (versions <= 27)
 * - Google Chrome (versions <= 37)
 * - Apple Safari (versions <= 9.1)
 * - iOS Safari (versions <= 9.3)
 * - Opera (versions <= 24)
 * 
 * @see     https://caniuse.com/#feat=fileapi
 */
if (defined('ALLOW_UNFILTERED_UPLOADS') === false) {
    define( 'ALLOW_UNFILTERED_UPLOADS', true );
}

/**
 * Elementor Support
 * 
 * @added   23 February 2019
 * @see     https://code.elementor.com/php-hooks/#elementorloaded
 * @see     https://github.com/elementor/elementor/issues/7174
 * @see     https://github.com/pojome/elementor-hello-world
 * @see     https://github.com/elementor/elementor-hello-world/blob/master/elementor-hello-world.php
 * @see     https://github.com/elementor/elementor-hello-world/blob/master/plugin.php
 */
add_action('elementor/editor/before_enqueue_scripts', function() {
    wp_enqueue_style( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/css/stencil-admin.css', array(), STENCIL_VERSION, 'all' );
    wp_enqueue_script( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/js/stencil-admin.js', array( 'jquery' ), STENCIL_VERSION, false );
});

/**
 * Beaver Builder Support
 * 
 * @added   25 February 2019
 * @see     https://github.com/lukecav/awesome-beaver-builder
 * @see     https://hooks.wpbeaverbuilder.com/bb-plugin/
 * @see     https://kb.wpbeaverbuilder.com/article/117-plugin-filter-reference
 */
add_action('fl_builder_layout_style_dependencies', function() {
    wp_enqueue_style( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/css/stencil-admin.css', array(), STENCIL_VERSION, 'all' );
    wp_enqueue_script( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/js/stencil-admin.js', array( 'jquery' ), STENCIL_VERSION, false );
});

/**
 * Divi Builder Visual Builder
 * 
 * @note    I discovered this hook by simply searching the directory in Sublime
 *          for do_action calls. I'm not sure if it's the correct action to be
 *          hooking into.
 * @added   01 March 2019
 * @see     https://www.elegantthemes.com/documentation/developers/hooks/divi-template-hooks/
 */
add_action('et_fb_framework_loaded', function() {
    wp_enqueue_style( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/css/stencil-admin.css', array(), STENCIL_VERSION, 'all' );
    wp_enqueue_script( 'stencil', plugin_dir_url( __FILE__ ) . 'admin/js/stencil-admin.js', array( 'jquery' ), STENCIL_VERSION, false );
});

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-stencil-activator.php
 */
function activate_stencil() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stencil-activator.php';
	Stencil_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-stencil-deactivator.php
 */
function deactivate_stencil() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-stencil-deactivator.php';
	Stencil_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_stencil' );
register_deactivation_hook( __FILE__, 'deactivate_stencil' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-stencil.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_stencil() {
	$plugin = new Stencil();
	$plugin->run();

}
run_stencil();
