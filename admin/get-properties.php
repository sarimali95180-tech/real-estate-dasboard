<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include './db.php';

// ===== PAGINATION SETTINGS =====
$limit = isset($_GET['limit'])
    ? (int) $_GET['limit']
    : 10;

$page = isset($_GET['page']) && $_GET['page'] > 0 ? (int) $_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Base URL
$baseUrl = "http://localhost/real_estate_dashboard/admin";

// ===== COUNT TOTAL RECORDS =====
$countSql = "
    SELECT COUNT(*) AS total
    FROM properties
    WHERE is_deleted = 0
";

$countResult = $conn->query($countSql);
$totalRecords = $countResult->fetch_assoc()['total'];
$totalPages = ceil($totalRecords / $limit);

// ===== FETCH PAGINATED DATA =====
$sql = "SELECT id, title, description, category, area, created_at, bathroom,
               property_type, price, location, latitude, longitude, content, thumbnail
        FROM properties
        WHERE is_deleted = 0
        ORDER BY id DESC
        LIMIT $limit OFFSET $offset";

$result = $conn->query($sql);
$properties = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // Thumbnail handling
        if (!empty($row['thumbnail'])) {

            // If NOT an external URL, treat as local file
            if (strpos($row['thumbnail'], 'http') !== 0) {

                if (strpos($row['thumbnail'], 'uploads/') !== 0) {
                    $row['thumbnail'] = 'uploads/' . $row['thumbnail'];
                }

                $row['thumbnail'] = $baseUrl . '/' . $row['thumbnail'];
            }

        } else {
            // Default image
            $row['thumbnail'] = $baseUrl . '/uploads/1.png';
        }


        $properties[] = $row;
    }
}

// ===== RESPONSE =====
echo json_encode([
    "success" => true,
    "data" => $properties,
    "pagination" => [
        "currentPage" => $page,
        "totalPages" => $totalPages,
        "totalRecords" => $totalRecords,
        "limit" => $limit
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$conn->close();
