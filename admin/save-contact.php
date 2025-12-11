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

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $fullname = $_POST["fullname"] ?? '';
    $email = $_POST["email"] ?? '';
    $phonenumber = $_POST["phonenumber"] ?? '';
    $city = $_POST["city"] ?? '';
    $property_type = $_POST["property_type"] ?? '';
    $budget = $_POST["budget"] ?? '';
    $purpose = $_POST["purpose"] ?? '';
    $location = $_POST["location"] ?? '';
    $message = $_POST["message"] ?? '';
    $contact_time = $_POST["contact_time"] ?? '';
    $property_id = $_POST["property_id"] ?? ''; // <-- NEW FIELD

    // INSERT updated with property_id
    $stmt = $conn->prepare("INSERT INTO leads 
        (fullname, email, phonenumber, city, property_type, budget, purpose, location, message, contact_time, property_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    // Added one more "s" for new string field
    $stmt->bind_param("sssssssssss",
        $fullname,
        $email,
        $phonenumber,
        $city,
        $property_type,
        $budget,
        $purpose,
        $location,
        $message,
        $contact_time,
        $property_id
    );

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save data"]);
    }

    $stmt->close();
    $conn->close();
}
?>
