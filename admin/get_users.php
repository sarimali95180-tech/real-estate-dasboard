<?php
header('Content-Type: application/json');
include './db.php';

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) && $_GET['page'] > 0 ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Count
$countSql = "SELECT COUNT(*) AS total FROM users WHERE is_deleted = 0";
$totalRecords = $conn->query($countSql)->fetch_assoc()['total'];
$totalPages = ceil($totalRecords / $limit);

// Fetch
$sql = "
    SELECT id, fullname, username, email, role, status, is_super_admin
    FROM users
    WHERE is_deleted = 0
    ORDER BY id DESC
    LIMIT $limit OFFSET $offset
";

$result = $conn->query($sql);
$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $users,
    "pagination" => [
        "currentPage" => $page,
        "totalPages" => $totalPages,
        "totalRecords" => $totalRecords,
         "limit" => $limit
    ]
]);

$conn->close();
