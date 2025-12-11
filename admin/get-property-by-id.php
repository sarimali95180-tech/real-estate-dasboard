<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
include "./db.php"; 

$baseUrl = "http://localhost/real_estate_dashboard/admin";

// Validate ID
if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    echo json_encode(["error" => "Invalid ID"]);
    exit;
}

$id = intval($_GET["id"]);

// Fetch single property
$stmt = $conn->prepare("
    SELECT id, title, description, category, area, bathroom, property_type, price, location, latitude, longitude, content, thumbnail 
    FROM properties
    WHERE id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Property not found"]);
    exit;
}

$property = $result->fetch_assoc();

// Fix thumbnail URL
if (!empty($property['thumbnail'])) {
    if (strpos($property['thumbnail'], "http") !== 0) {
        if (strpos($property['thumbnail'], "uploads/") !== 0) {
            $property['thumbnail'] = "uploads/" . $property['thumbnail'];
        }
        $property['thumbnail'] = $baseUrl . "/" . $property['thumbnail'];
    }
} else {
    $property['thumbnail'] = $baseUrl . "/uploads/1.png";
}

// Ensure latitude and longitude are floats
$property['latitude'] = isset($property['latitude']) ? (float)$property['latitude'] : null;
$property['longitude'] = isset($property['longitude']) ? (float)$property['longitude'] : null;

echo json_encode($property, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
?>
