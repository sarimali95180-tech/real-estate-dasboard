<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // allow all origins if needed
include "../admin/db.php"; // your database connection

// Get search query
$search = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($search === '') {
    echo json_encode([]);
    exit;
}

// Prepared statement to prevent SQL injection
$stmt = $conn->prepare("
    SELECT id, title, location, property_type, description
    FROM properties
    WHERE is_deleted = 0
      AND (title LIKE ? OR location LIKE ? OR property_type LIKE ?)
");

$like = "%$search%";
$stmt->bind_param("sss", $like, $like, $like);
$stmt->execute();
$result = $stmt->get_result();

$properties = [];
while ($row = $result->fetch_assoc()) {
    $properties[] = $row;
}

echo json_encode($properties);

