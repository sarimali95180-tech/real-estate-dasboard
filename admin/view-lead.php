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
    <title>Real Estate Dashboard - Leads</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

    <!-- CSS -->
    <link rel="stylesheet" href="./style.css">
</head>

<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <div>
            <h4>Real Estate</h4>
            <a href="./index.php"><img src="./images/Vector1.png">Users</a>
            <a href="./property.php"><img src="./images/Vector2.png">Add Properties</a>
            <a href="./lead.php" class="active"><i class="fa-solid fa-circle-user"
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
        <div class="topbar">
            <h5 class="m-0" style="color:#2F3A4A;">Lead Details</h5>
        </div>
    </div>

    <!------------ MAIN CONTENT START ------------>

    <div class="main-content">
        <div class="wrap">
            <h2 class="mb-4">Client Details</h2>
            <!-- Lead Info Section -->
            <header class="top-card">

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-regular fa-user"></i></div>
                        <div class="meta-title">Full Name:</div>
                    </div>
                    <div class="meta-text" id="fullname">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-regular fa-envelope"></i></div>
                        <div class="meta-title">Email:</div>
                    </div>
                    <div class="meta-text" id="email">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-solid fa-phone"></i></div>
                        <div class="meta-title">Phone Number:</div>
                    </div>
                    <div class="meta-text" id="phone">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-solid fa-dollar-sign"></i></div>
                        <div class="meta-title">Budget:</div>
                    </div>
                    <div class="meta-text" id="budget">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-solid fa-clock"></i></div>
                        <div class="meta-title">Best Time to Contact:</div>
                    </div>
                    <div class="meta-text" id="contact_time">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-solid fa-bullseye"></i></div>
                        <div class="meta-title">Purpose of Buying:</div>
                    </div>
                    <div class="meta-text" id="purpose">Loading...</div>
                </div>

                <div class="info-block">
                    <div class="form-lebel">
                        <div class="meta-icon"><i class="fa-solid fa-message"></i></div>
                        <div class="meta-title">Message:</div>
                    </div>
                    <div class="meta-text" id="message">Loading...</div>
                </div>

            </header>

            <!-- Property Section -->

            <h2 class="mb-3 mt-5">Property Details</h2>
            <section class="main">
                <div class="image-card">
                    <img id="thumbnail" src="./images/Rectangle 672.png" alt="Property">
                </div>

                <div class="details">
                    <div>
                        <div class="breadcrumbs">
                            <div class="search">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <span id="pproperty_type">Loading...</span>
                            </div>
                            <div class="location">
                                <i class="fa-solid fa-location-dot"></i>
                                <span id="property_location">Loading...</span>
                            </div>
                        </div>

                        <div class="title-row">
                            <div>
                                <div class="title" id="title">Loading...</div>
                            </div>
                            <div class="price" id="price">$0</div>
                        </div>
                    </div>

                    <div class="stats stat-card-main">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-bed"></i></div>
                            <div class="stat-body">
                                <div class="muted">Bedrooms</div>
                                <div class="stat-num" id="category">0</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-bath"></i></div>
                            <div class="stat-body">
                                <div class="muted">Bathroom</div>
                                <div class="stat-num" id="bathroom">0</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon"><i class="fa-solid fa-ruler"></i></div>
                            <div class="stat-body">
                                <div class="muted">Area</div>
                                <div class="stat-num" id="area">0 sq ft</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon"><i class="fa-regular fa-calendar"></i></div>
                            <div class="stat-body">
                                <div class="muted">Calender</div>
                                <div class="stat-num" id="calender">00-00-0000</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <div class="desc-card">
                <h3>Description</h3>
                <p id="description">Loading...</p>
            </div>

        </div>
    </div>

    <!------------ JS TO LOAD DATA ------------>

    <script>
        function escapeHtml(text) {
            if (text === null || text === undefined) return "";

            // Convert non-string values (numbers, objects) to string
            if (typeof text !== "string") text = String(text);

            return text.replace(/[&<>"']/g, (m) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m]));
        }


        async function loadLead() {
            const urlParams = new URLSearchParams(window.location.search);
            const leadId = urlParams.get("id");

            if (!leadId) {
                alert("Invalid Lead ID");
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost/real_estate_dashboard/admin/get-lead-details.php?id=${leadId}`
                );

                const result = await res.json();

                if (result.status !== "success") {
                    alert(result.message);
                    return;
                }

                const lead = result.lead;
                const property = result.property || {};

                // ---- Fill Lead Data ----
                document.getElementById("fullname").innerText = escapeHtml(lead.fullname);
                document.getElementById("email").innerText = escapeHtml(lead.email);
                document.getElementById("phone").innerText = escapeHtml(lead.phonenumber);
                document.getElementById("budget").innerText = `$${escapeHtml(lead.budget)}`;
                document.getElementById("purpose").innerText = escapeHtml(lead.purpose);
                document.getElementById("message").innerText = escapeHtml(lead.message);
                document.getElementById("contact_time").innerText = escapeHtml(lead.contact_time);

                // ---- Fill Property Data ----
                document.getElementById("title").innerText = escapeHtml(property.title || "N/A");

                document.getElementById("price").innerText = `$${property.price || 0}`;

                document.getElementById("pproperty_type").innerText = escapeHtml(property.property_type || "N/A");

                document.getElementById("property_location").innerText = escapeHtml(property.location || "N/A");

                document.getElementById("category").innerText = escapeHtml(property.category || "0");

                document.getElementById("bathroom").innerText =
                    escapeHtml(property.bathroom || property.bathrooms || "0");

                document.getElementById("area").innerText = escapeHtml((property.area || "0") + " sq ft");

                document.getElementById("calender").innerText =
                    escapeHtml((property.created_at || "0"));


                document.getElementById("description").innerText = escapeHtml(property.description || "No description available.");


                if (property.thumbnail) {
                    document.getElementById("thumbnail").src = property.thumbnail;
                }



            } catch (err) {
                console.error(err);
                alert("Failed to load data.");
            }
        }

        document.addEventListener("DOMContentLoaded", loadLead);
    </script>

</body>

</html>