<?php
header('Content-Type: application/json');
include './db.php';

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$required = ['fullname', 'username', 'email', 'password', 'role', 'status'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode([
            "success" => false,
            "message" => "$field is required"
        ]);
        exit;
    }
}

$fullname = trim($data['fullname']);
$username = trim($data['username']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$role = $data['role'];
$status = $data['status'];

// Role based access control
if (!in_array($role, ['admin', 'agent'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid role"
    ]);
    exit;
}

// Check email existence
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "A user with this email already exists"
    ]);
    exit;
}

// Insert user
$stmt = $conn->prepare(
    "INSERT INTO users (fullname, role, username, email, password, status)
     VALUES (?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "ssssss",
    $fullname,
    $role,
    $username,
    $email,
    $password,
    $status
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User added successfully",
        "id" => $conn->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}
?>