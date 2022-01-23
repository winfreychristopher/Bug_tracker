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
		console.log(token, "TOKENN#@");

		try {
			const { id } = jwt.verify(token, JWT_SECRET);
			console.log(id, "ID!!!");
			if (id) {
				console.log(id, "checking!");
				req.user = await getUserById(id);
				console.log(req.user, "!!!!!!!");
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

const usersRouter = require("./users");
const projectsRouter = require("./project");

apiRouter.use("/users", usersRouter);
apiRouter.use("/projects", projectsRouter);

apiRouter.use((error, req, res, next) => {
	res.send(error);
});

module.exports = apiRouter;
