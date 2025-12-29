<?php
session_start();
header('Content-Type: application/json');

include '../admin/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request"
    ]);
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($username === '' || $password === '') {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT id, username, password, role, is_super_admin
     FROM users
     WHERE username = ? AND is_deleted = 0"
);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid username or password"
    ]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid username or password"
    ]);
    exit;
}

// ✅ SET SESSION
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];
$_SESSION['is_super_admin'] = (int)$user['is_super_admin'];
$_SESSION['session_created_time'] = time();

// ✅ RESPONSE FORMAT (JS SAFE)
echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "role" => $user['role'],
    "is_super_admin" => (int)$user['is_super_admin'],
    "data" => [
        "user_id" => $user['id'],
        "username" => $user['username']
    ]
]);
