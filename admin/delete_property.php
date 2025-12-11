<?php
header('Content-Type: application/json');
include './db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid id']);
    exit;
}

// fetch thumbnail path to remove file
$stmt = $conn->prepare('SELECT thumbnail FROM properties WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
$thumb = '';
if ($res && $row = $res->fetch_assoc()) {
    $thumb = $row['thumbnail'];
}
$stmt->close();

// delete record
$stmt2 = $conn->prepare('DELETE FROM properties WHERE id = ?');
$stmt2->bind_param('i', $id);
if ($stmt2->execute()) {
    // remove file if exists and path is not empty
    if (!empty($thumb) && file_exists($thumb)) {
        @unlink($thumb);
    }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt2->error]);
}
$stmt2->close();
$conn->close();
?>