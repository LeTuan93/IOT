document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btnSearchAll');
    const sortAscButton = document.getElementById('SU');
    const sortDescButton = document.getElementById('SD');
    const pageBackButton = document.getElementById('page-back-sensor');
    const pageNextButton = document.getElementById('page-next-sensor');
    const pageSelector = document.getElementById('page-selector-sensor');
    const tableBody = document.querySelector('#sensor_table tbody');
    const sortFieldSelector = document.getElementById('selectSensor');
    const limitInput = document.getElementById('limit-input-sensor'); // Limit input

    let data = [];
    let currentPage = 1;
    let totalPages = 1;
    let sortField = 'id';
    let sortOrder = 'ASC';
    let searchField = 'all';
    let searchTerm = '';
    let limit = parseInt(limitInput.value) || 5; // Default limit (5 as a starting point)

    const fetchData = () => {
        fetch('/api')
            .then(response => response.json())
            .then(fetchedData => {
                // Kiểm tra và thay thế null cho các thuộc tính
                fetchedData.forEach(row => {
                    row.humidity = row.humidity !== null ? row.humidity : 0;
                    row.temperature = row.temperature !== null ? row.temperature : 0;
                    row.light = row.light !== null ? row.light : 0;
                    row.Dash = row.Dash !== null ? row.Dash : 0; // Đảm bảo Dash không phải là null
                });
                data = fetchedData;
                totalPages = Math.ceil(data.length / limit);
                updateTable();
                updatePagination();
            })
            .catch(error => console.error('Error fetching data:', error));
    };
    
    const updateTable = () => {
        const filteredData = data.filter(row => {
            const rowDate = new Date(row.time);
            const rowDateString = `${String(rowDate.getDate()).padStart(2, '0')}/${String(rowDate.getMonth() + 1).padStart(2, '0')}/${rowDate.getFullYear()}`;
            const rowTimeString = `${String(rowDate.getHours()).padStart(2, '0')}:${String(rowDate.getMinutes()).padStart(2, '0')}:${String(rowDate.getSeconds()).padStart(2, '0')}`;
            const rowFullDateTime = `${rowTimeString} - ${rowDateString}`;

            const matchDate = (dateString, searchTerm) => dateString.includes(searchTerm);
            const matchTime = (timeString, searchTerm) => {
                const searchParts = searchTerm.split(':').map(part => part.trim());
                const timeParts = timeString.split(':').map(part => part.trim());
                
                const hoursMatch = searchParts[0] ? timeParts[0] === searchParts[0].padStart(2, '0') : true;
                const minutesMatch = searchParts[1] ? timeParts[1] === (searchParts[1] || timeParts[1]) : true;
                const secondsMatch = searchParts[2] ? timeParts[2] === (searchParts[2] || timeParts[2]) : true;
                return hoursMatch && minutesMatch && secondsMatch;
            };

            const isMatch = (field, term) => {
                if (field === 'time') {
                    return matchDate(rowDateString, term) || matchTime(rowTimeString, term) || matchDate(rowFullDateTime, term);
                } else {
                    if (row[field] === null || row[field] === undefined) {
                        row[field] = 0;
                    }
                    return row[field].toString().toLowerCase().includes(term.toLowerCase());
                }
            };

            if (searchField === 'all') {
                return (
                    (row.id.toString().includes(searchTerm) || 
                    row.humidity.toString().includes(searchTerm) || 
                    row.temperature.toString().includes(searchTerm) || 
                    row.light.toString().includes(searchTerm) || 
                    row.Dash.toString().includes(searchTerm) ||   //thêm dash
                    matchDate(rowDateString, searchTerm) || 
                    matchTime(rowTimeString, searchTerm) ||
                    matchDate(rowFullDateTime, searchTerm)) 
                );
            } else {
                return isMatch(searchField, searchTerm);
            }
        });

        totalPages = Math.ceil(filteredData.length / limit); // Cập nhật lại số trang sau khi lọc dữ liệu

        let sortedData = filteredData.sort((a, b) => {
            let aValue, bValue;
            switch (sortField) {
                case 'id':
                    aValue = parseInt(a[sortField]);
                    bValue = parseInt(b[sortField]);
                    break;
                case 'time':
                    aValue = new Date(a[sortField]);
                    bValue = new Date(b[sortField]);
                    break;
                case 'humidity':
                case 'temperature':
                case 'light':
                    aValue = parseFloat(a[sortField]);
                    bValue = parseFloat(b[sortField]);
                    break;
                case 'Dash':
                    aValue = a[sortField] !== null && a[sortField] !== undefined ? parseFloat(a[sortField]) : 0;
                    bValue = b[sortField] !== null && b[sortField] !== undefined ? parseFloat(b[sortField]) : 0;
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

        const paginatedData = sortedData.slice((currentPage - 1) * limit, currentPage * limit);

        tableBody.innerHTML = '';
        paginatedData.forEach(row => {
            const formattedTime = formatTime(row.time);
            const humidity = row.humidity !== null ? row.humidity : 0;
            const temperature = row.temperature !== null ? row.temperature : 0;
            const light = row.light !== null ? row.light : 0;
            const Dash = row.Dash !== null ? row.Dash : 0; // Kiểm tra cho Dash
        
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${humidity}</td>
                <td>${temperature}</td>
                <td>${light}</td>
                <td>${Dash}</td>
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

    limitInput.addEventListener('change', () => {
        limit = parseInt(limitInput.value) || 5; // Update limit based on user input
        currentPage = 1; // Reset to the first page on limit change
        fetchData();
    });

    searchButton.addEventListener('click', () => {
        searchField = document.getElementById('selectSearch').value;
        searchTerm = document.getElementById('inputSensor').value;
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

    pageSelector.addEventListener('change', () => {
        currentPage = parseInt(pageSelector.value);
        fetchData();
    });

    sortFieldSelector.addEventListener('change', () => {
        sortField = sortFieldSelector.value;
        fetchData();
    });

    fetchData(); // Fetch initial data
});
