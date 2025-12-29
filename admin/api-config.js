/**
 * ============================================
 * API CONFIGURATION CONSTANTS (JavaScript)
 * ============================================
 * All API keys and external service credentials
 * for client-side usage.
 */

// Geoapify API Configuration
const API_CONFIG = {
  // Geoapify
  GEOAPIFY_API_KEY: '0eff5672f554429fa0d2ade011ab5163',
  GEOAPIFY_API_URL: 'https://api.geoapify.com/v1/geocode/search',
  GEOAPIFY_SUGGESTIONS_LIMIT: 5,

  // Cloudinary
  CLOUDINARY_API_URL: 'https://api.cloudinary.com/v1_1/dwau92q5t/image/upload',
  CLOUDINARY_CLOUD_NAME: 'dwau92q5t',
  CLOUDINARY_UPLOAD_PRESET: 'unsigned_upload',

  // OpenStreetMap
  OPENSTREETMAP_TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  OPENSTREETMAP_MAX_ZOOM: 19
};
