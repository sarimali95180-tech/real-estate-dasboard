<?php
session_start();
include './db.php'; // your DB connection file

// Handle JSON POST request for updating user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit;
    }

    $id = isset($input['id']) ? intval($input['id']) : null;
    $fullname = isset($input['fullname']) ? trim($input['fullname']) : '';
    $username = isset($input['username']) ? trim($input['username']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? trim($input['password']) : ''; // optional
    $status = isset($input['status']) ? trim($input['status']) : 'active';

    // Validate required fields
    if (!$id || !$fullname || !$username || !$email) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    // Check duplicate username/email (excluding current user)
    $stmt = $conn->prepare("SELECT id FROM users WHERE (username=? OR email=?) AND id!=?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("ssi", $username, $email, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username or Email already taken']);
        exit;
    }

    // Update query
    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET fullname=?, username=?, email=?, password=?, status=? WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("sssssi", $fullname, $username, $email, $hashedPassword, $status, $id);
    } else {
        $stmt = $conn->prepare("UPDATE users SET fullname=?, username=?, email=?, status=? WHERE id=?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("ssssi", $fullname, $username, $email, $status, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update user: ' . $stmt->error]);
    }
    exit;
}
?>