const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

const OUTPUT_FOLDER = path.join(__dirname, "output");

// Increase payload size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
}

app.post("/get-site-data", async (req, res) => {
    const { domain } = req.body;
    const callbackUrl = `http://localhost:${PORT}/receive-site-data`;

    try {
        await axios.post("http://localhost:3000/scrape-async", {
            url: domain,
            callback: callbackUrl,
        });

        res.sendStatus(200);
    } catch (error) {
        console.error("Error getting site data:", error.message);
        res.status(500).send("Error getting site data");
    }
});

app.post("/receive-site-data", (req, res) => {
    try {
        const { html } = req.body;
        const $ = cheerio.load(html);
        const headings = {};

        // To get the title of the HTML document
        const title = $("title").text().trim();
        // Extract the first word from the title
        const firstTwoWords = title.split(/\s+/).slice(0, 2).join("_");

        // Get domain from the referer header
        let domain = "unknown_domain"; // Default value if referer header is not present
        if (req.headers.referer) {
            domain = new URL(req.headers.referer).hostname;
        }

        // Get all headings (h1 to h6)
        for (let i = 1; i <= 6; i++) {
            const heading = `h${i}`;
            headings[heading] = [];
            $(heading).each((index, element) => {
                headings[heading].push($(element).text().trim());
            });
        }

        // Write results to JSON file asynchronously
        const outputFile = path.join(OUTPUT_FOLDER, `${firstTwoWords}.json`);
        fs.writeFile(outputFile, JSON.stringify(headings, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).send("Error writing to file");
            }
            // Only send response once the file has been successfully written
            res.sendStatus(200);
        });
    } catch (error) {
        console.error("Error processing site data:", error.message);
        res.status(500).send("Error processing site data");
    }
});

app.listen(PORT, () => {
    console.log(`Parse server listening at http://localhost:${PORT}`);
});
