document.addEventListener('DOMContentLoaded', function () {
    const searchActionButton = document.getElementById('btnSearchAction');
    const sortActionAscButton = document.getElementById('actionSU');
    const sortActionDescButton = document.getElementById('actionSD');
    const pageBackActionButton = document.getElementById('page-back-action');
    const pageNextActionButton = document.getElementById('page-next-action');
    const pageActionSelector = document.getElementById('page-selector-action');
    const actionTableBody = document.querySelector('#action_table tbody');
    const sortActionFieldSelector = document.getElementById('selectActionSort');
    const limitInput = document.getElementById('limit-input-action'); // Limit dropdown

    let actionData = [];
    let currentActionPage = 1;
    let totalActionPages = 1;
    let sortActionField = 'id';
    let sortActionOrder = 'ASC';
    let searchActionField = 'all';
    let searchActionTerm = '';
    let limit = parseInt(limitInput.value) || 8; // Default limit

    const fetchActionData = () => {
        fetch('/api/action-history')
            .then(response => response.json())
            .then(fetchedData => {
                actionData = fetchedData;
                totalActionPages = Math.ceil(actionData.length / limit); // Update total pages based on limit
                updateActionTable();
                updateActionPagination();
            })
            .catch(error => console.error('Error fetching action data:', error));
    };

    const updateActionTable = () => {
        const filteredActionData = actionData.filter(row => {
            const rowDate = new Date(row.time);
            const rowDateString = `${rowDate.getFullYear()}-${String(rowDate.getMonth() + 1).padStart(2, '0')}-${String(rowDate.getDate()).padStart(2, '0')}`;
            const rowFormattedDate = `${String(rowDate.getDate()).padStart(2, '0')}/${String(rowDate.getMonth() + 1).padStart(2, '0')}/${rowDate.getFullYear()}`;
            const rowTimeString = `${String(rowDate.getHours()).padStart(2, '0')}:${String(rowDate.getMinutes()).padStart(2, '0')}:${String(rowDate.getSeconds()).padStart(2, '0')}`;
            const rowFullDateTime = `${rowTimeString} - ${rowFormattedDate}`;

            // Search function that checks for both date formats and time
            const isMatch = (field, term) => {
                if (field === 'all') {
                    return Object.keys(row).some(key => {
                        if (key === 'time') {
                            return rowDateString.includes(term) || 
                                   rowFormattedDate.includes(term) || 
                                   rowTimeString.includes(term) || 
                                   rowFullDateTime.includes(term);
                        }
                        return row[key] && row[key].toString().toLowerCase().includes(term.toLowerCase());
                    });
                } else if (field === 'time') {
                    return rowDateString.includes(term) || 
                           rowFormattedDate.includes(term) || 
                           rowTimeString.includes(term) || 
                           rowFullDateTime.includes(term);
                } else {
                    return row[field] && row[field].toString().toLowerCase().includes(term.toLowerCase());
                }
            };

            return isMatch(searchActionField, searchActionTerm);
        });

        // Update totalActionPages after filtering
        totalActionPages = Math.ceil(filteredActionData.length / limit); // Update total pages based on limit

        // Sort data
        let sortedActionData = filteredActionData.sort((a, b) => {
            let aValue, bValue;
            switch (sortActionField) {
                case 'id':
                    aValue = parseInt(a[sortActionField]);
                    bValue = parseInt(b[sortActionField]);
                    break;
                case 'time':
                    aValue = new Date(a[sortActionField]);
                    bValue = new Date(b[sortActionField]);
                    break;
                case 'device_id':
                case 'status':
                    aValue = a[sortActionField].toString();
                    bValue = b[sortActionField].toString();
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

        // Paginate data
        const paginatedActionData = sortedActionData.slice((currentActionPage - 1) * limit, currentActionPage * limit);

        // Update table
        actionTableBody.innerHTML = '';
        paginatedActionData.forEach(row => {
            const formattedTime = formatTime(row.time);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.device_id}</td>
                <td>${row.status}</td>
                <td>${formattedTime}</td>
            `;
            actionTableBody.appendChild(tr);
        });
    };

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

    limitInput.addEventListener('change', () => {
        limit = parseInt(limitInput.value) || 8; // Update limit based on user selection
        currentActionPage = 1; // Reset to the first page on limit change
        fetchActionData();
    });

    searchActionButton.addEventListener('click', () => {
        searchActionField = document.getElementById('selectActionSearch').value;
        searchActionTerm = document.getElementById('inputAction').value;
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

    pageActionSelector.addEventListener('change', (e) => {
        currentActionPage = parseInt(e.target.value);
        fetchActionData();
    });

    fetchActionData(); // Initial data fetch
});
