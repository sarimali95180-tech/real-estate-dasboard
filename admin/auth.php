<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../pages/login.php");
    exit;
}

$role = $_SESSION['role'];

// Session expiry (24h)
if (time() - $_SESSION['session_created_time'] > 86400) {
    session_unset();
    session_destroy();
    header("Location: ../pages/login.php");
    exit;
}
