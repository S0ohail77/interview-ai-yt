require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const dns = require("dns")


dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port = process.env.PORT || 3000

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((error) => {
        console.error(`Failed to start the backend: ${error.name || "database connection error"}`)
        process.exitCode = 1
    })
