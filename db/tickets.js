const client = require("./client");

async function createTicket({
	title,
	status,
	description,
	priority,
	comment,
	projectId,
	assignedId,
	type,
}) {
	try {
		const {
			rows: [ticket],
		} = await client.query(
			`
      INSERT INTO tickets( title, status, description, priority, comment, "projectId", "assignedId", type)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `,
			[
				title,
				status,
				description,
				priority,
				comment,
				projectId,
				assignedId,
				type,
			]
		);
		return ticket;
	} catch (error) {
		throw error;
	}
}

async function getAllTickets() {
	try {
		const { rows } = await client.query(`
      SELECT *
      FROM tickets;
    `);
		return rows;
	} catch (error) {
		throw error;
	}
}

async function getOpenTickets() {
	try {
		const {
			rows: [tickets],
		} = await client.query(`
      SELECT *
      FROM tickets
      WHERE status = "Open"; 
    `);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function getInProgressTickets() {
	try {
		const {
			rows: [tickets],
		} = await client.query(`
      SELECT * 
      FROM tickets
      WHERE status = "In-progress";
    `);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function getClosedTickets() {
	try {
		const {
			rows: [tickets],
		} = await client.query(`
      SELECT * 
      FROM tickets
      WHERE status = "Closed";
    `);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function getTicketsById(id) {
	try {
		const {
			rows: [tickets],
		} = await client.query(
			`
      SELECT * 
      FROM tickets
      WHERE id = $1;
    `,
			[id]
		);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function getTicketsByProjectId(id) {
	try {
		const {
			rows: [tickets],
		} = await client.query(
			`
      SELECT * 
      FROM tickets
      JOIN projects on tickets."projectId" = projects.id
      WHERE "projectId" = $1;
    `,
			[id]
		);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function updateTickets({
	id,
	title,
	status,
	description,
	priority,
	comment,
	projectId,
	assignedId,
	type,
}) {
	const fields = {
		title: title,
		status: status,
		description: description,
		priority: priority,
		comment: comment,
		projectId: projectId,
		assignedId: assignedId,
		type: type,
	};

	if (title === undefined || title === null) {
		delete fields.title;
	}

	if (status === undefined || status === null) {
		delete fields.status;
	}

	if (description === undefined || description === null) {
		delete fields.description;
	}

	if (priority === undefined || priority === null) {
		delete fields.priority;
	}

	if (comment === undefined || comment === null) {
		delete fields.comment;
	}

	if (projectId === undefined || projectId === null) {
		delete fields.projectId;
	}

	if (assignedId === undefined || assigned === null) {
		delete fields.assignedId;
	}

	if (type === undefined || type === null) {
		delete fields.type;
	}

	const setString = Object.keys(fields)
		.map((key, index) => `"${key}"=$${index + 1}`)
		.join(", ");
	if (setString.length === 0) {
		return;
	}

	try {
		const {
			rows: [tickets],
		} = await client.query(
			`
      UPDATE tickets
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
			Object.values(fields)
		);
		return tickets;
	} catch (error) {
		throw error;
	}
}

async function destroyTicket(id) {
	try {
		const {
			rows: [ticket],
		} = await client.query(
			`
      DELETE FROM tickets
      WHERE id=$1
      RETURNING *;
    `,
			[id]
		);
		return ticket;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createTicket,
	getAllTickets,
	getClosedTickets,
	getOpenTickets,
	getTicketsById,
	getTicketsByProjectId,
	getInProgressTickets,
	updateTickets,
	destroyTicket,
};
