<?php
require_once 'auth.php';

// only admin allowed
if ($role !== 'admin') {
    header("Location: property.php");
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Real Estate Dashboard - Properties</title>

    <!-- ✅ Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- ck-editors  -->
    <!-- <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script> -->
    <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>



    <!-- css style -->
    <link rel="stylesheet" href="./style.css">

    <!-- toster links   -->

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>



</head>

<body>

    <!-- Sidebar -->
    <?php require_once 'sidebar.php'; ?>


    <div class="main-contents">
        <!-- Top Navbar -->
        <div class="topbar">
            <h5 class="m-0" style="color:#2F3A4A;">Property Dashboard</h5>
            <button id="sidebarToggle" class="hamburger d-lg-none">
                <span></span>
                <span></span>
                <span></span>
            </button>

        </div>
    </div>


    <!-- Main Content -->

    <div class="main-content">
        <div class="jumbotron jumbotron-fluid mb-5 d-flex justify-content-between align-items-center">
            <div class="container">
                <h1 class="display-4">All Leads</h1>
                <p class="lead">Browse and manage your Clients</p>
            </div>

        </div>

        <div class="crm-search-box">
            <input type="text" id="search-leads" placeholder="Search leads..." class="form-control">
            <div id="searchDropdown" class="dropdown"></div>
        </div>

        <div id="propertyContainer" class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>S.No</th>
                        <!-- <th>ID</th> -->
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th style="text-align:center">Actions</th>
                    </tr>
                </thead>
                <tbody id="leadList">
                    <tr>
                        <td colspan="5" class="text-center text-muted">Loading inquiries...</td>
                    </tr>
                </tbody>
            </table>
            <div class="lead-pagi mb-2">
                <nav class="mt-3">
                    <ul class="pagination" id="leadPagination"></ul>
                </nav>
                <div style="display: flex; align-items: center;">
                    <label class="me-2 fw-semibold">Rows per page:</label>
                    <select id="pageLimit" class="form-select w-auto">
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>


        </div>

    </div>

    <script src="./lead-script.js"></script>

</body>

</html>