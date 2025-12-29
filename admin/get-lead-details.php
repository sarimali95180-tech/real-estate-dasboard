<?php
header("Content-Type: application/json");
include "./db.php";

if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["status" => "error", "message" => "Lead ID missing"]);
    exit;
}

$lead_id = intval($_GET['id']);

// Fetch lead details
$stmt = $conn->prepare("SELECT * FROM leads WHERE id = ?");
$stmt->bind_param("i", $lead_id);
$stmt->execute();
$lead_result = $stmt->get_result();

if ($lead_result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Lead not found"]);
    exit;
}

$lead = $lead_result->fetch_assoc();

// Fetch property details using property_id
$property_id = $lead['property_id'];

$property_stmt = $conn->prepare("SELECT * FROM properties WHERE id = ?");
$property_stmt->bind_param("i", $property_id);
$property_stmt->execute();
$property_result = $property_stmt->get_result();
$property = $property_result->fetch_assoc();

echo json_encode([
    "status" => "success",
    "lead" => $lead,
    "property" => $property
]);
?>