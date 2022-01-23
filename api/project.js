const express = require("express");
const projectsRouter = express.Router();
const { requireUser } = require("./utils");
const { createProject, getAllProjects, destroyProject } = require("../db");

projectsRouter.use((req, res, next) => {
	console.log("A request is being made to /projects");

	next();
});

projectsRouter.get("/", async (req, res, next) => {
	try {
		const projects = await getAllProjects();
		res.send(projects);
	} catch (error) {
		next(error);
	}
});

projectsRouter.post("/", requireUser, async (req, res, next) => {
	const { name, description } = req.body;

	try {
		const project = await createProject({
			name,
			description,
		});
		res.send(project);
	} catch (error) {
		next(error);
	}
});

module.exports = projectsRouter;
