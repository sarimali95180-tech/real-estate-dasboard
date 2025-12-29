<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include './db.php';


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $fullname = $_POST["fullname"] ?? '';
    $email = $_POST["email"] ?? '';
    $phonenumber = $_POST["phonenumber"] ?? '';
    $budget = $_POST["budget"] ?? '';
    $purpose = $_POST["purpose"] ?? '';
    $message = $_POST["message"] ?? '';
    $contact_time = $_POST["contact_time"] ?? '';
    $property_id = $_POST["property_id"] ?? ''; // <-- NEW FIELD

    // INSERT updated with property_id
    $stmt = $conn->prepare("INSERT INTO leads 
        (fullname, email, phonenumber, budget, purpose, message, contact_time, property_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    // Added one more "s" for new string field
    $stmt->bind_param(
        "ssssssss",
        $fullname,
        $email,
        $phonenumber,
        $budget,
        $purpose,
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