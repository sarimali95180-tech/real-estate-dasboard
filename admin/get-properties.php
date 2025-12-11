<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include './db.php';

// Base URL - Include /admin since uploads folder is inside admin
$baseUrl = "http://localhost/real_estate_dashboard/admin";

// Query to fetch all properties
$sql = "SELECT id, title, description, category, area, bathroom, property_type, price, location, latitude, longitude, content, thumbnail FROM properties ORDER BY id DESC";
$result = $conn->query($sql);

$properties = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Handle thumbnail: if it's a Cloudinary URL, use as-is; otherwise treat as local path
        if (!empty($row['thumbnail'])) {
            $thumbnailPath = $row['thumbnail'];

            // If it's already a full URL (Cloudinary or external), keep it
            if (strpos($thumbnailPath, 'http') === 0) {
                $row['thumbnail'] = $thumbnailPath;
            } else {
                // Local path: ensure it starts with 'uploads/' and convert to full URL
                if (strpos($thumbnailPath, 'uploads/') !== 0) {
                    $thumbnailPath = 'uploads/' . $thumbnailPath;
                }
                $row['thumbnail'] = $baseUrl . '/' . $thumbnailPath;
            }
        } else {
            // Fallback placeholder
            $row['thumbnail'] = $baseUrl . '/uploads/1.png';
        }

        $properties[] = $row;
    }
}

echo json_encode($properties, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$conn->close();
?>