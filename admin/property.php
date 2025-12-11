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
    <div class="sidebar">
        <div>
            <h4>Real Estate</h4>
            <a href="./index.php"><img src="./images/Vector1.png" alt="1">Users</a>
            <a href="./property.html" class="active"><img src="./images/Vector2.png" alt="2">Add Properties</a>
            <a href="./lead.html"><i class="fa-solid fa-circle-user" style="padding-right:20px;"></i>Leads</a>
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
                <h1 class="display-4">All Properties</h1>
                <p class="lead">Browse and manage your property listings</p>
            </div>
            <div>

                <button class="btn btn-primary add-btn" data-bs-toggle="modal"
                    data-bs-target="#addUserModal">+Add</button>
            </div>
        </div>

        <div id="propertyContainer" class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>area</th>
                        <th>bathroom</th>
                        <th>property_type</th>
                        <th>price</th>
                        <th>Location</th>
                        <th>Thumbnail</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="propertiesList">
                    <tr>
                        <!-- <td colspan="6" class="text-center text-muted">No properties added yet. Click "+Add" to create
                            one.</td> -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    </div>

    <!-- Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-contents">
                <div class="modal-header" style="border: none;">
                    <h5 class="modal-title" id="addUserLabel" style="font-size: 24px; font-weight: 600;">Add Property
                    </h5>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="modal-body">

                    <form id="propertyForm" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label class="form-label">Title</label>
                            <input type="text" class="form-control" name="title" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <input type="text" class="form-control" name="description" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Bedroom</label>
                            <input type="number" class="form-control" name="category" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Bathroom</label>
                            <input type="number" class="form-control" name="bathroom" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Price</label>
                            <input type="number" class="form-control" name="price" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Area</label>
                            <input type="number" class="form-control" name="area" required>
                        </div>


                        <label class="form-label">Property-Type</label>
                        <select name="property_type" class="form-select mb-3">
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="FarmHouse">FarmHouse</option>
                        </select>

                        <div class="mb-3">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-control" name="location" required>
                            <!-- Add this after your form -->
                            <ul id="locationSuggestions" class="list-group position-absolute"
                                style="z-index:1000; display:none;"></ul>

                        </div>

                        <div class="mb-3">
                            <label class="form-label">Thumbnail</label>
                            <input type="file" name="thumbnail" class="form-control">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Full Content</label>
                            <!-- <textarea name="content" id="content" class="form-control"></textarea> -->
                            <textarea name="content" id="editor"></textarea>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">Submit</button>
                        </div>
                    </form>





                </div>
            </div>
        </div>


        <script src="./script.js"></script>

        <script>

        </script>

</body>

</html>