const connection = require('../config/database');  // Kết nối tới cơ sở dữ liệu

const getAllData = (callback) => {
    const query = 'SELECT * FROM Persons p';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const getAllStatus = (callback) => {
    const query = 'SELECT * FROM Status s';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }
        callback(null, results);
    });
};

const getSearchAndSortData = (searchField, searchTerm, sortField, sortOrder, page, limit, startTime, endTime, callback) => {
    const offset = (page - 1) * limit;

    // Building the query dynamically based on user input
    let query = `
        SELECT * FROM Persons
        WHERE ${connection.escapeId(searchField)} LIKE ?
    `;

    // Add time range conditions if startTime and endTime are provided
    if (startTime && endTime) {
        query += ` AND time BETWEEN ? AND ?`;
    }

    query += `
        ORDER BY ${connection.escapeId(sortField)} ${connection.escape(sortOrder)}
        LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${searchTerm}%`;  // Search term with wildcard for partial matches

    // Prepare the query parameters
    let queryParams = [searchPattern];
    if (startTime && endTime) {
        queryParams.push(startTime, endTime);
    }
    queryParams.push(limit, offset);

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            return callback(err, null);
        }

        // Calculate total number of pages
        let countQuery = `
            SELECT COUNT(*) AS count FROM Persons
            WHERE ${connection.escapeId(searchField)} LIKE ?
        `;

        if (startTime && endTime) {
            countQuery += ` AND time BETWEEN ? AND ?`;
        }

        connection.query(countQuery, [searchPattern, startTime, endTime].filter(Boolean), (err, countResult) => {
            if (err) {
                console.error("Database count query error: ", err);
                return callback(err, null);
            }
            const totalRecords = countResult[0].count;
            const totalPages = Math.ceil(totalRecords / limit);

            callback(null, {
                data: results,
                totalPages: totalPages,
                currentPage: page
            });
        });
    });
};

// Xuất ra các hàm đã định nghĩa để sử dụng ở nơi khác
module.exports = {
    getAllData,
    getAllStatus,
    getSearchAndSortData
};
