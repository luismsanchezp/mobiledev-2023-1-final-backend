const express = require('express');

const {
    index,
    show
} = require('../controllers/city.controller');

const api = express.Router();

api.get('/cities', index);
api.get('/cities/:id', show);

module.exports = api;