<?php
include './db.php';


$data = json_decode(file_get_contents("php://input"), true);

$fullname = $data['fullname'];
$username = $data['username'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$status = $data['status'];
// 

// 
$response = [];

$checkExistance = $conn->prepare("SELECT * FROM users WHERE email = ?");

// Bind the email parameter
$checkExistance->bind_param("s", $email);

// execute query
$checkExistance->execute();

// Get the result
$result = $checkExistance->get_result();


// Check if any row exists
if ($result->num_rows > 0) {
    $response['success'] = false;
    $response['message'] = 'A user with this email already existed';
    echo json_encode($response);
    exit;
}


$stmt = $conn->prepare("INSERT INTO users (fullname, username, email, password, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $fullname, $username, $email, $password, $status);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = "User added successfully";
    $response['id'] = $conn->insert_id;
} else {
    $response['success'] = false;
    $response['message'] = "Error: " . $stmt->error;
}

echo json_encode($response);
?>