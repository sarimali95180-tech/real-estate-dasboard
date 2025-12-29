<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // allow requests from anywhere

include "../admin/db.php"; // include your database connection

$response = [];

// Count properties
$propertyQuery = $conn->query("SELECT COUNT(*) as total_properties FROM properties  WHERE is_deleted = 0");
$propertyCount = $propertyQuery->fetch_assoc();
$response['total_properties'] = $propertyCount['total_properties'];

// Count users
$userQuery = $conn->query("SELECT COUNT(*) as total_users FROM users  WHERE is_deleted = 0");
$userCount = $userQuery->fetch_assoc();
$response['total_users'] = $userCount['total_users'];

// Count users visited
$userQuery = $conn->query("SELECT COUNT(*) as total_usersview FROM leads");
$userviewCount = $userQuery->fetch_assoc();
$response['total_usersview'] = $userviewCount['total_usersview'];

// Return JSON
echo json_encode($response);
?>