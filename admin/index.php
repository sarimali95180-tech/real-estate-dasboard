<?php
session_start();

// Check if session exists
if (!isset($_SESSION['username'])) {
    header("Location: ../pages/login.php");
    exit;
}

// Set session validation token
if (!isset($_SESSION['page_token'])) {
    $_SESSION['page_token'] = md5(uniqid(rand(), true));
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
    <div class="sidebar">
        <div>
            <h4>Real Estate</h4>
            <a href="index.php" class="active"><img src="./images/Vector1.png" alt="1">Users</a>
            <a href="property.php"><img src="./images/Vector2.png" alt="2">Add Properties</a>
            <a href="./lead.html"><i class="fa-solid fa-circle-user"
                    style="padding-right:20px;"></i>Leads</a>

        </div>

        <div>
            <div>
                <a href="../real-estate-landing-page/index.html" class="landing-page">Landing Page</a>
            </div>
            <div class="mb-4 logout">
                <a href="../pages/logout.php" class="btn btn-danger">Logout</a>
            </div>
        </div>
    </div>

    <div class="main-contents">
        <!-- Top Navbar -->
        <div class="topbar">
            <h5 class="m-0" style="color:#2F3A4A;">Property Dashboard</h5>
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

        <div class="table-responsive bg-white rounded shadow-sm">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                    <tr>
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
                            <input type="email" class="form-control" placeholder="abc@gmail.com" id="email" required>
                        </div>
                        <div class="mb-3 position-relative">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="12345678" required>
                            <i class="fa fa-eye position-absolute" id="togglePassword"
                                style="top: 47px; right: 15px; cursor: pointer; color: #666;"></i>
                        </div>
                        <div class="mb-3 position-relative">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" id="confirmPassword" placeholder="12345678"
                                required>
                            <i class="fa fa-eye position-absolute" id="toggleConfirmPassword"
                                style="top: 47px; right: 15px; cursor: pointer; color: #666;"></i>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveUser">Save</button>
                </div>
            </div>
        </div>
    </div>


    <script src="./script.js"></script>

    <script>
        // Display login success toast if set
        <?php if (isset($_SESSION['login_success'])): ?>
            Toastify({
                text: "<?php echo htmlspecialchars($_SESSION['login_success']); ?>",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#28a745",
                close: true,
            }).showToast();
            <?php unset($_SESSION['login_success']); ?>
        <?php endif; ?>
    </script>
</body>

</html>