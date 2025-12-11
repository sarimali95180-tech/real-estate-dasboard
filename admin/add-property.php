<?php
header('Content-Type: application/json');
include './db.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';
    $area = $_POST['area'] ?? '';
    $bathroom = $_POST['bathroom'] ?? '';
    $property_type = $_POST['property_type'] ?? '';
    $price = $_POST['price'] ?? '';
    $location = $_POST['location'] ?? '';
    $content = $_POST['content'] ?? '';
    $thumbnailUrl = $_POST['thumbnail_url'] ?? '';

    // If no Cloudinary URL, try local file upload as fallback
    if (empty($thumbnailUrl) && isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === 0) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $ext = pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION);
        $thumbnailUrl = $uploadDir . time() . '_' . rand(1000, 9999) . '.' . $ext;
        if (!move_uploaded_file($_FILES['thumbnail']['tmp_name'], $thumbnailUrl)) {
            $response['success'] = false;
            $response['message'] = "Failed to upload thumbnail.";
            echo json_encode($response);
            exit;
        }
    }

    // --- Step 1: Get coordinates from geocoding API ---
    $latitude = null;
    $longitude = null;
    if (!empty($location)) {
        $apiKey = "6932be73166d6033492617zuyf1eeb1";
        $geoUrl = "https://geocode.maps.co/search?q=" . urlencode($location) . "&api_key={$apiKey}";
        $geoResponse = file_get_contents($geoUrl);
        if ($geoResponse) {
            $geoData = json_decode($geoResponse, true);
            if (!empty($geoData)) {
                $latitude = $geoData[0]['lat'];
                $longitude = $geoData[0]['lon'];
            }
        }
    }

    // --- Step 2: Save property and coordinates to DB ---
    $stmt = $conn->prepare("INSERT INTO properties (title, description, category, area, bathroom, property_type, price, location, content, thumbnail, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssssssdd",
        $title,
        $description,
        $category,
        $area,
        $bathroom,
        $property_type,
        $price,
        $location,
        $content,
        $thumbnailUrl,
        $latitude,
        $longitude
    );

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Property added successfully with coordinates!";
        $response['id'] = $stmt->insert_id;
        $response['thumbnail'] = $thumbnailUrl;
        $response['latitude'] = $latitude;
        $response['longitude'] = $longitude;
    } else {
        $response['success'] = false;
        $response['message'] = "Database error: " . $stmt->error;
    }
} else {
    $response['success'] = false;
    $response['message'] = "Invalid request method.";
}

echo json_encode($response);
?>
