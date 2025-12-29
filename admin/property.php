<?php
require_once 'auth.php';

// admin & agent both allowed
if (!in_array($role, ['admin', 'agent'])) {
    header("Location: login.php");
    exit;
}
// ✅ ADD THIS LINE
$isAdmin = ($role === 'admin');
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
                <h1 class="display-4">All Properties</h1>
                <p class="lead">Browse and manage your property listings</p>
            </div>
            <div>

                <?php if ($isAdmin): ?>
                    <button class="btn btn-primary add-btn" data-bs-toggle="modal"
                        data-bs-target="#addUserModal">+Add</button>
                <?php endif; ?>

            </div>
        </div>

        <div class="crm-search-box">
            <input type="text" id="search-property" placeholder="Search properties..." class="form-control">
            <div id="searchDropdown" class="dropdown"></div>
        </div>

        <div id="propertyContainer" class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>S.No</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>area</th>
                        <th>bathroom</th>
                        <th>property_type</th>
                        <th>price</th>
                        <th>Location</th>
                        <th>Thumbnail</th>
                        <?php if ($isAdmin): ?>
                            <th>Actions</th>
                        <?php endif; ?>
                    </tr>
                </thead>
                <tbody id="propertiesList">
                    <tr>
                        <!-- <td colspan="6" class="text-center text-muted">No properties added yet. Click "+Add" to create
                            one.</td> -->
                    </tr>
                </tbody>
            </table>
            <div class="lead-pagi mb-2">
                <nav class="mt-3">
                    <ul class="pagination" id="PropertyPagination"></ul>
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

    </div>

    <!-- Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-contents">
                <div class="modal-header" style="border: none;">
                    <h5 class="modal-title" id="modalTitle" style="font-size: 24px; font-weight: 600;">Add Property
                    </h5>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="modal-body">

                    <form id="propertyForm" enctype="multipart/form-data">

                        <!-- //////////    -->
                        <input type="hidden" name="id" id="propertyId">

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
    </div>

    <!-- Property Details Modal -->
    <div id="propertyModal" class="p-modal">
        <div class="modal-content">
            <div class="property-detail-nav">
                <h3>Property Details</h3><span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img id="modalPropertyImage" src="" alt="property">
                </div>
                <div class="modal-details">
                    <div class="modal-location-flex">
                        <div>
                            <div class="modal-location">
                                <div style="display: flex; gap: 5px;">
                                    <i class="fa-solid fa-magnifying-glass" style="color: #2563eb"></i>
                                    <h4 id="modalPropertyType"></h4>
                                </div>
                                <div style="display: flex; gap: 5px;">
                                    <i class="fa-solid fa-location-dot" style="color: #2563eb"></i>
                                    <h4 id="modalPropertyLocation"></h4>
                                </div>
                            </div>
                            <h2 id="modalPropertyTitle"></h2>
                        </div>
                        <div class="info-item">
                            <span id="modalPrice" class="price"></span>
                        </div>
                    </div>
                    <div class="modal-info">
                        <div class="info-item">
                            <i class="fa-solid fa-bed"></i>
                            <p></p>
                            <span id="modalcategory"></span>
                        </div>
                        <div class="info-item">
                            <i class="fa-solid fa-shower"></i>
                            <span id="modalBathrooms"></span>
                        </div>
                        <div class="info-item">
                            <i class="fa-solid fa-ruler"></i>
                            <span id="modalSize"></span>
                        </div>
                        <div class="info-item">
                            <i class="fa-regular fa-calendar"></i>
                            <span id="modalCalender"></span>
                        </div>

                    </div>
                    <!-- <h3>Description</h3> -->
                    <p id="modalPropertyDescription"></p>

                    <!-- <h3>Key Features</h3> -->
                    <p id="modalPropertyKeyFeatures" style="overflow-wrap: anywhere; "></p>

                    <div id="modalMap"></div>


                    <div class="modal-actions">
                        <!-- <button class="modal-btn btn">Schedule Viewing</button> -->
                        <a id="contactBtn" class="modal-btn btn" onclick="contactAgent(); return false;">Contact Agent</a>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script>
        const USER_ROLE = "<?= $role ?>";
    </script>

    <script src="./api-config.js"></script>
    <script src="./script.js"></script>


</body>

</html>