const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3001 
const axios = require("axios").default;
const express = require("express")
const cors = require("cors");
const { ppid } = require("process");

const app = express()
app.use(cors())
app.use(express.static('public'))

app.listen(PORT, () => console.log("Server running on port: " + PORT))