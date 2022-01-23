const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({ username, password, email, admin }) {
	const hashPass = bcrypt.hashSync(password, SALT_COUNT);
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
			[username, hashPass, email, admin]
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
      WHERE username=$1;
    `,
			[username]
		);
		console.log(user, "getuserbyusername");
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
		console.log(user, "getuserbyid!!!");
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUser({ username, password }) {
	try {
		let user = await getUserByUsername(username);
		console.log(user, "getuserbyusername inside getuser!");
		if (bcrypt.compareSync(password, user.password)) {
			delete user.password;
			console.log(user, "USER@@@");
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
	getUserByUsername,
};
