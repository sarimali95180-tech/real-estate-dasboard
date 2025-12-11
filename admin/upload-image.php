<?php
header('Content-Type: application/json');

// Cloudinary Upload Preset + Cloud Name
$cloudName = "YOUR_CLOUD_NAME";
$uploadPreset = "YOUR_UPLOAD_PRESET";

// If file not detected
if (!isset($_FILES['image'])) {
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
    exit;
}

$image = $_FILES['image']['tmp_name'];

// Cloudinary URL
$cloudinaryUrl = "https://api.cloudinary.com/v1_1/$cloudName/image/upload";

// Create POST request
$postFields = [
    'file' => new CURLFile($image),
    'upload_preset' => $uploadPreset
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $cloudinaryUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if (isset($result["secure_url"])) {
    $url = $result["secure_url"];

    // ✔️ Store URL in database here  
    /*  
    include "db.php";
    $stmt = $conn->prepare("INSERT INTO properties (image_url) VALUES (?)");
    $stmt->bind_param("s", $url);
    $stmt->execute();
    */

    echo json_encode(["success" => true, "url" => $url]);
} else {
    echo json_encode(["success" => false, "error" => $result]);
}
