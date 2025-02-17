const config = require('./dbconfig');
const sql = require('mysql2/promise');

let pool = sql.createPool(config);

async function selectTermek() {
    try { 
        const [rows] = await pool.query('select * from beer_database');
        return rows;
    } catch (error) {
        throw error;
    } 
}

async function selectCard() {
    try { 
        const [rows] = await pool.query('select Name, Price FROM beer_database');
        return rows;
    } catch (error) {
        throw error;
    } 
}

async function selectUser (name, password) {
    console.log('Querying user with:', { name, password }); // Log the input values
    const query = 'SELECT * FROM buyer WHERE name = ? AND password = ?';
    const [result] = await pool.query(query, [name, password]); // Use pool.query instead of db.execute

    return result.length > 0 ? result[0] : null;
}

async function insertUser (name, email, password) {
    const query = 'INSERT INTO buyer (name, password, email) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, password]);
    return result;
}

async function updateUser (userId, mobile, countryaddress, cityaddress, streetaddress, houseaddress) {
    const query = `
        UPDATE buyer 
        SET mobile = ?, countryaddress = ?, cityaddress = ?, streetaddress = ?, houseaddress = ? 
        WHERE bid = ?;
    `;
    const [result] = await pool.query(query, [mobile, countryaddress, cityaddress, streetaddress, houseaddress, userId]);
    return result;
}

async function selectUserById(userId) {
    const query = 'SELECT mobile, countryaddress, cityaddress, streetaddress, houseaddress FROM buyer WHERE bid = ?';
    const [result] = await pool.query(query, [userId]);

    return result.length > 0 ? result[0] : null; // Return the user data or null if not found
}

module.exports = {
    selectTermek,
    selectCard,
    selectUser ,
    insertUser ,
    updateUser ,
    selectUserById
}