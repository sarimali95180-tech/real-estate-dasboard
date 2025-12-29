<?php
header('Content-Type: application/json');
// session_start();
include './db.php';
include '../config/const-auth.php';
require './middleware/auth_middleware.php';

// only Admin or Super Admin
requireAdmin();

/* ---------- AUTH CHECK ---------- */
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$user_id = (int) $_SESSION['user_id'];

/* ---------- REQUEST METHOD CHECK ---------- */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ---------- REQUIRED ID ---------- */
    $id = (int) ($_POST['id'] ?? 0);
    if ($id <= 0) {
        throw new Exception("Property ID is required");
    }

    /* ---------- INPUT DATA ---------- */
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';
    $area = (int) ($_POST['area'] ?? 0);
    $bathroom = (int) ($_POST['bathroom'] ?? 0);
    $property_type = $_POST['property_type'] ?? '';
    $price = (int) ($_POST['price'] ?? 0);
    $location = $_POST['location'] ?? '';
    $content = $_POST['content'] ?? '';
    $thumbnailUrl = $_POST['thumbnail_url'] ?? '';

    /* ---------- FETCH OLD IMAGE (OWNER CHECK) ---------- */
    $oldImage = null;

    $imgStmt = $conn->prepare(
        "SELECT thumbnail 
         FROM properties 
         WHERE id = ? AND user_id = ?"
    );
    $imgStmt->bind_param("ii", $id, $user_id);
    $imgStmt->execute();
    $imgStmt->bind_result($oldImage);
    $imgStmt->fetch();
    $imgStmt->close();

    /* 🔥 BLOCK UNAUTHORIZED USER */
    if ($oldImage === null) {
        throw new Exception("You are not allowed to edit this property");
    }

    /* ---------- THUMBNAIL LOGIC ---------- */
    if (!empty($thumbnailUrl)) {
        // new thumbnail (cloudinary or url)
        $finalThumbnail = $thumbnailUrl;
    } else {
        // keep old thumbnail
        $finalThumbnail = $oldImage;
    }

    /* ---------- GEOCODING ---------- */
    $latitude = null;
    $longitude = null;

    if (!empty($location)) {
        $geoUrl = GEOCODE_MAPS_API_URL . "?q=" . urlencode($location) . "&api_key=" . GEOCODE_MAPS_API_KEY;
        $geoResponse = @file_get_contents($geoUrl);

        if ($geoResponse) {
            $geoData = json_decode($geoResponse, true);
            if (!empty($geoData[0])) {
                $latitude = (float) $geoData[0]['lat'];
                $longitude = (float) $geoData[0]['lon'];
            }
        }
    }

    /* ---------- UPDATE QUERY ---------- */
    $stmt = $conn->prepare(
        "UPDATE properties SET
            title = ?, 
            description = ?, 
            category = ?, 
            area = ?, 
            bathroom = ?,
            property_type = ?, 
            price = ?, 
            location = ?, 
            content = ?, 
            thumbnail = ?,
            latitude = ?, 
            longitude = ?
         WHERE id = ? AND user_id = ?"
    );

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param(
        "ssiiisisssddii",
        $title,
        $description,
        $category,
        $area,
        $bathroom,
        $property_type,
        $price,
        $location,
        $content,
        $finalThumbnail,
        $latitude,
        $longitude,
        $id,
        $user_id
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    /* ---------- COMMIT ---------- */
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Property updated successfully",
        "id" => $id,
        "thumbnail" => $finalThumbnail,
        "latitude" => $latitude,
        "longitude" => $longitude
    ]);

} catch (Exception $e) {

    /* ---------- ROLLBACK ---------- */
    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
