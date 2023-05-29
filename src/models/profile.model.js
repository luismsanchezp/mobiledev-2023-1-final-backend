const mongoose = require("mongoose");
const Address = require("./address.model");

const govIdTypes = {
    cc: "C.C.",
    ti: "T.I.",
    ce: "C.E.",
    pa: "Pasaporte",
}

const genders = {
    m: "Masculino",
    f: "Femenino",
    o: "Otro",
};

const ProfileSchema = mongoose.Schema({
    names: {
        type: String,
        require: true,
    },
    lastnames: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        enum: Object.values(genders),
        require: true,
    },
    birthdate: {
        type: Date,
        require: false,
    },
    govIdType: {
        type: String,
        enum: Object.values(govIdTypes),
        require: true,
    },
    govId: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    addresses: {
        type: [Address.schema],
        require: false,
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    picture: {
        type: String,
        require: false,
    },
}, {_id: false});

module.exports = mongoose.model("Profile", ProfileSchema);
module.exports.govIdTypes = govIdTypes;
module.exports.genders = genders;