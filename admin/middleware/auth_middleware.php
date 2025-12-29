<?php
/**
 * AUTH MIDDLEWARE
 * Usage:
 * require '../middleware/auth_middleware.php';
 * requireLogin();
 * requireAdmin();
 * requireSuperAdmin();
 */

session_start();

/**
 * Require user to be logged in
 */
function requireLogin()
{
    if (!isset($_SESSION['user_id'])) {
        sendError("Unauthorized. Please login.");
    }
}

/**
 * Require admin role
 */
function requireAdmin()
{
    requireLogin();

    if ($_SESSION['role'] !== 'admin') {
        sendError("Admin access required.");
    }
}

/**
 * Require super admin
 */
function requireSuperAdmin()
{
    requireAdmin();

    if (empty($_SESSION['is_super_admin']) || $_SESSION['is_super_admin'] != 1) {
        sendError("Super Admin access required.");
    }
}

/**
 * JSON error response & exit
 */
function sendError($message, $code = 403)
{
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message
    ]);
    exit;
}
