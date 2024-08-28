document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btnSearchAll');
    const sortAscButton = document.getElementById('SU');
    const sortDescButton = document.getElementById('SD');
    const pageBackButton = document.getElementById('page-back-sensor');
    const pageNextButton = document.getElementById('page-next-sensor');
    const pageSelector = document.getElementById('page-selector-sensor');
    const tableBody = document.querySelector('#sensor_table tbody');
    const sortFieldSelector = document.getElementById('selectSensor');

    let data = [];
    let currentPage = 1;
    let totalPages = 1;
    let sortField = 'device_id';
    let sortOrder = 'ASC';
    let searchField = 'device_id';
    let searchTerm = '';
    let startDate = '';
    let endDate = '';
    let isInitialLoad = true;

    const extractNumber = (str) => {
        const match = str.match(/\d+/); // Extract the first sequence of digits found in the string
        return match ? parseInt(match[0], 10) : 0; // Convert the match to a number, or return 0 if no digits found
    };

    const fetchData = () => {
        fetch('/api')
            .then(response => response.json())
            .then(fetchedData => {
                data = fetchedData;
                totalPages = Math.ceil(data.length / 8); // Assuming 8 records per page
                updateTable();
                updatePagination();
                isInitialLoad = false; // Đã tải xong lần đầu
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const updateTable = () => {
        // Filter data based on search criteria and date range
        const filteredData = data.filter(row => {
            const rowDate = new Date(row.time);
            const rowDateString = `${rowDate.getFullYear()}-${String(rowDate.getMonth() + 1).padStart(2, '0')}-${String(rowDate.getDate()).padStart(2, '0')}`;
            const isWithinDateRange = (!startDate || rowDateString >= startDate) &&
                                      (!endDate || rowDateString <= endDate);
            return row[searchField] && row[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
                   isWithinDateRange;
        });

        // Update totalPages after filtering
        totalPages = Math.ceil(filteredData.length / 8); // Assuming 8 records per page

        // Sort data only if sortField is set and it's not the initial load
        let sortedData = filteredData;
        console.log("sortField: " + sortField);
        console.log("isInitialLoad: " + isInitialLoad);
        if (sortField && !isInitialLoad) {
            sortedData = filteredData.sort((a, b) => {
                let aValue, bValue;
                switch (sortField) {
                    case 'time':
                        aValue = new Date(a[sortField]);
                        bValue = new Date(b[sortField]);
                        break;
                    case 'device_id':
                        aValue = extractNumber(a[sortField]);
                        bValue = extractNumber(b[sortField]);
                        break;
                    case 'humidity':
                    case 'temperature':
                    case 'light':
                        aValue = parseFloat(a[sortField]);
                        bValue = parseFloat(b[sortField]);
                        break;
                    default:
                        aValue = a[sortField].toString();
                        bValue = b[sortField].toString();
                }

                if (sortOrder === 'ASC') {
                    return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
                } else {
                    return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
                }
            });
        }

        // Paginate data
        const paginatedData = sortedData.slice((currentPage - 1) * 8, currentPage * 8);

        // Update table
        tableBody.innerHTML = '';
        paginatedData.forEach(row => {
            const formattedTime = formatTime(row.time);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.device_id}</td>
                <td>${row.humidity}</td>
                <td>${row.temperature}</td>
                <td>${row.light}</td>
                <td>${formattedTime}</td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // Format time for display
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    };

    const updatePagination = () => {
        pageSelector.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent  = "Page " + i;
            if (i === currentPage) {
                option.selected = true;
            }
            pageSelector.appendChild(option);
        }
        pageBackButton.disabled = currentPage <= 1;
        pageNextButton.disabled = currentPage >= totalPages;
    };

    searchButton.addEventListener('click', () => {
        searchField = document.getElementById('selectSearch').value;
        searchTerm = document.getElementById('inputSensor').value;
        startDate = document.getElementById('startTimesensor').value;
        endDate = document.getElementById('endTimesensor').value;
        currentPage = 1; // Reset to the first page on new search
        fetchData();
    });

    sortAscButton.addEventListener('click', () => {
        sortOrder = 'ASC';
        console.log("click asc " );
        fetchData();
    });

    sortDescButton.addEventListener('click', () => {
        sortOrder = 'DESC';
        console.log("click desc " );
        fetchData();
    });

    pageBackButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            console.log("click back " );
            fetchData();
        }
    });

    pageNextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            console.log("click next " );
            fetchData();
        }
    });

    pageSelector.addEventListener('change', (event) => {
        currentPage = parseInt(event.target.value);
        console.log("click page " );
        fetchData();
    });

    // Update sortField based on user selection
    sortFieldSelector.addEventListener('change', (event) => {
        sortField = event.target.value;
        currentPage = 1; // Reset to the first page on new sort
        console.log("click sort " );
        fetchData();
    });

    // Initial fetch
    fetchData();
});
