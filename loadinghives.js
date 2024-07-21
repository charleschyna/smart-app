
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('addApiaryForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addApiary();
            });

            document.getElementById('addHiveForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addHive();
            });

            document.getElementById('clearAllBtn').addEventListener('click', clearAllApiaries);

            loadApiaries();
        });

        function addApiary() {
            const apiaryName = document.getElementById('apiaryName').value;
            const apiaryLocation = document.getElementById('apiaryLocation').value;

            let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
            apiaries.push({ name: apiaryName, location: apiaryLocation, hives: [] });

            localStorage.setItem('apiaries', JSON.stringify(apiaries));

            document.getElementById('apiaryName').value = '';
            document.getElementById('apiaryLocation').value = '';

            loadApiaries();
        }

        function addHive() {
            const hiveName = document.getElementById('hiveName').value;
            const apiaryName = document.getElementById('selectedApiary').value;

            let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
            const apiary = apiaries.find(a => a.name === apiaryName);
            if (apiary) {
                apiary.hives.push({ name: hiveName, temperature: null, humidity: null, weight: null });
                localStorage.setItem('apiaries', JSON.stringify(apiaries));

                document.getElementById('hiveName').value = '';
                $('#addHiveModal').modal('hide');
                loadApiaries();
            }
        }

        function loadApiaries() {
            const apiaryData = document.getElementById('apiaryData');
            apiaryData.innerHTML = '';
            let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
            apiaries.forEach(apiary => {
                const apiaryElement = document.createElement('div');
                apiaryElement.className = 'apiary';
                apiaryElement.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <h3>${apiary.name}</h3>
                        <button class="btn btn-danger btn-sm" onclick="deleteApiary('${apiary.name}')">Delete Apiary</button>
                    </div>
                    <p>Location: ${apiary.location}</p>
                    <h4>Hives:</h4>
                    <div class="hives">
                        ${apiary.hives.map(hive => `
                            <div class="hive">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5>${hive.name}</h5>
                                    <button class="btn btn-danger btn-sm" onclick="deleteHive('${apiary.name}', '${hive.name}')">Delete Hive</button>
                                </div>
                                <p>Temperature: ${hive.temperature}°C</p>
                                <p>Humidity: ${hive.humidity}%</p>
                                <p>Weight: ${hive.weight}kg</p>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary mt-2" onclick="showAddHiveModal('${apiary.name}')">Add Hive</button>
                `;
                apiaryData.appendChild(apiaryElement);
            });
        }

        function clearAllApiaries() {
            localStorage.removeItem('apiaries');
            loadApiaries();
        }

        function deleteApiary(apiaryName) {
            let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
            apiaries = apiaries.filter(apiary => apiary.name !== apiaryName);
            localStorage.setItem('apiaries', JSON.stringify(apiaries));
            loadApiaries();
        }

        function deleteHive(apiaryName, hiveName) {
            let apiaries = JSON.parse(localStorage.getItem('apiaries')) || [];
            const apiary = apiaries.find(a => a.name === apiaryName);
            if (apiary) {
                apiary.hives = apiary.hives.filter(hive => hive.name !== hiveName);
                localStorage.setItem('apiaries', JSON.stringify(apiaries));
                loadApiaries();
            }
        }

        function showAddHiveModal(apiaryName) {
            $('#addHiveModal').modal('show');
            document.getElementById('selectedApiary').value = apiaryName;
        }

        document.getElementById('toggleBtn').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('minimized');
        });
