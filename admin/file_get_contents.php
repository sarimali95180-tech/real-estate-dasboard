<?php
// -----------------------------
// Function to get JSON from a URL safely
// -----------------------------
function fetchJsonFromUrl($url) {
    // Suppress warnings from file_get_contents
    $response = @file_get_contents($url);

    if ($response === false) {
        // Request failed
        return null;
    }

    // Decode JSON safely
    $data = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        // JSON parsing failed
        return null;
    }

    return $data;
}

// -----------------------------
// Example usage with geocode.maps.co
// -----------------------------
$location = "Islamabad"; // replace with your dynamic location
$locationEncoded = urlencode($location);
$url = "https://geocode.maps.co/search?q={$locationEncoded}";

$result = fetchJsonFromUrl($url);

if ($result && !empty($result)) {
    $lat = (float)$result[0]['lat'];
    $lon = (float)$result[0]['lon'];
    echo json_encode([
        'success' => true,
        'latitude' => $lat,
        'longitude' => $lon
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Could not fetch coordinates'
    ]);
}
?>
