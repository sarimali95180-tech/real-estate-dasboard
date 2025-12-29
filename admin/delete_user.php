<?php
header('Content-Type: application/json');
require './db.php';
require './middleware/auth_middleware.php';

// 🔒 Only super admin can delete
requireAdmin();

$id = (int)($_GET['id'] ?? 0);

// Block deleting super admin
$check = $conn->prepare("SELECT is_super_admin FROM users WHERE id=?");
$check->bind_param("i", $id);
$check->execute();
$user = $check->get_result()->fetch_assoc();

if ($user && $user['is_super_admin'] == 1) {
    echo json_encode([
        "success" => false,
        "message" => "Cannot delete Super Admin"
    ]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET is_deleted=1 WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);
