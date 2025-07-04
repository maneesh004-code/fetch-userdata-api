// Global variables
let usersData = [];
const userContainer = document.getElementById('userContainer');
const reloadBtn = document.getElementById('reloadBtn');
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Function to show loading state
function showLoading() {
    userContainer.innerHTML = '<div class="loading">Loading user data...</div>';
    reloadBtn.disabled = true;
    reloadBtn.textContent = '🔄 Loading...';
}

// Function to show error message
function showError(message) {
    userContainer.innerHTML = `
        <div class="error">
            <strong>⚠️ Error:</strong> ${message}
            <br><br>
            <strong>Troubleshooting tips:</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Verify the API endpoint is accessible</li>
            </ul>
        </div>
    `;
    reloadBtn.disabled = false;
    reloadBtn.textContent = '🔄 Reload Data';
}

// Function to get user initials for avatar
function getUserInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

// Function to format address
function formatAddress(address) {
    return `${address.street}, ${address.suite}<br>
            ${address.city}, ${address.zipcode}<br>
            Geo: ${address.geo.lat}, ${address.geo.lng}`;
}

// Function to display users
function displayUsers(users) {
    if (!users || users.length === 0) {
        userContainer.innerHTML = '<div class="error">No users found.</div>';
        return;
    }

    const usersHTML = users.map(user => `
        <div class="user-card">
            <div class="user-header">
                <div class="user-avatar">${getUserInitials(user.name)}</div>
                <div class="user-name">${user.name}</div>
            </div>
            
            <div class="user-info">
                <div class="info-item">
                    <span class="info-label">📧 Email:</span>
                    <span class="info-value">${user.email}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">📱 Phone:</span>
                    <span class="info-value">${user.phone}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">🌐 Website:</span>
                    <span class="info-value">${user.website}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">🏢 Company:</span>
                    <span class="info-value">${user.company.name}</span>
                </div>
                
                <div class="address">
                    <div class="address-title">📍 Address:</div>
                    <div class="info-value">${formatAddress(user.address)}</div>
                </div>
            </div>
        </div>
    `).join('');

    userContainer.innerHTML = `
        <div class="stats">
            📊 Displaying ${users.length} users from JSONPlaceholder API
        </div>
        <div class="users-grid">
            ${usersHTML}
        </div>
    `;

    reloadBtn.disabled = false;
    reloadBtn.textContent = '🔄 Reload Data';
}

// Main function to fetch users
async function fetchUsers() {
    try {
        showLoading();
        
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch data from API
        const response = await fetch(API_URL);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        const users = await response.json();
        
        // Store users data globally
        usersData = users;
        
        // Display users
        displayUsers(users);
        
        console.log('✅ Successfully fetched users:', users);
        
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        
        // Handle different types of errors
        let errorMessage = 'Failed to fetch user data. ';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Please check your internet connection.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage += `Server responded with: ${error.message}`;
        } else {
            errorMessage += error.message;
        }
        
        showError(errorMessage);
    }
}

// Load users when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded, fetching users...');
    fetchUsers();
});

// Add keyboard shortcut (Ctrl+R or Cmd+R) to reload data
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        fetchUsers();
    }
});

// Test network error handling function (for demonstration)
function testNetworkError() {
    console.log('🧪 Testing network error handling...');
    showError('Network connection lost. This is a test error.');
}

// Utility function to export data (bonus feature)
function exportUsers() {
    if (usersData.length > 0) {
        const dataStr = JSON.stringify(usersData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users_data.json';
        link.click();
        URL.revokeObjectURL(url);
    }
}