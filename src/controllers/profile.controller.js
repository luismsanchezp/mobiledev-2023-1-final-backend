const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { profileResource } = require("../resources/profile.resource");
const { getAuthenticatedUser } = require("../middleware/user.auth");

async function store(req, res) {
    const params = req.params;
    getAuthenticatedUser(req.headers.authorization)
    .then(async (user) => {
        if (params.id != user._id && user.role != User.roles.admin) {
            res.status(403).send({ error: "You are not authorized to create a profile for this user." });
        } else {
            //Check if user already has profile key
            User.findById({ _id: params.id }, 'profile')
            .then((userEdit) => {
                if (!userEdit.profile) {
                    const {
                        names,
                        lastnames,
                        gender,
                        birthdate,
                        govIdType,
                        govId,
                        phoneNumber,
                        state,
                        city,
                    } = req.body;
                    const profile = new Profile({
                        names,
                        lastnames,
                        gender,
                        birthdate,
                        govIdType,
                        govId,
                        phoneNumber,
                        state,
                        city,
                    });
                    User.findByIdAndUpdate({ _id: params.id }, { profile: profile}, { new: true })
                    .then((user) => {
                        res.status(200).send(profileResource(user.profile));
                    })
                    .catch((err) => {
                        res.status(500).send({ error: "Cannot update user. Reason: "});
                        console.debug(err);
                    });
                } else {
                    res.status(403).send({ error: "User already has profile." });
                }
            })
            .catch((err) => {
                res.status(500).send({ error: "Cannot find user. Reason: "});
                console.debug(err);
            });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
};

async function update(req, res) {
    const params = req.params;
    getAuthenticatedUser(req.headers.authorization)
    .then(async (user) => {
        if (params.id != user._id && user.role != User.roles.admin) {
            res.status(403).send({ error: "You are not authorized to edit a profile for this user." });
        } else {
            //Check if user already has profile key
            User.findById({ _id: params.id }, 'profile')
            .then((userEdit) => {
                console.log();
                if (userEdit.profile) {
                    if (req.body.names) userEdit.profile.names = req.body.names;
                    if (req.body.lastnames) userEdit.profile.lastnames = req.body.lastnames;
                    if (req.body.gender) userEdit.profile.gender = req.body.gender;
                    if (req.body.birthdate) userEdit.profile.birthdate = req.body.birthdate;
                    if (req.body.govIdType) userEdit.profile.govIdType = req.body.govIdType;
                    if (req.body.govId) userEdit.profile.govId = req.body.govId;
                    if (req.body.phoneNumber) userEdit.profile.phoneNumber = req.body.phoneNumber;
                    if (req.body.state) userEdit.profile.state = req.body.state;
                    if (req.body.city) userEdit.profile.city = req.body.city;

                    User.findByIdAndUpdate({ _id: params.id }, { profile: userEdit.profile }, { new: true })
                    .then((user) => {
                        res.status(200).send(profileResource(user.profile));
                    })
                    .catch((err) => {
                        res.status(500).send({ error: "Cannot update user. Reason: "});
                        console.debug(err);
                    });
                } else {
                    res.status(403).send({ error: "User does not have profile." });
                }
            })
            .catch((err) => {
                res.status(500).send({ error: "Cannot find user. Reason: "});
                console.debug(err);
            });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
};

module.exports = {
    store,
    update,
}