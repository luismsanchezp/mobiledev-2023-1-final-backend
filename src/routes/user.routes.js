const express = require("express");
const {
    store,
    index,
    show,
    update,
    destroy
} = require("../controllers/user.controller");
const { 
    validateUserStore,
    validateUserUpdate,
    validateUserShow,
    validateUserDestroy
} = require("../validators/user.validator");
const { ensureAuth }  = require("../middleware/user.auth");

const api = express.Router();

api.post("/users", validateUserStore, store);
api.get("/users", ensureAuth, index);
api.get("/users/:id", ensureAuth, validateUserShow, show);
api.put("/users/:id", ensureAuth, validateUserUpdate, update);
api.delete("/users/:id", ensureAuth, validateUserDestroy, destroy);

module.exports = api;