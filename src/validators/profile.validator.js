const { check, validationResult } = require("express-validator");
const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const City = require("../models/city.model");
const State = require("../models/state.model");

const validateProfileStore = [
    check("id", "id field must be a valid ObjectId").isMongoId(),
    check("id", "user with id does not exist").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.id })
                if (user === null) {
                    return Promise.reject("user with id does not exist");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("names", "names field is required").exists(),
    check("names", "names field must be a string").isString(),
    check("names", "names field cannot be empty").not().isEmpty(),

    check("lastnames", "lastnames field is required").exists(),
    check("lastnames", "lastnames field must be a string").isString(),
    check("lastnames", "lastnames field cannot be empty").not().isEmpty(),

    check("gender", "gender field is required").exists(),
    check("gender", "gender field must be a string").isString(),
    check("gender", "gender field must be only 10 characters").isLength({ min: 4, max: 10 }),
    check("gender", "gender field must be within the options").isIn(Object.values(Profile.genders)),

    check("birthdate", "birthdate field is required").exists(),
    check("birthdate", "birthdate field must be a string").isString(),
    check("birthdate", "birthdate field must be a date").isDate(),

    check("govIdType", "govIdType field is required").exists(),
    check("govIdType", "govIdType field must be a string").isString(),
    check("govIdType", "govIdType field must be only 10 characters").isLength({ min: 4, max: 10 }),
    check("govIdType", "govIdType field must be within the options").isIn(Object.values(Profile.govIdTypes)),

    check("govId", "govId field is required").exists(),
    check("govId", "govId field must be a string").isString(),
    check("govId", "govId field must be only 10 characters").isLength({ min: 10, max: 10 }),
    check("govId", "govId field must be a number").isNumeric(),
    check("govId").custom(
        async (value, { req, loc, path }) => {
            try {
                const prfl = await User.exists({ "profile.govId": req.body.govId })
                if (prfl !== null) {
                    return Promise.reject("govId is already registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("phoneNumber", "phoneNumber field is required").exists(),
    check("phoneNumber", "phoneNumber field must be a string").isString(),
    check("phoneNumber", "phoneNumber field must be only 10 characters").isLength({ min: 10, max: 10 }),
    check("phoneNumber", "phoneNumber field must be a number").isNumeric(),
    check("phoneNumber").custom(
        async (value, { req, loc, path }) => {
            try {
                const prfl = await User.exists({ "profile.phoneNumber": req.body.phoneNumber })
                if (prfl !== null) {
                    return Promise.reject("phoneNumber is already registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("state", "state field is required").exists(),
    check("state", "state field must be a string").isString(),
    check("state", "state field cannot be empty").not().isEmpty(),
    check("state").custom(
        async (value, { req, loc, path }) => {
            try {
                const state = await State.exists({ name: req.body.state })
                if (state === null) {
                    return Promise.reject("state is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("city", "city field is required").exists(),
    check("city", "city field must be a string").isString(),
    check("city", "city field cannot be empty").not().isEmpty(),
    check("city").custom(
        async (value, { req, loc, path }) => {
            try {
                const city = await City.exists({ name: req.body.city })
                if (city === null) {
                    return Promise.reject("city is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),
    check("city").custom(
        async (value, { req, loc, path }) => {
            try {
                const stateName = req.body.state; // Nombre del estado en la solicitud
                const cityName = value; // Nombre de la ciudad en la solicitud
                const state = await State.findOne({ name: stateName });

                if (!state) {
                    return Promise.reject("El estado especificado no existe");
                }

                const city = await City.findOne({
                    name: cityName,
                    stateCode: state.code,
                });

                if (!city) {
                    return Promise.reject("La ciudad especificada no existe");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateProfileUpdate = [
    check("id", "id field must be a valid ObjectId").isMongoId(),
    check("id", "user with id does not exist").custom(
        async (value, { req, loc, path }) => {
            try {
                const user = await User.exists({ _id: req.params.id })
                if (user === null) {
                    return Promise.reject("user with id does not exist");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ),

    check("names", "names field must be a string").isString().optional(),
    check("names", "names field cannot be empty").not().isEmpty().optional(),

    check("lastnames", "lastnames field must be a string").isString().optional(),
    check("lastnames", "lastnames field cannot be empty").not().isEmpty().optional(),

    check("gender", "gender field must be a string").isString().optional(),
    check("gender", "gender field must be only 10 characters").isLength({ min: 4, max: 10 }).optional(),
    check("gender", "gender field must be within the options").isIn(Object.values(Profile.genders)).optional(),

    check("birthdate", "birthdate field must be a string").isString().optional(),
    check("birthdate", "birthdate field must be a date").isDate().optional(),

    check("govIdType", "govIdType field must be a string").isString().optional(),
    check("govIdType", "govIdType field must be only 10 characters").isLength({ min: 4, max: 10 }).optional(),
    check("govIdType", "govIdType field must be within the options").isIn(Object.values(Profile.govIdTypes)).optional(),

    check("govId", "govId field must be a string").isString().optional(),
    check("govId", "govId field must be only 10 characters").isLength({ min: 10, max: 10 }).optional(),
    check("govId", "govId field must be a number").isNumeric().optional(),
    check("govId").custom(
        async (value, { req, loc, path }) => {
            try {
                const prfl = await User.exists({ "profile.govId": req.body.govId })
                if (prfl !== null) {
                    return Promise.reject("govId is already registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),

    check("phoneNumber", "phoneNumber field must be a string").isString().optional(),
    check("phoneNumber", "phoneNumber field must be only 10 characters").isLength({ min: 10, max: 10 }).optional(),
    check("phoneNumber", "phoneNumber field must be a number").isNumeric().optional(),
    check("phoneNumber").custom(
        async (value, { req, loc, path }) => {
            try {
                const prfl = await User.exists({ "profile.phoneNumber": req.body.phoneNumber })
                if (prfl !== null) {
                    return Promise.reject("phoneNumber is already registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),

    check("state", "state field must be a string").isString().optional(),
    check("state", "state field cannot be empty").not().isEmpty().optional(),
    check("state").custom(
        async (value, { req, loc, path }) => {
            try {
                const state = await State.exists({ name: req.body.state })
                if (state === null) {
                    return Promise.reject("state is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),

    check("city", "city field must be a string").isString().optional(),
    check("city", "city field cannot be empty").not().isEmpty().optional(),
    check("city").custom(
        async (value, { req, loc, path }) => {
            try {
                const city = await City.exists({ name: req.body.city })
                if (city === null) {
                    return Promise.reject("city is not registered");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),
    check("city").custom(
        async (value, { req, loc, path }) => {
            try {
                const stateName = req.body.state; // Nombre del estado en la solicitud
                const cityName = value; // Nombre de la ciudad en la solicitud
                const state = await State.findOne({ name: stateName });

                if (!state) {
                    return Promise.reject("El estado especificado no existe");
                }

                const city = await City.findOne({
                    name: cityName,
                    stateCode: state.code,
                });

                if (!city) {
                    return Promise.reject("La ciudad especificada no existe");
                }
            } catch (error) {
                // Handle the error
                console.error("An error occurred:", error);
                // You can choose to return a rejection or handle the error differently
                return Promise.reject("DB error");
            }
        }
    ).optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateProfileStore,
    validateProfileUpdate
};