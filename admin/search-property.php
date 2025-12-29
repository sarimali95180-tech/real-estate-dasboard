<?php
header('Content-Type: application/json');
include './db.php';

// Get search query
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

// If empty → return empty result
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

// Search by title, location, property_type
$sql = "
    SELECT 
        id,
        title,
        location,
        property_type,
        price,
        thumbnail
    FROM properties
    WHERE (
        title LIKE ?
        OR location LIKE ?
        OR property_type LIKE ?
    )
    AND is_deleted = 0
    ORDER BY created_at DESC
    LIMIT 10
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $search, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$properties = [];
while ($row = $result->fetch_assoc()) {
    $properties[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $properties
]);

$stmt->close();
$conn->close();
?>
