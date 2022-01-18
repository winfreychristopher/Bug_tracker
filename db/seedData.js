const client = require("./client");
const { createUser } = require("./users");
const { createProject } = require("./projects");
const { createTicket } = require("./tickets");

async function dropTables() {
	try {
		console.log("Dropping All Tables...");
		await client.query(`
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS users;
    `);
		console.log("Finished dropping tables!");
	} catch (error) {
		console.error("Error dropping tables!");
		throw error;
	}
}

async function createTables() {
	try {
		console.log("Starting to build tables...");
		await client.query(`
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        admin BOOLEAN DEFAULT false
      );
      CREATE TABLE projects(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      );
      CREATE TABLE tickets(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        priority VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        "projectId" INTEGER REFERENCES projects(id),
        "assignedId" INTEGER REFERENCES users(id),
        type VARCHAR(255) NOT NULL,
        "creationDate" DATE NOT NULL DEFAULT CURRENT_DATE   
      );
    `);
		console.log("Finshed building tables!");
	} catch (error) {
		console.error("Error building tables!");
		throw error;
	}
}

async function createInitialUsers() {
	console.log("Starting to create users...");
	try {
		const usersToCreate = [
			{
				username: "albert",
				password: "bertie99",
				email: "samsho222@yahoo.com",
			},
			{
				username: "sandra",
				password: "sandra123",
				email: "witwaffle@gmail.com",
			},
			{
				username: "chrisW",
				password: "christopher",
				email: "chrisw@yahoo.com",
				admin: true,
			},
		];
		const users = await Promise.all(usersToCreate.map(createUser));
		console.log("Users Created:");
		console.log(users);
		console.log("Finished created users!");
	} catch (error) {
		console.error("Error creating users!");
		throw error;
	}
}

async function createInitialProjects() {
	try {
		console.log("Starting to create projects...");
		const projectsToCreate = [
			{ name: "Linkerator", description: "is this needed?" },
			{ name: "Strangers Things", description: "Craig copy cat" },
			{ name: "CARDEX", description: "Sigh..." },
		];
		const projects = await Promise.all(projectsToCreate.map(createProject));
		console.log("Projects created:");
		console.log(projects);
		console.log("Finished creating projects!");
	} catch (error) {
		console.error("Error creating projects!");
		throw error;
	}
}

async function createInitialTickets() {
	try {
		console.log("Starting to create tickets...");
		const ticketsToCreate = [
			{
				title: "Front-end looking rough..",
				status: "Open",
				description: "Please add some styling to the following componenets....",
				priority: "Medium",
				comment: "CSS is trash. someone call eman...",
				projectId: 1,
				assignedId: 1,
				type: "CSS/Styling",
			},
			{
				title: "Database needs formating",
				status: "In-progress",
				description:
					"database is a badly formatted and unorganized. Please clean up and check in.",
				priority: "High",
				comment: "why did yall let austin do the DB? smh",
				projectId: 3,
				assignedId: 3,
				type: "Back-end , Formatting",
			},
		];
		const tickets = await Promise.all(ticketsToCreate.map(createTicket));
		console.log("Tickets created:");
		console.log(tickets);
		console.log("Finished creating tickets!");
	} catch (error) {
		console.log("Error creating tickets!");
		throw error;
	}
}

async function rebuildDB() {
	try {
		client.connect();
		await dropTables();
		await createTables();
		await createInitialUsers();
		await createInitialProjects();
		await createInitialTickets();
	} catch (error) {
		console.log("Error during rebuildDB");
		throw error;
	}
}
module.exports = {
	rebuildDB,
};
