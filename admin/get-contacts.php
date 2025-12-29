<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include './db.php';


/* ===== PAGINATION SETTINGS ===== */
$limit = isset($_GET['limit'])
    ? (int) $_GET['limit']
    : 10;

$page = isset($_GET['page']) && $_GET['page'] > 0 ? (int) $_GET['page'] : 1;
$offset = ($page - 1) * $limit;

/* ===== TOTAL RECORDS ===== */
$countResult = $conn->query("SELECT COUNT(*) AS total FROM leads");
$totalRecords = $countResult->fetch_assoc()['total'];
$totalPages = ceil($totalRecords / $limit);

/* ===== FETCH LEADS ===== */
$stmt = $conn->prepare("
    SELECT id, fullname, email, phonenumber
    FROM leads
    ORDER BY id DESC
    LIMIT ? OFFSET ?
");
$stmt->bind_param("ii", $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$inquiries = [];

while ($row = $result->fetch_assoc()) {
    $inquiries[] = $row;
}

/* ===== RESPONSE ===== */
echo json_encode([
    "status" => "success",
    "data" => $inquiries,
    "pagination" => [
        "currentPage" => $page,
        "totalPages" => $totalPages,
        "totalRecords" => $totalRecords
    ]
]);

$conn->close();
