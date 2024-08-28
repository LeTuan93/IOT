const dataModel = require('../models/dataModel');


//for chart
const getData = (req, res) => {
    dataModel.getAllData((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.status(200).json(results);
    });
}

const getStatus = (req, res) => {
    dataModel.getAllStatus((err, results) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.status(200).json(results);
    });
}


// Search and Sort function
const getSearchAndSortData = (req, res) => {
    const searchField = req.query.searchField || 'id';       // Default search field is 'id'
    const searchTerm = req.query.searchTerm || '';           // Default search term is empty
    const sortField = req.query.sortField || 'id';           // Default sort field is 'id'
    const sortOrder = req.query.sortOrder || 'ASC';          // Default sort order is 'ASC'
    const page = parseInt(req.query.page) || 1;              // Default to page 1
    const limit = 8;                                       // Limit results per page to 8
    const startTime = req.query.startTime || null;         // Default startTime is null
    const endTime = req.query.endTime || null;             // Default endTime is null

    dataModel.searchAndSortData(searchField, searchTerm, sortField, sortOrder, page, limit, startTime, endTime, (err, result) => {
        if (err) {
            console.error("Database query error: ", err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }

        res.status(200).json({
            data: result.data,
            currentPage: result.currentPage,
            totalPages: result.totalPages
        });
    });
}


const getWeb = (req, res) => {
    res.render('app.ejs')
}

module.exports = {
    getData,
    getSearchAndSortData,
    getStatus,
    getWeb
}