const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./../db');
const constant = require('./../Constant');
class UserController {
  constructor() { }
  userRegistration(data) {
    return new Promise(async (done, reject) => {

      const { username, email, password, role } = data;
      try {
        //performing hashing for security
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
          'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
          [username, email, hashedPassword, role]
        );

        const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, process.env.JWT_SECRET);
        done(token);
      } catch (error) {
        return reject(constant.INVALID_INPUT);
      }
    })
  }
  userLogin(data) {
    return new Promise(async (done, reject) => {
      const { email, password } = data;

      try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
          console.log('length');
          return reject('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
          return reject('Invalid Password');
        }

        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET,  { expiresIn: '24h' }  );
        done(token);
      } catch (error) {
        return reject(constant.INVALID_INPUT);
      }
    })

  }
}

module.exports = UserController;