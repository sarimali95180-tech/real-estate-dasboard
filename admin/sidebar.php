<?php
require_once 'auth.php';

$isAdmin = ($role === 'admin');
$currentPage = basename($_SERVER['PHP_SELF']);
?>

<div class="sidebar">

    <div>
        <h4>Real Estate</h4>

        <!-- Users (ADMIN ONLY) -->
        <?php if ($isAdmin): ?>
            <a href="index.php" class="<?= $currentPage === 'index.php' ? 'active' : '' ?>">
                <img src="./images/Vector1.png" alt="1"> Users
            </a>
        <?php endif; ?>

        <!-- Properties -->
        <a href="property.php" class="<?= $currentPage === 'property.php' ? 'active' : '' ?>">
            <img src="./images/Vector2.png" alt="2"> Add Properties
        </a>

        <!-- Leads (ADMIN ONLY) -->
        <?php if ($isAdmin): ?>
            <a href="lead.php" class="<?= $currentPage === 'lead.php' ? 'active' : '' ?>">
                <i class="fa-solid fa-circle-user" style="padding-right:20px;"></i> Leads
            </a>
        <?php endif; ?>
    </div>

    <div>
        <a href="../real-estate-landing-page/index.html" class="landing-page">
            Landing Page
        </a>
        <div class="mb-4 logout">
            <a href="../pages/logout.php" class="btn btn-danger">Logout</a>
        </div>
    </div>
</div>