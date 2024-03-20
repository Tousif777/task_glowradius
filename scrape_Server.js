// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.SCRAPE_PORT || 3000;
const URL = process.env.URL || "http://localhost";

app.use(bodyParser.json());

app.post("/scrape-async", async (req, res) => {
    const { url, callback } = req.body;

    // Immediately respond with 200
    res.sendStatus(200);

    try {
        const response = await axios.get(url);
        const html = response.data;

        // Send HTML string to callback URL
        try {
            await axios.post(callback, { html });
        } catch (callbackError) {
            console.error("Error sending data to callback:", callbackError.message);
            res.status(500).send("Error sending data to callback");
        }
    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).send("Error scraping the URL");
    }
});

app.listen(PORT, () => {
    console.log(`Scrape server listening at ${URL}:${PORT}`);
});
