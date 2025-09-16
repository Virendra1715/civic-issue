// DOM Elements
const reportTab = document.getElementById('report-tab');
const viewTab = document.getElementById('view-tab');
const reportSection = document.getElementById('report-section');
const viewSection = document.getElementById('view-section');
const complaintForm = document.getElementById('complaint-form');
const photosInput = document.getElementById('photos');
const photoPreview = document.getElementById('photo-preview');
const getLocationBtn = document.getElementById('get-location');
const searchCityInput = document.getElementById('search-city');
const searchBtn = document.getElementById('search-btn');
const statusFilter = document.getElementById('status-filter');
const useLocationBtn = document.getElementById('use-location');
const complaintsList = document.getElementById('complaints-list');
const recentComplaintsList = document.getElementById('recent-complaints');
const complaintModal = new bootstrap.Modal(document.getElementById('complaintModal'));

// State
let map, marker;
let currentPosition = null;
let selectedPhotos = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    loadRecentComplaints();
    loadComplaints();
});

// Initialize the map
function initMap() {
    // Default to a central location (can be changed based on user's location)
    const defaultLat = 20.5937;
    const defaultLng = 78.9629; // Center of India
    
    map = L.map('map').setView([defaultLat, defaultLng], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add click event to update marker position
    map.on('click', (e) => {
        updateMarkerPosition(e.latlng);
        reverseGeocode(e.latlng);
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    reportTab.addEventListener('click', () => showSection('report'));
    viewTab.addEventListener('click', () => showSection('view'));
    
    // Form submission
    complaintForm.addEventListener('submit', handleFormSubmit);
    
    // Photo upload
    photosInput.addEventListener('change', handlePhotoUpload);
    
    // Location button
    getLocationBtn.addEventListener('click', getCurrentLocation);
    
    // Search functionality
    searchBtn.addEventListener('click', searchByCity);
    searchCityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByCity();
    });
    
    // Status filter
    statusFilter.addEventListener('change', loadComplaints);
    
    // Use current location for nearby complaints
    useLocationBtn.addEventListener('click', findNearbyComplaints);
}
