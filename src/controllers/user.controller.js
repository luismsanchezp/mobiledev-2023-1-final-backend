const User = require("../models/user.model");
const { userResource } = require("../resources/user.resource");
const { getAuthenticatedUser } = require("../middleware/user.auth");
const { hashPassword } = require("../services/auth/pwd");

async function index(req, res) {
    const params = req.query;
    getAuthenticatedUser(req.headers.authorization)
    .then((user) => {
        if (user.role === User.roles.admin) {
            if (params.active === 'TRUE') {
                User.find({ active: true })
                .then((users) => {
                    res.status(200).send(userResource(users));
                })
                .catch((err) => {
                    res.status(422).send({ error: "Cannot find users. Reason: "});
                    console.debug(err);
                });
            } else {
                User.find()
                .then((users) => {
                    res.status(200).send(userResource(users));
                })
                .catch((err) => {
                    res.status(422).send({ error: "Cannot find users. Reason: "});
                    console.debug(err);
                });
            }
        } else {
            res.status(403).send({ error: "You are not authorized to get all users data." });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
}

async function show(req, res) {
    const params = req.params;
    getAuthenticatedUser(req.headers.authorization)
    .then((user) => {
        if (params.id != user._id && user.role != User.roles.admin) {
            res.status(403).send({ error: "You are not authorized to get this user data." });
        } else {
            User.findById({ _id: params.id })
            .then((user) => {
                if (user === null) {
                    res.status(404).send({ error: "User not found." });
                } else {
                    res.status(200).send(userResource(user));
                }
            })
            .catch((err) => {
                res.status(422).send({ error: "findById failed. ", err});
                console.debug(err);
            });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
}

async function store(req, res) {
    const { email, password } = req.body;
    hashPassword(password)
    .then((hash) => {
        new User({
            email,
            password: hash,
            role: User.roles.student,
            active: true,
        })
        .save()
        .then((user) => {
            res.status(201).send(userResource(user));
            console.debug("User stored.");
        }
        )
        .catch((err) => {
            res.status(500).send({ error: "Server cannot store user."});
            console.debug(err);
        }
        );
    })
    .catch((err) => {
        res.status(500).send({ error: "Server cannot hash password."});
        console.debug(err);
    });
};

async function update(req, res) {
    const params = req.params;
    getAuthenticatedUser(req.headers.authorization)
    .then((user) => {
        if (params.id != user._id && user.role != User.roles.admin) {
            res.status(403).send({ error: "You are not authorized to update this user." });
        } else {
            var dict = {};
            if (req.body.email !== undefined) dict.email = req.body.email;
            if (req.body.password !== undefined) dict.password = req.body.password;
            if (req.body.role !== undefined && user.role === User.roles.admin) dict.role = req.body.role;
            if (req.body.active !== undefined && user.role === User.roles.admin) dict.active = req.body.active;
            
            User.findByIdAndUpdate({ _id: params.id }, dict, { new: true })
            .then((user) => {
                if (user === null) {
                    res.status(404).send({ error: "User not found." });
                } else {
                    res.status(200).send(userResource(user));
                }
            })
            .catch((err) => {
                res.status(422).send({ error: "Cannot update user. Reason: "});
                console.debug(err);
            });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
}

async function destroy(req, res) {
    const params = req.params;
    getAuthenticatedUser(req.headers.authorization)
    .then((user) => {
        if(user.role === User.roles.admin) {
            User.findByIdAndDelete({ _id: params.id })
            .then((user) => {
                if (user === null) {
                    res.status(404).send({ error: "User not found." });
                } else {
                    res.status(200).send(userResource(user));
                }
            })
            .catch((err) => {
                res.status(422).send({ error: "Cannot delete user. Reason: "});
                console.debug(err);
            });
        } else {
            res.status(403).send({ error: "Only admin role can delete users." });
        }
    })
    .catch((err) => {
        //This line should never execute. The ensureAuth middleware should have already
        res.status(500).send({ error: "Cannot get authenticated user: "});
        console.debug(err);
    });
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}