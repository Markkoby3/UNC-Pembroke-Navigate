// ===================================
// UNCP Navigate - JavaScript
// Fetches data from Flask backend
// ===================================

// API Configuration
const API_BASE = "http://127.0.0.1:5000";
const API_BUILDINGS = `${API_BASE}/buildings`;

// Building type display order (matches your Flask data)
const TYPE_ORDER = [
    "Dining",
    "Student Life", 
    "Student Services",
    "Historic / Student Services",
    "Residence Hall",
    "Apartments",
    "Academic",
    "Administration", 
    "Library",
    "Fitness / Gym",
    "Aquatics / Fitness",
    "Athletics",
    "Recreation",
    "Performing Arts / Auditorium",
    "Landmark"
];

// Global data storage
let allBuildings = [];
let filteredBuildings = [];

// DOM elements
const searchInput = document.getElementById('heroSearchInput');
const searchBtn = document.getElementById('heroSearchBtn');
const resultsContainer = document.getElementById('results');
const resultsTitle = document.querySelector('.results-title');

// ===================================
// MAIN FUNCTIONS
// ===================================

// Initialize the application
async function initializeApp() {
    try {
        console.log('Loading buildings from API...');
        await loadBuildingsFromAPI();
        console.log(`Loaded ${allBuildings.length} buildings`);
        
        // Initial render with all buildings
        filteredBuildings = [...allBuildings];
        renderResults();
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load campus buildings. Please check if the backend server is running.');
    }
}

// Fetch buildings from Flask backend
async function loadBuildingsFromAPI() {
    try {
        const response = await fetch(API_BUILDINGS);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate and clean data
        allBuildings = data.filter(building => building.name && building.type)
                          .map(building => ({
                              ...building,
                              type: building.type.trim(),
                              name: building.name.trim()
                          }));
        
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', performSearch);
    
    // Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search (optional - triggers after 2+ characters)
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();
        if (query.length >= 2 || query.length === 0) {
            performSearch();
        }
    });
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

// Perform search based on input value
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        // Show all buildings if search is empty
        filteredBuildings = [...allBuildings];
    } else {
        // Filter buildings based on name and type
        filteredBuildings = allBuildings.filter(building => 
            building.name.toLowerCase().includes(query) ||
            building.type.toLowerCase().includes(query)
        );
    }
    
    renderResults();
    
    // Smooth scroll to results if searching
    if (query) {
        setTimeout(() => {
            document.querySelector('.results-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

// ===================================
// RENDERING FUNCTIONS
// ===================================

// Render the results section
function renderResults() {
    updateResultsTitle();
    
    if (filteredBuildings.length === 0) {
        showNoResults();
        return;
    }
    
    // Group buildings by type
    const buildingsByType = groupBuildingsByType(filteredBuildings);
    
    // Render grouped buildings
    resultsContainer.innerHTML = renderBuildingGroups(buildingsByType);
    
    // Add click handlers to cards
    addCardClickHandlers();
}

// Update the results section title
function updateResultsTitle() {
    const query = searchInput.value.trim();
    if (query) {
        resultsTitle.textContent = `Search Results for "${query}" (${filteredBuildings.length} found)`;
    } else {
        resultsTitle.textContent = `Campus Locations (${filteredBuildings.length} total)`;
    }
}

// Show no results message
function showNoResults() {
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = `
        <div class="no-results">
            <h3>No results found</h3>
            <p>No buildings match your search for "${escapeHtml(query)}". Try searching for a different term.</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <h3>Error</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

// Group buildings by type and sort by preference
function groupBuildingsByType(buildings) {
    const grouped = buildings.reduce((acc, building) => {
        const type = building.type || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(building);
        return acc;
    }, {});
    
    // Sort each group alphabetically by name
    Object.keys(grouped).forEach(type => {
        grouped[type].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
}

// Render building groups as HTML
function renderBuildingGroups(buildingsByType) {
    // Sort types by preference order
    const sortedTypes = Object.keys(buildingsByType).sort((a, b) => {
        const indexA = TYPE_ORDER.indexOf(a);
        const indexB = TYPE_ORDER.indexOf(b);
        
        // If both types are in the order array, sort by index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only one is in the order array, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // If neither is in the order array, sort alphabetically
        return a.localeCompare(b);
    });
    
    return sortedTypes.map(type => {
        const buildings = buildingsByType[type];
        return `
            <div class="building-type-section">
                <h4 class="building-type-title">${escapeHtml(type)} (${buildings.length})</h4>
                <div class="building-type-grid">
                    ${buildings.map(building => renderBuildingCard(building)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Render individual building card
function renderBuildingCard(building) {
    // Calculate distance (placeholder - you could implement real distance calculation)
    const distance = calculateDistance(building);
    
    return `
        <div class="building-card" tabindex="0" data-building-id="${building.name}" role="button" aria-label="View details for ${building.name}">
            <h4 class="building-name">${escapeHtml(building.name)}</h4>
            <p class="building-description">${getBuildingDescription(building)}</p>
            <div class="building-info">
                <span class="building-type">${escapeHtml(building.type)}</span>
                <span class="building-distance">${distance}</span>
            </div>
            ${building.lat && building.lng ? `
                <div class="building-coordinates">
                    <small>📍 ${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}</small>
                </div>
            ` : ''}
        </div>
    `;
}

// Get building description based on type
function getBuildingDescription(building) {
    const descriptions = {
        'Academic': 'Academic building with classrooms and offices',
        'Administration': 'Administrative offices and services',
        'Library': 'Library with study spaces and resources',
        'Student Life': 'Student activities and services',
        'Student Services': 'Campus support services for students',
        'Residence Hall': 'Student housing and dormitory',
        'Apartments': 'Student apartment complex',
        'Dining': 'Dining and food services',
        'Athletics': 'Athletic facilities and sports venues',
        'Fitness / Gym': 'Fitness center and recreational facilities',
        'Aquatics / Fitness': 'Swimming and aquatic facilities',
        'Recreation': 'Recreational facilities and activities',
        'Performing Arts / Auditorium': 'Theater and performing arts venue',
        'Historic / Student Services': 'Historic building with student services',
        'Landmark': 'Campus landmark and gathering space'
    };
    
    return descriptions[building.type] || 'Campus facility';
}

// Calculate placeholder distance (you could implement GPS-based distance)
function calculateDistance(building) {
    if (building.lat && building.lng) {
        // Placeholder calculation - you could implement real distance
        const distances = ['0.1 miles', '0.2 miles', '0.3 miles', '0.4 miles', '0.5 miles'];
        return distances[Math.floor(Math.random() * distances.length)];
    }
    return 'Distance unknown';
}

// Add click event handlers to building cards
function addCardClickHandlers() {
    const cards = resultsContainer.querySelectorAll('.building-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            handleBuildingCardClick(this);
        });
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBuildingCardClick(this);
            }
        });
    });
}

// Handle building card click
function handleBuildingCardClick(cardElement) {
    const buildingName = cardElement.dataset.buildingId;
    const building = allBuildings.find(b => b.name === buildingName);
    
    if (building) {
        // Show building details (you can expand this)
        showBuildingDetails(building);
    }
}

// Show building details (placeholder - you can implement a modal or navigation)
function showBuildingDetails(building) {
    let message = `📍 ${building.name}\n\nType: ${building.type}`;
    
    if (building.lat && building.lng) {
        message += `\nLocation: ${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}`;
        message += '\n\nWould you like directions to this location?';
        
        if (confirm(message)) {
            // Open Google Maps with directions
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}`;
            window.open(mapsUrl, '_blank');
        }
    } else {
        alert(message);
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// CSS ADDITIONS FOR BUILDING GROUPS
// ===================================

// Add CSS styles for building type sections
const additionalCSS = `
    .building-type-section {
        margin-bottom: 3rem;
    }
    
    .building-type-title {
        color: #000000;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #FFD700;
    }
    
    .building-type-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
    }
    
    .building-coordinates {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e9ecef;
    }
    
    .building-coordinates small {
        color: #6c757d;
        font-size: 0.8rem;
    }
    
    @media (max-width: 768px) {
        .building-type-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
        }
        
        .building-type-title {
            font-size: 1.3rem;
        }
    }
    
    @media (max-width: 480px) {
        .building-type-grid {
            grid-template-columns: 1fr;
        }
        
        .building-type-section {
            margin-bottom: 2rem;
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// ===================================
// INITIALIZE APP WHEN DOM IS READY
// ===================================

document.addEventListener('DOMContentLoaded', initializeApp);