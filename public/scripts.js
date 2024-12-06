// scripts.js

// Initialize Facebook Login
function loginWithFacebook() {
    FB.login((response) => {
        if (response.authResponse) {
            FB.api('/me', { fields: 'id,name,email,friends' }, (userData) => {
                console.log('User Data:', userData);
                // You can now use userData to display user-specific content
            });
        } else {
            console.log('User canceled login or did not fully authorize.');
        }
    }, { scope: 'public_profile,email,user_friends' });
}

// Initialize Google Map and add attraction markers
function initMap() {
    const attractions = [
        { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
        { name: "Great Wall of China", lat: 40.4319, lng: 116.5704 },
        { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445 }
    ];

    // Map centered on the first attraction
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: { lat: 48.8584, lng: 2.2945 }
    });

    // Add markers for each attraction
    attractions.forEach(attraction => {
        const marker = new google.maps.Marker({
            position: { lat: attraction.lat, lng: attraction.lng },
            map: map,
            title: attraction.name
        });

        // Info window with attraction name
        const infoWindow = new google.maps.InfoWindow({
            content: `<h5>${attraction.name}</h5>`
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

// Fetch attraction data from the server
fetch('/api/attractions')
    .then(response => response.json())
    .then(data => console.log("Attractions:", data))
    .catch(error => console.error('Error fetching attractions:', error));
