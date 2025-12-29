<?php
header('Content-Type: application/json');
include './db.php';

// Get search query
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

// Empty search → empty result
if ($searchQuery === '') {
    echo json_encode([
        "success" => true,
        "data" => []
    ]);
    $conn->close();
    exit;
}

// LIKE keyword
$search = '%' . $searchQuery . '%';

// Search by fullname, email, phone, purpose
$sql = "
    SELECT 
        id,
        fullname,
        email,
        phonenumber,
        budget,
        purpose
    FROM leads
    WHERE 
        fullname LIKE ?
        OR email LIKE ?
        OR phonenumber LIKE ?
        OR purpose LIKE ?
    ORDER BY created_at DESC
    LIMIT 10
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $search, $search, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$leads = [];
while ($row = $result->fetch_assoc()) {
    $leads[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $leads
]);

$stmt->close();
$conn->close();
?>
