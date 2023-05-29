const express = require('express');
const {
    update,
    index,
    show
} = require('../controllers/state.controller');
const { ensureAuth }  = require("../middleware/user.auth");

const api = express.Router();

api.get('/states', index);
api.get('/states/:id', show);
api.put('/states', ensureAuth, update);

module.exports = api;