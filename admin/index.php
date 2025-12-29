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
    <title>Real Estate Dashboard</title>

    <!-- ✅ Bootstrap 5 CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- css style   -->
    <link rel="stylesheet" href="./style.css">
    <!-- <link rel="stylesheet" href="../real-estate-landing-page/css/style.css"> -->

    <!-- toster links   -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

    <!-- Include Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">



</head>

<body>

    <!-- Toast Container for notifications -->
    <div id="toastContainer" style="position: fixed; top: 20px; right: 20px; z-index: 2000;"></div>

    <!-- Sidebar -->
    <?php require_once 'sidebar.php'; ?>
    <!-- <div class="sidebar">


        <div>
            <div>
                <a href="../real-estate-landing-page/index.html" class="landing-page">Landing Page</a>
            </div>
            <div class="mb-4 logout">
                <a href="../pages/logout.php" class="btn btn-danger">Logout</a>
            </div>
        </div>
    </div> -->

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
                <h1 class="display-4">Users</h1>
                <p class="lead">Manage user accounts and permissions</p>
            </div>


            <div>
                <button class="btn btn-primary add-btn" data-bs-toggle="modal"
                    data-bs-target="#addUserModal">+Add</button>
            </div>
        </div>


        <div class="crm-search-box">
            <input type="text" id="search-users" placeholder="Search users..." class="form-control">
            <div id="searchDropdown" class="dropdown"></div>
        </div>



        <div class="table-responsive bg-white rounded shadow-sm">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th style="background-color: white;">S.No</th>
                        <th style="background-color: white;">Full Name</th>
                        <th style="background-color: white;">Username</th>
                        <th style="background-color: white;">Email</th>
                        <th style="background-color: white;">Status</th>
                        <th style="background-color: white;">Actions</th>
                    </tr>
                </thead>
                <tbody id="userTable">
                    <!-- bro db data is coming here, so no static data anymore -->

                </tbody>
            </table>

        </div>

        <div class="lead-pagi mb-2">
            <nav class="mt-3">
                <ul class="pagination" id="UserPagination"></ul>
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

    <!-- Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="border: none;">
                    <h5 class="modal-title" id="addUserLabel" style="font-size: 24px; font-weight: 600;">Add New User
                    </h5>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="modal-body">
                    <form id="userForm">
                        <div class="mb-3">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="name" placeholder="John Smith" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" placeholder="John" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                placeholder="abc@gmail.com" required>
                        </div>
                        <div class="mb-3 position-relative">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" minlength="5"
                                placeholder="12345678" required>
                            <i class="fa fa-eye position-absolute" id="togglePassword"
                                style="top: 47px; right: 15px; cursor: pointer; color: #666;"></i>
                        </div>
                        <div class="mb-3 position-relative">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirmPassword" minlength="5"
                                placeholder="12345678" required>

                            <i class="fa fa-eye position-absolute" id="toggleConfirmPassword"
                                style="top: 47px; right: 15px; cursor: pointer; color: #666;"></i>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Role</label>
                            <select name="role" id="role" class="form-select" required>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="agent">Agent</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="saveUser">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== USER DETAIL MODAL ===== -->
    <div id="userModal" class="user-modal">
        <div class="user-modal-content">
            <div class="user-modal-header">
                <h2 id="modalUserName">User Name</h2>
                <span class="close" onclick="closeUserModal()">&times;</span>
            </div>

            <div class="user-modal-body">
                <div class="user-detail-section">
                    <div class="detail-row">
                        <span class="detail-label">Full Name:</span>
                        <span class="detail-value" id="modalUserFullName">-</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Username:</span>
                        <span class="detail-value" id="modalUserUsername">-</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value" id="modalUserEmail">-</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Role:</span>
                        <span class="detail-value" id="modalUserRole">-</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" id="modalUserStatus">-</span>
                    </div>
                </div>
            </div>

            <div class="user-modal-footer">
                <button class="modal-btn btn btn-secondary" onclick="closeUserModal()">Close</button>
                <button class="modal-btn btn btn-primary" onclick="editUserFromModal()">Edit User</button>
            </div>
        </div>
    </div>
    

    <script src="./api-config.js"></script>
    <script src="./script.js"></script>



</body>

</html>