const {
	createUser,
	getUser,
	getUserByUsername,
	getTicketsByUserId,
} = require("../db");
const express = require("express");
const usersRouter = express.Router();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

usersRouter.use((req, res, next) => {
	console.log("A request is being made to /users");

	next();
});

usersRouter.post("/register", async (req, res, next) => {
	const { username, password, email } = req.body;

	try {
		const _user = await getUserByUsername(username);

		if (_user) {
			res.status(401);
			next({
				name: "UserAlreadyExits",
				message: "A user by that username already exists",
			});
		} else {
			const newUser = await createUser({
				username,
				password,
				email,
			});
			if (!newUser) {
				next({
					name: "UserCreationError",
					message: "Error during registration!",
				});
			} else {
				const token = jwt.sign(
					{ id: newUser.id, username: newUser.username },
					JWT_SECRET,
					{ expiresIn: "1w" }
				);
				console.log(token, "TOKEN!!!");
				res.send({
					message: "Thank you for signing up",
					token,
					user: newUser,
				});
			}
		}
	} catch ({ name, message }) {
		next({ name, message });
	}
});

usersRouter.post("/login", async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const user = await getUser({ username, password });
		console.log(user, "USER!!!!");
		const token = jwt.sign(
			{ id: user.id, username: user.username },
			JWT_SECRET,
			{ expiresIn: "1w" }
		);
		console.log(token, "TOKEN!!!");

		res.send({ message: "You're Logged In!", token, user: user });
	} catch (error) {
		throw error;
	}
});

usersRouter.get("/:username/tickets", async (req, res, next) => {
	const { username } = req.params;

	try {
		const user = await getUserByUsername(username);
		const tickets = await getTicketsByUserId(user.id);
		if (!tickets) {
			next({
				name: "No Tickets Found",
				message: "No assinged tickets available",
			});
		} else {
			res.send(tickets);
		}
	} catch ({ name, message }) {
		next({ name, message });
	}
});

module.exports = usersRouter;
