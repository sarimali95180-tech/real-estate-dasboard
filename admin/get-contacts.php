<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "real_estate";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$sql = "SELECT id, fullname, email, phonenumber FROM leads ORDER BY id DESC";
$result = $conn->query($sql);

$inquiries = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inquiries[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $inquiries]);

$conn->close();
?>
