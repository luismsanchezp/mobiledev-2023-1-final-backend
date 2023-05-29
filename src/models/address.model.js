const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    address: {
        type: String,
        require: true,
    },
    addr_city: {
        type: String,
        require: true,
    },
    addr_state: {
        type: String,
        require: true,
    },
    addr_country: {
        type: String,
        require: true,
    },
    addr_postal_code: {
        type: String,
        require: false,
    },
    addr_phone_number: {
        type: String,
        require: false,
    },
}, {timestamps: true});

module.exports = mongoose.model("Address", AddressSchema);