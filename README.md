
Project Name: Web Scraping with Node.js

Description:
This project demonstrates how to scrape data from websites using Node.js, Express, Axios, Cheerio, and environment variables management with the dotenv package. It consists of two main components: a parse server and a scrape server. The parse server receives a domain from the client, sends a request to the scrape server to fetch the HTML content of the specified URL asynchronously, processes the received HTML content to extract headings, and saves the extracted data into JSON files. The scrape server listens for incoming requests from the parse server, fetches the HTML content of the specified URL, and sends the HTML content back to the parse server.

Features:

Scrapes data from websites asynchronously.
Extracts headings (h1 to h6) from the HTML content.
Saves the extracted data into JSON files.
Supports environment variables for configuration.
Installation:

Clone the repository.
Navigate to the project directory.
Run npm install to install dependencies.
Create a .env file in the root directory and specify the following variables:
makefile
Copy code
PARSE_PORT=4000
SCRAPE_PORT=3000
URL=http://localhost
Usage:

Start the scrape server by running node scrape_server.js in the terminal.
Start the parse server by running node parse_server.js in the terminal.
Send a POST request to the parse server with the domain to scrape using a tool like cURL or Postman:
bash
Copy code
curl -X POST -H "Content-Type: application/json" -d '{"domain": "https://example.com"}' http://localhost:4000/get-site-data
Configuration:

PARSE_PORT: Port for the parse server. Default is 4000.
SCRAPE_PORT: Port for the scrape server. Default is 3000.
URL: Base URL for the servers. Default is http://localhost.
