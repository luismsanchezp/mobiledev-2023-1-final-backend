const { resource } = require("./resource");
const { profileResource } = require("./profile.resource");

const userResource = (data) => {
    return resource(data, (data) => {
        return {
            id: data._id,
            email: data.email,
            role: data.role,
            active: data.active,
            profile: (data.profile) ? profileResource(data.profile).data : null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    });
}
module.exports = { userResource };