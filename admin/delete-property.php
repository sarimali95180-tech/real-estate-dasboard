<?php
include './db.php';

$id = $_GET['id'];
$response = [];

if (!$id) {
    $response['success'] = false;
    $response['message'] = "Property ID missing!";
    echo json_encode($response);
    exit;
}

$stmt = $conn->prepare("DELETE FROM properties WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['message'] = "Error deleting property!";
}
echo json_encode($response);
?>