<?php
session_start();

// If session or cookie doesn't exist, redirect to login
if (!isset($_SESSION['username']) && !isset($_COOKIE['username'])) {
    header("Location: login.php");
    exit;
}

// Set session start time if not already set
if (!isset($_SESSION['start_time'])) {
    $_SESSION['start_time'] = time();
}

// Session timeout in seconds (3 seconds for demo)
$timeout = 10;

if (time() - $_SESSION['start_time'] > $timeout) {
    // Session expired
    session_unset();
    session_destroy();
    setcookie("username", "", time() - 3600, "/");
    echo "<script>
        alert('Session expired!');
        window.location.href = 'login.php';
    </script>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>
    <div class="container mt-5 text-center">
        <h1>Welcome, <?php echo $_SESSION['username'] ?? $_COOKIE['username']; ?>!</h1>
        <p>This is your real estate dashboard.</p>

        <div class="alert alert-warning mt-4">
            You will be automatically logged out in <span id="countdown">10</span> seconds.
        </div>

        <button class="btn btn-danger" onclick="logout()">Logout Now</button>
    </div>





    <script>
        // Logout function
        function logout() {
            localStorage.removeItem('token'); // clear token
            window.location.href = 'logout.php';
        }

        // Countdown timer
        let timeLeft = 10;
        const countdownEl = document.getElementById('countdown');

        const timer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                logout();
            }
        }, 1000);
    </script>
</body>

</html>