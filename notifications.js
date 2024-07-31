// Function to toggle the notifications dropdown
function toggleNotifications() {
    $('#notificationsDropdown').toggle();
}

// Event listener for the notifications icon
$('#notificationsDropdownToggle').click(function(event) {
    event.stopPropagation();
    toggleNotifications();
});

// Hide the dropdown when clicking outside of it
$(document).click(function(event) {
    if (!$(event.target).closest('#notificationsDropdown, #notificationsDropdownToggle').length) {
        if ($('#notificationsDropdown').is(":visible")) {
            $('#notificationsDropdown').hide();
        }
    }
});

// Function to add a notification
function addNotification(message) {
    const notificationList = document.getElementById('notificationsDropdown');
    const newNotification = document.createElement('a');
    newNotification.className = 'dropdown-item';
    newNotification.href = '#';
    newNotification.innerText = message;
    notificationList.insertBefore(newNotification, notificationList.firstChild);

    // Update unread count
    const unreadCount = document.getElementById('unreadCount');
    unreadCount.innerText = parseInt(unreadCount.innerText) + 1;
}

// Function to view all notifications
function viewAllNotifications() {
    // Custom action to view all notifications
    alert('Viewing all notifications');
}

// Example usage: adding a notification
addNotification('New alert from hive 1');
addNotification('Temperature out of range in hive 2');