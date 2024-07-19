document.addEventListener('DOMContentLoaded', function() {
    const apiaryDataDiv = document.getElementById('apiaryData');
    const homeApiaryDataDiv = document.getElementById('homeApiaryData');
    let currentApiaryId = null;

    function displayApiaries() {
        apiaryDataDiv.innerHTML = '';
        homeApiaryDataDiv.innerHTML = '';
        const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];

        apiaries.forEach(apiary => {
            const apiaryCard = document.createElement('div');
            apiaryCard.className = 'card mb-4';
            apiaryCard.innerHTML = `
                <div class="card-header">
                    ${apiary.name} (${apiary.location})
                    <button class="btn btn-secondary btn-sm float-right" onclick="showAddHiveModal('${apiary.id}')">Add Hive</button>
                </div>
                <div class="card-body" id="${apiary.id}">
                    <!-- Hives will be added here -->
                </div>
            `;

            apiaryDataDiv.appendChild(apiaryCard);
            homeApiaryDataDiv.appendChild(apiaryCard.cloneNode(true));

            apiary.hives.forEach(hive => {
                const hiveItem = document.createElement('div');
                hiveItem.className = 'card mt-2';
                hiveItem.innerHTML = `
                    <div class="card-body">
                        <p class="card-text">${hive.name}</p>
                        <p>Temperature: <span class="hive-temperature">N/A</span></p>
                        <p>Humidity: <span class="hive-humidity">N/A</span></p>
                        <p>Weight: <span class="hive-weight">N/A</span></p>
                    </div>
                `;

                document.getElementById(apiary.id).appendChild(hiveItem);
                document.getElementById(apiary.id).cloneNode(true);
            });
        });
    }

    document.getElementById('addApiaryForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const apiaryName = document.getElementById('apiaryName').value;
        const apiaryLocation = document.getElementById('apiaryLocation').value;
        const apiaryId = `apiary-${Date.now()}`;

        const apiary = {
            id: apiaryId,
            name: apiaryName,
            location: apiaryLocation,
            hives: []
        };

        const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
        apiaries.push(apiary);
        localStorage.setItem('apiaries', JSON.stringify(apiaries));

        document.getElementById('addApiaryForm').reset();
        displayApiaries();
    });

    window.showAddHiveModal = function(apiaryId) {
        currentApiaryId = apiaryId;
        $('#addHiveModal').modal('show');
    };

    document.getElementById('addHiveForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const hiveName = document.getElementById('hiveName').value;

        if (currentApiaryId) {
            const apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];

            apiaries.forEach(apiary => {
                if (apiary.id === currentApiaryId) {
                    const hive = {
                        name: hiveName,
                        temperature: 'N/A',
                        humidity: 'N/A',
                        weight: 'N/A'
                    };
                    apiary.hives.push(hive);
                }
            });

            localStorage.setItem('apiaries', JSON.stringify(apiaries));
            displayApiaries();
        }

        document.getElementById('addHiveForm').reset();
        $('#addHiveModal').modal('hide');
    });

    displayApiaries();
});
