<?php
session_start();

// Include database connection
include '../admin/db.php';

// Get values from POST
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Validate inputs
if (empty($username) || empty($password)) {
    $_SESSION['login_error'] = 'Please enter both username and password!';
    header("Location: login.php");
    exit;
}

// Prepare statement to fetch user from database
$stmt = $conn->prepare("SELECT id, username, email, password, status FROM users WHERE username = ?");

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind the username parameter
$stmt->bind_param("s", $username);

// Execute query
if (!$stmt->execute()) {
    die("Execute failed: " . $stmt->error);
}

// Get the result
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Check if user is active
    if ($user['status'] !== 'active') {
        $_SESSION['login_error'] = 'Your account is inactive. Please contact administrator!';
        header("Location: login.php");
        exit;
    }
    
    // Verify password using password_verify
    if (password_verify($password, $user['password'])) {
        // Password is correct, set session data
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['user_id'] = $user['id'];
        
        // Set session validation token
        $_SESSION['page_token'] = md5(uniqid(rand(), true));
        $_SESSION['login_success'] = 'Login successful! Welcome ' . $user['username'];

        // Redirect to dashboard
        header("Location: ../admin/index.php");
        exit;
    } else {
        // Password is incorrect
        $_SESSION['login_error'] = 'Invalid username or password!';
        header("Location: login.php");
        exit;
    }
} else {
    // User not found
    $_SESSION['login_error'] = 'Invalid username or password!';
    header("Location: login.php");
    exit;
}

?>