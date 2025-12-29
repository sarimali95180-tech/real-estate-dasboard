<?php
header('Content-Type: application/json');
include './db.php';

// Get search query from GET parameter
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

// If search query is empty, return empty results
if (empty($searchQuery)) {
    echo json_encode([
        "success" => true,
        "data" => []
    ]);
    $conn->close();
    exit;
}

// Prepare statement to prevent SQL injection
$search = '%' . $searchQuery . '%';
$sql = "
    SELECT id, fullname, username, email, role, status
    FROM users
    WHERE (username LIKE ? OR fullname LIKE ?)
    AND is_deleted = 0
    
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// Response
echo json_encode([
    "success" => true,
    "data" => $users
]);

$stmt->close();
$conn->close();
?>
