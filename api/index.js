const express = require("express");
const apiRouter = express.Router();
const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

apiRouter.get("/health", async (req, res, next) => {
	try {
		console.log("All is well");
		res.send({ message: "All is well" });
	} catch (error) {
		console.error(error);
	}
});

apiRouter.use(async (req, res, next) => {
	const prefix = "Bearer ";
	const auth = req.header("Authorization");

	if (!auth) {
		next();
	} else if (auth.startsWith(prefix)) {
		const token = auth.slice(prefix.length);

		try {
			const { id } = jwt.verify(token, JWT_SECRET);
			if (id) {
				req.user = await getUserById(id);
				next();
			}
		} catch ({ name, message }) {
			next({ name, message });
		}
	} else {
		next({
			name: "AuthorizationHeaderError",
			message: `Authorization token must start with ${prefix}`,
		});
	}
});

apiRouter.use((req, res, next) => {
	if (req.user) {
		console.log("User is set:", req.user);
	}
	next();
});

module.exports = apiRouter;
