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
            handleDropdownAction(action, apiaryIndex, hiveIndex);
        }
    });

    // Load stored apiary data on page load
    loadApiaryData();
});

function confirmClearAllApiaries() {
    if (confirm("Are you sure you want to clear all apiaries?")) {
        clearAllApiaries();
    }
}

function handleDropdownAction(action, apiaryIndex, hiveIndex) {
    if (action === 'delete') {
        if (confirm("Are you sure you want to delete this hive?")) {
            deleteHive(apiaryIndex, hiveIndex);
        }
    } else if (action === 'analytics') {
        showHiveAnalytics(apiaryIndex, hiveIndex);
    }
}

function addApiary() {
    const apiaryName = document.getElementById('apiaryName').value;
    const apiaryLocation = document.getElementById('apiaryLocation').value;

    const apiaryData = getApiaryData();
    apiaryData.push({ name: apiaryName, location: apiaryLocation, hives: [] });
    setApiaryData(apiaryData);

    document.getElementById('apiaryName').value = '';
    document.getElementById('apiaryLocation').value = '';

    displayApiaryData();
}

function clearAllApiaries() {
    setApiaryData([]);
    displayApiaryData();
}

function deleteHive(apiaryIndex, hiveIndex) {
    const apiaryData = getApiaryData();
    apiaryData[apiaryIndex].hives.splice(hiveIndex, 1);
    setApiaryData(apiaryData);
    displayApiaryData();
}

function showHiveAnalytics(apiaryIndex, hiveIndex) {
    const apiaryData = getApiaryData();
    const hive = apiaryData[apiaryIndex].hives[hiveIndex];

    const temperatureData = hive.temperatureData;
    const humidityData = hive.humidityData;

    const ctx = document.getElementById('hiveAnalyticsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: temperatureData.map(data => data.timestamp),
            datasets: [{
                label: 'Temperature',
                data: temperatureData.map(data => data.value),
                borderColor: 'red',
                fill: false
            }, {
                label: 'Humidity',
                data: humidityData.map(data => data.value),
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });

    document.getElementById('hiveCondition').innerText = hive.condition;
    $('#hiveAnalyticsModal').modal('show');
}

function getApiaryData() {
    return JSON.parse(localStorage.getItem('apiaryData')) || [];
}

function setApiaryData(data) {
    localStorage.setItem('apiaryData', JSON.stringify(data));
}

function displayApiaryData() {
    const apiaryData = getApiaryData();
    const apiaryContainer = document.getElementById('apiaryData');
    apiaryContainer.innerHTML = '';

    apiaryData.forEach((apiary, apiaryIndex) => {
        const apiaryCard = document.createElement('div');
        apiaryCard.classList.add('col-md-4');
        apiaryCard.innerHTML = `
            <div class="card">
                <div class="card-header">${apiary.name}</div>
                <div class="card-body">
                    <h5 class="card-title">${apiary.location}</h5>
                    <button class="btn btn-primary btn-small" data-toggle="modal" data-target="#addHiveModal" onclick="setSelectedApiary(${apiaryIndex})">Add Hive</button>
                    <div class="mt-3">
                        ${apiary.hives.map((hive, hiveIndex) => `
                            <div class="hive-card">
                                <div class="options-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-apiary-index="${apiaryIndex}" data-hive-index="${hiveIndex}"><i class="fas fa-ellipsis-h"></i></div>
                                <div class="dropdown-menu dropdown-menu-right" id="options-dropdown-${apiaryIndex}-${hiveIndex}">
                                    <a class="dropdown-item" href="#" data-action="analytics" data-apiary-index="${apiaryIndex}" data-hive-index="${hiveIndex}">Analytics</a>
                                    <a class="dropdown-item" href="#" data-action="delete" data-apiary-index="${apiaryIndex}" data-hive-index="${hiveIndex}">Delete</a>
                                </div>
                                <div class="hive-image"></div>
                                <div class="hive-info">
                                    <div class="hive-name">${hive.name}</div>
                                    <div class="hive-meta">Added on: ${hive.date}</div>
                                </div>
                                <div class="hive-details">
                                    Temp: ${hive.temperature} °C<br>
                                    Humidity: ${hive.humidity} %<br>
                                    Sound: ${hive.sound} dB<br>
                                    Weight: ${hive.weight} kg
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        apiaryContainer.appendChild(apiaryCard);
    });
}

function setSelectedApiary(apiaryIndex) {
    document.getElementById('selectedApiary').value = apiaryIndex;
}

function addHive() {
    const hiveName = document.getElementById('hiveName').value;
    const apiaryIndex = document.getElementById('selectedApiary').value;

    const apiaryData = getApiaryData();
    const newHive = {
        name: hiveName,
        date: new Date().toLocaleString(),
        temperature: getRandomValue(20, 35),
        humidity: getRandomValue(40, 60),
        sound: getRandomValue(50, 80),
        weight: getRandomValue(10, 20),
        temperatureData: generateRandomData(20, 35, 10),
        humidityData: generateRandomData(40, 60, 10),
        condition: "Good" // Replace this with the actual condition logic
    };
    apiaryData[apiaryIndex].hives.push(newHive);
    setApiaryData(apiaryData);

    document.getElementById('hiveName').value = '';
    $('#addHiveModal').modal('hide');
    displayApiaryData();
}

function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function generateRandomData(min, max, count) {
    const data = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        data.push({
            timestamp: new Date(now.getTime() - i * 60000),
            value: getRandomValue(min, max)
        });
    }
    return data;
}

function loadApiaryData() {
    displayApiaryData();
}