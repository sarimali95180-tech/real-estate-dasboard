<?php
/**
 * ============================================
 * API KEY AND CONFIGURATION CONSTANTS
 * ============================================
 * All API keys and external service credentials
 * are centralized here for easy management.
 * DO NOT hardcode API keys in other files.
 */

/* ======================== */
/* GEOAPIFY API CONFIGURATION */
/* ======================== */
define('GEOAPIFY_API_KEY', '0eff5672f554429fa0d2ade011ab5163');
define('GEOAPIFY_API_URL', 'https://api.geoapify.com/v1/geocode/search');
define('GEOAPIFY_SUGGESTIONS_LIMIT', 5);

/* ======================== */
/* GEOCODE.MAPS.CO API CONFIGURATION */
/* ======================== */
define('GEOCODE_MAPS_API_KEY', '6932be73166d6033492617zuyf1eeb1');
define('GEOCODE_MAPS_API_URL', 'https://geocode.maps.co/search');

/* ======================== */
/* CLOUDINARY API CONFIGURATION */
/* ======================== */
define('CLOUDINARY_API_URL', 'https://api.cloudinary.com/v1_1/dwau92q5t/image/upload');

/* ======================== */
/* MAP TILE PROVIDERS */
/* ======================== */
define('OPENSTREETMAP_TILE_URL', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
define('OPENSTREETMAP_MAX_ZOOM', 19);

?>
