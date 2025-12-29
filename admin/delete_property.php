<?php
header('Content-Type: application/json');
include './db.php';
require './middleware/auth_middleware.php';

// Admin or Super Admin only
requireAdmin();

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid id']);
    exit;
}

// Soft delete (do NOT delete file)
$stmt = $conn->prepare(
    "UPDATE properties SET is_deleted = 1 WHERE id = ?"
);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Delete failed']);
}

$stmt->close();
$conn->close();
