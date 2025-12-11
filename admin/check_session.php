<?php
session_start();

// Check if session exists
if (!isset($_SESSION['username'])) {
    // No session found, redirect to login
    header("Location: ../pages/login.php");
    exit;
}

// Check if this is a new tab/window
if (!isset($_SESSION['session_created_time'])) {
    $_SESSION['session_created_time'] = time();
}

// Verify session is still valid
if (time() - $_SESSION['session_created_time'] > 86400) { // 24 hours
    // Session expired
    session_unset();
    session_destroy();
    header("Location: ../pages/login.php");
    exit;
}
?>
