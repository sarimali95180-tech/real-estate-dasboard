<?php
header('Content-Type: application/json');
require './db.php';
require './middleware/auth_middleware.php';

// Admin or Super Admin only
requireAdmin();

$input = json_decode(file_get_contents('php://input'), true);
$id = (int) $input['id'];
$fullname = $input['fullname'] ?? '';
$username = $input['username'] ?? '';
$email = $input['email'] ?? '';
$role = $input['role'] ?? 'user';

// Block editing super admin unless you are super admin
if ($_SESSION['is_super_admin'] != 1) {
    $check = $conn->prepare("SELECT is_super_admin FROM users WHERE id=?");
    $check->bind_param("i", $id);
    $check->execute();
    $target = $check->get_result()->fetch_assoc();

    if ($target && $target['is_super_admin'] == 1) {
        echo json_encode([
            "success" => false,
            "message" => "Cannot edit Super Admin"
        ]);
        exit;
    }
}

// Perform update
$stmt = $conn->prepare("UPDATE users SET fullname=?, username=?, email=?, role=? WHERE id=?");
$stmt->bind_param("ssssi", $username, $fullname, $email, $role, $id);
if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error updating user"
    ]);
}
