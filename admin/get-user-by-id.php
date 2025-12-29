<?php
require_once 'db.php';

header('Content-Type: application/json');

// Get user ID from query parameter
$userId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(['error' => 'User ID is required']);
    exit;
}

try {
    // Prepare and execute query
    $stmt = $conn->prepare("SELECT id, fullname, username, email, role, status FROM users WHERE id = ? AND is_deleted = 0");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Return user data as JSON
    echo json_encode($user);
    
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>
