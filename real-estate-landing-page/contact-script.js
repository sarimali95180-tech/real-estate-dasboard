 
        function getPropertyIdFromURL() {
            const params = new URLSearchParams(window.location.search);
            return params.get("property_id");
        }

        const propertyId = getPropertyIdFromURL();



        document.addEventListener("DOMContentLoaded", async () => {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            console.log("Property ID:", id);

            if (!id) return;

            const base_url = "http://localhost/real_estate_dashboard/admin";

            try {
                // Fetch property detail
                const res = await fetch(`${base_url}/get-property-by-id.php?id=${id}&t=${Date.now()}`);
                const property = await res.json();

                if (!property || property.error) return;

                // Fill UI
                document.getElementById("ContactPropertyImage").src = property.thumbnail;
                document.getElementById("ContactPropertyTitle").textContent = property.title;
                document.getElementById("ContactPropertyType").innerHTML = `<i class="fa fa-search"></i> ${property.property_type}`;
                document.getElementById("ContactPropertyLocation").innerHTML = `<i class="fa fa-location-dot"></i> ${property.location}`;
                document.getElementById("ContactPropertyDescription").textContent = property.description;
                document.getElementById("ContactPropertyKeyFeatures").innerHTML = property.content;
                document.getElementById("Contactcategory").textContent = property.category + " - Bedrooms";
                document.getElementById("ContactBathrooms").textContent = property.bathroom + " - Bathrooms";
                document.getElementById("ContactSize").textContent = property.area + " sq ft";
                document.getElementById("ContactClander").textContent = property.created_at;
                document.getElementById("ContactPrice").textContent = "$" + Number(property.price).toLocaleString();

                // Fill hidden form fields
                document.getElementById("property_id").value = id;
                document.getElementById("property_type").value = property.property_type;

            } catch (err) {
                console.error("Fetch error:", err);
            }
        });
        ///////////////



        //////////////////
        // js for contact form to send data to save-contact.php through fetch api //
        // Handle Form Submit
        document.getElementById("contactForm").addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            try {
                const res = await fetch("http://localhost/real_estate_dashboard/admin/save-contact.php", {
                    method: "POST",
                    body: formData
                });

                const result = await res.json();

                if (result.status === "success") {
                    showToastNotification("Request sent ! Agent will contact you soon.", "success");
                    this.reset();
                } else {
                    showToastNotification(result.message, "error");
                }

            } catch (err) {
                showToastNotification("Network Error", "error");
            }
        });
 
