document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addApiaryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addApiary();
    });

    document.getElementById('addHiveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addHive();
    });

    document.getElementById('clearAllBtn').addEventListener('click', confirmClearAllApiaries);

    document.getElementById('apiaryData').addEventListener('click', function(e) {
        if (e.target.classList.contains('options-icon')) {
            const apiaryIndex = e.target.dataset.apiaryIndex;
            const hiveIndex = e.target.dataset.hiveIndex;
            const dropdown = document.querySelector(`#options-dropdown-${apiaryIndex}-${hiveIndex}`);
            $(dropdown).toggle(); // Toggle visibility of the dropdown menu
        }
        if (e.target.classList.contains('dropdown-item')) {
            const action = e.target.dataset.action;
            const apiaryIndex = e.target.dataset.apiaryIndex;
            const hiveIndex = e.target.dataset.hiveIndex;
            if (action === 'delete') {
                deleteHive(apiaryIndex, hiveIndex);
            } else if (action === 'analytics') {
                showHiveAnalytics(apiaryIndex, hiveIndex);
            }
        }
    });

    loadApiaries();
});

function addApiary() {
    const apiaryName = document.getElementById('apiaryName').value;
    const apiaryLocation = document.getElementById('apiaryLocation').value;

    const apiary = {
        name: apiaryName,
        location: apiaryLocation,
        hives: []
    };

    const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
    apiaries.push(apiary);
    localStorage.setItem('apiaries', JSON.stringify(apiaries));
    document.getElementById('addApiaryForm').reset();
    loadApiaries();
}

function confirmClearAllApiaries() {
    if (confirm("Are you sure you want to clear all apiaries?")) {
        clearAllApiaries();
    }
}

function clearAllApiaries() {
    localStorage.removeItem('apiaries');
    loadApiaries();
}

function loadApiaries() {
    const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
    const apiaryDataDiv = document.getElementById('apiaryData');
    apiaryDataDiv.innerHTML = '';

    apiaries.forEach((apiary, apiaryIndex) => {
        const apiaryCard = document.createElement('div');
        apiaryCard.className = 'col-md-4';

        apiaryCard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    ${apiary.name}
                    <i class="fas fa-trash-alt float-right ml-2" onclick="deleteApiary(${apiaryIndex})"></i>
                    <i class="fas fa-plus-circle float-right" onclick="openAddHiveModal(${apiaryIndex})"></i>
                </div>
                <div class="card-body">
                    <p>Location: ${apiary.location}</p>
                    <div class="hive-cards-container">
                        ${apiary.hives.map((hive, hiveIndex) => `
                            <div class="hive-card">
                                <div class="hive-image"></div>
                                <div class="hive-info">
                                    <span class="hive-name">${hive.name}</span>
                                    <span class="hive-meta">${hive.date}</span>
                                </div>
                                <div class="options-icon" data-apiary-index="${apiaryIndex}" data-hive-index="${hiveIndex}">
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                                
                                <button class="btn btn-info btn-sm mt-2" data-toggle="modal" data-target="#hiveConditionModal" onclick="loadHiveCondition('${apiaryIndex}', '${hiveIndex}')">View Conditions</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        apiaryDataDiv.appendChild(apiaryCard);
    });
}

function deleteApiary(apiaryIndex) {
    if (confirm("Are you sure you want to delete this apiary?")) {
        const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
        apiaries.splice(apiaryIndex, 1);
        localStorage.setItem('apiaries', JSON.stringify(apiaries));
        loadApiaries();
    }
}

function deleteHive(apiaryIndex, hiveIndex) {
    if (confirm("Are you sure you want to delete this hive?")) {
        const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
        apiaries[apiaryIndex].hives.splice(hiveIndex, 1);
        localStorage.setItem('apiaries', JSON.stringify(apiaries));
        loadApiaries();
    }
}

function openAddHiveModal(apiaryIndex) {
    document.getElementById('selectedApiary').value = apiaryIndex;
    $('#addHiveModal').modal('show');
}

function addHive() {
    const apiaryIndex = document.getElementById('selectedApiary').value;
    const hiveName = document.getElementById('hiveName').value;

    const hive = {
        name: hiveName,
        date: new Date().toLocaleDateString()
    };

    const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
    apiaries[apiaryIndex].hives.push(hive);
    localStorage.setItem('apiaries', JSON.stringify(apiaries));
    document.getElementById('addHiveForm').reset();
    $('#addHiveModal').modal('hide');
    loadApiaries();
}

function loadHiveCondition(apiaryIndex, hiveIndex) {
    const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
    const hive = apiaries[apiaryIndex].hives[hiveIndex];
    if (hive) {
        document.getElementById('hiveConditionDetails').innerHTML = `
            <p><strong>Temperature:</strong> ${hive.temperature || 'N/A'}</p>
            <p><strong>Humidity:</strong> ${hive.humidity || 'N/A'}</p>
            <p><strong>Sound:</strong> ${hive.sound || 'N/A'}</p>
            <p><strong>Weight:</strong> ${hive.weight || 'N/A'}</p>
        `;
        renderWeeklyGraph(hive.weeklyData || []);
    }
    $('#hiveConditionModal').modal('show');
}

function renderWeeklyGraph(data) {
    const ctx = document.getElementById('hiveWeeklyGraph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Weekly Temperature',
                data: data,
                borderColor: '#ff8800',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showHiveAnalytics(apiaryIndex, hiveIndex) {
    const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
    const hive = apiaries[apiaryIndex].hives[hiveIndex];
    const ctx = document.getElementById('hiveAnalyticsChart').getContext('2d');
    const hiveCondition = document.getElementById('hiveCondition');

    const analyticsData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Hive Temperature',
            data: [23, 24, 22, 25, 26, 27], // Example data, replace with actual
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const analyticsOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: analyticsData,
        options: analyticsOptions
    });

    hiveCondition.innerText = 'Good';  // Example condition
    $('#hiveAnalyticsModal').modal('show');
}
function toggleNotifications() {
    $('#notificationsDropdown').toggle();
}

// Function to generate random notifications
function generateRandomNotification() {
    const notifications = [
        { message: 'New message from Admin', icon: '<i class="fas fa-envelope mr-2"></i>' },
        { message: 'Hive 5 temperature alert', icon: '<i class="fas fa-exclamation-triangle mr-2"></i>' },
        { message: 'Apiary maintenance scheduled', icon: '<i class="fas fa-info-circle mr-2"></i>' },
        { message: 'Hive 3 humidity alert', icon: '<i class="fas fa-tint mr-2"></i>' },
        { message: 'New inspection log added', icon: '<i class="fas fa-clipboard-check mr-2"></i>' },
       
        { message: 'Hive 7 in Apiary 1 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 7 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 6 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 3 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 1 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 9 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 5 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 2 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 8 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 4 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 7 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 7 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 7 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
        { message: 'Hive 7 weight alert', icon: '<i class="fas fa-weight-hanging mr-2"></i>' },
    ];

    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    const timestamp = new Date().toLocaleTimeString();
    const notificationItem = `
        <a class="dropdown-item notification-item" href="#" onclick="markAsRead(this)">
            ${notification.icon} ${notification.message}
            <span class="text-muted small float-right">${timestamp}</span>
            <span class="delete-icon" onclick="deleteNotification(event, this)">&times;</span>
        </a>
    `;
    $('#notificationsDropdown').prepend(notificationItem);
    updateUnreadCount();
}

// Function to update unread notification count
function updateUnreadCount() {
    const count = $('#notificationsDropdown .notification-item').length;
    $('#unreadCount').text(count);
}

// Function to mark notification as read
function markAsRead(element) {
    $(element).addClass('read');
    updateUnreadCount();
}

// Function to delete notification
function deleteNotification(event, element) {
    event.stopPropagation();
    $(element).closest('.notification-item').remove();
    updateUnreadCount();
}

// Function to view all notifications
function viewAllNotifications() {
    const notifications = $('#notificationsDropdown .notification-item').clone();
    $('#activityLogs').empty().append(notifications);
}

// Generate random notifications every 2 minutes
setInterval(generateRandomNotification, 30000);

// Initialize notifications
$(document).ready(function() {
    generateRandomNotification();
});
