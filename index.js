const mongoose = require("mongoose");
const app = require("./app");

const { 
    API_VERSION,
    HOST_IP,
    HOST_PORT
} = require("./config");
const { 
    DB_NAME, 
    DB_USER, 
    DB_PASSWORD, 
    DB_SERVER_IP, 
    DB_PORT 
} = require("./config");

async function connectToDatabase() {
    const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_SERVER_IP}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority`;
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        // Make the appropriate DB calls
        console.log("Connected to MongoDB database");
        app.listen(HOST_PORT, () => {
            console.log("Server running on: ");
            console.log(`   http://${HOST_IP}:${HOST_PORT}/api/${API_VERSION}/`)
        });

    } catch (e) {
        console.error(e);
    }
}

connectToDatabase().catch(console.error);