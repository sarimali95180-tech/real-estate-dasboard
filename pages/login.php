<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Real Estate Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Toastify.js for toast notifications -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

</head>

<body class="d-flex align-items-center justify-content-center vh-100" style="
    background: url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500') 
    no-repeat center center/cover;
">
    <div class="card shadow-lg p-4"
        style="width: 100%; max-width: 400px; background-color: rgba(255,255,255,0.95); backdrop-filter: blur(10px)">
        <div class="text-center mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/619/619034.png" alt="Logo" width="60" class="mb-3">
            <h3 class="fw-bold text-primary">Real Estate Login</h3>
            <p class="text-muted mb-0">Access your property dashboard</p>
        </div>

        <form id="loginForm">

            <div class="mb-3">
                <label for="username" class="form-label fw-semibold">Username</label>
                <input type="text" class="form-control" name="username" id="username" placeholder="Enter username"
                    required>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label fw-semibold">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder="Enter password"
                    required>


            </div>

            <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>

        <p class="text-center text-muted mt-3 mb-0">
            Don’t have an account?
            <a href="users.html" class="text-decoration-none">Register here</a>
        </p>
    </div>

    <script>
        // Display login error toast if set
        <?php if (isset($_SESSION['login_error'])): ?>
            Toastify({
                text: "<?php echo htmlspecialchars($_SESSION['login_error']); ?>",
                duration: 4000,
                gravity: "top",
                position: "right",
                backgroundColor: "#dc3545",
                close: true,
            }).showToast();
            <?php unset($_SESSION['login_error']); ?>
        <?php endif; ?>

        // Display logout success toast if query parameter is set
        <?php if (isset($_GET['logout']) && $_GET['logout'] === 'success'): ?>
            Toastify({
                text: "You have been logged out successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#28a745",
                close: true,
            }).showToast();

            // Remove logout parameter from URL to prevent showing toast on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        <?php endif; ?>
    </script>

    <script src="./login-script.js"></script>
</body>

</html>