document.addEventListener('DOMContentLoaded', function () {
    const searchActionButton = document.getElementById('btnSearchAction');
    const sortActionAscButton = document.getElementById('actionSU');
    const sortActionDescButton = document.getElementById('actionSD');
    const pageBackActionButton = document.getElementById('page-back-action');
    const pageNextActionButton = document.getElementById('page-next-action');
    const pageActionSelector = document.getElementById('page-selector-action');
    const actionTableBody = document.querySelector('#action_table tbody');
    const sortActionFieldSelector = document.getElementById('selectActionSort');

    let actionData = [];
    let currentActionPage = 1;
    let totalActionPages = 1;
    let sortActionField = 'device_id';
    let sortActionOrder = 'ASC';
    let searchActionField = 'device_id';
    let searchActionTerm = '';
    let startActionDate = '';
    let endActionDate = '';
    let isInitialActionLoad = true;
    
    const extractNumber = (str) => {
        const match = str.match(/\d+/); // Extract the first sequence of digits found in the string
        return match ? parseInt(match[0], 10) : 0; // Convert the match to a number, or return 0 if no digits found
    };

    const fetchActionData = () => {
        fetch('/api/action-history')
            .then(response => response.json())
            .then(fetchedData => {
                actionData = fetchedData;
                totalActionPages = Math.ceil(actionData.length / 8); // Assuming 8 records per page
                updateActionTable();
                updateActionPagination();
                isInitialActionLoad = false; // Đã tải xong lần đầu
            })
            .catch(error => console.error('Error fetching action data:', error));
    };

    const updateActionTable = () => {
        // Filter action data based on search criteria and date range
        const filteredActionData = actionData.filter(row => {
            const rowDate = new Date(row.time);
            const rowDateString = `${rowDate.getFullYear()}-${String(rowDate.getMonth() + 1).padStart(2, '0')}-${String(rowDate.getDate()).padStart(2, '0')}`;
            const isWithinDateRange = (!startActionDate || rowDateString >= startActionDate) &&
                                      (!endActionDate || rowDateString <= endActionDate);
            return row[searchActionField] && row[searchActionField].toString().toLowerCase().includes(searchActionTerm.toLowerCase()) &&
                   isWithinDateRange;
        });

        // Update totalActionPages after filtering
        totalActionPages = Math.ceil(filteredActionData.length / 8); // Assuming 8 records per page

        // Sort data only if sortActionField is set and it's not the initial load
        let sortedActionData = filteredActionData;
        if (sortActionField && !isInitialActionLoad) {
            sortedActionData = filteredActionData.sort((a, b) => {
                let aValue, bValue;
                switch (sortActionField) {
                    case 'time':
                        aValue = new Date(a[sortActionField]);
                        bValue = new Date(b[sortActionField]);
                        break;
                    case 'device_id':
                        aValue = extractNumber(a[sortActionField]);
                        bValue = extractNumber(b[sortActionField]);
                        break;                     
                    default:
                        aValue = a[sortActionField].toString();
                        bValue = b[sortActionField].toString();
                }

                if (sortActionOrder === 'ASC') {
                    return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
                } else {
                    return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
                }
            });
        }

        // Paginate data
        const paginatedActionData = sortedActionData.slice((currentActionPage - 1) * 8, currentActionPage * 8);

        // Update table
        actionTableBody.innerHTML = '';
        paginatedActionData.forEach(row => {
            const formattedTime = formatTime(row.time);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.device_id}</td>
                <td>${row.status}</td>
                <td>${formattedTime}</td>
            `;
            actionTableBody.appendChild(tr);
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

    const updateActionPagination = () => {
        pageActionSelector.innerHTML = '';
        for (let i = 1; i <= totalActionPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = "Page " + i;
            if (i === currentActionPage) {
                option.selected = true;
            }
            pageActionSelector.appendChild(option);
        }
        pageBackActionButton.disabled = currentActionPage <= 1;
        pageNextActionButton.disabled = currentActionPage >= totalActionPages;
    };

    searchActionButton.addEventListener('click', () => {
        searchActionField = document.getElementById('selectActionSearch').value;
        searchActionTerm = document.getElementById('inputAction').value;
        startActionDate = document.getElementById('startTimeaction').value;
        endActionDate = document.getElementById('endTimeaction').value;
        currentActionPage = 1; // Reset to the first page on new search
        fetchActionData();
    });

    sortActionAscButton.addEventListener('click', () => {
        sortActionOrder = 'ASC';
        fetchActionData();
    });

    sortActionDescButton.addEventListener('click', () => {
        sortActionOrder = 'DESC';
        fetchActionData();
    });

    pageBackActionButton.addEventListener('click', () => {
        if (currentActionPage > 1) {
            currentActionPage--;
            fetchActionData();
        }
    });

    pageNextActionButton.addEventListener('click', () => {
        if (currentActionPage < totalActionPages) {
            currentActionPage++;
            fetchActionData();
        }
    });

    pageActionSelector.addEventListener('change', (event) => {
        currentActionPage = parseInt(event.target.value);
        fetchActionData();
    });

    // Update sortField based on user selection
    sortActionFieldSelector.addEventListener('change', (event) => {
        sortActionField = event.target.value;
        currentActionPage = 1; // Reset to the first page on new sort
        fetchActionData();
    });

    // Initial fetch
    fetchActionData();
});
