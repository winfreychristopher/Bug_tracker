const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password, email, admin }) {
	const hashPass = bcrypt.hashSync(password, 10);
	try {
		const {
			rows: [user],
		} = await client.query(
			`
      INSERT INTO users(username, password, email, admin)
      VALUES($1, $2, $3, $4)
      ON CONFLICT ( username ) DO NOTHING
      RETURNING *;
    `,
			[username, password, email, admin]
		);
		delete user.password;
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUserByUsername(username) {
	try {
		const {
			rows: [user],
		} = await client.query(
			`
      SELECT *
      FROM users
      WHERE username = $1;
    `,
			[username]
		);
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUserById(id) {
	try {
		const {
			rows: [user],
		} = await client.query(
			`
      SELECT * 
      FROM users
      WHERE id=$1;
    `,
			[id]
		);
		delete user.password;
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUser({ username, password }) {
	try {
		let user = await getUserByUsername(username);
		if (bcrypt.compareSync(password, user.password)) {
			delete user.password;
			return user;
		}
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createUser,
	getUserById,
	getUser,
};
