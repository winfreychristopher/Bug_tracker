require("dotenv").config();
const express = require("express");
const server = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PORT = 3000 } = process.env;
const client = require("./db/client");

server.use(cors());
server.use(morgan("dev"));
server.use(bodyParser.json());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api", require("./api"));
server.use((error, req, res, next) => {
	console.error("SERVER ERROR:", error);
	if (res.statusCode < 400) {
		res.status(500);
	}
	res.send({
		error: error.message,
		name: error.name,
		message: error.message,
		table: error.table,
	});
});
server.listen(PORT, async () => {
	console.log(`Server is listening on PORT: ${PORT}`);
	try {
		await client.connect();
		console.log("Data is open for business!");
	} catch (error) {
		console.error("Data is closed for repairs!\n", error);
	}
});
