let map;
let userMarker;
let parkingMarkers = [];
let selectedParkingArea = null;
const totalSpots = 12;
let selectedSpot = null;
let parkingSpots = [];

// Sample parking areas data (in real application, this would come from a backend)
const parkingAreas = [
    { id: 1, name: "Central Plaza Parking", lat: 0, lng: 0, spots: 12, rate: "₹50/hour" },
    { id: 2, name: "Mall Parking Complex", lat: 0, lng: 0, spots: 12, rate: "₹40/hour" },
    { id: 3, name: "Station Parking", lat: 0, lng: 0, spots: 12, rate: "₹30/hour" }
];

function initializeMap() {
    map = L.map('map').setView([0, 0], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                updateUserLocation(latitude, longitude);
                populateParkingAreas(latitude, longitude);
            },
            error => {
                console.error("Error getting location:", error);
                document.getElementById('user-location').textContent = 
                    "Location access denied. Please enable location services.";
            }
        );
    }
}

function updateUserLocation(lat, lng) {
    document.getElementById('user-location').innerHTML = 
        `<strong>Your Location:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng]).addTo(map);
    }
    map.setView([lat, lng], 13);
}

function populateParkingAreas(userLat, userLng) {
    // Update parking areas with locations relative to user
    parkingAreas.forEach((area, index) => {
        // Simulate different locations around the user (replace with actual data)
        area.lat = userLat + (Math.random() - 0.5) * 0.01;
        area.lng = userLng + (Math.random() - 0.5) * 0.01;

        // Add marker to map
        const marker = L.marker([area.lat, area.lng])
            .bindPopup(`<b>${area.name}</b><br>Available spots: ${area.spots}`)
            .addTo(map);
        parkingMarkers.push(marker);

        // Add to list
        const areaElement = document.createElement('div');
        areaElement.className = 'parking-area';
        areaElement.innerHTML = `
            <h3>${area.name}</h3>
            <p>Rate: ${area.rate}</p>
            <p>Available spots: ${area.spots}</p>
            <small>Distance: ${calculateDistance(userLat, userLng, area.lat, area.lng).toFixed(2)} km</small>
        `;
        areaElement.addEventListener('click', () => selectParkingArea(area));
        document.getElementById('parking-areas').appendChild(areaElement);
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function selectParkingArea(area) {
    selectedParkingArea = area;
    document.getElementById('selected-area').textContent = area.name;

    // Update UI to show selected area
    document.querySelectorAll('.parking-area').forEach(element => {
        element.classList.remove('selected');
        if (element.querySelector('h3').textContent === area.name) {
            element.classList.add('selected');
        }
    });

    // Center map on selected area
    map.setView([area.lat, area.lng], 15);

    // Initialize parking spots for selected area
    initializeParkingLot(); 
}

function initializeParkingLot() {
    const grid = document.getElementById('parking-grid');
    grid.innerHTML = ''; // Clear existing spots
    parkingSpots = [];

    for (let i = 1; i <= totalSpots; i++) {
        const spot = {
            id: i,
            available: Math.random() > 0.3, // Simulate availability
            vehicleNumber: null,
            duration: null
        };
        parkingSpots.push(spot);

        const spotElement = document.createElement('div');
        spotElement.className = `parking-spot ${spot.available ? 'available' : 'occupied'}`;
        spotElement.innerHTML = `
            <h3>Spot ${i}</h3>
            <p>${spot.available ? 'Available' : 'Occupied'}</p>
        `;

        if (spot.available) {
            spotElement.addEventListener('click', () => selectSpot(i));
        }

        grid.appendChild(spotElement);
    }
    updateStatusBar();
}

function updateStatusBar() {
    const availableCount = parkingSpots.filter(spot => spot.available).length;
    const occupiedCount = totalSpots - availableCount;

    document.getElementById('available-count').textContent = availableCount;
    document.getElementById('occupied-count').textContent = occupiedCount;
}

function selectSpot(spotId) {
    if (!selectedParkingArea) {
        alert('Please select a parking area first');
        return;
    }

    selectedSpot = spotId;
    document.getElementById('booking-form').classList.add('active');

    // Highlight selected spot
    document.querySelectorAll('.parking-spot').forEach(spot => {
        spot.style.backgroundColor = 'white'; 
    });
    document.querySelectorAll('.parking-spot')[spotId - 1].style.backgroundColor = '#f0f8ff';
}

function confirmBooking() {
    const vehicleNumber = document.getElementById('vehicle-number').value;
    const duration = document.getElementById('duration').value;

    if (!vehicleNumber || !duration) {
        alert('Please fill in all fields');
        return;
    }

    const spotIndex = selectedSpot - 1;
    parkingSpots[spotIndex].available = false;
    parkingSpots[spotIndex].vehicleNumber = vehicleNumber;
    parkingSpots[spotIndex].duration = duration;

    const spotElement = document.querySelectorAll('.parking-spot')[spotIndex];
    spotElement.className = 'parking-spot occupied';
    spotElement.innerHTML = `
        <h3>Spot ${selectedSpot}</h3>
        <p>Occupied</p>
        <small>${vehicleNumber}</small>
    `;

    document.getElementById('booking-form').classList.remove('active');
    document.getElementById('vehicle-number').value = '';
    document.getElementById('duration').value = '';
    selectedSpot = null;

    updateStatusBar();

    // Simulate releasing the spot after the duration (replace with actual booking logic)
    setTimeout(() => {
        releaseSpot(spotIndex);
    }, duration * 1000 * 60); // duration is in minutes here
}

function releaseSpot(spotIndex) {
    parkingSpots[spotIndex].available = true;
    parkingSpots[spotIndex].vehicleNumber = null;
    parkingSpots[spotIndex].duration = null;

    const spotElement = document.querySelectorAll('.parking-spot')[spotIndex];
    spotElement.className = 'parking-spot available';
    spotElement.innerHTML = `
        <h3>Spot ${spotIndex + 1}</h3>
        <p>Available</p>
    `;

    spotElement.addEventListener('click', () => selectSpot(spotIndex + 1));
    updateStatusBar();
}

// Initialize the map when the page loads
window.onload = initializeMap;