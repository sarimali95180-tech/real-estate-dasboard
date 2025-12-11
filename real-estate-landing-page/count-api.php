<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // allow requests from anywhere

include "../admin/db.php"; // include your database connection

$response = [];

// Count properties
$propertyQuery = $conn->query("SELECT COUNT(*) as total_properties FROM properties");
$propertyCount = $propertyQuery->fetch_assoc();
$response['total_properties'] = $propertyCount['total_properties'];

// Count users
$userQuery = $conn->query("SELECT COUNT(*) as total_users FROM users");
$userCount = $userQuery->fetch_assoc();
$response['total_users'] = $userCount['total_users'];

// Return JSON
echo json_encode($response);
?>
