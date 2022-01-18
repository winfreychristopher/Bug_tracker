const client = require("./client");

async function createProject({ name, description }) {
	try {
		const {
			rows: [project],
		} = await client.query(
			`
      INSERT INTO projects(name, description)
      VALUES($1, $2)
      RETURNING *;
    `,
			[name, description]
		);
		return project;
	} catch (error) {
		throw error;
	}
}

async function getAllProjects() {
	try {
		const { rows } = await client.query(`
      SELECT *
      FROM projects;
    `);
		return rows;
	} catch (error) {
		throw error;
	}
}

async function getProjectById(id) {
	try {
		const {
			rows: [project],
		} = await client.query(
			`
      SELECT *
      FROM projects
      WHERE id = $1;    
    `,
			[id]
		);
		return project;
	} catch (error) {
		throw error;
	}
}

async function destroyProject(id) {
	try {
		const {
			rows: [project],
		} = await client.query(
			`
      DELET FROM projects
      WHERE id = $1
      RETURNING *;    
    `,
			[id]
		);
		return project;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createProject,
	getAllProjects,
	getProjectById,
	destroyProject,
};
