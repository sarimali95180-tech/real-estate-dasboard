<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
include './db.php';
include '../config/const-auth.php';

// Check if 'location' parameter is provided
if (!isset($_GET['location']) || empty($_GET['location'])) {
    echo json_encode([
        "status" => 400,
        "message" => "Location parameter is required"
    ]);
    exit;
}

$location = urlencode($_GET['location']);
$geoapifyUrl = GEOAPIFY_API_URL . "?text={$location}&apiKey=" . GEOAPIFY_API_KEY . "&limit=" . GEOAPIFY_SUGGESTIONS_LIMIT;

// Fetch data from Geoapify
$response = file_get_contents($geoapifyUrl);
if ($response === FALSE) {
    echo json_encode([
        "status" => 500,
        "message" => "Failed to fetch data from Geoapify"
    ]);
    exit;
}

// Decode Geoapify response
$data = json_decode($response, true);

// Prepare suggestion list
$suggestions = [];
if (!empty($data['features'])) {
    foreach ($data['features'] as $feature) {
        $suggestions[] = [
            "name" => $feature['properties']['formatted'] ?? "",
            "latitude" => $feature['properties']['lat'] ?? "",
            "longitude" => $feature['properties']['lon'] ?? ""
        ];
    }
}

echo json_encode([
    "status" => 200,
    "suggestions" => $suggestions
]);
